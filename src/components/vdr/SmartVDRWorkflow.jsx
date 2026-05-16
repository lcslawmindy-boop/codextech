import { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  FileText, Zap, CheckCircle2, Clock, AlertCircle, Loader2,
  RefreshCw, Download, ChevronDown, ChevronUp, ExternalLink, Copy, Check
} from "lucide-react";

// ── Document manifest ─────────────────────────────────────────────────────────
export const VDR_DOCUMENTS = [
  // IP & Patents
  {
    id: "ip_overview",
    category: "IP & Patents",
    color: "#a855f7",
    title: "IP Portfolio Overview",
    description: "Executive summary of all 6 patent clusters with independent claims, filing dates, and key defensible technology.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "ip_overview" },
    status: "pending",
  },
  {
    id: "patent_landscape",
    category: "IP & Patents",
    color: "#a855f7",
    title: "Patent Landscape Analysis",
    description: "Competitive patent mapping, prior art summary, freedom-to-operate assessment across 6 tech clusters.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "patent_landscape" },
    status: "pending",
  },
  {
    id: "fto_report",
    category: "IP & Patents",
    color: "#a855f7",
    title: "Freedom-to-Operate Report",
    description: "FTO analysis for top 3 invention clusters: MEG/ZPE energy, Prioré-type bioEM, Scalar EM communications.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "fto_report" },
    status: "pending",
  },

  // Revenue & Financials
  {
    id: "revenue_summary",
    category: "Revenue & Financials",
    color: "#22c55e",
    title: "Revenue Model Summary",
    description: "Multi-stream revenue breakdown: subscriptions, one-time, white-label, API credits. ARR projections.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "revenue_summary" },
    status: "pending",
  },
  {
    id: "stripe_report",
    category: "Revenue & Financials",
    color: "#22c55e",
    title: "Stripe Revenue Report",
    description: "Stripe product catalog, active subscriptions, payment history, and MRR metrics.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "stripe_report" },
    status: "pending",
  },
  {
    id: "financial_model",
    category: "Revenue & Financials",
    color: "#22c55e",
    title: "Financial Model & Projections",
    description: "12-month and 36-month revenue projections under conservative, base, and strategic acquirer scenarios.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "financial_model" },
    status: "pending",
  },

  // Platform & Technology
  {
    id: "codebase_summary",
    category: "Platform & Technology",
    color: "#06b6d4",
    title: "Codebase Architecture Summary",
    description: "Tech stack overview: React/Vite frontend, Deno backend, 70+ components, 50+ backend functions, AI integrations.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "codebase_summary" },
    status: "pending",
  },
  {
    id: "feature_inventory",
    category: "Platform & Technology",
    color: "#06b6d4",
    title: "Feature & Module Inventory",
    description: "Complete list of all 40+ platform modules with function, status, and strategic value per module.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "feature_inventory" },
    status: "pending",
  },
  {
    id: "api_docs",
    category: "Platform & Technology",
    color: "#06b6d4",
    title: "API & Backend Function Reference",
    description: "Documentation for all 50+ backend functions, endpoints, integrations (Stripe, AI, DocuSign, Google).",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "api_docs" },
    status: "pending",
  },

  // Market & Strategy
  {
    id: "market_analysis",
    category: "Market & Strategy",
    color: "#f97316",
    title: "Market Opportunity Analysis",
    description: "TAM/SAM/SOM analysis across 8 addressable sectors: defense, oncology, off-grid power, IoT, space, pharma.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "market_analysis" },
    status: "pending",
  },
  {
    id: "acquisition_thesis",
    category: "Market & Strategy",
    color: "#f97316",
    title: "Acquisition Thesis & Deal Structures",
    description: "Why a strategic buyer acquires this platform, deal structure options, and post-acquisition value creation.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "acquisition_thesis" },
    status: "pending",
  },

  // Legal & Compliance
  {
    id: "ip_ownership",
    category: "Legal & Compliance",
    color: "#eab308",
    title: "IP Ownership & Chain of Title",
    description: "Confirms sole ownership, no third-party claims, open-source license compliance, and trademark status.",
    autoGenerate: true,
    generateFn: "generateDueDiligencePackage",
    generateArgs: { section: "ip_ownership" },
    status: "pending",
  },
  {
    id: "legal_checklist",
    category: "Legal & Compliance",
    color: "#eab308",
    title: "Legal Readiness Checklist",
    description: "LLC formation, IP assignments, platform terms of service, privacy policy, NDA infrastructure status.",
    autoGenerate: false,
    status: "manual",
    manualNote: "Complete the Legal Checklist in the Exit Advisor page first.",
    manualLink: "/exit-advisor",
  },
];

const CATEGORIES = [...new Set(VDR_DOCUMENTS.map(d => d.category))];

function DocRow({ doc, docState, onGenerate, generating }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isGenerating = generating === doc.id;
  const state = docState[doc.id] || { status: doc.status };
  const isDone = state.status === "done";
  const isManual = doc.autoGenerate === false;

  const copyContent = () => {
    if (state.content) {
      navigator.clipboard.writeText(state.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      isDone ? "border-green-800/50 bg-green-950/5" :
      isManual ? "border-yellow-800/30 bg-yellow-950/5" :
      "border-gray-800 bg-gray-900/30"
    }`}>
      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-shrink-0">
          {isDone ? <CheckCircle2 size={16} className="text-green-400" /> :
           isManual ? <AlertCircle size={16} className="text-yellow-500" /> :
           <Clock size={16} className="text-gray-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">{doc.title}</p>
          <p className="text-gray-500 text-xs mt-0.5 truncate">{doc.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isManual ? (
            <span className="text-xs px-2 py-0.5 rounded-full border border-yellow-800/50 bg-yellow-950/30 text-yellow-400 font-bold">Manual</span>
          ) : isDone ? (
            <span className="text-xs px-2 py-0.5 rounded-full border border-green-800/50 bg-green-950/30 text-green-400 font-bold">Ready ✓</span>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onGenerate(doc); }}
              disabled={isGenerating}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: doc.color + "20", color: doc.color, border: `1px solid ${doc.color}40` }}>
              {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
              {isGenerating ? "Generating…" : "Auto-Generate"}
            </button>
          )}
          {expanded ? <ChevronUp size={12} className="text-gray-600" /> : <ChevronDown size={12} className="text-gray-600" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-800/60 space-y-3">
          <p className="text-gray-400 text-xs leading-relaxed">{doc.description}</p>
          {isManual && (
            <div className="flex items-center gap-2">
              <AlertCircle size={11} className="text-yellow-500 flex-shrink-0" />
              <p className="text-yellow-400 text-xs">{doc.manualNote}</p>
              {doc.manualLink && (
                <a href={doc.manualLink} className="text-blue-400 text-xs hover:text-blue-300 flex items-center gap-1 ml-auto">
                  <ExternalLink size={9} /> Go →
                </a>
              )}
            </div>
          )}
          {state.content && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Generated Content</p>
                <button onClick={copyContent}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-xs text-gray-400 font-bold transition-all">
                  {copied ? <Check size={9} className="text-green-400" /> : <Copy size={9} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap bg-gray-800/60 rounded-xl px-3 py-3 border border-gray-700 max-h-48 overflow-y-auto font-mono">
                {state.content}
              </pre>
            </div>
          )}
          {!isManual && !isDone && (
            <button
              onClick={() => onGenerate(doc)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all w-full justify-center"
              style={{ background: doc.color, color: "#000" }}>
              {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Zap size={13} />}
              {isGenerating ? "Generating…" : `Generate ${doc.title}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SmartVDRWorkflow({ onDocStateChange }) {
  const [docState, setDocState] = useState({});
  const [generating, setGenerating] = useState(null);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const doneCount = Object.values(docState).filter(d => d.status === "done").length;
  const manualCount = VDR_DOCUMENTS.filter(d => !d.autoGenerate).length;
  const autoCount = VDR_DOCUMENTS.filter(d => d.autoGenerate).length;
  const autoDone = Object.entries(docState).filter(([id, d]) => {
    const doc = VDR_DOCUMENTS.find(x => x.id === id);
    return doc?.autoGenerate && d.status === "done";
  }).length;

  const generateDoc = async (doc) => {
    if (!doc.autoGenerate) return;
    setGenerating(doc.id);
    try {
      const res = await base44.functions.invoke(doc.generateFn, doc.generateArgs);
      const content = res.data?.content || res.data?.result || JSON.stringify(res.data, null, 2);
      setDocState(prev => {
        const next = { ...prev, [doc.id]: { status: "done", content, generatedAt: new Date().toISOString() } };
        onDocStateChange?.(next);
        return next;
      });
    } catch (e) {
      setDocState(prev => {
        const next = { ...prev, [doc.id]: { status: "error", error: e.message } };
        onDocStateChange?.(next);
        return next;
      });
    }
    setGenerating(null);
  };

  const generateAll = async () => {
    setGeneratingAll(true);
    const autoDocs = VDR_DOCUMENTS.filter(d => d.autoGenerate && !docState[d.id]?.status?.includes("done"));
    for (const doc of autoDocs) {
      await generateDoc(doc);
    }
    setGeneratingAll(false);
  };

  const filtered = activeCategory === "All"
    ? VDR_DOCUMENTS
    : VDR_DOCUMENTS.filter(d => d.category === activeCategory);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white font-black text-sm">Auto-Population Progress</p>
            <p className="text-gray-500 text-xs mt-0.5">{autoDone}/{autoCount} auto-generated · {manualCount} require manual action</p>
          </div>
          <button
            onClick={generateAll}
            disabled={generatingAll || autoDone === autoCount}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-black disabled:opacity-50 transition-all">
            {generatingAll ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
            {generatingAll ? "Generating All…" : "Generate All Docs"}
          </button>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${autoCount > 0 ? (autoDone / autoCount) * 100 : 0}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-600 text-xs">{Math.round(autoCount > 0 ? (autoDone / autoCount) * 100 : 0)}% complete</p>
          {autoDone === autoCount && <p className="text-green-400 text-xs font-bold">✓ All auto-docs ready</p>}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 flex-wrap">
        {["All", ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all border ${
              activeCategory === cat
                ? "bg-gray-700 border-gray-500 text-white"
                : "border-gray-800 text-gray-600 hover:text-gray-400"
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {filtered.map(doc => (
          <DocRow
            key={doc.id}
            doc={doc}
            docState={docState}
            onGenerate={generateDoc}
            generating={generating}
          />
        ))}
      </div>

      <p className="text-gray-700 text-xs text-center">Generated content is for due diligence review only — not legal advice.</p>
    </div>
  );
}