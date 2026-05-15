import { useEffect, useRef } from "react";

const DEVICES = [
  { title: "Anenergy Pump", color: "#ef4444", shape: "toroid", tag: "VACUUM ENERGY" },
  { title: "Scalar Bottle Interferometer", color: "#06b6d4", shape: "interferometer", tag: "SCALAR EM" },
  { title: "Vacuum Potential Oscillator", color: "#a855f7", shape: "oscillator", tag: "RESONANCE" },
  { title: "Biofield Frequency Chamber", color: "#22c55e", shape: "chamber", tag: "BIOELECTROMAGNETICS" },
  { title: "Open-System Mag Generator", color: "#f97316", shape: "generator", tag: "FREE ENERGY" },
  { title: "Quantum Potential Detector", color: "#fbbf24", shape: "antenna", tag: "SENSOR" },
  { title: "EM Trigger Window Device", color: "#22c55e", shape: "wristband", tag: "BIOELECTROMAGNETICS" },
  { title: "Phase Conjugate Mirror", color: "#3b82f6", shape: "mirror", tag: "SCALAR COMMS" },
  { title: "Priore-Type EM Therapy", color: "#ec4899", shape: "coils", tag: "THERAPY DEVICE" },
  { title: "ELF Carrier Lock Detector", color: "#06b6d4", shape: "sdr", tag: "SIGINT" },
  { title: "MEG Replication Kit", color: "#a855f7", shape: "meg", tag: "COP>1 DEVICE" },
  { title: "Asymmetric Regauging Gen.", color: "#ef4444", shape: "overunity", tag: "OVERUNITY" },
  { title: "Telomere Regeneration Device", color: "#22c55e", shape: "phased_array", tag: "LONGEVITY" },
  { title: "TRZ Cold Fusion Reactor", color: "#06b6d4", shape: "reactor", tag: "NUCLEAR ENERGY" },
  { title: "Biophoton Coherence Chamber", color: "#22c55e", shape: "biophoton", tag: "BIOPHOTONICS" },
  { title: "Aegis-SV Counterphase Shield", color: "#3b82f6", shape: "shield", tag: "EMF DEFENSE" },
  { title: "Atmospheric EM Harvester", color: "#06b6d4", shape: "schumann", tag: "TESLA TECH" },
  { title: "KRCIC Imprinting Chamber", color: "#22c55e", shape: "krcic", tag: "BIOPHOTONICS" },
  { title: "UV Biophoton Spectrometer", color: "#06b6d4", shape: "spectrometer", tag: "UV OPTICS" },
  { title: "Asymmetric Flux Gate Gen.", color: "#fbbf24", shape: "fluxgate", tag: "AB EFFECT" },
  { title: "Morphogenetic Synchronizer", color: "#22c55e", shape: "helmholtz", tag: "REGENERATIVE" },
  { title: "Morphogenetic Field Monitor", color: "#10b981", shape: "lattice", tag: "BIOFIELD" },
];

// ── Realistic 3D canvas renderer ──────────────────────────────────────────────
function DeviceAnimation({ shape, color, size = 116 }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const tRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = size;
    canvas.height = size;
    const W = size, H = size, cx = W / 2, cy = H / 2;

    // Parse hex colour
    const hr = parseInt(color.slice(1, 3), 16);
    const hg = parseInt(color.slice(3, 5), 16);
    const hb = parseInt(color.slice(5, 7), 16);

    // ── Utility helpers ──────────────────────────────────────────────────────

    // 3D shaded sphere with specular highlight
    const sphere = (sx, sy, sr, lr = hr, lg = hg, lb = hb, alpha = 1) => {
      if (sr <= 0) return;
      const g = ctx.createRadialGradient(sx - sr * 0.32, sy - sr * 0.32, sr * 0.04, sx, sy, sr);
      g.addColorStop(0, `rgba(255,255,255,${0.6 * alpha})`);
      g.addColorStop(0.3, `rgba(${lr},${lg},${lb},${0.98 * alpha})`);
      g.addColorStop(0.72, `rgba(${Math.round(lr*0.35)},${Math.round(lg*0.35)},${Math.round(lb*0.35)},${0.95 * alpha})`);
      g.addColorStop(1, `rgba(0,0,0,${0.88 * alpha})`);
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      // Specular
      const sg = ctx.createRadialGradient(sx - sr * 0.4, sy - sr * 0.4, 0, sx - sr * 0.3, sy - sr * 0.3, sr * 0.42);
      sg.addColorStop(0, `rgba(255,255,255,${0.75 * alpha})`);
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = sg; ctx.fill();
    };

    // Metallic ring (visible segments shaded by angle)
    const ring = (rx, ry, ro, ri) => {
      for (let seg = 0; seg < 64; seg++) {
        const a1 = (seg / 64) * Math.PI * 2;
        const a2 = ((seg + 1) / 64) * Math.PI * 2;
        const lv = 0.3 + 0.7 * Math.abs(Math.sin(a1 + Math.PI * 0.4));
        ctx.beginPath();
        ctx.moveTo(rx + ro * Math.cos(a1), ry + ro * Math.sin(a1));
        ctx.arc(rx, ry, ro, a1, a2);
        ctx.arc(rx, ry, ri, a2, a1, true);
        ctx.closePath();
        ctx.fillStyle = `rgba(${Math.round(hr*lv)},${Math.round(hg*lv)},${Math.round(hb*lv)},0.93)`;
        ctx.fill();
      }
    };

    // Copper coil ellipse with 3D winding look
    const coilEllipse = (ox, oy, rw, rh) => {
      for (let seg = 0; seg < 48; seg++) {
        const a1 = (seg / 48) * Math.PI * 2;
        const a2 = ((seg + 1) / 48) * Math.PI * 2;
        const lv = 0.35 + 0.65 * Math.abs(Math.sin(a1 + Math.PI * 0.25));
        ctx.beginPath();
        ctx.ellipse(ox, oy, rw, rh, 0, a1, a2);
        ctx.lineWidth = 5;
        ctx.strokeStyle = `rgba(${Math.round(200*lv)},${Math.round(120*lv)},${Math.round(40*lv)},0.95)`;
        ctx.stroke();
      }
    };

    // Glass box
    const glassBox = (gx, gy, gw, gh) => {
      const g = ctx.createLinearGradient(gx, gy, gx + gw, gy);
      g.addColorStop(0, "rgba(80,120,160,0.14)");
      g.addColorStop(0.3, "rgba(200,230,255,0.1)");
      g.addColorStop(0.7, "rgba(80,120,160,0.07)");
      g.addColorStop(1, "rgba(30,60,90,0.18)");
      ctx.fillStyle = g; ctx.fillRect(gx, gy, gw, gh);
      ctx.strokeStyle = "rgba(180,220,255,0.65)"; ctx.lineWidth = 1.5;
      ctx.strokeRect(gx, gy, gw, gh);
      ctx.fillStyle = "rgba(255,255,255,0.1)"; ctx.fillRect(gx + 2, gy + 3, 3, gh - 6);
    };

    // Metal enclosure
    const metalBox = (bx, by, bw, bh) => {
      const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
      g.addColorStop(0, "rgba(30,35,45,0.97)"); g.addColorStop(0.35, "rgba(65,75,95,0.92)");
      g.addColorStop(0.65, "rgba(50,60,80,0.92)"); g.addColorStop(1, "rgba(20,25,35,0.97)");
      ctx.fillStyle = g; ctx.fillRect(bx, by, bw, bh);
    };

    // Volume glow
    const glow = (gx, gy, gr, alpha = 0.5) => {
      const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      g.addColorStop(0, `rgba(${hr},${hg},${hb},${alpha})`);
      g.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
    };

    // ── Draw loop ────────────────────────────────────────────────────────────
    const draw = () => {
      tRef.current += 0.022;
      const t = tRef.current;
      ctx.clearRect(0, 0, W, H);

      // Scene background — subtle radial tint
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cx * 1.3);
      bg.addColorStop(0, `rgba(${hr},${hg},${hb},0.15)`);
      bg.addColorStop(0.55, `rgba(${Math.round(hr*0.25)},${Math.round(hg*0.25)},${Math.round(hb*0.25)},0.08)`);
      bg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Floor grid reflection
      ctx.save(); ctx.globalAlpha = 0.06;
      ctx.strokeStyle = `rgb(${hr},${hg},${hb})`; ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 14) { ctx.beginPath(); ctx.moveTo(gx, cy + 18); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = cy + 18; gy < H; gy += 10) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      ctx.restore();

      // ── Shape-specific realistic renders ──────────────────────────────────
      switch (shape) {

        case "toroid": {
          const R = 28, r = 10;
          const segs = [];
          for (let a = 0; a < Math.PI * 2; a += 0.09) {
            const rot = a + t;
            const x3 = R * Math.cos(rot), z3 = R * Math.sin(rot);
            const ds = 1 + z3 / 85;
            const lv = 0.35 + 0.65 * ((Math.sin(rot) + 1) / 2);
            segs.push({ sx: cx + x3, sy: cy + z3 * 0.34, sr: r * ds, z3, lv });
          }
          segs.sort((a, b) => a.z3 - b.z3);
          segs.forEach(({ sx, sy, sr, lv }) =>
            sphere(sx, sy, sr, Math.round(hr*lv), Math.round(hg*lv), Math.round(hb*lv)));
          glow(cx, cy, 14 + 3 * Math.sin(t * 3), 0.7);
          sphere(cx, cy, 6, 255, 255, 220, 0.9);
          break;
        }

        case "interferometer": {
          const tx1 = cx - 30, tx2 = cx + 30;
          // Emitter cylinders
          [tx1, tx2].forEach(ox => {
            const cg = ctx.createLinearGradient(ox - 7, cy - 18, ox + 7, cy + 18);
            cg.addColorStop(0, "rgba(30,35,45,0.95)"); cg.addColorStop(0.4, `rgba(${hr},${hg},${hb},0.7)`);
            cg.addColorStop(0.7, "rgba(60,70,90,0.8)"); cg.addColorStop(1, "rgba(20,25,35,0.95)");
            ctx.fillStyle = cg; ctx.fillRect(ox - 7, cy - 18, 14, 36);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.5)`; ctx.lineWidth = 1; ctx.strokeRect(ox - 7, cy - 18, 14, 36);
            // Antenna stem
            ctx.beginPath(); ctx.moveTo(ox, cy - 18); ctx.lineTo(ox, cy - 30);
            ctx.strokeStyle = "rgba(200,210,230,0.85)"; ctx.lineWidth = 2; ctx.stroke();
          });
          // Wave rings
          for (let i = 1; i <= 5; i++) {
            const r2 = i * 10 + 4 * Math.sin(t * 2 + i);
            [tx1, tx2].forEach(ox => {
              ctx.beginPath(); ctx.arc(ox, cy, r2, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.55 - i * 0.08})`; ctx.lineWidth = 1.5; ctx.stroke();
            });
          }
          // Bright interference zone
          glow(cx, cy, 15 + 5 * Math.abs(Math.sin(t * 3)), 0.65);
          sphere(cx, cy, 6 + 2 * Math.abs(Math.sin(t * 3)), 255, 255, 220, 0.9);
          break;
        }

        case "oscillator": {
          // 3D copper coil
          for (let i = 0; i < 6; i++) {
            const wx = cx - 22 + i * 8;
            const wy = cy - 8;
            const cg = ctx.createLinearGradient(wx - 6, wy - 6, wx + 6, wy + 6);
            cg.addColorStop(0, "rgba(255,200,130,0.75)");
            cg.addColorStop(0.5, `rgba(${hr},${hg},${hb},0.9)`);
            cg.addColorStop(1, "rgba(100,60,20,0.7)");
            ctx.beginPath(); ctx.arc(wx, wy, 5 + Math.sin(t * 3 + i) * 0.8, Math.PI, 0);
            ctx.strokeStyle = cg; ctx.lineWidth = 4; ctx.stroke();
          }
          // Capacitor plates — polished metal
          for (const [ox, w] of [[cx + 18, 5], [cx + 25, 5]]) {
            const pg = ctx.createLinearGradient(ox, cy - 17, ox + w, cy + 17);
            pg.addColorStop(0, "rgba(40,50,70,0.9)"); pg.addColorStop(0.4, "rgba(180,195,220,0.85)");
            pg.addColorStop(0.7, "rgba(80,95,115,0.85)"); pg.addColorStop(1, "rgba(30,38,55,0.9)");
            ctx.fillStyle = pg; ctx.fillRect(ox, cy - 17, w, 34);
          }
          // EM field lines
          for (let i = 0; i < 5; i++) {
            const yOff = -8 + i * 4, amp = 10 * Math.sin(t * 2.5 + i * 0.5);
            const fg = ctx.createLinearGradient(cx - 18, cy + yOff, cx + 16, cy + yOff);
            fg.addColorStop(0, `rgba(${hr},${hg},${hb},0)`);
            fg.addColorStop(0.5, `rgba(${hr},${hg},${hb},0.75)`);
            fg.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
            ctx.beginPath(); ctx.moveTo(cx - 18, cy + yOff);
            ctx.bezierCurveTo(cx - 5, cy + yOff + amp, cx + 5, cy + yOff - amp, cx + 16, cy + yOff);
            ctx.strokeStyle = fg; ctx.lineWidth = 1.8; ctx.stroke();
          }
          break;
        }

        case "chamber": {
          glassBox(cx - 40, cy - 22, 26, 44); glassBox(cx + 14, cy - 22, 26, 44);
          // Laser beam glow
          const bg2 = ctx.createLinearGradient(cx - 14, cy, cx + 14, cy);
          bg2.addColorStop(0, `rgba(${hr},${hg},${hb},0)`);
          bg2.addColorStop(0.5, `rgba(${hr},${hg},${hb},0.85)`);
          bg2.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
          ctx.fillStyle = bg2; ctx.fillRect(cx - 14, cy - 2.5, 28, 5);
          // Photon spheres
          for (let i = 0; i < 7; i++) {
            const p = ((t * 1.8 + i * 0.14) % 1);
            sphere(cx - 14 + p * 28, cy, 2.5, hr, hg, hb, 0.9 - p * 0.4);
          }
          // Cell samples
          for (let i = 0; i < 3; i++)
            sphere(cx - 28, cy - 8 + i * 11, 3.5 + Math.sin(t * 2 + i) * 0.7, hr, hg, hb, 0.7);
          break;
        }

        case "generator": {
          ring(cx, cy, 36, 29);
          // Rotor disc
          const dg = ctx.createRadialGradient(cx - 5, cy - 5, 2, cx, cy, 22);
          dg.addColorStop(0, "rgba(220,230,255,0.9)"); dg.addColorStop(0.5, `rgba(${hr},${hg},${hb},0.65)`);
          dg.addColorStop(1, "rgba(15,18,30,0.85)");
          ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.fillStyle = dg; ctx.fill();
          // Poles
          for (let p = 0; p < 4; p++) {
            const a = t + (p * Math.PI) / 2;
            sphere(cx + 14 * Math.cos(a), cy + 14 * Math.sin(a), 5.5,
              p % 2 === 0 ? hr : 60, p % 2 === 0 ? hg : 60, p % 2 === 0 ? hb : 200,
              0.45 + 0.55 * Math.abs(Math.sin(a + Math.PI / 4)));
          }
          // Output waveform
          for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.moveTo(cx + 38, cy - 8 + i * 8);
            for (let x = 0; x < 18; x++)
              ctx.lineTo(cx + 38 + x, cy - 8 + i * 8 + Math.sin(t * 4 + i + x * 0.4) * 4);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.8)`; ctx.lineWidth = 1.5; ctx.stroke();
          }
          break;
        }

        case "antenna": {
          // Base plate
          const bp = ctx.createLinearGradient(cx - 34, cy + 20, cx + 34, cy + 28);
          bp.addColorStop(0, "rgba(50,60,80,0.9)"); bp.addColorStop(0.5, "rgba(130,145,170,0.9)"); bp.addColorStop(1, "rgba(40,50,70,0.9)");
          ctx.fillStyle = bp; ctx.fillRect(cx - 34, cy + 20, 68, 8);
          for (let i = 0; i < 3; i++) {
            const ax = cx - 16 + i * 16;
            // Mast cylinder gradient
            const mg = ctx.createLinearGradient(ax - 3, cy - 22, ax + 3, cy + 20);
            mg.addColorStop(0, `rgba(${hr},${hg},${hb},0.5)`); mg.addColorStop(0.5, "rgba(255,255,255,0.65)");
            mg.addColorStop(1, `rgba(${hr},${hg},${hb},0.35)`);
            ctx.fillStyle = mg; ctx.fillRect(ax - 2.5, cy - 22, 5, 42);
            // Cross-members
            for (let ci = 0; ci < 3; ci++) {
              ctx.fillStyle = "rgba(170,190,210,0.6)";
              ctx.fillRect(ax - 9 + ci * 3, cy - 12 + ci * 10, 18 - ci * 6, 2);
            }
            // Emission rings
            for (let r2 = 1; r2 <= 3; r2++) {
              const rad = r2 * 9 + 4 * Math.sin(t * 2.5 + i + r2);
              ctx.beginPath(); ctx.arc(ax, cy - 22, rad, -Math.PI * 0.75, -Math.PI * 0.25);
              ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.6 - r2 * 0.12})`; ctx.lineWidth = 2 - r2 * 0.3; ctx.stroke();
            }
          }
          break;
        }

        case "wristband": {
          // Band segments — shaded ellipse sections
          for (let seg = 0; seg < 36; seg++) {
            const a1 = (seg / 36) * Math.PI * 2, a2 = ((seg + 1) / 36) * Math.PI * 2;
            const lv = 0.3 + 0.7 * Math.abs(Math.cos(a1 + Math.PI / 6));
            ctx.beginPath(); ctx.ellipse(cx, cy, 30, 16, 0, a1, a2);
            ctx.lineWidth = 9; ctx.strokeStyle = `rgba(${Math.round(hr*lv)},${Math.round(hg*lv)},${Math.round(hb*lv)},0.95)`; ctx.stroke();
          }
          // PCB module
          const pcb = ctx.createLinearGradient(cx - 12, cy - 24, cx + 12, cy - 13);
          pcb.addColorStop(0, "rgba(10,35,15,0.96)"); pcb.addColorStop(0.5, "rgba(30,80,35,0.8)"); pcb.addColorStop(1, "rgba(8,22,10,0.96)");
          ctx.fillStyle = pcb; ctx.fillRect(cx - 12, cy - 24, 24, 11);
          ctx.strokeStyle = "rgba(70,180,80,0.45)"; ctx.lineWidth = 0.5; ctx.strokeRect(cx - 12, cy - 24, 24, 11);
          // Pulse LEDs
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + t;
            const pulse = Math.abs(Math.sin(t * 3 + i));
            sphere(cx + 30 * Math.cos(a), cy + 16 * Math.sin(a), 2.5 + pulse * 2, hr, hg, hb, 0.5 + pulse * 0.5);
          }
          break;
        }

        case "mirror": {
          // Optical bench rail
          const rail = ctx.createLinearGradient(cx - 48, cy + 22, cx + 48, cy + 30);
          rail.addColorStop(0, "rgba(50,60,80,0.85)"); rail.addColorStop(0.5, "rgba(150,165,190,0.85)"); rail.addColorStop(1, "rgba(50,60,80,0.85)");
          ctx.fillStyle = rail; ctx.fillRect(cx - 48, cy + 22, 96, 8);
          // Incoming beam (volumetric)
          for (let i = 0; i < 5; i++) {
            ctx.beginPath(); ctx.moveTo(cx - 46, cy - 8 + i * 4 - 8);
            ctx.quadraticCurveTo(cx - 20, cy + Math.sin(t * 2.2 + i * 0.4) * 8, cx + 2, cy - 8 + i * 4 - 8);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},${(1 - i / 5) * 0.55})`; ctx.lineWidth = 1.5 - i * 0.2; ctx.stroke();
          }
          // Mirror surface — polished
          const mg = ctx.createLinearGradient(cx + 2, cy - 26, cx + 14, cy + 26);
          mg.addColorStop(0, "rgba(200,220,255,0.5)"); mg.addColorStop(0.35, `rgba(${hr},${hg},${hb},0.38)`);
          mg.addColorStop(0.65, "rgba(255,255,255,0.55)"); mg.addColorStop(1, "rgba(80,100,140,0.65)");
          ctx.fillStyle = mg; ctx.fillRect(cx + 2, cy - 26, 13, 52);
          ctx.strokeStyle = "rgba(200,220,255,0.9)"; ctx.lineWidth = 1.5; ctx.strokeRect(cx + 2, cy - 26, 13, 52);
          // Phase-conjugate return
          for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(cx + 2, cy - 5 + i * 5);
            ctx.quadraticCurveTo(cx - 18, cy - 5 + i * 5 + Math.sin(-t * 2.2 + i * 0.4) * 8, cx - 46, cy - 5 + i * 5);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.3 - i * 0.05})`; ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
          }
          break;
        }

        case "coils": {
          coilEllipse(cx - 22, cy, 14, 30);
          coilEllipse(cx + 22, cy, 14, 30);
          // Field lines
          for (let i = -4; i <= 4; i++) {
            const yo = i * 5.5, fv = Math.sin(t * 2.2) * 5;
            const fg = ctx.createLinearGradient(cx - 10, cy + yo, cx + 10, cy + yo);
            fg.addColorStop(0, `rgba(${hr},${hg},${hb},0)`); fg.addColorStop(0.5, `rgba(${hr},${hg},${hb},${0.48 - Math.abs(i) * 0.04})`); fg.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
            ctx.beginPath(); ctx.moveTo(cx - 10, cy + yo);
            ctx.bezierCurveTo(cx - 4, cy + yo + fv, cx + 4, cy + yo - fv, cx + 10, cy + yo);
            ctx.strokeStyle = fg; ctx.lineWidth = 1.6; ctx.stroke();
          }
          break;
        }

        case "sdr": {
          metalBox(cx - 40, cy - 26, 80, 52);
          // Screen
          ctx.fillStyle = "rgba(4,7,14,0.97)"; ctx.fillRect(cx - 34, cy - 20, 54, 40);
          // Spectrum waterfall (coloured bars)
          for (let x = 0; x <= 52; x += 2) {
            const f = x / 52, spike = f > 0.44 && f < 0.58 ? 1 : 0;
            const h2 = spike ? 22 + 10 * Math.abs(Math.sin(t * 2.5)) : 3 + Math.abs(Math.sin(x * 0.6 + t * 3)) * 8;
            ctx.fillStyle = spike
              ? `rgba(255,${Math.round(80 + h2 * 6)},40,0.95)`
              : `rgba(${hr},${Math.round(hg * 0.65 + h2 * 4)},${hb},0.82)`;
            ctx.fillRect(cx - 34 + x, cy + 18 - h2, 2, h2);
          }
          // Screen glare
          ctx.fillStyle = "rgba(255,255,255,0.04)"; ctx.fillRect(cx - 34, cy - 20, 54, 8);
          ctx.font = "bold 6px monospace"; ctx.fillStyle = `rgba(${hr},${hg},${hb},0.85)`;
          ctx.textAlign = "center"; ctx.fillText("ELF · 0–30 Hz", cx - 7, cy - 9);
          // Side ports
          ctx.fillStyle = "rgba(70,80,100,0.8)";
          ctx.fillRect(cx + 24, cy - 6, 13, 5); ctx.fillRect(cx + 24, cy + 4, 13, 5);
          break;
        }

        case "meg": {
          // Metglas core
          const cg = ctx.createLinearGradient(cx - 22, cy - 27, cx + 22, cy + 27);
          cg.addColorStop(0, "rgba(55,60,80,0.96)"); cg.addColorStop(0.3, `rgba(${hr},${hg},${hb},0.45)`);
          cg.addColorStop(0.7, "rgba(95,105,125,0.8)"); cg.addColorStop(1, "rgba(28,32,48,0.96)");
          ctx.fillStyle = cg; ctx.fillRect(cx - 22, cy - 27, 44, 54);
          ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.65)`; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 22, cy - 27, 44, 54);
          // Copper windings
          for (let w = 0; w < 6; w++) {
            const wy = cy - 18 + w * 7, lv = 0.5 + 0.5 * Math.abs(Math.sin(w * 0.8 + t));
            ctx.beginPath(); ctx.ellipse(cx, wy, 24, 4, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${Math.round(200*lv)},${Math.round(120*lv)},${Math.round(38*lv)},0.82)`; ctx.lineWidth = 2.5; ctx.stroke();
          }
          // Flux lines
          for (let i = 0; i < 5; i++) {
            const yo = -16 + i * 8, fl = 14 * Math.sin(t * 2.2 + i * 0.4);
            ctx.beginPath(); ctx.moveTo(cx - 22, cy + yo);
            ctx.bezierCurveTo(cx - 46, cy + yo + fl, cx + 46, cy + yo + fl, cx + 22, cy + yo);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.4 + 0.4 * Math.abs(Math.sin(t + i))})`; ctx.lineWidth = 1.5; ctx.stroke();
          }
          // LED
          const on = Math.sin(t * 5) > 0;
          glow(cx, cy + 32, on ? 8 : 3, on ? 0.85 : 0.1);
          ctx.font = "bold 7px monospace"; ctx.fillStyle = `rgba(${hr},${hg},${hb},0.9)`;
          ctx.textAlign = "center"; ctx.fillText("COP>1", cx, cy + 22);
          break;
        }

        case "overunity": {
          ring(cx - 18, cy, 16, 10); ring(cx + 18, cy, 13, 8);
          // Energy particle orbiting
          const ea = t * 2.5;
          sphere(cx + 22 * Math.cos(ea), cy + 12 * Math.sin(ea), 4, 255, 255, 150, 0.92);
          glow(cx, cy, 22, 0.1);
          // Output arrows
          for (let i = 0; i < 3; i++) {
            ctx.beginPath(); ctx.moveTo(cx + 36, cy - 7 + i * 7); ctx.lineTo(cx + 48, cy - 7 + i * 7);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.75)`; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + 46, cy - 10 + i * 7); ctx.lineTo(cx + 50, cy - 7 + i * 7); ctx.lineTo(cx + 46, cy - 4 + i * 7);
            ctx.stroke();
          }
          break;
        }

        case "phased_array": {
          // PCB substrate
          const pcb = ctx.createLinearGradient(cx - 36, cy - 12, cx + 36, cy + 12);
          pcb.addColorStop(0, "rgba(0,38,18,0.92)"); pcb.addColorStop(0.5, "rgba(0,65,32,0.8)"); pcb.addColorStop(1, "rgba(0,38,18,0.92)");
          ctx.fillStyle = pcb; ctx.fillRect(cx - 36, cy - 12, 72, 24);
          ctx.strokeStyle = "rgba(40,180,90,0.25)"; ctx.lineWidth = 0.5; ctx.strokeRect(cx - 36, cy - 12, 72, 24);
          for (let i = 0; i < 5; i++) {
            const ax = cx - 24 + i * 12;
            // Gold trace
            ctx.fillStyle = "rgba(200,175,45,0.72)"; ctx.fillRect(ax - 1.5, cy - 11, 3, 22);
            // Patch element
            const eg = ctx.createLinearGradient(ax - 6, cy - 30, ax + 6, cy - 12);
            eg.addColorStop(0, "rgba(255,255,255,0.5)"); eg.addColorStop(0.5, `rgba(${hr},${hg},${hb},0.8)`); eg.addColorStop(1, "rgba(20,20,30,0.7)");
            ctx.fillStyle = eg; ctx.fillRect(ax - 6, cy - 30, 12, 18);
            // Beam lobe glow
            const ph = Math.sin(t * 2.2 + i * 0.5);
            glow(ax + ph * 4, cy - 46, 12, 0.55);
          }
          // Target ellipse
          ctx.beginPath(); ctx.ellipse(cx, cy + 24, 28, 8, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.42)`; ctx.lineWidth = 2; ctx.stroke();
          break;
        }

        case "reactor": {
          // Electrolytic cell — glass
          glassBox(cx - 24, cy - 30, 48, 60);
          // Palladium cathode
          const cathG = ctx.createLinearGradient(cx - 9, cy - 22, cx + 9, cy + 22);
          cathG.addColorStop(0, "rgba(190,200,220,0.9)"); cathG.addColorStop(0.4, "rgba(255,255,255,0.7)");
          cathG.addColorStop(0.8, "rgba(140,150,175,0.85)"); cathG.addColorStop(1, "rgba(80,90,110,0.9)");
          ctx.fillStyle = cathG; ctx.fillRect(cx - 9, cy - 22, 18, 44);
          // Bubbles
          for (let i = 0; i < 9; i++) {
            const bx = cx - 16 + (i % 5) * 8, by = cy + 18 - Math.floor(i / 5) * 22;
            const rise = ((t * 0.55 + i * 0.12) % 1) * 34;
            sphere(bx, by - rise, 2.2, hr, hg, hb, 0.65);
          }
          // Core fusion glow
          glow(cx, cy, 10 + 5 * Math.abs(Math.sin(t * 3)), 0.35);
          break;
        }

        case "biophoton": {
          // Central cell body
          sphere(cx, cy, 9 + 2 * Math.sin(t * 2), hr, hg, hb, 0.85);
          // Orbiting photon points
          for (let i = 0; i < 14; i++) {
            const a = (i / 14) * Math.PI * 2 + t * 0.32;
            const r2 = 24 + 7 * Math.sin(t * 2.2 + i * 0.45);
            const alpha = 0.45 + 0.55 * Math.abs(Math.sin(t * 3 + i));
            sphere(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a), 2.8, hr, hg, hb, alpha);
            // Coherence thread
            ctx.beginPath(); ctx.moveTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a));
            ctx.lineTo(cx, cy); ctx.strokeStyle = `rgba(${hr},${hg},${hb},${alpha * 0.18})`; ctx.lineWidth = 0.6; ctx.stroke();
          }
          glow(cx, cy, 28, 0.12);
          break;
        }

        case "shield": {
          // Central device
          sphere(cx, cy, 8, hr, hg, hb, 0.9);
          // Concentric shields
          for (let r2 = 1; r2 <= 4; r2++) {
            const rr = r2 * 11 + 3 * Math.sin(t * 2 + r2);
            ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.65 - r2 * 0.12})`; ctx.lineWidth = r2 === 1 ? 2.5 : 1.2; ctx.stroke();
          }
          // Counterphase spokes
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2, r1 = 14, r22 = 38 + 4 * Math.sin(t * 3 + i);
            ctx.beginPath(); ctx.moveTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)); ctx.lineTo(cx + r22 * Math.cos(a), cy + r22 * Math.sin(a));
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.28)`; ctx.lineWidth = 1; ctx.stroke();
          }
          break;
        }

        case "schumann": {
          // Earth arc
          ctx.beginPath(); ctx.arc(cx, cy + 48, 52, Math.PI * 1.15, Math.PI * 1.85);
          ctx.strokeStyle = "rgba(80,180,80,0.55)"; ctx.lineWidth = 2.5; ctx.stroke();
          // Ionosphere
          ctx.beginPath(); ctx.arc(cx, cy + 48, 74, Math.PI * 1.2, Math.PI * 1.8);
          ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.28)`; ctx.lineWidth = 1.5; ctx.stroke();
          // Antenna mast
          const ag = ctx.createLinearGradient(cx - 3, cy - 6, cx + 3, cy - 34);
          ag.addColorStop(0, "rgba(80,90,110,0.9)"); ag.addColorStop(0.5, "rgba(200,210,230,0.85)"); ag.addColorStop(1, "rgba(60,70,90,0.7)");
          ctx.fillStyle = ag; ctx.fillRect(cx - 2.5, cy - 34, 5, 40);
          // Resonance rings
          for (let r2 = 1; r2 <= 4; r2++) {
            const rad = r2 * 10 + 4 * Math.sin(t * 2.2 + r2);
            ctx.beginPath(); ctx.arc(cx, cy - 5, rad, -Math.PI * 0.85, -Math.PI * 0.15);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.65 - r2 * 0.12})`; ctx.lineWidth = 1.5; ctx.stroke();
          }
          ctx.font = "bold 7px monospace"; ctx.fillStyle = `rgba(${hr},${hg},${hb},0.85)`;
          ctx.textAlign = "center"; ctx.fillText("7.83 Hz", cx, cy - 38);
          break;
        }

        case "krcic": {
          glassBox(cx - 44, cy - 22, 26, 44); glassBox(cx + 18, cy - 22, 26, 44);
          // Quartz tube
          ctx.strokeStyle = "rgba(180,190,255,0.55)"; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 18, cy - 5, 36, 10);
          // Photon travel
          for (let i = 0; i < 5; i++) {
            const p = ((t + i * 0.2) % 1);
            sphere(cx - 18 + p * 36, cy, 2.2, 180, 190, 255, 0.88 - p * 0.5);
          }
          // PMT head
          metalBox(cx - 7, cy - 42, 14, 12);
          ctx.font = "bold 6px monospace"; ctx.fillStyle = `rgba(${hr},${hg},${hb},0.8)`;
          ctx.textAlign = "center"; ctx.fillText("PMT", cx, cy - 32);
          glow(cx, cy - 36, 8, 0.4);
          break;
        }

        case "spectrometer": {
          metalBox(cx - 40, cy - 22, 80, 44);
          // Dark screen
          ctx.fillStyle = "rgba(3,5,10,0.97)"; ctx.fillRect(cx - 34, cy - 16, 58, 34);
          // Spectral peaks
          const peaks2 = [0.2, 0.44, 0.68, 0.88];
          for (let x = 0; x <= 56; x++) {
            const f = x / 56;
            let h2 = 2;
            peaks2.forEach(p => { h2 += 16 * Math.exp(-Math.pow((f - p) * 11, 2)) * Math.abs(Math.sin(t * 2.2 + p * 5)); });
            // Colour by frequency (UV to visible)
            const r2 = Math.round(150 * (1 - f) + hr * f), g2 = Math.round(hg * f), b2 = Math.round(255 * (1 - f) + hb * f);
            ctx.fillStyle = `rgba(${r2},${g2},${b2},0.9)`;
            ctx.fillRect(cx - 34 + x, cy + 16 - h2, 1.5, h2);
          }
          ctx.font = "bold 6px monospace"; ctx.fillStyle = `rgba(${hr},${hg},${hb},0.75)`;
          ctx.textAlign = "center"; ctx.fillText("200–400 nm", cx, cy - 8);
          break;
        }

        case "fluxgate": {
          // Outer coil ring
          ring(cx, cy, 32, 25);
          // Rotating rotor
          for (let p = 0; p < 4; p++) {
            const pa = t * 2 + (p * Math.PI) / 2;
            const lv = 0.45 + 0.55 * Math.abs(Math.sin(pa + Math.PI / 4));
            sphere(cx + 16 * Math.cos(pa), cy + 16 * Math.sin(pa), 6,
              p % 2 === 0 ? Math.round(hr*lv) : 60, p % 2 === 0 ? Math.round(hg*lv) : 60, p % 2 === 0 ? Math.round(hb*lv) : 200, lv);
          }
          // AB effect label
          ctx.font = "bold 7px monospace"; ctx.fillStyle = `rgba(${hr},${hg},${hb},0.88)`;
          ctx.textAlign = "center"; ctx.fillText("A-B", cx, cy + 3);
          glow(cx, cy, 20, 0.12);
          break;
        }

        case "helmholtz": {
          // 4 emitter coils
          for (let i = 0; i < 4; i++) {
            const ax = cx - 24 + i * 16;
            ring(ax, cy, 10, 7);
            const ph = t * 2.2 + i * 0.5, blen = 18 + 6 * Math.abs(Math.sin(ph));
            // Beam shaft
            const bg3 = ctx.createLinearGradient(ax, cy + 10, ax, cy + blen);
            bg3.addColorStop(0, `rgba(${hr},${hg},${hb},0.7)`); bg3.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
            ctx.fillStyle = bg3; ctx.fillRect(ax - 2, cy + 10, 4, blen - 10);
          }
          // Target tissue
          ctx.beginPath(); ctx.ellipse(cx, cy + 36, 28, 9, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hr},${hg},${hb},0.12)`; ctx.fill();
          ctx.strokeStyle = `rgba(${hr},${hg},${hb},0.5)`; ctx.lineWidth = 1.5; ctx.stroke();
          break;
        }

        case "lattice": {
          const spacing = 17;
          const nodes = [];
          const ang = t * 0.4;
          for (let gx = -2; gx <= 2; gx++) for (let gy = -2; gy <= 2; gy++) {
            const x3d = gx * spacing * Math.cos(ang);
            const z3d = gx * spacing * Math.sin(ang) * 0.3;
            const nx = cx + x3d, ny = cy + gy * spacing * 0.62 + z3d;
            const dist = Math.sqrt(gx * gx + gy * gy);
            const pulse = Math.sin(t * 2.2 - dist * 0.9);
            nodes.push({ nx, ny, z3d, pulse, gx, gy });
          }
          nodes.sort((a, b) => a.z3d - b.z3d);
          nodes.forEach(n => nodes.forEach(n2 => {
            if (Math.abs(n2.gx - n.gx) + Math.abs(n2.gy - n.gy) === 1) {
              ctx.beginPath(); ctx.moveTo(n.nx, n.ny); ctx.lineTo(n2.nx, n2.ny);
              ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.14 + n.pulse * 0.08})`; ctx.lineWidth = 0.8; ctx.stroke();
            }
          }));
          nodes.forEach(({ nx, ny, pulse }) => sphere(nx, ny, 3.5 + 1.5 * pulse, hr, hg, hb, 0.5 + pulse * 0.5));
          break;
        }

        default: {
          // Volumetric orb fallback
          const orbR = 24 + 4 * Math.sin(t * 1.8);
          sphere(cx, cy, orbR, hr, hg, hb, 0.92);
          for (let r2 = 1; r2 <= 3; r2++) {
            const rr = orbR + r2 * 10 + 2 * Math.sin(t * 2 + r2);
            ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${hr},${hg},${hb},${0.38 - r2 * 0.08})`; ctx.lineWidth = 1.5; ctx.stroke();
          }
          for (let p = 0; p < 3; p++) {
            const pa = t * 2 + (p * Math.PI * 2) / 3;
            sphere(cx + (orbR + 14) * Math.cos(pa), cy + (orbR + 14) * Math.sin(pa) * 0.4, 3.5, hr, hg, hb, 0.85);
          }
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [shape, color, size]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}

// ── Scroll strip ──────────────────────────────────────────────────────────────
const ALL_DEVICES = [...DEVICES, ...DEVICES];
const CARD_H = 190;

export default function DeviceSlideStrip({ reverse = false }) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const SPEED = 0.28;
    const setH = DEVICES.length * CARD_H;
    const step = () => {
      posRef.current += reverse ? -SPEED : SPEED;
      if (posRef.current >= setH) posRef.current -= setH;
      if (posRef.current < 0) posRef.current += setH;
      if (trackRef.current) trackRef.current.style.transform = `translateY(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [reverse]);

  return (
    <div className="hidden lg:block flex-shrink-0 overflow-hidden relative"
      style={{ width: 190, height: "100vh", position: "sticky", top: 0 }}>
      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom,#020617,transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top,#020617,transparent)" }} />

      <div ref={trackRef} style={{ willChange: "transform" }}>
        {ALL_DEVICES.map((device, i) => {
          const c = device.color;
          return (
            <div key={i} style={{
              marginBottom: 8, width: 178, marginLeft: 6, height: 182,
              border: `1px solid ${c}`, borderRadius: 9, flexShrink: 0,
              background: "linear-gradient(160deg,#030c1a 60%,#010812 100%)",
              boxShadow: `0 0 16px ${c}38, inset 0 0 20px ${c}06`,
              position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
            }}>
              {/* Neon top bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 2,
                background: `linear-gradient(90deg,transparent,${c},transparent)`,
                boxShadow: `0 0 10px ${c}`,
              }} />
              {/* Header */}
              <div style={{ padding: "5px 8px", display: "flex", alignItems: "center", gap: 5, borderBottom: `1px solid ${c}28`, flexShrink: 0, zIndex: 1 }}>
                <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.13em", color: "#000", background: c, padding: "1px 5px", borderRadius: 3, boxShadow: `0 0 7px ${c}`, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  3D
                </span>
                <span style={{ fontSize: 7.5, fontWeight: 700, color: c, textShadow: `0 0 7px ${c}99`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {device.tag}
                </span>
              </div>
              {/* 3D canvas */}
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2px 0" }}>
                <DeviceAnimation shape={device.shape} color={c} size={116} />
              </div>
              {/* Title */}
              <div style={{ padding: "4px 8px 5px", borderTop: `1px solid ${c}18`, flexShrink: 0 }}>
                <p style={{ color: c, fontSize: 9, fontWeight: 800, lineHeight: 1.25, textShadow: `0 0 7px ${c}80`, letterSpacing: "0.02em", margin: 0 }}>
                  {device.title}
                </p>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c}55,transparent)` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}