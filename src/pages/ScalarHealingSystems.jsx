import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain, Dna, Heart, Shield, Zap, Sparkles,
  AlertTriangle, BookOpen, Cpu, Activity, Radio, Wind
} from "lucide-react";
import ScalarHealingExplodedView from "@/components/ScalarHealingExplodedView";
import BrainHealingExplodedView from "@/components/BrainHealingExplodedView";

const HEALING_SYSTEMS = [
  {
    id: "brain",
    icon: Brain,
    color: "#06b6d4",
    title: "Brain / Nervous System",
    subtitle: "Trigger Window Frequencies · Phase-Conjugate Scalar Fields",
    physics: "7.83 Hz Schumann + 10 Hz alpha restore coherent neural oscillation. Phase-conjugate scalar fields enhance synaptic plasticity and stimulate neurogenesis.",
    outcomes: ["Cognitive clarity", "Trauma recovery", "Neurological disease reversal"],
    mechanism: "Schumann-trigger window frequencies entrain neural oscillation back to coherent baseline. Phase conjugation time-reverses pathological neural patterns to healthy morphogenetic blueprint.",
    device: "Cranial Scalar Helmet — 8-coil crown array + 19-channel EEG + 7.83 Hz Schumann generator + phase conjugate mirror",
    specs: [
      { label: "Frequency", value: "7.83 Hz Schumann + 10 Hz alpha" },
      { label: "Coil Array", value: "8-coil toroidal crown" },
      { label: "EEG Feedback", value: "19-channel 10-20 system" },
      { label: "PCM", value: "Quartz crystal array" },
    ],
    hasView: true,
  },
  {
    id: "dna",
    icon: Dna,
    color: "#8b5cf6",
    title: "DNA Repair",
    subtitle: "Scalar Phi-Field Coherence · Kindling-Reversal Mechanism",
    physics: "Scalar phi-field coherence impresses correct morphogenetic template on cellular DNA. Bearden's kindling-reversal mechanism: phase conjugate mirror time-reverses disease patterns to healthy state.",
    outcomes: ["Accelerated DNA repair", "Cancer cell normalization", "Aging reversal"],
    mechanism: "The phi-ratio scalar field creates a virtual-state template that the DNA 'reads' as its original healthy blueprint. The phase conjugate mirror reverses the entropy gradient — disease state → healthy state.",
    device: "Phi-Field Coherence Chamber — dual toroidal scalar coils with phi-ratio winding + DDS modulation",
    specs: [
      { label: "Field Type", value: "Scalar phi-ratio toroidal" },
      { label: "Modulation", value: "DDS 3-layer (S'/S''/S''')" },
      { label: "Template", value: "Morphogenetic virtual-state" },
      { label: "Reversal", value: "Phase conjugate time-reverse" },
    ],
  },
  {
    id: "heart",
    icon: Heart,
    color: "#ef4444",
    title: "Heart Coherence",
    subtitle: "Helmholtz Prioré-Architecture · Schumann Synchronization",
    physics: "Helmholtz coil Prioré-architecture delivers S'/S''/S''' layered modulation that synchronizes cardiac rhythms to Earth's natural Schumann field — documented in HeartMath Institute research.",
    outcomes: ["HRV restoration", "Cardiovascular disease reversal", "Trauma release"],
    mechanism: "Layered S'/S''/S''' modulation entrains the heart's intrinsic rhythmic patterns to the 7.83 Hz Schumann baseline. HRV (heart rate variability) — the key biomarker of cardiac health — is restored to youthful coherence.",
    device: "Cardiac Helmholtz Vest — paired Helmholtz coils + 3-layer DDS modulation + ECG feedback",
    specs: [
      { label: "Coil Type", value: "Helmholtz pair (Prioré)" },
      { label: "Modulation", value: "S'/S''/S''' 3-layer" },
      { label: "Target", value: "7.83 Hz Schumann sync" },
      { label: "Feedback", value: "ECG + HRV real-time" },
    ],
  },
  {
    id: "immune",
    icon: Shield,
    color: "#10b981",
    title: "Immune Amplification",
    subtitle: "Kaznacheyev-Derived UV Photon Therapy · Cytopathogenic Reversal",
    physics: "Kaznacheyev-derived UV photon therapy reverses cytopathogenic EM patterns — impresses healthy cell EM signature on diseased tissue. NK cell activity triples within 72h (documented).",
    outcomes: ["Autoimmune reversal", "Cancer immunity", "Infection elimination"],
    mechanism: "UV photons carrying the EM signature of healthy cells are beamed into diseased tissue. The diseased cells 'read' the healthy signature and revert — Kaznacheyev's cytopathogenic effect run in reverse. NK (Natural Killer) cell activity triples within 72 hours.",
    device: "UV Photon Immune Imprinter — UV-C/UV-A photon array + scalar carrier + healthy tissue reference",
    specs: [
      { label: "Photon Source", value: "UV-C 254nm + UV-A 365nm" },
      { label: "Carrier", value: "Scalar field modulation" },
      { label: "Reference", value: "Healthy tissue EM signature" },
      { label: "NK Cell Effect", value: "3× activity in 72h" },
    ],
  },
  {
    id: "mitochondria",
    icon: Zap,
    color: "#f59e0b",
    title: "Mitochondria / Energy",
    subtitle: "Anenergy Pump Frequencies · VPO Circuit Resonance · Moray Mechanism",
    physics: "Anenergy pump frequencies (VPO circuit resonance) couple to cellular ATPase via phi-field — increases ATP production without additional metabolic input. Moray mechanism at cellular scale.",
    outcomes: ["Energy restoration", "Chronic fatigue elimination", "Metabolic healing"],
    mechanism: "The VPO (Vacuum Potential Oscillator) circuit creates an 'anenergy pump' — drawing vacuum energy into the cellular ATPase via phi-field coupling. ATP production increases without additional food input. This is T. Henry Moray's radiant energy mechanism applied at the cellular scale.",
    device: "Mitochondrial Anenergy Pump — VPO circuit + phi-ratio coupling coil + ATPase resonance driver",
    specs: [
      { label: "Circuit", value: "VPO (Vacuum Potential Osc.)" },
      { label: "Coupling", value: "Phi-ratio scalar field" },
      { label: "Target", value: "ATPase enzyme resonance" },
      { label: "Effect", value: "ATP ↑ without metabolic input" },
    ],
  },
  {
    id: "cellular",
    icon: Sparkles,
    color: "#ec4899",
    title: "Cellular Regeneration",
    subtitle: "Prioré Multichannel EM · DDS 3-Layer Modulation · Virtual-State Template",
    physics: "Prioré multichannel EM architecture (DDS 3-layer modulation) directly impresses healthy virtual-state template into target tissue — regenerating cells to their morphogenetic blueprint.",
    outcomes: ["Wound healing 10×", "Organ regeneration", "Age reversal at cellular level"],
    mechanism: "The Prioré device uses a rotating plasma tube + 3 layers of DDS modulation (S'/S''/S''') to impress a complete healthy 'virtual-state' template into diseased tissue. Cells regenerate to their original morphogenetic blueprint — wounds heal 10× faster, organs regenerate.",
    device: "Prioré Multichannel EM Device — rotating plasma tube + 3-layer DDS + Helmholtz confinement + FPGA control",
    specs: [
      { label: "Architecture", value: "Prioré multichannel EM" },
      { label: "Modulation", value: "DDS 3-layer S'/S''/S'''" },
      { label: "Plasma Source", value: "Mercury-argon rotating tube" },
      { label: "Controller", value: "FPGA + DDS synthesizers" },
    ],
    hasView: true,
  },
];

export default function ScalarHealingSystems() {
  const [activeSystem, setActiveSystem] = useState("cellular");

  const current = HEALING_SYSTEMS.find(s => s.id === activeSystem);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-indigo-950/30 border-b border-gray-800 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">ZARP Research Division · Suppressed Physics</span>
          </div>
          <h1 className="text-3xl font-black">Scalar Healing — System by System</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            The same physics that enables EM weapons enables EM healing. Bearden's framework shows that the precise frequencies and modulation architectures that damage biology — can, when inverted via phase conjugation — restore it to the morphogenetic blueprint.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System selector grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {HEALING_SYSTEMS.map(s => {
            const Icon = s.icon;
            const isActive = activeSystem === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSystem(s.id)}
                className={`relative p-4 rounded-2xl border text-left transition-all ${isActive ? "shadow-lg" : "border-gray-800 hover:border-gray-600"}`}
                style={isActive ? { borderColor: s.color, backgroundColor: `${s.color}10`, boxShadow: `0 0 20px ${s.color}20` } : {}}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}40` }}>
                  <Icon size={18} style={{ color: s.color }} />
                </div>
                <p className="text-white font-bold text-xs leading-tight">{s.title}</p>
                <p className="text-gray-600 text-[9px] mt-0.5 leading-tight line-clamp-2">{s.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active system detail */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ borderColor: current.color + "30" }}>
          {/* Header */}
          <div className="p-6 border-b border-gray-800" style={{ background: `linear-gradient(135deg, ${current.color}08, transparent)` }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${current.color}15`, border: `1px solid ${current.color}40` }}>
                <current.icon size={24} style={{ color: current.color }} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black">{current.title}</h2>
                <p className="text-sm mt-0.5" style={{ color: current.color }}>{current.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Physics */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Physics Mechanism</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{current.physics}</p>
            </div>

            {/* 3D Exploded View */}
            {current.hasView && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">3D Exploded CAD Rendering</h3>
                {current.id === "brain" && <BrainHealingExplodedView />}
                {current.id === "cellular" && <ScalarHealingExplodedView />}
              </div>
            )}

            {/* Device + Specs in 2-col */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Device Architecture</h3>
                <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} style={{ color: current.color }} />
                    <span className="text-white text-sm font-bold">{current.device.split("—")[0].trim()}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{current.device.split("—")[1]?.trim() || current.device}</p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Technical Specs</h3>
                <div className="grid grid-cols-2 gap-2">
                  {current.specs.map(s => (
                    <div key={s.label} className="bg-gray-950 border border-gray-800 rounded-lg p-3">
                      <p className="text-gray-600 text-[10px] uppercase tracking-wider">{s.label}</p>
                      <p className="text-white font-bold text-xs mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mechanism detail */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">How It Works</h3>
              <p className="text-gray-400 text-sm leading-relaxed bg-gray-950 border border-gray-800 rounded-xl p-4">{current.mechanism}</p>
            </div>

            {/* Outcomes */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Therapeutic Outcomes</h3>
              <div className="flex flex-wrap gap-2">
                {current.outcomes.map(o => (
                  <div key={o} className="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold" style={{ borderColor: current.color + "40", backgroundColor: current.color + "10", color: current.color }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: current.color }} />
                    {o}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The Prioré Proof of Concept */}
        <div className="mt-8 bg-gradient-to-br from-amber-950/30 via-gray-900 to-gray-900 border border-amber-800/40 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-900/30 border border-amber-700 flex items-center justify-center flex-shrink-0">
              <BookOpen size={20} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white">The Prioré Proof of Concept</h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                Antoine Prioré's device — funded by the French government in the 1960s–1980s — documented cures of terminal cancers in animals using exactly this multichannel EM modulation architecture. <span className="text-amber-300 font-semibold">It worked. It was suppressed.</span> The physics is intact in Bearden's Excalibur Briefing Figure 10. Modern DDS/FPGA technology makes a $2,400 clinical version buildable today.
              </p>
              <div className="grid md:grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3">
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Era</p>
                  <p className="text-white text-sm font-bold mt-0.5">1960s–1980s</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">French government funded</p>
                </div>
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3">
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Documented Results</p>
                  <p className="text-white text-sm font-bold mt-0.5">Terminal cancer cures</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">In animal studies</p>
                </div>
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3">
                  <p className="text-amber-400 text-[10px] font-bold uppercase tracking-wider">Modern Build Cost</p>
                  <p className="text-white text-sm font-bold mt-0.5">$2,400</p>
                  <p className="text-gray-500 text-[10px] mt-0.5">DDS/FPGA clinical version</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning / Ethics */}
        <div className="mt-6 bg-red-950/20 border border-red-800/40 rounded-2xl p-5 flex gap-4">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 text-sm font-bold">Research Disclaimer</p>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              The physics described here is drawn from Tom Bearden's Excalibur Briefing and the suppressed work of Antoine Prioré. These devices are presented as research documentation, not medical devices. Clinical deployment requires FDA/IRB approval. ZARP Research Division provides build plans for research and educational purposes only.
            </p>
          </div>
        </div>

        {/* Related links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/therapy-pod-pro" className="px-4 py-2 rounded-lg bg-cyan-900/30 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/50 transition-colors">
            AATCS-P1 Therapy Pod Pro →
          </Link>
          <Link to="/medbed-showcase" className="px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-800 text-purple-300 text-xs font-bold hover:bg-purple-900/50 transition-colors">
            MedBed Showcase →
          </Link>
          <Link to="/scalar-lab" className="px-4 py-2 rounded-lg bg-indigo-900/30 border border-indigo-800 text-indigo-300 text-xs font-bold hover:bg-indigo-900/50 transition-colors">
            Scalar EM Lab →
          </Link>
          <Link to="/prior-art" className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
            Prior Art Archive →
          </Link>
        </div>
      </div>
    </div>
  );
}