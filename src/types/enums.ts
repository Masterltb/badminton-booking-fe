export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export enum VenueStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

export enum BookingStatus {
  PENDING_PAY = 'PENDING_PAY',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  CHECKED_IN = 'CHECKED_IN',
}

export enum PaymentMethod {
  VNPAY = 'VNPAY',
  WALLET = 'WALLET',
  CASH = 'CASH',
}
