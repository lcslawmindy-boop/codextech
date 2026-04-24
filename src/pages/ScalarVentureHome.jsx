import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, Star, Zap, Shield, TrendingUp, Users } from "lucide-react";
import LeadMagnetPopup, { useLeadMagnetTrigger } from "@/components/LeadMagnetPopup";

const PREVIEW_BUILDS = [
  { title: "MEG Free Energy Device", category: "Energy", cost: "$287", locked: true, emoji: "⚡" },
  { title: "Scalar EM Transmitter", category: "Communications", cost: "$512", locked: true, emoji: "📡" },
  { title: "Biofield Resonance Chamber", category: "Bio-Signal", cost: "$1,200", locked: true, emoji: "🧬" },
  { title: "Quantum Potential Extractor", category: "Energy", cost: "$1,800", locked: true, emoji: "🌀" },
];

const VALUE_STACK = [
  { icon: "📋", label: "40+ Complete Build Plans", sub: "Full BOMs, schematics, step-by-step" },
  { icon: "💰", label: "$50K+ in Component Value", sub: "Pre-sourced and verified suppliers" },
  { icon: "🎓", label: "40+ Engineering Courses", sub: "From fundamentals to prototyping" },
  { icon: "🛡️", label: "AI Patent Drafting Suite", sub: "USPTO-ready provisionals in minutes" },
  { icon: "🧠", label: "200+ Prior Art Entries", sub: "Suppressed tech & patent graveyard" },
  { icon: "👥", label: "Investor Network Access", sub: "Connect with capital-ready partners" },
];

const FEATURES = [
  { title: "Complete Build Systems", desc: "Not partial guides. Full BOM, schematics, supplier links, and video assembly for each device." },
  { title: "Source-Documented", desc: "Every claim traces back to patents, peer-reviewed papers, or declassified documents. No speculation." },
  { title: "Execution-Ready", desc: "Part numbers. Exact quantities. Supplier recommendations. Build something in 8–72 hours." },
  { title: "Weekly Updates", desc: "New builds added monthly. Prior art scans weekly. Capital alerts real-time." },
];

export default function ScalarVentureHome() {
  const { show, trigger, dismiss } = useLeadMagnetTrigger({
    timeDelay: 40000,
    scrollPct: 50,
    exitIntent: true,
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {show && <LeadMagnetPopup trigger={trigger} magnetId="meg_blueprint" onDismiss={dismiss} />}

      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-gray-950/95 backdrop-blur">
        <div className="flex items-center gap-2 font-black text-xl">
          <Zap size={18} className="text-cyan-400" />
          Scalar Venture Vault
        </div>
        <div className="flex items-center gap-4">
          <Link to="/vault" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Vault</Link>
          <Link to="/pricing" className="text-sm px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold transition-colors">
            View Plans
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Zap size={12} /> Complete Build Systems for Advanced Engineering
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-6">
          40 Documented<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Engineering Systems
          </span><br />
          Peer-Reviewed & Source-Linked
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
          Complete build frameworks with verified patents, peer-reviewed publications, and suppressed research declassified. Every build includes full BOMs, schematics, supplier sourcing, and video assembly.
        </p>

        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-10">
          For makers, engineers, researchers, and institutions. Free vault access. Premium on execution tools, community, and advanced builds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/vault" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
            Browse Free Vault <ArrowRight size={18} />
          </Link>
          <Link to="/institutional-licensing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all">
            Universities & Teams
          </Link>
        </div>

        <p className="text-xs text-gray-600">
          ✓ Free vault access · Stripe · Optional premium tier · No credit card required
        </p>
      </section>

      {/* ── Preview cards ── */}
      <section id="preview" className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black mb-4 text-center">40 Complete Build Systems</h2>
        <p className="text-gray-500 text-center mb-10 text-sm max-w-xl mx-auto">
          Browse all 40+ builds free. Download BOMs, schematics, and assembly guides instantly. Premium: video assembly + sourcing + community.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {PREVIEW_BUILDS.map((build, i) => (
            <Link key={i} to={`/build/${build.id || i + 1}`}
              className="group relative bg-gray-900 border border-gray-800 hover:border-cyan-700 rounded-xl overflow-hidden transition-all">
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-4xl relative">
                {build.emoji}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <p className="text-xs text-cyan-400 font-bold mb-1">{build.category}</p>
                <h3 className="text-white font-bold text-sm leading-snug mb-2">{build.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-mono">{build.cost}</span>
                  <span className="text-green-400 text-xs font-bold">View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link to="/vault" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm">
            Browse all 40+ builds →
          </Link>
        </div>
      </section>

      {/* ── Value stack ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">What You Get</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {VALUE_STACK.map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <p className="text-white font-bold text-sm mb-1">{item.label}</p>
                <p className="text-gray-500 text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center">Why Scalar Venture Vault</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing tiers ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black mb-4">Vault Access + Optional Tiers</h2>
          <p className="text-gray-400">Free vault forever. Premium features for serious builders.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          {[
            { name: "Free", price: "Vault Access", builds: "All 40+ builds, BOMs, schematics", highlight: false },
            { name: "Pro", price: "$99/mo", builds: "Video assembly + sourcing + community", highlight: true },
            { name: "Enterprise", price: "Custom", builds: "University/team licensing, API access", highlight: false },
          ].map((tier, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 transition-all ${
                tier.highlight
                  ? "bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600 relative"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-600 text-white text-xs font-black">
                  POPULAR
                </div>
              )}
              <h3 className="text-white font-black text-lg mb-1">{tier.name}</h3>
              <div className="text-2xl font-black text-cyan-400 mb-2">{tier.price}</div>
              <p className="text-gray-400 text-sm mb-4">{tier.builds}</p>
              <Link to={tier.name === "Enterprise" ? "/institutional-licensing" : "/pricing"} className={`block py-2 rounded-lg font-bold text-sm transition-all ${
                tier.highlight
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                  : "border border-gray-700 text-gray-300 hover:bg-gray-800"
              }`}>
                {tier.name === "Enterprise" ? "Contact Sales" : "Learn More"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-black mb-8">From the Community</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { quote: "The BOM is exact. Part numbers, quantities, suppliers. This is engineering documentation, not YouTube.", author: "R.K.", role: "Electrical Engineer" },
            { quote: "My attorney reviewed my provisional patent. She said it was the most complete pre-draft she'd ever received.", author: "A.S.", role: "Independent Inventor" },
            { quote: "Finally — a structured curriculum to actually BUILD from Bearden's work, not just read it.", author: "M.T.", role: "Researcher, 20 yrs" },
          ].map((test, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm italic mb-3">"{test.quote}"</p>
              <p className="text-white font-bold text-sm">{test.author}</p>
              <p className="text-gray-500 text-xs">{test.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-16 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Free Vault. Premium Optional.</h2>
          <p className="text-gray-400 mb-8">Browse 40 documented builds. Download BOMs today. Upgrade for video, community, and sourcing when you're ready to build.</p>
          <Link to="/vault" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
            Browse Builds Now <ArrowRight size={18} />
          </Link>
          <p className="text-xs text-gray-600 mt-4">Free forever. No login required. No email to browse.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Scalar Venture Vault · Advanced Engineering Systems Platform · Educational & Research Purposes Only</p>
        <div className="flex justify-center gap-4 mt-3 text-gray-600">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link to="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
      </footer>
    </div>
  );
}