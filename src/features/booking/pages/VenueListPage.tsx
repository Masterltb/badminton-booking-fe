import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVenues } from '../api/venue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Star } from 'lucide-react';

// Simple debounce implementation if not exists, but I'll check first.
// For now, I'll just trigger search on Enter or Button click to avoid complexity if hook is missing.

export const VenueListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  const [keyword, setKeyword] = useState(initialKeyword);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['venues', keyword], // Refetch when keyword changes (if we want auto-search)
                                    // or just use searchParams keyword
    queryFn: () => getVenues({ 
      keyword: keyword, 
      page: 0, 
      size: 10 
    }),
  });

  const handleSearch = () => {
    setSearchParams({ keyword });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Tìm Sân Cầu Lông</h1>
        
        <div className="flex gap-2 max-w-2xl">
          <Input 
            placeholder="Tìm theo tên sân, địa chỉ..." 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-12 text-lg"
          />
          <Button onClick={handleSearch} className="h-12 px-8 bg-lime-600 hover:bg-lime-700 text-white font-bold">
            <Search className="mr-2 h-5 w-5" /> Tìm kiếm
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          Đã có lỗi xảy ra khi tải danh sách sân. Vui lòng thử lại.
        </div>
      )}

      {!isLoading && !isError && data?.content.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Không tìm thấy sân nào phù hợp với từ khóa "{keyword}".
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.content.map((venue) => (
          <Link key={venue.id} to={`/venues/${venue.id}`} className="group block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
              <div className="relative aspect-[4/3] bg-gray-200">
                {venue.thumbnail ? (
                  <img 
                    src={venue.thumbnail} 
                    alt={venue.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1 text-amber-500">
                  <Star className="fill-amber-500 w-3 h-3" /> {venue.averageRating || 5.0}
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-lime-600 transition-colors">
                  {venue.name}
                </h3>
                <div className="flex items-start gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{venue.address}, {venue.ward}, {venue.district}</span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                   <div className="text-sm text-gray-500">
                      🕒 {venue.openTime?.slice(0,5)} - {venue.closeTime?.slice(0,5)}
                   </div>
                   <div className="text-lime-600 font-bold">
                      Đặt ngay &rarr;
                   </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
