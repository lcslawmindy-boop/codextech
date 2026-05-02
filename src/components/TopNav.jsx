import { Menu, X, BookOpen, Zap, Lightbulb, ShoppingCart, Gavel, Palette, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBackgroundMode } from './BackgroundModeControl';
import { useZenithTheme } from '@/lib/ZenithThemeContext';

export default function TopNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { mode, setMode } = useBackgroundMode();
  const { currentTheme, themes, setCurrentTheme } = useZenithTheme();

  const navItems = [
    { label: 'Home', path: '/', icon: <Zap size={16} /> },
    { label: 'Archive', path: '/free-vault', icon: <BookOpen size={16} /> },
    { label: 'Courses', path: '/courses', icon: <Lightbulb size={16} /> },
    { label: 'Build Plans', path: '/invention-plans', icon: <ShoppingCart size={16} /> },
    { label: 'Patents', path: '/patent-attorney-chat', icon: <Gavel size={16} /> },
    { label: 'Marketplace', path: '/ip-marketplace', icon: <Zap size={16} /> },
    { label: 'Pricing', path: '/pricing', icon: <Lightbulb size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10" style={{ background: 'rgba(10,10,26,0.92)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png" alt="ZAT" className="h-8 w-8 rounded" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1 text-xs font-bold transition-colors px-2 py-1 rounded ${
                isActive(item.path)
                  ? 'text-cyan-300 bg-cyan-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        {/* Theme & Background Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Background Mode Toggle */}
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-2 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-600 transition-colors cursor-pointer"
          >
            <option value="off">Scene: Off</option>
            <option value="subdued">Scene: Subdued</option>
            <option value="interactive">Scene: Interactive</option>
          </select>

          {/* Theme Selector */}
          <select
            value={currentTheme.name}
            onChange={(e) => {
              const selected = themes.find(t => t.name === e.target.value);
              if (selected) setCurrentTheme(selected);
            }}
            className="px-2 py-1 text-xs rounded bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:border-cyan-600 transition-colors cursor-pointer"
          >
            {themes.map(theme => (
              <option key={theme.name} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
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