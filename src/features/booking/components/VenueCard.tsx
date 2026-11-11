import type { VenueResponse } from '@/types/backend';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface VenueCardProps {
  venue: VenueResponse;
}

export const VenueCard = ({ venue }: VenueCardProps) => {
  // Mock price logic since it's not in the root API response yet
  // In a real app, this would come from `minPrice` or similar from the backend
  const displayPrice = "50.000đ"; 

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img 
          src={venue.thumbnail || 'https://images.unsplash.com/photo-1626224583764-847890e0e99b?auto=format&fit=crop&q=80&w=800&h=600'} 
          alt={venue.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1626224583764-847890e0e99b?auto=format&fit=crop&q=80&w=800&h=600';
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-gray-900">{venue.averageRating ? venue.averageRating.toFixed(1) : '5.0'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1" title={venue.name}>
            {venue.name}
          </h3>
        </div>
        
        <div className="flex items-start text-gray-500 text-sm mb-4 min-h-[40px] gap-1.5">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <span className="line-clamp-2">{venue.address}, {venue.ward}, {venue.district}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Giá từ</div>
            <div className="text-emerald-600 font-bold text-lg">{displayPrice}<span className="text-sm text-gray-500 font-normal">/h</span></div>
          </div>
          
          <Link to={`/venues/${venue.id}`}>
            <Button className="rounded-full bg-gray-900 hover:bg-emerald-600 text-white font-bold shadow-none hover:shadow-lg transition-all px-6">
              Đặt sân
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
