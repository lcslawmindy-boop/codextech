import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, ChevronDown, Shield, Award } from "lucide-react";

const TIERS = [
  {
    name: "Research Access",
    price: "$49",
    period: "/month",
    desc: "For individual researchers and technical evaluators",
    features: [
      "Full patent database (40+ patents)",
      "200+ peer-reviewed publications",
      "Basic search & filtering",
      "Monthly research updates",
      "PDF exports",
      "Email support",
    ],
    dataAccess: "Read-only access to all primary sources",
    buildAccess: "Device specifications & technical overviews",
    updates: "Monthly — new patents & publications",
    documentation: "Summary-level specs for 25+ systems",
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Builder Access",
    price: "$97",
    period: "/month",
    desc: "For engineers implementing systems",
    features: [
      "Everything in Research Access",
      "Engineering build systems (25+ device docs)",
      "Complete circuit diagrams & schematics",
      "Component sourcing guides",
      "Assembly procedures & protocols",
      "Bi-weekly research drops",
      "Priority email support",
      "API access (basic)",
    ],
    dataAccess: "Full research database with advanced search",
    buildAccess: "Complete engineering specs + assembly procedures",
    updates: "Bi-weekly — new systems & protocols",
    documentation: "Engineering-grade (diagrams, specs, procedures)",
    cta: "Get Builder Access",
    highlight: false,
  },
  {
    name: "Operator Access",
    price: "$197",
    period: "/month",
    desc: "For teams managing research-to-deployment workflows",
    features: [
      "Everything in Builder Access",
      "Advanced API access",
      "Custom research queries",
      "Collaborative workspace (up to 5 team members)",
      "Experimental protocols & testing frameworks",
      "Weekly research drops",
      "Technical implementation support",
      "Audit logs & compliance reporting",
      "Custom integrations",
    ],
    dataAccess: "Priority access to all archived research",
    buildAccess: "Full documentation + experimental protocols",
    updates: "Weekly — new systems, protocols & analysis",
    documentation: "Complete (specs, protocols, test frameworks, sourcing)",
    cta: "Get Operator Access",
    highlight: true,
    badge: "Most Used by Engineers",
  },
];

const FAQ_ITEMS = [
  {
    q: "How credible is the research in this database?",
    a: "Every entry is sourced directly from granted patents (USPTO/WIPO), peer-reviewed journals (IEEE, Nature, Physics Letters, etc.), or declassified government technical reports. No secondary sources or synthesis. Full citation and source verification for every entry.",
  },
  {
    q: "What makes this different from free academic databases?",
    a: "This is a curated, cross-indexed archive of advanced electromagnetic research with complete engineering system documentation. We index patents alongside their peer-reviewed theoretical foundations and provide complete device specifications (circuit diagrams, component lists, assembly procedures) rather than academic abstracts.",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Yes. The research database is for your own use and internal team projects. Licensing inquiries for commercial applications or derivative products should be directed to institutional access. All tiers include an NDA.",
  },
  {
    q: "What's included in 'engineering build systems'?",
    a: "Complete technical documentation: circuit diagrams, component specifications with part numbers, assembly procedures, sourcing guides, experimental protocols, troubleshooting documentation, and performance specifications for 25+ documented electromagnetic systems.",
  },
  {
    q: "How often is new research added?",
    a: "Research Access: monthly drops. Builder Access: bi-weekly. Operator Access: weekly. Each drop includes newly indexed patents, publications, and technical documentation. You receive notifications and can search all historical content.",
  },
  {
    q: "Do I need a team to use Operator Access?",
    a: "No. Operator Access is designed for teams but available to individuals. The collaborative workspace features remain available even if you're the only user. You get all the technical and API benefits regardless of team size.",
  },
  {
    q: "What happens if I cancel my subscription?",
    a: "Your access ends at the end of the current billing cycle. You retain all exports and documentation you downloaded during your subscription. Your account and data are not deleted.",
  },
  {
    q: "Is there a trial?",
    a: "Research Access includes a 7-day free trial. No credit card required. Full access to the patent database and publications. After trial, subscription begins at $49/month.",
  },
];

export default function SaasPricing() {
  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 sticky top-0 z-40 bg-gray-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="Logo" className="h-8 w-8" />
            <span className="font-black text-sm">C.O.D.E.X.T.E.C.H.</span>
          </Link>
          <a href="/legal" className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-sm transition-colors">
            Institutional Access
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-black leading-tight mb-4">
          Research Intelligence Pricing
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-2">
          Access to our private applied physics research platform. Choose the level of research depth and engineering documentation your team needs.
        </p>
        <p className="text-gray-500 text-sm">
          All tiers include NDA-protected access, source verification, and full citation tracking.
        </p>
      </section>

      {/* ── Pricing Cards ── */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {TIERS.map((tier, i) => (
            <div
              key={i}
              className={`rounded-2xl p-8 transition-all relative ${
                tier.highlight
                  ? "bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600 ring-1 ring-cyan-600/50"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-cyan-600 text-white text-xs font-black flex items-center gap-1">
                  <Award size={12} /> {tier.badge}
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-white font-black text-2xl mb-1">{tier.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{tier.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-gray-500">{tier.period}</span>
                </div>
              </div>

              <button className={`w-full py-3 rounded-lg font-bold text-sm mb-8 transition-all ${
                tier.highlight
                  ? "bg-white text-gray-950 hover:bg-gray-100"
                  : "border border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}>
                {tier.cta}
              </button>

              <div className="space-y-3 mb-8 pb-8 border-b border-gray-700">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="text-gray-600 font-bold mb-1">Research Database</p>
                  <p className="text-gray-400">{tier.dataAccess}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-bold mb-1">Engineering Build Access</p>
                  <p className="text-gray-400">{tier.buildAccess}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-bold mb-1">Research Updates</p>
                  <p className="text-gray-400">{tier.updates}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-bold mb-1">Documentation Depth</p>
                  <p className="text-gray-400">{tier.documentation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Detailed Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-6 font-black text-white">Feature</th>
                  <th className="text-center py-4 px-6 font-black text-gray-300">Research Access</th>
                  <th className="text-center py-4 px-6 font-black text-gray-300">Builder Access</th>
                  <th className="text-center py-4 px-6 font-black text-cyan-400">Operator Access</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Patent Database Access", ra: "✓", ba: "✓", oa: "✓ Priority" },
                  { feature: "Peer-Reviewed Publications", ra: "✓", ba: "✓", oa: "✓ Full Archive" },
                  { feature: "Advanced Search & Filtering", ra: "Basic", ba: "✓", oa: "✓ Custom Queries" },
                  { feature: "Engineering Build Systems", ra: "Overviews", ba: "✓ Complete Specs", oa: "✓ + Protocols" },
                  { feature: "Circuit Diagrams", ra: "—", ba: "✓", oa: "✓" },
                  { feature: "Component Sourcing", ra: "—", ba: "✓", oa: "✓" },
                  { feature: "Assembly Procedures", ra: "—", ba: "✓", oa: "✓" },
                  { feature: "Experimental Protocols", ra: "—", ba: "—", oa: "✓" },
                  { feature: "API Access", ra: "—", ba: "Basic", oa: "✓ Advanced" },
                  { feature: "Collaborative Workspace", ra: "—", ba: "—", oa: "✓ (5 users)" },
                  { feature: "Research Update Frequency", ra: "Monthly", ba: "Bi-weekly", oa: "Weekly" },
                  { feature: "Priority Support", ra: "Email", ba: "Priority Email", oa: "✓ Technical" },
                  { feature: "Audit Logs", ra: "—", ba: "—", oa: "✓" },
                  { feature: "Custom Integrations", ra: "—", ba: "—", oa: "✓" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-white">{row.feature}</td>
                    <td className="py-4 px-6 text-center text-gray-400">{row.ra}</td>
                    <td className="py-4 px-6 text-center text-gray-400">{row.ba}</td>
                    <td className="py-4 px-6 text-center text-cyan-400 font-bold">{row.oa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">What Comes With Your Subscription</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Complete Patent Archive",
              desc: "40+ granted patents with prosecution history, claim analysis, and equivalents. Verified against USPTO and WIPO databases.",
            },
            {
              title: "Peer-Reviewed Library",
              desc: "200+ publications from IEEE, Nature, Physics Letters, arXiv. Full DOI citations and links to source materials.",
            },
            {
              title: "Engineering Documentation",
              desc: "Circuit diagrams, component lists with part numbers, sourcing guides, assembly procedures, and technical specifications.",
            },
            {
              title: "Experimental Protocols",
              desc: "Testing frameworks, measurement procedures, calibration guides, and troubleshooting documentation for device implementation.",
            },
            {
              title: "Source Verification",
              desc: "Every entry is traced to its original source. Full provenance and citation tracking for research integrity.",
            },
            {
              title: "Regular Updates",
              desc: "New patents, publications, and technical documentation added on your tier's schedule. Custom alerts for Operator tier.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-800/50 transition-colors"
                >
                  <h3 className="text-white font-bold text-base text-left">{item.q}</h3>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 flex-shrink-0 transition-transform ${
                      expandedFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === i && (
                  <div className="px-6 pb-6 border-t border-gray-800">
                    <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black mb-4">Choose Your Research Access Level</h2>
        <p className="text-gray-400 mb-10 text-base max-w-2xl mx-auto">
          Start with a free 7-day trial of Research Access. No credit card required. Upgrade or downgrade anytime.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIERS.map((tier, i) => (
            <a
              key={i}
              href="/legal"
              className={`py-3 px-6 rounded-lg font-black text-sm transition-all inline-block ${
                tier.highlight
                  ? "bg-white text-gray-950 hover:bg-gray-100"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Get {tier.name} <ArrowRight size={14} className="inline ml-1" />
            </a>
          ))}
        </div>

        <p className="text-gray-600 text-xs mt-6 flex items-center justify-center gap-1">
          <Shield size={12} /> All plans include NDA protection and institutional security standards
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p className="font-black mb-3">C.O.D.E.X.T.E.C.H. · Applied Physics Research Platform</p>
        <div className="flex justify-center gap-6">
          <a href="/legal" className="hover:text-gray-400">Access Agreement</a>
          <a href="/institutional-licensing" className="hover:text-gray-400">Institutional Plans</a>
          <a href="/" className="hover:text-gray-400">Home</a>
        </div>
      </footer>
    </div>
  );
}