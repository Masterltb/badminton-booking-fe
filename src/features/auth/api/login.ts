import api from '@/config/api';
import type { AuthResponse } from '@/types/backend';
import type { LoginPayload } from '../types';

export const loginWithEmail = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};
