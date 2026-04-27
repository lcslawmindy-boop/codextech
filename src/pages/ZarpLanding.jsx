import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, Star, Zap, Check, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const NAV_LINKS = [
  { label: "Courses", to: "/courses" },
  { label: "Builds", to: "/invention-plans" },
  { label: "Pricing", to: "/pricing" },
];

const PROBLEMS = [
  "Advanced engineering knowledge locked behind $10K+ courses or paywalls",
  "Build documentation that's incomplete — no BOMs, no sourcing, no supplier links",
  "Patent tools that cost thousands per application with attorneys",
  "No community of serious builders working on unconventional systems",
];

const SOLUTIONS = [
  { icon: "🔧", title: "40+ Complete Build Plans", desc: "Every device includes a full BOM, exact part numbers, supplier links, and step-by-step assembly instructions." },
  { icon: "🎓", title: "26 Structured Courses", desc: "From scalar EM fundamentals to advanced patent strategy — modular, self-paced, execution-focused." },
  { icon: "🛡️", title: "AI Patent Drafting Suite", desc: "Draft USPTO-compliant provisional patents in minutes. Claim generator, FTO analysis, attorney chat." },
  { icon: "📚", title: "200+ Prior Art Entries", desc: "Primary-source documented historical devices, patents, and experiments with failure analysis." },
];

const VALUE_STACK = [
  { label: "40+ Build Systems", value: "$8,000+" },
  { label: "26 Structured Courses", value: "$12,000+" },
  { label: "AI Patent Suite", value: "$3,000+" },
  { label: "Investor Toolkit", value: "$2,500+" },
  { label: "Prior Art Archive", value: "$1,500+" },
];

const COURSE_HIGHLIGHTS = [
  { emoji: "⚡", title: "Scalar EM Fundamentals", desc: "Maxwell's original quaternion equations, the Aharonov-Bohm effect, vacuum engineering." },
  { emoji: "🔬", title: "Bioelectromagnetics 101", desc: "Prioré, Kaznacheyev, biological trigger windows, and EM therapy research." },
  { emoji: "📋", title: "USPTO Provisional Patents", desc: "File your own provisional patent in one session — real priority date established." },
  { emoji: "💡", title: "MEG Device Engineering", desc: "Replicate the Motionless Electromagnetic Generator from US Patent 6,362,718." },
];

const BUILD_HIGHLIGHTS = [
  { emoji: "⚡", title: "MEG Free Energy Device", category: "Energy", cost: "$287", patent: "US 6,362,718" },
  { emoji: "🧬", title: "TRD-1 Telomere Device", category: "Biotech", cost: "$194", patent: "MCCS Protocol" },
  { emoji: "📡", title: "Scalar EM Transmitter", category: "Communications", cost: "$512", patent: "Bearden Series" },
  { emoji: "🌀", title: "Prioré Multichannel System", category: "Bioelectromagnetics", cost: "$349", patent: "FR 1,342,772" },
];

const TESTIMONIALS = [
  { quote: "The MEG build plans alone are worth 10x the membership. Nothing like this exists anywhere else.", name: "R.K.", role: "Electrical Engineer, Austin TX" },
  { quote: "Generated my full provisional patent in one session. My attorney called it the best pre-draft she'd ever seen.", name: "A.S.", role: "Independent Inventor" },
  { quote: "I've studied scalar EM for 20 years. C.O.D.E.X.T.E.C.H. is the only platform that teaches you to build.", name: "M.T.", role: "Independent Researcher" },
];

export default function ZarpLanding() {
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({ email, source: "homepage", status: "active" });
    setEmailDone(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-gray-950/95 backdrop-blur">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png"
            alt="C.O.D.E.X.T.E.C.H."
            className="h-10 w-10 object-contain"
          />
          <span className="font-black text-lg tracking-tight">C.O.D.E.X.T.E.C.H.</span>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-gray-400 hover:text-white transition-colors font-medium">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link to="/free-vault" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
            Free Preview
          </Link>
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors"
          >
            Get Access
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Zap size={11} /> Advanced Engineering Education & Rapid Prototyping
        </div>

        <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-5">
          Learn Advanced Systems.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            Build Real Prototypes.
          </span>
        </h1>

        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
          C.O.D.E.X.T.E.C.H. gives engineers, makers, and researchers complete build systems — full BOMs, sourcing, step-by-step guides, and AI tools for patents and prototyping.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">
          26 structured courses + 40+ complete builds. Source-cited from granted patents and peer-reviewed research.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link
            to="/paywall"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40"
          >
            Unlock the Vault <ArrowRight size={18} />
          </Link>
          <Link
            to="/free-vault"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all"
          >
            Browse Free First
          </Link>
        </div>
        <p className="text-xs text-gray-600">
          ✓ Free vault available · Cancel anytime · Secured by Stripe
        </p>
      </section>

      {/* ── Problem ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-8 text-gray-200">Why advanced engineering is broken</h2>
          <div className="space-y-3">
            {PROBLEMS.map((p, i) => (
              <div key={i} className="flex items-start gap-3 text-left bg-gray-900 border border-gray-800 rounded-xl px-5 py-4">
                <span className="text-red-500 font-black text-sm flex-shrink-0 mt-0.5">✗</span>
                <span className="text-gray-300 text-sm">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">The C.O.D.E.X.T.E.C.H. Solution</h2>
        <p className="text-gray-500 text-center text-sm mb-12 max-w-xl mx-auto">
          Everything you need to learn, build, and file — in one platform.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SOLUTIONS.map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <span className="text-3xl block mb-3">{s.icon}</span>
              <h3 className="text-white font-black text-lg mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Value Stack ── */}
      <section className="px-6 py-14 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">What's inside the vault</h2>
          <div className="space-y-3">
            {VALUE_STACK.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 bg-gray-900 border border-gray-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Check size={14} className="text-cyan-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-green-400 text-sm font-black">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/paywall" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors">
              Unlock Everything <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Course Highlights ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">Course Highlights</h2>
        <p className="text-gray-500 text-center text-sm mb-12">26 structured modules from fundamentals to execution</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {COURSE_HIGHLIGHTS.map((c, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{c.emoji}</span>
              <div>
                <h3 className="text-white font-bold text-sm mb-1">{c.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/courses" className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold text-sm">
            Browse all 26 courses <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Build Highlights ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">Build Highlights</h2>
          <p className="text-gray-500 text-center text-sm mb-12">40+ complete systems — every one source-cited and execution-ready</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {BUILD_HIGHLIGHTS.map((b, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 hover:border-cyan-800 rounded-xl overflow-hidden transition-all group">
                <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-4xl">
                  {b.emoji}
                </div>
                <div className="p-4">
                  <p className="text-xs text-cyan-400 font-bold mb-1">{b.category}</p>
                  <h3 className="text-white font-bold text-sm mb-2 leading-snug">{b.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-xs font-mono">{b.cost}</span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Lock size={10} />
                      <span className="text-xs">Members</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xs mt-1">{b.patent}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/invention-plans" className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold text-sm">
              View all 40+ builds <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">What Builders Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
              <p className="text-white font-bold text-sm">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Get the Free MEG Build Plan</h2>
          <p className="text-gray-400 text-sm mb-6">
            Complete Bill of Materials + assembly overview for the Motionless Electromagnetic Generator (US Patent 6,362,718). No credit card.
          </p>
          {emailDone ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
              <Check size={18} /> Check your inbox — plan is on its way.
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm whitespace-nowrap transition-colors"
              >
                Send Free Plan →
              </button>
            </form>
          )}
          <p className="text-gray-700 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-4">
          Ready to Build?
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Join C.O.D.E.X.T.E.C.H. and get instant access to 26 structured courses, 40+ complete build systems, and the full AI patent suite.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
          <Link
            to="/paywall"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40"
          >
            Unlock the Vault <ArrowRight size={18} />
          </Link>
          <Link
            to="/free-vault"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all"
          >
            Browse Free First
          </Link>
        </div>
        <p className="text-gray-600 text-xs">🔒 Stripe · SSL · Cancel anytime · Instant access</p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering execution platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
          <Link to="/free-vault" className="hover:text-gray-400 transition-colors">Free Vault</Link>
        </div>
      </footer>
    </div>
  );
}