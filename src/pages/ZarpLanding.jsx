import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Award, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

const RESEARCH_DOMAINS = [
  { icon: "⚛️", title: "Scalar Electromagnetics", desc: "Theory, mathematics, and engineering applications of scalar EM field topology." },
  { icon: "🧬", title: "Bioelectromagnetics", desc: "Peer-reviewed research on biological EM interactions and therapeutic applications." },
  { icon: "⚡", title: "Vacuum Energy Physics", desc: "Theoretical frameworks and experimental approaches to zero-point energy extraction." },
  { icon: "🔬", title: "Patent Analysis", desc: "Technical examination of granted patents and prosecution strategies." },
  { icon: "📊", title: "Literature Review", desc: "Comprehensive bibliographic analysis across multiple research domains." },
  { icon: "🛠️", title: "Engineering Systems", desc: "Technical specifications and architectural documentation of experimental devices." },
];

const CONTENT_TYPES = [
  { type: "Granted Patents", count: "40+", note: "US & international" },
  { type: "Peer-Reviewed Papers", count: "200+", note: "IEEE, Physics Letters, Nature, etc." },
  { type: "Technical Reports", count: "150+", note: "DARPA, DoE, and government archives" },
  { type: "Engineering Specs", count: "25+", note: "Complete device documentation" },
];

export default function ZarpLanding() {
  const [email, setEmail] = useState("");
  const [emailDone, setEmailDone] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    await base44.entities.NewsletterSubscriber.create({ email, source: "research_database", status: "active" });
    setEmailDone(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* ── Nav ── */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 bg-gray-950/95 backdrop-blur">
        <Link to="/" className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png" alt="C.O.D.E.X.T.E.C.H." className="h-10 w-10 object-contain" />
          <span className="font-black text-lg tracking-tight hidden sm:block">Research Database</span>
        </Link>
        <a href="/legal" className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-sm font-bold transition-colors">
          Request Access
        </a>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-20 pb-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-gray-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Award size={12} /> Peer-Reviewed Research Archive
        </div>
        <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-5">
          Electromagnetic Research<br />
          <span className="text-cyan-400">Indexed & Searchable</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-4 leading-relaxed">
          Comprehensive archive of 40+ granted patents, 200+ peer-reviewed publications, and publicly available technical reports. Every entry is source-verified and cross-indexed.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-10">
          For engineers, researchers, and institutions requiring rigorous, primary-source technical documentation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <a href="/legal" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black text-base transition-all shadow-lg shadow-cyan-900/40">
            Access Research Archive <ArrowRight size={18} />
          </a>
          <a href="/institutional-licensing" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-bold transition-all">
            <Shield size={16} /> Institutional Licensing
          </a>
        </div>
        <p className="text-xs text-gray-600">NDA required · Institutional access available · Per-seat licensing</p>
      </section>

      {/* ── Content Types ── */}
      <section className="px-6 py-16 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-10">Database Composition</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {CONTENT_TYPES.map((c, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 text-center">
                <p className="text-2xl font-black text-cyan-400 mb-1">{c.count}</p>
                <p className="text-white font-bold text-sm mb-1">{c.type}</p>
                <p className="text-gray-500 text-xs">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research Domains ── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-2">Research Domains Covered</h2>
        <p className="text-gray-500 text-center text-sm mb-12">All entries are peer-reviewed, source-cited, and cross-referenced</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESEARCH_DOMAINS.map((d, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all">
              <span className="text-3xl block mb-3">{d.icon}</span>
              <h3 className="text-white font-bold text-sm mb-2">{d.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Authority Statement ── */}
      <section className="px-6 py-20 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-10">Research Methodology</h2>
          <div className="space-y-4">
            {[
              { title: "Primary Source Only", desc: "All entries are direct citations from granted patents, peer-reviewed journals, or publicly available government documents. No secondary interpretation or synthesis." },
              { title: "Source Verification", desc: "Each patent is cross-referenced with USPTO records. Publications are verified against PubMed, IEEE, and arXiv. Technical reports are sourced from public government archives." },
              { title: "Engineering Focus", desc: "Content is curated for technical precision. Claims are supported by mathematical models, experimental data, or technical specifications." },
              { title: "No Speculation", desc: "The database contains documented research only. Hypothetical or untested theories are excluded." },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle2 size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-bold text-base mb-1">{s.title}</h3>
                  <p className="text-gray-400 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Access Options ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-3">Access Tiers</h2>
        <p className="text-gray-500 text-center text-sm mb-10">Choose the access model that fits your research needs</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              name: "Individual",
              price: "$199/yr",
              features: ["Full patent archive", "200+ publications", "Technical reports", "Search & export"]
            },
            {
              name: "Team (5 seats)",
              price: "$799/yr",
              features: ["Everything in Individual", "Collaborative workspace", "Citation export", "Priority support"],
              highlight: true
            },
            {
              name: "Institutional",
              price: "Custom",
              features: ["Unlimited seats", "API access", "Custom integrations", "SLA guarantee"]
            },
          ].map((tier, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 transition-all ${
                tier.highlight
                  ? "bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-2 border-cyan-600"
                  : "bg-gray-900 border border-gray-800"
              }`}
            >
              <h3 className="text-white font-black text-lg mb-1">{tier.name}</h3>
              <div className="text-2xl font-black text-cyan-400 mb-4">{tier.price}</div>
              <ul className="space-y-2">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-cyan-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="/legal"
                className={`block w-full text-center py-2.5 rounded-lg font-bold text-sm transition-colors mt-6 ${
                  tier.highlight
                    ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                    : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                }`}
              >
                {tier.name === "Institutional" ? "Contact Sales" : "Request Access"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="px-6 py-16 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-black mb-2">Research Updates</h2>
        <p className="text-gray-400 text-sm mb-6">Monthly digest of new patents and publications added to the database.</p>
        {emailDone ? (
          <div className="flex items-center justify-center gap-2 text-green-400 font-bold">
            <CheckCircle2 size={18} /> Subscribed — check your inbox.
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="your@institution.edu" value={email} onChange={e => setEmail(e.target.value)} required
              className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500" />
            <button type="submit" className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm whitespace-nowrap transition-colors">
              Subscribe →
            </button>
          </form>
        )}
        <p className="text-gray-700 text-xs mt-3">No promotional content. Research updates only.</p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-700 text-xs">
        <p>© 2026 Zenith Apex LLC · C.O.D.E.X.T.E.C.H. · Electromagnetic Research Archive</p>
        <div className="flex justify-center gap-6 mt-3">
          <a href="/legal" className="hover:text-gray-400">Access Agreement</a>
          <a href="/institutional-licensing" className="hover:text-gray-400">Institutional Access</a>
          <a href="/" className="hover:text-gray-400">Home</a>
        </div>
      </footer>
    </div>
  );
}