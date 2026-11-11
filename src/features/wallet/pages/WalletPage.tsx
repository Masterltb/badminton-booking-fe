import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMyWallet, getTransactions } from '../api/wallet';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, ArrowUpCircle, ArrowDownCircle, History, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const WalletPage = () => {
  const navigate = useNavigate();

  // 1. Get Wallet Balance
  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: ['wallet-me'],
    queryFn: getMyWallet,
  });

  // 2. Get Transactions
  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => getTransactions({ page: 0, size: 20 }),
  });

  if (loadingWallet) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-emerald-600" /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Wallet className="text-emerald-600" /> Ví của tôi
      </h1>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-emerald-100 text-sm font-medium mb-1 uppercase tracking-wider">Số dư khả dụng</p>
            <h2 className="text-4xl font-bold tracking-tight">
              {wallet ? formatCurrency(wallet.balance) : '---'}
            </h2>
          </div>
          
          <div className="flex gap-3">
             <Button 
               onClick={() => navigate('/deposit')}
               className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold px-6 py-6 shadow-lg border-0"
             >
               <Plus className="mr-2 h-5 w-5" /> Nạp tiền
             </Button>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <History size={18} /> Lịch sử giao dịch
          </h3>
        </div>

        <div className="divide-y divide-gray-100">
          {loadingTransactions ? (
             <div className="p-8 text-center text-gray-500">Đang tải lịch sử...</div>
          ) : transactions?.content?.length === 0 ? (
             <div className="p-12 text-center text-gray-400">Chưa có giao dịch nào</div>
          ) : (
            transactions?.content?.map((tx) => (
              <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'DEPOSIT' || tx.type === 'BOOKING_REFUND' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {tx.type === 'DEPOSIT' || tx.type === 'BOOKING_REFUND' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {tx.type === 'DEPOSIT' ? 'Nạp tiền vào ví' : 
                       tx.type === 'BOOKING_PAYMENT' ? 'Thanh toán đặt sân' : 
                       tx.type === 'BOOKING_REFUND' ? 'Hoàn tiền đặt sân' : tx.type}
                    </p>
                    <p className="text-xs text-gray-500">
                       {new Date(tx.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${
                    tx.type === 'DEPOSIT' || tx.type === 'BOOKING_REFUND' 
                      ? 'text-green-600' 
                      : 'text-gray-900'
                  }`}>
                  {tx.type === 'DEPOSIT' || tx.type === 'BOOKING_REFUND' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
