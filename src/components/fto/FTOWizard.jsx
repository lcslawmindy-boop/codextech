import { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  ChevronRight, ChevronLeft, ShieldCheck, ShieldAlert, ShieldX,
  Loader2, CheckCircle2, AlertTriangle, Lightbulb, Target, Globe,
  Database, BookOpen, Zap, Info, Check
} from "lucide-react";

const DOMAINS = [
  "Electromagnetic / RF", "Bioelectromagnetics / Medical Devices",
  "Vacuum Energy / Over-Unity", "Scalar Wave Technology",
  "Semiconductor / Electronics", "Quantum Systems",
  "Propulsion / Aerospace", "Materials Science",
  "Software / AI", "Biotechnology / Pharmaceuticals", "Other"
];
const MARKETS = ["United States", "European Union", "China", "Japan", "South Korea", "Canada", "Australia", "India", "Global"];

const RISK_CONFIG = {
  low:      { color: "#22c55e", label: "Low Risk",      Icon: ShieldCheck },
  medium:   { color: "#f59e0b", label: "Medium Risk",   Icon: ShieldAlert },
  high:     { color: "#ef4444", label: "High Risk",     Icon: ShieldX },
  critical: { color: "#a855f7", label: "Critical Risk", Icon: ShieldX },
};

const STEPS = [
  { id: "describe", label: "Describe Invention", icon: "📝" },
  { id: "scope", label: "Set Scope", icon: "🎯" },
  { id: "library", label: "Internal Library Check", icon: "📚" },
  { id: "run", label: "AI FTO Analysis", icon: "⚡" },
  { id: "results", label: "Results & White Space", icon: "🗺️" },
];

// ── Step 1: Describe ──────────────────────────────────────────────────────────
function StepDescribe({ form, set, onNext }) {
  const valid = form.title.length > 5 && form.description.length > 30;
  return (
    <div className="space-y-5">
      <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3 flex items-start gap-2">
        <Info size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300 text-xs leading-relaxed">
          Describe your invention in plain language. Be as specific as possible — the AI will use this to identify blocking patents and white-space opportunities.
        </p>
      </div>
      <div>
        <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Invention Title *</label>
        <input value={form.title} onChange={e => set("title", e.target.value)}
          placeholder="e.g. Motionless Electromagnetic Generator with Asymmetric Regauging"
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-700" />
      </div>
      <div>
        <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Invention Description *</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)}
          placeholder="Describe the key technical features, novel mechanisms, materials, and intended operation. Include what problem it solves and how it differs from known prior art…"
          rows={7}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-700 resize-none" />
        <p className="text-gray-700 text-xs mt-1">{form.description.length} chars — aim for 200+</p>
      </div>
      <div>
        <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Key Claims (optional)</label>
        <textarea value={form.claims} onChange={e => set("claims", e.target.value)}
          placeholder="List 2–5 independent claims or key technical assertions of novelty…"
          rows={3}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-700 resize-none" />
      </div>
      <button onClick={onNext} disabled={!valid}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-yellow-800 hover:bg-yellow-700 text-black disabled:opacity-40 transition-all">
        Continue <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ── Step 2: Scope ─────────────────────────────────────────────────────────────
function StepScope({ form, set, onNext, onBack }) {
  const toggleMarket = (m) => set("markets", form.markets.includes(m) ? form.markets.filter(x => x !== m) : [...form.markets, m]);
  const valid = form.domain && form.markets.length > 0;
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Technology Domain *</label>
        <select value={form.domain} onChange={e => set("domain", e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600">
          <option value="">Select domain…</option>
          {DOMAINS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Target Markets *</label>
        <div className="flex flex-wrap gap-2">
          {MARKETS.map(m => (
            <button key={m} onClick={() => toggleMarket(m)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${
                form.markets.includes(m)
                  ? "bg-yellow-900/40 border-yellow-700 text-yellow-300"
                  : "bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-600"
              }`}>{m}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Analysis Depth</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "quick", label: "Quick Scan", desc: "~15s · Overview only", color: "#22c55e" },
            { id: "standard", label: "Standard", desc: "~30s · Full FTO", color: "#f59e0b" },
            { id: "deep", label: "Deep Dive", desc: "~45s · With white-space map", color: "#a855f7" },
          ].map(opt => (
            <button key={opt.id} onClick={() => set("depth", opt.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                form.depth === opt.id ? "border-gray-600 bg-gray-800" : "border-gray-800 bg-gray-900/40 hover:border-gray-700"
              }`}>
              <p className="font-black text-xs" style={{ color: opt.color }}>{opt.label}</p>
              <p className="text-gray-600 text-xs mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-bold hover:bg-gray-800 transition-all">
          <ChevronLeft size={14} /> Back
        </button>
        <button onClick={onNext} disabled={!valid}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm bg-yellow-800 hover:bg-yellow-700 text-black disabled:opacity-40 transition-all">
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Step 3: Internal Library Cross-Reference ──────────────────────────────────
function StepLibrary({ form, libraryMatches, libraryLoading, onRunLibrary, onNext, onBack }) {
  return (
    <div className="space-y-4">
      <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4">
        <p className="text-purple-300 font-black text-sm mb-1 flex items-center gap-2">
          <Database size={13} /> Internal Patent Library Cross-Reference
        </p>
        <p className="text-gray-400 text-xs leading-relaxed">
          Cross-reference your invention against <strong className="text-white">200+ prior art entries</strong> in the internal library before running the full AI FTO. This catches immediate conflicts from our own documented patents.
        </p>
      </div>

      {!libraryMatches && !libraryLoading && (
        <button onClick={onRunLibrary}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-purple-800 hover:bg-purple-700 text-white transition-all">
          <BookOpen size={15} /> Cross-Reference Internal Library
        </button>
      )}

      {libraryLoading && (
        <div className="flex flex-col items-center justify-center py-10 border border-dashed border-purple-900/40 rounded-2xl">
          <Loader2 size={24} className="animate-spin text-purple-400 mb-3" />
          <p className="text-gray-400 text-sm font-bold">Scanning 200+ internal patent entries…</p>
        </div>
      )}

      {libraryMatches && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-white font-black text-sm">Library Scan Results</p>
            <button onClick={onRunLibrary} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
              <Loader2 size={10} /> Re-scan
            </button>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Conflicts Found", value: libraryMatches.conflicts?.length || 0, color: "#ef4444" },
              { label: "Related Prior Art", value: libraryMatches.related?.length || 0, color: "#f59e0b" },
              { label: "White Space Gaps", value: libraryMatches.white_space?.length || 0, color: "#22c55e" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                <p className="font-black text-xl" style={{ color: s.color }}>{s.value}</p>
                <p className="text-gray-600 text-xs">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Conflicts */}
          {libraryMatches.conflicts?.length > 0 && (
            <div>
              <p className="text-red-400 text-xs font-black mb-2 flex items-center gap-1"><AlertTriangle size={10} /> Internal Conflicts</p>
              <div className="space-y-2">
                {libraryMatches.conflicts.map((c, i) => (
                  <div key={i} className="bg-red-950/10 border border-red-900/40 rounded-xl px-4 py-3">
                    <p className="text-white font-bold text-xs">{c.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{c.overlap}</p>
                    {c.patent_number && <p className="text-red-400 text-xs mt-1 font-bold">{c.patent_number}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Prior Art */}
          {libraryMatches.related?.length > 0 && (
            <div>
              <p className="text-yellow-400 text-xs font-black mb-2 flex items-center gap-1"><BookOpen size={10} /> Related Prior Art in Library</p>
              <div className="space-y-1.5">
                {libraryMatches.related.map((r, i) => (
                  <div key={i} className="bg-yellow-950/10 border border-yellow-900/30 rounded-xl px-3 py-2 flex items-start gap-2">
                    <p className="text-yellow-300 text-xs font-bold flex-shrink-0">{r.year || ""}</p>
                    <div>
                      <p className="text-white text-xs font-semibold">{r.title}</p>
                      <p className="text-gray-500 text-xs">{r.inventor} · {r.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* White space */}
          {libraryMatches.white_space?.length > 0 && (
            <div>
              <p className="text-green-400 text-xs font-black mb-2 flex items-center gap-1"><Lightbulb size={10} /> White Space Opportunities (Library Gap)</p>
              <div className="space-y-1.5">
                {libraryMatches.white_space.map((w, i) => (
                  <div key={i} className="bg-green-950/10 border border-green-900/30 rounded-xl px-3 py-2">
                    <p className="text-green-300 text-xs font-semibold">{w.area}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-3">
            <p className="text-blue-300 text-xs">{libraryMatches.summary}</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-bold hover:bg-gray-800 transition-all">
          <ChevronLeft size={14} /> Back
        </button>
        <button onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm bg-yellow-800 hover:bg-yellow-700 text-black transition-all">
          {libraryMatches ? "Continue to AI Analysis" : "Skip — Run AI Analysis"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── Step 4: Running AI ─────────────────────────────────────────────────────────
function StepRunning({ status }) {
  const steps = [
    "Parsing invention claims…",
    "Scanning USPTO patent classes (CPC/IPC)…",
    "Identifying potentially blocking patents…",
    "Assessing claim overlap and risk scores…",
    "Mapping white-space opportunities…",
    "Generating design-around strategies…",
    "Compiling jurisdiction risk map…",
    "Finalizing FTO report…",
  ];
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-green-900/30 flex items-center justify-center">
          <ShieldCheck size={32} className="text-green-800" />
        </div>
        <Loader2 size={20} className="text-green-400 animate-spin absolute -top-1 -right-1" />
      </div>
      <div className="text-center">
        <p className="text-white font-black text-base mb-1">Analyzing Patent Landscape…</p>
        <p className="text-gray-500 text-xs max-w-xs">{status || "Scanning USPTO, EPO, and WIPO databases for blocking claims."}</p>
      </div>
      <div className="w-full max-w-sm space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <Check size={10} className="text-green-700 flex-shrink-0" />
            <span className="text-gray-600">{s}</span>
          </div>
        ))}
      </div>
      <p className="text-gray-700 text-xs">Using Claude Sonnet — deep legal reasoning · 20–40 seconds</p>
    </div>
  );
}

// ── Step 5: Results ────────────────────────────────────────────────────────────
function StepResults({ analysis, libraryMatches, onReset, onExportPDF }) {
  const [activeSection, setActiveSection] = useState("overview");
  const riskCfg = RISK_CONFIG[analysis?.overall_risk] || RISK_CONFIG.medium;
  const RiskIcon = riskCfg.Icon;

  const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "patents", label: `Blocking Patents (${analysis?.blocking_patents?.length || 0})` },
    { id: "whitespace", label: "White Space" },
    { id: "strategies", label: "Strategies" },
    { id: "jurisdictions", label: "Jurisdictions" },
  ];

  return (
    <div className="space-y-4">
      {/* Risk header */}
      <div className={`rounded-2xl p-5 border`}
        style={{ borderColor: riskCfg.color + "50", background: riskCfg.color + "10" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <RiskIcon size={24} style={{ color: riskCfg.color }} />
            <div>
              <p className="font-black text-lg" style={{ color: riskCfg.color }}>{riskCfg.label}</p>
              <p className="text-gray-500 text-xs">FTO Analysis Complete</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-black text-4xl" style={{ color: riskCfg.color }}>{analysis.risk_score}</p>
            <p className="text-gray-500 text-xs">/ 100</p>
          </div>
        </div>
        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${analysis.risk_score}%`, backgroundColor: riskCfg.color }} />
        </div>
      </div>

      {/* Section nav */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeSection === s.id ? "bg-gray-700 text-white" : "text-gray-600 hover:text-gray-400"
            }`}>{s.label}</button>
        ))}
      </div>

      {/* Overview */}
      {activeSection === "overview" && (
        <div className="space-y-3">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Executive Summary</p>
            <p className="text-gray-200 text-sm leading-relaxed">{analysis.executive_summary}</p>
          </div>
          {libraryMatches && (
            <div className="bg-purple-950/20 border border-purple-800/40 rounded-xl p-4">
              <p className="text-purple-300 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1">
                <Database size={10} /> Internal Library Findings
              </p>
              <p className="text-gray-300 text-xs leading-relaxed">{libraryMatches.summary}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-red-400 text-xs font-bold">{libraryMatches.conflicts?.length || 0} conflicts</span>
                <span className="text-yellow-400 text-xs font-bold">{libraryMatches.related?.length || 0} related</span>
                <span className="text-green-400 text-xs font-bold">{libraryMatches.white_space?.length || 0} gaps</span>
              </div>
            </div>
          )}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Recommended Next Steps</p>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{analysis.next_steps}</p>
          </div>
        </div>
      )}

      {/* Blocking Patents */}
      {activeSection === "patents" && (
        <div className="space-y-2">
          {analysis.blocking_patents?.length === 0 ? (
            <div className="text-center py-8 text-gray-600 text-sm">No blocking patents identified.</div>
          ) : analysis.blocking_patents?.map((p, i) => {
            const rc = { high: "#ef4444", medium: "#f59e0b", low: "#22c55e" }[p.risk_level] || "#f59e0b";
            return (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black px-2 py-0.5 rounded border flex-shrink-0 mt-0.5"
                    style={{ color: rc, borderColor: rc + "60", background: rc + "18" }}>
                    {(p.risk_level || "medium").toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{p.title}</p>
                    <p className="text-gray-500 text-xs">{p.patent_number} · {p.assignee}</p>
                    <p className="text-gray-400 text-xs mt-2 leading-relaxed">{p.overlap_explanation}</p>
                    {p.expiry_estimate && (
                      <p className="text-yellow-400 text-xs mt-1 font-bold">Expiry: {p.expiry_estimate}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* White Space */}
      {activeSection === "whitespace" && (
        <div className="space-y-3">
          <div className="bg-green-950/10 border border-green-900/30 rounded-xl p-4">
            <p className="text-green-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb size={11} /> AI-Identified White Space
            </p>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{analysis.white_space_opportunities}</p>
          </div>
          <div className="bg-yellow-950/10 border border-yellow-900/30 rounded-xl p-4">
            <p className="text-yellow-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1">
              <Target size={11} /> Recommended Claims Focus
            </p>
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{analysis.recommended_claims_focus}</p>
          </div>
        </div>
      )}

      {/* Design-around strategies */}
      {activeSection === "strategies" && (
        <div className="bg-indigo-950/10 border border-indigo-900/30 rounded-xl p-4">
          <p className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1">
            <Zap size={11} /> Design-Around Strategies
          </p>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{analysis.design_around_strategies}</p>
        </div>
      )}

      {/* Jurisdiction risks */}
      {activeSection === "jurisdictions" && (
        <div className="bg-cyan-950/10 border border-cyan-900/30 rounded-xl p-4">
          <p className="text-cyan-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1">
            <Globe size={11} /> Jurisdiction-Specific Risks
          </p>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{analysis.jurisdiction_risks}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded-xl p-3">
        <Info size={11} className="text-gray-600 flex-shrink-0 mt-0.5" />
        <p className="text-gray-600 text-xs leading-relaxed">{analysis.disclaimer || "AI-generated report for informational purposes only — not legal advice. Consult a USPTO-registered patent attorney before commercializing."}</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onReset} className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-gray-700 text-gray-400 text-sm font-bold hover:bg-gray-800 transition-all">
          New Analysis
        </button>
        <button onClick={onExportPDF}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 font-black text-sm transition-all">
          Download PDF Report
        </button>
      </div>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function FTOWizard({ onExportPDF }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "", description: "", claims: "",
    domain: "", markets: ["United States"], depth: "standard"
  });
  const [libraryMatches, setLibraryMatches] = useState(null);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [runStatus, setRunStatus] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const runLibraryCheck = async () => {
    setLibraryLoading(true);
    setLibraryMatches(null);
    // Pull internal prior art entries
    const entries = await base44.entities.PriorArtEntry.list("-year", 100);

    // Use AI to cross-reference against internal library
    const entryList = entries.slice(0, 60).map(e =>
      `[${e.year}] ${e.title} by ${e.inventor} (${e.category}) — ${e.description?.slice(0, 120)}`
    ).join("\n");

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a senior patent analyst cross-referencing a new invention against an internal library of prior art entries.

INVENTION: ${form.title}
DESCRIPTION: ${form.description}
DOMAIN: ${form.domain}

INTERNAL LIBRARY (200+ entries, sample of 60):
${entryList}

Analyze and return JSON with:
- conflicts: Array of up to 4 objects with { title, inventor, year, category, patent_number, overlap } — entries that directly overlap with the invention
- related: Array of up to 6 objects with { title, inventor, year, category } — related entries worth monitoring
- white_space: Array of up to 4 objects with { area, description } — gaps in the library where the invention has clear novelty
- summary: 2-sentence plain-English summary of the library cross-reference findings`,
      response_json_schema: {
        type: "object",
        properties: {
          conflicts: { type: "array", items: { type: "object" } },
          related: { type: "array", items: { type: "object" } },
          white_space: { type: "array", items: { type: "object" } },
          summary: { type: "string" }
        }
      }
    });
    setLibraryMatches(res);
    setLibraryLoading(false);
  };

  const runAnalysis = async () => {
    setStep(3);
    setRunStatus("Parsing invention claims…");

    const depthInstructions = {
      quick: "Provide a concise scan — focus on major blockers and 2 design-around strategies.",
      standard: "Provide a comprehensive FTO analysis covering all blocking patents and white space.",
      deep: "Provide an exhaustive analysis — 6+ blocking patents, detailed white space map, comprehensive jurisdiction breakdown, and 5+ numbered strategies."
    }[form.depth] || "";

    const libraryContext = libraryMatches
      ? `\n\nINTERNAL LIBRARY PRE-SCAN FOUND:\n- Conflicts: ${(libraryMatches.conflicts || []).map(c => c.title).join(", ") || "none"}\n- Related: ${(libraryMatches.related || []).map(r => r.title).join(", ") || "none"}\n- Library White Space: ${(libraryMatches.white_space || []).map(w => w.area).join(", ") || "none"}`
      : "";

    const prompt = `You are a senior patent attorney at a top-tier IP law firm conducting a Freedom-to-Operate (FTO) analysis.

INVENTION TITLE: ${form.title}
DOMAIN: ${form.domain}
TARGET MARKETS: ${form.markets.join(", ")}
KEY CLAIMS: ${form.claims || "See description"}

INVENTION DESCRIPTION:
${form.description}
${libraryContext}

${depthInstructions}

Return JSON with ALL of these keys:
- overall_risk: "low" | "medium" | "high" | "critical"
- risk_score: integer 0–100
- executive_summary: 3–4 sentence plain-language summary
- blocking_patents: array of ${form.depth === "deep" ? "6–8" : "3–5"} objects with: patent_number, title, assignee, risk_level, overlap_explanation, expiry_estimate
- design_around_strategies: numbered concrete strategies to design around blocking patents
- white_space_opportunities: 3 paragraphs on unoccupied claim space and novel filing angles
- recommended_claims_focus: specific claim language and structural approaches to maximize patentability
- jurisdiction_risks: country-by-country risk notes for target markets
- next_steps: 4 prioritized action items
- disclaimer: standard legal disclaimer`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          overall_risk: { type: "string" },
          risk_score: { type: "integer" },
          executive_summary: { type: "string" },
          blocking_patents: { type: "array", items: { type: "object" } },
          design_around_strategies: { type: "string" },
          white_space_opportunities: { type: "string" },
          recommended_claims_focus: { type: "string" },
          jurisdiction_risks: { type: "string" },
          next_steps: { type: "string" },
          disclaimer: { type: "string" },
        }
      }
    });

    setAnalysis(res);
    setStep(4);

    // Save to entity
    await base44.entities.FTOAnalysis.create({
      invention_title: form.title,
      invention_description: form.description,
      technology_domain: form.domain,
      target_markets: form.markets,
      ...res,
      status: "draft",
    });
  };

  const reset = () => {
    setStep(0);
    setForm({ title: "", description: "", claims: "", domain: "", markets: ["United States"], depth: "standard" });
    setLibraryMatches(null);
    setAnalysis(null);
  };

  return (
    <div>
      {/* Step progress bar */}
      <div className="flex items-center gap-0 mb-6 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-shrink-0">
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              i === step ? "bg-yellow-800 text-black" :
              i < step ? "bg-green-900/40 text-green-400" :
              "text-gray-600"
            }`}>
              {i < step ? <Check size={10} /> : <span>{s.icon}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={12} className={`flex-shrink-0 mx-0.5 ${i < step ? "text-green-700" : "text-gray-800"}`} />}
          </div>
        ))}
      </div>

      {step === 0 && <StepDescribe form={form} set={set} onNext={() => setStep(1)} />}
      {step === 1 && <StepScope form={form} set={set} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && (
        <StepLibrary
          form={form}
          libraryMatches={libraryMatches}
          libraryLoading={libraryLoading}
          onRunLibrary={runLibraryCheck}
          onNext={runAnalysis}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && <StepRunning status={runStatus} />}
      {step === 4 && analysis && (
        <StepResults
          analysis={analysis}
          libraryMatches={libraryMatches}
          onReset={reset}
          onExportPDF={() => onExportPDF?.(form, analysis)}
        />
      )}
    </div>
  );
}