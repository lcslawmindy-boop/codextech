import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GripVertical, Plus, X, Play, RotateCcw, ChevronRight, Eye, ExternalLink } from "lucide-react";

const STORAGE_KEY = "codextech_custom_flow";

const ALL_PAGES = [
  { path: "/", label: "Home / Landing", emoji: "🏠", category: "Core" },
  { path: "/free-vault", label: "Free Vault", emoji: "🔓", category: "Core" },
  { path: "/vault", label: "Research Vault", emoji: "🗄️", category: "Core" },
  { path: "/research-platform", label: "Research Platform", emoji: "🔬", category: "Research" },
  { path: "/research-database", label: "Research Database", emoji: "📚", category: "Research" },
  { path: "/research-lab", label: "Research Lab", emoji: "🧪", category: "Research" },
  { path: "/research-membership", label: "Research Membership", emoji: "🎓", category: "Research" },
  { path: "/prior-art", label: "Prior Art Archive", emoji: "📋", category: "Research" },
  { path: "/codextech", label: "Codextech Home", emoji: "⚡", category: "Research" },
  { path: "/codextech-database", label: "Codextech Database", emoji: "🗃️", category: "Research" },
  { path: "/invention-plans", label: "Invention Plans", emoji: "📐", category: "Build" },
  { path: "/build-plans", label: "Build Plans Marketplace", emoji: "🔨", category: "Build" },
  { path: "/alacarte", label: "À La Carte Shop", emoji: "🛒", category: "Build" },
  { path: "/invention-library", label: "Invention Library", emoji: "📖", category: "Build" },
  { path: "/kit-bundles", label: "Kit Bundles", emoji: "📦", category: "Build" },
  { path: "/build-supplies-shop", label: "Build Supplies Shop", emoji: "🔧", category: "Build" },
  { path: "/courses", label: "Course Catalog", emoji: "🎓", category: "Learning" },
  { path: "/my-learning", label: "My Learning", emoji: "📝", category: "Learning" },
  { path: "/my-library", label: "My Library", emoji: "📚", category: "Learning" },
  { path: "/hydromagnetopropulsion-course", label: "Hydromagnetopropulsion Course", emoji: "🚀", category: "Learning" },
  { path: "/beginner-manual", label: "Beginner Manual", emoji: "📗", category: "Learning" },
  { path: "/glossary", label: "Glossary", emoji: "🔤", category: "Learning" },
  { path: "/patent-tool", label: "Patent Drafting Tool", emoji: "⚖️", category: "Patents" },
  { path: "/patent-claims-generator", label: "Patent Claims Generator", emoji: "📜", category: "Patents" },
  { path: "/patent-landscape", label: "Patent Landscape Graph", emoji: "🗺️", category: "Patents" },
  { path: "/patent-intelligence", label: "Patent Intelligence", emoji: "🧠", category: "Patents" },
  { path: "/patent-wizard", label: "Patent Filing Wizard", emoji: "🧙", category: "Patents" },
  { path: "/prior-art", label: "Prior Art Archive", emoji: "📋", category: "Patents" },
  { path: "/simulator", label: "Simulator", emoji: "⚙️", category: "Tools" },
  { path: "/scalar-lab", label: "Scalar EM Lab", emoji: "🌀", category: "Tools" },
  { path: "/scalar-sim", label: "Scalar Field Sim", emoji: "〰️", category: "Tools" },
  { path: "/lab", label: "Lab Simulation", emoji: "🧫", category: "Tools" },
  { path: "/emf-log", label: "EMF Exposure Log", emoji: "📊", category: "Tools" },
  { path: "/emf-impact", label: "EMF Impact", emoji: "⚡", category: "Tools" },
  { path: "/rd-sandbox", label: "R&D Sandbox", emoji: "🛠️", category: "Tools" },
  { path: "/ai-research", label: "AI Research Assistant", emoji: "🤖", category: "Tools" },
  { path: "/inventor-forge", label: "Invention Forge", emoji: "⚒️", category: "Tools" },
  { path: "/device-graph", label: "Device Knowledge Graph", emoji: "🕸️", category: "Tools" },
  { path: "/investors", label: "Investor Portal", emoji: "💼", category: "Business" },
  { path: "/investor-crm", label: "Investor CRM", emoji: "🤝", category: "Business" },
  { path: "/pitch", label: "Pitch Builder", emoji: "🎯", category: "Business" },
  { path: "/market-deck", label: "Market Deck", emoji: "📈", category: "Business" },
  { path: "/business", label: "Business Models", emoji: "💡", category: "Business" },
  { path: "/my-vault", label: "My Vault", emoji: "🔐", category: "Personal" },
  { path: "/my-research", label: "My Research", emoji: "🔍", category: "Personal" },
  { path: "/member-dashboard", label: "Member Dashboard", emoji: "📊", category: "Personal" },
  { path: "/account", label: "Account Settings", emoji: "⚙️", category: "Personal" },
  { path: "/community", label: "Community Forum", emoji: "💬", category: "Community" },
  { path: "/referrals", label: "Referral Dashboard", emoji: "🎁", category: "Community" },
  { path: "/contest", label: "Contest", emoji: "🏆", category: "Community" },
];

const CATEGORIES = ["Core", "Research", "Build", "Learning", "Patents", "Tools", "Business", "Personal", "Community"];
const CATEGORY_COLORS = {
  Core: "cyan", Research: "blue", Build: "green", Learning: "yellow",
  Patents: "purple", Tools: "orange", Business: "pink", Personal: "teal", Community: "red"
};

const colorClasses = {
  cyan: "bg-cyan-900/30 border-cyan-700/50 text-cyan-300",
  blue: "bg-blue-900/30 border-blue-700/50 text-blue-300",
  green: "bg-green-900/30 border-green-700/50 text-green-300",
  yellow: "bg-yellow-900/30 border-yellow-700/50 text-yellow-300",
  purple: "bg-purple-900/30 border-purple-700/50 text-purple-300",
  orange: "bg-orange-900/30 border-orange-700/50 text-orange-300",
  pink: "bg-pink-900/30 border-pink-700/50 text-pink-300",
  teal: "bg-teal-900/30 border-teal-700/50 text-teal-300",
  red: "bg-red-900/30 border-red-700/50 text-red-300",
};

export default function CustomFlow() {
  const navigate = useNavigate();
  const [flow, setFlow] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFlow(JSON.parse(saved));
  }, []);

  const saveFlow = (newFlow) => {
    setFlow(newFlow);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlow));
  };

  const addPage = (page) => {
    if (flow.find(p => p.path === page.path)) return;
    saveFlow([...flow, page]);
  };

  const removePage = (path) => saveFlow(flow.filter(p => p.path !== path));

  const resetFlow = () => {
    saveFlow([]);
    setCurrentStep(null);
  };

  // Drag and drop reorder
  const onDragStart = (i) => setDragIdx(i);
  const onDragOver = (e, i) => { e.preventDefault(); setDragOverIdx(i); };
  const onDrop = (i) => {
    if (dragIdx === null || dragIdx === i) return;
    const updated = [...flow];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(i, 0, moved);
    saveFlow(updated);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const [previewPage, setPreviewPage] = useState(null);

  const filtered = ALL_PAGES.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.label.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Deduplicate display
  const seen = new Set();
  const uniqueFiltered = filtered.filter(p => {
    if (seen.has(p.path + p.label)) return false;
    seen.add(p.path + p.label);
    return true;
  });

  const launchFlow = () => {
    if (flow.length === 0) return;
    setCurrentStep(0);
  };

  // Page Preview Modal
  const PagePreviewModal = ({ page, onClose, onAdd, inFlow }) => {
    const color = CATEGORY_COLORS[page.category];
    const colorMap = {
      cyan: "#06b6d4", blue: "#3b82f6", green: "#22c55e", yellow: "#eab308",
      purple: "#a855f7", orange: "#f97316", pink: "#ec4899", teal: "#14b8a6", red: "#ef4444"
    };
    const hex = colorMap[color] || "#06b6d4";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
          {/* Mock browser chrome */}
          <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 mx-3 bg-gray-700 rounded px-3 py-1 text-gray-400 text-xs font-mono truncate">
              codextech.app{page.path}
            </div>
            <a href={page.path} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-300 transition-colors">
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Visual Preview */}
          <div className="relative h-56 overflow-hidden flex flex-col items-center justify-center gap-4 px-8"
            style={{ background: `linear-gradient(135deg, #0f172a 0%, ${hex}18 100%)` }}>
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `repeating-linear-gradient(0deg, ${hex} 0, ${hex} 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, ${hex} 0, ${hex} 1px, transparent 1px, transparent 40px)` }} />
            {/* Glow blob */}
            <div className="absolute rounded-full blur-3xl opacity-20 w-40 h-40"
              style={{ background: hex }} />
            {/* Content */}
            <div className="relative text-center">
              <div className="text-6xl mb-3 drop-shadow-lg">{page.emoji}</div>
              <h3 className="text-white font-black text-xl leading-tight">{page.label}</h3>
              <p className="text-xs mt-1.5 font-mono" style={{ color: hex }}>{page.path}</p>
            </div>
            {/* Category pill */}
            <div className="relative px-3 py-1 rounded-full border text-xs font-bold" style={{ borderColor: hex + "60", backgroundColor: hex + "20", color: hex }}>
              {page.category}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm font-bold transition-colors">
              Close
            </button>
            <Link to={page.path}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white text-sm font-bold transition-colors">
              <ExternalLink size={13} /> Visit
            </Link>
            <button
              onClick={() => { inFlow ? removePage(page.path) : addPage(page); onClose(); }}
              className={`flex-1 py-2 rounded-lg text-sm font-black transition-colors flex items-center justify-center gap-1.5 ${
                inFlow
                  ? "bg-red-900/40 hover:bg-red-800/50 border border-red-700 text-red-300"
                  : "bg-cyan-600 hover:bg-cyan-500 text-white"
              }`}
            >
              {inFlow ? <><X size={13} /> Remove</> : <><Plus size={13} /> Add to Flow</>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentStep !== null && flow[currentStep]) {
    const page = flow[currentStep];
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        {/* Flow Progress Bar */}
        <div className="bg-gray-900 border-b border-gray-800 px-6 py-3 sticky top-0 z-50 flex items-center gap-4">
          <button onClick={() => setCurrentStep(null)} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
          <div className="flex-1 flex items-center gap-2 overflow-x-auto">
            {flow.map((p, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  i === currentStep
                    ? "bg-cyan-600 text-white"
                    : i < currentStep
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-800 text-gray-600"
                }`}
              >
                {i < currentStep ? "✓" : i + 1} {p.emoji} {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {currentStep > 0 && (
              <button onClick={() => setCurrentStep(s => s - 1)}
                className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-bold transition-colors">
                ← Back
              </button>
            )}
            {currentStep < flow.length - 1 ? (
              <button onClick={() => setCurrentStep(s => s + 1)}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-bold transition-colors flex items-center gap-1">
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={() => setCurrentStep(null)}
                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-sm font-bold transition-colors">
                ✓ Done
              </button>
            )}
          </div>
        </div>

        {/* Page Preview — navigate to it */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12 text-center">
          <div className="text-6xl">{page.emoji}</div>
          <h2 className="text-3xl font-black text-white">{page.label}</h2>
          <p className="text-gray-400 text-sm">
            Step {currentStep + 1} of {flow.length} in your custom flow
          </p>
          <Link
            to={page.path}
            className="px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-lg transition-colors flex items-center gap-2"
          >
            Open Page <ChevronRight size={18} />
          </Link>
          <p className="text-gray-600 text-xs">Click "Open Page" to visit, then come back and hit Next to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 sticky top-0 z-40 bg-gray-950/95 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-white font-black text-lg">Custom Page Flow</h1>
            <p className="text-gray-500 text-xs">Pick pages and drag them into the order you want to follow</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {flow.length > 0 && (
            <>
              <button onClick={resetFlow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 text-gray-400 text-xs font-bold transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
              <button onClick={launchFlow}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-colors">
                <Play size={14} /> Start Flow ({flow.length})
              </button>
            </>
          )}
        </div>
      </div>

      {previewPage && (
        <PagePreviewModal
          page={previewPage}
          onClose={() => setPreviewPage(null)}
          onAdd={addPage}
          inFlow={!!flow.find(p => p.path === previewPage.path && p.label === previewPage.label)}
        />
      )}

      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* LEFT: Page Browser */}
        <div>
          <h2 className="text-white font-black mb-4">Browse Pages</h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-600"
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["All", ...CATEGORIES].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === cat
                    ? "bg-cyan-600 border-cyan-600 text-white"
                    : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Page list */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {uniqueFiltered.map((page, i) => {
              const inFlow = flow.find(p => p.path === page.path && p.label === page.label);
              const color = CATEGORY_COLORS[page.category];
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all ${
                    inFlow
                      ? "bg-gray-800 border-gray-600 opacity-50"
                      : "bg-gray-900 border-gray-800 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg">{page.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{page.label}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded border ${colorClasses[color]}`}>
                        {page.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <button
                      onClick={() => setPreviewPage(page)}
                      className="w-7 h-7 rounded-full flex items-center justify-center border border-gray-700 text-gray-500 hover:text-gray-200 hover:border-gray-500 transition-all"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={() => inFlow ? removePage(page.path) : addPage(page)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        inFlow
                          ? "bg-gray-700 text-gray-500 cursor-default"
                          : "bg-cyan-600 hover:bg-cyan-500 text-white"
                      }`}
                    >
                      {inFlow ? <X size={12} /> : <Plus size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Flow Builder */}
        <div>
          <h2 className="text-white font-black mb-4">
            Your Flow
            {flow.length > 0 && <span className="ml-2 text-cyan-400 text-sm font-normal">({flow.length} pages)</span>}
          </h2>

          {flow.length === 0 ? (
            <div className="border-2 border-dashed border-gray-800 rounded-xl p-12 text-center">
              <div className="text-4xl mb-3">➕</div>
              <p className="text-gray-500 text-sm">Add pages from the left to build your flow</p>
              <p className="text-gray-700 text-xs mt-2">You can drag to reorder them</p>
            </div>
          ) : (
            <div className="space-y-2">
              {flow.map((page, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={() => onDrop(i)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
                    dragOverIdx === i
                      ? "border-cyan-500 bg-cyan-950/30"
                      : "border-gray-700 bg-gray-900 hover:border-gray-600"
                  }`}
                >
                  <GripVertical size={16} className="text-gray-600 flex-shrink-0" />
                  <div className="w-7 h-7 rounded-full bg-cyan-900/50 border border-cyan-700 flex items-center justify-center text-cyan-400 font-black text-xs flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-lg">{page.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{page.label}</p>
                    <p className="text-gray-600 text-xs">{page.path}</p>
                  </div>
                  <button onClick={() => removePage(page.path)}
                    className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0">
                    <X size={14} />
                  </button>
                </div>
              ))}

              <button onClick={launchFlow}
                className="w-full mt-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-colors flex items-center justify-center gap-2">
                <Play size={16} /> Launch Flow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}