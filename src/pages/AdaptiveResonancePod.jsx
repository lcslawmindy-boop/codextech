import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home, Waves, RefreshCw, Activity, Gauge, Brain, Cpu, Circle, Box, Radio,
  Wifi, Shield, ShieldCheck, Cable, Thermometer, Sparkles, Radar, Timer,
  Database, ClipboardList, BarChart3, AlertTriangle, Microscope, FlaskConical,
  Users, Stethoscope, Layers, Zap,
} from "lucide-react";
import AdaptiveResonancePod3D from "@/components/AdaptiveResonancePod3D";
import {
  POD_OVERVIEW, POD_BADGES, RESEARCH_MODULES, HARDWARE_MODULES,
  NOVEL_FEATURES, DEVELOPMENT_PHASES, PLATFORM_VISION, VISION_STATEMENT,
} from "@/lib/adaptiveResonancePodData";

const ICON_MAP = {
  Waves, RefreshCw, Activity, Gauge, Brain, Cpu, Circle, Box, Radio, Wifi,
  Shield, ShieldCheck, Cable, Thermometer, Sparkles, Radar, Timer,
  Database, ClipboardList, BarChart3,
};

const TABS = [
  { id: "render", label: "3D Concept" },
  { id: "overview", label: "Overview" },
  { id: "modules", label: "Research Modules" },
  { id: "hardware", label: "Hardware" },
  { id: "novel", label: "Novel Features" },
  { id: "strategy", label: "Dev Strategy" },
  { id: "vision", label: "Platform Vision" },
];

export default function AdaptiveResonancePod() {
  const [tab, setTab] = useState("render");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors">
                <Home size={14} />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-slate-500 text-[10px] font-mono">{POD_OVERVIEW.id} · {POD_OVERVIEW.revision}</span>
                </div>
                <h1 className="text-white font-black text-base sm:text-lg leading-tight" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {POD_OVERVIEW.name}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {POD_BADGES.map(b => (
                <span key={b.label} className="px-2.5 py-1 rounded-full text-[10px] font-bold border" style={{ borderColor: b.color + "60", color: b.color, backgroundColor: b.color + "10" }}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-3 overflow-x-auto -mb-3 pb-3">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${tab === t.id ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/40" : "text-slate-500 hover:text-slate-300 border border-transparent"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* 3D Concept tab */}
        {tab === "render" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
              <div className="h-[500px] relative">
                <AdaptiveResonancePod3D />
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur">
                  Drag to rotate · Scroll to zoom
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-cyan-400 backdrop-blur">
                  CONCEPT RENDER · {POD_OVERVIEW.id}
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <FeatureMini icon={Microscope} label="Fully Characterized" desc="Every output measured and logged" color="#06b6d4" />
              <FeatureMini icon={Layers} label="Multimodal Sync" desc="All modalities phase-locked" color="#10b981" />
              <FeatureMini icon={Brain} label="AI Adaptive" desc="Closed-loop biofeedback control" color="#a855f7" />
            </div>
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>{POD_OVERVIEW.subtitle}</h2>
              <p className="text-cyan-400 text-sm font-medium mb-4">{POD_OVERVIEW.tagline}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{POD_OVERVIEW.description}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {RESEARCH_MODULES.map(m => {
                const Icon = ICON_MAP[m.icon] || Microscope;
                return (
                  <button key={m.id} onClick={() => setTab("modules")} className="text-left rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-400/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: m.color + "15", border: `1px solid ${m.color}40` }}>
                        <Icon size={15} style={{ color: m.color }} />
                      </div>
                      <span className="text-slate-500 text-[10px] font-mono">MODULE {m.id}</span>
                    </div>
                    <h3 className="text-white text-sm font-bold leading-tight">{m.title}</h3>
                  </button>
                );
              })}
            </div>
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}

        {/* Research Modules tab */}
        {tab === "modules" && (
          <div className="space-y-5">
            {RESEARCH_MODULES.map(m => {
              const Icon = ICON_MAP[m.icon] || Microscope;
              return (
                <div key={m.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: m.color }} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: m.color + "15", border: `1px solid ${m.color}40` }}>
                        <Icon size={20} style={{ color: m.color }} />
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] font-mono">RESEARCH MODULE {m.id}</span>
                        <h3 className="text-white font-bold text-base leading-tight">{m.title}</h3>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Historical Inspiration</p>
                        <ul className="space-y-1">
                          {m.historical.map((h, i) => (
                            <li key={i} className="text-slate-400 text-xs flex gap-2">
                              <span className="text-slate-600">·</span>{h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-2">Modern Implementation</p>
                        <ul className="space-y-1">
                          {m.modern.map((mod, i) => (
                            <li key={i} className="text-slate-300 text-xs flex gap-2">
                              <span style={{ color: m.color }}>▸</span>{mod}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-950/50 border border-slate-800 p-3 mb-3">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Research Focus</p>
                      <p className="text-slate-300 text-xs leading-relaxed">{m.researchFocus}</p>
                    </div>

                    {m.mappingTable && (
                      <div className="rounded-lg border border-slate-800 overflow-hidden">
                        <p className="bg-slate-950 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">Response Mapping Matrix</p>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-slate-900/50 text-slate-500">
                              <th className="text-left px-3 py-1.5 font-bold">Input Variable</th>
                              <th className="text-left px-3 py-1.5 font-bold">Measured Output</th>
                            </tr>
                          </thead>
                          <tbody>
                            {m.mappingTable.map((row, i) => (
                              <tr key={i} className="border-t border-slate-800">
                                <td className="px-3 py-1.5 text-slate-300">{row.input}</td>
                                <td className="px-3 py-1.5" style={{ color: m.color }}>{row.output}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}

        {/* Hardware tab */}
        {tab === "hardware" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-white font-bold text-base mb-1">New Hardware Inspired by (but Not Copying) Prioré</h2>
              <p className="text-slate-500 text-xs mb-4">Modern engineering components that can be characterized and tested independently.</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {HARDWARE_MODULES.map((hw, i) => {
                  const Icon = ICON_MAP[hw.icon] || Cpu;
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                        <Icon size={16} className="text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold leading-tight">{hw.name}</h3>
                        <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{hw.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}

        {/* Novel Features tab */}
        {tab === "novel" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-white font-bold text-base mb-1">Novel Research Features</h2>
              <p className="text-slate-500 text-xs mb-4">The strongest innovations come from software and systems integration rather than any single physical modality.</p>
              <div className="space-y-3">
                {NOVEL_FEATURES.map((f, i) => {
                  const Icon = ICON_MAP[f.icon] || Sparkles;
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm font-bold">{f.title}</h3>
                        <p className="text-slate-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}

        {/* Development Strategy tab */}
        {tab === "strategy" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-white font-bold text-base mb-1">Scientific Development Strategy</h2>
              <p className="text-slate-500 text-xs mb-5">A phased research program that separates engineering validation from clinical claims.</p>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-slate-800" />
                <div className="space-y-5">
                  {DEVELOPMENT_PHASES.map(p => {
                    const Icon = [Microscope, FlaskConical, Users, Stethoscope][parseInt(p.phase) - 1] || Microscope;
                    return (
                      <div key={p.phase} className="relative pl-14">
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10" style={{ backgroundColor: p.color + "20", border: `2px solid ${p.color}`, color: p.color }}>
                          {p.phase}
                        </div>
                        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={14} style={{ color: p.color }} />
                            <h3 className="text-white font-bold text-sm">{p.title}</h3>
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed mb-3">{p.desc}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {p.deliverables.map((d, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 text-[10px]">{d}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}

        {/* Platform Vision tab */}
        {tab === "vision" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/30 to-slate-900/60 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={20} className="text-cyan-400" />
                <h2 className="text-white font-bold text-base" style={{ fontFamily: "Orbitron, sans-serif" }}>A Potential Next-Generation Platform</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">{VISION_STATEMENT}</p>
              <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-3">Integrated Platform Capabilities</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {PLATFORM_VISION.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                    <span className="text-slate-300 text-xs">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <DisclaimerBanner text={POD_OVERVIEW.disclaimer} />
          </div>
        )}
      </div>
    </div>
  );
}

function FeatureMini({ icon: Icon, label, desc, color }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <Icon size={18} style={{ color }} className="mb-2" />
      <p className="text-white text-sm font-bold">{label}</p>
      <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
    </div>
  );
}

function DisclaimerBanner({ text }) {
  return (
    <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300 text-xs leading-relaxed">{text}</p>
      </div>
    </div>
  );
}