import { TransactionType, TransactionStatus } from '@/types/enums';

export interface WalletResponse {
  id: number;
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'LOCKED';
}

/**
 * Metadata chứa thông tin chi tiết linh hoạt cho từng loại giao dịch.
 * Ví dụ: 
 * - Rút tiền: Tên ngân hàng, số tài khoản.
 * - Booking: Mã đặt sân, tên sân.
 */
export interface TransactionMetadata {
  bookingId?: string;
  bookingCode?: string;     // Mã booking (nếu có)
  courtName?: string;       // Tên sân (cho transaction liên quan booking)
  bankName?: string;        // Cho giao dịch Rút tiền
  bankAccountNumber?: string; // Cho giao dịch Rút tiền
  bankAccountName?: string;   // Tên chủ tài khoản
  reason?: string;          // Lý do hoàn tiền hoặc từ chối rút tiền
}

export interface Transaction {
  id: string; // UUID
  walletId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  
  // Metadata mở rộng để hiển thị chi tiết như yêu cầu
  metadata?: TransactionMetadata; 
  
  referenceId?: string; // ID tham chiếu (BookingID, OrderID, VNPAY_ID)
  createdAt: string; // ISO Date
  updatedAt: string;
}

export interface DepositPayload {
  amount: number;
  paymentMethod: 'VNPAY' | 'BANK_TRANSFER';
}

export interface WithdrawPayload {
  amount: number;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface TransactionFilter {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  status?: TransactionStatus;
}
