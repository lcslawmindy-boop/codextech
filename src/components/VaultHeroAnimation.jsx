import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import InventionDetailsPanel from "./InventionDetailsPanel";

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
  { text: "PV = nRT", x: "11%", delay: 0.4 },
  { text: "ΔG = ΔH - TΔS", x: "34%", delay: 1.0 },
  { text: "ε₀ = 8.854 × 10⁻¹² F/m", x: "44%", delay: 2.2 },
  { text: "μ₀ = 4π × 10⁻⁷ H/m", x: "62%", delay: 0.7 },
  { text: "α = 1/137 (fine structure)", x: "8%", delay: 1.9 },
  { text: "h = 6.626 × 10⁻³⁴ Js", x: "73%", delay: 0.2 },
  { text: "ℏ = h/2π", x: "19%", delay: 1.3 },
  { text: "σ = e²/h (conductance)", x: "51%", delay: 0.9 },
  { text: "∇·B = 0", x: "85%", delay: 1.5 },
  { text: "∇×B = μ₀J + μ₀ε₀∂E/∂t", x: "29%", delay: 1.1 },
  { text: "u = √(3kT/m)", x: "38%", delay: 2.1 },
  { text: "β = 1/kT", x: "64%", delay: 0.4 },
  { text: "n = N_A × ρ/M", x: "77%", delay: 1.7 },
  { text: "T = 1/f", x: "12%", delay: 0.8 },
  { text: "v = λf", x: "47%", delay: 1.4 },
  { text: "I = P/V", x: "71%", delay: 0.3 },
  { text: "R = ρL/A", x: "26%", delay: 2.0 },
  { text: "KE = ½mv²", x: "54%", delay: 0.5 },
  { text: "PE = mgh", x: "83%", delay: 1.2 },
  { text: "W = Fd cos(θ)", x: "14%", delay: 1.8 },
  { text: "p = mv (momentum)", x: "40%", delay: 0.6 },
  { text: "a = F/m (acceleration)", x: "68%", delay: 1.6 },
  { text: "K = ½I·ω²", x: "87%", delay: 0.9 },
  { text: "A = πr²", x: "16%", delay: 2.3 },
  { text: "V = ⁴⁄₃πr³", x: "59%", delay: 0.2 },
  { text: "∂²Ψ/∂x² = -k²Ψ", x: "35%", delay: 1.4 },
  { text: "⟨p⟩ = -iℏ∫ψ*∂ψ/∂x dx", x: "74%", delay: 0.7 },
  { text: "E_n = -13.6/n² eV", x: "22%", delay: 1.9 },
  { text: "L = √(l(l+1))ℏ", x: "63%", delay: 0.3 },
  { text: "B·A (flux density)", x: "45%", delay: 1.3 },
  { text: "Z_out = √(L/C)", x: "79%", delay: 0.8 },
  { text: "f_0 = 1/(2π√LC)", x: "9%", delay: 1.6 },
  { text: "∇²T = ρC_p ∂T/∂t", x: "41%", delay: 0.5 },
  { text: "M = I α (torque)", x: "18%", delay: 1.2 },
  { text: "J = σE (current density)", x: "52%", delay: 0.8 },
  { text: "Q = mcΔT", x: "89%", delay: 1.9 },
  { text: "x(t) = A cos(ωt + φ)", x: "31%", delay: 0.3 },
  { text: "∫∫ E·dA = Q/ε₀", x: "66%", delay: 1.5 },
  { text: "sin²θ + cos²θ = 1", x: "7%", delay: 2.1 },
  { text: "e^(iπ) + 1 = 0", x: "84%", delay: 0.6 },
  { text: "d²x/dt² + ω₀²x = 0", x: "42%", delay: 1.7 },
  { text: "∮ F·dr = 0", x: "73%", delay: 0.4 },
  { text: "y = mx + b", x: "25%", delay: 1.0 },
  { text: "∫ f(x)dx", x: "58%", delay: 2.3 },
];

const INVENTORS = [
  { name: "Albert Einstein", img: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg", x: "8%", delay: 0.2 },
  { name: "Nikola Tesla", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg", x: "22%", delay: 1.3 },
  { name: "Nikola Tesla", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg", x: "15%", delay: 0.5 },
  { name: "Socrates", img: "https://upload.wikimedia.org/wikipedia/commons/6/65/Socrates_Louvre.jpg", x: "38%", delay: 0.7 },
  { name: "Aristotle", img: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Aristotle_Altemps_Inv8575.jpg", x: "54%", delay: 2.1 },
  { name: "Nikola Tesla", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg", x: "62%", delay: 1.8 },
  { name: "John Bedini", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3b865883a_CODEXTECHLOGO.png", x: "70%", delay: 0.9 },
  { name: "T. Henry Moray", img: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3b865883a_CODEXTECHLOGO.png", x: "86%", delay: 1.5 },
  { name: "Nikola Tesla", img: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg", x: "78%", delay: 0.4 },
];

export default function VaultHeroAnimation({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

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

        @keyframes vaultDoorOpen {
          0% {
            transform: rotateY(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: rotateY(-45deg) scale(0.9);
            opacity: 0.3;
          }
        }

        @keyframes dashboardReveal {
          0% {
            opacity: 0;
            transform: translateZ(-100px);
          }
          100% {
            opacity: 1;
            transform: translateZ(0);
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

        @keyframes floatAround {
          0% {
            opacity: 0.3;
            transform: translate(var(--tx-start), var(--ty-start)) rotateZ(0deg) scale(1);
          }
          25% {
            opacity: 0.8;
            transform: translate(calc(var(--tx-start) + 80px), calc(var(--ty-start) - 60px)) rotateZ(90deg) scale(1.1);
          }
          50% {
            opacity: 1;
            transform: translate(calc(var(--tx-start) + 40px), calc(var(--ty-start) + 100px)) rotateZ(180deg) scale(0.95);
          }
          75% {
            opacity: 0.8;
            transform: translate(calc(var(--tx-start) - 100px), calc(var(--ty-start) + 50px)) rotateZ(270deg) scale(1.05);
          }
          100% {
            opacity: 0.3;
            transform: translate(var(--tx-start), var(--ty-start)) rotateZ(360deg) scale(1);
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

        @keyframes shockwave {
          0%, 100% { opacity: 0; r: 100px; }
          8%, 12% { opacity: 0.8; r: 200px; }
        }

        @keyframes electricPulse {
          0%, 100% { filter: drop-shadow(0 0 2px #ffffff); }
          8%, 12% { filter: drop-shadow(0 0 30px #06b6d4) drop-shadow(0 0 60px #00ffff) drop-shadow(0 0 100px rgba(6,182,212,0.9)); }
        }

        .shockwave-circle {
          animation: shockwave 2s ease-out infinite, electricPulse 2s ease-out infinite;
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
          animation: ${clicked ? "vaultDoorOpen 1.2s ease-in-out forwards" : "none"};
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .vault-content-reveal {
          animation: ${isOpen ? "dashboardReveal 1s ease-out 0.3s forwards" : "none"};
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
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

        {/* Floating Background Elements — Icons floating around in the background */}
        {Array.from({ length: 350 }).map((_, i) => {
          const types = ['binary', 'device', 'equation', 'tool', 'periodic', 'medical', 'lab', 'sacred', 'tower', 'book', 'lightbulb', 'bubble', 'atom', 'molecule', 'wave', 'platonic', 'chakra', 'planet', 'shield', 'coil', 'cage', 'medbed', 'gold', 'logo', 'flag', 'rocket'];
          const type = types[i % types.length];
          
          // Logo URLs array
          const logoUrls = [
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/09f064d29_8a413d0c1_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4dd07a5e4_9e573794d_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a8b37981b_Aurawell10.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/49c0cb57a_2ndlogo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c8c75ff99_AuraWellMedbedlogo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c77d692a1_ZARPlogo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fca8773e2_5fd2b4851_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4362d6939_6a1d771a0_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a7e53247c_7e6a64a71_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/11261fdcf_424bd39ad_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/788498485_996c3efc3_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bc0bf94c4_86465e00f_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1fd2db797_a1e6d0efb_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/424a6819b_aa5437c1c_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/57f065f9b_b5ca55b13_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54b05bdaf_c1c7d1685_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1e2b7d003_c1e1b3fb1_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9d6cd954e_c8c3396d2_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/324f70d9f_d90d9dba8_logo.png',
            'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a9014fe1e_dfa919090_logo.png',
          ];
          const colors = ['#22c55e', '#ea580c'];
          let color = colors[i % 2];
          let glowColor = color === '#22c55e' ? '#16a34a' : '#dc2626';
          
          let content = '';
          let isEmoji = false;
          let fontSize = 22;
          let padding = '18px 24px';
          
          if (type === 'binary') {
            content = Array.from({ length: 4 }).map(() => Math.random() > 0.5 ? '1' : '0').join('');
          } else if (type === 'device') {
            const devices = ['MEG', 'VPO', 'TRZ', 'TRD-1', 'Scalar', 'Prioré', 'G-Com', 'Woodpecker', 'Bedini', 'Anenergy', 'Moray', 'Searl', 'EM-Wave', 'CoilPulse', 'PhiField', 'VacuumPot', 'Tesla Coil', 'Schauberger', 'Whittaker', 'Morray Cell', 'Casimir', 'ZPE Tap'];
            content = devices[Math.floor(Math.random() * devices.length)];
          } else if (type === 'equation') {
            const equations = ['E=mc²', '∇²φ', 'F=qE', 'PV=nRT', 'λν=c', 'ω=2πf', 'α', 'β', 'ΔG=ΔH-TΔS'];
            content = equations[Math.floor(Math.random() * equations.length)];
          } else if (type === 'tool') {
            const tools = ['⚙️', '🔧', '🔩', '⚡', '🛠️', '🪛', '📏', '🔨', '⚒️', '🪚', '🧰', '⛏️'];
            content = tools[Math.floor(Math.random() * tools.length)];
            isEmoji = true;
          } else if (type === 'periodic') {
            const elements = ['H', 'He', 'C', 'N', 'O', 'F', 'Cu', 'Fe', 'Li', 'Au', 'Ag', 'Ni', 'Co', 'Zn', 'Pb', 'Hg', 'U', 'Th'];
            content = elements[Math.floor(Math.random() * elements.length)];
          } else if (type === 'medical') {
            const medical = ['💉', '🧬', '💊', '🩺', '🔬'];
            content = medical[Math.floor(Math.random() * medical.length)];
            isEmoji = true;
          } else if (type === 'lab') {
            const lab = ['🧪', '⚗️', '🧫', '📊', '🔭'];
            content = lab[Math.floor(Math.random() * lab.length)];
            isEmoji = true;
          } else if (type === 'sacred') {
            const sacred = ['π', '◯', '✡️', '☬', '∞', '⊙', '✦'];
            content = sacred[Math.floor(Math.random() * sacred.length)];
          } else if (type === 'tower') {
            content = '📡';
            isEmoji = true;
          } else if (type === 'book') {
            const books = ['📚', '📖', '📕', '📗'];
            content = books[Math.floor(Math.random() * books.length)];
            isEmoji = true;
          } else if (type === 'lightbulb') {
            content = '💡';
            isEmoji = true;
          } else if (type === 'bubble') {
            content = '◉';
          } else if (type === 'atom') {
            content = '⊛';
          } else if (type === 'molecule') {
            const molecules = ['H₂O', 'CO₂', 'NaCl', 'H₂O₂'];
            content = molecules[Math.floor(Math.random() * molecules.length)];
          } else if (type === 'wave') {
            content = '≈';
          } else if (type === 'platonic') {
            const solids = ['⬡', '🔷', '🔶', '⬢', '◆', '△', '▽', '◇', '□', '●'];
            content = solids[Math.floor(Math.random() * solids.length)];
            isEmoji = true;
          } else if (type === 'chakra') {
            const chakras = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚪'];
            content = chakras[Math.floor(Math.random() * chakras.length)];
            isEmoji = true;
          } else if (type === 'planet') {
            const planets = ['🌍', '🌎', '🌏', '☀️', '🌙', '⭐', '🪐', '🔴', '🟡', '⚪'];
            content = planets[Math.floor(Math.random() * planets.length)];
            isEmoji = true;
          } else if (type === 'shield') {
            content = '🛡️';
            isEmoji = true;
          } else if (type === 'coil') {
            const coils = ['🌀', '↻', '⟳', '⟰'];
            content = coils[Math.floor(Math.random() * coils.length)];
            isEmoji = content === '🌀';
          } else if (type === 'cage') {
            content = '⬜';
          } else if (type === 'medbed') {
            content = '🛏️';
            isEmoji = true;
          } else if (type === 'gold') {
            const golds = ['■', '◆', '▪️', '⬛', '$'];
            content = golds[Math.floor(Math.random() * golds.length)];
            color = '#fbbf24';
            glowColor = '#f59e0b';
          } else if (type === 'logo') {
            content = logoUrls[Math.floor(Math.random() * logoUrls.length)];
            isEmoji = true;
          } else if (type === 'flag') {
            content = 'https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0bbe1f37e_615783632_25669650249318403_7814581183133987149_n.jpg';
            isEmoji = true;
          } else if (type === 'rocket') {
            const rockets = ['🚀', '🛸', '✈️', '🛩️'];
            content = rockets[Math.floor(Math.random() * rockets.length)];
            isEmoji = true;
          }
          
          const startX = Math.random() * window.innerWidth - window.innerWidth / 2;
          const startY = Math.random() * window.innerHeight - window.innerHeight / 2;
          
          return (
            <div
              key={`float-${i}`}
              className="absolute"
              style={{
                '--tx-start': `${startX}px`,
                '--ty-start': `${startY}px`,
                left: '50%',
                top: '50%',
                marginLeft: `${type === 'logo' ? -40 : (isEmoji ? -26 : -24)}px`,
                marginTop: `${type === 'logo' ? -40 : (isEmoji ? -26 : -22)}px`,
                animation: `floatAround ${12 + i % 8}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6,
              }}
            >
              {(type === 'logo' || type === 'flag') ? (
                <img
                  src={content}
                  alt={type}
                  className={`object-contain rounded-lg border border-cyan-400/30 backdrop-blur-sm ${type === 'flag' ? 'w-16 h-16' : 'w-20 h-20'}`}
                  style={{
                    boxShadow: '0 0 16px rgba(6,182,212,0.4)',
                    opacity: 0.7,
                  }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <button
                  onClick={() => setSelectedType(type)}
                  className="hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  title={`Click to view ${type} details`}
                  style={{
                    padding: isEmoji ? '24px 28px' : '18px 24px',
                    borderRadius: isEmoji ? '50%' : '12px',
                    border: `4px solid ${color}`,
                    backgroundColor: `${color}15`,
                    color: color,
                    fontSize: isEmoji ? '52px' : '22px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    textShadow: `0 0 12px ${color}, 0 0 24px ${glowColor}`,
                    boxShadow: `0 0 16px ${color}, inset 0 0 12px ${color}20`,
                    fontFamily: isEmoji ? 'inherit' : 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {content}
                </button>
              )}
            </div>
          );
        })}

        {/* Electric Shockwaves SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
          {/* Expanding electric shockwave circles */}
          {Array.from({ length: 8 }).map((_, i) => {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * (window.innerHeight * 0.6);
            return (
              <g key={`shock-${i}`} transform={`translate(${centerX}, ${centerY})`}>
                {/* Main shockwave circle */}
                <circle
                  cx="0"
                  cy="0"
                  r="100"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  className="shockwave-circle"
                  style={{
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
                {/* Secondary pulse */}
                <circle
                  cx="0"
                  cy="0"
                  r="100"
                  fill="none"
                  stroke="#00ffff"
                  strokeWidth="1.5"
                  className="shockwave-circle"
                  style={{
                    animationDelay: `${i * 0.5 + 0.1}s`,
                    opacity: 0.6,
                  }}
                />
                {/* Bright center flash */}
                <circle
                  cx="0"
                  cy="0"
                  r="8"
                  fill="#ffffff"
                  opacity="0"
                  style={{
                    animation: `electricPulse 2s ease-out infinite`,
                    animationDelay: `${i * 0.5}s`,
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
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-3 border-cyan-400 object-cover shadow-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="text-cyan-300 text-sm md:text-base font-bold drop-shadow-lg whitespace-nowrap text-center px-1">
              {inventor.name}
            </span>
          </div>
        ))}
      </div>

      {/* Neon CODEXTECH Logo Display */}
      <div
        onClick={!isOpen && !clicked ? handleVaultClick : null}
        className={`vault-door-main relative transition-all ${!isOpen && !clicked ? "cursor-pointer hover:scale-110" : ""}`}
        style={{ marginBottom: '120px', position: 'relative', zIndex: 30 }}
      >
        <img
          src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5da1807d1_generated_image.png"
          alt="C.O.D.E.X.T.E.C.H. Neon"
          className="neon-logo w-[420px] sm:w-[580px] md:w-[720px] object-contain"
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

      {/* Dashboard Feature Reveal (Behind vault door) */}
      {clicked && (
        <div className="vault-content-reveal absolute inset-0 flex items-center justify-center z-10 px-6">
          <div className="bg-gray-900/95 border border-cyan-500/30 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-4xl shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-cyan-300 mb-3">Welcome to C.O.D.E.X.T.E.C.H.</h2>
              <p className="text-gray-300 text-lg">Complete Engineering Execution Platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/50 transition-all">
                <div className="text-3xl mb-2">📐</div>
                <h3 className="font-black text-cyan-300 mb-2">Build Plans</h3>
                <p className="text-gray-400 text-sm">40+ complete execution workflows with exact BOMs, schematics, and assembly guides</p>
              </div>
              
              <div className="bg-gray-800/50 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/50 transition-all">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-black text-cyan-300 mb-2">40+ Courses</h3>
                <p className="text-gray-400 text-sm">Structured learning from fundamentals to advanced prototyping and patent strategy</p>
              </div>
              
              <div className="bg-gray-800/50 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/50 transition-all">
                <div className="text-3xl mb-2">🛡️</div>
                <h3 className="font-black text-cyan-300 mb-2">AI Patent Tools</h3>
                <p className="text-gray-400 text-sm">Generate USPTO-compliant provisional patents, FTO analysis, and investor packages</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {['Supplier Links', 'Video Guides', 'FTO Analysis', 'Investor CRM', 'Prior Art Archive', 'VDR Portal', 'Pitch Deck Generator', 'Capital Raising'].map((feature, i) => (
                <div key={i} className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2 text-center">
                  <p className="text-cyan-300 text-xs font-bold">{feature}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') window.location.replace('/vault-nda');
                }}
                className="px-8 py-4 rounded-xl font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 transition-all shadow-lg">
                Enter Vault → NDA
              </button>
              <button
                onClick={() => setClicked(false)}
                className="px-8 py-4 rounded-xl font-bold text-cyan-300 border border-cyan-500 hover:bg-cyan-500/10 transition-all">
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redirect to NDA on vault open */}
      {isOpen && (
        typeof window !== 'undefined' && window.location.replace('/vault-nda')
      )}

      {/* Details Panel */}
      <InventionDetailsPanel selectedType={selectedType} onClose={() => setSelectedType(null)} />

      {/* Text overlay on vault door before opening */}
      {!clicked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 max-w-4xl mx-auto px-6 gap-6">
          {children}
        </div>
      )}

      {/* CODEXTECH Acronym - Single line below vault */}
      {!clicked && (
        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center items-end gap-2 md:gap-4 px-2 pointer-events-none" style={{ bottom: '20px', zIndex: 100 }}>
          {[
            { letter: 'C', meaning: 'Complete', num: '1', color: '#ff006e', glow: '#ff1493' },
            { letter: 'O', meaning: 'Open', num: '2', color: '#fb5607', glow: '#ff6b35' },
            { letter: 'D', meaning: 'Design', num: '3', color: '#ffbe0b', glow: '#ffd60a' },
            { letter: 'E', meaning: 'Execute', num: '4', color: '#8338ec', glow: '#a371ff' },
            { letter: 'X', meaning: 'eXamine', num: '5', color: '#3a86ff', glow: '#5dade2' },
            { letter: 'T', meaning: 'Test', num: '6', color: '#06ffa5', glow: '#1dd1a1' },
            { letter: 'E', meaning: 'Engineer', num: '7', color: '#ff006e', glow: '#ff1493' },
            { letter: 'C', meaning: 'Construct', num: '8', color: '#fb5607', glow: '#ff6b35' },
            { letter: 'H', meaning: 'Harness', num: '9', color: '#ffbe0b', glow: '#ffd60a' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3 md:gap-5" style={{ perspective: '1000px' }}>
              <div className="relative w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 rounded-lg flex items-center justify-center font-black text-4xl md:text-5xl lg:text-6xl transition-all hover:scale-105 border-2 group cursor-pointer" style={{
                background: `linear-gradient(135deg, ${item.color}35, ${item.glow}25)`,
                color: "#fff",
                borderColor: item.glow,
                boxShadow: `0 0 30px ${item.color}, 0 0 60px ${item.glow}, inset 0 0 20px rgba(255,255,255,0.15), 0 20px 40px rgba(0,0,0,0.6)`,
                transform: "rotateX(15deg) rotateY(-15deg) translateZ(20px)",
                transformStyle: "preserve-3d",
                backdropFilter: 'blur(4px)',
              }}>
                {item.letter}
              </div>
              <span className="text-xs md:text-sm lg:text-base font-black text-white whitespace-nowrap text-center px-2 py-0.5 rounded" style={{
                textShadow: `0 0 8px #000, 0 0 16px #000`,
                letterSpacing: '0.5px',
                backgroundColor: 'rgba(0,0,0,0.7)',
              }}>
                {item.meaning}
              </span>
            </div>
          ))}
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