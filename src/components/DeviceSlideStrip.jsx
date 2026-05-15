import { useEffect, useRef } from "react";

// All invention devices from the build library
const DEVICES = [
  { title: "Anenergy Pump", icon: "🔋", color: "#ef4444", shape: "toroid", tag: "VACUUM ENERGY" },
  { title: "Scalar Bottle Interferometer", icon: "🎯", color: "#06b6d4", shape: "interferometer", tag: "SCALAR EM" },
  { title: "Vacuum Potential Oscillator", icon: "🔧", color: "#a855f7", shape: "oscillator", tag: "RESONANCE" },
  { title: "Biofield Frequency Chamber", icon: "🧪", color: "#22c55e", shape: "chamber", tag: "BIOELECTROMAGNETICS" },
  { title: "Open-System Mag Generator", icon: "⚙️", color: "#f97316", shape: "generator", tag: "FREE ENERGY" },
  { title: "Quantum Potential Detector", icon: "📡", color: "#fbbf24", shape: "antenna", tag: "SENSOR" },
  { title: "EM Trigger Window Device", icon: "💊", color: "#22c55e", shape: "wristband", tag: "BIOELECTROMAGNETICS" },
  { title: "Morphogenetic Field Monitor", icon: "🌿", color: "#10b981", shape: "lattice", tag: "BIOFIELD" },
  { title: "Phase Conjugate Mirror System", icon: "🔭", color: "#3b82f6", shape: "mirror", tag: "SCALAR COMMS" },
  { title: "Priore-Type EM Therapy", icon: "🏥", color: "#ec4899", shape: "coils", tag: "THERAPY DEVICE" },
  { title: "ELF Carrier Lock Detector", icon: "📡", color: "#06b6d4", shape: "sdr", tag: "SIGINT" },
  { title: "Phi-River Gradient Sensor", icon: "🌊", color: "#8b5cf6", shape: "toroid", tag: "MEASUREMENT" },
  { title: "MEG Replication Kit", icon: "🔮", color: "#a855f7", shape: "meg", tag: "COP>1 DEVICE" },
  { title: "Asymmetric Regauging Generator", icon: "⚡", color: "#ef4444", shape: "overunity", tag: "OVERUNITY" },
  { title: "Telomere Regeneration Device", icon: "🧬", color: "#22c55e", shape: "phased_array", tag: "LONGEVITY" },
  { title: "Portable Porthole System", icon: "🏥", color: "#f97316", shape: "blanket", tag: "MCCS DEVICE" },
  { title: "TRZ Cold Fusion Reactor", icon: "⚛️", color: "#06b6d4", shape: "reactor", tag: "NUCLEAR ENERGY" },
  { title: "T-Polarized EM Transducer", icon: "⏱️", color: "#a855f7", shape: "transducer", tag: "TIME DOMAIN" },
  { title: "Psychoenergetics Control System", icon: "🧬", color: "#22c55e", shape: "biophoton", tag: "BIOENERGETICS" },
  { title: "Bedini EM Signal Conditioner", icon: "🎛️", color: "#f97316", shape: "conditioner", tag: "SIGNAL PREP" },
  { title: "Waddington Valley EM Tracer", icon: "🗺️", color: "#10b981", shape: "lattice", tag: "EPIGENETICS" },
  { title: "Cloning Efficiency System", icon: "🧬", color: "#22c55e", shape: "chamber", tag: "BIOTECH" },
  { title: "KRCIC Imprinting Chamber", icon: "🔬", color: "#22c55e", shape: "krcic", tag: "BIOPHOTONICS" },
  { title: "UV Biophoton Spectrometer", icon: "🧬", color: "#06b6d4", shape: "spectrometer", tag: "UV OPTICS" },
  { title: "MorphoYield TRZ Array", icon: "🌾", color: "#22c55e", shape: "field_array", tag: "AGTECH" },
  { title: "Aegis-SV Counterphase Shield", icon: "🛡️", color: "#3b82f6", shape: "shield", tag: "EMF DEFENSE" },
  { title: "Longitudinal Wave Transducer", icon: "🌊", color: "#06b6d4", shape: "lwat", tag: "NDT SENSOR" },
  { title: "Biophoton Coherence Chamber", icon: "🧬", color: "#22c55e", shape: "biophoton", tag: "BIOPHOTONICS" },
  { title: "Asymmetric Flux Gate Gen.", icon: "⚡", color: "#fbbf24", shape: "fluxgate", tag: "AB EFFECT" },
  { title: "Atmospheric EM Harvester", icon: "🌍", color: "#06b6d4", shape: "schumann", tag: "TESLA TECH" },
  { title: "Morphogenetic Synchronizer", icon: "🧠", color: "#22c55e", shape: "helmholtz", tag: "REGENERATIVE" },
  { title: "Atmospheric Scalar AI System", icon: "🛰️", color: "#06b6d4", shape: "satellite", tag: "AI DETECTOR" },
  { title: "Woodpecker Grid Receiver", icon: "📻", color: "#ef4444", shape: "sdr", tag: "SHORTWAVE" },
];

// CSS 3D animated device renderer
function DeviceAnimation({ shape, color, size = 110 }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = size, H = size;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2, cy = H / 2;
    const hex = (h) => {
      const r = parseInt(h.slice(1, 3), 16);
      const g = parseInt(h.slice(3, 5), 16);
      const b = parseInt(h.slice(5, 7), 16);
      return { r, g, b };
    };
    const c = hex(color);
    const glow = `rgba(${c.r},${c.g},${c.b},`;

    const draw = () => {
      tRef.current += 0.025;
      const t = tRef.current;
      ctx.clearRect(0, 0, W, H);

      // Background glow
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx);
      bg.addColorStop(0, `rgba(${c.r},${c.g},${c.b},0.12)`);
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      switch (shape) {
        case "toroid": {
          // Spinning toroid ring
          const R = 30, r = 11;
          for (let a = 0; a < Math.PI * 2; a += 0.12) {
            const cosA = Math.cos(a + t), sinA = Math.sin(a + t);
            const x = cx + R * cosA;
            const y = cy + R * sinA * 0.4;
            const rr = r + 3 * Math.sin(a * 3 + t * 2);
            const alpha = 0.5 + 0.5 * Math.sin(a + t);
            ctx.beginPath();
            ctx.arc(x, y, rr, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 0.7})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // Center field pulse
          ctx.beginPath();
          ctx.arc(cx, cy, 8 + 3 * Math.sin(t * 3), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.fill();
          break;
        }

        case "interferometer": {
          // Two transmitters creating interference pattern
          const tx1 = cx - 28, tx2 = cx + 28;
          for (let i = 1; i <= 5; i++) {
            const radius = i * 10 + 4 * Math.sin(t * 2 + i);
            [[tx1, cy], [tx2, cy]].forEach(([ox, oy]) => {
              ctx.beginPath();
              ctx.arc(ox, oy, radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.6 - i * 0.08})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            });
          }
          // Interference zone center
          ctx.beginPath();
          ctx.arc(cx, cy, 10 + 5 * Math.abs(Math.sin(t * 3)), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.fill();
          // Transmitter boxes
          [[tx1, cy], [tx2, cy]].forEach(([ox, oy]) => {
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
            ctx.fillRect(ox - 7, oy - 7, 14, 14);
          });
          break;
        }

        case "oscillator": {
          // LC circuit with oscillating field
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 2;
          // Inductor coil
          for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(cx - 18 + i * 8, cy - 10, 5, Math.PI, 0);
            ctx.stroke();
          }
          // Capacitor
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.fillRect(cx + 22, cy - 15, 3, 12);
          ctx.fillRect(cx + 27, cy - 15, 3, 12);
          // Oscillating field lines
          for (let i = 0; i < 4; i++) {
            const yOff = -8 + i * 5;
            const amp = 8 * Math.sin(t * 2 + i);
            ctx.beginPath();
            ctx.moveTo(cx - 15, cy + yOff);
            ctx.bezierCurveTo(cx, cy + yOff + amp, cx, cy + yOff - amp, cx + 20, cy + yOff);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.7 - i * 0.1})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          break;
        }

        case "chamber": {
          // Dual chamber with UV path
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.lineWidth = 1.5;
          // Chamber A
          ctx.strokeRect(cx - 38, cy - 18, 22, 36);
          // Chamber B
          ctx.strokeRect(cx + 16, cy - 18, 22, 36);
          // UV photon beam
          for (let i = 0; i < 6; i++) {
            const progress = ((t * 1.5 + i * 0.2) % 1);
            const bx = (cx - 16) + progress * 32;
            const by = cy + Math.sin(i) * 6;
            ctx.beginPath();
            ctx.arc(bx, by, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.9 - progress * 0.5})`;
            ctx.fill();
          }
          // Cell samples
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(cx - 27, cy - 8 + i * 10, 3 + Math.sin(t + i) * 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
            ctx.fill();
          }
          break;
        }

        case "generator": {
          // Rotating magnetic generator
          const rot = t;
          // Stator
          ctx.beginPath();
          ctx.arc(cx, cy, 32, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.4)`;
          ctx.lineWidth = 6;
          ctx.stroke();
          // Rotor poles (4)
          for (let p = 0; p < 4; p++) {
            const angle = rot + (p * Math.PI) / 2;
            const px = cx + 18 * Math.cos(angle);
            const py = cy + 18 * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(px, py, 6, 0, Math.PI * 2);
            ctx.fillStyle = p % 2 === 0 ? `rgba(${c.r},${c.g},${c.b},0.9)` : "rgba(255,255,255,0.2)";
            ctx.fill();
          }
          // Output lines
          for (let i = 0; i < 3; i++) {
            const wave = Math.sin(t * 4 + i * 0.8);
            ctx.beginPath();
            ctx.moveTo(cx + 36, cy - 8 + i * 8);
            ctx.lineTo(cx + 50, cy - 8 + i * 8 + wave * 4);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          break;
        }

        case "antenna": {
          // Phased antenna array
          for (let i = 0; i < 3; i++) {
            const ax = cx - 16 + i * 16;
            // Antenna mast
            ctx.beginPath();
            ctx.moveTo(ax, cy + 20);
            ctx.lineTo(ax, cy - 20);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
            ctx.lineWidth = 2;
            ctx.stroke();
            // Radial waves
            for (let r = 1; r <= 3; r++) {
              const rad = r * 10 + 5 * Math.sin(t * 2 + i + r);
              ctx.beginPath();
              ctx.arc(ax, cy - 20, rad, -Math.PI * 0.7, -Math.PI * 0.3);
              ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.6 - r * 0.12})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
          // Detection zone
          ctx.beginPath();
          ctx.arc(cx, cy - 20, 4 + 2 * Math.abs(Math.sin(t * 3)), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.fill();
          break;
        }

        case "wristband": {
          // Wristband with EM pulses
          ctx.beginPath();
          ctx.ellipse(cx, cy, 30, 18, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.lineWidth = 4;
          ctx.stroke();
          // Pulse indicators
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + t;
            const px = cx + 30 * Math.cos(angle);
            const py = cy + 18 * Math.sin(angle);
            const pulse = Math.abs(Math.sin(t * 3 + i));
            ctx.beginPath();
            ctx.arc(px, py, 2 + pulse * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.4 + pulse * 0.6})`;
            ctx.fill();
          }
          break;
        }

        case "lattice": {
          // Quantum potential lattice grid
          const spacing = 16;
          for (let gx = -2; gx <= 2; gx++) {
            for (let gy = -2; gy <= 2; gy++) {
              const nx = cx + gx * spacing;
              const ny = cy + gy * spacing;
              const dist = Math.sqrt(gx * gx + gy * gy);
              const pulse = Math.sin(t * 2 - dist * 0.8);
              const r = 2.5 + 1.5 * pulse;
              ctx.beginPath();
              ctx.arc(nx, ny, r, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${0.4 + 0.5 * pulse})`;
              ctx.fill();
              // Connect to neighbors
              if (gx < 2) {
                ctx.beginPath();
                ctx.moveTo(nx, ny);
                ctx.lineTo(nx + spacing, ny);
                ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.2)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
              if (gy < 2) {
                ctx.beginPath();
                ctx.moveTo(nx, ny);
                ctx.lineTo(nx, ny + spacing);
                ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.2)`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }
            }
          }
          break;
        }

        case "mirror": {
          // Phase conjugate mirror
          // Incoming wave
          for (let i = 0; i < 4; i++) {
            const phase = t * 2 + i * 0.5;
            const amp = 8 * Math.sin(phase);
            ctx.beginPath();
            ctx.moveTo(cx - 45, cy - 10 + i * 6);
            ctx.quadraticCurveTo(cx - 20, cy - 10 + i * 6 + amp, cx, cy - 10 + i * 6);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.8 - i * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // Mirror surface
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.3)`;
          ctx.fillRect(cx + 2, cy - 22, 8, 44);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 2;
          ctx.strokeRect(cx + 2, cy - 22, 8, 44);
          // Phase conjugate return (reversed)
          for (let i = 0; i < 4; i++) {
            const phase = -t * 2 + i * 0.5;
            const amp = 8 * Math.sin(phase);
            ctx.beginPath();
            ctx.moveTo(cx, cy - 10 + i * 6);
            ctx.quadraticCurveTo(cx - 20, cy - 10 + i * 6 + amp, cx - 45, cy - 10 + i * 6);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.4 - i * 0.05})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
          break;
        }

        case "coils": {
          // Helmholtz coil pair
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.lineWidth = 3;
          // Left coil
          ctx.beginPath();
          ctx.ellipse(cx - 20, cy, 12, 28, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Right coil
          ctx.beginPath();
          ctx.ellipse(cx + 20, cy, 12, 28, 0, 0, Math.PI * 2);
          ctx.stroke();
          // Field lines between coils
          for (let i = -3; i <= 3; i++) {
            const yOff = i * 6;
            const field = Math.sin(t * 2) * 4;
            ctx.beginPath();
            ctx.moveTo(cx - 8, cy + yOff);
            ctx.bezierCurveTo(cx - 4, cy + yOff + field, cx + 4, cy + yOff - field, cx + 8, cy + yOff);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.5)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          break;
        }

        case "sdr": {
          // SDR receiver display
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.1)`;
          ctx.fillRect(cx - 38, cy - 22, 76, 44);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - 38, cy - 22, 76, 44);
          // Spectrum display
          ctx.beginPath();
          ctx.moveTo(cx - 35, cy + 18);
          for (let x = -35; x <= 35; x += 2) {
            const freq = x / 35;
            const spike = freq > -0.1 && freq < 0.1 ? 30 : 0;
            const noise = Math.sin(x * 0.8 + t * 3) * 5 + Math.random() * 3;
            ctx.lineTo(cx + x, cy + 18 - Math.abs(noise) - spike * Math.abs(Math.sin(t * 2)));
          }
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // 10 Hz spike label
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
          ctx.font = "bold 7px monospace";
          ctx.textAlign = "center";
          ctx.fillText("10 Hz", cx, cy - 12);
          break;
        }

        case "meg": {
          // MEG - permanent magnet + coil switching
          // Core
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.15)`;
          ctx.fillRect(cx - 20, cy - 25, 40, 50);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - 20, cy - 25, 40, 50);
          // Magnetic flux lines
          for (let i = 0; i < 5; i++) {
            const yOff = -16 + i * 8;
            const flux = 12 * Math.sin(t * 2 + i * 0.4);
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy + yOff);
            ctx.bezierCurveTo(cx - 40, cy + yOff + flux, cx + 40, cy + yOff + flux, cx + 20, cy + yOff);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.5 + 0.4 * Math.sin(t + i)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // Switching indicator
          const swOn = Math.sin(t * 5) > 0;
          ctx.fillStyle = swOn ? `rgba(${c.r},${c.g},${c.b},0.9)` : "rgba(255,255,255,0.1)";
          ctx.fillRect(cx - 6, cy + 28, 12, 6);
          ctx.font = "bold 7px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.textAlign = "center";
          ctx.fillText("COP>1", cx, cy + 20);
          break;
        }

        case "overunity": {
          // Two-loop asymmetric circuit
          // Loop A
          ctx.beginPath();
          ctx.ellipse(cx - 16, cy, 14, 18, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          // Loop B
          ctx.beginPath();
          ctx.ellipse(cx + 16, cy, 14, 18, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,0.3)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          // Bridge conductor
          ctx.beginPath();
          ctx.moveTo(cx - 2, cy - 6);
          ctx.lineTo(cx + 2, cy - 6);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          // Energy flow arrows
          const flowPos = ((t * 0.8) % 1);
          const fx = (cx - 16) + flowPos * 32;
          ctx.beginPath();
          ctx.arc(fx, cy - 6, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.fill();
          // Poynting flow
          for (let i = 0; i < 4; i++) {
            const py = cy - 30 + i * 4;
            ctx.beginPath();
            ctx.moveTo(cx - 16, py);
            ctx.lineTo(cx - 16 + 32 * Math.abs(Math.sin(t + i * 0.3)), py);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.25)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          break;
        }

        case "phased_array": {
          // Phased antenna array for TRD
          for (let i = 0; i < 5; i++) {
            const ax = cx - 24 + i * 12;
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
            ctx.fillRect(ax - 2, cy - 18, 4, 16);
            // Beam
            const phase = Math.sin(t * 2 + i * 0.4);
            ctx.beginPath();
            ctx.moveTo(ax, cy - 20);
            ctx.lineTo(ax + phase * 6, cy - 38);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.5 + phase * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          // Patient body outline
          ctx.beginPath();
          ctx.ellipse(cx, cy + 10, 26, 14, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.4)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        }

        case "blanket": {
          // Wire antenna blanket
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.4)`;
          ctx.lineWidth = 1;
          for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - 35, cy - 20 + i * 6);
            ctx.lineTo(cx + 35, cy - 20 + i * 6);
            ctx.stroke();
          }
          for (let i = 0; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(cx - 35 + i * 10, cy - 20);
            ctx.lineTo(cx - 35 + i * 10, cy + 22);
            ctx.stroke();
          }
          // Pulse
          const blanketPulse = Math.abs(Math.sin(t * 2));
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${blanketPulse * 0.3})`;
          ctx.fillRect(cx - 35, cy - 20, 70, 42);
          ctx.font = "bold 8px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.textAlign = "center";
          ctx.fillText("30s TX", cx, cy + 10);
          break;
        }

        case "reactor": {
          // Cold fusion cell
          // Electrolytic cell
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - 22, cy - 28, 44, 56);
          // Cathode
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.fillRect(cx - 8, cy - 20, 16, 40);
          // Bubbles / fusion events
          for (let i = 0; i < 8; i++) {
            const bx = cx - 14 + (i % 4) * 10;
            const by = cy + 15 - Math.floor(i / 4) * 20;
            const rise = ((t * 0.5 + i * 0.15) % 1) * 30;
            ctx.beginPath();
            ctx.arc(bx, by - rise, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
            ctx.fill();
          }
          // TR zone glow
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.1)`;
          ctx.beginPath();
          ctx.arc(cx, cy, 8 + 5 * Math.abs(Math.sin(t * 3)), 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case "transducer": {
          // Wave transduction chain: transverse → longitudinal → time-density
          const stages = ["TW", "LW", "TDW"];
          stages.forEach((label, si) => {
            const sx = cx - 28 + si * 26;
            // Wave box
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.9 - si * 0.1})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(sx - 10, cy - 18, 20, 36);
            // Label
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
            ctx.font = "bold 6px monospace";
            ctx.textAlign = "center";
            ctx.fillText(label, sx, cy + 24);
            // Wave inside
            ctx.beginPath();
            ctx.moveTo(sx - 8, cy);
            for (let x = -8; x <= 8; x++) {
              const wave = si === 2 ? Math.sin(x * 0.4 + t * 3) * 8 : si === 1 ? Math.sin(x * 0.6 + t * 3) * 6 : Math.sin(x * 0.8 + t * 3) * 5;
              ctx.lineTo(sx + x, cy + wave);
            }
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Arrow between stages
            if (si < 2) {
              ctx.beginPath();
              ctx.moveTo(sx + 11, cy);
              ctx.lineTo(sx + 15, cy);
              ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
          break;
        }

        case "biophoton": {
          // Biophoton coherence field
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + t * 0.3;
            const r = 22 + 6 * Math.sin(t * 2 + i * 0.5);
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            const alpha = 0.5 + 0.5 * Math.sin(t * 3 + i);
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
            ctx.fill();
            // Coherence lines to center
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(cx, cy);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          // Center cell
          ctx.beginPath();
          ctx.arc(cx, cy, 7 + 2 * Math.sin(t * 2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.fill();
          break;
        }

        case "conditioner": {
          // Signal conditioner — tube circuit
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
          ctx.lineWidth = 1.5;
          // Tube envelope
          ctx.beginPath();
          ctx.arc(cx - 12, cy, 14, 0, Math.PI * 2);
          ctx.stroke();
          // Tube glow
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.15)`;
          ctx.fill();
          // Tube elements
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.fillRect(cx - 17, cy - 8, 10, 1.5);
          ctx.fillRect(cx - 17, cy, 10, 1.5);
          ctx.fillRect(cx - 17, cy + 8, 10, 1.5);
          // Output signal comparison
          const raw = Math.sin(t * 4) * 10 + Math.sin(t * 13) * 4;
          const conditioned = Math.sin(t * 4) * 10;
          // Raw
          ctx.beginPath();
          ctx.moveTo(cx + 5, cy - 15);
          for (let x = 0; x <= 25; x++) {
            const s = Math.sin((x / 25) * Math.PI * 4 + t * 3) * 8 + Math.sin((x / 25) * Math.PI * 10 + t * 5) * 3;
            ctx.lineTo(cx + 5 + x, cy - 15 + s);
          }
          ctx.strokeStyle = `rgba(255,100,100,0.7)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Conditioned
          ctx.beginPath();
          ctx.moveTo(cx + 5, cy + 10);
          for (let x = 0; x <= 25; x++) {
            const s = Math.sin((x / 25) * Math.PI * 4 + t * 3) * 8;
            ctx.lineTo(cx + 5 + x, cy + 10 + s);
          }
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          break;
        }

        case "krcic": {
          // KRCIC — two chambers with quartz optical path
          // Chamber A (healthy)
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.lineWidth = 2;
          ctx.strokeRect(cx - 42, cy - 20, 24, 40);
          // Chamber B (diseased)
          ctx.strokeRect(cx + 18, cy - 20, 24, 40);
          // Quartz optical path
          ctx.strokeStyle = `rgba(200,200,255,0.6)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - 18, cy - 4, 36, 8);
          // Photons traveling
          for (let i = 0; i < 4; i++) {
            const prog = ((t + i * 0.25) % 1);
            const px = (cx - 18) + prog * 36;
            ctx.beginPath();
            ctx.arc(px, cy, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,200,255,${0.9 - prog * 0.5})`;
            ctx.fill();
          }
          // PMT
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
          ctx.fillRect(cx - 6, cy - 38, 12, 10);
          ctx.font = "bold 6px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
          ctx.textAlign = "center";
          ctx.fillText("PMT", cx, cy - 30);
          break;
        }

        case "spectrometer": {
          // UV spectrometer display
          ctx.fillStyle = `rgba(0,0,0,0.4)`;
          ctx.fillRect(cx - 38, cy - 20, 76, 40);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - 38, cy - 20, 76, 40);
          // Spectral peaks
          const peaks = [0.2, 0.45, 0.7, 0.88];
          ctx.beginPath();
          ctx.moveTo(cx - 35, cy + 17);
          for (let x = 0; x <= 70; x++) {
            const freq = x / 70;
            let height = 3;
            peaks.forEach(p => {
              height += 14 * Math.exp(-Math.pow((freq - p) * 10, 2)) * Math.abs(Math.sin(t * 2 + p * 5));
            });
            ctx.lineTo(cx - 35 + x, cy + 17 - height);
          }
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.font = "bold 7px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
          ctx.textAlign = "center";
          ctx.fillText("200–400 nm", cx, cy - 12);
          break;
        }

        case "field_array": {
          // Agricultural field array — TRZ emitters in grid
          for (let gx = -1; gx <= 1; gx++) {
            for (let gy = -1; gy <= 1; gy++) {
              const ax = cx + gx * 22;
              const ay = cy + gy * 18;
              // Emitter
              ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
              ctx.beginPath();
              ctx.arc(ax, ay, 4, 0, Math.PI * 2);
              ctx.fill();
              // Field beam
              const phase = t * 2 + gx * 0.4 + gy * 0.6;
              const radius = 8 + 4 * Math.abs(Math.sin(phase));
              ctx.beginPath();
              ctx.arc(ax, ay, radius, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.25)`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
          // Ground/crop layer
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.15)`;
          ctx.fillRect(cx - 38, cy + 28, 76, 10);
          break;
        }

        case "shield": {
          // Adaptive counterphase shield
          // Shield perimeter
          for (let ring = 1; ring <= 3; ring++) {
            const alpha = 0.7 - ring * 0.15;
            const r = ring * 12 + 3 * Math.sin(t * 2 + ring);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
            ctx.lineWidth = ring === 1 ? 2 : 1;
            ctx.stroke();
          }
          // Center device
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.fillRect(cx - 6, cy - 6, 12, 12);
          // Counterphase waves
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const r1 = 14, r2 = 36 + 4 * Math.sin(t * 3 + i);
            ctx.beginPath();
            ctx.moveTo(cx + r1 * Math.cos(angle), cy + r1 * Math.sin(angle));
            ctx.lineTo(cx + r2 * Math.cos(angle), cy + r2 * Math.sin(angle));
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.3)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          break;
        }

        case "lwat": {
          // Piezo acoustic transducer
          // Source
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.fillRect(cx - 40, cy - 8, 14, 16);
          // Acoustic waves
          for (let i = 1; i <= 4; i++) {
            const progress = ((t * 1.2 + i * 0.22) % 1);
            const wx = (cx - 26) + progress * 52;
            const wh = 6 + i * 2;
            ctx.beginPath();
            ctx.moveTo(wx, cy - wh);
            ctx.lineTo(wx, cy + wh);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.8 - progress * 0.7})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
          // Wall (target material)
          ctx.fillStyle = `rgba(150,150,150,0.4)`;
          ctx.fillRect(cx + 26, cy - 22, 10, 44);
          ctx.strokeStyle = `rgba(150,150,150,0.8)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx + 26, cy - 22, 10, 44);
          break;
        }

        case "fluxgate": {
          // Flux gate generator
          // Rotating magnet
          const fangle = t * 2;
          for (let p = 0; p < 4; p++) {
            const pa = fangle + (p * Math.PI) / 2;
            const px = cx + 16 * Math.cos(pa);
            const py = cy + 16 * Math.sin(pa);
            ctx.fillStyle = p % 2 === 0 ? `rgba(${c.r},${c.g},${c.b},0.9)` : "rgba(100,100,200,0.7)";
            ctx.fillRect(px - 5, py - 5, 10, 10);
          }
          // Output coil ring
          ctx.beginPath();
          ctx.arc(cx, cy, 30, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.4)`;
          ctx.lineWidth = 8;
          ctx.stroke();
          // AB effect indicator
          ctx.font = "bold 7px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.textAlign = "center";
          ctx.fillText("A-B", cx, cy + 2);
          break;
        }

        case "schumann": {
          // Atmospheric harvester
          // Earth surface
          ctx.beginPath();
          ctx.arc(cx, cy + 45, 50, Math.PI * 1.15, Math.PI * 1.85);
          ctx.strokeStyle = `rgba(100,200,100,0.5)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          // Ionosphere
          ctx.beginPath();
          ctx.arc(cx, cy + 45, 72, Math.PI * 1.2, Math.PI * 1.8);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          // Antenna
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.9)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 5);
          ctx.lineTo(cx, cy - 32);
          ctx.stroke();
          // Schumann resonance waves
          for (let r = 1; r <= 3; r++) {
            const rad = r * 12 + 4 * Math.sin(t * 2 + r);
            ctx.beginPath();
            ctx.arc(cx, cy - 5, rad, -Math.PI * 0.8, -Math.PI * 0.2);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.7 - r * 0.15})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.font = "bold 7px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.textAlign = "center";
          ctx.fillText("7.83 Hz", cx, cy - 36);
          break;
        }

        case "helmholtz": {
          // Morphogenetic synchronizer — Helmholtz array
          for (let i = 0; i < 4; i++) {
            const ax = cx - 24 + i * 16;
            ctx.beginPath();
            ctx.arc(ax, cy, 8, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.7)`;
            ctx.lineWidth = 2;
            ctx.stroke();
            // Field beam downward
            const phase = t * 2 + i * 0.5;
            const blen = 18 + 5 * Math.abs(Math.sin(phase));
            ctx.beginPath();
            ctx.moveTo(ax, cy + 9);
            ctx.lineTo(ax, cy + blen);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.5 + 0.4 * Math.abs(Math.sin(phase))})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          // Target tissue
          ctx.beginPath();
          ctx.ellipse(cx, cy + 36, 28, 8, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.15)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.5)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          break;
        }

        case "satellite": {
          // AI sky monitoring system
          // Camera/sensor
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.fillRect(cx - 10, cy - 10, 20, 20);
          // AI detection beams
          for (let a = -2; a <= 2; a++) {
            const beamAngle = (a * 0.25) + Math.sin(t * 0.5) * 0.1;
            ctx.beginPath();
            ctx.moveTo(cx, cy + 10);
            ctx.lineTo(cx + Math.sin(beamAngle) * 40, cy + 40);
            ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${0.6 - Math.abs(a) * 0.1})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          // Cloud pattern detected
          ctx.beginPath();
          ctx.ellipse(cx + Math.sin(t * 0.3) * 5, cy + 40, 18, 5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.2)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.font = "bold 6px monospace";
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.textAlign = "center";
          ctx.fillText("PATTERN MATCH", cx, cy + 55);
          break;
        }

        default: {
          // Generic pulsing device
          ctx.beginPath();
          ctx.arc(cx, cy, 25 + 5 * Math.sin(t * 2), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},0.8)`;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(cx, cy, 12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.6)`;
          ctx.fill();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [shape, color, size]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

const ALL_DEVICES = [...DEVICES, ...DEVICES];

export default function DeviceSlideStrip({ reverse = false }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);
  const CARD_H = 175;

  useEffect(() => {
    const SPEED = 0.3;
    const singleSetHeight = DEVICES.length * CARD_H;

    const step = () => {
      posRef.current += reverse ? -SPEED : SPEED;
      if (posRef.current >= singleSetHeight) posRef.current -= singleSetHeight;
      if (posRef.current < 0) posRef.current += singleSetHeight;
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [reverse]);

  return (
    <div
      className="hidden lg:block flex-shrink-0 overflow-hidden relative"
      style={{ width: 185, height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #020617, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #020617, transparent)" }} />

      <div ref={trackRef} style={{ willChange: "transform" }}>
        {ALL_DEVICES.map((device, i) => {
          const c = device.color;
          return (
            <div
              key={i}
              style={{
                marginBottom: 7,
                width: 175,
                marginLeft: 5,
                height: 168,
                border: `1px solid ${c}`,
                borderRadius: 8,
                flexShrink: 0,
                background: "#020d1a",
                boxShadow: `0 0 12px ${c}44, inset 0 0 16px ${c}08`,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Neon top bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 2,
                background: `linear-gradient(90deg, transparent, ${c}, transparent)`,
                boxShadow: `0 0 8px ${c}`,
              }} />

              {/* Header */}
              <div style={{
                padding: "5px 8px",
                display: "flex",
                alignItems: "center",
                gap: 5,
                borderBottom: `1px solid ${c}30`,
                flexShrink: 0,
                zIndex: 1,
              }}>
                <span style={{
                  fontSize: 7.5,
                  fontWeight: 900,
                  letterSpacing: "0.12em",
                  color: "#000",
                  background: c,
                  padding: "1px 5px",
                  borderRadius: 3,
                  boxShadow: `0 0 6px ${c}`,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  3D DEVICE
                </span>
                <span style={{
                  fontSize: 7.5,
                  fontWeight: 700,
                  color: c,
                  textShadow: `0 0 6px ${c}99`,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {device.tag}
                </span>
              </div>

              {/* 3D Animation */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DeviceAnimation shape={device.shape} color={c} size={112} />
              </div>

              {/* Title */}
              <div style={{
                padding: "4px 8px 5px",
                borderTop: `1px solid ${c}20`,
                flexShrink: 0,
              }}>
                <p style={{
                  color: c,
                  fontSize: 9,
                  fontWeight: 800,
                  lineHeight: 1.25,
                  textShadow: `0 0 6px ${c}88`,
                  letterSpacing: "0.02em",
                  margin: 0,
                }}>
                  {device.icon} {device.title}
                </p>
              </div>

              {/* Bottom neon line */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${c}60, transparent)`,
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}