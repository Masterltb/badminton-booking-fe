import api from '@/config/api';
import type { WalletResponse, TransactionResponse, DepositPayload, WithdrawPayload } from '../types';
import type { Page } from '@/types/backend';

export const getMyWallet = async (): Promise<WalletResponse> => {
  const response = await api.get<WalletResponse>('/wallets/me');
  return response.data;
};

export const deposit = async (data: DepositPayload): Promise<void> => {
  await api.post('/wallets/deposit', data);
};

export const requestWithdraw = async (data: WithdrawPayload): Promise<void> => {
  await api.post('/wallets/withdraw', data);
};

export const payBooking = async (bookingId: number): Promise<void> => {
  await api.post(`/wallets/pay-booking/${bookingId}`);
};

export const getTransactions = async (params?: { page?: number; size?: number }): Promise<Page<TransactionResponse>> => {
  const response = await api.get<Page<TransactionResponse>>('/wallets/transactions', { params });
  return response.data;
};
