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
function starTetrahedron() {
  // Stella octangula - compound of two tetrahedra
  const s = 1;
  const tet1 = [[s,s,s], [-s,-s,s], [-s,s,-s], [s,-s,-s]];
  const tet2 = [[-s,-s,-s], [s,s,-s], [s,-s,s], [-s,s,s]];
  const v = [...tet1, ...tet2].map(p => { const l = Math.sqrt(p[0]**2+p[1]**2+p[2]**2); return p.map(c=>c/l); });
  const e = [
    [0,1],[0,2],[0,3],[1,2],[1,3],[2,3],
    [4,5],[4,6],[4,7],[5,6],[5,7],[6,7],
    [0,4],[1,5],[2,6],[3,7]
  ];
  return { v, e };
}
function stellatedStarTetrahedron() {
  // Star tetrahedron with extended points
  const s = 1.2;
  const inner = [[s,s,s], [-s,-s,s], [-s,s,-s], [s,-s,-s]];
  const outer = [[s,s,s], [-s,-s,s], [-s,s,-s], [s,-s,-s]].map(p => {
    const l = Math.sqrt(p[0]**2+p[1]**2+p[2]**2);
    const scale = 1.8 / (l || 1);
    return [p[0]*scale, p[1]*scale, p[2]*scale];
  });
  const v = [...inner, ...outer].map(p => { const l = Math.sqrt(p[0]**2+p[1]**2+p[2]**2); return p.map(c=>c/l); });
  const e = [
    [0,1],[0,2],[0,3],[1,2],[1,3],[2,3],
    [4,5],[4,6],[4,7],[5,6],[5,7],[6,7],
    [0,4],[1,5],[2,6],[3,7],
    [0,5],[0,6],[1,4],[1,7],[2,4],[2,7],[3,5],[3,6]
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

const LOGO_URLS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/75d43b957_df887ac44_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a1d75a1f1_839284090_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc82e79c5_3fd362d3e_logo.png",
];

const MASHUP_LOGO_URLS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6842fcff1_13427a463_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cc5b59fa1_df887ac44_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2d630477b_839284090_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4764eaaef_7e20287f0_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b08ccb770_550172ad7_logo.png",
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

    // Preload mashup logos
    const mashupLogos = MASHUP_LOGO_URLS.map(src => {
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

    // Equations
    const equations = Array.from({ length: 35 }, (_, i) => ({
      text: EQUATIONS[i % EQUATIONS.length],
      x: Math.random(), y: Math.random(),
      speed: 0.00013 + Math.random() * 0.00015,
      alpha: 0.1 + Math.random() * 0.18,
      size: 10 + Math.floor(Math.random() * 7),
      drift: (Math.random() - 0.5) * 0.00015,
    }));

    const solids = [tetrahedron(), cube(), octahedron(), icosahedron(), dodecahedron(), starTetrahedron(), stellatedStarTetrahedron()];
    const solidColors = [
      "rgba(80,200,255,", "rgba(180,100,255,", "rgba(80,255,160,",
      "rgba(255,180,60,", "rgba(255,80,160,", "rgba(100,255,200,", "rgba(255,150,100,"
    ];
    // Each solid orbits at different radius/speed/phase — further out, pushed lower
    const solidOrbit = [
      { r: 0.52, speed: 0.4,  phase: 0,   scale: 58, tilt: 0.4, yOff: 0.32 },
      { r: 0.56, speed: 0.28, phase: 1.2, scale: 52, tilt: 0.8, yOff: 0.35 },
      { r: 0.48, speed: 0.55, phase: 2.4, scale: 56, tilt: 1.1, yOff: 0.30 },
      { r: 0.62, speed: 0.22, phase: 3.7, scale: 48, tilt: 0.6, yOff: 0.38 },
      { r: 0.58, speed: 0.33, phase: 5.0, scale: 46, tilt: 1.5, yOff: 0.34 },
      { r: 0.54, speed: 0.45, phase: 1.8, scale: 50, tilt: 1.2, yOff: 0.33 },
      { r: 0.60, speed: 0.25, phase: 4.2, scale: 44, tilt: 0.9, yOff: 0.36 },
    ];

    const metCube = metatronsCube();

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H / 2;

      // Get interactive controls if available
      const controls = window.__zenithControls || { sunSpeedMultiplier: 1, orbitSkew: 0 };
      const speedMult = controls.sunSpeedMultiplier || 1;
      const skewAngle = controls.orbitSkew || 0;

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

      // ── Quantum waves (spiral interference patterns) ──
      for (let q = 0; q < 3; q++) {
        ctx.save();
        ctx.globalAlpha = 0.15 + 0.1 * Math.sin(t * 0.8 + q);
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 12) {
          const spiralPhase = t * 0.6 + q * Math.PI * 2 / 3 + angle * 0.5;
          const samples = 180;
          ctx.beginPath();
          for (let s = 0; s < samples; s++) {
            const progress = s / samples;
            const r = progress * Math.max(W, H) * 0.8;
            const twist = angle + spiralPhase * progress;
            const qx = cx + Math.cos(twist) * r;
            const qy = cy + Math.sin(twist) * r;
            if (s === 0) ctx.moveTo(qx, qy);
            else ctx.lineTo(qx, qy);
          }
          const hue = (120 + q * 60 + angle * 30) % 360;
          ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.3)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Quantum probability waves (radial ripples) ──
      for (let qw = 0; qw < 4; qw++) {
        const qwPhase = (t * 0.7 + qw * Math.PI / 2) % Math.PI * 2;
        const qwR = Math.sin(qwPhase) * Math.max(W, H) * 0.35;
        if (qwR > 0) {
          ctx.save();
          ctx.globalAlpha = 0.12 * Math.cos(qwPhase * 2);
          for (let qwRings = 0; qwRings < 8; qwRings++) {
            const ringR = qwR + qwRings * 12;
            ctx.beginPath();
            ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100,200,255,0.4)`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          ctx.restore();
        }
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

      // ── Central Phi Ratio symbol — centered at 75% down the page ──
      {
        const phiX = cx;
        const phiY = H * 0.75;
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

      // ── Draw Platonic Solids orbital paths (thin glowing rings) ──
      solids.forEach((solid, si) => {
        const orb = solidOrbit[si];
        const orbitR = Math.min(W, H) * orb.r;
        ctx.save();
        ctx.globalAlpha = 0.15 + 0.08 * Math.sin(t * 0.6 + si);
        ctx.translate(cx, cy + H * orb.yOff);
        ctx.beginPath();
        ctx.ellipse(0, 0, orbitR, orbitR * 0.45, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(80,200,255,0.35)`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      });

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

      // ── Orbiting mashup logos (rotating through 5 logos) ──
      mashupLogos.forEach((img, li) => {
        if (!img.complete || img.naturalWidth === 0) return;
        
        const logoOrbitR = Math.min(W, H) * 0.35;
        const logoAngle = t * 0.15 + (Math.PI * 2 / 5) * li;
        const logoX = cx + Math.cos(logoAngle) * logoOrbitR;
        const logoY = cy + H * 0.65 + Math.sin(logoAngle) * logoOrbitR * 0.5;
        const logoSize = Math.min(W, H) * 0.08;
        
        const pulse = 0.8 + 0.2 * Math.sin(t * 1.5 + li);
        ctx.save();
        ctx.globalAlpha = 0.75 * pulse;
        ctx.translate(logoX, logoY);
        ctx.rotate(t * 0.3);
        ctx.shadowColor = "rgba(0, 220, 255, 0.8)";
        ctx.shadowBlur = 16;
        ctx.drawImage(img, -logoSize / 2, -logoSize / 2, logoSize, logoSize);
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

      // ── Neon Circuit Board Sphere with Lightning ──
      const globeR = Math.min(W, H) * 0.42;
      const globeX = cx;
      const globeY = H * 0.82;

      ctx.save();
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.clip();

      // Circuit board grid lines — neon cyan
      const gridStep = 38;
      ctx.lineWidth = 0.7;
      for (let gx = globeX - globeR; gx < globeX + globeR; gx += gridStep) {
        const pulse = 0.12 + 0.08 * Math.sin(t * 2.2 + gx * 0.04);
        ctx.strokeStyle = `rgba(0,255,220,${pulse})`;
        ctx.beginPath(); ctx.moveTo(gx, globeY - globeR); ctx.lineTo(gx, globeY + globeR); ctx.stroke();
      }
      for (let gy = globeY - globeR; gy < globeY + globeR; gy += gridStep) {
        const pulse = 0.12 + 0.08 * Math.sin(t * 1.8 + gy * 0.04);
        ctx.strokeStyle = `rgba(0,255,220,${pulse})`;
        ctx.beginPath(); ctx.moveTo(globeX - globeR, gy); ctx.lineTo(globeX + globeR, gy); ctx.stroke();
      }

      // Circuit nodes at intersections
      for (let gx = globeX - globeR + gridStep; gx < globeX + globeR; gx += gridStep) {
        for (let gy = globeY - globeR + gridStep; gy < globeY + globeR; gy += gridStep) {
          const dx = gx - globeX, dy = gy - globeY;
          if (dx*dx + dy*dy > globeR*globeR) continue;
          if (Math.random() < 0.97) continue; // sparse nodes each frame
          ctx.beginPath();
          ctx.arc(gx, gy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,255,200,0.9)";
          ctx.shadowColor = "rgba(0,255,200,1)";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Lightning bolt pulses along grid lines
      const numBolts = 5;
      for (let b = 0; b < numBolts; b++) {
        const bPhase = (t * 0.9 + b / numBolts) % 1;
        if (bPhase > 0.18) continue; // only flash briefly
        const bAlpha = (0.18 - bPhase) / 0.18;
        // pick a random-ish horizontal line inside globe
        const lineY = globeY - globeR * 0.7 + (b / numBolts) * globeR * 1.4;
        const lineX0 = globeX - globeR * 0.8;
        const lineX1 = globeX + globeR * 0.8;
        ctx.save();
        ctx.globalAlpha = bAlpha * 0.85;
        ctx.lineWidth = 1.5 + bAlpha * 2;
        ctx.shadowColor = "rgba(80,220,255,1)";
        ctx.shadowBlur = 18;
        ctx.strokeStyle = "rgba(160,240,255,1)";
        ctx.beginPath();
        ctx.moveTo(lineX0, lineY);
        // jagged lightning path
        const segs = 14;
        for (let s = 1; s <= segs; s++) {
          const lx = lineX0 + (lineX1 - lineX0) * (s / segs);
          const jag = (s % 2 === 0 ? 1 : -1) * (4 + Math.sin(t * 20 + b * 3 + s) * 8);
          ctx.lineTo(lx, lineY + jag);
        }
        ctx.stroke();
        // vertical branch
        const branchX = lineX0 + (lineX1 - lineX0) * (0.3 + (b % 3) * 0.2);
        ctx.beginPath();
        ctx.moveTo(branchX, lineY);
        ctx.lineTo(branchX + 12, lineY + 22);
        ctx.lineTo(branchX + 6, lineY + 38);
        ctx.strokeStyle = "rgba(200,255,255,0.8)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }

      // Vertical lightning bolts
      for (let b = 0; b < numBolts; b++) {
        const bPhase = (t * 0.7 + (b + 0.5) / numBolts) % 1;
        if (bPhase > 0.15) continue;
        const bAlpha = (0.15 - bPhase) / 0.15;
        const lineX = globeX - globeR * 0.6 + (b / numBolts) * globeR * 1.2;
        const lineY0 = globeY - globeR * 0.75;
        const lineY1 = globeY + globeR * 0.75;
        ctx.save();
        ctx.globalAlpha = bAlpha * 0.7;
        ctx.lineWidth = 1.2 + bAlpha * 1.5;
        ctx.shadowColor = "rgba(120,80,255,1)";
        ctx.shadowBlur = 14;
        ctx.strokeStyle = "rgba(180,120,255,1)";
        ctx.beginPath();
        ctx.moveTo(lineX, lineY0);
        const segs2 = 12;
        for (let s = 1; s <= segs2; s++) {
          const ly = lineY0 + (lineY1 - lineY0) * (s / segs2);
          const jag = (s % 2 === 0 ? 1 : -1) * (3 + Math.sin(t * 15 + b * 5 + s) * 6);
          ctx.lineTo(lineX + jag, ly);
        }
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      // Neon sphere outline
      ctx.save();
      ctx.globalAlpha = 0.35 + 0.1 * Math.sin(t * 1.5);
      ctx.beginPath();
      ctx.arc(globeX, globeY, globeR, 0, Math.PI * 2);
      ctx.shadowColor = "rgba(0,255,200,1)";
      ctx.shadowBlur = 20;
      ctx.strokeStyle = "rgba(0,255,200,0.7)";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // ── Dual Sun orbit parameters (with interactive controls) ──
      const sunAngle = t * 1.2 * speedMult + skewAngle;
      const sunOrbitRx = globeR * 0.52;
      const sunOrbitRy = globeR * 0.18;
      const sunOrbitCX = globeX + Math.cos(skewAngle) * 15;
      const sunOrbitCY = (globeY - globeR) + 38 + Math.sin(skewAngle) * 12;
      
      // Sun 1 (bright primary)
      const sunX1 = sunOrbitCX + Math.cos(sunAngle) * sunOrbitRx;
      const sunY1 = sunOrbitCY + Math.sin(sunAngle) * sunOrbitRy;
      const sunRadius1 = 36;
      
      // Sun 2 (dim secondary, opposite side)
      const sunX2 = sunOrbitCX + Math.cos(sunAngle + Math.PI) * sunOrbitRx;
      const sunY2 = sunOrbitCY + Math.sin(sunAngle + Math.PI) * sunOrbitRy;
      const sunRadius2 = 24;

      // ── Green laser axis (permanent, all scenes) ──
      ctx.save();
      // Permanent vertical axis line
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, H);
      ctx.strokeStyle = "rgba(0,255,120,0.22)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(0,255,120,0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      // Permanent horizontal axis line
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(W, cy);
      ctx.strokeStyle = "rgba(0,255,120,0.22)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(0,255,120,0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      // Center crosshair
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,120,0.45)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();

      // ── Green laser orbit ring (theme-dependent, around sun) ──
      ctx.save();
      // Outer glow of the orbit ellipse (green laser)
      for (let pass = 0; pass < 3; pass++) {
        const lw = [6, 3, 1.2][pass];
        const alpha = [0.18, 0.38, 0.75][pass];
        ctx.beginPath();
        ctx.ellipse(sunOrbitCX, sunOrbitCY, sunOrbitRx, sunOrbitRy, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,80,${alpha})`;
        ctx.lineWidth = lw;
        ctx.shadowColor = "rgba(0,255,80,1)";
        ctx.shadowBlur = [22, 14, 6][pass];
        ctx.stroke();
      }
      // Bright laser dashes travelling along the orbit
      for (let d = 0; d < 4; d++) {
        const dAngle = sunAngle + (Math.PI * 2 / 4) * d;
        const dashLen = 0.18;
        ctx.beginPath();
        for (let step = 0; step <= 12; step++) {
          const a = dAngle + dashLen * (step / 12);
          const dx = sunOrbitCX + Math.cos(a) * sunOrbitRx;
          const dy = sunOrbitCY + Math.sin(a) * sunOrbitRy;
          step === 0 ? ctx.moveTo(dx, dy) : ctx.lineTo(dx, dy);
        }
        ctx.strokeStyle = "rgba(120,255,120,0.95)";
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(0,255,60,1)";
        ctx.shadowBlur = 18;
        ctx.stroke();
      }
      ctx.restore();

      // ── Smoky ring around sun orbit ──
      ctx.save();
      // Draw a thick, layered smoke/dust torus along the orbit path
      const smokeSamples = 120;
      for (let s = 0; s < smokeSamples; s++) {
        const a = (Math.PI * 2 / smokeSamples) * s;
        const sx = sunOrbitCX + Math.cos(a) * sunOrbitRx;
        const sy = sunOrbitCY + Math.sin(a) * sunOrbitRy;
        const smokeR = 18 + 10 * Math.sin(a * 5 + t * 0.8);
        const smokeAlpha = 0.04 + 0.03 * Math.sin(a * 3 + t * 1.2);
        const smGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, smokeR);
        smGrad.addColorStop(0, `rgba(255,180,60,${smokeAlpha * 2.5})`);
        smGrad.addColorStop(0.4, `rgba(255,120,20,${smokeAlpha})`);
        smGrad.addColorStop(1, "rgba(80,20,0,0)");
        ctx.beginPath();
        ctx.arc(sx, sy, smokeR, 0, Math.PI * 2);
        ctx.fillStyle = smGrad;
        ctx.fill();
      }
      // Extra outer smoke haze
      for (let s = 0; s < 60; s++) {
        const a = (Math.PI * 2 / 60) * s + t * 0.05;
        const sx = sunOrbitCX + Math.cos(a) * sunOrbitRx;
        const sy = sunOrbitCY + Math.sin(a) * sunOrbitRy;
        const smokeR = 30 + 14 * Math.sin(a * 7 + t * 0.5);
        const smGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, smokeR);
        smGrad.addColorStop(0, "rgba(255,140,30,0.06)");
        smGrad.addColorStop(1, "rgba(80,10,0,0)");
        ctx.beginPath();
        ctx.arc(sx, sy, smokeR, 0, Math.PI * 2);
        ctx.fillStyle = smGrad;
        ctx.fill();
      }
      ctx.restore();

      // ── Primary Sun (bright) ──
      const corona1 = ctx.createRadialGradient(sunX1, sunY1, 0, sunX1, sunY1, sunRadius1 * 7);
      corona1.addColorStop(0, currentTheme.sunColor1Primary + "0.55)");
      corona1.addColorStop(0.2, currentTheme.sunColor1Primary + "0.30)");
      corona1.addColorStop(0.5, currentTheme.sunColor1Mid + "0.12)");
      corona1.addColorStop(0.8, currentTheme.sunColor1Mid + "0.04)");
      corona1.addColorStop(1, currentTheme.sunColor1Mid + "0)");
      ctx.beginPath(); ctx.arc(sunX1, sunY1, sunRadius1 * 7, 0, Math.PI * 2); ctx.fillStyle = corona1; ctx.fill();

      const midGlow1 = ctx.createRadialGradient(sunX1, sunY1, 0, sunX1, sunY1, sunRadius1 * 3);
      midGlow1.addColorStop(0, currentTheme.sunColor1Primary + "0.85)");
      midGlow1.addColorStop(0.4, currentTheme.sunColor1Mid + "0.55)");
      midGlow1.addColorStop(1, currentTheme.sunColor1Mid + "0)");
      ctx.beginPath(); ctx.arc(sunX1, sunY1, sunRadius1 * 3, 0, Math.PI * 2); ctx.fillStyle = midGlow1; ctx.fill();

      const core1 = ctx.createRadialGradient(sunX1 - 6, sunY1 - 6, 2, sunX1, sunY1, sunRadius1);
      core1.addColorStop(0, currentTheme.sunColor1Primary + "1)");
      core1.addColorStop(0.3, currentTheme.sunColor1Primary + "0.9)");
      core1.addColorStop(0.7, currentTheme.sunColor1Mid + "0.8)");
      core1.addColorStop(1, currentTheme.sunColor1Mid + "0.95)");
      ctx.beginPath(); ctx.arc(sunX1, sunY1, sunRadius1, 0, Math.PI * 2); ctx.fillStyle = core1; ctx.fill();

      ctx.save(); ctx.translate(sunX1, sunY1); ctx.rotate(t * 1.8);
      for (let r = 0; r < 16; r++) {
        const ra = (Math.PI * 2 / 16) * r;
        const inn = sunRadius1 + 5;
        const out = sunRadius1 + 30 + Math.sin(t * 3 + r) * 10;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ra) * inn, Math.sin(ra) * inn);
        ctx.lineTo(Math.cos(ra) * out, Math.sin(ra) * out);
        ctx.strokeStyle = `rgba(255,220,60,0.7)`;
        ctx.lineWidth = 3;
        ctx.shadowColor = "rgba(255,200,0,1)";
        ctx.shadowBlur = 10;
        ctx.stroke();
      }
      ctx.restore();

      // ── Secondary Sun (dim) ──
      const corona2 = ctx.createRadialGradient(sunX2, sunY2, 0, sunX2, sunY2, sunRadius2 * 6);
      corona2.addColorStop(0, currentTheme.sunColor2Primary + "0.3)");
      corona2.addColorStop(0.5, currentTheme.sunColor2Primary + "0.08)");
      corona2.addColorStop(1, currentTheme.sunColor2Primary + "0)");
      ctx.beginPath(); ctx.arc(sunX2, sunY2, sunRadius2 * 6, 0, Math.PI * 2); ctx.fillStyle = corona2; ctx.fill();

      const core2 = ctx.createRadialGradient(sunX2 - 4, sunY2 - 4, 1, sunX2, sunY2, sunRadius2);
      core2.addColorStop(0, currentTheme.sunColor2Primary + "0.8)");
      core2.addColorStop(0.5, currentTheme.sunColor2Primary + "0.6)");
      core2.addColorStop(1, currentTheme.sunColor2Primary + "0.4)");
      ctx.beginPath(); ctx.arc(sunX2, sunY2, sunRadius2, 0, Math.PI * 2); ctx.fillStyle = core2; ctx.fill();

      // ── Logo signature — bottom-left corner, ultra-bright neon ──
      if (logos[0]?.complete && logos[0].naturalWidth > 0) {
        const logoSize = Math.min(W, H) * 0.11;
        const lx = 16;
        const ly = H - logoSize - 48;
        const pulse = 0.88 + 0.12 * Math.sin(t * 1.1);
        ctx.save();
        // Dark backing plate for contrast
        ctx.fillStyle = "rgba(0,5,20,0.82)";
        ctx.beginPath();
        ctx.roundRect(lx - 8, ly - 8, logoSize + 16, logoSize + 36, 10);
        ctx.fill();
        // Neon border
        ctx.strokeStyle = `rgba(0,230,255,${0.7 * pulse})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "rgba(0,220,255,1)";
        ctx.shadowBlur = 18;
        ctx.stroke();
        // Big outer glow halo
        const halo = ctx.createRadialGradient(lx + logoSize/2, ly + logoSize/2, 0, lx + logoSize/2, ly + logoSize/2, logoSize * 1.1);
        halo.addColorStop(0, `rgba(0,200,255,${0.35 * pulse})`);
        halo.addColorStop(0.5, `rgba(0,140,255,${0.12 * pulse})`);
        halo.addColorStop(1, "rgba(0,80,200,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(lx + logoSize/2, ly + logoSize/2, logoSize * 1.1, 0, Math.PI * 2);
        ctx.fill();
        // Logo image — full brightness
        ctx.globalAlpha = 1.0 * pulse;
        ctx.shadowColor = "rgba(0,240,255,1)";
        ctx.shadowBlur = 40;
        ctx.drawImage(logos[0], lx, ly, logoSize, logoSize);
        // Second pass for extra brightness
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 0.5 * pulse;
        ctx.drawImage(logos[0], lx, ly, logoSize, logoSize);
        // "ZENITH APEX TECH" text signature — large & bold
        ctx.shadowBlur = 20;
        ctx.globalAlpha = 1.0 * pulse;
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.textAlign = "left";
        ctx.fillText("ZENITH APEX TECH", lx, ly + logoSize + 14);
        // Tagline
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.75 * pulse;
        ctx.font = "bold 7px monospace";
        ctx.fillStyle = "rgba(0,230,255,1)";
        ctx.fillText("TEST · ENGINEER · CONSTRUCT", lx, ly + logoSize + 26);
        ctx.restore();
      }

      // ── Central faint watermark ──
      if (logos[1]?.complete && logos[1].naturalWidth > 0) {
        const logoSize = Math.min(W, H) * 0.48;
        ctx.save();
        ctx.globalAlpha = 0.045 + 0.015 * Math.sin(t * 0.4);
        ctx.translate(cx, cy * 0.72);
        ctx.drawImage(logos[1], -logoSize / 2, -logoSize / 2, logoSize, logoSize);
        ctx.restore();
      }

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