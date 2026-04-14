import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";

const ALL_PAGES = [
  // Core
  { label: "Concept Network Graph", path: "/", tags: ["home", "graph", "network", "research"], icon: "🕸️", category: "Core" },
  { label: "Invention Library", path: "/invention-library", tags: ["inventions", "devices", "library"], icon: "📚", category: "Inventions" },
  { label: "Invention Build Plans", path: "/invention-plans", tags: ["build", "plans", "bom", "assembly", "hardware"], icon: "🔧", category: "Inventions" },
  { label: "Invention Forge (AI)", path: "/inventor-forge", tags: ["ai", "forge", "generate", "idea", "invent"], icon: "⚡", category: "AI Tools" },
  { label: "Invention Timeline", path: "/invention-timeline", tags: ["timeline", "history", "chronology"], icon: "📅", category: "Inventions" },

  // Research
  { label: "Prior Art Archive", path: "/prior-art", tags: ["prior art", "patents", "archive", "research"], icon: "🗂️", category: "Research" },
  { label: "AI Patent Intelligence", path: "/patent-intelligence", tags: ["patent", "ai", "analysis", "claims", "summarize", "conflicts", "landscape", "competitive", "strategy", "drafting", "prior art"], icon: "🧠", category: "AI Tools" },
  { label: "Patent Drafting Tool", path: "/patent-tool", tags: ["patent", "draft", "ai", "provisional", "ip"], icon: "📝", category: "IP Tools" },
  { label: "Patent Filing Wizard", path: "/patent-wizard", tags: ["patent", "filing", "wizard", "uspto"], icon: "🧙", category: "IP Tools" },
  { label: "Patent Landscape Graph", path: "/patent-landscape", tags: ["patent", "landscape", "graph", "map"], icon: "🗺️", category: "IP Tools" },
  { label: "Provisional Patent", path: "/provisional-patent", tags: ["provisional", "patent", "filing", "ai"], icon: "📄", category: "IP Tools" },
  { label: "AI Research Assistant", path: "/ai-research", tags: ["ai", "research", "literature", "grant", "sbir"], icon: "🤖", category: "AI Tools" },
  { label: "My Research", path: "/my-research", tags: ["research", "notes", "my", "personal"], icon: "🔬", category: "Research" },

  // Simulators
  { label: "Scalar EM Lab", path: "/scalar-lab", tags: ["scalar", "em", "lab", "simulate"], icon: "🌀", category: "Simulators" },
  { label: "Lab Simulation", path: "/lab", tags: ["lab", "simulation", "experiment"], icon: "⚗️", category: "Simulators" },
  { label: "Scalar Wave Simulator", path: "/scalar-wave-sim", tags: ["scalar", "wave", "sim", "3d"], icon: "〰️", category: "Simulators" },
  { label: "Scalar Field Simulation", path: "/scalar-sim", tags: ["scalar", "field", "sim"], icon: "🔵", category: "Simulators" },
  { label: "Scalar Potential Map", path: "/scalar-potential", tags: ["scalar", "potential", "map"], icon: "📡", category: "Simulators" },

  // Courses
  { label: "Course Catalog", path: "/courses", tags: ["courses", "learn", "education", "videos"], icon: "🎓", category: "Learning" },
  { label: "My Learning", path: "/my-learning", tags: ["my", "learning", "progress", "courses"], icon: "📖", category: "Learning" },
  { label: "Course Plan", path: "/course-plan", tags: ["course", "plan", "curriculum"], icon: "📋", category: "Learning" },
  { label: "Beginner Manual", path: "/beginner-manual", tags: ["beginner", "manual", "guide", "start"], icon: "📗", category: "Learning" },
  { label: "Troubleshooting Guides", path: "/troubleshooting", tags: ["troubleshoot", "fix", "help", "guide"], icon: "🛠️", category: "Learning" },
  { label: "Glossary", path: "/glossary", tags: ["glossary", "terms", "definitions", "words"], icon: "📕", category: "Learning" },

  // Investor
  { label: "Investor Portal", path: "/investor-portal", tags: ["investor", "portal", "pitch", "funding"], icon: "💰", category: "Investor" },
  { label: "Investor CRM", path: "/investor-crm", tags: ["investor", "crm", "pipeline", "kanban"], icon: "📊", category: "Investor" },
  { label: "Investor Package", path: "/investor-package", tags: ["investor", "package", "due diligence", "nda"], icon: "💼", category: "Investor" },
  { label: "Seller Term Sheet", path: "/term-sheet", tags: ["term sheet", "seller", "acquisition", "ma", "licensing"], icon: "📑", category: "Investor" },
  { label: "Valuation Dashboard", path: "/valuation", tags: ["valuation", "dcf", "revenue", "financials"], icon: "📈", category: "Investor" },
  { label: "Pitch Builder", path: "/pitch", tags: ["pitch", "deck", "presentation", "builder"], icon: "🎯", category: "Investor" },
  { label: "Timeline Pitch Deck", path: "/timeline-pitch", tags: ["timeline", "pitch", "deck", "slides"], icon: "🖼️", category: "Investor" },
  { label: "Licensing Portal", path: "/licensing", tags: ["licensing", "license", "ip", "deal"], icon: "🤝", category: "Investor" },
  { label: "VDR Portal", path: "/vdr-admin", tags: ["vdr", "data room", "investor", "access"], icon: "🔐", category: "Investor" },

  // Health
  { label: "EMF Impact", path: "/emf-impact", tags: ["emf", "impact", "health", "exposure"], icon: "⚡", category: "Health" },
  { label: "EMF Exposure Log", path: "/emf-log", tags: ["emf", "log", "track", "exposure"], icon: "📊", category: "Health" },
  { label: "Heavy Metal Detox", path: "/heavy-metal-detox", tags: ["heavy metal", "detox", "health", "protocol"], icon: "🧪", category: "Health" },
  { label: "Health Analytics", path: "/health-analytics", tags: ["health", "analytics", "charts", "data"], icon: "❤️", category: "Health" },

  // Shop
  { label: "EMF Protection Shop", path: "/emf-shop", tags: ["emf", "shop", "buy", "protection", "products"], icon: "🛒", category: "Shop" },
  { label: "Build Supplies Shop", path: "/build-supplies-shop", tags: ["build", "supplies", "shop", "parts", "buy"], icon: "🔩", category: "Shop" },
  { label: "Pricing & Plans", path: "/pricing", tags: ["pricing", "plans", "subscribe", "buy", "membership"], icon: "💳", category: "Shop" },
  { label: "Download Center", path: "/download-center", tags: ["download", "pdf", "files", "docs"], icon: "⬇️", category: "Shop" },

  // Social / Marketing
  { label: "Social Media Command", path: "/social-command", tags: ["social", "media", "marketing", "twitter", "linkedin"], icon: "📣", category: "Marketing" },
  { label: "Social Media Agent", path: "/social-agent", tags: ["social", "agent", "ai", "growth"], icon: "🤖", category: "Marketing" },
  { label: "Social Profile Generator", path: "/social-profile-gen", tags: ["social", "profile", "generate", "linkedin", "twitter"], icon: "✨", category: "Marketing" },

  // Business
  { label: "Business Models", path: "/business", tags: ["business", "model", "revenue", "strategy"], icon: "🏢", category: "Business" },
  { label: "Market Deck", path: "/market-deck", tags: ["market", "deck", "presentation", "slides"], icon: "📊", category: "Business" },
  { label: "Brand Architecture", path: "/brand", tags: ["brand", "logo", "identity", "architecture"], icon: "🎨", category: "Business" },
  { label: "Dark Timeline", path: "/dark-timeline", tags: ["dark", "timeline", "history", "suppression"], icon: "🌑", category: "Research" },
  { label: "Device Knowledge Graph", path: "/device-graph", tags: ["device", "knowledge", "graph", "map"], icon: "🔗", category: "Research" },
  { label: "Opportunity Monitor", path: "/opportunity-monitor", tags: ["opportunity", "monitor", "alerts", "ip"], icon: "🚨", category: "Research" },
  { label: "Monitoring Dashboard", path: "/monitoring", tags: ["monitoring", "alerts", "suppression", "dashboard"], icon: "👁️", category: "Research" },
  { label: "Zenith Apex Overview", path: "/zenith-apex", tags: ["zenith", "apex", "overview", "platform"], icon: "🏔️", category: "Core" },

  // Admin
  { label: "Material Sourcing", path: "/material-sourcing", tags: ["material", "sourcing", "bom", "order", "vendor", "parts", "buy", "procurement", "commission"], icon: "📦", category: "Admin" },
  { label: "Admin Hub", path: "/admin", tags: ["admin", "hub", "control", "panel", "manage"], icon: "🔒", category: "Admin" },
  { label: "Build Tracker", path: "/build-tracker", tags: ["build", "tracker", "progress", "milestone"], icon: "🏗️", category: "Admin" },
  { label: "Beta Applications", path: "/admin-beta", tags: ["beta", "applications", "members", "approve"], icon: "👥", category: "Admin" },
  { label: "Shop Orders", path: "/admin-shop-orders", tags: ["orders", "shop", "shipping", "admin"], icon: "📦", category: "Admin" },
  { label: "Acquisition CRM", path: "/acquisition-crm", tags: ["acquisition", "crm", "buyers", "ma"], icon: "🏦", category: "Admin" },
  { label: "Marketing Plan", path: "/marketing", tags: ["marketing", "plan", "strategy", "admin"], icon: "📅", category: "Admin" },
  { label: "TRZ Patent", path: "/trz-patent", tags: ["trz", "patent", "reactor", "ppa"], icon: "☢️", category: "Admin" },
  { label: "Account Settings", path: "/account", tags: ["account", "settings", "profile", "password"], icon: "⚙️", category: "Settings" },
  { label: "Member Portal", path: "/member-portal", tags: ["member", "portal", "dashboard", "profile"], icon: "🏠", category: "Settings" },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-500/30 text-yellow-300 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim().length === 0 ? [] : ALL_PAGES.filter(p => {
    const q = query.toLowerCase();
    return p.label.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.category.toLowerCase().includes(q);
  }).slice(0, 10);

  useEffect(() => {
    if (open) { setQuery(""); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSelected(s => Math.min(s + 1, results.length - 1));
      if (e.key === "ArrowUp") setSelected(s => Math.max(s - 1, 0));
      if (e.key === "Enter" && results[selected]) { navigate(results[selected].path); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, selected, navigate, onClose]);

  if (!open) return null;

  const go = (path) => { navigate(path); onClose(); };

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 px-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-800">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, tools, inventions..."
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-gray-500 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 text-xs border border-gray-700 rounded px-1.5 py-0.5 transition-colors">
            ESC
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {results.map((page, i) => (
              <button key={page.path} onClick={() => go(page.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === selected ? "bg-gray-800" : "hover:bg-gray-800/60"}`}>
                <span className="text-xl flex-shrink-0">{page.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-snug">{highlight(page.label, query)}</p>
                  <p className="text-gray-500 text-xs">{page.category}</p>
                </div>
                <ArrowRight size={13} className="text-gray-600 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div className="px-4 py-8 text-center text-gray-600 text-sm">No results for "{query}"</div>
        )}

        {!query.trim() && (
          <div className="px-4 py-3">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider mb-2">Quick Access</p>
            <div className="flex flex-wrap gap-2">
              {["Patent Intelligence", "Material Sourcing", "Patent Tool", "Investor Package", "Build Plans", "AI Research"].map(q => (
                <button key={q} onClick={() => setQuery(q)}
                  className="px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-medium transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-2 border-t border-gray-800 flex items-center gap-3 text-xs text-gray-700">
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}