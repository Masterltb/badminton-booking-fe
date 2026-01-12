import { VenueStatus, CourtStatus } from '@/types/enums';

export interface CreateVenuePayload {
  name: string;
  description: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  openTime: string;
  closeTime: string;
  phoneContact: string;
  images: string[];
}

export interface CreateCourtPayload {
  name: string;
  pricePerHour: number;
  status: CourtStatus;
}

export interface PricingConfigPayload {
  startTime: string; // "06:00"
  endTime: string;   // "17:00"
  factor: number;    // 1.0, 1.2, 0.8
}

export interface PartnerStats {
  revenueThisMonth: number;
  bookingsToday: number;
  totalActiveVenues: number;
}