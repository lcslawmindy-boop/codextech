import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";
import { useTrial } from "@/lib/TrialContext";
import { AnimatePresence, motion } from "framer-motion";

// Pages that should NOT show the bottom tab bar
const HIDDEN_TAB_ROUTES = ["/legal", "/checkout", "/paywall", "/pricing", "/free-vault", "/"];

// Full-screen immersive tool pages — hide tab bar
const IMMERSIVE_ROUTES = [
  "/scalar-wave-sim", "/scalar-sim", "/scalar-lab", "/scalar-potential",
  "/lab", "/simulator", "/patent-tool", "/patent-wizard", "/inventor-forge",
];

export default function MobileLayout() {
  const { pathname } = useLocation();
  const { isTrial } = useTrial();

  const hideTab = HIDDEN_TAB_ROUTES.some(r => pathname === r) ||
                  IMMERSIVE_ROUTES.some(r => pathname.startsWith(r));

  return (
    <div
      className="flex flex-col w-full"
      style={{
        minHeight: "100dvh",
        paddingTop: isTrial ? "calc(env(safe-area-inset-top) + 34px)" : "env(safe-area-inset-top)",
        paddingBottom: hideTab ? "env(safe-area-inset-bottom)" : "calc(env(safe-area-inset-bottom) + 64px)",
        overscrollBehavior: "none",
      }}
    >
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, overflowY: "auto", overflowX: "hidden" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      {!hideTab && <BottomTabBar />}
    </div>
  );
}