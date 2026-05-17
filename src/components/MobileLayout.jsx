import { Outlet, useLocation } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";
import { useTrial } from "@/lib/TrialContext";
import { useRef, useEffect } from "react";

// Pages that should NOT show the bottom tab bar
const HIDDEN_TAB_ROUTES = ["/legal", "/checkout", "/paywall", "/pricing", "/free-vault", "/", "/start"];

// Full-screen immersive tool pages — hide tab bar
const IMMERSIVE_ROUTES = [
  "/scalar-wave-sim", "/scalar-sim", "/scalar-lab", "/scalar-potential",
  "/lab", "/simulator", "/patent-tool", "/patent-wizard", "/inventor-forge",
];

export default function MobileLayout() {
  const { pathname } = useLocation();
  const { isTrial } = useTrial();
  const scrollRef = useRef(null);
  const scrollPositions = useRef({});

  const hideTab = HIDDEN_TAB_ROUTES.some(r => pathname === r) ||
                  IMMERSIVE_ROUTES.some(r => pathname.startsWith(r));

  // Save scroll position when leaving a route, restore when returning
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Restore saved position for this route (or go to top)
    const saved = scrollPositions.current[pathname] ?? 0;
    el.scrollTop = saved;

    // Save position on scroll
    const onScroll = () => {
      scrollPositions.current[pathname] = el.scrollTop;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pathname]);

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
        <div
          ref={scrollRef}
          className="absolute inset-0 overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <Outlet />
        </div>
      </div>
      {!hideTab && <BottomTabBar />}
    </div>
  );
}