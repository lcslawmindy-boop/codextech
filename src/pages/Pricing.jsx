import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Lock, ChevronDown, ChevronUp, Zap, Coins, Shield, BookOpen, FlaskConical, Database, FileText } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { CREDIT_PACKS } from "../lib/creditPacks";
import ProductGrid from "../components/ProductGrid";

const DOSSIER_PACKS = CREDIT_PACKS.map(p => ({
  name: p.name,
  credits: p.credits,
  priceId: p.priceId,
  multiplier: p.multiplier,
  price: p.price,
  color: p.color,
  popular: p.popular,
}));

const FAQS = [
  { q: "How does the credit system work?", a: "Buy credit packs (one-time purchase), then spend credits on any product — courses, Invention Forge sessions, Patent Suite sessions, pitch decks, or research database access. Credits never expire." },
  { q: "Are build plans for sale?", a: "No. Build plans are research documentation only — not for sale. They are blurred and marked 'Not for Sale' throughout the platform. They are provided for educational and experimental study under Fair Use." },
  { q: "Can I buy products without credits?", a: "Yes. Each product page allows direct access. If you don't have enough credits, you'll be prompted to buy a credit pack. One credit ≈ $5–$4.90 depending on the pack." },
  { q: "Do credits expire?", a: "No. Credits never expire. Buy once, use anytime." },
  { q: "Is this real engineering documentation?", a: "Every build plan and research entry cites granted US patents, peer-reviewed journals, or declassified government documents. All content is for educational and research purposes." },
  { q: "Can I cancel or get a refund?", a: "Credit packs are one-time purchases — no subscription to cancel. Unused credits remain in your account permanently. See our refund policy for details." },
];

function FaqItem({ f, i, open, setOpen }) {
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(open === i ? null : i)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-800/40 transition-colors">
        <span className="text-white font-semibold text-sm">{f.q}</span>
        {open === i
          ? <ChevronUp size={15} className="text-cyan-400 flex-shrink-0 ml-3" />
          : <ChevronDown size={15} className="text-slate-500 flex-shrink-0 ml-3" />}
      </button>
      {open === i && <div className="px-5 pb-4 text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-3">{f.a}</div>}
    </div>
  );
}

export default function Pricing() {
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    base44.analytics.track({ eventName: "pricing_page_viewed", properties: { model: "alacarte" } });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/start" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-slate-700" />
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png" alt="Aethon Apex IP" className="h-8 w-8 object-contain" />
            <h1 className="text-white font-black text-base">Products & Credits</h1>
          </div>
        </div>
        <Link to="/referrals" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 hover:bg-green-900/60 text-xs font-bold transition-all">
          <Coins size={13} /> Earn Credits
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-5 pt-14 pb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs font-black mb-6 uppercase tracking-widest">
          <Zap size={12} /> À La Carte — No Memberships
        </div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          Buy Only What<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">You Need.</span>
        </h1>
        <p className="text-slate-400 text-base max-w-xl mx-auto">
          No monthly subscriptions. No tiers. Pick a product, spend credits, get instant access. Build plans are not for sale.
        </p>
      </div>

      {/* Products Grid */}
      <div className="px-5 pb-10 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-cyan-400" />
          <h2 className="text-white font-black text-xl">Products</h2>
          <span className="text-slate-600 text-sm">— buy with credits</span>
        </div>
        <ProductGrid />
      </div>

      {/* Credit Packs */}
      <div className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-black uppercase tracking-widest mb-3">
            <Coins size={11} className="text-yellow-400" /> Buy Credits
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Credit Packs</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Buy credits once — spend them on any product above. Credits never expire. No subscription required.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Coins size={11} className="text-amber-400" /> 1 credit = 1 invention PDF spec</span>
            <span className="flex items-center gap-1"><Coins size={11} className="text-amber-400" /> 2 credits = therapy pod build plan</span>
            <span className="flex items-center gap-1"><Coins size={11} className="text-amber-400" /> 3 credits = master export (3 vols)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DOSSIER_PACKS.map((pack) => (
            <div key={pack.name}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{ border: `1px solid ${pack.color}50`, background: "linear-gradient(160deg,#0d1526,#0a1020)", boxShadow: pack.popular ? `0 0 30px ${pack.color}20` : "none" }}
            >
              {pack.popular && (
                <div className="py-1.5 text-center text-[10px] font-black tracking-widest text-white" style={{ backgroundColor: pack.color }}>
                  BEST VALUE
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: pack.color }}>{pack.multiplier} Credits</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">{pack.name}</span>
                </div>
                <div className="text-4xl font-black mb-1" style={{ color: pack.color }}>${pack.price}</div>
                <p className="text-slate-500 text-xs mb-4">one-time purchase · ${((pack.price / pack.credits)).toFixed(2)}/credit</p>
                <div className="space-y-2 mb-5 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <Coins size={13} style={{ color: pack.color }} />
                    <span>{pack.credits} research credits</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span style={{ color: pack.color }}>⚡</span>
                    <span>Spend on any product or export</span>
                  </div>
                  {pack.multiplier !== "1×" && (
                    <div className="flex items-center gap-2 text-xs text-green-400 font-bold mt-2">
                      <span>✦</span>
                      <span>Save vs Starter @ ${((pack.price / pack.credits)).toFixed(2)}/credit</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={async () => {
                    if (window.self !== window.top) { alert("Checkout only works from the published app."); return; }
                    base44.analytics.track({ eventName: "credit_pack_checkout_clicked", properties: { pack: pack.name, credits: pack.credits } });
                    const res = await base44.functions.invoke("purchaseCredits", {
                      priceId: pack.priceId,
                      packName: pack.name,
                      credits: pack.credits,
                      successUrl: `${window.location.origin}/member-dashboard?credits=purchased`,
                      cancelUrl: `${window.location.origin}/pricing`,
                    });
                    if (res.data?.url) window.location.href = res.data.url;
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-black text-white transition-all hover:opacity-90"
                  style={{ background: `linear-gradient(135deg, ${pack.color}, ${pack.color}99)` }}
                >
                  Get {pack.name} →
                </button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-600 text-xs mt-4">Credits never expire · No subscription · Stack with any purchase</p>
      </div>

      {/* FAQ */}
      <div className="px-5 pb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-6">Questions</h2>
        <div className="space-y-2 mb-12">
          {FAQS.map((f, i) => (
            <FaqItem key={i} f={f} i={i} open={faqOpen} setOpen={setFaqOpen} />
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center bg-slate-900 border border-cyan-800/40 rounded-2xl p-10">
          <h2 className="text-3xl font-black mb-3">Ready to Start?</h2>
          <p className="text-slate-400 mb-8">Buy credits and unlock any product instantly.</p>
          <Link to="/free-vault"
            className="inline-flex items-center justify-center px-10 py-4 rounded-xl font-black text-lg text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)", boxShadow: "0 4px 24px rgba(6,182,212,0.4)" }}>
            Explore Free Vault →
          </Link>
          <p className="text-slate-600 text-xs mt-4">🔒 Secured by Stripe · Credits never expire</p>
        </div>
      </div>

      {/* Legal compliance notice */}
      <div className="bg-amber-950/20 border-t border-amber-900/30 px-6 py-4">
        <p className="text-center text-amber-200/60 text-[11px] leading-relaxed max-w-3xl mx-auto">
          <strong className="text-amber-300/80">Research & Educational Platform Only.</strong> All content is for educational and experimental study. No device described on this platform is approved by the FDA, FCC, or any regulatory authority. AI patent tools are research aids — consult a licensed USPTO patent attorney before filing. Nothing on this platform constitutes medical, legal, or investment advice. Build plans are not for sale.
        </p>
      </div>

      <footer className="border-t border-slate-800 px-6 py-8 text-center text-slate-600 text-xs">
        <p>© 2026 Zenith Apex LLC · Aethon Apex IP</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-slate-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-slate-400">Refund Policy</Link>
          <Link to="/free-vault" className="hover:text-slate-400">Free Vault</Link>
        </div>
      </footer>
    </div>
  );
}