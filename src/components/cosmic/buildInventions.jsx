import * as THREE from "three";
import { NEON, neonMat, glowMat, wireframeMat, rand } from "./cosmicUtils";

// ── Invention Bubbles ─────────────────────────────────────────────────────────
const INVENTIONS = [
  { name: "MEG Generator",        geo: () => new THREE.TorusKnotGeometry(2.4, 0.65, 140, 20),        color: 0x00ffff },
  { name: "Scalar Transmitter",   geo: () => new THREE.TorusGeometry(2.6, 0.8, 20, 64),              color: 0xff00ff },
  { name: "Zero-Point Extractor", geo: () => new THREE.IcosahedronGeometry(3, 2),                   color: 0x00ff88 },
  { name: "Anenergy Pump",        geo: () => new THREE.TorusKnotGeometry(2.2, 0.55, 100, 18, 3, 5), color: 0xff6600 },
  { name: "Prioré Device",        geo: () => new THREE.OctahedronGeometry(3, 1),                    color: 0xffff00 },
  { name: "Torsion Generator",    geo: () => new THREE.DodecahedronGeometry(2.8, 1),                color: 0xff0088 },
  { name: "Resonance Cavity",     geo: () => new THREE.CylinderGeometry(1.4, 2.2, 5.5, 18),         color: 0x8800ff },
  { name: "BioEM Interface",      geo: () => new THREE.SphereGeometry(3, 20, 20),                   color: 0x00aaff },
  { name: "Plasma Reactor",       geo: () => new THREE.TorusKnotGeometry(2, 0.7, 80, 16, 5, 8),     color: 0xff4400 },
  { name: "Scalar Wave Lens",     geo: () => new THREE.TetrahedronGeometry(3, 0),                   color: 0x44ff00 },
  { name: "Vortex Engine",        geo: () => new THREE.ConeGeometry(2, 5.5, 16),                    color: 0xaa00ff },
  { name: "Akasha Capacitor",     geo: () => new THREE.BoxGeometry(4, 4, 4),                        color: 0xffaa00 },
];

export function buildInventionBubbles(scene) {
  const list = [];
  INVENTIONS.forEach((d, i) => {
    const grp = new THREE.Group();
    // Bubble shell
    const shellMat = new THREE.MeshStandardMaterial({
      color: d.color, emissive: d.color, emissiveIntensity: 0.22,
      transparent: true, opacity: 0.16,
      roughness: 0.0, metalness: 1.0, side: THREE.DoubleSide,
    });
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(7, 48, 48), shellMat));
    // Wireframe shell
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(7.2, 24, 24), wireframeMat(d.color, 0.2)));
    // Inner device
    const device = new THREE.Mesh(d.geo(), neonMat(d.color, 2.8));
    grp.add(device);
    // Orbiting electrons
    const ions = [];
    for (let p = 0; p < 6; p++) {
      const ion = new THREE.Mesh(new THREE.SphereGeometry(0.35, 10, 10),
        new THREE.MeshBasicMaterial({ color: NEON[(i + p) % NEON.length] }));
      const trail = new THREE.Mesh(new THREE.SphereGeometry(0.18, 6, 6),
        new THREE.MeshBasicMaterial({ color: NEON[(i + p) % NEON.length], transparent: true, opacity: 0.4 }));
      ion.userData = { angle: (p / 6) * Math.PI * 2, orbitR: 5.5 + p * 0.2, speed: 0.018 + p * 0.007, tilt: p * 0.5 };
      grp.add(ion, trail);
      ions.push({ ion, trail });
    }
    grp.add(new THREE.PointLight(d.color, 2, 50));

    const cols = 4, rows = 3;
    const ci = i % cols, ri = Math.floor(i / cols);
    grp.position.set(-160 + ci * 110, 20 - ri * 35, -60 - ri * 20);
    scene.add(grp);
    list.push({ grp, device, ions, phase: i * 0.85, speed: 0.003 + i * 0.0007, floatAmp: 5 + i * 0.3, baseY: grp.position.y });
  });
  return list;
}

export function tickInventions(list, t) {
  list.forEach(b => {
    b.grp.position.y = b.baseY + Math.sin(t * 0.45 + b.phase) * b.floatAmp;
    b.grp.position.x += Math.sin(t * 0.1 + b.phase * 0.6) * 0.008;
    b.grp.rotation.y += b.speed;
    b.device.rotation.y += b.speed * 2.2;
    b.device.rotation.x += b.speed * 0.6;
    b.ions.forEach(({ ion, trail }) => {
      ion.userData.angle += ion.userData.speed;
      const a = ion.userData.angle;
      const r = ion.userData.orbitR;
      const tilt = ion.userData.tilt;
      ion.position.set(Math.cos(a) * r, Math.sin(a * 0.7 + tilt) * 2.5, Math.sin(a) * r);
      trail.position.set(Math.cos(a - 0.2) * r, Math.sin((a - 0.2) * 0.7 + tilt) * 2.5, Math.sin(a - 0.2) * r);
    });
  });
}

// ── Inventor Portraits (glowing face-plate medallions) ──────────────────────
export function buildInventorPortraits(scene) {
  const list = [];
  const inventors = [
    { name: "Tesla",    color: 0x00ffff, pos: [-100, 45, -30], symbol: "⚡" },
    { name: "Einstein", color: 0xffff00, pos: [0,    50, -25], symbol: "E=mc²" },
    { name: "Socrates", color: 0xffaa00, pos: [100,  45, -30], symbol: "☯" },
    { name: "Newton",   color: 0x00ff88, pos: [-60,  -30, -35], symbol: "∫F" },
    { name: "da Vinci", color: 0xff6600, pos: [60,   -30, -35], symbol: "✦" },
    { name: "Pythagoras", color: 0xff00ff, pos: [-140, 10, -45], symbol: "△" },
    { name: "Faraday",  color: 0x8800ff, pos: [140,  10, -45], symbol: "∮" },
  ];

  inventors.forEach((inv, i) => {
    const grp = new THREE.Group();

    // Portrait disc (main face plate)
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 0.5, 48),
      new THREE.MeshStandardMaterial({ color: inv.color, emissive: inv.color, emissiveIntensity: 0.3, roughness: 0.3, metalness: 0.8 })
    );
    disc.rotation.x = Math.PI / 2;
    grp.add(disc);

    // Face representation (stylized spheres for head)
    const face = new THREE.Mesh(new THREE.SphereGeometry(3.5, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffe8cc, roughness: 0.5, metalness: 0, emissive: 0xddccaa, emissiveIntensity: 0.3 }));
    face.position.z = 0.3;
    grp.add(face);

    // Eyes
    [-0.9, 0.9].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x222222 }));
      eye.position.set(ex, 0.6, 3.6);
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshBasicMaterial({ color: inv.color }));
      iris.position.set(ex, 0.6, 3.78);
      grp.add(eye, iris);
    });

    // Hair bump
    const hair = new THREE.Mesh(
      (() => { const g = new THREE.SphereGeometry(3.7, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.5); return g; })(),
      new THREE.MeshStandardMaterial({ color: 0x888866, roughness: 0.9 })
    );
    hair.position.z = 0.3; hair.rotation.x = Math.PI;
    grp.add(hair);

    // Ornate frame ring
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(5.5, 0.5, 8, 60), neonMat(inv.color)));

    // Equation/symbol ring around portrait
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      const sym = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 0),
        new THREE.MeshBasicMaterial({ color: NEON[(s + i) % NEON.length] }));
      sym.position.set(Math.cos(a) * 7.5, Math.sin(a) * 7.5, 0);
      sym.userData = { angle: a, speed: 0.01 + i * 0.002 };
      grp.add(sym);
    }

    // Glow aura
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(7, 16, 16),
      new THREE.MeshBasicMaterial({ color: inv.color, transparent: true, opacity: 0.05 })));
    grp.add(new THREE.PointLight(inv.color, 1.5, 35));

    grp.position.set(...inv.pos);
    grp.rotation.y = (Math.random() - 0.5) * 0.5;
    scene.add(grp);
    list.push({
      grp,
      orbs: grp.children.filter(c => c.userData.speed),
      phase: i * 1.3, baseY: inv.pos[1], floatAmp: 3,
    });
  });
  return list;
}

export function tickInventors(list, t) {
  list.forEach(p => {
    p.grp.position.y = p.baseY + Math.sin(t * 0.35 + p.phase) * p.floatAmp;
    p.grp.rotation.y += 0.004;
    p.orbs.forEach(orb => {
      orb.userData.angle += orb.userData.speed;
      orb.position.set(
        Math.cos(orb.userData.angle) * 7.5,
        Math.sin(orb.userData.angle) * 7.5,
        Math.sin(orb.userData.angle * 2) * 1,
      );
    });
  });
}

// ── Floating Math Equations (3D text planes) ──────────────────────────────────
export function buildMathEquations(scene) {
  const list = [];
  const equations = [
    "E = mc²", "∇×B = μ₀J", "F = ma", "∮E·dA = Q/ε₀",
    "ψ=Ae^(ikx)", "H=−ℏ²∇²/2m", "∇²φ=0", "F=kq₁q₂/r²",
    "∮B·dl=μ₀I", "S=kB·ln(Ω)", "P=IV", "ω=2πf",
    "λ=h/mv", "E=hf", "c=λf", "∇·E=ρ/ε₀",
  ];
  equations.forEach((eq, i) => {
    const grp = new THREE.Group();
    // Background plane
    const bg = new THREE.Mesh(
      new THREE.PlaneGeometry(eq.length * 0.7 + 2, 2.5),
      new THREE.MeshBasicMaterial({ color: NEON[i % NEON.length], transparent: true, opacity: 0.06, side: THREE.DoubleSide })
    );
    grp.add(bg);
    // Border frame
    const frame = new THREE.Mesh(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(eq.length * 0.7 + 2, 2.5, 0.1)),
      new THREE.LineBasicMaterial({ color: NEON[i % NEON.length], transparent: true, opacity: 0.5 })
    );
    grp.add(frame);
    // Small orbital decorators
    const orbColor = NEON[(i + 3) % NEON.length];
    [-1, 1].forEach(side => {
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshBasicMaterial({ color: orbColor }));
      orb.position.set(side * (eq.length * 0.35 + 1.5), 0, 0);
      grp.add(orb);
    });
    grp.add(new THREE.PointLight(NEON[i % NEON.length], 0.5, 12));

    const cols = 4;
    grp.position.set(
      -180 + (i % cols) * 120, 60 - Math.floor(i / cols) * 22, -110 - Math.floor(i / cols) * 8
    );
    grp.rotation.y = (Math.random() - 0.5) * 0.4;
    scene.add(grp);
    list.push({ grp, phase: i * 0.7, baseY: grp.position.y });
  });
  return list;
}

export function tickEquations(list, t) {
  list.forEach(e => {
    e.grp.position.y = e.baseY + Math.sin(t * 0.3 + e.phase) * 3;
    e.grp.rotation.y += 0.002;
  });
}