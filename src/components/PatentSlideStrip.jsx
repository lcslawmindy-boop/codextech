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

  useEffect(() => {
    const SPEED = 0.30;
    const singleSetH = PATENT_IMAGES.length * CARD_H;
    const step = () => {
      posRef.current += SPEED;
      if (posRef.current >= singleSetH) posRef.current -= singleSetH;
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="hidden lg:flex flex-col flex-shrink-0"
      style={{ width: 200, height: "100vh", position: "sticky", top: 0, background: "#020c1a", borderRight: "1px solid #0f2744" }}
    >
      {/* Header badge */}
      <div style={{ padding: "10px 8px 8px", borderBottom: "1px solid #0f2744", flexShrink: 0 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "linear-gradient(135deg, #0a1f3a, #051424)",
          border: "1px solid #1e4080", borderRadius: 8, padding: "8px 10px",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, flexShrink: 0,
            background: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FileText size={14} color="#fff" />
          </div>
          <div>
            <div style={{ color: "#06b6d4", fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>Patent-Sourced</div>
            <div style={{ color: "#64748b", fontSize: 8, marginTop: 1 }}>200+ Research Entries</div>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
          {TRUST_BADGES.map((b, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 8px", borderRadius: 6,
              background: "#040f1e", border: "1px solid #0e2540",
            }}>
              <span style={{ color: "#06b6d4", flexShrink: 0 }}>{b.icon}</span>
              <span style={{ color: "#94a3b8", fontSize: 9, fontWeight: 700 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrolling patent diagrams */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 32, zIndex: 10, pointerEvents: "none",
          background: "linear-gradient(to bottom, #020c1a, transparent)",
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 32, zIndex: 10, pointerEvents: "none",
          background: "linear-gradient(to top, #020c1a, transparent)",
        }} />

        <div ref={trackRef} style={{ willChange: "transform", paddingTop: 8 }}>
          {ALL_SLIDES.map((slide, i) => (
            <div key={i} style={{
              margin: "0 6px 6px",
              height: 214,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid #0e2540",
              background: "#040f1e",
              position: "relative",
              flexShrink: 0,
              boxShadow: "0 2px 12px rgba(6,182,212,0.08)",
            }}>
              {/* US Patent stamp */}
              <div style={{
                position: "absolute", top: 5, left: 5, zIndex: 5,
                background: "rgba(6,182,212,0.9)", borderRadius: 3,
                padding: "1px 5px",
                fontSize: 7, fontWeight: 900, color: "#000", letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                US Patent
              </div>

              {/* Image */}
              <img
                src={slide.url}
                alt={slide.label}
                style={{
                  width: "100%", height: 170,
                  objectFit: "contain",
                  background: "#fff",
                  display: "block",
                }}
              />

              {/* Label */}
              <div style={{ padding: "5px 7px", borderTop: "1px solid #0e2540" }}>
                <p style={{
                  color: "#94a3b8", fontSize: 8.5, lineHeight: 1.3, margin: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {slide.label}
                </p>
              </div>

              {/* Neon bottom line */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                background: "linear-gradient(90deg, transparent, #06b6d4, transparent)",
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{ padding: "8px", borderTop: "1px solid #0f2744", flexShrink: 0 }}>
        <div style={{
          background: "linear-gradient(135deg, #0a1f3a, #051424)",
          border: "1px solid #1e4080",
          borderRadius: 8, padding: "8px 10px", textAlign: "center",
        }}>
          <div style={{ color: "#06b6d4", fontSize: 8, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>
            Full Archive Access
          </div>
          <div style={{ color: "#475569", fontSize: 8, lineHeight: 1.4 }}>
            Members get 200+ entries with inline citations & schematics
          </div>
        </div>
      </div>
    </div>
  );
}