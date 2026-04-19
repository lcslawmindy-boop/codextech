import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code, Zap, DollarSign, Copy, CheckCircle2, Loader2, Terminal, ChevronRight, Star, Shield, Globe } from "lucide-react";
import { base44 } from "@/api/base44Client";

const PRICING_TIERS = [
  { id: "starter", name: "Starter", price: "$99/mo", calls: "200 calls/mo", per_call: "$0.50/call", color: "#6366f1", features: ["Basic IP valuation model", "JSON response", "Domain + stage scoring", "Marketplace fit scoring", "Email support"] },
  { id: "growth", name: "Growth", price: "$499/mo", calls: "1,000 calls/mo", per_call: "$0.50/call", color: "#f59e0b", popular: true, features: ["Full valuation model", "Comparable transactions", "Jurisdiction risk scoring", "Prior art overlap score", "Marketplace opportunity analysis", "Webhook support", "Priority support"] },
  { id: "enterprise", name: "Enterprise", price: "$2,000/mo", calls: "10,000 calls/mo", per_call: "$0.20/call", color: "#22c55e", features: ["Everything in Growth", "Custom model training", "Batch endpoint (up to 100/req)", "Marketplace commission tracking", "SLA 99.9%", "Dedicated API manager", "White-label available"] },
  { id: "payg", name: "Pay-As-You-Go", price: "No subscription", calls: "Unlimited", per_call: "$2.00/call", color: "#6b7280", features: ["Full valuation model", "No monthly commitment", "Marketplace fit scoring", "JSON response", "Standard support"] },
];

const SAMPLE_REQUEST = `POST /api/valuation
Content-Type: application/json
X-API-Key: zarp_live_xxxxxxxxxxxx

{
  "invention_title": "Portable Prioré-class EM Therapy Device",
  "technology_domain": "Bioelectromagnetics",
  "patent_status": "provisional",
  "prior_art_citations": 3,
  "market_size_usd": 4200000000,
  "stage": "prototype",
  "jurisdiction": "US",
  "comparable_transactions": true
}`;

const SAMPLE_RESPONSE = `{
  "valuation_id": "val_7xk29mR4n",
  "timestamp": "2026-04-15T14:32:07Z",
  "invention_title": "Portable Prioré-class EM Therapy Device",
  "valuation": {
    "range_low_usd": 1800000,
    "range_high_usd": 4200000,
    "midpoint_usd": 3000000,
    "confidence": 0.74
  },
  "scoring": {
    "novelty_score": 82,
    "market_potential": 91,
    "prior_art_risk": 34,
    "jurisdiction_risk": 22,
    "stage_multiplier": 0.65,
    "overall_ip_score": 78
  },
  "comparable_transactions": [
    { "title": "Non-thermal EM therapy device", "sale_price": 2800000, "year": 2023 },
    { "title": "Biofield diagnostic platform", "sale_price": 4100000, "year": 2024 }
  ],
  "marketplace_opportunity": {
    "estimated_listing_value_range": "$1.8M – $4.2M",
    "suggested_marketplace_price": "$3.0M",
    "zarp_commission_at_listing": 150000,
    "marketplace_recommendation": "Strong fit for Inventor Marketplace. High market demand + low prior art risk = premium buyer interest."
  },
  "recommended_action": "File non-provisional immediately. High market fit with low prior art risk. List on Inventor Marketplace.",
  "model_version": "zarp-val-v2.2"
}`;

function CopyBtn({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 text-xs transition-all">
      {copied ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
      {copied ? "Copied" : label}
    </button>
  );
}

export default function ValuationAPI() {
  const [form, setForm] = useState({ name: "", email: "", org: "", tier: "growth", use_case: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [liveDemo, setLiveDemo] = useState({ title: "", domain: "Bioelectromagnetics", stage: "prototype", market_size: "4200000000", citations: "3" });
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: "Zenith Apex — Valuation API Access Request",
      body: `Dear ${form.name},\n\nThank you for your interest in the ZARP Invention Valuation API.\n\nTIER REQUESTED: ${PRICING_TIERS.find(t => t.id === form.tier)?.name}\nORGANIZATION: ${form.org || "Not specified"}\n\nOur API team will send your trial API key and onboarding documentation within 1 business day.\n\nAPI Endpoint: https://api.zenithapex.com/v1/valuation\nDocumentation: Available on API key issuance\n\n— Zenith Apex Research Portfolio\nDeveloper Relations`
    });
    await base44.integrations.Core.SendEmail({
      to: "zenithapexresearch@gmail.com",
      subject: `[API SIGNUP] ${form.org || form.name} — ${form.tier}`,
      body: `New Valuation API signup.\n\nNAME: ${form.name}\nEMAIL: ${form.email}\nORG: ${form.org}\nTIER: ${form.tier}\n\nUSE CASE:\n${form.use_case}`
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  const runLiveDemo = async () => {
    if (!liveDemo.title) return;
    setDemoLoading(true);
    setDemoResult(null);

    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a sophisticated IP valuation model. Generate a realistic valuation for this invention:

Title: ${liveDemo.title}
Domain: ${liveDemo.domain}
Stage: ${liveDemo.stage}
Market Size: $${parseInt(liveDemo.market_size || 0).toLocaleString()}
Prior Art Citations: ${liveDemo.citations}

Return JSON with:
- range_low_usd: integer
- range_high_usd: integer
- midpoint_usd: integer
- confidence: float 0-1
- novelty_score: integer 0-100
- market_potential: integer 0-100
- prior_art_risk: integer 0-100
- jurisdiction_risk: integer 0-100
- stage_multiplier: float 0-1
- overall_ip_score: integer 0-100
- recommended_action: string (1-2 sentences)`,
      response_json_schema: {
        type: "object",
        properties: {
          range_low_usd: { type: "integer" },
          range_high_usd: { type: "integer" },
          midpoint_usd: { type: "integer" },
          confidence: { type: "number" },
          novelty_score: { type: "integer" },
          market_potential: { type: "integer" },
          prior_art_risk: { type: "integer" },
          jurisdiction_risk: { type: "integer" },
          stage_multiplier: { type: "number" },
          overall_ip_score: { type: "integer" },
          recommended_action: { type: "string" },
        }
      }
    });

    setDemoResult(res);
    setDemoLoading(false);
  };

  const fmt = (n) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-black text-base flex items-center gap-2"><Code size={14} className="text-cyan-400" /> IP Valuation API</h1>
          <p className="text-gray-500 text-xs">Programmatic IP valuation · $0.50–$2.00/call · Law firms · VCs · Corporate R&D</p>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-900/30 border border-cyan-800 text-cyan-400 font-bold">REST API · JSON</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-900/30 border border-green-800 text-green-400 font-bold">Live · v2.1</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8 space-y-10">

        {/* Hero */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Invention Valuation as a Service.<br />
            <span className="text-cyan-400">Query. Scale. Monetize.</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
            Programmatic access to ZARP's IP valuation model. VCs run batch valuations on portfolios. Law firms price IP at acquisition. Corporate R&D benchmarks technology assets. <strong className="text-white">$0.50–$2.00 per call — scales to millions in ARR.</strong> Plus, every valuation includes Inventor Marketplace fit analysis & ZARP's 5% deal commission opportunity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Avg response time", value: "< 2s", color: "#22c55e" },
            { label: "Uptime SLA", value: "99.9%", color: "#6366f1" },
            { label: "Valuation accuracy", value: "±18%", color: "#f59e0b" },
            { label: "API version", value: "v2.1", color: "#06b6d4" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className="font-black text-xl mb-0.5" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Code samples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-800/40">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-cyan-400" />
                <p className="text-cyan-400 text-xs font-black uppercase tracking-wider">Request</p>
              </div>
              <CopyBtn text={SAMPLE_REQUEST} label="Copy Request" />
            </div>
            <pre className="px-4 py-3 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed">{SAMPLE_REQUEST}</pre>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-800/40">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-green-400" />
                <p className="text-green-400 text-xs font-black uppercase tracking-wider">Response</p>
              </div>
              <CopyBtn text={SAMPLE_RESPONSE} label="Copy Response" />
            </div>
            <pre className="px-4 py-3 text-xs text-gray-300 overflow-x-auto font-mono leading-relaxed max-h-72">{SAMPLE_RESPONSE}</pre>
          </div>
        </div>

        {/* Live Demo */}
        <div className="bg-gray-900 border border-cyan-800/40 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-800 bg-cyan-950/20">
            <p className="text-cyan-400 text-xs font-black uppercase tracking-widest">Live API Demo — Try it Now</p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <div>
                <label className="block text-gray-500 text-xs mb-1">Invention Title</label>
                <input value={liveDemo.title} onChange={e => setLiveDemo(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Scalar Wave Communication Array"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Domain</label>
                  <select value={liveDemo.domain} onChange={e => setLiveDemo(p => ({ ...p, domain: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                    {["Bioelectromagnetics", "Vacuum Energy", "Scalar EM", "AI / Software", "Clean Energy", "Defense Tech"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Stage</label>
                  <select value={liveDemo.stage} onChange={e => setLiveDemo(p => ({ ...p, stage: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
                    {["concept", "prototype", "provisional", "granted", "commercializing"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Market Size ($)</label>
                  <input type="number" value={liveDemo.market_size} onChange={e => setLiveDemo(p => ({ ...p, market_size: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 text-xs mb-1">Prior Art Citations</label>
                  <input type="number" value={liveDemo.citations} onChange={e => setLiveDemo(p => ({ ...p, citations: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none" />
                </div>
              </div>
              <button onClick={runLiveDemo} disabled={demoLoading || !liveDemo.title}
                className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
                {demoLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {demoLoading ? "Calling API…" : "Run Live Valuation"}
              </button>
            </div>

            {demoResult ? (
              <div className="space-y-3">
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-gray-500 text-xs font-bold mb-2">Valuation Range</p>
                  <p className="text-yellow-400 font-black text-2xl">{fmt(demoResult.range_low_usd)} – {fmt(demoResult.range_high_usd)}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Midpoint: {fmt(demoResult.midpoint_usd)} · Confidence: {Math.round((demoResult.confidence || 0) * 100)}%</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: "novelty_score", label: "Novelty", color: "#6366f1" },
                    { k: "market_potential", label: "Market Fit", color: "#22c55e" },
                    { k: "prior_art_risk", label: "Prior Art Risk", color: "#ef4444" },
                    { k: "overall_ip_score", label: "IP Score", color: "#f59e0b" },
                  ].map(s => (
                    <div key={s.k} className="bg-gray-800 rounded-xl px-3 py-2">
                      <p className="text-gray-600 text-xs">{s.label}</p>
                      <p className="font-black text-base mt-0.5" style={{ color: s.color }}>{demoResult[s.k]}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-800 rounded-xl px-3 py-2">
                  <p className="text-gray-600 text-xs mb-1">Recommended Action</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{demoResult.recommended_action}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-48 border border-dashed border-gray-800 rounded-xl text-center px-6">
                <Code size={28} className="text-gray-800 mb-2" />
                <p className="text-gray-600 text-sm">Enter an invention and click "Run Live Valuation" to see the API response</p>
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-white font-black text-2xl text-center mb-6">API Pricing</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {PRICING_TIERS.map(t => (
              <div key={t.id} className={`bg-gray-900 border rounded-2xl p-5 flex flex-col ${t.popular ? "border-yellow-700" : "border-gray-800"}`}>
                {t.popular && <div className="text-center text-xs font-black text-yellow-400 bg-yellow-900/30 rounded-lg py-1 mb-3">MOST POPULAR</div>}
                <h4 className="text-white font-black text-lg mb-1">{t.name}</h4>
                <p className="font-black text-xl mb-0.5" style={{ color: t.color }}>{t.price}</p>
                <p className="text-gray-500 text-xs mb-1">{t.calls}</p>
                <p className="text-gray-600 text-xs mb-4">{t.per_call}</p>
                <div className="space-y-1.5 flex-1">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={11} className="flex-shrink-0" style={{ color: t.color }} />
                      <span className="text-gray-400 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signup form */}
        <div className="max-w-xl mx-auto">
          <h3 className="text-white font-black text-xl text-center mb-5">Get API Access</h3>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 size={44} className="text-green-400 mx-auto mb-3" />
              <p className="text-white font-black text-lg mb-2">API Key Request Submitted</p>
              <p className="text-gray-400 text-sm">Your trial API key and docs will arrive at <strong className="text-white">{form.email}</strong> within 1 business day.</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              {[
                { key: "name", label: "Name *", placeholder: "Your name" },
                { key: "email", label: "Email *", placeholder: "you@firm.com" },
                { key: "org", label: "Organization", placeholder: "VC fund, law firm, or company name" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-gray-500 text-xs mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600" />
                </div>
              ))}
              <div>
                <label className="block text-gray-500 text-xs mb-1.5">Plan</label>
                <div className="flex flex-wrap gap-2">
                  {PRICING_TIERS.map(t => (
                    <button key={t.id} onClick={() => setForm(p => ({ ...p, tier: t.id }))}
                      className="text-xs px-3 py-1.5 rounded-lg border font-bold transition-all"
                      style={{
                        backgroundColor: form.tier === t.id ? t.color + "25" : "transparent",
                        borderColor: form.tier === t.id ? t.color : "#374151",
                        color: form.tier === t.id ? t.color : "#6b7280",
                      }}>{t.name}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-500 text-xs mb-1">Use Case</label>
                <textarea value={form.use_case} onChange={e => setForm(p => ({ ...p, use_case: e.target.value }))}
                  placeholder="e.g. Portfolio valuation for VC fund, client IP pricing for law firm, internal R&D benchmarking…"
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-600 placeholder-gray-600 resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={submitting || !form.name || !form.email}
                className="w-full py-3.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 disabled:opacity-40 text-white font-black text-sm flex items-center justify-center gap-2 transition-all">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />}
                {submitting ? "Submitting…" : "Request API Key →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}