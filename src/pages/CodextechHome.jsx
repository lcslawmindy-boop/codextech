import { Link } from "react-router-dom";
import { ArrowRight, Database, Zap, BookOpen, Lock } from "lucide-react";
import CodextechAkashicBackground from "../components/CodextechAkashicBackground";

export default function CodextechHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900 relative">
      {/* Akashic Background */}
      <CodextechAkashicBackground />

      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">CX</div>
            <span className="font-black text-sm">C.O.D.E.X.T.E.C.H.</span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <a href="#database" className="text-gray-600 hover:text-gray-900">Database</a>
            <a href="#pillars" className="text-gray-600 hover:text-gray-900">Research</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Patent Intelligence</a>
            <Link to="/codextech-pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link to="/codextech-pricing" className="px-4 py-2 rounded-lg bg-gray-900 text-white font-bold text-xs hover:bg-gray-800">
              Access Database
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 py-20 border-b border-gray-200 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-gray-600 px-3 py-1.5 bg-gray-100 rounded-full inline-block">
              Private Research Platform
            </span>
          </div>
          <h1 className="text-6xl font-black leading-[1.1] text-gray-900 mb-6">
            Private Research Infrastructure for Applied Physics, Patent Intelligence & Advanced Systems
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mb-8">
            A premium research database organizing patents, experimental literature, technical archives, and engineering frameworks into structured systems for serious builders, researchers, and technical founders.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/codextech-database"
              className="px-8 py-4 rounded-lg bg-gray-900 text-white font-black hover:bg-gray-800 transition-colors flex items-center gap-2">
              Access the Research Database <ArrowRight size={18} />
            </Link>
            <Link to="/codextech-pricing"
              className="px-8 py-4 rounded-lg border-2 border-gray-900 text-gray-900 font-black hover:bg-gray-50 transition-colors">
              View Research Modules
            </Link>
          </div>
        </div>
      </section>

      {/* AUTHORITY STRIP */}
      <section className="px-6 py-8 bg-gray-50 border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-8 flex-wrap text-center text-sm font-bold text-gray-700">
          <span>✓ Patent Literature (USPTO)</span>
          <span>✓ Peer-Reviewed Journals</span>
          <span>✓ Declassified Archives</span>
          <span>✓ Engineering Analysis</span>
        </div>
      </section>

      {/* WHAT THIS IS */}
      <section className="px-6 py-16 border-b border-gray-200 bg-white relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-gray-900 mb-6">What C.O.D.E.X.T.E.C.H. Is</h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">C.O.D.E.X.T.E.C.H. is not a course website.</strong>
            </p>
            <p>
              It is a structured research intelligence platform designed to turn fragmented technical material into organized, usable research systems.
            </p>
            <p>
              Members get access to curated research modules, patent analysis, build frameworks, source-backed technical summaries, and weekly research drops.
            </p>
          </div>
        </div>
      </section>

      {/* PLATFORM PILLARS */}
      <section id="pillars" className="px-6 py-20 border-b border-gray-200 bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-16">Platform Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Database size={28} />,
                title: "Research Database",
                desc: "Organized analysis across applied physics, electromagnetics, bioelectromagnetics, energy systems, atmospheric phenomena, and patent strategy."
              },
              {
                icon: <Zap size={28} />,
                title: "Engineering Systems",
                desc: "Structured build plans with architecture breakdowns, BOMs, implementation paths, safety notes, and experimental limitations."
              },
              {
                icon: <Lock size={28} />,
                title: "Patent Intelligence",
                desc: "Primary-source patent breakdowns translated into technical opportunities, design patterns, and provisional filing strategy."
              },
              {
                icon: <BookOpen size={28} />,
                title: "Weekly Research Drops",
                desc: "Fresh modules added continuously so members stay inside a growing private research archive."
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white rounded-xl p-8 border border-gray-200">
                <div className="text-gray-900 mb-4">{pillar.icon}</div>
                <h3 className="font-black text-lg text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="px-6 py-16 border-b border-gray-200 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Who It's For</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">Built for:</p>
          <ul className="space-y-3 text-lg text-gray-600">
            {[
              "Independent researchers",
              "Engineers and technical founders",
              "Advanced builders",
              "Inventors",
              "Patent-focused entrepreneurs",
              "Applied physics enthusiasts who want structure, not hype"
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-gray-900 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-20 bg-gray-900 text-white relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl font-black mb-4">Stop collecting scattered documents.</p>
          <p className="text-2xl font-black mb-12">Start using a structured research system.</p>
          <Link to="/codextech-pricing"
            className="px-8 py-4 rounded-lg bg-white text-gray-900 font-black hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            Access C.O.D.E.X.T.E.C.H. <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600 relative z-10">
        <p>C.O.D.E.X.T.E.C.H. © 2026. Private research infrastructure for serious builders.</p>
      </footer>
    </div>
  );
}