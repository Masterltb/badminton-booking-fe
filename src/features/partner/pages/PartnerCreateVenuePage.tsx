import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createVenue } from '../api/partner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import type { CreateVenuePayload } from '../types';

// Generate Time Options
const OPEN_TIMES = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const CLOSE_TIMES = Array.from({ length: 24 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}:00`);

// Schema Validation
const venueSchema = z.object({
  name: z.string().min(3, "Tên sân phải có ít nhất 3 ký tự"),
  description: z.string().default(""),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  province: z.string().min(2, "Vui lòng nhập Tỉnh/Thành"),
  district: z.string().min(2, "Vui lòng nhập Quận/Huyện"),
  ward: z.string().min(2, "Vui lòng nhập Phường/Xã"),
  phoneContact: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ (10 số)"),
  openTime: z.string(),
  closeTime: z.string(),
}).refine((data) => {
  const [openH] = data.openTime.split(':').map(Number);
  const [closeH] = data.closeTime.split(':').map(Number);
  return closeH > openH;
}, {
  message: "Giờ đóng cửa phải sau giờ mở cửa",
  path: ["closeTime"],
});

type VenueFormInput = z.input<typeof venueSchema>;
type VenueFormValues = z.output<typeof venueSchema>;

export const PartnerCreateVenuePage = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<VenueFormInput, unknown, VenueFormValues>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      openTime: "06:00",
      closeTime: "22:00",
      province: "Hà Nội",
      description: ""
    }
  });

  const mutation = useMutation({
    mutationFn: createVenue,
    onSuccess: () => {
      // Could show toast here
      navigate('/partner');
    },
    onError: (err: any) => {
      alert("Lỗi tạo sân: " + (err.response?.data?.message || err.message));
    }
  });

  const onSubmit = (data: VenueFormValues) => {
    // Transform form data to payload (add seconds to time)
    // If closeTime is "24:00", convert to "23:59:59" because LocalTime max is 23:59:59.999
    let formattedCloseTime = `${data.closeTime}:00`;
    if (data.closeTime.startsWith("24")) {
      formattedCloseTime = "23:59:59";
    }

    const payload: CreateVenuePayload = {
      ...data,
      openTime: `${data.openTime}:00`,
      closeTime: formattedCloseTime,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/partner" className="flex items-center text-gray-500 hover:text-gray-900 mb-6 w-fit">
         <ArrowLeft size={16} className="mr-1" /> Quay lại Dashboard
      </Link>
      
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Đăng ký Sân mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Tên sân</label>
          <Input 
            {...register('name')} 
            placeholder="Ví dụ: Sân Cầu Lông Ba Đình" 
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
          <textarea 
            {...register('description')} 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Mô tả về sân, số lượng sân, tiện ích (Wifi, Trà đá...)"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại liên hệ</label>
                <Input {...register('phoneContact')} placeholder="09xxxxxxxx" className={errors.phoneContact ? "border-red-500" : ""} />
                {errors.phoneContact && <span className="text-red-500 text-xs mt-1 block">{errors.phoneContact.message}</span>}
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ chi tiết</label>
                <Input {...register('address')} placeholder="Số 123, Đường ABC" className={errors.address ? "border-red-500" : ""} />
                {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>}
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tỉnh/Thành</label>
                <Input {...register('province')} />
                {errors.province && <span className="text-red-500 text-xs mt-1 block">{errors.province.message}</span>}
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quận/Huyện</label>
                <Input {...register('district')} />
                {errors.district && <span className="text-red-500 text-xs mt-1 block">{errors.district.message}</span>}
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phường/Xã</label>
                <Input {...register('ward')} />
                {errors.ward && <span className="text-red-500 text-xs mt-1 block">{errors.ward.message}</span>}
             </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giờ mở cửa</label>
                <select 
                  {...register('openTime')}
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {OPEN_TIMES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.openTime && <span className="text-red-500 text-xs mt-1 block">{errors.openTime.message}</span>}
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Giờ đóng cửa</label>
                <select 
                  {...register('closeTime')}
                  className="w-full h-10 px-3 py-2 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CLOSE_TIMES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.closeTime && <span className="text-red-500 text-xs mt-1 block">{errors.closeTime.message}</span>}
             </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
            <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 font-bold h-11"
                disabled={mutation.isPending}
            >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Đang xử lý...
                  </>
                ) : (
                  'Đăng Ký Sân'
                )}
            </Button>
        </div>
      </form>
    </div>
  );
};
