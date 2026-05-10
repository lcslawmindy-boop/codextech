import { useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Vault, Zap, BookOpen, FlaskConical } from "lucide-react";

const TABS = [
  {
    label: "Research",
    root: "/free-vault",
    icon: Vault,
    match: (p) => ["/free-vault", "/", "/vault", "/prior-art", "/invention-library", "/my-learning"].includes(p),
  },
  {
    label: "Courses",
    root: "/course-catalogue",
    icon: BookOpen,
    match: (p) => ["/course-catalogue", "/courses", "/invention-plans"].includes(p),
  },
  {
    label: "Forge",
    root: "/invention-forge",
    icon: FlaskConical,
    match: (p) => ["/invention-forge", "/device-catalogue", "/patent-hub", "/patent-intelligence"].includes(p),
  },
  {
    label: "Join",
    root: "/start",
    icon: Zap,
    match: (p) => ["/start", "/pricing", "/checkout", "/paywall"].includes(p),
    highlight: true,
  },
];

// Per-tab saved path (preserved when switching away)
const tabHistory = {};

export default function BottomTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleTabPress = (tab) => {
    const active = tab.match(pathname);
    if (active) {
      // Already on this tab — reset to root
      navigate(tab.root, { replace: true });
    } else {
      // Save current path for the active tab before switching
      const currentTab = TABS.find(t => t.match(pathname));
      if (currentTab) tabHistory[currentTab.root] = pathname;
      // Navigate to saved deep path or root
      const dest = tabHistory[tab.root] || tab.root;
      navigate(dest);
    }
  };

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
              <button
                key={tab.root}
                onClick={() => handleTabPress(tab)}
                className="flex-1 flex flex-col items-center justify-center gap-1 relative"
                style={{ minHeight: 44, background: "none", border: "none", cursor: "pointer" }}
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
              </button>
            );
          }

          return (
            <button
              key={tab.root}
              onClick={() => handleTabPress(tab)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative"
              style={{ minHeight: 44, background: "none", border: "none", cursor: "pointer" }}
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
            </button>
          );
        })}
      </div>
    </div>
  );
}