import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Lock } from "lucide-react";

const BUNDLE_CONTENTS = [
  { title: "Complete Research Network", desc: "40+ documented electromagnetic systems mapped to primary sources", icon: "🧬" },
  { title: "Engineering Specifications", desc: "Bill of materials, schematics, component sourcing for each system", icon: "📐" },
  { title: "Patent & Prior Art Archive", desc: "200+ patents analyzed, suppressed technologies documented with risk assessment", icon: "⚖️" },
  { title: "Build Validation Framework", desc: "Step-by-step protocols for prototype assembly and measurement", icon: "✓" },
  { title: "Technical Course Library", desc: "40+ structured modules covering scalar EM, vacuum energy, bioelectromagnetics", icon: "📚" },
  { title: "IP Protection Toolkit", desc: "Provisional patent drafting, claims analysis, FTO evaluation—AI-assisted", icon: "🔐" },
  { title: "Component Sourcing Network", desc: "Verified suppliers, bulk pricing, pre-tested component kits", icon: "🔗" },
  { title: "Institutional Licensing Access", desc: "Government, defense contractor, and academic institutional pathways", icon: "🏛️" },
];

const WHO_FITS = [
  "Hardware engineers building experimental systems for personal research",
  "Research institutions vetting suppressed or controversial EM technologies",
  "Patent attorneys filing novel electromagnetic and free energy applications",
  "Independent inventors protecting and licensing their own designs",
  "Teams exploring scalar electromagnetics and bioelectromagnetic applications",
];

const PRICING_TIERS = [
  {
    name: "Individual Researcher",
    price: "$2,400",
    period: "one-time",
    features: [
      "Full research network access (40+ systems)",
      "40+ technical courses",
      "AI patent drafting tool",
      "Prior art archive (200+ entries)",
      "Community access",
    ],
  },
  {
    name: "Institutional License",
    price: "Custom",
    period: "contact",
    features: [
      "Everything in Individual",
      "Team seat licenses (up to 10)",
      "Monthly strategy sessions",
      "Custom research modules",
      "Dedicated support",
      "Data export rights",
    ],
  },
];

export default function EngineeringSystemsBundle() {
  const [selectedTier, setSelectedTier] = useState(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black mb-1">Engineering Systems Bundle</h1>
            <p className="text-gray-400 text-sm">Research framework for serious builders</p>
          </div>
          <Link to="/vault" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to Vault
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Problem/Solution */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Problem */}
            <div>
              <h2 className="text-lg font-black text-white mb-4">The Problem</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Knowledge about advanced electromagnetic and scalar energy systems exists—but it's scattered across 40+ separate patents, declassified reports, peer-reviewed papers, and suppressed archives.
                </p>
                <p>
                  Building a working prototype requires reassembling fragments from incompatible sources, vetting technical accuracy, understanding patent landscapes, and sourcing components with no integrated supply chain.
                </p>
                <p className="text-yellow-300 font-semibold">
                  This process wastes 6-12 months and $5,000+ in trial research before a serious builder can even validate a hypothesis.
                </p>
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-lg font-black text-white mb-4">The Solution</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  A unified engineering framework built directly from primary-source documentation. Every system mapped. Every component sourced. Every patent analyzed.
                </p>
                <p>
                  Start with the complete picture. Validate in weeks, not months. File your own patents. License your designs. Build institutional partnerships.
                </p>
                <p className="text-cyan-300 font-semibold">
                  Go from fragmented knowledge to working prototype in 12 weeks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section>
          <h2 className="text-3xl font-black mb-12">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUNDLE_CONTENTS.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-600/50 transition-colors">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who This Is For */}
        <section>
          <h2 className="text-3xl font-black mb-8">Who This Is For</h2>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8">
            <p className="text-gray-300 mb-6 leading-relaxed">
              This is <strong>not</strong> an introduction to electromagnetic theory. It's a framework for people who already understand the physics and want to move from theory to hardware.
            </p>
            <ul className="space-y-3">
              {WHO_FITS.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-cyan-400 flex-shrink-0 mt-1" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-sm mt-8 italic">
              If you're looking for hype or unproven claims, this isn't for you. We source from patents, peer-reviewed publications, and documented historical research.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section>
          <h2 className="text-3xl font-black mb-12">Pricing</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {PRICING_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`border rounded-2xl p-8 transition-all ${
                  i === 0
                    ? "bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border-cyan-600/50"
                    : "bg-gray-900 border-gray-700"
                }`}
              >
                <h3 className="text-xl font-black mb-2">{tier.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-black text-cyan-400">{tier.price}</span>
                  <span className="text-gray-400 text-sm ml-2">{tier.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {i === 0 ? (
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
                  >
                    Get Access <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-700 transition-colors">
                    Contact Us <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Credibility */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-black mb-6">Why This Framework Holds Weight</h2>
          <ul className="space-y-4 text-gray-300 text-sm leading-relaxed">
            <li>
              <strong className="text-white">Sourced from primary documents:</strong> Every claim traces back to specific USPTO patents, peer-reviewed publications, or declassified government reports with full citations.
            </li>
            <li>
              <strong className="text-white">Built for legal compliance:</strong> All content respects intellectual property rights and regulatory frameworks. We don't make medical claims or sell devices.
            </li>
            <li>
              <strong className="text-white">Designed by engineers, for engineers:</strong> No speculation. No unvalidated theories. Just documented systems that have been built, tested, and analyzed by qualified researchers.
            </li>
            <li>
              <strong className="text-white">Institutional credibility:</strong> Used by research teams, patent attorneys, and technology scouts from defense contractors and academic institutions.
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-black mb-4">Ready to Move Forward</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Access the complete research framework. Validate your design. Protect your IP. Build your prototype.
          </p>
          <Link
            to="/checkout"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 transition-all shadow-lg"
          >
            Get Instant Access <ArrowRight size={16} />
          </Link>
          <p className="text-gray-600 text-xs mt-6">
            Access granted immediately upon checkout. No installation required. Start researching today.
          </p>
        </section>
      </div>
    </div>
  );
}