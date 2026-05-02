import { useEffect, useRef } from "react";

export default function MashupLogoCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    const cx = size / 2;
    const cy = size / 2;

    // Background
    ctx.fillStyle = "rgba(10, 20, 40, 0.9)";
    ctx.fillRect(0, 0, size, size);

    // Globe sphere base
    const globeR = 80;
    const grad = ctx.createRadialGradient(cx - 10, cy - 10, 0, cx, cy, globeR);
    grad.addColorStop(0, "rgba(50, 100, 150, 0.8)");
    grad.addColorStop(0.7, "rgba(20, 50, 100, 0.9)");
    grad.addColorStop(1, "rgba(10, 30, 60, 1)");
    ctx.beginPath();
    ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Grid lines (from logo 1, 2, 3)
    ctx.strokeStyle = "rgba(200, 220, 255, 0.4)";
    ctx.lineWidth = 1.2;
    
    // Latitude lines
    for (let i = 1; i < 5; i++) {
      const y = cy - globeR + (globeR * 2 / 5) * i;
      ctx.beginPath();
      ctx.ellipse(cx, y, globeR * Math.cos(Math.asin((y - cy) / globeR)), 8, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Longitude lines
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * globeR * 0.8, cy - globeR * 0.6);
      ctx.lineTo(cx + Math.cos(a) * globeR * 0.8, cy + globeR * 0.6);
      ctx.stroke();
    }

    // Cyan network connections (from logo 4)
    ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const a1 = (Math.PI * 2 / 6) * i;
      const a2 = (Math.PI * 2 / 6) * ((i + 2) % 6);
      const r = globeR * 0.7;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r * 0.6);
      ctx.lineTo(cx + Math.cos(a2) * r, cy + Math.sin(a2) * r * 0.6);
      ctx.stroke();
    }

    // Green accent lines (from logo 4, 5)
    ctx.strokeStyle = "rgba(100, 255, 120, 0.4)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) {
      const a = (Math.PI * 2 / 4) * i + Math.PI / 8;
      const r = globeR * 0.75;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6);
      ctx.lineTo(cx + Math.cos(a + Math.PI / 4) * (r * 0.6), cy + Math.sin(a + Math.PI / 4) * (r * 0.4));
      ctx.stroke();
    }

    // Network nodes (from logo 4)
    ctx.fillStyle = "rgba(0, 220, 200, 0.8)";
    ctx.shadowColor = "rgba(0, 220, 200, 1)";
    ctx.shadowBlur = 8;
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      const r = globeR * 0.75;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Orbiting nodes ring (from logo 4)
    ctx.strokeStyle = "rgba(0, 180, 255, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, globeR * 1.3, globeR * 0.8, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Orbiting nodes
    ctx.fillStyle = "rgba(0, 200, 255, 0.6)";
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 / 6) * i;
      const r = globeR * 1.3;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.6, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sun glow (from logo 3)
    ctx.fillStyle = "rgba(255, 200, 80, 0.3)";
    ctx.shadowColor = "rgba(255, 180, 60, 0.8)";
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 60, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 220, 100, 0.7)";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 60, 8, 0, Math.PI * 2);
    ctx.fill();

    // White text "Z" at bottom for branding
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("⚛", cx, size - 4);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        borderRadius: "8px",
        filter: "drop-shadow(0 0 12px rgba(0,220,255,0.6))"
      }}
    />
  );
}