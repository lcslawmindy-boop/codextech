import * as THREE from "three";

// ── Background image set (used by CSS slideshow in GraphCanvas3D) ──────────
export const GRAPH_BG_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6f66d099c_Screenshot_11-8-2026_13110_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/175ec089c_Screenshot_11-8-2026_13170_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0720505b8_Screenshot_11-8-2026_131046_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/34987dcd6_ak3.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c16bd6864_ak6.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5770b129b_ak7.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a42ed96a7_brain2.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6fb10d5bb_aasas.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9ded85bcc_ak.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/53f61559d_ak5.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ee054a4ea_ak8.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8ed8a017d_ak9.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8b5ef67cf_ak11.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7de6a608d_ak12.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2f782a7e0_AATCS-P1CADhybrid.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e02abe810_ChatGPTImageJul21202603_49_04PM.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b5a2676c6_122.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/610e6831f_AAA-Copy2.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b0e4b0af9_a-long-row-of-bookshelves-in-a-library-free-photo.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/309b010cc_atom-big-crop-2048x1097.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8d83f4a56_BB-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d5b6ac752_BG1-Copy-Copy-Copy-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2d8f7bd12_CCC.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0e1c8730a_FF.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/57b02fd65_GHGHGH.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f24a45d1d_IMG_7985.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e1516e7e3_IMG_7986.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/77d107f0a_JHKJK-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcdcb4635_JJJ-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a51d144fd_JJJJ-Copy2.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4bff4c608_MHMGHM.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a51d271e4_MMMMMMM-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/31fd513d8_NGNG.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/251bf5edc_NN-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dc42c60d4_NNN-Copy-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/19d7839e1_OIF-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54ff03c96_S3-Copy-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5ba0c3775_SSA.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/854f5cf4d_TES-Copy2-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c1cf2e2b2_UKUKK.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/68d381476_VCCVC-Copy.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e14860bf0_VV-Copy3.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/eefa3e715_5a9efa54-1732-426f-9f15-2281d076e774.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4f4da77a3_6e9914fb6d6d4a305dd2fbe4c30e098d-Copy2.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1cf2ceebb_80df6c4979f8a455e66622179c4fa152--when-you-know-you-never-know-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b322c0d2a_334dc76f54a01292d408e91651da000cd556da33_full.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f371ddf7e_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ac1d10d5f_BG4-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cda8493e6_bookshelves-library-with-old-books_1131516-3-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/99128f256_maxresdefault-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ca5a93f4f_maxresdefault3-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/64997c94a_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/087016483_mri-machine-medical-interior-design-with-lights_932514-2211.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8aeabc816_RB-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/db9e7c569_SDSD.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0a53e586c_solomon-temple-inner.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2c9a82679_thumb-1920-1062369.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3da7710e9_wallpapersdencom_the-matrix-4k_3840x2160.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3347973d2_wonkhe-summer-library-2740x1541-Copy-Copy.jpg",
];

// ── Golden spiral placement (Twilight-Zone style conical spiral) ───────────
// Nodes are laid out along a logarithmic spiral that winds upward, giving the
// "layered and rotating in a gold spiral" composition. Returns numericId -> Vec3.
export function goldenSpiralPositions(nodes) {
  const pos = new Map();
  const N = nodes.length;
  const turns = 7.5;                 // more revolutions for a grander spiral
  const minR = 70;
  const maxR = 560;
  const heightRange = 1600;          // stretched vertically for a towering spiral
  for (let i = 0; i < N; i++) {
    const t = N > 1 ? i / (N - 1) : 0.5;
    const theta = t * turns * Math.PI * 2;
    // logarithmic radius growth (golden-spiral feel), bounded for readability
    const r = minR + (maxR - minR) * Math.pow(t, 0.82);
    const y = (t - 0.5) * heightRange;
    // 3D spread: secondary vertical wave + lateral breathing for dimensional depth
    const wave = Math.sin(theta * 0.5) * 60;
    const breath = Math.cos(theta * 0.33) * 40;
    // small jitter so cards don't overlap perfectly on the curve
    const jx = (Math.sin(i * 12.9) * 8);
    const jy = (Math.cos(i * 78.3) * 8);
    const jz = (Math.sin(i * 45.1) * 8);
    pos.set(nodes[i].numericId, new THREE.Vector3(
      Math.cos(theta) * r + breath + jx,
      y + wave + jy,
      Math.sin(theta) * r + jz
    ));
  }
  return pos;
}

// Continuous spiral curve (for the gold guide-line drawn through the graph)
export function goldenSpiralCurve(samples = 900, turns = 7.5, minR = 70, maxR = 560, heightRange = 1600) {
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const theta = t * turns * Math.PI * 2;
    const r = minR + (maxR - minR) * Math.pow(t, 0.82);
    const y = (t - 0.5) * heightRange;
    const wave = Math.sin(theta * 0.5) * 60;
    const breath = Math.cos(theta * 0.33) * 40;
    pts.push(new THREE.Vector3(Math.cos(theta) * r + breath, y + wave, Math.sin(theta) * r));
  }
  return pts;
}

// ── Domain card texture (cached per domain) ──────────────────────────────
// A "realistic" research card drawn on a canvas: rounded body, gold border,
// domain-color header band with the domain name, and a subtle inner panel.
// One texture per domain (12 total) reused by every node in that domain.
const cardTextureCache = new Map();
export function buildDomainCardTexture(domain) {
  if (cardTextureCache.has(domain.id)) return cardTextureCache.get(domain.id);
  const W = 256, H = 332;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  const radius = 18;

  // helper: rounded rect path
  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // transparent background (rounded corners stay clear)
  ctx.clearRect(0, 0, W, H);

  // card body — dark gradient tinted with domain color
  rr(2, 2, W - 4, H - 4, radius);
  const body = ctx.createLinearGradient(0, 0, 0, H);
  body.addColorStop(0, "rgba(8, 12, 20, 0.92)");
  body.addColorStop(1, hexToRgba(domain.color, 0.22));
  ctx.fillStyle = body;
  ctx.fill();

  // inner panel
  rr(14, 70, W - 28, H - 84, 10);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  ctx.fill();

  // header band — gold gradient
  rr(2, 2, W - 4, 56, radius);
  const head = ctx.createLinearGradient(0, 0, W, 0);
  head.addColorStop(0, "#C9A84C");
  head.addColorStop(0.5, "#F5D77A");
  head.addColorStop(1, "#9C7B2E");
  ctx.fillStyle = head;
  ctx.fill();

  // header divider
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(2, 58); ctx.lineTo(W - 2, 58); ctx.stroke();

  // domain name in header
  ctx.fillStyle = "#1a1405";
  ctx.font = "700 15px Inter, sans-serif";
  ctx.textBaseline = "middle";
  wrapText(ctx, domain.name.toUpperCase(), 14, 29, W - 28, 17);

  // domain color dot
  ctx.beginPath();
  ctx.arc(W - 18, 29, 7, 0, Math.PI * 2);
  ctx.fillStyle = domain.color;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.stroke();

  // "ZARP RESEARCH" tag
  ctx.fillStyle = "rgba(201,168,76,0.85)";
  ctx.font = "700 9px 'JetBrains Mono', monospace";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("ZARP · RESEARCH NODE", 14, H - 18);

  // gold outer border
  rr(2, 2, W - 4, H - 4, radius);
  ctx.strokeStyle = "#E8C766";
  ctx.lineWidth = 3;
  ctx.stroke();
  // thin inner gold hairline
  rr(6, 6, W - 12, H - 12, radius - 4);
  ctx.strokeStyle = "rgba(232,199,102,0.35)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  cardTextureCache.set(domain.id, tex);
  return tex;
}

function hexToRgba(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy); line = w; yy += lh;
      if (yy > y + lh) { ctx.fillText(line + "…", x, yy); return; }
    } else { line = test; }
  }
  ctx.fillText(line, x, yy);
}

// ── BackgroundCarousel — no-op stub (background handled by CSS in GraphCanvas3D) ──
export class BackgroundCarousel {
  constructor() {}
  update() {}
  dispose() {
    cardTextureCache.forEach(t => t.dispose());
    cardTextureCache.clear();
  }
}

// ── Metatron's Cube + Platonic Solids ─────────────────────────────────────
// Builds a sacred-geometry group: 13 node-spheres arranged in the Metatron's
// cube pattern, connecting lines between all pairs, and the five Platonic
// solids (tetrahedron, cube, octahedron, dodecahedron, icosahedron) nested at
// the center. Returns a THREE.Group with a `update(dt)` method attached.
export function buildMetatronCube(size = 120) {
  const group = new THREE.Group();
  const neonGreen = 0x39FF14;
  const gold = 0xE8C766;

  // 13 circles of Metatron: 1 center + 6 inner hexagon + 6 outer hexagon
  const nodes = [];
  const r = size;
  // center
  nodes.push(new THREE.Vector3(0, 0, 0));
  // 6 inner hexagon
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    nodes.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0));
  }
  // 6 outer hexagon (offset 30°)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    nodes.push(new THREE.Vector3(Math.cos(a) * r * 1.7, Math.sin(a) * r * 1.7, 0));
  }

  // node spheres (small glowing orbs)
  const nodeGeo = new THREE.SphereGeometry(size * 0.09, 16, 16);
  nodes.forEach((p, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: i === 0 ? gold : neonGreen,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const m = new THREE.Mesh(nodeGeo, mat);
    m.position.copy(p);
    group.add(m);
  });

  // connecting lines (all 78 pairs = Metatron's cube)
  const linePts = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      linePts.push(nodes[i], nodes[j]);
    }
  }
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const lineMat = new THREE.LineBasicMaterial({
    color: neonGreen,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  // ── Platonic solids nested at center ──
  const solids = [];
  const solidDefs = [
    { geo: new THREE.TetrahedronGeometry(size * 0.55), color: 0x39FF14 },
    { geo: new THREE.BoxGeometry(size * 0.7), color: 0xE8C766 },
    { geo: new THREE.OctahedronGeometry(size * 0.6), color: 0x00BFFF },
    { geo: new THREE.DodecahedronGeometry(size * 0.5), color: 0xB026FF },
    { geo: new THREE.IcosahedronGeometry(size * 0.45), color: 0xFF8C00 },
  ];
  solidDefs.forEach((s, i) => {
    const mat = new THREE.MeshBasicMaterial({
      color: s.color,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(s.geo, mat);
    mesh.userData = {
      rotSpeed: { x: 0.3 + i * 0.1, y: 0.4 + i * 0.08, z: 0.2 + i * 0.05 },
      baseScale: 1,
    };
    solids.push(mesh);
    group.add(mesh);
  });

  group.userData.solids = solids;
  group.update = (dt) => {
    group.rotation.z += dt * 0.15;
    solids.forEach((s, i) => {
      s.rotation.x += dt * s.userData.rotSpeed.x;
      s.rotation.y += dt * s.userData.rotSpeed.y;
      s.rotation.z += dt * s.userData.rotSpeed.z;
      s.material.opacity = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.15;
    });
  };

  return group;
}

// ── Lightning-bolt edge geometry ──────────────────────────────────────────
// Replaces a straight edge with a jagged multi-segment polyline that looks
// like a lightning bolt. Returns a Float32Array of positions.
export function buildLightningEdgeGeometry(edges, nodePositions) {
  const SEGMENTS = 5; // intermediate points per edge
  const totalVerts = edges.length * (SEGMENTS + 1);
  const positions = new Float32Array(totalVerts * 3);
  const colors = new Float32Array(totalVerts * 3);
  const _a = new THREE.Vector3();
  const _b = new THREE.Vector3();
  const _mid = new THREE.Vector3();
  const _perp = new THREE.Vector3();

  edges.forEach((e, i) => {
    const sp = nodePositions.get(e.source);
    const tp = nodePositions.get(e.target);
    if (!sp || !tp) return;
    _a.copy(sp); _b.copy(tp);
    const baseColor = new THREE.Color(e.typeColor || "#39FF14");
    baseColor.r = Math.min(1, baseColor.r * 1.4 + 0.2);
    baseColor.g = Math.min(1, baseColor.g * 1.4 + 0.2);
    baseColor.b = Math.min(1, baseColor.b * 1.4 + 0.2);

    for (let s = 0; s <= SEGMENTS; s++) {
      const t = s / SEGMENTS;
      _mid.lerpVectors(_a, _b, t);
      // jagged displacement perpendicular to the edge, tapering at endpoints
      if (s > 0 && s < SEGMENTS) {
        const jitter = (Math.random() - 0.5) * 40 * (1 - Math.abs(t - 0.5) * 1.4);
        _perp.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
        _mid.addScaledVector(_perp, jitter);
      }
      const idx = (i * (SEGMENTS + 1) + s) * 3;
      positions[idx] = _mid.x;
      positions[idx + 1] = _mid.y;
      positions[idx + 2] = _mid.z;
      colors[idx] = baseColor.r;
      colors[idx + 1] = baseColor.g;
      colors[idx + 2] = baseColor.b;
    }
  });
  return { positions, colors, segments: SEGMENTS };
}