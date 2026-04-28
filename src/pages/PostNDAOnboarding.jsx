import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, BookOpen, Hammer, Network, Scroll, FileText, Sparkles, Layers, Video, X } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    id: "courses",
    title: "Course Library",
    desc: "40+ structured courses on scalar EM, bioelectromagnetics, patent strategy, vacuum energy",
    icon: <BookOpen size={32} />,
    color: "from-blue-600 to-blue-700",
    link: "/courses",
    tag: "Learning",
  },
  {
    id: "builds",
    title: "Build Plans & Kits",
    desc: "Complete BOMs, schematics, supplier links for MEG, scalar transmitter, Prioré device, and more",
    icon: <Hammer size={32} />,
    color: "from-orange-600 to-orange-700",
    link: "/build-plans",
    tag: "Engineering",
  },
  {
    id: "bearden-graph",
    title: "Bearden Research Network",
    desc: "Interactive graph mapping 40+ EM inventions, patents, research nodes, and interconnections",
    icon: <Network size={32} />,
    color: "from-purple-600 to-purple-700",
    link: "/vault",
    tag: "Discovery",
  },
  {
    id: "patent-monitor",
    title: "Prior Art Patent Monitor",
    desc: "200+ suppressed, shelved, and declassified patents with risk analysis and design-around strategies",
    icon: <Scroll size={32} />,
    color: "from-red-600 to-red-700",
    link: "/prior-art",
    tag: "Intelligence",
  },
  {
    id: "patent-drafting",
    title: "Patent Drafting Suite",
    desc: "AI-powered USPTO-ready provisional patents, claims analysis, FTO assessments in minutes",
    icon: <FileText size={32} />,
    color: "from-green-600 to-green-700",
    link: "/patent-drafting-wizard",
    tag: "IP Strategy",
  },
  {
    id: "invention-forge",
    title: "Invention Forge",
    desc: "Combine multiple technologies—merge similar systems or cross-pollinate domains for novel hybrids",
    icon: <Sparkles size={32} />,
    color: "from-yellow-600 to-yellow-700",
    link: "/inventor-forge",
    tag: "Innovation",
  },
  {
    id: "ip-marketplace",
    title: "IP Marketplace",
    desc: "License, trade, or co-develop invention concepts with vetted researchers and institutions",
    icon: <Layers size={32} />,
    color: "from-pink-600 to-pink-700",
    link: "/ip-marketplace",
    tag: "Collaboration",
  },
  {
    id: "build-videos",
    title: "Build Videos & Assembly Guides",
    desc: "Step-by-step video walkthroughs for assembling devices with component sourcing tips",
    icon: <Video size={32} />,
    color: "from-cyan-600 to-cyan-700",
    link: "/invention-plans",
    tag: "Execution",
  },
];

const STAT_CARDS = [
  { label: "Complete Build Plans", value: "40+", icon: "🔧" },
  { label: "Courses & Lessons", value: "200+", icon: "📚" },
  { label: "Prior Art Entries", value: "200+", icon: "📜" },
  { label: "Research Nodes", value: "1000+", icon: "🧠" },
];

export default function PostNDAOnboarding() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAIWelcome, setShowAIWelcome] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!showAIWelcome) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          window.location.href = "/courses";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showAIWelcome]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">
      {/* ── AI Welcome Banner ── */}
      {showAIWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border-b border-cyan-700/50 px-6 py-6"
        >
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xl">🤖</span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-black text-white mb-2">Welcome to Your Research Vault</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Your NDA has been verified. You now have full access to 40+ build plans, 200+ courses, and the Bearden Research Network. Start with our Course Library to understand the theoretical framework, then explore the interconnected research nodes.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    to="/courses"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors"
                  >
                    Go to Courses <ArrowRight size={14} />
                  </Link>
                  <span className="text-xs font-bold text-cyan-300">
                    Auto-redirecting in {countdown}s
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAIWelcome(false)}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0 mt-1"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Header ── */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-black uppercase tracking-widest">NDA Verified</span>
            </div>
            <Link to="/pricing" className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
              Skip to Pricing →
            </Link>
          </div>
          <h1 className="text-4xl font-black mb-2">Your Research Vault is Open</h1>
          <p className="text-gray-400 max-w-2xl">
            Explore all available tools, courses, build plans, and AI features. No paywalls on this tour—just unlimited discovery.
          </p>
        </div>
      </div>

      {/* ── Hero Stats ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {STAT_CARDS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center hover:border-cyan-600 transition-colors"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-cyan-400">{stat.value}</div>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-black mb-2">Everything You Can Access</h2>
        <p className="text-gray-400 mb-12">Click any to explore. Pricing unlocks advanced features and video assembly guides.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group"
            >
              <Link
                to={feature.link}
                className={`block p-6 rounded-2xl border border-gray-700 hover:border-cyan-500 transition-all h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-800 hover:to-gray-800/50`}
              >
                {/* Icon & Tag */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-black bg-gray-700/50 text-gray-300">
                    {feature.tag}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-lg font-black text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{feature.desc}</p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-y border-gray-800">
        <h2 className="text-3xl font-black mb-2">Free vs. Premium Access</h2>
        <p className="text-gray-400 mb-8">All tools are visible and explorable. Premium membership adds video assembly, live sourcing, and advanced AI features.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-black">Feature</th>
                <th className="text-center py-3 px-4 font-black">Browse Free</th>
                <th className="text-center py-3 px-4 font-black">Premium Unlock</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "40+ Build Plans (BOMs & Schematics)", free: "✓", premium: "✓ + Video Assembly" },
                { feature: "200+ Course Modules", free: "✓ Titles & Descriptions", premium: "✓ Full Video Content" },
                { feature: "Bearden Research Graph", free: "✓ Browse & Search", premium: "✓ Advanced Analytics" },
                { feature: "Patent Drafting AI", free: "✓ Preview", premium: "✓ Generate & File" },
                { feature: "Prior Art Database", free: "✓ Search", premium: "✓ Download PDFs" },
                { feature: "Build Videos", free: "✗", premium: "✓ Step-by-Step Assembly" },
                { feature: "Component Sourcing", free: "✗", premium: "✓ Verified Suppliers" },
                { feature: "Invention Forge (Hybrid Merge)", free: "✓ Concept", premium: "✓ Full Patent Draft" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-green-400 font-bold">{row.free}</td>
                  <td className="py-3 px-4 text-center text-cyan-400 font-bold">{row.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-black mb-4">Ready to Unlock Full Access?</h2>
        <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
          Explore the platform free. Upgrade when you're ready for video assembly, component sourcing, and advanced AI patent generation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <motion.a
            href="/vault"
            whileHover={{ scale: 1.05 }}
            className="px-10 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white font-black transition-all"
          >
            Continue Exploring Free
          </motion.a>
          <motion.a
            href="/pricing"
            whileHover={{ scale: 1.05 }}
            className="px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black shadow-lg shadow-cyan-900/50 transition-all flex items-center justify-center gap-2"
          >
            <Zap size={18} /> View Premium Plans
          </motion.a>
        </div>

        <p className="text-gray-600 text-xs">
          No commitments. Cancel anytime. All research tools remain free to explore.
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 bg-gray-950/50 text-center text-gray-600 text-xs">
        <p className="font-bold">You're in the vault. Explore everything.</p>
      </footer>
    </div>
  );
}