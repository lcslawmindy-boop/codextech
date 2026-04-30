import { useState } from "react";
import { ArrowRight, CheckCircle2, Lock, Zap, FileText, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ResearchBriefLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      // Capture lead
      await base44.entities.NewsletterSubscriber.create({
        email: email.toLowerCase().trim(),
        source: "research_brief_landing",
        status: "active"
      });
      setSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5 bg-gray-900/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-8 w-8" />
            <span className="font-black text-lg tracking-tight">Research Platform</span>
          </div>
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300">← Back</a>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800 text-blue-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Lock size={12} /> Insider Research Brief
        </div>

        <h1 className="text-5xl sm:text-6xl font-black leading-[1.1] mb-6">
          The 4-Vector Conflation That Cost Physics 140 Years
          <span className="text-sm text-gray-500 font-normal block mt-2">(Based on T.E. Bearden's theoretical analysis)</span>
        </h1>

        <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">
          A 40-page technical analysis of the mathematical foundation hiding half of electromagnetic potential space — and why it matters for emerging technologies.
        </p>

        <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-900/30 rounded-2xl p-8 mb-10">
          <h3 className="text-white font-bold text-lg mb-4">What's Inside This Research Brief</h3>
          <ul className="space-y-3">
            {[
              "Historical analysis: Maxwell (1865) → Heaviside (1884) → Gibbs (1888) — what was removed and why",
              "The mathematical conflation: 4-vector notation limitations (based on Bearden analysis)",
              "Theoretical engineering implications: scalar potential in device architecture",
              "Primary source citations: Maxwell's original quaternion formulation + peer-reviewed literature",
              "Research frameworks: theoretical paths forward (not confirmed working devices)"
            ].map((item, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h3 className="text-white font-black text-xl mb-2">Instant Access</h3>
            <p className="text-gray-400 text-sm mb-6">
              Enter your email below. The full research brief downloads immediately — no credit card required.
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
                <p className="text-green-300 font-bold mb-2">Download Started</p>
                <p className="text-gray-400 text-sm">Check your email inbox. You'll also receive an institutional research brief sequence (5 emails).</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="research@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? "Processing..." : (
                    <>
                      Get Research Brief <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-gray-600 text-xs mt-4">No spam. Research updates only. Unsubscribe anytime.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <FileText size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">40 Pages</p>
                  <p className="text-gray-500 text-xs">Deep technical analysis</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Zap size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Insider Access</p>
                  <p className="text-gray-500 text-xs">5-email research sequence</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Lock size={18} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-bold">Member-Only</p>
                  <p className="text-gray-500 text-xs">Limited distribution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-white font-bold text-lg mb-8">Who Reads This</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-sm">
            {[
              { label: "Research Teams", note: "Universities, labs" },
              { label: "Engineers", note: "Hardware architects" },
              { label: "Investors", note: "Deep-tech VCs" },
              { label: "Founders", note: "Advanced systems" }
            ].map((group, i) => (
              <div key={i}>
                <p className="text-white font-bold mb-1">{group.label}</p>
                <p className="text-gray-500 text-xs">{group.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authority Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h3 className="text-white font-black text-2xl mb-8 text-center">Why This Matters Now</h3>

        <div className="space-y-6">
          {[
            {
              title: "Primary Source Material",
              desc: "All analysis traces directly to Maxwell (1865), Bearden (1983), and peer-reviewed literature. No secondary interpretation."
            },
            {
              title: "Engineering Precision",
              desc: "This isn't theoretical speculation. The conflation has direct consequences for device architecture, component selection, and system design."
            },
            {
              title: "Institutional Access",
              desc: "Rare insights from a technical research platform. This content is only distributed to verified institutional researchers."
            },
            {
              title: "Actionable Framework",
              desc: "Not just analysis — but a clear path forward for engineering teams exploring scalar potential applications."
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-6 py-8 border-t border-gray-800 bg-yellow-950/20 border-b border-yellow-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-yellow-300 text-xs font-bold uppercase mb-2">Research Framework Disclosure</p>
          <p className="text-gray-400 text-xs">
            This analysis is based on published research by T.E. Bearden, Maxwell's original formulations, and peer-reviewed literature. The theoretical frameworks presented are not confirmed as producing operational devices. No claims are made about energy generation, medical applications, or commercial viability. Content is for research and educational purposes only.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-12 border-t border-gray-800 bg-gray-900/40">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-gray-400 text-sm mb-4">
          After the research brief, you'll have access to our full institutional research sequence + special offers for members only.
        </p>
        <p className="text-gray-600 text-xs">
          This brief is limited distribution. Designed for serious researchers and technical teams only.
        </p>
      </div>
      </section>
    </div>
  );
}