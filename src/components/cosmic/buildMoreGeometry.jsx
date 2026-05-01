import * as THREE from "three";
import { NEON, neonMat, glowMat, wireframeMat, rand } from "./cosmicUtils";

const GOLD = 0xffd700;

// ── Extra Toroidal Donuts (many sizes, nested, interlocked) ───────────────────
export function buildExtraToroidalDonuts(scene) {
  const list = [];

  // Interlocked torus pairs (Hopf links)
  for (let i = 0; i < 10; i++) {
    const grp = new THREE.Group();
    const c1 = NEON[(i * 2) % NEON.length];
    const c2 = NEON[(i * 2 + 1) % NEON.length];

    // First ring
    const t1 = new THREE.Mesh(new THREE.TorusGeometry(5 + i * 0.5, 1.2 + rand(0, 0.5), 16, 80),
      neonMat(c1, 2.5));
    grp.add(t1);

    // Second ring — interlocked (offset by half-angle)
    const t2 = new THREE.Mesh(new THREE.TorusGeometry(5 + i * 0.5, 1.0 + rand(0, 0.4), 16, 80),
      neonMat(c2, 2.0));
    t2.rotation.x = Math.PI / 2;
    t2.position.x = 3;
    grp.add(t2);

    // Third micro ring (inner)
    const t3 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.5, 12, 48),
      neonMat(NEON[(i * 3) % NEON.length], 3));
    t3.rotation.z = Math.PI / 4;
    grp.add(t3);

    // Orbiting particle ring
    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: NEON[(p + i) % NEON.length] }));
      orb.position.set(Math.cos(a) * (6 + i * 0.4), 0, Math.sin(a) * (6 + i * 0.4));
      orb.userData = { angle: a, R: 6 + i * 0.4, speed: 0.025 + i * 0.002 };
      grp.add(orb);
    }

    grp.add(new THREE.PointLight(c1, 1.5, 35));
    grp.position.set(
      rand(-350, 350),
      rand(-40, 50),
      rand(-400, -60)
    );
    scene.add(grp);
    list.push({
      grp,
      orbs: grp.children.filter(c => c.userData.speed),
      rx: rand(0.003, 0.009), ry: rand(0.005, 0.012), rz: rand(0.001, 0.005),
      phase: i * 1.1, baseY: grp.position.y
    });
  }

  // Giant mega-donuts (hero torii)
  const megaDefs = [
    { pos: [-300, -20, -300], R: 25, r: 5, c: 0x00ffff },
    { pos: [300, 20, -350], R: 20, r: 4, c: 0xff00ff },
    { pos: [0, -50, -400], R: 30, r: 6, c: GOLD },
    { pos: [-150, 60, -250], R: 15, r: 3, c: 0x00ff88 },
    { pos: [200, -30, -280], R: 22, r: 4.5, c: 0xff6600 },
  ];
  megaDefs.forEach((d, i) => {
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(d.R, d.r, 24, 100), neonMat(d.c, 2)));
    // Nested inner torus
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(d.R * 0.6, d.r * 0.5, 16, 80), neonMat(NEON[(i * 5) % NEON.length], 1.5)));
    // Wireframe outer shell
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(d.R * 1.1, d.r * 0.3, 12, 60), wireframeMat(d.c, 0.3)));
    // Spinning particle ring
    for (let p = 0; p < 12; p++) {
      const a = (p / 12) * Math.PI * 2;
      const orb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8),
        new THREE.MeshBasicMaterial({ color: NEON[(p + i * 3) % NEON.length] }));
      orb.position.set(Math.cos(a) * (d.R + d.r + 2), Math.sin(a * 0.5) * 4, Math.sin(a) * (d.R + d.r + 2));
      orb.userData = { angle: a, R: d.R + d.r + 2, speed: 0.012 };
      grp.add(orb);
    }
    grp.add(new THREE.PointLight(d.c, 2, 80));
    grp.position.set(...d.pos);
    scene.add(grp);
    list.push({
      grp,
      orbs: grp.children.filter(c => c.userData.speed),
      rx: rand(0.001, 0.004), ry: rand(0.002, 0.006), rz: rand(0.001, 0.003),
      phase: i * 2, baseY: d.pos[1]
    });
  });

  // Nested torus stacks (like an atom)
  for (let i = 0; i < 6; i++) {
    const grp = new THREE.Group();
    const col = NEON[(i * 4) % NEON.length];
    const center = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 20), neonMat(col, 3));
    grp.add(center);
    for (let ring = 0; ring < 3; ring++) {
      const torus = new THREE.Mesh(new THREE.TorusGeometry(6 + ring * 3, 0.6 - ring * 0.1, 10, 60),
        neonMat(NEON[(i + ring * 2) % NEON.length], 2));
      torus.rotation.set(ring * Math.PI / 4, ring * Math.PI / 3, 0);
      grp.add(torus);
    }
    grp.add(new THREE.PointLight(col, 2, 40));
    grp.position.set(rand(-300, 300), rand(-30, 40), rand(-350, -100));
    scene.add(grp);
    list.push({ grp, orbs: [], rx: rand(0.003, 0.008), ry: rand(0.004, 0.01), rz: rand(0.001, 0.004), phase: i, baseY: grp.position.y });
  }

  return list;
}

export function tickExtraToroidalDonuts(list, t) {
  list.forEach(item => {
    item.grp.rotation.x += item.rx;
    item.grp.rotation.y += item.ry;
    item.grp.rotation.z += item.rz;
    item.grp.position.y = item.baseY + Math.sin(t * 0.3 + item.phase) * 5;
    item.orbs.forEach(orb => {
      orb.userData.angle += orb.userData.speed;
      const a = orb.userData.angle;
      const R = orb.userData.R;
      orb.position.set(Math.cos(a) * R, Math.sin(a * 0.5) * 4, Math.sin(a) * R);
    });
  });
}

// ── Extra Stars (many types) ──────────────────────────────────────────────────
export function buildExtraStars(scene) {
  const list = [];

  // 3D star shapes (starburst with spikes)
  for (let i = 0; i < 12; i++) {
    const grp = new THREE.Group();
    const col = NEON[(i * 3) % NEON.length];
    const spikes = 6 + Math.floor(Math.random() * 6); // 6-12 spikes
    const coreR = 1.5 + Math.random() * 2;
    // Core sphere
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(coreR, 16, 12), neonMat(col, 2.5)));
    // Spikes
    for (let s = 0; s < spikes; s++) {
      const phi = (s / spikes) * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const spikeLen = 3 + Math.random() * 5;
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.25 + Math.random() * 0.2, spikeLen, 8),
        neonMat(NEON[(s + i) % NEON.length], 3)
      );
      spike.position.set(
        Math.sin(theta) * Math.cos(phi) * (coreR + spikeLen * 0.5),
        Math.cos(theta) * (coreR + spikeLen * 0.5),
        Math.sin(theta) * Math.sin(phi) * (coreR + spikeLen * 0.5)
      );
      spike.lookAt(0, 0, 0);
      spike.rotateX(Math.PI / 2);
      grp.add(spike);
    }
    grp.add(new THREE.PointLight(col, 2, 30));
    grp.position.set(rand(-350, 350), rand(-50, 60), rand(-400, -50));
    scene.add(grp);
    list.push({ grp, rx: rand(0.003, 0.01), ry: rand(0.005, 0.015), rz: rand(0.002, 0.007), phase: i * 0.8, baseY: grp.position.y });
  }

  // Neutron stars (rapidly spinning with jets)
  for (let i = 0; i < 4; i++) {
    const grp = new THREE.Group();
    const col = NEON[(i * 5) % NEON.length];
    // Dense core
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(3, 24, 24), neonMat(col, 4)));
    // Equatorial bulge ring
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.5, 8, 60), neonMat(NEON[(i + 2) % NEON.length], 2)));
    // Polar jets
    [-1, 1].forEach(dir => {
      const jet = new THREE.Mesh(new THREE.ConeGeometry(1, 15, 12, 1, true),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
      jet.position.y = dir * 10; jet.rotation.x = dir > 0 ? 0 : Math.PI;
      grp.add(jet);
    });
    // Accretion lines
    for (let l = 0; l < 8; l++) {
      const a = (l / 8) * Math.PI * 2;
      const pts = [new THREE.Vector3(Math.cos(a) * 3, 0, Math.sin(a) * 3),
        new THREE.Vector3(Math.cos(a) * 12, (Math.random() - 0.5) * 6, Math.sin(a) * 12)];
      grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.4 })));
    }
    grp.add(new THREE.PointLight(col, 3, 50));
    grp.position.set(rand(-300, 300), rand(-40, 50), rand(-400, -100));
    scene.add(grp);
    list.push({ grp, orbs: [], rx: 0, ry: 0.04 + i * 0.02, rz: 0, phase: i, baseY: grp.position.y });
  }

  return list;
}

export function tickExtraStars(list, t) {
  list.forEach(item => {
    item.grp.rotation.x += item.rx || 0;
    item.grp.rotation.y += item.ry || 0;
    item.grp.rotation.z += item.rz || 0;
    item.grp.position.y = item.baseY + Math.sin(t * 0.35 + item.phase) * 4;
  });
}

// ── Extra Cubes (transformed into complex polytopes) ─────────────────────────
export function buildExtraCubes(scene) {
  const list = [];

  // Nested cube sets (matryoshka cubes)
  for (let i = 0; i < 8; i++) {
    const grp = new THREE.Group();
    const col = NEON[(i * 3 + 1) % NEON.length];
    const sizes = [4, 6, 8, 11];
    sizes.forEach((s, j) => {
      grp.add(new THREE.Mesh(new THREE.BoxGeometry(s, s, s),
        wireframeMat(NEON[(i + j * 2) % NEON.length], 0.5 - j * 0.1)));
    });
    // Rotating inner octahedron
    const oct = new THREE.Mesh(new THREE.OctahedronGeometry(3, 0), neonMat(col, 2.5));
    oct.userData = { spin: true };
    grp.add(oct);
    // Vertex glows
    const hw = 4;
    [[-hw,-hw,-hw],[-hw,-hw,hw],[-hw,hw,-hw],[-hw,hw,hw],[hw,-hw,-hw],[hw,-hw,hw],[hw,hw,-hw],[hw,hw,hw]].forEach(v => {
      grp.add(new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: col })));
      grp.children[grp.children.length - 1].position.set(...v);
      const vs = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), new THREE.MeshBasicMaterial({ color: col }));
      vs.position.set(...v);
      grp.add(vs);
    });
    grp.add(new THREE.PointLight(col, 1.5, 35));
    grp.position.set(rand(-300, 300), rand(-30, 40), rand(-350, -80));
    scene.add(grp);
    list.push({
      grp,
      innerOct: oct,
      rx: rand(0.003, 0.009), ry: rand(0.004, 0.011), rz: rand(0.001, 0.005),
      phase: i * 1.5, baseY: grp.position.y
    });
  }

  return list;
}

export function tickExtraCubes(list, t) {
  list.forEach(item => {
    item.grp.rotation.x += item.rx;
    item.grp.rotation.y += item.ry;
    item.grp.rotation.z += item.rz;
    item.grp.position.y = item.baseY + Math.sin(t * 0.4 + item.phase) * 4;
    if (item.innerOct) {
      item.innerOct.rotation.x += 0.02;
      item.innerOct.rotation.z += 0.015;
    }
  });
}