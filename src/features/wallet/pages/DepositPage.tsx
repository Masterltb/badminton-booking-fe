import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, ArrowLeft, Edit2, Lock } from 'lucide-react';

// Helper: Format Currency
export const DepositPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookingIdParam = searchParams.get('bookingId');
  const initialAmountParam = searchParams.get('amount');
  
  // State
  const [amount, setAmount] = useState<number>(initialAmountParam ? parseInt(initialAmountParam) : 50000);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  // Mode: If bookingId exists, we are in "Payment Mode", otherwise "Deposit Mode"
  const isPaymentMode = !!bookingIdParam;

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
                   <p className="text-pink-200 text-sm">Luồng thanh toán đang ở chế độ demo</p>
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
                       <p className="font-mono text-sm opacity-90 bg-white/10 inline-block px-2 py-1 rounded">Demo</p>
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
             
             <div className="text-center w-full max-w-md">
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-8 text-left">
                  <h2 className="text-lg font-bold text-amber-900">Chưa kết nối cổng thanh toán</h2>
                  <p className="mt-2 text-sm text-amber-800">
                    Mã QR demo đã được gỡ bỏ. Không chuyển tiền qua trang này; số dư chỉ được cập nhật sau khi tích hợp cổng thanh toán có xác thực.
                  </p>
                  <Button disabled className="mt-5 w-full" aria-describedby="payment-unavailable">
                    Thanh toán tạm thời chưa khả dụng
                  </Button>
                  <p id="payment-unavailable" className="mt-3 text-xs text-amber-700">
                    {isPaymentMode ? `Đơn đặt sân ${bookingIdParam} chưa được thanh toán.` : 'Tính năng nạp tiền đang chờ tích hợp nhà cung cấp.'}
                  </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
