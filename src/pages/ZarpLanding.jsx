import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Check, ChevronRight, BookOpen, Zap, Shield, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { businessItems } from "@/lib/businessItems";

const courses = businessItems.filter(i => i.category === "Course").slice(0, 6);

const TOPICS = [
  { emoji: "⚡", title: "Scalar Electromagnetics", desc: "From Maxwell's suppressed equations to practical scalar wave engineering." },
  { emoji: "🧬", title: "Bioelectromagnetics", desc: "Kaznacheyev, Rife, Prioré — disease, healing, and EM biology." },
  { emoji: "🔮", title: "Vacuum Energy & MEG", desc: "Peer-reviewed COP>1 devices, anenergy pumps, and overunity circuits." },
  { emoji: "🧠", title: "Consciousness & Physics", desc: "T-field, orthorotation, mind-body coupling — rigorous models." },
  { emoji: "📜", title: "Patent Strategy", desc: "AI-powered USPTO provisional drafting in minutes." },
  { emoji: "☁️", title: "Atmospheric Scalar EM", desc: "Sky photography, Woodpecker grid, and interference patterns." },
];

const TESTIMONIALS = [
  { quote: "The MEG course alone changed how I think about EM physics. Every claim traces back to a peer-reviewed source.", name: "R.K.", role: "Electrical Engineer, TX" },
  { quote: "Generated my full provisional patent in one session. My attorney called it the best pre-draft she'd ever seen.", name: "A.S.", role: "Independent Inventor" },
  { quote: "20 years studying Bearden. This is the only platform that structures it into something you can actually build from.", name: "M.T.", role: "Independent Researcher" },
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
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-10 w-10 object-contain" />
          <span className="font-black text-lg tracking-tight hidden sm:block">C.O.D.E.X.T.E.C.H.</span>
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/courses" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Courses</Link>
          <Link to="/prior-art" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Research Archive</Link>
          <Link to="/community" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">Community</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/courses" className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">Browse Courses</Link>
          <Link to="/pricing" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors">
            Get Access
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-black mb-6 uppercase tracking-widest">
          <BookOpen size={11} /> Scalar EM · Bioelectromagnetics · Vacuum Energy Research
        </div>
        <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-5">
          The Research Platform<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            for Advanced EM Science.
          </span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
          Structured courses, primary-source research archive, and AI tools — all built on peer-reviewed papers, granted patents, and declassified documents. No speculation. All source-cited.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">
          Learn Bearden's scalar EM framework. Study Prioré, Kaznacheyev, MEG. File your own patents. Join a community of serious researchers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
            Browse Courses <ArrowRight size={18} />
          </Link>
          <Link to="/prior-art" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all">
            <Search size={16} /> Research Archive
          </Link>
        </div>
        <p className="text-xs text-gray-600">✓ Instant access · Cancel anytime · Secured by Stripe</p>
      </section>

      {/* ── Topics ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-2">What You'll Study</h2>
          <p className="text-gray-500 text-center text-sm mb-10">Every course sourced from primary documents — patents, peer-reviewed papers, and declassified archives.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOPICS.map((t, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start gap-4 hover:border-gray-600 transition-all">
                <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{t.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black mb-1">Featured Courses</h2>
            <p className="text-gray-500 text-sm">From foundational theory to advanced device engineering</p>
          </div>
          <Link to="/courses" className="hidden sm:flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold text-sm transition-colors">
            All courses <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {courses.map((c, i) => (
            <Link key={i} to="/courses" className="group bg-gray-900 border border-gray-800 hover:border-cyan-800 rounded-2xl p-5 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{c.icon}</span>
                <span className="text-green-400 font-bold text-sm">{c.price}</span>
              </div>
              <h3 className="text-white font-bold text-base leading-snug mb-2 flex-1">{c.title}</h3>
              <p className="text-xs italic mb-3" style={{ color: c.color }}>"{c.tagline}"</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                {c.modules.length > 0 && <span>{c.modules.length} modules</span>}
                <span className="text-gray-700">·</span>
                <span>Instant access</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all text-sm">
            View All Courses <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Research Archive CTA ── */}
      <section className="px-6 py-14 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Search size={18} className="text-purple-400" />
              <span className="text-purple-300 font-black text-sm uppercase tracking-widest">Research Archive</span>
            </div>
            <h2 className="text-2xl font-black mb-3">200+ Primary Source Entries</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Prior art database covering the full Bearden archive — patents, peer-reviewed papers, declassified documents, suppressed devices, and failure analysis. Every entry source-cited.
            </p>
            <div className="flex flex-wrap gap-2 mb-5">
              {["Scalar EM", "Vacuum Energy", "Bioelectromagnetics", "Free Energy", "Tesla Tech", "Phase Conjugation"].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-xs">{tag}</span>
              ))}
            </div>
            <Link to="/prior-art" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm transition-colors">
              Browse Research Archive <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-shrink-0 grid grid-cols-2 gap-3 text-center">
            {[
              { n: "200+", label: "Archive Entries" },
              { n: "40+", label: "Courses" },
              { n: "100%", label: "Source-Cited" },
              { n: "1880s–Now", label: "Time Span" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl py-4 px-5">
                <div className="text-2xl font-black text-cyan-400">{s.n}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why This Platform ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">Why C.O.D.E.X.T.E.C.H.</h2>
        <p className="text-gray-500 text-center text-sm mb-12">The only platform that treats this research seriously</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: <Shield size={20} className="text-cyan-400" />, title: "Source-Documented", desc: "Every claim links to the original patent, peer-reviewed paper, or declassified document. No speculation." },
            { icon: <BookOpen size={20} className="text-purple-400" />, title: "Structured Learning", desc: "Not a YouTube channel. Proper courses with modules, curriculum, and progressive depth." },
            { icon: <Zap size={20} className="text-yellow-400" />, title: "Execution-Focused", desc: "Courses end with practical applications — patent drafting, device plans, experiment design." },
          ].map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
              <div className="flex justify-center mb-3">{f.icon}</div>
              <h3 className="text-white font-black text-base mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">From Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, j) => (
                  <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />
                ))}</div>
                <p className="text-gray-200 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Email Capture ── */}
      <section className="px-6 py-16 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-black mb-2">Free Research Digest</h2>
        <p className="text-gray-400 text-sm mb-6">Weekly summaries of new archive entries, course releases, and primary source findings. No fluff.</p>
        {emailDone ? (
          <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
            <Check size={18} /> You're subscribed — check your inbox.
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500" />
            <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm whitespace-nowrap transition-colors">
              Subscribe →
            </button>
          </form>
        )}
        <p className="text-gray-700 text-xs mt-3">No spam. Unsubscribe anytime.</p>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Start Learning Today</h2>
          <p className="text-gray-400 mb-8 text-sm">Instant access to 40+ courses, 200+ research entries, AI patent tools, and a private engineering community.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-5">
            <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
              Browse Courses <ArrowRight size={18} />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all">
              View Membership Plans
            </Link>
          </div>
          <p className="text-gray-600 text-xs">🔒 Stripe · SSL · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering Research Platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/courses" className="hover:text-gray-400">Courses</Link>
          <Link to="/prior-art" className="hover:text-gray-400">Research Archive</Link>
          <Link to="/pricing" className="hover:text-gray-400">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}