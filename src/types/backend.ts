import { Role, UserStatus, VenueStatus, BookingStatus, PaymentMethod } from './enums';

// Types for Backend Responses

export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  role: Role;
  status: UserStatus;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface VenueResponse {
  id: number;
  name: string;
  description: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  openTime: string; // "HH:mm:ss"
  closeTime: string; // "HH:mm:ss"
  phoneContact: string;
  status: VenueStatus;
  averageRating: number;
  totalReviews: number;
  thumbnail: string;
  images: string[];
  courts?: CourtResponse[]; // Optional depending on detail view
}

export interface CourtSlot {
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
}

export interface CourtResponse {
  id: number;
  name: string;
  venueId: number;
  status: string; 
  pricePerHour: number;
  occupiedSlots?: CourtSlot[];
}

export interface BookingResponse {
  id: number;
  courtId: number;
  courtName: string;
  venueName: string;
  venueAddress: string;
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  totalPrice: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  checkinCode: string | null;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
}
