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
}

export interface CreateCourtPayload {
  name: string;
}

export interface PricingConfigPayload {
  courtId: number | null;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  priority: number;
  daysOfWeek: string;
}

export interface PartnerStats {
  revenueThisMonth: number;
  bookingsToday: number;
  totalActiveVenues: number;
}
