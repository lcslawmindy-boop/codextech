import { Menu, X, BookOpen, Wrench, Shield, Home, LayoutDashboard, User, Zap, Database, FileText } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

function useSafeAuth() {
  try { return useAuth(); } catch { return { isAuthenticated: false }; }
}

const PUBLIC_NAV = [
  { label: 'Home', path: '/', icon: <Home size={18} /> },
  { label: 'Research', path: '/codextech-database', icon: <Database size={18} /> },
  { label: 'Pricing', path: '/pricing', icon: <Zap size={18} /> },
];

const MEMBER_NAV = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'Research', path: '/codextech-database', icon: <Database size={18} /> },
  { label: 'Build Plans', path: '/build-plans', icon: <Wrench size={18} /> },
  { label: 'Patent Tool', path: '/patent-tool', icon: <Shield size={18} /> },
  { label: 'Source Docs', path: '/source-documents', icon: <FileText size={18} /> },
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
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 hover:bg-gray-900 rounded transition-colors"
        style={{ minHeight: 44 }}
      >
        {open ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
      </button>

      <div
        className={`fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-gray-950 z-40 overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="p-4 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png"
              alt="ZAT"
              className="h-8 w-8 rounded object-contain"
            />
            <div>
              <div className="font-black text-white text-sm">ZENITH APEX</div>
              <div className="text-gray-500 text-xs">RESEARCH PLATFORM</div>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-800'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.label}</span>
            </Link>
          ))}
        </nav>

        {!isAuthenticated && (
          <div className="p-4 mt-4 border-t border-gray-800">
            <Link
              to="/pricing"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-black text-sm text-black transition-all hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)" }}
            >
              <Zap size={14} /> Join — $49/mo
            </Link>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setOpen(false)} />
      )}
    </>
  );
}