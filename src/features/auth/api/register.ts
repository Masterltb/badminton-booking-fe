import api from '@/config/api';
import type { RegisterPayload } from '../types';

export const registerWithEmail = async (data: RegisterPayload): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/register', data);
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/verify-otp', data);
  return response.data;
};

export const resendOtp = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/auth/resend-otp', { email });
  return response.data;
};

