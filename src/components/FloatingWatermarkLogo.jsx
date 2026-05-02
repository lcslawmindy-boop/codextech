import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

export default function FloatingWatermarkLogo() {
  const [pos, setPos] = useState({ x: window.innerWidth - 120, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      // Keep within bounds
      const boundX = Math.max(0, Math.min(newX, window.innerWidth - 100));
      const boundY = Math.max(0, Math.min(newY, window.innerHeight - 100));
      setPos({ x: boundX, y: boundY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="fixed z-[9000] cursor-grab active:cursor-grabbing user-select-none"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transition: isDragging ? "none" : "none"
      }}
    >
      <style>{`
        @keyframes neonPulse {
          0%, 100% {
            box-shadow: 0 0 8px rgba(0, 220, 255, 0.6),
                        0 0 16px rgba(0, 220, 255, 0.4),
                        inset 0 0 12px rgba(0, 220, 255, 0.15);
            border-color: rgba(0, 220, 255, 0.8);
          }
          50% {
            box-shadow: 0 0 16px rgba(0, 220, 255, 0.9),
                        0 0 32px rgba(0, 220, 255, 0.6),
                        inset 0 0 20px rgba(0, 220, 255, 0.25);
            border-color: rgba(0, 220, 255, 1);
          }
        }
      `}</style>

      <div
        className="relative"
        style={{
          animation: "neonPulse 2s ease-in-out infinite",
          borderRadius: "12px",
          border: "2px solid rgba(0, 220, 255, 0.8)",
          background: "rgba(10, 20, 40, 0.9)",
          backdropFilter: "blur(12px)",
          padding: "6px",
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        {/* Logo image */}
        <img
          src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6722a4c01_839284090_logo.png"
          alt="Zenith Apex Tech"
          className="w-full h-full object-cover rounded-lg"
          draggable={false}
          style={{ pointerEvents: "none" }}
        />

        {/* Glow overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(0,220,255,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
            borderRadius: "10px"
          }}
        />

        {/* Corner indicator */}
        <div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{
            background: "rgba(0, 220, 255, 0.8)",
            boxShadow: "0 0 6px rgba(0, 220, 255, 0.9)"
          }}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 text-xs whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
        Drag to move
      </div>
    </div>
  );
}