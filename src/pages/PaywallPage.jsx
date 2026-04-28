import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Lock, Shield, BookOpen, Award } from "lucide-react";
import { base44 } from "@/api/base44Client";

const INSTITUTIONAL_TIERS = [
  {
    name: "Individual Researcher",
    price: "$199/yr",
    seats: "1",
    features: [
      "Full patent archive (40+ patents)",
      "200+ peer-reviewed publications",
      "25+ engineering system specs",
      "Advanced search & filtering",
      "Citation export",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Research Team",
    price: "$799/yr",
    seats: "5",
    features: [
      "Everything in Individual",
      "Collaborative workspace",
      "Team management",
      "Custom alerts",
      "Citation management",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Institutional",
    price: "Custom",
    seats: "Unlimited",
    features: [
      "Unlimited concurrent users",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee (99.9%)",
      "Annual audit reports",
    ],
    highlight: false,
  },
];

const DATABASE_STATS = [
  { label: "Granted Patents", value: "40+" },
  { label: "Peer-Reviewed Papers", value: "200+" },
  { label: "Engineering Systems", value: "25+" },
  { label: "Technical Reports", value: "150+" },
  { label: "Research Domains", value: "6" },
  { label: "Primary Sources", value: "100%" },
];

const CONTENT_SECTIONS = [
  {
    title: "Patent Archive",
    items: ["US & international patents", "Prosecution history", "Citation tracking", "Equivalents & cross-references"],
  },
  {
    title: "Research Library",
    items: ["Peer-reviewed journals", "DARPA technical reports", "Declassified documents", "Conference proceedings"],
  },
  {
    title: "Engineering Systems",
    items: ["Complete device specs", "Component lists", "Assembly procedures", "Technical drawings"],
  },
  {
    title: "Theory & Mathematics",
    items: ["Scalar EM formulations", "Bearden phase conjugation", "Whittaker potential", "Field topology"],
  },
];

export default function PaywallPage() {
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({
      email,
      source: "paywall_interest",
      status: "active",
    });
    setEmailSubmitted(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Header ── */}
      <header className="border-b border-gray-800 px-6 py-4 bg-gray-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-black">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-8 w-8" />
            <span className="hidden sm:block">Research Database</span>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
          Electromagnetic Research Database
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-2">
          40+ granted patents, 200+ peer-reviewed publications, 25+ engineering system specifications.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-8">
          Complete technical documentation for serious researchers and engineering teams.
        </p>
      </section>

      {/* ── Database Stats ── */}
      <section className="px-6 py-12 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
            {DATABASE_STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-cyan-400 mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content Overview ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">What's Included</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CONTENT_SECTIONS.map((section, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                <span className="text-cyan-400">●</span> {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-cyan-400 mt-0.5">→</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Institutional Pricing ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-3">Access Plans</h2>
          <p className="text-gray-500 text-center text-sm mb-12">Choose the plan that fits your research needs</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {INSTITUTIONAL_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 transition-all ${
                  tier.highlight
                    ? "bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-2 border-cyan-600 relative"
                    : "bg-gray-900 border border-gray-800"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
                    RECOMMENDED
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-black text-xl mb-1">{tier.name}</h3>
                  <div className="text-3xl font-black text-cyan-400 mb-2">{tier.price}</div>
                  <p className="text-gray-500 text-sm">{tier.seats} {tier.seats === "1" ? "user" : "users"}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-gray-300 text-sm">
                      <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="/legal"
                  className={`block w-full py-3 rounded-lg font-black text-sm text-center transition-all ${
                    tier.highlight
                      ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                      : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {tier.name === "Institutional" ? "Contact Sales" : "Get Started"}
                </a>
              </div>
            ))}
          </div>

          <div className="text-center p-6 bg-gray-900 border border-gray-800 rounded-xl">
            <p className="text-gray-400 text-sm mb-4">
              <Shield size={16} className="inline mr-2 text-cyan-400" />
              All plans include NDA-protected access, source verification, and institutional support.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Choose This ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">Why This Database</h2>
        <div className="space-y-6">
          {[
            {
              title: "Primary Sources Only",
              desc: "Every entry traces to a granted patent, peer-reviewed publication, or declassified technical report. No interpretation, synthesis, or speculation.",
              icon: "📋",
            },
            {
              title: "Source Verification",
              desc: "Patents verified against USPTO & WIPO. Publications cross-referenced with PubMed, IEEE, arXiv. Reports sourced from official government archives.",
              icon: "✓",
            },
            {
              title: "Engineering-Grade Specs",
              desc: "Complete technical documentation. Not partial guides. Device architecture, component lists, assembly procedures, troubleshooting documentation.",
              icon: "⚙️",
            },
            {
              title: "Institutional Standards",
              desc: "Organized and searchable like Bloomberg Terminal or PitchBook. Advanced filtering, citation export, and API access for enterprise subscribers.",
              icon: "🏢",
            },
            {
              title: "No Hype or Speculation",
              desc: "This is an engineering research platform, not an info product. Every claim is supported by mathematics, experimental data, or technical specifications.",
              icon: "🎯",
            },
            {
              title: "Ongoing Updates",
              desc: "New patents, publications, and technical reports added monthly. Custom alerts for institutional subscribers.",
              icon: "📈",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-3xl flex-shrink-0">{item.icon}</span>
              <div>
                <h3 className="text-white font-bold text-base mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Research Updates</h2>
          <p className="text-gray-400 text-sm mb-6">
            Monthly digest of new patents, publications, and engineering documentation added to the database.
          </p>
          {emailSubmitted ? (
            <div className="flex items-center justify-center gap-2 text-green-400 font-bold text-sm">
              <CheckCircle2 size={16} /> Subscribed — check your inbox
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="your@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm whitespace-nowrap transition-colors"
              >
                Subscribe
              </button>
            </form>
          )}
          <p className="text-gray-700 text-xs mt-3">Research updates only. No promotional content. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Electromagnetic Research Database</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="/legal" className="hover:text-gray-400">Access Agreement</a>
          <a href="/institutional-licensing" className="hover:text-gray-400">Institutional Licensing</a>
          <a href="/" className="hover:text-gray-400">Home</a>
        </div>
      </footer>
    </div>
  );
}