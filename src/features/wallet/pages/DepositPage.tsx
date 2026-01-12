import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deposit, payBooking } from '@/features/wallet/api/wallet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Clock, Smartphone, CheckCircle2, ArrowLeft, Copy, Edit2, Lock } from 'lucide-react';

// Helper: Format Currency
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const DepositPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const bookingIdParam = searchParams.get('bookingId');
  const initialAmountParam = searchParams.get('amount');
  
  // State
  const [amount, setAmount] = useState<number>(initialAmountParam ? parseInt(initialAmountParam) : 50000);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Mode: If bookingId exists, we are in "Payment Mode", otherwise "Deposit Mode"
  const isPaymentMode = !!bookingIdParam;
  const transferContent = isPaymentMode ? `THANH TOAN DON ${bookingIdParam}` : `NAP ${amount} VND`;

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Mutation 1: Deposit
  const depositMutation = useMutation({
    mutationFn: deposit,
    onSuccess: async () => {
      // If Payment Mode, proceed to Pay Booking
      if (isPaymentMode && bookingIdParam) {
         payBookingMutation.mutate(parseInt(bookingIdParam));
      } else {
         alert("Nạp tiền thành công! Số dư đã được cập nhật.");
         queryClient.invalidateQueries({ queryKey: ['wallet-me'] });
         navigate('/wallet');
      }
    },
    onError: (err: any) => alert(err.message || "Nạp tiền thất bại.")
  });

  // Mutation 2: Pay Booking (Chained after Deposit)
  const payBookingMutation = useMutation({
     mutationFn: payBooking,
     onSuccess: () => {
        alert("Thanh toán đơn hàng thành công!");
        queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
        navigate('/my-bookings');
     },
     onError: (err: any) => {
        alert("Nạp tiền thành công nhưng thanh toán đơn hàng thất bại: " + err.message);
        navigate('/my-bookings'); // Still redirect to bookings
     }
  });

  const isLoading = depositMutation.isPending || payBookingMutation.isPending;

  const qrData = `2|99|0987654321|MOMO|0|0|0|${amount}|${transferContent}|transfer_myqr`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="bg-[#a50064] min-h-screen flex items-center justify-center p-4 font-sans">
       <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
          
          {/* Left: Order Details (MoMo Pink Theme) */}
          <div className="bg-gradient-to-br from-[#d82d8b] to-[#a50064] text-white p-10 md:w-5/12 flex flex-col justify-between relative overflow-hidden">
             {/* Abstract Shapes */}
             <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full border-[20px] border-white/10 blur-sm"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-2xl"></div>

             <div className="relative z-10">
                <Button variant="ghost" className="p-0 text-white/80 hover:text-white mb-8 hover:bg-transparent" onClick={() => navigate(-1)}>
                   <ArrowLeft className="mr-2" size={20} /> Quay lại
                </Button>
                
                <div className="mb-8">
                   <h1 className="text-3xl font-bold mb-1">Thanh toán</h1>
                   <p className="text-pink-200 text-sm">Qua Ví MoMo (Giả lập)</p>
                </div>
                
                <div className="space-y-6 border-t border-white/20 pt-6">
                   <div>
                      <p className="text-pink-200 text-xs uppercase tracking-wider mb-1">Nhà cung cấp</p>
                      <p className="font-semibold text-lg">Badminton Booking System</p>
                   </div>
                   <div>
                      <p className="text-pink-200 text-xs uppercase tracking-wider mb-2">Số tiền thanh toán</p>
                      
                      {/* Input Amount */}
                      <div className="relative">
                          <Input 
                             type="number"
                             value={amount}
                             onChange={(e) => setAmount(Number(e.target.value))}
                             disabled={isPaymentMode}
                             className="bg-white/10 border-white/20 text-white text-3xl font-bold h-16 pl-4 pr-10 focus:ring-pink-400 focus:border-pink-400 disabled:opacity-80 disabled:cursor-not-allowed"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50">
                             {isPaymentMode ? <Lock size={20} /> : <Edit2 size={20} />}
                          </div>
                      </div>
                      {isPaymentMode && <p className="text-xs text-pink-200 mt-2 italic">*Số tiền cố định theo đơn hàng</p>}
                   </div>
                   <div>
                       <p className="text-pink-200 text-xs uppercase tracking-wider mb-1">Mã giao dịch</p>
                       <p className="font-mono text-sm opacity-90 bg-white/10 inline-block px-2 py-1 rounded">MM{Date.now().toString().slice(-8)}</p>
                   </div>
                </div>
             </div>

             <div className="relative z-10 mt-12 bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                 <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
                    <Clock size={16} />
                    <span>Đơn hàng hết hạn sau</span>
                 </div>
                 <div className="text-3xl font-mono font-bold text-white">
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                 </div>
             </div>
          </div>

          {/* Right: Scan QR Interface */}
          <div className="p-10 md:w-7/12 bg-gray-50 relative flex flex-col items-center">
             
             <div className="w-full flex justify-center mb-8">
                <div className="bg-white p-4 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 relative group">
                   <img src={qrUrl} alt="MoMo QR" className="w-64 h-64 object-contain rounded-xl" />
                   
                   {/* Logo overlay */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1.5 rounded-lg shadow-sm">
                      <div className="w-8 h-8 bg-[#a50064] rounded-md flex items-center justify-center text-white font-bold text-xs">
                         MoMo
                      </div>
                   </div>
                   
                   {/* Scan animation */}
                   <div className="absolute left-4 right-4 top-4 h-0.5 bg-[#a50064] shadow-[0_0_15px_#a50064] animate-[scan_2.5s_ease-in-out_infinite] opacity-80"></div>
                </div>
             </div>

             <div className="text-center w-full max-w-md">
                <h2 className="text-gray-900 font-bold text-xl mb-2">Quét mã để thanh toán</h2>
                <p className="text-gray-500 text-sm mb-8">
                   Sử dụng App <span className="text-[#a50064] font-bold">MoMo</span> hoặc ứng dụng Camera hỗ trợ QR Code để quét mã.
                </p>

                {/* Transfer Content Box */}
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-4 mb-8 flex items-center justify-between group hover:border-[#a50064] transition-colors cursor-pointer"
                     onClick={() => { navigator.clipboard.writeText(transferContent); alert("Đã sao chép nội dung!"); }}
                >
                   <div className="text-left">
                      <p className="text-xs text-gray-500 uppercase font-semibold">Nội dung chuyển khoản</p>
                      <p className="text-[#a50064] font-bold font-mono text-lg">{transferContent}</p>
                   </div>
                   <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-[#a50064]">
                      <Copy size={20} />
                   </Button>
                </div>

                {/* Action Button */}
                <Button 
                   onClick={() => depositMutation.mutate({ amount })}
                   disabled={isLoading}
                   className="w-full bg-[#a50064] hover:bg-[#8e0056] text-white font-bold py-6 text-lg rounded-xl shadow-lg shadow-pink-200 transition-all active:scale-[0.98]"
                >
                   {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                   {isLoading ? 'Đang xử lý...' : 'Xác nhận đã thanh toán'}
                </Button>
                
                <p className="text-xs text-gray-400 mt-4">
                   *Bấm vào nút trên sau khi bạn đã chuyển khoản thành công trên điện thoại.
                </p>
             </div>
          </div>
       </div>
       <style>{`
         @keyframes scan {
           0% { top: 4%; opacity: 0; }
           10% { opacity: 1; }
           90% { opacity: 1; }
           100% { top: 96%; opacity: 0; }
         }
       `}</style>
    </div>
  );
};
