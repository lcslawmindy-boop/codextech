import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useTier } from "@/hooks/useTier";
import { Zap, BookOpen, Wrench, ArrowRight, Shield, ChevronRight, Package, FileText, FlaskConical } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";

const KITS = [
  { name: "MEG Replication Parts Kit", price: "$287", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png", href: "/build-supplies-shop" },
  { name: "Prioré Device Component Bundle", price: "$349", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png", href: "/build-supplies-shop" },
  { name: "Scalar EM Lab Starter Kit", price: "$167", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png", href: "/build-supplies-shop" },
];

const QUICK_LINKS = [
  { label: "Research Database", href: "/codextech-database", icon: <BookOpen size={16} />, color: "text-cyan-400", desc: "Full database" },
  { label: "Build Plans", href: "/build-plans", icon: <Wrench size={16} />, color: "text-orange-400", desc: "6 systems" },
  { label: "Patent Tool", href: "/patent-tool", icon: <Shield size={16} />, color: "text-green-400", desc: "Draft now" },
  { label: "Source Docs", href: "/source-documents", icon: <FileText size={16} />, color: "text-purple-400", desc: "40+ patents" },
  { label: "Scalar Lab", href: "/scalar-lab", icon: <FlaskConical size={16} />, color: "text-blue-400", desc: "Simulator" },
  { label: "Prior Art", href: "/prior-art", icon: <Zap size={16} />, color: "text-yellow-400", desc: "200+ entries" },
];

const RECOMMENDED = [
  { title: "MEG System Module", category: "Free Energy", href: "/research-module?module=meg-system", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
  { title: "Prioré EM Chamber Module", category: "Bioelectromagnetics", href: "/research-module?module=priore-device", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png" },
  { title: "Scalar Transmitter Module", category: "Scalar EM", href: "/research-module?module=scalar-transmitter", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png" },
];

export default function MemberDashboard() {
  const { tier, loading, refetch } = useTier();
  const [user, setUser] = useState(null);
  const isMember = tier && tier !== "free";

  const loadUser = useCallback(() => base44.auth.me().then(u => setUser(u)).catch(() => {}), []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([loadUser(), refetch?.()]);
  }, [loadUser, refetch]);

  const { containerRef, pullY, refreshing } = usePullToRefresh(handleRefresh);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white relative" ref={containerRef}>
      <PullToRefreshIndicator pullY={pullY} refreshing={refreshing} />

      {/* Top bar */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
          </Link>
          <div>
            <div className="text-white font-bold text-sm">
              {user?.full_name ? `Welcome back, ${user.full_name.split(" ")[0]}` : "Member Dashboard"}
            </div>
            <div className="text-xs font-black text-cyan-400">
              {isMember ? "Research Member" : "Free Tier"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/account" className="text-gray-400 hover:text-white text-sm transition-colors">Account</Link>
          {!isMember && (
            <Link to="/pricing"
              className="px-4 py-2 rounded-lg text-white text-sm font-black transition-all hover:opacity-90 bg-cyan-700">
              Join $49/mo
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* Membership upsell — only for free users */}
        {!isMember && (
          <div className="mb-8 rounded-2xl p-6 border border-cyan-800/40 bg-gradient-to-br from-cyan-950/30 to-gray-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-black text-white text-lg mb-1">Unlock Full Access — $49/month</div>
              <p className="text-gray-400 text-sm">40+ patents, 8 research modules, build plans, AI patent tools. Cancel anytime.</p>
            </div>
            <Link to="/pricing"
              className="px-6 py-3 rounded-xl text-white font-black text-sm whitespace-nowrap flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 transition-colors flex-shrink-0">
              Join Now — $49/mo <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Start Here */}
        <div className="mb-10 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-cyan-400" />
            <h2 className="text-lg font-black text-white">Start Here</h2>
          </div>
          <p className="text-gray-500 text-sm mb-5">Three steps to your first working build.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: 1, title: "Research Database", desc: "Structured modules, patents, and engineering frameworks.", cta: "Open Database →", href: "/codextech-database", color: "#f97316" },
              { step: 2, title: "Build Plans", desc: "Full architecture docs, BOMs, and assembly instructions.", cta: "View Build Plans →", href: "/build-plans", color: "#3b82f6" },
              { step: 3, title: "Patent Your Work", desc: "Generate a USPTO-compliant provisional patent application.", cta: "Draft Patent →", href: "/patent-tool", color: "#22c55e" },
            ].map((s) => (
              <Link key={s.step} to={s.href}
                className="group bg-gray-950 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-gray-900" style={{ backgroundColor: s.color }}>
                    {s.step}
                  </div>
                  <span className="text-white font-bold text-sm">{s.title}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed flex-1 mb-3">{s.desc}</p>
                <span className="text-xs font-black" style={{ color: s.color }}>{s.cta}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access */}
        <h2 className="text-base font-black mb-4 text-gray-300 uppercase tracking-widest text-xs">Quick Access</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-12">
          {QUICK_LINKS.map((link, i) => (
            <Link key={i} to={link.href}
              className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-3 sm:p-4 transition-all text-center sm:text-left">
              <div className={`mb-1.5 flex sm:block justify-center ${link.color}`}>{link.icon}</div>
              <div className="text-white text-xs font-bold leading-tight">{link.label}</div>
              <div className="text-gray-500 text-xs mt-0.5 hidden sm:block">{link.desc}</div>
            </Link>
          ))}
        </div>

        {/* Research Modules */}
        <h2 className="text-base font-black mb-4 text-gray-300 uppercase tracking-widest text-xs">Research Modules</h2>
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

        {/* Kit upsell */}
        <div className="bg-gray-900 border border-orange-900/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <Package size={18} className="text-orange-400" />
            <h2 className="text-base font-black">Buy the Kit — Build for Real</h2>
          </div>
          <p className="text-gray-500 text-sm mb-5">You have the plans. Get the components delivered — sourced, pre-verified, ready to assemble.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {KITS.map((kit, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden hover:border-orange-800/50 transition-all">
                <div className="h-28 overflow-hidden">
                  <img src={kit.img} alt={kit.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h3 className="text-white font-bold text-xs mb-2 leading-snug">{kit.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-black text-sm">{kit.price}</span>
                    <Link to={kit.href}
                      className="px-3 py-1.5 rounded-lg bg-orange-800 hover:bg-orange-700 text-white text-xs font-black transition-colors">
                      Buy
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