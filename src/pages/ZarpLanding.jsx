import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ScalarWaveWatermark from "@/components/ScalarWaveWatermark";
import { Lock, ChevronRight, Star, Shield, BookOpen, Wrench, TrendingUp, CheckCircle2, ArrowRight, Flame, Zap } from "lucide-react";
import LeadMagnetPopup, { useLeadMagnetTrigger } from "@/components/LeadMagnetPopup";
import VaultHeroAnimation from "@/components/VaultHeroAnimation";
import CodextechAcronym from "@/components/CodextechAcronym";

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

// Transformation-first: what you can DO after joining
const TRANSFORMATIONS = [
  {
    icon: <Wrench size={20} className="text-orange-400" />,
    before: "Watching YouTube videos about 'free energy' with no idea how to build anything",
    after: "Order $85 in parts from Digikey, follow a 23-step BOM, and have a working EM device in 8 hours",
    deliverable: "40+ build plans — exact part numbers, supplier links, PDF download, build video",
    color: "#f97316",
  },
  {
    icon: <Shield size={20} className="text-green-400" />,
    before: "Paying $3,000–$15,000 to a patent attorney for a provisional application",
    after: "Generate a USPTO-compliant provisional patent application in one session — all 9 required sections",
    deliverable: "AI Patent Suite — draft, FTO analysis, claims, attorney-ready PDF export",
    color: "#22c55e",
  },
  {
    icon: <BookOpen size={20} className="text-blue-400" />,
    before: "Reading Bearden's books without the engineering background to apply any of it",
    after: "Complete structured modules from quaternion math fundamentals to prototype construction",
    deliverable: "40+ courses — 12 modules each, primary sources cited, lab reference guides included",
    color: "#3b82f6",
  },
  {
    icon: <TrendingUp size={20} className="text-purple-400" />,
    before: "A promising invention idea with no idea how to present it to investors",
    after: "Send a tokenized NDA-gated data room URL and a 15-slide pitch deck to 6 qualified buyers",
    deliverable: "Investor CRM + VDR Portal + Pitch Deck Generator — complete capital-raise stack",
    color: "#8b5cf6",
  },
];

const TESTIMONIALS = [
  { quote: "I had the MEG parts in hand within 72 hours of joining. The BOM is exact — part numbers, quantities, specs. This is engineering documentation, not YouTube.", name: "R.K.", role: "Electrical Engineer, 14 yrs" },
  { quote: "My attorney reviewed the provisional patent I generated in one ZARP session. She said it was the most complete pre-draft she'd ever received from a client.", name: "A.S.", role: "Independent Inventor" },
  { quote: "I've studied Bearden for 20 years and never had the structured curriculum to actually build anything. ZARP changed that in the first week.", name: "M.T.", role: "Independent Researcher, 20 yrs" },
];

export default function ZarpLanding() {
  const navigate = useNavigate();
  const countdown = useCountdown();
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { show: showMagnet, trigger: magnetTrigger, dismiss: dismissMagnet } = useLeadMagnetTrigger({
    timeDelay: 45000,
    scrollPct: 70,
    exitIntent: true,
    storageKey: "zarp_lm_landing",
  });

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
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden relative">
      <ScalarWaveWatermark />
      {showMagnet && !emailSubmitted && (
        <LeadMagnetPopup trigger={magnetTrigger} magnetId="meg_blueprint" onDismiss={dismissMagnet} />
      )}

      {/* ── Urgency bar — REAL countdown ── */}
      <div className="bg-gradient-to-r from-red-950 to-orange-950 border-b border-red-900 px-4 py-2.5 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Flame size={13} className="text-orange-400 animate-pulse flex-shrink-0" />
        <span className="text-orange-200 font-semibold">Founding rate locks in</span>
        <span className="font-black text-white bg-black/50 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-300 text-xs">— price goes up permanently after 1,000 members</span>
      </div>

      {/* ── Nav — ONE primary CTA only ── */}
      <nav className="border-b border-gray-800 bg-gray-900/90 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-12 w-12 object-contain" />
          <span className="font-black text-2xl">C.O.D.E.X.T.E.C.H.</span>
          <span className="text-gray-600 text-xs hidden sm:inline">The Engineering Platform</span>
        </div>
        <Link to="/pricing"
          className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-colors">
          Unlock Access — From $29
        </Link>
      </nav>

      {/* ── Hero — vault door animation ── */}
      <section className="px-5 py-4 sm:py-8 text-center">
        <VaultHeroAnimation>
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-black mb-4 uppercase tracking-widest">
              <Zap size={10} /> 40+ Systems. All Sourced. All Buildable.
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-3">
              Learn. Build.<br />
              Patent. Fund.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Complete Execution.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-2 leading-relaxed">
              40+ builds + 26 courses + AI patent tools + investor toolkit.
            </p>
            <p className="text-gray-500 text-xs max-w-md mx-auto mb-4">
              Everything sourced from granted patents and peer-reviewed research.
            </p>
            <CodextechAcronym />
          </div>
        </VaultHeroAnimation>

        {/* ── Email capture — stays on page after submit ── */}
        <div className="px-5 text-center">
          <div className="max-w-lg mx-auto mb-5">
            {emailSubmitted ? (
              <div className="bg-green-950/40 border border-green-800 rounded-xl p-5 text-center">
                <CheckCircle2 size={24} className="text-green-400 mx-auto mb-2" />
                <p className="text-green-300 font-bold">Course preview on its way — check your inbox.</p>
                <p className="text-gray-500 text-sm mt-1">Ready to unlock the full library?</p>
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
                  {submitting ? "Sending..." : "Get Free Course Preview →"}
                </button>
              </div>
            )}
            {!emailSubmitted && <p className="text-gray-600 text-xs mt-2">One free course module. No spam. Unsubscribe anytime.</p>}
          </div>

          {/* Secondary text CTA — low commitment */}
          {!emailSubmitted && (
            <Link to="/free-vault" className="text-gray-500 hover:text-gray-300 text-sm transition-colors underline underline-offset-4">
              View free course preview →
            </Link>
          )}
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering execution platform · Educational & research purposes only</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400 transition-colors">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400 transition-colors">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}