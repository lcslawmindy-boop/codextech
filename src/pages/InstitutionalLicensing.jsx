import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Building2, Users, BarChart3, Shield } from "lucide-react";

export default function InstitutionalLicensing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 sticky top-0 z-20 bg-gray-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-black text-sm">← Back to Vault</Link>
          <span className="text-gray-500 text-sm">Institutional Licensing</span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto border-b border-gray-800">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800 text-purple-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Building2 size={12} /> Universities & Teams
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-[1.2] mb-6">
          License Our Complete<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Engineering Library
          </span>
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
          40 documented build systems for your institution. Site license or API access. White-label options available.
        </p>

        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-8">
          Universities, research institutions, and corporate R&D teams can license our entire vault for student labs, internal research, or client delivery.
        </p>

        <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 text-white font-black transition-all">
          Schedule a Call <ArrowRight size={16} />
        </a>
      </section>

      {/* ── What's included ── */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center">License Options</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "University Lab License",
              price: "$5,000–$15,000/year",
              desc: "Full vault access for student lab use",
              features: [
                "All 40 complete build systems",
                "Unlimited student access",
                "Download BOMs & schematics",
                "Video assembly guides",
                "Annual updates & new builds",
                "Email support",
              ],
              notIncluded: [
                "API access",
                "White-label",
                "Priority support",
              ],
            },
            {
              title: "Corporate R&D License",
              price: "$20,000–$50,000/year",
              desc: "Full vault + API + white-label",
              features: [
                "Everything in University License",
                "REST API for integration",
                "Custom metadata & tagging",
                "Team of up to 50 users",
                "Priority email & phone support",
                "Quarterly roadmap calls",
              ],
              notIncluded: [
                "Custom build development",
              ],
            },
            {
              title: "Enterprise Custom",
              price: "Contact Sales",
              desc: "Bespoke licensing & development",
              features: [
                "Everything in Corporate License",
                "Custom build development",
                "White-label/private hosting",
                "Unlimited team size",
                "Dedicated account manager",
                "SLA & custom terms",
              ],
              notIncluded: [],
            },
          ].map((pkg, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
              <h3 className="text-xl font-black mb-2">{pkg.title}</h3>
              <p className="text-gray-500 text-sm mb-4">{pkg.desc}</p>
              <div className="text-2xl font-black text-purple-400 mb-6">{pkg.price}</div>

              <ul className="space-y-3 mb-6 flex-1">
                {pkg.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {pkg.notIncluded.length > 0 && (
                <div className="space-y-2 py-4 border-t border-gray-800">
                  {pkg.notIncluded.map((item, j) => (
                    <p key={j} className="text-xs text-gray-600">○ {item}</p>
                  ))}
                </div>
              )}

              <a href="#contact" className="w-full py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-center transition-all mt-4">
                {pkg.price === "Contact Sales" ? "Get Quote" : "Learn More"}
              </a>
            </div>
          ))}
        </div>

        {/* ── Use cases ── */}
        <h2 className="text-3xl font-black mb-12 text-center mt-20">Who Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {[
            {
              icon: <Users size={24} />,
              title: "Universities & Labs",
              desc: "Engineering, physics, and materials science departments use our library for advanced coursework and student research projects.",
            },
            {
              icon: <BarChart3 size={24} />,
              title: "Corporate R&D",
              desc: "Engineering teams prototype advanced systems internally. Reference material for new employees and engineering candidates.",
            },
            {
              icon: <Building2 size={24} />,
              title: "Research Institutions",
              desc: "Academic research teams access peer-reviewed build systems and suppressed research documentation at scale.",
            },
            {
              icon: <Shield size={24} />,
              title: "Defense Contractors",
              desc: "Background research and threat assessment. Understand competing electromagnetic and energy technologies.",
            },
          ].map((use, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-8">
              <div className="text-purple-400 mb-4">{use.icon}</div>
              <h3 className="text-white font-black text-lg mb-2">{use.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{use.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── API Example ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black mb-8 text-center">API Integration (Corporate License)</h2>
          <p className="text-gray-400 text-center mb-8">
            Integrate our build library into your internal tools, LMS, or design platform.
          </p>

          <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 overflow-x-auto mb-8">
            <pre className="text-xs text-gray-300 font-mono">
{`# Get all builds
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.scalarvault.io/v1/builds

# Returns:
{
  "builds": [
    {
      "id": 1,
      "title": "MEG Replication Device",
      "category": "Energy",
      "bom": { ... },
      "schematics": "https://...",
      "video": "https://..."
    },
    ...
  ]
}

# Get specific build
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.scalarvault.io/v1/builds/1`}
            </pre>
          </div>

          <p className="text-gray-500 text-sm text-center">
            Full API documentation provided with Corporate license. Rate limits: 1,000 requests/day.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center">Common Questions</h2>

        <div className="space-y-6">
          {[
            {
              q: "Can we white-label the content?",
              a: "Yes. Enterprise & custom licenses include white-label options. Your institution's branding replaces ours. Contact sales for details.",
            },
            {
              q: "What's included in updates?",
              a: "Annual licenses include all new builds added to the vault, source documentation updates, and video guide improvements. No additional cost.",
            },
            {
              q: "Can we host this on our own servers?",
              a: "Enterprise licenses include private hosting options. We can deploy to your infrastructure or AWS. Requires custom agreement.",
            },
            {
              q: "Do you offer discounts for non-profit institutions?",
              a: "Yes. Universities and 501(c)(3) research institutions get 30% discount. Contact us with proof of status.",
            },
            {
              q: "What kind of support is included?",
              a: "University licenses include email support. Corporate & Enterprise get priority email, phone support, and quarterly strategy calls.",
            },
            {
              q: "Can we modify the builds for our needs?",
              a: "Enterprise license includes rights to modify builds for internal use. Custom development available as add-on.",
            },
          ].map((faq, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="font-black text-white mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="px-6 py-20 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-4">Schedule a Licensing Call</h2>
          <p className="text-gray-400 mb-8">
            Speak with our team about your institution's specific needs. We'll help you choose the right license tier and answer any questions.
          </p>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 mb-8">
            <form className="space-y-4 max-w-md mx-auto">
              <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-600" required />
              <input type="email" placeholder="Your email" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-600" required />
              <input type="text" placeholder="Institution name" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-600" required />
              <select className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-purple-600">
                <option value="">Select license tier</option>
                <option>University Lab License</option>
                <option>Corporate R&D License</option>
                <option>Enterprise Custom</option>
              </select>
              <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-500 hover:to-pink-600 text-white font-black transition-all">
                Request Demo
              </button>
            </form>
          </div>

          <p className="text-gray-600 text-xs">
            Or email: <span className="text-gray-400 font-mono">licensing@scalarvault.io</span>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>Scalar Venture Vault · Engineering Library Licensing · Educational & Research Use</p>
      </footer>
    </div>
  );
}