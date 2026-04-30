import { useEffect, useRef } from "react";

const FORMULAS = [
  "E=mc²",
  "∇²Φ = 0",
  "∂ψ/∂t = -iĤψ",
  "F = ma",
  "∮ E·dl = 0",
  "∇·E = ρ/ε₀",
  "λ = h/p",
  "ℏω = ΔE",
  "ψ(r,t) = Ae^i(k·r-ωt)",
  "σ = E/ρ",
  "∇×B = μ₀J",
  "c = 1/√(μ₀ε₀)",
];

const DEVICES = [
  "⚡MEG",
  "📡Scalar",
  "🌌Zero-Point",
  "💫Anenergy",
  "🔬Prioré",
  "🌀Torsion",
  "📿Resonance",
  "🧬BioEM",
];

const SYMBOLS = ["$", "¢", "€", "£", "₹"];

export default function CosmicResearchBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId;
    let time = 0;

    // Particle system
    const particles = [];
    const stars = [];
    const shootingStars = [];
    const floatingTexts = [];
    const gridParticles = [];

    // Initialize stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Initialize shooting stars
    for (let i = 0; i < 5; i++) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: Math.random() * 3 + 2,
        vy: Math.random() * 2 - 1,
        life: 0,
        maxLife: Math.random() * 40 + 20,
      });
    }

    // Initialize floating formulas
    for (let i = 0; i < 15; i++) {
      floatingTexts.push({
        text: FORMULAS[Math.floor(Math.random() * FORMULAS.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.3 - 0.1,
        opacity: Math.random() * 0.4 + 0.2,
        size: Math.random() * 12 + 10,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    // Initialize floating devices/symbols
    for (let i = 0; i < 20; i++) {
      const isDevice = Math.random() > 0.5;
      floatingTexts.push({
        text: isDevice ? DEVICES[Math.floor(Math.random() * DEVICES.length)] : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 0.4 - 0.1,
        opacity: Math.random() * 0.3 + 0.15,
        size: isDevice ? Math.random() * 16 + 12 : Math.random() * 20 + 16,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
        isGolden: !isDevice && Math.random() > 0.7,
      });
    }

    // Initialize grid particles
    const gridSize = 80;
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        gridParticles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          wave: Math.random() * Math.PI * 2,
          waveSpeed: Math.random() * 0.02 + 0.005,
          pulse: 0,
        });
      }
    }

    const animate = () => {
      time += 1;

      // Clear with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#0a0e27");
      gradient.addColorStop(0.5, "#1a1a3e");
      gradient.addColorStop(1, "#0f0f2e");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid circuit pattern with pulsing waves
      ctx.strokeStyle = "rgba(0, 200, 255, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < gridParticles.length; i++) {
        const gp = gridParticles[i];
        gp.wave = (gp.wave + gp.waveSpeed) % (Math.PI * 2);
        gp.pulse = Math.sin(time * 0.02 + i * 0.1) * 3;

        const offsetY = Math.sin(gp.wave) * 5 + gp.pulse;
        const offsetX = Math.cos(gp.wave) * 5;

        gp.x = gp.baseX + offsetX;
        gp.y = gp.baseY + offsetY;
      }

      // Draw grid lines
      for (let i = 0; i < gridParticles.length; i++) {
        const gp = gridParticles[i];
        if (i % (canvas.width / 80 + 1) === 0 && i > 0) {
          const prevGp = gridParticles[i - 1];
          ctx.beginPath();
          ctx.moveTo(prevGp.x, prevGp.y);
          ctx.lineTo(gp.x, gp.y);
          ctx.stroke();
        }
      }

      // Draw scalar wave pulses
      for (let i = 0; i < 3; i++) {
        const waveTime = (time * 0.02 + i * 1.5) % (Math.PI * 2);
        const waveRadius = (Math.sin(waveTime) * 0.5 + 0.5) * 400;
        const waveOpacity = Math.abs(Math.sin(waveTime)) * 0.3;

        ctx.strokeStyle = `rgba(100, 200, 255, ${waveOpacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw twinkling stars
      for (let star of stars) {
        star.twinklePhase += star.twinkleSpeed;
        const brightness = Math.abs(Math.sin(star.twinklePhase)) * star.opacity + 0.1;

        // Diamond sparkle effect
        ctx.fillStyle = `rgba(200, 220, 255, ${brightness})`;
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate((time * 0.01) % (Math.PI * 2));

        // Diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -star.size);
        ctx.lineTo(star.size, 0);
        ctx.lineTo(0, star.size);
        ctx.lineTo(-star.size, 0);
        ctx.closePath();
        ctx.fill();

        // Glow
        ctx.strokeStyle = `rgba(150, 200, 255, ${brightness * 0.6})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      }

      // Draw shooting stars
      for (let i = 0; i < shootingStars.length; i++) {
        const ss = shootingStars[i];
        ss.life += 1;

        if (ss.life > ss.maxLife) {
          shootingStars[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.5,
            vx: Math.random() * 3 + 2,
            vy: Math.random() * 2 - 1,
            life: 0,
            maxLife: Math.random() * 40 + 20,
          };
          continue;
        }

        ss.x += ss.vx;
        ss.y += ss.vy;

        const progress = ss.life / ss.maxLife;
        const opacity = Math.sin(progress * Math.PI) * 0.8;

        ctx.strokeStyle = `rgba(255, 200, 100, ${opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 15, ss.y - ss.vy * 15);
        ctx.stroke();

        // Glow
        ctx.fillStyle = `rgba(255, 200, 100, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw floating texts (formulas, devices, symbols)
      for (let text of floatingTexts) {
        text.x += text.vx;
        text.y += text.vy;
        text.rotation += text.rotationSpeed;
        text.vy -= 0.01; // Slight upward drift

        // Wrap around screen
        if (text.x > canvas.width) text.x = -50;
        if (text.y < -50) text.y = canvas.height;

        ctx.save();
        ctx.translate(text.x, text.y);
        ctx.rotate(text.rotation);

        if (text.isGolden) {
          ctx.fillStyle = `rgba(255, 215, 0, ${text.opacity})`;
          ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
          ctx.shadowBlur = 15;
        } else {
          ctx.fillStyle = `rgba(100, 200, 255, ${text.opacity})`;
          ctx.shadowColor = "rgba(100, 200, 255, 0.6)";
          ctx.shadowBlur = 10;
        }

        ctx.font = `${text.size}px 'Courier New', monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text.text, 0, 0);

        ctx.restore();
      }

      // Fluid ocean-like effect at bottom
      const oceanWaveHeight = 60;
      ctx.fillStyle = "rgba(0, 150, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - oceanWaveHeight);

      for (let x = 0; x < canvas.width; x += 20) {
        const waveY =
          Math.sin((x * 0.01 + time * 0.02) * Math.PI) * 15 +
          Math.sin((x * 0.005 + time * 0.015) * Math.PI) * 10;
        ctx.lineTo(x, canvas.height - oceanWaveHeight + waveY);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Wave lines
      ctx.strokeStyle = "rgba(0, 200, 255, 0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const offsetTime = time * 0.025 + i * 100;
        ctx.moveTo(0, canvas.height - oceanWaveHeight + i * 15);

        for (let x = 0; x < canvas.width; x += 30) {
          const waveY = Math.sin((x * 0.008 + offsetTime) * Math.PI) * 8;
          ctx.lineTo(x, canvas.height - oceanWaveHeight + i * 15 + waveY);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ background: "#0a0e27" }}
    />
  );
}