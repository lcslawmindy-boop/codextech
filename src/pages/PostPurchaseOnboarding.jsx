import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Wrench, BookOpen, Shield, FileText, Package, Database } from "lucide-react";

const KIT_UPSELLS = [
  {
    name: "MEG Replication Parts Kit",
    desc: "All components to build the peer-reviewed COP>1 device. Sourced and pre-verified.",
    price: "$287",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
    href: "/build-supplies-shop",
  },
  {
    name: "Scalar EM Lab Starter Kit",
    desc: "Foundation components for your first scalar transmitter build. Beginner-friendly.",
    price: "$167",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
    href: "/build-supplies-shop",
  },
  {
    name: "Prioré Device Component Bundle",
    desc: "Multichannel EM therapy components. Sourced, bundled, ready to assemble.",
    price: "$349",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
    href: "/build-supplies-shop",
  },
];

const QUICK_START = [
  { label: "Research Database", sub: "Start with the MEG module — it's free to preview", href: "/codextech-database", icon: <Database size={18} className="text-cyan-400" /> },
  { label: "Build Plans", sub: "View complete BOMs and assembly steps", href: "/build-plans", icon: <Wrench size={18} className="text-orange-400" /> },
  { label: "AI Patent Tool", sub: "Draft a provisional patent in one session", href: "/patent-tool", icon: <Shield size={18} className="text-green-400" /> },
  { label: "Source Documents", sub: "Browse 40+ verified patents and publications", href: "/source-documents", icon: <FileText size={18} className="text-purple-400" /> },
];

export default function PostPurchaseOnboarding() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-7 w-7 object-contain" />
          <span className="font-black text-base">Zenith Apex Technology</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-black text-cyan-300 border border-cyan-800 bg-cyan-950/40">
          Research Member
        </span>
      </div>

      {/* Confirmation hero */}
      <div className="text-center px-5 py-16 bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-cyan-950/40 border-2 border-cyan-700">
          <CheckCircle2 size={36} className="text-cyan-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3">Membership Active. Welcome In.</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed mb-6">
          Your <span className="text-cyan-300 font-black">Research Membership</span> is live. Full database access, build plans, AI patent tools, and IP marketplace — all unlocked.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/member-dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-black transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 20px rgba(0,200,255,0.3)" }}>
            Go to My Dashboard <ArrowRight size={16} />
          </Link>
          <Link to="/build-plans"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700">
            <Wrench size={16} /> Browse Build Plans
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-14">

        {/* What's unlocked */}
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <Database size={18} className="text-cyan-400" /> What You Just Unlocked
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { icon: <Database size={20} className="text-cyan-400" />, value: "40+", label: "Patents Analyzed" },
            { icon: <Wrench size={20} className="text-orange-400" />, value: "6", label: "Build Systems" },
            { icon: <Shield size={20} className="text-green-400" />, value: "Full", label: "AI Patent Suite" },
            { icon: <BookOpen size={20} className="text-purple-400" />, value: "200+", label: "Source Documents" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">{item.icon}</div>
              <div className="text-2xl font-black text-white">{item.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Quick start */}
        <h2 className="text-xl font-black mb-5">Where Do You Want to Start?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {QUICK_START.map((item, i) => (
            <Link key={i} to={item.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group">
              <div className="mb-2">{item.icon}</div>
              <p className="text-white font-bold text-sm leading-snug">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1 leading-snug">{item.sub}</p>
            </Link>
          ))}
        </div>

        {/* Kit upsell */}
        <div className="bg-gray-900 border border-orange-900/30 rounded-2xl p-7 mb-14">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-orange-400" />
            <h2 className="text-xl font-black">You Have the Plans. Now Buy the Kit.</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            Physical components delivered to your door. Pre-sourced, pre-verified, ready for assembly. Every kit matches a build plan you now have full access to.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {KIT_UPSELLS.map((kit, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-800/40 transition-all">
                <div className="h-32 overflow-hidden">
                  <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-1 leading-snug">{kit.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{kit.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black">{kit.price}</span>
                    <Link to={kit.href}
                      className="px-3 py-1.5 rounded-lg bg-orange-800 hover:bg-orange-700 text-white text-xs font-black transition-colors">
                      Buy Kit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final nav */}
        <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="font-black text-white text-xl mb-2">The database is open. Start with the MEG.</h3>
          <p className="text-gray-500 text-sm mb-6">The MEG module is the most documented COP&gt;1 system in peer-reviewed literature. It's the right starting point.</p>
          <Link to="/research-module?module=meg-system"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-black text-black transition-all hover:opacity-90"
            style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 20px rgba(0,200,255,0.25)" }}>
            Open MEG Module <ArrowRight size={18} />
          </Link>
          <div className="mt-4">
            <Link to="/member-dashboard" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Go to full dashboard →
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · Research membership — educational and research purposes only</p>
      </footer>
    </div>
  );
}