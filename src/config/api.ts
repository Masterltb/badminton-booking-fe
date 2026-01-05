import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ApiError } from '@/types/backend';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (Token Expired)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');

        // Call Refresh Token API
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update Store
        useAuthStore.getState().setTokens(accessToken, newRefreshToken);

        // Retry Original Request
        if (originalRequest.headers) {
           originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Logout if refresh fails
        useAuthStore.getState().logout();
        // Optional: Redirect to login
        // window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    // Standardize Error Message for UI
    if (error.response?.data) {
        const apiError = error.response.data as ApiError;
        // You can use a toast library here to show apiError.message
        console.error('API Error:', apiError.message);
        // We reject with the ApiError object so components can handle it
        return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }
);

export default api;