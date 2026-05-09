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
      <div className="relative w-56 h-auto flex flex-col items-center justify-center">
        {/* Logo container */}
        <div className="relative z-10 flex items-center justify-center mb-4">
          <img
            src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/24360f82b_a6e3bd669_logo.png"
            alt="Aethon Apex IP"
            className="w-40 h-40 object-contain drop-shadow-lg"
          />
        </div>

        {/* Text */}
        <div className="relative z-10 text-center text-white font-black text-xs tracking-widest" style={{ textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          Aethon Apex
        </div>
      </div>
    </div>
  );
}