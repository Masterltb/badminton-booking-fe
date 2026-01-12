import api from '@/config/api';
import type { VenueResponse, BookingResponse, Page, CourtResponse } from '@/types/backend';
import type { CreateVenuePayload, CreateCourtPayload, PricingConfigPayload, PartnerStats } from '../types';

// --- Dashboard Stats ---

export const getPartnerStats = async (params: { fromDate: string; toDate: string }): Promise<PartnerStats> => {
  const response = await api.get<PartnerStats>('/partner/statistics/revenue', { params });
  return response.data;
};

// --- Venue Management ---

export const getMyVenues = async (): Promise<Page<VenueResponse>> => {
  const response = await api.get<Page<VenueResponse>>('/partner/venues/me');
  return response.data;
};

export const createVenue = async (data: CreateVenuePayload): Promise<VenueResponse> => {
  const response = await api.post<VenueResponse>('/partner/venues', data);
  return response.data;
};

export const addCourt = async (venueId: number, data: CreateCourtPayload): Promise<CourtResponse> => {
  const response = await api.post<CourtResponse>(`/partner/venues/${venueId}/courts`, data);
  return response.data;
};

export const uploadVenueImages = async (venueId: number, imageUrls: string[]): Promise<void> => {
  await api.post(`/partner/venues/${venueId}/images`, imageUrls);
};

export const configurePricing = async (venueId: number, configs: PricingConfigPayload[]): Promise<void> => {
  await api.post(`/partner/venues/${venueId}/pricing`, configs);
};

// --- Booking Management ---

export const getPartnerBookings = async (params?: { page?: number; date?: string }): Promise<Page<BookingResponse>> => {
  const response = await api.get<Page<BookingResponse>>('/partner/bookings', { params });
  return response.data;
};

export const checkInBooking = async (checkinCode: string): Promise<void> => {
  await api.post('/partner/bookings/check-in', { checkinCode });
};
