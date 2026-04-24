import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Lock, Zap, ChevronRight, Star, Eye, ArrowRight, CheckCircle2 } from "lucide-react";
import UpgradeBar from "@/components/UpgradeBar";

// ── Free content — 3 items so gate fires after meaningful engagement ──────────
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

// ── Locked grid — high desire items ──────────────────────────────────────────
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

// Gate fires after viewing this many free items
const GATE_AFTER = 2;

function PaywallModal({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-purple-700 rounded-2xl max-w-md w-full p-8 shadow-2xl shadow-purple-950/50">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h3 className="text-2xl font-black mb-2">You've Seen What's Possible</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            That's the quality of everything in the vault. 37 more systems are waiting — with the same sourcing, the same rigor, the same build-ready documentation.
          </p>
        </div>
        <div className="space-y-2 mb-6">
          {[
            "All 40+ build plans — BOM, steps, PDF, video",
            "All 40+ courses — foundational to advanced",
            "AI patent suite — draft a provisional in minutes",
            "Investor toolkit — CRM, pitch decks, VDR",
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
              <CheckCircle2 size={13} className="text-purple-400 flex-shrink-0" /> {f}
            </div>
          ))}
        </div>
        <Link to="/pricing"
          className="block w-full text-center py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-base transition-all mb-3">
          Unlock Full Vault — From $29/mo
        </Link>
        <button onClick={onDismiss}
          className="block w-full text-center text-gray-600 hover:text-gray-400 text-sm transition-colors py-1">
          Keep browsing free content
        </button>
      </div>
    </div>
  );
}

export default function FreeVault() {
  const [views, setViews] = useState(() => parseInt(localStorage.getItem("zarp_vault_views") || "0"));
  const [expandedId, setExpandedId] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);
  const bottomRef = useRef(null);

  const handleExpand = (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    const newViews = views + 1;
    setViews(newViews);
    localStorage.setItem("zarp_vault_views", newViews);
    setExpandedId(id);
    if (newViews >= GATE_AFTER) {
      setTimeout(() => setShowPaywall(true), 1200);
    }
  };

  const handleEmailCapture = async () => {
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({ email, source: "free_vault", status: "active" });
    setEmailDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {showPaywall && <PaywallModal onDismiss={() => setShowPaywall(false)} />}

      <UpgradeBar message="Free Vault — 3 items. 40+ more unlock with membership." ctaLabel="See Plans" ctaHref="/paywall" />

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
            Explore 3 full free items below. Click any to expand — this is the real content, not a summary.
          </p>
          {views > 0 && views < GATE_AFTER && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-950/40 border border-yellow-800 text-yellow-300 text-xs font-bold">
              <Eye size={11} /> {GATE_AFTER - views} free view{GATE_AFTER - views !== 1 ? "s" : ""} left before the door opens
            </div>
          )}
        </div>

        {/* Free items — expanded view is the hook */}
        <div className="space-y-3 mb-14">
          {FREE_ITEMS.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <div key={item.id}
                className={`bg-gray-900 border rounded-xl overflow-hidden transition-all ${isOpen ? "border-purple-700 shadow-lg shadow-purple-950/30" : "border-gray-800 hover:border-gray-600"}`}>

                {/* Header row */}
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

                {/* Expanded — real content, not just a tease */}
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

        {/* Locked vault grid — desire driver */}
        <div className="mb-14">
          <h2 className="text-xl font-black mb-1">What's Behind the Lock</h2>
          <p className="text-gray-500 text-sm mb-5">37+ more systems — same sourcing, same build-ready docs. Unlocked with membership.</p>

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

        {/* Email capture at bottom — second chance for those not ready to pay */}
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