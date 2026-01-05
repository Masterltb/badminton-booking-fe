# 03_API_INTEGRATION_GUIDE.md

Hướng dẫn chi tiết cách gọi API và xử lý Authentication.

## 1. Axios Instance Setup (`src/config/api.ts`)
Cấu hình Interceptor để tự động đính kèm Token và xử lý Refresh Token.

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Gắn Token vào Header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Xử lý lỗi 401 (Token hết hạn)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu lỗi 401 và chưa retry lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API Refresh Token
        const refreshToken = useAuthStore.getState().refreshToken;
        const res = await axios.post('/auth/refresh-token', { refreshToken });
        
        // Lưu token mới
        useAuthStore.getState().setTokens(res.data.accessToken, res.data.refreshToken);
        
        // Gọi lại request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu refresh cũng lỗi -> Logout
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 2. Sử dụng TanStack Query (`src/features/venue/api/useVenues.ts`)

```typescript
import { useQuery } from '@tanstack/react-query';
import api from '@/config/api';
import { Venue } from '../types';

export const useVenues = (filters: any) => {
  return useQuery({
    queryKey: ['venues', filters], // Cache key: Tự động refetch khi filters đổi
    queryFn: async () => {
      const { data } = await api.get<Venue[]>('/venues/search', { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
  });
};
```

## 3. Type Definition (Đồng bộ với Backend DTO)

```typescript
// src/features/auth/types/index.ts

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'OWNER' | 'USER';
  avatarUrl?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
```
