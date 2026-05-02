import { useEffect, useRef } from "react";

export default function ZenithApexBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      // --- Pulsing scalar waves (concentric rings emanating from center) ---
      const waveCount = 10;
      for (let i = 0; i < waveCount; i++) {
        const phase = (t * 0.4 + i * (1 / waveCount)) % 1;
        const maxR = Math.max(W, H) * 0.85;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.12;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 160, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Secondary scalar waves (slightly offset, different color)
      for (let i = 0; i < 6; i++) {
        const phase = (t * 0.25 + i * (1 / 6)) % 1;
        const maxR = Math.max(W, H) * 0.7;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.07;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 200, 80, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- Globe watermark (large, centered, semi-opaque) ---
      const globeR = Math.min(W, H) * 0.35;
      const globeX = cx;
      const globeY = cy + globeR * 0.1;

      ctx.save();
      ctx.globalAlpha = 0.06;

      // Outer circle
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Latitude lines
      const latLines = 7;
      for (let i = 1; i < latLines; i++) {
        const lat = -Math.PI / 2 + (Math.PI / latLines) * i;
        const y = globeY + Math.sin(lat) * globeR;
        const rLat = Math.cos(lat) * globeR;
        ctx.beginPath();
        ctx.ellipse(globeX, y, rLat, rLat * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Longitude lines
      const lonLines = 8;
      for (let i = 0; i < lonLines; i++) {
        const angle = (Math.PI / lonLines) * i;
        ctx.save();
        ctx.translate(globeX, globeY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, globeR * 0.25, globeR, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // --- Spinning sun (golden dot at top of globe, orbiting) ---
      const sunAngle = t * 1.5; // spin speed
      const sunOrbitR = globeR * 0.18;
      const sunX = globeX + Math.sin(sunAngle) * sunOrbitR;
      const sunY = (globeY - globeR) + Math.cos(sunAngle) * sunOrbitR * 0.4;

      // Sun glow
      const grd = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 22);
      grd.addColorStop(0, "rgba(255, 200, 60, 0.55)");
      grd.addColorStop(0.4, "rgba(255, 160, 20, 0.25)");
      grd.addColorStop(1, "rgba(255, 120, 0, 0)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();

      // Sun core
      ctx.beginPath();
      ctx.arc(sunX, sunY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 210, 80, 0.85)";
      ctx.fill();

      // Sun rays
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(t * 2);
      for (let r = 0; r < 8; r++) {
        ctx.rotate(Math.PI / 4);
        ctx.beginPath();
        ctx.moveTo(0, 7);
        ctx.lineTo(0, 14);
        ctx.strokeStyle = "rgba(255, 200, 60, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      t += 0.008;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}