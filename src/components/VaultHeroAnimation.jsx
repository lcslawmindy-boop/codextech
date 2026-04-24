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
  { text: "H = -∇²/2m + V", x: "3%", delay: 0.9 },
  { text: "S = kT ln(Ω)", x: "48%", delay: 1.4 },
  { text: "τ = r × F", x: "92%", delay: 0.3 },
  { text: "Θ = ∫ L dt", x: "22%", delay: 2.0 },
  { text: "∆E·∆t ≥ ℏ/4π", x: "57%", delay: 0.6 },
  { text: "A = ∫ B·dA", x: "78%", delay: 1.5 },
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

        @keyframes moneyFall {
          0% {
            opacity: 0;
            transform: translateY(-100px) rotateZ(0deg);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
            transform: translateY(800px) rotateZ(360deg);
          }
        }

        @keyframes lightning {
          0%, 100% { opacity: 0; }
          8%, 12% { opacity: 1; }
          13%, 100% { opacity: 0; }
        }

        @keyframes boltPath {
          0% {
            stroke-dashoffset: 1000;
          }
          8%, 12% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes lightningGlow {
          0%, 100% { filter: drop-shadow(0 0 5px #ffffff); }
          8%, 12% { filter: drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 40px #06b6d4) drop-shadow(0 0 60px #06b6d4) drop-shadow(0 0 100px rgba(6,182,212,0.8)); }
        }

        .money-fall {
          animation: moneyFall 8s ease-in forwards;
        }

        .lightning-bolt {
          animation: lightning 2s ease-in-out infinite, boltPath 2s ease-in-out infinite, lightningGlow 2s ease-in-out infinite;
          stroke-dasharray: 1000;
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
        {/* Mathematical formulas with glow */}
        {FLOATING_FORMULAS.map((elem, i) => (
          <div
            key={`formula-${i}`}
            className="absolute floating-formula font-black text-sm md:text-lg"
            style={{
              left: elem.x,
              bottom: "0px",
              animationDelay: `${elem.delay}s`,
              "--drift": `${Math.random() * 100 - 50}px`,
              color: '#ffffff',
              textShadow: "0 0 10px #ffffff, 0 0 20px #06b6d4, 0 0 30px #06b6d4",
              filter: "brightness(1.2)",
            }}
          >
            {elem.text}
          </div>
        ))}

        {/* Falling Matrix Elements — Binary, Devices, Equations, Tools, Medical, Sacred Geometry */}
        {Array.from({ length: 50 }).map((_, i) => {
          const types = ['binary', 'device', 'equation', 'tool', 'periodic', 'medical', 'lab', 'sacred', 'tower', 'book', 'lightbulb', 'bubble'];
          const type = types[i % types.length];
          const colors = ['#22c55e', '#ea580c']; // green or orange
          const color = colors[i % 2];
          const glowColor = color === '#22c55e' ? '#16a34a' : '#dc2626';
          
          let content = '';
          let isEmoji = false;
          
          if (type === 'binary') {
            content = Array.from({ length: 4 }).map(() => Math.random() > 0.5 ? '1' : '0').join('');
          } else if (type === 'device') {
            const devices = ['MEG', 'VPO', 'TRZ', 'TRD-1', 'Scalar', 'Prioré'];
            content = devices[Math.floor(Math.random() * devices.length)];
          } else if (type === 'equation') {
            const equations = ['E=mc²', '∇²φ', 'F=qE', 'P=VI', 'λν=c', 'ω=2πf'];
            content = equations[Math.floor(Math.random() * equations.length)];
          } else if (type === 'tool') {
            const tools = ['⚙️', '🔧', '🔩', '⚡', '🛠️', '🪛', '📏'];
            content = tools[Math.floor(Math.random() * tools.length)];
            isEmoji = true;
          } else if (type === 'periodic') {
            const elements = ['Cu', 'Fe', 'Li', 'Au', 'Ag', 'Ni', 'Co', 'Zn', 'Pb'];
            content = elements[Math.floor(Math.random() * elements.length)];
          } else if (type === 'medical') {
            const medical = ['💉', '🧬', '💊', '🩺', '🔬'];
            content = medical[Math.floor(Math.random() * medical.length)];
            isEmoji = true;
          } else if (type === 'lab') {
            const lab = ['🧪', '⚗️', '🧫', '📊'];
            content = lab[Math.floor(Math.random() * lab.length)];
            isEmoji = true;
          } else if (type === 'sacred') {
            const sacred = ['π', '◯', '✡️', '☬', '∞'];
            content = sacred[Math.floor(Math.random() * sacred.length)];
          } else if (type === 'tower') {
            content = '📡';
            isEmoji = true;
          } else if (type === 'book') {
            const books = ['📚', '📖', '📕'];
            content = books[Math.floor(Math.random() * books.length)];
            isEmoji = true;
          } else if (type === 'lightbulb') {
            content = '💡';
            isEmoji = true;
          } else if (type === 'bubble') {
            content = '◉';
          }
          
          return (
            <div
              key={`matrix-${i}`}
              className="absolute money-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-50px`,
                animationDelay: `${i * 0.2}s`,
                animation: `moneyFall 8s ease-in infinite`,
              }}
            >
              <div
                style={{
                  padding: isEmoji ? '8px 10px' : '6px 12px',
                  borderRadius: isEmoji ? '50%' : '6px',
                  border: `2px solid ${color}`,
                  backgroundColor: `${color}15`,
                  color: color,
                  fontSize: isEmoji ? '18px' : '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  textShadow: `0 0 8px ${color}, 0 0 16px ${glowColor}`,
                  boxShadow: `0 0 12px ${color}, inset 0 0 8px ${color}20`,
                  fontFamily: isEmoji ? 'inherit' : 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {content}
              </div>
            </div>
          );
        })}

        {/* Lightning bolts SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {/* Intense random lightning bolts */}
          {Array.from({ length: 10 }).map((_, i) => {
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * 300;
            const endX = startX + (Math.random() - 0.5) * 300;
            const endY = startY + 500;
            return (
              <g key={`lightning-${i}`}>
                {/* Outer glow bolt */}
                <path
                  d={`M ${startX} ${startY} Q ${startX + Math.random() * 150 - 75} ${startY + 150} ${endX} ${endY}`}
                  stroke="#06b6d4"
                  strokeWidth="8"
                  fill="none"
                  className="lightning-bolt"
                  style={{
                    animationDelay: `${i * 0.4}s`,
                    opacity: 0.3,
                  }}
                />
                {/* Main bright bolt */}
                <path
                  d={`M ${startX} ${startY} Q ${startX + Math.random() * 150 - 75} ${startY + 150} ${endX} ${endY}`}
                  stroke="#fff"
                  strokeWidth="4"
                  fill="none"
                  className="lightning-bolt"
                  style={{
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
                {/* Inner core bolt */}
                <path
                  d={`M ${startX} ${startY} Q ${startX + Math.random() * 150 - 75} ${startY + 150} ${endX} ${endY}`}
                  stroke="#06b6d4"
                  strokeWidth="1.5"
                  fill="none"
                  className="lightning-bolt"
                  style={{
                    animationDelay: `${i * 0.4 + 0.05}s`,
                  }}
                />
              </g>
            );
          })}
        </svg>

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
        
        {/* Caution Tape at Very Top */}
        {!clicked && (
          <div className="absolute -top-12 left-0 right-0 pointer-events-none w-full z-50">
            {/* Caution Tape Stripes */}
            <div className="w-full h-24" style={{
              backgroundImage: "repeating-linear-gradient(45deg, #facc15, #facc15 12px, #000 12px, #000 24px)",
              boxShadow: "0 8px 30px rgba(250, 204, 21, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.3)",
            }}></div>
            
            {/* CAUTION Text */}
            <div style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#facc15',
              textShadow: "0 0 30px #facc15, 0 0 60px rgba(250, 204, 21, 0.6), 0 4px 15px rgba(0, 0, 0, 0.5)",
              letterSpacing: '0.2em',
              textAlign: 'center',
              marginTop: '-65px',
              position: 'relative',
              zIndex: 50,
              whiteSpace: 'nowrap'
            }}>
              ⚠️ CAUTION ⚠️
            </div>
          </div>
        )}
      </div>

      {/* Redirect to NDA on vault open */}
      {isOpen && (
        typeof window !== 'undefined' && window.location.replace('/vault-nda')
      )}

      {/* Text overlay on vault door before opening */}
      {!clicked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 max-w-4xl mx-auto px-6 gap-6">
          {children}
          
          {/* CODEXTECH Explanation */}
          <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 sm:gap-4 flex-wrap px-4">
            {[
              { letter: 'C', meaning: 'Consciousness' },
              { letter: 'O', meaning: 'Oscillation' },
              { letter: 'D', meaning: 'Devices' },
              { letter: 'E', meaning: 'Engineering' },
              { letter: 'X', meaning: 'eXperimental' },
              { letter: 'T', meaning: 'Technology' },
              { letter: 'E', meaning: 'Extraction' },
              { letter: 'C', meaning: 'Construct' },
              { letter: 'H', meaning: 'Harmonic' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center font-black text-lg sm:text-xl" style={{
                  background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                  color: "#fff",
                  boxShadow: "0 0 20px #06b6d4, inset 0 0 10px rgba(255,255,255,0.2)",
                }}>
                  {item.letter}
                </div>
                <span className="text-xs sm:text-sm font-bold text-cyan-300 whitespace-nowrap drop-shadow-lg">{item.meaning}</span>
              </div>
            ))}
          </div>
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