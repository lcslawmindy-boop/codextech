import { useState } from "react";
import { ArrowRight, CheckCircle2, Users, Zap, Lock, BookOpen, Zap as ZapIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";

function CheckoutButton({ title, price, priceInCents, description, billingPeriod = "monthly" }) {
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

  const buttonLabel = billingPeriod === "annual" 
    ? `Subscribe Annual — ${price}/year`
    : `Subscribe — ${price}/month`;

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm transition-all disabled:opacity-50"
    >
      {loading ? "Processing..." : buttonLabel}
    </button>
  );
}

export default function ResearchMembership() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");

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

        {/* Teaser — blurred sample content */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-white font-black text-xl">What's Inside the Archive</h3>
            <span className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-700 text-purple-300 text-xs font-bold">PREVIEW</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {[
              {
                label: "Patent Analysis",
                icon: "📄",
                color: "border-cyan-900",
                preview: "US Patent 6,362,718 — Motionless Electromagnetic Generator",
                lines: ["Prosecution history: 4 office actions", "Independent claims: 7 | Dependent: 14", "Prior art cited: 23 references", "Freedom-to-operate score: 8.4/10", "Engineering implications: High"],
              },
              {
                label: "Research Module",
                icon: "📚",
                color: "border-purple-900",
                preview: "Module 3 — Vacuum Energy Extraction Frameworks",
                lines: ["Primary sources analyzed: 34", "Peer-reviewed citations: 18", "Patent cross-references: 12", "Engineering build implications", "Verified replication protocols"],
              },
              {
                label: "Intelligence Brief",
                icon: "🔬",
                color: "border-green-900",
                preview: "Declassified ONR Report R-5-78 (1978)",
                lines: ["Source: Office of Naval Research", "Classification: Unclassified (1983)", "Key findings: 6 experimental results", "Engineering relevance: Critical", "Cross-references: 9 active patents"],
              },
            ].map((card, i) => (
              <div key={i} className={`relative bg-gray-900 border ${card.color} rounded-xl overflow-hidden`}>
                {/* Visible header */}
                <div className="px-4 pt-4 pb-2 border-b border-gray-800 flex items-center gap-2">
                  <span className="text-xl">{card.icon}</span>
                  <div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
                    <p className="text-white text-xs font-semibold leading-snug mt-0.5">{card.preview}</p>
                  </div>
                </div>
                {/* Blurred body */}
                <div className="relative px-4 py-3">
                  <div className="blur-sm opacity-50 pointer-events-none select-none space-y-1.5">
                    {card.lines.map((line, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-600 flex-shrink-0" />
                        <p className="text-gray-300 text-xs">{line}</p>
                      </div>
                    ))}
                  </div>
                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-950/80 border border-gray-700 text-gray-400 text-xs font-bold">
                      <Lock size={11} /> Members Only
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs text-center">Showing 3 of 200+ research entries. Subscribe to unlock the full archive.</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-4 bg-gray-900/60 border border-gray-800 rounded-xl p-1.5">
            <button 
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${billingPeriod === "monthly" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingPeriod("annual")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${billingPeriod === "annual" ? "bg-cyan-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Annual 
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-0.5 rounded">Save 3 months</span>
            </button>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {/* Researcher Basic Tier */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white font-black text-2xl mb-2">Researcher</h3>
            <p className="text-gray-500 text-sm mb-6">For curious individuals getting started</p>

            {billingPeriod === "monthly" ? (
              <>
                <div className="text-3xl font-black text-cyan-300 mb-1">$49</div>
                <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-cyan-300 mb-1">$441</div>
                <p className="text-gray-500 text-xs mb-2">/year (9 months cost)</p>
                <p className="text-green-400 text-xs font-bold mb-6">3 months free — save $147</p>
              </>
            )}

            <div className="space-y-3 mb-8">
              {[
                "3 courses + 3 build plans included",
                "À la carte access: any course or build plan at $49 each",
                "Access to core research archive",
                "8 structured research modules",
                "Monthly research updates",
                "Community access",
                "Basic research briefs"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title={billingPeriod === "annual" ? "Researcher Annual Membership" : "Researcher Membership"}
              price={billingPeriod === "annual" ? "$441" : "$49"}
              priceInCents={billingPeriod === "annual" ? 44100 : 4900}
              description={billingPeriod === "annual" ? "Annual Researcher membership — 3 months free + premium perks" : "Monthly Researcher membership — core archive access"}
              billingPeriod={billingPeriod}
            />

            {billingPeriod === "annual" && (
              <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Annual Benefits</p>
                <p className="text-gray-300 text-xs flex gap-2"><span className="text-green-400">✓</span>First access to new course & build plan drops</p>
                <p className="text-gray-300 text-xs flex gap-2"><span className="text-green-400">✓</span>Patent suppression monitoring newsletter</p>
                <p className="text-gray-300 text-xs flex gap-2"><span className="text-green-400">✓</span>Insiders scoop + market investment guidance</p>
              </div>
            )}
            <p className="text-gray-600 text-xs text-center mt-4">{billingPeriod === "annual" ? "Billed annually" : "Billed monthly"}. Cancel anytime.</p>
          </div>

          {/* Builder Tier */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
            <h3 className="text-white font-black text-2xl mb-2">Builder</h3>
            <p className="text-gray-500 text-sm mb-6">For engineers actively building systems</p>

            {billingPeriod === "monthly" ? (
              <>
                <div className="text-3xl font-black text-cyan-300 mb-1">$99</div>
                <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-cyan-300 mb-1">$891</div>
                <p className="text-gray-500 text-xs mb-2">/year (9 months cost)</p>
                <p className="text-green-400 text-xs font-bold mb-6">3 months free — save $297</p>
              </>
            )}

            <div className="space-y-3 mb-8">
              {[
                "Everything in Researcher",
                "40+ patent analyses with prosecution history",
                "Engineering documentation & sourcing guides",
                "Step-by-step build frameworks",
                "Invention Dossier: IP creation framework",
                "Bring-to-Market Commercialization Roadmap",
                "1 new course monthly",
                "1 new build plan monthly",
                "Direct expert support (48hr response)",
                "Exclusive research briefs"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300 text-sm">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title={billingPeriod === "annual" ? "Builder Annual Membership" : "Builder Membership"}
              price={billingPeriod === "annual" ? "$891" : "$99"}
              priceInCents={billingPeriod === "annual" ? 89100 : 9900}
              description={billingPeriod === "annual" ? "Annual Builder membership — 3 months free + premium perks" : "Monthly Builder membership for engineers actively building systems"}
              billingPeriod={billingPeriod}
            />

            {billingPeriod === "annual" && (
              <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Annual Benefits</p>
                <p className="text-gray-300 text-xs flex gap-2"><span className="text-green-400">✓</span>First access to new course & build plan drops</p>
                <p className="text-gray-300 text-xs flex gap-2"><span className="text-green-400">✓</span>Patent suppression monitoring newsletter</p>
                <p className="text-gray-300 text-xs flex gap-2"><span className="text-green-400">✓</span>Insiders scoop + market investment guidance</p>
              </div>
            )}
            <p className="text-gray-600 text-xs text-center mt-4">{billingPeriod === "annual" ? "Billed annually" : "Billed monthly"}. Cancel anytime.</p>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-600 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
              MOST POWERFUL
            </div>

            <h3 className="text-white font-black text-2xl mb-2">Pro</h3>
            <p className="text-gray-300 text-sm mb-6">For research teams, institutions, and enterprises</p>

            {billingPeriod === "monthly" ? (
              <>
                <div className="text-3xl font-black text-cyan-300 mb-1">$199</div>
                <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-cyan-300 mb-1">$1,791</div>
                <p className="text-gray-500 text-xs mb-2">/year (9 months cost)</p>
                <p className="text-green-400 text-xs font-bold mb-6">3 months free — save $597</p>
              </>
            )}

            <div className="space-y-3 mb-8">
              {[
                "Everything in Builder",
                "Team access (up to 10 seats)",
                "Monthly live technical sessions",
                "Priority expert support",
                "Quarterly institutional briefings",
                "Custom research requests (1/month)",
                "Pre-release patent analyses & modules"
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle2 size={16} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-200 text-sm font-semibold">{feature}</p>
                </div>
              ))}
            </div>

            <CheckoutButton
              title={billingPeriod === "annual" ? "Pro Annual Membership" : "Pro Membership"}
              price={billingPeriod === "annual" ? "$1,791" : "$199"}
              priceInCents={billingPeriod === "annual" ? 179100 : 19900}
              description={billingPeriod === "annual" ? "Annual Pro membership — 3 months free + premium perks" : "Monthly Pro membership for research teams and institutions"}
              billingPeriod={billingPeriod}
            />

            {billingPeriod === "annual" && (
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-2">
                <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-3">Annual Benefits</p>
                <p className="text-gray-200 text-xs flex gap-2"><span className="text-green-400">✓</span>First access to new course & build plan drops</p>
                <p className="text-gray-200 text-xs flex gap-2"><span className="text-green-400">✓</span>Patent suppression monitoring newsletter</p>
                <p className="text-gray-200 text-xs flex gap-2"><span className="text-green-400">✓</span>Insiders scoop + market investment guidance</p>
              </div>
            )}
            <p className="text-gray-400 text-xs text-center mt-4">{billingPeriod === "annual" ? "Billed annually" : "Billed monthly"}. Team access activates immediately.</p>
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
            Membership (Researcher $49 · Builder $99 · Pro $199/mo) gives you the research. The Advanced Engineering Bundle ($997) is for teams actually building systems — with hands-on designs, component sourcing, troubleshooting protocols, and measurement validation.
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
                q: "What's the difference between the tiers?",
                a: "Researcher ($49/mo): core archive access. Builder ($99/mo): adds patent analyses, engineering docs, and expert support. Pro ($199/mo): adds team seats, live sessions, and custom research requests."
              },
              {
                q: "Can I upgrade later?",
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