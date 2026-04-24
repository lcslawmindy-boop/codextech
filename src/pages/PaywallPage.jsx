import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  Lock, Zap, Shield, BookOpen, Wrench, Star, Check, ArrowRight,
  Clock, Flame, ChevronDown, ChevronUp, Users, TrendingUp, Award, X
} from "lucide-react";

const COUNTDOWN_KEY = "zarp_founding_deadline";

function getDeadline() {
  let stored = localStorage.getItem(COUNTDOWN_KEY);
  if (!stored) {
    const deadline = Date.now() + 48 * 60 * 60 * 1000;
    localStorage.setItem(COUNTDOWN_KEY, deadline.toString());
    return deadline;
  }
  return parseInt(stored);
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => setTimeLeft(Math.max(0, deadline - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(timeLeft / 3600000);
  const m = Math.floor((timeLeft % 3600000) / 60000);
  const s = Math.floor((timeLeft % 60000) / 1000);
  const pad = n => String(n).padStart(2, "0");
  return { display: `${pad(h)}:${pad(m)}:${pad(s)}`, expired: timeLeft === 0 };
}

const TIERS = [
  {
    id: "member",
    name: "Member",
    monthlyPrice: 99,
    foundingPrice: 49,
    color: "#06b6d4",
    badge: "MOST POPULAR",
    badgeColor: "bg-cyan-600",
    description: "Everything you need to research, build, and patent",
    cta: "Start Building — $49/mo",
    features: [
      "All 40+ advanced build plans (BOM, steps, PDF)",
      "Full course library (40+ courses)",
      "All AI tools: Patent, FTO, Investor Package",
      "Prior Art Archive — 200+ entries",
      "EM Lab simulators & visualizations",
      "Build video generator",
      "50% off all à la carte purchases",
      "Cancel anytime",
    ],
  },
];

const VALUE_STACK = [
  { icon: <Wrench size={18} className="text-orange-400" />, label: "40+ Full Build Plans", value: "$8,000+", desc: "BOM, steps, schematics, PDFs — per plan value $200–$900" },
  { icon: <BookOpen size={18} className="text-blue-400" />, label: "40+ Advanced Courses", value: "$12,000+", desc: "Scalar EM, bioelectromagnetics, patent strategy" },
  { icon: <Shield size={18} className="text-green-400" />, label: "AI Patent Suite", value: "$3,000+", desc: "Provisional drafting, FTO, claims generator" },
  { icon: <TrendingUp size={18} className="text-purple-400" />, label: "Investor Capital Toolkit", value: "$2,500+", desc: "Pitch decks, term sheets, VDR, CRM" },
  { icon: <Star size={18} className="text-yellow-400" />, label: "Prior Art Archive", value: "$1,500+", desc: "200+ categorized entries — years of research" },
  { icon: <Zap size={18} className="text-cyan-400" />, label: "EM Lab Simulators", value: "$800+", desc: "Interactive interference labs, no hardware" },
];

const OBJECTIONS = [
  {
    q: "Is this real engineering or pseudoscience?",
    a: "Every build plan cites peer-reviewed journals, granted US patents, and declassified government documents. The MEG (US Patent 6,362,718) was co-authored by a PhD physicist and published in Foundations of Physics Letters. You're working from primary sources — not YouTube speculation."
  },
  {
    q: "Can I really build these devices?",
    a: "Yes. Every plan includes a full BOM with exact part numbers, specifications, and supplier links. The simpler devices use off-the-shelf components from Digikey, Amazon, and KJ Magnetics. The advanced systems require machining or custom winding — standard fabrication skills."
  },
  {
    q: "What if I don't like it?",
    a: "Cancel any time. No contracts, no commitments. Most members tell us the MEG build plan alone was worth more than 6 months of membership."
  },
  {
    q: "Why is the founding price lower?",
    a: "We're in the first 1,000 members phase. Founding members lock in $49/mo permanently while the platform grows. When we hit 1,000 members, the price returns to $99/mo — no grandfathering."
  },
  {
    q: "How is this different from YouTube / Reddit?",
    a: "This is primary source engineering documentation — not commentary. You get the actual patent schematics, the actual BOM, the actual step-by-step instructions. Zero overlap with free internet content."
  },
];

const SOCIAL_PROOF = [
  { quote: "The MEG build plans alone are worth 10x the membership. Nothing like this exists anywhere else.", name: "R.K.", role: "EE with 20yrs experience", stars: 5 },
  { quote: "Generated my full provisional patent in one session. My attorney said it was the best pre-draft she'd ever reviewed.", name: "A.S.", role: "Independent Inventor", stars: 5 },
  { quote: "I've been studying scalar EM for 20 years. This is the only platform that teaches you to actually build.", name: "M.T.", role: "Independent Researcher", stars: 5 },
];

function ObjectionAccordion() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {OBJECTIONS.map((item, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/50 transition-colors"
          >
            <span className="text-white font-semibold text-sm">{item.q}</span>
            {open === i ? <ChevronUp size={16} className="text-cyan-400 flex-shrink-0 ml-3" /> : <ChevronDown size={16} className="text-gray-500 flex-shrink-0 ml-3" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function PaywallPage() {
  const { display, expired } = useCountdown();
  const [spotsLeft] = useState(847);

  const handleCheckout = async (tier) => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: `ZARP ${tier.name} — Founding Member`,
      priceInCents: tier.foundingPrice * 100,
      description: tier.description,
      category: "membership",
      mode: "subscription",
      interval: "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${tier.id}`,
      cancelUrl: `${baseUrl}/paywall`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Urgency bar */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b border-red-800 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-orange-300 animate-pulse" />
          <span className="text-orange-100 font-semibold">Founding Member pricing expires in</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-white bg-black/50 px-3 py-0.5 rounded-lg font-mono text-lg tracking-widest">
            {expired ? "OFFER CLOSED" : display}
          </span>
          <span className="text-orange-200 text-xs">— {spotsLeft} spots remaining</span>
        </div>
      </div>

      {/* Nav */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png" alt="ZARP" className="h-8 w-8 object-contain" />
          <span className="font-black text-lg">ZARP</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/free-vault" className="text-gray-400 hover:text-white text-sm transition-colors hidden sm:block">Free Vault</Link>
          <a href="#pricing" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold transition-colors">
            See Pricing
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-900/40 border border-red-700 text-red-300 text-xs font-black mb-6 uppercase tracking-widest">
            <Lock size={12} /> You've Hit the Paywall
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            The Engineering Knowledge<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">They Don't Teach Anywhere</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            40+ build plans. 40+ courses. AI patent tools. The world's only platform for scalar EM engineering — built from primary sources, patent filings, and declassified documents.
          </p>
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-yellow-900/30 border border-yellow-700">
            <Award size={16} className="text-yellow-400" />
            <span className="text-yellow-300 text-sm font-bold">Founding Member Rate: <span className="text-white">$49/mo</span> — locks in forever</span>
          </div>
        </div>

        {/* Value Stack */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-2">What You're Getting Access To</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Total à la carte value: <span className="text-white font-bold">$27,800+</span> — yours for $49/mo</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VALUE_STACK.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-white font-bold text-sm">{item.label}</p>
                    <span className="text-green-400 font-black text-sm flex-shrink-0">{item.value}</span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="mb-16">
          <h2 className="text-2xl font-black text-center mb-2">Choose Your Access Level</h2>
          <p className="text-gray-500 text-sm text-center mb-10">Founding price locks in forever. Cancel anytime.</p>

          <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
            {TIERS.map(tier => (
              <div key={tier.id} className="relative bg-gray-900 border-2 border-cyan-600 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/30">
                {/* Badge */}
                <div className={`text-center py-2.5 text-xs font-black tracking-widest text-white ${tier.badgeColor}`}>
                  {tier.badge}
                </div>

                {/* Founding badge */}
                <div className="text-center py-2 bg-yellow-900/40 border-b border-yellow-800 text-yellow-300 text-xs font-bold">
                  🚀 FOUNDING RATE — First 1,000 Members Only
                </div>

                <div className="p-8">
                  <h3 className="text-white font-black text-2xl mb-1">{tier.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{tier.description}</p>

                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-600 line-through">${tier.monthlyPrice}</span>
                    <span className="text-6xl font-black text-cyan-400">${tier.foundingPrice}</span>
                    <span className="text-gray-400 text-base mb-1.5">/month</span>
                  </div>
                  <p className="text-green-400 text-sm font-bold mb-1">Save ${(tier.monthlyPrice - tier.foundingPrice) * 12}/year</p>
                  <p className="text-gray-600 text-xs mb-8">Cancel anytime · Instant access · Secured by Stripe</p>

                  <div className="space-y-2.5 mb-8">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check size={14} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-200 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleCheckout(tier)}
                    className="w-full py-4 rounded-xl font-black text-lg text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: tier.color, boxShadow: `0 4px 24px ${tier.color}50` }}
                  >
                    {tier.cta}
                  </button>

                  <p className="text-center text-gray-600 text-xs mt-4">🔒 Stripe · 256-bit SSL · Cancel anytime</p>
                </div>
              </div>
            ))}
          </div>

          {/* À la carte option */}
          <div className="mt-6 max-w-lg mx-auto text-center">
            <p className="text-gray-500 text-sm mb-3">Not ready for membership? Buy individual plans instead.</p>
            <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors text-sm font-bold">
              Browse À La Carte Plans <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-8">From the Vault Builders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SOCIAL_PROOF.map((t, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Pulse */}
        <div className="mb-16 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 justify-center">
          <div className="text-center">
            <div className="text-4xl font-black text-cyan-400">847</div>
            <div className="text-gray-400 text-sm">founding spots remaining</div>
          </div>
          <div className="w-px h-12 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-4xl font-black text-green-400">153</div>
            <div className="text-gray-400 text-sm">members joined this month</div>
          </div>
          <div className="w-px h-12 bg-gray-700 hidden sm:block" />
          <div className="text-center">
            <div className="text-4xl font-black text-yellow-400">$49</div>
            <div className="text-gray-400 text-sm">locks in forever at this rate</div>
          </div>
        </div>

        {/* Objection Handling */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-3">Questions Before You Join</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Real answers. No marketing fluff.</p>
          <ObjectionAccordion />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-b from-cyan-950/30 to-transparent border border-cyan-900/30 rounded-2xl p-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock size={16} className="text-orange-400" />
            <span className="text-orange-300 font-bold text-sm">Founding rate expires: {display}</span>
          </div>
          <h2 className="text-3xl font-black mb-3">Ready to Build What They Said Was Impossible?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Join 153 engineers and researchers already inside the vault. Lock in your founding rate now.</p>
          <button
            onClick={() => handleCheckout(TIERS[0])}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xl transition-all shadow-xl shadow-cyan-900/40 active:scale-95"
          >
            Unlock Full Access — $49/mo <ArrowRight size={20} />
          </button>
          <p className="text-gray-600 text-xs mt-4">🔒 Secured by Stripe · Cancel anytime · Instant access</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-gray-600 text-xs">
        <p>© 2026 Zenith Apex LLC · Research & educational platform · Not financial or medical advice</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link to="/terms" className="hover:text-gray-400">Terms</Link>
          <Link to="/refund-policy" className="hover:text-gray-400">Refund Policy</Link>
          <Link to="/pricing" className="hover:text-gray-400">Pricing</Link>
        </div>
      </footer>
    </div>
  );
}