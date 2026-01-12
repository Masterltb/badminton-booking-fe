import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { OtpVerificationForm } from '@/features/auth/components/OtpVerificationForm';
import { VenueDetailPage } from '@/features/booking/pages/VenueDetailPage';
import { MyBookingsPage } from '@/features/booking/pages/MyBookingsPage';
import { VenueListPage } from '@/features/booking/pages/VenueListPage';
import { PaymentPage } from '@/features/booking/pages/PaymentPage';
import { DepositPage } from '@/features/wallet/pages/DepositPage';
import { WalletPage } from '@/features/wallet/pages/WalletPage';
import { ProfilePage } from '@/features/auth/pages/ProfilePage';
import { LandingPage } from '@/pages/LandingPage';
import { PartnerDashboardPage } from '@/features/partner/pages/PartnerDashboardPage';
import { PartnerCreateVenuePage } from '@/features/partner/pages/PartnerCreateVenuePage';
import { PartnerVenueConfigPage } from '@/features/partner/pages/PartnerVenueConfigPage';
import { PartnerBookingPage } from '@/features/partner/pages/PartnerBookingPage';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminVenuePage } from '@/features/admin/pages/AdminVenuePage';
import { Role } from '@/types/enums';

const SocialPage = () => <div className="p-4 bg-white rounded shadow">Trang Mạng xã hội (Feed)</div>;
const ShopPage = () => <div className="p-4 bg-white rounded shadow">Trang Cửa hàng (Shop)</div>;
const AdminDashboard = () => <div className="p-6"><h1>Dashboard Admin (Thống kê)</h1></div>; // Placeholder

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* App Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/social" element={<SocialPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/venues" element={<VenueListPage />} />
            <Route path="/venues/:id" element={<VenueDetailPage />} />
            
            {/* Protected Routes (User) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-bookings" element={<MyBookingsPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/deposit" element={<DepositPage />} />
            </Route>

            {/* Protected Routes (Partner/Owner) */}
            <Route element={<ProtectedRoute allowedRoles={[Role.OWNER]} />}>
               <Route path="/partner" element={<PartnerDashboardPage />} />
               <Route path="/partner/venues/new" element={<PartnerCreateVenuePage />} />
               <Route path="/partner/venues/:id/config" element={<PartnerVenueConfigPage />} />
               <Route path="/partner/bookings" element={<PartnerBookingPage />} />
            </Route>
          </Route>

          {/* Admin Routes (Custom Layout) */}
          <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN]} />}>
             <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="venues" element={<AdminVenuePage />} />
                <Route path="users" element={<div className="p-6">Quản lý User (Coming Soon)</div>} />
             </Route>
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="verify-otp" element={<OtpVerificationForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
