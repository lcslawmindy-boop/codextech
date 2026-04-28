import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, BookOpen, Lock, FileText, Shield } from "lucide-react";

export default function CodextechLanding() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 sticky top-0 z-40 bg-gray-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="Logo" className="h-9 w-9" />
            <div>
              <p className="font-black text-sm tracking-tight">C.O.D.E.X.T.E.C.H.</p>
              <p className="text-gray-600 text-xs">Research Database</p>
            </div>
          </div>
          <a href="/legal" className="px-5 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm transition-colors">
            Request Access
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-32 text-center max-w-5xl mx-auto">
        <h1 className="text-6xl sm:text-7xl font-black leading-[1.05] mb-6">
          Private Applied Physics<br />
          Research Database
        </h1>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4 leading-relaxed font-light">
          Institutional-grade research platform indexing 40+ granted patents, 200+ peer-reviewed publications, and declassified technical archives on electromagnetic systems, vacuum energy physics, and advanced engineering.
        </p>

        <p className="text-gray-500 text-base max-w-2xl mx-auto mb-12">
          For teams requiring structured primary-source documentation on advanced physics and engineering systems.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="/legal" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-white text-gray-950 font-black text-base hover:bg-gray-100 transition-colors shadow-lg">
            Access the Research Database <ArrowRight size={18} />
          </a>
          <a href="/institutional-licensing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all">
            <Shield size={16} /> Institutional Plans
          </a>
        </div>

        <p className="text-xs text-gray-600">NDA required · Verified access only · 99.9% SLA on institutional plans</p>
      </section>

      {/* ── Authority Layer ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">Primary Sources Only</h2>
          <p className="text-center text-gray-500 text-sm mb-12 max-w-2xl mx-auto">
            Every entry is sourced from granted patents, peer-reviewed journals, or declassified technical reports. No secondary interpretation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <FileText size={18} />, label: "40+ Granted Patents", desc: "US, international, & continuation filings" },
              { icon: <BookOpen size={18} />, label: "200+ Peer-Reviewed", desc: "IEEE, Nature, Physics Letters, arXiv" },
              { icon: <Lock size={18} />, label: "Declassified Archives", desc: "DARPA, DoE, technical reports" },
              { icon: <CheckCircle2 size={18} />, label: "Source Verified", desc: "USPTO, PubMed, official databases" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-5">
                <div className="text-cyan-400 mb-3">{item.icon}</div>
                <p className="text-white font-bold text-sm mb-1">{item.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Explanation ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">How It Works</h2>
        <p className="text-center text-gray-500 text-sm mb-12 max-w-2xl mx-auto">
          Structured research archive + engineering system documentation. Built for teams that need primary sources.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              num: "1",
              title: "Search & Filter",
              desc: "Advanced search across patent database, peer-reviewed literature, and technical documentation. Filter by domain, date, assignee, or keywords.",
            },
            {
              num: "2",
              title: "Source Documentation",
              desc: "Each entry includes publication data, patent numbers, DOI citations, official links, and technical specifications. Full traceability.",
            },
            {
              num: "3",
              title: "Engineering Systems",
              desc: "Complete device documentation including circuit diagrams, component specifications, assembly procedures, and experimental protocols.",
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              <div className="text-5xl font-black text-gray-800 mb-3">{item.num}</div>
              <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Who Uses This</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Research Teams",
                desc: "Structured bibliography for peer-reviewed research. Cross-reference patents with publications. Build comprehensive literature reviews.",
                users: "Universities, research labs, independent researchers",
              },
              {
                title: "Engineers",
                desc: "Complete device specifications, component lists, assembly procedures. Technical drawings and experimental data for advanced systems.",
                users: "Hardware engineers, systems designers, technical founders",
              },
              {
                title: "Technical Founders",
                desc: "Patent landscape analysis, prior art review, FTO assessment. Identify white space and design-around strategies.",
                users: "Startup founders, IP strategists, product teams",
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-black text-base mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{item.desc}</p>
                <p className="text-gray-600 text-xs">{item.users}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Database Scope ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">Research Domains</h2>
        <p className="text-center text-gray-500 text-sm mb-12">All entries are primary-source documented and cross-indexed</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {[
            { domain: "Scalar Electromagnetics", topics: ["Maxwell quaternion formulation", "Bearden phase conjugation", "Whittaker potential decomposition", "Field topology theory"] },
            { domain: "Vacuum Energy Physics", topics: ["Casimir effect engineering", "Zero-point energy extraction", "Anenergy pump circuits", "Scalar potential tapping"] },
            { domain: "Bioelectromagnetics", topics: ["Kaznacheyev research", "Prioré apparatus systems", "Frequency-disease correlations", "Biological EM interaction"] },
            { domain: "Device Engineering", topics: ["MEG system topology", "Scalar EM transmitters", "Complete device specs", "Assembly procedures"] },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-base mb-4">{item.domain}</h3>
              <ul className="space-y-2">
                {item.topics.map((topic, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-cyan-400 mt-0.5">→</span> {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Access Tiers ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">Access Plans</h2>
          <p className="text-center text-gray-500 text-sm mb-12">Institutional-grade research access with flexible licensing</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Individual",
                price: "$199/yr",
                seats: "1 user",
                features: ["Full patent archive", "200+ publications", "Advanced search", "Citation export", "Email support"],
              },
              {
                name: "Team",
                price: "$799/yr",
                seats: "5 users",
                features: ["Everything in Individual", "Collaborative workspace", "Team management", "Custom alerts", "Priority support"],
                highlight: true,
              },
              {
                name: "Institutional",
                price: "Custom",
                seats: "Unlimited",
                features: ["Unlimited seats", "API access", "Custom integrations", "SLA guarantee", "Dedicated support"],
              },
            ].map((tier, i) => (
              <div
                key={i}
                className={`rounded-xl p-8 transition-all ${
                  tier.highlight
                    ? "bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-2 border-cyan-600 relative"
                    : "bg-gray-900 border border-gray-800"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
                    RECOMMENDED
                  </div>
                )}
                <h3 className="text-white font-black text-lg mb-1">{tier.name}</h3>
                <div className="text-3xl font-black text-cyan-400 mb-1">{tier.price}</div>
                <p className="text-gray-500 text-sm mb-6">{tier.seats}</p>
                <ul className="space-y-2 mb-8">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                      <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="/legal"
                  className={`block w-full py-3 rounded-lg font-black text-sm text-center transition-all ${
                    tier.highlight
                      ? "bg-white text-gray-950 hover:bg-gray-100"
                      : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {tier.name === "Institutional" ? "Contact Sales" : "Get Started"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Differentiators ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">Why Professional Teams Choose This</h2>
        <div className="space-y-6">
          {[
            { title: "No Secondary Sources", desc: "Direct citations to patents, journals, and official reports. No synthesis, interpretation, or speculation." },
            { title: "Source Verification", desc: "Patents verified against USPTO/WIPO. Publications cross-referenced with PubMed, IEEE, arXiv. Full provenance." },
            { title: "Engineering Precision", desc: "Complete device specs, not partial guides. Circuit diagrams, part lists, assembly procedures, experimental data." },
            { title: "Institutional Standards", desc: "Organized like Bloomberg Terminal. Advanced search, filtering, export, API access. Built for professional teams." },
            { title: "Ongoing Updates", desc: "New patents, publications, and technical reports indexed monthly. Custom alerts for institutional subscribers." },
            { title: "Compliance Ready", desc: "NDA-protected access. Audit logs. SLA guarantees. Institutional licensing and custom integrations." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-cyan-900/30 border border-cyan-700 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">
                ✓
              </div>
              <div>
                <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Ready to Access the Database?</h2>
          <p className="text-gray-400 text-base mb-10">
            Request access to the complete research archive. Institutional licensing and team plans available.
          </p>
          <a href="/legal" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-gray-950 font-black text-base hover:bg-gray-100 transition-colors shadow-lg">
            Access the Research Database <ArrowRight size={18} />
          </a>
          <p className="text-gray-600 text-xs mt-6">NDA required · Institutional partnerships available · Enterprise API access</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p className="font-black mb-3">C.O.D.E.X.T.E.C.H. · Applied Physics Research Database</p>
        <div className="flex justify-center gap-6">
          <a href="/legal" className="hover:text-gray-400">Access Agreement</a>
          <a href="/institutional-licensing" className="hover:text-gray-400">Institutional Licensing</a>
          <a href="/paywall" className="hover:text-gray-400">Pricing</a>
        </div>
      </footer>
    </div>
  );
}