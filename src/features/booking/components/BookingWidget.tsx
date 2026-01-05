import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { formatDateISO, getNextDays, formatDisplayDate } from '@/lib/date';
import { getBookedSlots, createBooking } from '../api/venue';
import type { VenueResponse, CourtResponse } from '@/types/backend';
import { Loader2, CheckCircle2, AlertCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface BookingWidgetProps {
  venue: VenueResponse;
}

export const BookingWidget = ({ venue }: BookingWidgetProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // 1. State: Date & Court
  const next7Days = useMemo(() => getNextDays(7), []);
  const [selectedDate, setSelectedDate] = useState<Date>(next7Days[0]);
  const [selectedCourt, setSelectedCourt] = useState<CourtResponse | null>(venue.courts?.[0] || null);
  
  // 2. State: Slots
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // ["16:00", "17:00"]
  const [error, setError] = useState<string | null>(null);

  // 3. Query: Booked Slots
  const { data: bookedSlots = [], isFetching: isLoadingSlots } = useQuery({
    queryKey: ['booked-slots', selectedCourt?.id, formatDateISO(selectedDate)],
    queryFn: () => selectedCourt ? getBookedSlots(selectedCourt.id, formatDateISO(selectedDate)) : Promise.resolve([]),
    enabled: !!selectedCourt,
  });

  // 4. Logic: Generate Time Slots
  const timeSlots = useMemo(() => {
    if (!venue.openTime || !venue.closeTime) return [];
    const start = parseInt(venue.openTime.split(':')[0]);
    const end = parseInt(venue.closeTime.split(':')[0]);
    
    return Array.from({ length: end - start }, (_, i) => {
      const hour = start + i;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
  }, [venue.openTime, venue.closeTime]);

  // 5. Interaction: Toggle Slot
  const handleToggleSlot = (slot: string) => {
    if (bookedSlots.includes(slot)) return;
    setError(null);

    let newSlots = [...selectedSlots];
    if (newSlots.includes(slot)) {
      newSlots = newSlots.filter(s => s !== slot);
    } else {
      newSlots.push(slot);
    }

    // Sort slots to check continuity
    newSlots.sort();
    setSelectedSlots(newSlots);

    // Validate Continuity
    if (newSlots.length > 1) {
      for (let i = 0; i < newSlots.length - 1; i++) {
        const current = parseInt(newSlots[i].split(':')[0]);
        const next = parseInt(newSlots[i+1].split(':')[0]);
        if (next !== current + 1) {
          setError("Vui lòng chọn các khung giờ liên tiếp nhau.");
          return;
        }
      }
    }
  };

  // 6. Logic: Submit
  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      alert("Đặt sân thành công!");
      // Reset or Redirect
      setSelectedSlots([]);
    },
    onError: (err: any) => {
      setError(err.message || "Đặt sân thất bại. Vui lòng thử lại.");
    }
  });

  const handleSubmit = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!selectedCourt || selectedSlots.length === 0 || error) return;

    // Calculate Start/End Time
    const dateStr = formatDateISO(selectedDate);
    const sortedSlots = [...selectedSlots].sort();
    
    const startSlot = sortedSlots[0]; // "16:00"
    const endSlot = sortedSlots[sortedSlots.length - 1]; // "17:00" if 2 hours selected
    
    const endHour = parseInt(endSlot.split(':')[0]) + 1;
    
    // ISO Format: YYYY-MM-DDTHH:mm:ss
    const startTime = `${dateStr}T${startSlot}:00`;
    const endTime = `${dateStr}T${endHour.toString().padStart(2, '0')}:00:00`;

    bookingMutation.mutate({
      courtId: selectedCourt.id,
      startTime,
      endTime,
      paymentMethod: 'VNPAY'
    });
  };

  // 7. Calculate Price
  const totalPrice = useMemo(() => {
    if (!selectedCourt) return 0;
    return selectedSlots.length * selectedCourt.pricePerHour;
  }, [selectedSlots, selectedCourt]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-primary" />
          Đặt lịch ngay
        </h3>
        <p className="text-sm text-gray-500 mt-1">Chọn ngày và giờ bạn muốn chơi.</p>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        {/* Date Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Ngày</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {next7Days.map((date) => {
              const isActive = formatDateISO(date) === formatDateISO(selectedDate);
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => { setSelectedDate(date); setSelectedSlots([]); }}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[70px] h-[70px] rounded-xl border transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white border-primary shadow-md transform scale-105" 
                      : "bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  )}
                >
                  <span className="text-xs font-medium opacity-80">{date.getDate()}/{date.getMonth() + 1}</span>
                  <span className="text-sm font-bold mt-1">
                    {date.getDay() === 0 ? 'CN' : `T${date.getDay() + 1}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Court Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sân</label>
          <div className="grid grid-cols-3 gap-2">
            {venue.courts?.map((court) => (
              <button
                key={court.id}
                onClick={() => { setSelectedCourt(court); setSelectedSlots([]); }}
                className={cn(
                  "py-2 px-3 text-sm rounded-lg border font-medium transition-all text-center truncate",
                  selectedCourt?.id === court.id
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                )}
              >
                {court.name}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots */}
        <div className="mb-2">
           <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Khung giờ</label>
              <div className="flex gap-4 text-xs">
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white border"></div> Trống</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-primary"></div> Chọn</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100"></div> Đã đặt</div>
              </div>
           </div>
           
           {isLoadingSlots ? (
             <div className="h-40 flex items-center justify-center text-gray-400">
               <Loader2 className="animate-spin w-6 h-6" />
             </div>
           ) : (
             <div className="grid grid-cols-4 gap-2">
               {timeSlots.map((slot) => {
                 const isBooked = bookedSlots.includes(slot);
                 const isSelected = selectedSlots.includes(slot);
                 return (
                   <button
                     key={slot}
                     disabled={isBooked}
                     onClick={() => handleToggleSlot(slot)}
                     className={cn(
                       "py-2.5 text-sm font-medium rounded-lg border transition-all",
                       isBooked
                         ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed decoration-slice"
                         : isSelected
                           ? "bg-primary text-white border-primary shadow-sm ring-2 ring-primary/20"
                           : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                     )}
                   >
                     {slot}
                   </button>
                 );
               })}
             </div>
           )}
           
           {/* Error Message */}
           {error && (
             <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
               <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
               <span>{error}</span>
             </div>
           )}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-sm">Tổng cộng</span>
          <div className="text-right">
            <div className="text-xl font-extrabold text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </div>
            <div className="text-xs text-gray-500">
              {selectedSlots.length} giờ chơi
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={bookingMutation.isPending || selectedSlots.length === 0 || !!error}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
            bookingMutation.isPending || selectedSlots.length === 0 || !!error
              ? "bg-gray-300 cursor-not-allowed shadow-none"
              : "bg-primary hover:bg-green-700 hover:shadow-xl active:scale-[0.98]"
          )}
        >
           {bookingMutation.isPending && <Loader2 className="animate-spin w-5 h-5" />}
           {user ? 'Xác nhận & Thanh toán' : 'Đăng nhập để đặt sân'}
        </button>
      </div>
    </div>
  );
};