import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVenueById } from '../api/venue';
import { BookingWidget } from '../components/BookingWidget';

export const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: venue, isLoading, error } = useQuery({
    queryKey: ['venue', id],
    queryFn: () => getVenueById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-center">Đang tải thông tin sân...</div>;
  if (error || !venue) return <div className="p-8 text-center text-red-500">Không tìm thấy sân!</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              📍 {venue.address}, {venue.ward}, {venue.district}, {venue.province}
            </p>
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span>🕒 {venue.openTime} - {venue.closeTime}</span>
              <span>⭐ {venue.averageRating} ({venue.totalReviews} đánh giá)</span>
            </div>
          </div>
          <div className="text-right">
             <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
               {venue.status}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Gallery & Desc */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center text-gray-500">
             {venue.thumbnail ? (
               <img src={venue.thumbnail} alt={venue.name} className="w-full h-full object-cover rounded-lg" />
             ) : (
               <span>Chưa có hình ảnh</span>
             )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-4">Giới thiệu</h3>
            <p className="text-gray-700 whitespace-pre-line">{venue.description}</p>
          </div>
        </div>

        {/* Right: Booking Widget */}
        <div className="lg:col-span-1">
           <div className="sticky top-24">
             <BookingWidget venue={venue} />
           </div>
        </div>
      </div>
    </div>
  );
};
