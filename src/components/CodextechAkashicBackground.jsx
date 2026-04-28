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
    const icons = ["⚡", "🛰️", "🚀", "💡", "💡", "💡", "💡", "🔬", "⚙️", "🧬", "📡", "🔭", "⛓️", "🌟", "⚗️", "🔋", "💎", "🧲", "📊", "🔮"];
    
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

      drawIcon() {
        ctx.save();
        ctx.translate(0, 0);
        
        const iconType = this.icon;
        const r = this.radius * 0.6;

        if (iconType === "⚡") {
          // Lightning bolt - yellow/orange
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(-r * 0.4, -r * 0.3);
          ctx.lineTo(-r * 0.2, r * 0.2);
          ctx.lineTo(r * 0.4, r * 0.1);
          ctx.lineTo(0, r * 0.8);
          ctx.lineTo(-r * 0.3, r * 0.2);
          ctx.lineTo(-r * 0.1, -r * 0.4);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#FFA500";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (iconType === "🛰️") {
          // Satellite - cyan/blue
          ctx.fillStyle = "#00D9FF";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#0099FF";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Panels
          ctx.fillStyle = "#1E90FF";
          ctx.fillRect(-r * 0.8, -r * 0.2, r * 0.3, r * 0.4);
          ctx.fillRect(r * 0.5, -r * 0.2, r * 0.3, r * 0.4);
        } else if (iconType === "🚀") {
          // Rocket - red/orange
          ctx.fillStyle = "#FF4444";
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.8);
          ctx.lineTo(-r * 0.3, r * 0.6);
          ctx.lineTo(0, r * 0.4);
          ctx.lineTo(r * 0.3, r * 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#FF6666";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Window
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(0, -r * 0.3, r * 0.15, 0, Math.PI * 2);
          ctx.fill();
        } else if (iconType === "💡") {
          // Lightbulb - animated glowing with color shift
          const lightGlow = Math.sin(this.pulsePhase * 2) * 0.5 + 0.5;
          const glowColors = ["#FFFF00", "#FF6B6B", "#4ECDC4", "#FFD93D"];
          const glowColor = glowColors[Math.floor((this.pulsePhase / Math.PI) % glowColors.length)];
          
          // Glow halo
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = lightGlow * 0.3;
          ctx.beginPath();
          ctx.arc(0, -r * 0.2, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.globalAlpha = 1;
          ctx.fillStyle = glowColor;
          ctx.beginPath();
          ctx.arc(0, -r * 0.2, r * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#FFD700";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Base
          ctx.fillStyle = "#FF8C00";
          ctx.fillRect(-r * 0.2, r * 0.2, r * 0.4, r * 0.3);
          ctx.strokeStyle = "#FF6600";
          ctx.stroke();
        } else if (iconType === "🔬") {
          // Microscope - purple
          ctx.fillStyle = "#9D4EDD";
          ctx.beginPath();
          ctx.moveTo(-r * 0.3, -r * 0.6);
          ctx.lineTo(-r * 0.3, r * 0.6);
          ctx.lineTo(r * 0.3, r * 0.6);
          ctx.lineTo(r * 0.3, -r * 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.beginPath();
          ctx.arc(0, -r * 0.4, r * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = "#3A86FF";
          ctx.fill();
        } else if (iconType === "⚙️") {
          // Gear - metallic gray
          ctx.fillStyle = "#C0C0C0";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#808080";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
          ctx.fill();
          // Teeth
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            ctx.fillStyle = "#A9A9A9";
            ctx.beginPath();
            ctx.arc(Math.cos(angle) * r * 0.65, Math.sin(angle) * r * 0.65, r * 0.15, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (iconType === "🧬") {
          // DNA Helix - bright green
          ctx.strokeStyle = "#00FF41";
          ctx.lineWidth = 2;
          for (let i = 0; i < 2; i++) {
            ctx.beginPath();
            for (let t = 0; t <= Math.PI * 2; t += 0.2) {
              const x = Math.cos(t) * r * 0.4;
              const y = (t / (Math.PI * 2) - 0.5) * r * 1.2;
              const offset = i === 0 ? 0 : Math.PI;
              if (t === 0) ctx.moveTo(x + Math.cos(offset) * r * 0.2, y);
              else ctx.lineTo(x + Math.cos(offset) * r * 0.2, y);
            }
            ctx.stroke();
          }
        } else if (iconType === "📡") {
          // Antenna - cyan
          ctx.strokeStyle = "#00D9FF";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, r * 0.5);
          ctx.lineTo(0, -r * 0.7);
          ctx.stroke();
          // Waves
          for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(0, -r * 0.3, r * 0.3 * i, 0, Math.PI);
            ctx.stroke();
          }
        } else if (iconType === "🔭") {
          // Telescope - blue
          ctx.fillStyle = "#4169E1";
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 0.5, r * 0.2, Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(-r * 0.4, -r * 0.3, r * 0.2, 0, Math.PI * 2);
          ctx.fill();
        } else if (iconType === "⛓️") {
          // Chain - metallic
          ctx.strokeStyle = "#B8B8B8";
          ctx.lineWidth = 2.5;
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(0, -r * 0.3 + i * r * 0.4, r * 0.25, r * 0.15, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else if (iconType === "🌟") {
          // Star - gold
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = Math.cos(angle) * r * 0.7;
            const y = Math.sin(angle) * r * 0.7;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#FFA500";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (iconType === "⚗️") {
          // Flask - purple/red
          ctx.fillStyle = "#FF6B6B";
          ctx.beginPath();
          ctx.moveTo(-r * 0.3, -r * 0.5);
          ctx.lineTo(-r * 0.3, r * 0.2);
          ctx.bezierCurveTo(-r * 0.3, r * 0.5, r * 0.3, r * 0.5, r * 0.3, r * 0.2);
          ctx.lineTo(r * 0.3, -r * 0.5);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#FF4444";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Liquid inside
          ctx.fillStyle = "#FF88AA";
          ctx.beginPath();
          ctx.moveTo(-r * 0.25, r * 0.05);
          ctx.bezierCurveTo(-r * 0.25, r * 0.4, r * 0.25, r * 0.4, r * 0.25, r * 0.05);
          ctx.lineTo(-r * 0.25, r * 0.05);
          ctx.fill();
        } else if (iconType === "🔋") {
          // Battery - lime green
          ctx.fillStyle = "#7FFF00";
          ctx.fillRect(-r * 0.25, -r * 0.5, r * 0.5, r * 0.8);
          ctx.fillStyle = "#32CD32";
          ctx.fillRect(-r * 0.15, r * 0.35, r * 0.3, r * 0.2);
          ctx.strokeStyle = "#00AA00";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-r * 0.25, -r * 0.5, r * 0.5, r * 0.8);
        } else if (iconType === "💎") {
          // Crystal/Diamond - cyan
          ctx.fillStyle = "#00D9FF";
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.7);
          ctx.lineTo(r * 0.4, -r * 0.2);
          ctx.lineTo(r * 0.4, r * 0.4);
          ctx.lineTo(0, r * 0.7);
          ctx.lineTo(-r * 0.4, r * 0.4);
          ctx.lineTo(-r * 0.4, -r * 0.2);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#0099FF";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (iconType === "🧲") {
          // Magnet - red/blue split
          ctx.fillStyle = "#FF4444";
          ctx.fillRect(-r * 0.4, -r * 0.5, r * 0.35, r);
          ctx.fillStyle = "#4444FF";
          ctx.fillRect(r * 0.05, -r * 0.5, r * 0.35, r);
          ctx.strokeStyle = "#222";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-r * 0.4, -r * 0.5, r * 0.75, r);
        } else if (iconType === "📊") {
          // Chart - multicolor bars
          ctx.fillStyle = "#FF6B6B";
          ctx.fillRect(-r * 0.35, -r * 0.2, r * 0.2, r * 0.5);
          ctx.fillStyle = "#4ECDC4";
          ctx.fillRect(-r * 0.1, -r * 0.4, r * 0.2, r * 0.7);
          ctx.fillStyle = "#FFD93D";
          ctx.fillRect(r * 0.15, -r * 0.3, r * 0.2, r * 0.6);
          ctx.strokeStyle = "#333";
          ctx.lineWidth = 1;
          ctx.strokeRect(-r * 0.4, -r * 0.5, r * 0.8, r);
        } else if (iconType === "🔮") {
          // Crystal Ball - purple glow
          ctx.fillStyle = "#9D4EDD";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#C77DFF";
          ctx.lineWidth = 2;
          ctx.stroke();
          // Inner glow
          ctx.fillStyle = "#E0AAFF";
          ctx.globalAlpha = 0.5;
          ctx.beginPath();
          ctx.arc(0, -r * 0.1, r * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        ctx.restore();
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

        // Draw icon with rotation
        ctx.globalAlpha = 1;
        ctx.rotate(this.rotation);
        this.drawIcon();

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