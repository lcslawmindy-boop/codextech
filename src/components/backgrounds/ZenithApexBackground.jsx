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

      // --- Pulsing scalar waves ---
      const waveCount = 12;
      for (let i = 0; i < waveCount; i++) {
        const phase = (t * 0.35 + i * (1 / waveCount)) % 1;
        const maxR = Math.max(W, H) * 0.95;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.18;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 160, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      for (let i = 0; i < 7; i++) {
        const phase = (t * 0.2 + i * (1 / 7)) % 1;
        const maxR = Math.max(W, H) * 0.75;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.1;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 200, 80, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // --- Globe watermark (large, centered) ---
      const globeR = Math.min(W, H) * 0.52;
      const globeX = cx;
      const globeY = cy + globeR * 1.1;

      ctx.save();
      ctx.globalAlpha = 0.13;

      // Clip to circle so lat lines don't overflow
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.clip();

      // Latitude lines
      const latLines = 9;
      for (let i = 1; i < latLines; i++) {
        const lat = -Math.PI / 2 + (Math.PI / latLines) * i;
        const y = globeY + Math.sin(lat) * globeR;
        const rLat = Math.abs(Math.cos(lat) * globeR);
        ctx.beginPath();
        ctx.ellipse(globeX, y, rLat, rLat * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Longitude lines
      const lonLines = 10;
      for (let i = 0; i < lonLines; i++) {
        const angle = (Math.PI / lonLines) * i;
        ctx.save();
        ctx.translate(globeX, globeY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, globeR * 0.22, globeR, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,1)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // Outer circle (drawn outside clip)
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // --- Realistic spinning sun ---
      const sunAngle = t * 1.2;
      const sunOrbitR = globeR * 0.22;
      const sunX = globeX + Math.sin(sunAngle) * sunOrbitR;
      const sunY = (globeY - globeR) + 12 + Math.cos(sunAngle) * sunOrbitR * 0.35;
      const sunRadius = 18;

      // Outer corona glow (large soft)
      const corona = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 5);
      corona.addColorStop(0, "rgba(255, 220, 80, 0.45)");
      corona.addColorStop(0.3, "rgba(255, 160, 30, 0.20)");
      corona.addColorStop(0.7, "rgba(255, 100, 0, 0.07)");
      corona.addColorStop(1, "rgba(255, 60, 0, 0)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 5, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      // Mid glow
      const midGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.2);
      midGlow.addColorStop(0, "rgba(255, 240, 160, 0.75)");
      midGlow.addColorStop(0.5, "rgba(255, 180, 40, 0.40)");
      midGlow.addColorStop(1, "rgba(255, 120, 0, 0)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = midGlow;
      ctx.fill();

      // Sun core
      const core = ctx.createRadialGradient(sunX - 3, sunY - 3, 1, sunX, sunY, sunRadius);
      core.addColorStop(0, "rgba(255, 255, 220, 1)");
      core.addColorStop(0.3, "rgba(255, 230, 80, 1)");
      core.addColorStop(0.7, "rgba(255, 160, 20, 1)");
      core.addColorStop(1, "rgba(220, 80, 0, 0.9)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      // Sun rays (spinning)
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(t * 1.8);
      const rayCount = 12;
      for (let r = 0; r < rayCount; r++) {
        const rayAngle = (Math.PI * 2 / rayCount) * r;
        const innerR = sunRadius + 4;
        const outerR = sunRadius + 18 + Math.sin(t * 3 + r) * 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rayAngle) * innerR, Math.sin(rayAngle) * innerR);
        ctx.lineTo(Math.cos(rayAngle) * outerR, Math.sin(rayAngle) * outerR);
        ctx.strokeStyle = `rgba(255, 210, 60, ${0.6 - r * 0.01})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.restore();

      t += 0.007;
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