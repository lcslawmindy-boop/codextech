import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap, Brain, FileText, FlaskConical, BookOpen, Shield, Users, BarChart2,
  ArrowRight, CheckCircle2, Star, Globe, Lock, ChevronRight, DollarSign,
  Sparkles, Target, TrendingUp, Activity, Code, ShoppingCart
} from "lucide-react";

const PLATFORM_STATS = [
  { label: "Invention Build Plans", value: "23", color: "#22c55e" },
  { label: "AI-Powered Courses", value: "26+", color: "#3b82f6" },
  { label: "Prior Art Entries", value: "200+", color: "#f59e0b" },
  { label: "Platform Modules", value: "40+", color: "#a855f7" },
];

const FEATURES = [
  { icon: "🧠", title: "AI Invention Engine", desc: "Generate complete invention dossiers — technical specs, patent drafts, IP valuation, 5-year financials, and GTM strategy from a single prompt." },
  { icon: "📋", title: "AI Patent Drafting Wizard", desc: "7-step USPTO-compliant patent application builder with claim generation, novelty scoring, prior art analysis, and PDF export." },
  { icon: "⚖️", title: "FTO Analysis Tool", desc: "Freedom-to-Operate reports that replace $5K–$15K attorney engagements. AI identifies patent landscape blockers instantly." },
  { icon: "🔬", title: "23 Device Build Plans", desc: "Step-by-step hardware blueprints for scalar EM, vacuum energy, and bioelectromagnetic devices with full Bill of Materials." },
  { icon: "📚", title: "26-Course Library", desc: "Structured learning from IP strategy and patent law to scalar electromagnetics and advanced device physics." },
  { icon: "🏛️", title: "Virtual Data Room (VDR)", desc: "NDA-gated secure document sharing with buyer analytics, access control, and audit logs for IP transactions." },
  { icon: "💼", title: "Investor CRM & Pitch Builder", desc: "Full investor pipeline, VC deck builder, outreach tracking, meeting scheduler, and AI-generated investor emails." },
  { icon: "🤝", title: "Inventor Marketplace", desc: "List inventions for sale globally. Buyers find, negotiate, and close deals. ZARP takes 5% commission on transactions." },
  { icon: "🌐", title: "Co-Inventor Matching", desc: "AI-matched introductions to engineering partners, collaborators, and co-inventors — AngelList for inventors." },
  { icon: "📊", title: "IP Portfolio Health", desc: "Track coverage gaps, expiration risks, and commercialization readiness across your entire IP portfolio." },
  { icon: "🛰️", title: "Patent Intelligence Monitor", desc: "Real-time alerts on competitor patent filings, new prior art, and regulatory changes in your technology domains." },
  { icon: "💰", title: "IP Valuation API", desc: "Programmatic IP valuation for VCs, law firms, and corporate R&D. $0.50–$2.00/call. Scales to millions in ARR." },
];

const TIERS = [
  { name: "Researcher", price: "$97/mo", color: "#6366f1", badge: "MOST POPULAR", desc: "Full AI platform + 50% off all build plans", highlight: true },
  { name: "Pro Billionaires Club", price: "$247/mo", color: "#22c55e", desc: "Everything + VDR, Acquisition CRM, IP Portfolio" },
  { name: "Inventor Marketplace", price: "$197/mo", color: "#ec4899", desc: "List & sell IP globally. ZARP takes 5% on deals." },
  { name: "Invention Forge Dossier", price: "$99 one-time", color: "#f59e0b", desc: "One complete AI invention dossier package" },
];

const TESTIMONIALS = [
  { quote: "The patent drafting tool alone saves me $8,000 per application. I've filed 3 provisionals in the last month.", name: "Independent Inventor", role: "Bioelectromagnetics Researcher" },
  { quote: "Finally a platform that treats scalar EM research seriously. The prior art archive is unlike anything else available.", name: "R&D Engineer", role: "Defense Technology" },
  { quote: "I used the Inventor Forge to generate a full dossier in 20 minutes. The IP valuation alone was worth the subscription.", name: "Serial Inventor", role: "Energy Technology" },
];

export default function PublicPreview() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-gray-800 bg-gray-950/95 backdrop-blur-sm px-5 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Zap size={14} className="text-black" />
            </div>
            <span className="font-black text-base tracking-tight">ZARP</span>
            <span className="hidden md:block text-gray-600 text-xs ml-2">Zenith Apex Research Portfolio</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/beta-apply" className="text-gray-400 hover:text-white text-sm font-semibold transition-colors hidden md:block">Apply for Access</Link>
            <Link to="/pricing" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-black transition-all">
              Get Started <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800 px-5 py-24">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(14,165,233,0.12) 0%, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-black mb-6 uppercase tracking-widest">
            <Sparkles size={11} /> The AI Operating System for Invention & IP
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-[1.05] mb-5">
            Build, Patent &amp; Sell<br />
            <span className="text-cyan-400">Your Inventions</span> with AI
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            ZARP is the first end-to-end platform for inventors — from AI-generated invention dossiers and patent drafts to an IP marketplace with global buyers. Everything a millionaire or billionaire inventor needs in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link to="/beta-apply"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-green-400 hover:opacity-90 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.4)] w-full sm:w-auto justify-center">
              <Zap size={16} /> Apply for Access
            </Link>
            <Link to="/pricing"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base border border-gray-700 text-gray-300 hover:border-gray-500 transition-all w-full sm:w-auto justify-center">
              View Pricing <ChevronRight size={14} />
            </Link>
          </div>
          <p className="text-gray-600 text-xs">🔒 NDA-gated platform · Stripe-secured payments · Cancel anytime</p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-800 px-5 py-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {PLATFORM_STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="font-black text-3xl mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-5 py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-white font-black text-3xl mb-3">40+ Tools. One Platform.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything from AI patent drafting to secure IP transactions — built for serious inventors and IP professionals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
                <span className="text-2xl block mb-3">{f.icon}</span>
                <h3 className="text-white font-black text-sm mb-2">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value comparison */}
      <section className="px-5 py-16 bg-gray-900/30 border-b border-gray-800">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-white font-black text-3xl mb-3">$97/mo vs. $30,000+/yr</h2>
            <p className="text-gray-500">What ZARP replaces — and what it costs outside the platform.</p>
          </div>
          <div className="bg-gray-900 border border-cyan-900/50 rounded-2xl overflow-hidden">
            {[
              { label: "AI Invention Generation (unlimited)", outside: "$5,000+ / invention" },
              { label: "Patent Drafting (USPTO-compliant)", outside: "$3,000–$15,000 / application" },
              { label: "FTO Analysis Reports", outside: "$5,000–$15,000 / report" },
              { label: "23 Device Build Plans (PDF)", outside: "$500–$2,000 each" },
              { label: "26-Course Library", outside: "$200–$500 / course" },
              { label: "Prior Art Search", outside: "$500+ / search" },
              { label: "IP Portfolio Management", outside: "$1,000+/mo (law firm)" },
              { label: "Investor Pitch Deck Builder", outside: "$2,000–$10,000 / deck" },
            ].map((row, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3 ${i % 2 === 0 ? "bg-gray-800/30" : ""}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-green-400 flex-shrink-0" />
                  <span className="text-gray-200 text-sm">{row.label}</span>
                </div>
                <span className="text-red-400 text-xs font-semibold line-through opacity-70">{row.outside}</span>
              </div>
            ))}
            <div className="px-5 py-4 bg-cyan-950/30 flex items-center justify-between border-t border-cyan-900/40">
              <span className="text-white font-black">All of the above — unlimited</span>
              <span className="text-cyan-400 font-black text-lg">$97/mo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-5 py-16 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-white font-black text-3xl mb-3">Simple, Transparent Pricing</h2>
            <p className="text-gray-500">Start with a 24-hour explorer pass. Upgrade anytime.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t, i) => (
              <div key={i} className={`bg-gray-900 rounded-2xl border p-5 flex flex-col ${t.highlight ? "border-indigo-600 shadow-xl shadow-indigo-900/20" : "border-gray-800"}`}>
                {t.badge && <div className="text-xs font-black text-center mb-3 py-1 rounded-lg" style={{ backgroundColor: t.color + "25", color: t.color }}>{t.badge}</div>}
                <h3 className="text-white font-black text-base mb-1">{t.name}</h3>
                <p className="font-black text-xl mb-2" style={{ color: t.color }}>{t.price}</p>
                <p className="text-gray-500 text-xs mb-5 leading-relaxed flex-1">{t.desc}</p>
                <Link to="/pricing"
                  className="w-full py-2.5 rounded-xl text-white text-xs font-black text-center transition-all"
                  style={{ backgroundColor: t.color }}>
                  Get Started →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 py-16 bg-gray-900/30 border-b border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-white font-black text-2xl text-center mb-8">What Inventors Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-white font-bold text-xs">{t.name}</p>
                  <p className="text-gray-600 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-white font-black text-4xl mb-4">
            Ready to Build Your<br /><span className="text-cyan-400">IP Empire?</span>
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Join researchers, independent inventors, and IP professionals using ZARP to create, protect, and monetize breakthrough inventions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/beta-apply"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base text-black bg-gradient-to-r from-cyan-400 to-green-400 hover:opacity-90 transition-all shadow-[0_4px_24px_rgba(14,165,233,0.3)]">
              <Zap size={16} /> Apply for Access
            </Link>
            <Link to="/pricing"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-base border border-gray-700 text-gray-300 hover:border-gray-500 transition-all">
              View All Plans
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">🔒 NDA-protected · Stripe-secured · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-5 py-8 bg-gray-900/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center">
              <Zap size={12} className="text-black" />
            </div>
            <span className="font-black text-sm">ZARP — Zenith Apex Research Portfolio</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-gray-300 transition-colors">Refund Policy</Link>
            <Link to="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
            <Link to="/beta-apply" className="hover:text-gray-300 transition-colors">Apply</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2026 Zenith Apex LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}