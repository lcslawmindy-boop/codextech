import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Star, Zap, Lock, Microscope, Wrench, FileText, Users, TrendingUp, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const FEATURES = [
  { icon: Microscope, title: "Research Intelligence", desc: "Searchable technical archive with engineering intelligence." },
  { icon: Zap, title: "AI Invention Tools", desc: "Patent drafting, prior art analysis, and commercialization strategy." },
  { icon: Wrench, title: "Build Plan Library", desc: "Prototype systems with BOMs, schematics, and engineering guides." },
  { icon: FileText, title: "Premium Courses", desc: "Structured educational systems and invention frameworks." },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    description: "Explore the platform",
    features: ["Limited research access", "Newsletter signup", "Product previews"],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 49,
    period: "month",
    description: "For active inventors",
    features: ["Full research vault access", "AI tools & patent suite", "40+ build plans", "Premium course library", "Member community", "Monthly new releases"],
    cta: "Start Pro Membership",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: null,
    description: "For serious builders",
    features: ["Everything in Pro", "Commercialization consulting", "Investor preparation", "Custom research", "Licensing support", "Priority support"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const STATS = [
  { label: "Research Entries", value: "200+" },
  { label: "Build Plans", value: "40+" },
  { label: "Courses", value: "40+" },
  { label: "Active Members", value: "1,000+" },
];

const TRUST_ITEMS = [
  { title: "Patent-Sourced", desc: "All research derived from granted patents and peer-reviewed publications." },
  { title: "Engineering-First", desc: "Built by engineers for engineers. No speculation, just technical depth." },
  { title: "Investor-Grade", desc: "Professional tools and documentation suitable for venture capital and licensing." },
  { title: "Prototype-Ready", desc: "Every build plan includes verified component sourcing and assembly guides." },
];

export default function CodexTechPremium() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleNewsletterSignup = async () => {
    if (!email) return;
    try {
      await base44.entities.NewsletterSubscriber.create({
        email,
        source: "homepage_hero",
        status: "active",
      });
      setEmailSent(true);
      setTimeout(() => { setEmail(""); setEmailSent(false); }, 2000);
    } catch (err) {
      console.error("Newsletter signup error:", err);
    }
  };

  const handleCheckout = async (tierName) => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: `CodexTech — ${tierName} Membership`,
      priceInCents: tierName === "Pro" ? 4900 : 0,
      description: `${tierName} tier membership — recurring monthly billing.`,
      category: "membership",
      successUrl: `${window.location.origin}/member-dashboard`,
      cancelUrl: `${window.location.origin}/pricing`,
    });
    if (res.data?.url) window.location.href = res.data.url;
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dcd83ec8f_a6e3bd669_logo.png" alt="CodexTech" className="w-8 h-8" />
              <span className="font-black text-white">CodexTech</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <Link to="/" className="text-slate-300 hover:text-white transition">Research</Link>
              <Link to="/" className="text-slate-300 hover:text-white transition">Courses</Link>
              <Link to="/" className="text-slate-300 hover:text-white transition">Build Plans</Link>
              <Link to="/" className="text-slate-300 hover:text-white transition">AI Tools</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/account")} className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">Sign In</button>
            <button onClick={() => handleCheckout("Pro")} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-bold transition">Join</button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="px-6 py-24 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
              AI-Powered Research & Invention Commercialization Platform
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Research advanced engineering systems, prototype innovations, protect intellectual property, and commercialize inventions through one unified platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleCheckout("Pro")}
              className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-base transition flex items-center gap-2"
            >
              Start Membership <ArrowRight size={16} />
            </button>
            <Link
              to="/free-vault"
              className="px-8 py-3 rounded-lg border border-slate-700 hover:border-slate-600 font-bold text-base transition"
            >
              Explore Research
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 mt-8 border-t border-slate-800">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-black text-blue-400">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM */}
      <section className="px-6 py-24 border-b border-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Most inventions never reach commercialization.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Fragmented research</p>
                  <p className="text-sm text-slate-400">No centralized technical intelligence for emerging technologies.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Lack of technical guidance</p>
                  <p className="text-sm text-slate-400">Inventors build alone without structured workflows.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Weak commercialization support</p>
                  <p className="text-sm text-slate-400">No roadmap from prototype to patent to market.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Disconnected tools</p>
                  <p className="text-sm text-slate-400">Research, patents, and prototyping in separate silos.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Patent complexity</p>
                  <p className="text-sm text-slate-400">Drafting, filing, and strategy require specialized expertise.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-bold">Investor readiness gaps</p>
                  <p className="text-sm text-slate-400">Lack of professional documentation for fundraising.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SOLUTION */}
      <section className="px-6 py-24 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">One Platform For Research → Prototype → Commercialization</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
                  <Icon size={28} className="text-blue-400 mb-3" />
                  <h3 className="font-bold text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: PRODUCTS */}
      <section className="px-6 py-24 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Core Products</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/prior-art" className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-700 transition group">
              <Microscope size={32} className="text-blue-400 mb-4" />
              <h3 className="font-black text-xl mb-2">Research Vault</h3>
              <p className="text-slate-400 text-sm mb-4">Searchable database with 200+ technical entries on advanced engineering systems.</p>
              <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition">Explore <ChevronRight size={14} /></span>
            </Link>

            <Link to="/patent-hub" className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-700 transition group">
              <Zap size={32} className="text-blue-400 mb-4" />
              <h3 className="font-black text-xl mb-2">AI Patent Tools</h3>
              <p className="text-slate-400 text-sm mb-4">AI-powered patent drafting, prior art analysis, and commercialization strategy.</p>
              <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition">Access Tools <ChevronRight size={14} /></span>
            </Link>

            <Link to="/device-catalogue" className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-700 transition group">
              <Wrench size={32} className="text-blue-400 mb-4" />
              <h3 className="font-black text-xl mb-2">Build Plan Library</h3>
              <p className="text-slate-400 text-sm mb-4">40+ verified prototype systems with BOMs, schematics, and engineering guides.</p>
              <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition">Browse Plans <ChevronRight size={14} /></span>
            </Link>

            <Link to="/course-catalogue" className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-blue-700 transition group">
              <FileText size={32} className="text-blue-400 mb-4" />
              <h3 className="font-black text-xl mb-2">Premium Courses</h3>
              <p className="text-slate-400 text-sm mb-4">Structured learning paths for advanced engineering systems and invention frameworks.</p>
              <span className="text-blue-400 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition">View Courses <ChevronRight size={14} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: MEMBERSHIP PRICING */}
      <section className="px-6 py-24 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Membership Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`p-8 rounded-2xl border transition ${
                  tier.highlighted
                    ? "bg-blue-900/20 border-blue-500 ring-2 ring-blue-500/20 relative"
                    : "bg-slate-900 border-slate-800"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-black text-xl">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{tier.description}</p>
                </div>

                <div className="mb-6">
                  {tier.price !== null ? (
                    <div>
                      <span className="text-4xl font-black">${tier.price}</span>
                      {tier.period && <span className="text-slate-400 text-sm ml-2">/{tier.period}</span>}
                    </div>
                  ) : (
                    <p className="text-slate-400">Custom pricing</p>
                  )}
                </div>

                <button
                  onClick={() => handleCheckout(tier.name)}
                  className={`w-full py-2.5 rounded-lg font-bold text-sm transition mb-6 ${
                    tier.highlighted
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-white"
                  }`}
                >
                  {tier.cta}
                </button>

                <div className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Check size={16} className="text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TRUST & CREDIBILITY */}
      <section className="px-6 py-24 border-b border-slate-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Why Engineers Choose CodexTech</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
                <Star size={24} className="text-blue-400 mb-3" />
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h2 className="text-4xl font-black mb-4">Build The Future With Better Research Infrastructure.</h2>
            <p className="text-slate-400">Join 1,000+ engineers, inventors, and researchers transforming ideas into impact.</p>
          </div>
          <button
            onClick={() => handleCheckout("Pro")}
            className="inline-flex px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-black text-base transition"
          >
            Join Membership Today <ArrowRight size={18} className="ml-2" />
          </button>
          <p className="text-xs text-slate-600">🔒 Cancel anytime • No contracts • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-800 bg-black/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Product</p>
              <div className="space-y-2 text-sm">
                <Link to="/" className="text-slate-400 hover:text-white transition block">Research</Link>
                <Link to="/" className="text-slate-400 hover:text-white transition block">Courses</Link>
                <Link to="/" className="text-slate-400 hover:text-white transition block">Tools</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Company</p>
              <div className="space-y-2 text-sm">
                <Link to="/" className="text-slate-400 hover:text-white transition block">About</Link>
                <Link to="/" className="text-slate-400 hover:text-white transition block">Blog</Link>
                <Link to="/" className="text-slate-400 hover:text-white transition block">Contact</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Membership</p>
              <div className="space-y-2 text-sm">
                <Link to="/" className="text-slate-400 hover:text-white transition block">Pricing</Link>
                <Link to="/" className="text-slate-400 hover:text-white transition block">Member Portal</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Legal</p>
              <div className="space-y-2 text-sm">
                <Link to="/terms" className="text-slate-400 hover:text-white transition block">Terms</Link>
                <Link to="/refund-policy" className="text-slate-400 hover:text-white transition block">Refunds</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleNewsletterSignup}
                  className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
                >
                  {emailSent ? "✓" : "→"}
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-600">
            <p>© 2026 CodexTech Research. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}