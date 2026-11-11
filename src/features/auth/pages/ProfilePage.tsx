import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Camera, User, Mail, Phone, Save } from 'lucide-react';

interface ProfileFormValues {
  fullName: string;
  phone: string;
  email: string;
}

export const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatarUrl || null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      email: user?.email || '',
    }
  });

  // Mock Mutation for Profile Update
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues & { avatarUrl?: string }) => {
       if (!user) throw new Error('Bạn cần đăng nhập để cập nhật hồ sơ.');
       // Simulate API call delay
       await new Promise(resolve => setTimeout(resolve, 1000));
       
       // In a real app, we would call api.put('/users/me', data)
       // For now, we return the data as if the server processed it
       return {
         ...user,
         fullName: data.fullName,
         // Phone/Email might be restricted but let's allow updating local state for demo
         phone: data.phone,
         email: data.email,
         avatarUrl: data.avatarUrl || user.avatarUrl
       };
    },
    onSuccess: (updatedUser) => {
       setUser(updatedUser);
       alert("Cập nhật hồ sơ thành công!");
    },
    onError: () => {
       alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    // If we had a real file upload, we'd upload it first, get the URL, then update profile
    // Here we just pass the preview URL if changed, or keep original
    updateProfileMutation.mutate({
      ...data,
      avatarUrl: avatarPreview || undefined
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  if (!user) return <div>Vui lòng đăng nhập.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">Hồ sơ cá nhân</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
         <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
               <div className="w-32 h-32 rounded-full border-4 border-emerald-50 overflow-hidden bg-gray-100 relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                        {user.fullName.charAt(0)}
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Camera className="text-white w-8 h-8" />
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                  <Camera size={16} />
               </div>
            </div>
            <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*"
               onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500 mt-3">Nhấn vào ảnh để thay đổi</p>
         </div>

         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <User size={16} /> Họ và tên
               </label>
               <Input 
                  {...register('fullName', { required: "Vui lòng nhập họ tên" })} 
                  className={errors.fullName ? "border-red-500" : ""}
               />
               {errors.fullName && <span className="text-red-500 text-xs mt-1 block">{errors.fullName.message}</span>}
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Phone size={16} /> Số điện thoại
               </label>
               <Input 
                  {...register('phone')} 
                  disabled // Usually phone is unique key or hard to change without OTP
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
               />
               <p className="text-xs text-gray-400 mt-1">Liên hệ CSKH để đổi số điện thoại</p>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Mail size={16} /> Email
               </label>
               <Input 
                  {...register('email')} 
                  disabled 
                  className="bg-gray-50 text-gray-500 cursor-not-allowed"
               />
            </div>

            <div className="pt-4">
                <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold h-12 text-lg shadow-lg shadow-emerald-600/20"
                    disabled={updateProfileMutation.isPending}
                >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={20} /> Lưu thay đổi
                      </>
                    )}
                </Button>
            </div>
         </form>
      </div>
    </div>
  );
};
