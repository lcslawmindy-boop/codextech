import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2, Lock } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FEATURES = [
  "Full research database (40+ patents analyzed)",
  "8 structured research modules (80+ hours)",
  "Build-ready engineering specifications & BOMs",
  "AI Patent Drafting Tool — USPTO-compliant",
  "Prior Art Archive (200+ entries)",
  "Scalar EM Lab Simulator",
  "IP Marketplace access",
  "Patent Claims Generator",
  "Community forum access",
  "Monthly research updates",
];

const CONTENT_SECTIONS = [
  { title: "Patent Archive", items: ["40+ US patents", "Prosecution history", "Citation tracking", "Engineering implications"] },
  { title: "Engineering Systems", items: ["Complete device specs", "Bill of Materials", "Assembly procedures", "Measurement protocols"] },
  { title: "Research Library", items: ["Peer-reviewed journals", "Declassified documents", "DARPA technical reports", "Primary sources only"] },
  { title: "IP Tools", items: ["Patent drafting (AI)", "Claims generator", "FTO analysis", "Prior art search"] },
];

export default function PaywallPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: "Research Membership",
      priceInCents: 4900,
      mode: "subscription",
      interval: "month",
      successUrl: `${origin}/post-purchase`,
      cancelUrl: `${origin}/paywall`,
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!email) return;
    try { await base44.entities.NewsletterSubscriber.create({ email, source: "paywall_interest", status: "active" }); } catch {}
    setEmailDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
            <span className="hidden sm:block text-sm">Zenith Apex Technology</span>
          </Link>
          <Link to="/member-dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16 text-center border-b border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-black mb-5 uppercase tracking-widest">
            <Lock size={10} /> Research Membership
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Unlock the Full Platform
          </h1>
          <p className="text-gray-400 text-lg mb-2">40+ patents · 200+ sources · 8 research modules · AI patent tools</p>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
            Everything you need to research, build, patent, and commercialize electromagnetic inventions. One membership. Cancel anytime.
          </p>

          <div className="flex items-end justify-center gap-2 mb-6">
            <span className="text-6xl font-black text-white">$49</span>
            <span className="text-gray-400 pb-2 text-xl">/month</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-black text-white text-lg disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 32px rgba(0,200,255,0.35)" }}
          >
            {loading ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <>Start Membership — $49/mo <ArrowRight size={18} /></>}
          </button>
          <p className="text-gray-600 text-xs mt-3">Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-10 bg-gray-900/30 border-b border-gray-800">
        <div className="max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-6 gap-5 text-center">
          {[
            { v: "40+", l: "Patents" }, { v: "200+", l: "Publications" }, { v: "8", l: "Modules" },
            { v: "6", l: "Build Systems" }, { v: "12", l: "AI Tools" }, { v: "100%", l: "Primary Sources" },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-2xl font-black text-cyan-400 mb-1">{s.v}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wide">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content sections */}
      <section className="px-6 py-16 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {CONTENT_SECTIONS.map((sec, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-black text-base mb-4">{sec.title}</h3>
                <ul className="space-y-2">
                  {sec.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-cyan-400 mt-0.5">→</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features checklist */}
      <section className="px-6 py-16 border-b border-gray-800 bg-gray-900/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-8">Everything Included at $49/mo</h2>
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white text-base disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)" }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Processing...</> : <>Get Access Now — $49/mo <ArrowRight size={16} /></>}
            </button>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="px-6 py-14 border-b border-gray-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Not ready yet?</h2>
          <p className="text-gray-400 text-sm mb-6">Get the free MEG research primer — 12 pages of theory, citations, and engineering context.</p>
          {emailDone ? (
            <p className="text-green-400 font-bold text-sm">Check your inbox for the free primer.</p>
          ) : (
            <form onSubmit={handleEmail} className="flex gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-600"
              />
              <button type="submit" className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-colors whitespace-nowrap">
                Send It
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · Electromagnetic Research Database</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refunds</Link>
          <Link to="/research-disclaimer" className="hover:text-gray-400">Disclaimer</Link>
        </div>
      </footer>
    </div>
  );
}