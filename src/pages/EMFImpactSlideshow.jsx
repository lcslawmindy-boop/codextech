import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Play, Pause, AlertTriangle, Heart, Globe,
  Zap, Brain, Dna, Shield, Activity, Sparkles, TrendingDown, TrendingUp,
  DollarSign, Users, Rocket, ArrowRight
} from "lucide-react";

// ── Slide Definitions ─────────────────────────────────────────────────────
const SLIDES = [
  // 0 — Title
  {
    type: "title",
    bg: "from-gray-950 via-indigo-950 to-gray-950",
    kicker: "ZARP RESEARCH DIVISION · GRANT & INVESTOR BRIEFING",
    title: "EMF Impact & The Path Forward",
    subtitle: "The effects of electromagnetic fields on the human body — and Earth's two futures: dark or light",
    tagline: "The same physics that can weaponize EM can heal it. The choice is now.",
    stats: [
      { value: "8", label: "Critical organs affected" },
      { value: "2", label: "Earth timelines" },
      { value: "$2,400", label: "Build cost for healing device" },
      { value: "50yr", label: "Projection window" },
    ],
  },

  // 1 — The Problem
  {
    type: "problem",
    bg: "from-red-950/40 via-gray-950 to-gray-950",
    kicker: "THE INVISIBLE CRISIS",
    title: "Your Body Is an Electromagnetic System",
    subtitle: "And it is under continuous EMF assault — from 5G, 6G, Woodpecker ELF, and weaponized scalar arrays",
    icon: AlertTriangle,
    iconColor: "#ef4444",
    points: [
      { icon: Zap, text: "Synchronized 10 Hz ELF modulation locks all brains in range into phase — documented in Pentagon EMI studies" },
      { icon: Brain, text: "Blood-brain barrier permeability increases — neurotoxins enter freely under EMF exposure" },
      { icon: Activity, text: "Heart rate variability collapses — cardiac arrhythmia induced via EM trigger windows" },
      { icon: Shield, text: "NK cell activity suppressed — immune system degraded at the biofield level" },
    ],
    citation: "Bearden, T.E. — Gravitobiology (1991), Table 7 & 12; Lisitsyn Report p.41",
  },

  // 2 — Organ Damage
  {
    type: "organDamage",
    bg: "from-gray-950 via-red-950/20 to-gray-950",
    kicker: "EMF DAMAGE — ORGAN BY ORGAN",
    title: "What EMF Does to Your Biology",
    subtitle: "Non-thermal effects trigger oxidative stress, DNA breaks, and morphogenetic field disruption",
    organs: [
      { name: "Brain", severity: "critical", effect: "Synaptic disruption, ELF entrainment, BBB permeability, melatonin suppression" },
      { name: "DNA / Genome", severity: "critical", effect: "Double-strand breaks, telomere shortening, epigenetic disruption" },
      { name: "Mitochondria", severity: "critical", effect: "ATP synthesis interference, membrane potential collapse, energy deficit" },
      { name: "Heart", severity: "high", effect: "HRV collapse, arrhythmia, calcium channel opening, cortisol elevation" },
      { name: "Immune System", severity: "high", effect: "T-cell reduction, NK suppression, chronic inflammatory cytokines" },
      { name: "Endocrine", severity: "high", effect: "Pineal calcification, melatonin/DMT blocked, metabolic syndrome" },
      { name: "Nervous System", severity: "medium", effect: "Myelination degradation, autonomic dysregulation, neuropathic pain" },
      { name: "Reproductive", severity: "high", effect: "Sperm DNA fragmentation, oocyte damage, fertility collapse post-5G" },
    ],
  },

  // 3 — Dark Timeline Intro
  {
    type: "timelineIntro",
    bg: "from-red-950/50 via-gray-950 to-black",
    kicker: "TIMELINE A — IF WE DO NOT TRANSITION",
    title: "The Dark Timeline",
    subtitle: "2026 → 2050: What happens if humanity stays on the EMF weaponization path",
    icon: AlertTriangle,
    iconColor: "#dc2626",
    tone: "dark",
  },

  // 4 — Dark Timeline 2026-2030
  {
    type: "timelinePhase",
    bg: "from-gray-950 via-red-950/30 to-gray-950",
    kicker: "DARK TIMELINE · PHASE 1",
    title: "2026–2030: Grid Lock",
    subtitle: "5G/6G densification completes. Full cognitive coverage. Fertility collapses below replacement.",
    icon: "⚡",
    color: "#ef4444",
    tone: "dark",
    metrics: [
      { label: "Neurological disease", value: "+340%", icon: TrendingDown },
      { label: "Childhood cancer", value: "+180%", icon: TrendingDown },
      { label: "Pharma industry", value: "$8.4T", icon: DollarSign },
      { label: "Nations below fertility", value: "40+", icon: Users },
    ],
    detail: "Woodpecker-pattern ELF modulation embedded in carrier infrastructure globally. AI systems trained on psychotronic behavioral modification become standard. Ionospheric heating disrupts jet stream. EMF-induced bee collapse eliminates 65% of pollinators.",
  },

  // 5 — Dark Timeline 2030-2040
  {
    type: "timelinePhase",
    bg: "from-gray-950 via-orange-950/30 to-gray-950",
    kicker: "DARK TIMELINE · PHASE 2",
    title: "2030–2040: Biological Collapse",
    subtitle: "Global IQ decline confirmed. First 'EM pandemic' broadcast via infrastructure. Life expectancy begins sustained decline.",
    icon: "☣️",
    color: "#f97316",
    tone: "dark",
    metrics: [
      { label: "Alzheimer's onset", value: "age 45", icon: Brain },
      { label: "Sperm counts (urban)", value: "near zero", icon: TrendingDown },
      { label: "Climate refugees", value: "400M", icon: Users },
      { label: "Food supply at risk", value: "35%", icon: AlertTriangle },
    ],
    detail: "Mass psychotronic behavioral synchronization enables authoritarian governance without overt force. Scalar EM weather warfare expands. Soil microbiome collapse from EMF-induced electron transport disruption. Insurance collapse triggers global financial crisis of 2036.",
  },

  // 6 — Dark Timeline 2040-2050
  {
    type: "timelinePhase",
    bg: "from-black via-red-950/40 to-black",
    kicker: "DARK TIMELINE · PHASE 3",
    title: "2040–2050: Terminal Trajectory",
    subtitle: "Human cognitive baseline permanently altered. Population reduction via cytopathogenic broadcast becomes technically feasible.",
    icon: "💀",
    color: "#dc2626",
    tone: "dark",
    metrics: [
      { label: "Avg lifespan (high-income)", value: "52 yrs", icon: TrendingDown },
      { label: "Couples needing fertility assist", value: "70%+", icon: Users },
      { label: "Species extinction", value: "200/day", icon: TrendingDown },
      { label: "Nations in civilizational collapse", value: "40+", icon: AlertTriangle },
    ],
    detail: "Phase conjugate weapon systems enable non-nuclear warfare with zero attribution. Morphogenetic field damage produces developmental defects in 3rd generation. Phytoplankton collapse begins — ocean oxygen supply threatened. Ionospheric damage permanently alters Earth's Schumann resonance.",
  },

  // 7 — Light Timeline Intro
  {
    type: "timelineIntro",
    bg: "from-green-950/40 via-gray-950 to-indigo-950/30",
    kicker: "TIMELINE B — THE SCALAR ENERGY TRANSITION",
    title: "The Light Timeline",
    subtitle: "2026 → 2050: What happens if humanity deploys Bearden's scalar healing technology now",
    icon: Sparkles,
    iconColor: "#22c55e",
    tone: "light",
  },

  // 8 — Light Timeline 2026-2030
  {
    type: "timelinePhase",
    bg: "from-gray-950 via-green-950/30 to-gray-950",
    kicker: "LIGHT TIMELINE · PHASE 1",
    title: "2026–2030: Scalar Awakening",
    subtitle: "Bearden anenergy pump validated. First COP > 1 generator in peer review. Prioré therapy approved as research instrument.",
    icon: "🌱",
    color: "#22c55e",
    tone: "light",
    metrics: [
      { label: "Tumor regression (animal)", value: "67%", icon: TrendingUp },
      { label: "Grid draw reduction", value: "30%", icon: Zap },
      { label: "Scalar engineers", value: "50,000+", icon: Users },
      { label: "Open-source market", value: "$48B", icon: DollarSign },
    ],
    detail: "Trigger window therapy devices enter wellness market. EMF biofield awareness triggers infrastructure redesign in 12 nations. Phase conjugate weather stabilization experiments in 3 countries. Pharma begins $340B pivot to bioelectromagnetic medicine.",
  },

  // 9 — Light Timeline 2030-2040
  {
    type: "timelinePhase",
    bg: "from-gray-950 via-blue-950/30 to-gray-950",
    kicker: "LIGHT TIMELINE · PHASE 2",
    title: "2030–2040: Civilizational Transformation",
    subtitle: "Vacuum energy at city scale. Mandatory EMF safety standards. Prioré therapy standard in hospitals. DNA repair reverses genetic disease.",
    icon: "✨",
    color: "#3b82f6",
    tone: "light",
    metrics: [
      { label: "Cancer death rate", value: "−80%", icon: TrendingDown },
      { label: "Lifespan expectancy", value: "120+", icon: TrendingUp },
      { label: "Biological age reversal", value: "15 yrs", icon: Sparkles },
      { label: "Clean energy market", value: "$755T", icon: DollarSign },
    ],
    detail: "Scalar EM weather moderation stabilizes jet stream cooperatively. Vacuum energy eliminates fossil fuels. Ocean pH normalizes. First biological age reversal documented in clinical setting. Kaznacheyev-derived photon therapy eliminates viral pandemics.",
  },

  // 10 — Light Timeline 2040-2050
  {
    type: "timelinePhase",
    bg: "from-gray-950 via-purple-950/30 to-gray-950",
    kicker: "LIGHT TIMELINE · PHASE 3",
    title: "2040–2050: New Earth Civilization",
    subtitle: "Full scalar healing infrastructure global. Phase conjugate communications replace surveillance internet. Humanity as coherent morphogenetic civilization.",
    icon: "🌍",
    color: "#a855f7",
    tone: "light",
    metrics: [
      { label: "Avg lifespan", value: "150+ yrs", icon: TrendingUp },
      { label: "Disease category", value: "eliminated", icon: Heart },
      { label: "Global IQ gain", value: "+25 pts", icon: Brain },
      { label: "CO₂ restored", value: "280ppm", icon: Globe },
    ],
    detail: "Cellular aging controlled by scalar field coherence. Morphogenetic blueprint maintenance prevents pathological deviation. Conflict rate near zero — resource wars impossible with unlimited energy. Human civilization expands beyond Earth using scalar EM propulsion.",
  },

  // 11 — The Solution
  {
    type: "solution",
    bg: "from-gray-950 via-cyan-950/30 to-gray-950",
    kicker: "THE PATH FORWARD",
    title: "The Same Physics — Inverted",
    subtitle: "Phase conjugation transforms EM weapons into EM healing. The Prioré device proved it works.",
    systems: [
      { icon: Brain, color: "#06b6d4", name: "Brain / Neural", desc: "7.83 Hz Schumann + alpha phase conjugate → neurogenesis, trauma recovery" },
      { icon: Dna, color: "#8b5cf6", name: "DNA Repair", desc: "Scalar phi-field coherence → kindling-reversal, cancer normalization" },
      { icon: Heart, color: "#ef4444", name: "Heart Coherence", desc: "Helmholtz Prioré-architecture → HRV restoration, cardiovascular reversal" },
      { icon: Shield, color: "#10b981", name: "Immune Amplification", desc: "Kaznacheyev UV photon therapy → NK cells 3× in 72h, autoimmune reversal" },
      { icon: Zap, color: "#f59e0b", name: "Mitochondria / Energy", desc: "VPO anenergy pump → ATP ↑ without metabolic input, fatigue eliminated" },
      { icon: Sparkles, color: "#ec4899", name: "Cellular Regeneration", desc: "Prioré multichannel EM → wound healing 10×, organ regeneration" },
    ],
  },

  // 12 — The Proof
  {
    type: "proof",
    bg: "from-amber-950/30 via-gray-950 to-gray-950",
    kicker: "DOCUMENTED PROOF OF CONCEPT",
    title: "The Prioré Device Worked",
    subtitle: "Funded by the French government (1960s–1980s). Documented cures of terminal cancers in animals. Then suppressed.",
    facts: [
      { value: "1960s–80s", label: "French government funded" },
      { value: "Terminal", label: "Cancers cured in animals" },
      { value: "Suppressed", label: "Device dismantled" },
      { value: "$2,400", label: "Modern rebuild cost" },
    ],
    detail: "The physics is intact in Bearden's Excalibur Briefing Figure 10. Modern DDS/FPGA technology makes a clinical version buildable today — with off-the-shelf components. What was suppressed in 1980 can be deployed in 2026.",
  },

  // 13 — The Ask (Investors & Grants)
  {
    type: "ask",
    bg: "from-gray-950 via-indigo-950/40 to-gray-950",
    kicker: "FOR GRANT FUNDING & INVESTORS",
    title: "The Fork in the Road Is Now",
    subtitle: "Every year of delay is irreversible biological, environmental, and civilizational damage. The technology exists today.",
    icon: Rocket,
    iconColor: "#6366f1",
    asks: [
      { label: "Research Grants", desc: "Fund university-scale replication of Prioré multichannel EM therapy — animal trials, peer review, FDA pathway", color: "#3b82f6" },
      { label: "Investment Capital", desc: "Scale DDS/FPGA clinical device manufacturing — $2,400 unit cost → wellness + medical market entry", color: "#22c55e" },
      { label: "Public Education", desc: "Broadcast this briefing to policymakers, medical institutions, and the public — awareness is the bottleneck", color: "#f59e0b" },
      { label: "Infrastructure Transition", desc: "Deploy VPO anenergy pump pilots — 30% grid draw reduction demonstrated, scale to city level", color: "#a855f7" },
    ],
    cta: "The choice between the dark and light timeline is a matter of political will and public knowledge.",
  },

  // 14 — Closing
  {
    type: "closing",
    bg: "from-gray-950 via-cyan-950/20 to-gray-950",
    kicker: "ZARP RESEARCH DIVISION",
    title: "From Dark to Light",
    subtitle: "The physics is real. The proof exists. The build cost is known. What remains is the will to act.",
    icon: Sparkles,
    iconColor: "#06b6d4",
    links: [
      { to: "/emf-impact", label: "Full EMF Impact Report", icon: AlertTriangle },
      { to: "/scalar-healing", label: "Scalar Healing Systems", icon: Heart },
      { to: "/therapy-pod-pro", label: "Therapy Pod Engineering", icon: Rocket },
      { to: "/prior-art", label: "Prior Art Archive", icon: Brain },
    ],
  },
];

const SEVERITY_COLORS = { critical: "#ef4444", high: "#f97316", medium: "#f59e0b" };

// ── Progress Bar ──────────────────────────────────────────────────────────
function ProgressBar({ progress }) {
  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-50">
      <div className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-100"
        style={{ width: `${progress}%` }} />
    </div>
  );
}

// ── Slide Renderer ────────────────────────────────────────────────────────
function SlideRenderer({ slide, direction }) {
  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.98 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.98 }),
  };

  const renderContent = () => {
    switch (slide.type) {
      case "title":
        return (
          <div className="text-center max-w-4xl">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-cyan-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
              {slide.kicker}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-black text-white leading-tight mb-4">
              {slide.title}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg md:text-xl leading-relaxed mb-3">
              {slide.subtitle}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-cyan-300 text-base font-semibold italic mb-10">
              {slide.tagline}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {slide.stats.map((s, i) => (
                <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl p-4">
                  <p className="text-3xl font-black text-white">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        );

      case "problem":
        return (
          <div className="max-w-5xl mx-auto">
            <p className="text-red-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">{slide.kicker}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{slide.title}</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-3xl">{slide.subtitle}</p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {slide.points.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 bg-gray-900/60 border border-red-900/40 rounded-xl p-4">
                    <div className="w-10 h-10 rounded-lg bg-red-950/50 border border-red-800/50 flex items-center justify-center flex-shrink-0">
                      <Icon size={18} className="text-red-400" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed pt-1">{p.text}</p>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-gray-600 text-xs italic">Source: {slide.citation}</p>
          </div>
        );

      case "organDamage":
        return (
          <div className="max-w-6xl mx-auto">
            <p className="text-red-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">{slide.kicker}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{slide.title}</h2>
            <p className="text-gray-400 text-lg mb-6">{slide.subtitle}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {slide.organs.map((o, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-gray-900/70 border rounded-xl p-4" style={{ borderColor: SEVERITY_COLORS[o.severity] + "40", borderLeftColor: SEVERITY_COLORS[o.severity], borderLeftWidth: 3 }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-bold text-sm">{o.name}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold" style={{ backgroundColor: SEVERITY_COLORS[o.severity] + "20", color: SEVERITY_COLORS[o.severity] }}>{o.severity}</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{o.effect}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "timelineIntro": {
        const Icon = slide.icon;
        return (
          <div className="text-center max-w-3xl">
            <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", duration: 0.8 }}
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: slide.iconColor + "15", border: `2px solid ${slide.iconColor}` }}>
              <Icon size={40} style={{ color: slide.iconColor }} />
            </motion.div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: slide.iconColor }}>{slide.kicker}</p>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">{slide.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed">{slide.subtitle}</p>
          </div>
        );
      }

      case "timelinePhase":
        return (
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: slide.color }}>{slide.kicker}</p>
            <div className="flex items-center gap-4 mb-3">
              <span className="text-5xl">{slide.icon}</span>
              <h2 className="text-4xl md:text-5xl font-black text-white">{slide.title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-6 max-w-3xl">{slide.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {slide.metrics.map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
                    className="bg-gray-900/70 border rounded-xl p-4 text-center" style={{ borderColor: slide.color + "30" }}>
                    <Icon size={16} className="mx-auto mb-1" style={{ color: slide.color }} />
                    <p className="text-2xl font-black" style={{ color: slide.color }}>{m.value}</p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{m.label}</p>
                  </motion.div>
                );
              })}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-gray-400 text-sm leading-relaxed bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              {slide.detail}
            </motion.p>
          </div>
        );

      case "solution":
        return (
          <div className="max-w-6xl mx-auto">
            <p className="text-cyan-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">{slide.kicker}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{slide.title}</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-3xl">{slide.subtitle}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slide.systems.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="bg-gray-900/70 border rounded-2xl p-5" style={{ borderColor: s.color + "30", borderTopColor: s.color, borderTopWidth: 2 }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: s.color + "15", border: `1px solid ${s.color}40` }}>
                      <Icon size={20} style={{ color: s.color }} />
                    </div>
                    <p className="text-white font-bold text-sm mb-1">{s.name}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case "proof":
        return (
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.25em] mb-3">{slide.kicker}</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{slide.title}</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">{slide.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {slide.facts.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-5">
                  <p className="text-2xl font-black text-amber-300">{f.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{f.label}</p>
                </motion.div>
              ))}
            </div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
              {slide.detail}
            </motion.p>
          </div>
        );

      case "ask": {
        const Icon = slide.icon;
        return (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: slide.iconColor + "15", border: `2px solid ${slide.iconColor}` }}>
                <Icon size={28} style={{ color: slide.iconColor }} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3" style={{ color: slide.iconColor }}>{slide.kicker}</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{slide.title}</h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">{slide.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {slide.asks.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-gray-900/70 border rounded-2xl p-5" style={{ borderColor: a.color + "30", borderLeftColor: a.color, borderLeftWidth: 3 }}>
                  <p className="font-bold text-sm mb-1" style={{ color: a.color }}>{a.label}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{a.desc}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-gray-500 text-sm italic max-w-2xl mx-auto">{slide.cta}</p>
          </div>
        );
      }

      case "closing": {
        const Icon = slide.icon;
        return (
          <div className="text-center max-w-3xl">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.8 }}
              className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: slide.iconColor + "15", border: `2px solid ${slide.iconColor}` }}>
              <Icon size={32} style={{ color: slide.iconColor }} />
            </motion.div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4" style={{ color: slide.iconColor }}>{slide.kicker}</p>
            <h2 className="text-5xl md:text-6xl font-black text-white mb-4">{slide.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">{slide.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {slide.links.map((l, i) => {
                const LIcon = l.icon;
                return (
                  <Link key={i} to={l.to}
                    className="flex flex-col items-center gap-2 bg-gray-900/60 border border-gray-800 hover:border-cyan-700 rounded-xl p-4 transition-all group">
                    <LIcon size={18} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-gray-400 group-hover:text-white text-xs font-semibold transition-colors">{l.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full h-full flex items-center justify-center px-6 md:px-12 py-16 bg-gradient-to-br ${slide.bg}`}
    >
      {renderContent()}
    </motion.div>
  );
}

// ── Main Slideshow ────────────────────────────────────────────────────────
export default function EMFImpactSlideshow() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const slideDuration = 12000; // 12 seconds per slide
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const goTo = useCallback((i) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    setProgress(0);
  }, [current]);

  // Auto-advance
  useEffect(() => {
    if (!playing) {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
      return;
    }
    intervalRef.current = setInterval(goNext, slideDuration);
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (slideDuration / 100)), 100));
    }, 100);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [playing, goNext, current]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      else if (e.key === "p" || e.key === "P") setPlaying(p => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const slide = SLIDES[current];

  return (
    <div className="fixed inset-0 bg-gray-950 overflow-hidden flex flex-col">
      <ProgressBar progress={progress} />

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <SlideRenderer key={current} slide={slide} direction={direction} />
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-950/95 border-t border-gray-800 backdrop-blur z-40">
        {/* Left: counter */}
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs font-mono tabular-nums">
            {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Center: prev / play / next */}
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-300 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setPlaying(p => !p)} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors border ${playing ? "bg-cyan-900/50 border-cyan-700 text-cyan-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"}`}>
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={goNext} className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-300 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: dots */}
        <div className="flex items-center gap-1.5 max-w-[40%] overflow-x-auto scrollbar-hide">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`flex-shrink-0 h-2 rounded-full transition-all ${i === current ? "w-8 bg-cyan-500" : "w-2 bg-gray-700 hover:bg-gray-600"}`}
              title={s.title} />
          ))}
        </div>
      </div>

      {/* Edge nav arrows (desktop) */}
      <button onClick={goPrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800 hover:bg-gray-800 items-center justify-center text-gray-400 hover:text-white transition-colors z-30">
        <ChevronLeft size={18} />
      </button>
      <button onClick={goNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800 hover:bg-gray-800 items-center justify-center text-gray-400 hover:text-white transition-colors z-30">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}