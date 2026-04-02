import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Target, Shield, DollarSign, Loader2, ChevronDown, ChevronUp, Users, Zap, CheckCircle2, Edit2, Eye, EyeOff } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { VETTED_INVESTORS, SUPPRESSION_RISK_COLORS } from "../lib/investorData";

// ── Opportunity Card Form ─────────────────────────────────────────────
function OpportunityForm({ onSave, onClose, initial }) {
  const CATEGORIES = ["Vacuum Energy", "Scalar EM", "Bioelectromagnetics", "Resonance Devices", "Free Energy", "Defense Technology", "Health Technology", "Other"];
  const STAGES = ["Concept", "Prototype", "Patent Filed", "Patent Granted", "Pre-Revenue", "Revenue Stage"];

  const [form, setForm] = useState(initial || {
    title: "", anon_handle: "", category: "Vacuum Energy", stage: "Concept",
    summary: "", problem_solved: "", tech_approach: "", seeking_usd: "",
    equity_offered: "", use_of_funds: "", ip_status: "", tam_usd_millions: "",
    contact_method: "", is_anonymous: true, status: "Draft", tags: "",
  });
  const [saving, setSaving] = useState(false);

  const f = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      <input type={type} value={form[key]} onChange={e => setForm(x => ({ ...x, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
    </div>
  );

  const ta = (label, key, placeholder = "", rows = 3) => (
    <div>
      <label className="text-gray-400 text-xs block mb-1">{label}</label>
      <textarea value={form[key]} onChange={e => setForm(x => ({ ...x, [key]: e.target.value }))}
        rows={rows} placeholder={placeholder}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none" />
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    const data = { ...form, seeking_usd: parseFloat(form.seeking_usd) || 0, equity_offered: parseFloat(form.equity_offered) || 0, tam_usd_millions: parseFloat(form.tam_usd_millions) || 0, tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [] };
    let saved;
    if (initial?.id) {
      await base44.entities.InvestmentOpportunity.update(initial.id, data);
      saved = { ...data, id: initial.id };
    } else {
      saved = await base44.entities.InvestmentOpportunity.create({ ...data, status: "Active" });
    }
    onSave(saved);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-white font-bold text-sm">Create Investment Opportunity Card</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">×</button>
        </div>
        <div className="p-5 space-y-4">
          {/* Anonymity toggle */}
          <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${form.is_anonymous ? "bg-green-950/30 border-green-800" : "bg-gray-800 border-gray-700"}`}>
            <div className="flex items-center gap-2">
              {form.is_anonymous ? <Shield size={14} className="text-green-400" /> : <Eye size={14} className="text-gray-400" />}
              <div>
                <p className="text-white text-xs font-bold">{form.is_anonymous ? "Anonymous Mode" : "Named Mode"}</p>
                <p className="text-gray-500 text-xs">{form.is_anonymous ? "Your identity is hidden from investors until you choose to reveal" : "Investors can see your identity"}</p>
              </div>
            </div>
            <button onClick={() => setForm(x => ({ ...x, is_anonymous: !x.is_anonymous }))}
              className={`w-10 h-5 rounded-full transition-all relative ${form.is_anonymous ? "bg-green-600" : "bg-gray-600"}`}>
              <span className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${form.is_anonymous ? "right-0.5" : "left-0.5"}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {f("Opportunity Title *", "title", "text", "e.g. Toroidal Vacuum Energy Extraction Circuit")}
            {f("Anonymous Handle *", "anon_handle", "text", "e.g. QuantumFounder42")}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(x => ({ ...x, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Stage</label>
              <select value={form.stage} onChange={e => setForm(x => ({ ...x, stage: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {ta("Executive Summary *", "summary", "Describe your invention and opportunity in 2-4 sentences. This is what investors see first.", 3)}
          {ta("Problem Solved", "problem_solved", "What specific problem does this solve and why hasn't it been solved before?", 2)}
          {ta("Technical Approach", "tech_approach", "High-level technical description. Enough to show it's real without revealing trade secrets.", 3)}
          <div className="grid grid-cols-3 gap-3">
            {f("Seeking ($)", "seeking_usd", "number", "e.g. 250000")}
            {f("Equity Offered (%)", "equity_offered", "number", "e.g. 15")}
            {f("TAM ($ millions)", "tam_usd_millions", "number", "e.g. 340")}
          </div>
          {ta("Use of Funds", "use_of_funds", "Prototype development: 40%, Patent filing: 20%, Lab equipment: 40%", 2)}
          {f("IP Status", "ip_status", "text", "e.g. Provisional patent filed June 2024, PCT application pending")}
          {f("Contact Method (anonymous-friendly)", "contact_method", "text", "e.g. Signal username, ProtonMail address, Keybase")}
          {f("Tags (comma separated)", "tags", "text", "e.g. toroid, vacuum energy, non-Ohmic, scalar")}
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 text-xs hover:border-gray-500 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.title || !form.summary}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold disabled:opacity-50 transition-all">
            {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
            {saving ? "Saving…" : "Save Opportunity Card"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Investor Card ────────────────────────────────────────────────────
function InvestorCard({ investor, matchScore, matchReasons }) {
  const [expanded, setExpanded] = useState(false);
  const risk = SUPPRESSION_RISK_COLORS[investor.suppression_risk] || SUPPRESSION_RISK_COLORS.low;
  const alignColor = investor.alignment_score >= 90 ? "text-green-400" : investor.alignment_score >= 75 ? "text-yellow-400" : "text-orange-400";

  return (
    <div className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${matchScore >= 80 ? "border-green-700/60" : matchScore >= 50 ? "border-blue-700/40" : "border-gray-800"}`}>
      {matchScore !== undefined && (
        <div className={`h-1 ${matchScore >= 80 ? "bg-green-600" : matchScore >= 50 ? "bg-blue-600" : "bg-gray-700"}`}
          style={{ width: `${matchScore}%` }} />
      )}
      <div className="p-4">
        <div className="flex items-start gap-3 mb-2">
          <span className="text-2xl flex-shrink-0">{investor.logo_emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">{investor.name}</h3>
                <p className="text-gray-500 text-xs mt-0.5">{investor.type} · {investor.location}</p>
              </div>
              {matchScore !== undefined && (
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className={`text-lg font-black ${alignColor}`}>{matchScore}%</span>
                  <span className="text-gray-600 text-xs">match</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded font-semibold ${risk.bg} ${risk.text}`}>
            {risk.label} suppression risk
          </span>
          {investor.anonymity_friendly && (
            <span className="text-xs px-2 py-0.5 rounded bg-green-900/30 text-green-300 font-semibold">Anon-friendly</span>
          )}
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
            ${(investor.check_size_min / 1000).toFixed(0)}K–${(investor.check_size_max / 1000000).toFixed(1)}M
          </span>
        </div>

        {matchReasons && matchReasons.length > 0 && (
          <div className="bg-green-950/20 border border-green-900/30 rounded-lg p-2 mb-2">
            <p className="text-green-400 text-xs font-bold mb-1">Why matched:</p>
            <ul className="space-y-0.5">
              {matchReasons.map((r, i) => <li key={i} className="text-green-200 text-xs flex gap-1"><span>•</span>{r}</li>)}
            </ul>
          </div>
        )}

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{investor.description}</p>

        <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-300 mt-2 transition-colors">
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          {expanded ? "Less" : "Full profile"}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-800 pt-3">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Investment Focus</p>
            <div className="flex flex-wrap gap-1">
              {investor.focus.map((f, i) => <span key={i} className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded">{f}</span>)}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Stage Preference</p>
            <div className="flex flex-wrap gap-1">
              {investor.stage_preference.map((s, i) => <span key={i} className="bg-blue-900/30 text-blue-300 text-xs px-2 py-0.5 rounded border border-blue-800">{s}</span>)}
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">How to Approach</p>
            <p className="text-gray-400 text-xs leading-relaxed">{investor.contact_approach}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {investor.tags.map((t, i) => <span key={i} className="bg-gray-800/50 text-gray-500 text-xs px-1.5 py-0.5 rounded">{t}</span>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Opportunity Card Display ─────────────────────────────────────────
function OpportunityCardDisplay({ opp, onEdit, onMatch }) {
  const stageColor = { Concept: "text-gray-400", Prototype: "text-blue-400", "Patent Filed": "text-purple-400", "Patent Granted": "text-green-400", "Pre-Revenue": "text-yellow-400", "Revenue Stage": "text-emerald-400" };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {opp.is_anonymous ? <Shield size={12} className="text-green-400 flex-shrink-0" /> : <Eye size={12} className="text-gray-400 flex-shrink-0" />}
          <span className="text-gray-500 text-xs font-mono">{opp.anon_handle || "Anonymous"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onEdit(opp)} className="text-gray-600 hover:text-gray-300 transition-colors p-1"><Edit2 size={11} /></button>
          <span className={`text-xs font-bold ${stageColor[opp.stage] || "text-gray-400"}`}>{opp.stage}</span>
        </div>
      </div>
      <h3 className="text-white font-bold text-sm leading-snug mb-1">{opp.title}</h3>
      <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-3">{opp.summary}</p>
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
        {opp.seeking_usd > 0 && <span className="flex items-center gap-1 text-green-400"><DollarSign size={10} />${(opp.seeking_usd / 1000).toFixed(0)}K</span>}
        {opp.equity_offered > 0 && <span>{opp.equity_offered}% equity</span>}
        {opp.tam_usd_millions > 0 && <span>${opp.tam_usd_millions}M TAM</span>}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {(opp.tags || []).slice(0, 4).map((t, i) => <span key={i} className="bg-gray-800 text-gray-500 text-xs px-1.5 py-0.5 rounded">{t}</span>)}
      </div>
      <button onClick={() => onMatch(opp)}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800 text-blue-300 text-xs font-bold transition-all">
        <Target size={12} /> Match to Investors
      </button>
    </div>
  );
}

// ── Match Engine ─────────────────────────────────────────────────────
function computeMatches(opp) {
  return VETTED_INVESTORS.map(inv => {
    let score = 0;
    const reasons = [];

    // Category match
    if (inv.categories.includes(opp.category)) { score += 35; reasons.push(`Invests in ${opp.category}`); }
    // Stage match
    if (inv.stage_preference.includes(opp.stage)) { score += 25; reasons.push(`Active at ${opp.stage} stage`); }
    // Anonymity
    if (opp.is_anonymous && inv.anonymity_friendly) { score += 20; reasons.push("Accepts anonymous disclosures"); }
    // Check size
    const seek = opp.seeking_usd || 0;
    if (seek >= inv.check_size_min && seek <= inv.check_size_max) { score += 15; reasons.push("Check size matches request"); }
    else if (seek > 0 && seek < inv.check_size_min && inv.check_size_min <= 100000) { score += 5; }
    // Suppression risk bonus
    if (inv.suppression_risk === "very_low") { score += 5; }

    return { investor: inv, score: Math.min(100, score), reasons: reasons.slice(0, 3) };
  }).sort((a, b) => b.score - a.score);
}

// ── Main Page ─────────────────────────────────────────────────────────
export default function InvestorPortal() {
  const [tab, setTab] = useState("board");
  const [opportunities, setOpportunities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOpp, setEditingOpp] = useState(null);
  const [matchingOpp, setMatchingOpp] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [filterType, setFilterType] = useState("All");

  const handleSave = (opp) => {
    setOpportunities(prev => {
      const idx = prev.findIndex(o => o.id === opp.id);
      return idx >= 0 ? prev.map((o, i) => i === idx ? opp : o) : [opp, ...prev];
    });
  };

  const handleMatch = async (opp) => {
    setMatchingOpp(opp);
    setLoadingMatch(true);
    setTab("matches");
    // Compute algorithmic matches
    const computed = computeMatches(opp);
    setMatches(computed);
    setLoadingMatch(false);
  };

  const filteredInvestors = useMemo(() => {
    if (filterType === "All") return VETTED_INVESTORS;
    return VETTED_INVESTORS.filter(i => i.type === filterType);
  }, [filterType]);

  const INVESTOR_TYPES = ["All", "Foundation", "Grant Program", "Research DAO", "Angel / Foundation", "Angel Network", "Angel / Crypto Fund", "VC Fund"];

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
            <h1 className="text-white font-bold text-base tracking-tight">Investor Matching Portal</h1>
            <p className="text-gray-500 text-xs">Anonymous opportunity cards · Vetted alignment-friendly investors · Protected matching</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-900/30 border border-green-800 text-green-300">
            <Shield size={10} /> {VETTED_INVESTORS.filter(i => i.anonymity_friendly).length} Anon-Friendly Investors
          </div>
          <button onClick={() => { setEditingOpp(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-colors">
            <Plus size={12} /> New Opportunity
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-5">
        {[
          ["board", "🃏 My Opportunities", opportunities.length],
          ["investors", "🤝 Investor Database", VETTED_INVESTORS.length],
          ["matches", "🎯 Matches", matchingOpp ? matches.length : null],
        ].map(([id, label, count]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${tab === id ? "border-blue-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {label}
            {count !== null && <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full">{count}</span>}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {/* Board tab */}
        {tab === "board" && (
          <div>
            {opportunities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4 text-3xl">🃏</div>
                <h2 className="text-white font-bold text-xl mb-2">Create Your First Opportunity Card</h2>
                <p className="text-gray-500 text-sm max-w-md mb-6">Build an anonymized investment opportunity card from your patent disclosures. Your identity is protected — investors see only what you choose to share.</p>
                <button onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm transition-all">
                  <Plus size={15} /> Create Opportunity Card
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">{opportunities.length} active {opportunities.length === 1 ? "opportunity" : "opportunities"}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {opportunities.map(opp => (
                    <OpportunityCardDisplay key={opp.id} opp={opp}
                      onEdit={o => { setEditingOpp(o); setShowForm(true); }}
                      onMatch={handleMatch} />
                  ))}
                  <button onClick={() => setShowForm(true)}
                    className="border-2 border-dashed border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-gray-600 hover:border-gray-600 hover:text-gray-400 transition-all min-h-[200px]">
                    <Plus size={20} />
                    <span className="text-xs font-semibold">Add Opportunity</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Investor database tab */}
        {tab === "investors" && (
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <p className="text-gray-500 text-xs mr-2">Filter:</p>
              {INVESTOR_TYPES.map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${filterType === t ? "bg-blue-900/40 border-blue-600 text-blue-300 font-semibold" : "border-gray-700 text-gray-500 hover:border-gray-500"}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Stats banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Total Vetted", value: VETTED_INVESTORS.length, color: "text-white", emoji: "🏦" },
                { label: "Anon-Friendly", value: VETTED_INVESTORS.filter(i => i.anonymity_friendly).length, color: "text-green-400", emoji: "🛡️" },
                { label: "DAOs / Decentralized", value: VETTED_INVESTORS.filter(i => i.type.includes("DAO")).length, color: "text-purple-400", emoji: "🌐" },
                { label: "Very Low Risk", value: VETTED_INVESTORS.filter(i => i.suppression_risk === "very_low").length, color: "text-blue-400", emoji: "✅" },
              ].map(({ label, value, color, emoji }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                  <p className="text-xl mb-1">{emoji}</p>
                  <p className={`font-black text-2xl ${color}`}>{value}</p>
                  <p className="text-gray-500 text-xs">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredInvestors.map(inv => <InvestorCard key={inv.id} investor={inv} />)}
            </div>
          </div>
        )}

        {/* Matches tab */}
        {tab === "matches" && (
          <div>
            {!matchingOpp ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Target size={40} className="text-gray-700 mb-3" />
                <p className="text-white font-bold text-lg mb-2">No opportunity selected for matching</p>
                <p className="text-gray-500 text-sm">Go to My Opportunities, select a card, and click "Match to Investors".</p>
              </div>
            ) : (
              <div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Matching for</p>
                    <h2 className="text-white font-bold text-base">{matchingOpp.title}</h2>
                    <p className="text-gray-400 text-xs mt-0.5">{matchingOpp.category} · {matchingOpp.stage} · {matchingOpp.is_anonymous ? "🛡️ Anonymous" : "👤 Named"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-black text-2xl">{matches.filter(m => m.score >= 70).length}</p>
                    <p className="text-gray-500 text-xs">strong matches</p>
                  </div>
                </div>

                {loadingMatch ? (
                  <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-sm">Computing matches…</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-gray-400 text-sm">{matches.length} investors ranked by match score</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" />Strong (70%+)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />Good (50–69%)</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />Possible</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {matches.map(({ investor, score, reasons }) => (
                        <InvestorCard key={investor.id} investor={investor} matchScore={score} matchReasons={reasons} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && (
        <OpportunityForm
          initial={editingOpp}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingOpp(null); }}
        />
      )}
    </div>
  );
}