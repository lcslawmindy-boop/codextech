import { useState, useRef } from 'react';

export default function ZenithApexWatermark() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const watermarkRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = watermarkRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={watermarkRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="fixed z-10 cursor-grab active:cursor-grabbing bottom-6 right-6"
      style={{
        transform: position.x !== 0 || position.y !== 0 ? `translate(${position.x}px, ${position.y}px)` : 'none',
      }}
    >
      <style>{`
        @keyframes neonPulse {
          0%, 100% { 
            text-shadow: 0 0 8px rgba(6,182,212,0.8), 0 0 16px rgba(6,182,212,0.6), 0 0 24px rgba(6,182,212,0.4);
            opacity: 1;
          }
          50% { 
            text-shadow: 0 0 16px rgba(6,182,212,1), 0 0 32px rgba(6,182,212,0.8), 0 0 48px rgba(6,182,212,0.6);
            opacity: 0.9;
          }
        }
        @keyframes quantumWave {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes electricPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(6,182,212,0.3); }
          50% { box-shadow: 0 0 40px rgba(6,182,212,0.8), 0 0 80px rgba(6,182,212,0.5), 0 0 120px rgba(6,182,212,0.3); }
        }
      `}</style>
      
      <div className="relative w-56 h-auto flex flex-col items-center justify-center">
        {/* Multiple quantum wave layers */}
        <div
          className="absolute inset-0 rounded-full blur-3xl opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.2) 50%, transparent 100%)',
            animation: 'quantumWave 6s linear infinite',
          }}
        />
        
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)',
            animation: 'quantumWave 8s linear infinite reverse',
          }}
        />

        {/* Logo container with electric glow */}
        <div 
          className="relative z-10 flex items-center justify-center mb-4"
          style={{
            animation: 'electricPulse 2s ease-in-out infinite',
          }}
        >
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/24360f82b_a6e3bd669_logo.png"
            alt="Aethon Apex IP"
            className="w-40 h-40 object-contain"
            style={{
              filter: 'drop-shadow(0 0 16px rgba(6,182,212,1)) drop-shadow(0 0 32px rgba(6,182,212,0.8)) drop-shadow(0 0 48px rgba(6,182,212,0.5))',
            }}
          />
        </div>

        {/* Pulsing text with electricity */}
        <div 
          className="relative z-10 text-center text-white font-black text-xs tracking-widest"
          style={{
            animation: 'neonPulse 2s ease-in-out infinite',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}
        >
          Aethon Apex
        </div>

        {/* Outer glow rings */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/40"
          style={{
            animation: 'quantumWave 4s linear infinite',
          }}
        />
        
        <div
          className="absolute inset-0 rounded-full border border-cyan-300/20"
          style={{
            animation: 'quantumWave 6s linear infinite reverse',
            inset: '-12px',
          }}
        />
      </div>
    </div>
  );
}