import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Brain, Loader2, Download, Copy, CheckCircle2,
  FileText, Search, Map, Lightbulb, ChevronRight
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

const TABS = [
  { id: "summarize", label: "Claim Summarizer", icon: <FileText size={14} />, desc: "Parse & rate patent claims" },
  { id: "novelty", label: "Novel Concepts & Conflicts", icon: <Search size={14} />, desc: "Novelty gap + FTO analysis" },
  { id: "landscape", label: "Competitive Landscape", icon: <Map size={14} />, desc: "White-space & IP holder map" },
  { id: "strategy", label: "Provisional Drafting Strategy", icon: <Lightbulb size={14} />, desc: "Claims, abstract & roadmap" },
];

const TECH_CATEGORIES = [
  "Vacuum Energy / Zero-Point Energy",
  "Scalar Electromagnetics",
  "Bioelectromagnetics / Medical EM",
  "Phase Conjugation",
  "Resonance Devices",
  "Atmospheric EM",
  "Advanced Propulsion",
  "Quantum Sensing",
  "Energy Storage / Supercapacitors",
  "Directed Energy",
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold transition-all"
    >
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function exportToPDF(title, content) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210; const margin = 18; const contentW = W - margin * 2;
  doc.setFillColor(10, 14, 26);
  doc.rect(0, 0, W, 297, "F");
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, W, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("ZENITH APEX — AI PATENT INTELLIGENCE", margin, 18);
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text(title, margin, 27);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 34);
  let y = 44;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  const lines = doc.splitTextToSize(content, contentW);
  lines.forEach(line => {
    if (y > 280) { doc.addPage(); doc.setFillColor(10, 14, 26); doc.rect(0, 0, W, 297, "F"); y = 20; }
    doc.text(line, margin, y);
    y += 6;
  });
  doc.save(`ZenithApex_PatentIntelligence_${title.replace(/\s+/g, "_").slice(0, 30)}.pdf`);
}

// ── TAB: CLAIM SUMMARIZER ─────────────────────────────────────────────────────
function ClaimSummarizer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a USPTO patent attorney and IP strategist. Analyze the following patent text or claims.

Return a structured analysis with:
1. CLAIM SUMMARY — plain-language summary of each claim found (numbered)
2. CLAIM STRENGTH RATINGS — rate each claim: Broad/Moderate/Narrow + one-sentence reason
3. KEY INNOVATIONS — the 3-5 core novel elements
4. VULNERABILITIES — potential § 102/103 attack vectors or weaknesses
5. BROADENING OPPORTUNITIES — how independent claims could be made stronger or broader

Be concise, specific, and use USPTO terminology. Format with clear section headers.

PATENT TEXT:
${text}`,
      model: "claude_sonnet_4_6",
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Paste Patent Claims or Full Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={10}
          placeholder="Paste patent claims, abstract, or full patent text here…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none"
        />
      </div>
      <button onClick={analyze} disabled={loading || !text.trim()}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all disabled:opacity-50">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Brain size={15} />}
        {loading ? "Analyzing Claims…" : "Analyze Claims"}
      </button>
      {result && (
        <div className="bg-gray-900 border border-indigo-900/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-indigo-400 font-black text-sm uppercase tracking-wider">Claim Analysis</h3>
            <div className="flex gap-2">
              <CopyBtn text={result} />
              <button onClick={() => exportToPDF("Claim Summarizer", result)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold">
                <Download size={11} /> PDF
              </button>
            </div>
          </div>
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}

// ── TAB: NOVELTY & CONFLICTS ──────────────────────────────────────────────────
function NoveltyAnalysis() {
  const [invention, setInvention] = useState("");
  const [priorArt, setPriorArt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!invention.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a USPTO patent examiner and IP litigator. Perform a novelty and freedom-to-operate analysis.

MY INVENTION:
${invention}

${priorArt ? `PRIOR ART / COMPETING PATENTS TO COMPARE:\n${priorArt}` : "Use your knowledge of relevant patent landscape in this technical field."}

Provide:
1. NOVELTY ASSESSMENT — what specific elements are likely novel vs. known
2. INVENTIVE STEP (§ 103) — is there an obvious combination of prior art that could invalidate this?
3. FREEDOM TO OPERATE — specific patents or claims that could conflict, and why
4. CLAIM DIFFERENTIATION — how to draft claims to clearly distinguish from prior art
5. RECOMMENDED SEARCH STRATEGY — USPTO classification codes, search terms, and databases to check

Be specific. Reference real patent classification codes where possible. Format with clear headers.`,
      model: "claude_sonnet_4_6",
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Your Invention Description *</label>
        <textarea value={invention} onChange={e => setInvention(e.target.value)} rows={6}
          placeholder="Describe your invention: what it does, how it works, key components, claimed innovations…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none" />
      </div>
      <div>
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Prior Art / Competing Patents (optional)</label>
        <textarea value={priorArt} onChange={e => setPriorArt(e.target.value)} rows={5}
          placeholder="Paste patent numbers, titles, or claim text you want to compare against…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none" />
      </div>
      <button onClick={analyze} disabled={loading || !invention.trim()}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all disabled:opacity-50">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
        {loading ? "Analyzing Novelty…" : "Run Novelty & FTO Analysis"}
      </button>
      {result && (
        <div className="bg-gray-900 border border-indigo-900/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-indigo-400 font-black text-sm uppercase tracking-wider">Novelty & FTO Report</h3>
            <div className="flex gap-2">
              <CopyBtn text={result} />
              <button onClick={() => exportToPDF("Novelty & FTO Analysis", result)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold">
                <Download size={11} /> PDF
              </button>
            </div>
          </div>
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}

// ── TAB: COMPETITIVE LANDSCAPE ────────────────────────────────────────────────
function CompetitiveLandscape() {
  const [category, setCategory] = useState(TECH_CATEGORIES[0]);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    const topic = custom.trim() || category;
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a technology intelligence analyst and patent landscape expert. Generate a comprehensive competitive IP landscape report for the following technology domain:

DOMAIN: ${topic}

Provide:
1. DOMINANT IP HOLDERS — top 5-10 patent holders with their patent counts and strategic focus
2. WHITE SPACE MAP — specific sub-domains with low patent density (opportunity areas)
3. KEY PATENT CLUSTERS — the 3-5 main clusters of activity with representative patent numbers or inventors
4. OFFENSIVE OPPORTUNITIES — areas where new filings could establish strong blocking positions
5. DEFENSIVE CONSIDERATIONS — high-risk zones to avoid or design around
6. EMERGING TRENDS — technology directions gaining filing momentum in the last 3-5 years
7. 5-YEAR FORECAST — predicted IP landscape shifts and strategic implications

Use real data from USPTO, EPO, and WIPO where possible. Format with clear headers and be specific.`,
      add_context_from_internet: true,
      model: "gemini_3_1_pro",
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Technology Category</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          {TECH_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => { setCategory(cat); setCustom(""); }}
              className={`text-left px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                category === cat && !custom ? "border-indigo-600 bg-indigo-950/40 text-white" : "border-gray-700 bg-gray-900/60 text-gray-400 hover:border-gray-600"
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <input value={custom} onChange={e => setCustom(e.target.value)}
          placeholder="Or type a custom technology domain…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600" />
      </div>
      <button onClick={analyze} disabled={loading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all disabled:opacity-50">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Map size={15} />}
        {loading ? "Generating Landscape Report…" : "Generate Competitive Landscape"}
      </button>
      {loading && <p className="text-gray-600 text-xs">Using live internet data — this may take 20–30 seconds…</p>}
      {result && (
        <div className="bg-gray-900 border border-indigo-900/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-indigo-400 font-black text-sm uppercase tracking-wider">Landscape Report</h3>
            <div className="flex gap-2">
              <CopyBtn text={result} />
              <button onClick={() => exportToPDF("Competitive Landscape", result)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold">
                <Download size={11} /> PDF
              </button>
            </div>
          </div>
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}

// ── TAB: PROVISIONAL DRAFTING STRATEGY ───────────────────────────────────────
function ProvDraftingStrategy() {
  const [invention, setInvention] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    if (!invention.trim()) return;
    setLoading(true);
    setResult(null);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a USPTO patent attorney specializing in provisional patent applications under 35 U.S.C. § 111(b). Generate a complete provisional patent drafting strategy.

INVENTION DESCRIPTION:
${invention}

${reference ? `REFERENCE SUCCESSFUL FILING / COMPARABLE PATENT:\n${reference}` : ""}

Generate:
1. DRAFTED ABSTRACT — complete, USPTO-compliant abstract (~150 words)
2. INDEPENDENT CLAIMS (3) — broad independent claims written in USPTO format (A method/system/apparatus claim set)
3. DEPENDENT CLAIMS (5-8) — specific dependent claims narrowing the independent claims
4. BRIEF DESCRIPTION OF DRAWINGS — suggested figures and what each would show
5. DETAILED DESCRIPTION OUTLINE — section-by-section outline of what the full specification should cover
6. PROSECUTION ROADMAP — anticipated §102/§103 rejections and how to respond; claim amendment strategy
7. FILING STRATEGY — recommended jurisdictions, PCT timing, continuation strategy

Format claims in proper USPTO claim format. Be specific and technically accurate.`,
      model: "claude_sonnet_4_6",
    });
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Your Invention *</label>
        <textarea value={invention} onChange={e => setInvention(e.target.value)} rows={7}
          placeholder="Describe your invention in detail: technical field, problem solved, how it works, key components, what makes it novel…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none" />
      </div>
      <div>
        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Reference Filing / Comparable Patent (optional)</label>
        <textarea value={reference} onChange={e => setReference(e.target.value)} rows={4}
          placeholder="Paste a successful patent number, title, or claims you want to model the drafting strategy after…"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none" />
      </div>
      <button onClick={generate} disabled={loading || !invention.trim()}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all disabled:opacity-50">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Lightbulb size={15} />}
        {loading ? "Drafting Strategy…" : "Generate Drafting Strategy"}
      </button>
      {result && (
        <div className="bg-gray-900 border border-indigo-900/40 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-indigo-400 font-black text-sm uppercase tracking-wider">Provisional Drafting Strategy</h3>
            <div className="flex gap-2">
              <CopyBtn text={result} />
              <button onClick={() => exportToPDF("Provisional Drafting Strategy", result)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold">
                <Download size={11} /> PDF
              </button>
            </div>
          </div>
          <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function PatentIntelligence() {
  const [activeTab, setActiveTab] = useState("summarize");

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Brain size={15} className="text-indigo-400" /> AI Patent Intelligence
            </h1>
            <p className="text-gray-500 text-xs">Claim analysis · Novelty gaps · Competitive landscape · Drafting strategy</p>
          </div>
        </div>
        <Link to="/patent-tool"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
          Patent Drafter <ChevronRight size={12} />
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/50 px-5 overflow-x-auto">
        <div className="flex gap-1 py-2 min-w-max">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-indigo-900/60 border border-indigo-700 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}>
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab !== tab.id && <span className="text-gray-600 hidden md:inline">— {tab.desc}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {activeTab === "summarize" && <ClaimSummarizer />}
          {activeTab === "novelty" && <NoveltyAnalysis />}
          {activeTab === "landscape" && <CompetitiveLandscape />}
          {activeTab === "strategy" && <ProvDraftingStrategy />}
        </div>
      </div>
    </div>
  );
}