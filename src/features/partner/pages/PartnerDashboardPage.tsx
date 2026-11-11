import { useQuery } from '@tanstack/react-query';
import { getMyVenues, getPartnerStats, getPartnerBookings } from '../api/partner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Calendar, MapPin } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const PartnerDashboardPage = () => {
  // 1. Get Venues
  const { data: venues, isLoading: isLoadingVenues } = useQuery({
    queryKey: ['my-venues'],
    queryFn: getMyVenues
  });

  // Calculate Date for Bookings (Today)
  const today = new Date();
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const todayStr = formatDate(today);

  // 2. Get Bookings Today
  const { data: bookingsToday } = useQuery({
    queryKey: ['partner-bookings-today', todayStr],
    queryFn: () => getPartnerBookings({ page: 0, date: todayStr })
  });

  // Calculate Date Range for Revenue (Month)
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const fromDate = formatDate(firstDayOfMonth);
  const toDate = todayStr;

  // 3. Get Revenue Stats
  const { data: revenueStats } = useQuery({
    queryKey: ['partner-stats', fromDate, toDate],
    queryFn: () => getPartnerStats({ fromDate, toDate })
  });

  const revenue = revenueStats?.revenueThisMonth ?? 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
       <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
            <p className="text-gray-500">Quản lý hệ thống sân cầu lông của bạn.</p>
          </div>
          <div className="flex gap-3">
             <Link to="/partner/bookings">
                <Button variant="outline" className="gap-2">
                    <Calendar size={18} /> Quản lý Booking
                </Button>
             </Link>
             <Link to="/partner/venues/new">
                <Button className="bg-lime-600 hover:bg-lime-700 gap-2">
                    <Plus size={18} /> Thêm sân mới
                </Button>
             </Link>
          </div>
       </div>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-gray-500 text-sm font-bold uppercase">Tổng doanh thu (Tháng)</h3>
             <p className="text-3xl font-extrabold text-lime-600 mt-2">
               {formatCurrency(revenue)}
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-gray-500 text-sm font-bold uppercase">Booking Hôm nay</h3>
             <p className="text-3xl font-extrabold text-blue-600 mt-2">
               {bookingsToday ? bookingsToday.totalElements : '...'}
             </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-gray-500 text-sm font-bold uppercase">Số sân hoạt động</h3>
             <p className="text-3xl font-extrabold text-purple-600 mt-2">
               {venues ? venues.totalElements : '...'}
             </p>
          </div>
       </div>

       <h2 className="text-xl font-bold mb-4">Danh sách sân của tôi</h2>
       
       {isLoadingVenues ? (
          <div>Đang tải dữ liệu...</div>
       ) : (!venues?.content || venues.content.length === 0) ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-500 mb-4">Bạn chưa có sân nào.</p>
             <Link to="/partner/venues/new">
                <Button>Tạo sân đầu tiên ngay</Button>
             </Link>
          </div>
       ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {venues.content.map(venue => (
                <div key={venue.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                   <div className="h-48 bg-gray-200 relative">
                      {venue.thumbnail ? (
                        <img src={venue.thumbnail} className="w-full h-full object-cover" alt={venue.name} />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                      )}
                      <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
                         venue.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                         {venue.status}
                      </span>
                   </div>
                   <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{venue.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                         <MapPin size={14} /> {venue.address}
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                         <Link to={`/partner/venues/${venue.id}/config`}>
                           <Button variant="ghost" size="sm" className="text-gray-600">
                              <Settings size={16} className="mr-1" /> Cấu hình
                           </Button>
                         </Link>
                         <Link to={`/venues/${venue.id}`}>
                           <Button variant="outline" size="sm" className="text-blue-600 border-blue-100 bg-blue-50">
                              Xem chi tiết
                           </Button>
                         </Link>
                      </div>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
};
