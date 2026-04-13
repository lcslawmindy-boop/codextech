import { useState } from "react";
import { Shield, Check, Loader2, ChevronRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
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
  { icon: "🔬", title: "21 Invention Build Plans", desc: "Full device architectures with Bills of Materials, engineering specs, and step-by-step assembly guides" },
  { icon: "📋", title: "AI Patent Drafting Tool", desc: "Generate USPTO-compliant provisional patent applications with prior art cross-referencing — unlimited" },
  { icon: "📚", title: "Full Course Library", desc: "10+ courses covering advanced EM research, bioelectromagnetics, IP strategy, and USPTO filing procedures" },
  { icon: "💼", title: "Investor Package & CRM", desc: "Due diligence PDF, NDA templates, acquisition letter, and full investor pipeline management" },
  { icon: "⚡", title: "AI Invention Forge", desc: "Generate novel invention concepts grounded in documented EM research — with IP valuation and 5-year financials" },
  { icon: "🛡️", title: "Founding Member Rate — Locked", desc: "Your pricing is grandfathered permanently, even as the platform grows and rates increase" },
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
      subject: "✅ Zenith Apex — Your Access is Active",
      body: `Dear ${form.full_name},\n\nWelcome to the Zenith Apex Research Platform. Your founding member access is now active.\n\nYou can log in immediately at the platform URL.\n\nWhat you now have access to:\n• 5 Invention Build Plans (MEG, TRD-1, G-Com, Prioré, TRZ Reactor)\n• AI Patent Drafting Tool (unlimited provisionals)\n• Full 10-Course Library\n• AI Invention Forge\n• Prior Art Archive & IP Monitoring\n\nIMPORTANT — Legal Notice:\nZenith Apex is an independent research curation and tools platform. All third-party works referenced on this platform (including works by Thomas E. Bearden, ONR reports, and other published materials) remain the copyright of their respective authors and institutions. These are referenced for educational and research purposes. The platform's original software, tools, curation, and compiled indexes are proprietary to Zenith Apex. Please do not share your login credentials.\n\n— Zenith Apex Research Portfolio`
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
          <h1 className="text-white font-black text-2xl mb-3">Account Created — Choose Your Plan</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Your account is ready. Select a membership plan below to unlock the full platform — AI tools, patent drafting, build plans, and investor suite.
          </p>
          <Link
            to="/pricing"
            className="block w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-500 text-black font-black text-base text-center transition-all shadow-[0_4px_24px_rgba(200,160,0,0.3)] mb-4"
          >
            Choose a Plan & Get Access →
          </Link>
          <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 text-left">
            <p className="text-gray-300 font-bold text-sm mb-2">ℹ️ Legal Notice</p>
            <p className="text-gray-400 text-xs leading-relaxed">Zenith Apex is an independent research curation platform. Third-party works referenced here remain the copyright of their respective owners. Do not share your login credentials. The platform's original tools and software are proprietary to Zenith Apex.</p>
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
            <Shield size={11} /> Founding Member Access — Open Enrollment
          </div>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Join Zenith Apex<br />
            <span className="text-yellow-400">Advanced Research & IP Platform</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-3">
            Get <strong className="text-white">immediate access</strong> to the full platform — AI-powered IP generation, patent drafting, device build plans, and investor tools backed by 40+ years of documented EM research.
          </p>
          <p className="text-gray-600 text-sm">Instant access after sign-up · Founding member rate locked permanently · Third-party works referenced under fair use</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Benefits */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">What You Get Immediately</h2>
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
              "The patent drafting tool alone saved me $3,000 in attorney fees. The prior art archive is the most organized cross-referenced collection of advanced EM research I've found anywhere."
            </p>
            <p className="text-gray-600 text-xs">— D.R., Independent Researcher</p>
          </div>
        </div>

        {/* Application form */}
        <div>
          <div className="bg-gray-900 border border-yellow-900/40 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-yellow-400" />
            <h2 className="text-white font-black text-lg">Get Instant Access</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-yellow-900/40 border border-yellow-800 text-yellow-400 font-bold">Founding Member</span>
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
              <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => set("nda_signed", !form.nda_signed)}
                    className={`w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${form.nda_signed ? "bg-yellow-600 border-yellow-600" : "border-gray-600"}`}
                  >
                    {form.nda_signed && <Check size={12} className="text-black" />}
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold leading-snug">I agree to the Zenith Apex Platform Terms *</p>
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                      I understand that Zenith Apex is an independent research curation platform. Third-party works (including Bearden's published books and papers) remain the copyright of their respective owners and are referenced here for educational and research purposes under fair use. I agree not to redistribute the platform's original tools, software, or compiled research indexes. I am accessing this platform for legitimate research purposes.
                    </p>
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
                {submitting ? "Creating Your Access…" : "Create Account & Get Instant Access"}
              </button>

              <p className="text-gray-600 text-xs text-center">No payment required · Instant access after sign-up · Third-party works used under fair use</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}