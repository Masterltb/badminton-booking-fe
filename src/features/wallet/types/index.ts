export interface WalletResponse {
  id: number;
  balance: number;
  currency: string;
}

export interface TransactionResponse {
  id: number;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW' | 'BOOKING_PAYMENT' | 'BOOKING_REFUND' | 'SETTLEMENT';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  description: string;
  createdAt: string; // ISO
}

export interface DepositPayload {
  amount: number;
}

export interface WithdrawPayload {
  amount: number;
  bankInfo: string;
}