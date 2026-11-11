import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getVenues } from '@/features/booking/api/venue';
import { VenueCard } from '@/features/booking/components/VenueCard';

export const HomePage = () => {
  // Fetch Venues Data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['venues', 'featured'],
    queryFn: () => getVenues({ page: 0, size: 6 }),
  });

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] rounded-full bg-emerald-50/50 blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] rounded-full bg-blue-50/30 blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 flex flex-col items-center text-center z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm mb-6 border border-emerald-100">
            <Star size={14} className="fill-emerald-600" /> 
            Hệ thống đặt sân #1 Việt Nam
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
            Tìm sân cầu lông <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Đẳng cấp & Tiện lợi
            </span>
          </h1>

          {/* Airbnb-style Search Bar */}
          <div className="w-full max-w-4xl bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-200 p-2 pl-6 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300">
            {/* Location */}
            <div className="flex-1 w-full py-2 px-4 hover:bg-gray-50 rounded-full cursor-pointer transition-colors group">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5 ml-1">Địa điểm</div>
              <div className="flex items-center text-gray-500">
                <input 
                  type="text" 
                  placeholder="Bạn muốn chơi ở đâu?" 
                  className="w-full bg-transparent border-none p-0 text-gray-600 placeholder:text-gray-400 focus:ring-0 text-sm font-medium truncate"
                />
              </div>
            </div>

            {/* Date */}
            <div className="flex-1 w-full py-2 px-4 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5 ml-1">Ngày</div>
              <div className="flex items-center text-gray-500">
                <input 
                  type="date" 
                  className="w-full bg-transparent border-none p-0 text-gray-600 focus:ring-0 text-sm font-medium"
                />
              </div>
            </div>

            {/* Time */}
            <div className="flex-1 w-full py-2 px-4 hover:bg-gray-50 rounded-full cursor-pointer transition-colors">
              <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-0.5 ml-1">Giờ</div>
              <div className="flex items-center text-gray-500">
                 <input 
                  type="time" 
                  className="w-full bg-transparent border-none p-0 text-gray-600 focus:ring-0 text-sm font-medium"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="pl-2 pr-1 py-1 w-full md:w-auto">
              <Button className="w-full md:w-auto rounded-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 h-12 w-12 flex items-center justify-center shadow-lg hover:scale-105 transition-all duration-300">
                <Search size={20} strokeWidth={3} />
              </Button>
            </div>
          </div>

          <p className="mt-8 text-gray-500 text-sm font-medium">
            Phổ biến: <span className="text-gray-800 cursor-pointer hover:underline">Cầu Giấy</span>, <span className="text-gray-800 cursor-pointer hover:underline">Thanh Xuân</span>, <span className="text-gray-800 cursor-pointer hover:underline">Hà Đông</span>
          </p>
        </div>
      </section>

      {/* Venues Grid Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
             <div>
               <h2 className="text-3xl font-bold text-gray-900 mb-2">Sân cầu lông nổi bật</h2>
               <p className="text-gray-500">Những sân được đánh giá cao nhất bởi cộng đồng</p>
             </div>
             <Link to="/venues">
               <Button variant="outline" className="rounded-full border-gray-300 hover:border-emerald-600 hover:text-emerald-600">
                 Xem tất cả (120+)
               </Button>
             </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[400px] bg-white rounded-3xl animate-pulse shadow-sm" />
              ))
            ) : isError ? (
               <div className="col-span-full text-center py-20">
                 <p className="text-red-500 font-medium">Không thể tải danh sách sân.</p>
               </div>
            ) : (data?.content && data.content.length > 0) ? (
              data.content.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))
            ) : (
               <div className="col-span-full text-center py-20 text-gray-500">
                 Chưa có dữ liệu sân.
               </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
