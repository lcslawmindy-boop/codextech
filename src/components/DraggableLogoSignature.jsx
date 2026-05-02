import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const LOGO_VARIANTS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/08bfd12e2_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/25a578239_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ca20d80c2_generated_image.png",
];

export default function DraggableLogoSignature() {
  const [variantIndex, setVariantIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize position to bottom-right
    const updatePos = () => {
      if (containerRef.current) {
        setPosition({
          x: window.innerWidth - 140,
          y: window.innerHeight - 140,
        });
      }
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const ui = (
    <div
      ref={containerRef}
      className="fixed z-[9998] select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        transition: isDragging ? "none" : "all 0.2s ease-out",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Logo display area */}
      <div
        className="relative rounded-2xl shadow-2xl overflow-hidden border"
        style={{
          width: "120px",
          height: "120px",
          background: "rgba(0,0,20,0.9)",
          backdropFilter: "blur(12px)",
          border: "2px solid rgba(0,220,255,0.7)",
          boxShadow:
            "0 0 32px rgba(0,220,255,0.8), 0 0 60px rgba(0,180,255,0.4), inset 0 0 40px rgba(0,180,255,0.1)",
        }}
      >
        <img
          src={LOGO_VARIANTS[variantIndex]}
          alt="Zenith Apex Tech Logo"
          className="w-full h-full object-cover"
          draggable="false"
        />
      </div>

      {/* Variant selector dots */}
      <div className="flex gap-2 mt-2 justify-center">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => setVariantIndex(idx)}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: variantIndex === idx ? "rgba(0,220,255,1)" : "rgba(0,220,255,0.3)",
              boxShadow: variantIndex === idx ? "0 0 8px rgba(0,220,255,1)" : "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        className="text-center mt-1 font-bold text-xs uppercase"
        style={{
          color: "rgba(0,220,255,0.8)",
          textShadow: "0 0 8px rgba(0,220,255,0.6)",
          pointerEvents: "none",
        }}
      >
        Variant {variantIndex + 1}
      </p>
    </div>
  );

  return createPortal(ui, document.body);
}