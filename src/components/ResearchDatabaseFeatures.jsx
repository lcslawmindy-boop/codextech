import { Link } from "react-router-dom";
import { Database, Gavel, Wrench, FileSearch, Brain, BookOpen, FlaskConical, Network } from "lucide-react";

const FEATURES = [
  {
    title: "Concept Graph",
    desc: "Interactive knowledge network of 90+ suppressed physics, bioelectromagnetics & consciousness concepts with source fragments.",
    icon: Network,
    color: "#00ff41",
    to: "/",
    stat: "93 nodes",
    tag: "Research Database",
  },
  {
    title: "Patent Suite",
    desc: "Drafting wizard, claims generator, prior art archive, FTO analysis, and patent landscape mapping.",
    icon: Gavel,
    color: "#06b6d4",
    to: "/patent-hub",
    stat: "8 tools",
    tag: "IP Creation",
  },
  {
    title: "Invention Library",
    desc: "Build plans, 3D device gallery, exploded CAD views, and engineering documentation for 20+ inventions.",
    icon: Wrench,
    color: "#f59e0b",
    to: "/device-catalogue",
    stat: "20+ builds",
    tag: "Hardware",
  },
  {
    title: "Prior Art Archive",
    desc: "Searchable database of suppressed patents, failed experiments, and classified research outcomes.",
    icon: FileSearch,
    color: "#a855f7",
    to: "/prior-art",
    stat: "50+ entries",
    tag: "Research",
  },
  {
    title: "Scalar EM Lab",
    desc: "Live simulators for scalar waves, interference fields, and electromagnetic phase conjugation.",
    icon: FlaskConical,
    color: "#ec4899",
    to: "/scalar-lab",
    stat: "4 simulators",
    tag: "Simulation",
  },
  {
    title: "AI Research Assistant",
    desc: "LLM-powered research queries, document generation, and patent opportunity analysis.",
    icon: Brain,
    color: "#22c55e",
    to: "/ai-research",
    stat: "Unlimited",
    tag: "AI Engine",
  },
];

export default function ResearchDatabaseFeatures() {
  return (
    <section className="py-14 px-6 bg-gray-950 border-t border-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-950/40 border border-green-800/50 text-green-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Database size={12} /> Research Database
            </div>
            <h2 className="text-2xl font-black text-white">Top Research Features</h2>
            <p className="text-gray-500 text-sm mt-1">The core tools for IP discovery, patent creation, and suppressed-tech research</p>
          </div>
          <Link to="/patent-hub" className="text-green-400 hover:text-green-300 text-sm font-bold flex items-center gap-1">
            Explore all tools →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <Link
                key={i}
                to={f.to}
                className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-800 text-gray-500 border border-gray-700">{f.tag}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-base">{f.title}</h3>
                  <span className="text-[10px] font-mono text-gray-600">{f.stat}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}