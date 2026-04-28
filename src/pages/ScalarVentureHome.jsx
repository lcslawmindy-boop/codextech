import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, Shield, BookOpen } from "lucide-react";

const ENGINEERING_SYSTEMS = [
  { name: "MEG Device", domain: "Vacuum Energy", status: "Documented" },
  { name: "Anenergy Pump", domain: "Free Energy", status: "Documented" },
  { name: "Scalar EM Transmitter", domain: "Communications", status: "Documented" },
  { name: "Prioré Apparatus", domain: "Bioelectromagnetics", status: "Documented" },
  { name: "Kaznacheyev Chamber", domain: "Bio-Signal", status: "Documented" },
  { name: "G-Com System", domain: "EM Communications", status: "Documented" },
];

const CONTENT_SECTIONS = [
  { title: "Patent Archive", items: ["40+ granted patents", "International filings", "Prosecution history", "Citations & references"] },
  { title: "Research Database", items: ["200+ peer-reviewed papers", "Technical specifications", "Experimental protocols", "Declassified reports"] },
  { title: "Engineering Systems", items: ["Complete device documentation", "Component specifications", "Assembly procedures", "Troubleshooting guides"] },
  { title: "Theory & Mathematics", items: ["Scalar EM field topology", "Quaternion formulation", "Bearden phase conjugation", "Whittaker potential"] },
];

export default function ScalarVentureHome() {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-gray-950/95 backdrop-blur">
        <div className="flex items-center gap-2 font-black text-xl">
          <BookOpen size={20} className="text-cyan-400" />
          Research Database
        </div>
        <a href="/legal" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors">
          Request Access
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Shield size={12} /> Peer-Reviewed & Primary-Source
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
          Engineering Systems<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Fully Documented
          </span>
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
          Complete technical documentation for 25+ electromagnetic engineering systems. Every specification backed by patent filings, peer-reviewed research, and experimental protocols.
        </p>

        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-10">
          For research teams, engineers, and institutions requiring rigorous technical documentation and source materials.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a href="/legal" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
            Access Documentation <ArrowRight size={18} />
          </a>
          <a href="/institutional-licensing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all">
            Institutional Licensing
          </a>
        </div>

        <p className="text-xs text-gray-600">
          ✓ Primary sources only · NDA required · Institutional access available
        </p>
      </section>

      {/* ── Engineering Systems ── */}
      <section id="systems" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black mb-4 text-center">25+ Engineering Systems</h2>
        <p className="text-gray-500 text-center mb-10 text-sm max-w-xl mx-auto">
          Complete technical specification, patent references, and experimental protocols for documented electromagnetic systems.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {ENGINEERING_SYSTEMS.map((system, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{system.domain}</p>
                  <h3 className="text-white font-bold text-sm mt-1">{system.name}</h3>
                </div>
                <span className="text-green-400 text-xs font-bold whitespace-nowrap">{system.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a href="/legal" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm">
            View all systems & documentation →
          </a>
        </div>
      </section>

      {/* ── Content Organization ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Database Structure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CONTENT_SECTIONS.map((section, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-black text-lg mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                      <span className="text-cyan-400 mt-0.5">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">Why This Database</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { title: "Primary Sources Only", desc: "Every claim traces directly to a patent, peer-reviewed publication, or technical document. No synthesis or interpretation." },
            { title: "Complete Technical Specs", desc: "Not partial guides. Full device architecture, component specifications, assembly procedures, and troubleshooting documentation." },
            { title: "Source-Verified", desc: "Patents verified against USPTO & WIPO. Publications cross-referenced with PubMed, IEEE, arXiv. Reports sourced from official archives." },
            { title: "Engineering-Focused", desc: "Content is curated for technical precision and engineering execution. Mathematics, schematics, part numbers, suppliers." },
            { title: "Institutional Standards", desc: "Organized like Bloomberg Terminal or PitchBook. Searchable, filterable, exportable. Built for teams and institutions." },
            { title: "Ongoing Updates", desc: "New patents, publications, and technical reports added monthly. Custom alerts available for institutional subscribers." },
          ].map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black mb-4">Access Plans</h2>
          <p className="text-gray-400">Research database access for individuals, teams, and institutions.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {[
            {
              name: "Individual",
              price: "$199/yr",
              features: ["Full patent archive", "200+ publications", "25+ system docs", "Search & export"],
            },
            {
              name: "Team (5 seats)",
              price: "$799/yr",
              features: ["Everything in Individual", "Team workspace", "Citation management", "Priority support"],
              highlight: true,
            },
            {
              name: "Institutional",
              price: "Custom",
              features: ["Unlimited seats", "API access", "Custom integrations", "SLA"],
            },
          ].map((tier, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 transition-all ${
                tier.highlight
                  ? "bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600 relative"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
                  RECOMMENDED
                </div>
              )}
              <h3 className="text-white font-black text-lg mb-1">{tier.name}</h3>
              <div className="text-2xl font-black text-cyan-400 mb-4">{tier.price}</div>
              <ul className="space-y-2 mb-6">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-cyan-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/legal"
                className={`block py-2.5 rounded-lg font-bold text-sm transition-all ${
                  tier.highlight
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                    : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {tier.name === "Institutional" ? "Contact Sales" : "Request Access"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Get Started</h2>
          <p className="text-gray-400 mb-8 text-sm">Access the complete research database. NDA required for institutional subscriptions.</p>
          <a href="/legal" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
            Request Access Now <ArrowRight size={18} />
          </a>
          <p className="text-xs text-gray-600 mt-4">Institutional licensing & team plans available</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Engineering Research Database</p>
        <div className="flex justify-center gap-6 mt-3">
          <a href="/legal" className="hover:text-gray-400">Access Agreement</a>
          <a href="/institutional-licensing" className="hover:text-gray-400">Institutional Access</a>
          <a href="/" className="hover:text-gray-400">Home</a>
        </div>
      </footer>
    </div>
  );
}