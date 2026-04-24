import { Link } from "react-router-dom";

const NAV_GROUPS = [
  {
    label: "Inventions",
    color: "#f59e0b",
    links: [
      { emoji: "📚", label: "Library", path: "/invention-library" },
      { emoji: "🧬", label: "Forge", path: "/inventor-forge" },
      { emoji: "⚗️", label: "R&D Lab", path: "/rd-sandbox" },
      { emoji: "🧪", label: "Hybrid", path: "/hybrid-portfolio" },
      { emoji: "🕸️", label: "Device Graph", path: "/device-graph" },
      { emoji: "📐", label: "Build Plans", path: "/invention-plans" },
      { emoji: "🔧", label: "Build AI", path: "/build-milestone-ai" },
      { emoji: "🛒", label: "Build Supplies", path: "/build-supplies-shop" },
    ],
  },
  {
    label: "IP & Patents",
    color: "#6366f1",
    links: [
      { emoji: "🛡️", label: "FTO Analysis", path: "/fto-analysis" },
      { emoji: "⚖️", label: "Patent Attorney AI", path: "/patent-attorney-chat" },
      { emoji: "🔍", label: "Patent Intelligence", path: "/patent-intelligence" },
      { emoji: "✍️", label: "Patent Wizard", path: "/patent-drafting-wizard" },
      { emoji: "📄", label: "PPA Drafter", path: "/provisional-patent" },
      { emoji: "🗄️", label: "Prior Art", path: "/prior-art" },
      { emoji: "💼", label: "IP Marketplace", path: "/ip-marketplace" },
      { emoji: "🏥", label: "Portfolio Health", path: "/ip-portfolio-health" },
      { emoji: "🤝", label: "Co-Inventor Match", path: "/co-inventor-matching" },
      { emoji: "📝", label: "Collab Draft", path: "/collab-patent-draft" },
      { emoji: "🎯", label: "SBIR Grants", path: "/sbir-pipeline" },
    ],
  },
  {
    label: "Investors",
    color: "#22c55e",
    links: [
      { emoji: "💰", label: "Investor Portal", path: "/investor-portal" },
      { emoji: "📦", label: "Investor Package", path: "/investor-package" },
      { emoji: "📜", label: "Term Sheets", path: "/term-sheet" },
      { emoji: "💹", label: "IP Valuation API", path: "/valuation-api" },
      { emoji: "🚀", label: "Vision Fund Pitch", path: "/vision-fund-pitch" },
      { emoji: "📋", label: "Pitch Script", path: "/pitch-script" },
      { emoji: "🔒", label: "VDR Access", path: "/vdr-admin", adminOnly: true },
      { emoji: "📊", label: "Valuation Dashboard", path: "/valuation", adminOnly: true },
      { emoji: "🎯", label: "Acquisition CRM", path: "/acquisition-crm", adminOnly: true },
    ],
  },
  {
    label: "Research",
    color: "#a855f7",
    links: [
      { emoji: "🧠", label: "AI Research", path: "/ai-research" },
      { emoji: "🌍", label: "Dark vs Light", path: "/dark-timeline" },
      { emoji: "📊", label: "Timeline Deck", path: "/timeline-pitch" },
      { emoji: "📈", label: "Dev Timeline", path: "/invention-timeline" },
      { emoji: "🗺️", label: "Patent Landscape", path: "/patent-landscape" },
    ],
  },
  {
    label: "Labs",
    color: "#06b6d4",
    links: [
      { emoji: "〰️", label: "Scalar Wave", path: "/scalar-wave-sim" },
      { emoji: "🌊", label: "Scalar Field", path: "/scalar-sim" },
      { emoji: "⚗️", label: "EM Lab", path: "/scalar-lab" },
      { emoji: "🗺️", label: "∇φ Map", path: "/scalar-potential" },
      { emoji: "🧪", label: "Wave Lab", path: "/lab" },
    ],
  },
  {
    label: "Health",
    color: "#10b981",
    links: [
      { emoji: "☠️", label: "EMF Impact", path: "/emf-impact" },
      { emoji: "📊", label: "EMF Log", path: "/emf-log" },
      { emoji: "📈", label: "Analytics", path: "/health-analytics" },
      { emoji: "🌿", label: "Metal Detox", path: "/heavy-metal-detox" },
      { emoji: "🛒", label: "EMF Shop", path: "/emf-shop" },
    ],
  },
  {
    label: "Learn",
    color: "#f97316",
    links: [
      { emoji: "📚", label: "Courses", path: "/courses" },
      { emoji: "🎓", label: "My Learning", path: "/my-learning" },
      { emoji: "⬇️", label: "Downloads", path: "/download-center" },
      { emoji: "📖", label: "Glossary", path: "/glossary" },
      { emoji: "🔰", label: "Beginner Guide", path: "/beginner-manual" },
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
              { emoji: "🔓", label: "Free Vault", path: "/free-vault" },
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