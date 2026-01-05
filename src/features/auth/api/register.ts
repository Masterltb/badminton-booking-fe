import api from '@/config/api';
import type { UserResponse } from '@/types/backend';
import type { RegisterPayload } from '../types';

export const registerWithEmail = async (data: RegisterPayload): Promise<UserResponse> => {
  const response = await api.post<UserResponse>('/auth/register', data);
  return response.data;
};
