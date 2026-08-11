import * as THREE from "three";

// ── Rotating background image set (uploaded references) ───────────────────
const IMG_BASE = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/";
export const GRAPH_BG_IMAGES = [
  "2c2c53d1d_FF-Copy.jpeg",
  "321c996ad_JHKJK.jpeg",
  "26a449972_JJJ-Copy.jpeg",
  "edd5828bf_JJJJ-Copy2.jpeg",
  "4b48198d3_MMMM-Copy2.jpeg",
  "b1e40858f_MMMMMMM-Copy.jpeg",
  "213901994_NGNG.jpeg",
  "bef70ea1e_NN-Copy.jpeg",
  "2e346b657_NNN-Copy2.jpeg",
  "b36588d06_TES-Copy.jpeg",
  "2ac5156d5_UKUKK.jpeg",
  "4b8934f1e_VCCVC-Copy.jpeg",
  "79f60e749_VV-Copy3.jpeg",
  "4c0a5f5ca_6e9914fb6d6d4a305dd2fbe4c30e098d-Copy2.jpg",
  "457de90bb_334dc76f54a01292d408e91651da000cd556da33_full-Copy2.jpg",
  "e96b9fdb4_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc-Copy2.jpg",
  "4458567be_1000_F_971892795_RX3cpf8xMUbbE4vJ2MnOerElgOeodidS.jpg",
  "aed46fae7_615224639_1183362507294312_8069412157456999405_n-Copy.jpg",
  "98cf429ac_615812757_25669650252651736_4672308845905138780_n-Copy.jpg",
  "485aa72e7_a8838d6e6380e3cc2ddff672d7c0883b-Copy-Copy.jpg",
].map(f => IMG_BASE + f);

// ── Golden spiral placement (Twilight-Zone style conical spiral) ───────────
// Nodes are laid out along a logarithmic spiral that winds upward, giving the
// "layered and rotating in a gold spiral" composition. Returns numericId -> Vec3.
export function goldenSpiralPositions(nodes) {
  const pos = new Map();
  const N = nodes.length;
  const turns = 5.5;                 // how many full revolutions
  const minR = 40;
  const maxR = 340;
  const heightRange = 520;
  for (let i = 0; i < N; i++) {
    const t = N > 1 ? i / (N - 1) : 0.5;
    const theta = t * turns * Math.PI * 2;
    // logarithmic radius growth (golden-spiral feel), bounded for readability
    const r = minR + (maxR - minR) * Math.pow(t, 0.85);
    const y = (t - 0.5) * heightRange;
    // small jitter so cards don't overlap perfectly on the curve
    const jx = (Math.sin(i * 12.9) * 6);
    const jy = (Math.cos(i * 78.3) * 6);
    pos.set(nodes[i].numericId, new THREE.Vector3(
      Math.cos(theta) * r + jx,
      y + jy,
      Math.sin(theta) * r
    ));
  }
  return pos;
}

// Continuous spiral curve (for the gold guide-line drawn through the graph)
export function goldenSpiralCurve(samples = 600, turns = 5.5, minR = 40, maxR = 340, heightRange = 520) {
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const theta = t * turns * Math.PI * 2;
    const r = minR + (maxR - minR) * Math.pow(t, 0.85);
    const y = (t - 0.5) * heightRange;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r));
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
    this.geo = new THREE.SphereGeometry(this.radius, 48, 32);
    this.idx = 0;
    this.timer = 0;
    this.fading = false;

    const mk = (opacity) => new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({
      transparent: true, opacity, side: THREE.BackSide, depthWrite: false,
    }));
    this.sphereA = mk(this.maxOpacity);
    this.sphereB = mk(0);
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
    const tex = this.loader.load(url, t => { t.colorSpace = THREE.SRGBColorSpace; });
    tex.colorSpace = THREE.SRGBColorSpace;
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