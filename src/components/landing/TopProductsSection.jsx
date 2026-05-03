import { Link } from "react-router-dom";
import { Star, Zap, ShoppingCart, ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    rank: "🥇",
    name: "AI Invention Dossier Suite",
    price: "Included — Builder+",
    desc: "Complete IP empire generator: patent strategy, FTO analysis, AI-drafted claims, $5M–$150M valuation, 12-month commercialization roadmap. One click.",
    features: ["Full patent claim drafting", "IP valuation $5M–$150M", "Commercialization roadmap", "Investor-ready deliverables"],
    neon: "#cc00ff",
    href: "/invention-dossier",
    badge: "#1 HIGHEST VALUE",
    cta: "Generate Dossier",
  },
  {
    rank: "🥈",
    name: "MEG Replication Build Kit",
    price: "$287",
    desc: "Complete 23-part component kit for Bearden's US6,362,718 Motionless Electromagnetic Generator. Pre-sourced, quality-tested, shipped to your door.",
    features: ["Toroidal cores & magnets", "Winding wire & jigs", "Oscilloscope probes", "Calibration toolkit"],
    neon: "#00ff66",
    href: "/build-supplies-shop",
    badge: "TOP SELLER",
    cta: "Order Kit — $287",
  },
  {
    rank: "🥉",
    name: "TRZ Reactor Starter Kit",
    price: "$389",
    desc: "Everything needed to build the TRZ Scalar Reactor System. Bifilar coil forms, phase-conjugate mirrors, resonance chambers, and full PCB set.",
    features: ["47-component BOM included", "Bifilar coil winding forms", "Scalar resonance chamber", "Full assembly video guide"],
    neon: "#ff6600",
    href: "/build-supplies-shop",
    badge: "ADVANCED BUILD",
    cta: "Order Kit — $389",
  },
  {
    rank: "⭐",
    name: "AI Patent Attorney Chat",
    price: "Included — Pro",
    desc: "Unlimited AI patent attorney sessions. Draft provisional applications, generate independent claims, respond to office actions, and challenge prior art.",
    features: ["Provisional patent drafting", "Independent claim generation", "Office action responses", "FTO risk scoring"],
    neon: "#00ccff",
    href: "/patent-attorney-chat",
    badge: "PRO EXCLUSIVE",
    cta: "Open Patent Attorney",
  },
  {
    rank: "⭐",
    name: "Scalar EM Fundamentals Course",
    price: "$197",
    desc: "The definitive 24-lesson scalar EM course. Maxwell's original quaternion equations, Aharonov-Bohm effect, phase conjugation, and lab validation protocols.",
    features: ["24 structured lessons", "18 hours of content", "Lab reference materials", "Problem sets & solutions"],
    neon: "#ffcc00",
    href: "/courses",
    badge: "BESTSELLER",
    cta: "Enroll Now — $197",
  },
  {
    rank: "⭐",
    name: "Prioré Device Component Bundle",
    price: "$349",
    desc: "All components for the Prioré Electromagnetic Bio-Restoration Device. Rotating field coils, plasma tube assembly, and 18-year clinical trial documentation.",
    features: ["Rotating EM field coils", "Plasma discharge tube kit", "Clinical trial reports", "Build video series"],
    neon: "#ff3366",
    href: "/build-supplies-shop",
    badge: "CLINICAL GRADE",
    cta: "Order Bundle — $349",
  },
];

export default function TopProductsSection() {
  return (
    <section
      className="px-6 py-20 border-b border-white/10"
      style={{ background: "linear-gradient(180deg, #020208 0%, #000 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
            style={{
              border: "2px solid #ffcc00",
              background: "rgba(255,200,0,0.07)",
              boxShadow: "0 0 24px rgba(255,200,0,0.25)",
            }}
          >
            <Star size={13} style={{ color: "#ffcc00" }} />
            <span className="text-xs font-black tracking-widest" style={{ color: "#ffcc00" }}>
              TOP REVENUE PRODUCTS
            </span>
          </div>
          <h2
            className="text-4xl font-black mb-4 text-white"
          >
            Our Best-Selling Products
          </h2>
          <p className="text-gray-400 text-base max-w-2xl mx-auto">
            From AI IP generation to physical device kits — the tools that generate the most value for inventors, engineers, and researchers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p, i) => (
            <div
              key={i}
              style={{
                background: "#000",
                border: `2px solid ${p.neon}55`,
                borderRadius: "16px",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                position: "relative",
                overflow: "hidden",
                boxShadow: `0 0 24px ${p.neon}22`,
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${p.neon}, transparent)` }} />

              {/* Top row */}
              <div className="flex items-start justify-between">
                <span className="text-2xl">{p.rank}</span>
                <span
                  style={{
                    fontSize: "8px", fontWeight: "900", padding: "3px 8px", borderRadius: "6px",
                    background: `${p.neon}18`, border: `1.5px solid ${p.neon}`, color: p.neon,
                    letterSpacing: "0.1em",
                  }}
                >
                  {p.badge}
                </span>
              </div>

              {/* Name & price */}
              <div>
                <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "16px", marginBottom: "4px" }}>{p.name}</h3>
                <span style={{ color: p.neon, fontSize: "14px", fontWeight: "900" }}>{p.price}</span>
              </div>

              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", lineHeight: "1.65" }}>{p.desc}</p>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {p.features.map((f, j) => (
                  <p key={j} style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ color: p.neon, fontWeight: "900" }}>✓</span> {f}
                  </p>
                ))}
              </div>

              <Link
                to={p.href}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  padding: "11px 16px", borderRadius: "10px", marginTop: "auto",
                  background: `${p.neon}18`, border: `1.5px solid ${p.neon}`,
                  color: p.neon, fontSize: "13px", fontWeight: "900", textDecoration: "none",
                  boxShadow: `0 0 14px ${p.neon}33`,
                }}
              >
                <ShoppingCart size={14} /> {p.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Revenue statement */}
        <div
          className="mt-10 p-6 rounded-2xl text-center"
          style={{
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-white font-black text-lg mb-2">
            ZAT Commission Model — Fully Transparent
          </p>
          <p className="text-gray-400 text-sm">
            Physical kits are priced at cost + 30% margin. AI tools are subscription-included.
            IP Marketplace: ZAT takes <span style={{ color: "#ffcc00", fontWeight: "900" }}>5% commission on closed deals only</span>.
            No hidden fees. No upsells. Your IP empire, your profits.
          </p>
          <Link to="/subscribe" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl font-black text-sm"
            style={{ background: "linear-gradient(90deg, #ffcc00, #ff6600)", color: "#000" }}>
            View All Plans <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}