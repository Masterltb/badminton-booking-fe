import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getVenueById } from '@/features/booking/api/venue';
import { addCourt, configurePricing } from '../api/partner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import type { PricingConfigPayload } from '../types';

export const PartnerVenueConfigPage = () => {
  const { id } = useParams<{ id: string }>();
  const venueId = Number(id);
  const queryClient = useQueryClient();

  // Fetch Venue Detail
  const { data: venue, isLoading } = useQuery({
    queryKey: ['venue', venueId],
    queryFn: () => getVenueById(venueId),
    enabled: !!venueId,
  });

  // --- Add Court Mutation ---
  const { register: registerCourt, handleSubmit: handleCourtSubmit, reset: resetCourt } = useForm<{ name: string }>();
  
  const courtMutation = useMutation({
    mutationFn: (data: { name: string }) => addCourt(venueId, data),
    onSuccess: () => {
      alert('Thêm sân thành công!');
      resetCourt();
      queryClient.invalidateQueries({ queryKey: ['venue', venueId] });
    },
    onError: (err: any) => alert(err.message)
  });

  // --- Pricing Mutation ---
  const { register: registerPrice, handleSubmit: handlePriceSubmit } = useForm<PricingConfigPayload>();

  const priceMutation = useMutation({
    mutationFn: (data: PricingConfigPayload) => configurePricing(venueId, [data]),
    onSuccess: () => {
      alert('Cấu hình giá thành công!');
    },
    onError: (err: any) => alert(err.message)
  });

  if (isLoading) return <div>Loading...</div>;
  if (!venue) return <div>Không tìm thấy sân</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link to="/partner" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 w-fit">
         <ArrowLeft size={16} className="mr-1" /> Quay lại Dashboard
      </Link>
      
      <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
      <p className="text-gray-500 mb-8">Cấu hình Sân con & Bảng giá</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Court Management */}
        <div>
          <h2 className="text-xl font-bold mb-4">Danh sách Sân con</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
             {venue.courts && venue.courts.length > 0 ? (
                <ul className="space-y-2">
                  {venue.courts.map(court => (
                    <li key={court.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                       <span className="font-medium">{court.name}</span>
                       <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Hoạt động</span>
                    </li>
                  ))}
                </ul>
             ) : (
                <p className="text-gray-500 italic">Chưa có sân con nào.</p>
             )}
          </div>

          <form onSubmit={handleCourtSubmit((data) => courtMutation.mutate(data))} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <h3 className="font-bold mb-3">Thêm Sân Con</h3>
             <div className="flex gap-2">
                <Input {...registerCourt('name', { required: true })} placeholder="Tên sân (VD: Sân 1)" />
                <Button type="submit" disabled={courtMutation.isPending}>
                   <Plus size={16} /> Thêm
                </Button>
             </div>
          </form>
        </div>

        {/* Right Column: Pricing Config */}
        <div>
           <h2 className="text-xl font-bold mb-4">Cấu hình Giá (Chung)</h2>
           <form onSubmit={handlePriceSubmit((data) => priceMutation.mutate({...data, courtId: null}))} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <div>
                 <label className="block text-sm font-medium mb-1">Khung giờ</label>
                 <div className="flex gap-2 items-center">
                    <Input type="time" {...registerPrice('startTime')} defaultValue="00:00:00" step="1" />
                    <span>-</span>
                    <Input type="time" {...registerPrice('endTime')} defaultValue="23:59:59" step="1" />
                 </div>
                 <p className="text-xs text-gray-400 mt-1">Lưu ý: Nhập có giây (HH:mm:ss)</p>
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1">Giá mỗi giờ (VND)</label>
                 <Input type="number" {...registerPrice('pricePerHour', { valueAsNumber: true })} placeholder="50000" />
              </div>

              <div>
                 <label className="block text-sm font-medium mb-1">Ngày áp dụng</label>
                 <Input {...registerPrice('daysOfWeek')} defaultValue="MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY" />
                 <p className="text-xs text-gray-400 mt-1">Phân cách bởi dấu phẩy (Tiếng Anh)</p>
              </div>

              <input type="hidden" {...registerPrice('priority', { valueAsNumber: true })} value={1} />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={priceMutation.isPending}>
                 {priceMutation.isPending ? 'Đang lưu...' : 'Lưu Cấu Hình'}
              </Button>
           </form>
        </div>
      </div>
    </div>
  );
};
