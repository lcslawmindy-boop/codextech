import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import BottomTabBar from "./BottomTabBar";
import SidebarNav from "./SidebarNav";
import { useTrial } from "@/lib/TrialContext";
import { AnimatePresence, motion } from "framer-motion";
import ZenithApexBackground from "./backgrounds/ZenithApexBackground";
import SolidLogoBackground from "./backgrounds/SolidLogoBackground";
import SubduedEquationsBackground from "./backgrounds/SubduedEquationsBackground";
import { useBackgroundMode } from "./BackgroundModeControl";
import InteractiveZatLogo from "./InteractiveZatLogo";
import ZatLogoWatermark from "./ZatLogoWatermark";
import SiteSearchBar from "./SiteSearchBar";
import TopLogoHeader from "./TopLogoHeader";

// Pages that should NOT show the bottom tab bar
const HIDDEN_TAB_ROUTES = ["/legal", "/checkout", "/paywall", "/pricing", "/free-vault", "/"];

// Full-screen immersive tool pages — hide tab bar
const IMMERSIVE_ROUTES = [
  "/scalar-wave-sim", "/scalar-sim", "/scalar-lab", "/scalar-potential",
  "/lab", "/simulator", "/patent-tool", "/patent-wizard", "/inventor-forge",
];

const slideVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "tween", duration: 0.22, ease: "easeOut" } },
  exit:    { x: "-30%", opacity: 0, transition: { type: "tween", duration: 0.18, ease: "easeIn" } },
};

export default function MobileLayout() {
  const { pathname } = useLocation();
  const { isTrial } = useTrial();
  const { mode, setMode } = useBackgroundMode();

  const renderBackground = () => {
    switch (mode) {
      case 'off':
        return <SolidLogoBackground />;
      case 'subdued':
      case 'defense':
      case 'researcher':
      case 'institutional':
        return <SubduedEquationsBackground />;
      case 'interactive':
      case 'fun':
      default:
        return <ZenithApexBackground />;
    }
  };

  const hideTab = HIDDEN_TAB_ROUTES.some(r => pathname === r) ||
                  IMMERSIVE_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div className="flex w-full" style={{ minHeight: "100dvh" }}>
      {/* Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <SidebarNav />
      </div>

      {/* Main Content */}
      <div
        className="flex flex-col flex-1"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 140px)",
          paddingBottom: hideTab ? "env(safe-area-inset-bottom)" : "calc(env(safe-area-inset-bottom) + 64px)",
          overscrollBehavior: "none",
          background: "transparent",
        }}
      >
        <TopLogoHeader />
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden">
          <SidebarNav />
        </div>

        {renderBackground()}
        {isTrial && <div className="h-[34px] bg-yellow-900/20 border-b border-yellow-700 flex items-center px-4"><span className="text-xs font-bold text-yellow-300">Trial Mode</span></div>}
        <SiteSearchBar />
        <InteractiveZatLogo />
        <ZatLogoWatermark />

        <div className="flex-1 relative overflow-hidden" style={{ zIndex: 1 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 overflow-y-auto"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
        {!hideTab && <BottomTabBar />}
      </div>
    </div>
  );
}