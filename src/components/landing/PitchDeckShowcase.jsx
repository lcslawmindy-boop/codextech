import { Link } from "react-router-dom";
import { Play, Star, TrendingUp, DollarSign, Users, Zap, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    num: "01",
    title: "Executive Summary",
    desc: "AI-generated one-liner, mission statement, and invention category classification",
    color: "#00ccff",
    preview: "Your invention in 3 sentences. TAM identified. Problem-solution mapped.",
  },
  {
    num: "02",
    title: "Market Opportunity",
    desc: "TAM / SAM / SOM analysis with $B projections and growth trajectory",
    color: "#00ff66",
    preview: "$47B TAM · $3.2B SAM · 18% CAGR · First-mover advantage mapped",
  },
  {
    num: "03",
    title: "IP & Patent Landscape",
    desc: "FTO analysis, patent family tree, competitive moat assessment",
    color: "#cc00ff",
    preview: "US6,362,718 cited · 4 design-arounds identified · 12-year protection window",
  },
  {
    num: "04",
    title: "IP Valuation",
    desc: "$5M–$150M range with DCF model, comparable licensing deals, and risk-adjusted NPV",
    color: "#ffcc00",
    preview: "Base case: $28M · Upside: $94M · Licensing revenue: $2.1M/yr at 3% royalty",
  },
  {
    num: "05",
    title: "Go-To-Market Roadmap",
    desc: "12-month milestone calendar with funding stages, licensing targets, and pivots",
    color: "#ff6600",
    preview: "Q1: Provisional filing · Q2: SBIR submission · Q3: Licensing outreach · Q4: Close",
  },
  {
    num: "06",
    title: "The Ask",
    desc: "Funding ask, use of proceeds, equity offered, and investor return projections",
    color: "#ff3366",
    preview: "Seeking $250K seed · 8% equity · 5-year exit target: $12M–$40M",
  },
];

export default function PitchDeckShowcase() {
  return (
    <section
      className="px-6 py-20 border-b border-white/10"
      style={{ background: "linear-gradient(180deg, #000 0%, #030006 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
            style={{
              border: "2px solid #ff6600",
              background: "rgba(255,100,0,0.07)",
              boxShadow: "0 0 24px rgba(255,100,0,0.3)",
            }}
          >
            <Play size={13} style={{ color: "#ff6600" }} />
            <span className="text-xs font-black tracking-widest" style={{ color: "#ff6600" }}>
              3D PITCH DECK BUILDER — AI-POWERED
            </span>
          </div>
          <h2
            className="text-4xl font-black mb-4"
            style={{
              background: "linear-gradient(135deg, #ff6600, #ffcc00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Investor-Grade Pitch Decks.
            <br />
            <span style={{ color: "#fff", WebkitTextFillColor: "#fff" }}>Generated in Under 5 Minutes.</span>
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            Replace a $5,000 pitch deck consultant with an AI system that knows your IP, your market, and your valuation — and builds all 6 slides automatically.
          </p>
        </div>

        {/* Slide showcase — 3D stack visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {SLIDES.map((s, i) => (
            <div
              key={i}
              style={{
                background: "#000",
                border: `2px solid ${s.color}44`,
                borderRadius: "14px",
                overflow: "hidden",
                position: "relative",
                boxShadow: `0 4px 30px ${s.color}15`,
              }}
            >
              {/* Slide number header */}
              <div
                style={{
                  padding: "12px 16px",
                  background: `${s.color}10`,
                  borderBottom: `1px solid ${s.color}33`,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px", fontWeight: "900", color: s.color,
                    background: `${s.color}20`, border: `1px solid ${s.color}`,
                    padding: "2px 8px", borderRadius: "5px", letterSpacing: "0.1em",
                  }}
                >
                  SLIDE {s.num}
                </span>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "13px" }}>{s.title}</span>
              </div>

              {/* Preview */}
              <div
                style={{
                  margin: "12px 14px",
                  padding: "12px",
                  borderRadius: "8px",
                  background: `${s.color}08`,
                  border: `1px solid ${s.color}22`,
                  minHeight: "60px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p style={{ color: s.color, fontSize: "11px", fontWeight: "700", lineHeight: "1.6" }}>
                  {s.preview}
                </p>
              </div>

              <div style={{ padding: "0 14px 14px" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", lineHeight: "1.6" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div
          className="rounded-2xl p-8 mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,100,0,0.08), rgba(0,0,0,0.6))",
            border: "2px solid rgba(255,100,0,0.4)",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: TrendingUp, val: "$3K–$15K", label: "Saved vs. Consultant", color: "#00ff66" },
              { icon: DollarSign, val: "$5M–$150M", label: "IP Valuation Range Generated", color: "#ffcc00" },
              { icon: Users, val: "∞ Investors", label: "Share-Ready PDF Export", color: "#00ccff" },
              { icon: Zap, val: "< 5 min", label: "Full Deck Generation Time", color: "#ff6600" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i}>
                  <Icon size={24} style={{ color: item.color, margin: "0 auto 8px" }} />
                  <p style={{ color: item.color, fontWeight: "900", fontSize: "20px", textShadow: `0 0 16px ${item.color}` }}>{item.val}</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/pitch-deck-builder"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-black text-base"
            style={{
              background: "linear-gradient(90deg, #ff6600, #ffcc00)",
              color: "#000",
              boxShadow: "0 0 40px rgba(255,100,0,0.4)",
            }}
          >
            <Play size={18} /> Build My Pitch Deck Now <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}