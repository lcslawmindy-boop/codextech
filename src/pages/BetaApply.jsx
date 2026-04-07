import { useState } from "react";
import { Shield, Lock, Check, Loader2, ChevronRight, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

const BACKGROUNDS = [
  "Independent Researcher", "Patent Attorney / IP Firm", "Defense / Government",
  "Biotech / Pharma", "Energy / Utilities", "Investor / VC",
  "University / Academic", "Engineer / Scientist", "Entrepreneur", "Other"
];

const INTERESTS = [
  "Build Plans / Hardware", "Course Library", "Research Membership",
  "IP / Patent Tools", "Investor Package", "All of the Above"
];

const BUDGETS = ["Under $200", "$200–$500", "$500–$2,000", "$2,000–$10,000", "$10,000+"];

const BENEFITS = [
  { icon: "🔬", title: "5 Invention Build Plans", desc: "MEG, TRD-1, G-Com, Prioré System, TRZ Reactor — full BOMs & assembly guides" },
  { icon: "📋", title: "AI Patent Drafting Tool", desc: "Unlimited provisional patent generation with prior art cross-referencing" },
  { icon: "📚", title: "Full Course Library Access", desc: "10 courses covering scalar EM, bioelectromagnetics, USPTO strategy & more" },
  { icon: "💼", title: "Investor Package", desc: "Due diligence pack, NDA templates, acquisition letter — $3.9M–$11.5M valuation" },
  { icon: "⚡", title: "AI Invention Forge", desc: "Generate novel scalar EM inventions with IP valuation + 5-year financials" },
  { icon: "🛡️", title: "Beta Pricing — Locked Forever", desc: "Your rate is grandfathered even after public launch price increases" },
];

export default function BetaApply() {
  const [form, setForm] = useState({
    full_name: "", email: "", background: "", why_interested: "",
    primary_interest: "", budget: "", nda_signed: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.background || !form.why_interested || !form.nda_signed) {
      setError("Please complete all required fields and agree to the NDA.");
      return;
    }
    setSubmitting(true);
    setError("");

    const existing = await base44.entities.BetaApplication.filter({ email: form.email });
    if (existing.length > 0) {
      setError("This email has already applied. Check your inbox for updates.");
      setSubmitting(false);
      return;
    }

    await base44.entities.BetaApplication.create({ ...form, status: "approved", converted_at: new Date().toISOString() });

    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: "✅ Zenith Apex — You Have Access",
      body: `Dear ${form.full_name},\n\nWelcome to the Zenith Apex Research Platform. Your NDA has been recorded and your founding member access is now active.\n\nYou can log in immediately at the platform URL. Your founding member pricing is grandfathered for life.\n\nWhat you now have access to:\n• 5 Invention Build Plans (MEG, TRD-1, G-Com, Prioré, TRZ Reactor)\n• AI Patent Drafting Tool (unlimited provisionals)\n• Full 10-Course Library\n• Investor Package ($3.9M–$11.5M valuation deck)\n• AI Invention Forge\n• Prior Art Archive & IP Monitoring\n\nThis platform is confidential. Do not share your credentials or platform content. Violation subjects you to liquidated damages as agreed in the NDA.\n\n— Zenith Apex Research Portfolio`
    });

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-900/40 border-2 border-green-600 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-400" />
          </div>
          <h1 className="text-white font-black text-2xl mb-3">Access Granted — Welcome!</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Your NDA is on file and your founding member access is <strong className="text-green-400">active immediately</strong>. Check your inbox for the welcome email with full platform details.
          </p>
          <div className="bg-yellow-950/30 border border-yellow-800 rounded-2xl p-5 text-left">
            <p className="text-yellow-400 font-bold text-sm mb-2">🔒 Confidentiality Reminder</p>
            <p className="text-yellow-200 text-xs leading-relaxed">Your NDA is now active. Do not share platform content, credentials, or research materials. Your access is tied to your email address and non-transferable.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="border-b border-yellow-900/40 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-4xl mx-auto px-5 py-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-950/60 border border-green-800 text-green-400 text-xs font-black mb-5 uppercase tracking-widest">
            <Shield size={11} /> NDA-Gated Access — Open Enrollment
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Apply for Early Access<br />
            <span className="text-yellow-400">Zenith Apex Research Platform</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-3">
            Sign the NDA, complete your profile, and get <strong className="text-white">immediate access</strong> to the full Zenith Apex research platform. Founding member pricing locked forever.
          </p>
          <p className="text-gray-600 text-sm">NDA required · Instant access after sign-up · Founding 349 pricing</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Benefits */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">What Beta Members Get</h2>
          <div className="space-y-4 mb-8">
            {BENEFITS.map((b, i) => (
              <div key={i} className="flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <span className="text-2xl flex-shrink-0">{b.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{b.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-yellow-500 fill-yellow-500" />)}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed italic mb-3">
              "The patent drafting tool alone saved me $3,000 in attorney fees. The prior art archive is unlike anything publicly available. If you get a beta invite — take it."
            </p>
            <p className="text-gray-600 text-xs">— D.R., Independent Researcher (early access tester)</p>
          </div>
        </div>

        {/* Application form */}
        <div>
          <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Shield size={16} className="text-yellow-400" />
              <h2 className="text-white font-black text-lg">Get Instant Access</h2>
              <span className="ml-auto text-xs px-2 py-0.5 rounded bg-yellow-900/40 border border-yellow-800 text-yellow-400 font-bold">NDA Required</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Full Name *</label>
                <input
                  value={form.full_name}
                  onChange={e => set("full_name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Email Address *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Professional Background *</label>
                <select
                  value={form.background}
                  onChange={e => set("background", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600"
                >
                  <option value="">Select your background</option>
                  {BACKGROUNDS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Primary Interest *</label>
                <select
                  value={form.primary_interest}
                  onChange={e => set("primary_interest", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600"
                >
                  <option value="">What are you most interested in?</option>
                  {INTERESTS.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Budget Range</label>
                <select
                  value={form.budget}
                  onChange={e => set("budget", e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600"
                >
                  <option value="">Select budget range</option>
                  {BUDGETS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-semibold mb-1.5">Why are you interested? *</label>
                <textarea
                  value={form.why_interested}
                  onChange={e => set("why_interested", e.target.value)}
                  placeholder="Brief description of your research interest, use case, or how you plan to use this platform..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600 resize-none"
                />
              </div>

              {/* NDA checkbox */}
              <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => set("nda_signed", !form.nda_signed)}
                    className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${form.nda_signed ? "bg-yellow-600 border-yellow-600" : "border-gray-600"}`}
                  >
                    {form.nda_signed && <Check size={12} className="text-black" />}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold leading-snug">I agree to the Zenith Apex Mutual NDA *</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">I understand this platform contains confidential research. I will not share, reproduce, or distribute any content. Violation subjects me to liquidated damages of $2.5M per incident.</p>
                  </div>
                </label>
              </div>

              {error && (
                <p className="text-red-400 text-xs bg-red-950/30 border border-red-800 rounded-xl px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-black font-black text-base disabled:opacity-60 transition-all shadow-[0_4px_24px_rgba(200,160,0,0.3)]"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={18} />}
                {submitting ? "Creating Your Access…" : "Sign NDA & Get Instant Access"}
              </button>

              <p className="text-gray-600 text-xs text-center">No payment required · Instant access after sign-up · NDA enforced</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}