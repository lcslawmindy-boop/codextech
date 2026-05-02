import { useEffect, useRef } from 'react';

export default function SolidLogoBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Solid dark background
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, W, H);

      // Large centered logo (faint)
      const logoSize = Math.min(W, H) * 0.4;
      const cx = W / 2;
      const cy = H / 2;

      // Draw grid globe (faint)
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = 'rgba(0,220,255,1)';
      ctx.lineWidth = 2;

      // Outer circle
      ctx.beginPath();
      ctx.arc(cx, cy, logoSize, 0, Math.PI * 2);
      ctx.stroke();

      // Latitude lines
      for (let i = 1; i < 5; i++) {
        const y = cy - logoSize + (logoSize * 2 / 5) * i;
        ctx.beginPath();
        ctx.ellipse(cx, y, logoSize, logoSize * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i;
        ctx.beginPath();
        for (let step = 0; step <= 100; step++) {
          const lat = (step / 100 - 0.5) * Math.PI;
          const x = cx + Math.cos(lat) * Math.cos(angle) * logoSize;
          const y = cy + Math.sin(lat) * logoSize * 0.5;
          step === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    draw();
    window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}