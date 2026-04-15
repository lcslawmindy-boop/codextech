import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Check, ChevronRight, Shield, Zap, FileText, Mail, Star, DollarSign, Users, Globe, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIERS = [
  {
    id: "starter_saas",
    name: "Starter SaaS",
    price: "$10,000",
    priceSuffix: "/ year per seat",
    badge: "Entry",
    color: "#6366f1",
    tagline: "For solo IP attorneys and boutique patent firms",
    features: [
      "White-label AI Patent Drafting Tool (your brand)",
      "Up to 3 attorney seats",
      "Unlimited provisional patent drafts",
      "Prior Art Archive access (200+ entries)",
      "Client portal for draft sharing",
      "Custom domain + logo",
      "Email support (48h response)",
    ],
    ideal_for: "Solo IP attorneys · Boutique patent firms",
  },
  {
    id: "professional_saas",
    name: "Professional SaaS",
    price: "$25,000",
    priceSuffix: "/ year",
    badge: "Most Popular",
    color: "#f59e0b",
    popular: true,
    tagline: "For mid-size IP firms (5–20 attorneys)",
    features: [
      "Everything in Starter, plus:",
      "Up to 15 attorney seats",
      "VDR Portal — white-labeled for client due diligence",
      "AI FTO Analysis Tool (unlimited reports)",
      "IP Monitoring & Alerting system",
      "Client-facing branded onboarding flow",
      "API access for CRM/DMS integration",
      "Quarterly platform updates",
      "Priority support (8h SLA)",
    ],
    ideal_for: "Mid-size IP firms · Legal tech boutiques",
  },
  {
    id: "enterprise_saas",
    name: "Enterprise SaaS",
    price: "$50,000",
    priceSuffix: "/ year",
    badge: "Full Platform",
    color: "#22c55e",
    tagline: "For large IP firms, law groups, and corporate IP departments",
    features: [
      "Everything in Professional, plus:",
      "Unlimited attorney seats",
      "Full AI Patent Suite (drafting + FTO + landscape)",
      "AI Patent Attorney Chat for clients",
      "Co-Inventor Matching Module",
      "IP Marketplace (white-labeled brokerage)",
      "Custom AI training on your firm's case history",
      "Dedicated technical account manager",
      "Custom integrations (Salesforce, NetDocuments, etc.)",
      "4h SLA, dedicated Slack channel",
      "Co-branding + acquisition option clause",
    ],
    ideal_for: "AmLaw 100 IP departments · Corporate IP divisions · IP holding companies",
  },
  {
    id: "acquisition",
    name: "Acquisition / Full License",
    price: "$6.5M–$18M",
    priceSuffix: "platform transfer",
    badge: "Strategic",
    color: "#a855f7",
    tagline: "Full IP portfolio and platform acquisition",
    features: [
      "Complete platform source code transfer",
      "All 24 invention architectures + engineering files",
      "Founder 90-day knowledge transfer",
      "All AI models and training data",
      "Rebranding and white-label deployment",
      "Revenue share alternative available",
      "Joint Venture equity structure available",
    ],
    ideal_for: "Legal tech acquirers · IP holding companies · Strategic buyers",
  },
];

const MODULES = [
  { icon: <FileText size={18} />, name: "AI Patent Drafting Tool", desc: "USPTO 35 USC 111(b) compliant provisional drafting with 7-step wizard, claim editor, and secure sharing", color: "#6366f1" },
  { icon: <Shield size={18} />, name: "FTO Analysis Engine", desc: "AI Freedom-to-Operate reports — automated patent landscape search, blocking patent identification, risk scoring", color: "#22c55e" },
  { icon: <Zap size={18} />, name: "Prior Art Archive", desc: "200+ curated prior art entries across advanced EM, bioelectromagnetics, vacuum energy, scalar tech with full citations", color: "#f59e0b" },
  { icon: <Lock size={18} />, name: "VDR Portal", desc: "NDA-gated investor data room with page-level tracking, time-on-document analytics, and access revocation", color: "#ec4899" },
  { icon: <Globe size={18} />, name: "IP Monitoring & Alerts", desc: "Real-time alerts on competitor patent filings, regulatory changes, and suppression patterns", color: "#06b6d4" },
  { icon: <Users size={18} />, name: "Client Portal", desc: "Branded client-facing portal for draft review, comment, and e-signature workflow", color: "#a855f7" },
];

const ROI_ITEMS = [
  { metric: "Time to draft provisional", before: "8–12 hours", after: "< 30 minutes", saving: "95% time reduction" },
  { metric: "Cost per FTO analysis", before: "$5,000–$15,000", after: "$0 (AI)", saving: "100% cost eliminated" },
  { metric: "Client onboarding time", before: "2–3 days", after: "Same day (VDR)", saving: "3x faster" },
  { metric: "Prior art research", before: "10–20 hours", after: "< 5 minutes", saving: "99% time reduction" },
];

export default function WhiteLabelSaaS() {
  const [form, setForm] = useState({ name: "", org: "", email: "", role: "", size: "", interest: "", budget: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.org) return;
    setSubmitting(true);
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: "Zenith Apex — White-Label SaaS Inquiry Received",
      body: `Dear ${form.name},\n\nThank you for your interest in the Zenith Apex White-Label IP Platform.\n\nWe've received your inquiry for:\nTier: ${selectedTier ? TIERS.find(t => t.id === selectedTier)?.name : "Not specified"}\nOrganization: ${form.org}\nFirm Size: ${form.size}\n\nOur team will reach out within 1 business day to schedule a platform demo and discuss customization options.\n\nIn the meantime, you can review the full module catalog and pricing on the platform.\n\n— Zenith Apex Research Portfolio\nEnterprise Sales`
    });
    await base44.integrations.Core.SendEmail({
      to: "zenithapexresearch@gmail.com",
      subject: `[WHITE-LABEL INQUIRY] ${form.org} — ${TIERS.find(t => t.id === selectedTier)?.name || "No tier selected"}`,
      body: `New white-label SaaS inquiry.\n\nNAME: ${form.name}\nORG: ${form.org}\nEMAIL: ${form.email}\nROLE: ${form.role}\nFIRM SIZE: ${form.size}\nTIER OF INTEREST: ${selectedTier}\nBUDGET: ${form.budget}\n\nNOTES:\n${form.interest}`
    });
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center gap-4 sticky top-0 z-20">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-black text-lg">White-Label IP Platform</h1>
          <p className="text-yellow-600 text-xs font-semibold uppercase tracking-widest">For IP Firms · Law Practices · Corporate IP Departments</p>
        </div>
        <div className="ml-auto hidden md:block">
          <span className="text-xs px-3 py-1.5 rounded-full bg-green-900/40 border border-green-700 text-green-400 font-bold">$10K–$50K/yr · Acquirable by Legal Tech</span>
        </div>
      </div>

      {/* Hero */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-5 py-14">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800 text-indigo-400 text-xs font-black mb-5 uppercase tracking-widest">
            <Building2 size={11} /> B2B SaaS · White-Label · Full Customization
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            The Full AI Patent & IP Suite.<br />
            <span className="text-yellow-400">Your Brand. Your Clients. Your Revenue.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-3">
            License the Zenith Apex IP platform for your firm — fully white-labeled, customized for your workflow, and deployed as a client-facing SaaS tool. Cuts 95% of drafting time and 100% of FTO research cost.
          </p>
          <p className="text-gray-600 text-sm">Used by independent patent attorneys, boutique IP firms, and corporate IP departments</p>
        </div>
      </div>

      {/* ROI Calculator strip */}
      <div className="bg-gray-900/60 border-b border-gray-800 px-5 py-5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-500 text-xs font-black uppercase tracking-widest mb-4">Platform ROI at a Glance</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ROI_ITEMS.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <p className="text-gray-600 text-xs font-semibold mb-2">{item.metric}</p>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-gray-500 line-through text-xs">{item.before}</span>
                  <ChevronRight size={10} className="text-gray-700" />
                  <span className="text-green-400 font-black text-xs">{item.after}</span>
                </div>
                <p className="text-yellow-400 font-black text-xs">{item.saving}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Modules */}
      <div className="px-5 py-12 max-w-5xl mx-auto">
        <h3 className="text-white font-black text-2xl text-center mb-2">Platform Modules</h3>
        <p className="text-gray-500 text-sm text-center mb-8">All modules are included in Enterprise tier. Starter/Pro include a curated subset.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: m.color }}>{m.icon}</span>
                <p className="text-white font-bold text-sm">{m.name}</p>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="border-t border-gray-800 bg-gray-900/20 px-5 py-12">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-white font-black text-2xl text-center mb-2">SaaS Licensing Tiers</h3>
          <p className="text-gray-500 text-sm text-center mb-8">All tiers include white-labeling, custom domain, and onboarding. Annual contracts.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {TIERS.map(t => (
              <div key={t.id} onClick={() => setSelectedTier(t.id)}
                className={`relative bg-gray-900 rounded-2xl border p-5 cursor-pointer transition-all flex flex-col ${
                  selectedTier === t.id ? "border-yellow-500 ring-1 ring-yellow-700/40" : t.popular ? "border-yellow-800/60" : "border-gray-800 hover:border-gray-700"
                }`}>
                {t.badge && (
                  <div className="text-center text-xs font-black uppercase tracking-widest py-1.5 rounded-lg mb-3"
                    style={{ backgroundColor: t.color + "20", color: t.color }}>
                    {t.badge}
                  </div>
                )}
                <h4 className="text-white font-black text-lg mb-1">{t.name}</h4>
                <p className="text-gray-500 text-xs mb-3">{t.tagline}</p>
                <p className="font-black text-2xl mb-0.5" style={{ color: t.color }}>{t.price}</p>
                <p className="text-gray-600 text-xs mb-4">{t.priceSuffix}</p>
                <div className="space-y-1.5 flex-1">
                  {t.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check size={11} className="flex-shrink-0 mt-0.5" style={{ color: t.color }} />
                      <span className="text-gray-400 text-xs leading-tight">{f}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 text-xs mt-4 border-t border-gray-800 pt-3">{t.ideal_for}</p>
                {selectedTier === t.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 size={16} className="text-yellow-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="border-t border-gray-800 px-5 py-12">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-white font-black text-2xl text-center mb-2">Request a Demo</h3>
          <p className="text-gray-500 text-sm text-center mb-8">We'll schedule a live walkthrough of the full platform and discuss customization for your firm.</p>

          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
              <h4 className="text-white font-black text-xl mb-2">Demo Request Received</h4>
              <p className="text-gray-400 text-sm">We'll reach out to <strong className="text-white">{form.email}</strong> within 1 business day to schedule your platform walkthrough.</p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              {selectedTier && (
                <div className="bg-yellow-950/30 border border-yellow-900/40 rounded-xl p-3 flex items-center justify-between">
                  <p className="text-yellow-300 text-xs font-bold">Selected: {TIERS.find(t => t.id === selectedTier)?.name}</p>
                  <button onClick={() => setSelectedTier(null)} className="text-gray-600 hover:text-gray-400 text-xs">Clear</button>
                </div>
              )}
              {[
                { key: "name", label: "Full Name *", placeholder: "Your name" },
                { key: "org", label: "Organization / Firm *", placeholder: "Firm or company name" },
                { key: "email", label: "Work Email *", placeholder: "you@yourfirm.com" },
                { key: "role", label: "Your Role", placeholder: "e.g. Managing Partner, Chief IP Counsel, CTO" },
                { key: "size", label: "Firm / Department Size", placeholder: "e.g. 1–5, 5–20, 20–100, 100+" },
                { key: "budget", label: "Annual Budget Range", placeholder: "e.g. $10K–$25K, $50K+, open to discuss" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-gray-400 text-xs font-semibold mb-1">{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600" />
                </div>
              ))}
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1">Notes / Questions</label>
                <textarea value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))}
                  placeholder="Any specific modules, integration requirements, or questions…"
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600 resize-none" />
              </div>
              <button onClick={handleSubmit} disabled={submitting || !form.name || !form.email || !form.org}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 disabled:opacity-40 text-black font-black text-base flex items-center justify-center gap-2 transition-all shadow-lg">
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                {submitting ? "Sending…" : "Request a Demo →"}
              </button>
              <p className="text-gray-600 text-xs text-center">We respond within 1 business day · No obligation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}