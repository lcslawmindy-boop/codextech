import { useEffect, useRef } from "react";

const SLIDES = [
  {
    category: "Invention Library",
    color: "#a855f7",
    tag: "BUILD PLANS",
    items: [
      { title: "ELF Carrier Lock Detection System", sub: "Dual RTL-SDR · GPS-disciplined OCXO · Flask dashboard", tag: "INSTRUMENT" },
      { title: "EM Trigger Window Therapy Device", sub: "$599 consumer / $2,400 clinical · BOM $362", tag: "INVENTION" },
      { title: "HeavisideGate APM-2K", sub: "Solid-state vacuum-potential power booster · $18K prototype", tag: "INVENTION" },
      { title: "KRCIC Imprinting Chamber", sub: "$6,800 prototype / $1,400 plans · Market $16B", tag: "INVENTION" },
      { title: "MEG Replication Kit", sub: "Motionless EM Generator · METGLAS 2605SC · COP>1", tag: "INVENTION" },
      { title: "Prioré-Type Multichannel EM", sub: "DDS implementation · $2,400 clinical / $599 research", tag: "INVENTION" },
    ],
  },
  {
    category: "Patent Suite",
    color: "#06b6d4",
    tag: "AI PATENTS",
    items: [
      { title: "USPTO-Formatted Patent Drafting", sub: "Attorney-grade claim generation with AI assistance", tag: "DRAFTING" },
      { title: "Novelty & FTO Analysis", sub: "Freedom-to-operate research & competitive landscape", tag: "ANALYSIS" },
      { title: "Prior Art Cross-Reference", sub: "200+ patent-sourced entries cross-indexed", tag: "ARCHIVE" },
      { title: "Patent Threat Monitoring", sub: "Automated alerts on competitor filings & citations", tag: "MONITOR" },
      { title: "Provisional Patent Generator", sub: "12-month priority window · USPTO compliant format", tag: "FILING" },
      { title: "IP Valuation Estimator", sub: "Market-based IP valuation with sector comparables", tag: "VALUATION" },
    ],
  },
  {
    category: "Course Library",
    color: "#22c55e",
    tag: "40+ COURSES",
    items: [
      { title: "RF & Signal Systems Engineering", sub: "SDR fundamentals · spectrum analysis · antenna design", tag: "RF SYSTEMS" },
      { title: "FPGA & Embedded Systems", sub: "Artix-7 · Zynq · real-time DSP implementation", tag: "FPGA" },
      { title: "Resonance Engineering Fundamentals", sub: "LC circuits · Tesla coils · impedance matching", tag: "RESONANCE" },
      { title: "EM Instrumentation Design", sub: "Sensor calibration · signal conditioning · ADC/DAC", tag: "INSTRUMENTS" },
      { title: "Bioelectromagnetics Research", sub: "Biological EM interaction · exposure standards", tag: "BIOEM" },
      { title: "Scalar EM Theory & Lab", sub: "Phase conjugation · longitudinal waves · Bearden model", tag: "SCALAR EM" },
    ],
  },
  {
    category: "Invention Forge",
    color: "#fbbf24",
    tag: "AI HYBRID IP",
    items: [
      { title: "AI Concept Synthesis Engine", sub: "Merge 2+ inventions into novel hybrid IP concepts", tag: "FORGE" },
      { title: "Synergy Score Algorithm", sub: "Quantified compatibility rating for cross-domain merges", tag: "ANALYSIS" },
      { title: "Patent Claim Generator", sub: "Auto-generated independent & dependent patent claims", tag: "CLAIMS" },
      { title: "IP Valuation Model", sub: "$M–$B range estimates with sector benchmarking", tag: "VALUATION" },
      { title: "Commercialization Roadmap", sub: "Phase-gated go-to-market with licensing pathways", tag: "STRATEGY" },
      { title: "Hybrid IP PDF Export", sub: "Investor-ready dossier with full technical appendix", tag: "EXPORT" },
    ],
  },
  {
    category: "Research Archive",
    color: "#f97316",
    tag: "200+ ENTRIES",
    items: [
      { title: "Tesla Atmospheric Energy Harvester", sub: "US Patent 645,576 · atmospheric electricity · 1900", tag: "TESLA TECH" },
      { title: "Bearden MEG Device", sub: "US Patent 6,362,718 · motionless EM generator · COP>1", tag: "FREE ENERGY" },
      { title: "Priore EM Therapy System", sub: "French Patent 1,342,772 · plasma EM · clinical trials", tag: "BIOEM" },
      { title: "Kaznacheyev Cell Imprinting", sub: "USSR Research 1981 · UV biophoton information transfer", tag: "BIOPHOTONICS" },
      { title: "Scalar Wave Interferometry", sub: "Phase conjugation · longitudinal EM propagation theory", tag: "SCALAR EM" },
      { title: "Aharonov-Bohm Effect Devices", sub: "Phase shift without field interaction · quantum potential", tag: "AB EFFECT" },
    ],
  },
  {
    category: "VDR & Investor Suite",
    color: "#ec4899",
    tag: "ENTERPRISE",
    items: [
      { title: "Virtual Data Room", sub: "NDA-gated investor access · time-limited secure links", tag: "VDR" },
      { title: "Investor CRM Pipeline", sub: "Stage tracking · communication log · meeting scheduler", tag: "CRM" },
      { title: "IP Marketplace Listings", sub: "Anonymous inventor listings · verified IP for sale/license", tag: "MARKETPLACE" },
      { title: "Acquisition Pitch Deck", sub: "Auto-generated investor-grade acquisition packages", tag: "PITCH" },
      { title: "SBIR/STTR Pipeline Tool", sub: "Government grant matching · proposal stage tracking", tag: "GRANTS" },
      { title: "Audit Log & Access Analytics", sub: "Page-level tracking · time-on-page · engagement scoring", tag: "ANALYTICS" },
    ],
  },
];

const ALL_SLIDES = [...SLIDES, ...SLIDES];

export default function PlatformOverviewCarousel() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  const CARD_W = 210; // px per card + gap
  const singleSetWidth = SLIDES.length * CARD_W * 6; // 6 items per slide group

  useEffect(() => {
    const SPEED = 0.55;
    // Total width of one full set of item cards
    const ITEM_W = 200 + 8; // card width + margin
    const totalItems = SLIDES.reduce((s, sl) => s + sl.items.length, 0);
    const singleWidth = totalItems * ITEM_W;

    const step = () => {
      posRef.current += SPEED;
      if (posRef.current >= singleWidth) posRef.current -= singleWidth;
      if (trackRef.current) trackRef.current.style.transform = `translateX(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // Flatten all items from all slides (doubled for infinite loop)
  const allItems = [...SLIDES, ...SLIDES].flatMap(slide =>
    slide.items.map(item => ({ ...item, color: slide.color, category: slide.category }))
  );

  return (
    <div
      className="hidden lg:block flex-shrink-0 overflow-hidden relative"
      style={{ width: 220, height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-14 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #020617, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-14 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #020617, transparent)" }} />

      {/* Vertical right-to-left scroll — rotate the strip 90deg trick:
          We scroll vertically but the content is rotated to feel horizontal */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ transform: "rotate(0deg)" }}
      >
        {/* Header label */}
        <div className="flex-shrink-0 px-3 pt-16 pb-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-600 text-center">Platform Overview</div>
        </div>

        {/* Scrolling vertical strip */}
        <div className="flex-1 overflow-hidden relative">
          <div ref={trackRef} style={{ willChange: "transform", position: "absolute", top: 0, left: 0 }}>
            {allItems.map((item, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 6,
                  width: 204,
                  marginLeft: 8,
                  padding: "9px 11px",
                  border: `1px solid ${item.color}50`,
                  borderRadius: 8,
                  background: "#050d1a",
                  boxShadow: `0 0 10px ${item.color}22, inset 0 0 12px ${item.color}08`,
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* Top neon bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                  boxShadow: `0 0 8px ${item.color}`,
                }} />

                {/* Category + tag row */}
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{
                    fontSize: 7, fontWeight: 900, letterSpacing: "0.14em",
                    color: "#000", background: item.color, padding: "1px 5px",
                    borderRadius: 3, boxShadow: `0 0 6px ${item.color}`,
                    textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>
                    {item.tag}
                  </span>
                  <span style={{
                    fontSize: 7, color: item.color, opacity: 0.7,
                    fontWeight: 700, letterSpacing: "0.05em",
                  }}>
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <p style={{
                  color: item.color, fontSize: 10, fontWeight: 800,
                  lineHeight: 1.3, marginBottom: 3,
                  textShadow: `0 0 8px ${item.color}80`,
                }}>
                  {item.title}
                </p>

                {/* Subtitle */}
                <p style={{ color: "#475569", fontSize: 8.5, lineHeight: 1.35 }}>
                  {item.sub}
                </p>

                {/* Bottom neon line */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${item.color}60, transparent)`,
                }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}