import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Zap, Shield, BookOpen, Download, Users, Star, Lock, ChevronRight, Sparkles, FlaskConical, Briefcase, Mail, Activity, CheckCircle2, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";

const INDIVIDUAL_BUILDS = [
  { name: "Scalar EM Lab Starter Kit", price: 167, category: "Build Plan", icon: "⚡" },
  { name: "G-Com Scalar Communicator Parts", price: 243, category: "Build Plan", icon: "📡" },
  { name: "EMF Protection & Shielding Kit", price: 89, category: "Build Plan", icon: "🛡️" },
  { name: "Prioré Device Component Bundle", price: 349, category: "Build Plan", icon: "📡" },
  { name: "MEG Replication Parts Kit", price: 287, category: "Build Plan", icon: "⚙️" },
  { name: "TRD-1 Telomere Device Build Kit", price: 194, category: "Build Plan", icon: "🧬" },
  { name: "TRZ Reactor Starter Components", price: 389, category: "Build Plan", icon: "⭐" },
  { name: "Advanced EM Assembly Tool Kit", price: 127, category: "Build Plan", icon: "🔧" },
];

const INDIVIDUAL_COURSES = [
  { name: "Scalar Electromagnetics Fundamentals", price: 49, category: "Course", icon: "📚" },
  { name: "Bearden Energy from the Vacuum Theory", price: 49, category: "Course", icon: "📖" },
  { name: "Building EM Device Prototypes", price: 49, category: "Course", icon: "🔬" },
  { name: "Patent Strategy for Energy Inventors", price: 49, category: "Course", icon: "⚖️" },
  { name: "Quantum Field Theory Essentials", price: 49, category: "Course", icon: "🌌" },
  { name: "Bioelectromagnetics & Health", price: 49, category: "Course", icon: "💊" },
  { name: "Prior Art Research & Analysis", price: 49, category: "Course", icon: "🔍" },
  { name: "Investor Pitch Fundamentals", price: 49, category: "Course", icon: "💼" },
];

const SUBSCRIPTION_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: 47,
    color: "#f59e0b",
    description: "Core research + 5 device plans",
    features: [
      "5 Invention Build Plans (full PDFs + BOMs)",
      "4 Structured Courses",
      "Prior Art Archive (200+ entries)",
      "EM Lab Simulators",
      "Step-by-step assembly guides",
      "Cancel anytime",
    ],
    locked: ["AI Invention Forge", "All 21+ Plans", "Full Course Library", "Patent Drafting Tool"],
  },
  {
    id: "researcher",
    name: "Researcher",
    price: 97,
    color: "#6366f1",
    badge: "MOST POPULAR",
    description: "All plans + AI tools + course library",
    features: [
      "All 21+ Invention Build Plans",
      "26+ Structured Courses (all content)",
      "AI Invention Forge (unlimited)",
      "AI Patent Claims Generator",
      "EM Lab simulators & visualization",
      "Prior Art Archive with AI search",
      "Build Video generator",
      "IP Valuation & FTO Analysis",
      "Cancel anytime",
    ],
    locked: ["Patent Drafting Tool", "Investor CRM", "VDR Portal"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 247,
    color: "#22c55e",
    description: "Everything + IP suite + investor tools",
    features: [
      "Everything in Researcher",
      "AI Patent Drafting Tool (unlimited)",
      "Investor CRM & Pitch Deck Builder",
      "Virtual Data Room (VDR)",
      "Acquisition CRM & pipeline management",
      "IP Portfolio Health Dashboard",
      "Co-Inventor Matching Network",
      "Priority support",
      "Cancel anytime",
    ],
    locked: [],
  },
];

function ItemCard({ item }) {
  const handleCheckout = async () => {
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: item.name,
      priceInCents: item.price * 100,
      description: item.category,
      category: "one_time",
      mode: "payment",
      successUrl: `${baseUrl}/checkout?success=true&product=${item.name}`,
      cancelUrl: `${baseUrl}/pricing`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{item.icon}</span>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{item.category}</span>
      </div>
      <h3 className="text-white font-bold text-sm leading-snug mb-3 flex-1">{item.name}</h3>
      <div className="flex items-end justify-between">
        <span className="text-yellow-400 font-black text-lg">${item.price}</span>
        <button
          onClick={handleCheckout}
          className="px-3 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-bold transition-all"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

function PlanCard({ plan }) {
  const isPopular = plan.badge === "MOST POPULAR";

  const handleCheckout = async () => {
    if (window !== window.top) {
      alert("Checkout only works from the published app. Please open the app directly.");
      return;
    }
    const baseUrl = window.location.origin;
    const response = await base44.functions.invoke("createCheckoutSession", {
      title: plan.name,
      priceInCents: plan.price * 100,
      description: plan.description,
      category: "membership",
      mode: "subscription",
      interval: "month",
      successUrl: `${baseUrl}/checkout?success=true&product=${plan.id}`,
      cancelUrl: `${baseUrl}/pricing`,
    });
    if (response.data?.url) window.location.href = response.data.url;
  };

  return (
    <div
      className={`relative bg-gray-900 rounded-2xl border overflow-hidden flex flex-col ${
        isPopular ? "border-indigo-600 shadow-xl shadow-indigo-900/20 scale-105" : "border-gray-800"
      }`}
    >
      {plan.badge && (
        <div
          className="text-center py-2 text-xs font-black tracking-widest"
          style={{ backgroundColor: plan.color + "25", color: plan.color }}
        >
          {plan.badge}
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-black text-xl mb-1">{plan.name}</h3>
        <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
        <div className="flex items-end gap-1 mb-1">
          <span className="text-4xl font-black" style={{ color: plan.color }}>
            ${plan.price}
          </span>
          <span className="text-gray-500 text-sm mb-1">/month</span>
        </div>
        <p className="text-gray-600 text-xs mb-5">Cancel anytime • No long-term commitment</p>

        <div className="space-y-2 mb-6 flex-1">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2">
              <Check size={12} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              <span className="text-gray-300 text-xs leading-relaxed">{f}</span>
            </div>
          ))}
          {plan.locked.map((f, i) => (
            <div key={i} className="flex items-start gap-2 opacity-40">
              <Lock size={12} className="flex-shrink-0 mt-0.5 text-gray-600" />
              <span className="text-gray-600 text-xs line-through">{f}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          className="w-full py-3 rounded-xl font-black text-sm transition-all text-white"
          style={{
            backgroundColor: plan.color,
            boxShadow: `0 4px 20px ${plan.color}40`,
          }}
        >
          {plan.name === "Researcher" ? `Go with Researcher — $${plan.price}/mo` : `Upgrade to ${plan.name} — $${plan.price}/mo`}
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <h1 className="text-white font-black text-lg">ZARP Pricing</h1>
      </div>

      {/* Hero */}
      <div className="text-center px-5 py-12 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black leading-tight mb-4">
          Build Your IP Empire<br />
          <span className="text-cyan-400">Buy Plans à la Carte or Subscribe</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
          Purchase individual build plans and courses on-demand, or save big with a monthly subscription for unlimited access to everything.
        </p>
      </div>

      <div className="px-5 pb-12 max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-950/60 border border-red-800 rounded-xl p-4 mb-6 text-red-300 text-sm text-center">{error}</div>
        )}

        {/* ── À LA CARTE SECTION ── */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart size={24} className="text-yellow-400" />
            <div>
              <h3 className="text-white font-black text-2xl">Build Plans & Courses</h3>
              <p className="text-gray-500 text-sm">Buy individual items — $49 each, lifetime access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
            {[...INDIVIDUAL_BUILDS, ...INDIVIDUAL_COURSES].map((item, i) => (
              <ItemCard key={i} item={item} />
            ))}
          </div>
        </div>

        {/* ── SUBSCRIPTION TIERS ── */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <Flame size={24} className="text-red-400" />
            <div>
              <h3 className="text-white font-black text-2xl">Monthly Subscriptions</h3>
              <p className="text-gray-500 text-sm">Unlimited access for one low monthly price — better value than buying à la carte</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>

        {/* Value comparison banner */}
        <div className="bg-gradient-to-r from-cyan-950/30 to-indigo-950/30 border border-cyan-800/30 rounded-2xl p-6 text-center">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-cyan-300">💡 Smart Move:</strong> Buy 2–3 individual plans at $49 each = $98–$147. Or get unlimited access to all 21+ plans, 26+ courses, and AI tools for just <strong className="text-cyan-300">$97/mo</strong> with Researcher. The subscription pays for itself in your first month.
          </p>
        </div>
      </div>
    </div>
  );
}

function ShoppingCart({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
  );
}