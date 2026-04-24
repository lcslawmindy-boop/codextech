import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

const FLOATING_FORMULAS = [
  { text: "E=mc²", x: "5%", delay: 0 },
  { text: "c = 299,792,458 m/s", x: "12%", delay: 0.5 },
  { text: "ax² + bx + c = 0", x: "8%", delay: 1 },
  { text: "∇×E = -∂B/∂t", x: "18%", delay: 1.5 },
  { text: "x = (-b ± √(b²-4ac))/2a", x: "25%", delay: 2 },
  { text: "∇²φ = ρ/ε₀", x: "32%", delay: 0.3 },
  { text: "ψ = Ae^(ikx)", x: "39%", delay: 1.2 },
  { text: "F = qE + q(v×B)", x: "46%", delay: 1.8 },
  { text: "iℏ∂ψ/∂t = Ĥψ", x: "53%", delay: 0.8 },
  { text: "∮ E·dl = -dΦ_B/dt", x: "60%", delay: 2.3 },
  { text: "G_μν = 8πT_μν", x: "67%", delay: 0.6 },
  { text: "Φ = BA cos(θ)", x: "74%", delay: 1.4 },
  { text: "∇·E = ρ/ε₀", x: "81%", delay: 0.9 },
  { text: "c = 1/√(μ₀ε₀)", x: "88%", delay: 1.7 },
  { text: "ω = 2πf", x: "15%", delay: 2.1 },
  { text: "∮ B·dl = μ₀I", x: "42%", delay: 0.4 },
  { text: "e = ∑(n!)⁻¹", x: "70%", delay: 1.3 },
  { text: "F = ma", x: "10%", delay: 2.2 },
  { text: "P = VI", x: "95%", delay: 0.7 },
  { text: "Q = It", x: "20%", delay: 1.6 },
  { text: "Z = √(R² + X²)", x: "55%", delay: 0.5 },
  { text: "∂²u/∂t² = c²∇²u", x: "75%", delay: 1.9 },
  { text: "V = IR", x: "35%", delay: 0.2 },
  { text: "ε = E₀sin(ωt)", x: "65%", delay: 2.0 },
  { text: "λν = c", x: "28%", delay: 1.1 },
];

const INVENTORS = [
  { name: "Albert Einstein", img: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg", x: "8%", delay: 0.2 },
  { name: "Nikola Tesla", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg", x: "22%", delay: 1.3 },
  { name: "Socrates", img: "https://upload.wikimedia.org/wikipedia/commons/6/65/Socrates_Louvre.jpg", x: "38%", delay: 0.7 },
  { name: "Aristotle", img: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Aristotle_Altemps_Inv8575.jpg", x: "54%", delay: 2.1 },
  { name: "John Bedini", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3b865883a_CODEXTECHLOGO.png", x: "70%", delay: 0.9 },
  { name: "T. Henry Moray", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3b865883a_CODEXTECHLOGO.png", x: "86%", delay: 1.5 },
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
            transform: translateY(0) translateX(0);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-600px) translateX(var(--drift));
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
          animation: floatFormula 12s ease-in forwards;
        }

        .gold-bar {
          animation: goldBarsSlide 5s ease-in forwards;
        }
      `}</style>

      {/* Floating formulas & elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mathematical formulas */}
        {FLOATING_FORMULAS.map((elem, i) => (
          <div
            key={`formula-${i}`}
            className="absolute floating-formula text-cyan-400 font-black text-sm md:text-lg"
            style={{
              left: elem.x,
              bottom: "0px",
              animationDelay: `${elem.delay}s`,
              "--drift": `${Math.random() * 100 - 50}px`,
            }}
          >
            {elem.text}
          </div>
        ))}

        {/* Inventor portraits */}
        {INVENTORS.map((inventor, i) => (
          <div
            key={`inventor-${i}`}
            className="absolute floating-formula flex flex-col items-center gap-1"
            style={{
              left: inventor.x,
              bottom: "0px",
              animationDelay: `${inventor.delay}s`,
              "--drift": `${Math.random() * 80 - 40}px`,
            }}
          >
            <img
              src={inventor.img}
              alt={inventor.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-cyan-400 object-cover shadow-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="text-cyan-300 text-xs md:text-sm font-bold drop-shadow-lg whitespace-nowrap text-center px-1">
              {inventor.name}
            </span>
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