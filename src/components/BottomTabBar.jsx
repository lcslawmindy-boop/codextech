import { Link, useLocation } from "react-router-dom";
import { Network, FlaskConical, BookOpen, HeartPulse, Scale } from "lucide-react";

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
];

export default function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 border-t border-gray-800 backdrop-blur-md"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        overscrollBehavior: "none",
      }}
    >
      <div className="flex items-stretch h-16">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors"
              style={{ minHeight: 44 }}
            >
              <Icon
                size={22}
                className={active ? "text-yellow-400" : "text-gray-500"}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide ${active ? "text-yellow-400" : "text-gray-500"}`}
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