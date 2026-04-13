import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Lightbulb, FileText, Sparkles, Loader2,
  ChevronDown, ChevronUp, Copy, CheckCircle2, Download, RefreshCw
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { jsPDF } from "jspdf";

// ── DOMAIN CONFIG ─────────────────────────────────────────────────────────────
const DOMAINS = [
  "Vacuum Energy / MEG Technology",
  "Scalar Electromagnetics",
  "Bioelectromagnetic Medicine",
  "LENR / Cold Fusion",
  "Directed Energy & Sensing",
  "Longevity / Telomere Biology",
  "Phase Conjugation & Time-Reversal",
  "Atmospheric EM & Weather",
];

const SBIR_AGENCIES = [
  { id: "dod", label: "DoD — Electronic Warfare" },
  { id: "darpa", label: "DARPA — Disruptive Technologies" },
  { id: "doe", label: "DoE — ARPA-E / LENR" },
  { id: "nih", label: "NIH — Bioelectromagnetics" },
  { id: "nasa", label: "NASA — Advanced Propulsion" },
  { id: "nsf", label: "NSF — Fundamental Physics" },
];

const TABS = [
  { id: "literature", label: "Literature Review", icon: BookOpen },
  { id: "ip", label: "IP Opportunities", icon: Lightbulb },
  { id: "grant", label: "Grant Proposal Drafter", icon: FileText },
];

// ── COPY BUTTON ───────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-medium transition-all">
      {copied ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ── RESULT CARD ───────────────────────────────────────────────────────────────
function ResultCard({ title, content, accent = "blue", actions }) {
  const [open, setOpen] = useState(true);
  const colors = {
    blue: "border-blue-800/60 bg-blue-950/20",
    gold: "border-yellow-700/60 bg-yellow-950/20",
    green: "border-green-800/60 bg-green-950/20",
  };
  return (
    <div className={`border rounded-2xl overflow-hidden ${colors[accent]}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left">
        <p className="text-white font-bold text-sm">{title}</p>
        <div className="flex items-center gap-3">
          {actions}
          {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>
      {open && (
        <div className="px-5 pb-5">
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

// ── LITERATURE REVIEW TAB ─────────────────────────────────────────────────────
function LiteratureTab() {
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [depth, setDepth] = useState("standard");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true); setResult(null);
    const topic = customTopic.trim() || domain;
    const prompt = `You are an expert research analyst for Zenith Apex Research Portfolio — an advanced electromagnetic physics and bioelectromagnetic medicine IP platform. 

Conduct a comprehensive literature review on: "${topic}"

Output the following sections clearly labeled:

## 1. FIELD OVERVIEW (200 words)
Current state of the field, key institutions, funding levels, major research groups.

## 2. KEY PEER-REVIEWED FINDINGS (5–8 papers)
For each: Author(s), Year, Journal, Core finding, Relevance to scalar EM / bioelectromagnetics / vacuum energy. Include DOI if known.

## 3. EMERGING TRENDS (4–6 trends)
Most recent developments (2022–2026). For each: trend name, description, why it matters for IP development.

## 4. RESEARCH GAPS & WHITE SPACES
Specific areas where peer-reviewed literature is thin or absent — these represent IP opportunity zones.

## 5. GOVERNMENT & INSTITUTIONAL INTEREST
SBIR awards, DoD/NIH/NSF programs, university research initiatives related to this domain.

## 6. CONVERGENCE OPPORTUNITIES
Adjacent fields or technologies that, when combined with this domain, could yield novel IP. Be specific.

## 7. RECOMMENDED NEXT STEPS FOR IP DEVELOPMENT
3–5 concrete actions the platform should take based on this literature review.

Depth setting: ${depth === "deep" ? "Deep dive — be exhaustive and technical" : "Standard — balanced depth and accessibility"}.
Use professional, investment-grade language. Do not use vague generalities — cite specific researchers, institutions, and findings.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_1_pro",
    });
    setResult({ topic, text: res });
    setLoading(false);
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 18; const W = 210; const cW = W - margin * 2;
    doc.setFillColor(15, 35, 70); doc.rect(0, 0, W, 297, "F");
    doc.setFontSize(16); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("ZENITH APEX — LITERATURE REVIEW", W / 2, 20, { align: "center" });
    doc.setFontSize(12); doc.setTextColor(180, 200, 230);
    doc.text(result.topic, W / 2, 30, { align: "center" });
    let y = 45;
    const lines = doc.splitTextToSize(result.text, cW);
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(220, 225, 235);
    lines.forEach(l => {
      if (y > 280) { doc.addPage(); doc.setFillColor(15, 35, 70); doc.rect(0, 0, W, 297, "F"); y = 20; }
      if (l.startsWith("## ")) {
        doc.setFont("helvetica", "bold"); doc.setTextColor(180, 200, 255);
      } else {
        doc.setFont("helvetica", "normal"); doc.setTextColor(220, 225, 235);
      }
      doc.text(l.replace(/^## /, ""), margin, y); y += 6;
    });
    doc.save(`literature-review-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">Configure Literature Review</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Research Domain</label>
            <select value={domain} onChange={e => setDomain(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-600">
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Custom Topic (overrides domain)</label>
            <input value={customTopic} onChange={e => setCustomTopic(e.target.value)}
              placeholder="e.g. Kaznacheyev UV biophoton cytopathogenic effect..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600" />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Depth:</span>
          {["standard", "deep"].map(d => (
            <button key={d} onClick={() => setDepth(d)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${depth === d ? "bg-blue-900/50 border-blue-600 text-blue-300" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
              {d === "deep" ? "Deep Dive (Claude Sonnet)" : "Standard"}
            </button>
          ))}
        </div>
        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm transition-all">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <BookOpen size={15} />}
          {loading ? "Scanning Literature (live web)…" : "Run Literature Review"}
        </button>
        {depth === "deep" && <p className="text-yellow-500 text-xs mt-2">⚠ Deep mode uses Claude Sonnet — uses more AI credits</p>}
      </div>

      {result && (
        <ResultCard
          title={`Literature Review: ${result.topic}`}
          content={result.text}
          accent="blue"
          actions={
            <div className="flex gap-2">
              <CopyBtn text={result.text} />
              <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/40 border border-blue-700 text-blue-300 text-xs font-medium">
                <Download size={11} /> PDF
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}

// ── IP OPPORTUNITIES TAB ──────────────────────────────────────────────────────
function IPOpportunitiesTab() {
  const [domains, setDomains] = useState([DOMAINS[0], DOMAINS[2]]);
  const [focus, setFocus] = useState("gaps");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleDomain = (d) => setDomains(prev =>
    prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].slice(0, 4)
  );

  const run = async () => {
    setLoading(true); setResult(null);
    const prompt = `You are an IP strategist and technology scout for Zenith Apex Research Portfolio — an AI-powered IP generation platform specializing in advanced electromagnetics, bioelectromagnetic medicine, vacuum energy, and scalar EM technology.

Selected domains for analysis: ${domains.join(", ")}
Analysis focus: ${focus === "gaps" ? "Research gaps and unpatented white spaces" : focus === "convergence" ? "Cross-domain convergence opportunities" : "Emerging technology trends with IP potential"}

Perform a comprehensive IP opportunity analysis and output:

## 1. TOP IP OPPORTUNITY CARDS (identify 5–7 specific, novel invention concepts)
For each concept:
- INVENTION NAME: (concise, descriptive)
- CONCEPT: (2–3 sentences describing the novel idea)
- TECHNICAL BASIS: (which peer-reviewed/documented research supports feasibility)
- PATENT WHITE SPACE: (why this is unprotected / differentiated from prior art)
- MARKET VERTICAL: (specific industry and estimated TAM)
- IP FILING PRIORITY: (Critical / High / Medium)
- SUGGESTED CLAIM STRATEGY: (independent claim focus area)

## 2. CONVERGENCE MAP
Specific technology intersections across the selected domains that create novel IP clusters. For each intersection: name it, describe the combined capability, and identify which existing Zenith Apex devices it enhances.

## 3. COMPETITIVE BLIND SPOTS
Areas where large patent filers (Raytheon, Lockheed, NIH, universities) are NOT active — representing the most defensible IP territory.

## 4. PRIORITY FILING ROADMAP (90-day plan)
Which provisional patent applications should be filed first, in what order, and why. Include suggested claim priorities.

## 5. LICENSING OPPORTUNITY MATRIX
Which of the identified inventions are best suited for: (a) outright patent sale, (b) exclusive licensing, (c) non-exclusive SaaS licensing, (d) government SBIR commercialization.

Be specific, technical, and actionable. Reference real institutions, existing patents, and documented research from the Bearden / ONR / Boeing Phantom Works / Anastasovski et al. corpus where relevant.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      model: "gemini_3_1_pro",
    });
    setResult({ domains, text: res });
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-4">IP Opportunity Scanner</h3>

        <div className="mb-4">
          <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Select Domains to Analyze (max 4)</label>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => toggleDomain(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${domains.includes(d) ? "bg-yellow-900/40 border-yellow-600 text-yellow-300" : "border-gray-700 text-gray-500 hover:border-gray-600"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-wider self-center">Focus:</span>
          {[
            { id: "gaps", label: "Research Gaps" },
            { id: "convergence", label: "Convergence Opportunities" },
            { id: "trends", label: "Emerging Trends" },
          ].map(f => (
            <button key={f.id} onClick={() => setFocus(f.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-all ${focus === f.id ? "bg-yellow-900/40 border-yellow-600 text-yellow-300" : "border-gray-700 text-gray-500"}`}>
              {f.label}
            </button>
          ))}
        </div>

        <button onClick={run} disabled={loading || domains.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-yellow-800 hover:bg-yellow-700 disabled:opacity-60 text-white font-bold text-sm transition-all">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Lightbulb size={15} />}
          {loading ? "Scanning for IP Opportunities…" : "Identify IP Opportunities"}
        </button>
      </div>

      {result && (
        <ResultCard
          title={`IP Opportunities: ${result.domains.slice(0, 2).join(" × ")}${result.domains.length > 2 ? ` +${result.domains.length - 2} more` : ""}`}
          content={result.text}
          accent="gold"
          actions={<CopyBtn text={result.text} />}
        />
      )}
    </div>
  );
}

// ── GRANT PROPOSAL TAB ────────────────────────────────────────────────────────
function GrantProposalTab() {
  const [device, setDevice] = useState("Scalar Pulse Radar Detection System");
  const [agency, setAgency] = useState(SBIR_AGENCIES[0]);
  const [phase, setPhase] = useState("Phase I");
  const [askAmount, setAskAmount] = useState("$150,000");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const DEVICES = [
    "Scalar Pulse Radar Detection System",
    "Telomere Regeneration Device (TRD-1)",
    "Time-Reversal Zone Cold Fusion Reactor (TRZ-1)",
    "Scalar Wave Communicator (G-Com Mk I)",
    "Quantum Potential EMI Detector (Fireflies Sensor)",
    "EM Trigger Window Therapy Device",
    "Scalar Energy Bottle Interferometer",
    "Phi-River Gradient Sensor",
    "Portable Prioré-Class EM Treatment Platform",
    "Motionless Electromagnetic Generator (MEG)",
  ];

  const run = async () => {
    setLoading(true); setResult(null);
    const prompt = `You are a senior SBIR/STTR grant writer with 20+ years of experience winning DoD, DARPA, DoE, NIH, and NSF awards. You specialize in advanced electromagnetic and bioelectromagnetic technology proposals.

Draft a complete, professionally formatted ${phase} SBIR proposal for:

DEVICE/TECHNOLOGY: ${device}
FUNDING AGENCY: ${agency.label}
PHASE: ${phase}
REQUESTED AMOUNT: ${askAmount}

AVAILABLE VALIDATION DATA (cite these in the proposal):
- DoD SBIR Phase I ($150K, 2021) + Phase II ($480K, 2024) previously awarded for Scalar Pulse Radar — establishes DoD credibility
- Anastasovski et al. (Boeing Phantom Works, Trinity College Dublin, Alfvén Lab Stockholm) — peer-reviewed MEG validation, Foundations of Physics Letters, 2001
- ONR London Branch Report R-5-78 (1978, UNCLASSIFIED) — US government validation of EM therapeutic device results
- US Patent 6,362,718 — Bearden et al. MEG device
- China Lake Naval Weapons Center — 73 sigma above background cold fusion anomaly data
- Bohren, Am. J. Phys. 51(4), 1983 — COP>1 thermodynamic proof

Generate the complete proposal with these mandatory sections:

## COVER PAGE
Program: [Agency] SBIR ${phase}  |  Topic: [relevant agency topic]  |  Title: [compelling 12-word max title]  |  PI: [YOUR NAME]  |  Organization: Zenith Apex Research Portfolio  |  Requested: ${askAmount}  |  Period: 12 months (Phase I) or 24 months (Phase II)

## SECTION 1: EXECUTIVE SUMMARY (250 words max)
High-impact opening that immediately justifies DoD/agency relevance. Lead with the problem, state the solution, cite the validation data.

## SECTION 2: IDENTIFICATION AND SIGNIFICANCE OF THE PROBLEM/OPPORTUNITY
- The unmet need this technology addresses
- Why current approaches fail
- Market/operational impact of solving it
- Quantified problem scope

## SECTION 3: PHASE ${phase === "Phase I" ? "I" : "II"} TECHNICAL OBJECTIVES
Specific, measurable, achievable technical milestones. Format as numbered objectives with success criteria (Go/No-Go decision points).

## SECTION 4: TECHNICAL APPROACH (most important section — 600+ words)
- Detailed description of the scientific/engineering approach
- Why this approach will work (cite peer-reviewed validation)
- Innovation over current state-of-the-art
- Key risks and mitigation strategies
- Technical readiness level (TRL) assessment

## SECTION 5: WORK PLAN & SCHEDULE
Month-by-month (Phase I) or quarter-by-quarter (Phase II) task breakdown. Include: task description, responsible personnel, deliverable, success metric.

## SECTION 6: RELATED WORK & PRIOR ART
What has been published, what patents exist, how this invention differentiates and avoids conflict.

## SECTION 7: KEY PERSONNEL & FACILITIES
PI qualifications, supporting team, lab equipment, computational resources.

## SECTION 8: COMMERCIALIZATION POTENTIAL
Market size, target customers, business model, path to Phase III (non-SBIR funding). Include specific dollar figures.

## SECTION 9: BUDGET JUSTIFICATION
Line-item breakdown of ${askAmount}: personnel (%, hours, rate), equipment, materials, travel, indirect costs.

## SECTION 10: REFERENCES
Format all citations properly (APA style). Include full citations for all validation documents referenced.

Write in the authoritative, precise voice of a winning SBIR proposal. Avoid passive voice. Every claim must be supported by evidence or logical technical argument. This proposal must score 95+/100 from a DoD SBIR technical reviewer.`;

    const res = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: "claude_sonnet_4_6",
    });
    setResult({ device, agency: agency.label, phase, text: res });
    setLoading(false);
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 18; const W = 210; const cW = W - margin * 2;
    doc.setFillColor(15, 35, 70); doc.rect(0, 0, W, 297, "F");
    let y = 20;
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("SBIR GRANT PROPOSAL DRAFT", W / 2, y, { align: "center" }); y += 9;
    doc.setFontSize(10); doc.setTextColor(180, 200, 230);
    doc.text(`${result.device}  |  ${result.agency}  |  ${result.phase}`, W / 2, y, { align: "center" }); y += 8;
    doc.setFontSize(7); doc.setTextColor(100, 120, 160);
    doc.text("DRAFT FOR REVIEW — ZENITH APEX RESEARCH PORTFOLIO — CONFIDENTIAL", W / 2, y, { align: "center" }); y += 10;
    const lines = doc.splitTextToSize(result.text, cW);
    lines.forEach(l => {
      if (y > 280) { doc.addPage(); doc.setFillColor(15, 35, 70); doc.rect(0, 0, W, 297, "F"); y = 20; }
      if (l.startsWith("## ")) {
        y += 4;
        doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(180, 200, 255);
        doc.text(l.replace(/^## /, ""), margin, y); y += 7;
      } else {
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(215, 220, 235);
        doc.text(l, margin, y); y += 5.5;
      }
    });
    doc.save(`sbir-proposal-${result.device.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 30)}-${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-5">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-bold text-sm mb-1">SBIR/STTR Grant Proposal Drafter</h3>
        <p className="text-gray-500 text-xs mb-5">Leverages existing platform validation data (ONR, Boeing Phantom Works, DoD SBIR precedent). Uses Claude Sonnet for maximum quality.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Technology / Device</label>
            <select value={device} onChange={e => setDevice(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-600">
              {DEVICES.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Funding Agency</label>
            <select value={agency.id} onChange={e => setAgency(SBIR_AGENCIES.find(a => a.id === e.target.value))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-green-600">
              {SBIR_AGENCIES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Phase</label>
            <div className="flex gap-2">
              {["Phase I", "Phase II"].map(p => (
                <button key={p} onClick={() => setPhase(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${phase === p ? "bg-green-900/40 border-green-600 text-green-300" : "border-gray-700 text-gray-500"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1.5">Requested Amount</label>
            <input value={askAmount} onChange={e => setAskAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-green-600" />
          </div>
        </div>

        <div className="bg-green-950/20 border border-green-900/40 rounded-xl p-3 mb-4">
          <p className="text-green-400 text-xs font-bold mb-1">✅ Auto-injected Validation Data</p>
          <p className="text-gray-500 text-xs leading-relaxed">
            ONR R-5-78 · Anastasovski et al. (Boeing Phantom Works) · DoD SBIR $630K precedent · US Patent 6,362,718 · China Lake 73-sigma data · Bohren COP&gt;1 proof
          </p>
        </div>

        <button onClick={run} disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-800 hover:bg-green-700 disabled:opacity-60 text-white font-bold text-sm transition-all">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <FileText size={15} />}
          {loading ? "Drafting Full Proposal (Claude Sonnet)…" : "Draft Grant Proposal"}
        </button>
        <p className="text-yellow-500 text-xs mt-2">⚠ Uses Claude Sonnet — higher quality, uses more AI credits</p>
      </div>

      {result && (
        <ResultCard
          title={`${result.phase} Proposal: ${result.device}`}
          content={result.text}
          accent="green"
          actions={
            <div className="flex gap-2">
              <CopyBtn text={result.text} />
              <button onClick={exportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 text-xs font-medium">
                <Download size={11} /> PDF
              </button>
            </div>
          }
        />
      )}
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AIResearchAssistant() {
  const [tab, setTab] = useState("literature");

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
              <Sparkles size={15} className="text-yellow-400" /> AI Research Assistant
            </h1>
            <p className="text-gray-500 text-xs">Live literature review · IP gap analysis · SBIR grant drafting</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-900/40 border border-green-800 text-green-400 font-bold">Live Web Search</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-purple-900/40 border border-purple-800 text-purple-400 font-bold">Claude Sonnet</span>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-gray-800 bg-gray-900/50 px-5">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold border-b-2 transition-all ${
              tab === t.id ? "border-yellow-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
            }`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 max-w-5xl mx-auto w-full">
        {tab === "literature" && <LiteratureTab />}
        {tab === "ip" && <IPOpportunitiesTab />}
        {tab === "grant" && <GrantProposalTab />}
      </div>
    </div>
  );
}