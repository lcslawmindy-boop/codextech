import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ShieldCheck, ShieldAlert, ShieldX, Zap, Loader2,
  Download, Clock, ChevronDown, ChevronUp, Trash2, RefreshCw,
  AlertTriangle, CheckCircle2, Info, FileText, Target, Lightbulb, Globe
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";
import FTOWizard from "../components/fto/FTOWizard";

const DOMAINS = [
  "Electromagnetic / RF", "Bioelectromagnetics / Medical Devices",
  "Vacuum Energy / Over-Unity", "Scalar Wave Technology",
  "Semiconductor / Electronics", "Quantum Systems",
  "Propulsion / Aerospace", "Materials Science",
  "Software / AI", "Biotechnology / Pharmaceuticals", "Other"
];

const MARKETS = ["United States", "European Union", "China", "Japan", "South Korea", "Canada", "Australia", "India", "Global"];

const RISK_CONFIG = {
  low:      { color: "#22c55e", bg: "bg-green-950/30 border-green-800",  icon: ShieldCheck,  label: "Low Risk",      desc: "Relatively clear path to commercialization." },
  medium:   { color: "#f59e0b", bg: "bg-yellow-950/30 border-yellow-800", icon: ShieldAlert, label: "Medium Risk",   desc: "Some potentially blocking patents. Design-arounds likely feasible." },
  high:     { color: "#ef4444", bg: "bg-red-950/30 border-red-800",       icon: ShieldX,     label: "High Risk",     desc: "Significant blocking patents identified. Attorney consultation strongly advised." },
  critical: { color: "#a855f7", bg: "bg-purple-950/30 border-purple-800", icon: ShieldX,     label: "Critical Risk", desc: "Multiple blocking patents likely. Do not commercialize without legal clearance." },
};

function RiskBadge({ risk, large }) {
  const cfg = RISK_CONFIG[risk] || RISK_CONFIG.medium;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 font-black rounded-lg border px-3 ${large ? "py-2 text-sm" : "py-1 text-xs"} ${cfg.bg}`}
      style={{ color: cfg.color }}>
      <Icon size={large ? 15 : 11} /> {cfg.label}
    </span>
  );
}

function BlockingPatentCard({ patent }) {
  const [open, setOpen] = useState(false);
  const riskColor = patent.risk_level === "high" ? "#ef4444" : patent.risk_level === "medium" ? "#f59e0b" : "#22c55e";
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/40 transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-black px-2 py-0.5 rounded border flex-shrink-0"
            style={{ color: riskColor, borderColor: riskColor + "60", backgroundColor: riskColor + "18" }}>
            {(patent.risk_level || "medium").toUpperCase()}
          </span>
          <div className="min-w-0 text-left">
            <p className="text-white text-xs font-bold truncate">{patent.title}</p>
            <p className="text-gray-500 text-xs">{patent.patent_number} · {patent.assignee}</p>
          </div>
        </div>
        {open ? <ChevronUp size={13} className="text-gray-600 flex-shrink-0" /> : <ChevronDown size={13} className="text-gray-600 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-2">
          <p className="text-gray-400 text-xs leading-relaxed">{patent.overlap_explanation}</p>
          {patent.expiry_estimate && (
            <div className="flex items-center gap-2 text-xs">
              <Clock size={11} className="text-gray-600" />
              <span className="text-gray-500">Estimated expiry: </span>
              <span className="text-yellow-400 font-bold">{patent.expiry_estimate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function exportPDF(form, analysis) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, margin = 18, cW = W - margin * 2;
  let y = 20;

  doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(212, 175, 55); doc.rect(0, 0, W, 5, "F");

  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(212, 175, 55);
  doc.text("ZARP — Freedom-to-Operate Analysis", margin, 24);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(100, 116, 139);
  doc.text(`Generated ${new Date().toLocaleDateString()} · For informational purposes only — not legal advice`, margin, 32);
  y = 44;

  const sections = [
    ["INVENTION", form.title],
    ["TECHNOLOGY DOMAIN", form.domain],
    ["TARGET MARKETS", form.markets.join(", ")],
    ["OVERALL RISK LEVEL", (analysis.overall_risk || "").toUpperCase() + " — Risk Score: " + analysis.risk_score + "/100"],
    ["EXECUTIVE SUMMARY", analysis.executive_summary],
    ["BLOCKING PATENTS IDENTIFIED", (analysis.blocking_patents || []).map(p =>
      `${p.patent_number} — ${p.title} (${p.assignee})\nRisk: ${p.risk_level} | Expiry: ${p.expiry_estimate || "Unknown"}\n${p.overlap_explanation}`
    ).join("\n\n")],
    ["DESIGN-AROUND STRATEGIES", analysis.design_around_strategies],
    ["WHITE SPACE OPPORTUNITIES", analysis.white_space_opportunities],
    ["RECOMMENDED CLAIMS FOCUS", analysis.recommended_claims_focus],
    ["JURISDICTION-SPECIFIC RISKS", analysis.jurisdiction_risks],
    ["RECOMMENDED NEXT STEPS", analysis.next_steps],
  ];

  sections.forEach(([title, content]) => {
    if (!content) return;
    if (y > 260) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(212, 175, 55);
    doc.text(title, margin, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(190, 200, 220);
    const lines = doc.splitTextToSize(content, cW - 4);
    lines.forEach(line => {
      if (y > 278) { doc.addPage(); doc.setFillColor(10, 10, 20); doc.rect(0, 0, W, 297, "F"); y = 20; }
      doc.text(line, margin + 2, y); y += 5.5;
    });
    y += 5;
  });

  doc.setFontSize(7.5); doc.setTextColor(80, 90, 100);
  doc.text("DISCLAIMER: This report is generated by AI and is for informational purposes only. It does not constitute legal advice.", margin, 285);
  doc.setFillColor(212, 175, 55); doc.rect(0, 292, W, 5, "F");
  doc.save(`ZARP_FTO_${form.title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
}

// ── HISTORY CARD ─────────────────────────────────────────────────────────────
function HistoryCard({ record, onDelete, onLoad }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-white text-sm font-bold truncate">{record.invention_title}</p>
          <RiskBadge risk={record.overall_risk} />
        </div>
        <p className="text-gray-600 text-xs">{record.technology_domain} · {new Date(record.created_date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={() => onLoad(record)}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
          <RefreshCw size={12} />
        </button>
        <button onClick={() => onDelete(record.id)}
          className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-950/40 text-gray-600 hover:text-red-400 transition-all">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function FTOAnalysisTool() {
  const [tab, setTab] = useState("wizard"); // wizard | analyze | history
  const [form, setForm] = useState({ title: "", description: "", domain: "", markets: ["United States"] });
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleMarket = (m) => set("markets", form.markets.includes(m) ? form.markets.filter(x => x !== m) : [...form.markets, m]);

  const loadHistory = async () => {
    setHistoryLoading(true);
    const data = await base44.entities.FTOAnalysis.list("-created_date", 50);
    setHistory(data);
    setHistoryLoading(false);
  };

  useEffect(() => { if (tab === "history") loadHistory(); }, [tab]);

  const handleRun = async () => {
    if (!form.title || !form.description) return;
    setLoading(true);
    setAnalysis(null);

    const prompt = `You are a senior patent attorney and IP strategist at a top-tier law firm.

A client has asked for a Freedom-to-Operate (FTO) analysis for the following invention:

INVENTION TITLE: ${form.title}
TECHNOLOGY DOMAIN: ${form.domain || "General"}
TARGET MARKETS: ${form.markets.join(", ")}

INVENTION DESCRIPTION:
${form.description}

Produce a comprehensive FTO analysis with EXACTLY these JSON keys:

- overall_risk: One of: "low", "medium", "high", "critical"
- risk_score: Integer 0–100 (100 = maximum blocking risk)
- executive_summary: 3–4 sentence plain-language summary of the FTO landscape
- blocking_patents: Array of 3–6 real or representative patent objects, each with:
    - patent_number: e.g. "US 10,123,456" or "EP 1234567"
    - title: patent title
    - assignee: company or individual owner
    - risk_level: "low", "medium", or "high"
    - overlap_explanation: 2–3 sentences explaining claim overlap with the invention
    - expiry_estimate: estimated expiry year or "Expired" or "Unknown"
- design_around_strategies: 3 numbered concrete strategies to design around blocking patents
- white_space_opportunities: 2–3 paragraphs describing unoccupied claim space the inventor can target
- recommended_claims_focus: Specific claim language and structural approaches to maximize patentability while minimizing infringement risk
- jurisdiction_risks: Country-by-country risk notes for the target markets
- next_steps: 4 numbered prioritized action items (e.g., file provisional, engage attorney, license discussion)
- disclaimer: Standard legal disclaimer (1 sentence)

Be specific, cite real patent classes (CPC/IPC codes where relevant), and treat this as a real legal deliverable.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          overall_risk: { type: "string" },
          risk_score: { type: "integer" },
          executive_summary: { type: "string" },
          blocking_patents: {
            type: "array",
            items: {
              type: "object",
              properties: {
                patent_number: { type: "string" },
                title: { type: "string" },
                assignee: { type: "string" },
                risk_level: { type: "string" },
                overlap_explanation: { type: "string" },
                expiry_estimate: { type: "string" }
              }
            }
          },
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
    setLoading(false);

    await base44.entities.FTOAnalysis.create({
      invention_title: form.title,
      invention_description: form.description,
      technology_domain: form.domain,
      target_markets: form.markets,
      ...res,
      status: "draft",
    });
  };

  const handleLoadHistory = (record) => {
    setForm({
      title: record.invention_title,
      description: record.invention_description,
      domain: record.technology_domain || "",
      markets: record.target_markets || ["United States"],
    });
    setAnalysis({
      overall_risk: record.overall_risk,
      risk_score: record.risk_score,
      executive_summary: record.executive_summary,
      blocking_patents: record.blocking_patents,
      design_around_strategies: record.design_around_strategies,
      white_space_opportunities: record.white_space_opportunities,
      recommended_claims_focus: record.recommended_claims_focus,
      jurisdiction_risks: record.jurisdiction_risks,
      next_steps: record.next_steps,
    });
    setTab("analyze");
  };

  const handleDelete = async (id) => {
    await base44.entities.FTOAnalysis.delete(id);
    setHistory(prev => prev.filter(r => r.id !== id));
  };

  const riskCfg = analysis ? RISK_CONFIG[analysis.overall_risk] || RISK_CONFIG.medium : null;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-400" /> Freedom-to-Operate Analysis
            </h1>
            <p className="text-gray-500 text-xs">AI-powered patent clearance · Replaces $5K–$15K attorney reports</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {analysis && (
            <button onClick={() => exportPDF(form, analysis)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 text-black font-black text-xs transition-all">
              <Download size={12} /> Export PDF
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-gray-800 bg-gray-900/40">
        {[["wizard", "🧭 FTO Wizard"], ["analyze", "⚡ Quick Analysis"], ["history", "🗂 Past Reports"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === id ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-400"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* WIZARD TAB */}
      {tab === "wizard" && (
        <div className="flex-1 overflow-y-auto p-5 max-w-3xl mx-auto w-full">
          <FTOWizard onExportPDF={exportPDF} />
        </div>
      )}

      {/* HISTORY TAB */}
      {tab === "history" && (
        <div className="flex-1 p-5 max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm font-bold">{history.length} past analyses</p>
            <button onClick={loadHistory} className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 transition-all">
              <RefreshCw size={13} />
            </button>
          </div>
          {historyLoading ? (
            <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-yellow-400" /></div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl">
              <FileText size={32} className="text-gray-800 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No analyses yet. Run your first FTO report.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map(r => <HistoryCard key={r.id} record={r} onDelete={handleDelete} onLoad={handleLoadHistory} />)}
            </div>
          )}
        </div>
      )}

      {/* ANALYZE TAB */}
      {tab === "analyze" && (
        <div className="flex-1 max-w-6xl mx-auto w-full px-5 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Input */}
          <div className="space-y-5">
            {/* Legal disclaimer banner */}
            <div className="flex items-start gap-3 bg-blue-950/30 border border-blue-900/50 rounded-xl p-3">
              <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-blue-300 text-xs leading-relaxed">
                AI-generated FTO analysis for research purposes. Not a substitute for qualified legal counsel.
                Consult a patent attorney before commercializing. Risk assessments are based on patent landscape modeling.
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
                placeholder="Describe your invention's key technical features, novel mechanisms, materials, and intended operation. Be as specific as possible — the more detail, the better the FTO analysis…"
                rows={6}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-700 resize-none" />
              <p className="text-gray-700 text-xs mt-1">Tip: Include key claims, technical mechanisms, and what makes it novel.</p>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Technology Domain</label>
              <select value={form.domain} onChange={e => set("domain", e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600">
                <option value="">Select domain…</option>
                {DOMAINS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 text-xs font-black uppercase tracking-wider mb-2">Target Markets</label>
              <div className="flex flex-wrap gap-2">
                {MARKETS.map(m => (
                  <button key={m} onClick={() => toggleMarket(m)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-bold transition-all ${
                      form.markets.includes(m)
                        ? "bg-yellow-900/40 border-yellow-700 text-yellow-300"
                        : "bg-gray-900 border-gray-800 text-gray-600 hover:border-gray-600"
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleRun}
              disabled={!form.title || !form.description || loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40 bg-gradient-to-r from-green-900 to-green-800 hover:from-green-800 hover:to-green-700 text-white shadow-[0_4px_24px_rgba(34,197,94,0.2)]">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {loading ? "Analyzing Patent Landscape…" : "Run FTO Analysis"}
            </button>
            {loading && (
              <p className="text-center text-gray-600 text-xs">Using Claude Sonnet — deeper reasoning for legal analysis. May take 20–30s.</p>
            )}
          </div>

          {/* RIGHT: Results */}
          <div className="space-y-4">
            {!analysis && !loading && (
              <div className="flex flex-col items-center justify-center h-full min-h-80 border border-dashed border-gray-800 rounded-2xl text-center px-8">
                <ShieldCheck size={44} className="text-gray-800 mb-4" />
                <p className="text-gray-600 font-bold text-sm mb-2">Enter your invention details</p>
                <p className="text-gray-700 text-xs leading-relaxed max-w-xs">
                  The AI will scan the patent landscape, identify blocking patents, score your risk, and suggest design-around strategies.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs text-left">
                  {[
                    { icon: <Target size={13} />, label: "Blocking patent detection" },
                    { icon: <Lightbulb size={13} />, label: "Design-around strategies" },
                    { icon: <Globe size={13} />, label: "Jurisdiction risk map" },
                    { icon: <FileText size={13} />, label: "Downloadable PDF report" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-600 text-xs">
                      <span className="text-green-700">{f.icon}</span> {f.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-80 border border-green-900/30 rounded-2xl">
                <div className="relative mb-4">
                  <ShieldCheck size={44} className="text-green-900" />
                  <Loader2 size={20} className="text-green-400 animate-spin absolute -top-1 -right-1" />
                </div>
                <p className="text-gray-300 font-bold text-sm mb-1">Scanning Patent Landscape…</p>
                <p className="text-gray-600 text-xs text-center max-w-xs">Analyzing USPTO, EPO, and WIPO databases for blocking claims, expiry dates, and white space opportunities.</p>
              </div>
            )}

            {analysis && riskCfg && (
              <div className="space-y-4">
                {/* Risk Score Header */}
                <div className={`rounded-2xl border p-5 ${riskCfg.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <RiskBadge risk={analysis.overall_risk} large />
                    <div className="text-right">
                      <p className="font-black text-3xl" style={{ color: riskCfg.color }}>{analysis.risk_score}</p>
                      <p className="text-gray-500 text-xs">/ 100 risk score</p>
                    </div>
                  </div>
                  {/* Risk bar */}
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full transition-all" style={{ width: `${analysis.risk_score}%`, backgroundColor: riskCfg.color }} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{analysis.executive_summary}</p>
                </div>

                {/* Blocking Patents */}
                {analysis.blocking_patents?.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                      <AlertTriangle size={11} className="text-red-400" /> Potentially Blocking Patents ({analysis.blocking_patents.length})
                    </p>
                    <div className="space-y-2">
                      {analysis.blocking_patents.map((p, i) => <BlockingPatentCard key={i} patent={p} />)}
                    </div>
                  </div>
                )}

                {/* Analysis sections */}
                {[
                  { icon: <Lightbulb size={12} />, label: "Design-Around Strategies", key: "design_around_strategies", color: "#6366f1" },
                  { icon: <Target size={12} />, label: "White Space Opportunities", key: "white_space_opportunities", color: "#22c55e" },
                  { icon: <FileText size={12} />, label: "Recommended Claims Focus", key: "recommended_claims_focus", color: "#f59e0b" },
                  { icon: <Globe size={12} />, label: "Jurisdiction-Specific Risks", key: "jurisdiction_risks", color: "#06b6d4" },
                  { icon: <CheckCircle2 size={12} />, label: "Recommended Next Steps", key: "next_steps", color: "#22c55e" },
                ].map(s => (
                  analysis[s.key] && (
                    <div key={s.key} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-800" style={{ background: s.color + "10" }}>
                        <span style={{ color: s.color }}>{s.icon}</span>
                        <p className="text-xs font-black uppercase tracking-wider" style={{ color: s.color }}>{s.label}</p>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{analysis[s.key]}</p>
                      </div>
                    </div>
                  )
                ))}

                {/* Disclaimer */}
                <div className="flex items-start gap-2 bg-gray-900 border border-gray-800 rounded-xl p-3">
                  <Info size={11} className="text-gray-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-600 text-xs leading-relaxed">{analysis.disclaimer || "This AI-generated report is for informational purposes only and does not constitute legal advice."}</p>
                </div>

                <button onClick={() => exportPDF(form, analysis)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-yellow-900/40 hover:bg-yellow-800/50 border border-yellow-700 text-yellow-300 font-black text-sm transition-all">
                  <Download size={14} /> Download Full FTO Report (PDF)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}