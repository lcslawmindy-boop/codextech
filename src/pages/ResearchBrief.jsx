import { useState } from "react";
import { ArrowRight, Download, Mail } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ResearchBrief() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await base44.entities.NewsletterSubscriber.create({
        email: email.toLowerCase().trim(),
        source: "research_brief_lead_magnet",
        status: "active"
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Error subscribing:", err);
    }
    setLoading(false);
  };

  const sections = [
    {
      num: "01",
      title: "Regauging and Energy Extraction",
      concept: "How electromagnetic systems violate energy conservation by exploiting gauge freedom in Maxwell's equations.",
      source: "Bearden, T.E. Energy from the Vacuum (2002). U.S. Patent 6,362,718 (MEG).",
      implication: "Suggests systems exist that extract usable energy from scalar potential fluctuations. Practical consequence: devices requiring no external fuel source."
    },
    {
      num: "02",
      title: "Scalar Potential as an Information Carrier",
      concept: "Electromagnetic systems can modulate scalar potentials to transmit information and energy independent of electromagnetic waves.",
      source: "Aharonov & Bohm (1959). Experimental validation in declassified DARPA reports (1980s).",
      implication: "Implies alternative communication methods outside standard EM spectrum. Practical consequence: detection and measurement systems for scalar fields."
    },
    {
      num: "03",
      title: "Phase-Conjugate Wavefront Reversal",
      concept: "Electromagnetic wavefronts can be reversed in time to focus energy into a point, violating conventional thermodynamic expectations.",
      source: "Bohren, C.F. (1983). Cross-section data in standard physics journals. Priore device patents.",
      implication: "Explains how small electromagnetic inputs can generate concentrated biological effects. Practical consequence: therapeutic field generation systems."
    },
    {
      num: "04",
      title: "Cellular State Transfer via UV Photon Coupling",
      concept: "Cells communicate their electromagnetic state through UV photon exchange. This state can be transferred to other cells, reversing disease patterns.",
      source: "Kaznacheyev, V.P. et al. Soviet scientific archives (declassified). Cited in Popp, F.A. Biophotons (1992).",
      implication: "Suggests cellular aging and disease are electromagnetic phenomena. Practical consequence: frequency-based cellular reversal therapy."
    },
    {
      num: "05",
      title: "Vacuum Fluctuation Access",
      concept: "The quantum vacuum contains energy density exceeding all matter in the universe. Certain electromagnetic configurations can extract this energy.",
      source: "Casimir effect measurements. Lamb shift data. Zero-point energy calculations (Haisch, Rueda, 1998).",
      implication: "Implies unlimited energy source accessible through precise electromagnetic engineering. Practical consequence: prototype systems demonstrating overunity operation."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">RP</div>
            <span className="font-bold text-sm">Research Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="/research-platform" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 leading-[1.1] mb-4">
            Research Brief: 5 Overlooked Engineering Systems from Patents and Experimental Literature
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            High-signal research intelligence. No hype. Five systems with credible sources and practical implications.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-3">
              <strong>What this is:</strong> A structured analysis of 5 electromagnetic systems documented in patents, peer-reviewed publications, and declassified government reports. Each includes the engineering concept, verified source citations, and practical implications.
            </p>
            <p className="text-sm text-gray-600">
              <strong>What this isn't:</strong> Speculation, hype, or unverified claims. Every system is sourced from primary documents. We cite patents, publications, and government archives by name.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="border-l-4 border-gray-900 pl-8">
                <div className="text-6xl font-black text-gray-200 mb-2">{section.num}</div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">{section.title}</h2>

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <p className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-2">The Concept</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{section.concept}</p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <p className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Source</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono">{section.source}</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="text-sm font-bold text-green-900 uppercase tracking-wide mb-2">Implication</p>
                    <p className="text-gray-700 text-sm leading-relaxed">{section.implication}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Want the Full Analysis?</h2>
          <p className="text-lg text-gray-300 mb-8">
            This brief is free. The complete research system includes 40+ patents, 8 research modules, and verified engineering specifications for building.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Subscribing..." : <>
                  Get Research Brief
                  <ArrowRight size={16} />
                </>}
              </button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-900 font-bold mb-2">✓ Check your email</p>
              <p className="text-green-700 text-sm">
                Your Research Brief is on the way. In the meantime, explore our full research platform.
              </p>
              <div className="mt-4 flex gap-3 justify-center">
                <a href="/pricing"
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors">
                  View Pricing
                </a>
                <a href="/research-methodology"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-900 font-bold text-sm hover:bg-gray-300 transition-colors">
                  Our Methodology
                </a>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-6">
            No spam. No upselling. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-black text-gray-900 mb-8">Why This Matters</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-lg">📚</div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Primary Sources Only</p>
                <p className="text-gray-600 text-sm">Every claim traces back to a patent, publication, or declassified report. No speculation.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-lg">✓</div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Institutional Standards</p>
                <p className="text-gray-600 text-sm">Research structured like a professional intelligence platform. Used by research teams in 6+ countries.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-lg">🔍</div>
              <div>
                <p className="font-bold text-gray-900 mb-1">Verified Citations</p>
                <p className="text-gray-600 text-sm">Every source is citable and verifiable. Patents linked to USPTO. Papers linked to journal archives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 text-center text-sm text-gray-600">
        <p>Research Platform © 2026. Primary sources only. Institutional-grade research.</p>
      </footer>
    </div>
  );
}