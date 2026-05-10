import { Link, useLocation } from "react-router-dom";
import { Vault, Wrench, Zap, BookOpen, FlaskConical } from "lucide-react";


const TABS = [
  {
    label: "Home",
    path: "/start",
    icon: Vault,
    match: (p) => p === "/start",
  },
  {
    label: "Research",
    path: "/prior-art",
    icon: BookOpen,
    match: (p) => ["/prior-art", "/free-vault", "/invention-library"].includes(p),
  },
  {
    label: "Builds",
    path: "/device-catalogue",
    icon: Wrench,
    match: (p) => ["/device-catalogue", "/invention-plans", "/build-plan-explorer"].includes(p),
  },
  {
    label: "Forge",
    path: "/invention-forge",
    icon: FlaskConical,
    match: (p) => ["/invention-forge", "/patent-hub", "/patent-intelligence"].includes(p),
  },
  {
    label: "Join",
    path: "/pricing",
    icon: Zap,
    match: (p) => ["/pricing", "/checkout", "/paywall"].includes(p),
    highlight: true,
  },
];

export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(15,23,42,0.97)",
        borderTop: "1px solid rgba(51,65,85,0.8)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), rgba(139,92,246,0.4), transparent)" }} />
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);

          if (tab.highlight) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
                style={{ minHeight: 44 }}
              >
                <div className="flex flex-col items-center justify-center gap-1 px-4 py-1.5 rounded-xl mx-2"
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
                      : "linear-gradient(135deg, #6d28d9, #4338ca)",
                    boxShadow: "0 2px 12px rgba(109,40,217,0.5)",
                  }}>
                  <Icon size={18} strokeWidth={2.2} style={{ color: "#fff" }} />
                  <span className="text-[10px] font-black tracking-wide text-white">Upgrade</span>
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
                  style={{ background: "linear-gradient(90deg, #0EA5E9, #8b5cf6)" }}
                />
              )}
              <Icon
                size={21}
                strokeWidth={active ? 2.2 : 1.6}
                style={{ color: active ? "#0EA5E9" : "#475569" }}
              />
              <span
                className="text-[10px] font-semibold tracking-wide"
                style={{ color: active ? "#0EA5E9" : "#475569" }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}