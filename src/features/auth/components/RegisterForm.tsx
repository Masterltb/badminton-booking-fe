import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { registerWithEmail } from '../api/register';
import { useState } from 'react';
import { Role } from '@/types/enums';
import { getErrorMessage } from '@/lib/errors';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Tên quá ngắn'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  role: z.enum([Role.USER, Role.OWNER]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: Role.USER,
    },
  });

  const mutation = useMutation({
    mutationFn: registerWithEmail,
    onSuccess: (_, variables) => {
      setSuccessMsg('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã OTP.');
      setTimeout(() => navigate('/auth/verify-otp', { state: { email: variables.email } }), 1500);
    },
    onError: (error: unknown) => {
      const msg = getErrorMessage(error, 'Đăng ký thất bại');
      setErrorMsg(msg);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    setErrorMsg(null);
    // Remove confirmPassword before sending to API if needed, 
    // but our API payload interface doesn't have it, so we just pass the necessary fields.
    // However, TypeScript might complain if we pass extra fields.
    const payload = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    };
    mutation.mutate(payload);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Đăng Ký Tài Khoản</h2>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm">
          {errorMsg}
        </div>
      )}
       {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded text-sm">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
          <input
            {...register('fullName')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nguyễn Văn A"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="user@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            {...register('phone')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0912345678"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu (Min 6)</label>
          <input
            {...register('password')}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhập lại mật khẩu</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••"
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bạn là ai?</label>
          <select
            {...register('role')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value={Role.USER}>Người chơi (Đặt sân)</option>
            <option value={Role.OWNER}>Chủ sân (Quản lý sân)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {mutation.isPending ? 'Đang đăng ký...' : 'Đăng Ký'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};
