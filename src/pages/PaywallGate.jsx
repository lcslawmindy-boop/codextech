import { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PaywallGate() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    // In production: capture email + send to backend
    setSubmitted(true);
    setTimeout(() => window.location.href = "/pricing", 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* ── Icon ── */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center mx-auto mb-8">
          <Lock size={40} className="text-white" />
        </div>

        {/* ── Content ── */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-3">You're Seeing the Preview</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Full builds, complete BOMs, step-by-step guides, and video assembly are inside the vault. Join thousands of engineers building advanced systems.
          </p>
        </div>

        {/* ── Value list ── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">Membership Includes</p>
          <ul className="space-y-3">
            {[
              "40+ complete build systems with exact BOMs",
              "Full step-by-step assembly videos (3–12 hrs each)",
              "Supplier links & sourcing guides",
              "Weekly new builds added to vault",
              "Private community & investor network",
              "30-day money-back guarantee",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Email capture ── */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="mb-3">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-600 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-black transition-all flex items-center justify-center gap-2">
              Join & View Plans <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 rounded-xl bg-green-950/40 border border-green-800 text-center">
            <p className="text-green-300 font-bold">Redirecting to membership plans...</p>
          </div>
        )}

        {/* ── Secondary CTA ── */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Or browse pricing directly</p>
          <Link to="/pricing" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
            View All Plans <ArrowRight size={14} />
          </Link>
        </div>

        {/* ── Trust signals ── */}
        <div className="text-center mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600 space-x-3">
            <span>🔒 Stripe</span>
            <span>•</span>
            <span>30-day guarantee</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </p>
        </div>
      </div>
    </div>
  );
}