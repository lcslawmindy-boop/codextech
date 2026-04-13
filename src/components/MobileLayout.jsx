import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";
import ThemeSwitcher, { loadTheme } from "./ThemeSwitcher";
import { useEffect } from "react";

// Pages that should NOT show the bottom tab bar
const HIDDEN_TAB_ROUTES = ["/legal", "/checkout"];

// Full-screen pages (immersive tools) that hide the tab bar too
const IMMERSIVE_ROUTES = [
  "/scalar-wave-sim", "/scalar-sim", "/scalar-lab", "/scalar-potential",
  "/lab", "/simulator", "/patent-tool", "/patent-wizard", "/inventor-forge",
];

export default function MobileLayout() {
  const { pathname } = useLocation();
  useEffect(() => { loadTheme(); }, []);
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
      {/* Floating theme switcher */}
      <div className="fixed bottom-20 right-4 z-[100]" style={{ bottom: hideTab ? '1rem' : '5rem' }}>
        <ThemeSwitcher />
      </div>
    </div>
  );
}