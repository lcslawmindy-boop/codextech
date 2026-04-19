import { Link, useLocation } from "react-router-dom";
import { Network, FlaskConical, BookOpen, HeartPulse, Scale, ShoppingCart } from "lucide-react";

const TABS = [
  {
    label: "Graph",
    path: "/",
    icon: Network,
    match: (p) => p === "/",
  },
  {
    label: "Inventions",
    path: "/invention-library",
    icon: FlaskConical,
    match: (p) => ["/invention-library", "/inventor-forge", "/rd-sandbox", "/hybrid-portfolio", "/patent-intelligence", "/fto-analysis", "/patent-attorney-chat", "/patent-drafting-wizard", "/prior-art"].includes(p),
  },
  {
    label: "Courses",
    path: "/courses",
    icon: BookOpen,
    match: (p) => ["/courses", "/my-learning", "/ai-research", "/course-plan"].includes(p),
  },
  {
    label: "IP Tools",
    path: "/patent-intelligence",
    icon: Scale,
    match: (p) => ["/patent-intelligence", "/fto-analysis", "/patent-attorney-chat", "/ip-marketplace", "/co-inventor-matching", "/sbir-pipeline", "/ip-portfolio-health"].includes(p),
  },
  {
    label: "Health",
    path: "/emf-impact",
    icon: HeartPulse,
    match: (p) => ["/emf-impact", "/emf-log", "/heavy-metal-detox", "/health-analytics"].includes(p),
  },
  {
    label: "Pricing",
    path: "/pricing",
    icon: ShoppingCart,
    match: (p) => p === "/pricing",
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
        overscrollBehavior: "none",
      }}
    >
      {/* Cyan accent line at top of bar */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(14,165,233,0.4), rgba(16,185,129,0.4), transparent)" }} />
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
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
                  style={{ background: "linear-gradient(90deg, #0EA5E9, #10B981)" }}
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