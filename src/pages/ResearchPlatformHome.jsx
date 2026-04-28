import { Link } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle2, Database, BookOpen, Wrench } from "lucide-react";

export default function ResearchPlatformHome() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-black text-xs">
              RP
            </div>
            <span className="font-bold text-sm text-gray-900">Research Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#methodology" className="text-sm text-gray-600 hover:text-gray-900">Methodology</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
            <Link to="/research-membership" className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800">
              Access Database
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-gray-600">Applied Physics Research Archive</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Private Research Database for Advanced Systems Engineering
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Institutional-grade research platform. Primary sources only: filed patents, peer-reviewed publications, declassified government archives. Used by engineering teams, research institutions, and technical founders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/research-membership"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">
              Access the Database <ArrowRight size={16} />
            </Link>
            <a href="#what-is-this"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 transition-colors">
              Learn More
            </a>
          </div>
          <div className="mt-12 pt-12 border-t border-gray-200 grid grid-cols-3 gap-8">
            <div>
              <div className="font-black text-2xl text-gray-900 mb-1">40+</div>
              <div className="text-sm text-gray-600">Patents Analyzed</div>
            </div>
            <div>
              <div className="font-black text-2xl text-gray-900 mb-1">200+</div>
              <div className="text-sm text-gray-600">Peer-Reviewed Sources</div>
            </div>
            <div>
              <div className="font-black text-2xl text-gray-900 mb-1">6+</div>
              <div className="text-sm text-gray-600">Countries Using</div>
            </div>
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="px-6 py-20 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Grounded in Verifiable Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "US Patents",
                desc: "40+ patents with full prosecution history, claims analysis, and prior art assessment. Each patent cross-referenced with USPTO records. No speculation—only filed documents."
              },
              {
                title: "Peer-Reviewed Publications",
                desc: "200+ journal articles from IEEE, Nature, Physics Letters, and institutional archives. Every citation verified against original source. Academic rigor enforced."
              },
              {
                title: "Declassified Government Archives",
                desc: "Technical reports from DARPA, ONR, Department of Energy, and other institutional repositories. Authenticated through OSTI.gov and official channels."
              },
              {
                title: "Published Technical Specifications",
                desc: "Engineering documentation from filed patents, published research, and verified technical manuals. No theoretical extrapolation. Source material only."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Is This */}
      <section id="what-is-this" className="px-6 py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">What This Platform Is (and Isn't)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-gray-900" /> What It Is
              </h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>• Structured research from verified primary sources</li>
                <li>• Engineering-focused system documentation</li>
                <li>• Patent intelligence and IP analysis framework</li>
                <li>• Monthly institutional research updates</li>
                <li>• Expert support for technical questions</li>
                <li>• Designed for serious builders and researchers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">What It Isn't</h3>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li>✗ A course platform</li>
                <li>✗ Educational entertainment</li>
                <li>✗ Theoretical speculation</li>
                <li>✗ Unverified claims</li>
                <li>✗ Business coaching</li>
                <li>✗ Investment advice</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="px-6 py-20 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Who Uses This Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                audience: "Research Engineers",
                desc: "Hardware engineers and systems designers building on verified electromagnetic research. Need to understand patent landscape and technical foundation.",
                icon: "⚙️"
              },
              {
                audience: "Technical Founders",
                desc: "Entrepreneurs translating research into products. Require primary-source documentation, patent analysis, and competitive landscape intelligence.",
                icon: "🔬"
              },
              {
                audience: "Research Institutions",
                desc: "Universities, labs, and government contractors. Need institutional access, expert consultation, and real-time research updates.",
                icon: "🏛️"
              },
              {
                audience: "IP & Patent Professionals",
                desc: "Patent attorneys, strategists, and legal teams. Use the platform for prior art research, freedom-to-operate analysis, and patent landscape mapping.",
                icon: "⚖️"
              },
              {
                audience: "Serious Builders",
                desc: "Independent researchers and prototype developers. Want engineering specifications grounded in peer-reviewed research and filed patents.",
                icon: "🛠️"
              },
              {
                audience: "Defense & Government",
                desc: "Agencies and contractors evaluating advanced systems. Need verified source material and institutional-grade research documentation.",
                icon: "🛡️"
              }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.audience}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Breakdown */}
      <section id="methodology" className="px-6 py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Platform Components</h2>
          <div className="space-y-8">
            {[
              {
                icon: <Database size={24} />,
                title: "Research Database",
                desc: "Complete archive of 40+ patents with prosecution history, 200+ peer-reviewed publications, and declassified government reports. All material source-verified and cross-indexed. Quarterly updates with emerging research and new patent filings.",
                features: ["Patent intelligence with claims analysis", "Publication index with abstracts", "Government archive access", "Cross-source correlation", "Real-time updates"]
              },
              {
                icon: <BookOpen size={24} />,
                title: "Research Modules",
                desc: "8 structured analysis modules covering electromagnetic systems, scalar theory, patent strategy, and engineering interpretation. Each module: source material → technical breakdown → system implications → reproducibility assessment.",
                features: ["80+ hours of structured analysis", "Source-grounded methodology", "Engineering-focused interpretation", "IP assessment framework", "Quarterly new modules"]
              },
              {
                icon: <Wrench size={24} />,
                title: "Engineering Systems Documentation",
                desc: "Technical specifications for electromagnetic devices derived from filed patents and peer-reviewed research. Includes component lists, operational parameters, and measurement protocols. No theoretical extrapolation—only documented specifications.",
                features: ["Bill of materials from patent specs", "Assembly documentation", "Measurement validation protocols", "Regulatory compliance notes", "Build system tracking"]
              }
            ].map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-gray-900 flex-shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((f, fi) => (
                        <span key={fi} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="px-6 py-20 border-b border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Membership Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                tier: "Researcher",
                price: "$197",
                period: "per month",
                badge: null,
                desc: "For individual engineers and researchers",
                features: [
                  "Complete patent database (40+)",
                  "200+ peer-reviewed publications",
                  "8 research modules",
                  "Engineering system specs",
                  "Monthly research updates",
                  "Direct expert support (48-hour response)"
                ]
              },
              {
                tier: "Institutional",
                price: "$497",
                period: "per month",
                badge: "RECOMMENDED",
                desc: "For research teams and institutions",
                features: [
                  "Everything in Researcher",
                  "Team access (up to 10 seats)",
                  "Monthly live technical sessions",
                  "Priority expert support",
                  "Quarterly briefings on emerging research",
                  "Custom research requests (1/month)",
                  "Pre-release access to new analyses"
                ]
              }
            ].map((item, i) => (
              <div key={i} className={`border-2 rounded-lg p-8 ${item.badge ? "border-gray-900 bg-white" : "border-gray-200 bg-white"}`}>
                {item.badge && (
                  <div className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">{item.badge}</div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.tier}</h3>
                <p className="text-gray-600 text-sm mb-6">{item.desc}</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-gray-900">{item.price}</span>
                  <span className="text-gray-600 text-sm ml-2">/{item.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {item.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="text-gray-900 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/research-membership"
                  className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">
                  {item.tier} Plan <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm mt-8">
            Both tiers include institutional-grade research. Cancel anytime. No contracts.
          </p>
        </div>
      </section>

      {/* Why This Platform */}
      <section className="px-6 py-20 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-900 mb-12">Why This Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Institutional Standard</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Used by research teams in 6+ countries. This is the documentation framework serious engineering teams rely on. Every claim traceable to its source. Zero speculation.
              </p>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Verified Methodology</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Patents cross-referenced against USPTO records. Publications verified against journal archives. Government reports authenticated through official channels. Complete source transparency.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Living Archive</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Monthly updates: new patents indexed, emerging research flagged, regulatory developments tracked. You stay current with institutional research—not static data.
              </p>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Expert Access</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Institutional tier includes monthly sessions with research directors. Ask technical questions, clarify patent strategy, discuss engineering application. Get expert answers—not automated responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-4">Access the Research Database</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Join engineering teams, research institutions, and technical founders building on verified primary sources. Start with a free research brief or access full membership today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/research-brief"
              className="px-8 py-4 rounded-lg border-2 border-white text-white font-bold hover:bg-white hover:text-gray-900 transition-colors">
              Free Research Brief
            </Link>
            <Link to="/research-membership"
              className="px-8 py-4 rounded-lg bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              Access Membership <ArrowRight size={16} />
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-8">
            Institutional-grade research. Primary sources only. Used by 6+ countries.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Research Database</a></li>
                <li><a href="#" className="hover:text-gray-900">Methodology</a></li>
                <li><a href="#" className="hover:text-gray-900">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Resources</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/research-brief" className="hover:text-gray-900">Free Brief</a></li>
                <li><a href="#" className="hover:text-gray-900">Research Blog</a></li>
                <li><a href="/research-methodology" className="hover:text-gray-900">Our Process</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="/terms" className="hover:text-gray-900">Terms</a></li>
                <li><a href="/refund-policy" className="hover:text-gray-900">Refunds</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-3">Contact</p>
              <ul className="space-y-2 text-xs text-gray-600">
                <li><a href="mailto:support@zenithapex.com" className="hover:text-gray-900">Support</a></li>
                <li><a href="mailto:inquiry@zenithapex.com" className="hover:text-gray-900">Institutional Inquiry</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-600">
            <p>Research Platform © 2026. Institutional-grade research. Primary sources only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}