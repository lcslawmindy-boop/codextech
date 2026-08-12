import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Home, Box, FileText, Package, Layers, Activity, AlertTriangle,
  ChevronRight, Cpu, Shield, Zap, Download, RefreshCw, ChevronDown, ChevronUp,
  Brain, Heart, Sparkles, Wrench, CheckCircle2
} from "lucide-react";
import UltimateMedbed3D from "@/components/UltimateMedbed3D";
import UltimateMedbedAssembly3D from "@/components/UltimateMedbedAssembly3D";
import {
  MEDBED_OVERVIEW, MODALITIES, PRD, PDR, BOM_SUMMARY, BOM_CATEGORIES,
  ASSEMBLY_PHASES, TOTAL_HOURS, SUPPRESSED_CONCEPTS
} from "@/lib/ultimateMedbedData";
import { ASSEMBLY_STEPS, TOTAL_SUB_STEPS } from "@/lib/ultimateMedbedAssembly";

const TABS = [
  { id: "render", label: "3D Render", icon: Box },
  { id: "overview", label: "Overview", icon: Sparkles },
  { id: "modalities", label: "Modalities (18)", icon: Activity },
  { id: "build", label: "Build Plan", icon: Wrench },
  { id: "bom", label: "BOM", icon: Package },
  { id: "prd", label: "PRD", icon: FileText },
  { id: "pdr", label: "PDR", icon: Layers },
  { id: "sources", label: "Sources", icon: Shield },
];

const CATEGORY_COLORS = {};
BOM_CATEGORIES.forEach(c => { CATEGORY_COLORS[c.name] = c.color; });

export default function UltimateMedbed() {
  const [tab, setTab] = useState("render");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-transparent to-cyan-500/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors">
                <Home size={14} /> <span className="text-[10px] font-bold hidden sm:inline">Home</span>
              </Link>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">{MEDBED_OVERVIEW.designator} · {MEDBED_OVERVIEW.revision}</span>
                </div>
                <h1 className="text-2xl font-black text-white" style={{ fontFamily: "Orbitron, sans-serif" }}>
                  {MEDBED_OVERVIEW.name}
                </h1>
                <p className="text-slate-500 text-xs mt-0.5">{MEDBED_OVERVIEW.classification} · {MEDBED_OVERVIEW.documentControl}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-amber-900/30 border border-amber-800 text-amber-300 text-xs font-bold">18 Modalities</span>
              <span className="px-3 py-1.5 rounded-lg bg-cyan-900/30 border border-cyan-800 text-cyan-300 text-xs font-bold">{BOM_SUMMARY.totalLineItems} BOM Items</span>
              <span className="px-3 py-1.5 rounded-lg bg-purple-900/30 border border-purple-800 text-purple-300 text-xs font-bold">{TOTAL_HOURS}h Build</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${active ? "border-amber-400 text-amber-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
                  <Icon size={13} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 3D Render tab */}
        {tab === "render" && (
          <div className="space-y-6">
            <UltimateMedbed3D />
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <Cpu className="text-amber-400 mb-2" size={20} />
                <h3 className="text-white font-bold text-sm mb-1">18 Simultaneous Modalities</h3>
                <p className="text-slate-400 text-xs">All healing technologies operate concurrently under closed-loop AI dosimetry — the world's first unified multi-device.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <Shield className="text-cyan-400 mb-2" size={20} />
                <h3 className="text-white font-bold text-sm mb-1">BFAC+ACE Safety Engine</h3>
                <p className="text-slate-400 text-xs">Real-time biometric monitoring (HRV, SpO₂, EEG, GSR, Temp) with sub-100ms safety cutoff across all modalities.</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <Heart className="text-emerald-400 mb-2" size={20} />
                <h3 className="text-white font-bold text-sm mb-1">Full-Body Supine Immersion</h3>
                <p className="text-slate-400 text-xs">Motorized canopy with zero-gravity preset. Maximum therapeutic surface exposure across dorsal + ventral body.</p>
              </div>
            </div>
          </div>
        )}

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>Synopsis</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{MEDBED_OVERVIEW.synopsis}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Designator", value: MEDBED_OVERVIEW.designator, color: "#f59e0b" },
                { label: "Modalities", value: "18 Active", color: "#06b6d4" },
                { label: "BOM Line Items", value: BOM_SUMMARY.totalLineItems, color: "#ef4444" },
                { label: "Total Components", value: BOM_SUMMARY.totalComponents.toLocaleString(), color: "#a855f7" },
                { label: "Assembly Hours", value: `${TOTAL_HOURS}h`, color: "#10b981" },
                { label: "Dimensions", value: "2.4x1.6x1.8m", color: "#3b82f6" },
                { label: "Max Power", value: "3.5 kW", color: "#f97316" },
                { label: "Max Patient", value: "180 kg", color: "#ec4899" },
              ].map(s => (
                <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">{s.label}</p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-300 text-xs leading-relaxed">
                  <strong>Research Disclaimer:</strong> Conceptual — subject to manufacturer validation. All build plans are derived from publicly available patents, peer-reviewed publications, and declassified documents. No device described herein has been approved by the FDA, FCC, or any regulatory body for medical, therapeutic, commercial, or consumer use. Not medical advice. Classified as a Class III medical device concept under FDA 21 CFR Part 880 — research prototype only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modalities tab */}
        {tab === "modalities" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-amber-400" />
              <p className="text-slate-400 text-sm">{MODALITIES.length} simultaneous therapeutic modalities under BFAC+ACE closed-loop AI control</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {MODALITIES.map(m => (
                <div key={m.code} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ backgroundColor: `${m.color}15`, border: `1px solid ${m.color}40`, color: m.color }}>
                      {m.code}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-bold text-sm">{m.label}</h4>
                      <span className="text-[9px] font-mono uppercase" style={{ color: m.color }}>{m.category}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[10px] font-mono mt-2 leading-relaxed">{m.spec}</p>
                  <p className="text-slate-400 text-[10px] mt-2 leading-relaxed">{m.desc}</p>
                  <p className="text-slate-600 text-[9px] mt-2 italic border-l-2 pl-2" style={{ borderColor: m.color }}>{m.sourceRef}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Build Plan tab */}
        {tab === "build" && (
          <div className="space-y-6">
            {/* Interactive 3D Assembly Manual */}
            <UltimateMedbedAssembly3D />

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-600 text-[10px] uppercase tracking-wider">Assembly Phases</p>
                <p className="text-white font-black text-xl">{ASSEMBLY_STEPS.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-600 text-[10px] uppercase tracking-wider">Sub-Steps</p>
                <p className="text-white font-black text-xl">{TOTAL_SUB_STEPS}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-600 text-[10px] uppercase tracking-wider">Total Hours</p>
                <p className="text-white font-black text-xl">{TOTAL_HOURS}h</p>
              </div>
            </div>

            {/* Detailed step-by-step assembly */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <h2 className="text-white font-bold text-base flex items-center gap-2 mb-4"><Wrench size={18} className="text-amber-400" /> Technical Assembly Layout — Step by Step</h2>
              <div className="space-y-6">
                {ASSEMBLY_STEPS.map((phase) => (
                  <div key={phase.phase} className="border-l-2 pl-4" style={{ borderColor: phase.color }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm flex-shrink-0" style={{ backgroundColor: `${phase.color}20`, border: `1px solid ${phase.color}40`, color: phase.color }}>
                          {phase.phase}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm">{phase.title}</h3>
                          <p className="text-slate-500 text-[10px]">{phase.steps.length} sub-steps</p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-xs font-bold">{phase.hours}h</span>
                    </div>
                    <div className="space-y-2">
                      {phase.steps.map((s) => (
                        <div key={s.id} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold flex-shrink-0 w-8" style={{ color: phase.color }}>{s.id}</span>
                            <h4 className="text-white text-xs font-bold flex-1">{s.title}</h4>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed mb-2 ml-10">{s.detail}</p>
                          <div className="ml-10 flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                            <span className="text-slate-500"><strong className="text-slate-400">Tool:</strong> {s.tool}</span>
                            <span className="text-slate-500"><strong className="text-slate-400">Parts:</strong> {s.parts}</span>
                          </div>
                          <div className="ml-10 mt-2 flex items-start gap-1.5">
                            <CheckCircle2 size={11} className="text-green-400 flex-shrink-0 mt-0.5" />
                            <p className="text-green-400 text-[10px]"><strong>Verify:</strong> {s.verify}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-300 text-xs leading-relaxed">
                  Minimum 2 technicians required for all phases. Full LOTO procedures mandatory throughout electrical phases. Read safety overview before beginning any work. All components max 80°C during 30-min burn-in — thermal camera monitoring required.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* BOM tab */}
        {tab === "bom" && <BomTab />}

        {/* PRD tab */}
        {tab === "prd" && <DocTab doc={PRD} title="Product Requirements Document" docId="ZA-ENG-MB-OMEGA-A-PRD" />}

        {/* PDR tab */}
        {tab === "pdr" && <DocTab doc={PDR} title="Preliminary Design Review" docId="ZA-ENG-MB-OMEGA-A-PDR" />}

        {/* Sources tab */}
        {tab === "sources" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={16} className="text-amber-400" />
              <p className="text-slate-400 text-sm">Suppressed and emerging technology source references — all public domain or published</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUPPRESSED_CONCEPTS.map((c, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-white font-bold text-sm">{c.name}</h4>
                    <span className="text-slate-500 text-[10px] font-mono">{c.year}</span>
                  </div>
                  <p className="text-slate-400 text-xs"><strong className="text-slate-300">Inventor:</strong> {c.inventor}</p>
                  <p className="text-slate-400 text-xs"><strong className="text-slate-300">Patent:</strong> {c.patent}</p>
                  <p className="text-slate-400 text-xs mt-1"><strong className="text-slate-300">Outcome:</strong> {c.outcome}</p>
                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <p className="text-amber-400 text-[10px] font-bold uppercase">Role in Omega MedBed</p>
                    <p className="text-slate-400 text-xs mt-0.5">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-4 mt-8">
        <p className="text-slate-600 text-[9px] text-center leading-relaxed">
          ZARP Omega MedBed — Conceptual engineering documentation for research and IP development purposes only. ZARP does not validate or endorse the underlying scientific claims. Not medical advice. All third-party works remain the exclusive copyright of their respective authors or estates. © 2026 Aethon Apex IP Holdings LLC.
        </p>
      </footer>
    </div>
  );
}

// ── BOM Tab Component ───────────────────────────────────────────────────────
function BomTab() {
  const [generated, setGenerated] = useState(false);
  const [expandedCats, setExpandedCats] = useState({});

  const toggleCat = (cat) => setExpandedCats(p => ({ ...p, [cat]: !p[cat] }));

  const handleExport = () => {
    const rows = [["Ref", "Category", "Component", "Spec", "Qty", "Source", "Notes"]];
    BOM_CATEGORIES.forEach(cat => {
      cat.items.forEach(item => {
        rows.push([item.ref, cat.name, item.component, item.spec, item.qty, item.source, item.notes]);
      });
    });
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ZA-MB-OMEGA-BOM.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-amber-400/15 border border-amber-400/40">
              <Package size={20} className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">BOM Generator — ZA-MB-Omega MedBed</h3>
              <p className="text-slate-500 text-xs mt-0.5">{BOM_SUMMARY.totalLineItems} line items · {BOM_SUMMARY.totalComponents.toLocaleString()} components · {BOM_SUMMARY.categories} categories · 18 modalities</p>
            </div>
          </div>
          <div className="flex gap-2">
            {!generated ? (
              <button onClick={() => setGenerated(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold hover:bg-amber-300 transition-colors">
                <RefreshCw size={13} /> Generate BOM
              </button>
            ) : (
              <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-800 hover:bg-green-700 text-white text-xs font-bold transition-colors">
                <Download size={13} /> Export CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {!generated ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 text-center">
          <Layers size={32} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Click "Generate BOM" to compile the complete bill of materials</p>
          <p className="text-slate-700 text-xs mt-1">Components derived from 18 modality specs, structural assembly, and electrical systems</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-600 text-[10px] uppercase tracking-wider">Line Items</p>
              <p className="text-white font-black text-xl">{BOM_SUMMARY.totalLineItems}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-600 text-[10px] uppercase tracking-wider">Components</p>
              <p className="text-white font-black text-xl">{BOM_SUMMARY.totalComponents.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-600 text-[10px] uppercase tracking-wider">Categories</p>
              <p className="text-white font-black text-xl">{BOM_SUMMARY.categories}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3">Component Count by Category</p>
            <div className="space-y-2">
              {BOM_CATEGORIES.map(cat => {
                const count = cat.items.length;
                const pct = (count / BOM_SUMMARY.totalLineItems) * 100;
                return (
                  <div key={cat.name} className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-semibold w-40 flex-shrink-0 truncate">{cat.name}</span>
                    <div className="flex-1 h-4 bg-slate-950 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: pct + "%", backgroundColor: cat.color }} />
                    </div>
                    <span className="text-slate-300 text-xs font-bold w-16 text-right">{count} items</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <p className="text-white font-bold text-sm">Complete Bill of Materials</p>
              <p className="text-slate-600 text-xs">ZA-MB-OMEGA-BOM-001 · Rev A</p>
            </div>
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-slate-950 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              <div className="col-span-2">Ref</div>
              <div className="col-span-4">Component</div>
              <div className="col-span-3">Spec</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2">Source</div>
            </div>
            {BOM_CATEGORIES.map(cat => {
              const expanded = expandedCats[cat.name] !== false;
              return (
                <div key={cat.name} className="border-b border-slate-800">
                  <button onClick={() => toggleCat(cat.name)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-950 transition-colors" style={{ borderLeft: `3px solid ${cat.color}` }}>
                    {expanded ? <ChevronUp size={12} className="text-slate-600" /> : <ChevronDown size={12} className="text-slate-600" />}
                    <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.name}</span>
                    <span className="text-slate-600 text-[10px]">({cat.items.length} items)</span>
                  </button>
                  {expanded && cat.items.map((item, i) => (
                    <div key={item.ref} className={`grid grid-cols-12 gap-2 px-4 py-1.5 text-xs items-center ${i % 2 === 0 ? "bg-slate-950/50" : ""}`}>
                      <div className="col-span-2 font-mono text-slate-500 text-[10px]">{item.ref}</div>
                      <div className="col-span-4 text-slate-300 text-[10px]">{item.component}</div>
                      <div className="col-span-3 text-slate-500 text-[10px] truncate" title={item.spec}>{item.spec}</div>
                      <div className="col-span-1 text-center text-slate-400">{item.qty}</div>
                      <div className="col-span-2 text-slate-500 text-[10px] truncate" title={item.source}>{item.source}</div>
                    </div>
                  ))}
                </div>
              );
            })}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-950 border-t-2 border-amber-400">
              <div className="col-span-6 text-white font-bold text-sm">TOTAL LINE ITEMS</div>
              <div className="col-span-3 text-slate-500 text-xs">{BOM_SUMMARY.totalLineItems} components</div>
              <div className="col-span-3 text-right text-slate-500 text-[10px]">Conceptual — subject to manufacturer validation</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Document Tab (PRD / PDR) ────────────────────────────────────────────────
function DocTab({ doc, title, docId }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-bold text-base">{title}</h2>
          <span className="text-slate-600 text-xs font-mono">{docId}</span>
        </div>
        <p className="text-slate-500 text-xs">Rev A · {MEDBED_OVERVIEW.date} · {MEDBED_OVERVIEW.leadEngineer}</p>
      </div>

      {doc.sections.map(section => (
        <div key={section.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-amber-400 font-bold text-sm mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>{section.title}</h3>

          {section.content && (
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{section.content}</p>
          )}

          {section.requirements && (
            <div className="space-y-2">
              {section.requirements.map(r => (
                <div key={r.id} className="flex gap-3 items-start bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                  <span className="text-amber-400 font-mono text-[10px] font-bold flex-shrink-0 w-12">{r.id}</span>
                  <span className="text-slate-300 text-xs leading-relaxed">{r.text}</span>
                </div>
              ))}
            </div>
          )}

          {section.subsystems && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {section.subsystems.map(s => (
                <div key={s.name} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-white text-xs font-bold">{s.name}</p>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${s.status === "Design Complete" ? "bg-green-900/50 text-green-300" : "bg-amber-900/50 text-amber-300"}`}>{s.status}</span>
                  </div>
                  <p className="text-slate-500 text-[10px]">{s.function}</p>
                </div>
              ))}
            </div>
          )}

          {section.designParams && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {section.designParams.map(p => (
                <div key={p.param} className="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800">
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">{p.param}</p>
                  <p className="text-slate-200 text-xs font-mono mt-0.5">{p.value}</p>
                </div>
              ))}
            </div>
          )}

          {section.risks && (
            <div className="space-y-2">
              {section.risks.map(r => (
                <div key={r.id} className="bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-slate-500">{r.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${r.severity === "Critical" ? "bg-red-900/60 text-red-300" : r.severity === "High" ? "bg-orange-900/60 text-orange-300" : "bg-amber-900/50 text-amber-300"}`}>{r.severity}</span>
                  </div>
                  <p className="text-slate-300 text-xs mb-1">{r.risk}</p>
                  <p className="text-emerald-400 text-[10px]">→ {r.mitigation}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}