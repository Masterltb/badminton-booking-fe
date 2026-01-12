import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, ShoppingBag, Users, LayoutGrid, Store, Wallet, User, Calendar } from 'lucide-react';
import { useState } from 'react';
import { Role } from '@/types/enums';
import { useQuery } from '@tanstack/react-query';
import { getMyWallet } from '@/features/wallet/api/wallet';

export const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: getMyWallet,
    enabled: !!user,
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* 1. Logo (Left) */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Badminton<span className="text-emerald-600">Booking</span>
            </span>
          </Link>

          {/* 2. Menu (Center) */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-gray-50/80 rounded-full border border-gray-100 shadow-sm">
            <NavLink to="/" icon={<LayoutGrid size={18} />} label="Đặt sân" active={isActive('/')} />
            <NavLink to="/social" icon={<Users size={18} />} label="Cộng đồng" active={isActive('/social')} />
            <NavLink to="/shop" icon={<ShoppingBag size={18} />} label="Cửa hàng" active={isActive('/shop')} />
            {user?.role === Role.OWNER && (
              <NavLink to="/partner" icon={<Store size={18} />} label="Quản lý sân" active={location.pathname.startsWith('/partner')} />
            )}
          </nav>

          {/* 3. Login/User (Right) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/wallet" 
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                  title="Ví của tôi"
                >
                  <Wallet size={18} className="text-emerald-600" />
                  <span className="text-sm font-bold text-gray-700">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wallet?.balance || 0)}
                  </span>
                </Link>

                {/* User Dropdown */}
                <div className="relative" onMouseEnter={() => setIsUserMenuOpen(true)} onMouseLeave={() => setIsUserMenuOpen(false)}>
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100 hover:bg-emerald-50 transition-all"
                    >
                       {user.avatarUrl ? (
                           <img src={user.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
                       ) : (
                           <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                             {user.fullName.charAt(0).toUpperCase()}
                           </div>
                       )}
                       <span className="text-sm font-bold text-gray-700 max-w-[150px] truncate">{user.fullName}</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 top-full pt-2 w-48 z-50">
                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600">
                                    <User size={16} /> Hồ sơ cá nhân
                                </Link>
                                <Link to="/my-bookings" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-600">
                                    <Calendar size={16} /> Lịch sử đặt sân
                                </Link>
                                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                                <button 
                                    onClick={() => logout()} 
                                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth/login">
                  <Button className="rounded-full font-bold bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow px-6">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="rounded-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg px-6">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
            <Link to="/" className="block py-2.5 px-4 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium hover:text-emerald-600">Đặt sân</Link>
            <Link to="/social" className="block py-2.5 px-4 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium hover:text-emerald-600">Cộng đồng</Link>
            <Link to="/shop" className="block py-2.5 px-4 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium hover:text-emerald-600">Cửa hàng</Link>
            {user?.role === Role.OWNER && (
              <Link to="/partner" className="block py-2.5 px-4 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium hover:text-emerald-600">Quản lý sân</Link>
            )}
            <div className="border-t border-gray-100 pt-4">
              {user ? (
                 <button onClick={() => logout()} className="flex items-center gap-2 text-red-600 font-medium px-4 py-2 w-full text-left hover:bg-red-50 rounded-lg">
                   <LogOut size={18} /> Đăng xuất
                 </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/auth/login" className="text-center py-2.5 border border-gray-200 rounded-full font-bold text-gray-700">Đăng nhập</Link>
                  <Link to="/auth/register" className="text-center py-2.5 bg-emerald-600 text-white rounded-full font-bold shadow">Đăng ký</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h4 className="font-bold text-xl text-gray-900">Badminton<span className="text-emerald-600">Booking</span></h4>
            <p className="text-gray-500 leading-relaxed">
              Nền tảng đặt sân cầu lông hiện đại nhất. Kết nối niềm đam mê thể thao của bạn.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Về chúng tôi</h4>
            <ul className="space-y-3 text-gray-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Điều khoản sử dụng</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-gray-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Kết nối</h4>
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">F</div>
               <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer">I</div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 border-t border-gray-100 mt-12 pt-8 text-center text-gray-400">
          © {new Date().getFullYear()} Badminton Booking System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`
      flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200
      ${active 
        ? 'bg-emerald-600 text-white shadow-md' 
        : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
      }
    `}
  >
    {icon}
    {label}
  </Link>
);