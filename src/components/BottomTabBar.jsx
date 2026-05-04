import { Link, useLocation } from "react-router-dom";
import { Wrench, Shield, Zap, LayoutDashboard, Home, Database, LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function useSafeAuth() {
  try { return useAuth(); } catch { return { isAuthenticated: false }; }
}

const PUBLIC_TABS = [
  { label: "Home", path: "/", icon: Home, match: (p) => p === "/" },
  { label: "Research", path: "/codextech-database", icon: Database, match: (p) => p.startsWith("/codextech-database") },
  { label: "Join", path: "/pricing", icon: Zap, match: (p) => p === "/pricing", highlight: true },
  { label: "Login", path: "/account", icon: LogIn, match: (p) => p === "/account" },
];

const MEMBER_TABS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, match: (p) => p === "/dashboard" || p === "/member-dashboard" },
  { label: "Research", path: "/codextech-database", icon: Database, match: (p) => p.startsWith("/codextech-database") },
  { label: "Builds", path: "/build-plans", icon: Wrench, match: (p) => p.startsWith("/build-plans") },
  { label: "Patents", path: "/patent-tool", icon: Shield, match: (p) => p.startsWith("/patent") },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useSafeAuth();
  const TABS = isAuthenticated ? MEMBER_TABS : PUBLIC_TABS;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(6,9,18,0.97)",
        borderTop: "1px solid rgba(51,65,85,0.6)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.3), rgba(0,255,150,0.3), transparent)" }} />
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);

          if (tab.highlight) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex-1 flex flex-col items-center justify-center gap-1"
                style={{ minHeight: 44 }}
              >
                <div className="flex flex-col items-center justify-center gap-1 px-4 py-1.5 rounded-xl mx-2"
                  style={{
                    background: "linear-gradient(135deg, #00ccff, #00ff99)",
                    boxShadow: "0 2px 12px rgba(0,200,255,0.4)",
                  }}>
                  <Icon size={17} strokeWidth={2.2} style={{ color: "#000" }} />
                  <span className="text-[10px] font-black tracking-wide text-black">$49/mo</span>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative"
              style={{ minHeight: 44 }}
            >
              {active && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)" }}
                />
              )}
              <Icon size={21} strokeWidth={active ? 2.2 : 1.6} style={{ color: active ? "#00ccff" : "#475569" }} />
              <span className="text-[10px] font-semibold tracking-wide" style={{ color: active ? "#00ccff" : "#475569" }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}