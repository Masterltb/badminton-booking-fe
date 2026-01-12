import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';
import { formatDateISO, getNextDays } from '@/lib/date';
import { createBooking, createBookingSchedule } from '../api/venue';
import { getMyWallet } from '@/features/wallet/api/wallet';
import type { VenueResponse, CourtResponse } from '@/types/backend';
import { PaymentMethod } from '@/types/enums';
import { Loader2, AlertCircle, Calendar as CalendarIcon, CreditCard, Repeat, Clock } from 'lucide-react';

interface BookingWidgetProps {
  venue: VenueResponse;
}

export const BookingWidget = ({ venue }: BookingWidgetProps) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // Tab State
  const [bookingType, setBookingType] = useState<'SINGLE' | 'FIXED'>('SINGLE');

  // Recurring State
  const [fixedStartDate, setFixedStartDate] = useState<string>('');
  const [fixedEndDate, setFixedEndDate] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [fixedStartTime, setFixedStartTime] = useState<string>('18:00');
  const [fixedEndTime, setFixedEndTime] = useState<string>('20:00');

  const DAYS_OF_WEEK = [
    { value: 'MONDAY', label: 'T2' },
    { value: 'TUESDAY', label: 'T3' },
    { value: 'WEDNESDAY', label: 'T4' },
    { value: 'THURSDAY', label: 'T5' },
    { value: 'FRIDAY', label: 'T6' },
    { value: 'SATURDAY', label: 'T7' },
    { value: 'SUNDAY', label: 'CN' },
  ];

  // 0. Data: Wallet
  const { data: wallet, isLoading: isLoadingWallet } = useQuery({
    queryKey: ['wallet-me'],
    queryFn: getMyWallet,
    enabled: !!user,
  });

  // 1. State: Date & Court & Payment
  const next7Days = useMemo(() => getNextDays(7), []);
  const [selectedDate, setSelectedDate] = useState<Date>(next7Days[0]);
  const [selectedCourt, setSelectedCourt] = useState<CourtResponse | null>(venue.courts?.[0] || null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.WALLET);
  
  // 2. State: Slots
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]); // ["16:00", "17:00"]
  const [error, setError] = useState<string | null>(null);

  // --- Logic for Fixed Booking Calculation ---
  const fixedTotalSessions = useMemo(() => {
    if (!fixedStartDate || !fixedEndDate || selectedDays.length === 0) return 0;
    const start = new Date(fixedStartDate);
    const end = new Date(fixedEndDate);
    let count = 0;
    
    // Simple Loop to count days
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
       const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
       if (selectedDays.includes(dayName)) {
           count++;
       }
    }
    return count;
  }, [fixedStartDate, fixedEndDate, selectedDays]);

  const fixedHoursPerSession = useMemo(() => {
     const start = parseInt(fixedStartTime.split(':')[0]);
     const end = parseInt(fixedEndTime.split(':')[0]);
     return Math.max(0, end - start);
  }, [fixedStartTime, fixedEndTime]);

  const fixedTotalPrice = useMemo(() => {
     if (!selectedCourt) return 0;
     return fixedTotalSessions * fixedHoursPerSession * selectedCourt.pricePerHour;
  }, [fixedTotalSessions, fixedHoursPerSession, selectedCourt]);

  // --- End Logic for Fixed Booking ---

  // 3. Logic: Booked Slots from Venue Data
  const bookedSlots = useMemo(() => {
    if (!selectedCourt || !selectedCourt.occupiedSlots) return [];
    
    const targetDateStr = formatDateISO(selectedDate); // YYYY-MM-DD
    
    // Filter slots for the selected date
    const slotsForDate = selectedCourt.occupiedSlots.filter(slot => 
      slot.startTime.startsWith(targetDateStr)
    );

    // Convert ISO ranges to simple hour strings ["16:00", "17:00"]
    const busyHours: string[] = [];
    slotsForDate.forEach(slot => {
        const startT = slot.startTime.split('T')[1];
        const endT = slot.endTime.split('T')[1];
        
        const startH = parseInt(startT.substring(0, 2));
        let endH = parseInt(endT.substring(0, 2));
        
        // If minutes > 0, it occupies the next hour block too (e.g. 16:30 end means 16:00-17:00 is busy? No, usually slot based)
        // But here we deal with fixed hour slots. If booking ends at 23:59, it occupies 23:00-24:00.
        const endM = parseInt(endT.substring(3, 5));
        if (endM > 0) endH += 1;
        
        for (let h = startH; h < endH; h++) {
            busyHours.push(`${h.toString().padStart(2, '0')}:00`);
        }
    });
    
    return busyHours;
  }, [selectedCourt, selectedDate]);

  // 4. Logic: Generate Time Slots
  const timeSlots = useMemo(() => {
    if (!venue?.openTime || !venue?.closeTime) return [];
    try {
      const start = parseInt(venue.openTime.split(':')[0]);
      let end = parseInt(venue.closeTime.split(':')[0]);
      
      const closeMinutes = parseInt(venue.closeTime.split(':')[1] || '0');
      const closeSeconds = parseInt(venue.closeTime.split(':')[2] || '0');
      
      if (closeMinutes > 0 || closeSeconds > 0) {
          end += 1;
      }
      
      if (isNaN(start) || isNaN(end)) return [];

      return Array.from({ length: end - start }, (_, i) => {
        const hour = start + i;
        return `${hour.toString().padStart(2, '0')}:00`;
      });
    } catch (e) {
      console.error("Error parsing venue time:", e);
      return [];
    }
  }, [venue.openTime, venue.closeTime]);

  // End Time Slots for Fixed Booking (must include the closing hour)
  const endTimeSlots = useMemo(() => {
     if (timeSlots.length === 0) return [];
     const lastSlot = timeSlots[timeSlots.length - 1];
     const lastHour = parseInt(lastSlot.split(':')[0]);
     const nextHour = lastHour + 1;
     return [...timeSlots, `${nextHour.toString().padStart(2, '0')}:00`];
  }, [timeSlots]);

  const morningSlots = timeSlots.filter(t => parseInt(t.split(':')[0]) < 12);
  const afternoonSlots = timeSlots.filter(t => parseInt(t.split(':')[0]) >= 12);
  
  // Filter for End Time Select
  const endMorningSlots = endTimeSlots.filter(t => parseInt(t.split(':')[0]) <= 12 && parseInt(t.split(':')[0]) > 0);
  const endAfternoonSlots = endTimeSlots.filter(t => parseInt(t.split(':')[0]) > 12);

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

    // Sort slots
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

  // 7. Calculate Price (SINGLE)
  const singleTotalPrice = useMemo(() => {
    if (!selectedCourt) return 0;
    return selectedSlots.length * selectedCourt.pricePerHour;
  }, [selectedSlots, selectedCourt]);

  // Unified Total Price
  const totalPrice = bookingType === 'SINGLE' ? singleTotalPrice : fixedTotalPrice;

  // Derived State for UI
  const balance = wallet?.balance || 0;
  const isInsufficientBalance = 
      paymentMethod === PaymentMethod.WALLET && 
      !isLoadingWallet && 
      balance < totalPrice;

  // 6. Logic: Submit (Single)
  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
       console.log("Booking created:", data);
       // Cast to any because paymentUrl/paymentRef might not be in the strict type yet
       const responseData = data as any;
       
       if (data.paymentMethod === PaymentMethod.VNPAY && (responseData.paymentUrl || responseData.paymentRef)) {
          // Redirect to external/mock payment gateway
          window.location.href = responseData.paymentUrl || responseData.paymentRef;
       } else {
          // Internal Wallet Payment Flow
          navigate(`/payment/${data.id}`);
       }
    },
    onError: (err: any) => {
      if (err.status === 409) {
          setError("Khung giờ này vừa bị đặt bởi người khác. Vui lòng chọn giờ khác.");
      } else {
          setError(err.message || "Đặt sân thất bại. Vui lòng thử lại.");
      }
    }
  });

  // Logic: Submit (Fixed)
  const fixedBookingMutation = useMutation({
    mutationFn: createBookingSchedule,
    onSuccess: (data) => {
       // Since it returns a list of bookings, maybe just redirect to first one or a summary page
       // For now, redirect to My Bookings or the first payment if bulk payment not implemented fully
       // Requirement says "Payment: Thanh toán một lần cho toàn bộ".
       // Assuming backend handles bulk payment creation or we redirect to a bulk payment page.
       // Let's assume it returns bookings and we pay for the group or redirect to My Bookings.
       navigate('/my-bookings'); 
       // Ideally: navigate(`/payment-bulk/${groupId}`) if API supported it.
    },
    onError: (err: any) => {
       setError(err.message || "Đặt lịch cố định thất bại.");
    }
  });

  const handleSubmit = () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!selectedCourt || error) return;

    // VNPAY or Wallet with enough balance -> Proceed
    if (isInsufficientBalance) {
        const missing = totalPrice - balance;
        navigate(`/deposit?amount=${missing}`);
        return;
    }

    if (bookingType === 'SINGLE') {
        if (selectedSlots.length === 0) return;
        // Calculate Start/End Time
        const dateStr = formatDateISO(selectedDate);
        const sortedSlots = [...selectedSlots].sort();
        
        const startSlot = sortedSlots[0]; 
        const endSlot = sortedSlots[sortedSlots.length - 1]; 
        
        const endHour = parseInt(endSlot.split(':')[0]) + 1;
        
        // ISO Format: YYYY-MM-DDTHH:mm:ss
        const startTime = `${dateStr}T${startSlot}:00`;
        let endTimeStr = `${endHour.toString().padStart(2, '0')}:00:00`;
        if (endHour === 24) {
             endTimeStr = "23:59:59";
        }
        const endTime = `${dateStr}T${endTimeStr}`;

        bookingMutation.mutate({
          courtId: selectedCourt.id,
          startTime,
          endTime,
          paymentMethod
        });
    } else {
        // FIXED
        if (!fixedStartDate || !fixedEndDate || selectedDays.length === 0) {
            setError("Vui lòng nhập đầy đủ thông tin lịch cố định.");
            return;
        }
        if (fixedHoursPerSession <= 0) {
            setError("Giờ kết thúc phải sau giờ bắt đầu.");
            return;
        }

        const formattedFixedEndTime = fixedEndTime.startsWith('24') ? '23:59:59' : `${fixedEndTime}:00`;

        fixedBookingMutation.mutate({
            courtId: selectedCourt.id,
            startTime: `${fixedStartTime}:00`, // HH:mm:ss
            endTime: formattedFixedEndTime,    // HH:mm:ss
            startDate: fixedStartDate,
            endDate: fixedEndDate,
            daysOfWeek: selectedDays,
            paymentMethod
        });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Header with Tabs */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="flex">
            <button 
                onClick={() => setBookingType('SINGLE')}
                className={cn("flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all",
                    bookingType === 'SINGLE' ? "border-lime-600 text-lime-700 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
            >
                <CalendarIcon className="w-4 h-4" /> Đặt theo ngày
            </button>
            <button 
                onClick={() => setBookingType('FIXED')}
                className={cn("flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all",
                    bookingType === 'FIXED' ? "border-lime-600 text-lime-700 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                )}
            >
                <Repeat className="w-4 h-4" /> Đặt cố định
            </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        
        {/* Court Selector (Shared) */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sân</label>
          <div className="grid grid-cols-3 gap-2">
            {venue.courts?.map((court) => (
              <button
                key={court.id}
                onClick={() => { setSelectedCourt(court); if(bookingType==='SINGLE') setSelectedSlots([]); }}
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

        {bookingType === 'SINGLE' ? (
            <>
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
                              ? "bg-lime-600 text-white border-lime-600 shadow-md transform scale-105" 
                              : "bg-white text-gray-600 border-gray-200 hover:border-lime-600/50 hover:bg-gray-50"
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

                {/* Time Slots */}
                <div className="mb-6">
                   <div className="flex justify-between items-center mb-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Khung giờ</label>
                        <p className="text-[10px] text-gray-400 italic mt-0.5">
                           *Hệ thống chỉ chấp nhận đặt theo giờ chẵn (Ví dụ: 17:00, 18:00).
                        </p>
                      </div>
                      <div className="flex gap-4 text-xs">
                         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-white border"></div> Trống</div>
                         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-lime-600"></div> Chọn</div>
                         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-gray-100"></div> Đã đặt</div>
                      </div>
                   </div>
                   
                   {/* Morning Slots */}
                   {morningSlots.length > 0 && (
                     <div className="mb-4">
                       <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> Sáng (00:00 - 12:00)
                       </p>
                       <div className="grid grid-cols-4 gap-2">
                           {morningSlots.map((slot) => {
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
                                       ? "bg-lime-600 text-white border-lime-600 shadow-sm ring-2 ring-lime-600/20"
                                       : "bg-white text-gray-700 border-gray-200 hover:border-lime-600 hover:text-lime-600"
                                 )}
                               >
                                 {slot}
                               </button>
                             );
                           })}
                       </div>
                     </div>
                   )}

                   {/* Afternoon Slots */}
                   {afternoonSlots.length > 0 && (
                     <div>
                       <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> Chiều (13:00 - 24:00)
                       </p>
                       <div className="grid grid-cols-4 gap-2">
                           {afternoonSlots.map((slot) => {
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
                                       ? "bg-lime-600 text-white border-lime-600 shadow-sm ring-2 ring-lime-600/20"
                                       : "bg-white text-gray-700 border-gray-200 hover:border-lime-600 hover:text-lime-600"
                                 )}
                               >
                                 {slot}
                               </button>
                             );
                           })}
                       </div>
                     </div>
                   )}
                </div>
            </>
        ) : (
            // FIXED BOOKING UI
            <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Từ ngày</label>
                        <input 
                            type="date" 
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-lime-600 outline-none"
                            value={fixedStartDate}
                            onChange={(e) => setFixedStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Đến ngày</label>
                        <input 
                            type="date" 
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm focus:border-lime-600 outline-none"
                            value={fixedEndDate}
                            onChange={(e) => setFixedEndDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Thứ trong tuần</label>
                    <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map(day => {
                            const isSelected = selectedDays.includes(day.value);
                            return (
                                <button
                                    key={day.value}
                                    onClick={() => {
                                        if (isSelected) setSelectedDays(prev => prev.filter(d => d !== day.value));
                                        else setSelectedDays(prev => [...prev, day.value]);
                                    }}
                                    className={cn(
                                        "w-10 h-10 rounded-full text-sm font-bold border transition-all",
                                        isSelected 
                                            ? "bg-lime-600 text-white border-lime-600 shadow-md" 
                                            : "bg-white text-gray-600 border-gray-200 hover:border-lime-600"
                                    )}
                                >
                                    {day.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Khung giờ cố định</label>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <select 
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-lime-600 outline-none appearance-none bg-white"
                                value={fixedStartTime}
                                onChange={(e) => setFixedStartTime(e.target.value)}
                            >
                                <optgroup label="Sáng (00:00 - 12:00)">
                                    {morningSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                </optgroup>
                                <optgroup label="Chiều (13:00 - 24:00)">
                                    {afternoonSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                </optgroup>
                            </select>
                        </div>
                        <span className="text-gray-400 font-bold">-</span>
                        <div className="flex-1 relative">
                             <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                             <select 
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-lime-600 outline-none appearance-none bg-white"
                                value={fixedEndTime}
                                onChange={(e) => setFixedEndTime(e.target.value)}
                            >
                                <optgroup label="Sáng (00:00 - 12:00)">
                                    {endMorningSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                </optgroup>
                                <optgroup label="Chiều (13:00 - 24:00)">
                                    {endAfternoonSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                </optgroup>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-lime-50 rounded-xl border border-lime-100">
                    <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-gray-600">Số buổi dự kiến:</span>
                        <span className="font-bold text-gray-900">{fixedTotalSessions} buổi</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Thời lượng:</span>
                        <span className="font-bold text-gray-900">{fixedHoursPerSession} giờ/buổi</span>
                    </div>
                </div>
            </>
        )}
           
        {error && (
            <div className="mt-3 flex items-start gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
            </div>
        )}

        {/* Payment Method */}
        <div className="mb-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Thanh toán bằng</label>
            <div className="flex gap-3">
               <button 
                  onClick={() => setPaymentMethod(PaymentMethod.WALLET)}
                  className={cn("flex-1 py-3 px-4 border rounded-xl flex items-center justify-center gap-2 transition-all", 
                    paymentMethod === PaymentMethod.WALLET ? "border-lime-600 bg-lime-50 text-lime-700 font-bold ring-1 ring-lime-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
               >
                  <CreditCard size={18} /> Ví tiền
               </button>
               <button 
                  onClick={() => setPaymentMethod(PaymentMethod.VNPAY)}
                  className={cn("flex-1 py-3 px-4 border rounded-xl flex items-center justify-center gap-2 transition-all", 
                    paymentMethod === PaymentMethod.VNPAY ? "border-blue-600 bg-blue-50 text-blue-700 font-bold ring-1 ring-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
               >
                  <span className="font-bold">VNPAY</span>
               </button>
            </div>
        </div>

      </div>

      {/* Footer Summary */}
      <div className="p-5 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 text-sm">Tổng cộng</span>
          <div className="text-right">
            <div className="text-xl font-extrabold text-lime-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
            </div>
            <div className="text-xs text-gray-500">
              {bookingType === 'SINGLE' ? `${selectedSlots.length} giờ chơi` : `${fixedTotalSessions} buổi x ${fixedHoursPerSession} giờ`}
            </div>
            {paymentMethod === PaymentMethod.WALLET && user && (
                <div className={cn("text-xs mt-1 font-medium", isInsufficientBalance ? "text-red-500" : "text-blue-600")}>
                   Ví: {isLoadingWallet ? "..." : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance)}
                </div>
            )}
          </div>
        </div>

        <button
          onClick={isInsufficientBalance ? () => navigate(`/deposit?amount=${totalPrice - balance}`) : handleSubmit}
          disabled={bookingMutation.isPending || fixedBookingMutation.isPending || (bookingType === 'SINGLE' && selectedSlots.length === 0) || (bookingType === 'FIXED' && fixedTotalSessions === 0) || !!error || (paymentMethod === PaymentMethod.WALLET && isLoadingWallet)}
          className={cn(
            "w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2",
            bookingMutation.isPending || fixedBookingMutation.isPending || (bookingType === 'SINGLE' && selectedSlots.length === 0) || (bookingType === 'FIXED' && fixedTotalSessions === 0) || !!error || (paymentMethod === PaymentMethod.WALLET && isLoadingWallet)
              ? "bg-gray-300 cursor-not-allowed shadow-none"
              : isInsufficientBalance 
                ? "bg-yellow-500 hover:bg-yellow-600 text-white" // Deposit Style
                : "bg-lime-600 hover:bg-lime-700 hover:shadow-xl active:scale-[0.98]" // Pay Style
          )}
        >
           {(bookingMutation.isPending || fixedBookingMutation.isPending) && <Loader2 className="animate-spin w-5 h-5" />}
           {!user ? 'Đăng nhập để đặt sân' : 
             isInsufficientBalance ? `Nạp thêm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice - balance)}` :
             'Xác nhận & Thanh toán'
           }
        </button>
      </div>
    </div>
  );
};
