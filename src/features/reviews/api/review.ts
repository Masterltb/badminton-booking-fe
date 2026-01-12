import api from '@/config/api';
import type { Page } from '@/types/backend';
import type { ReviewPayload, ReviewResponse } from '../types';

export const createReview = async (data: ReviewPayload): Promise<void> => {
  await api.post('/reviews', data);
};

export const getVenueReviews = async (venueId: number, params?: { page?: number; size?: number }): Promise<Page<ReviewResponse>> => {
  const response = await api.get<Page<ReviewResponse>>(`/public/venues/${venueId}/reviews`, { params });
  return response.data;
};
