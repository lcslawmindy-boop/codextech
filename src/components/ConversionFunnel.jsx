import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight, ArrowRight, Star, Database, Wrench, Shield, TrendingUp } from "lucide-react";
import { useState } from "react";

const STEPS = [
  {
    num: "01",
    label: "Access the primary source record",
    desc: "40+ granted US patents with full prosecution history. 200+ peer-reviewed citations. Declassified government reports. Direct links to USPTO, journals, and OSTI archives.",
    color: "#00ccff",
  },
  {
    num: "02",
    label: "Study the engineering frameworks",
    desc: "8 structured research modules. Each one covers theoretical basis, system architecture, BOM, assembly procedure, and measurement protocols. Not conceptual — engineering-grade.",
    color: "#00ff99",
  },
  {
    num: "03",
    label: "Build from proven plans",
    desc: "6 complete build systems with verified component lists and supplier sourcing. Physical kits available for the MEG, Prioré chamber, scalar transmitter, and more.",
    color: "#ff9900",
  },
  {
    num: "04",
    label: "Protect and commercialize your IP",
    desc: "AI patent drafting tool generates USPTO-compliant provisional applications. FTO analysis. Anonymous IP marketplace for listing or investing. 5% commission on closed deals only.",
    color: "#cc44ff",
  },
];

const TESTIMONIALS = [
  { name: "Marcus R.", role: "Electrical Engineer", text: "The MEG build plan saved me 6 months of research. The prosecution history alone is worth the membership price.", stars: 5 },
  { name: "Dr. S. Chen", role: "Physics Researcher", text: "I've paid $500+ for single research papers. Getting the full archive for $49/month is not something I expected to find.", stars: 5 },
  { name: "Tyler W.", role: "Independent Inventor", text: "Generated a provisional patent draft in under 10 minutes. My attorney said it was better than most from non-lawyers.", stars: 5 },
  { name: "Emma D.", role: "Materials Scientist", text: "The prior art archive is the best I've found anywhere. Bearden's work indexed and cross-referenced.", stars: 5 },
];

export default function ConversionFunnel() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section className="px-6 py-20 border-b border-white/10 solid-section">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">How It Works</p>
          <h2 className="text-4xl font-black text-white mb-4">From Research to Working Prototype</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Most researchers spend years finding what's already compiled here. Here's the path from first discovery to patent-protected IP.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-16">
          {STEPS.map((step, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              className="rounded-2xl p-5 cursor-pointer transition-all"
              style={{
                background: activeStep === i ? `${step.color}10` : "rgba(0,0,0,0.4)",
                border: `1.5px solid ${activeStep === i ? step.color : step.color + "33"}`,
                boxShadow: activeStep === i ? `0 0 30px ${step.color}22` : "none",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: `${step.color}18`, border: `1.5px solid ${step.color}`, color: step.color }}
                >
                  {step.num}
                </div>
                <p className="font-black text-white text-base flex-1">{step.label}</p>
                <ChevronRight
                  size={16}
                  style={{
                    color: step.color,
                    transform: activeStep === i ? "rotate(90deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                />
              </div>
              {activeStep === i && (
                <p className="text-gray-300 text-sm mt-3 pt-3 leading-relaxed"
                  style={{ borderTop: `1px solid ${step.color}22` }}>
                  {step.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Value breakdown */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 mb-14">
          <h3 className="text-xl font-black text-white mb-6 text-center">What This Costs Elsewhere</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {[
              { item: "Patent prosecution history research", cost: "$3,000–$8,000" },
              { item: "FOIA document retrieval + analysis", cost: "$1,500–$4,000" },
              { item: "Custom build plan from engineer", cost: "$2,000–$5,000 each" },
              { item: "Structured research modules", cost: "$500–$2,000 each" },
              { item: "AI patent drafting tool", cost: "$400/month elsewhere" },
              { item: "IP marketplace + deal brokering", cost: "5–15% commission" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-black/30 border border-gray-800 rounded-xl px-4 py-3">
                <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-200 text-xs font-bold">{item.item}</p>
                  <p className="text-orange-400 text-xs">Market rate: {item.cost}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center pt-4 border-t border-gray-800">
            <p className="text-gray-500 text-sm mb-1">Total market value: <span className="text-orange-400 font-black text-xl">$14,000+</span></p>
            <p className="text-white font-black text-2xl">Your membership: <span className="text-cyan-400">$49/mo</span></p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-14">
          <h3 className="text-xl font-black text-white mb-6 text-center">What Members Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} size={12} style={{ color: "#ffcc00", fill: "#ffcc00" }} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="text-white text-sm font-black">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gray-900/60 border border-cyan-900/50 rounded-2xl p-10"
          style={{ boxShadow: "0 0 60px rgba(0,200,255,0.08)" }}>
          <h2 className="text-3xl font-black text-white mb-3">Join the Research Database</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
            Full access to everything. $49/month. Cancel anytime. No contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-base text-black transition-all hover:scale-105"
              style={{
                background: "linear-gradient(90deg, #00ccff, #00ff99)",
                boxShadow: "0 4px 32px rgba(0,200,255,0.3)",
              }}
            >
              Start for $49/month <ArrowRight size={16} />
            </Link>
            <Link
              to="/free-vault"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors"
            >
              Free preview first
            </Link>
          </div>
          <p className="text-gray-700 text-xs mt-4">Secured by Stripe · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}