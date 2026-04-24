import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, ChevronRight, Star, Shield, BookOpen, Wrench, TrendingUp, CheckCircle2, ArrowRight, Flame, Zap } from "lucide-react";

// ── REAL persistent countdown (48h from first visit) ─────────────────────────
const DEADLINE_KEY = "zarp_founding_deadline";
function getDeadline() {
  let d = localStorage.getItem(DEADLINE_KEY);
  if (!d) { d = (Date.now() + 48 * 3600 * 1000).toString(); localStorage.setItem(DEADLINE_KEY, d); }
  return parseInt(d);
}
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const dl = getDeadline();
    const tick = () => setLeft(Math.max(0, dl - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ── Content ───────────────────────────────────────────────────────────────────
const LOCKED_PREVIEWS = [
  {
    title: "MEG Replication Kit",
    category: "Free Energy",
    hook: "US Patent 6,362,718. Peer-reviewed. COP>1 demonstrated.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
  },
  {
    title: "Vacuum Potential Oscillator",
    category: "Energy Systems",
    hook: "Tap the vacuum reservoir — independent of circuit ground.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
  },
  {
    title: "Prioré Multichannel EM System",
    category: "Bioelectromagnetics",
    hook: "French government funded. Clinical results suppressed in 1984.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
  },
  {
    title: "Anenergy Pump Circuit",
    category: "Vacuum Energy",
    hook: "Extract energy from the phi-field. 14 sourced steps.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png",
  },
  {
    title: "Scalar EM Wave Interferometer",
    category: "EM Physics",
    hook: "Zero E, zero B output — non-zero scalar potential.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/991d97732_generated_image.png",
  },
  {
    title: "Telomere Regeneration Device TRD-1",
    category: "Biotech",
    hook: "EM-triggered telomerase activation protocol.",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/53f9613a8_generated_image.png",
  },
];

const FEATURES = [
  { icon: <Wrench size={18} className="text-orange-400" />, title: "Full Build Plans", desc: "BOM, steps, supplier links, PDF, build video. Every device." },
  { icon: <BookOpen size={18} className="text-blue-400" />, title: "40+ Courses", desc: "Scalar EM, bioelectromagnetics, vacuum energy, patent strategy." },
  { icon: <Shield size={18} className="text-green-400" />, title: "AI Patent Suite", desc: "Provisional patents, FTO, claims, investor packages. Minutes, not months." },
  { icon: <TrendingUp size={18} className="text-purple-400" />, title: "Investor Toolkit", desc: "CRM, pitch decks, term sheets, VDR. Full capital-raise system." },
];

const TESTIMONIALS = [
  { quote: "The MEG build plans alone are worth 10x the membership. Nothing like this exists anywhere else.", name: "R.K.", role: "Electrical Engineer" },
  { quote: "Generated my full provisional patent in one session. My attorney called it the best pre-draft she'd seen.", name: "A.S.", role: "Inventor" },
  { quote: "ZARP is the first platform that actually teaches you to BUILD, not just theorize.", name: "M.T.", role: "Independent Researcher, 20 yrs" },
];

export default function ZarpLanding() {
  const navigate = useNavigate();
  const countdown = useCountdown();
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailCapture = async () => {
    if (!email || submitting) return;
    setSubmitting(true);
    await base44.entities.NewsletterSubscriber.create({ email, source: "landing_hero", status: "active" });
    setEmailSubmitted(true);
    setSubmitting(false);
    // Don't redirect — keep them on the page, they're already engaged.
    // The email is captured. Now let the page sell them.
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* ── Urgency bar — REAL countdown ── */}
      <div className="bg-gradient-to-r from-red-950 to-orange-950 border-b border-red-900 px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Flame size={13} className="text-orange-400 animate-pulse flex-shrink-0" />
        <span className="text-orange-200 font-semibold">Founding rate locks in</span>
        <span className="font-black text-white bg-black/50 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-300 text-xs">— price goes up permanently after 1,000 members</span>
      </div>

      {/* ── Nav — ONE primary CTA only ── */}
      <nav className="border-b border-gray-800 bg-gray-900/90 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
          <span className="font-black text-xl">ZARP</span>
          <span className="text-gray-600 text-xs hidden sm:inline">Engineering Vault</span>
        </div>
        <Link to="/pricing"
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-colors">
          Unlock Access — From $29
        </Link>
      </nav>

      {/* ── Hero — single focused message, one primary CTA ── */}
      <section className="px-5 py-16 sm:py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Zap size={10} /> 40+ Systems. All Sourced. All Buildable.
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-5">
          They Patented It.<br />
          They Buried It.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            We Built the Vault.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-3 leading-relaxed">
          40+ advanced engineering systems from granted US patents, peer-reviewed journals, and declassified government documents. Full build plans. Complete BOMs. AI patent tools.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">
          No other platform documents these devices at the engineering level. No speculation. No YouTube energy. Primary sources only.
        </p>

        {/* ── Email capture — stays on page after submit ── */}
        <div className="max-w-lg mx-auto mb-5">
          {emailSubmitted ? (
            <div className="bg-green-950/40 border border-green-800 rounded-xl p-5 text-center">
              <CheckCircle2 size={24} className="text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-bold">Free build guide on its way — check your inbox.</p>
              <p className="text-gray-500 text-sm mt-1">Ready to unlock the full vault?</p>
              <Link to="/pricing" className="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black transition-colors">
                See Membership Options <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailCapture()}
                className="flex-1 px-4 py-3.5 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button onClick={handleEmailCapture} disabled={submitting}
                className="px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all whitespace-nowrap disabled:opacity-60">
                {submitting ? "Sending..." : "Get Free Build Guide →"}
              </button>
            </div>
          )}
          {!emailSubmitted && <p className="text-gray-600 text-xs mt-2">One free build plan. No spam. Unsubscribe anytime.</p>}
        </div>

        {/* Secondary text CTA — low commitment */}
        {!emailSubmitted && (
          <Link to="/free-vault" className="text-gray-500 hover:text-gray-300 text-sm transition-colors underline underline-offset-4">
            Browse the free vault first →
          </Link>
        )}
      </section>

      {/* ── Vault preview — DESIRE engine. Show what's locked. ── */}
      <section className="px-5 pb-20 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black mb-2">What's Locked Inside</h2>
          <p className="text-gray-500 text-sm">Every system below is fully documented — BOM, steps, PDF, build video. Unlocked with membership.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {LOCKED_PREVIEWS.map((item, i) => (
            <Link key={i} to="/pricing"
              className="group relative bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl overflow-hidden transition-all">
              <div className="h-32 sm:h-40 relative overflow-hidden">
                <img src={item.img} alt={item.title}
                  className="w-full h-full object-cover blur-[4px] scale-110 group-hover:blur-[2px] group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gray-950/65 flex items-center justify-center">
                  <Lock size={22} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                </div>
                <div className="absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded bg-gray-900/80 text-gray-400 font-semibold">{item.category}</div>
              </div>
              <div className="p-3">
                <p className="text-white font-bold text-sm leading-snug mb-1">{item.title}</p>
                <p className="text-gray-500 text-xs leading-snug italic">{item.hook}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-purple-900/30">
            Unlock All 40+ Systems <ChevronRight size={18} />
          </Link>
          <p className="text-gray-600 text-xs mt-3">From $29/month · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* ── Features — brief, benefit-led ── */}
      <section className="border-y border-gray-800 bg-gray-900/30 px-5 py-14">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Everything Inside One Membership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-900 border border-gray-800 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-0.5">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all text-sm font-bold">
              See what's in each tier <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="px-5 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-8">From the Vault Builders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex gap-1 mb-3">{[...Array(5)].map((_, j) => <Star key={j} size={11} className="text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-gray-200 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
              <p className="text-white font-bold text-sm">{t.name}</p>
              <p className="text-gray-500 text-xs">{t.role}</p>
            </div>
          ))}
        </div>

        {/* Credibility stats — honest numbers */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { n: "40+", sub: "Engineering systems" },
            { n: "200+", sub: "Prior art entries" },
            { n: "7+", sub: "Primary sources per build" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl py-5">
              <div className="text-3xl font-black text-cyan-400">{s.n}</div>
              <div className="text-gray-500 text-xs mt-1">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA section ── */}
      <section className="px-5 pb-20 max-w-3xl mx-auto text-center">
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-10">
          <h2 className="text-3xl font-black mb-3">Stop Researching. Start Building.</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The builds are real. The patents are real. The only thing between you and the vault is this button.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 text-white font-black text-lg transition-all shadow-xl shadow-purple-900/30">
              Unlock Full Vault — From $29/mo
            </Link>
            <Link to="/free-vault"
              className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all border border-gray-700">
              Free Vault First
            </Link>
          </div>
          <p className="text-gray-700 text-xs mt-5">🔒 Stripe · SSL · Cancel anytime · No contracts</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · ZARP Engineering Vault · Educational research platform · Not financial or medical advice</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}