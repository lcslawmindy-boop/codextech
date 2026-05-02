import { useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked, BarChart2, Database, Beaker, Users, Menu, X, GraduationCap, Home, TrendingUp } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Dashboard", href: "/member-dashboard", color: "text-blue-400" },
  { icon: BookMarked, label: "Dossier", href: "/invention-dossier", color: "text-purple-400" },
  { icon: GraduationCap, label: "Learning", href: "/my-learning", color: "text-green-400" },
  { icon: BarChart2, label: "Bearden Graph", href: "/device-graph", color: "text-indigo-400" },
  { icon: Database, label: "Research Tools", href: "/scalar-lab", color: "text-cyan-400" },
  { icon: Beaker, label: "Peer Review", href: "/prior-art", color: "text-yellow-400" },
  { icon: TrendingUp, label: "Patent Intelligence", href: "/patent-landscape", color: "text-pink-400" },
];

export default function EnhancedResearchNavBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Desktop Navigation Bar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-20 bg-gray-950 border-r border-gray-800 flex-col items-center py-6 gap-3 z-[100]" style={{ background: "linear-gradient(180deg, rgba(10,10,26,0.98) 0%, rgba(15,15,35,0.98) 100%)" }}>
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              key={i}
              to={item.href}
              title={item.label}
              className={`flex items-center justify-center h-14 w-14 rounded-xl border border-gray-700 hover:border-gray-600 transition-all group relative ${item.color}`}
              style={{
                background: "rgba(20,20,40,0.6)",
                animation: "navItemPulse 3s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`
              }}
            >
              <Icon size={18} />
              <div className="absolute left-full ml-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.label}
              </div>
            </Link>
          );
        })}

        <style>{`
          @keyframes navItemPulse {
            0%, 100% { box-shadow: 0 0 0 rgba(100,200,255,0), inset 0 0 0 rgba(100,200,255,0); }
            50% { box-shadow: 0 0 12px rgba(100,200,255,0.3), inset 0 0 8px rgba(100,200,255,0.1); }
          }
        `}</style>
      </div>

      {/* Mobile Toggle */}
      <div className="lg:hidden fixed left-4 top-4 z-[110]">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-900 border border-gray-700 text-cyan-400 hover:border-cyan-600 transition-all"
        >
          {isExpanded ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isExpanded && (
        <div className="lg:hidden fixed left-0 top-14 w-64 bg-gray-950 border-r border-gray-800 z-[100] max-h-[calc(100vh-56px)] overflow-y-auto">
          <div className="p-4 space-y-2">
            {NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.href}
                  onClick={() => setIsExpanded(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-all ${item.color}`}
                  style={{ background: "rgba(20,20,40,0.6)" }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-bold">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}