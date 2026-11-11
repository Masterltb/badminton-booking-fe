import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/api';
import { Loader2, Calendar, MapPin, XCircle, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BookingResponse } from '@/types/backend';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
    case 'PENDING_PAY': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
    case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PENDING_PAY': return 'Chờ thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CHECKED_IN': return 'Đã check-in';
      default: return status;
    }
  };

export const MyBookingsPage = () => {
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get<{ content: BookingResponse[] }>('/bookings/my-bookings');
      return res.data.content || []; 
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/bookings/${id}/cancel`);
    },
    onSuccess: () => {
      alert("Đã hủy lịch đặt thành công!");
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || "Không thể hủy lịch đặt này.");
    }
  });

  const handleCancel = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch đặt này không?")) {
      cancelMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-lime-600 w-8 h-8" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Lịch sử đặt sân</h1>
      
      {bookings?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Bạn chưa có lịch đặt nào.</p>
          <Button variant="link" className="text-lime-600 mt-2">Đặt sân ngay</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking) => (
            <div key={booking.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
               {/* Left: Info */}
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl text-gray-900">{booking.venueName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                    </span>
                 </div>
                 
                 <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                    <MapPin size={14} /> {booking.venueAddress}
                 </div>

                 <div className="grid grid-cols-2 gap-4 text-sm">
                   <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Sân</span>
                      <span className="font-semibold text-gray-800">{booking.courtName}</span>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="block text-gray-400 text-xs uppercase font-bold mb-1">Thời gian</span>
                      <div className="font-semibold text-gray-800">
                        {booking.startTime.split('T')[0]} <br/>
                        <span className="text-lime-600">
                            {booking.startTime.split('T')[1].slice(0,5)} - {booking.endTime.split('T')[1].slice(0,5)}
                        </span>
                      </div>
                   </div>
                 </div>
               </div>

               {/* Right: Price & Action */}
               <div className="flex flex-col justify-between items-end min-w-[150px] border-l border-gray-100 pl-6 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="block text-gray-400 text-xs mb-1">Tổng tiền</span>
                    <span className="text-xl font-extrabold text-lime-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-4">
                     {booking.checkinCode && (
                        <div className="bg-gray-900 text-white p-2 rounded text-center text-sm font-mono tracking-widest flex items-center justify-center gap-2">
                            <QrCode size={16} /> {booking.checkinCode}
                        </div>
                     )}
                     
                     {(booking.status === 'PENDING_PAY' || booking.status === 'CONFIRMED') && (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleCancel(booking.id)}
                            className="text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 w-full"
                        >
                            <XCircle size={16} className="mr-1" /> Hủy đặt
                        </Button>
                     )}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
