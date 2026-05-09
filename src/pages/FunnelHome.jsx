import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Zap, BookOpen, Wrench, Scale, Lightbulb, Star, Play, Shield, Database, Check, Users, Lock, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";

// ── Countdown ──────────────────────────────────────────────────────────────────
const DEADLINE_KEY = "zarp_founding_deadline";
function getDeadline() {
  let d = localStorage.getItem(DEADLINE_KEY);
  if (!d) { d = (Date.now() + 48 * 3600 * 1000).toString(); localStorage.setItem(DEADLINE_KEY, d); }
  return parseInt(d);
}
function useCountdown() {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    const dl = getDeadline();
    const tick = () => setLeft(Math.max(0, dl - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const h = Math.floor(left / 3600000), m = Math.floor((left % 3600000) / 60000), s = Math.floor((left % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

const FUNNEL_STEPS = [
  {
    step: 1,
    icon: <Database size={22} className="text-cyan-400" />,
    label: "Free Research Database",
    sublabel: "Start here — no account needed",
    color: "cyan",
    desc: "Explore the Bearden concept graph: 100+ nodes of scalar EM, vacuum energy & bioelectromagnetics — all sourced from peer-reviewed journals, US patents, and declassified government docs.",
    links: [
      { label: "Concept Graph", to: "/" },
      { label: "Prior Art Archive", to: "/prior-art" },
      { label: "Free Vault", to: "/free-vault" },
    ],
    badge: "FREE",
  },
  {
    step: 2,
    icon: <BookOpen size={22} className="text-purple-400" />,
    label: "Courses & Build Plans",
    sublabel: "Structured learning + hands-on builds",
    color: "purple",
    desc: "40+ structured courses (scalar EM → bioelectromagnetics → free energy) plus 40+ complete device build plans with BOM, schematics, step-by-step assembly guides, and build videos.",
    links: [
      { label: "Course Catalogue", to: "/course-catalogue" },
      { label: "Device Build Plans", to: "/device-catalogue" },
      { label: "Build Videos", to: "/invention-plans" },
    ],
    badge: "MEMBER",
  },
  {
    step: 3,
    icon: <Scale size={22} className="text-indigo-400" />,
    label: "Patent & IP Suite",
    sublabel: "Attorney-grade tools, AI-powered",
    color: "indigo",
    desc: "AI patent attorney chat, novelty analysis, competitive landscape, USPTO-formatted patent drafting wizard, prior art cross-reference, and automated patent threat monitoring.",
    links: [
      { label: "Patent Hub", to: "/patent-hub" },
      { label: "Patent Drafting Wizard", to: "/patent-drafting-wizard" },
      { label: "Patent Monitoring", to: "/monitoring" },
    ],
    badge: "MEMBER",
  },
  {
    step: 4,
    icon: <Zap size={22} className="text-yellow-400" />,
    label: "Invention Forge",
    sublabel: "Mix technologies → create new IP",
    color: "yellow",
    desc: "Select 2–4 device technologies, forge a new hybrid invention concept using AI, and receive patent claims, IP valuation ($M range), and a full 5-year commercialization roadmap.",
    links: [
      { label: "Invention Forge", to: "/invention-forge" },
      { label: "IP Portfolio", to: "/ip-portfolio-health" },
      { label: "Hybrid Portfolio", to: "/hybrid-portfolio" },
    ],
    badge: "MEMBER",
  },
];

const PLANS = [
  {
    id: "free",
    name: "Free Explorer",
    price: 0,
    period: "",
    color: "#06b6d4",
    badge: null,
    desc: "Explore the research database, no payment required.",
    features: [
      "Bearden concept graph (100+ nodes)",
      "1 complete device build plan",
      "Sample prior art archive",
      "EM lab simulator (limited)",
      "Patent intelligence preview",
    ],
    locked: [
      "40+ full build plans",
      "40+ courses",
      "AI Patent Attorney",
      "Patent Drafting Wizard",
      "Invention Forge",
    ],
    cta: "Browse Free Vault",
    ctaLink: "/free-vault",
    isCheckout: false,
  },
  {
    id: "researcher",
    name: "Researcher",
    price: 97,
    period: "/mo",
    color: "#8b5cf6",
    badge: "POPULAR",
    desc: "Full course library + prior art archive + patent intelligence tools.",
    features: [
      "All 40+ structured courses",
      "Full prior art archive (76+ entries)",
      "AI Patent Intelligence suite",
      "Patent Attorney chat (Claude Sonnet)",
      "Competitive landscape analysis",
      "EM lab & scalar wave simulators",
      "Community forum access",
      "Cancel anytime",
    ],
    locked: [
      "40+ device build plans",
      "Invention Forge",
      "Patent Drafting Wizard",
    ],
    cta: "Start Research — $97/mo",
    priceInCents: 9700,
    isCheckout: true,
  },
  {
    id: "builder",
    name: "Builder",
    price: 199,
    period: "/mo",
    color: "#f59e0b",
    badge: "BEST VALUE",
    desc: "Everything in Researcher + all build plans, build videos & patent drafting.",
    features: [
      "Everything in Researcher",
      "All 40+ device build plans",
      "Full BOM, schematics & sourcing links",
      "Step-by-step build videos",
      "Patent Drafting Wizard (full)",
      "Patent threat monitoring",
      "Invention Forge (unlimited)",
      "IP valuation reports",
      "Priority support",
    ],
    locked: [],
    cta: "Start Building — $199/mo",
    priceInCents: 19900,
    isCheckout: true,
    highlight: true,
  },
  {
    id: "enterprise",
    name: "IP Enterprise",
    price: 497,
    period: "/mo",
    color: "#22c55e",
    badge: "TEAMS",
    desc: "Full platform + institutional licensing + investor package access.",
    features: [
      "Everything in Builder",
      "Institutional licensing framework",
      "Investor package & VDR access",
      "Co-inventor matching",
      "SBIR/STTR pipeline tools",
      "White-label SaaS option",
      "Dedicated research consultation",
      "Up to 5 team seats",
    ],
    locked: [],
    cta: "Contact for Enterprise",
    ctaLink: "/licensing",
    isCheckout: false,
  },
];

function PlanCard({ plan, isAnnual }) {
  const [loading, setLoading] = useState(false);
  const displayPrice = isAnnual ? Math.round(plan.price * 0.8) : plan.price;
  const annualSave = isAnnual && plan.price > 0;

  const handleCheckout = async () => {
    if (!plan.isCheckout) return;
    if (window.self !== window.top) {
      alert("Checkout only works from the published app, not inside the editor.");
      return;
    }
    setLoading(true);
    try {
      const priceInCents = isAnnual
        ? Math.round(plan.priceInCents * 0.8 * 12)
        : plan.priceInCents;
      const origin = window.location.origin;
      const res = await base44.functions.invoke("createCheckoutSession", {
        title: `C.O.D.E.X.T.E.C.H. ${plan.name} Membership`,
        priceInCents,
        description: plan.desc,
        category: "membership",
        successUrl: `${origin}/member-dashboard`,
        cancelUrl: `${origin}/pricing`,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all ${
      plan.highlight ? "border-2 shadow-2xl scale-[1.02]" : "border"
    }`}
      style={{
        borderColor: plan.highlight ? plan.color : "#1f2937",
        boxShadow: plan.highlight ? `0 0 40px ${plan.color}30` : undefined,
      }}>
      {plan.badge && (
        <div className="py-2 text-center text-xs font-black tracking-widest text-white"
          style={{ backgroundColor: plan.color }}>
          {plan.badge}
        </div>
      )}
      <div className="p-6 bg-gray-900 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">{plan.desc}</p>
        <div className="flex items-end gap-1 mb-1">
          {plan.price === 0 ? (
            <span className="text-5xl font-black text-white">Free</span>
          ) : (
            <>
              <span className="text-5xl font-black" style={{ color: plan.color }}>${displayPrice}</span>
              <span className="text-gray-500 mb-2">{plan.period}</span>
            </>
          )}
        </div>
        {annualSave && <p className="text-green-400 text-xs font-bold mb-1">Save 20% — billed annually</p>}
        <p className="text-gray-600 text-xs mb-6">
          {plan.price === 0 ? "No credit card" : isAnnual ? `$${displayPrice * 12}/year` : "Monthly billing"}
        </p>

        {plan.isCheckout ? (
          <button onClick={handleCheckout} disabled={loading}
            className="w-full py-3 rounded-xl font-black text-white text-sm transition-all hover:opacity-90 mb-6"
            style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}99)` }}>
            {loading ? "Processing..." : plan.cta}
          </button>
        ) : (
          <Link to={plan.ctaLink || "/free-vault"}
            className="flex items-center justify-center w-full py-3 rounded-xl font-black text-white text-sm transition-all mb-6 border-2"
            style={{ borderColor: plan.color, color: plan.color }}>
            {plan.cta}
          </Link>
        )}

        <div className="space-y-2 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              {f}
            </div>
          ))}
          {plan.locked.length > 0 && (
            <>
              <div className="border-t border-gray-800 my-3" />
              {plan.locked.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600 opacity-50">
                  <Lock size={12} className="flex-shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FunnelHome() {
  const countdown = useCountdown();
  const [isAnnual, setIsAnnual] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({ email: email.toLowerCase().trim(), source: "funnel_home", status: "active" });
    setSubscribed(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b border-red-800 px-4 py-2 flex flex-wrap items-center justify-center gap-2 text-sm">
        <Flame size={13} className="text-orange-300 animate-pulse flex-shrink-0" />
        <span className="text-orange-100 font-semibold">Founding rate expires in</span>
        <span className="font-black text-white bg-black/40 px-3 py-0.5 rounded-lg font-mono tracking-widest">{countdown}</span>
        <span className="text-orange-200 text-xs hidden sm:inline">— price increases after 1,000 members</span>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="" className="h-9 w-9 object-contain" />
          <div>
            <span className="text-white font-black text-base tracking-tight">C.O.D.E.X.T.E.C.H.</span>
            <span className="text-gray-600 text-xs ml-2 hidden sm:inline">Research Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/free-vault" className="text-gray-400 hover:text-white text-xs font-semibold px-3 py-2 transition-colors">Free Vault</Link>
          <Link to="/pricing" className="px-4 py-2 rounded-xl text-xs font-black text-white transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}>
            Join Now
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative px-6 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-900/10 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-bold mb-6 uppercase tracking-wider">
            <Star size={11} className="text-yellow-400" /> Peer-Reviewed · Patent-Sourced · Build-Ready
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
            From<br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
              Research to Patent
            </span><br />
            to Market
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            The world's first platform that takes you from the Bearden scalar EM research database through structured courses, hands-on device builds, AI patent tools, and an invention forge — all the way to IP you own.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <Link to="/free-vault"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-cyan-700 text-cyan-300 hover:bg-cyan-900/20 font-black text-base transition-all">
              <Database size={16} /> Explore Free Database
            </Link>
            <a href="#pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-base transition-all shadow-lg"
              style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 6px 28px rgba(139,92,246,0.4)" }}>
              View Membership Plans <ArrowRight size={16} />
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green-400" /> 100+ research nodes</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green-400" /> 40+ device build plans</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green-400" /> AI patent attorney</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-green-400" /> Invention Forge</span>
          </div>
        </div>
        {/* Scroll arrow */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-gray-700">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* FUNNEL STEPS */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">The Full Journey</p>
          <h2 className="text-3xl font-black text-white">From Graph Node to Patent-Protected IP</h2>
        </div>

        <div className="space-y-5">
          {FUNNEL_STEPS.map((step, i) => {
            const colorMap = {
              cyan: { border: "border-cyan-800/50", bg: "bg-cyan-950/10", badge: "bg-cyan-900/50 text-cyan-300 border-cyan-700", num: "bg-cyan-900 text-cyan-300 border-cyan-700" },
              purple: { border: "border-purple-800/50", bg: "bg-purple-950/10", badge: "bg-purple-900/50 text-purple-300 border-purple-700", num: "bg-purple-900 text-purple-300 border-purple-700" },
              indigo: { border: "border-indigo-800/50", bg: "bg-indigo-950/10", badge: "bg-indigo-900/50 text-indigo-300 border-indigo-700", num: "bg-indigo-900 text-indigo-300 border-indigo-700" },
              yellow: { border: "border-yellow-800/50", bg: "bg-yellow-950/10", badge: "bg-yellow-900/50 text-yellow-300 border-yellow-700", num: "bg-yellow-900 text-yellow-300 border-yellow-700" },
            }[step.color];

            return (
              <div key={i} className={`border rounded-2xl p-6 flex flex-col md:flex-row gap-5 ${colorMap.border} ${colorMap.bg}`}>
                {/* Left */}
                <div className="flex-shrink-0 flex items-start gap-4 md:w-72">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-black flex-shrink-0 ${colorMap.num}`}>
                    {step.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {step.icon}
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-black ${colorMap.badge}`}>{step.badge}</span>
                    </div>
                    <h3 className="text-white font-black text-lg leading-tight">{step.label}</h3>
                    <p className="text-gray-500 text-xs">{step.sublabel}</p>
                  </div>
                </div>

                {/* Middle */}
                <div className="flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.links.map((l, j) => (
                      <Link key={j} to={l.to}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-all hover:border-gray-500">
                        {l.label} <ArrowRight size={11} />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right arrow */}
                {i < FUNNEL_STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-8 flex-shrink-0">
                    <div className="w-px h-full bg-gray-700 relative">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-gray-600">▼</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SOCIAL PROOF / STATS */}
      <section className="border-y border-gray-800 bg-gray-900/40 py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: "100+", label: "Research Nodes", sub: "Peer-reviewed & patent-sourced" },
            { val: "40+", label: "Device Build Plans", sub: "Full BOM & assembly guides" },
            { val: "40+", label: "Structured Courses", sub: "Scalar EM to IP strategy" },
            { val: "5", label: "AI Patent Tools", sub: "Attorney-grade, Claude Sonnet" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-black text-white mb-1">{s.val}</div>
              <div className="text-gray-300 font-bold text-sm mb-0.5">{s.label}</div>
              <div className="text-gray-600 text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S IN THE VAULT */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black mb-3">Everything Inside the Platform</h2>
          <p className="text-gray-500 text-sm">A complete research-to-commercialization stack</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: "🕸️", title: "Bearden Concept Graph", desc: "100+ interconnected research nodes sourced from primary patents, peer-reviewed papers, and declassified docs", free: true },
            { icon: "📚", title: "Prior Art Archive", desc: "76+ documented inventions with rejection risk scores, claim analysis, and differentiation strategies", free: true },
            { icon: "🧪", title: "Scalar EM Simulators", desc: "Interactive scalar wave, scalar field, and EM lab simulations", free: true },
            { icon: "🎓", title: "40+ Structured Courses", desc: "Scalar EM fundamentals, bioelectromagnetics, vacuum energy, free energy engineering, patent strategy", free: false },
            { icon: "🔧", title: "40+ Device Build Plans", desc: "Full BOM, schematics, supplier links, step-by-step assembly, and build videos for every device", free: false },
            { icon: "🎬", title: "Build Videos", desc: "3–12 hour step-by-step build video series for complex devices", free: false },
            { icon: "⚖️", title: "AI Patent Attorney", desc: "Claude Sonnet-powered chat for claim drafting, FTO, prosecution strategy, and filing advice", free: false },
            { icon: "📝", title: "Patent Drafting Wizard", desc: "Full USPTO-formatted application: title, abstract, claims, description, drawings — real-time validation", free: false },
            { icon: "🛡️", title: "Patent Threat Monitor", desc: "Automated scanning for competitor filings, legal challenges, and suppression patterns", free: false },
            { icon: "⚡", title: "Invention Forge", desc: "Mix 2–4 technologies → AI generates new hybrid IP with patent claims, valuation, and commercialization roadmap", free: false },
            { icon: "💰", title: "IP Valuation", desc: "AI-powered IP valuation estimates with market sizing and bring-to-market roadmap", free: false },
            { icon: "🤝", title: "Investor & VDR Tools", desc: "Investor CRM, Virtual Data Room, acquisition pitch deck, and co-inventor matching", free: false },
          ].map((item, i) => (
            <div key={i} className={`bg-gray-900 border rounded-xl p-4 flex gap-3 ${item.free ? "border-gray-700" : "border-gray-800"}`}>
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  {item.free && <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-900/50 border border-cyan-800 text-cyan-400 font-bold">FREE</span>}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-20 bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-950/50 border border-yellow-800/60 text-yellow-300 text-xs font-bold mb-4 uppercase tracking-wider">
              <Flame size={11} className="animate-pulse" /> Founding Rate · {countdown} remaining
            </div>
            <h2 className="text-4xl font-black mb-3">Choose Your Access Level</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">Start free. Upgrade when you're ready to build, patent, and commercialize.</p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className={`text-sm font-semibold ${!isAnnual ? "text-white" : "text-gray-500"}`}>Monthly</span>
              <button onClick={() => setIsAnnual(a => !a)}
                className={`w-12 h-6 rounded-full relative transition-colors ${isAnnual ? "bg-purple-600" : "bg-gray-700"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnnual ? "translate-x-7" : "translate-x-1"}`} />
              </button>
              <span className={`text-sm font-semibold ${isAnnual ? "text-white" : "text-gray-500"}`}>Annual <span className="text-green-400 font-black">— Save 20%</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            {PLANS.map((plan, i) => <PlanCard key={i} plan={plan} isAnnual={isAnnual} />)}
          </div>

          <p className="text-center text-gray-600 text-xs mt-8">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className="px-6 py-16 max-w-2xl mx-auto text-center">
        <h3 className="text-2xl font-black mb-2">Not Ready Yet?</h3>
        <p className="text-gray-400 text-sm mb-6">Get a free course module + weekly research breakdowns — no credit card.</p>
        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
            <Check size={18} /> You're in — check your inbox!
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500" />
            <button onClick={handleSubscribe}
              className="px-5 py-3 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm whitespace-nowrap transition-all">
              Get Free Preview
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-xs">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="" className="h-6 w-6 object-contain" />
          <span className="text-gray-500 font-bold">C.O.D.E.X.T.E.C.H. · Zenith Apex LLC</span>
        </div>
        <p className="mb-3">All content is for research and educational purposes only. Not legal or medical advice.</p>
        <div className="flex justify-center gap-6">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/free-vault" className="hover:text-gray-400">Free Vault</Link>
          <Link to="/research-disclaimer" className="hover:text-gray-400">Research Disclaimer</Link>
        </div>
      </footer>
    </div>
  );
}