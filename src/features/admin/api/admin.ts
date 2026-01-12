import api from '@/config/api';
import type { Page, VenueResponse } from '@/types/backend';
import { VenueStatus } from '@/types/enums';

export const getAdminVenues = async (params?: { page?: number; size?: number; status?: string }): Promise<Page<VenueResponse>> => {
  const queryParams = {
    ...params,
    status: params?.status || VenueStatus.PENDING_APPROVAL
  };
  
  // Use the dedicated Admin endpoint (v1.6) which supports filtering by status (including PENDING)
  const response = await api.get<Page<VenueResponse>>('/admin/venues', { params: queryParams });
  return response.data;
};

export const approveVenue = async (id: number): Promise<void> => {
  await api.put(`/admin/venues/${id}/approve`);
};

export const rejectVenue = async (id: number): Promise<void> => {
  await api.put(`/admin/venues/${id}/reject`);
};

export const approveWithdraw = async (id: number): Promise<void> => {
  await api.put(`/admin/withdrawals/${id}/approve`);
};

