import { Link } from "react-router-dom";
import { CheckCircle2, Lock, Flame, ChevronRight, Zap, Star } from "lucide-react";
import { useState } from "react";

const STEPS = [
  {
    num: "01",
    label: "You discover suppressed research",
    desc: "Patents granted but buried. Lab demonstrations witnessed but never published. Gov docs FOIA-released but ignored by mainstream.",
    icon: "🔍",
    neon: "#00ff66",
  },
  {
    num: "02",
    label: "You get the primary source data",
    desc: "40+ patents with full prosecution history. 200+ peer-reviewed citations. Declassified gov reports. Not blogs — actual documents.",
    icon: "📄",
    neon: "#ff6600",
  },
  {
    num: "03",
    label: "You build from proven plans",
    desc: "21+ complete build plans with BOM, schematics, video assembly, and supplier sourcing. Bench prototype in weeks — not years.",
    icon: "🔩",
    neon: "#00ccff",
  },
  {
    num: "04",
    label: "You protect & monetize your IP",
    desc: "AI patent drafting, FTO analysis, investor pitch decks, and the IP marketplace. Turn your build into a patent-protected business.",
    icon: "💰",
    neon: "#ffcc00",
  },
];

const TESTIMONIALS = [
  { name: "Marcus R.", role: "Electrical Engineer", text: "The MEG build plan saved me 6 months of research. The prosecution history alone is worth the price of membership.", stars: 5, plan: "Builder" },
  { name: "Dr. S. Chen", role: "Physics Researcher", text: "I've paid $500+ for single research papers. Getting the entire DOE cold fusion archive for a monthly membership is insane value.", stars: 5, plan: "Pro" },
  { name: "Tyler W.", role: "Independent Inventor", text: "Generated a provisional patent draft in under 10 minutes. My attorney said it was better than most they see from non-lawyers.", stars: 5, plan: "Builder" },
  { name: "Emma D.", role: "Materials Scientist", text: "The prior art archive is the best I've found anywhere. Bearden's work indexed and cross-referenced — incredible resource.", stars: 5, plan: "Researcher" },
];

export default function ConversionFunnel() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section
      className="px-6 py-16 border-b border-white/10"
      style={{ background: "linear-gradient(180deg, #010301 0%, #050505 100%)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{
              border: "2px solid #00ff66",
              background: "rgba(0,255,100,0.08)",
              boxShadow: "0 0 24px rgba(0,255,100,0.3)",
            }}
          >
            <Flame size={13} style={{ color: "#00ff66" }} />
            <span className="text-xs font-black tracking-widest" style={{ color: "#00ff66" }}>
              THE ZENITH APEX VALUE PATH
            </span>
          </div>
          <h2
            className="text-4xl font-black mb-4"
            style={{ color: "#fff", textShadow: "0 0 40px rgba(0,255,100,0.3)" }}
          >
            Here's What You Actually Get
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Most researchers spend years finding what we've already compiled. Here's the path from first discovery to working prototype to patented IP.
          </p>
        </div>

        {/* Funnel steps */}
        <div className="space-y-4 mb-16">
          {STEPS.map((step, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(activeStep === i ? null : i)}
              style={{
                background: activeStep === i
                  ? `linear-gradient(135deg, ${step.neon}15 0%, rgba(0,0,0,0.8) 100%)`
                  : "rgba(0,0,0,0.6)",
                border: `2px solid ${activeStep === i ? step.neon : step.neon + "44"}`,
                borderRadius: "16px",
                padding: "20px 24px",
                cursor: "pointer",
                boxShadow: activeStep === i
                  ? `0 0 40px ${step.neon}44, 0 8px 30px rgba(0,0,0,0.6)`
                  : `0 0 10px ${step.neon}22`,
                transition: "all 0.3s ease",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "12px",
                    background: `${step.neon}22`,
                    border: `2px solid ${step.neon}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    flexShrink: 0,
                    boxShadow: `0 0 16px ${step.neon}66`,
                  }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ color: step.neon, fontSize: "10px", fontWeight: "900", letterSpacing: "0.15em" }}>
                      STEP {step.num}
                    </span>
                  </div>
                  <p className="font-black text-white text-base">{step.label}</p>
                </div>
                <ChevronRight
                  size={18}
                  style={{
                    color: step.neon,
                    transform: activeStep === i ? "rotate(90deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                  }}
                />
              </div>
              {activeStep === i && (
                <div
                  style={{
                    marginTop: "12px",
                    paddingTop: "12px",
                    borderTop: `1px solid ${step.neon}33`,
                  }}
                >
                  <p style={{ color: "#ccc", fontSize: "13px", lineHeight: "1.7" }}>{step.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Value breakdown */}
        <div
          className="rounded-2xl p-8 mb-12"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,100,0.05) 0%, rgba(255,100,0,0.05) 100%)",
            border: "2px solid rgba(0,255,100,0.3)",
            boxShadow: "0 0 40px rgba(0,255,100,0.1), 0 0 40px rgba(255,100,0,0.08)",
          }}
        >
          <h3 className="text-xl font-black text-white mb-6 text-center">What This Would Cost You Elsewhere</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { item: "Patent prosecution history research", cost: "$3,000–$8,000", included: true },
              { item: "FOIA document retrieval + analysis", cost: "$1,500–$4,000", included: true },
              { item: "Custom build plan from engineer", cost: "$2,000–$5,000 each", included: true },
              { item: "Structured research modules", cost: "$500–$2,000 each", included: true },
              { item: "AI patent drafting tool", cost: "$400/month elsewhere", included: true },
              { item: "IP marketplace + deal brokering", cost: "5–15% commission", included: true },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "rgba(0,0,0,0.4)",
                  border: "1px solid rgba(0,255,100,0.2)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                }}
              >
                <CheckCircle2 size={16} style={{ color: "#00ff66", flexShrink: 0 }} />
                <div>
                  <p style={{ color: "#ddd", fontSize: "12px", fontWeight: "700" }}>{item.item}</p>
                  <p style={{ color: "#ff6600", fontSize: "11px" }}>Market rate: {item.cost}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p style={{ color: "#888", fontSize: "13px", marginBottom: "4px" }}>Total market value: <span style={{ color: "#ff6600", fontWeight: "900", fontSize: "18px" }}>$14,000+</span></p>
            <p style={{ color: "#fff", fontWeight: "900", fontSize: "22px" }}>Your membership: <span style={{ color: "#00ff66", textShadow: "0 0 20px #00ff66" }}>From $49/mo</span></p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h3 className="text-xl font-black text-white mb-6 text-center">What Members Say</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(0,255,100,0.2)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", marginBottom: "8px" }}>
                  {[...Array(t.stars)].map((_, s) => (
                    <Star key={s} size={12} style={{ color: "#ffcc00", fill: "#ffcc00" }} />
                  ))}
                </div>
                <p style={{ color: "#ccc", fontSize: "12px", lineHeight: "1.6", marginBottom: "10px", fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ color: "#fff", fontSize: "12px", fontWeight: "900" }}>{t.name}</p>
                    <p style={{ color: "#666", fontSize: "10px" }}>{t.role}</p>
                  </div>
                  <span style={{
                    background: "rgba(0,255,100,0.15)",
                    border: "1px solid rgba(0,255,100,0.5)",
                    borderRadius: "6px",
                    padding: "2px 8px",
                    color: "#00ff66",
                    fontSize: "9px",
                    fontWeight: "900",
                    letterSpacing: "0.1em",
                  }}>
                    {t.plan} MEMBER
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Big CTA */}
        <div
          className="rounded-2xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,100,0.12) 0%, rgba(255,100,0,0.08) 100%)",
            border: "3px solid #00ff66",
            boxShadow: "0 0 60px rgba(0,255,100,0.3), 0 0 120px rgba(0,255,100,0.1)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(255,100,0,0.2)", border: "1px solid #ff6600" }}
          >
            <Flame size={13} style={{ color: "#ff6600" }} />
            <span style={{ color: "#ff6600", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em" }}>
              97/100 MEMBERS — 3 SPOTS TO NEXT DROP
            </span>
          </div>
          <h2 className="text-3xl font-black text-white mb-3" style={{ textShadow: "0 0 30px rgba(0,255,100,0.4)" }}>
            Join Now. Trigger the Next Drop.
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
            The next member to join at member #98, 99, or 100 unlocks a brand-new unreleased course for the entire community. Be part of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subscribe"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-black text-lg"
              style={{
                background: "linear-gradient(90deg, #00ff66, #00cc44)",
                color: "#000",
                boxShadow: "0 0 50px rgba(0,255,100,0.6), 0 8px 30px rgba(0,0,0,0.5)",
              }}
            >
              <Zap size={20} /> Join Now — From $49/mo
            </Link>
            <Link
              to="/free-vault"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-sm"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "2px solid rgba(0,255,100,0.4)",
                color: "#00ff66",
              }}
            >
              Explore Free Content First →
            </Link>
          </div>
          <p style={{ color: "#555", fontSize: "11px", marginTop: "16px" }}>
            Cancel anytime · No contracts · Instant archive access
          </p>
        </div>
      </div>
    </section>
  );
}