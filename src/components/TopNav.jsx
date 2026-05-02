import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Archive', path: '/free-vault' },
    { label: 'Courses', path: '/courses' },
    { label: 'Build Plans', path: '/invention-plans' },
    { label: 'Patents', path: '/patent-attorney-chat' },
    { label: 'Marketplace', path: '/ip-marketplace' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10" style={{ background: 'rgba(10,10,26,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png" alt="ZAT" className="h-8 w-8 rounded" />
          <div className="hidden sm:block">
            <span className="font-black text-sm text-white block">ZENITH APEX TECH</span>
            <span className="text-xs text-gray-400 tracking-widest leading-tight">TEST · EXPERIMENT · CONSTRUCT · HARNESS</span>
            <span className="text-xs text-gray-500 tracking-widest leading-tight">TRUST · EVOLVE · COMMUNITY · HONOR</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold transition-colors ${
                isActive(item.path)
                  ? 'text-cyan-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 hover:bg-gray-900 rounded transition-colors"
        >
          {open ? <X size={20} className="text-gray-400" /> : <Menu size={20} className="text-gray-400" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 bg-gray-950/80 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded text-sm font-bold transition-colors ${
                  isActive(item.path)
                    ? 'bg-cyan-900/30 text-cyan-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}