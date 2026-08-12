import { useEffect, useRef } from "react";

// Neon-green "Matrix" rain — falling characters in vertical columns and
// horizontal rows overlaid on the 3D graph. Pure canvas, pointer-events none.
export default function MatrixRainOverlay({ opacity = 0.22 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let cols = [], rows = [];
    const fontSize = 13;
    const chars = "01アカサタナハマヤラワ0123456789ZARP∇ΨΩΦΔ";

    const setup = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      const colCount = Math.floor(w / fontSize);
      const rowCount = Math.floor(h / fontSize);
      cols = Array.from({ length: colCount }, (_, i) => ({
        x: i * fontSize,
        y: Math.random() * h,
        speed: 1.5 + Math.random() * 3,
        len: 6 + Math.floor(Math.random() * 14),
      }));
      rows = Array.from({ length: rowCount }, (_, i) => ({
        y: i * fontSize,
        x: Math.random() * w,
        speed: 1 + Math.random() * 2.5,
        len: 5 + Math.floor(Math.random() * 10),
        dir: Math.random() > 0.5 ? 1 : -1,
      }));
    };
    setup();

    let frame = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame++;
      // fade trail
      ctx.fillStyle = "rgba(2, 6, 23, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      // vertical columns (downward)
      cols.forEach(c => {
        for (let i = 0; i < c.len; i++) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          const yy = c.y - i * fontSize;
          if (yy < 0 || yy > canvas.height) continue;
          const lead = i === 0;
          ctx.fillStyle = lead
            ? `rgba(180, 255, 200, ${opacity * 2.2})`
            : `rgba(57, 255, 20, ${opacity * (1 - i / c.len)})`;
          ctx.fillText(ch, c.x, yy);
        }
        c.y += c.speed;
        if (c.y > canvas.height + c.len * fontSize) {
          c.y = -c.len * fontSize;
          c.speed = 1.5 + Math.random() * 3;
        }
      });

      // horizontal rows (less frequent, every 3 frames for subtlety)
      if (frame % 3 === 0) {
        rows.forEach(r => {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          const xx = r.x;
          if (xx < 0 || xx > canvas.width) return;
          ctx.fillStyle = `rgba(57, 255, 20, ${opacity * 0.7})`;
          ctx.fillText(ch, xx, r.y);
          r.x += r.speed * r.dir;
          if (r.x > canvas.width + 50 || r.x < -50) {
            r.x = r.dir > 0 ? -40 : canvas.width + 40;
            r.y = Math.random() * canvas.height;
          }
        });
      }
    };
    draw();

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[5] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}