/**
 * Wraps white content sections with neon electric pulsing borders and glow.
 * Apply this to any white/light section for the electric current effect.
 */

export function NeonSectionWrapper({ children, className = "" }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(250,250,250,0.98) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Electric border glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00ccff, #00ff99, transparent)",
          boxShadow: "0 0 20px #00ccff, 0 0 40px #00ff99",
          animation: "electricBorderPulse 2s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00ff99, #00ccff, transparent)",
          boxShadow: "0 0 20px #00ff99, 0 0 40px #00ccff",
          animation: "electricBorderPulse 2s ease-in-out infinite 1s",
        }}
      />

      {/* Animated electric current lines running through */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "200%",
          height: "100%",
          background: `linear-gradient(
            90deg,
            transparent 0%,
            rgba(0,200,255,0.1) 25%,
            rgba(0,255,150,0.1) 50%,
            rgba(0,200,255,0.1) 75%,
            transparent 100%
          )`,
          animation: "electricCurrentFlow 3s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>

      <style>{`
        @keyframes electricBorderPulse {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 4px #00ccff); }
          50% { opacity: 1; filter: drop-shadow(0 0 12px #00ccff) drop-shadow(0 0 8px #00ff99); }
        }
        @keyframes electricCurrentFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(50%); }
        }
      `}</style>
    </div>
  );
}

export default NeonSectionWrapper;