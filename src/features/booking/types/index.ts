import { PaymentMethod } from '@/types/enums';

export interface CreateBookingPayload {
  courtId: number;
  startTime: string; // ISO 8601 or "HH:mm:ss" depending on backend
  endTime: string;
  paymentMethod: PaymentMethod;
}

export interface BookingSchedulePayload {
  courtId: number;
  startTime: string; // HH:mm:ss
  endTime: string;   // HH:mm:ss
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  daysOfWeek: string[]; // ["MONDAY", "TUESDAY", ...]
  paymentMethod: PaymentMethod;
}

export interface BookingSlot {
  id: string;
  courtId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}
