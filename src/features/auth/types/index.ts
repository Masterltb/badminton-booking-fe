import { Role } from '@/types/enums';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string; // Min 6 chars
  fullName: string;
  phone: string;
  role: Role; // 'USER' | 'OWNER'
}
