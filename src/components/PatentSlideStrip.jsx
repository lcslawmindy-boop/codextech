import { useEffect, useRef } from "react";
import { Shield, FileText, Award, CheckCircle } from "lucide-react";

const PATENT_IMAGES = [
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d46d730a4_TRZPPAfigs11a.jpg", label: "Phase Conjugation · TRZ Patent" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/23aaefa3b_TRZPPAfigs12a.jpg", label: "Time-Density Wave Generator" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4333e30ec_TRZPPAfigs13a.jpg", label: "Data Processing System · FIG. 13" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cb1807f79_TRZPPAfigs14a.jpg", label: "Modulator / Demodulator · FIG. 14A" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b6ccd9b68_TRZPPAfigs15a.jpg", label: "Nonlinear Optical Mixer · FIG. 14B" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1bbbc20b2_TRZPPAfigs16a.jpg", label: "Scalar Potential Beam System" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b6991cbf9_TRZPPAfigs17a.jpg", label: "Spacetime Curvature Engine" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fd67f8d9e_TRZPPAfigs18a.jpg", label: "Aerial Interference Zone · FIG. 17" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6711e496a_TRZPPAfigs19a.jpg", label: "Time-Density Waveset Transmitter" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b4e238bad_TRZPPAfigs20a.jpg", label: "Detector Array System · FIG. 19" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b52197ab8_TRZPPAfigs21a.jpg", label: "CBR Field Deployment System" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/556b40483_TRZPPAfigs22a.jpg", label: "Agent Decontamination Protocol" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/25543cd25_TRZPPAfigs23a.jpg", label: "Beam Transmitter System · FIG. 23" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6c7356ae2_TRZPPAfigs24a.jpg", label: "Radiation Counter Array · FIG. 24" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d2a9ca0e5_TRZPPAfigs25a.jpg", label: "Cold Fusion Lattice Array" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/648a282c0_TRZPPAfigs26a.jpg", label: "Phase Conjugate Mirror · FIG. 25" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fadcc0a30_TRZPPAfigs27a.jpg", label: "Vacuum Anti-Engine · FIG. 26" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b9cb48db2_TRZPPAfigs28a.jpg", label: "Plasma Mixing EM Conditioning" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2cfa65be7_TRZPPAfigs29a.jpg", label: "EM Therapy Antenna System" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/31021f867_TRZPPAfigs30a.jpg", label: "Broadband Antenna Unit · FIG. 30" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/68167f45c_TRZPPAfigs31a.jpg", label: "Flowchart Control · FIG. 21" },
];

const ALL_SLIDES = [...PATENT_IMAGES, ...PATENT_IMAGES];
const CARD_H = 220;

const TRUST_BADGES = [
  { icon: <FileText size={11} />, label: "200+ Research Entries" },
  { icon: <Award size={11} />, label: "US Patent-Sourced" },
  { icon: <Shield size={11} />, label: "Peer-Reviewed" },
  { icon: <CheckCircle size={11} />, label: "Cite-Inline Docs" },
];

export default function PatentSlideStrip() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const CARD_W = 240;

  useEffect(() => {
    const SPEED = 0.35;
    const singleSetW = PATENT_IMAGES.length * CARD_W;
    const step = () => {
      posRef.current -= SPEED; // Right-to-left: negative direction
      if (posRef.current <= -singleSetW) posRef.current += singleSetW;
      if (trackRef.current) trackRef.current.style.transform = `translateX(${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="w-full bg-slate-950 border-y border-slate-800 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-1">Patent-Sourced Research</div>
            <h3 className="text-xl font-black text-white">200+ Documented Patent Diagrams</h3>
          </div>
          <div className="text-right text-xs text-slate-500">
            Scroll left to right
          </div>
        </div>

        {/* Horizontal scrolling strip */}
        <div className="overflow-hidden relative rounded-xl">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0f172a, transparent)" }} />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #0f172a, transparent)" }} />

          <div ref={trackRef} style={{ willChange: "transform", display: "flex", gap: 8, paddingLeft: 16, paddingRight: 16 }}>
            {ALL_SLIDES.map((slide, i) => (
              <div key={i} style={{
                width: 224,
                height: 150,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #1e293b",
                background: "#040f1e",
                position: "relative",
                flexShrink: 0,
                boxShadow: "0 2px 12px rgba(6,182,212,0.08)",
              }}>
                {/* US Patent stamp */}
                <div style={{
                  position: "absolute", top: 4, left: 4, zIndex: 5,
                  background: "rgba(6,182,212,0.9)", borderRadius: 2,
                  padding: "1px 4px",
                  fontSize: 6, fontWeight: 900, color: "#000", letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  US Patent
                </div>

                {/* Image */}
                <img
                  src={slide.url}
                  alt={slide.label}
                  style={{
                    width: "100%", height: 120,
                    objectFit: "contain",
                    background: "#fff",
                    display: "block",
                  }}
                />

                {/* Label */}
                <div style={{ padding: "4px 6px", borderTop: "1px solid #1e293b" }}>
                  <p style={{
                    color: "#94a3b8", fontSize: 7.5, lineHeight: 1.2, margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {slide.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}