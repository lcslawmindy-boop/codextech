import { useEffect, useState } from "react";

export default function VaultDoorAnimation({ children, delay = 0.5 }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <style>{`
        @keyframes vaultSwing {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          100% {
            transform: rotateY(-120deg);
            opacity: 0;
            pointerEvents: none;
          }
        }

        @keyframes contentReveal {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .vault-door {
          animation: ${isOpen ? "vaultSwing 1.2s ease-in-out forwards" : "none"};
          transform-origin: right center;
          perspective: 1200px;
        }

        .vault-content {
          animation: ${isOpen ? "contentReveal 0.8s ease-out 0.4s forwards" : "none"};
          opacity: ${isOpen ? 1 : 0};
          transform: ${isOpen ? "scale(1)" : "scale(0.95)"};
        }
      `}</style>

      {/* Vault Door */}
      <div className="vault-door absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl border-2 border-gray-600 pointer-events-none z-10"
        style={{
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.6)",
          perspective: "1200px",
        }}>
        {/* Vault handle */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-16 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full shadow-lg" />
        
        {/* Vault bolts */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gray-500 rounded-full"
            style={{
              top: `${10 + i * 10}%`,
              left: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          />
        ))}

        {/* Vault lock dial */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-20 h-20 border-4 border-gray-500 rounded-full flex items-center justify-center bg-gray-800">
            <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            </div>
          </div>
          {/* Dial tick */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-400" />
        </div>

        {/* Glint effect */}
        <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-white to-transparent rounded-full opacity-20" />
      </div>

      {/* Content behind door */}
      <div className="vault-content relative z-0 p-8">
        {children}
      </div>
    </div>
  );
}