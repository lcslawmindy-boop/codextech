import { ArrowRight, Lock, BookOpen, Zap, Brain, Lightbulb, TrendingUp, Users, Eye, FileText, BarChart3, Percent } from "lucide-react";
import { Link } from "react-router-dom";
import UserDashboardSection from "@/components/UserDashboardSection";
import BackgroundThemeSwitcher, { ActiveBackground, useBackgroundTheme } from "@/components/BackgroundThemeSwitcher";

export default function Landing() {
  const { themeId, setThemeId } = useBackgroundTheme();

  return (
    <div className="min-h-screen text-white relative" style={{ background: "transparent" }}>
      <ActiveBackground themeId={themeId} />
      <BackgroundThemeSwitcher themeId={themeId} setThemeId={setThemeId} />
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4 sticky top-0 z-40" style={{ background: "#0a0a1a" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/373dda980_7e20287f0_logo.png" alt="Zenith Apex Tech" className="h-9 w-9 rounded-lg" />
            <div>
              <span className="font-black text-lg leading-none block">ZENITH APEX TECH</span>
              <span className="text-gray-500 text-xs tracking-widest">TEST · ENGINEER · CONSTRUCT · HARNESS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition">How it Works</a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition">Pricing</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 border-b border-white/10" style={{ background: "#0a0a1e" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black mb-6 leading-tight">
            Institutional Research Intelligence for Advanced Electromagnetics
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            Complete archive of 40+ patents, 200+ peer-reviewed publications, declassified government reports, and verified engineering frameworks. All sourced from primary documents. Everything you need to build.
          </p>

          {/* Three CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link to="/free-vault"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-700 hover:border-cyan-600 transition-all bg-gray-900/50 hover:bg-gray-900">
              <Zap size={24} className="text-cyan-400" />
              <span className="font-black text-sm">Free Preview</span>
              <p className="text-xs text-gray-500">Browse the public database</p>
              <ArrowRight size={14} className="text-gray-600 mt-2" />
            </Link>

            <Link to="/research-membership"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-cyan-600 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all">
              <Lock size={24} className="text-cyan-300" />
              <span className="font-black text-sm">Membership</span>
              <p className="text-xs text-gray-400">$99/month • Builder tier</p>
              <ArrowRight size={14} className="text-cyan-400 mt-2" />
            </Link>

            <Link to="/alacarte"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-700 hover:border-green-600 transition-all bg-gray-900/50 hover:bg-gray-900">
              <BookOpen size={24} className="text-green-400" />
              <span className="font-black text-sm">À La Carte</span>
              <p className="text-xs text-gray-500">$49 per course or plan</p>
              <ArrowRight size={14} className="text-gray-600 mt-2" />
            </Link>
          </div>

          <p className="text-xs text-gray-600">No login required. Start exploring in seconds.</p>
        </div>
      </section>

      {/* User Dashboard */}
      <section className="px-6 py-12 border-b border-white/10" style={{ background: "#0a0a1a" }}>
        <div className="max-w-4xl mx-auto">
          <UserDashboardSection />
        </div>
      </section>

      {/* What's Included */}
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#080812" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-black mb-3 flex items-center gap-2">📋 Patent Intelligence</h3>
              <p className="text-gray-400 text-sm leading-relaxed">40+ patents with full prosecution history, claims analysis, prior art assessment, and engineering specifications.</p>
            </div>
            <div>
              <h3 className="text-lg font-black mb-3 flex items-center gap-2">📚 Research Archive</h3>
              <p className="text-gray-400 text-sm leading-relaxed">200+ peer-reviewed publications, declassified government reports, and technical documentation sourced from verified primary sources.</p>
            </div>
            <div>
              <h3 className="text-lg font-black mb-3 flex items-center gap-2">🔨 Build Plans</h3>
              <p className="text-gray-400 text-sm leading-relaxed">21+ invention systems with step-by-step instructions, bills of materials, schematics, and troubleshooting guides.</p>
            </div>
            <div>
              <h3 className="text-lg font-black mb-3 flex items-center gap-2">🎓 Structured Courses</h3>
              <p className="text-gray-400 text-sm leading-relaxed">8+ research modules covering electromagnetic theory, patent strategy, engineering frameworks, and validation methods.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-6 py-16 border-b border-white/10" style={{ background: "#0a0a1a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">How It Works</h2>
          <div className="space-y-6">
            {[
              { num: "1", title: "Explore", desc: "Browse 40+ patents and research topics in the interactive database. No login needed." },
              { num: "2", title: "Learn", desc: "Read primary source analysis, peer-reviewed research, and patent prosecution history." },
              { num: "3", title: "Build", desc: "Access step-by-step build plans with complete bills of materials and specifications." },
              { num: "4", title: "Validate", desc: "Use measurement protocols and engineering frameworks to test your prototypes." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
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
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#080812" }}>
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
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#0a0a1a" }}>
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
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#080812" }}>
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
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#0a0a1a" }}>
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
              <p className="text-gray-400 text-sm mb-6">Broker patents, inventions, and partnerships anonymously. Members create inventor and investor profiles. ZARP takes 5% commission on successful deals.</p>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ Anonymous inventor & investor profiles</li>
                <li>✓ Smart matching algorithm</li>
                <li>✓ VDR for due diligence docs</li>
                <li>✓ Deal flow pipeline management</li>
                <li>✓ 5% ZARP commission on closed deals</li>
              </ul>
              <Link to="/ip-marketplace" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-black text-sm">
                Browse Marketplace →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Create Profile CTA */}
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#080812" }}>
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
              <Percent size={16} /> When a deal closes, ZARP takes 5% commission — transparent, fair, and focused on member success.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 border-b border-white/10" style={{ background: "#0a0a1a" }}>
       <div className="max-w-6xl mx-auto">
         <h2 className="text-3xl font-black mb-12 text-center">Membership Tiers</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Researcher */}
           <div className="border border-gray-700 rounded-2xl p-8" style={{ background: "rgba(10,10,30,0.75)" }}>
             <h3 className="text-lg font-black mb-2">Researcher</h3>
             <p className="text-gray-500 text-sm mb-6">Get started</p>
             <div className="text-3xl font-black mb-1 text-cyan-300">$49<span className="text-sm">/mo</span></div>
             <p className="text-gray-600 text-xs mb-6">Core archive access</p>
             <ul className="space-y-2 text-sm text-gray-300 mb-6">
               <li>✓ 3 courses included</li>
               <li>✓ 3 build plans included</li>
               <li>✓ Core research archive</li>
               <li>✓ Monthly content drops</li>
             </ul>
             <Link to="/research-membership" className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-colors text-center block">
               Learn More
             </Link>
           </div>

           {/* Builder */}
           <div className="bg-cyan-950/30 border-2 border-cyan-600 rounded-2xl p-8 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-600 rounded-full text-xs font-black">
               MOST POPULAR
             </div>
             <h3 className="text-lg font-black mb-2">Builder</h3>
             <p className="text-gray-400 text-sm mb-6">For engineers building</p>
             <div className="text-3xl font-black mb-1 text-cyan-300">$99<span className="text-sm">/mo</span></div>
             <p className="text-gray-600 text-xs mb-6">Full engineering toolkit</p>
             <ul className="space-y-2 text-sm text-cyan-100 mb-6">
               <li>✓ All courses & build plans</li>
               <li>✓ 10 Invention Dossier rolls/mo</li>
               <li>✓ Patent analyses & FTO tools</li>
               <li>✓ Expert support (48hr response)</li>
               <li>✓ 20% EMF shop discount</li>
             </ul>
             <Link to="/research-membership" className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors text-center block">
               Join Now
             </Link>
           </div>

           {/* Pro */}
           <div className="bg-purple-950/30 border-2 border-purple-600 rounded-2xl p-8 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 rounded-full text-xs font-black">
               🔥 FULL SUITE
             </div>
             <h3 className="text-lg font-black mb-2">Pro</h3>
             <p className="text-gray-400 text-sm mb-6">Complete platform</p>
             <div className="text-3xl font-black mb-1 text-purple-300">$199<span className="text-sm">/mo</span></div>
             <p className="text-gray-600 text-xs mb-6">Everything included</p>
             <ul className="space-y-2 text-sm text-purple-100 mb-6">
               <li>✓ All Builder features</li>
               <li>✓ 25 Invention Dossier rolls/mo</li>
               <li>✓ AI Patent Attorney tool</li>
               <li>✓ Verified supplier sourcing</li>
               <li>✓ Commercialization roadmap</li>
               <li>✓ Priority support</li>
             </ul>
             <Link to="/research-membership" className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors text-center block">
               Upgrade Pro
             </Link>
           </div>
         </div>

         {/* À La Carte Option */}
         <div className="border border-gray-700 rounded-2xl p-6 text-center" style={{ background: "rgba(10,10,30,0.5)" }}>
           <p className="text-gray-400 text-sm mb-3">Prefer to buy individual items?</p>
           <Link to="/alacarte" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold text-sm">
             Browse À La Carte Catalog (Courses $147–$247, Build Plans $189–$1,297) →
           </Link>
         </div>
       </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-12 border-t border-white/10" style={{ background: "#060610" }}>
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
            <p className="text-gray-600 text-sm mb-4">Primary sources only. Institutional research. No speculation.</p>
            <div className="flex justify-center gap-6 text-gray-500 text-xs">
              <Link to="/terms" className="hover:text-gray-300">Terms</Link>
              <Link to="/privacy" className="hover:text-gray-300">Privacy</Link>
              <Link to="/refund-policy" className="hover:text-gray-300">Refund Policy</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}