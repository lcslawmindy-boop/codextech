import { useEffect, useRef } from "react";

const ITEMS = [
  { color: "#a855f7", icon: "⚗️", tag: "BUILD PLANS", title: "40+ Invention Build Plans", sub: "Full BOM · Schematics · Assembly guides · Patent-sourced" },
  { color: "#06b6d4", icon: "📜", tag: "PATENT SUITE", title: "USPTO Patent Drafting Wizard", sub: "Provisional & utility · Attorney-grade AI output" },
  { color: "#22c55e", icon: "📚", tag: "COURSES", title: "40+ Engineering Courses", sub: "RF · FPGA · Resonance · Bioelectromagnetics · Scalar EM" },
  { color: "#fbbf24", icon: "⚡", tag: "INVENTION FORGE", title: "AI Hybrid IP Generator", sub: "Merge 2–4 devices → novel patentable concept + valuation" },
  { color: "#f97316", icon: "🔬", tag: "RESEARCH ARCHIVE", title: "200+ Prior Art Entries", sub: "Tesla · Bearden · Priore · KRCIC · MEG · Kaznacheyev" },
  { color: "#ec4899", icon: "🔐", tag: "VDR ROOM", title: "Virtual Data Room", sub: "NDA-gated · Audit trail · DocuSign · Investor packages" },
  { color: "#3b82f6", icon: "🛡️", tag: "IP MONITORING", title: "Patent Threat Monitor", sub: "Real-time alerts · Competitive landscape · Risk scoring" },
  { color: "#14b8a6", icon: "🕸️", tag: "CONCEPT GRAPH", title: "EM Concept Network", sub: "100+ nodes · Scalar EM · Free energy · Interactive map" },
  { color: "#8b5cf6", icon: "🧪", tag: "LAB SIM", title: "Scalar EM Lab Simulator", sub: "Dual-source interference · Resonance · Field mapping" },
  { color: "#f59e0b", icon: "👥", tag: "COMMUNITY", title: "Researcher Forum & Q&A", sub: "Build troubleshooting · Patent strategy · Co-inventor matching" },
  { color: "#a855f7", icon: "📐", tag: "TECH SPECS", title: "Calibrated BOM & Schematics", sub: "Exact part numbers · Digikey · Mouser · Amazon verified" },
  { color: "#06b6d4", icon: "🤖", tag: "AI ATTORNEY", title: "AI Patent Attorney Chat", sub: "IP strategy · FTO research · Claim drafting support" },
  { color: "#22c55e", icon: "💰", tag: "IP VALUATION", title: "IP Valuation Estimator", sub: "$M–$B range · Sector benchmarking · Licensing comps" },
  { color: "#f97316", icon: "🌐", tag: "MARKETPLACE", title: "IP Marketplace Listings", sub: "Anonymous listings · Licensing · Co-inventor search" },
  { color: "#ec4899", icon: "📊", tag: "INVESTOR CRM", title: "Investor Pipeline CRM", sub: "Stage tracking · Outreach log · Term sheet management" },
];

const ALL_ITEMS = [...ITEMS, ...ITEMS];

export default function HorizontalFeatureScroller({ label = "Everything Included" }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const SPEED = 0.7;
    const CARD_W = 252; // card width + gap
    const singleWidth = ITEMS.length * CARD_W;

    const step = () => {
      posRef.current += SPEED;
      if (posRef.current >= singleWidth) posRef.current -= singleWidth;
      if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="w-full overflow-hidden py-6 border-y border-slate-800 bg-slate-950/80 relative">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #020617, transparent)" }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #020617, transparent)" }} />

      {/* Label */}
      <div className="text-center mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
      </div>

      {/* Scrolling track */}
      <div className="relative" style={{ height: 88 }}>
        <div ref={trackRef} style={{ display: "flex", position: "absolute", top: 0, left: 0, willChange: "transform", gap: 8 }}>
          {ALL_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: 244,
                padding: "10px 13px",
                border: `1px solid ${item.color}45`,
                borderRadius: 10,
                background: "#050d1a",
                boxShadow: `0 0 12px ${item.color}18`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top neon bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
              }} />

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>{item.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                    <span style={{
                      fontSize: 7, fontWeight: 900, letterSpacing: "0.12em",
                      color: "#000", background: item.color, padding: "1px 5px",
                      borderRadius: 3, textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <p style={{
                    color: item.color, fontSize: 11, fontWeight: 800,
                    lineHeight: 1.2, marginBottom: 3, whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis",
                    textShadow: `0 0 8px ${item.color}66`,
                  }}>
                    {item.title}
                  </p>
                  <p style={{
                    color: "#475569", fontSize: 9, lineHeight: 1.3,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {item.sub}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}