import { ArrowRight, Lock, BookOpen, Zap } from "lucide-react";
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
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8" />
            <span className="font-black text-lg">C.O.D.E.X.T.E.C.H.</span>
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
              <p className="text-xs text-gray-400">$49/month • 3 + 3 included</p>
              <ArrowRight size={14} className="text-cyan-400 mt-2" />
            </Link>

            <Link to="/invention-plans"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-700 hover:border-green-600 transition-all bg-gray-900/50 hover:bg-gray-900">
              <BookOpen size={24} className="text-green-400" />
              <span className="font-black text-sm">Buy Plans</span>
              <p className="text-xs text-gray-500">$49–99 per plan</p>
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

      {/* Top Content */}
      <section className="px-6 py-16 border-b border-white/10" style={{ background: "#080812" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Most Popular Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-cyan-700/50 rounded-xl p-5" style={{ background: "rgba(0,20,40,0.7)" }}>
              <p className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-2">⭐ Top Course</p>
              <h3 className="text-white font-black text-lg mb-1">Regauging and Energy Extraction</h3>
              <p className="text-gray-400 text-xs mb-4">Core electromagnetic theory & energy access</p>
              <Link to="/alacarte" className="text-cyan-400 hover:text-cyan-300 text-xs font-black">Buy $297 →</Link>
            </div>
            <div className="border border-cyan-700/50 rounded-xl p-5" style={{ background: "rgba(0,20,40,0.7)" }}>
              <p className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-2">⭐ Top Build Plan</p>
              <h3 className="text-white font-black text-lg mb-1">Motionless Electromagnetic Generator</h3>
              <p className="text-gray-400 text-xs mb-4">Complete BOM, schematics, assembly steps</p>
              <Link to="/alacarte" className="text-cyan-400 hover:text-cyan-300 text-xs font-black">Buy $50 →</Link>
            </div>
          </div>
          <p className="text-center text-gray-500 text-xs mt-6">Membership includes first 3 courses + 3 build plans, then 1 of each added monthly</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16 border-b border-white/10" style={{ background: "#0a0a1a" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-700 rounded-2xl p-8" style={{ background: "rgba(10,10,30,0.75)" }}>
              <h3 className="text-lg font-black mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6">Explore the database</p>
              <div className="text-3xl font-black mb-6">$0</div>
              <ul className="space-y-2 text-sm text-gray-400 mb-6">
                <li>✓ Browse 40+ patents</li>
                <li>✓ Read summaries</li>
                <li>✓ Access public courses</li>
                <li>✗ Build plans</li>
              </ul>
              <Link to="/free-vault" className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-colors text-center block">
                Start Free
              </Link>
            </div>

            <div className="bg-cyan-950/30 border-2 border-cyan-600 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-600 rounded-full text-xs font-black">
                BEST VALUE
              </div>
              <h3 className="text-lg font-black mb-2">Membership</h3>
              <p className="text-gray-400 text-sm mb-6">Unlimited content + drops</p>
              <div className="text-3xl font-black mb-6">$49<span className="text-sm">/mo</span></div>
              <ul className="space-y-2 text-sm text-gray-300 mb-6">
                <li>✓ 3 courses + 3 build plans</li>
                <li>✓ 1 new course monthly</li>
                <li>✓ 1 new build plan monthly</li>
                <li>✓ Full content library access</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <Link to="/research-membership" className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors text-center block">
                Join Now
              </Link>
            </div>

            <div className="border border-gray-700 rounded-2xl p-8" style={{ background: "rgba(10,10,30,0.75)" }}>
              <h3 className="text-lg font-black mb-2">À La Carte</h3>
              <p className="text-gray-500 text-sm mb-6">Buy what you need</p>
              <div className="text-3xl font-black mb-6">$49</div>
              <ul className="space-y-2 text-sm text-gray-400 mb-6">
                <li>✓ Any course: $49</li>
                <li>✓ Any build plan: $49</li>
                <li>✓ One-time payment</li>
                <li>✓ Lifetime access</li>
              </ul>
              <Link to="/alacarte" className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-colors text-center block">
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="px-6 py-12" style={{ background: "#060610" }}>
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
          <p>Primary sources only. Institutional research. No speculation.</p>
        </div>
      </section>
    </div>
  );
}