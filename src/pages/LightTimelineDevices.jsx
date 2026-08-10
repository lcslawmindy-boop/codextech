import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Zap, Brain, Heart, Shield, Sparkles, Radio,
  Globe, Activity, Cpu, Building2, Lightbulb
} from "lucide-react";
import ScalarHealingExplodedView from "@/components/ScalarHealingExplodedView";
import BrainHealingExplodedView from "@/components/BrainHealingExplodedView";
import VPOAnenergyPump3D from "@/components/VPOAnenergyPump3D";
import ScalarGridNode3D from "@/components/ScalarGridNode3D";

const DEVICES = [
  {
    id: "vp",
    name: "Prioré Multichannel EM Device",
    tagline: "The suppressed cancer cure — rebuildable for $2,400",
    icon: Sparkles,
    color: "#ec4899",
    category: "Healing Therapy",
    desc: "Antoine Prioré's 1960s device: rotating plasma tube + 3-layer DDS modulation (S'/S''/S''') + Helmholtz confinement. Documented terminal cancer cures in animals. Modern DDS/FPGA clinical version.",
    specs: [
      { label: "Architecture", value: "Prioré multichannel EM" },
      { label: "Modulation", value: "DDS 3-layer S'/S''/S'''" },
      { label: "Plasma Source", value: "Mercury-argon rotating tube" },
      { label: "Build Cost", value: "$2,400 (clinical)" },
    ],
    impact: "Wound healing 10× · Organ regeneration · Cancer normalization",
    component: "priora",
  },
  {
    id: "brain",
    name: "Cranial Scalar Healing Helmet",
    tagline: "Neurogenesis · trauma recovery · cognitive restoration",
    icon: Brain,
    color: "#06b6d4",
    category: "Healing Therapy",
    desc: "8-coil toroidal crown array + 19-channel EEG feedback + 7.83 Hz Schumann generator + phase conjugate mirror. Restores coherent neural oscillation via trigger window frequencies.",
    specs: [
      { label: "Frequency", value: "7.83 Hz + 10 Hz alpha" },
      { label: "Coil Array", value: "8-coil toroidal crown" },
      { label: "EEG Feedback", value: "19-channel 10-20 system" },
      { label: "PCM", value: "Quartz crystal array" },
    ],
    impact: "Cognitive clarity · Trauma recovery · Neurological disease reversal",
    component: "brain",
  },
  {
    id: "vpo",
    name: "VPO Anenergy Pump",
    tagline: "Vacuum energy → cellular ATP — Moray mechanism at scale",
    icon: Zap,
    color: "#f59e0b",
    category: "Energy Generation",
    desc: "Vacuum Potential Oscillator: phi-ratio scalar field couples to cellular ATPase — increases ATP production without metabolic input. T. Henry Moray's radiant energy mechanism applied at cellular scale.",
    specs: [
      { label: "Circuit", value: "VPO (Vacuum Potential Osc.)" },
      { label: "Coupling", value: "Phi-ratio scalar field" },
      { label: "Target", value: "ATPase enzyme resonance" },
      { label: "Effect", value: "ATP ↑ without food input" },
    ],
    impact: "Energy restoration · Chronic fatigue elimination · Metabolic healing",
    component: "vpo",
  },
  {
    id: "grid",
    name: "Scalar Energy Grid Node",
    tagline: "City-scale vacuum energy — 30% grid draw reduction demonstrated",
    icon: Building2,
    color: "#3b82f6",
    category: "Energy Infrastructure",
    desc: "Open-system vacuum energy extractor for city deployment. Standing-wave scalar field generator with phase conjugate output array. Replaces fossil fuel and nuclear infrastructure.",
    specs: [
      { label: "Type", value: "Open-system vacuum extractor" },
      { label: "Output", value: "Phase conjugate standing wave" },
      { label: "Grid Reduction", value: "30% (pilot demonstrated)" },
      { label: "Scale", value: "City-level deployment" },
    ],
    impact: "Free energy · Post-scarcity transition · Fossil fuel elimination",
    component: "grid",
  },
];

export default function LightTimelineDevices() {
  const [activeDevice, setActiveDevice] = useState("vp");
  const current = DEVICES.find(d => d.id === activeDevice);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-cyan-950/20 to-green-950/20 border-b border-gray-800 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-500 text-xs font-mono uppercase tracking-widest">Light Timeline · Healing Device Gallery</span>
          </div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Lightbulb size={28} className="text-cyan-400" /> 3D Healing Devices — The Light Timeline
          </h1>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            Realistic 3D renderings of the scalar healing and vacuum energy devices that enable humanity's transition from the dark to the light timeline. Each device is buildable with off-the-shelf components.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Device selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {DEVICES.map(d => {
            const Icon = d.icon;
            const isActive = activeDevice === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setActiveDevice(d.id)}
                className="relative p-4 rounded-2xl border text-left transition-all"
                style={isActive ? { borderColor: d.color, backgroundColor: `${d.color}10`, boxShadow: `0 0 20px ${d.color}20` } : { borderColor: "#1f2937" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${d.color}15`, border: `1px solid ${d.color}40` }}>
                  <Icon size={18} style={{ color: d.color }} />
                </div>
                <p className="text-white font-bold text-xs leading-tight">{d.name}</p>
                <p className="text-gray-600 text-[9px] mt-0.5 leading-tight">{d.category}</p>
              </button>
            );
          })}
        </div>

        {/* Active device detail */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden" style={{ borderColor: current.color + "30" }}>
          {/* Header */}
          <div className="p-6 border-b border-gray-800" style={{ background: `linear-gradient(135deg, ${current.color}08, transparent)` }}>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${current.color}15`, border: `1px solid ${current.color}40` }}>
                <current.icon size={24} style={{ color: current.color }} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black">{current.name}</h2>
                <p className="text-sm mt-0.5" style={{ color: current.color }}>{current.tagline}</p>
              </div>
            </div>
          </div>

          {/* 3D View + Info */}
          <div className="p-6 space-y-6">
            {/* 3D Rendering */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Realistic 3D Rendering</h3>
              {current.component === "priora" && <ScalarHealingExplodedView />}
              {current.component === "brain" && <BrainHealingExplodedView />}
              {current.component === "vpo" && <VPOAnenergyPump3D />}
              {current.component === "grid" && <ScalarGridNode3D />}
            </div>

            {/* Description + Specs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h3>
                <p className="text-gray-300 text-sm leading-relaxed bg-gray-950 border border-gray-800 rounded-xl p-4">{current.desc}</p>
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

            {/* Impact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Light Timeline Impact</h3>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold" style={{ borderColor: current.color + "40", backgroundColor: current.color + "10", color: current.color }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: current.color }} />
                {current.impact}
              </div>
            </div>
          </div>
        </div>

        {/* Light timeline summary */}
        <div className="mt-8 bg-gradient-to-br from-green-950/30 via-gray-900 to-cyan-950/20 border border-green-800/40 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-900/30 border border-green-700 flex items-center justify-center flex-shrink-0">
              <Globe size={20} className="text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white">These Devices Enable the Light Timeline</h2>
              <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                The Prioré device cures cancer. The VPO pump generates free energy. The scalar grid node powers cities. The cranial helmet restores brains. Together, they transform civilization from the dark to the light timeline — and every one is buildable today.
              </p>
              <div className="grid md:grid-cols-4 gap-3 mt-4">
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3 text-center">
                  <Activity size={16} className="text-green-400 mx-auto mb-1" />
                  <p className="text-green-400 text-lg font-black">−80%</p>
                  <p className="text-gray-500 text-[10px]">Cancer death rate</p>
                </div>
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3 text-center">
                  <Heart size={16} className="text-blue-400 mx-auto mb-1" />
                  <p className="text-blue-400 text-lg font-black">120+</p>
                  <p className="text-gray-500 text-[10px]">Lifespan expectancy</p>
                </div>
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3 text-center">
                  <Zap size={16} className="text-amber-400 mx-auto mb-1" />
                  <p className="text-amber-400 text-lg font-black">Free</p>
                  <p className="text-gray-500 text-[10px]">Energy for all</p>
                </div>
                <div className="bg-gray-950/60 border border-gray-800 rounded-lg p-3 text-center">
                  <Globe size={16} className="text-purple-400 mx-auto mb-1" />
                  <p className="text-purple-400 text-lg font-black">280ppm</p>
                  <p className="text-gray-500 text-[10px]">CO₂ restored</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/emf-impact-slideshow" className="px-4 py-2 rounded-lg bg-cyan-900/30 border border-cyan-800 text-cyan-300 text-xs font-bold hover:bg-cyan-900/50 transition-colors">
            EMF Impact Slideshow →
          </Link>
          <Link to="/scalar-healing" className="px-4 py-2 rounded-lg bg-purple-900/30 border border-purple-800 text-purple-300 text-xs font-bold hover:bg-purple-900/50 transition-colors">
            Scalar Healing Systems →
          </Link>
          <Link to="/therapy-pod-pro" className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-colors">
            Therapy Pod Engineering →
          </Link>
        </div>
      </div>
    </div>
  );
}