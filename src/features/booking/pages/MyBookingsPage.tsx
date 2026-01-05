import { useQuery } from '@tanstack/react-query';
import api from '@/config/api';
import { Loader2, Calendar, Clock, MapPin } from 'lucide-react';
import { formatDateISO } from '@/lib/date';

export const MyBookingsPage = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get('/bookings/my-bookings');
      return res.data.content || []; 
    }
  });

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Lịch đặt của tôi</h1>
      
      {bookings?.length === 0 ? (
        <div className="text-center text-gray-500 py-10 bg-white rounded-lg shadow-sm">
          Bạn chưa có lịch đặt nào.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookings?.map((booking: any) => (
            <div key={booking.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{booking.venueName}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {booking.status}
                  </span>
               </div>
               
               <div className="space-y-2 text-sm text-gray-600">
                 <div className="flex items-center gap-2">
                   <MapPin size={16} />
                   <span>{booking.courtName}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Calendar size={16} />
                   <span>{booking.startTime.split('T')[0]}</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock size={16} />
                   <span>{booking.startTime.split('T')[1].slice(0,5)} - {booking.endTime.split('T')[1].slice(0,5)}</span>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
