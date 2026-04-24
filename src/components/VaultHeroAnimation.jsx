import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

const FLOATING_ELEMENTS = [
  { text: "E=mc²", x: "10%", delay: 0 },
  { text: "∫∞", x: "25%", delay: 0.5 },
  { text: "∇²φ", x: "40%", delay: 1 },
  { text: "ψ = Ae^(ikx)", x: "65%", delay: 1.5 },
  { text: "F = qE", x: "80%", delay: 2 },
  { text: "⚛", x: "15%", delay: 0.3 },
  { text: "⚡", x: "55%", delay: 1.2 },
  { text: "🔄", x: "90%", delay: 2.3 },
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
        @keyframes vaultDoorSwing {
          0% {
            transform: rotateY(0deg) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: rotateY(-140deg) translateZ(-200px);
            opacity: 0;
          }
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

        @keyframes circuitGlow {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes vaultLighting {
          0% {
            text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          }
          50% {
            text-shadow: 0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(34, 197, 94, 0.6);
          }
          100% {
            text-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
          }
        }

        .vault-door-main {
          animation: ${isOpen ? "vaultDoorSwing 1.5s ease-in-out forwards" : "none"};
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

        .circuit-pattern {
          animation: circuitGlow 3s ease-in-out infinite;
        }

        .vault-text-lighting {
          animation: vaultLighting 2s ease-in-out infinite;
          font-weight: 900;
          letter-spacing: 3px;
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

      {/* Main vault door - LARGE */}
      <div
        onClick={!isOpen && !clicked ? handleVaultClick : null}
        className={`vault-door-main relative w-96 sm:w-[500px] md:w-[600px] h-[500px] sm:h-[600px] md:h-[700px] rounded-3xl border-12 shadow-2xl transition-all ${!isOpen && !clicked ? "cursor-pointer hover:scale-105" : ""}`}
        style={{
          borderWidth: "20px",
          borderColor: "#1f2937",
          background: "linear-gradient(135deg, #2d3748 0%, #1a202c 100%)",
          boxShadow: isOpen ? "none" : "inset 0 0 60px rgba(0,0,0,0.9), 0 40px 100px rgba(0,0,0,0.8), 0 0 120px rgba(6,182,212,0.4)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Vault handle - larger */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-8 h-32 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full shadow-2xl border-4 border-yellow-500" />

        {/* Vault bolts - circular pattern - larger */}
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-6 h-6 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full border-2 border-gray-500 shadow-lg"
            style={{
              top: `${6 + (i % 4) * 28}%`,
              left: `${6 + Math.floor(i / 4) * 30}%`,
            }}
          />
        ))}

        {/* Main vault dial - MASSIVE combination lock */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 sm:w-80 h-64 sm:h-80">
            {/* Outer dial ring */}
            <div className="absolute inset-0 rounded-full border-8 border-gray-600 shadow-2xl"
              style={{
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), rgba(0,0,0,0.5))",
              }}
            />

            {/* Middle ring */}
            <div className="absolute inset-6 rounded-full border-4 border-gray-500 opacity-60" />

            {/* Inner circle */}
            <div className="absolute inset-16 rounded-full bg-gray-800 border-4 border-gray-600 flex items-center justify-center shadow-inner">
              {/* Center spindle with glow */}
              <div className="w-8 h-8 bg-yellow-400 rounded-full shadow-2xl shadow-yellow-500/70" />
            </div>

            {/* Dial numbers - larger */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-full flex items-start justify-center"
                style={{ transform: `rotate(${i * 30}deg)` }}
              >
                <span className="text-gray-300 font-black text-lg sm:text-xl mt-6 sm:mt-8" style={{ transform: `rotate(${-i * 30}deg)` }}>
                  {(i === 0 ? 12 : i)}
                </span>
              </div>
            ))}

            {/* Tick mark at top - larger */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-6 bg-cyan-400 shadow-lg shadow-cyan-400/60" />
          </div>

          {/* Glowing C.O.D.E.X.T.E.C.H. text on vault - HUGE */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="vault-text-lighting text-cyan-300 text-3xl sm:text-4xl md:text-5xl text-center px-8 font-black">
              C.O.D.E.X.T.E.C.H.
            </div>
          </div>

          {/* Click instruction */}
          {!clicked && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-cyan-400 text-sm sm:text-base font-bold animate-pulse pointer-events-none">
              ↓ CLICK TO UNLOCK ↓
            </div>
          )}
        </div>

        {/* Corner accent lights - larger */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`light-${i}`}
            className="absolute w-16 h-16 bg-gradient-to-br from-cyan-400 to-transparent rounded-full blur-2xl opacity-50"
            style={{
              top: i < 2 ? "12px" : "auto",
              bottom: i >= 2 ? "12px" : "auto",
              left: i % 2 === 0 ? "12px" : "auto",
              right: i % 2 === 1 ? "12px" : "auto",
            }}
          />
        ))}
      </div>

      {/* Revealed content - COOL REVEAL */}
      {isOpen && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-50 p-6">
          <div className="vault-content-reveal max-w-2xl w-full">
            {/* Inner vault glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-2xl blur-2xl" />
            
            {/* Content container */}
            <div className="relative bg-gradient-to-b from-gray-900 to-gray-950 border-2 border-cyan-500 rounded-2xl p-8 sm:p-12 shadow-2xl shadow-cyan-500/50">
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="text-3xl sm:text-4xl font-black text-cyan-300 mb-4">VAULT UNLOCKED</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  You've accessed the complete C.O.D.E.X.T.E.C.H. engineering platform. 40+ build systems, 26 courses, AI patent tools, and the full investor toolkit await.
                </p>
                {children}
              </div>
            </div>
          </div>
        </div>
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