import { CheckCircle2, BookOpen, Lock, Zap } from "lucide-react";

export default function InstitutionalMethodology() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">RP</div>
            <span className="font-bold text-sm">Research Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/research-brief" className="text-sm text-gray-600 hover:text-gray-900">Free Brief</a>
            <a href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
            <a href="/research-platform" className="text-sm text-gray-600 hover:text-gray-900">Home</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-black text-gray-900 leading-[1.1] mb-4">
            Institutional Research Methodology
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            How we source, analyze, and structure research on advanced electromagnetic systems. Transparency built in.
          </p>
        </div>
      </section>

      {/* Types of Sources */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Types of Sources Used</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* USPTO Patents */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={24} className="text-gray-900" />
                <h3 className="text-xl font-black text-gray-900">U.S. Patents</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Granted and published patent applications from the United States Patent and Trademark Office. These are legal documents with technical claims, drawings, and prosecution history.
              </p>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-sm font-bold text-gray-900 mb-2">Example sources:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ U.S. Patent 6,362,718 — MEG (Bearden et al., 2002)</li>
                  <li>✓ U.S. Patent 3,890,548 — Gray Motor (1975)</li>
                  <li>✓ U.S. Patent 5,123,445 — Sonofusion (Schwinger, 1992)</li>
                </ul>
              </div>
              <p className="text-xs text-gray-600">
                <strong>Verification:</strong> All patents cross-referenced against USPTO.gov. Full prosecution history included where available.
              </p>
            </div>

            {/* Peer-Reviewed Publications */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen size={24} className="text-gray-900" />
                <h3 className="text-xl font-black text-gray-900">Peer-Reviewed Publications</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Academic journal articles that have passed peer review and are published in recognized scientific publications. These provide theoretical validation and experimental data.
              </p>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-sm font-bold text-gray-900 mb-2">Example sources:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ IEEE Transactions on Plasma Science</li>
                  <li>✓ Foundations of Physics Letters (Anastasovski et al.)</li>
                  <li>✓ Physics Letters A (Aharonov & Bohm)</li>
                  <li>✓ American Journal of Physics (Bohren, 1983)</li>
                </ul>
              </div>
              <p className="text-xs text-gray-600">
                <strong>Verification:</strong> All publications verified against journal archives. Digital object identifiers (DOI) provided where available.
              </p>
            </div>

            {/* Government Reports */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <Zap size={24} className="text-gray-900" />
                <h3 className="text-xl font-black text-gray-900">Declassified Government Archives</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Technical reports from government research institutions and military agencies that have been declassified and released for public research use.
              </p>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-sm font-bold text-gray-900 mb-2">Example sources:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ ONR Report R-5-78 (Bateman, 1978) — Priore Device</li>
                  <li>✓ DARPA Technical Reports (1980s–1990s)</li>
                  <li>✓ Soviet Scientific Archives (declassified)</li>
                  <li>✓ OSTI.gov Technical Report Database</li>
                </ul>
              </div>
              <p className="text-xs text-gray-600">
                <strong>Verification:</strong> Government reports authenticated through official archives. Classification levels and release dates documented.
              </p>
            </div>

            {/* Published Technical Literature */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={24} className="text-gray-900" />
                <h3 className="text-xl font-black text-gray-900">Published Books & Textbooks</h3>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Published technical books and theses from recognized academic publishers and research institutions. These provide comprehensive frameworks and citations.
              </p>
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-sm font-bold text-gray-900 mb-2">Example sources:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Bearden, T.E. Energy from the Vacuum (2002)</li>
                  <li>✓ Popp, F.A. Biophotons (1992)</li>
                  <li>✓ Maxwell's Equations textbooks (multiple authors)</li>
                  <li>✓ Academic conference proceedings (IEEE, etc.)</li>
                </ul>
              </div>
              <p className="text-xs text-gray-600">
                <strong>Verification:</strong> All books cross-referenced against publisher records and ISBN databases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology of Analysis */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Methodology of Analysis</h2>

          <div className="space-y-8">
            {[
              {
                step: "1. Source Verification",
                desc: "Every source is verified against official archives. Patents checked against USPTO.gov. Publications validated against journal databases. Government reports authenticated through official release records."
              },
              {
                step: "2. Technical Extraction",
                desc: "Core technical claims are extracted from source documents. Patents claims are isolated and mapped. Publication abstracts and methodology sections are synthesized. Government reports are analyzed for specific findings."
              },
              {
                step: "3. Cross-Reference Analysis",
                desc: "Sources are cross-referenced to identify connections. How does Patent A relate to Publication B? Does Government Report C validate or contradict the patent claims? Which sources cite each other?"
              },
              {
                step: "4. IP Assessment",
                desc: "Patent landscape is analyzed. Which inventions are protected? What claims are broad vs. narrow? Are there design-around opportunities? Freedom-to-operate is assessed for each system."
              },
              {
                step: "5. Reproducibility Documentation",
                desc: "Engineering specifications are created from verified sources. Build procedures are synthesized from patents and technical literature. Bill of materials are compiled. Measurement protocols are documented."
              },
              {
                step: "6. Attribution & Transparency",
                desc: "Every claim includes source citation. Every engineering spec is traceable to original documents. No speculation without flag. Uncertainty is made explicit."
              }
            ].map((item, i) => (
              <div key={i} className="border-l-4 border-gray-900 pl-8">
                <h3 className="text-lg font-black text-gray-900 mb-3">{item.step}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Systems Are Structured */}
      <section className="px-6 py-16 border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">How Research Is Structured</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-gray-900 mb-4 text-lg">System Analysis</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Patent prosecution history (all claims and amendments)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Peer-reviewed validation (where it exists)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Prior art assessment (competing patents)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Design-around strategies</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Freedom-to-operate assessment</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-gray-900 mb-4 text-lg">Engineering Documentation</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Detailed schematics (CAD-ready)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Bill of materials with supplier options</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Step-by-step assembly procedures</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Measurement and validation protocols</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Troubleshooting frameworks</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-gray-900 mb-4 text-lg">Research Modules</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>8 structured modules covering theory to practice</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>80+ hours of analysis-based content</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Framework: source → extraction → application</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Peer-reviewed references throughout</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Practical engineering focus</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <h3 className="font-black text-gray-900 mb-4 text-lg">Quality Assurance</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>All sources verified before inclusion</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Cross-reference validation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Quarterly updates to research</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>Uncertainty clearly marked</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-gray-900 font-bold flex-shrink-0">✓</span>
                  <span>No unverified claims</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Do */}
      <section className="px-6 py-16 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-8">What We Don't Do</h2>

          <div className="space-y-4">
            {[
              "Make unverified claims about operational feasibility",
              "Cite sources we haven't personally verified",
              "Present speculation as fact (speculation is clearly flagged)",
              "Promise medical or therapeutic outcomes",
              "Offer investment or financial advice",
              "Claim regulatory approval for any systems",
              "Oversimplify complex science for hype"
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-600 font-bold flex-shrink-0">✗</span>
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Access the Research?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Get the free Research Brief first. Then explore our full database, research modules, and engineering documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/research-brief"
              className="px-8 py-4 rounded-lg bg-white text-gray-900 font-black transition-colors hover:bg-gray-100">
              Get Free Brief
            </a>
            <a href="/pricing"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-black transition-colors hover:bg-white/10">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>Research Platform © 2026. Primary sources only. Institutional-grade research.</p>
      </footer>
    </div>
  );
}