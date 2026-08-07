import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Dna, Cog, FileText, Package, Shield, AlertTriangle, ChevronRight, Box, Wrench, Zap } from "lucide-react";
import TherapyPodExplodedView from "../components/TherapyPodExplodedView";
import TherapyPodEngineeringDocs from "../components/TherapyPodEngineeringDocs";
import AttributionFooter from "../components/AttributionFooter";

export default function TherapyPodPro() {
  const [view, setView] = useState("overview"); // overview, cad, engineering

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Graph
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Dna size={16} className="text-rose-400" />
            <div>
              <h1 className="text-white font-black text-lg">Therapy Pod — Engineering Package</h1>
              <p className="text-gray-500 text-xs">ZA-TP-001 Rev C · PRD · PDR · BOM · SOW · 3D CAD · Not for Sale</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-950/60 border border-red-800 text-red-400 uppercase tracking-wider">
              Not for Sale
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-950/40 border border-yellow-800 text-yellow-400 uppercase tracking-wider">
              Research Only
            </span>
          </div>
        </div>
      </div>

      {/* View tabs */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {[
            { id: "overview", label: "Overview", icon: <Heart size={14} /> },
            { id: "cad", label: "3D CAD Exploded View", icon: <Box size={14} /> },
            { id: "engineering", label: "Engineering Docs", icon: <FileText size={14} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === tab.id
                  ? "bg-gray-800 text-white border border-gray-700"
                  : "text-gray-500 hover:text-gray-300 border border-transparent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {view === "overview" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="rounded-3xl border border-gray-800 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-black">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/50 text-rose-400 text-xs font-bold uppercase tracking-widest w-fit mb-4">
                    <Dna size={12} /> Unified Bioelectromagnetic System
                  </div>
                  <h2 className="text-3xl font-black leading-tight mb-3">
                    One Pod. <span className="text-rose-400">Every Healing Modality.</span>
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    The Therapy Pod (ZA-TP-001) synthesizes every documented suppressed healing technology into a single
                    integrated device. Engineering-grade documentation includes a complete PRD, PDR, BOM (67 line items,
                    842 components), and SOW with 13-phase WBS — plus a 3D exploded CAD rendering of all 12 subsystems.
                  </p>
                  <div className="grid grid-cols-4 gap-3 mt-2">
                    <div className="text-center">
                      <p className="text-2xl font-black text-cyan-400">12</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Subsystems</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-green-400">8</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Concepts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-yellow-400">67</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">BOM Items</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-rose-400">42</p>
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">Weeks</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setView("cad")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-sm font-bold transition-colors"
                    >
                      <Box size={14} /> View 3D CAD
                    </button>
                    <button
                      onClick={() => setView("engineering")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-bold transition-colors"
                    >
                      <FileText size={14} /> Engineering Docs
                    </button>
                  </div>
                </div>

                {/* Right: Pod visualization */}
                <div className="relative min-h-[300px] flex items-center justify-center p-8 border-l border-gray-800/50">
                  <div className="relative w-56 h-56">
                    <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: "#ec489940", background: "radial-gradient(circle, #ec489915 0%, transparent 70%)" }} />
                    <div className="absolute inset-8 rounded-full border border-dashed animate-spin" style={{ borderColor: "#06b6d440", animationDuration: "20s" }} />
                    <div className="absolute inset-16 rounded-full flex items-center justify-center" style={{ background: "radial-gradient(circle, #f59e0b30 0%, #ec489920 50%, transparent 100%)", border: "1px solid #f59e0b50" }}>
                      <Heart size={28} className="text-rose-400" />
                    </div>
                    {/* Orbiting subsystem dots */}
                    {[
                      { color: "#ef4444", label: "Safety" },
                      { color: "#f59e0b", label: "Power" },
                      { color: "#6366f1", label: "G-Scaling" },
                      { color: "#ec4899", label: "Diagnostic" },
                      { color: "#06b6d4", label: "Scalar Coils" },
                      { color: "#2dd4bf", label: "Prioré" },
                      { color: "#eab308", label: "Nada" },
                      { color: "#14b8a6", label: "Vortex" },
                    ].map((c, i) => {
                      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                      const r = 104;
                      const x = 112 + Math.cos(angle) * r;
                      const y = 112 + Math.sin(angle) * r;
                      return (
                        <button
                          key={c.label}
                          onClick={() => setView("cad")}
                          className="absolute w-7 h-7 rounded-full flex items-center justify-center text-xs transition-transform hover:scale-125"
                          style={{ left: `${x - 14}px`, top: `${y - 14}px`, background: `${c.color}30`, border: `1.5px solid ${c.color}` }}
                          title={c.label}
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Subsystem summary */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">Integrated Subsystems (12)</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Orgone Accumulator Envelope", icon: "🟢", desc: "Alternating organic/metallic layers (Reich). Biofield concentration via ≥1.0°F temp differential.", color: "#2d4a2d" },
                  { name: "Scalar EM Coil Array", icon: "⚡", desc: "8 bifilar coil pairs (octagonal). Counter-phased → longitudinal wave (E=0, B=0, ∇φ≠0).", color: "#06b6d4" },
                  { name: "Prioré Multichannel Modulator", icon: "🧬", desc: "F1/F2/F3 → derivative Fz. Bedini-conditioned tubes. Phase-conjugate disease reversal.", color: "#2dd4bf" },
                  { name: "Rife/Lisitsyn Frequency System", icon: "📡", desc: "24 biological coupling windows (12.5 Hz – 6.1×10¹⁴ Hz). Pathogen mortal oscillatory rates.", color: "#3b82f6" },
                  { name: "Schauberger Vortex Water", icon: "💧", desc: "4°C implosion vortex. Corrugated Repulsine impeller. Centripetal negentropic structuring.", color: "#14b8a6" },
                  { name: "Vedic Nada Acoustic Manifold", icon: "🎵", desc: "7 chakra transducers. Bija syllables (LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz).", color: "#eab308" },
                  { name: "Global Scaling Resonator Array", icon: "⚛️", desc: "Piezoelectric G-Elements. Node frequencies: 5 Hz, 101 Hz, 2032 Hz, 40.8 kHz.", color: "#6366f1" },
                  { name: "Emission Spectrum Diagnostic", icon: "🔬", desc: "UV/Vis spectrometer (200–800nm, 0.1nm res). 6 quartz portholes. Delta-spectrum computation.", color: "#ec4899" },
                  { name: "TRZ Field Chamber Controller", icon: "🌀", desc: "Phase-conjugate ratio monitoring (>0.8 target). Time-Reversal Zone stabilization.", color: "#a855f7" },
                  { name: "Safety & Interlock Subsystem", icon: "🛡️", desc: "EM field probe, patient isolation, UV shutters, <100ms emergency cutoff.", color: "#ef4444" },
                  { name: "Embedded Controller", icon: "💻", desc: "BeagleBone AI-64 + Lattice iCE40 FPGA. Real-time subsystem coordination.", color: "#f59e0b" },
                  { name: "Power Distribution", icon: "🔌", desc: "5kVA medical isolation transformer. Multi-rail DC (24V/48V/12V). <3kW total.", color: "#f97316" },
                ].map((sub, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors" style={{ borderTopColor: sub.color, borderTopWidth: 2 }}>
                    <div className="text-2xl mb-2">{sub.icon}</div>
                    <h4 className="text-white font-bold text-sm mb-1">{sub.name}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{sub.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suppressed concepts summary */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-red-400" />
                <h3 className="text-white font-black text-lg">Suppressed Healing Technologies Integrated</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: "Prioré Device", inv: "Antoine Prioré", yr: "1962", sup: "Funding withdrawn 1980s; device dismantled" },
                  { name: "Rife Beam Ray", inv: "Royal R. Rife", yr: "1930s", sup: "FDA raid 1939; equipment destroyed" },
                  { name: "Scalar EM / Kindling", inv: "T.E. Bearden", yr: "1980s", sup: "DoD classification; Sec. 181 secrecy" },
                  { name: "Reich Orgone Accumulator", inv: "Wilhelm Reich", yr: "1940s", sup: "FDA injunction 1954; books burned 1956" },
                  { name: "Schauberger Implosion", inv: "Viktor Schauberger", yr: "1930s", sup: "Coerced into US contract 1958; died on return" },
                  { name: "Kaznacheyev Effect", inv: "V.P. Kaznacheyev", yr: "1974", sup: "Soviet classification; Western dismissal" },
                  { name: "Global Scaling (G-Com)", inv: "Dr. Hartmut Müller", yr: "1982", sup: "Academic ostracism; patent rejection" },
                  { name: "Vedic Nada Brahma", inv: "Vedic seers", yr: "c. 1500 BCE", sup: "Colonial dismissal; academic reductionism" },
                ].map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-800 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={14} className="text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold text-xs">{c.name}</p>
                        <span className="text-gray-600 text-xs">· {c.inv} · {c.yr}</span>
                      </div>
                      <p className="text-red-300/60 text-xs mt-0.5">{c.sup}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl bg-yellow-950/20 border border-yellow-800/40 px-5 py-3">
              <p className="text-yellow-200/70 text-xs leading-relaxed">
                <span className="font-bold text-yellow-300">Research & Experimental:</span> All concepts are derived from
                published works attributed to their original authors (Bearden, Prioré, Rife, Reich, Schauberger, et al.)
                and the Vedic/Sanskrit textual tradition. The Therapy Pod is a research prototype — not for clinical
                diagnostic or therapeutic use without IRB approval and 510(k) clearance. Not for sale. Referenced under
                Fair Use (17 U.S.C. § 107).
              </p>
            </div>

            <AttributionFooter compact />
          </div>
        )}

        {view === "cad" && (
          <div className="space-y-6">
            <TherapyPodExplodedView />

            {/* Part callouts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { ref: "SAF", name: "Safety & Interlock Module", desc: "EM field probe, patient isolation monitor, UV interlocked shutters, <100ms emergency cutoff", color: "#ef4444" },
                { ref: "CTL", name: "Control Electronics & HMI", desc: "BeagleBone AI-64 embedded controller, Lattice iCE40 FPGA, 10.1\" touchscreen operator interface", color: "#f59e0b" },
                { ref: "GSC", name: "Global Scaling Resonator Array", desc: "4 piezoelectric G-Elements in mu-metal isolation. Node freqs: 5Hz, 101Hz, 2032Hz, 40.8kHz", color: "#6366f1" },
                { ref: "DIAG", name: "Emission Spectrum Diagnostic Ring", desc: "Ocean Insight Flame spectrometer (200-800nm, 0.1nm), 6 quartz portholes, FLIR thermal camera", color: "#ec4899" },
                { ref: "EM", name: "Scalar EM Coil Array (Octagonal)", desc: "8 bifilar coil pairs on Fair-Rite 77 ferrite cores, AWG14, 144 turns, 10-40kHz carrier", color: "#06b6d4" },
                { ref: "PRI", name: "Prioré Multichannel Modulator", desc: "3-channel DDS (AD9854), Bedini-conditioned electron tubes, double-balanced mixers, OCXO reference", color: "#2dd4bf" },
                { ref: "NAD", name: "Vedic Nada Acoustic Manifold", desc: "7 directional transducers at chakra points. Bija: LAM 256, VAM 288, RAM 320, YAM 341, HAM 384, OM 426 Hz", color: "#eab308" },
                { ref: "BED", name: "Patient Treatment Bed", desc: "Carbon fiber, EM transparent, 1.9m × 0.7m, 300kg load capacity, adjustable", color: "#1a1a1a" },
                { ref: "VOR", name: "Schauberger Vortex Water System", desc: "Corrugated Repulsine impeller, 40L borosilicate chamber, Peltier+compressor hybrid, 4°C ±0.5°C", color: "#14b8a6" },
                { ref: "PWR", name: "Power Distribution Bay", desc: "5kVA medical isolation transformer, multi-rail DC (24V/48V/12V), <3kW total consumption", color: "#f97316" },
                { ref: "FAF", name: "Faraday Shield", desc: "0.1mm copper mesh, 99.9% purity, 360° EM enclosure around patient chamber", color: "#8B4513" },
                { ref: "ORG", name: "Orgone Accumulator Envelope", desc: "20 alternating organic (sheep wool felt) / metallic (galvanized steel) layers, ≥1.0°F differential", color: "#2d4a2d" },
              ].map((part) => (
                <div key={part.ref} className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: part.color, borderLeftWidth: 3 }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-400">{part.ref}</span>
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: part.color }} />
                  </div>
                  <h4 className="text-white font-bold text-sm mb-1">{part.name}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{part.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "engineering" && (
          <TherapyPodEngineeringDocs />
        )}
      </div>
    </div>
  );
}