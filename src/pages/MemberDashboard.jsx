import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Zap, BookOpen, Wrench, Shield, Database, Star, ArrowRight,
  ChevronRight, Package, FileText, Radio, Activity, Cpu
} from "lucide-react";

const QUICK_LINKS = [
  { label: "Build Plans", href: "/invention-plans", icon: <Wrench size={16} />, color: "text-orange-400", bg: "bg-orange-900/20 border-orange-800/50", desc: "40+ systems" },
  { label: "Courses", href: "/course-catalogue", icon: <BookOpen size={16} />, color: "text-blue-400", bg: "bg-blue-900/20 border-blue-800/50", desc: "40+ courses" },
  { label: "Research Vault", href: "/free-vault", icon: <Database size={16} />, color: "text-cyan-400", bg: "bg-cyan-900/20 border-cyan-800/50", desc: "200+ entries" },
  { label: "Patent Suite", href: "/patent-hub", icon: <Shield size={16} />, color: "text-green-400", bg: "bg-green-900/20 border-green-800/50", desc: "AI-powered" },
  { label: "Prior Art Archive", href: "/prior-art", icon: <Star size={16} />, color: "text-yellow-400", bg: "bg-yellow-900/20 border-yellow-800/50", desc: "Searchable DB" },
  { label: "Invention Forge", href: "/invention-forge", icon: <Zap size={16} />, color: "text-purple-400", bg: "bg-purple-900/20 border-purple-800/50", desc: "Hybrid concepts" },
];

const GETTING_STARTED = [
  {
    step: 1,
    title: "Explore the Research Archive",
    desc: "200+ patent-sourced research entries across RF systems, resonance engineering, and electromagnetic instrumentation.",
    cta: "Open Archive →",
    href: "/prior-art",
    color: "#06b6d4",
  },
  {
    step: 2,
    title: "Choose a Build Plan",
    desc: "Start with the MEG or Scalar EM Lab System — each includes a full BOM, schematics, and step-by-step assembly guide.",
    cta: "Browse Build Plans →",
    href: "/invention-plans",
    color: "#f97316",
  },
  {
    step: 3,
    title: "Protect Your Work",
    desc: "Generate a USPTO-compliant provisional patent application using the AI Patent Drafting Wizard.",
    cta: "Open Patent Suite →",
    href: "/patent-hub",
    color: "#a855f7",
  },
];

const FEATURED_BUILDS = [
  { title: "MEG Replication Device", tag: "Electromagnetic Induction", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png", href: "/invention-plans" },
  { title: "Scalar EM Lab System", tag: "RF Instrumentation", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png", href: "/invention-plans" },
  { title: "Prioré Device (Research)", tag: "Bioelectromagnetics", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png", href: "/invention-plans" },
];

export default function MemberDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "Researcher";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 bg-slate-900/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png"
            alt="Aethon Apex IP"
            className="h-8 w-8 object-contain"
          />
          <div>
            <div className="text-white font-bold text-sm">Welcome back, {firstName}</div>
            <div className="text-cyan-400 text-xs font-black">Research Member</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/pricing" className="px-4 py-2 rounded-lg text-white text-xs font-black transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            Upgrade Plan
          </Link>
          <Link to="/account" className="text-slate-400 hover:text-white text-sm transition-colors">Account</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Upgrade CTA */}
        <div className="mb-8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-purple-800/30 bg-purple-900/10">
          <div>
            <div className="font-black text-white mb-1">Upgrade to Pro Builder — Full Platform Access</div>
            <p className="text-slate-400 text-sm">10 rotating courses + 10 build plans + AI Patent Suite + Invention Forge. $149/month or $119/month annual.</p>
          </div>
          <Link to="/pricing"
            className="px-6 py-3 rounded-xl text-white font-black text-sm whitespace-nowrap transition-all hover:opacity-90 flex items-center gap-2 flex-shrink-0"
            style={{ backgroundColor: "#a855f7", boxShadow: "0 4px 16px rgba(168,85,247,0.4)" }}>
            View Plans <ArrowRight size={14} />
          </Link>
        </div>

        {/* Getting Started */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-cyan-400" />
            <h2 className="text-lg font-black text-white">Getting Started</h2>
          </div>
          <p className="text-slate-500 text-sm mb-5">Your research-to-build workflow in three steps.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GETTING_STARTED.map((s) => (
              <Link key={s.step} to={s.href}
                className="group bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-5 flex flex-col transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-slate-900"
                    style={{ backgroundColor: s.color }}>
                    {s.step}
                  </div>
                  <span className="text-white font-bold text-sm">{s.title}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-3">{s.desc}</p>
                <span className="text-xs font-black transition-colors" style={{ color: s.color }}>{s.cta}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <h2 className="text-base font-black mb-4 flex items-center gap-2 text-white">
          <Radio size={16} className="text-cyan-400" /> Platform Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-12">
          {QUICK_LINKS.map((link, i) => (
            <Link key={i} to={link.href}
              className={`border rounded-xl p-4 transition-all hover:scale-[1.02] text-center ${link.bg}`}>
              <div className={`mb-2 flex justify-center ${link.color}`}>{link.icon}</div>
              <div className="text-white text-xs font-bold leading-tight">{link.label}</div>
              <div className="text-slate-500 text-[10px] mt-0.5">{link.desc}</div>
            </Link>
          ))}
        </div>

        {/* Featured Builds */}
        <h2 className="text-base font-black mb-4 flex items-center gap-2 text-white">
          <Wrench size={16} className="text-orange-400" /> Featured Build Plans
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {FEATURED_BUILDS.map((item, i) => (
            <Link key={i} to={item.href}
              className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl overflow-hidden transition-all group">
              <div className="h-36 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-orange-400 mb-0.5">{item.tag}</div>
                  <div className="text-white font-bold text-sm">{item.title}</div>
                </div>
                <ChevronRight size={15} className="text-slate-600 group-hover:text-white transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Kit Upsell */}
        <div className="bg-slate-900 border border-orange-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Package size={18} className="text-orange-400" />
            <h2 className="text-base font-black text-white">Buy a Component Kit — Build for Real</h2>
          </div>
          <p className="text-slate-500 text-sm mb-5">Pre-sourced component kits for each build plan — verified parts, ready to assemble.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "MEG Replication Parts Kit", price: "$287", badge: "Best Seller", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
              { name: "Prioré Device Component Bundle", price: "$349", badge: "Advanced", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png" },
              { name: "Scalar EM Lab Starter Kit", price: "$167", badge: "Start Here", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png" },
            ].map((kit, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-orange-800/50 transition-all">
                <div className="h-28 overflow-hidden">
                  <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-xs text-orange-400 font-black mb-1">{kit.badge}</div>
                  <h3 className="text-white font-bold text-xs mb-2 leading-snug">{kit.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black text-sm">{kit.price}</span>
                    <Link to="/build-supplies-shop"
                      className="px-3 py-1.5 rounded-lg bg-orange-800 hover:bg-orange-700 text-white text-xs font-black transition-colors">
                      Buy →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}