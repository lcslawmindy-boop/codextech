import { useState, useEffect } from "react";

const LOGOS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8006a5a02_a6e3bd669_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3bba29976_e1995a4cb_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cceab4405_fa52566da_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2e74977ba_5e416fe39_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9f061cd66_7e20287f0_logo-Copy-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e1ebd64da_13427a463_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/82c3da266_703606d05_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b623bd74c_839284090_logo-Copy.png",
];

export default function AnimatedNeonBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOGOS.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-950" />

      {/* Neon Grid Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" style={{ background: "transparent" }}>
        <defs>
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="0" y1={`${(i + 1) * 20}%`} x2="100%" y2={`${(i + 1) * 20}%`} stroke="url(#neonGradient)" strokeWidth="1" filter="url(#glow)" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={`${(i + 1) * 20}%`} y1="0" x2={`${(i + 1) * 20}%`} y2="100%" stroke="url(#neonGradient)" strokeWidth="1" filter="url(#glow)" />
        ))}
        {/* Circuit nodes */}
        {[...Array(16)].map((_, i) => {
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          return (
            <g key={`node${i}`}>
              <circle cx={`${x}%`} cy={`${y}%`} r="2" fill="#00e5ff" opacity="0.6" filter="url(#glow)" />
              <circle cx={`${x}%`} cy={`${y}%`} r="2" fill="#00e5ff" opacity="0.3">
                <animate attributeName="r" values="2;4;2" dur="3s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Electricity Current Paths */}
      <svg className="absolute inset-0 w-full h-full opacity-30" style={{ background: "transparent" }}>
        <defs>
          <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
          <filter id="electricGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[...Array(8)].map((_, i) => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          const endX = Math.random() * 100;
          const endY = Math.random() * 100;
          return (
            <path key={`current${i}`} d={`M ${startX}% ${startY}% Q ${(startX + endX) / 2}% ${(startY + endY) / 2}% ${endX}% ${endY}%`} stroke="url(#electricGradient)" strokeWidth="2" fill="none" filter="url(#electricGlow)" strokeDasharray="10,5" style={{ animation: `flow ${2 + i * 0.5}s linear infinite` }} />
          );
        })}
      </svg>

      {/* Rotating Logos with Fade Transition */}
      <div className="absolute inset-0 flex items-center justify-center">
        {LOGOS.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt="Logo"
            className="absolute w-[600px] h-[600px] object-contain transition-opacity duration-1000"
            style={{
              opacity: index === currentIndex ? 0.25 : 0,
            }}
          />
        ))}
      </div>



      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 100; }
        }
      `}</style>
    </div>
  );
}