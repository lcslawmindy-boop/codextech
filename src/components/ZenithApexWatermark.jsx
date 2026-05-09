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
      className="fixed z-10 cursor-grab active:cursor-grabbing"
      style={{
        right: `${Math.max(0, window.innerWidth - position.x - 120)}px`,
        bottom: `${Math.max(0, window.innerHeight - position.y - 120)}px`,
        transform: position.x !== 0 || position.y !== 0 ? `translate(${position.x}px, ${position.y}px)` : 'none',
      }}
    >
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Glow background */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0) 70%)',
          }}
        />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afb5ad292_CODEXTECHLOGO.png"
            alt="Zenith Apex"
            className="w-20 h-20 object-contain drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.8)) drop-shadow(0 0 24px rgba(6,182,212,0.4))',
            }}
          />
        </div>

        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-spin"
          style={{
            animationDuration: '8s',
            animationDirection: 'reverse',
          }}
        />
      </div>
    </div>
  );
}