import { useState, useEffect } from "react";

const BG_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/68ccbb554_BG1-Copy-Copy-Copy-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3fab485b2_JHKJK.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/50a81680c_JJJ-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d2ef155a8_JJJJ.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/36cfdae0c_MEDBEDLAB.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d21e1ebf8_MEDBEDLAB.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a018fb943_MMMMMMM.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8b92c2559_mri-machine-medical-interior-design-with-lights_932514-2211.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f4d0a58bf_NN.jpeg",
];

export default function AnimatedNeonBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Images Carousel */}
      {BG_IMAGES.map((img, index) => (
        <img 
          key={index}
          src={img}
          alt="background"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{
            opacity: index === currentIndex ? 0.6 : 0,
          }}
        />
      ))}
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-950/30" />

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
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="0" y1={`${(i + 1) * 20}%`} x2="100%" y2={`${(i + 1) * 20}%`} stroke="url(#neonGradient)" strokeWidth="1" filter="url(#glow)" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={`${(i + 1) * 20}%`} y1="0" x2={`${(i + 1) * 20}%`} y2="100%" stroke="url(#neonGradient)" strokeWidth="1" filter="url(#glow)" />
        ))}
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

      <style>{`
        @keyframes flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 100; }
        }
      `}</style>
    </div>
  );
}