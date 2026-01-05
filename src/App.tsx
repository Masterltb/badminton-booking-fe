import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { VenueDetailPage } from '@/features/booking/pages/VenueDetailPage';
import { MyBookingsPage } from '@/features/booking/pages/MyBookingsPage';
import { LandingPage } from '@/pages/LandingPage';

const SocialPage = () => <div className="p-4 bg-white rounded shadow">Trang Mạng xã hội (Feed)</div>;
const ShopPage = () => <div className="p-4 bg-white rounded shadow">Trang Cửa hàng (Shop)</div>;

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
          {/* Public Routes - Landing Page stands alone without MainLayout's header/footer if it has its own, 
              but based on request, LandingPage has its own Navbar/Footer. 
              So we should take it OUT of MainLayout or update MainLayout.
              Looking at LandingPage code, it HAS Navbar and Footer.
              So it should be outside MainLayout.
           */}
          <Route path="/" element={<LandingPage />} />

          {/* Other App Routes wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/social" element={<SocialPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/venues/:id" element={<VenueDetailPage />} />
            
            {/* Protected Routes (Require Login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/my-bookings" element={<MyBookingsPage />} />
            </Route>
          </Route>

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
