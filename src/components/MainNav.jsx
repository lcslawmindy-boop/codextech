import { Link } from "react-router-dom";

const NAV_GROUPS = [
  {
    label: "Learn",
    color: "#06b6d4",
    links: [
      { emoji: "🎓", label: "Courses", path: "/courses" },
      { emoji: "📖", label: "My Learning", path: "/my-learning" },
      { emoji: "📖", label: "Glossary", path: "/glossary" },
    ],
  },
  {
    label: "Research",
    color: "#a855f7",
    links: [
      { emoji: "🗄️", label: "Archive", path: "/prior-art" },
      { emoji: "🧪", label: "EM Lab", path: "/scalar-lab" },
      { emoji: "🔬", label: "Research Lab", path: "/research-lab" },
    ],
  },
  {
    label: "Community",
    color: "#22c55e",
    links: [
      { emoji: "💬", label: "Forum", path: "/community" },
      { emoji: "🏆", label: "Contest", path: "/contest" },
    ],
  },
  {
    label: "Tools",
    color: "#f59e0b",
    links: [
      { emoji: "📄", label: "Patent AI", path: "/patent-drafting-wizard" },
      { emoji: "⚗️", label: "R&D Lab", path: "/rd-sandbox" },
      { emoji: "🧠", label: "AI Research", path: "/ai-research" },
    ],
  },
];

export default function MainNav({ isAdmin }) {
  return (
    <div className="border-t border-gray-800/60 bg-gray-950/80">
      <div
        className="flex gap-0 overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#374151 transparent", WebkitOverflowScrolling: "touch" }}
      >
        {NAV_GROUPS.map((group) => {
          const links = isAdmin ? group.links : group.links.filter(l => !l.adminOnly);
          if (links.length === 0) return null;
          return (
            <div key={group.label} className="flex-shrink-0 border-r border-gray-800/50 last:border-r-0">
              {/* Group label */}
              <div
                className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-center"
                style={{ color: group.color, backgroundColor: group.color + "10", borderBottom: `1px solid ${group.color}30` }}
              >
                {group.label}
              </div>
              {/* Links row */}
              <div className="flex gap-0">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex flex-col items-center justify-center gap-1 px-3 py-2 hover:bg-gray-800 transition-colors min-w-[64px] border-r border-gray-800/30 last:border-r-0 group"
                  >
                    <span className="text-xl leading-none">{link.emoji}</span>
                    <span className="text-[11px] leading-tight font-bold text-gray-300 group-hover:text-white text-center whitespace-nowrap transition-colors drop-shadow">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Account always visible */}
        <div className="flex-shrink-0 border-l border-gray-800/50">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-center text-gray-500 bg-gray-900/50 border-b border-gray-800/30">
            Account
          </div>
          <div className="flex gap-0">
            {[
              { emoji: "🏠", label: "Home", path: "/" },
              { emoji: "💳", label: "Pricing", path: "/pricing" },
              { emoji: "📊", label: "Dashboard", path: "/member-dashboard" },
              { emoji: "👤", label: "Account", path: "/account" },
              ...(isAdmin ? [{ emoji: "🔒", label: "Admin", path: "/admin" }] : []),
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex flex-col items-center justify-center gap-1 px-3 py-2 hover:bg-gray-800 transition-colors min-w-[64px] border-r border-gray-800/30 last:border-r-0 group"
              >
                <span className="text-xl leading-none">{link.emoji}</span>
                <span className="text-[11px] leading-tight font-bold text-gray-300 group-hover:text-white text-center whitespace-nowrap transition-colors drop-shadow">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}