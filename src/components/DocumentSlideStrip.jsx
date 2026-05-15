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
  // ELF Carrier Lock Detection System
  { title: "ELF Carrier Lock Detection System", subtitle: "Cover · Detect ELF brain-entrainment carriers in the 5–30 MHz band", color: "#06b6d4", tag: "INSTRUMENT" },
  { title: "Product Overview & BOM", subtitle: "Dual RTL-SDR, GPS-disciplined OCXO, CCPCI Flask dashboard", color: "#06b6d4", tag: "TECH SPEC" },

  // EM Trigger Window Therapy Device
  { title: "EM Trigger Window Therapy Device", subtitle: "Cover · $599 consumer / $2,400 clinical · BOM $362", color: "#f97316", tag: "INVENTION" },
  { title: "Technical Overview", subtitle: "47 verified trigger window frequencies · DDS synthesizer + Helmholtz coils", color: "#f97316", tag: "TECH SPEC" },
  { title: "Build Steps 1–7", subtitle: "Freq library → DDS → Helmholtz coil → PA → wristband → software → calibrate", color: "#f97316", tag: "BUILD" },
  { title: "Bill of Materials", subtitle: "6 line items · Total BOM: $362", color: "#f97316", tag: "BOM" },
  { title: "Derived Products", subtitle: "Plans $599 · Protocol Sub $97/mo · Clinical License $4,800", color: "#f97316", tag: "PRODUCTS" },

  // HeavisideGate APM-2K
  { title: "HeavisideGate APM-2K", subtitle: "Cover · Solid-state vacuum-potential power booster · $18K prototype", color: "#a855f7", tag: "INVENTION" },
  { title: "Technical Overview", subtitle: "Nanocrystalline Fe core, GaN half-bridge, FPGA adaptive phase-conjugate loop", color: "#a855f7", tag: "TECH SPEC" },
  { title: "Assembly Steps 1–6", subtitle: "Lab safety → core fabrication → coil winding → GaN bridges → inverter → calibration", color: "#a855f7", tag: "BUILD" },
  { title: "Bill of Materials", subtitle: "7 line items · Total BOM: $1,480", color: "#a855f7", tag: "BOM" },
  { title: "Market & Course", subtitle: "Off-grid $340M · Edge power $4.8B · 5 training modules included", color: "#a855f7", tag: "PRODUCTS" },

  // KRCIC
  { title: "Kaznacheyev Cell Imprinting Chamber", subtitle: "Cover · KRCIC · $6,800 prototype / $1,400 plans · Market $16B", color: "#10b981", tag: "INVENTION" },
  { title: "Technical Overview", subtitle: "Dual-chamber UV biophoton system · PMT monitoring · quartz optical path", color: "#10b981", tag: "TECH SPEC" },
  { title: "Build Steps 1–10", subtitle: "Enclosure → quartz window → PMT → DDS UV driver → Peltier → cell culture → analysis", color: "#10b981", tag: "BUILD" },
  { title: "Bill of Materials", subtitle: "11 line items · Total BOM: $2,604", color: "#10b981", tag: "BOM" },
  { title: "Derived Products", subtitle: "Plans $1,400 · Replication Course $297 · Research License $4,500", color: "#10b981", tag: "PRODUCTS" },

  // MEG Replication Kit
  { title: "MEG Replication Kit", subtitle: "Cover · Motionless EM Generator · METGLAS 2605SC · COP>1", color: "#fbbf24", tag: "INVENTION" },
  { title: "Description & BOM", subtitle: "850T bifilar primary / 1200T secondary · MOSFET H-bridge · Total $303.75", color: "#fbbf24", tag: "BOM" },
  { title: "Assembly Steps 1–10", subtitle: "Core prep → bifilar wind → secondary → insulate → mount → magnets → H-bridge → test COP", color: "#fbbf24", tag: "BUILD" },

  // Prioré-Type Multichannel EM Therapy
  { title: "Prioré-Type Multichannel EM System", subtitle: "Cover · DDS implementation · $2,400 clinical / $599 research", color: "#ec4899", tag: "INVENTION" },
  { title: "Technical Overview", subtitle: "3-channel AD9910 DDS · Artix-7 FPGA · 50W PA · Faraday cage chamber", color: "#ec4899", tag: "TECH SPEC" },
  { title: "Build Steps 1–7", subtitle: "DDS arch → FPGA firmware → Helmholtz coils → Faraday cage → PA → protocols → validation", color: "#ec4899", tag: "BUILD" },
  { title: "Bill of Materials", subtitle: "6 line items · Total BOM: $1,170", color: "#ec4899", tag: "BOM" },
  { title: "Derived Products", subtitle: "Plans $599 · Protocol Library $197/yr · Clinical Build Package $2,400", color: "#ec4899", tag: "PRODUCTS" },
];

const ALL_CARDS = [...CARD_DATA, ...CARD_DATA];

export default function DocumentSlideStrip({ reverse = false }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const SPEED = 0.35;
    const CARD_H = 125;
    const singleSetHeight = CARD_DATA.length * CARD_H;

    const step = () => {
      posRef.current += reverse ? -SPEED : SPEED;
      if (posRef.current >= singleSetHeight) posRef.current -= singleSetHeight;
      if (posRef.current < 0) posRef.current += singleSetHeight;
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="hidden lg:block flex-shrink-0 overflow-hidden relative"
      style={{ width: 130, height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-14 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #020617, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-14 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #020617, transparent)" }} />

      <div ref={trackRef} style={{ willChange: "transform" }}>
        {ALL_CARDS.map((card, i) => (
          <div
            key={i}
            style={{
              marginBottom: 5,
              width: 122,
              marginLeft: 4,
              height: 90,
              border: `1px solid ${card.color}`,
              borderRadius: 7,
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexShrink: 0,
              background: "#050d1a",
              boxShadow: `0 0 10px ${card.color}55, inset 0 0 12px ${card.color}10`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Neon top bar */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
              boxShadow: `0 0 8px ${card.color}`,
            }} />

            <div>
              {/* Lit-up tag header */}
              <span style={{
                fontSize: 8,
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: "#000",
                background: card.color,
                padding: "2px 6px",
                borderRadius: 3,
                display: "inline-block",
                marginBottom: 6,
                boxShadow: `0 0 6px ${card.color}`,
                textTransform: "uppercase",
              }}>
                {card.tag}
              </span>
              {/* Neon-lit title */}
              <p style={{
                color: card.color,
                fontSize: 10,
                fontWeight: 800,
                lineHeight: 1.3,
                marginBottom: 4,
                textShadow: `0 0 8px ${card.color}99`,
                letterSpacing: "0.01em",
              }}>
                {card.title}
              </p>
              <p style={{ color: "#64748b", fontSize: 8.5, lineHeight: 1.35 }}>
                {card.subtitle}
              </p>
            </div>

            {/* Bottom neon line */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${card.color}80, transparent)`,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}