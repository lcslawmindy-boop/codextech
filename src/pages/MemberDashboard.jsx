import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useTier } from "@/hooks/useTier";
import { Zap, BookOpen, Wrench, TrendingUp, Star, ArrowRight, Lock, Shield, ChevronRight, Award } from "lucide-react";

const QUICK_LINKS = [
  { label: "Invention Library", href: "/invention-library", icon: <Wrench size={16} />, color: "text-orange-400", desc: "40+ build plans" },
  { label: "Course Catalog", href: "/courses", icon: <BookOpen size={16} />, color: "text-blue-400", desc: "40+ courses" },
  { label: "AI Patent Tool", href: "/patent-tool", icon: <Shield size={16} />, color: "text-green-400", desc: "Draft in minutes" },
  { label: "Investor Package", href: "/investor-package", icon: <TrendingUp size={16} />, color: "text-purple-400", desc: "Full capital kit" },
  { label: "Prior Art Archive", href: "/prior-art", icon: <Star size={16} />, color: "text-yellow-400", desc: "200+ entries" },
  { label: "Lab Simulator", href: "/scalar-lab", icon: <Zap size={16} />, color: "text-cyan-400", desc: "No hardware needed" },
];

const RECOMMENDED = [
  { title: "MEG Replication Kit", category: "Free Energy", href: "/invention-library", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png" },
  { title: "Gravitobiology Course", category: "Course", href: "/courses", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54a56d57f_generated_image.png" },
  { title: "Anenergy Pump Circuit", category: "Energy Systems", href: "/invention-library", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0fed0468f_generated_image.png" },
];

const UPSELLS = [
  { title: "MEG Replication Parts Kit", price: "$287", desc: "All components to build the peer-reviewed COP>1 device", href: "/build-supplies-shop", badge: "Best Seller" },
  { title: "Prioré Device Component Bundle", price: "$349", desc: "Multichannel EM therapy components, sourced & bundled", href: "/build-supplies-shop", badge: "Premium" },
  { title: "Scalar EM Lab Starter Kit", price: "$167", desc: "Foundation circuit kit — perfect for your first scalar build", href: "/build-supplies-shop", badge: "Starter" },
];

export default function MemberDashboard() {
  const { tier, loading } = useTier();
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      if (u) {
        base44.entities.CourseProgress.filter({ user_email: u.email }).then(p => setProgress(p));
      }
    }).catch(() => {});
  }, []);

  const tierLabel = { free: "Free", starter: "Starter", researcher: "Researcher", pro: "Pro", member: "Member" }[tier] || "Member";
  const tierColor = { free: "text-gray-400", starter: "text-cyan-400", researcher: "text-blue-400", pro: "text-purple-400", member: "text-cyan-400" }[tier] || "text-cyan-400";

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin" /></div>;
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
            <div className="text-white font-bold text-sm">Welcome back{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}</div>
            <div className={`text-xs font-semibold ${tierColor}`}>{tierLabel} Member</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/account" className="text-gray-400 hover:text-white text-sm transition-colors">Account</Link>
          <Link to="/pricing" className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-sm font-bold transition-all hover:opacity-90">
            Upgrade
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Upgrade banner for non-pro */}
        {tier !== "pro" && (
          <div className="mb-8 bg-gradient-to-r from-cyan-950/60 to-purple-950/40 border border-cyan-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-black text-white mb-1">Unlock Pro — Full Vault + All AI Tools</div>
              <p className="text-gray-400 text-sm">You're on {tierLabel}. Upgrade to access all 40+ builds, courses, and AI tools.</p>
            </div>
            <Link to="/pricing" className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm whitespace-nowrap transition-all hover:opacity-90 flex items-center gap-2">
              Upgrade Now <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Quick Access Grid */}
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Zap size={18} className="text-cyan-400" /> Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {QUICK_LINKS.map((link, i) => (
            <Link key={i} to={link.href} className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all group">
              <div className={`mb-2 ${link.color}`}>{link.icon}</div>
              <div className="text-white text-xs font-bold leading-tight">{link.label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{link.desc}</div>
            </Link>
          ))}
        </div>

        {/* Recommended Builds */}
        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Star size={18} className="text-yellow-400" /> Recommended for You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {RECOMMENDED.map((item, i) => (
            <Link key={i} to={item.href} className="bg-gray-900 border border-gray-800 hover:border-cyan-800 rounded-xl overflow-hidden transition-all group">
              <div className="h-36 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">{item.category}</div>
                  <div className="text-white font-bold text-sm">{item.title}</div>
                </div>
                <ChevronRight size={16} className="text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        {/* Upsell — Physical Kits */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-900 border border-orange-900/40 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award size={20} className="text-orange-400" />
            <h2 className="text-xl font-black">Buy the Kit — Build for Real</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {UPSELLS.map((u, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-orange-900/50 border border-orange-800 text-orange-300 font-bold">{u.badge}</span>
                  <span className="text-green-400 font-black">{u.price}</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{u.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-4">{u.desc}</p>
                <Link to={u.href} className="block text-center py-2 rounded-lg bg-orange-800 hover:bg-orange-700 text-white text-xs font-bold transition-colors">
                  Buy the Kit →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}