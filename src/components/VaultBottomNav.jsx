import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Network, BookOpen, Wrench, Tag, BarChart3, Zap } from "lucide-react";

const TABS = [
  { id: "graph", label: "Node Graph", icon: Network, path: "/" },
  { id: "courses", label: "Courses", icon: BookOpen, path: "/courses" },
  { id: "inventions", label: "Inventions", icon: Wrench, path: "/invention-plans" },
  { id: "pricing", label: "Pricing", icon: Tag, path: "/pricing" },
  { id: "learning", label: "My Learning", icon: BarChart3, path: "/my-learning" },
  { id: "assistant", label: "AI Assistant", icon: Zap, path: "/ai-research" },
];

export default function VaultBottomNav() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("graph");

  useEffect(() => {
    const active = TABS.find(t => t.path === location.pathname)?.id || "graph";
    setActiveTab(active);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur border-t border-gray-800 z-40">
      <div className="flex items-center justify-around max-w-7xl mx-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-all border-t-2 ${
                isActive
                  ? "border-t-cyan-500 text-cyan-400"
                  : "border-t-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={18} />
              <span className="text-xs font-semibold mt-1 text-center">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}