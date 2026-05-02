import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RotateCcw } from "lucide-react";
import { useZenithTheme } from "@/lib/ZenithThemeContext";

export default function ZenithInteractiveController() {
  const { currentTheme } = useZenithTheme();
  const [sunSpeedMultiplier, setSunSpeedMultiplier] = useState(1);
  const [orbitSkew, setOrbitSkew] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Reset to equilibrium
  const handleReset = () => {
    setSunSpeedMultiplier(1);
    setOrbitSkew(0);
  };

  // Mouse move handler for drag-based control
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Distance from center influences speed
      const distX = (e.clientX - centerX) / window.innerWidth;
      const distY = (e.clientY - centerY) / window.innerHeight;

      // Speed multiplier based on distance from center
      const speed = Math.sqrt(distX * distX + distY * distY) * 3;
      setSunSpeedMultiplier(Math.max(0.3, Math.min(3, speed)));

      // Orbit skew based on angle
      const angle = Math.atan2(distY, distX);
      setOrbitSkew(angle);
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
  }, [isDragging]);

  const ui = (
    <div
      className="fixed bottom-4 left-4 z-[9997] flex flex-col gap-3"
      style={{
        pointerEvents: "auto",
      }}
    >
      {/* Control Panel */}
      <div
        className="rounded-2xl p-4 border backdrop-blur-md shadow-2xl"
        style={{
          background: currentTheme.bgCard,
          borderColor: currentTheme.accentColor + "0.5)",
          boxShadow: `0 0 20px ${currentTheme.primaryGlow}0.4)`,
        }}
        ref={containerRef}
      >
        <p
          className="text-xs font-black uppercase tracking-widest mb-3"
          style={{ color: currentTheme.accentColor + "0.8)" }}
        >
          Interactive Controls
        </p>

        {/* Drag to Control Info */}
        <div className="mb-4 p-3 rounded-lg bg-black/30 border" style={{ borderColor: currentTheme.gridColor + "0.3)" }}>
          <p className="text-xs text-gray-300 mb-2">
            <span style={{ color: currentTheme.accentColor + "0.9)" }} className="font-bold">
              Drag anywhere →
            </span>{" "}
            alter sun speed & orbit path
          </p>
          <button
            onMouseDown={() => setIsDragging(true)}
            className="w-full py-2 rounded-lg font-bold text-xs transition-all active:scale-95"
            style={{
              background: currentTheme.primaryGlow + "0.2)",
              border: `1px solid ${currentTheme.accentColor}0.6)`,
              color: currentTheme.accentColor + "1)",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            {isDragging ? "CONTROLLING..." : "ENGAGE CONTROLS"}
          </button>
        </div>

        {/* Speed Display */}
        <div className="mb-3 p-2 rounded-lg bg-black/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Sun Speed</span>
            <span
              className="text-xs font-bold"
              style={{ color: currentTheme.accentColor + "0.9)" }}
            >
              {sunSpeedMultiplier.toFixed(2)}x
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: currentTheme.gridColor + "0.2)" }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${(sunSpeedMultiplier / 3) * 100}%`,
                background: currentTheme.primaryGlow + "0.8)",
              }}
            />
          </div>
        </div>

        {/* Orbit Skew Display */}
        <div className="mb-4 p-2 rounded-lg bg-black/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Orbit Skew</span>
            <span
              className="text-xs font-bold"
              style={{ color: currentTheme.accentColor + "0.9)" }}
            >
              {Math.round((orbitSkew * 180) / Math.PI)}°
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: currentTheme.gridColor + "0.2)" }}
          >
            <div
              className="h-full transition-all"
              style={{
                width: `${((orbitSkew + Math.PI) / (Math.PI * 2)) * 100}%`,
                background: currentTheme.primaryGlow + "0.8)",
              }}
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-xs transition-all active:scale-95"
          style={{
            background: currentTheme.accentColor + "0.15)",
            border: `1px solid ${currentTheme.accentColor}0.4)`,
            color: currentTheme.accentColor + "1)",
          }}
        >
          <RotateCcw size={12} />
          Reset to Equilibrium
        </button>
      </div>
    </div>
  );

  // Export state for background use
  useEffect(() => {
    window.__zenithControls = {
      sunSpeedMultiplier,
      orbitSkew,
    };
  }, [sunSpeedMultiplier, orbitSkew]);

  return createPortal(ui, document.body);
}