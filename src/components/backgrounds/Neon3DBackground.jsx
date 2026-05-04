import { useEffect, useState } from "react";

export default function Neon3DBackground() {
  const [matrixChars, setMatrixChars] = useState([]);
  const [pulseIntensity, setPulseIntensity] = useState(0);

  useEffect(() => {
    // Generate random matrix characters
    const chars = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      char: String.fromCharCode(33 + Math.random() * 94),
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }));
    setMatrixChars(chars);

    // Pulse animation
    const pulseInterval = setInterval(() => {
      setPulseIntensity((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        perspective: "1000px",
        background: "linear-gradient(135deg, #0a0a15 0%, #0f1428 50%, #0a1020 100%)",
      }}
    >
      {/* 3D Layered Background with Depth */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(0,200,255,0.08) 0%, transparent 60%)",
          transform: "translateZ(50px)",
        }}
      />

      {/* Dynamic Electric Current Lines */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "blur(0.5px)",
        }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ccff" />
            <stop offset="50%" stopColor="#00ff99" />
            <stop offset="100%" stopColor="#00ccff" />
          </linearGradient>
        </defs>

        {/* Animated Electric Paths */}
        <path
          d="M 0 200 Q 300 150 600 200 T 1200 200"
          stroke="url(#electricGradient)"
          strokeWidth="2"
          fill="none"
          filter="url(#glow)"
          style={{
            animation: "electricPulse 3s ease-in-out infinite",
            opacity: 0.6,
          }}
        />
        <path
          d="M 0 400 Q 200 350 400 400 T 800 400 T 1200 400"
          stroke="url(#electricGradient)"
          strokeWidth="1.5"
          fill="none"
          filter="url(#glow)"
          style={{
            animation: "electricPulse 4s ease-in-out infinite 0.5s",
            opacity: 0.5,
          }}
        />
        <path
          d="M 0 600 Q 250 550 500 600 T 1000 600 T 1500 600"
          stroke="url(#electricGradient)"
          strokeWidth="1"
          fill="none"
          filter="url(#glow)"
          style={{
            animation: "electricPulse 5s ease-in-out infinite 1s",
            opacity: 0.4,
          }}
        />
      </svg>

      {/* Matrix Numbers Rain */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {matrixChars.map((char) => (
          <div
            key={char.id}
            style={{
              position: "absolute",
              left: `${char.x}%`,
              top: "-20px",
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#00ff99",
              textShadow: "0 0 10px #00ff99, 0 0 20px #00ccff",
              opacity: 0.7,
              animation: `matrixFall ${char.duration}s linear ${char.delay}s infinite`,
            }}
          >
            {char.char}
          </div>
        ))}
      </div>

      {/* Pulsing Neon Glow Zones */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,200,255,${0.15 + pulseIntensity * 0.001}) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(0,255,150,${0.12 + pulseIntensity * 0.0008}) 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Animated Neon Grid Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0,200,255,0.05) 25%, rgba(0,200,255,0.05) 26%, transparent 27%, transparent 74%, rgba(0,200,255,0.05) 75%, rgba(0,200,255,0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0,200,255,0.05) 25%, rgba(0,200,255,0.05) 26%, transparent 27%, transparent 74%, rgba(0,200,255,0.05) 75%, rgba(0,200,255,0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.4,
        }}
      />

      {/* White Section Neon Pulsing Effect (will be layered over white content) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(45deg, transparent 30%, rgba(0,255,150,${0.05 + pulseIntensity * 0.0006}) 50%, transparent 70%)`,
          animation: "neonElectricShimmer 2s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes electricPulse {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 4px #00ccff); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 12px #00ff99) drop-shadow(0 0 8px #00ccff); }
        }
        @keyframes matrixFall {
          to { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes neonElectricShimmer {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}