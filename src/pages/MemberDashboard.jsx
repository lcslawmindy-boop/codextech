import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useTier } from "@/hooks/useTier";
import { Zap, BookOpen, Wrench, TrendingUp, Star, ArrowRight, Lock, Shield, ChevronRight, Award, Package } from "lucide-react";

// ── Kit upsells ───────────────────────────────────────────────────────────────
const KITS = [
  { name: "MEG Replication Parts Kit", price: "$287", badge: "Best Seller", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png", href: "/build-supplies-shop" },
  { name: "Prioré Device Component Bundle", price: "$349", badge: "Advanced", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png", href: "/build-supplies-shop" },
  { name: "Scalar EM Lab Starter Kit", price: "$167", badge: "Start Here", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png", href: "/build-supplies-shop" },
];

const QUICK_LINKS = [
  { label: "Build Plans", href: "/invention-plans", icon: <Wrench size={16} />, color: "text-orange-400", desc: "40+ systems" },
  { label: "Courses", href: "/courses", icon: <BookOpen size={16} />, color: "text-blue-400", desc: "40+ courses" },
  { label: "AI Patent Tool", href: "/patent-tool", icon: <Shield size={16} />, color: "text-green-400", desc: "Draft in minutes" },
  { label: "Investor Package", href: "/investor-package", icon: <TrendingUp size={16} />, color: "text-purple-400", desc: "Full capital kit" },
  { label: "Prior Art Archive", href: "/prior-art", icon: <Star size={16} />, color: "text-yellow-400", desc: "200+ entries" },
  { label: "Lab Simulator", href: "/scalar-lab", icon: <Zap size={16} />, color: "text-cyan-400", desc: "No hardware needed" },
];

const RECOMMENDED = [
  { title: "MEG Replication Kit", category: "Free Energy", href: "/invention-plans", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
  { title: "Gravitobiology Course", category: "Course", href: "/courses", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54a56d57f_generated_image.png" },
  { title: "Anenergy Pump Circuit", category: "Energy Systems", href: "/invention-plans", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png" },
];

const TIER_META = {
  free:       { label: "Free",    color: "text-gray-400",   hex: "#9ca3af" },
  starter:    { label: "Starter", color: "text-cyan-400",   hex: "#06b6d4" },
  pro:        { label: "Pro",     color: "text-purple-400", hex: "#8b5cf6" },
  elite:      { label: "Elite",   color: "text-yellow-400", hex: "#f59e0b" },
  researcher: { label: "Pro",     color: "text-purple-400", hex: "#8b5cf6" },
  member:     { label: "Starter", color: "text-cyan-400",   hex: "#06b6d4" },
};

export default function MemberDashboard() {
  const { tier, loading } = useTier();
  const [user, setUser] = useState(null);
  const meta = TIER_META[tier] || TIER_META.free;

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Top bar */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
          </Link>
          <div>
            <div className="text-white font-bold text-sm">
              {user?.full_name ? `Welcome back, ${user.full_name.split(" ")[0]}` : "Welcome back"}
            </div>
            <div className={`text-xs font-black ${meta.color}`}>{meta.label} Member</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/account" className="text-gray-400 hover:text-white text-sm transition-colors">Account</Link>
          {tier !== "elite" && (
            <Link to="/pricing"
              className="px-4 py-2 rounded-lg text-white text-sm font-black transition-all hover:opacity-90"
              style={{ backgroundColor: meta.hex }}>
              Upgrade
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Upgrade banner */}
        {tier !== "elite" && (
          <div className="mb-8 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border"
            style={{ background: `${meta.hex}08`, borderColor: `${meta.hex}30` }}>
            <div>
              <div className="font-black text-white mb-1">
                {tier === "starter" || tier === "member"
                  ? "Upgrade to Pro — Unlock 25 More Systems + Full AI Suite"
                  : "Upgrade to Elite — Restricted Systems + Monthly 1-on-1"}
              </div>
              <p className="text-gray-400 text-sm">
                {tier === "starter" || tier === "member"
                  ? "Pro unlocks all 40+ builds, all 40+ courses, the full AI patent + investor suite. $79/month."
                  : "Elite unlocks defense-adjacent systems and a monthly strategy session. $149/month."}
              </p>
            </div>
            <Link to="/pricing"
              className="px-6 py-3 rounded-xl text-white font-black text-sm whitespace-nowrap transition-all hover:opacity-90 flex items-center gap-2 flex-shrink-0"
              style={{ backgroundColor: meta.hex, boxShadow: `0 4px 16px ${meta.hex}40` }}>
              Upgrade Now <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Quick Access */}
        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
          <Zap size={16} className="text-cyan-400" /> Quick Access
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-12">
          {QUICK_LINKS.map((link, i) => (
            <Link key={i} to={link.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-3 sm:p-4 transition-all group text-center sm:text-left">
              <div className={`mb-1.5 flex sm:block justify-center ${link.color}`}>{link.icon}</div>
              <div className="text-white text-xs font-bold leading-tight">{link.label}</div>
              <div className="text-gray-500 text-xs mt-0.5 hidden sm:block">{link.desc}</div>
            </Link>
          ))}
        </div>

        {/* Recommended */}
        <h2 className="text-lg font-black mb-4 flex items-center gap-2">
          <Star size={16} className="text-yellow-400" /> Recommended for You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {RECOMMENDED.map((item, i) => (
            <Link key={i} to={item.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden transition-all group">
              <div className="h-36 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{item.category}</div>
                  <div className="text-white font-bold text-sm">{item.title}</div>
                </div>
                <ChevronRight size={15} className="text-gray-600 group-hover:text-white transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Kit upsell — physical revenue driver */}
        <div className="bg-gray-900 border border-orange-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Package size={18} className="text-orange-400" />
            <h2 className="text-lg font-black">Buy the Kit — Build for Real</h2>
          </div>
          <p className="text-gray-500 text-sm mb-5">You have the plans. Get the components delivered — sourced, pre-verified, ready to assemble.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {KITS.map((kit, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-800/50 transition-all">
                <div className="h-28 overflow-hidden">
                  <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="text-xs text-orange-400 font-black mb-1">{kit.badge}</div>
                  <h3 className="text-white font-bold text-xs mb-2 leading-snug">{kit.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black text-sm">{kit.price}</span>
                    <Link to={kit.href}
                      className="px-3 py-1.5 rounded-lg bg-orange-800 hover:bg-orange-700 text-white text-xs font-black transition-colors">
                      Buy →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/build-supplies-shop" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              Browse all kits →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}