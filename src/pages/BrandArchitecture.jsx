import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, ExternalLink, Zap, FlaskConical, Shield, Globe } from "lucide-react";

const BRAND = {
  parent: {
    name: "ZENITH APEX",
    tagline: "Beyond the Controlled Ceiling",
    role: "Parent Company · Sovereign Brand",
    desc: "The commanding umbrella identity. Zenith Apex represents the ultimate peak of knowledge, power, and paradigm — operating at the sovereign intersection of suppressed science, free energy, and IP liberation. All divisions operate under this sovereign flag.",
    color: "#ffffff",
    accent: "from-slate-700 to-slate-900",
    border: "border-white/20",
    icon: "⬡",
    pillars: ["Sovereign IP Strategy", "Paradigm-Shift Positioning", "Investor-Grade Credibility", "Zero-Compromise Mission"],
  },
  divisions: [
    {
      name: "ZeroPointX",
      tagline: "Vacuum Energy Research Platform",
      role: "Division I · Research & Intelligence",
      desc: "The digital intelligence platform — housing the Bearden Concept Network, Prior Art Archive, Patent Filing Wizard, Investor Matching Portal, and Threat Monitoring. ZeroPointX is the engine room where suppressed science is catalogued, protected, and commercialized.",
      color: "#3b82f6",
      accent: "from-blue-900/60 to-blue-950/80",
      border: "border-blue-700/50",
      icon: "⚡",
      focus: "Research · IP · Investor Matching · Monitoring",
      products: [
        { label: "Bearden Concept Network", link: "/" },
        { label: "Prior Art Archive", link: "/prior-art" },
        { label: "Patent Filing Wizard", link: "/patent-wizard" },
        { label: "Investor Portal", link: "/investors" },
        { label: "IP Monitoring Dashboard", link: "/monitoring" },
        { label: "Investor CRM", link: "/investor-crm" },
      ],
    },
    {
      name: "Phi Dynamics",
      tagline: "Scalar Field Applications",
      role: "Division II · Applied Technology",
      desc: "The applied engineering arm. Phi Dynamics (φ = scalar potential) develops interactive simulation tools, scalar EM lab environments, and visualization frameworks that make non-Hertzian physics tangible, demonstrable, and investable. The bridge between theory and prototype.",
      color: "#a855f7",
      accent: "from-purple-900/60 to-purple-950/80",
      border: "border-purple-700/50",
      icon: "φ",
      focus: "Simulation · Visualization · Prototype Tools",
      products: [
        { label: "Scalar EM Field Simulator", link: "/scalar-sim" },
        { label: "Wave Interference Lab", link: "/lab" },
        { label: "Scalar EM Lab", link: "/scalar-lab" },
        { label: "EMF Impact Dashboard", link: "/emf-impact" },
        { label: "Business Model Engine", link: "/business" },
      ],
    },
    {
      name: "Negentropy Labs",
      tagline: "R&D · Patent Division",
      role: "Division III · Intellectual Property",
      desc: "The crown jewel — the R&D and patent generation engine. Named after Bearden's concept of negentropy (energy from order), this division handles invention disclosure drafting, prior art cross-referencing, patent landscape mapping, and the full IP lifecycle from concept to granted patent.",
      color: "#22c55e",
      accent: "from-green-900/60 to-green-950/80",
      border: "border-green-700/50",
      icon: "∇",
      focus: "Invention · Drafting · Patent Strategy · IP Lifecycle",
      products: [
        { label: "Patent Drafting Tool", link: "/patent-tool" },
        { label: "Prior Art Cross-Reference", link: "/prior-art" },
        { label: "Patent Landscape Graph", link: "/patent-landscape" },
        { label: "Pitch Builder", link: "/pitch" },
        { label: "Timeline Pitch Deck", link: "/timeline-pitch" },
        { label: "Invention Plans", link: "/invention-plans" },
      ],
    },
  ],
};

function DivisionCard({ division, index, expanded, onToggle }) {
  return (
    <div className={`bg-gradient-to-br ${division.accent} border ${division.border} rounded-2xl overflow-hidden transition-all`}>
      {/* Top bar */}
      <div className="h-1" style={{ backgroundColor: division.color }} />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black border"
              style={{ backgroundColor: division.color + "20", borderColor: division.color + "40", color: division.color }}>
              {division.icon}
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest mb-0.5" style={{ color: division.color }}>
                {division.role}
              </div>
              <h3 className="text-white font-black text-2xl leading-none">{division.name}</h3>
              <p className="text-gray-400 text-sm mt-0.5">{division.tagline}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xs text-gray-600 mb-1">Focus</div>
            <div className="text-xs text-gray-400 leading-relaxed max-w-[140px] text-right">{division.focus}</div>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed mb-5">{division.desc}</p>

        {/* Products */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: division.color }}>
            Platform Tools ({division.products.length})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {division.products.map((p, i) => (
              <Link key={i} to={p.link}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-all group"
                style={{ backgroundColor: division.color + "10", borderLeft: `2px solid ${division.color}40` }}>
                <ChevronRight size={10} style={{ color: division.color }} className="flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BrandArchitecture() {
  const [view, setView] = useState("full"); // full | org

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm"><ArrowLeft size={13} /> Back</Link>
          <div className="w-px h-4 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-sm">Brand Architecture</h1>
            <p className="text-gray-500 text-xs">Zenith Apex · Three-Division Structure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {[["full", "Full View"], ["org", "Org Chart"]].map(([id, label]) => (
              <button key={id} onClick={() => setView(id)}
                className={`px-4 py-1.5 text-xs font-semibold transition-colors ${view === id ? "bg-gray-600 text-white" : "text-gray-500 hover:text-gray-300"}`}>
                {label}
              </button>
            ))}
          </div>
          <Link to="/zenith-apex" className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all">
            <ExternalLink size={11} /> Zenith Apex Site
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-6xl mx-auto w-full">

        {view === "org" ? (
          /* ── Org Chart View ── */
          <div className="flex flex-col items-center gap-0 py-8">
            {/* Parent node */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-white/30 rounded-2xl px-10 py-6 text-center shadow-2xl shadow-white/5 w-80">
              <div className="text-3xl mb-2">⬡</div>
              <h2 className="text-white font-black text-2xl tracking-tight">ZENITH APEX</h2>
              <p className="text-gray-400 text-xs mt-1">Parent Company · Sovereign Brand</p>
              <p className="text-gray-500 text-xs mt-2 italic">"Beyond the Controlled Ceiling"</p>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center">
              <div className="w-px h-10 bg-gray-700" />
              <div className="flex items-center gap-0 w-[700px]">
                <div className="h-px flex-1 bg-gray-700" />
                <div className="w-px h-8 bg-gray-700" />
                <div className="h-px flex-1 bg-gray-700" />
              </div>
            </div>

            {/* Division row */}
            <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
              {BRAND.divisions.map((div, i) => (
                <div key={i} className="flex flex-col items-center gap-0">
                  <div className="w-px h-8 bg-gray-700" />
                  <div className={`bg-gradient-to-br ${div.accent} border ${div.border} rounded-2xl p-5 text-center w-full`}>
                    <div className="text-2xl font-black mb-2" style={{ color: div.color }}>{div.icon}</div>
                    <h3 className="text-white font-black text-lg">{div.name}</h3>
                    <p className="text-xs mt-1 mb-3" style={{ color: div.color }}>{div.tagline}</p>
                    <div className="text-xs text-gray-500 leading-relaxed">{div.focus}</div>
                    <div className="mt-4 space-y-1">
                      {div.products.map((p, j) => (
                        <Link key={j} to={p.link} className="block text-xs text-gray-500 hover:text-gray-300 transition-colors py-0.5">
                          → {p.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-14 flex items-center gap-6 text-xs text-gray-600">
              {BRAND.divisions.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span>{d.name}</span>
                </div>
              ))}
            </div>
          </div>

        ) : (
          /* ── Full View ── */
          <div className="space-y-10">
            {/* Parent */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 border-2 border-white/15 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">Sovereign Parent Entity</span>
              </div>
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-4xl flex-shrink-0">
                  ⬡
                </div>
                <div>
                  <h2 className="text-white font-black text-4xl tracking-tight leading-none mb-1">ZENITH APEX</h2>
                  <p className="text-gray-400 text-base font-semibold mb-3">"{BRAND.parent.tagline}"</p>
                  <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">{BRAND.parent.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BRAND.parent.pillars.map((p, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 font-semibold text-center">
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* Connector visual */}
            <div className="flex items-center gap-4 px-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <div className="text-gray-600 text-xs font-bold tracking-widest uppercase">Three Divisions</div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            </div>

            {/* Divisions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {BRAND.divisions.map((div, i) => (
                <DivisionCard key={i} division={div} index={i} />
              ))}
            </div>

            {/* Brand DNA footer */}
            <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" /> Brand DNA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 font-bold mb-2 flex items-center gap-2"><Globe size={12} className="text-blue-400" /> Mission</p>
                  <p className="text-gray-500 leading-relaxed text-xs">Return suppressed science and infinite-potential physics to sovereign inventors, liberating humanity from controlled energy scarcity.</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold mb-2 flex items-center gap-2"><Shield size={12} className="text-green-400" /> Values</p>
                  <p className="text-gray-500 leading-relaxed text-xs">Anonymity-first IP protection · Open-source knowledge liberation · Alignment-based investment · Non-Hertzian truth-telling.</p>
                </div>
                <div>
                  <p className="text-gray-400 font-bold mb-2 flex items-center gap-2"><FlaskConical size={12} className="text-purple-400" /> Vision</p>
                  <p className="text-gray-500 leading-relaxed text-xs">A world powered by zero-point vacuum energy — where every sovereign inventor has the tools, capital, and protection to bring their work to market.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}