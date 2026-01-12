import api from '@/config/api';
import type { VenueResponse, BookingResponse, Page } from '@/types/backend';
import type { CreateBookingPayload, BookingSchedulePayload } from '../types';

export const getVenues = async (params?: { page?: number; size?: number; keyword?: string; sortBy?: string; sortDir?: string }): Promise<Page<VenueResponse>> => {
  const response = await api.get<Page<VenueResponse>>('/public/venues', { 
    params,
    headers: {
        Authorization: '', // Public endpoint
    } 
  });
  return response.data;
};

export const getVenueById = async (id: number): Promise<VenueResponse> => {
  const response = await api.get<VenueResponse>(`/public/venues/${id}`);
  return response.data;
};

export const createBooking = async (data: CreateBookingPayload): Promise<BookingResponse> => {
  const response = await api.post<BookingResponse>('/bookings', data);
  return response.data;
};

export const createBookingSchedule = async (data: BookingSchedulePayload): Promise<BookingResponse[]> => {
  const response = await api.post<BookingResponse[]>('/bookings/recurring', data);
  return response.data;
};

export const getMyBookings = async (params?: { page?: number; size?: number }): Promise<Page<BookingResponse>> => {
  const response = await api.get<Page<BookingResponse>>('/bookings/my-bookings', { params });
  return response.data;
};

export const cancelBooking = async (id: number): Promise<void> => {
  await api.post(`/bookings/${id}/cancel`);
};

export const getBookingById = async (id: number): Promise<BookingResponse> => {
  const response = await api.get<BookingResponse>(`/bookings/${id}`);
  return response.data;
};

