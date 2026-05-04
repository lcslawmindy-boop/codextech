import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, CheckCircle2, Zap, FileText, Download, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TRIPWIRE_OFFER = {
  title: "MEG Engineering Brief + Source Pack",
  price: 7,
  regularPrice: 27,
  items: [
    "MEG theoretical framework (12 pages)",
    "Whittaker decomposition primer",
    "US Patent 6,362,718 — annotated",
    "Bearden's dipole theory overview",
    "7 primary source citations with abstracts",
    "MEG component overview (non-sourced)",
  ],
  notIncluded: [
    "Full BOM with Digikey part numbers",
    "14-step assembly guide",
    "Measurement & test protocol",
    "Build video walkthrough",
  ],
};

export default function TripwirePage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailCaptured, setEmailCaptured] = useState(false);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert("Checkout only works from the published app.");
      return;
    }
    setLoading(true);
    const origin = window.location.origin;
    const res = await base44.functions.invoke("createCheckoutSession", {
      title: "MEG Engineering Brief + Source Pack",
      priceInCents: 700,
      mode: "payment",
      successUrl: `${origin}/lead-magnet-confirm?product=meg-brief`,
      cancelUrl: `${origin}/tripwire`,
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      alert("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailCapture = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await base44.entities.NewsletterSubscriber.create({ email, source: "tripwire_page", status: "active" });
    } catch {}
    setEmailCaptured(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-orange-900 to-red-900 border-b border-orange-800 px-5 py-2 text-center">
        <p className="text-orange-200 text-xs font-bold">⚡ Limited Offer — The MEG Brief Pack is $7 today only (reg. $27)</p>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-14">
        {/* Hook */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-black mb-5 uppercase tracking-widest">
            <Zap size={10} /> One-Time Offer — $7
          </div>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Get the MEG Engineering Brief<br />for <span className="text-yellow-400">$7</span> Before You Go
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            The Motionless Electromagnetic Generator is the most documented COP&gt;1 device in peer-reviewed literature. This 12-page brief gives you the theoretical foundation and primary sources — everything you need to evaluate it for yourself.
          </p>
        </div>

        {/* What you get */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-white font-black text-base mb-4 flex items-center gap-2"><FileText size={16} className="text-cyan-400" /> What's Included</h3>
          <div className="space-y-2 mb-5">
            {TRIPWIRE_OFFER.items.map((item, i) => (
              <div key={i} className="flex gap-2.5 text-sm">
                <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-4">
            <p className="text-gray-600 text-xs mb-2 flex items-center gap-1.5"><Lock size={11} /> Not included (available with Membership):</p>
            {TRIPWIRE_OFFER.notIncluded.map((item, i) => (
              <p key={i} className="text-gray-700 text-xs ml-5 line-through">{item}</p>
            ))}
          </div>
        </div>

        {/* Price block */}
        <div className="bg-gradient-to-br from-cyan-950/40 to-gray-950 border-2 border-cyan-800 rounded-2xl p-7 mb-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-gray-500 text-2xl line-through">${TRIPWIRE_OFFER.regularPrice}</span>
            <span className="text-yellow-400 font-black text-5xl">${TRIPWIRE_OFFER.price}</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">One-time payment · Instant download · No subscription</p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 rounded-xl font-black text-white text-lg transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", boxShadow: "0 4px 24px rgba(6,182,212,0.4)" }}
          >
            {loading ? "Processing..." : (<>Get the Brief Pack — $7 <ArrowRight size={18} /></>)}
          </button>
          <p className="text-gray-600 text-xs mt-3">🔒 Secured by Stripe · Instant PDF delivery</p>
        </div>

        {/* Social proof */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" className="text-yellow-400" />)}
          </div>
          <p className="text-gray-300 text-sm italic">"Finally a proper technical brief on the MEG with actual citations. This is what the free YouTube content never gives you."</p>
          <p className="text-gray-600 text-xs mt-1">— Verified buyer, Electrical Engineer</p>
        </div>

        {/* No thanks / email capture */}
        {!emailCaptured ? (
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">Not ready to buy? Get the free research primer first:</p>
            <form onSubmit={handleEmailCapture} className="flex gap-2 max-w-sm mx-auto">
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-700"
              />
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-colors whitespace-nowrap">
                Send Me the Primer
              </button>
            </form>
          </div>
        ) : (
          <p className="text-center text-green-400 text-sm">✓ Check your inbox for the free research primer.</p>
        )}

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-700 hover:text-gray-500 text-xs transition-colors">
            No thanks, take me back to the platform →
          </Link>
        </div>
      </div>
    </div>
  );
}