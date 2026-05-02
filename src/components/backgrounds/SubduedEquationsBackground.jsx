import { useEffect, useRef } from 'react';

const EQUATIONS = [
  "∇²Φ = 0", "E = -∇Φ - ∂A/∂t", "∇·B = 0", "∇×E = -∂B/∂t",
  "Ψ = Ae^(iωt)", "F = q(E + v×B)", "ρ = A·sin(kx - ωt)",
];

export default function SubduedEquationsBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const equations = Array.from({ length: 8 }, (_, i) => ({
      text: EQUATIONS[i % EQUATIONS.length],
      x: Math.random(),
      y: Math.random(),
      speed: 0.0001 + Math.random() * 0.00012,
      alpha: 0.05 + Math.random() * 0.08,
      size: 9 + Math.floor(Math.random() * 5),
      drift: (Math.random() - 0.5) * 0.0001,
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, W, H);

      // Faint grid
      ctx.strokeStyle = 'rgba(80,140,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 80) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Floating equations (very dim)
      equations.forEach(eq => {
        eq.y -= eq.speed;
        eq.x += eq.drift;
        if (eq.y < -0.05) {
          eq.y = 1.05;
          eq.x = Math.random();
        }
        if (eq.x < -0.1) eq.x = 1.1;
        if (eq.x > 1.1) eq.x = -0.1;

        const pulse = 0.9 + 0.1 * Math.sin(t * 0.8 + eq.y * 8);
        const alpha = eq.alpha * pulse;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `${eq.size}px monospace`;
        ctx.fillStyle = 'rgba(80,180,255,0.8)';
        ctx.fillText(eq.text, eq.x * W, eq.y * H);
        ctx.restore();
      });

      t += 0.005;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
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