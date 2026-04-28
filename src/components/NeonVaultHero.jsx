import { useEffect, useRef } from "react";
import { Zap, Radio, Hexagon } from "lucide-react";

export default function NeonVaultHero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId;
    let time = 0;

    // Neon colors
    const colors = {
      cyan: "#00D9FF",
      purple: "#B91EFF",
      magenta: "#FF006E",
      pink: "#FFB703",
      green: "#00FF88"
    };

    // Draw sacred geometry
    const drawFlowerOfLife = (x, y, radius, opacity, rotation = 0) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.3;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.strokeStyle = colors.cyan;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const cx = Math.cos(angle) * radius;
        const cy = Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    };

    // Draw toroidal coil
    const drawToroid = (x, y, radius, opacity, rotation) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.4;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Main toroid outline
      ctx.strokeStyle = colors.purple;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.5, radius * 0.6, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner rings
      ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) {
        const offset = (i - 1.5) * (radius * 0.3);
        ctx.strokeStyle = colors.magenta;
        ctx.globalAlpha = opacity * 0.3;
        ctx.beginPath();
        ctx.arc(offset, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    // Draw copper spiral coil
    const drawSpiralCoil = (x, y, radius, opacity, rotation) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.5;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.strokeStyle = colors.pink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      for (let i = 0; i < Math.PI * 6; i += 0.05) {
        const vx = Math.cos(i) * (radius * 0.5 * (i / (Math.PI * 6)));
        const vy = Math.sin(i) * (radius * 0.5 * (i / (Math.PI * 6)));
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      
      ctx.stroke();
      ctx.restore();
    };

    // Draw mathematical equations
    const drawEquation = (x, y, text, opacity, color) => {
      ctx.save();
      ctx.globalAlpha = opacity * 0.6;
      ctx.fillStyle = color;
      ctx.font = "12px monospace";
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    // Draw particles/bubbles
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: [colors.cyan, colors.purple, colors.magenta, colors.pink, colors.green][
          Math.floor(Math.random() * 5)
        ]
      });
    }

    const drawParticles = () => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.globalAlpha = 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
        gradient.addColorStop(0, p.color + "40");
        gradient.addColorStop(1, p.color + "00");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Draw grid background
    const drawGrid = () => {
      ctx.strokeStyle = colors.cyan;
      ctx.globalAlpha = 0.05;
      ctx.lineWidth = 1;

      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(10, 15, 35, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      // Background elements
      drawGrid();
      
      // Floating devices
      drawFlowerOfLife(
        canvas.width * 0.2,
        canvas.height * 0.3,
        100,
        Math.sin(time) * 0.5 + 0.5,
        time
      );
      
      drawToroid(
        canvas.width * 0.8,
        canvas.height * 0.25,
        60,
        Math.cos(time * 0.7) * 0.5 + 0.5,
        time * 0.5
      );
      
      drawSpiralCoil(
        canvas.width * 0.15,
        canvas.height * 0.75,
        80,
        Math.sin(time * 1.2) * 0.5 + 0.5,
        time * 0.8
      );

      drawFlowerOfLife(
        canvas.width * 0.75,
        canvas.height * 0.7,
        120,
        Math.sin(time * 0.6) * 0.5 + 0.5,
        time * 1.5
      );

      // Equations
      drawEquation(canvas.width * 0.1, canvas.height * 0.15, "∇φ = ∂E/∂t", Math.sin(time) * 0.5 + 0.5, colors.cyan);
      drawEquation(canvas.width * 0.85, canvas.height * 0.5, "π ≈ 3.14159...", Math.cos(time * 1.3) * 0.5 + 0.5, colors.magenta);
      drawEquation(canvas.width * 0.5, canvas.height * 0.9, "E = mc²", Math.sin(time * 0.8) * 0.5 + 0.5, colors.green);
      drawEquation(canvas.width * 0.2, canvas.height * 0.5, "Φ = ∮ A·dl", Math.cos(time * 1.1) * 0.5 + 0.5, colors.pink);

      // Particles
      drawParticles();

      // Large background patterns
      ctx.globalAlpha = 0.15;
      drawToroid(canvas.width * 0.5, canvas.height * 0.5, 200, 0.3, time * 0.3);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-950">
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Vault in foreground */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Outer vault structure */}
          <div className="relative w-80 h-80">
            {/* Metallic vault door */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-600 to-gray-800 rounded-3xl shadow-2xl"
              style={{
                boxShadow: "0 0 60px rgba(0, 217, 255, 0.3), inset 0 0 40px rgba(0, 0, 0, 0.8)"
              }}>
              
              {/* Vault door rim */}
              <div className="absolute inset-2 border-8 border-gray-700 rounded-3xl"
                style={{
                  boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.6)"
                }}
              />

              {/* Central lock mechanism */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {/* Outer lock ring */}
                  <div className="absolute inset-0 border-6 border-gray-700 rounded-full"
                    style={{
                      boxShadow: "0 0 30px rgba(185, 30, 255, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.7)"
                    }}
                  />

                  {/* Middle ring */}
                  <div className="absolute inset-6 border-4 border-gray-600 rounded-full"
                    style={{
                      boxShadow: "0 0 20px rgba(0, 217, 255, 0.4)"
                    }}
                  />

                  {/* Inner keyhole */}
                  <div className="absolute inset-16 bg-gray-950 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 176, 3, 0.3)"
                    }}>
                    <div className="w-8 h-12 bg-gray-950 rounded-full border-2 border-gray-700" />
                  </div>

                  {/* Decorative bolts */}
                  {[0, 90, 180, 270].map((angle) => (
                    <div
                      key={angle}
                      className="absolute w-4 h-4 bg-gray-600 rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${angle}deg) translateY(-90px) rotate(-${angle}deg)`,
                        boxShadow: "0 0 10px rgba(185, 30, 255, 0.6)"
                      }}
                    />
                  ))}

                  {/* Neon glow animation */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      boxShadow: "0 0 60px rgba(0, 217, 255, 0.8), inset 0 0 40px rgba(185, 30, 255, 0.3)",
                      animation: "pulse 3s ease-in-out infinite"
                    }}
                  />
                </div>
              </div>

              {/* Handle */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-8 h-20 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"
                style={{
                  boxShadow: "0 0 15px rgba(255, 176, 3, 0.5)"
                }}
              />
            </div>

            {/* Neon border */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                boxShadow: "0 0 30px rgba(0, 217, 255, 0.6), 0 0 60px rgba(185, 30, 255, 0.4)",
                animation: "pulse 2s ease-in-out infinite"
              }}
            />
          </div>
        </div>
      </div>

      {/* Floating element indicators */}
      <div className="absolute top-10 right-10 text-cyan-400 text-xs font-mono opacity-50 pointer-events-none">
        <div>⚛ Sacred Geometry</div>
        <div>⟲ Toroidal Fields</div>
        <div>∿ Spiral Resonance</div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}