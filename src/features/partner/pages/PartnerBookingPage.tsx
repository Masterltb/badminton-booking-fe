import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPartnerBookings, checkInBooking } from '../api/partner';
import { Loader2, QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const PartnerBookingPage = () => {
  const queryClient = useQueryClient();
  const [checkinCode, setCheckinCode] = useState("");
  
  const { data: bookingPage, isLoading } = useQuery({
    queryKey: ['partner-bookings'],
    queryFn: () => getPartnerBookings({ page: 0 })
  });

  const checkinMutation = useMutation({
    mutationFn: checkInBooking,
    onSuccess: () => {
        alert("Check-in thành công!");
        setCheckinCode("");
        queryClient.invalidateQueries({ queryKey: ['partner-bookings'] });
    },
    onError: (err: any) => {
        alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  });

  const handleCheckIn = () => {
    if(!checkinCode) return;
    checkinMutation.mutate(checkinCode);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
         <h1 className="text-2xl font-bold">Quản lý Đặt sân</h1>
         <div className="flex gap-2">
            <div className="relative">
                <QrCode className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <Input 
                   placeholder="Nhập mã Check-in (VD: ABC123)" 
                   className="pl-10 w-64" 
                   value={checkinCode}
                   onChange={(e) => setCheckinCode(e.target.value.toUpperCase())}
                />
            </div>
            <Button onClick={handleCheckIn} disabled={checkinMutation.isPending} className="bg-blue-600">
               {checkinMutation.isPending ? <Loader2 className="animate-spin" /> : "Check-in"}
            </Button>
         </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
               <tr>
                  <th className="p-4 border-b">ID</th>
                  <th className="p-4 border-b">Sân</th>
                  <th className="p-4 border-b">Ngày giờ</th>
                  <th className="p-4 border-b">Trạng thái</th>
                  <th className="p-4 border-b">Mã Check-in</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {isLoading ? (
                  <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="animate-spin mx-auto" /></td></tr>
               ) : bookingPage?.content.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">Chưa có booking nào.</td></tr>
               ) : (
                  bookingPage?.content.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium">#{booking.id}</td>
                        <td className="p-4">
                           <div className="font-bold text-gray-800">{booking.venueName}</div>
                           <div className="text-xs text-gray-500">{booking.courtName}</div>
                        </td>
                        <td className="p-4">
                           <div className="text-sm">{booking.startTime.split('T')[0]}</div>
                           <div className="text-xs text-gray-500">
                              {booking.startTime.split('T')[1].slice(0,5)} - {booking.endTime.split('T')[1].slice(0,5)}
                           </div>
                        </td>
                        <td className="p-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               booking.status === 'CHECKED_IN' ? 'bg-purple-100 text-purple-800' :
                               booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                               booking.status === 'PENDING_PAY' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-gray-100 text-gray-800'
                           }`}>
                              {booking.status}
                           </span>
                        </td>
                        <td className="p-4 font-mono text-gray-600 font-bold">
                            {booking.checkinCode || '-'}
                        </td>
                    </tr>
                  ))
               )}
            </tbody>
         </table>
      </div>
    </div>
  );
};
