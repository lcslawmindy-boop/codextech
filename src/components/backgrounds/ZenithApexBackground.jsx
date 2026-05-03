import { useEffect, useRef } from "react";
import { useZenithTheme } from "@/lib/ZenithThemeContext";

const EQUATIONS = [
  "∇²Φ = 0", "E = -∇Φ - ∂A/∂t", "∇·B = 0", "∇×E = -∂B/∂t",
  "Ψ = Ae^(iωt)", "F = q(E + v×B)", "ρ = A·sin(kx - ωt)",
  "∮E·dA = Q/ε₀", "P = ε₀c(E×B)", "λ = h/mv",
  "∇²A - μ₀ε₀∂²A/∂t² = 0", "Φ = ∫B·dA", "ω = 2πf",
  "k = ω/c", "S = (1/μ₀)(E×B)", "∂²Φ/∂t² = c²∇²Φ",
  "U = ½ε₀E²", "∇×H = J + ∂D/∂t", "φ = (1+√5)/2",
  "r = a·e^(bθ)", "E = mc²", "iℏ∂Ψ/∂t = ĤΨ",
  // Quantum & wave mechanics
  "ΔxΔp ≥ ℏ/2", "[x̂,p̂] = iℏ", "E_n = -13.6/n² eV",
  "p = ℏk", "E = ℏω", "∇²ψ + (2m/ℏ²)(E-V)ψ = 0",
  "⟨A⟩ = ∫ψ*Âψ dτ", "c = λf", "n = c/v",
  // Tensor & relativity
  "G_μν = 8πG/c⁴ · T_μν", "ds² = -c²dt² + dx² + dy² + dz²",
  "F_μν = ∂_μA_ν - ∂_νA_μ", "T^μν_;ν = 0",
  "Γ^λ_μν = ½g^λσ(∂_μg_νσ + ∂_νg_μσ - ∂_σg_μν)",
  // Scalar / vacuum energy
  "ρ_vac = ℏc/l_P⁴", "L = ½(∂_μφ)² - V(φ)",
  "□φ = -dV/dφ", "T_μν = ∂_μφ∂_νφ - g_μνL",
  "S = ∫d⁴x√(-g)·R/16πG",
  // Sacred geometry & number theory
  "φ² = φ + 1", "F_n = F_{n-1} + F_{n-2}",
  "e^(iπ) + 1 = 0", "ζ(s) = Σ n^(-s)",
  "∇·(ε₀E) = ρ_free", "J_μ = (ρc, J)",
  // Thermodynamics & information
  "S = -k_B Σ p_i ln(p_i)", "dS ≥ δQ/T",
  "ΔG = ΔH - TΔS", "PV = nRT",
  // Additional EM
  "Z₀ = √(μ₀/ε₀) ≈ 377Ω", "B = μ₀(H + M)",
  "∇×B = μ₀J + μ₀ε₀∂E/∂t", "W = ½LI²",
  "V = -N·dΦ/dt", "τ = RC", "f_r = 1/(2π√LC)",
];

// --- 3D math helpers ---
function rotX(p, a) {
  const [x, y, z] = p;
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}
function rotY(p, a) {
  const [x, y, z] = p;
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}
function rotZ(p, a) {
  const [x, y, z] = p;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
}
function project(p, cx, cy, fov, scale) {
  const z = p[2] + fov;
  const f = fov / z;
  return [cx + p[0] * f * scale, cy + p[1] * f * scale, z];
}



// Metatron's Cube — Fruit of Life + connecting lines
function metatronsCube() {
  const pts = [];
  // Center
  pts.push([0, 0]);
  // Inner ring (6)
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push([Math.cos(a), Math.sin(a)]);
  }
  // Outer ring (6)
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push([Math.cos(a) * 1.73, Math.sin(a) * 1.73]);
  }
  // Far outer (6)
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    pts.push([Math.cos(a) * 2, Math.sin(a) * 2]);
  }
  // All connecting lines
  const edges = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 2.1) edges.push([i, j]);
    }
  }
  return { pts, edges };
}

const LOGO_URLS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/75d43b957_df887ac44_logo.png",
];

export default function ZenithApexBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const { currentTheme } = useZenithTheme();

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

    // Preload logos
    const logos = LOGO_URLS.map(src => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      return img;
    });

    // Stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.2,
      tw: Math.random() * Math.PI * 2,
      s: Math.random() * 0.4 + 0.1,
    }));

    // Equations (reduced count)
    const equations = Array.from({ length: 12 }, (_, i) => ({
      text: EQUATIONS[i % EQUATIONS.length],
      x: Math.random(), y: Math.random(),
      speed: 0.00013 + Math.random() * 0.00015,
      alpha: 0.1 + Math.random() * 0.18,
      size: 10 + Math.floor(Math.random() * 7),
      drift: (Math.random() - 0.5) * 0.00015,
    }));



    const metCube = metatronsCube();

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;



      // ── Stars ──
      for (const s of stars) {
        const tw = 0.5 + 0.5 * Math.sin(t * s.s * 6 + s.tw);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r * tw, 0, Math.PI * 2);
        const starColors = ["255,80,200", "80,220,255", "255,220,60", "180,80,255"];
        const sc = starColors[Math.floor(s.tw * starColors.length) % starColors.length];
        ctx.fillStyle = `rgba(${sc},${0.4 + tw * 0.6})`;
        ctx.shadowColor = `rgba(${sc},1)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Neon perspective grid (3D floor vanishing point) ──
      ctx.save();
      const horizon = cy * 0.55;
      const vp = { x: cx, y: horizon };
      // Vertical lines fanning from vanishing point
      for (let i = -18; i <= 18; i++) {
        const bx = cx + i * (W / 16);
        const alpha = 0.06 + 0.05 * Math.abs(Math.sin(t * 0.8 + i * 0.3));
        ctx.beginPath();
        ctx.moveTo(vp.x, vp.y);
        ctx.lineTo(bx, H);
        ctx.strokeStyle = `rgba(0,255,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.shadowColor = "rgba(0,255,255,0.8)";
        ctx.shadowBlur = 4;
        ctx.stroke();
      }
      // Horizontal recession lines
      for (let i = 0; i < 12; i++) {
        const frac = Math.pow(i / 12, 1.6);
        const y = horizon + (H - horizon) * frac;
        const pulse = 0.04 + 0.06 * Math.sin(t * 1.5 + i * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(0,255,255,${pulse})`;
        ctx.lineWidth = 0.7;
        ctx.shadowBlur = 3;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();

      // ── Neon shockwave rings ──
      for (let i = 0; i < 4; i++) {
        const phase = (t * 0.22 + i / 4) % 1;
        const r = phase * Math.max(W, H) * 0.9;
        const alpha = (1 - phase) * 0.45;
        const ringColors = ["255,0,200", "0,220,255", "255,80,0", "140,0,255"];
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${ringColors[i]},${alpha})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = `rgba(${ringColors[i]},1)`;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }



      // ── Floating equations (bright, 3D glowing) ──
      for (const eq of equations) {
        eq.y -= eq.speed; eq.x += eq.drift;
        if (eq.y < -0.05) { eq.y = 1.05; eq.x = Math.random(); }
        if (eq.x < -0.1) eq.x = 1.1;
        if (eq.x > 1.1) eq.x = -0.1;
        const pulse = 0.75 + 0.25 * Math.sin(t * 1.8 + eq.y * 12);
        const alpha = Math.min(1, (eq.alpha + 0.5) * pulse);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${eq.size + 3}px monospace`;
        // 3D depth effect: dark shadow offset, then bright fill
        ctx.fillStyle = "rgba(0,0,40,0.9)";
        ctx.fillText(eq.text, eq.x * W + 2, eq.y * H + 3);
        ctx.fillStyle = "rgba(0,20,80,0.7)";
        ctx.fillText(eq.text, eq.x * W + 1, eq.y * H + 1.5);
        // Glow layer
        ctx.shadowColor = "rgba(80,220,255,1)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "rgba(180,240,255,1)";
        ctx.fillText(eq.text, eq.x * W, eq.y * H);
        // Extra bright highlight pass
        ctx.shadowBlur = 4;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText(eq.text, eq.x * W, eq.y * H);
        ctx.restore();
      }

      // ── Central Phi Ratio symbol (smaller, orbiting around watermark) ──
      {
        const phiOrbitR = Math.min(W, H) * 0.08;
        const phiAngle = t * 0.8;
        const phiX = cx + Math.cos(phiAngle) * phiOrbitR;
        const phiY = cy + Math.sin(phiAngle) * phiOrbitR;
        const phiPulse = 0.7 + 0.3 * Math.sin(t * 1.1);
        ctx.save();
        ctx.globalAlpha = 0.7 * phiPulse;
        // Outer glow ring
        const phiGrad = ctx.createRadialGradient(phiX, phiY, 0, phiX, phiY, 80);
        phiGrad.addColorStop(0, "rgba(255,215,0,0.3)");
        phiGrad.addColorStop(0.5, "rgba(255,180,0,0.15)");
        phiGrad.addColorStop(1, "rgba(255,140,0,0)");
        ctx.beginPath(); ctx.arc(phiX, phiY, 80, 0, Math.PI * 2);
        ctx.fillStyle = phiGrad; ctx.fill();
        // Glowing gold phi
        ctx.font = "bold 90px serif";
        ctx.shadowColor = "rgba(255,200,0,1)";
        ctx.shadowBlur = 30;
        ctx.fillStyle = "rgba(255,220,60,1)";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("φ", phiX, phiY);
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(255,255,180,0.95)";
        ctx.fillText("φ", phiX, phiY);
        ctx.restore();
      }

      // ── Torus field vortex (smaller, in background) ──
      const torusR = Math.min(W, H) * 0.1;
      const torusr = torusR * 0.35;
      const torusSeg = 32;
      ctx.save();
      ctx.globalAlpha = 0.35;
      // Draw torus rings
      for (let i = 0; i < torusSeg; i++) {
        const phi = (Math.PI * 2 / torusSeg) * i + t * 0.5;
        const px = cx + Math.cos(phi) * torusR;
        const py = cy + Math.sin(phi) * torusR * 0.38;
        const rr = torusr * (0.6 + 0.2 * Math.sin(phi * 3 + t));
        const grad = ctx.createRadialGradient(px, py, 0, px, py, rr);
        grad.addColorStop(0, "rgba(80,200,255,0.0)");
        grad.addColorStop(0.5, "rgba(80,200,255,0.15)");
        grad.addColorStop(1, "rgba(160,80,255,0.0)");
        ctx.beginPath();
        ctx.arc(px, py, rr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      ctx.restore();

      // ── Toroidal donut (3D wireframe) ──
      {
        const R = torusR * 1.05;
        const r = torusr * 0.9;
        const segs = 32, tubeSegs = 16;
        const rx = t * 0.4, ry = t * 0.55;
        ctx.save();
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < segs; i++) {
          const phi1 = (Math.PI * 2 / segs) * i;
          const phi2 = (Math.PI * 2 / segs) * (i + 1);
          for (let j = 0; j < tubeSegs; j++) {
            const theta1 = (Math.PI * 2 / tubeSegs) * j;
            const theta2 = (Math.PI * 2 / tubeSegs) * (j + 1);
            // 4 corners of quad
            const pts3d = [
              [phi1, theta1], [phi2, theta1],
              [phi2, theta2], [phi1, theta2]
            ].map(([phi, theta]) => {
              const x = (R + r * Math.cos(theta)) * Math.cos(phi);
              const y = (R + r * Math.cos(theta)) * Math.sin(phi);
              const z = r * Math.sin(theta);
              let p = [x, y, z];
              p = rotX(p, rx * 0.6);
              p = rotY(p, ry);
              return p;
            });
            const pp = pts3d.map(p => project(p, cx, cy, 400, 1));
            // Only draw if facing camera
            const avg_z = pp.reduce((s, p) => s + p[2], 0) / 4;
            if (avg_z < 500) {
              ctx.beginPath();
              ctx.moveTo(pp[0][0], pp[0][1]);
              pp.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
              ctx.closePath();
              const brightness = Math.min(1, (500 - avg_z) / 300);
              ctx.strokeStyle = `rgba(80,200,255,${0.18 * brightness})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }





      // ── Metatron's Cube (floating at center) ──
       {
         const metX = cx;
         const metY = cy;
         const metScale = Math.min(W, H) * 0.035;
         const metRot = t * 0.25;
         const metRotX = t * 0.3;
         const metRotY = t * 0.2;

        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.translate(metX, metY);

        // 3D transformation for depth
        const cos_rx = Math.cos(metRotX), sin_rx = Math.sin(metRotX);
        const cos_ry = Math.cos(metRotY), sin_ry = Math.sin(metRotY);
        const cos_rz = Math.cos(metRot), sin_rz = Math.sin(metRot);

        // Draw ionosphere layers with 3D perspective
        for (let layer = 0; layer < 3; layer++) {
          const radius = metScale * (0.6 + layer * 0.35);
          const depth = 0.8 + layer * 0.25;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0,220,255,${(0.3 - layer * 0.1) * depth})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Draw edges with 3D depth
        metCube.edges.forEach(([a, b]) => {
          const pa = metCube.pts[a], pb = metCube.pts[b];
          // 3D rotation applied
          const ax = (pa[0] * cos_rz - pa[1] * sin_rz) * metScale;
          const ay = (pa[0] * sin_rz + pa[1] * cos_rz) * metScale * 0.7;
          const bx = (pb[0] * cos_rz - pb[1] * sin_rz) * metScale;
          const by = (pb[0] * sin_rz + pb[1] * cos_rz) * metScale * 0.7;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = "rgba(255,100,200,0.5)";
          ctx.lineWidth = 0.9;
          ctx.shadowColor = "rgba(255,150,200,0.8)";
          ctx.shadowBlur = 6;
          ctx.stroke();
        });

        // Draw circles (Flower of Life) with color cycling
        metCube.pts.forEach((p, idx) => {
          const px = (p[0] * cos_rz - p[1] * sin_rz) * metScale;
          const py = (p[0] * sin_rz + p[1] * cos_rz) * metScale * 0.7;
          const cr = metScale * 0.35;
          const depthFactor = 0.6 + 0.4 * Math.cos(idx * Math.PI / metCube.pts.length);
          // Color cycling based on index and time
          const hueShift = (idx / metCube.pts.length + t * 0.3) % 1;
          const colorValue = Math.sin(hueShift * Math.PI * 2);
          const r = Math.round(200 + colorValue * 55);
          const g = Math.round(100 + colorValue * 120);
          const b = Math.round(150 + colorValue * 100);
          const grad = ctx.createRadialGradient(px, py, 0, px, py, cr);
          grad.addColorStop(0, `rgba(${r},${g},${b},${0.2 * depthFactor})`);
          grad.addColorStop(0.6, `rgba(${r},${g},${b},${0.1 * depthFactor})`);
          grad.addColorStop(1, "rgba(255,80,200,0)");
          ctx.beginPath();
          ctx.arc(px, py, cr, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.75 * depthFactor})`;
          ctx.lineWidth = 1.2;
          ctx.shadowColor = `rgba(${r},${g},${b},0.95)`;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.fillStyle = grad;
          ctx.fill();
        });

        ctx.restore();
      }

      // ── Neon 3D wireframe shapes scattered across screen ──
      const neonShapes = [
        { x: W * 0.12, y: H * 0.25, type: "cube",    scale: 55, color: "255,0,200",   speed: 0.38, phase: 0 },
        { x: W * 0.85, y: H * 0.20, type: "pyramid", scale: 50, color: "0,220,255",   speed: 0.28, phase: 1.2 },
        { x: W * 0.75, y: H * 0.72, type: "cube",    scale: 42, color: "255,80,0",    speed: 0.45, phase: 2.4 },
        { x: W * 0.18, y: H * 0.70, type: "pyramid", scale: 48, color: "140,0,255",   speed: 0.32, phase: 3.6 },
        { x: W * 0.50, y: H * 0.15, type: "cube",    scale: 36, color: "255,220,0",   speed: 0.52, phase: 0.8 },
        { x: W * 0.92, y: H * 0.55, type: "pyramid", scale: 44, color: "0,255,120",   speed: 0.41, phase: 4.1 },
        { x: W * 0.05, y: H * 0.50, type: "cube",    scale: 40, color: "255,60,120",  speed: 0.35, phase: 5.0 },
      ];

      neonShapes.forEach(sh => {
        const spin = t * sh.speed + sh.phase;
        const tiltX = t * sh.speed * 0.6 + sh.phase;
        const tiltZ = t * sh.speed * 0.4;
        const shX = sh.x + Math.sin(t * 0.3 + sh.phase) * 18;
        const shY = sh.y + Math.cos(t * 0.25 + sh.phase) * 12;

        let verts, edges;
        if (sh.type === "cube") {
          const s = 1;
          verts = [[-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],[-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s]];
          edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        } else {
          // Pyramid
          const b = 1, h = 1.5;
          verts = [[-b,b,-b],[b,b,-b],[b,b,b],[-b,b,b],[0,-h,0]];
          edges = [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]];
        }

        const proj = verts.map(v => {
          let p = [...v];
          p = rotX(p, tiltX);
          p = rotY(p, spin);
          p = rotZ(p, tiltZ);
          return project(p, shX, shY, 280, sh.scale);
        });

        ctx.save();
        ctx.globalAlpha = 0.9;
        edges.forEach(([a, b]) => {
          const pa = proj[a], pb = proj[b];
          const depth = Math.max(0, Math.min(1, (pa[2] + pb[2]) / 560));
          ctx.beginPath();
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pb[0], pb[1]);
          ctx.strokeStyle = `rgba(${sh.color},${0.55 + depth * 0.45})`;
          ctx.lineWidth = 2.2;
          ctx.shadowColor = `rgba(${sh.color},1)`;
          ctx.shadowBlur = 20;
          ctx.stroke();
        });
        // Glowing vertex dots
        proj.forEach(p => {
          ctx.beginPath();
          ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sh.color},1)`;
          ctx.shadowColor = `rgba(${sh.color},1)`;
          ctx.shadowBlur = 16;
          ctx.fill();
        });
        ctx.restore();
      });

      // ── Neon lightning bolts (standalone, full screen) ──
      {
        const numBolts = 5;
        for (let b = 0; b < numBolts; b++) {
          const bPhase = (t * 0.7 + b / numBolts) % 1;
          if (bPhase > 0.12) continue;
          const bAlpha = (0.12 - bPhase) / 0.12;
          const boltColors = ["255,0,200","0,220,255","255,80,0","140,0,255","255,220,0"];
          const lx0 = W * (0.1 + (b / numBolts) * 0.8);
          const ly0 = 0;
          const ly1 = H;
          ctx.save();
          ctx.globalAlpha = bAlpha * 0.8;
          ctx.lineWidth = 1.5 + bAlpha * 2.5;
          ctx.shadowColor = `rgba(${boltColors[b]},1)`;
          ctx.shadowBlur = 22;
          ctx.strokeStyle = `rgba(${boltColors[b]},1)`;
          ctx.beginPath();
          ctx.moveTo(lx0, ly0);
          for (let s = 1; s <= 16; s++) {
            const lx = lx0 + (s % 2 === 0 ? 1 : -1) * (6 + Math.sin(t * 20 + b * 4 + s) * 14);
            const ly = ly0 + (ly1 - ly0) * (s / 16);
            ctx.lineTo(lx, ly);
          }
          ctx.stroke();
          ctx.restore();
        }
      }
      
      // ── 3D Rotating neon XYZ laser axis (from center) ──
      ctx.save();
      const axisRot = t * 0.5;
      const axisRotX = t * 0.3;
      const axisLen = Math.min(W, H) * 0.3;
      const axisDefs = [
        { end: [axisLen * Math.cos(axisRot), axisLen * Math.sin(axisRot) * 0.5], color: "255,0,200" },
        { end: [axisLen * Math.sin(axisRot) * 0.5, axisLen * Math.cos(axisRot)], color: "0,220,255" },
        { end: [axisLen * Math.sin(axisRotX) * 0.6, axisLen * Math.cos(axisRotX) * 0.6], color: "255,160,0" },
      ];
      axisDefs.forEach(ax => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + ax.end[0], cy + ax.end[1]);
        ctx.strokeStyle = `rgba(${ax.color},0.95)`;
        ctx.lineWidth = 3;
        ctx.shadowColor = `rgba(${ax.color},1)`;
        ctx.shadowBlur = 22;
        ctx.stroke();
      });
      // Center pulse dot
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.shadowColor = "rgba(255,255,255,1)";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.restore();







      t += 0.007;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
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