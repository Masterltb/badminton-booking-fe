import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Users,
  Trophy,
  ArrowRight,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

import { Role } from "@/types/enums";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Đặt sân", href: "/venues" },
    { label: "Cộng đồng", href: "/social" },
    { label: "Giải đấu", href: "#" }, // Placeholder for now
    { label: "Cửa hàng", href: "/shop" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center text-slate-950 font-black text-xl shadow-[0_0_15px_rgba(163,230,53,0.5)] group-hover:scale-105 transition-transform">
            B
          </div>
          <span className="text-2xl font-bold text-white tracking-tighter">
            BaekJaeBin-Badminton<span className="text-lime-400">Booking</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-2.5 rounded-full border border-white/10 backdrop-blur-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-slate-300 hover:text-white hover:scale-105 transition-all"
            >
              {item.label}
            </Link>
          ))}
          {user?.role === Role.OWNER && (
            <Link
              to="/partner"
              className="text-sm font-bold text-lime-400 hover:text-lime-300 hover:scale-105 transition-all"
            >
              Quản lý sân
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
               <span className="text-white font-bold">Hi, {user.fullName}</span>
               <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => logout()}
                  className="text-slate-300 hover:text-red-500 hover:bg-white/10 rounded-full"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </Button>
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-slate-300 hover:text-white font-medium transition-colors"
              >
                Log In
              </Link>
              <Link to="/auth/register">
                <Button className="bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold rounded-full px-6 shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] transition-all transform hover:-translate-y-0.5">
                  Sign Up <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-slate-950 border-b border-white/10 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-slate-300 hover:text-lime-400 font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {user?.role === Role.OWNER && (
                <Link
                  to="/partner"
                  className="block text-lime-400 font-bold text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Quản lý sân
                </Link>
              )}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                {user ? (
                   <button 
                     onClick={() => logout()}
                     className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-lg border border-red-500/50 text-red-400 font-bold hover:bg-red-500/10"
                   >
                     <LogOut size={18} /> Đăng xuất
                   </button>
                ) : (
                  <>
                    <Link
                      to="/auth/login"
                      className="flex items-center justify-center py-3 rounded-lg border border-white/20 text-white font-bold"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/auth/register"
                      className="flex items-center justify-center py-3 rounded-lg bg-lime-400 text-slate-950 font-bold"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    navigate(`/venues?keyword=${encodeURIComponent(keyword)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center text-center px-4">
      {/* Abstract Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lime-500/20 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/20 blur-[120px] rounded-full -z-10 pointer-events-none" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-lime-400 text-sm font-bold mb-8 backdrop-blur-sm"
      >
        <Sparkles size={14} /> #1 Booking Platform in Vietnam
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight mb-8 leading-[1.1]"
      >
        Level Up Your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">
          Badminton Game
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium"
      >
        Tìm sân nhanh. Đặt lịch dễ. Kết nối đối thủ xứng tầm.{" "}
        <br className="hidden md:block" />
        Trải nghiệm thể thao chưa bao giờ{" "}
        <span className="text-white">chuyên nghiệp</span> đến thế.
      </motion.p>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-4xl bg-slate-900/50 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-2"
      >
        <div className="flex-1 bg-slate-800/50 hover:bg-slate-800 rounded-2xl p-3 transition-colors group cursor-text">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-lime-400/20 group-hover:text-lime-400 transition-colors text-slate-400">
              <MapPin size={20} />
            </div>
            <div className="text-left w-full">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Tìm kiếm
              </div>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-none p-0 h-auto bg-transparent text-white placeholder:text-slate-500 font-semibold focus-visible:ring-0"
                placeholder="Nhập tên sân, địa chỉ..."
              />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-800/50 hover:bg-slate-800 rounded-2xl p-3 transition-colors group cursor-text opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
              <Calendar size={20} />
            </div>
            <div className="text-left w-full">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Ngày chơi
              </div>
              <Input
                type="date"
                disabled
                className="border-none p-0 h-auto bg-transparent text-white placeholder:text-slate-500 font-semibold focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-800/50 hover:bg-slate-800 rounded-2xl p-3 transition-colors group cursor-text opacity-50 cursor-not-allowed">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-slate-700/50 rounded-lg text-slate-400">
              <Clock size={20} />
            </div>
            <div className="text-left w-full">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                Giờ
              </div>
              <Input
                type="time"
                disabled
                className="border-none p-0 h-auto bg-transparent text-white placeholder:text-slate-500 font-semibold focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        </div>

        <Button 
            onClick={handleSearch}
            className="h-auto py-4 md:py-0 px-8 rounded-2xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-black text-lg shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-105 transition-all"
        >
          <Search className="mr-2" strokeWidth={3} />
          Tìm Sân
        </Button>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 pt-8 border-t border-white/5 w-full max-w-5xl"
      >
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-6">
          Được tin dùng bởi 500+ CLB tại Việt Nam
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Placeholders for partner logos */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-24 bg-white/20 rounded animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const BentoGrid = () => {
  return (
    <section className="py-20 px-4 bg-slate-950">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Mọi thứ bạn cần.{" "}
            <span className="text-violet-400">All-in-One.</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Hệ sinh thái cầu lông toàn diện nhất hiện nay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Main Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1626224583764-847890e0e99b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-400/20 text-lime-400 rounded-full text-sm font-bold mb-4 backdrop-blur-md border border-lime-400/20">
                <Zap size={14} className="fill-lime-400" /> Instant Booking
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Đặt sân siêu tốc trong 30s
              </h3>
              <p className="text-slate-300 text-lg max-w-md mb-6">
                Không cần gọi điện. Kiểm tra lịch trống thời gian thực và thanh
                toán bảo mật ngay trên ứng dụng.
              </p>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white hover:text-slate-950 font-bold rounded-xl h-12 px-6"
              >
                Khám phá ngay
              </Button>
            </div>
          </motion.div>

          {/* Secondary Card 1 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-white/10 p-8 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-32 bg-violet-500/10 blur-[60px] rounded-full" />
            <Users className="w-12 h-12 text-violet-400 mb-4" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Tìm đối thủ</h3>
              <p className="text-slate-400 text-sm">
                Hệ thống ghép cặp thông minh dựa trên trình độ.
              </p>
            </div>
          </motion.div>

          {/* Secondary Card 2 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-white/10 p-8 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-32 bg-pink-500/10 blur-[60px] rounded-full" />
            <Trophy className="w-12 h-12 text-pink-400 mb-4" />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Giải đấu & Ranking
              </h3>
              <p className="text-slate-400 text-sm">
                Tham gia giải đấu, tích điểm và leo bảng xếp hạng.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center text-slate-950 font-black text-lg">
                B
              </div>
              <span className="text-xl font-bold text-white">
                Badminton<span className="text-lime-400">Booking</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Nền tảng công nghệ giúp bạn thỏa mãn đam mê cầu lông. Kết nối, thi
              đấu và tận hưởng.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Instagram", "Tiktok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-lime-400 hover:text-slate-950 transition-all"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Khám phá</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Sân cầu lông Hà Nội
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Sân cầu lông TP.HCM
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Tìm đối thủ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Cửa hàng dụng cụ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Công ty</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Điều khoản
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-lime-400 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} Badminton Booking System. Designed with{" "}
          <span className="text-red-500">♥</span> for Sports.
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-lime-400 selection:text-slate-950">
      <Navbar />
      <main>
        <Hero />
        <BentoGrid />
      </main>
      <Footer />
    </div>
  );
};