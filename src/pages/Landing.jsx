import { Link } from "react-router-dom";
import { ArrowRight, Database, Wrench, Shield, FlaskConical, TrendingUp, CheckCircle2, Lock } from "lucide-react";
import LibraryBackground from "@/components/backgrounds/LibraryBackground";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import HeroSection from "@/components/landing/HeroSection";
import ZaraAlienMascot from "@/components/ZaraAlienMascot";

const WHAT_IS_IN = [
  {
    icon: <Database size={20} className="text-cyan-400" />,
    title: "Patent Archive",
    desc: "40+ US patents with full prosecution history, claims analysis, and engineering implications. Cross-referenced against USPTO. Every grant date, inventor, and assignee verified.",
    items: ["MEG — US 6,362,718", "Tesla Longitudinal TX — US 1,119,732", "Gray Tube — US 3,913,004", "Kromrey Generator — US 4,151,431", "36+ more"],
  },
  {
    icon: <FlaskConical size={20} className="text-green-400" />,
    title: "Engineering Build Systems",
    desc: "Complete build documentation for 6 electromagnetic systems. Not conceptual — actual BOMs with part numbers, assembly procedures, and measurement protocols.",
    items: ["Motionless Electromagnetic Generator (MEG)", "Prioré EM Resonance Chamber", "G-Com Scalar Communicator", "TRZ Scalar Potential Extractor", "TRD-1 Telomere Resonance Device", "Scalar EM Lab Starter"],
  },
  {
    icon: <Shield size={20} className="text-purple-400" />,
    title: "AI Patent Tools",
    desc: "Generate USPTO-compliant provisional patents, run prior art searches, build claims structure — in one session. No attorney required for a provisional.",
    items: ["Provisional patent generator", "Claims structure builder", "FTO analysis framework", "Prior art archive (200+ entries)"],
  },
  {
    icon: <TrendingUp size={20} className="text-orange-400" />,
    title: "IP Marketplace",
    desc: "List or invest in electromagnetic IP anonymously. Smart matching. Escrow-backed transactions. VDR for secure due diligence.",
    items: ["Anonymous inventor/investor profiles", "AI-powered deal matching", "Secure VDR document room", "5% commission on closed deals only"],
  },
];

const MODULES = [
  { title: "MEG System", category: "Free Energy", tag: "US 6,362,718", locked: false, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png", href: "/research-module?module=meg-system" },
  { title: "Prioré EM Chamber", category: "Bioelectromagnetics", tag: "FR 1,342,772", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png", href: "/research-module?module=priore-device" },
  { title: "Scalar Transmitter", category: "Scalar EM", tag: "Whittaker 1904", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png", href: "/research-module?module=scalar-transmitter" },
];

const EVIDENCE = [
  { year: "1901", name: "Nikola Tesla", claim: "Demonstrated wireless power transmission at Colorado Springs. Measured standing scalar waves propagating through ground without Hertzian radiation.", source: "Colorado Springs Notes, 1899–1900" },
  { year: "1966", name: "Antoine Prioré", claim: "Peer-reviewed tumor regression in animal models using rotating EM field device. Results published in Comptes Rendus, French Academy of Sciences.", source: "Pautrizel, Courrier et al., 1966–1977" },
  { year: "2002", name: "T.E. Bearden et al.", claim: "COP>1 demonstrated in MEG device. Peer-reviewed in Foundations of Physics Letters. US Patent 6,362,718 granted.", source: "FPL Vol.14 No.1, 2001" },
  { year: "1978", name: "Defense Intelligence Agency", claim: "Classified report documents Soviet scalar EM weapons program. Confirms theoretical and experimental basis for longitudinal wave weaponization.", source: "DIA Report DST-1810S-387-75 (declassified)" },
];

export default function Landing() {
  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.03em" }}>
      <LibraryBackground />
      <LiveActivityTicker />
      <ZaraAlienMascot />

      <div className="pt-16">
        {/* ── Hero ── */}
        <HeroSection />

        {/* ── What's inside ── */}
        <section className="px-6 py-20 border-b border-white/10 solid-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">Platform Overview</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">What's in the Database</h2>
              <p className="text-gray-400 text-base max-w-xl mx-auto">Everything is primary-source verified. Patents cross-checked against USPTO. Publications checked against journal archives. No exceptions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WHAT_IS_IN.map((section, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                  <div className="flex items-center gap-3 mb-3">
                    {section.icon}
                    <h3 className="text-white font-black text-lg">{section.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{section.desc}</p>
                  <div className="space-y-1.5">
                    {section.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-gray-300">
                        <span className="text-cyan-500 mt-0.5 flex-shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Research modules preview ── */}
        <section className="px-6 py-20 border-b border-white/10 solid-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Research Modules</p>
              <h2 className="text-3xl font-black text-white mb-3">Structured Engineering Analysis</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">Each module contains: theoretical basis, system architecture, BOM, assembly steps, measurement protocol, and source documents. The MEG module is free to preview.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {MODULES.map((mod, i) => (
                <Link key={i} to={mod.href} className="group bg-gray-900/70 border border-gray-800 hover:border-gray-600 rounded-2xl overflow-hidden transition-all backdrop-blur">
                  <div className="h-44 overflow-hidden relative">
                    <img src={mod.img} alt={mod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {mod.locked && (
                      <div className="absolute inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-900/90 border border-gray-700">
                          <Lock size={13} className="text-yellow-400" />
                          <span className="text-yellow-400 text-xs font-black">Members Only</span>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded bg-black/70 text-cyan-400 text-xs font-bold border border-cyan-900/50">{mod.tag}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-500 text-xs mb-1">{mod.category}</p>
                    <h3 className="text-white font-black text-base">{mod.title}</h3>
                    <p className="text-cyan-400 text-xs font-bold mt-2">{mod.locked ? "Unlock with membership →" : "Free to preview →"}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link to="/codextech-database" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
                View all research modules <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Evidence timeline ── */}
        <section className="px-6 py-20 border-b border-white/10 solid-section">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-3">Primary Source Record</p>
              <h2 className="text-3xl font-black text-white mb-3">The Evidence Is in the Record</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">Every claim in this database traces to a verifiable primary source. Here's a sample of what's documented.</p>
            </div>
            <div className="space-y-4">
              {EVIDENCE.map((ev, i) => (
                <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5 grid grid-cols-[auto_1fr] gap-4 backdrop-blur">
                  <div className="text-center pt-0.5">
                    <span className="text-cyan-400 font-black text-sm">{ev.year}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-black text-sm">{ev.name}</span>
                      <CheckCircle2 size={12} className="text-green-400" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-2">{ev.claim}</p>
                    <p className="text-gray-600 text-xs font-bold">Source: {ev.source}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link to="/source-documents" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
                Browse all 40+ source documents <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Concept graph + IP Marketplace CTAs ── */}
        <section className="px-6 py-20 border-b border-white/10 solid-section">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/70 rounded-2xl p-7 border border-blue-900/50 backdrop-blur"
              style={{ boxShadow: "0 0 30px rgba(0,150,255,0.07)" }}>
              <div className="flex items-center gap-3 mb-3">
                <Database size={18} className="text-blue-400" />
                <h3 className="text-xl font-black text-white">Bearden Concept Graph</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">Interactive 3D knowledge graph of 100+ electromagnetic devices. Patent cross-references, technical relationships, technology maturity scoring.</p>
              <div className="space-y-1.5 mb-5">
                {["100+ device nodes with full specs", "Patent cross-references & claim links", "Technology maturity scoring", "Market opportunity heat mapping"].map((item, j) => (
                  <p key={j} className="text-gray-300 text-xs flex items-start gap-2"><span className="text-blue-400 mt-0.5">→</span>{item}</p>
                ))}
              </div>
              <Link to="/device-graph"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-blue-300 transition-all hover:opacity-80"
                style={{ border: "1.5px solid rgba(0,150,255,0.5)", background: "rgba(0,150,255,0.08)" }}>
                Explore the Graph <ArrowRight size={13} />
              </Link>
            </div>

            <div className="bg-gray-900/70 rounded-2xl p-7 border border-green-900/50 backdrop-blur"
              style={{ boxShadow: "0 0 30px rgba(0,200,100,0.07)" }}>
              <div className="flex items-center gap-3 mb-3">
                <Shield size={18} className="text-green-400" />
                <h3 className="text-xl font-black text-white">Anonymous IP Marketplace</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">List or invest in electromagnetic IP with full identity protection. Escrow-backed transactions. AI-powered deal matching.</p>
              <div className="space-y-1.5 mb-5">
                {["Anonymous inventor & investor profiles", "AI-powered matching algorithm", "VDR for secure due diligence", "5% commission on closed deals only"].map((item, j) => (
                  <p key={j} className="text-gray-300 text-xs flex items-start gap-2"><span className="text-green-400 mt-0.5">→</span>{item}</p>
                ))}
              </div>
              <Link to="/ip-marketplace"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-green-300 transition-all hover:opacity-80"
                style={{ border: "1.5px solid rgba(0,200,100,0.5)", background: "rgba(0,200,100,0.08)" }}>
                Browse Marketplace <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Pricing CTA ── */}
        <section className="px-6 py-24 border-b border-white/10 solid-section">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">Research Membership</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              One Plan.<br />
              <span style={{ background: "linear-gradient(135deg, #00ccff, #00ff99)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Everything Included.
              </span>
            </h2>
            <p className="text-gray-400 text-base mb-2 max-w-lg mx-auto">Full database access. All build modules. AI patent tools. IP marketplace. $49/month. Cancel anytime.</p>
            <p className="text-gray-600 text-sm mb-10">No tiers. No hidden upgrades. Everything unlocked at $49.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing"
                className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-base text-black transition-all hover:scale-105"
                style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 32px rgba(0,200,255,0.3)" }}>
                Start for $49/month <ArrowRight size={16} />
              </Link>
              <Link to="/free-vault"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors">
                Free preview first
              </Link>
            </div>
            <p className="text-gray-700 text-xs mt-5">Secured by Stripe · Cancel anytime · No contracts</p>
          </div>
        </section>

        {/* ── Footer stats + links ── */}
        <section className="px-6 py-12 border-t border-white/10 solid-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
              <div><p className="font-black text-white text-xl mb-1">40+</p><p className="text-gray-500 text-xs">Verified Patents</p></div>
              <div><p className="font-black text-white text-xl mb-1">200+</p><p className="text-gray-500 text-xs">Peer-Reviewed Sources</p></div>
              <div><p className="font-black text-white text-xl mb-1">6</p><p className="text-gray-500 text-xs">Build Systems</p></div>
              <div><p className="font-black text-white text-xl mb-1">12</p><p className="text-gray-500 text-xs">AI Tools</p></div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-600 text-xs mb-4">
                Zenith Apex Technology · Primary sources only · No speculation · Institutional-grade research
              </p>
              <div className="flex justify-center gap-6 text-gray-500 text-xs">
                <Link to="/terms" className="hover:text-gray-300">Terms</Link>
                <Link to="/refund-policy" className="hover:text-gray-300">Refund Policy</Link>
                <Link to="/research-disclaimer" className="hover:text-gray-300">Research Disclaimer</Link>
                <Link to="/source-documents" className="hover:text-gray-300">Source Documents</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}