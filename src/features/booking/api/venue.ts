import api from '@/config/api';
import type { VenueResponse, BookingResponse, Page } from '@/types/backend';

export const getVenues = async (params?: { page?: number; size?: number; search?: string }): Promise<Page<VenueResponse>> => {
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

export const createBooking = async (data: any): Promise<BookingResponse> => {
  // data includes: courtId, startTime, endTime, paymentMethod
  const response = await api.post<BookingResponse>('/bookings', data);
  return response.data;
};

export const getBookedSlots = async (courtId: number, date: string): Promise<string[]> => {
  // TODO: Replace with real API call when Backend is ready
  // const response = await api.get<string[]>(`/public/bookings/occupied`, { params: { courtId, date } });
  // return response.data;

  // Mocking based on date to be consistent
  console.log(`[MOCK] Fetching slots for Court ${courtId} on ${date}`);
  
  // Simulate some busy slots on weekends
  const day = new Date(date).getDay();
  if (day === 0 || day === 6) { // Sat/Sun
      return ['16:00', '17:00', '19:00'];
  }
  
  return ['18:00']; 
};