import { Menu, X, BookOpen, Zap, Wrench, Shield, Home, DollarSign, LayoutDashboard, User, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

function useSafeAuth() {
  try {
    return useAuth();
  } catch {
    return { isAuthenticated: false };
  }
}

const PUBLIC_NAV = [
  { label: 'Home', path: '/codextech', icon: <Home size={18} /> },
  { label: 'Research', path: '/codextech-database', icon: <BookOpen size={18} /> },
  { label: 'Pricing', path: '/codextech-pricing', icon: <DollarSign size={18} /> },
  { label: 'Login', path: '/login', icon: <LogIn size={18} /> },
];

const MEMBER_NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Research', path: '/codextech-database', icon: <BookOpen size={18} /> },
  { label: 'Build Plans', path: '/build-plans', icon: <Wrench size={18} /> },
  { label: 'Patent Intelligence', path: '/patent-intelligence', icon: <Shield size={18} /> },
  { label: 'Account', path: '/account', icon: <User size={18} /> },
];

export default function SidebarNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useSafeAuth();

  const navItems = isAuthenticated ? MEMBER_NAV : PUBLIC_NAV;
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-900 rounded transition-colors"
      >
        {open ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-gray-950 z-40 overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-700">
          <Link to="/codextech" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png"
              alt="ZAT"
              className="h-8 w-8 rounded"
            />
            <div>
              <div className="font-black text-white text-sm">ZENITH</div>
              <div className="text-gray-500 text-xs">APEX TECH</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-600'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}