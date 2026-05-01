import { useState, useEffect, useRef, useCallback } from "react";
import { X, Zap, Star, DollarSign, ShoppingCart, FileText, ChevronRight, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Invention catalog data ────────────────────────────────────────────────────
const INVENTION_CATALOG = [
  {
    id: "meg",
    name: "MEG Generator",
    tagline: "Motionless Electromagnetic Generator",
    category: "Electromagnetic",
    status: "Patent Granted",
    patentNo: "US 6,362,718",
    specs: ["Output: 100W–10kW", "Frequency: 60Hz", "No moving parts", "COP > 1.0 claimed"],
    description: "Uses toroidal coil geometry and permanent magnets to extract EM energy from ambient field fluctuations.",
    price: 287,
    emoji: "⚡",
    color: "#00ffff",
    components: ["Toroidal Core Coils", "Permanent Magnets", "Output Rectifier", "Control Circuit", "Heat Sink"],
  },
  {
    id: "scalar",
    name: "Scalar Transmitter",
    tagline: "Longitudinal Wave Emitter",
    category: "Scalar EM",
    status: "Patent Pending",
    patentNo: "US 2019/0089380",
    specs: ["Range: 1–500km", "Freq: 1–30MHz", "Phase conjugate", "Non-Hertzian waves"],
    description: "Biconical antenna configuration generating scalar EM waves via destructive interference of orthogonal EM fields.",
    price: 243,
    emoji: "📡",
    color: "#ff00ff",
    components: ["Biconical Antenna Array", "Phase Conjugate Mirror", "RF Amplifier", "Frequency Synthesizer", "Shielding"],
  },
  {
    id: "zpe",
    name: "Zero-Point Extractor",
    tagline: "Quantum Vacuum Harvester",
    category: "Quantum Effects",
    status: "Research Phase",
    patentNo: "Provisional Filed",
    specs: ["ZPE coupling: 0.1–3%", "Casimir gap: 10–100nm", "Temp: 4K–300K", "Power density: 10W/cm²"],
    description: "Quantum vacuum fluctuation harvesting using high-frequency oscillation circuits and Casimir cavity principles.",
    price: 389,
    emoji: "🌌",
    color: "#00ff88",
    components: ["Casimir Plates", "Nano-gap Controller", "Quantum Rectifier", "Cryogenic Chamber", "MEMS Actuators"],
  },
  {
    id: "priore",
    name: "Prioré Device",
    tagline: "RF Bioelectromagnetic System",
    category: "Bioelectromagnetics",
    status: "Suppressed",
    patentNo: "FR 1,342,772",
    specs: ["RF power: 50W", "Freq: 9.4GHz", "Helical coil: 4 turns", "Rotating plasma field"],
    description: "RF-driven cylindrical cavity with secondary helical coils generating complex EM field patterns for bioelectromagnetic effects.",
    price: 349,
    emoji: "🔬",
    color: "#ffff00",
    components: ["Magnetron Source", "Rotating Plasma Tube", "Helical Resonator", "Field Containment", "Control Panel"],
  },
  {
    id: "torsion",
    name: "Torsion Field Generator",
    tagline: "Spin-Torsion Wave Emitter",
    category: "Torsion Fields",
    status: "Prototype",
    patentNo: "RU 2091807",
    specs: ["Spin field angle: 0–360°", "Propagation: instant", "Angular momentum: ℏ/2", "Detection: quartz sensor"],
    description: "Spinning charge assembly producing torsion field propagation through spacetime topology. Russian research origin.",
    price: 167,
    emoji: "🌀",
    color: "#ff0088",
    components: ["Spinning Charge Disk", "Angular Velocity Controller", "Torsion Detector", "Phase Array", "Isolation Mount"],
  },
  {
    id: "resonance",
    name: "Resonance Cavity",
    tagline: "Tuned EM Amplification Chamber",
    category: "Resonance",
    status: "Patent Granted",
    patentNo: "US 5,590,031",
    specs: ["Q factor: >10,000", "Modes: TM010–TM030", "Material: OFHC Copper", "Tuning: ±500kHz"],
    description: "Tuned cylindrical chamber exploiting cavity resonance modes to amplify EM energy at specific frequencies.",
    price: 194,
    emoji: "📿",
    color: "#8800ff",
    components: ["OFHC Copper Cavity", "Tuning Plunger", "Coupling Loop", "Vector Network Analyzer", "Thermal Stabilizer"],
  },
];

const SEARCH_KEYWORDS = {
  tesla: ["Tesla Coil", "Scalar EM", "MEG Generator", "Longitudinal waves", "∇×B = μ₀J", "Φ = LI"],
  einstein: ["Relativity", "E=mc²", "Zero-Point Energy", "Spacetime curvature", "G_μν = 8πT_μν"],
  priore: ["Bioelectromagnetics", "RF healing", "Rotating plasma", "Cancer research", "Antoine Prioré"],
  scalar: ["Scalar waves", "MEG", "Phase conjugate", "Bearden", "∇²φ = 0"],
  pyramid: ["Sacred geometry", "Golden ratio", "Phi field", "Resonance chamber", "Φ = (1+√5)/2"],
  resonance: ["Resonance Cavity", "Q factor", "Harmonic coupling", "ω = √(LC)⁻¹"],
};

// ── Floating Glass Panel ──────────────────────────────────────────────────────
function InventionPanel({ invention, onClose, onBuy }) {
  const [tab, setTab] = useState("specs");
  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    setBuying(true);
    if (window.self !== window.top) {
      alert("Purchase only available from published app. Please visit the published URL.");
      setBuying(false);
      return;
    }
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: invention.name,
      priceInCents: invention.price * 100,
      description: invention.tagline,
      category: "Component Kit",
      successUrl: window.location.origin + "/orders",
      cancelUrl: window.location.href,
    });
    if (res?.data?.url) window.location.href = res.data.url;
    setBuying(false);
  };

  return (
    <div
      className="fixed z-50 pointer-events-auto"
      style={{
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "min(90vw, 480px)",
      }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "rgba(0,0,20,0.85)",
          backdropFilter: "blur(24px)",
          border: `1.5px solid ${invention.color}44`,
          boxShadow: `0 0 40px ${invention.color}33, 0 20px 60px rgba(0,0,0,0.7)`,
        }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-white/10 flex items-start justify-between gap-3"
          style={{ background: `linear-gradient(135deg, ${invention.color}18 0%, transparent 100%)` }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{invention.emoji}</span>
            <div>
              <h3 className="text-white font-black text-lg leading-tight">{invention.name}</h3>
              <p style={{ color: invention.color }} className="text-xs font-bold">{invention.tagline}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0 mt-1">
            <X size={18} />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-6 py-2 flex items-center gap-3 flex-wrap border-b border-white/5">
          <span className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: invention.color + "22", color: invention.color, border: `1px solid ${invention.color}44` }}>
            {invention.status}
          </span>
          <span className="text-gray-500 text-xs">{invention.patentNo}</span>
          <span className="text-gray-600 text-xs">•</span>
          <span className="text-gray-400 text-xs">{invention.category}</span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5">
          {["specs", "components", "about"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-bold capitalize transition-all ${tab === t ? "text-white border-b-2" : "text-gray-500 hover:text-gray-300"}`}
              style={tab === t ? { borderColor: invention.color } : {}}>
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-4 min-h-32">
          {tab === "specs" && (
            <div className="space-y-2">
              {invention.specs.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: invention.color }} />
                  <span className="text-gray-200 text-sm">{s}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "components" && (
            <div className="space-y-2">
              {invention.components.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs w-5">{i + 1}.</span>
                  <span className="text-gray-200 text-sm">{c}</span>
                </div>
              ))}
            </div>
          )}
          {tab === "about" && (
            <p className="text-gray-300 text-sm leading-relaxed">{invention.description}</p>
          )}
        </div>

        {/* Buy button */}
        <div className="px-6 pb-5">
          <button
            onClick={handleBuy}
            disabled={buying}
            className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all"
            style={{
              background: `linear-gradient(135deg, ${invention.color}dd, ${invention.color}88)`,
              color: "#000",
              opacity: buying ? 0.6 : 1,
            }}>
            <ShoppingCart size={16} />
            {buying ? "Processing..." : `Get Build Kit — $${invention.price}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Search Sync Panel ─────────────────────────────────────────────────────────
function SearchSyncPanel({ onSearch, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = (q) => {
    setQuery(q);
    if (!q.trim()) { setResults(null); return; }
    const lower = q.toLowerCase();
    const match = Object.entries(SEARCH_KEYWORDS).find(([k]) => lower.includes(k));
    if (match) {
      setResults({ keyword: match[0], tags: match[1] });
      onSearch(match[0]);
    } else {
      setResults({ keyword: q, tags: ["Searching cosmic database...", "Synchronizing ion fields", "Activating portals"] });
      onSearch(q);
    }
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto w-full max-w-lg px-4">
      <div className="rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(0,0,20,0.9)", backdropFilter: "blur(24px)", border: "1px solid #00ffff33" }}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Search size={16} className="text-cyan-400 flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search inventor, invention, or topic..."
            className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
          />
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>
        {results && (
          <div className="border-t border-white/10 px-4 py-3 space-y-2">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
              🌌 Cosmic Sync Active — {results.keyword}
            </p>
            <div className="flex flex-wrap gap-2">
              {results.tags.map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-xs text-cyan-300 border border-cyan-800 bg-cyan-950/40">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-xs">Portals and ion fields synchronized to this research topic.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Floating Inventory HUD (mini-bubbles) ────────────────────────────────────
function InventionHUD({ onSelect, activeSearch }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
        style={{ background: "rgba(0,0,20,0.8)", backdropFilter: "blur(16px)", border: "1px solid #ffffff11" }}>
        <span className="text-gray-500 text-xs font-bold mr-2 hidden sm:block">CATALOG</span>
        {INVENTION_CATALOG.map(inv => (
          <button
            key={inv.id}
            onClick={() => onSelect(inv)}
            className="group relative flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-125"
            style={{ background: inv.color + "22", border: `1px solid ${inv.color}44` }}
            title={inv.name}
          >
            <span className="text-lg">{inv.emoji}</span>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap border border-gray-700 z-50">
              {inv.name}
            </div>
          </button>
        ))}
        <div className="w-px h-6 bg-white/10 mx-1" />
        <div className="text-gray-600 text-xs hidden sm:block">hover for specs</div>
      </div>
    </div>
  );
}

// ── Build Library Viewer ──────────────────────────────────────────────────────
function BuildLibraryViewer({ invention, onClose }) {
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNext = () => {
    if (step < invention.components.length - 1) {
      setAnimating(true);
      setTimeout(() => { setStep(s => s + 1); setAnimating(false); }, 300);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setAnimating(true);
      setTimeout(() => { setStep(s => s - 1); setAnimating(false); }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      style={{ background: "rgba(0,0,10,0.7)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(0,0,25,0.95)", border: `1.5px solid ${invention.color}55` }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10"
          style={{ background: `linear-gradient(135deg, ${invention.color}15 0%, transparent 100%)` }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{invention.emoji}</span>
            <div>
              <h3 className="text-white font-black text-lg">{invention.name}</h3>
              <p className="text-gray-400 text-xs">Assembly Explosion Viewer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        {/* 3D Assembly visualization area */}
        <div className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{ background: `radial-gradient(ellipse at center, ${invention.color}11 0%, transparent 70%)` }}>
          {/* Central component display */}
          <div
            className="text-center transition-all duration-300"
            style={{ opacity: animating ? 0 : 1, transform: animating ? "scale(0.8)" : "scale(1)" }}>
            <div
              className="w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-3 text-4xl"
              style={{
                background: `radial-gradient(circle, ${invention.color}33 0%, transparent 70%)`,
                border: `2px solid ${invention.color}66`,
                boxShadow: `0 0 30px ${invention.color}44`,
                animation: "spin 8s linear infinite",
              }}>
              {invention.emoji}
            </div>
            <p style={{ color: invention.color }} className="font-black text-lg">{invention.components[step]}</p>
            <p className="text-gray-500 text-xs mt-1">Component {step + 1} of {invention.components.length}</p>
          </div>

          {/* Schematic floating tags */}
          {invention.specs.slice(0, 3).map((spec, i) => (
            <div key={i}
              className="absolute text-xs font-mono border rounded px-2 py-1 pointer-events-none"
              style={{
                top: `${20 + i * 28}%`, left: i % 2 === 0 ? "5%" : "auto", right: i % 2 !== 0 ? "5%" : "auto",
                color: invention.color, borderColor: invention.color + "44",
                background: "rgba(0,0,20,0.7)",
                opacity: 0.7 + i * 0.1,
              }}>
              {spec}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="px-6 py-2 flex gap-1.5">
          {invention.components.map((_, i) => (
            <div key={i}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{ background: i <= step ? invention.color : "#ffffff11" }} />
          ))}
        </div>

        {/* All components list */}
        <div className="px-6 py-4 grid grid-cols-2 gap-2 border-t border-white/5">
          {invention.components.map((comp, i) => (
            <button key={i}
              onClick={() => { setAnimating(true); setTimeout(() => { setStep(i); setAnimating(false); }, 200); }}
              className="flex items-center gap-2 text-left p-2 rounded-lg transition-all text-sm"
              style={{
                background: i === step ? invention.color + "22" : "transparent",
                border: `1px solid ${i === step ? invention.color + "66" : "transparent"}`,
              }}>
              <span className="text-gray-500 text-xs w-4 flex-shrink-0">{i + 1}</span>
              <span className={i === step ? "text-white font-bold" : "text-gray-400"}>{comp}</span>
              {i < step && <span className="ml-auto text-green-400 text-xs">✓</span>}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={handlePrev} disabled={step === 0}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 text-sm font-bold disabled:opacity-30 hover:bg-white/5 transition-all">
            ← Prev
          </button>
          <button onClick={handleNext} disabled={step === invention.components.length - 1}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={{ background: step < invention.components.length - 1 ? invention.color : "#ffffff22", color: "#000" }}>
            Next →
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Main Overlay Component ────────────────────────────────────────────────────
export default function CosmicOverlay({ onSearchSync }) {
  const [selectedInvention, setSelectedInvention] = useState(null);
  const [showBuildLibrary, setShowBuildLibrary] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowSearch(s => !s); }
      if (e.key === "Escape") { setShowSearch(false); setSelectedInvention(null); setShowBuildLibrary(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearchSync = useCallback((query) => {
    setSearchQuery(query);
    if (onSearchSync) onSearchSync(query);
  }, [onSearchSync]);

  const handleSelectInvention = (inv) => {
    setSelectedInvention(inv);
    setShowBuildLibrary(false);
  };

  const handleOpenBuildLibrary = (inv) => {
    setShowBuildLibrary(true);
    setSelectedInvention(inv);
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Top controls bar */}
      <div className="absolute top-4 right-4 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setShowSearch(s => !s)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: "rgba(0,0,20,0.8)", backdropFilter: "blur(12px)", border: "1px solid #00ffff33", color: "#00ffff" }}>
          <Search size={14} /> Sync Search <span className="text-gray-600 hidden sm:inline">⌘K</span>
        </button>
        <button
          onClick={() => { setShowBuildLibrary(true); setSelectedInvention(selectedInvention || INVENTION_CATALOG[0]); }}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: "rgba(0,0,20,0.8)", backdropFilter: "blur(12px)", border: "1px solid #ff00ff33", color: "#ff00ff" }}>
          <Zap size={14} /> Build Library
        </button>
      </div>

      {/* Search sync panel */}
      {showSearch && (
        <SearchSyncPanel
          onSearch={handleSearchSync}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* Invention detail panel */}
      {selectedInvention && !showBuildLibrary && (
        <InventionPanel
          invention={selectedInvention}
          onClose={() => setSelectedInvention(null)}
          onBuild={() => handleOpenBuildLibrary(selectedInvention)}
        />
      )}

      {/* Build Library Viewer */}
      {showBuildLibrary && selectedInvention && (
        <BuildLibraryViewer
          invention={selectedInvention}
          onClose={() => setShowBuildLibrary(false)}
        />
      )}

      {/* Bottom HUD */}
      <InventionHUD
        onSelect={handleSelectInvention}
        activeSearch={searchQuery}
      />

      {/* Search sync visual indicator */}
      {searchQuery && (
        <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none">
          <div className="space-y-2" style={{ opacity: 0.7 }}>
            {(SEARCH_KEYWORDS[searchQuery.toLowerCase()] || []).slice(0, 4).map((tag, i) => (
              <div key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-mono border"
                style={{
                  background: "rgba(0,255,255,0.05)",
                  borderColor: "#00ffff33",
                  color: "#00ffff",
                  animation: `fadeInLeft 0.4s ease ${i * 0.1}s both`,
                }}>
                ⟨ {tag} ⟩
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}