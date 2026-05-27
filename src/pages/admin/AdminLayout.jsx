import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles, LayoutDashboard, Scissors, Tag, Image,
  CalendarCheck, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/offers', icon: Tag, label: 'Offers' },
  { to: '/admin/gallery', icon: Image, label: 'Gallery' },
  { to: '/admin/appointments', icon: CalendarCheck, label: 'Appointments' },
];

export default function AdminLayout({ children }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const isActive = (path) => location.pathname === path;

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-white text-base leading-none">Krisha</p>
            <p className="text-pink-200 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive(to)
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-pink-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{label}</span>
            {isActive(to) && <ChevronRight className="w-4 h-4" />}
          </Link>
        ))}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-white/10">
        {user && (
          <p className="text-pink-200 text-xs mb-3 px-2 truncate">{user.email}</p>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-pink-100 hover:bg-red-500/30 hover:text-white text-sm font-medium transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gradient-to-b from-rose-700 to-pink-800 fixed top-0 left-0 h-full z-50 shadow-2xl">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 bg-gradient-to-b from-rose-700 to-pink-800 h-full shadow-2xl z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-base">
              {NAV_ITEMS.find(n => n.to === location.pathname)?.label || 'Admin'}
            </h2>
          </div>
          <Link
            to="/"
            className="text-xs text-rose-500 hover:text-rose-700 font-medium"
            target="_blank"
          >
            View Site →
          </Link>
        </div>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
