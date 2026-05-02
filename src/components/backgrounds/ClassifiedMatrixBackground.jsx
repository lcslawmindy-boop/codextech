import { useEffect, useRef } from "react";

export default function ClassifiedMatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコサシスセソタチツテト";
    let charIndex = 0;

    const draw = () => {
      // Dark semi-transparent overlay for trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green matrix text
      ctx.fillStyle = "#00ff00";
      ctx.font = "bold 16px 'Courier Prime', monospace";
      ctx.globalAlpha = 0.3;

      const cols = Math.floor(canvas.width / 20);
      const rows = Math.floor(canvas.height / 20);

      for (let i = 0; i < 40; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const char = chars[charIndex % chars.length];
        ctx.fillText(char, x, y);
        charIndex++;
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, background: "linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 100%)" }}
    />
  );
}