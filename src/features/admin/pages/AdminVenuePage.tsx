import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminVenues, approveVenue, rejectVenue } from '../api/admin';
import { VenueStatus } from '@/types/enums';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminVenuePage = () => {
  const [statusFilter, setStatusFilter] = useState<VenueStatus>(VenueStatus.PENDING_APPROVAL);
  const queryClient = useQueryClient();
  
  const { data: venues, isLoading } = useQuery({
    queryKey: ['admin-venues', statusFilter],
    queryFn: () => getAdminVenues({ size: 100, status: statusFilter }), 
  });

  const approveMutation = useMutation({
    mutationFn: approveVenue,
    onSuccess: () => {
      alert("Đã duyệt sân thành công!");
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
    },
    onError: (err: any) => alert("Lỗi: " + err.message)
  });

  const rejectMutation = useMutation({
    mutationFn: rejectVenue,
    onSuccess: () => {
      alert("Đã từ chối sân!");
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
    },
    onError: (err: any) => alert("Lỗi: " + err.message)
  });

  const tabs = [
    { label: 'Chờ duyệt', value: VenueStatus.PENDING_APPROVAL },
    { label: 'Đang hoạt động', value: VenueStatus.ACTIVE },
    { label: 'Ngừng hoạt động', value: VenueStatus.INACTIVE },
  ];

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý Địa điểm</h1>

      {/* Status Filter Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              statusFilter === tab.value
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sân</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {venues?.content?.map((venue) => (
              <tr key={venue.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{venue.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                   <div className="text-xs text-gray-500">{venue.phoneContact}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                    {venue.address}, {venue.district}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${venue.status === VenueStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                      venue.status === VenueStatus.PENDING_APPROVAL ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {venue.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                   <Link to={`/venues/${venue.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                         <Eye size={16} />
                      </Button>
                   </Link>
                   
                   {venue.status === VenueStatus.PENDING_APPROVAL && (
                     <>
                       <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => approveMutation.mutate(venue.id)}
                          disabled={approveMutation.isPending}
                       >
                          <CheckCircle size={16} className="mr-1"/> Duyệt
                       </Button>
                       <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(venue.id)}
                          disabled={rejectMutation.isPending}
                       >
                          <XCircle size={16} className="mr-1"/> Từ chối
                       </Button>
                     </>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!venues?.content || venues.content.length === 0) && (
            <div className="p-10 text-center text-gray-500">Không có dữ liệu cho trạng thái này</div>
        )}
      </div>
    </div>
  );
};
