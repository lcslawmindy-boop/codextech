import { useEffect, useRef } from "react";

export default function EarthGridBackground() {
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

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;

      // ── Earth sphere ──
      const earthRadius = Math.min(W, H) * 0.3;
      const earthGrad = ctx.createRadialGradient(cx - 30, cy - 30, 0, cx, cy, earthRadius);
      earthGrad.addColorStop(0, "rgba(100, 180, 255, 0.9)");
      earthGrad.addColorStop(0.4, "rgba(40, 120, 200, 0.85)");
      earthGrad.addColorStop(0.7, "rgba(20, 80, 150, 0.8)");
      earthGrad.addColorStop(1, "rgba(10, 40, 100, 0.75)");
      ctx.beginPath();
      ctx.arc(cx, cy, earthRadius, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Earth rotation
      const rotation = t * 0.05;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // Landmasses (simple continents)
      ctx.fillStyle = "rgba(60, 140, 60, 0.6)";
      ctx.beginPath();
      ctx.arc(-earthRadius * 0.3, -earthRadius * 0.2, earthRadius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(earthRadius * 0.2, earthRadius * 0.3, earthRadius * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(earthRadius * 0.4, -earthRadius * 0.35, earthRadius * 0.18, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ── Grid overlay ──
      ctx.save();
      ctx.strokeStyle = "rgba(0, 200, 150, 0.25)";
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let x = cx - earthRadius; x < cx + earthRadius; x += 20) {
        ctx.beginPath();
        const top = cy - Math.sqrt(earthRadius * earthRadius - (x - cx) * (x - cx));
        const bottom = cy + Math.sqrt(earthRadius * earthRadius - (x - cx) * (x - cx));
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = cy - earthRadius; y < cy + earthRadius; y += 20) {
        ctx.beginPath();
        const left = cx - Math.sqrt(earthRadius * earthRadius - (y - cy) * (y - cy));
        const right = cx + Math.sqrt(earthRadius * earthRadius - (y - cy) * (y - cy));
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      ctx.restore();

      // ── Green 3D scanning laser ──
      const scanAngle = t * 0.8;
      const scanRadius = earthRadius + 40;
      const scanX1 = cx + Math.cos(scanAngle) * scanRadius;
      const scanY1 = cy + Math.sin(scanAngle) * scanRadius;
      const scanX2 = cx + Math.cos(scanAngle + 0.2) * scanRadius;
      const scanY2 = cy + Math.sin(scanAngle + 0.2) * scanRadius;

      // Laser beam to sphere
      ctx.save();
      const grad = ctx.createLinearGradient(scanX1, scanY1, cx, cy);
      grad.addColorStop(0, "rgba(0, 255, 120, 0.8)");
      grad.addColorStop(0.5, "rgba(0, 255, 100, 0.4)");
      grad.addColorStop(1, "rgba(0, 255, 80, 0.1)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(scanX1, scanY1);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Laser point
      ctx.beginPath();
      ctx.arc(scanX1, scanY1, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 150, 1)";
      ctx.shadowColor = "rgba(0, 255, 120, 1)";
      ctx.shadowBlur = 20;
      ctx.fill();

      // Secondary beam
      ctx.strokeStyle = "rgba(0, 200, 255, 0.5)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(scanX2, scanY2);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.restore();

      // ── Circuit board text: "ZENITH APEX TECH" ──
      ctx.save();
      ctx.font = "bold 72px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Text shadow (dark background)
      ctx.fillStyle = "rgba(0, 0, 30, 0.95)";
      ctx.fillText("ZENITH APEX TECH", cx + 1, cy + earthRadius + 90);

      // Main text with glow
      ctx.shadowColor = "rgba(0, 255, 150, 1)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgba(0, 255, 180, 0.95)";
      ctx.fillText("ZENITH APEX TECH", cx, cy + earthRadius + 88);

      // Circuit board effect: hollow letters with connections
      ctx.strokeStyle = "rgba(0, 255, 120, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = "transparent";
      ctx.strokeText("ZENITH APEX TECH", cx, cy + earthRadius + 88);

      ctx.restore();

      // ── Particle effect around text ──
      for (let p = 0; p < 8; p++) {
        const pAngle = (t * 0.5 + (p / 8) * Math.PI * 2) % (Math.PI * 2);
        const pRadius = 120 + Math.sin(t * 1.2 + p) * 20;
        const px = cx + Math.cos(pAngle) * pRadius;
        const py = cy + earthRadius + 88 + Math.sin(pAngle) * pRadius;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 180, 0.7)";
        ctx.shadowColor = "rgba(0, 255, 150, 1)";
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      t += 0.007;
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