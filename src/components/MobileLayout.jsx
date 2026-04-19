import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";
import ThemeSwitcher, { loadTheme } from "./ThemeSwitcher";
import GlobalSearch from "./GlobalSearch";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

// Pages that should NOT show the bottom tab bar
const HIDDEN_TAB_ROUTES = ["/legal", "/checkout"];

// Full-screen pages (immersive tools) that hide the tab bar too
const IMMERSIVE_ROUTES = [
  "/scalar-wave-sim", "/scalar-sim", "/scalar-lab", "/scalar-potential",
  "/lab", "/simulator", "/patent-tool", "/patent-wizard", "/inventor-forge",
];

export default function MobileLayout() {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => { loadTheme(); }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const hideTab = HIDDEN_TAB_ROUTES.some(r => pathname.startsWith(r)) ||
                  IMMERSIVE_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: "100dvh",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: hideTab ? "env(safe-area-inset-bottom)" : "calc(env(safe-area-inset-bottom) + 64px)",
        overscrollBehavior: "none",
      }}
    >
      <div className="flex-1 relative overflow-hidden">
        <Outlet />
      </div>
      {!hideTab && <BottomTabBar />}

      {/* Floating search button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="fixed z-[100] rounded-full shadow-xl backdrop-blur-sm flex items-center gap-2 text-xs font-semibold transition-all px-3 py-2"
        style={{
          bottom: hideTab ? '4.5rem' : '9rem',
          right: '1rem',
          background: "rgba(30,41,59,0.95)",
          border: "1px solid rgba(51,65,85,0.8)",
          color: "#94A3B8",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
        title="Search (⌘K)"
      >
        <Search size={14} style={{ color: "#0EA5E9" }} />
        <span className="hidden sm:inline">Search</span>
      </button>

      {/* Floating theme switcher */}
      <div className="fixed z-[100]" style={{ bottom: hideTab ? '1rem' : '5.5rem', right: '1rem' }}>
        <ThemeSwitcher />
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}