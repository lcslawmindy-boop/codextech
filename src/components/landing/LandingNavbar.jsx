import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Research Library", href: "#showcase" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-zarp-bg/80 backdrop-blur-xl border-b border-zarp-border" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-zarp-gold to-zarp-blue opacity-80" />
            <div className="absolute inset-1 rounded-md bg-zarp-bg flex items-center justify-center">
              <Zap size={14} className="text-zarp-gold" />
            </div>
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-zarp-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            ZARP
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} className="text-zarp-muted hover:text-zarp-text text-sm font-medium transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/pricing" className="text-zarp-muted hover:text-zarp-text text-sm font-medium transition-colors">
            Login
          </Link>
          <a
            href="#pricing"
            className="px-5 py-2 rounded-lg text-sm font-bold text-zarp-bg transition-all hover:shadow-lg"
            style={{ backgroundColor: 'hsl(var(--zarp-gold))', boxShadow: '0 0 20px hsl(var(--zarp-gold) / 0.3)' }}
          >
            Start Free Trial
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-zarp-text">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-zarp-bg/95 backdrop-blur-xl border-b border-zarp-border px-6 py-4 space-y-3">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} className="block text-zarp-muted hover:text-zarp-text text-sm font-medium py-1">
              {link.label}
            </a>
          ))}
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block w-full text-center px-5 py-2.5 rounded-lg text-sm font-bold text-zarp-bg" style={{ backgroundColor: 'hsl(var(--zarp-gold))' }}>
            Start Free Trial
          </a>
        </div>
      )}
    </nav>
  );
}