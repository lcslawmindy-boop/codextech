import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Zap, ChevronRight, Star, Eye, ArrowRight, CheckCircle2, X } from "lucide-react";
import UpgradeBar from "@/components/UpgradeBar";

const FREE_ITEMS = [
  {
    id: "emf-trigger",
    title: "EM Trigger Window Therapy Device",
    category: "Bioelectromagnetics",
    badge: "FREE — Full Build",
    badgeColor: "bg-cyan-900/60 text-cyan-300 border-cyan-800",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
    hook: "Programmable EM pulse generator targeting verified biological trigger windows. Consumer wristband + clinical chamber versions.",
    detail: `Frequency range: 0.5 Hz – 100 kHz programmable
BOM: 11 components (DDS module, MOSFET driver, coil array)
Build time: 6–8 hours
Est. cost: ~$85 consumer / ~$340 clinical
Source: Documented biological trigger window research, multiple peer-reviewed citations
→ Full BOM, step-by-step assembly, and PDF available inside the vault`,
    href: "/invention-library",
  },
  {
    id: "prior-art",
    title: "Prior Art Archive — 5 Free Entries",
    category: "Research",
    badge: "FREE — Sample Access",
    badgeColor: "bg-green-900/60 text-green-300 border-green-800",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/56476002c_generated_image.png",
    hook: "200+ entries: Tesla, Moray, Rife, Gray, Searl, Priore. Every entry cites primary sources — patents, papers, government documents.",
    detail: `Sample entries available free:
1. Nikola Tesla — Magnifying Transmitter (US Patent 1,119,732, 1914)
2. T.H. Moray — Radiant Energy Device (Patent denied — full story inside)
3. Edwin Gray — Pulsed Capacitor Discharge Engine (US 3,890,548, 1975)
4. Antoine Priore — Rotating EM Beam Therapy (French Patent, 1963)
5. John Searl — Searl Effect Generator (British Patent, 1968)
→ Full 200+ entry archive unlocked with membership`,
    href: "/prior-art",
  },
  {
    id: "scalar-module-1",
    title: "Scalar EM Fundamentals — Module 1",
    category: "Course Preview",
    badge: "FREE — First Module",
    badgeColor: "bg-yellow-900/60 text-yellow-300 border-yellow-800",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/47da562a5_generated_image.png",
    hook: "What Maxwell actually wrote — vs what textbooks teach. The vacuum is not empty. Why mainstream EM is a truncated subset.",
    detail: `Module 1 covers:
— Maxwell's original quaternion equations (pre-Heaviside truncation)
— The Aharonov-Bohm effect: proof that potentials are real
— Why E=0, B=0 does NOT mean no EM field is present
— Introduction to scalar potential engineering
— Why this matters for every device in the vault

Runtime: ~45 min | Format: Text + diagrams + lab reference
→ Modules 2–12 unlocked with Starter or Pro membership`,
    href: "/courses",
  },
];

const LOCKED_ITEMS = [
  { title: "MEG Replication Kit", category: "Free Energy", hook: "COP>1 peer-reviewed device", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
  { title: "Vacuum Potential Oscillator", category: "Energy Systems", hook: "Independent vacuum-ground shift", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png" },
  { title: "Anenergy Pump Circuit", category: "Vacuum Energy", hook: "Phi-field extraction, 14 steps", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png" },
  { title: "Telomere Device TRD-1", category: "Biotech", hook: "EM-triggered telomerase protocol", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/53f9613a8_generated_image.png" },
  { title: "Gravitobiology Course", category: "Course", hook: "EM effects on biological organisms", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54a56d57f_generated_image.png" },
  { title: "Prioré Multichannel EM System", category: "Bioelectromagnetics", hook: "French govt funded, then suppressed", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png" },
  { title: "Asymmetric Regauging Generator", category: "Free Energy", hook: "Overunity via asymmetric regauging", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/917a50d37_generated_image.png" },
  { title: "Scalar Wave Interferometer", category: "EM Physics", hook: "E=0, B=0, non-zero potential", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/991d97732_generated_image.png" },
  { title: "AI Patent Drafting Tool", category: "IP Tools", hook: "Provisional patent in one session", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" },
];

// Hard paywall — fires at 2 views, no dismiss
const GATE_AFTER = 2;

// What members unlock — specific outcomes not feature names
const UNLOCK_OUTCOMES = [
  { icon: "🔧", text: "Build 40+ EM devices — full BOM, exact part numbers, step-by-step, PDF" },
  { icon: "📄", text: "Draft a USPTO provisional patent in one session — AI does the legal writing" },
  { icon: "📚", text: "Complete 40+ courses from scalar EM fundamentals to advanced IP strategy" },
  { icon: "💼", text: "Generate an investor pitch deck and VDR for any invention — in under 30 min" },
  { icon: "🔬", text: "Run FTO analysis and prior art scans — what a $500/hr patent attorney would do" },
];

function HardPaywall() {
  return (
    <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-sm flex flex-col items-center justify-center px-5">
      {/* Lock icon */}
      <div className="w-20 h-20 rounded-full bg-purple-950 border-2 border-purple-600 flex items-center justify-center mb-6 shadow-2xl shadow-purple-900/50">
        <Lock size={36} className="text-purple-400" />
      </div>

      <div className="max-w-md w-full text-center">
        <h2 className="text-3xl font-black mb-2 text-white">That's Your 2 Free Views</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          You've seen the quality. The other 38 systems are identical — same engineering rigor, same primary sources, same build-ready documentation. The door is locked. The key is $29.
        </p>

        {/* Specific outcomes */}
        <div className="space-y-2 mb-8 text-left">
          {UNLOCK_OUTCOMES.map((o, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl">
              <span className="text-lg flex-shrink-0">{o.icon}</span>
              <span className="text-gray-200 text-sm leading-snug">{o.text}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <Link to="/pricing"
          className="block w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 text-white font-black text-lg transition-all shadow-xl shadow-purple-900/40 mb-3">
          Unlock Full Vault — From $29/mo
        </Link>
        <p className="text-gray-600 text-xs mb-6">Cancel anytime · Stripe · SSL · Instant access</p>

        {/* Only escape: leave */}
        <Link to="/" className="text-gray-700 hover:text-gray-500 text-xs transition-colors underline underline-offset-2">
          ← Go back to homepage
        </Link>
      </div>
    </div>
  );
}

function LockedItem({ item }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden opacity-60 select-none">
      <div className="relative">
        <button className="w-full flex items-center gap-4 p-4 text-left cursor-not-allowed">
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 relative">
            <img src={item.img} alt={item.title} className="w-full h-full object-cover blur-sm" />
            <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center">
              <Lock size={16} className="text-purple-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded border bg-purple-900/40 text-purple-400 border-purple-800">
                🔒 LOCKED
              </span>
              <span className="text-gray-700 text-xs">{item.category}</span>
            </div>
            <h3 className="text-gray-500 font-bold text-sm blur-[2px] select-none">{item.title}</h3>
            <p className="text-gray-700 text-xs mt-0.5 blur-[2px] select-none line-clamp-1">{item.hook}</p>
          </div>
          <Lock size={16} className="text-purple-600 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
}

export default function FreeVault() {
  const [views, setViews] = useState(() => parseInt(localStorage.getItem("zarp_vault_views") || "0"));
  const [expandedId, setExpandedId] = useState(null);
  const [paywallHit, setPaywallHit] = useState(() => parseInt(localStorage.getItem("zarp_vault_views") || "0") >= GATE_AFTER);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const bottomRef = useRef(null);

  const handleExpand = (id) => {
    // Already at gate — do nothing, paywall is showing
    if (paywallHit) return;

    if (expandedId === id) { setExpandedId(null); return; }

    const newViews = views + 1;
    setViews(newViews);
    localStorage.setItem("zarp_vault_views", newViews);
    setExpandedId(id);

    // Fire hard paywall immediately on 2nd view
    if (newViews >= GATE_AFTER) {
      setTimeout(() => setPaywallHit(true), 800);
    }
  };

  const handleEmailCapture = async () => {
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({ email, source: "free_vault", status: "active" });
    setEmailDone(true);
  };

  const viewsLeft = Math.max(0, GATE_AFTER - views);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hard paywall overlay — no dismiss button */}
      {paywallHit && <HardPaywall />}

      <UpgradeBar message="Free Vault — 2 free views. 40+ systems unlock with membership." ctaLabel="See Plans" ctaHref="/paywall" />

      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/90 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-7 w-7 object-contain" />
            <span className="font-black text-lg">ZARP</span>
          </Link>
          <span className="text-xs text-gray-600 border border-gray-800 px-2 py-0.5 rounded">Free Vault</span>
        </div>
        <Link to="/pricing"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-black transition-colors flex items-center gap-1.5">
          <Zap size={13} /> Unlock Full Access
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black mb-3">Free Engineering Vault</h1>
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            {viewsLeft > 0
              ? `You have ${viewsLeft} free view${viewsLeft !== 1 ? "s" : ""} remaining. Expand any item below.`
              : "You've used your 2 free views. Upgrade to access the full vault."}
          </p>
          {views > 0 && !paywallHit && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-950/40 border border-red-800 text-red-300 text-xs font-bold">
              <Eye size={11} /> {viewsLeft} free view{viewsLeft !== 1 ? "s" : ""} left — then the vault locks
            </div>
          )}
        </div>

        {/* Free items */}
        <div className="space-y-3 mb-14">
          {FREE_ITEMS.map((item, idx) => {
            const isOpen = expandedId === item.id;
            // After 2nd view, 3rd item becomes locked
            const isLocked = paywallHit && !isOpen;
            const wasViewed = views >= GATE_AFTER && isOpen;

            if (isLocked) return <LockedItem key={item.id} item={item} />;

            return (
              <div key={item.id}
                className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${isOpen ? "border-purple-700 shadow-lg shadow-purple-950/30" : "border-gray-800 hover:border-gray-600"}`}>

                <button onClick={() => handleExpand(item.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-800/20 transition-colors min-h-0">
                  <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-black px-2 py-0.5 rounded border ${item.badgeColor}`}>{item.badge}</span>
                      <span className="text-gray-600 text-xs">{item.category}</span>
                    </div>
                    <h3 className="text-white font-bold text-sm">{item.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.hook}</p>
                  </div>
                  <ChevronRight size={16} className={`text-gray-600 flex-shrink-0 transition-transform ${isOpen ? "rotate-90 text-purple-400" : ""}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-gray-800 bg-gray-950/50 p-5">
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.hook}</p>
                    <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans mb-5">
                      {item.detail}
                    </pre>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link to={item.href}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-colors">
                        Open in Library <ArrowRight size={14} />
                      </Link>
                      <Link to="/pricing"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold transition-colors">
                        Unlock Full Vault <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Locked vault grid */}
        <div className="mb-14">
          <h2 className="text-xl font-black mb-1">What's Behind the Lock</h2>
          <p className="text-gray-500 text-sm mb-5">38+ more systems — same sourcing, same build-ready docs. Unlocked with membership.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {LOCKED_ITEMS.map((item, i) => (
              <Link key={i} to="/pricing"
                className="group bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl overflow-hidden transition-all">
                <div className="h-24 relative overflow-hidden">
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover blur-[3px] scale-110 group-hover:blur-[2px] transition-all duration-400" />
                  <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center">
                    <Lock size={18} className="text-purple-400" />
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-white text-xs font-bold leading-snug">{item.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5 italic">{item.hook}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 text-white font-black transition-all shadow-lg shadow-purple-900/30">
              Unlock All 40+ Systems <ChevronRight size={18} />
            </Link>
            <p className="text-gray-600 text-xs mt-3">From $29/month · Cancel anytime · Instant access</p>
          </div>
        </div>

        {/* Email capture */}
        <div ref={bottomRef} className="bg-gray-900 border border-gray-800 rounded-2xl p-7 text-center">
          <h3 className="font-black text-white text-lg mb-2">Not ready to join?</h3>
          <p className="text-gray-500 text-sm mb-5">Get a free build guide + weekly vault drops. No spam. Unsubscribe anytime.</p>
          {emailDone ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
              <CheckCircle2 size={18} /> Guide on its way — check your inbox.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailCapture()}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
              <button onClick={handleEmailCapture}
                className="px-5 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-colors whitespace-nowrap">
                Send Guide
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · Educational research platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/pricing" className="hover:text-gray-400">Pricing</Link>
          <Link to="/" className="hover:text-gray-400">Home</Link>
        </div>
      </footer>
    </div>
  );
}