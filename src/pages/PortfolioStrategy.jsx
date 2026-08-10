import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Brain, Zap, Activity, Target, TrendingUp,
  Layers, Cpu, Radio, Heart, Dna, Waves, Sparkles, ChevronRight,
  FileText, Award, Lock, Microscope, Stethoscope, Gauge
} from "lucide-react";

// ── Strategic Pivot: Speculative Energy → Defensible Medical IP ──────────

const PIVOT_PHASES = [
  {
    phase: "Phase 1 — Legacy",
    period: "2024–2025",
    title: "Speculative Energy Generation IP",
    status: "Sunsetting",
    statusColor: "#f97316",
    color: "#f97316",
    icon: "⚡",
    description: "Vacuum energy extraction, MEG replication, over-unity claims. High novelty, low defensibility. Patent examiners routinely reject perpetual-motion-adjacent claims under 35 U.S.C. §101 (utility) and §112 (enablement). Citation growth stagnant.",
    metrics: [
      { label: "Patents Filed", value: "12", trend: "flat" },
      { label: "Granted", value: "2", trend: "down" },
      { label: "Citations/yr", value: "8", trend: "flat" },
      { label: "Defensibility", value: "Low", trend: "down" },
    ],
    issues: [
      "Utility rejections — 'inoperable' subject matter",
      "Enablement failures — reproducibility challenged",
      "No FDA pathway — non-medical, no regulatory moat",
      "Licensing interest: negligible (0 inbound inquiries)",
    ],
  },
  {
    phase: "Phase 2 — Transition",
    period: "2025–2026",
    title: "Bioelectromagnetics + Scalar Wave Integration",
    status: "Active",
    statusColor: "#06b6d4",
    color: "#06b6d4",
    icon: "🔬",
    description: "Pivot toward utility-based medical device IP that combines established scalar wave physics with bioelectromagnetic therapy. Prioré architecture, Schumann resonance PEMF, phase-conjugate neuroregeneration. FDA Class II pathway via 510(k) predicate devices.",
    metrics: [
      { label: "Patents Filed", value: "18", trend: "up" },
      { label: "Granted", value: "7", trend: "up" },
      { label: "Citations/yr", value: "34", trend: "up" },
      { label: "Defensibility", value: "Med", trend: "up" },
    ],
    advantages: [
      "Utility clear — therapeutic claims supported by clinical data",
      "FDA Class II pathway — 510(k) predicate (TMS, CES, PBM)",
      "Method + apparatus claims — harder to design around",
      "Citation growth: 4× over energy-only portfolio",
    ],
  },
  {
    phase: "Phase 3 — Target",
    period: "2026–2028",
    title: "Defensible Medical Device IP Ecosystem",
    status: "Target State",
    statusColor: "#22c55e",
    color: "#22c55e",
    icon: "🛡️",
    description: "Fully differentiated product ecosystem: AATCS-P1/P2 therapy pods, ZDS-PTSD military variant, AI calibration protocols, regenerative bio-feedback interfaces. Multi-layer IP stack: apparatus, method, AI algorithm, clinical protocol, and calibration system patents.",
    metrics: [
      { label: "Patents Filed", value: "35+", trend: "up" },
      { label: "Granted", value: "20+", trend: "up" },
      { label: "Citations/yr", value: "120+", trend: "up" },
      { label: "Defensibility", value: "High", trend: "up" },
    ],
    advantages: [
      "Multi-layer claim structure — apparatus + method + AI + protocol",
      "FDA 510(k) clearances create regulatory moat",
      "Clinical trial data = trade secret protection layer",
      "Licensing revenue: institutional + DoD + wellness markets",
      "Citation network effect — each patent strengthens the web",
    ],
  },
];

// ── Integration Ecosystem: BioEM × Scalar Wave ────────────────────────────

const ECOSYSTEM_NODES = [
  {
    domain: "Scalar Wave Technology",
    color: "#06b6d4",
    icon: <Waves size={18} />,
    tech: ["Longitudinal wave generation", "Phase conjugate mirrors", "Schumann resonance tuning", "Whittaker decomposition", "G-Com standing wave nodes"],
    maturity: "Established",
    maturityColor: "#22c55e",
  },
  {
    domain: "Bioelectromagnetics",
    color: "#ec4899",
    icon: <Activity size={18} />,
    tech: ["PEMF therapy (FDA cleared)", "Transcranial PBM (810nm)", "CES for PTSD (FDA cleared)", "Vibroacoustic therapy", "HRV/EEG biofeedback"],
    maturity: "Clinical",
    maturityColor: "#3b82f6",
  },
  {
    domain: "AI Calibration Layer",
    color: "#8b5cf6",
    icon: <Cpu size={18} />,
    tech: ["Closed-loop BFAC dosimetry", "TensorFlow Lite adaptive protocols", "Real-time biomarker fusion", "Personalized session architect", "Predictive therapeutic models"],
    maturity: "White Space",
    maturityColor: "#f59e0b",
  },
  {
    domain: "Regenerative Bio-Feedback",
    color: "#10b981",
    icon: <Heart size={18} />,
    tech: ["DNA coherence monitoring", "Telomere regeneration tracking", "Morphogenetic field mapping", "Cellular ATP biofeedback", "Quantum potential diagnostics"],
    maturity: "White Space",
    maturityColor: "#f59e0b",
  },
];

const CONVERGENCE_PRODUCTS = [
  {
    name: "AATCS-P1 Therapy Pod",
    type: "Clinical Device",
    integration: "Scalar PEMF + PBM + VAT + AI BFAC",
    ipLayer: "Apparatus + Method + AI Algorithm",
    defensibility: "High",
    market: "ASD therapy · Wellness clinics",
    color: "#06b6d4",
  },
  {
    name: "ZDS-PTSD-1 Combat Recovery",
    type: "Military Medical",
    integration: "Phase-conjugate scalar + CES + EEG AI",
    ipLayer: "Apparatus + Method + Protocol + MIL-spec",
    defensibility: "Very High",
    market: "VA hospitals · DoD · FOB medical",
    color: "#f59e0b",
  },
  {
    name: "AuraWell MedBed P2",
    type: "Full-Body Clinical",
    integration: "9-modal scalar + closed-loop dosimetry",
    ipLayer: "Apparatus + Method + AI + Clinical Protocol",
    defensibility: "High",
    market: "Hospitals · Concierge medicine",
    color: "#8b5cf6",
  },
  {
    name: "AI Calibration Protocol Suite",
    type: "Software IP",
    integration: "BFAC + biomarker fusion + predictive AI",
    ipLayer: "Algorithm + Method + System",
    defensibility: "Very High",
    market: "Licensing to device manufacturers",
    color: "#22c55e",
  },
  {
    name: "Regenerative Bio-Feedback Interface",
    type: "Diagnostic Platform",
    integration: "DNA coherence + quantum potential + AI",
    ipLayer: "Method + Algorithm + Diagnostic System",
    defensibility: "Very High",
    market: "Research labs · Clinical trials",
    color: "#ec4899",
  },
];

// ── White Space Opportunities ────────────────────────────────────────────

const WHITE_SPACE = [
  {
    id: "ai-calibration",
    title: "Non-Invasive AI-Driven Calibration Protocols",
    subtitle: "For Scalar EM Communication & Therapy Devices",
    icon: <Gauge size={20} />,
    color: "#8b5cf6",
    category: "Software IP",
    priority: "Critical",
    problem: "Current scalar EM devices require manual frequency tuning by trained operators. No standardized, reproducible calibration methodology exists. This limits clinical adoption, regulatory approval, and manufacturing scalability.",
    solution: "AI-driven calibration system that uses real-time biometric feedback (HRV, EEG, GSR, SpO₂, skin temp) to automatically tune scalar field parameters — frequency, amplitude, phase conjugation angle, and modulation depth — to each patient's physiological state. Closed-loop BFAC engine adapts in real-time.",
    ipOpportunity: [
      "Calibration algorithm patent (method claims)",
      "Closed-loop control system patent (apparatus + method)",
      "Personalized protocol generation AI (algorithm claims)",
      "Biometric-to-frequency mapping database (trade secret)",
      "FDA software-as-medical-device (SaMD) pathway",
    ],
    market: "$2.1B by 2030 — AI-mediated bioelectromagnetic therapy market",
    competitors: "None with integrated scalar + AI calibration. Nearest: Neuronetics (TMS only), Fisher Wallace (CES only). No scalar AI calibration exists.",
    defensibility: "Very High — multi-layer IP stack + FDA SaMD + trade secret",
    nextSteps: [
      "File provisional: 'AI-Driven Calibration System for Scalar EM Therapy'",
      "Build prototype on AATCS-P1 platform",
      "Collect calibration data from 50 subjects",
      "Submit 510(k) with AI calibration as special control",
    ],
  },
  {
    id: "bio-feedback",
    title: "Regenerative Bio-Feedback Interfaces",
    subtitle: "Real-time Cellular & Quantum Potential Diagnostics",
    icon: <Stethoscope size={20} />,
    color: "#10b981",
    category: "Diagnostic IP",
    priority: "Critical",
    problem: "No non-invasive diagnostic exists that can measure cellular regeneration, DNA coherence, or morphogenetic field integrity in real-time. Current diagnostics are invasive (biopsy), slow (lab culture), or indirect (blood markers). This blocks closed-loop regenerative therapy.",
    solution: "Bio-feedback interface that reads the body's emitted EM spectrum (porthole sensors per Bearden/Prioré), computes the delta from a healthy baseline, and provides real-time feedback to the scalar therapy system. Measures: DNA coherence via UV photon spectroscopy, mitochondrial ATP via bioimpedance, telomere integrity via epigenetic markers, and morphogenetic field coherence via multi-channel EEG.",
    ipOpportunity: [
      "Non-invasive DNA coherence diagnostic (method + apparatus)",
      "UV photon spectroscopy disease template reader",
      "Bioimpedance cellular ATP monitor",
      "Morphogenetic field coherence index (algorithm)",
      "Closed-loop regenerative therapy system (integration patent)",
    ],
    market: "$4.8B by 2031 — regenerative medicine diagnostics market",
    competitors: "No non-invasive regenerative diagnostic exists. Adjacent: Guardant Health (liquid biopsy — invasive), Elysium Health (epigenetic — slow). White space is wide open.",
    defensibility: "Very High — first-mover + method claims + diagnostic platform",
    nextSteps: [
      "File provisional: 'Non-Invasive Bio-Feedback Interface for Regenerative Therapy'",
      "Build porthole sensor prototype (UV + bioimpedance + EEG)",
      "Validate DNA coherence measurement against biopsy gold standard",
      "Submit IRB protocol for clinical validation study",
    ],
  },
];

// ── Defensibility Comparison ─────────────────────────────────────────────

const DEFENSIBILITY_MATRIX = [
  { criterion: "Utility (35 USC §101)", speculative: "Weak — 'inoperable' rejections", medical: "Strong — therapeutic utility clear", winner: "medical" },
  { criterion: "Enablement (§112)", speculative: "Weak — reproducibility challenged", medical: "Strong — clinical protocols enable", winner: "medical" },
  { criterion: "Regulatory Moat", speculative: "None — no FDA pathway", medical: "FDA 510(k) + SaMD + clinical trials", winner: "medical" },
  { criterion: "Citation Growth", speculative: "Stagnant — niche field", medical: "4× and accelerating — clinical literature", winner: "medical" },
  { criterion: "Licensing Revenue", speculative: "Negligible — 0 inbound", medical: "$2-8M/yr projected (institutional + DoD)", winner: "medical" },
  { criterion: "Design-Around Difficulty", speculative: "Easy — single apparatus claim", medical: "Hard — multi-layer claim stack", winner: "medical" },
  { criterion: "Trade Secret Layer", speculative: "Minimal — published physics", medical: "Clinical data + calibration DB + AI models", winner: "medical" },
  { criterion: "Market Size", speculative: "Unproven — no market exists", medical: "$47B bioelectromedicine market by 2030", winner: "medical" },
];

function TrendArrow({ trend }) {
  if (trend === "up") return <span className="text-green-400">↗</span>;
  if (trend === "down") return <span className="text-red-400">↘</span>;
  return <span className="text-gray-500">→</span>;
}

function PivotCard({ phase, isLast }) {
  return (
    <div className="relative">
      <div className="bg-gray-900 border rounded-2xl overflow-hidden" style={{ borderColor: phase.color + "40" }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ background: phase.color + "10" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{phase.icon}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>{phase.phase}</p>
              <p className="text-white font-bold text-sm">{phase.title}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black border" style={{ backgroundColor: phase.statusColor + "20", color: phase.statusColor, borderColor: phase.statusColor + "60" }}>{phase.status}</span>
            <p className="text-gray-600 text-[10px] mt-1">{phase.period}</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">{phase.description}</p>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-2">
            {phase.metrics.map(m => (
              <div key={m.label} className="bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-center">
                <p className="text-gray-600 text-[9px] uppercase tracking-wider">{m.label}</p>
                <p className="text-white font-bold text-sm mt-0.5 flex items-center justify-center gap-1">{m.value} <TrendArrow trend={m.trend} /></p>
              </div>
            ))}
          </div>

          {/* Issues or Advantages */}
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
              {phase.status === "Sunsetting" ? "Key Issues" : "Key Advantages"}
            </p>
            <ul className="space-y-1.5">
              {(phase.issues || phase.advantages || []).map((item, i) => (
                <li key={i} className="flex gap-2 items-start text-xs text-gray-400 leading-relaxed">
                  <span style={{ color: phase.color }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {!isLast && (
        <div className="flex justify-center my-2">
          <ChevronRight size={20} className="text-gray-700 rotate-90" />
        </div>
      )}
    </div>
  );
}

function EcosystemNode({ node }) {
  return (
    <div className="bg-gray-900 border rounded-2xl p-5" style={{ borderColor: node.color + "40" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: node.color + "15", border: `1px solid ${node.color}40` }}>
          <span style={{ color: node.color }}>{node.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-bold text-sm">{node.domain}</h4>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold border inline-block mt-0.5" style={{ backgroundColor: node.maturityColor + "20", color: node.maturityColor, borderColor: node.maturityColor + "60" }}>{node.maturity}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {node.tech.map((t, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: node.color }} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function ConvergenceProduct({ product }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4" style={{ borderLeftColor: product.color, borderLeftWidth: 3 }}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-bold text-sm">{product.name}</h4>
        <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ backgroundColor: product.color + "20", color: product.color }}>{product.type}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex gap-2 text-xs">
          <span className="text-gray-600 w-20 flex-shrink-0">Integration:</span>
          <span className="text-gray-300">{product.integration}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-gray-600 w-20 flex-shrink-0">IP Layer:</span>
          <span className="text-gray-300">{product.ipLayer}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="text-gray-600 w-20 flex-shrink-0">Market:</span>
          <span className="text-gray-400">{product.market}</span>
        </div>
        <div className="flex gap-2 text-xs items-center">
          <span className="text-gray-600 w-20 flex-shrink-0">Defensibility:</span>
          <span className="font-bold" style={{ color: product.color }}>{product.defensibility}</span>
        </div>
      </div>
    </div>
  );
}

function WhiteSpaceCard({ opp }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-gray-900 border rounded-2xl overflow-hidden" style={{ borderColor: opp.color + "40" }}>
      <div className="px-5 py-4 cursor-pointer" onClick={() => setExpanded(!expanded)} style={{ background: opp.color + "08" }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: opp.color + "15", border: `1px solid ${opp.color}40` }}>
            <span style={{ color: opp.color }}>{opp.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black border" style={{ backgroundColor: "#ef444420", color: "#ef4444", borderColor: "#ef444460" }}>{opp.priority}</span>
              <span className="text-gray-600 text-[10px]">{opp.category}</span>
            </div>
            <h3 className="text-white font-bold text-base">{opp.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{opp.subtitle}</p>
          </div>
          <ChevronRight size={18} className={`text-gray-600 transition-transform flex-shrink-0 mt-1 ${expanded ? "rotate-90" : ""}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Problem */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#ef4444" }}>Problem</p>
            <p className="text-gray-400 text-sm leading-relaxed">{opp.problem}</p>
          </div>

          {/* Solution */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: opp.color }}>Solution</p>
            <p className="text-gray-400 text-sm leading-relaxed">{opp.solution}</p>
          </div>

          {/* IP Opportunity */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-green-400">IP Filing Opportunities</p>
            <div className="space-y-1.5">
              {opp.ipOpportunity.map((ip, i) => (
                <div key={i} className="flex items-start gap-2 bg-gray-950 border border-gray-800 rounded-lg p-2.5">
                  <FileText size={12} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-xs">{ip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market & Competition */}
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-amber-400">Market</p>
              <p className="text-gray-400 text-xs leading-relaxed">{opp.market}</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
              <p className="text-xs font-bold uppercase tracking-wider mb-1 text-cyan-400">Competition</p>
              <p className="text-gray-400 text-xs leading-relaxed">{opp.competitors}</p>
            </div>
          </div>

          {/* Defensibility */}
          <div className="flex items-center gap-2 bg-green-950/30 border border-green-800/40 rounded-lg p-3">
            <Lock size={14} className="text-green-400 flex-shrink-0" />
            <span className="text-green-300 text-xs font-bold">Defensibility: {opp.defensibility}</span>
          </div>

          {/* Next Steps */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-400">Immediate Next Steps</p>
            <div className="space-y-1.5">
              {opp.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black" style={{ backgroundColor: opp.color + "20", color: opp.color, border: `1px solid ${opp.color}40` }}>{i + 1}</div>
                  <span className="text-gray-300 text-xs leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioStrategy() {
  const [activeSection, setActiveSection] = useState("pivot");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} /> Graph
            </Link>
            <div className="w-px h-5 bg-gray-700" />
            <Target size={16} className="text-cyan-400" />
            <div>
              <h1 className="text-white font-black text-lg">Portfolio Strategy & White Space Map</h1>
              <p className="text-gray-500 text-xs">Bioelectromagnetics × Scalar Wave → Defensible Medical Device IP</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/ip-portfolio-health" className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
              IP Health →
            </Link>
            <Link to="/hybrid-portfolio" className="px-3 py-2 rounded-lg bg-cyan-900/30 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/50 transition-colors">
              Hybrid IP →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Strategy Statement */}
        <div className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-cyan-400 text-xs font-bold uppercase tracking-widest w-fit mb-4">
            <TrendingUp size={12} /> Long-Term Strategy
          </div>
          <h2 className="text-2xl font-black leading-tight mb-3">
            Shift from <span className="text-orange-400">speculative energy generation</span> toward{" "}
            <span className="text-green-400">highly defensible, utility-based medical device IP</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
            Integrate bioelectromagnetics with established scalar wave technology to create a differentiated, defensible product ecosystem.
            Target consistent citation growth and long-term licensing opportunities through multi-layer IP stacks —
            apparatus, method, AI algorithm, clinical protocol, and calibration system patents — backed by FDA regulatory pathways.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "pivot", label: "Strategic Pivot", icon: <TrendingUp size={13} /> },
            { id: "ecosystem", label: "Integration Ecosystem", icon: <Layers size={13} /> },
            { id: "whitespace", label: "White Space Opportunities", icon: <Sparkles size={13} /> },
            { id: "defensibility", label: "Defensibility Matrix", icon: <Shield size={13} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id);
                document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                activeSection === tab.id ? "bg-white/10 border-white/20 text-white" : "border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Strategic Pivot */}
        <div id="pivot" className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-cyan-400" />
            <h3 className="text-white font-bold text-lg">Portfolio Pivot — 3-Phase Transition</h3>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {PIVOT_PHASES.map((phase, i) => (
              <PivotCard key={phase.phase} phase={phase} isLast={i === PIVOT_PHASES.length - 1} />
            ))}
          </div>
        </div>

        {/* Integration Ecosystem */}
        <div id="ecosystem" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={18} className="text-purple-400" />
            <h3 className="text-white font-bold text-lg">Integration Ecosystem — BioEM × Scalar Wave</h3>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
            Four technology domains converge into a unified product ecosystem. The convergence of established scalar wave physics
            with clinical bioelectromagnetics — mediated by AI calibration and regenerative bio-feedback — creates the
            differentiated, defensible IP stack.
          </p>

          {/* Domain nodes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ECOSYSTEM_NODES.map(node => <EcosystemNode key={node.domain} node={node} />)}
          </div>

          {/* Convergence arrow */}
          <div className="flex items-center justify-center py-2">
            <div className="flex items-center gap-3 text-gray-600 text-xs font-bold uppercase tracking-widest">
              <div className="w-16 h-px bg-gray-700" />
              Converges Into
              <div className="w-16 h-px bg-gray-700" />
            </div>
          </div>

          {/* Convergence products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CONVERGENCE_PRODUCTS.map(p => <ConvergenceProduct key={p.name} product={p} />)}
          </div>
        </div>

        {/* White Space Opportunities */}
        <div id="whitespace" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-amber-400" />
            <h3 className="text-white font-bold text-lg">White Space Opportunities</h3>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
            Two critical white space opportunities where no defensible IP currently exists. Both are buildable on the existing
            AATCS-P1/P2 platform and leverage the scalar wave + bioelectromagnetics integration.
          </p>
          <div className="space-y-4">
            {WHITE_SPACE.map(opp => <WhiteSpaceCard key={opp.id} opp={opp} />)}
          </div>
        </div>

        {/* Defensibility Matrix */}
        <div id="defensibility" className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-green-400" />
            <h3 className="text-white font-bold text-lg">Defensibility Matrix — Speculative vs. Medical IP</h3>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-950 border-b border-gray-800 text-[10px] font-bold uppercase tracking-wider text-gray-600">
              <div className="col-span-4">Criterion</div>
              <div className="col-span-4">Speculative Energy IP</div>
              <div className="col-span-4">Defensible Medical IP</div>
            </div>
            {DEFENSIBILITY_MATRIX.map((row, i) => (
              <div key={i} className={`grid grid-cols-12 gap-2 px-5 py-3 items-center text-xs ${i % 2 === 0 ? "bg-gray-950/50" : ""}`}>
                <div className="col-span-4 text-gray-300 font-semibold">{row.criterion}</div>
                <div className="col-span-4 text-gray-500">{row.speculative}</div>
                <div className="col-span-4 text-green-400 font-medium">{row.medical}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="rounded-2xl border border-cyan-800 bg-cyan-950/20 p-6">
          <div className="flex items-start gap-4">
            <Award size={24} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-white font-bold text-base mb-2">Strategic Recommendation</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                File provisional patents on both white space opportunities within 90 days. Both build on the existing AATCS-P1
                platform and leverage the scalar wave + bioelectromagnetics integration. The AI calibration protocol and
                regenerative bio-feedback interface together create a multi-layer IP stack that is extremely difficult to
                design around — each layer reinforces the others.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/patent-wizard" className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-colors">
                  File Provisional →
                </Link>
                <Link to="/hybrid-portfolio" className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm font-bold hover:bg-gray-700 transition-colors">
                  View Hybrid IP →
                </Link>
                <Link to="/medbed-showcase" className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm font-bold hover:bg-gray-700 transition-colors">
                  Device Showcase →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}