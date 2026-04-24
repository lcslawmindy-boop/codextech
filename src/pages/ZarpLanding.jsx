import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Zap, Lock, ChevronRight, Play, Star, Shield, BookOpen, Wrench, TrendingUp, Mail, CheckCircle2, ArrowRight, Flame, Clock } from "lucide-react";

const PREVIEW_BUILDS = [
  { title: "Vacuum Potential Oscillator", category: "Energy Systems", preview: "Shift vacuum-ground potential independently of circuit ground. Tap the limitless vacuum reservoir...", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png" },
  { title: "Scalar Energy Bottle Interferometer", category: "EM Physics", preview: "Two-transmitter zero-vector interference zone. E=0, B=0 output from each transmitter...", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/991d97732_generated_image.png" },
  { title: "MEG Replication Kit", category: "Free Energy", preview: "The peer-reviewed COP>1 device. Vacuum B(3) field replenishes the permanent magnet...", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
  { title: "EM Trigger Window Therapy Device", category: "Bioelectromagnetics", preview: "Precision EM pulses at documented biological trigger windows. Consumer + clinical versions...", locked: false, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png" },
];

const STATS = [
  { value: "40+", label: "Advanced Systems" },
  { value: "200+", label: "Prior Art Entries" },
  { value: "15+", label: "Active Builders" },
  { value: "$2.8B", label: "Target Market" },
];

const TESTIMONIALS = [
  { quote: "The MEG build plans alone are worth 10x the membership. Nothing like this exists anywhere else.", name: "R.K.", role: "Electrical Engineer" },
  { quote: "I've been studying scalar EM for 20 years. ZARP is the first platform that actually teaches you to build.", name: "M.T.", role: "Independent Researcher" },
  { quote: "The patent strategy tools saved me months of work. Generated my entire provisional in one session.", name: "A.S.", role: "Inventor" },
];

export default function ZarpLanding() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [countdown, setCountdown] = useState({ h: 11, m: 47, s: 33 });

  // Countdown timer for urgency
  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleEmailCapture = async () => {
    if (!email) return;
    setSubmitting(true);
    await base44.entities.NewsletterSubscriber.create({ email, source: "landing_page_lead_magnet", status: "active" });
    setEmailSubmitted(true);
    setSubmitting(false);
    setTimeout(() => navigate("/free-vault"), 1200);
  };

  const pad = n => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-orange-900 to-red-900 border-b border-orange-700 px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <Flame size={14} className="text-orange-300 animate-pulse" />
        <span className="text-orange-100 font-semibold">Founding Member pricing ends in</span>
        <span className="font-black text-white bg-black/40 px-2 py-0.5 rounded font-mono">
          {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
        </span>
        <span className="text-orange-200 text-xs">— Lock in $49/mo forever</span>
      </div>

      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
          <span className="font-black text-xl text-white">ZARP</span>
          <span className="text-gray-500 text-xs">Engineering Vault</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/free-vault" className="text-gray-400 hover:text-white text-sm transition-colors">Free Vault</Link>
          <Link to="/pricing" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors">
            Unlock Full Access
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs font-bold mb-6">
          <Zap size={12} /> THE WORLD'S MOST ADVANCED SCALAR EM ENGINEERING PLATFORM
        </div>
        <h1 className="text-5xl md:text-7xl font-black leading-none mb-6">
          Build What They<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Said Was Impossible</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          40+ advanced engineering systems. Full build plans, BOMs, AI patent tools, and a research vault that no university will teach you.
        </p>

        {/* Email capture / CTA */}
        <div className="max-w-md mx-auto mb-6">
          {emailSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-lg py-4">
              <CheckCircle2 size={20} /> Unlocking your free build guide...
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailCapture()}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={handleEmailCapture}
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm transition-all whitespace-nowrap disabled:opacity-60"
              >
                {submitting ? "Unlocking..." : "Get Free Build Guide →"}
              </button>
            </div>
          )}
          <p className="text-gray-600 text-xs mt-2">Free access to 1 full build plan. No spam. Unsubscribe anytime.</p>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Link to="/pricing" className="flex items-center gap-2 text-white font-bold text-lg hover:text-cyan-300 transition-colors">
            <span>Unlock Full Systems</span> <ArrowRight size={18} />
          </Link>
          <Link to="/free-vault" className="text-gray-400 hover:text-gray-200 text-sm transition-colors">
            Browse free vault →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 bg-gray-900/40 px-6 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-cyan-400">{s.value}</div>
              <div className="text-gray-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vault Preview (blurred/locked) */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Inside the Engineering Vault</h2>
          <p className="text-gray-400">Real results first. Process unlocked after membership.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREVIEW_BUILDS.map((b, i) => (
            <div key={i} className={`relative bg-gray-900 border rounded-xl overflow-hidden group ${b.locked ? "border-gray-800" : "border-cyan-800"}`}>
              <div className="h-36 overflow-hidden relative">
                <img src={b.img} alt={b.title} className={`w-full h-full object-cover ${b.locked ? "blur-sm scale-110" : ""}`} />
                {b.locked && (
                  <div className="absolute inset-0 bg-gray-950/60 flex items-center justify-center">
                    <Lock size={28} className="text-cyan-400" />
                  </div>
                )}
                {!b.locked && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-cyan-600 text-xs font-bold text-white">FREE</div>
                )}
              </div>
              <div className="p-3">
                <div className="text-xs text-cyan-400 font-semibold mb-1">{b.category}</div>
                <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                <p className={`text-xs text-gray-400 leading-relaxed ${b.locked ? "blur-[3px] select-none" : ""}`}>{b.preview}</p>
                {b.locked ? (
                  <Link to="/pricing" className="mt-3 block text-center py-1.5 rounded-lg bg-gray-800 hover:bg-cyan-900 border border-gray-700 hover:border-cyan-700 text-gray-400 hover:text-cyan-300 text-xs font-bold transition-all">
                    Unlock <Lock size={10} className="inline ml-1" />
                  </Link>
                ) : (
                  <Link to="/free-vault" className="mt-3 block text-center py-1.5 rounded-lg bg-cyan-800 hover:bg-cyan-700 text-white text-xs font-bold transition-all">
                    View Free Build
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-lg transition-all shadow-lg shadow-cyan-900/40">
            Unlock All 40+ Systems <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-gray-900/50 border-y border-gray-800 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Everything Inside Membership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Wrench size={24} className="text-orange-400" />, title: "Full Build Plans", desc: "Step-by-step assembly guides, BOMs, supplier links, and build videos for 40+ advanced systems." },
              { icon: <BookOpen size={24} className="text-blue-400" />, title: "40+ Courses", desc: "Scalar EM, bioelectromagnetics, vacuum energy, patent strategy — from foundational to classified-grade." },
              { icon: <Shield size={24} className="text-green-400" />, title: "AI Patent Tools", desc: "Generate provisional patents, FTO analyses, patent claims, and investor packages in minutes." },
              { icon: <TrendingUp size={24} className="text-purple-400" />, title: "Investor System", desc: "CRM, pitch decks, term sheets, and VDR — your full capital-raise toolkit in one place." },
              { icon: <Star size={24} className="text-yellow-400" />, title: "Prior Art Archive", desc: "200+ entries. Research faster. Prove novelty. Kill prior art before filing." },
              { icon: <Zap size={24} className="text-cyan-400" />, title: "Lab Simulators", desc: "Interactive EM field simulators, scalar wave labs, and interference visualizations — no hardware needed." },
            ].map((f, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-900 border border-gray-800 rounded-xl">
                <div className="flex-shrink-0 mt-0.5">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">From the Vault Builders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <div className="text-white font-bold text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="px-6 py-20 bg-gradient-to-b from-gray-950 to-cyan-950/20 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-900/40 border border-orange-700 text-orange-300 text-xs font-bold mb-6">
            <Clock size={12} /> FOUNDING MEMBER OFFER — First 1,000 Only
          </div>
          <h2 className="text-4xl font-black mb-4">Start Building Today</h2>
          <p className="text-gray-400 mb-8">Full vault access. All 40+ systems. AI tools. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg transition-all shadow-xl shadow-cyan-900/40">
              Unlock Full Systems — $49/mo
            </Link>
            <Link to="/free-vault" className="px-10 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-lg transition-all border border-gray-700">
              Browse Free First
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-xs">
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