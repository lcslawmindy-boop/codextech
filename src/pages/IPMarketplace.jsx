import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Search, Filter, DollarSign, Tag, Eye, Send, X, ChevronRight, Lock, TrendingUp, Briefcase, Loader2, CheckCircle2, Star, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";

const CATEGORIES = ["All", "Vacuum Energy", "Bioelectromagnetics", "Scalar EM", "AI / Software", "Clean Energy", "Biotech", "Defense", "Other"];
const STAGES = ["All", "Concept", "Prototype", "Patent Pending", "Patent Granted", "Seeking Co-Inventor", "Seeking Funding"];
const ASKING_RANGES = ["All", "Under $50K", "$50K–$250K", "$250K–$1M", "$1M–$5M", "$5M+"];

const STAGE_COLORS = {
  "Concept": "#6b7280",
  "Prototype": "#f59e0b",
  "Patent Pending": "#6366f1",
  "Patent Granted": "#22c55e",
  "Seeking Co-Inventor": "#06b6d4",
  "Seeking Funding": "#ec4899",
};

const SAMPLE_LISTINGS = [
  {
    id: "s1", alias: "Project HELIX", category: "Bioelectromagnetics", stage: "Patent Pending",
    headline: "Portable Prioré-class EM therapy device — proven cellular regeneration protocol",
    problem_statement: "Current EM therapy devices are bulky, expensive, and not clinically validated for cellular regeneration.",
    solution_summary: "Compact, patent-pending EM device replicating Prioré's documented protocols at 1/50th the cost.",
    market_size: "$4.2B global regenerative medicine market", ip_valuation: 3200000,
    funding_ask: 850000, equity_offered: 12, tags: ["bioelectromagnetics", "EM therapy", "regenerative"],
    status: "live", jurisdiction: "US",
  },
  {
    id: "s2", alias: "Project AXIOM", category: "Vacuum Energy", stage: "Patent Granted",
    headline: "MEG-derivative overunity circuit — US patent granted, seeking commercial partner",
    problem_statement: "No commercially viable overunity device has reached mass market due to IP fragmentation.",
    solution_summary: "Granted US patent on a novel asymmetric regauging circuit with documented COP > 1.0 in controlled testing.",
    market_size: "$1.2T global energy market", ip_valuation: 12000000,
    funding_ask: 2500000, equity_offered: 8, tags: ["vacuum energy", "overunity", "patent granted"],
    status: "live", jurisdiction: "US",
  },
  {
    id: "s3", alias: "Project CIPHER", category: "Scalar EM", stage: "Prototype",
    headline: "Scalar wave communicator — FCC-exempt frequency range, working prototype",
    problem_statement: "Secure communications increasingly vulnerable to quantum decryption and RF interception.",
    solution_summary: "Scalar longitudinal wave communicator operating outside conventional EM spectrum — inherently undetectable.",
    market_size: "$45B secure comms market", ip_valuation: 5500000,
    funding_ask: 1200000, equity_offered: 15, tags: ["scalar", "communications", "secure"],
    status: "live", jurisdiction: "US",
  },
  {
    id: "s4", alias: "Project MORPH", category: "Biotech", stage: "Concept",
    headline: "Morphogenetic field coherence monitor — non-invasive epigenetic state measurement",
    problem_statement: "No practical tool exists to measure biofield coherence for clinical or wellness applications.",
    solution_summary: "Novel sensor array that measures morphogenetic field coherence via ELF EM signatures — clinical trial ready.",
    market_size: "$8.9B precision diagnostics", ip_valuation: 1800000,
    funding_ask: 400000, equity_offered: 20, tags: ["biofield", "epigenetics", "diagnostics"],
    status: "live", jurisdiction: "US",
  },
];

function formatCurrency(val) {
  if (!val) return "—";
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
  return `$${val}`;
}

function InventorSignupModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", organization: "", invention_title: "", bio: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.invention_title) return;
    setSubmitting(true);
    
    await base44.entities.User.create({
      full_name: form.name,
      email: form.email,
      role: "inventor"
    }).catch(() => {});
    
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: "Welcome to ZARP IP Marketplace — Inventor Program",
      body: `Hi ${form.name},\n\nWelcome to the ZARP IP Marketplace Inventor Program!\n\nYou can now list your inventions and connect with buyers, investors, and partners. ZARP takes a 5% commission only on successfully executed deals.\n\nNext steps:\n1. List your invention in the marketplace\n2. Receive inquiries from interested buyers\n3. Negotiate terms confidentially\n4. Close the deal and earn 95% of the transaction value\n\nGet started: https://zarpapp.com/ip-marketplace\n\nQuestions? Reply to this email.\n\nBest regards,\nZARP Team`
    });
    
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-black text-base flex items-center gap-2"><Users size={16} /> Become an Inventor</p>
            <p className="text-gray-500 text-xs">List your IP and earn 95% on successful deals</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300"><X size={16} /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-black text-lg mb-2">Welcome to ZARP!</p>
            <p className="text-gray-400 text-sm">Check your email for next steps. You're ready to list your inventions and connect with buyers.</p>
            <button onClick={onClose} className="mt-5 px-6 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm font-bold">Close</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-3">
              <p className="text-indigo-400 text-xs font-bold">💡 List your inventions and earn 95% commission. ZARP takes 5% only on successful deals.</p>
            </div>
            {[
              { key: "name", label: "Full Name *", placeholder: "Your name" },
              { key: "email", label: "Email Address *", placeholder: "contact@example.com", type: "email" },
              { key: "organization", label: "Organization / Company", placeholder: "Your company or solo" },
              { key: "invention_title", label: "Primary Invention / Project *", placeholder: "e.g. Scalar Wave Communicator" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-gray-400 text-xs font-semibold mb-1">{f.label}</label>
                <input 
                  type={f.type || "text"}
                  value={form[f.key]} 
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600" 
                />
              </div>
            ))}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1">Bio / Background (optional)</label>
              <textarea 
                value={form.bio} 
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                placeholder="Brief background in physics, engineering, or your area of expertise…"
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600 resize-none" 
              />
            </div>
            <button 
              onClick={handleSubmit} 
              disabled={submitting || !form.name || !form.email || !form.invention_title}
              className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {submitting ? "Registering…" : "Register as Inventor"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LOIModal({ listing, onClose }) {
  const [form, setForm] = useState({ org: "", type: "", amount: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!form.org || !form.type || !form.message) return;
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: "zenithapexresearch@gmail.com",
      subject: `[LOI SUBMITTED] ${listing.alias} — ${listing.category}`,
      body: `New Letter of Intent received via IP Marketplace.\n\nLISTING: ${listing.alias}\nCATEGORY: ${listing.category}\nSTAGE: ${listing.stage}\nASKING: ${formatCurrency(listing.funding_ask)}\n\nBUYER ORG: ${form.org}\nBUYER TYPE: ${form.type}\nOFFER AMOUNT: ${form.amount || "Not specified"}\n\nMESSAGE:\n${form.message}\n\n---\nZARP IP Marketplace · Auto-notification`
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div>
            <p className="text-white font-black text-base">Submit Letter of Intent</p>
            <p className="text-gray-500 text-xs">{listing.alias} · {listing.category}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300"><X size={16} /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-white font-black text-lg mb-2">LOI Submitted</p>
            <p className="text-gray-400 text-sm">The seller has been notified. Expect a response within 48 hours via the platform's broker team.</p>
            <button onClick={onClose} className="mt-5 px-6 py-2 rounded-xl bg-gray-800 text-gray-300 text-sm font-bold">Close</button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="bg-yellow-950/30 border border-yellow-900/40 rounded-xl p-3">
              <p className="text-yellow-400 text-xs font-bold">Brokered Transaction — ZARP takes 5% commission on executed deals. Your identity remains anonymous until mutual NDA execution.</p>
            </div>
            {[
              { key: "org", label: "Your Organization / Name *", placeholder: "Company or individual name" },
              { key: "type", label: "Buyer Type *", placeholder: "e.g. Strategic acquirer, VC, licensing partner, individual" },
              { key: "amount", label: "Indicative Offer / Budget", placeholder: "e.g. $500K, $2M, open to discuss" },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-gray-400 text-xs font-semibold mb-1">{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600" />
              </div>
            ))}
            <div>
              <label className="block text-gray-400 text-xs font-semibold mb-1">Message to Seller *</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Describe your interest, intended use, and any questions…"
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600 resize-none" />
            </div>
            <button onClick={handleSubmit} disabled={submitting || !form.org || !form.type || !form.message}
              className="w-full py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? "Submitting…" : "Submit LOI — Anonymous"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing, onLOI }) {
  const [expanded, setExpanded] = useState(false);
  const stageColor = STAGE_COLORS[listing.stage] || "#6b7280";

  return (
    <div className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden transition-all">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs px-2 py-0.5 rounded font-bold"
                style={{ backgroundColor: stageColor + "20", color: stageColor, border: `1px solid ${stageColor}40` }}>
                {listing.stage}
              </span>
              <span className="text-gray-500 text-xs">{listing.category}</span>
              {listing.jurisdiction && <span className="text-gray-600 text-xs">🌐 {listing.jurisdiction}</span>}
            </div>
            <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{listing.alias}</p>
            <h3 className="text-white font-bold text-sm leading-snug">{listing.headline}</h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-yellow-400 font-black text-lg">{formatCurrency(listing.ip_valuation)}</p>
            <p className="text-gray-600 text-xs">IP Valuation</p>
          </div>
        </div>

        {expanded && (
          <div className="space-y-3 mb-3 border-t border-gray-800 pt-3">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Problem</p>
              <p className="text-gray-400 text-xs leading-relaxed">{listing.problem_statement}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Solution</p>
              <p className="text-gray-300 text-xs leading-relaxed">{listing.solution_summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-600 text-xs">Market Size</p>
                <p className="text-green-400 text-xs font-bold">{listing.market_size}</p>
              </div>
              <div>
                <p className="text-gray-600 text-xs">Funding Ask</p>
                <p className="text-indigo-300 text-xs font-bold">{formatCurrency(listing.funding_ask)} for {listing.equity_offered}%</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(listing.tags || []).map((t, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-500">{t}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs font-bold transition-all">
            <Eye size={11} /> {expanded ? "Less" : "View Details"}
          </button>
          <button onClick={() => onLOI(listing)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-black transition-all ml-auto">
            <Send size={11} /> Submit LOI
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IPMarketplace() {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const [loiTarget, setLoiTarget] = useState(null);
  const [showList, setShowList] = useState(true);
  const [showInventorSignup, setShowInventorSignup] = useState(false);
  const [listForm, setListForm] = useState({ alias: "", category: "", stage: "", headline: "", problem_statement: "", solution_summary: "", market_size: "", ip_valuation: "", funding_ask: "", equity_offered: "", jurisdiction: "", tags: "" });
  const [submittingList, setSubmittingList] = useState(false);
  const [listSubmitted, setListSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await base44.entities.OpportunityCard.filter({ status: "live" }, "-created_date", 50);
      setListings([...SAMPLE_LISTINGS, ...data]);
    };
    load();
  }, []);

  const filtered = listings.filter(l => {
    const matchSearch = !search || l.headline?.toLowerCase().includes(search.toLowerCase()) || l.alias?.toLowerCase().includes(search.toLowerCase()) || l.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || l.category === catFilter;
    const matchStage = stageFilter === "All" || l.stage === stageFilter;
    return matchSearch && matchCat && matchStage;
  });

  const handleSubmitListing = async () => {
    if (!listForm.alias || !listForm.headline || !listForm.category) return;
    setSubmittingList(true);
    await base44.entities.OpportunityCard.create({
      ...listForm,
      ip_valuation: parseFloat(listForm.ip_valuation) || 0,
      funding_ask: parseFloat(listForm.funding_ask) || 0,
      equity_offered: parseFloat(listForm.equity_offered) || 0,
      tags: listForm.tags ? listForm.tags.split(",").map(t => t.trim()) : [],
      status: "draft",
    });
    await base44.integrations.Core.SendEmail({
      to: "zenithapexresearch@gmail.com",
      subject: `[NEW LISTING SUBMITTED] ${listForm.alias}`,
      body: `New IP listing submitted for review.\n\nAlias: ${listForm.alias}\nCategory: ${listForm.category}\nStage: ${listForm.stage}\nHeadline: ${listForm.headline}\nIP Valuation: $${listForm.ip_valuation}\nFunding Ask: $${listForm.funding_ask} for ${listForm.equity_offered}%\n\nProblem: ${listForm.problem_statement}\nSolution: ${listForm.solution_summary}`
    });
    setListSubmitted(true);
    setSubmittingList(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <Briefcase size={14} className="text-yellow-400" /> IP Marketplace
            </h1>
            <p className="text-gray-500 text-xs">Private brokered IP exchange · Anonymous buyers · 5% commission on deals</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setShowInventorSignup(true)}
             className="flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-indigo-900/40 border-indigo-700 text-indigo-300 hover:bg-indigo-900/60 text-xs font-black transition-all">
             <Users size={12} /> Become an Inventor
           </button>
           <button onClick={() => setShowList(l => !l)}
             className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-black transition-all ${
               !showList ? "bg-yellow-900/40 border-yellow-700 text-yellow-300" : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
             }`}>
             <Plus size={12} /> List an Invention
           </button>
         </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gray-900/50 border-b border-gray-800 px-5 py-3">
        <div className="max-w-6xl mx-auto flex items-center gap-6 flex-wrap">
          {[
            { label: "Active Listings", value: filtered.length, color: "#22c55e" },
            { label: "Total IP Value", value: `$${(listings.reduce((s, l) => s + (l.ip_valuation || 0), 0) / 1000000).toFixed(1)}M`, color: "#f59e0b" },
            { label: "Avg Deal Size", value: "$1.2M", color: "#6366f1" },
            { label: "Commission", value: "5% on close", color: "#ec4899" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-black text-base" style={{ color: s.color }}>{s.value}</span>
              <span className="text-gray-600 text-xs">{s.label}</span>
              {i < 3 && <div className="w-px h-4 bg-gray-800 ml-2" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!showList ? (
          /* Listing Form */
          <div className="max-w-2xl mx-auto px-5 py-8">
            {listSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                <h2 className="text-white font-black text-2xl mb-2">Listing Submitted for Review</h2>
                <p className="text-gray-400 text-sm mb-6">Your IP listing will be reviewed within 2 business days. Upon approval it will appear in the marketplace.</p>
                <button onClick={() => { setShowList(true); setListSubmitted(false); }}
                  className="px-6 py-3 rounded-xl bg-gray-800 text-gray-300 font-bold text-sm">← Back to Marketplace</button>
              </div>
            ) : (
              <>
                <h2 className="text-white font-black text-2xl mb-2">List Your Invention</h2>
                <p className="text-gray-500 text-sm mb-6">Your identity remains confidential until mutual NDA execution. ZARP takes a 5% commission only on successfully executed deals.</p>
                <div className="space-y-4 bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  {[
                    { key: "alias", label: "Project Alias / Code Name *", placeholder: "e.g. Project HELIX (keep it anonymous)" },
                    { key: "headline", label: "One-Line Headline *", placeholder: "What does it do and why is it valuable?" },
                    { key: "problem_statement", label: "Problem Statement", placeholder: "What problem does this solve?" },
                    { key: "solution_summary", label: "Solution Summary", placeholder: "How does your invention solve it?" },
                    { key: "market_size", label: "Target Market & Size", placeholder: "e.g. $4.2B global regenerative medicine" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-gray-400 text-xs font-semibold mb-1">{f.label}</label>
                      {f.key === "problem_statement" || f.key === "solution_summary" ? (
                        <textarea value={listForm[f.key]} onChange={e => setListForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder} rows={2}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600 resize-none" />
                      ) : (
                        <input value={listForm[f.key]} onChange={e => setListForm(p => ({ ...p, [f.key]: e.target.value }))}
                          placeholder={f.placeholder}
                          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
                      )}
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold mb-1">Category</label>
                      <select value={listForm.category} onChange={e => setListForm(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600">
                        <option value="">Select…</option>
                        {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold mb-1">Stage</label>
                      <select value={listForm.stage} onChange={e => setListForm(p => ({ ...p, stage: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600">
                        <option value="">Select…</option>
                        {STAGES.filter(s => s !== "All").map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold mb-1">IP Valuation ($)</label>
                      <input type="number" value={listForm.ip_valuation} onChange={e => setListForm(p => ({ ...p, ip_valuation: e.target.value }))}
                        placeholder="e.g. 3200000"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs font-semibold mb-1">Funding Ask ($)</label>
                      <input type="number" value={listForm.funding_ask} onChange={e => setListForm(p => ({ ...p, funding_ask: e.target.value }))}
                        placeholder="e.g. 850000"
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold mb-1">Tags (comma-separated)</label>
                    <input value={listForm.tags} onChange={e => setListForm(p => ({ ...p, tags: e.target.value }))}
                      placeholder="e.g. bioelectromagnetics, EM therapy, regenerative"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
                  </div>
                  <button onClick={handleSubmitListing} disabled={submittingList || !listForm.alias || !listForm.headline || !listForm.category}
                    className="w-full py-3 rounded-xl bg-yellow-700 hover:bg-yellow-600 disabled:opacity-40 text-black font-black text-sm flex items-center justify-center gap-2 transition-all">
                    {submittingList ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    {submittingList ? "Submitting…" : "Submit for Review"}
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Marketplace Browse */
          <div className="max-w-6xl mx-auto px-5 py-5">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-48">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search listings…"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-8 pr-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
              </div>
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-yellow-600">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={stageFilter} onChange={e => setStageFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-yellow-600">
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(l => (
                <ListingCard key={l.id} listing={l} onLOI={setLoiTarget} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Briefcase size={40} className="text-gray-800 mx-auto mb-3" />
                <p className="text-gray-600 font-bold">No listings match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {loiTarget && <LOIModal listing={loiTarget} onClose={() => setLoiTarget(null)} />}
      {showInventorSignup && <InventorSignupModal onClose={() => setShowInventorSignup(false)} />}
    </div>
  );
}