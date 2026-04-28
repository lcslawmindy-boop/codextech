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

    // Floating elements
    const elements = [];
    const elementCount = 40;

    class FloatingElement {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.type = ["equation", "paper", "circuit", "device"][Math.floor(Math.random() * 4)];
        this.opacity = Math.random() * 0.3 + 0.1;
        this.size = Math.random() * 40 + 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const color = "#0F172A";

        if (this.type === "equation") {
          ctx.font = "14px monospace";
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.fillText("∫ ∇·E = ρ/ε₀", 0, 0);
        } else if (this.type === "paper") {
          ctx.fillStyle = color;
          ctx.fillRect(-this.size / 2, -this.size / 1.4, this.size, this.size * 1.4);
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.strokeRect(-this.size / 2, -this.size / 1.4, this.size, this.size * 1.4);
          // Paper lines
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-this.size / 2 + 4, -this.size / 1.4 + 8 + i * 8);
            ctx.lineTo(this.size / 2 - 4, -this.size / 1.4 + 8 + i * 8);
            ctx.stroke();
          }
        } else if (this.type === "circuit") {
          // Circuit board pattern
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const offset = 12;
              ctx.beginPath();
              ctx.arc(-this.size / 2 + offset + i * offset, -this.size / 2 + offset + j * offset, 2, 0, Math.PI * 2);
              ctx.stroke();
              if (i < 2) {
                ctx.beginPath();
                ctx.moveTo(-this.size / 2 + offset + i * offset, -this.size / 2 + offset + j * offset);
                ctx.lineTo(-this.size / 2 + offset + (i + 1) * offset, -this.size / 2 + offset + j * offset);
                ctx.stroke();
              }
            }
          }
        } else if (this.type === "device") {
          // Waveform device
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-this.size / 2, 0);
          for (let i = 0; i <= 10; i++) {
            const x = -this.size / 2 + (i / 10) * this.size;
            const y = Math.sin((i / 10) * Math.PI * 4) * (this.size / 4);
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

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
      ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
      ctx.lineWidth = 1;

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
      ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
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