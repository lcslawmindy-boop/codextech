import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Wrench, BookOpen, Shield, TrendingUp, Star, Zap, Package } from "lucide-react";

// ── Kit upsells — physical products ──────────────────────────────────────────
const KIT_UPSELLS = [
  {
    name: "MEG Replication Parts Kit",
    desc: "All 23 components to build the peer-reviewed COP>1 device. Sourced & pre-verified.",
    price: "$287",
    badge: "Best Seller",
    badgeColor: "bg-orange-900/50 border-orange-800 text-orange-300",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png",
    href: "/build-supplies-shop",
    priceId: "prod_UKE3yIddCPw1IV",
  },
  {
    name: "Scalar EM Lab Starter Kit",
    desc: "Foundation circuit components for your first scalar build. Beginner-friendly sourcing.",
    price: "$167",
    badge: "Start Here",
    badgeColor: "bg-cyan-900/50 border-cyan-800 text-cyan-300",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png",
    href: "/build-supplies-shop",
    priceId: "prod_UKE33DR5C4nFUQ",
  },
  {
    name: "Prioré Device Component Bundle",
    desc: "Multichannel EM therapy components. Sourced, bundled, and ready for assembly.",
    price: "$349",
    badge: "Advanced",
    badgeColor: "bg-purple-900/50 border-purple-800 text-purple-300",
    img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png",
    href: "/build-supplies-shop",
    priceId: "prod_UKE3JFoRjrxfmV",
  },
];

// ── Tier config ───────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  starter: { name: "Starter", color: "#06b6d4", builds: 15, courses: 15 },
  pro:     { name: "Pro",     color: "#8b5cf6", builds: "40+", courses: "40+" },
  elite:   { name: "Elite",   color: "#f59e0b", builds: "40+ (incl. restricted)", courses: "40+ (priority)" },
};

const QUICK_START = [
  { emoji: "🔧", label: "Browse Build Plans", sub: "Pick your first device to build", href: "/invention-plans" },
  { emoji: "📚", label: "Start a Course", sub: "Scalar EM fundamentals — Module 1", href: "/courses" },
  { emoji: "🛡️", label: "Draft a Patent", sub: "AI patent tool — provisional in minutes", href: "/patent-tool" },
  { emoji: "📊", label: "Your Dashboard", sub: "Access all your unlocked content", href: "/member-dashboard" },
];

export default function PostPurchaseOnboarding() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product") || "pro";
  const tier = TIER_CONFIG[productId] || TIER_CONFIG.pro;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── Success header ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-7 w-7 object-contain" />
          <span className="font-black text-base">ZARP Engineering Vault</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-black" style={{ backgroundColor: `${tier.color}20`, color: tier.color, border: `1px solid ${tier.color}50` }}>
          {tier.name} Member
        </span>
      </div>

      {/* ── Hero confirmation ── */}
      <div className="text-center px-5 py-16 bg-gradient-to-b from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: `${tier.color}15`, border: `2px solid ${tier.color}` }}>
          <CheckCircle2 size={36} style={{ color: tier.color }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3">You're In. Welcome to the Vault.</h1>
        <p className="text-gray-400 max-w-lg mx-auto text-base leading-relaxed mb-6">
          Your <span style={{ color: tier.color }} className="font-black">{tier.name} membership</span> is active. Access {tier.builds} build plans, {tier.courses} courses, and the full AI toolkit — right now.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/member-dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-white transition-all hover:opacity-90"
            style={{ backgroundColor: tier.color, boxShadow: `0 4px 20px ${tier.color}40` }}>
            Go to My Dashboard <ArrowRight size={16} />
          </Link>
          <Link to="/invention-plans"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-gray-300 bg-gray-800 hover:bg-gray-700 transition-all border border-gray-700">
            <Wrench size={16} /> Browse Build Plans
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-14">

        {/* ── What's unlocked ── */}
        <h2 className="text-xl font-black mb-6 flex items-center gap-2">
          <Zap size={18} style={{ color: tier.color }} /> What You Just Unlocked
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
          {[
            { icon: <Wrench size={20} className="text-orange-400" />, value: tier.builds, label: "Build Plans" },
            { icon: <BookOpen size={20} className="text-blue-400" />, value: tier.courses, label: "Courses" },
            { icon: <Shield size={20} className="text-green-400" />, value: "Full", label: "AI Patent Suite" },
            { icon: <TrendingUp size={20} className="text-purple-400" />, value: "200+", label: "Prior Art Entries" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <div className="flex justify-center mb-2">{item.icon}</div>
              <div className="text-2xl font-black text-white">{item.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ── Quick start ── */}
        <h2 className="text-xl font-black mb-5">Where Do You Want to Start?</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {QUICK_START.map((item, i) => (
            <Link key={i} to={item.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <p className="text-white font-bold text-sm leading-snug">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1">{item.sub}</p>
            </Link>
          ))}
        </div>

        {/* ── Kit upsell — first CTA to physical revenue ── */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-900 border border-orange-900/40 rounded-2xl p-7 mb-14">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-orange-400" />
            <h2 className="text-xl font-black">Stop Simulating. Buy the Kit.</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            You now have the build plans. Get the components delivered to your door — pre-verified, sourced, and ready for assembly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {KIT_UPSELLS.map((kit, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition-all">
                <div className="h-32 overflow-hidden relative">
                  <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded border ${kit.badgeColor}`}>{kit.badge}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold text-sm mb-1">{kit.name}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3">{kit.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black">{kit.price}</span>
                    <Link to={kit.href}
                      className="px-3 py-1.5 rounded-lg bg-orange-700 hover:bg-orange-600 text-white text-xs font-black transition-colors">
                      Buy Kit →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Upgrade nudge for non-elite ── */}
        {productId !== "elite" && (
          <div className="bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-800/40 rounded-2xl p-7 mb-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-yellow-400" />
                <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">Next Level</span>
              </div>
              <h3 className="text-white font-black text-lg mb-1">
                {productId === "starter" ? "Upgrade to Pro — Unlock 25 More Systems" : "Upgrade to Elite — Restricted Systems + Monthly 1-on-1"}
              </h3>
              <p className="text-gray-400 text-sm">
                {productId === "starter"
                  ? "Pro gives you all 40+ builds, all 40+ courses, the full AI patent suite, and the investor toolkit. $79/month."
                  : "Elite unlocks defense-adjacent systems and gives you a monthly strategy call. $149/month."}
              </p>
            </div>
            <Link to="/pricing"
              className="px-6 py-3 rounded-xl font-black text-sm text-white whitespace-nowrap transition-all hover:opacity-90 flex-shrink-0"
              style={{ backgroundColor: productId === "starter" ? "#8b5cf6" : "#f59e0b", boxShadow: `0 4px 16px ${productId === "starter" ? "#8b5cf644" : "#f59e0b44"}` }}>
              Upgrade Now →
            </Link>
          </div>
        )}

        {/* ── Final nav ── */}
        <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="font-black text-white text-xl mb-2">The vault is open. Go build something.</h3>
          <p className="text-gray-500 text-sm mb-6">Every system is waiting. Full BOMs. Step-by-step. PDF. Video.</p>
          <Link to="/member-dashboard"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-black text-white transition-all hover:opacity-90"
            style={{ backgroundColor: tier.color, boxShadow: `0 4px 20px ${tier.color}40` }}>
            Open My Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · ZARP Engineering Vault · Educational & research purposes only</p>
      </footer>
    </div>
  );
}