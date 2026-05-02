import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const LOGO_URL = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6722a4c01_839284090_logo.png";

export default function DraggableZenithLogo() {
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 140 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [onOrbit, setOnOrbit] = useState(false);
  const logoRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!logoRef.current) return;
    setIsDragging(true);
    const rect = logoRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({ x: newX, y: newY });

    // Check if on the green orbit (approximate ellipse calculation)
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.82;
    const radiusX = Math.min(window.innerWidth, window.innerHeight) * 0.42;
    const radiusY = Math.min(window.innerWidth, window.innerHeight) * 0.42 * 0.43;

    const dx = (newX + 40 - centerX) / radiusX;
    const dy = (newY + 40 - centerY) / radiusY;
    const distanceFromOrbit = Math.abs(Math.sqrt(dx * dx + dy * dy) - 1);

    setOnOrbit(distanceFromOrbit < 0.08);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setIsDragging(false));
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", () => setIsDragging(false));
      };
    }
  }, [isDragging, dragOffset]);

  const ui = (
    <div
      ref={logoRef}
      onMouseDown={handleMouseDown}
      className="fixed z-[9991] cursor-move transition-all"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: isDragging ? 0.9 : 1,
        filter: onOrbit ? "drop-shadow(0 0 20px rgba(0,255,80,1)) brightness(1.4)" : "drop-shadow(0 0 16px rgba(0,220,255,0.9))",
      }}
    >
      <div className="relative">
        <img
          src={LOGO_URL}
          alt="Zenith Apex"
          className="w-20 h-20 rounded-xl border-2 border-cyan-500 pointer-events-none"
          draggable={false}
        />
        {onOrbit && (
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-green-500 animate-pulse border border-green-300" />
        )}
      </div>
    </div>
  );

  return createPortal(ui, document.body);
}