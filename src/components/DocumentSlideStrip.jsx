import { useEffect, useRef } from "react";

// PDF page images extracted from the two uploaded documents
const DOC_SLIDES = [
  // AetherLink G-Node L1 — 7 pages
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 1 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 2 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 3 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 4 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 5 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 6 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/a89763389_AetherLink_G-Node_L1_full_report1.pdf", label: "AetherLink G-Node L1", page: 7 },
  // AionFlux MCCS — 6 pages
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/897946ce3_AionFlux_MCCS_Telomeric_Regeneration_System_full_report2.pdf", label: "AionFlux MCCS", page: 1 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/897946ce3_AionFlux_MCCS_Telomeric_Regeneration_System_full_report2.pdf", label: "AionFlux MCCS", page: 2 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/897946ce3_AionFlux_MCCS_Telomeric_Regeneration_System_full_report2.pdf", label: "AionFlux MCCS", page: 3 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/897946ce3_AionFlux_MCCS_Telomeric_Regeneration_System_full_report2.pdf", label: "AionFlux MCCS", page: 4 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/897946ce3_AionFlux_MCCS_Telomeric_Regeneration_System_full_report2.pdf", label: "AionFlux MCCS", page: 5 },
  { url: "https://media.base44.com/files/public/69ccefebfea78b23498c66a8/897946ce3_AionFlux_MCCS_Telomeric_Regeneration_System_full_report2.pdf", label: "AionFlux MCCS", page: 6 },
];

// Rendered page images via pdf.js CDN embed trick — use object/iframe per page
// Since we can't render PDF pages as images directly, we'll show styled cards with doc info
const CARD_DATA = [
  { title: "AetherLink G-Node L1", subtitle: "Cover · Longitudinal-wave mesh comms", color: "#06b6d4", tag: "INVENTION" },
  { title: "Technical Overview", subtitle: "Dual-conjugate bifilar coils, BST insert, TRZ protocol", color: "#06b6d4", tag: "TECH SPEC" },
  { title: "The Problem", subtitle: "No compact through-earth mesh node exists", color: "#06b6d4", tag: "PROBLEM" },
  { title: "Build Steps 1–5", subtitle: "HV safety → coil winding → BST insert → GaN pulser → FPGA", color: "#06b6d4", tag: "BUILD" },
  { title: "Build Steps 6–10", subtitle: "Wiring → potting → TRZ calibration → emission mask test", color: "#06b6d4", tag: "BUILD" },
  { title: "Bill of Materials", subtitle: "7 line items · Total BOM: $1,245", color: "#06b6d4", tag: "BOM" },
  { title: "Derived Products", subtitle: "Plans $2,400 · License $18,000 · SBIR Package $5,500", color: "#06b6d4", tag: "PRODUCTS" },
  { title: "AionFlux MCCS System", subtitle: "Cover · Telomeric Regeneration · $185K clinical system", color: "#a855f7", tag: "INVENTION" },
  { title: "Technical Overview", subtitle: "Phase-conjugate pumps, Halbach bias, MCCS closed-loop", color: "#a855f7", tag: "TECH SPEC" },
  { title: "The Problem", subtitle: "No device targets the EM blueprint layer of cellular aging", color: "#a855f7", tag: "PROBLEM" },
  { title: "Build Steps 1–5", subtitle: "Medical chassis → resonator cores → pump coils → Halbach → RF drive", color: "#a855f7", tag: "BUILD" },
  { title: "Bill of Materials", subtitle: "9 line items · Total BOM: $8,200", color: "#a855f7", tag: "BOM" },
  { title: "Derived Products", subtitle: "Plans $4,500 · Protocol Bundle $2,500 · Clinical License $24K", color: "#a855f7", tag: "PRODUCTS" },
];

const ALL_CARDS = [...CARD_DATA, ...CARD_DATA];

export default function DocumentSlideStrip() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const SPEED = 0.35;
    const CARD_H = 170; // card height + gap
    const singleSetHeight = CARD_DATA.length * CARD_H;

    const step = () => {
      posRef.current += SPEED;
      if (posRef.current >= singleSetHeight) posRef.current -= singleSetHeight;
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="hidden lg:block flex-shrink-0 overflow-hidden relative"
      style={{ width: 230, height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #020617, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #020617, transparent)" }} />

      <div ref={trackRef} style={{ willChange: "transform" }}>
        {ALL_CARDS.map((card, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              width: 220,
              marginLeft: 5,
              height: 160,
              border: `1px solid ${card.color}30`,
              borderLeft: `3px solid ${card.color}`,
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: 8,
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  color: card.color,
                  background: `${card.color}18`,
                  padding: "2px 7px",
                  borderRadius: 4,
                  display: "inline-block",
                  marginBottom: 8,
                }}
              >
                {card.tag}
              </span>
              <p style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 700, lineHeight: 1.35, marginBottom: 6 }}>
                {card.title}
              </p>
              <p style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.4 }}>
                {card.subtitle}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: card.color, flexShrink: 0 }} />
              <span style={{ color: "#475569", fontSize: 9, letterSpacing: "0.05em" }}>
                {card.color === "#06b6d4" ? "AETHERLINK G-NODE L1" : "AIONFLUX MCCS"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}