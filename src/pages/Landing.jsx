import { ArrowRight, Lock, BookOpen, Zap, Brain, Lightbulb, TrendingUp, Users, Eye, FileText, BarChart3, Percent, Search, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import UserDashboardSection from "@/components/UserDashboardSection";
import TrustProofSection from "@/components/TrustProofSection";
import ConversionHero from "@/components/conversion/ConversionHero";
import TrustSignals from "@/components/conversion/TrustSignals";
import PricingComparison from "@/components/conversion/PricingComparison";
import EnhancedResearchNavBar from "@/components/EnhancedResearchNavBar";
import ClassifiedMatrixBackground from "@/components/backgrounds/ClassifiedMatrixBackground";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogoDownload = async () => {
    try {
      const response = await base44.functions.invoke('exportLogoPDF', {});
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zenith-apex-tech-logo.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download PDF');
    }
  };

  return (
    <div className="min-h-screen relative bg-black" style={{ fontFamily: "'Courier Prime', monospace", letterSpacing: "0.05em" }}>
      <ClassifiedMatrixBackground />
      


      {/* Research Navigation Bar */}
      <EnhancedResearchNavBar />

      {/* Enhanced Header with Clearance Warning */}
      <nav className="border-b-4 px-6 py-6 sticky top-0 z-50 relative" style={{ background: "rgba(5, 5, 5, 0.98)", backdropFilter: "blur(12px)", borderColor: "#ff6600" }}>
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)" }} />
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 relative z-10">
          {/* Logo & Mission - Classified Style - ENLARGED */}
          <div className="flex items-center gap-6 flex-1">
            <div style={{ animation: "zatPulse 2.5s ease-in-out infinite" }} className="relative">
              <div className="relative group">
                <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b8b502123_generated_image.png" alt="Zenith Apex Tech" className="h-48 w-48 rounded-lg cursor-pointer hover:opacity-90 transition-opacity" style={{ filter: "drop-shadow(0 0 40px rgba(0, 255, 0, 1))", border: "4px solid rgba(0, 255, 0, 0.95)" }} />
                <button onClick={handleLogoDownload} className="absolute -bottom-8 left-0 text-xs text-green-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold hover:text-green-300">[ Download PDF ]</button>
              </div>
              <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-orange-600 text-black text-xs font-black rounded" style={{ boxShadow: "0 0 16px rgba(255, 102, 0, 1)" }}>TOP SECRET</div>
            </div>
            <div>
              <p className="text-white font-black text-7xl tracking-[0.3em] leading-tight" style={{ textShadow: "0 0 0 3px rgba(0, 255, 0, 0.9), 0 0 20px rgba(0, 255, 0, 1), 0 0 40px rgba(0, 255, 0, 0.8), 0 0 60px rgba(0, 255, 0, 0.5)" }}>ZENITH APEX T.E.C.H</p>
              <p className="text-green-600 text-sm font-bold">[ CLASSIFIED ACCESS ONLY ]</p>
              <p className="text-green-500 text-sm mt-1 italic">Members Granted Special Clearance</p>
            </div>
          </div>

          {/* Search Bar - Orange Neon Classified Style */}
          <div className="hidden lg:flex items-center flex-1 max-w-xs" style={{ animation: "neonPulse 2s ease-in-out infinite" }}>
            <div className="w-full relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
              <input
                type="text"
                placeholder="[ SEARCH DATABASE ]"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-none border-2 bg-black text-orange-500 placeholder-orange-700 focus:outline-none text-xs font-bold"
                style={{ boxShadow: "0 0 16px rgba(255, 102, 0, 0.6), inset 0 0 8px rgba(255, 102, 0, 0.2)", borderColor: "#ff6600", fontFamily: "'Courier Prime', monospace", letterSpacing: "0.05em" }}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center gap-3">
            <a href="#how-it-works" className="text-xs text-gray-400 hover:text-white transition font-semibold">How it Works</a>
            <a href="#pricing" className="text-xs text-gray-400 hover:text-white transition font-semibold">Pricing</a>
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes zatPulse {
          0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 16px rgba(0, 255, 0, 0.6)); }
          50% { opacity: 1; filter: drop-shadow(0 0 32px rgba(0, 255, 0, 1)); }
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 16px rgba(255, 102, 0, 0.5), inset 0 0 10px rgba(255, 102, 0, 0.1); }
          50% { box-shadow: 0 0 24px rgba(255, 102, 0, 0.9), inset 0 0 15px rgba(255, 102, 0, 0.2); }
        }
      `}</style>

      {/* Content wrapper - offset for sidebar on desktop */}
      <div className="lg:ml-20">
        {/* New Conversion Hero & Trust Signals */}
        <ConversionHero />
        <TrustSignals />

      {/* User Dashboard */}
      <section className="px-6 py-12 border-b border-white/10 solid-section">
        <div className="max-w-4xl mx-auto">
          <UserDashboardSection />
        </div>
      </section>

      {/* Trust & Proof Section */}
      <TrustProofSection />

      {/* What's Included */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
              <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-white">📋 Patent Intelligence</h3>
              <p className="text-gray-300 text-sm leading-relaxed">40+ patents with full prosecution history, claims analysis, prior art assessment, and engineering specifications.</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
              <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-white">📚 Research Archive</h3>
              <p className="text-gray-300 text-sm leading-relaxed">200+ peer-reviewed publications, declassified government reports, and technical documentation sourced from verified primary sources.</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
              <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-white">🔨 Build Plans</h3>
              <p className="text-gray-300 text-sm leading-relaxed">21+ invention systems with step-by-step instructions, bills of materials, schematics, and troubleshooting guides.</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
              <h3 className="text-lg font-black mb-3 flex items-center gap-2 text-white">🎓 Structured Courses</h3>
              <p className="text-gray-300 text-sm leading-relaxed">8+ research modules covering electromagnetic theory, patent strategy, engineering frameworks, and validation methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center text-white drop-shadow-[0_0_20px_rgba(80,200,255,0.4)]">How It Works</h2>
          <div className="space-y-4">
            {[
              { num: "1", title: "Explore", desc: "Browse 40+ patents and research topics in the interactive database. No login needed." },
              { num: "2", title: "Learn", desc: "Read primary source analysis, peer-reviewed research, and patent prosecution history." },
              { num: "3", title: "Build", desc: "Access step-by-step build plans with complete bills of materials and specifications." },
              { num: "4", title: "Validate", desc: "Use measurement protocols and engineering frameworks to test your prototypes." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start bg-gray-900 border border-gray-700 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 font-black text-xs">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-black text-white mb-1">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Plans Showcase */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-4 text-center">What Build Plans Look Like</h2>
          <p className="text-center text-gray-400 text-sm mb-12 max-w-2xl mx-auto">Each build plan includes complete BOM, schematics, step-by-step assembly, and video guides. From concept to working prototype.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-cyan-700/50 rounded-xl p-6 bg-cyan-950/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-2">⭐ MEG Generator</p>
                  <h3 className="text-white font-black text-lg">Motionless Electromagnetic Generator</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-800 text-cyan-200">23-part BOM</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300 mb-6">
                <p>✓ Complete 23-component parts list with suppliers</p>
                <p>✓ Winding specs & toroidal core geometry</p>
                <p>✓ 12-hour video assembly series</p>
                <p>✓ Magnet placement guides & calibration</p>
              </div>
              <Link to="/invention-plans" className="text-cyan-400 hover:text-cyan-300 text-xs font-black">View Full Plan →</Link>
            </div>
            <div className="border border-green-700/50 rounded-xl p-6 bg-green-950/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-2">⭐ Scalar System</p>
                  <h3 className="text-white font-black text-lg">Scalar EM Fundamentals</h3>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-800 text-green-200">8-module course</span>
              </div>
              <div className="space-y-2 text-sm text-gray-300 mb-6">
                <p>✓ Maxwell's original quaternion equations</p>
                <p>✓ Aharonov-Bohm effect deep dive</p>
                <p>✓ Scalar potential engineering framework</p>
                <p>✓ Lab reference materials & problem sets</p>
              </div>
              <Link to="/courses" className="text-green-400 hover:text-green-300 text-xs font-black">View Course →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Invention Dossier Teaser */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-4 text-center">AI Invention Dossier IP Creation Suite</h2>
          <p className="text-center text-gray-400 text-sm mb-12 max-w-2xl mx-auto">Generate complete patent strategies, commercialization roadmaps, and IP valuations in minutes. Builder members get 10/month, Pro gets 25/month.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "📄", label: "Patent Strategy", desc: "Full IP landscape analysis & FTO assessment" },
              { icon: "🎯", label: "Patent Claims", desc: "AI-generated independent & dependent claims" },
              { icon: "💰", label: "IP Valuation", desc: "$5M–$150M range analysis & licensing framework" },
              { icon: "🛣️", label: "Commercialization", desc: "12-month go-to-market roadmap & milestones" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-950/30 border border-purple-700/50 rounded-xl p-4 text-center">
                <span className="text-2xl block mb-2">{item.icon}</span>
                <p className="font-bold text-white text-sm mb-1">{item.label}</p>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/invention-dossier" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-black text-sm">
              <Brain size={16} /> Start IP Dossier Generator
            </Link>
          </div>
        </div>
      </section>

      {/* Patent Drafter & Tools */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-4 text-center">Patent Drafting Tools</h2>
          <p className="text-center text-gray-400 text-sm mb-12 max-w-2xl mx-auto">AI-powered tools that replace $3K–$15K attorney work. FTO analysis, claim generation, and patent drafting in minutes.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-950/30 border border-blue-700 rounded-xl p-6">
              <FileText className="text-blue-400 mb-3" size={24} />
              <h3 className="font-bold text-white mb-2">AI Patent Drafter</h3>
              <p className="text-gray-400 text-sm mb-4">Auto-generate provisional patent applications with full claims. Chat with AI Patent Attorney for revisions.</p>
              <Link to="/patent-attorney-chat" className="text-blue-400 text-xs font-black hover:text-blue-300">Open Patent Attorney →</Link>
            </div>
            <div className="bg-green-950/30 border border-green-700 rounded-xl p-6">
              <BarChart3 className="text-green-400 mb-3" size={24} />
              <h3 className="font-bold text-white mb-2">FTO Analysis</h3>
              <p className="text-gray-400 text-sm mb-4">Freedom-to-operate analysis. Prior art search, risk scoring, design-around strategies.</p>
              <Link to="/fto-analysis" className="text-green-400 text-xs font-black hover:text-green-300">Run FTO Analysis →</Link>
            </div>
            <div className="bg-orange-950/30 border border-orange-700 rounded-xl p-6">
              <Lightbulb className="text-orange-400 mb-3" size={24} />
              <h3 className="font-bold text-white mb-2">Pitch Deck Builder</h3>
              <p className="text-gray-400 text-sm mb-4">Auto-generate investor pitch decks with TAM, IP valuation, and 12-month milestones.</p>
              <Link to="/pitch-deck-builder" className="text-orange-400 text-xs font-black hover:text-orange-300">Build Pitch Deck →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bearden Database & IP Marketplace */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Bearden Graph */}
            <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-black mb-4 text-white flex items-center gap-2">
                <TrendingUp size={24} className="text-indigo-400" /> Bearden Concept Graph
              </h3>
              <p className="text-gray-400 text-sm mb-6">Interactive knowledge graph of 100+ electromagnetic devices and their technical relationships. Explore how concepts combine, patent references, and market applications.</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 100+ device nodes with specifications</li>
                <li>✓ Patent cross-references & relationships</li>
                <li>✓ Technology maturity scoring</li>
                <li>✓ Market opportunity assessment</li>
              </ul>
              <Link to="/device-graph" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-black text-sm">
                Explore Graph →
              </Link>
            </div>

            {/* IP Marketplace */}
            <div className="bg-gradient-to-br from-green-950/30 to-teal-950/20 border border-green-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-black mb-4 text-white flex items-center gap-2">
                <Users size={24} className="text-green-400" /> IP Marketplace
              </h3>
              <p className="text-gray-400 text-sm mb-6">Broker patents, inventions, and partnerships anonymously. Members create inventor and investor profiles. ZAT takes 5% commission on successful deals.</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ Anonymous inventor & investor profiles</li>
                <li>✓ Smart matching algorithm</li>
                <li>✓ VDR for due diligence docs</li>
                <li>✓ Deal flow pipeline management</li>
                <li>✓ 5% ZAT commission on closed deals</li>
              </ul>
              <Link to="/ip-marketplace" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-black text-sm">
                Browse Marketplace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Create Profile CTA */}
      <section className="px-6 py-16 border-b border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-4 text-center">Ready to Broker Deals?</h2>
          <p className="text-center text-gray-400 text-sm mb-10 max-w-2xl mx-auto">Create an anonymous inventor or investor profile. Get matched with co-inventors, capital, licensing deals, and partnerships.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-blue-950/20 border border-blue-700 rounded-xl p-6 text-center">
              <Lightbulb className="text-blue-400 mx-auto mb-3" size={28} />
              <h3 className="font-bold text-white mb-2">Inventor Profile</h3>
              <p className="text-gray-400 text-sm mb-4">List your IP, patent claims, and commercialization roadmap. Stay anonymous. Get matched with investors.</p>
              <Link to="/ip-marketplace" className="inline-block px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white font-bold text-sm rounded-lg">
                Create Inventor Profile
              </Link>
            </div>
            <div className="bg-green-950/20 border border-green-700 rounded-xl p-6 text-center">
              <TrendingUp className="text-green-400 mx-auto mb-3" size={28} />
              <h3 className="font-bold text-white mb-2">Investor Profile</h3>
              <p className="text-gray-400 text-sm mb-4">Browse IP deals, patent portfolios, and co-inventor matches. Invest in early-stage tech anonymously.</p>
              <Link to="/ip-marketplace" className="inline-block px-6 py-2 bg-green-700 hover:bg-green-600 text-white font-bold text-sm rounded-lg">
                Create Investor Profile
              </Link>
            </div>
          </div>
          <div className="mt-8 bg-yellow-950/20 border border-yellow-700/50 rounded-xl p-6 text-center">
            <p className="text-yellow-300 text-sm font-bold flex items-center justify-center gap-2">
              <Percent size={16} /> When a deal closes, ZAT (Zenith Apex Tech) takes 5% commission — transparent, fair, and focused on member success.
            </p>
          </div>
        </div>
      </section>

      {/* New Simplified Pricing */}
      <PricingComparison />

      {/* Footer CTA */}
      <section className="px-6 py-12 border-t border-white/10 solid-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <h3 className="font-black text-white text-lg mb-2">40+ Patents</h3>
              <p className="text-gray-500 text-sm">With full prosecution history & analysis</p>
            </div>
            <div className="text-center">
              <h3 className="font-black text-white text-lg mb-2">200+ Sources</h3>
              <p className="text-gray-500 text-sm">Peer-reviewed publications & declassified reports</p>
            </div>
            <div className="text-center">
              <h3 className="font-black text-white text-lg mb-2">21+ Build Plans</h3>
              <p className="text-gray-500 text-sm">Complete BOMs, schematics & video guides</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-600 text-sm mb-4">Powered by ZAT (Zenith Apex Technology). Primary sources only. Institutional research. No speculation.</p>
            <div className="flex justify-center gap-6 text-gray-500 text-xs">
              <Link to="/terms" className="hover:text-gray-300">Terms</Link>
              <Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
              <Link to="/refund-policy" className="hover:text-gray-300">Refund Policy</Link>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}