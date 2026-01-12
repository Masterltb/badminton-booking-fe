import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { LayoutDashboard, MapPin, Users, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AdminLayout = () => {
  const { logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Quản lý Sân', icon: MapPin, path: '/admin/venues' },
    { label: 'Người dùng', icon: Users, path: '/admin/users' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-gray-900 text-white transition-all duration-300 flex flex-col fixed md:relative z-20 h-full",
          isSidebarOpen ? "w-64" : "w-0 md:w-20 overflow-hidden"
        )}
      >
        <div className="p-4 flex items-center justify-between">
          <span className={cn("font-bold text-xl text-lime-400", !isSidebarOpen && "hidden md:block")}>Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 hover:bg-gray-800 transition-colors",
                  isActive && "bg-gray-800 border-l-4 border-lime-500 text-lime-400"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                <span className={cn("ml-3 whitespace-nowrap", !isSidebarOpen && "hidden md:hidden")}>
                    {item.label}
                </span>
                {/* Tooltip for collapsed mode */}
                {!isSidebarOpen && (
                   <span className="hidden md:block ml-4 absolute left-16 bg-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100">
                      {item.label}
                   </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center text-gray-400 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span className={cn("ml-3", !isSidebarOpen && "hidden")}>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 justify-between">
           <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600">
              <Menu size={24} />
           </button>
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-700 font-bold">A</div>
              <span className="font-medium text-sm">Administrator</span>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
           <Outlet />
        </main>
      </div>
    </div>
  );
};
