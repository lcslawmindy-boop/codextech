import { useState } from "react";
import { ArrowRight, CheckCircle2, Users, Zap, Lock, BookOpen, Zap as ZapIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AdvancedInventionDossierGenerator from "@/components/AdvancedInventionDossierGenerator";
import CircuitBoardBackground from "@/components/backgrounds/CircuitBoardBackground";

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
    <div className="min-h-screen bg-transparent text-white relative">
      <CircuitBoardBackground />
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

        {/* Builder Tier Benefits Banner */}
        <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-2 border-cyan-700 rounded-2xl p-8 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl flex-shrink-0">⚡</span>
              <div className="flex-1">
                <h3 className="text-white font-black text-2xl mb-2">Builder Tier ($99/mo)</h3>
                <p className="text-gray-300">The complete IP & commercialization toolkit</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-900/60 border border-cyan-800 rounded-xl p-4">
                <p className="text-cyan-400 font-black text-sm mb-2">💰 Member Pricing</p>
                <p className="text-white font-bold text-lg mb-1">All Courses & Build Plans: $49</p>
              </div>

              <div className="bg-gray-900/60 border border-cyan-800 rounded-xl p-4">
                <p className="text-cyan-400 font-black text-sm mb-2">🛡️ EMF Protection</p>
                <p className="text-white font-bold text-lg mb-1">20% Off EMF Shop</p>
                <p className="text-gray-400 text-xs">Exclusive builder member discount</p>
              </div>

              <div className="bg-gray-900/60 border border-cyan-800 rounded-xl p-4">
                <p className="text-cyan-400 font-black text-sm mb-2">🧠 AI IP Generator</p>
                <p className="text-white font-bold text-lg mb-1">3 Inventions per Dossier</p>
                <p className="text-gray-400 text-xs">Create dossiers with up to 3 inventions per package with patent claims & commercialization plans</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-cyan-700">
              <p className="text-cyan-400 font-bold text-sm mb-3">Each Invention Dossier includes:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
               {["Full Patent Strategy", "Claims Analysis & Design-Arounds", "Prior Art Assessment", "Freedom-to-Operate Score", "Commercialization Roadmap", "Market Positioning", "Licensing Framework", "IP Valuation Model"].map((item, i) => (
                 <div key={i} className="bg-gray-900/40 rounded-lg p-2 text-center">
                   <p className="text-gray-300 text-xs font-semibold">{item}</p>
                 </div>
               ))}
              </div>

              {/* Dossier Pricing */}
              <div className="bg-gray-900/60 border border-cyan-800/60 rounded-xl p-4">
               <p className="text-white font-black text-sm mb-3">📄 Dossier Add-On Pricing (à la carte)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { tier: "Starter", count: "1 Invention", price: "$197", note: "Full IP & commercialization dossier", color: "border-gray-700 text-gray-300" },
                    { tier: "Growth", count: "3 Inventions", price: "$497", note: "3 full dossiers + video walkthroughs", color: "border-cyan-700 text-cyan-300", highlight: true },
                    { tier: "Portfolio", count: "10 Inventions", price: "$997", note: "10 dossiers + licensing templates + VDR", color: "border-purple-700 text-purple-300" },
                  ].map(({ tier, count, price, note, color, highlight }) => (
                    <div key={tier} className={`relative rounded-lg p-3 border ${color} bg-gray-900/40 ${highlight ? "ring-1 ring-cyan-600" : ""}`}>
                      {highlight && <span className="absolute -top-2 left-3 px-2 py-0.5 rounded-full bg-cyan-700 text-white text-xs font-bold">Most Popular</span>}
                      <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{tier}</p>
                      <p className="text-white font-black text-xl">{price}</p>
                      <p className="text-xs font-bold mt-0.5">{count}</p>
                      <p className="text-gray-500 text-xs mt-1">{note}</p>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-3">Builder members get 3 Invention Dossier generations (up to 3 inventions per dossier) included monthly. <a href="/invention-dossier" className="text-cyan-400 underline">View full dossier packages →</a></p>
              </div>
            </div>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Researcher Basic Tier */}
          <div className="rounded-2xl p-8 transition-all" style={{ background: "rgb(8,10,22)", border: "2px solid rgba(80,160,240,0.8)", boxShadow: "0 0 28px rgba(60,130,240,0.4), inset 0 0 30px rgba(60,100,200,0.08)" }}>
            <h3 className="text-white font-black text-2xl mb-2">Researcher</h3>
            <p className="text-gray-400 text-sm mb-6">For curious individuals getting started</p>

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
                { feature: "3 courses + 3 build plans included", value: "$294" },
                { feature: "À la carte access: any course or build plan at $49 each", value: "$99" },
                { feature: "Access to core research archive", value: "$200" },
                { feature: "8 structured research modules", value: "$400" },
                { feature: "Monthly research updates", value: "—" },
                { feature: "Community access", value: "—" },
                { feature: "Basic research briefs", value: "—" }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">{item.feature}</p>
                  </div>
                  <span className="text-cyan-400 text-xs font-bold flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-cyan-950/30 border border-cyan-800 rounded-lg p-3 mb-4">
              <p className="text-cyan-300 text-xs font-bold">Total Market Value: $993</p>
              <p className="text-gray-400 text-xs mt-1">If bought separately: $993/year. Get everything at $441/year (annual) or $588/year (monthly).</p>
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
          <div className="rounded-2xl p-8 relative transition-all neon-card-cyan">
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
                { feature: "Everything in Researcher", value: "$993" },
                { feature: "All courses & build plans", value: "$49 each" },
                { feature: "40+ patent analyses with prosecution history", value: "$400" },
                { feature: "Engineering documentation & sourcing guides", value: "$250" },
                { feature: "Step-by-step build frameworks", value: "$200" },
                { feature: "3 Invention Dossier Generations (up to 3 inventions each)", value: "$597" },
                { feature: "Bring-to-Market Commercialization Roadmap", value: "$199" },
                { feature: "Direct expert support (48hr response)", value: "$300" },
                { feature: "20% off EMF Protection Shop", value: "—" },
                { feature: "Exclusive research briefs", value: "—" }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm">{item.feature}</p>
                  </div>
                  <span className="text-cyan-400 text-xs font-bold flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-cyan-950/30 border border-cyan-800 rounded-lg p-3 mb-4">
              <p className="text-cyan-300 text-xs font-bold">Total Market Value: $3,929</p>
              <p className="text-gray-400 text-xs mt-1">At $99/month, you'd pay $1,188+ yearly for individual items. Get everything at $891/year (annual) or $1,188/year (monthly).</p>
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
          <div className="rounded-2xl p-8 relative transition-all neon-card-purple">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-black whitespace-nowrap">
              🔥 MOST POWERFUL
            </div>

            <h3 className="text-white font-black text-2xl mb-1">Pro</h3>
            <p className="text-purple-300 text-xs font-bold mb-2">$2,500+ value / month</p>
            <p className="text-gray-400 text-sm mb-6">For serious inventors ready to build, patent & commercialize</p>

            {billingPeriod === "monthly" ? (
              <>
                <div className="text-3xl font-black text-purple-300 mb-1">$199</div>
                <p className="text-gray-500 text-xs mb-8">/month, cancel anytime</p>
              </>
            ) : (
              <>
                <div className="text-3xl font-black text-purple-300 mb-1">$1,791</div>
                <p className="text-gray-400 text-xs mb-2">/year (9 months cost)</p>
                <p className="text-green-400 text-xs font-bold mb-6">3 months free — save $597</p>
              </>
            )}

            <div className="space-y-3 mb-6">
              {[
                { feature: "Everything in Builder ($99/mo)", value: "✓" },
                { feature: "ALL structured courses — full library, unlimited", value: "$1,200+" },
                { feature: "ALL build plans — complete collection with BOM", value: "$800+" },
                { feature: "ALL PDFs — research briefs, guides, frameworks", value: "$300+" },
                { feature: "Video build guides — step-by-step ($50 ea, included free)", value: "$50 ea" },
                { feature: "Verified supplier sourcing list per device", value: "$200+" },
                { feature: "AI Patent Attorney — full patent drafting tool", value: "$500+" },
                { feature: "5 Invention Dossier Generations (up to 5 inventions each, unlimited monthly)", value: "$1,497" },
                { feature: "Commercialization roadmap w/ BOM & milestones", value: "$400" },
                { feature: "Bring-to-Market pitch deck (auto-generated)", value: "$300" },
                { feature: "PDF export included ($50 value — free for Pro)", value: "$50 ea" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    <CheckCircle2 size={16} className="text-purple-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-200 text-sm">{item.feature}</p>
                  </div>
                  <span className="text-purple-300 text-xs font-bold flex-shrink-0">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Value callout box */}
            <div className="bg-gradient-to-r from-purple-950/60 to-pink-950/40 border border-purple-600 rounded-xl p-4 mb-4">
              <p className="text-purple-200 text-xs font-black mb-1">🎯 Total Bundle Value: $5,294+/month</p>
              <p className="text-gray-300 text-xs">Courses + Build Plans + PDFs + Video Guides + Supplier Sourcing + AI Patent Attorney + 5 Invention Dossier Generations (5 inventions each) + Commercialization Roadmap + Pitch Deck + PDF/Video exports</p>
            </div>

            <CheckoutButton
              title={billingPeriod === "annual" ? "Pro Annual Membership" : "Pro Membership"}
              price={billingPeriod === "annual" ? "$1,791" : "$199"}
              priceInCents={billingPeriod === "annual" ? 179100 : 19900}
              description={billingPeriod === "annual" ? "Annual Pro membership — full library + AI patent tools + 25 dossiers/mo + commercialization suite" : "Monthly Pro membership — all courses, build plans, PDFs, video guides, AI patent attorney, 25 dossier rolls, commercialization roadmap & pitch deck"}
              billingPeriod={billingPeriod}
            />

            {billingPeriod === "annual" && (
              <div className="mt-6 pt-6 border-t border-purple-800 space-y-2">
                <p className="text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">Annual Benefits</p>
                <p className="text-gray-200 text-xs flex gap-2"><span className="text-green-400">✓</span>First access to new course & build plan drops</p>
                <p className="text-gray-200 text-xs flex gap-2"><span className="text-green-400">✓</span>Patent suppression monitoring newsletter</p>
                <p className="text-gray-200 text-xs flex gap-2"><span className="text-green-400">✓</span>Insiders scoop + market investment guidance</p>
              </div>
            )}
            <p className="text-gray-400 text-xs text-center mt-4">{billingPeriod === "annual" ? "Billed annually" : "Billed monthly"}. Cancel anytime.</p>
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

        {/* AI Dossier Generator */}
        <section className="mb-6">
          <AdvancedInventionDossierGenerator />
        </section>

        {/* Dossier Workspace CTA */}
        <section className="mb-12 bg-gradient-to-r from-blue-950/40 to-purple-950/40 border border-blue-800/60 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <p className="text-white font-black text-lg mb-1">Turn Dossiers into Patent Drafts & Investor Decks</p>
            <p className="text-gray-400 text-sm">Open the Dossier Workspace to convert your saved invention dossiers into structured patent draft documents or auto-generate investor-facing slide decks with TAM, milestones, and IP valuation.</p>
          </div>
          <a
            href="/dossier-workspace"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all whitespace-nowrap"
          >
            Open Workspace →
          </a>
        </section>

        {/* Next Level */}
        <section className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h3 className="text-white font-black text-xl mb-4">Ready to Build?</h3>
          <p className="text-gray-400 mb-4">
            Membership (Researcher $49 · Builder $99 · Pro $199/mo) gives you the research and tools. Pro members get everything — all courses, all build plans, all PDFs, video build guides, verified supplier sourcing, AI Patent Attorney, 25 dossier rolls/mo, commercialization roadmap, and pitch deck. The Advanced Engineering Bundle ($997) is for teams needing hands-on assembly support, component sourcing, troubleshooting protocols, and measurement validation.
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
                a: "Researcher ($49/mo): core archive access. Builder ($99/mo): adds patent analyses, engineering docs, expert support, and $49 à la carte pricing. Pro ($199/mo): everything in Builder PLUS all courses & build plans unlocked, all PDFs, video build guides, verified supplier sourcing, AI Patent Attorney drafting tool, 25 Invention Dossier IP generator rolls/mo, commercialization roadmap with BOM, bring-to-market pitch deck, and free PDF/video exports ($50 value each)."
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