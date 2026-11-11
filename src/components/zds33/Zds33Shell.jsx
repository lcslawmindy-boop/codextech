import { Link, useLocation } from "react-router-dom";
import { Orbit } from "lucide-react";

const LINKS = [
  { to: "/zds33", label: "Overview" },
  { to: "/zds33/portfolio/humanitarian", label: "Humanitarian" },
  { to: "/zds33/portfolio/defense-security", label: "Defense & Security" },
  { to: "/zds33/portfolio/deep-space", label: "Deep Space" },
  { to: "/zds33/systems", label: "Integrated Systems" },
];

export default function Zds33Shell({ children }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen text-slate-100"
      style={{ background: "radial-gradient(ellipse at 20% -10%, #0b2a3a 0%, transparent 45%), radial-gradient(ellipse at 90% 10%, #1b1640 0%, transparent 40%), #07090c" }}>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-black/70 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 overflow-x-auto">
          <Link to="/zds33" className="flex items-center gap-2 flex-shrink-0">
            <Orbit size={18} className="text-cyan-400" />
            <span className="font-black tracking-[0.2em] text-sm">ZDS33</span>
          </Link>
          <nav className="flex items-center gap-1 text-xs">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${pathname === l.to ? "bg-cyan-500/15 text-cyan-300" : "text-slate-400 hover:text-white"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-800/80 mt-16 py-6 text-center text-[11px] text-slate-500 px-4">
        Public showcase shows approved summaries and documentation status only. Restricted files require authorization.
      </footer>
    </div>
  );
}