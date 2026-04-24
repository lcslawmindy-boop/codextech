/**
 * CodextechVaultBackground
 * Animated, clickable CODEXTECH logo with heartbeat pulsing and scalar wave ripples.
 * Click to enter the vault → redirects to NDA gate.
 */
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function CodextechVaultBackground({ 
  logoUrl = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/83f589a0d_8a413d0c1_logo.png",
  className = "fixed inset-0 pointer-events-none z-0"
}) {
  const navigate = useNavigate();

  const handleVaultClick = () => {
    navigate('/vault-nda');
  };

  return (
    <div className={className}>
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); opacity: 0.5; }
          25% { transform: scale(1.05); opacity: 0.6; }
          50% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1); opacity: 0.5; }
        }

        @keyframes ripple-wave-1 {
          0% { r: 120px; opacity: 0.6; stroke-width: 2px; }
          100% { r: 380px; opacity: 0; stroke-width: 1px; }
        }

        @keyframes ripple-wave-2 {
          0% { r: 120px; opacity: 0; stroke-width: 2px; }
          50% { opacity: 0.4; }
          100% { r: 380px; opacity: 0; stroke-width: 1px; }
        }

        @keyframes ripple-wave-3 {
          0% { r: 120px; opacity: 0; stroke-width: 2px; }
          75% { opacity: 0.3; }
          100% { r: 380px; opacity: 0; stroke-width: 1px; }
        }

        .vault-logo-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: auto;
        }

        .vault-logo-image {
          animation: heartbeat 2s ease-in-out infinite;
          filter: drop-shadow(0 0 30px rgba(6,182,212,0.4));
          transition: filter 0.3s ease;
        }

        .vault-logo-image:hover {
          filter: drop-shadow(0 0 50px rgba(6,182,212,0.8));
        }

        .ripple-1 { animation: ripple-wave-1 2s ease-out infinite; }
        .ripple-2 { animation: ripple-wave-2 2s ease-out infinite; animation-delay: 0.3s; }
        .ripple-3 { animation: ripple-wave-3 2s ease-out infinite; animation-delay: 0.6s; }
      `}</style>

      {/* Ripple waves SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1024 1024"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g transform="translate(512, 512)">
          {/* Ripple waves */}
          <circle cx="0" cy="0" r="120" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.6" className="ripple-1" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0" className="ripple-2" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0" className="ripple-3" />
        </g>
      </svg>

      {/* Clickable logo container */}
      <div className="vault-logo-container cursor-pointer group">
        <button
          onClick={handleVaultClick}
          className="relative flex flex-col items-center gap-4 focus:outline-none transition-transform hover:scale-110 active:scale-95"
          aria-label="Enter the vault"
        >
          {/* Logo image */}
          <img
            src={logoUrl}
            alt="C.O.D.E.X.T.E.C.H. Vault"
            className="vault-logo-image w-64 h-64 sm:w-72 sm:h-72 object-contain drop-shadow-2xl"
          />

          {/* Click instruction */}
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-600/20 border border-cyan-600/50 backdrop-blur-sm group-hover:bg-cyan-600/30 group-hover:border-cyan-500 transition-all">
            <Lock size={14} className="text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 text-xs sm:text-sm font-black uppercase tracking-wider">
              Click to unlock vault
            </span>
          </div>
        </button>
      </div>

      {/* Glow effect background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}