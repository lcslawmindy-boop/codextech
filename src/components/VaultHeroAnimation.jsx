import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

const FLOATING_ELEMENTS = [
  { text: "E=mc²", x: "5%", delay: 0 },
  { text: "∇×E = -∂B/∂t", x: "12%", delay: 0.5 },
  { text: "∫∞", x: "20%", delay: 1 },
  { text: "∇²φ = ρ/ε₀", x: "28%", delay: 1.5 },
  { text: "ψ = Ae^(ikx)", x: "36%", delay: 2 },
  { text: "F = qE + q(v×B)", x: "44%", delay: 0.3 },
  { text: "iℏ∂ψ/∂t = Ĥψ", x: "52%", delay: 1.2 },
  { text: "∮ E·dl = -dΦ_B/dt", x: "60%", delay: 1.8 },
  { text: "G_μν = 8πT_μν", x: "68%", delay: 0.8 },
  { text: "Φ = BA cos(θ)", x: "76%", delay: 2.3 },
  { text: "∇·E = ρ/ε₀", x: "84%", delay: 0.6 },
  { text: "c = 1/√(μ₀ε₀)", x: "92%", delay: 1.4 },
  { text: "ω = 2πf", x: "15%", delay: 2.1 },
  { text: "∮ B·dl = μ₀I", x: "40%", delay: 0.9 },
  { text: "e = ∑(n!)⁻¹", x: "70%", delay: 1.7 },
  { text: "⚛", x: "22%", delay: 0.4 },
  { text: "⚡", x: "50%", delay: 2.2 },
  { text: "∞", x: "88%", delay: 1.1 },
  { text: "π", x: "10%", delay: 1.9 },
  { text: "φ = (1+√5)/2", x: "85%", delay: 0.7 },
];

export default function VaultHeroAnimation({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleVaultClick = () => {
    setClicked(true);
    setTimeout(() => setIsOpen(true), 100);
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes neonGlow {
          0%, 100% {
            filter: drop-shadow(0 0 10px #06b6d4) drop-shadow(0 0 20px #06b6d4) drop-shadow(0 0 40px #06b6d4);
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 15px #06b6d4) drop-shadow(0 0 30px #06b6d4) drop-shadow(0 0 60px #06b6d4) drop-shadow(0 0 80px rgba(255,255,255,0.5));
            transform: scale(1.02);
          }
        }

        @keyframes electricPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        @keyframes contentFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes floatFormula {
          0% {
            opacity: 0;
            transform: translateY(100px) translateX(0);
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-200px) translateX(var(--drift));
          }
        }

        @keyframes goldBarsSlide {
          0% {
            opacity: 0;
            transform: translateX(-50px) rotateZ(-5deg);
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            opacity: 0;
            transform: translateX(50px) rotateZ(5deg);
          }
        }

        .neon-logo {
          animation: neonGlow 2s ease-in-out infinite, electricPulse 1.5s ease-in-out infinite;
        }

        .vault-door-main {
          animation: ${isOpen ? "neonGlow 0.8s ease-in-out forwards" : "none"};
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .vault-content-reveal {
          animation: ${isOpen ? "contentFadeIn 0.8s ease-out 0.5s forwards" : "none"};
          opacity: ${isOpen ? 1 : 0};
        }

        .floating-formula {
          animation: floatFormula 6s ease-in forwards;
        }

        .gold-bar {
          animation: goldBarsSlide 5s ease-in forwards;
        }
      `}</style>

      {/* Floating formulas & elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {FLOATING_ELEMENTS.map((elem, i) => (
          <div
            key={i}
            className="absolute floating-formula text-cyan-400 font-black text-xl md:text-2xl opacity-0"
            style={{
              left: elem.x,
              bottom: "-50px",
              animationDelay: `${elem.delay}s`,
              "--drift": `${Math.random() * 100 - 50}px`,
            }}
          >
            {elem.text}
          </div>
        ))}

        {/* Gold bars */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`gold-${i}`}
            className="absolute gold-bar text-yellow-500 text-3xl opacity-0"
            style={{
              left: `${20 + i * 20}%`,
              top: `${30 + i * 15}%`,
              animationDelay: `${0.8 + i * 0.3}s`,
            }}
          >
            ⬜
          </div>
        ))}
      </div>

      {/* Neon CODEXTECH Logo Display */}
      <div
        onClick={!isOpen && !clicked ? handleVaultClick : null}
        className={`vault-door-main relative transition-all ${!isOpen && !clicked ? "cursor-pointer hover:scale-110" : ""}`}
      >
        <img
          src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5da1807d1_generated_image.png"
          alt="C.O.D.E.X.T.E.C.H. Neon"
          className="neon-logo w-96 sm:w-[500px] md:w-[600px] object-contain"
        />

      </div>

      {/* Redirect to NDA on vault open */}
      {isOpen && (
        typeof window !== 'undefined' && window.location.replace('/vault-nda')
      )}

      {/* Text overlay on vault door before opening */}
      {!clicked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 max-w-3xl mx-auto px-6">
          {children}
        </div>
      )}

      {/* Circuit board pattern background */}
      <div className="absolute inset-0 opacity-0 pointer-events-none" style={{ opacity: isOpen ? 0.03 : 0 }}>
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="80" height="80" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />
              <circle cx="20" cy="20" r="2" fill="#06b6d4" opacity="0.4" />
              <circle cx="80" cy="80" r="2" fill="#06b6d4" opacity="0.4" />
              <line x1="20" y1="20" x2="80" y2="80" stroke="#06b6d4" strokeWidth="0.3" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>
    </div>
  );
}