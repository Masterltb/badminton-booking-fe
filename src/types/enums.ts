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
  PENDING_PAY = 'PENDING_PAY', // Vừa tạo, chờ thanh toán
  CONFIRMED = 'CONFIRMED',     // Đã thanh toán thành công (Tiền vào Ví Hệ Thống)
  CANCELLED = 'CANCELLED',     // Đã hủy
  COMPLETED = 'COMPLETED',     // Đã hoàn thành (Đã đá xong, nhưng chưa check-in/đối soát)
  CHECKED_IN = 'CHECKED_IN',   // Khách đến sân, chủ sân check-in -> ĐỐI SOÁT TIỀN NGAY LÚC NÀY
  BLOCKED = 'BLOCKED',         // Sân bị khóa (admin/chủ sân khóa slot)
}

export enum PaymentMethod {
  VNPAY = 'VNPAY',
  WALLET = 'WALLET',
  CASH = 'CASH',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',               // Nạp tiền (VNPAY -> User Wallet)
  WITHDRAW = 'WITHDRAW',             // Rút tiền (User/Owner Wallet -> Bank)
  BOOKING_PAYMENT = 'BOOKING_PAYMENT', // Thanh toán đặt sân (User Wallet -> System Wallet)
  BOOKING_REFUND = 'BOOKING_REFUND',   // Hoàn tiền (System Wallet -> User Wallet)
  BOOKING_PAYOUT = 'BOOKING_PAYOUT',   // Đối soát/Trả tiền chủ sân (System Wallet -> Owner Wallet)
}

export enum TransactionStatus {
  PENDING = 'PENDING',     // Đang xử lý (Chờ VNPAY, chờ Admin duyệt rút)
  SUCCESS = 'SUCCESS',     // Thành công
  FAILED = 'FAILED',       // Thất bại
  CANCELLED = 'CANCELLED', // Hủy bỏ
}
