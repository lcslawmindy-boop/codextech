import * as THREE from "three";

// ── Rotating background image set ─────────────────────────────────────────
export const GRAPH_BG_IMAGES = [
  // User-provided dimensional palace & library images
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3b7e019e6_Screenshot_11-8-2026_13110_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6ef5ea26e_Screenshot_11-8-2026_13170_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0ef05008f_Screenshot_11-8-2026_131046_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/be1bf8352_Screenshot_11-8-2026_131116_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/77dcad0f0_Screenshot_11-8-2026_131156_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c3106ca61_Screenshot_11-8-2026_131228_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ce094315f_Screenshot_11-8-2026_131346_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c10b81ac2_Screenshot_11-8-2026_131440_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d7ef617ce_Screenshot_11-8-2026_131457_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7ea0c59a4_Screenshot_11-8-2026_131524_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9614304ed_Screenshot_11-8-2026_131615_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a216383fe_Screenshot_11-8-2026_131653_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2354b96d7_Screenshot_11-8-2026_131719_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/70dc9df4f_Screenshot_11-8-2026_131728_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/83d34aea7_Screenshot_11-8-2026_131744_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9b5315451_Screenshot_11-8-2026_131754_wwwbingcom.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c1a7a8dba_ak3.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0ea6d0025_ak6.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/29dd866b7_ak7.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6408cab54_aasas.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/adf7454c9_ak.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4bf9157f1_ak5.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ad4564a6a_ak8.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/075033c57_ak9.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/98f6ff30d_ak11.webp",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4e456e388_ak12.webp",
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
  const heightRange = 820;
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
export function goldenSpiralCurve(samples = 900, turns = 7.5, minR = 70, maxR = 560, heightRange = 820) {
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

// ── Rotating background carousel ──────────────────────────────────────────
// Two large inside-out spheres cross-fade through the image set while slowly
// rotating, giving the layered, transparent "rotating images" backdrop.
export class BackgroundCarousel {
  constructor(scene, images, opts = {}) {
    this.scene = scene;
    this.images = images;
    this.radius = opts.radius || 2600;
    this.maxOpacity = opts.maxOpacity ?? 0.6;
    this.holdTime = opts.holdTime || 7;     // seconds per image
    this.fadeTime = opts.fadeTime || 2.2;  // cross-fade duration
    this.loader = new THREE.TextureLoader();
    this._maxAniso = 16; // high anisotropic filtering for sharp background images
    // more segments = smoother sphere surface, less faceting distortion
    this.geo = new THREE.SphereGeometry(this.radius, 96, 64);
    this.idx = 0;
    this.timer = 0;
    this.fading = false;

    const mk = (opacity) => new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({
      transparent: true, opacity, side: THREE.BackSide, depthWrite: false,
    }));
    this.sphereA = mk(this.maxOpacity);
    this.sphereB = mk(0);
    // Flatten the spheres vertically so the heavily-distorted polar regions
    // are pushed out of view — the crisp equatorial band fills the screen.
    this.sphereA.scale.y = 0.55;
    this.sphereB.scale.y = 0.55;
    this.sphereA.rotation.y = Math.random() * Math.PI * 2;
    this.sphereB.rotation.y = Math.random() * Math.PI * 2;
    scene.add(this.sphereA, this.sphereB);
    this.active = this.sphereA;
    this.incoming = this.sphereB;

    this._loadInto(this.active, this.images[0]);
    this._preload = [];
    // preload a couple textures ahead for smooth fades
    for (let i = 1; i < Math.min(3, this.images.length); i++) this._preload.push(this.loader.load(this.images[i]));
  }

  _loadInto(sphere, url) {
    const tex = this.loader.load(url, t => {
      t.colorSpace = THREE.SRGBColorSpace;
      // sharpen: anisotropic filtering keeps the image crisp at grazing angles
      t.anisotropy = this._maxAniso;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.needsUpdate = true;
    });
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this._maxAniso;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    sphere.material.map = tex;
    sphere.material.needsUpdate = true;
  }

  update(dt) {
    // rotate both spheres for parallax (different speeds)
    this.active.rotation.y += dt * 0.03;
    this.incoming.rotation.y += dt * 0.045;

    this.timer += dt;
    if (!this.fading && this.timer >= this.holdTime) {
      this.fading = true;
      this.timer = 0;
      this.idx = (this.idx + 1) % this.images.length;
      this._loadInto(this.incoming, this.images[this.idx]);
    }
    if (this.fading) {
      const t = Math.min(1, this.timer / this.fadeTime);
      this.incoming.material.opacity = this.maxOpacity * t;
      this.active.material.opacity = this.maxOpacity * (1 - t);
      if (t >= 1) {
        // swap roles
        const tmp = this.active; this.active = this.incoming; this.incoming = tmp;
        this.incoming.material.opacity = 0;
        this.incoming.material.map = null;
        this.incoming.material.needsUpdate = true;
        this.fading = false;
        this.timer = 0;
      }
    }
  }

  dispose() {
    this.scene.remove(this.sphereA, this.sphereB);
    [this.sphereA, this.sphereB].forEach(s => { s.material.map?.dispose?.(); s.material.dispose(); });
    this.geo.dispose();
    this._preload.forEach(t => t.dispose());
    cardTextureCache.forEach(t => t.dispose());
    cardTextureCache.clear();
  }
}