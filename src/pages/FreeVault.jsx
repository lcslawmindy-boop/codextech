import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Zap, BookOpen, Wrench, ChevronRight, Star, Eye, ArrowRight } from "lucide-react";

const FREE_ITEMS = [
  {
    id: "emf-trigger-free",
    title: "EM Trigger Window Therapy Device",
    category: "Bioelectromagnetics",
    type: "build",
    preview: "Programmable frequency generator delivering precisely tuned EM pulses within verified biological trigger windows. Consumer wristband and clinical full-body chamber versions.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
    href: "/invention-library",
    free: true,
  },
  {
    id: "vpo-preview",
    title: "Vacuum Potential Oscillator — Preview",
    category: "Vacuum Energy",
    type: "build",
    preview: "Resonant LC circuit tuned to shift vacuum-ground potential independently of the circuit ground...",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
    href: "/pricing",
    free: false,
    lockedAt: 40,
  },
  {
    id: "scalar-fund-preview",
    title: "Scalar Electromagnetics: From Maxwell to Bearden",
    category: "Course — Preview",
    type: "course",
    preview: "Module 1 — What Maxwell Actually Wrote (vs what we teach). The vacuum is not empty: 200MV of massless charge...",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/47da562a5_generated_image.png",
    href: "/pricing",
    free: false,
    lockedAt: 35,
  },
  {
    id: "prior-art-preview",
    title: "Prior Art Archive — 5 Free Entries",
    category: "Research",
    type: "research",
    preview: "200+ entries from Tesla, Moray, Rife, Gray, Searl, Priore. Discover what's already been built and what was suppressed.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/56476002c_generated_image.png",
    href: "/prior-art",
    free: true,
  },
];

const LOCKED_ITEMS = [
  { title: "MEG Replication Kit", category: "Free Energy", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
  { title: "Scalar Energy Bottle Interferometer", category: "EM Physics", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/991d97732_generated_image.png" },
  { title: "Anenergy Pump Demonstration Circuit", category: "Vacuum Energy", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png" },
  { title: "Telomere Regeneration Device TRD-1", category: "Biotech", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/53f9613a8_generated_image.png" },
  { title: "Gravitobiology Course", category: "Course", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54a56d57f_generated_image.png" },
  { title: "Asymmetric Regauging Generator", category: "Free Energy", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/917a50d37_generated_image.png" },
];

// Gate fires after N free content views
const GATE_AFTER = 2;

export default function FreeVault() {
  const [viewCount, setViewCount] = useState(() => parseInt(localStorage.getItem("zarp_vault_views") || "0"));
  const [showPaywall, setShowPaywall] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const paywallRef = useRef(null);

  const trackView = (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    const newCount = viewCount + 1;
    setViewCount(newCount);
    localStorage.setItem("zarp_vault_views", newCount);
    setExpandedId(id);

    if (newCount >= GATE_AFTER) {
      setTimeout(() => {
        setShowPaywall(true);
        paywallRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-7 w-7 object-contain" />
            <span className="font-black text-lg">ZARP</span>
          </Link>
          <span className="text-gray-500 text-xs border border-gray-700 px-2 py-0.5 rounded">Free Vault</span>
        </div>
        <Link to="/pricing" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors flex items-center gap-2">
          <Zap size={14} /> Unlock Full Access
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-3">Free Engineering Vault</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Real results from advanced builds. Explore freely — unlock the full process with membership.</p>
          {viewCount > 0 && viewCount < GATE_AFTER && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/30 border border-yellow-700 text-yellow-300 text-xs">
              <Eye size={12} /> {GATE_AFTER - viewCount} free view{GATE_AFTER - viewCount !== 1 ? "s" : ""} remaining
            </div>
          )}
        </div>

        {/* Free Items */}
        <div className="space-y-4 mb-16">
          {FREE_ITEMS.map((item) => (
            <div key={item.id} className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${item.free ? "border-cyan-900 hover:border-cyan-700" : "border-gray-800 hover:border-gray-700"}`}>
              <div
                className="flex items-center gap-4 p-4 cursor-pointer"
                onClick={() => item.free ? trackView(item.id) : setShowPaywall(true)}
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img src={item.img} alt={item.title} className={`w-full h-full object-cover ${!item.free && expandedId !== item.id ? "blur-sm" : ""}`} />
                  {!item.free && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Lock size={16} className="text-cyan-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.free ? "bg-cyan-900/50 text-cyan-300" : "bg-gray-800 text-gray-400"}`}>
                      {item.free ? "FREE" : "PREVIEW"}
                    </span>
                    <span className="text-gray-500 text-xs">{item.category}</span>
                  </div>
                  <h3 className="text-white font-bold text-sm">{item.title}</h3>
                  <p className={`text-gray-400 text-xs mt-1 leading-relaxed ${!item.free ? "line-clamp-1" : ""}`}>{item.preview}</p>
                </div>
                <ChevronRight size={16} className={`text-gray-600 flex-shrink-0 transition-transform ${expandedId === item.id ? "rotate-90" : ""}`} />
              </div>

              {/* Expanded content */}
              {expandedId === item.id && item.free && (
                <div className="border-t border-gray-800 p-4 bg-gray-950/50">
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.preview}</p>
                  <Link to={item.href} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-colors">
                    Open Full Build <ArrowRight size={14} />
                  </Link>
                </div>
              )}

              {/* Locked preview blur */}
              {expandedId === item.id && !item.free && (
                <div className="border-t border-gray-800 p-4 relative overflow-hidden">
                  <div className="blur-[6px] select-none pointer-events-none text-gray-300 text-sm leading-relaxed">
                    Step 1: Wind the primary toroidal coil to 1000 turns using AWG 22 magnet wire on a ferrite core. Measure DC resistance — should be 4–8Ω. Step 2: Install the DDS pulse controller... Step 3: Connect the quartz resonator at the designated pad. Frequency target: 32.768 kHz...
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60">
                    <Link to="/pricing" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black transition-colors">
                      <Lock size={16} /> Unlock Full Build — $49/mo
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Locked Vault Preview */}
        <div className="mb-16">
          <h2 className="text-2xl font-black mb-2">Locked in the Full Vault</h2>
          <p className="text-gray-500 text-sm mb-6">35+ more systems, courses, and tools — unlocked with membership.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {LOCKED_ITEMS.map((item, i) => (
              <Link key={i} to="/pricing" className="relative group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-800 transition-colors">
                <div className="h-28 overflow-hidden relative">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover blur-[3px] scale-110 group-hover:blur-[2px] transition-all" />
                  <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center">
                    <Lock size={20} className="text-cyan-400" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-0.5">{item.category}</div>
                  <div className="text-sm font-bold text-gray-300">{item.title}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold transition-all">
              Unlock All 40+ Systems <ChevronRight size={18} />
            </Link>
          </div>
        </div>

        {/* Paywall modal trigger */}
        <div ref={paywallRef} />
        {showPaywall && <PaywallBanner onDismiss={() => setShowPaywall(false)} />}
      </div>
    </div>
  );
}

function PaywallBanner({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 border border-cyan-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl shadow-cyan-950">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-900/40 border border-orange-700 text-orange-300 text-xs font-bold mb-4">
            🔥 You've explored the free content
          </div>
          <h3 className="text-2xl font-black mb-2">Ready to Build?</h3>
          <p className="text-gray-400 text-sm">Unlock all 40+ systems, full build plans, AI tools, and courses.</p>
        </div>
        <div className="space-y-2 mb-6">
          {["Full build plans with BOMs & supplier links", "40+ advanced courses", "AI patent & IP tools", "Prior art archive (200+ entries)"].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <Star size={12} className="text-cyan-400 flex-shrink-0" /> {f}
            </div>
          ))}
        </div>
        <Link to="/pricing" className="block w-full text-center py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg transition-all mb-3">
          Unlock Full Access — $49/mo
        </Link>
        <button onClick={onDismiss} className="block w-full text-center text-gray-500 text-sm hover:text-gray-300 transition-colors py-2">
          Continue browsing free content
        </button>
      </div>
    </div>
  );
}