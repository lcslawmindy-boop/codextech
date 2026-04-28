import { useState } from "react";
import { ArrowRight, CheckCircle2, Users, Zap, Lock, BookOpen } from "lucide-react";
import { base44 } from "@/api/base44Client";

function CheckoutButton({ title, price, priceInCents, description }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title,
        priceInCents,
        description,
        category: "Membership",
        successUrl: `${origin}/membership-success`,
        cancelUrl: `${origin}/research-membership`
      });

      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all disabled:opacity-50"
    >
      {loading ? "Processing..." : `Subscribe — ${price}/month`}
    </button>
  );
}

export default function ResearchMembership() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 mb-4 inline-block">← Back</a>
          <h1 className="text-2xl font-bold">Research Membership</h1>
          <p className="text-gray-500 text-sm mt-1">Institutional-Grade Access to the Complete Archive</p>
        </div>
      </div>

      <div className="px-6 py-12 max-w-6xl mx-auto">
        {/* Hero */}
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800 text-purple-300 text-xs font-black mb-4 uppercase tracking-widest">
            <Lock size={12} /> Research Intelligence Platform
          </div>
          <h2 className="text-4xl font-black mb-4">Institutional Access to Primary-Source Research</h2>
          <p className="text-gray-400 text-lg">
            Complete archive of 40+ patents (with prosecution history), 200+ peer-reviewed publications, declassified government reports, and engineering frameworks derived from verified sources. Monthly updates. Quarterly live research sessions.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Researcher Tier */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white font-black text-2xl mb-2">Researcher</h3>
            <p className="text-gray-500 text-sm mb-6">For individual researchers and engineers</p>

            <div className="text-3xl font-black text-cyan-300 mb-1">$197</div>
            <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>

            <div className="space-y-3 mb-8">
              {[
                "40+ patent analyses with full prosecution history and claims review",
                "8 structured research modules (80+ hours of primary-source analysis)",
                "Engineering documentation derived from verified patents and peer-reviewed research",
                "Monthly research updates: new patents indexed, emerging literature flagged",
                "Direct expert support: research questions answered within 48 hours",
                "Exclusive research briefs and institutional findings"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title="Research Membership"
              price="$197"
              priceInCents={19700}
              description="Monthly membership for individual researchers and engineers"
            />

            <p className="text-gray-600 text-xs text-center mt-4">Billed monthly. Access everything immediately.</p>
          </div>

          {/* Institutional Tier */}
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-600 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
              INSTITUTIONAL STANDARD
            </div>

            <h3 className="text-white font-black text-2xl mb-2">Institutional</h3>
            <p className="text-gray-300 text-sm mb-6">For research teams, government agencies, and enterprises</p>

            <div className="text-3xl font-black text-cyan-300 mb-1">$497</div>
            <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>

            <div className="space-y-3 mb-8">
              {[
                "Everything in Research tier",
                "Team access (up to 10 seats)",
                "Monthly live technical sessions with research directors",
                "Priority expert support: research & strategic questions",
                "Quarterly institutional briefings on emerging research",
                "Custom research requests (1 per month)",
                "Pre-release access to new patent analyses and modules"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-200 text-sm font-semibold">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title="Institutional Membership"
              price="$497"
              priceInCents={49700}
              description="Monthly membership for research teams and institutions"
            />

            <p className="text-gray-400 text-xs text-center mt-4">Billed monthly. Team access activates immediately.</p>
          </div>
        </div>

        {/* What's Included */}
        <section className="mb-16 bg-gray-900/40 border border-gray-800 rounded-2xl p-12">
          <h3 className="text-white font-black text-2xl mb-8">Complete Archive Access</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="text-cyan-400" />,
                label: "Patent Intelligence",
                desc: "40+ patents with full prosecution history, claims analysis, prior art assessment, and freedom-to-operate evaluation"
              },
              {
                icon: <BookOpen className="text-purple-400" />,
                label: "Primary Sources",
                desc: "200+ peer-reviewed publications, declassified government reports, and technical archives analyzed"
              },
              {
                icon: <Lock className="text-green-400" />,
                label: "Verified Research",
                desc: "All engineering documentation sourced from filed patents, published literature, and verified specifications"
              },
              {
                icon: <Users className="text-pink-400" />,
                label: "Expert Support",
                desc: "Monthly research updates + live sessions with institutional researchers and technical experts"
              }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3 text-3xl">{item.icon}</div>
                <p className="text-white font-bold text-sm mb-2">{item.label}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Authority */}
        <section className="mb-16">
          <h3 className="text-white font-black text-2xl mb-8 text-center">Why Research Membership</h3>

          <div className="space-y-6">
            {[
              {
                title: "Primary-Source Foundation",
                desc: "All research is sourced from filed US patents, peer-reviewed journals, declassified government archives, and verified technical specifications. No speculation. No secondary interpretation."
              },
              {
                title: "Institutional-Grade Analysis",
                desc: "Used by research institutions, government laboratories, and serious engineers in 6+ countries. This is the standard framework for credible research intelligence."
              },
              {
                title: "Verification Methodology",
                desc: "Every technical claim is traceable to its source. Patents cross-referenced with USPTO records. Publications verified against journal archives. Government reports authenticated through OSTI.gov."
              },
              {
                title: "Monthly Intelligence Updates",
                desc: "New patents indexed. Emerging peer-reviewed research flagged. Regulatory developments tracked. You stay current with institutional research."
              },
              {
                title: "Expert Support (Institutional Tier)",
                desc: "Direct access to research directors via monthly sessions. Ask questions about patent strategy, research interpretation, engineering application. Get expert answers."
              },
              {
                title: "Competitive Advantage",
                desc: "40+ patents + 8 research modules + 200+ primary sources analyzed. No other platform offers this level of comprehensive, verified intelligence on electromagnetic research systems."
              }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 bg-gray-900/40 border border-gray-800 rounded-xl p-6">
                <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Level */}
        <section className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-white font-black text-xl mb-4">Ready to Build?</h3>
          <p className="text-gray-400 mb-4">
            Membership gives you the research. The Advanced Engineering Bundle ($997) is for teams actually building systems — with hands-on designs, component sourcing, troubleshooting protocols, and measurement validation.
          </p>
          <a
            href="/advanced-engineering-bundle"
            className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 font-bold text-sm"
          >
            Explore Advanced Engineering Bundle <ArrowRight size={14} />
          </a>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="text-white font-black text-xl mb-6">FAQ</h3>
          <div className="space-y-4">
            {[
              {
                q: "What format are the research modules?",
                a: "Structured written analysis (PDF + web access). 80+ hours total. Each module covers: Research Objective → Source Material → System Breakdown → Engineering Interpretation → Build Implications → Limitations."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No contracts. Cancel in account settings anytime, effective at the end of your billing period."
              },
              {
                q: "Is there a free trial?",
                a: "No, but the Research Brief (free) gives you a sense of content quality and depth. Start there if unsure."
              },
              {
                q: "What's the difference between Researcher and Institutional?",
                a: "Researcher: individual access, all content. Institutional: team seats (up to 5), quarterly live Q&A, direct expert support, pre-release access to Advanced Bundle."
              },
              {
                q: "Can I upgrade from Researcher to Institutional later?",
                a: "Yes. Contact support or upgrade in account settings. You'll pay the difference pro-rated."
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/40 border border-gray-800 rounded-lg p-4">
                <p className="text-white font-bold text-sm mb-2">{item.q}</p>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}