import { useEffect, useRef } from "react";

export default function PlasmaFieldBackground() {
  const canvasRef = useRef(null);

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

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      r: Math.random() * 2 + 1,
      life: Math.random(),
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(0, 2, 8, 0.95)";
      ctx.fillRect(0, 0, W, H);

      // Plasma field grid
      ctx.strokeStyle = "rgba(0, 150, 255, 0.08)";
      ctx.lineWidth = 0.5;
      const gridSize = 60;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Plasma waves
      for (let i = 0; i < 12; i++) {
        const phase = (t * 0.4 + i / 12) % 1;
        const r = phase * Math.max(W, H) * 0.7;
        const alpha = (1 - phase) * 0.35;
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 180, 255, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Plasma particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.01;

        if (p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1 || p.life > 1) {
          p.x = Math.random();
          p.y = Math.random();
          p.life = 0;
        }

        const alpha = Math.sin(p.life * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 200, 255, ${alpha})`;
        ctx.shadowColor = "rgba(0, 180, 255, 0.8)";
        ctx.shadowBlur = 12;
        ctx.fill();
      });

      t += 0.01;
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
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