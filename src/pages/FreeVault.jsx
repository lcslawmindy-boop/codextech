import { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import ScalarWaveWatermark from "@/components/ScalarWaveWatermark";
import { Zap, ChevronRight, Video, CheckCircle2, Wrench, BookOpen, Network } from "lucide-react";

const FREE_DEVICE = {
  id: "meg",
  type: "device",
  title: "MEG Replication Device",
  category: "Free Energy",
  badge: "FREE DEVICE PLAN",
  badgeColor: "bg-cyan-900/60 text-cyan-300 border-cyan-800",
  img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
  hook: "US Patent 6,362,718. Peer-reviewed COP>1 device with complete engineering docs.",
  detail: `BOM: 23 components
Winding specs: Exact wire gauge, turn count, toroidal core geometry
Power supply: 12V 30A regulated requirements
Magnet placement: N52 neodymium positioning guide

WHAT YOU GET FREE:
✓ Complete 23-component BOM with part numbers
✓ Winding specifications & core geometry
✓ Assembly order & magnet placement guide

UPGRADE TO MEMBER FOR:
→ PDF (60 pages with schematics)
→ 12-hour video assembly series
→ Verified supplier links & part costs
→ All 40+ build plans + troubleshooting community`,
  href: "/invention-plans",
};

const FREE_COURSE = {
  id: "scalar",
  type: "course",
  title: "Scalar EM Fundamentals — Free Course",
  category: "Course",
  badge: "FREE COURSE",
  badgeColor: "bg-purple-900/60 text-purple-300 border-purple-800",
  img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/47da562a5_generated_image.png",
  hook: "What Maxwell actually wrote vs what textbooks teach. The vacuum is not empty.",
  detail: `Module 1 covers:
— Maxwell's original quaternion equations (pre-Heaviside truncation)
— The Aharonov-Bohm effect: proof that potentials are real
— Why E=0, B=0 does NOT mean no EM field is present
— Introduction to scalar potential engineering

WHAT YOU GET FREE:
✓ Full Module 1 text & diagrams
✓ Core concepts & Maxwell's equations
✓ Lab reference materials

UPGRADE TO MEMBER FOR:
→ Modules 2–12 (complete curriculum)
→ Video lectures with live explanations
→ Interactive problem sets & solutions
→ All 40+ courses + direct forum access`,
  href: "/courses",
};



function FreeItem({ item }) {
  const [open, setOpen] = useState(false);
  const isDevice = item.type === "device";
  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${open ? (isDevice ? "border-cyan-700 shadow-lg shadow-cyan-950/30" : "border-purple-700 shadow-lg shadow-purple-950/30") : "border-gray-800 hover:border-gray-600"}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-800/20 transition-colors">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
            <span className="text-gray-500 text-xs">{item.category}</span>
          </div>
          <h3 className="text-white font-bold text-base">{item.title}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{item.hook}</p>
        </div>
        <ChevronRight size={18} className={`text-gray-600 flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="border-t border-gray-800 bg-gray-950/50 p-6">
          <pre className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-sans mb-6 max-h-80 overflow-y-auto">{item.detail}</pre>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={item.href} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-colors ${isDevice ? "bg-cyan-700 hover:bg-cyan-600" : "bg-purple-700 hover:bg-purple-600"}`}>
              {isDevice ? <Wrench size={15} /> : <BookOpen size={15} />}
              {isDevice ? "View Full Build Plan" : "Start Module 1"} <ChevronRight size={14} />
            </Link>
            <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold transition-colors border border-gray-700">
              <Video size={14} /> Unlock All Access
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FreeVault() {
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);

  const handleEmailCapture = async () => {
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({ email, source: "free_vault", status: "active" });
    setEmailDone(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      <ScalarWaveWatermark />
      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/90 backdrop-blur px-5 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-11 w-11 object-contain" />
            <span className="font-black text-lg">C.O.D.E.X.T.E.C.H.</span>
          </Link>
          <span className="text-xs text-green-600 border border-green-800 px-2 py-0.5 rounded font-bold">100% FREE</span>
        </div>
        <Link to="/pricing"
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors flex items-center gap-1.5">
          <Video size={13} /> Get Video Assembly
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-950/40 border border-green-800 text-green-300 text-xs font-bold mb-4">
            <CheckCircle2 size={13} /> 100% FREE — FULL BOM & SPECS FOR ALL BUILDS
          </div>
          <h1 className="text-4xl font-black mb-3">Free Engineering Preview</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base leading-relaxed mb-4">
            Explore 3 complete build systems from C.O.D.E.X.T.E.C.H. with full BOMs and specifications. Membership unlocks 40+ systems, courses, and execution tools.
          </p>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            All systems sourced from granted US patents and peer-reviewed research. Upgrade to Pro ($199/month) for all 40+ builds, PDFs, video guides, and verified supplier sourcing.
          </p>
        </div>

        {/* 1 Device Plan + 1 Course */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={14} className="text-cyan-400" />
              <span className="text-cyan-400 text-xs font-black uppercase tracking-wider">Free Device Build Plan</span>
            </div>
            <FreeItem item={FREE_DEVICE} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={14} className="text-purple-400" />
              <span className="text-purple-400 text-xs font-black uppercase tracking-wider">Free Course — Module 1</span>
            </div>
            <FreeItem item={FREE_COURSE} />
          </div>
        </div>

        {/* Concept Graph */}
        <div className="mb-12 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-gray-900 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Network size={15} className="text-cyan-400" />
              <span className="text-white font-black text-sm">Bearden Concept Graph — 100+ Research Nodes</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 border border-green-800 text-green-400 font-bold">FREE</span>
            </div>
            <Link to="/" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors">
              Open Full Graph <ChevronRight size={12} />
            </Link>
          </div>
          <div className="bg-gray-950 p-4 text-center" style={{ height: 320 }}>
            <iframe
              src="/"
              title="Concept Graph"
              className="w-full h-full rounded-xl border border-gray-800 pointer-events-none"
              style={{ minHeight: 288 }}
            />
            <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-900/50 flex items-center justify-between">
            <p className="text-gray-500 text-xs">Explore 100+ interconnected nodes: scalar EM, vacuum energy, bioelectromagnetics, Tesla tech & more</p>
            <Link to="/" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-bold transition-all">
              <Network size={11} /> Explore Graph
            </Link>
          </div>
        </div>

        {/* Browse all */}
        <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-black mb-3">Browse All 40+ Systems</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            All builds include full BOMs, exact specifications, and assembly instructions. Completely free.
          </p>
          <Link to="/invention-plans"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all shadow-lg shadow-cyan-900/30">
            Open Invention Library <ChevronRight size={18} />
          </Link>
        </div>

        {/* What's in Pro */}
        <div className="bg-gradient-to-b from-cyan-950/30 to-blue-950/30 border border-cyan-800/40 rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
             <Video size={20} className="text-cyan-400" /> Upgrade to Pro ($199/month)
           </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { icon: "📄", title: "PDF Downloads", desc: "40–80 page technical documents for every build" },
              { icon: "🎬", title: "Video Guides", desc: "3–12 hour assembly walkthroughs per device" },
              { icon: "🔗", title: "Supplier Links", desc: "Verified part sources + current pricing" },
              { icon: "💬", title: "Build Forum", desc: "Troubleshoot with 2,000+ active builders" },
            ].map((feature, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <span className="text-2xl block mb-2">{feature.icon}</span>
                <p className="font-bold text-white text-sm mb-1">{feature.title}</p>
                <p className="text-gray-400 text-xs">{feature.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all">
              See All Pro Features <ChevronRight size={16} />
            </Link>
            <p className="text-gray-600 text-xs mt-3">$199/month annual billing · Cancel anytime · 30-day money-back guarantee</p>
          </div>
        </div>

        {/* Email capture */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center mb-12">
          <h3 className="font-black text-white text-lg mb-2">Weekly Vault Drops</h3>
          <p className="text-gray-500 text-sm mb-6">New builds, tips, and engineering insights delivered to your inbox. No spam. Unsubscribe anytime.</p>
          {emailDone ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
              <CheckCircle2 size={18} /> Subscribed! Check your email.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleEmailCapture()}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
              <button onClick={handleEmailCapture}
                className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering execution platform</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/pricing" className="hover:text-gray-400">Pricing</Link>
          <Link to="/" className="hover:text-gray-400">Home</Link>
        </div>
      </footer>
    </div>
  );
}