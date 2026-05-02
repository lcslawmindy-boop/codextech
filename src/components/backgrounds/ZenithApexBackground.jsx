import { useEffect, useRef } from "react";

const EQUATIONS = [
  "∇²Φ = 0",
  "E = -∇Φ - ∂A/∂t",
  "∇·B = 0",
  "∇×E = -∂B/∂t",
  "Ψ = Ae^(iωt)",
  "F = q(E + v×B)",
  "ρ(x,t) = A·sin(kx - ωt)",
  "∮E·dA = Q/ε₀",
  "P = ε₀c(E×B)",
  "λ = h/mv",
  "∇²A - μ₀ε₀∂²A/∂t² = 0",
  "Φ = ∫B·dA",
  "ω = 2πf",
  "k = ω/c",
  "S = (1/μ₀)(E×B)",
  "∂²Φ/∂t² = c²∇²Φ",
  "U = ½ε₀E²",
  "H = B/μ₀ - M",
  "J = σE",
  "∇×H = J + ∂D/∂t",
];

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

    // --- Stars ---
    const STAR_COUNT = 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.1,
    }));

    // --- Floating equations ---
    const EQ_COUNT = 18;
    const equations = Array.from({ length: EQ_COUNT }, (_, i) => ({
      text: EQUATIONS[i % EQUATIONS.length],
      x: Math.random(),
      y: Math.random(),          // 0..1 normalized
      speed: 0.00012 + Math.random() * 0.00018,
      alpha: 0.08 + Math.random() * 0.18,
      size: 10 + Math.floor(Math.random() * 8),
      drift: (Math.random() - 0.5) * 0.0002,  // horizontal drift
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      // ── Stars ──────────────────────────────────────────────────────
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.speed * 6 + s.twinkle);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r * tw, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${0.3 + tw * 0.55})`;
        ctx.fill();
      }

      // ── Grid ──────────────────────────────────────────────────────
      const gridAlpha = 0.07;
      const gridSpacing = 60;
      ctx.save();
      ctx.strokeStyle = `rgba(100, 160, 255, ${gridAlpha})`;
      ctx.lineWidth = 0.6;
      for (let x = 0; x < W; x += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSpacing) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.restore();

      // ── Bold pulsing scalar waves ──────────────────────────────────
      const waveCount = 14;
      for (let i = 0; i < waveCount; i++) {
        const phase = (t * 0.38 + i * (1 / waveCount)) % 1;
        const maxR = Math.max(W, H) * 0.98;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.45;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80, 160, 255, ${alpha})`;
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }
      // Secondary warm scalar ring
      for (let i = 0; i < 8; i++) {
        const phase = (t * 0.22 + i * (1 / 8)) % 1;
        const maxR = Math.max(W, H) * 0.78;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.28;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 200, 80, ${alpha})`;
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }
      // Bright inner close rings for extra pop
      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.5 + i * (1 / 5)) % 1;
        const maxR = Math.max(W, H) * 0.45;
        const r = phase * maxR;
        const alpha = (1 - phase) * 0.55;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120, 210, 255, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // ── Floating equations ─────────────────────────────────────────
      for (const eq of equations) {
        eq.y -= eq.speed;
        eq.x += eq.drift;
        if (eq.y < -0.05) { eq.y = 1.05; eq.x = Math.random(); }
        if (eq.x < -0.1) eq.x = 1.1;
        if (eq.x > 1.1) eq.x = -0.1;

        const px = eq.x * W;
        const py = eq.y * H;

        ctx.save();
        ctx.globalAlpha = eq.alpha * (0.7 + 0.3 * Math.sin(t * 1.2 + eq.y * 10));
        ctx.font = `${eq.size}px monospace`;
        ctx.fillStyle = "rgba(120, 200, 255, 1)";
        ctx.fillText(eq.text, px, py);
        ctx.restore();
      }

      // ── Globe watermark ────────────────────────────────────────────
      const globeR = Math.min(W, H) * 0.52;
      const globeX = cx;
      const globeY = cy + globeR * 1.1;

      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.clip();

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

      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,1)";
      ctx.lineWidth = 3.5;
      ctx.stroke();
      ctx.restore();

      // ── Realistic spinning sun ─────────────────────────────────────
      const sunAngle = t * 1.2;
      const sunOrbitR = globeR * 0.22;
      const sunX = globeX + Math.sin(sunAngle) * sunOrbitR;
      const sunY = (globeY - globeR) + 12 + Math.cos(sunAngle) * sunOrbitR * 0.35;
      const sunRadius = 18;

      const corona = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 5);
      corona.addColorStop(0, "rgba(255, 220, 80, 0.45)");
      corona.addColorStop(0.3, "rgba(255, 160, 30, 0.20)");
      corona.addColorStop(0.7, "rgba(255, 100, 0, 0.07)");
      corona.addColorStop(1, "rgba(255, 60, 0, 0)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 5, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      const midGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.2);
      midGlow.addColorStop(0, "rgba(255, 240, 160, 0.75)");
      midGlow.addColorStop(0.5, "rgba(255, 180, 40, 0.40)");
      midGlow.addColorStop(1, "rgba(255, 120, 0, 0)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = midGlow;
      ctx.fill();

      const core = ctx.createRadialGradient(sunX - 3, sunY - 3, 1, sunX, sunY, sunRadius);
      core.addColorStop(0, "rgba(255, 255, 220, 1)");
      core.addColorStop(0.3, "rgba(255, 230, 80, 1)");
      core.addColorStop(0.7, "rgba(255, 160, 20, 1)");
      core.addColorStop(1, "rgba(220, 80, 0, 0.9)");
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

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