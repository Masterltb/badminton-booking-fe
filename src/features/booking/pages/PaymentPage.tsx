import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookingById } from '../api/venue';
import { getMyWallet, payBooking, deposit } from '@/features/wallet/api/wallet';
import { Button } from '@/components/ui/button';
import { PaymentMethod } from '@/types/enums';
import { Loader2, Wallet, CheckCircle2 } from 'lucide-react';

// Helper: Format Currency
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// --- COMPONENT: Wallet Payment ---
const WalletPaymentUI = ({ booking, wallet, onPay, loading, onDeposit, depositing }: { 
    booking: any, 
    wallet: any, 
    onPay: () => void, 
    loading: boolean,
    onDeposit: (amount: number) => void,
    depositing: boolean
}) => {
   const balance = wallet?.balance || 0;
   const canPay = balance >= booking.totalPrice;
   const missingAmount = booking.totalPrice - balance;

   return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
             <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center">
                <p className="opacity-80 text-sm mb-1">Thanh toán đơn hàng</p>
                <h2 className="text-3xl font-bold">{formatCurrency(booking.totalPrice)}</h2>
             </div>
             
             <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                         <Wallet className="text-blue-500" size={20} />
                      </div>
                      <div>
                         <p className="font-medium text-gray-900">Ví Badminton</p>
                         <p className="text-xs text-gray-500">Số dư: {wallet ? formatCurrency(wallet.balance) : '...'}</p>
                      </div>
                   </div>
                   {canPay ? <CheckCircle2 className="text-green-500" /> : <div className="text-xs text-red-500 font-bold">Không đủ</div>}
                </div>

                <div className="space-y-3">
                    {canPay ? (
                        <Button 
                           className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                           onClick={onPay}
                           disabled={loading}
                        >
                           {loading ? <Loader2 className="animate-spin" /> : "Xác nhận Thanh toán"}
                        </Button>
                    ) : (
                        <Button 
                           variant="destructive" 
                           className="w-full py-6"
                           onClick={() => onDeposit(missingAmount)}
                           disabled={depositing}
                        >
                           {depositing ? <Loader2 className="animate-spin" /> : `Nạp thêm ${formatCurrency(missingAmount)}`}
                        </Button>
                    )}
                </div>
             </div>
         </div>
      </div>
   );
};

// --- MAIN PAGE ---
export const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: booking, isLoading: loadingBooking } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });

  const { data: wallet, isLoading: loadingWallet } = useQuery({
    queryKey: ['wallet-me'],
    queryFn: getMyWallet,
  });

  const payMutation = useMutation({
    mutationFn: payBooking,
    onSuccess: () => {
       alert("Thanh toán thành công!");
       queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
       navigate('/my-bookings');
    },
    onError: (err: any) => alert(err.message || "Thanh toán thất bại")
  });

  const depositMutation = useMutation({
    mutationFn: deposit,
    onSuccess: () => {
        alert("Nạp tiền thành công!");
        queryClient.invalidateQueries({ queryKey: ['wallet-me'] });
    },
    onError: (err: any) => alert(err.message || "Nạp tiền thất bại")
  });

  if (loadingBooking || loadingWallet) return (
     <div className="h-screen flex items-center justify-center flex-col gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-lime-600" />
        <p className="text-gray-500 font-medium">Đang tải thông tin...</p>
     </div>
  );

  if (!booking) return <div>Không tìm thấy đơn hàng</div>;

  // Since VNPAY redirects, this page is mainly for WALLET or Error handling
  if (booking.paymentMethod === PaymentMethod.VNPAY) {
      // Redirect to Mock MoMo Page (DepositPage) but in "Payment Mode"
      // This allows testing VNPAY flow using the Mock Gateway
      return (
          <div className="flex items-center justify-center h-screen">
             <div className="text-center">
                 <p className="mb-4">Đơn hàng này cần thanh toán qua VNPAY.</p>
                 <Button onClick={() => navigate(`/wallet/deposit?bookingId=${booking.id}&amount=${booking.totalPrice}`)}>
                    Thanh toán ngay (Giả lập MoMo)
                 </Button>
             </div>
          </div>
      );
  }

  return (
    <WalletPaymentUI 
        booking={booking} 
        wallet={wallet} 
        onPay={() => payMutation.mutate(bookingId)} 
        loading={payMutation.isPending}
        onDeposit={(amount) => depositMutation.mutate({ amount })}
        depositing={depositMutation.isPending}
    />
  );
};
