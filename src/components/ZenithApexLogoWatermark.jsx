import { createPortal } from "react-dom";

export default function ZenithApexLogoWatermark() {
  const logoUrl = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b615b5d22_df887ac44_logo.png";
  
  const ui = (
    <div
      className="fixed bottom-6 right-6 z-[9989]"
      style={{ pointerEvents: "none" }}
    >
      <div
        className="relative"
        style={{
          animation: "zatLogoWatermarkPulse 3s ease-in-out infinite",
        }}
      >
        {/* Outer glow halo */}
        <div
          style={{
            position: "absolute",
            inset: "-12px",
            background: "radial-gradient(circle, rgba(0,220,255,0.3) 0%, rgba(0,180,255,0.1) 60%, transparent 100%)",
            borderRadius: "50%",
            zIndex: -1,
          }}
        />
        
        {/* Logo image */}
        <img
          src={logoUrl}
          alt="Zenith Apex Tech"
          className="w-28 h-28 rounded-full"
          style={{
            border: "2px solid rgba(0,220,255,0.6)",
            boxShadow: "0 0 32px rgba(0,220,255,0.7), 0 0 60px rgba(0,180,255,0.4), inset 0 0 20px rgba(0,200,255,0.15)",
            filter: "brightness(1.15) contrast(1.1)",
          }}
        />

        {/* Label below logo */}
        <div style={{ textAlign: "center", marginTop: "6px" }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: "900",
              letterSpacing: "0.15em",
              color: "rgba(0,230,255,1)",
              textShadow: "0 0 10px rgba(0,220,255,1), 0 0 20px rgba(0,180,255,0.6)",
              margin: "0",
              fontFamily: "monospace",
              lineHeight: "1.1",
            }}
          >
            ZENITH APEX
            <br />
            TECH
          </p>
        </div>
      </div>

      <style>{`
        @keyframes zatLogoWatermarkPulse {
          0%, 100% { opacity: 0.92; filter: drop-shadow(0 0 8px rgba(0,220,255,0.5)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(0,220,255,0.9)); }
        }
      `}</style>
    </div>
  );

  return createPortal(ui, document.body);
}