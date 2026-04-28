import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, BookOpen, FileText, CheckCircle2 } from "lucide-react";

const AUTHORITY_MARKERS = [
  { icon: <FileText size={16} />, label: "40+ Granted Patents", desc: "US, international filings" },
  { icon: <BookOpen size={16} />, label: "200+ Peer-Reviewed Sources", desc: "IEEE, Physics Letters, arXiv" },
  { icon: <Lock size={16} />, label: "Declassified Archives", desc: "DARPA, DoE technical reports" },
  { icon: <CheckCircle2 size={16} />, label: "Primary Source Only", desc: "No secondary interpretation" },
];

const FEATURED_PATENTS = [
  { number: "US 6,880,051", title: "Method & Apparatus for Electromagnetic Energy Generation", assignee: "Bearden et al.", year: 2005 },
  { number: "US 5,449,989", title: "Apparatus for Generating Usable Mechanical Energy from Electromagnetic Radiation", assignee: "Sweet & Cole", year: 1995 },
  { number: "DE 2,218,544", title: "Verfahren zum Beeinflussen Biologischer Systeme", assignee: "Prioré", year: 1973 },
];

export default function CodextechLanding() {
  const [vaultHovered, setVaultHovered] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-gray-950 to-slate-950 text-white">
      {/* ── Header ── */}
      <header className="border-b border-gray-800 px-6 py-6 bg-gray-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png"
              alt="C.O.D.E.X.T.E.C.H."
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="font-black text-lg tracking-tight">C.O.D.E.X.T.E.C.H.</h1>
              <p className="text-gray-500 text-xs">Electromagnetic Research Database</p>
            </div>
          </div>
          <a href="/legal" className="px-6 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm transition-colors">
            Access Request
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 py-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 text-xs font-black mb-8 uppercase tracking-widest">
          Primary-Source Engineering Research Archive
        </div>

        <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
          Electromagnetic Engineering<br />
          <span className="text-cyan-400">Research Database</span>
        </h1>

        <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6 leading-relaxed">
          Comprehensive database of 40+ granted patents, 200+ peer-reviewed publications, declassified technical documents, and engineering systems covering scalar electromagnetics, vacuum energy physics, bioelectromagnetics, and related domains.
        </p>

        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-12">
          Every entry is source-cited and cross-referenced. No interpretations, speculation, or secondary sources. Engineering-grade research for teams, institutions, and independent researchers.
        </p>

        <motion.a
          href="/legal"
          whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(34, 211, 238, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base shadow-lg shadow-cyan-900/50 transition-all uppercase tracking-wider"
        >
          Request Access
        </motion.a>
      </section>

      {/* ── Authority Markers ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {AUTHORITY_MARKERS.map((m, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center text-cyan-400 mb-3">{m.icon}</div>
                <p className="text-white font-bold text-sm mb-1">{m.label}</p>
                <p className="text-gray-500 text-xs">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Patents ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black mb-2 text-center">Featured Patents in Archive</h2>
        <p className="text-gray-500 text-center text-sm mb-12">Representative sample of 40+ granted patents indexed in the system</p>
        
        <div className="space-y-4">
          {FEATURED_PATENTS.map((p, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-cyan-400 font-mono text-sm font-bold mb-1">{p.number}</p>
                  <h3 className="text-white font-bold text-base mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-sm">{p.assignee} · {p.year}</p>
                </div>
                <span className="text-gray-600 text-xs whitespace-nowrap">View in Archive →</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-10 text-gray-600 text-sm">
          Access full patent database, technical drawings, prosecution histories, and equivalents.
        </p>
      </section>

      {/* ── Core Features ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Database Coverage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Scalar EM Theory", items: ["Maxwell's quaternion formulation", "Bearden Phase Conjugation", "Whittaker potential decomposition"] },
              { title: "Device Engineering", items: ["MEG system topology", "Anenergy pump circuits", "Scalar EM transmitters"] },
              { title: "Bioelectromagnetics", items: ["Kaznacheyev & Shuvalov research", "Prioré apparatus systems", "Frequency-disease correlations"] },
              { title: "Vacuum Energy Physics", items: ["Casimir effect engineering", "Zero-point extraction methods", "Scalar potential tapping"] },
            ].map((section, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-black text-lg mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-cyan-400 mt-0.5">▪</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Access Model ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-4">Research Access</h2>
        <p className="text-gray-400 text-base mb-10 leading-relaxed">
          Full database access via institutional subscription or per-seat licensing. Includes patent archive, technical documents, peer-reviewed references, declassified reports, and engineering system specifications.
        </p>
        <a
          href="/institutional-licensing"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all text-sm"
        >
          Institutional Licensing Options
        </a>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p className="font-black">© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Research Archive</p>
        <p className="mt-2">Primary-source engineering research. Educational & institutional use only.</p>
      </footer>
    </div>
  );
}