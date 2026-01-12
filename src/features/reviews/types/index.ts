export interface ReviewPayload {
  bookingId: number;
  rating: number; // 1-5
  comment: string;
}

export interface ReviewResponse {
  id: number;
  bookingId: number;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatar: string;
  createdAt: string;
}
