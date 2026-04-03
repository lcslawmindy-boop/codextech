import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Shield, Globe, TrendingUp, Star, ChevronDown, ExternalLink } from "lucide-react";

const PRODUCTS = [
  {
    name: "ZeroPointX",
    tagline: "Vacuum Energy Research Platform",
    desc: "Access suppressed zero-point energy research, scalar EM patents, and investment opportunities at the threshold of infinite vacuum potential.",
    color: "#3b82f6",
    icon: "⚡",
    link: "/investors",
  },
  {
    name: "Scalar EM Lab",
    tagline: "Interactive Quantum Field Simulator",
    desc: "Visualize and simulate scalar electromagnetic field interactions. Closed vs open system energy dynamics — the physics they didn't teach you.",
    color: "#a855f7",
    icon: "🔬",
    link: "/scalar-lab",
  },
  {
    name: "Prior Art Archive",
    tagline: "Suppressed Invention Intelligence",
    desc: "76+ documented inventors, 8 categories of suppressed technology. Cross-reference your claims against the full historical record.",
    color: "#f59e0b",
    icon: "🗄️",
    link: "/prior-art",
  },
  {
    name: "Patent Filing Wizard",
    tagline: "USPTO Provisional Application Generator",
    desc: "AI-powered patent claim drafting tuned for scalar EM, vacuum energy, and bioelectromagnetic inventions. File before the window closes.",
    color: "#22c55e",
    icon: "📋",
    link: "/patent-wizard",
  },
  {
    name: "Investor Portal",
    tagline: "Anonymized Deal Matching Engine",
    desc: "Connect suppressed-tech inventions with alignment-friendly investors and foundations — without revealing your identity.",
    color: "#06b6d4",
    icon: "💰",
    link: "/investors",
  },
  {
    name: "Concept Network",
    tagline: "Bearden Knowledge Graph",
    desc: "Explore 100+ interconnected scalar EM concepts from primary source documents. The most comprehensive Bearden research interface ever built.",
    color: "#ef4444",
    icon: "🕸️",
    link: "/",
  },
];

const PILLARS = [
  { icon: "⚡", title: "Zero Point Energy", desc: "The infinite energy of the vacuum — the suppressed source that powers the universe itself. We make it accessible." },
  { icon: "🔓", title: "Liberation Technology", desc: "Every tool we build is designed to break the controlled ceiling and return suppressed science to the people." },
  { icon: "🧬", title: "Scalar Electromagnetics", desc: "Bearden's life work — the unified field framework that connects vacuum energy, bioelectromagnetics, and free energy." },
  { icon: "🛡️", title: "Sovereign IP", desc: "Your inventions, your patents, your anonymity. We protect the inventor while maximizing their reach." },
];

const STATS = [
  { value: "76+", label: "Suppressed Inventors Documented" },
  { value: "8", label: "Technology Categories" },
  { value: "40+", label: "Vetted Alignment Investors" },
  { value: "∞", label: "Vacuum Energy Potential" },
];

export default function ZenithApex() {
  const [expandedPillar, setExpandedPillar] = useState(null);

  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col overflow-x-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-800/60 backdrop-blur-sm bg-gray-950/80 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-black">Z</div>
          <div>
            <span className="text-white font-black text-lg tracking-tight">ZENITH APEX</span>
            <span className="text-gray-600 text-xs ml-2">— Beyond the Controlled Ceiling</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={13} /> Platform
          </Link>
          <Link to="/investors" className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition-all">
            Enter Portal
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-purple-900/15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-semibold mb-8 tracking-wide">
            <Star size={11} className="text-yellow-400" />
            ZENITH APEX · ZEROPOINTX DIVISION
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            <span className="text-white">THE PEAK</span><br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              THEY DIDN'T WANT
            </span><br />
            <span className="text-white">YOU TO REACH</span>
          </h1>

          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Zenith Apex is the sovereign technology platform for suppressed science, vacuum energy research, and scalar electromagnetics — returning infinite-potential physics to the people.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base transition-all shadow-lg shadow-blue-900/40">
              <Zap size={16} /> Enter the Platform
            </Link>
            <Link to="/prior-art" className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-bold text-base transition-all">
              Explore Prior Art Archive
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-700 animate-bounce">
          <span className="text-xs">scroll</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-800 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white mb-1">{s.value}</div>
              <div className="text-gray-500 text-xs leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Four Pillars */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">The Four Pillars</h2>
          <p className="text-gray-500 text-sm">The foundation of everything we build</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PILLARS.map((p, i) => (
            <button key={i} onClick={() => setExpandedPillar(expandedPillar === i ? null : i)}
              className="text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{p.icon}</span>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1">{p.title}</h3>
                  {expandedPillar === i && (
                    <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                  )}
                  {expandedPillar !== i && (
                    <p className="text-gray-600 text-xs">Click to expand</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Product Suite */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-bold mb-4">ZEROPOINTX PRODUCT SUITE</div>
            <h2 className="text-3xl font-black text-white mb-3">Six Tools. One Mission.</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">Every product in the ZeroPointX suite is engineered to unlock suppressed knowledge, protect sovereign inventors, and accelerate the free energy transition.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {PRODUCTS.map((product, i) => (
              <Link key={i} to={product.link}
                className="group bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: product.color + "20" }}>
                    {product.icon}
                  </div>
                  <ExternalLink size={14} className="text-gray-700 group-hover:text-gray-400 transition-colors" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-0.5">{product.name}</h3>
                  <p className="text-xs font-semibold mb-2" style={{ color: product.color }}>{product.tagline}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{product.desc}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-800">
                  <span className="text-xs font-bold group-hover:underline" style={{ color: product.color }}>Access Tool →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-3xl mx-auto mb-8">⚡</div>
        <h2 className="text-4xl font-black text-white mb-6 leading-tight">
          "We operate at the threshold<br />of the vacuum."
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          Bearden proved the vacuum is not empty — it is the source of infinite, extractable energy. Every empire built on controlled scarcity depends on you never learning this. Zenith Apex exists to end that dependency.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/investors" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-green-700 hover:bg-green-600 text-white font-black text-sm transition-all">
            <Shield size={15} /> Investor Portal
          </Link>
          <Link to="/patent-wizard" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-600 text-white font-black text-sm transition-all">
            <TrendingUp size={15} /> File Your Patent
          </Link>
          <Link to="/monitoring" className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-700 hover:border-gray-500 text-gray-300 font-bold text-sm transition-all">
            <Globe size={15} /> IP Monitoring
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-black">Z</div>
          <span className="text-white font-black tracking-tight">ZENITH APEX</span>
          <span className="text-gray-700 text-xs">· ZeroPointX Division</span>
        </div>
        <p className="text-gray-600 text-xs">Beyond the Controlled Ceiling · Suppressed Science Returns to the People</p>
      </footer>
    </div>
  );
}