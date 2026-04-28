import { useEffect, useRef } from "react";

export default function CodextechAkashicBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Icon symbols for floating spheres
    const icons = ["⚡", "🛰️", "🚀", "💡", "💡", "💡", "🔬", "⚙️", "🧬", "📡", "🔭", "⛓️", "🌟"];
    
    // Floating elements
    const elements = [];
    const elementCount = 30;

    class FloatingElement {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 25 + 20;
        this.color = Math.random() > 0.5 ? "#FF8C00" : "#00FF41"; // Neon orange or neon green
        this.icon = icons[Math.floor(Math.random() * icons.length)];
        this.opacity = Math.random() * 0.25 + 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.03;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulsePhase += 0.02;

        if (this.x < -100) this.x = canvas.width + 100;
        if (this.x > canvas.width + 100) this.x = -100;
        if (this.y < -100) this.y = canvas.height + 100;
        if (this.y > canvas.height + 100) this.y = -100;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);

        // Neon glow effect
        const glowAlpha = (Math.sin(this.pulsePhase) * 0.3 + 0.5) * this.opacity;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20 + Math.sin(this.pulsePhase) * 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw sphere
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Inner glow
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = glowAlpha * 0.6;
        ctx.stroke();

        // Draw icon
        ctx.globalAlpha = 1;
        ctx.font = `${Math.floor(this.radius * 1.2)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0F172A";
        ctx.rotate(this.rotation);
        ctx.fillText(this.icon, 0, 0);

        ctx.restore();
      }
    }

    // Create elements
    for (let i = 0; i < elementCount; i++) {
      elements.push(new FloatingElement());
    }

    // Draw circuit grid background
    const drawGrid = () => {
      const gridSize = 60;
      ctx.strokeStyle = "rgba(15, 23, 42, 0.05)";
      ctx.lineWidth = 0.8;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Grid intersections
      ctx.fillStyle = "rgba(15, 23, 42, 0.08)";
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      elements.forEach((el) => {
        el.update();
        el.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 top-24 z-0 pointer-events-none"
      style={{ background: "white" }}
    />
  );
}