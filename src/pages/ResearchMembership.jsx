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
            <Lock size={12} /> Full Institutional Access
          </div>
          <h2 className="text-4xl font-black mb-4">Everything: Archive + Research + Community</h2>
          <p className="text-gray-400 text-lg">
            40+ patents fully analyzed. 8 research modules. 200+ citations. Monthly updates. Quarterly live sessions with institutional researchers.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Researcher Tier */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white font-black text-2xl mb-2">Researcher</h3>
            <p className="text-gray-500 text-sm mb-6">For individuals and independent teams</p>

            <div className="text-3xl font-black text-cyan-300 mb-1">$97</div>
            <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>

            <div className="space-y-3 mb-8">
              {[
                "40+ patent analyses (prosecution history, design implications)",
                "8 research modules (80+ hours structured content)",
                "Engineering system documentation (MEG, Scalar, Anenergy, Priore, etc.)",
                "Monthly research updates (new patents, emerging literature)",
                "Member-only research email briefs"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title="Research Membership"
              price="$97"
              priceInCents={9700}
              description="Monthly membership for individual researchers"
            />

            <p className="text-gray-600 text-xs text-center mt-4">Billed monthly. Access everything immediately.</p>
          </div>

          {/* Institutional Tier */}
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-600 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
              RECOMMENDED
            </div>

            <h3 className="text-white font-black text-2xl mb-2">Institutional</h3>
            <p className="text-gray-300 text-sm mb-6">For labs, research teams, and institutions</p>

            <div className="text-3xl font-black text-cyan-300 mb-1">$197</div>
            <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>

            <div className="space-y-3 mb-8">
              {[
                "Everything in Researcher tier",
                "Team access (up to 5 seats)",
                "Quarterly live Q&A sessions with institutional researchers",
                "Direct support: technical questions & troubleshooting",
                "First access to Advanced Engineering Bundle (pre-release)",
                "Institution logo on member page (optional)"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-200 text-sm font-semibold">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title="Institutional Membership"
              price="$197"
              priceInCents={19700}
              description="Monthly membership for research teams"
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
                label: "40+ Patents",
                desc: "Full analysis with prosecution history, claims, and design implications"
              },
              {
                icon: <BookOpen className="text-purple-400" />,
                label: "8 Modules",
                desc: "80+ hours of structured research analysis (Bearden, Scalar EM, Gravitobiology, etc.)"
              },
              {
                icon: <Lock className="text-green-400" />,
                label: "System Docs",
                desc: "Engineering documentation for MEG, Scalar Transmitter, Anenergy, Priore, and more"
              },
              {
                icon: <Users className="text-pink-400" />,
                label: "Community",
                desc: "Monthly updates + quarterly live sessions with institutional researchers"
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
                title: "Institution Standard",
                desc: "Used by research teams in 6+ countries. This is the documentation framework serious teams rely on."
              },
              {
                title: "Primary Source Only",
                desc: "Every analysis traces to Maxwell, Bearden, peer-reviewed literature, and declassified archives. No speculation."
              },
              {
                title: "Actionable Framework",
                desc: "Not just analysis. Engineering interpretations mapped to real system design decisions."
              },
              {
                title: "Living Archive",
                desc: "Monthly updates: new patents indexed, emerging literature flagged, institutional developments tracked."
              },
              {
                title: "Direct Access",
                desc: "Institutional tier includes quarterly sessions where you can ask experts directly about your research."
              },
              {
                title: "Unmatched Scope",
                desc: "40+ patents + 8 modules + 200+ citations. This level of comprehensive analysis isn't available elsewhere."
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