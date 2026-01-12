import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { verifyOtp, resendOtp } from '../api/register';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const otpSchema = z.object({
  otp: z.string().length(6, 'Mã OTP phải có 6 ký tự'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export const OtpVerificationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate('/auth/register');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: () => {
      setSuccessMsg('Xác thực thành công! Đang chuyển hướng đăng nhập...');
      setTimeout(() => navigate('/auth/login'), 2000);
    },
    onError: (error: any) => {
        const msg = error.response?.data?.message || error.message || 'Mã OTP không đúng';
        setErrorMsg(msg);
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendOtp,
    onSuccess: () => {
      setSuccessMsg('Đã gửi lại mã OTP.');
      setCountdown(60); // 60s cooldown
    },
    onError: (error: any) => {
        const msg = error.response?.data?.message || error.message || 'Gửi lại OTP thất bại';
        setErrorMsg(msg);
    },
  });

  const onSubmit = (data: OtpFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    verifyMutation.mutate({ email, otp: data.otp });
  };

  const handleResend = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    resendMutation.mutate(email);
  };

  if (!email) return null;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Xác Thực OTP</h2>
      <p className="text-center text-sm text-gray-600 mb-6">
        Mã xác thực đã được gửi đến email: <span className="font-semibold">{email}</span>
      </p>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Mã OTP (6 số)</label>
          <Input
            {...register('otp')}
            className="text-center text-lg tracking-widest"
            maxLength={6}
            placeholder="123456"
          />
          {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp.message}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? 'Đang xác thực...' : 'Xác Nhận'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Không nhận được mã?</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResend}
          disabled={resendMutation.isPending || countdown > 0}
          className="w-full"
        >
          {resendMutation.isPending ? 'Đang gửi...' : countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại OTP'}
        </Button>
      </div>
    </div>
  );
};
