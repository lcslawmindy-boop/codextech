import { Link } from "react-router-dom";
import { ArrowRight, Database, Wrench, Shield, FlaskConical, TrendingUp, CheckCircle2, Lock } from "lucide-react";
import LibraryBackground from "@/components/backgrounds/LibraryBackground";
import LiveActivityTicker from "@/components/LiveActivityTicker";
import HeroSection from "@/components/landing/HeroSection";
import ZaraAlienMascot from "@/components/ZaraAlienMascot";
import LibrarySearch from "@/components/LibrarySearch";
import Invention3DRotation from "@/components/Invention3DRotation";
import { useState } from "react";



const LIBRARY_ITEMS = [
  { label: "MEG Replication Kit", description: "Free energy extraction system", tags: ['MEG', 'Free Energy', 'Technical'] },
  { label: "Scalar Transmitter Specs", description: "Longitudinal wave transmission", tags: ['Scalar', 'Physics', 'Technical'] },
  { label: "TRD-1 Telomere Device", description: "Bioelectromagnetic healing", tags: ['Telomere', 'Bioelectromagnetics', 'Technical'] },
  { label: "Bearden Briefing Consciousness", description: "Mind-matter interaction diagrams", tags: ['Bearden', 'Consciousness', 'Diagrams'] },
  { label: "Fig. 24 Life and Death", description: "Living systems framework", tags: ['Bearden', 'Consciousness', 'Diagrams'] },
  { label: "Fig. 25 Consciousness Intent", description: "Time and consciousness mechanics", tags: ['Consciousness', 'Physics', 'Diagrams'] },
  { label: "Prioré Device Components", description: "EM chamber assembly guide", tags: ['Bioelectromagnetics', 'Technical', 'Briefing'] },
  { label: "Energy from Vacuum Theory", description: "Zero-point extraction methods", tags: ['Free Energy', 'Physics', 'Diagrams'] },
  { label: "Scalar Field Dynamics", description: "Advanced EM theory documentation", tags: ['Scalar', 'Physics', 'Technical'] },
  { label: "Bearden Patent Analysis", description: "MEG device engineering breakdown", tags: ['MEG', 'Bearden', 'Technical'] },
];

const MODULES = [
  { title: "MEG System", category: "Free Energy", tag: "US 6,362,718", locked: false, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b177d065d_generated_image.png", href: "/research-module?module=meg-system" },
  { title: "Prioré EM Chamber", category: "Bioelectromagnetics", tag: "FR 1,342,772", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a992c230_generated_image.png", href: "/research-module?module=priore-device" },
  { title: "Scalar Transmitter", category: "Scalar EM", tag: "Whittaker 1904", locked: true, img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc3cb2842_generated_image.png", href: "/research-module?module=scalar-transmitter" },
];



export default function Landing() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.03em" }}>
      <LibraryBackground />
      <LiveActivityTicker />
      <ZaraAlienMascot />
      <LibrarySearch items={LIBRARY_ITEMS} onSearch={setSearchOpen} />

      <div className="pt-16">
        {/* ── Autism Bed Hero (Primary Focus) ── */}
        <section className="px-6 py-20 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-950/60 to-blue-950/60 border border-purple-700/50 rounded-2xl p-10 backdrop-blur relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border border-pink-500/40 bg-pink-950/30">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-pink-400 uppercase">Now Raising — Research Crowdfund</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">The Autism Sensory Regulation Bed</h1>
                <p className="text-gray-300 text-base mb-5 max-w-2xl leading-relaxed">
                  Designed by a mother of an autistic child studying mechanical engineering and patent law. Real-time biometric monitoring. Anxiety detection. Adaptive calming response. For the 3.5M children on the spectrum who need this.
                </p>
                <p className="text-gray-400 text-sm mb-6 italic">
                  <strong className="text-white">Not a medical device.</strong> A caregiver research tool with clinical rigor.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/autism-bed-crowdfund"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm transition-all hover:scale-105"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #3b82f6)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
                    View Crowdfund & Pledge <ArrowRight size={15} />
                  </Link>
                  <Link to="/autism-bed-business-strategy"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-white border border-cyan-500/50 hover:bg-cyan-950/30 transition">
                    Business Strategy <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Hero (C.O.D.E.X.T.E.C.H. secondary) ── */}
        <HeroSection />

        {/* ── 3D Device Rotation ── */}
        <section className="px-6 py-16 border-b border-white/10 bg-gray-950/40">
          <div className="max-w-4xl mx-auto">
            <Invention3DRotation title="C.O.D.E.X.T.E.C.H. Device Core" />
          </div>
        </section>

        {/* ── Autism Bed Crowdfund Feature ── */}
        <section className="px-6 py-16 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-950/60 to-blue-950/60 border border-purple-700/50 rounded-2xl p-8 backdrop-blur relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border border-pink-500/40 bg-pink-950/30">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  <span className="text-xs font-black tracking-widest text-pink-400 uppercase">Now Raising — Research Crowdfund</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Autism Sensory Regulation Bed</h2>
                <p className="text-gray-300 text-base mb-5 max-w-2xl leading-relaxed">
                  A prototype multi-modal comfort bed for children on the autism spectrum. Measures HRV, EEG, and GSR to detect anxiety and meltdown precursors — then responds with gentle vibration, calming light, scent diffusion, and PEMF relaxation fields. <span className="text-white font-bold">Not a medical device.</span> A caregiver research tool.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
                  {[
                    { val: "$75K", label: "Prototype Goal" },
                    { val: "8", label: "Sensory Modalities" },
                    { val: "EEG + HRV", label: "Biometric Sensors" },
                    { val: "Phase 1", label: "Current Stage" },
                  ].map((s, i) => (
                    <div key={i} className="bg-gray-900/50 rounded-xl p-3 text-center border border-gray-800">
                      <p className="text-lg font-black text-white">{s.val}</p>
                      <p className="text-gray-500 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Link to="/autism-bed-crowdfund"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm transition-all hover:scale-105"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #3b82f6)", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
                  View Crowdfund & Pledge <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: What C.O.D.E.X.T.E.C.H. Is ── */}
        <section className="px-6 py-20 border-b border-white/10">
          <div className="max-w-3xl mx-auto text-center bg-gray-950/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-800/50">
            <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">The Platform</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">What C.O.D.E.X.T.E.C.H. Is</h2>
            <div className="space-y-4 text-left max-w-3xl mx-auto">
              <p className="text-gray-300 text-base leading-relaxed">
                C.O.D.E.X.T.E.C.H. is a structured research intelligence system built for engineers, inventors, and technical researchers working at the boundary of conventional and advanced electromagnetic science.
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                Every entry in the database is sourced from granted US patents, peer-reviewed academic publications, declassified government reports, and verified engineering documentation. No speculation. No secondary interpretations.
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                The platform organizes fragmented knowledge into structured research modules — each covering theoretical foundations, system architecture, component specifications, assembly procedures, and primary source citations.
              </p>
              <p className="text-gray-300 text-base leading-relaxed">
                C.O.D.E.X.T.E.C.H. is designed for discovery with intent: every research pathway leads toward actionable engineering output, whether that is a working prototype, a patent filing, or a commercialization strategy.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 3: Research Categories ── */}
        <section className="px-6 py-20 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 bg-gray-950/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 mx-auto max-w-2xl">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Research Categories</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Five Research Domains</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">Each category contains primary-source research modules, engineering specifications, and cross-referenced patent documentation.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: <Database size={20} className="text-cyan-400" />, title: "Electromagnetics", desc: "Advanced EM field theory, longitudinal wave systems, scalar potential engineering, and Tesla-derived device architectures. Sourced from 40+ granted US patents.", items: ["Scalar EM theory", "Longitudinal wave devices", "Tesla patent archive", "Phase conjugation systems"] },
                { icon: <FlaskConical size={20} className="text-green-400" />, title: "Bioelectromagnetics", desc: "EM field interaction with biological systems. Prioré device documentation, frequency-specific therapeutic protocols, and peer-reviewed clinical research.", items: ["Prioré device (FR 1,342,772)", "EM trigger window therapy", "TRD-1 telomere system", "Biofield measurement protocols"] },
                { icon: <TrendingUp size={20} className="text-orange-400" />, title: "Energy Systems", desc: "Overunity device research, vacuum energy extraction theory, and documented COP>1 device specifications from peer-reviewed and patent literature.", items: ["MEG (US 6,362,718)", "Bedini SG systems", "Vacuum potential extraction", "Anenergy Phi-field circuits"] },
                { icon: <Shield size={20} className="text-purple-400" />, title: "Atmospheric Systems", desc: "ELF/VLF propagation, ionospheric interaction, atmospheric EM signature detection, and scalar wave transmission through terrestrial waveguides.", items: ["ELF carrier detection", "Ionospheric resonance", "Atmospheric scalar signatures", "Tesla ground transmission"] },
                { icon: <Shield size={20} className="text-yellow-400" />, title: "Patent Strategy", desc: "USPTO filing strategy, claims architecture, freedom-to-operate analysis, and IP commercialization frameworks specifically developed for EM inventors.", items: ["Provisional patent generation", "Prior art archive (200+ entries)", "Claims structure builder", "FTO analysis framework"] },
              ].map((cat, i) => (
                <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-2xl p-6 backdrop-blur">
                  <div className="flex items-center gap-3 mb-3">
                    {cat.icon}
                    <h3 className="text-white font-black text-lg">{cat.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{cat.desc}</p>
                  <div className="space-y-1.5">
                    {cat.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2 text-xs text-gray-300">
                        <span className="text-cyan-500 mt-0.5 flex-shrink-0">→</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-gray-900/40 border border-gray-800/50 rounded-2xl p-6 backdrop-blur flex items-center justify-center">
                <Link to="/codextech-database" className="text-center">
                  <p className="text-gray-400 text-sm mb-3">Browse the full research database</p>
                  <span className="inline-flex items-center gap-2 text-cyan-400 font-black text-sm hover:text-cyan-300 transition-colors">
                    Open Research Database <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Why It Matters ── */}
        <section className="px-6 py-20 border-b border-white/10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-orange-400 text-xs font-black uppercase tracking-widest mb-3">The Problem & Solution</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Why Structured Research Matters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900/60 border border-red-900/40 rounded-2xl p-6 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> The Problem
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  Advanced electromagnetic research is scattered across thousands of patent filings, obscure academic journals, declassified government reports, and privately held engineering notes. Most researchers spend the majority of their time locating and validating sources rather than doing actual engineering work.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Without structured organization, critical connections between related devices, patents, and theoretical frameworks go unnoticed. Inventors duplicate prior work. Promising engineering paths are abandoned due to incomplete information. IP is mismanaged or left unprotected.
                </p>
              </div>
              <div className="bg-gray-900/60 border border-cyan-900/40 rounded-2xl p-6 backdrop-blur">
                <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" /> The C.O.D.E.X.T.E.C.H. Solution
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  C.O.D.E.X.T.E.C.H. aggregates, verifies, and structures the most significant electromagnetic research into a unified intelligence platform. Every entry traces to a primary source. Every module is engineered for actionable output — not passive reading.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Members access a continuously updated database of patents, publications, and build specifications, organized into research modules with cross-referenced citation networks, AI patent tools, and direct pathways from research discovery to prototype development and IP filing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Research modules preview ── */}
        <section className="px-6 py-20 border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-3">Research Modules</p>
              <h2 className="text-3xl font-black text-white mb-3">Research Modules</h2>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">Each module includes: theoretical basis, system architecture, full BOM, assembly procedures, measurement protocol, and primary source documents. The MEG module is free to access.</p>
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



        {/* ── Concept graph + IP Marketplace CTAs ── */}
        <section className="px-6 py-20 border-b border-white/10">
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

        {/* ── Section 5: CTA Block ── */}
        <section className="px-6 py-24 border-b border-white/10">
          <div className="max-w-2xl mx-auto text-center bg-gray-950/50 backdrop-blur-sm rounded-2xl p-10 border border-gray-800/50">
            <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">Research Membership</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need.<br />
              <span style={{ background: "linear-gradient(135deg, #00ccff, #00ff99)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                One Membership.
              </span>
            </h2>
            <p className="text-gray-400 text-base mb-2 max-w-lg mx-auto">
              Full database access. All research modules. AI patent tools. Build plans. IP marketplace. $49/month. Cancel anytime.
            </p>
            <p className="text-gray-600 text-sm mb-10">No tiers. No per-item fees. Everything unlocked from day one.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing"
                className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-base text-black transition-all hover:scale-105"
                style={{ background: "linear-gradient(90deg, #00ccff, #00ff99)", boxShadow: "0 4px 32px rgba(0,200,255,0.3)" }}>
                Start Membership — $49/mo <ArrowRight size={16} />
              </Link>
              <Link to="/codextech-database"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors">
                <Database size={15} /> Explore Research
              </Link>
            </div>
            <p className="text-gray-700 text-xs mt-5">Secured by Stripe · Cancel anytime · No contracts</p>
          </div>
        </section>

        {/* ── Footer stats + links ── */}
        <section className="px-6 py-12 border-t border-white/10">
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