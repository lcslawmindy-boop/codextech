import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Database, Zap, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Plus, Loader2, BookOpen, Target } from "lucide-react";
import { PRIOR_ART_ARCHIVE, CATEGORIES, OUTCOMES, OUTCOME_COLORS } from "../lib/priorArtData";
import { base44 } from "@/api/base44Client";

// ── Cross-Reference Tool ───────────────────────────────────────────────
function CrossRefTool({ archive }) {
  const [title, setTitle] = useState("");
  const [claims, setClaims] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!title || !claims) return;
    setLoading(true);
    setResult(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a patent attorney specializing in prior art analysis for scalar EM, vacuum energy, and bioelectromagnetic inventions.

INVENTION TO ANALYZE:
Title: ${title}
Claims/Description: ${claims}

PRIOR ART ARCHIVE (${archive.length} entries):
${archive.map(e => `[${e.id}] "${e.title}" (${e.inventor}, ${e.year}) — ${e.category} — Outcome: ${e.outcome}
Key claims: ${(e.key_claims || []).join("; ")}
Rejection grounds: ${e.rejection_grounds || "N/A"}`).join("\n\n")}

Analyze this invention against the prior art archive and return:
1. Top 3-5 most relevant prior art entries (by id) with explanation of overlap
2. Key differentiation strategies to avoid 102/103 rejections
3. Unique aspects of this invention NOT found in any prior art
4. Overall patent rejection risk score (0–100, higher = more risk)
5. Specific recommended claim language changes to minimize rejection
6. Which jurisdiction (USPTO/EPO/JPO) is most favorable and why`,
      model: "claude_sonnet_4_6",
      response_json_schema: {
        type: "object",
        properties: {
          relevant_prior_art: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                overlap_explanation: { type: "string" },
                rejection_type: { type: "string" },
                severity: { type: "string" },
              },
            },
          },
          differentiation_strategies: { type: "array", items: { type: "string" } },
          unique_aspects: { type: "array", items: { type: "string" } },
          rejection_risk_score: { type: "number" },
          claim_language_recommendations: { type: "array", items: { type: "string" } },
          recommended_jurisdiction: { type: "string" },
          jurisdiction_reasoning: { type: "string" },
          overall_assessment: { type: "string" },
        },
      },
    });

    setResult(res);
    setLoading(false);
  };

  const riskColor = result ? (result.rejection_risk_score >= 70 ? "text-red-400" : result.rejection_risk_score >= 40 ? "text-yellow-400" : "text-green-400") : "";

  return (
    <div className="space-y-4">
      <div className="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4 text-xs text-blue-300 leading-relaxed">
        <strong>How it works:</strong> Enter your invention title and key claims. The AI will cross-reference all {archive.length} prior art entries and identify overlaps, rejection risks, and how to differentiate your claims.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-gray-400 text-xs block mb-1">Your Invention Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Toroidal Vacuum Potential Oscillation Circuit"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex items-end">
          <button onClick={handleAnalyze} disabled={loading || !title || !claims}
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-sm text-white bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full justify-center">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Target size={14} />}
            {loading ? "Analyzing…" : "Run Prior Art Cross-Reference"}
          </button>
        </div>
      </div>

      <div>
        <label className="text-gray-400 text-xs block mb-1">Key Claims & Technical Description</label>
        <textarea value={claims} onChange={e => setClaims(e.target.value)}
          rows={4} placeholder="Describe your key claims, components, and technical approach. Be specific about what makes your invention novel..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none" />
      </div>

      {result && (
        <div className="space-y-4 mt-2">
          {/* Risk score banner */}
          <div className={`flex items-center justify-between p-4 rounded-xl border ${result.rejection_risk_score >= 70 ? "bg-red-950/30 border-red-800" : result.rejection_risk_score >= 40 ? "bg-yellow-950/30 border-yellow-800" : "bg-green-950/30 border-green-800"}`}>
            <div>
              <p className="text-white font-bold text-sm">Patent Rejection Risk Score</p>
              <p className="text-gray-400 text-xs mt-0.5">{result.overall_assessment}</p>
            </div>
            <div className={`text-5xl font-black ${riskColor}`}>{Math.round(result.rejection_risk_score)}</div>
          </div>

          {/* Relevant prior art */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-white font-bold text-xs uppercase tracking-wider mb-3">Relevant Prior Art Found</p>
            <div className="space-y-3">
              {(result.relevant_prior_art || []).map((item, i) => {
                const entry = archive.find(e => e.id === item.id);
                return (
                  <div key={i} className={`rounded-lg p-3 border text-xs ${item.severity === "high" ? "bg-red-950/20 border-red-900/40" : item.severity === "medium" ? "bg-yellow-950/20 border-yellow-900/40" : "bg-gray-800 border-gray-700"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{entry?.title || item.id}</span>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-xs ${item.severity === "high" ? "bg-red-900 text-red-200" : item.severity === "medium" ? "bg-yellow-900 text-yellow-200" : "bg-gray-700 text-gray-300"}`}>
                        {item.rejection_type}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{item.overlap_explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Two-column: unique aspects + differentiation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-green-400 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5"><CheckCircle2 size={12} />Unique Aspects (Novel)</p>
              <ul className="space-y-2">
                {(result.unique_aspects || []).map((a, i) => (
                  <li key={i} className="flex gap-2 text-gray-300 text-xs leading-relaxed">
                    <span className="text-green-500 flex-shrink-0">•</span>{a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5"><Zap size={12} />Differentiation Strategies</p>
              <ul className="space-y-2">
                {(result.differentiation_strategies || []).map((s, i) => (
                  <li key={i} className="flex gap-2 text-gray-300 text-xs leading-relaxed">
                    <span className="text-blue-400 flex-shrink-0">{i + 1}.</span>{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Claim language */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-3">Recommended Claim Language Changes</p>
            <ul className="space-y-2">
              {(result.claim_language_recommendations || []).map((r, i) => (
                <li key={i} className="flex gap-2 text-gray-300 text-xs leading-relaxed bg-gray-800/50 rounded-lg p-2">
                  <span className="text-yellow-500 flex-shrink-0">→</span>{r}
                </li>
              ))}
            </ul>
          </div>

          {/* Jurisdiction */}
          <div className="bg-purple-950/20 border border-purple-900/40 rounded-xl p-4">
            <p className="text-purple-300 font-bold text-xs uppercase tracking-wider mb-1">Recommended Filing Jurisdiction</p>
            <p className="text-white font-black text-lg">{result.recommended_jurisdiction}</p>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">{result.jurisdiction_reasoning}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Archive Entry Card ────────────────────────────────────────────────
function ArchiveCard({ entry, onSelect, selected }) {
  const [expanded, setExpanded] = useState(false);
  const oc = OUTCOME_COLORS[entry.outcome] || OUTCOME_COLORS["Unknown"];
  const riskColor = entry.risk_score >= 70 ? "text-red-400" : entry.risk_score >= 40 ? "text-yellow-400" : "text-green-400";

  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden transition-all cursor-pointer ${selected ? "border-blue-600" : "border-gray-800 hover:border-gray-600"}`}
      onClick={() => onSelect(entry)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${oc.bg} ${oc.text} ${oc.border}`}>{entry.outcome}</span>
              <span className="text-xs text-gray-600">{entry.category}</span>
            </div>
            <h3 className="text-white font-bold text-sm leading-snug">{entry.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{entry.inventor} · {entry.year}</p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <div className={`text-lg font-black ${riskColor}`}>{entry.risk_score}</div>
            <div className="text-gray-600 text-xs">risk</div>
          </div>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{entry.description}</p>

        {entry.patent_numbers && (
          <p className="text-blue-400 text-xs mt-2 font-mono">📋 {entry.patent_numbers}</p>
        )}

        <button onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 mt-2 transition-colors">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {expanded ? "Less" : "Full details"}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3" onClick={e => e.stopPropagation()}>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Key Claims</p>
            <ul className="space-y-1">
              {(entry.key_claims || []).map((c, i) => (
                <li key={i} className="text-gray-400 text-xs flex gap-1.5"><span className="text-blue-500 flex-shrink-0">•</span>{c}</li>
              ))}
            </ul>
          </div>
          {entry.failure_reasons && (
            <div>
              <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Why It Failed / Was Suppressed</p>
              <p className="text-gray-400 text-xs leading-relaxed">{entry.failure_reasons}</p>
            </div>
          )}
          {entry.rejection_grounds && entry.rejection_grounds !== "N/A" && (
            <div>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Patent Rejection Grounds</p>
              <p className="text-gray-400 text-xs leading-relaxed">{entry.rejection_grounds}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Source</p>
            <p className="text-gray-500 text-xs italic">{entry.source_document}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(entry.tags || []).map((t, i) => (
              <span key={i} className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Custom Entry Modal ────────────────────────────────────────────
function AddEntryForm({ onAdd, onClose }) {
  const [form, setForm] = useState({ title: "", inventor: "", year: new Date().getFullYear(), category: "Scalar EM", outcome: "Unknown", description: "", key_claims_raw: "", failure_reasons: "", rejection_grounds: "", source_document: "", patent_numbers: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const entry = {
      ...form,
      year: parseInt(form.year),
      key_claims: form.key_claims_raw.split("\n").filter(Boolean),
      is_custom: true,
    };
    const saved = await base44.entities.PriorArtEntry.create(entry);
    onAdd({ ...entry, id: saved.id, risk_score: 50 });
    setSaving(false);
    onClose();
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={3} placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none" />
      ) : (
        <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-base">Add Custom Prior Art Entry</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field("Invention Title *", "title", "text", "e.g. Vacuum Energy Extraction Toroid")}
            {field("Inventor(s) *", "inventor", "text", "e.g. John Smith")}
            {field("Year", "year", "number")}
            {field("Patent Numbers", "patent_numbers", "text", "e.g. US1234567")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Outcome</label>
              <select value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {OUTCOMES.filter(o => o !== "All").map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          {field("Description", "description", "textarea", "Technical description of the invention and its mechanism...")}
          {field("Key Claims (one per line)", "key_claims_raw", "textarea", "Each claim on a new line...")}
          {field("Failure Reasons / Suppression Details", "failure_reasons", "textarea")}
          {field("Patent Rejection Grounds", "rejection_grounds", "textarea", "e.g. 101 rejection for perpetual motion...")}
          {field("Source Document", "source_document", "text", "e.g. Patent number, book title, paper...")}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-sm hover:border-gray-500 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !form.title || !form.inventor}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-bold disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
              {saving ? "Saving…" : "Add to Archive"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function PriorArtArchive() {
  const [tab, setTab] = useState("archive"); // archive | crossref
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [customEntries, setCustomEntries] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const allEntries = useMemo(() => [...PRIOR_ART_ARCHIVE, ...customEntries], [customEntries]);

  const filtered = useMemo(() => allEntries.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.inventor.toLowerCase().includes(search.toLowerCase()) ||
      (e.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      (e.key_claims || []).some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categoryFilter === "All" || e.category === categoryFilter;
    const matchOut = outcomeFilter === "All" || e.outcome === outcomeFilter;
    return matchSearch && matchCat && matchOut;
  }), [allEntries, search, categoryFilter, outcomeFilter]);

  const stats = useMemo(() => ({
    suppressed: allEntries.filter(e => e.outcome === "Suppressed").length,
    granted: allEntries.filter(e => e.outcome === "Patent Granted").length,
    highRisk: allEntries.filter(e => (e.risk_score || 0) >= 70).length,
  }), [allEntries]);

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">Prior Art Archive</h1>
            <p className="text-gray-500 text-xs">Tesla · Bearden · Moray · Prioré · Rife · Schauberger + more — {allEntries.length} entries</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-900/30 border border-red-800 text-red-300">
              <XCircle size={10} /> {stats.suppressed} Suppressed
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-300">
              <CheckCircle2 size={10} /> {stats.granted} Patents Granted
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-900/30 border border-orange-800 text-orange-300">
              <AlertTriangle size={10} /> {stats.highRisk} High Risk
            </span>
          </div>
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-semibold transition-colors">
            <Plus size={12} /> Add Entry
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-5">
        {[["archive", "📚 Archive", `${filtered.length} entries`], ["crossref", "🎯 Cross-Reference Tool", "AI patent risk analysis"]].map(([id, label, sub]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === id ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {label}
            <span className="text-xs text-gray-600 font-normal hidden sm:block">{sub}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {tab === "archive" ? (
          <>
            {/* Filters sidebar */}
            <div className="w-full lg:w-64 flex-shrink-0 border-r border-gray-800 overflow-y-auto p-4 space-y-4">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search titles, claims, tags..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Category</p>
                <div className="space-y-1">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategoryFilter(c)}
                      className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${categoryFilter === c ? "bg-blue-900/40 text-blue-300 font-semibold" : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`}>
                      {c} {c !== "All" && <span className="text-gray-700">({allEntries.filter(e => e.category === c).length})</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-2">Outcome</p>
                <div className="space-y-1">
                  {OUTCOMES.map(o => {
                    const oc = OUTCOME_COLORS[o];
                    return (
                      <button key={o} onClick={() => setOutcomeFilter(o)}
                        className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors ${outcomeFilter === o ? (oc ? `${oc.bg} ${oc.text} font-semibold` : "bg-gray-700 text-white font-semibold") : "text-gray-500 hover:text-gray-300 hover:bg-gray-800"}`}>
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-800/40 rounded-xl p-3">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><BookOpen size={10} /> Risk Score Guide</p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" /><span className="text-gray-400">0–39: Low rejection risk</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" /><span className="text-gray-400">40–69: Moderate risk</span></div>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" /><span className="text-gray-400">70–100: High rejection risk</span></div>
                </div>
              </div>
            </div>

            {/* Archive grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Database size={40} className="text-gray-700 mb-3" />
                  <p className="text-gray-500 text-sm">No entries match your filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {filtered.map(entry => (
                    <ArchiveCard key={entry.id} entry={entry} selected={selected?.id === entry.id}
                      onSelect={e => setSelected(e.id === selected?.id ? null : e)} />
                  ))}
                </div>
              )}

              {customEntries.length > 0 && (
                <div className="mt-4 text-center text-xs text-gray-600">
                  {customEntries.length} custom {customEntries.length === 1 ? "entry" : "entries"} added · stored in your database
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 max-w-4xl mx-auto w-full">
            <div className="mb-4">
              <h2 className="text-white font-bold text-lg mb-1">Cross-Reference Your Invention</h2>
              <p className="text-gray-500 text-sm">Compare your claims against {allEntries.length} documented historical discoveries to identify patent rejection risks before filing.</p>
            </div>
            <CrossRefTool archive={allEntries} />
          </div>
        )}
      </div>

      {showAddForm && (
        <AddEntryForm
          onAdd={entry => setCustomEntries(prev => [...prev, { ...entry, risk_score: 50 }])}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}