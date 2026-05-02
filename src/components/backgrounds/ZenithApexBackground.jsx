import { useEffect, useRef } from "react";

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

// Platonic solid vertices & edges
function tetrahedron() {
  const s = 1;
  const v = [
    [s, s, s], [-s, -s, s], [-s, s, -s], [s, -s, -s]
  ];
  const e = [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
  return { v, e };
}
function cube() {
  const s = 0.8;
  const v = [
    [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
    [-s,-s, s],[s,-s, s],[s,s, s],[-s,s, s]
  ];
  const e = [
    [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7]
  ];
  return { v, e };
}
function octahedron() {
  const s = 1;
  const v = [
    [s,0,0],[-s,0,0],[0,s,0],[0,-s,0],[0,0,s],[0,0,-s]
  ];
  const e = [
    [0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],
    [2,4],[2,5],[3,4],[3,5]
  ];
  return { v, e };
}
function icosahedron() {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [
    [-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],
    [0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],
    [t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]
  ].map(p => { const l = Math.sqrt(p[0]**2+p[1]**2+p[2]**2); return p.map(c=>c/l); });
  const e = [
    [0,11],[0,5],[0,1],[0,7],[0,10],
    [1,5],[1,9],[1,8],[1,7],
    [2,3],[2,4],[2,11],[2,6],[2,10],
    [3,4],[3,9],[3,8],[3,6],
    [4,5],[4,9],[4,11],
    [5,11],[6,7],[6,8],[6,10],
    [7,8],[8,9],[9,5],[10,11]
  ];
  return { v, e };
}
function dodecahedron() {
  const phi = (1 + Math.sqrt(5)) / 2;
  const inv = 1 / phi;
  const v = [
    [1,1,1],[1,1,-1],[1,-1,1],[1,-1,-1],
    [-1,1,1],[-1,1,-1],[-1,-1,1],[-1,-1,-1],
    [0,inv,phi],[0,inv,-phi],[0,-inv,phi],[0,-inv,-phi],
    [inv,phi,0],[inv,-phi,0],[-inv,phi,0],[-inv,-phi,0],
    [phi,0,inv],[phi,0,-inv],[-phi,0,inv],[-phi,0,-inv]
  ].map(p => { const l = Math.sqrt(p[0]**2+p[1]**2+p[2]**2); return p.map(c=>c/l); });
  const e = [
    [0,8],[0,12],[0,16],[1,9],[1,12],[1,17],[2,10],[2,13],[2,16],
    [3,11],[3,13],[3,17],[4,8],[4,14],[4,18],[5,9],[5,14],[5,19],
    [6,10],[6,15],[6,18],[7,11],[7,15],[7,19],[8,10],[9,11],
    [12,14],[13,15],[16,17],[18,19]
  ];
  return { v, e };
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

export default function ZenithApexBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

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

    // Stars
    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.2,
      tw: Math.random() * Math.PI * 2,
      s: Math.random() * 0.4 + 0.1,
    }));

    // Equations
    const equations = Array.from({ length: 35 }, (_, i) => ({
      text: EQUATIONS[i % EQUATIONS.length],
      x: Math.random(), y: Math.random(),
      speed: 0.00013 + Math.random() * 0.00015,
      alpha: 0.1 + Math.random() * 0.18,
      size: 10 + Math.floor(Math.random() * 7),
      drift: (Math.random() - 0.5) * 0.00015,
    }));

    const solids = [tetrahedron(), cube(), octahedron(), icosahedron(), dodecahedron()];
    const solidColors = [
      "rgba(80,200,255,", "rgba(180,100,255,", "rgba(80,255,160,",
      "rgba(255,180,60,", "rgba(255,80,160,"
    ];
    // Each solid orbits at different radius/speed/phase — bigger, lower orbit
    const solidOrbit = [
      { r: 0.34, speed: 0.4,  phase: 0,   scale: 58, tilt: 0.4, yOff: 0.18 },
      { r: 0.38, speed: 0.28, phase: 1.2, scale: 52, tilt: 0.8, yOff: 0.20 },
      { r: 0.30, speed: 0.55, phase: 2.4, scale: 56, tilt: 1.1, yOff: 0.16 },
      { r: 0.44, speed: 0.22, phase: 3.7, scale: 48, tilt: 0.6, yOff: 0.22 },
      { r: 0.40, speed: 0.33, phase: 5.0, scale: 46, tilt: 1.5, yOff: 0.19 },
    ];

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
        ctx.fillStyle = `rgba(200,220,255,${0.25 + tw * 0.55})`;
        ctx.fill();
      }

      // ── Grid ──
      ctx.save();
      ctx.strokeStyle = "rgba(80,140,255,0.07)";
      ctx.lineWidth = 0.6;
      for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.restore();

      // ── Scalar waves ──
      for (let i = 0; i < 14; i++) {
        const phase = (t * 0.38 + i / 14) % 1;
        const r = phase * Math.max(W, H) * 0.98;
        const alpha = (1 - phase) * 0.42;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80,160,255,${alpha})`; ctx.lineWidth = 2; ctx.stroke();
      }
      for (let i = 0; i < 8; i++) {
        const phase = (t * 0.22 + i / 8) % 1;
        const r = phase * Math.max(W, H) * 0.75;
        const alpha = (1 - phase) * 0.28;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,200,80,${alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
      }
      for (let i = 0; i < 5; i++) {
        const phase = (t * 0.5 + i / 5) % 1;
        const r = phase * Math.max(W, H) * 0.45;
        const alpha = (1 - phase) * 0.5;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120,210,255,${alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
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

      // ── Central Phi Ratio symbol ──
      {
        const phiX = cx;
        const phiY = cy + H * 0.04;
        const phiPulse = 0.7 + 0.3 * Math.sin(t * 1.1);
        ctx.save();
        ctx.globalAlpha = 0.72 * phiPulse;
        // Outer glow ring
        const phiGrad = ctx.createRadialGradient(phiX, phiY, 0, phiX, phiY, 90);
        phiGrad.addColorStop(0, "rgba(255,215,0,0.18)");
        phiGrad.addColorStop(0.5, "rgba(255,180,0,0.07)");
        phiGrad.addColorStop(1, "rgba(255,140,0,0)");
        ctx.beginPath(); ctx.arc(phiX, phiY, 90, 0, Math.PI * 2);
        ctx.fillStyle = phiGrad; ctx.fill();
        // Shadow/3D depth
        ctx.font = "bold 72px serif";
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("φ", phiX + 3, phiY + 4);
        ctx.fillStyle = "rgba(80,40,0,0.5)";
        ctx.fillText("φ", phiX + 1.5, phiY + 2);
        // Glowing gold phi
        ctx.shadowColor = "rgba(255,200,0,1)";
        ctx.shadowBlur = 28;
        ctx.fillStyle = "rgba(255,220,60,1)";
        ctx.fillText("φ", phiX, phiY);
        ctx.shadowBlur = 10;
        ctx.fillStyle = "rgba(255,255,180,0.9)";
        ctx.fillText("φ", phiX, phiY);
        // Subtitle
        ctx.shadowBlur = 0;
        ctx.font = "bold 13px monospace";
        ctx.globalAlpha = 0.55 * phiPulse;
        ctx.fillStyle = "rgba(255,210,80,1)";
        ctx.fillText("φ = (1+√5)/2 ≈ 1.618033...", phiX, phiY + 52);
        ctx.restore();
      }

      // ── Torus field ──
      const torusR = Math.min(W, H) * 0.14; // major radius
      const torusr = torusR * 0.42;          // minor radius
      const torusSeg = 48;
      const torusTube = 20;
      ctx.save();
      ctx.globalAlpha = 0.55;
      // Draw torus rings
      for (let i = 0; i < torusSeg; i++) {
        const phi = (Math.PI * 2 / torusSeg) * i + t * 0.5;
        const px = cx + Math.cos(phi) * torusR;
        const py = cy + Math.sin(phi) * torusR * 0.38; // flatten for perspective
        const rr = torusr * (0.7 + 0.3 * Math.sin(phi * 3 + t));
        // gradient ring
        const grad = ctx.createRadialGradient(px, py, 0, px, py, rr);
        grad.addColorStop(0, "rgba(80,200,255,0.0)");
        grad.addColorStop(0.5, "rgba(80,200,255,0.22)");
        grad.addColorStop(1, "rgba(160,80,255,0.0)");
        ctx.beginPath();
        ctx.arc(px, py, rr, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
      // Draw torus outline circles
      for (let tube = 0; tube < torusTube; tube++) {
        const theta = (Math.PI * 2 / torusTube) * tube + t * 0.3;
        const ox = cx + Math.cos(theta) * torusR;
        const oy = cy + Math.sin(theta) * torusR * 0.38;
        const rx2 = torusr * Math.abs(Math.cos(theta * 0.5 + t * 0.2)) + 2;
        const ry2 = torusr * 0.5;
        ctx.beginPath();
        ctx.ellipse(ox, oy, rx2, ry2, theta, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80,200,255,0.18)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      // Torus field lines (radial from center)
      for (let i = 0; i < 24; i++) {
        const a = (Math.PI * 2 / 24) * i + t * 0.15;
        const innerEnd = torusR * 0.3;
        const outerEnd = torusR * 1.7;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * innerEnd, cy + Math.sin(a) * innerEnd * 0.38);
        ctx.lineTo(cx + Math.cos(a) * outerEnd, cy + Math.sin(a) * outerEnd * 0.38);
        ctx.strokeStyle = `rgba(160,80,255,0.12)`;
        ctx.lineWidth = 1;
        ctx.stroke();
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

      // ── Platonic Solids orbiting (bigger, lower below sun) ──
      solids.forEach((solid, si) => {
        const orb = solidOrbit[si];
        const orbitR = Math.min(W, H) * orb.r;
        const angle = t * orb.speed + orb.phase;
        const sox = cx + Math.cos(angle) * orbitR;
        const soy = cy + H * orb.yOff + Math.sin(angle) * orbitR * 0.45;
        const spin = t * (0.7 + si * 0.15);
        const color = solidColors[si];

        const proj = solid.v.map(v => {
          let p = [...v];
          p = rotX(p, spin * 0.7 + orb.tilt);
          p = rotY(p, spin + si);
          p = rotZ(p, spin * 0.4);
          return project(p, sox, soy, 300, orb.scale);
        });

        ctx.save();
        ctx.globalAlpha = 0.88;
        solid.e.forEach(([a, b]) => {
          const pa = proj[a], pb = proj[b];
          const depth = Math.max(0, Math.min(1, (pa[2] + pb[2]) / 600));
          ctx.beginPath();
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pb[0], pb[1]);
          ctx.shadowColor = color + "1)";
          ctx.shadowBlur = 8;
          ctx.strokeStyle = `${color}${0.35 + depth * 0.65})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        });
        // Vertex dots
        proj.forEach(p => {
          ctx.beginPath();
          ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
          ctx.fillStyle = `${color}1)`;
          ctx.shadowColor = color + "1)";
          ctx.shadowBlur = 10;
          ctx.fill();
        });
        ctx.restore();
      });

      // ── Metatron's Cube (orbiting) ──
      {
        const metAngle = t * 0.18 + 1.0;
        const metOrbitR = Math.min(W, H) * 0.22;
        const metX = cx + Math.cos(metAngle) * metOrbitR;
        const metY = cy + Math.sin(metAngle) * metOrbitR * 0.5;
        const metScale = Math.min(W, H) * 0.055;
        const metRot = t * 0.22;

        ctx.save();
        ctx.globalAlpha = 0.55;

        // Draw edges
        metCube.edges.forEach(([a, b]) => {
          const pa = metCube.pts[a], pb = metCube.pts[b];
          const ax = metX + (pa[0] * Math.cos(metRot) - pa[1] * Math.sin(metRot)) * metScale;
          const ay = metY + (pa[0] * Math.sin(metRot) + pa[1] * Math.cos(metRot)) * metScale;
          const bx = metX + (pb[0] * Math.cos(metRot) - pb[1] * Math.sin(metRot)) * metScale;
          const by = metY + (pb[0] * Math.sin(metRot) + pb[1] * Math.cos(metRot)) * metScale;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = "rgba(255,180,255,0.22)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        });

        // Draw circles (Fruit of Life)
        metCube.pts.forEach(p => {
          const px = metX + (p[0] * Math.cos(metRot) - p[1] * Math.sin(metRot)) * metScale;
          const py = metY + (p[0] * Math.sin(metRot) + p[1] * Math.cos(metRot)) * metScale;
          const cr = metScale * 0.52;
          const grad = ctx.createRadialGradient(px, py, 0, px, py, cr);
          grad.addColorStop(0, "rgba(255,180,255,0.0)");
          grad.addColorStop(0.7, "rgba(255,120,255,0.10)");
          grad.addColorStop(1, "rgba(200,80,255,0.18)");
          ctx.beginPath();
          ctx.arc(px, py, cr, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,140,255,0.35)";
          ctx.lineWidth = 0.9;
          ctx.stroke();
          ctx.fillStyle = grad;
          ctx.fill();
        });

        // Label
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "rgba(255,180,255,0.5)";
        ctx.fillText("METATRON", metX - 24, metY + metScale * 2.3);
        ctx.restore();
      }

      // ── Globe watermark ──
      const globeR = Math.min(W, H) * 0.52;
      const globeX = cx;
      const globeY = cy + globeR * 1.1;

      ctx.save();
      ctx.globalAlpha = 0.11;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.clip();
      for (let i = 1; i < 9; i++) {
        const lat = -Math.PI / 2 + (Math.PI / 9) * i;
        const y = globeY + Math.sin(lat) * globeR;
        const rLat = Math.abs(Math.cos(lat) * globeR);
        ctx.beginPath();
        ctx.ellipse(globeX, y, rLat, rLat * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,1)"; ctx.lineWidth = 1.8; ctx.stroke();
      }
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 10) * i;
        ctx.save();
        ctx.translate(globeX, globeY);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, globeR * 0.22, globeR, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,1)"; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,1)"; ctx.lineWidth = 3; ctx.stroke();
      ctx.restore();

      // ── Sun ──
      const sunAngle = t * 1.2;
      const sunOrbitR = globeR * 0.22;
      const sunX = globeX + Math.sin(sunAngle) * sunOrbitR;
      const sunY = (globeY - globeR) + 12 + Math.cos(sunAngle) * sunOrbitR * 0.35;
      const sunRadius = 18;

      const corona = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 5);
      corona.addColorStop(0, "rgba(255,220,80,0.45)"); corona.addColorStop(0.3, "rgba(255,160,30,0.20)");
      corona.addColorStop(0.7, "rgba(255,100,0,0.07)"); corona.addColorStop(1, "rgba(255,60,0,0)");
      ctx.beginPath(); ctx.arc(sunX, sunY, sunRadius * 5, 0, Math.PI * 2); ctx.fillStyle = corona; ctx.fill();

      const midGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.2);
      midGlow.addColorStop(0, "rgba(255,240,160,0.75)"); midGlow.addColorStop(0.5, "rgba(255,180,40,0.40)");
      midGlow.addColorStop(1, "rgba(255,120,0,0)");
      ctx.beginPath(); ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2); ctx.fillStyle = midGlow; ctx.fill();

      const core = ctx.createRadialGradient(sunX - 3, sunY - 3, 1, sunX, sunY, sunRadius);
      core.addColorStop(0, "rgba(255,255,220,1)"); core.addColorStop(0.3, "rgba(255,230,80,1)");
      core.addColorStop(0.7, "rgba(255,160,20,1)"); core.addColorStop(1, "rgba(220,80,0,0.9)");
      ctx.beginPath(); ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2); ctx.fillStyle = core; ctx.fill();

      ctx.save(); ctx.translate(sunX, sunY); ctx.rotate(t * 1.8);
      for (let r = 0; r < 12; r++) {
        const ra = (Math.PI * 2 / 12) * r;
        const inn = sunRadius + 4, out = sunRadius + 18 + Math.sin(t * 3 + r) * 5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ra) * inn, Math.sin(ra) * inn);
        ctx.lineTo(Math.cos(ra) * out, Math.sin(ra) * out);
        ctx.strokeStyle = `rgba(255,210,60,0.55)`; ctx.lineWidth = 2.5; ctx.stroke();
      }
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