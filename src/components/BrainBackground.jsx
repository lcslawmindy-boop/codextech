import { useEffect, useRef } from "react";

// 3D transparent brain photographs + sacred geometry + quantum field layers
// Rendered BEHIND the concept graph to create a living-mind atmosphere.

const BRAIN_FRONT =
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4e16b1c8a_generated_image.png";
const BRAIN_SIDE =
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/09a850da2_generated_image.png";
const BRAIN_TOP =
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b33b5de2f_generated_image.png";

export default function BrainBackground() {
  const canvasRef = useRef(null);

  // Animated sacred-geometry + quantum-field overlay (flower of life, metatron grid, radiating rings)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, t = 0;
    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement);

    const drawFlowerOfLife = (cx, cy, r, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgba(56,189,248,0.5)";
      ctx.lineWidth = 0.6;
      const hex = (a) => {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (i / 6) * Math.PI * 2 + Math.PI / 6;
          const x = cx + Math.cos(ang) * r;
          const y = cy + Math.sin(ang) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      };
      hex();
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        hex(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, r);
      }
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + Math.PI / 6;
        hex(cx + Math.cos(ang) * r * Math.sqrt(3), cy + Math.sin(ang) * r * Math.sqrt(3), r);
      }
      ctx.restore();
    };

    const draw = () => {
      t += 0.006;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Quantum field — slow rotating metatron grid
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(t * 0.04);
      const R = Math.min(W, H) * 0.42;
      for (let i = 0; i < 13; i++) {
        const ang = (i / 13) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * R, Math.sin(ang) * R);
        ctx.strokeStyle = `rgba(168,85,247,${0.05 + 0.04 * Math.sin(t + i)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        ctx.arc(0, 0, (R / 4) * ring, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99,102,241,${0.04 + 0.03 * Math.sin(t + ring)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      ctx.restore();

      // Flower of life — breathing
      const breathe = 1 + Math.sin(t * 0.7) * 0.04;
      drawFlowerOfLife(W * 0.28, H * 0.42, 46 * breathe, 0.10 + 0.05 * Math.sin(t));
      drawFlowerOfLife(W * 0.72, H * 0.6, 38 * breathe, 0.08 + 0.04 * Math.sin(t + 1.5));

      // Radiating quantum ripples from brain centers
      const centers = [
        { x: W * 0.3, y: H * 0.4, color: "56,189,248" },
        { x: W * 0.7, y: H * 0.55, color: "168,85,247" },
        { x: W * 0.5, y: H * 0.7, color: "250,204,21" },
      ];
      centers.forEach((c, ci) => {
        for (let i = 0; i < 4; i++) {
          const phase = (t * 0.5 + ci + i * 0.4) % 1;
          const r = phase * Math.min(W, H) * 0.5;
          ctx.beginPath();
          ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.color},${(1 - phase) * 0.12})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Deep space base */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 55%, #0a0f1e 0%, #050810 55%, #02040a 100%)",
      }} />

      {/* Brain — front, large, left-leaning */}
      <img src={BRAIN_FRONT} alt="" className="absolute select-none"
        style={{
          top: "8%", left: "2%", width: "62%", opacity: 0.40,
          filter: "drop-shadow(0 0 60px rgba(56,189,248,0.35)) hue-rotate(0deg)",
          mixBlendMode: "screen",
          animation: "brainFloat 18s ease-in-out infinite",
        }} />

      {/* Brain — side, right, magenta */}
      <img src={BRAIN_SIDE} alt="" className="absolute select-none"
        style={{
          top: "20%", right: "0%", width: "54%", opacity: 0.34,
          filter: "drop-shadow(0 0 70px rgba(168,85,247,0.4))",
          mixBlendMode: "screen",
          animation: "brainFloat 22s ease-in-out infinite reverse",
        }} />

      {/* Brain — top, golden, center-back */}
      <img src={BRAIN_TOP} alt="" className="absolute select-none"
        style={{
          bottom: "5%", left: "22%", width: "50%", opacity: 0.26,
          filter: "drop-shadow(0 0 80px rgba(250,204,21,0.3))",
          mixBlendMode: "screen",
          animation: "brainFloat 26s ease-in-out infinite",
        }} />

      {/* Sacred geometry + quantum field canvas overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />

      {/* Vignette to keep graph readable */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(2,4,10,0.55) 75%, rgba(2,4,10,0.85) 100%)",
      }} />

      <style>{`
        @keyframes brainFloat {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          33% { transform: translate(12px,-14px) scale(1.03) rotate(1.2deg); }
          66% { transform: translate(-10px,10px) scale(0.98) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}