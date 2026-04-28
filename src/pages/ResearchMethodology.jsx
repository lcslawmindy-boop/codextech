import { Link } from "react-router-dom";
import { CheckCircle2, BookOpen, Shield, Zap } from "lucide-react";

export default function ResearchMethodology() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-8 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-1">
            ← Back
          </Link>
          <h1 className="text-3xl font-black mb-2">How Institutional Research is Conducted</h1>
          <p className="text-gray-400">
            Our methodology for sourcing, analyzing, and structuring technical research on advanced electromagnetic systems.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Overview */}
        <section>
          <p className="text-lg text-gray-300 leading-relaxed">
            This platform aggregates and analyzes technical documentation on electromagnetic and scalar energy systems. Every claim is traceable to primary sources. Every system is documented from peer-reviewed literature, filed patents, declassified government reports, or published technical specifications.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            We don't generate speculation. We organize existing documented knowledge and make it accessible to researchers, engineers, and institutions.
          </p>
        </section>

        {/* Source Types */}
        <section>
          <h2 className="text-3xl font-black mb-10">Primary Sources Used</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "U.S. Patents (USPTO)",
                desc: "All electromagnetic, energy, and scalar systems examined. Cross-referenced with international patents (WIPO, EPO). We analyze claim language, prior art cited, and filing history.",
                icon: "📜",
                examples: ["MEG (6,362,718)", "Prioré devices (French Patent 1,342,772)", "Scalar transmitters"],
              },
              {
                title: "Peer-Reviewed Publications",
                desc: "IEEE Transactions, Foundations of Physics Letters, Physics of Plasmas, Journal of Scientific Exploration. We extract technical parameters, experimental methodology, and results.",
                icon: "📚",
                examples: ["Anastasovski et al. (2001)", "Bohren absorption (1983)", "Evans EM theory (2000s)"],
              },
              {
                title: "Declassified Government Reports",
                desc: "Office of Naval Research, Department of Energy, DARPA archives. Including historical Cold War EM research and suppressed technical assessments.",
                icon: "🏛️",
                examples: ["ONR Report R-5-78", "DARPA EM anomaly studies", "Soviet EM research archives"],
              },
              {
                title: "Published Technical Specifications",
                desc: "Academic textbooks, manufacturer datasheets, engineering manuals. Direct from primary authors (Bearden, Tesla archives, Schauberger papers, etc.).",
                icon: "⚙️",
                examples: ["Bearden: Energy from the Vacuum", "Tesla Colorado Springs Diary", "Gravitobiology frameworks"],
              },
            ].map((source, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-600/30 transition-colors">
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl">{source.icon}</span>
                  <h3 className="text-lg font-black">{source.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">{source.desc}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-semibold text-gray-400">Examples:</p>
                  {source.examples.map((ex, ei) => (
                    <p key={ei}>• {ex}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}
        <section>
          <h2 className="text-3xl font-black mb-10">Analysis Methodology</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Source Verification",
                desc: "Every document is traced to its original publisher. Patents cross-referenced with USPTO records. Publications verified against journal archives. Reports authenticated through government databases (OSTI.gov, declassification records).",
              },
              {
                step: 2,
                title: "Technical Extraction",
                desc: "We extract quantifiable parameters: frequency ranges, field strengths, component specifications, measured outputs. Methodology is documented. Claimed vs. verified results are separated.",
              },
              {
                step: 3,
                title: "Cross-Reference Analysis",
                desc: "Each system is mapped against related patents, publications, and prior art. We identify which inventions cite which, showing theoretical lineage and technical dependencies.",
              },
              {
                step: 4,
                title: "Risk & IP Assessment",
                desc: "Patent claims are analyzed for breadth, novelty, and enforceability. Suppression status is documented. Regulatory barriers are identified. Prior art blocking patents are flagged.",
              },
              {
                step: 5,
                title: "Reproducibility Documentation",
                desc: "For each system with sufficient documentation, we create build protocols: bill of materials, assembly steps, measurement procedures. These are structured for independent verification.",
              },
              {
                step: 6,
                title: "Attribution & Integrity",
                desc: "Every claim includes full citation. No paraphrasing without source attribution. Fair Use is applied consistently for copyrighted material. Original authors remain credited throughout.",
              },
            ].map((method, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center font-black text-sm">
                    {method.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Data Structure */}
        <section>
          <h2 className="text-3xl font-black mb-10">How Research is Structured</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Zap size={20} className="text-cyan-400" /> Concept Network
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                All systems are mapped as nodes in an interconnected knowledge graph. Links show theoretical relationships, component sharing, and principle dependencies.
              </p>
              <p className="text-gray-500 text-xs">
                Users can explore how scalar EM relates to bioelectromagnetics, how vacuum energy systems cite Bearden, how patents build on prior inventions.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-400" /> Structured Courses
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                40+ modules organized by domain (scalar EM, bioelectromagnetics, vacuum energy, patent strategy). Each course builds from foundational theory to engineering application.
              </p>
              <p className="text-gray-500 text-xs">
                Courses use the same primary sources as the research network, maintaining consistency across learning pathways.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <Shield size={20} className="text-green-400" /> Build Documentation
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                For each system with sufficient documentation, we create complete build specifications: BOMs, schematics, assembly protocols, safety notes, measurement procedures.
              </p>
              <p className="text-gray-500 text-xs">
                All build plans reference the original patents and publications they're derived from.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-yellow-400" /> Patent Archive
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                200+ patents are analyzed for claim strength, prior art, blocking patents, and design-around strategies. Each entry includes freedom-to-operate assessment.
              </p>
              <p className="text-gray-500 text-xs">
                Includes suppressed patents, shelved designs, and technologies with regulatory barriers.
              </p>
            </div>
          </div>
        </section>

        {/* Verification Standards */}
        <section>
          <h2 className="text-3xl font-black mb-10">Institutional Verification Standards</h2>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12">
            <div className="space-y-6">
              <div className="border-l-4 border-cyan-500 pl-6">
                <h3 className="font-bold text-white mb-2">No Unverified Claims</h3>
                <p className="text-gray-400 text-sm">
                  Every technical claim is sourced. If we state a frequency, component, or measurement, it's traceable to a patent, publication, or verified datasheet.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="font-bold text-white mb-2">Separation of Fact and Theory</h3>
                <p className="text-gray-400 text-sm">
                  Documented experiments are labeled as such. Theoretical frameworks are identified as theory. Claimed vs. independently verified results are distinguished.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="font-bold text-white mb-2">Regulatory Transparency</h3>
                <p className="text-gray-400 text-sm">
                  All regulatory restrictions (FDA, FCC, EPA) are documented. We don't make medical claims. We don't sell devices. We provide documentation for research.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-6">
                <h3 className="font-bold text-white mb-2">Intellectual Property Respect</h3>
                <p className="text-gray-400 text-sm">
                  Fair Use is applied consistently. Copyrighted material is cited with proper attribution. Commercial products are linked to legitimate suppliers.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-6">
                <h3 className="font-bold text-white mb-2">Continuous Update</h3>
                <p className="text-gray-400 text-sm">
                  New patents are added as filed. New research is incorporated as published. Errors are corrected when identified. The system evolves with available knowledge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Uses This */}
        <section>
          <h2 className="text-3xl font-black mb-8">Who Relies on This Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Patent Attorneys", desc: "For FTO analysis, claims strategy, and prior art assessment on novel EM systems." },
              { title: "Research Institutions", desc: "For mapping suppressed technologies and understanding patent landscapes in advanced physics." },
              { title: "Hardware Engineers", desc: "For sourcing components, validating build procedures, and understanding theoretical frameworks." },
              { title: "Technology Investors", desc: "For due diligence on EM-based startups and assessment of patent portfolios." },
              { title: "Independent Researchers", desc: "For structured learning, prototype documentation, and IP protection pathways." },
              { title: "Government & Defense", desc: "For institutional licensing and access to declassified research on EM anomalies." },
            ].map((user, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <span className="text-2xl flex-shrink-0">👤</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{user.title}</h3>
                  <p className="text-sm text-gray-400">{user.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 border-t border-gray-800">
          <h2 className="text-2xl font-black mb-4">Explore the Research</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            All sources, methodology, and structured data are available to members. Start with the course library or jump into the interactive research network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/vault"
              className="px-8 py-3 rounded-lg font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              Access the Vault
            </Link>
            <Link
              to="/courses"
              className="px-8 py-3 rounded-lg font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}