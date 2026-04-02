import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Zap, DollarSign, Plus, Loader2, CheckCircle2, Eye, EyeOff, Star, Globe, Lock, ChevronDown, ChevronUp, Send } from "lucide-react";
import { INVESTORS, ALIGNMENT_FLAGS, INVESTOR_CATEGORIES } from "../lib/investorData";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["Vacuum Energy", "Scalar EM", "Bioelectromagnetics", "Phase Conjugation", "Resonance Devices", "Free Energy", "Tesla Technology", "Atmospheric EM", "Other"];
const STAGES = ["Concept", "Prototype", "Patent Pending", "Patent Granted", "Seeking Co-Inventor", "Seeking Funding"];
const RISK_COLOR = { low: "text-green-400", medium: "text-yellow-400", high: "text-orange-400", very_high: "text-red-400" };

function AlignmentBadge({ id }) {
  const flag = ALIGNMENT_FLAGS.find(f => f.id === id);
  if (!flag) return null;
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-semibold border" style={{ backgroundColor: flag.color + "20", color: flag.color, borderColor: flag.color + "40" }}>
      {flag.label}
    </span>
  );
}

function MatchScore({ investor, card }) {
  let score = 0;
  const reasons = [];
  if (investor.focus.some(f => card.category?.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(card.category?.toLowerCase()))) { score += 35; reasons.push("Category match"); }
  if (investor.stage_fit.includes(card.stage)) { score += 25; reasons.push("Stage fit"); }
  if ((card.alignment_flags || []).some(f => investor.alignment.includes(f))) { score += 20; reasons.push("Alignment match"); }
  const ask = card.funding_ask || 0;
  if (ask >= investor.check_range[0] && ask <= investor.check_range[1]) { score += 20; reasons.push("Check size fit"); }
  else if (ask < investor.check_range[1]) { score += 8; reasons.push("Within max check"); }
  if ((card.tags || []).some(t => investor.tags.includes(t.toLowerCase()))) { score += 10; reasons.push("Tag overlap"); }
  const pct = Math.min(100, score);
  return { pct, reasons };
}

// ── Opportunity Card Creator ───────────────────────────────────────────
function CreateCardForm({ onCreated, onClose }) {
  const [form, setForm] = useState({
    alias: "", headline: "", category: "Scalar EM", stage: "Concept",
    funding_ask: "", equity_offered: "", problem_statement: "", solution_summary: "",
    market_size: "", ip_valuation: "", jurisdiction: "US (USPTO)",
    alignment_flags: [], tags: "", contact_email_encrypted: ""
  });
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [patentContext, setPatentContext] = useState("");

  const toggleFlag = (id) => setForm(f => ({
    ...f, alignment_flags: f.alignment_flags.includes(id) ? f.alignment_flags.filter(x => x !== id) : [...f.alignment_flags, id]
  }));

  const handleAIFill = async () => {
    if (!patentContext) return;
    setAiLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a startup pitch specialist. Based on this patent/invention context, generate an anonymized investment opportunity card. Be compelling but accurate. DO NOT include the inventor's name, location, or any identifying information.

PATENT/INVENTION CONTEXT:
${patentContext}

Generate a compelling, anonymized investment opportunity card:`,
      response_json_schema: {
        type: "object",
        properties: {
          alias: { type: "string" },
          headline: { type: "string" },
          problem_statement: { type: "string" },
          solution_summary: { type: "string" },
          market_size: { type: "string" },
          tags: { type: "string" },
          suggested_alignment_flags: { type: "array", items: { type: "string" } },
        },
      },
    });
    setForm(f => ({
      ...f,
      alias: res.alias || f.alias,
      headline: res.headline || f.headline,
      problem_statement: res.problem_statement || f.problem_statement,
      solution_summary: res.solution_summary || f.solution_summary,
      market_size: res.market_size || f.market_size,
      tags: res.tags || f.tags,
      alignment_flags: (res.suggested_alignment_flags || []).filter(id => ALIGNMENT_FLAGS.find(a => a.id === id)),
    }));
    setAiLoading(false);
  };

  const handleSave = async (publish) => {
    setSaving(true);
    const data = {
      ...form,
      funding_ask: parseFloat(form.funding_ask) || 0,
      equity_offered: parseFloat(form.equity_offered) || 0,
      ip_valuation: parseFloat(form.ip_valuation) || 0,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      status: publish ? "live" : "draft",
    };
    const saved = await base44.entities.OpportunityCard.create(data);
    onCreated({ ...data, id: saved.id });
    setSaving(false);
    onClose();
  };

  const inp = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
    </div>
  );

  const ta = (label, key, placeholder = "") => (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        rows={3} placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-white font-bold">Create Opportunity Card</h2>
            <p className="text-gray-500 text-xs mt-0.5">All cards are anonymized — no personal data is visible to investors</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">×</button>
        </div>

        <div className="p-5 space-y-5">
          {/* AI autofill */}
          <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-4">
            <p className="text-blue-300 font-bold text-xs mb-2 flex items-center gap-1.5"><Zap size={12} /> AI Autofill from Patent Disclosure</p>
            <textarea value={patentContext} onChange={e => setPatentContext(e.target.value)}
              rows={3} placeholder="Paste your patent abstract, claims summary, or description here to auto-fill the card..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none mb-2" />
            <button onClick={handleAIFill} disabled={aiLoading || !patentContext}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-700 hover:bg-blue-600 text-white disabled:opacity-50 transition-all">
              {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Zap size={11} />}
              {aiLoading ? "Generating…" : "Auto-fill from Patent"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inp("Anonymous Alias *", "alias", "text", "e.g. Project Aurora, Inventor X-7")}
            {inp("Investment Headline *", "headline", "text", "e.g. Vacuum energy extraction circuit — patent pending")}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Stage</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            {inp("Funding Ask ($)", "funding_ask", "number", "e.g. 150000")}
            {inp("Equity Offered (%)", "equity_offered", "number", "e.g. 15")}
          </div>

          {ta("Problem Statement", "problem_statement", "What specific problem does this solve?")}
          {ta("Solution Summary (no identifying info)", "solution_summary", "Describe the technical solution anonymously...")}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inp("Market Size", "market_size", "text", "e.g. $340M TAM")}
            {inp("IP Valuation ($M)", "ip_valuation", "number", "e.g. 4.2")}
            {inp("Jurisdiction", "jurisdiction", "text", "e.g. US (USPTO)")}
          </div>

          {inp("Tags (comma-separated)", "tags", "text", "e.g. vacuum energy, toroid, scalar")}

          <div>
            <label className="text-gray-400 text-xs block mb-2">Alignment Flags <span className="text-gray-600">(select all that apply)</span></label>
            <div className="flex flex-wrap gap-2">
              {ALIGNMENT_FLAGS.map(flag => (
                <button key={flag.id} onClick={() => toggleFlag(flag.id)} title={flag.desc}
                  className="text-xs px-2.5 py-1 rounded-full border font-semibold transition-all"
                  style={form.alignment_flags.includes(flag.id)
                    ? { backgroundColor: flag.color + "25", color: flag.color, borderColor: flag.color }
                    : { backgroundColor: "transparent", color: "#6b7280", borderColor: "#374151" }}>
                  {flag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs block mb-1">Secure Contact Email <span className="text-gray-600">(encrypted, never shown publicly)</span></label>
            <input type="email" value={form.contact_email_encrypted}
              onChange={e => setForm(f => ({ ...f, contact_email_encrypted: e.target.value }))}
              placeholder="your@email.com — investors contact via platform only"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-800">
            <button onClick={() => handleSave(false)} disabled={saving || !form.alias || !form.headline}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 transition-colors disabled:opacity-50">
              Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving || !form.alias || !form.headline}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              {saving ? "Publishing…" : "Publish & Match"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Investor Card ──────────────────────────────────────────────────────
function InvestorCard({ investor, card, showMatch }) {
  const [expanded, setExpanded] = useState(false);
  const match = card ? MatchScore({ investor, card }) : null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl flex-shrink-0">{investor.logo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-sm leading-snug">{investor.name}</h3>
                <p className="text-gray-500 text-xs">{investor.type} · {investor.geography}</p>
              </div>
              {showMatch && match && (
                <div className={`text-lg font-black flex-shrink-0 ${match.pct >= 70 ? "text-green-400" : match.pct >= 40 ? "text-yellow-400" : "text-gray-500"}`}>
                  {match.pct}%
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{investor.description}</p>

        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-green-400 font-bold">${investor.check_range[0].toLocaleString()} – ${investor.check_range[1].toLocaleString()}</span>
          <span className={`font-semibold ${RISK_COLOR[investor.risk_tolerance] || "text-gray-400"}`}>
            {investor.risk_tolerance.replace("_", " ")} risk tolerance
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {investor.alignment.slice(0, 3).map(a => <AlignmentBadge key={a} id={a} />)}
          {investor.alignment.length > 3 && <span className="text-xs text-gray-600">+{investor.alignment.length - 3} more</span>}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${investor.anonymity_respected ? "text-green-400" : "text-yellow-400"}`}>
            {investor.anonymity_respected ? <Lock size={10} /> : <Eye size={10} />}
            {investor.anonymity_respected ? "Anonymity OK" : "Identity required"}
          </span>
          <span className="text-gray-600">·</span>
          <span className="text-gray-500">{investor.contact_method}</span>
        </div>

        <button onClick={() => setExpanded(x => !x)}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 mt-2 transition-colors">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />} {expanded ? "Less" : "Stage fit & focus"}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3 space-y-2">
          <div>
            <p className="text-gray-500 text-xs font-bold mb-1">Stage Fit</p>
            <div className="flex flex-wrap gap-1.5">
              {investor.stage_fit.map(s => <span key={s} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{s}</span>)}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold mb-1">Technology Focus</p>
            <div className="flex flex-wrap gap-1.5">
              {investor.focus.map(f => <span key={f} className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">{f}</span>)}
            </div>
          </div>
          {showMatch && match && match.reasons.length > 0 && (
            <div>
              <p className="text-gray-500 text-xs font-bold mb-1">Match Reasons</p>
              <div className="flex flex-wrap gap-1.5">
                {match.reasons.map(r => <span key={r} className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">✓ {r}</span>)}
              </div>
            </div>
          )}
          <a href={investor.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            <Globe size={10} /> {investor.website}
          </a>
        </div>
      )}
    </div>
  );
}

// ── Opportunity Card Preview ──────────────────────────────────────────
function OpportunityCardPreview({ card }) {
  const [showEmail, setShowEmail] = useState(false);
  const stageColor = { Concept: "#6b7280", Prototype: "#3b82f6", "Patent Pending": "#a855f7", "Patent Granted": "#22c55e", "Seeking Funding": "#f59e0b" };
  const color = stageColor[card.stage] || "#6b7280";

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ backgroundColor: color + "20", color }}>
                {card.stage}
              </span>
              <span className="text-gray-600 text-xs">{card.category}</span>
            </div>
            <h3 className="text-white font-black text-sm leading-snug">{card.headline}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Shield size={10} className="text-green-400" />
            <span className="text-green-400 font-semibold">Anonymous</span>
          </div>
        </div>

        <p className="text-gray-500 text-xs font-mono mb-2">{card.alias}</p>

        {card.problem_statement && <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-3">{card.problem_statement}</p>}

        <div className="flex items-center gap-4 text-xs mb-3">
          {card.funding_ask > 0 && <span className="text-green-400 font-bold">${card.funding_ask.toLocaleString()} ask</span>}
          {card.equity_offered > 0 && <span className="text-gray-400">{card.equity_offered}% equity</span>}
          {card.ip_valuation > 0 && <span className="text-blue-400">${card.ip_valuation}M IP val</span>}
        </div>

        {(card.alignment_flags || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {card.alignment_flags.map(f => <AlignmentBadge key={f} id={f} />)}
          </div>
        )}

        {(card.tags || []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.tags.map((t, i) => <span key={i} className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded">{t}</span>)}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
          <span className={`text-xs px-2 py-0.5 rounded font-bold ${card.status === "live" ? "bg-green-900/30 text-green-300" : card.status === "matched" ? "bg-blue-900/30 text-blue-300" : "bg-gray-800 text-gray-500"}`}>
            {card.status}
          </span>
          {card.status === "live" && (
            <span className="text-xs text-gray-600 flex items-center gap-1"><Star size={10} className="text-yellow-500" /> Visible to investors</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────
export default function InvestorPortal() {
  const [tab, setTab] = useState("investors"); // investors | myCards | matched
  const [showCreate, setShowCreate] = useState(false);
  const [myCards, setMyCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [typeFilter, setTypeFilter] = useState("All");

  const activeCard = selectedCard ? myCards.find(c => c.id === selectedCard) : null;

  const filteredInvestors = useMemo(() => {
    let list = typeFilter === "All" ? INVESTORS : INVESTORS.filter(i => i.type === typeFilter);
    if (activeCard) {
      list = list.map(i => ({ ...i, _match: MatchScore({ investor: i, card: activeCard }) }))
        .sort((a, b) => b._match.pct - a._match.pct);
    }
    return list;
  }, [typeFilter, activeCard]);

  const topMatches = activeCard ? filteredInvestors.filter(i => i._match?.pct >= 40) : [];

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <Shield size={16} className="text-green-400" /> Investor Matching Portal
            </h1>
            <p className="text-gray-500 text-xs">Anonymized opportunity cards · {INVESTORS.length} vetted alignment-friendly investors & foundations</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-bold transition-all">
          <Plus size={13} /> Create Opportunity Card
        </button>
      </div>

      {/* Privacy banner */}
      <div className="bg-green-950/30 border-b border-green-900/30 px-5 py-2 flex items-center gap-3">
        <Lock size={12} className="text-green-400 flex-shrink-0" />
        <p className="text-green-300 text-xs">
          <strong>Privacy by design:</strong> All opportunity cards are fully anonymized. Your name, location, and contact details are never revealed. Investors connect through the platform only.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-5">
        {[
          ["investors", `🌍 Investor Database`, `${INVESTORS.length} vetted`],
          ["myCards", `🃏 My Opportunity Cards`, `${myCards.length} cards`],
          ...(activeCard ? [["matched", `🎯 Matches for "${activeCard.alias}"`, `${topMatches.length} matches`]] : []),
        ].map(([id, label, sub]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === id ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {label}
            <span className="text-xs text-gray-600 font-normal hidden sm:block">{sub}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ── Investor Database ── */}
        {tab === "investors" && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex flex-wrap gap-2">
                {INVESTOR_CATEGORIES.map(c => (
                  <button key={c} onClick={() => setTypeFilter(c)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${typeFilter === c ? "bg-blue-900/40 border-blue-600 text-blue-300 font-bold" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                    {c}
                  </button>
                ))}
              </div>
              {myCards.filter(c => c.status === "live").length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-gray-500 text-xs">Match against:</label>
                  <select value={selectedCard || ""} onChange={e => setSelectedCard(e.target.value || null)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none">
                    <option value="">— No card selected —</option>
                    {myCards.filter(c => c.status === "live").map(c => (
                      <option key={c.id} value={c.id}>{c.alias}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} card={activeCard} showMatch={!!activeCard} />
              ))}
            </div>
          </div>
        )}

        {/* ── My Cards ── */}
        {tab === "myCards" && (
          <div className="p-5">
            {myCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-5xl mb-4">🃏</div>
                <h2 className="text-white font-bold text-xl mb-2">No Opportunity Cards Yet</h2>
                <p className="text-gray-500 text-sm max-w-md mb-6">Create an anonymized investment card from your patent disclosures to get matched with vetted, alignment-friendly investors and research foundations.</p>
                <button onClick={() => setShowCreate(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-all">
                  <Plus size={14} /> Create Your First Card
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {myCards.map(card => (
                  <div key={card.id}>
                    <OpportunityCardPreview card={card} />
                    {card.status === "live" && (
                      <button onClick={() => { setSelectedCard(card.id); setTab("matched"); }}
                        className="w-full mt-2 py-2 rounded-lg bg-blue-900/30 border border-blue-800 text-blue-300 text-xs font-bold hover:bg-blue-900/50 transition-all flex items-center justify-center gap-1.5">
                        <Star size={11} /> View Investor Matches
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Matched Investors ── */}
        {tab === "matched" && activeCard && (
          <div className="p-5">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 flex items-start gap-4">
              <Shield size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-sm mb-0.5">Matching: <span className="text-blue-300">{activeCard.alias}</span></p>
                <p className="text-gray-500 text-xs">{topMatches.length} investors scored ≥40% match · sorted by fit score</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredInvestors.map(investor => (
                <InvestorCard key={investor.id} investor={investor} card={activeCard} showMatch />
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateCardForm
          onCreated={card => { setMyCards(prev => [...prev, card]); setTab("myCards"); }}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  );
}