import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── Neon palette ────────────────────────────────────────────────────────────
const NEON = [
  0x00ffff, 0xff00ff, 0x00ff88, 0xff6600,
  0xffff00, 0xff0088, 0x8800ff, 0x00aaff,
  0xff4400, 0x44ff00, 0x0044ff, 0xff44aa,
];

function neonStdMat(hex, emissive = 1.8) {
  return new THREE.MeshStandardMaterial({
    color: hex, emissive: hex, emissiveIntensity: emissive,
    roughness: 0.05, metalness: 0.9,
  });
}

// ── Builder helpers ──────────────────────────────────────────────────────────
function addStarfield(scene) {
  const count = 12000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 3000;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 3000;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 3000;
    const c = new THREE.Color().setHSL(Math.random(), 0.3, 0.7 + Math.random() * 0.3);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.35, vertexColors: true, sizeAttenuation: true }));
  scene.add(stars);
  return stars;
}

function addMilkyWay(scene) {
  const count = 8000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r     = 300 + Math.pow(Math.random(), 0.6) * 800;
    const arm   = Math.floor(Math.random() * 2) * Math.PI;
    const twist = r * 0.002;
    const spread = (Math.random() - 0.5) * 50;
    pos[i * 3]     = Math.cos(theta + arm + twist) * r;
    pos[i * 3 + 1] = spread * (1 - r / 1200);
    pos[i * 3 + 2] = Math.sin(theta + arm + twist) * r - 600;
    const hue = 0.55 + Math.random() * 0.25;
    const c = new THREE.Color().setHSL(hue, 0.7, 0.55 + Math.random() * 0.45);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  const mw = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.7, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.85 }));
  scene.add(mw);
  return mw;
}

function addPlanets(scene) {
  const defs = [
    { pos: [-130, 40, -220], r: 20, color: 0xff7722, ring: true, ringColor: 0xffbb66, ringInner: 1.45, ringOuter: 2.4 },
    { pos: [160, -50, -320], r: 14, color: 0x3366ff, ring: false },
    { pos: [-55, 65, -160], r: 9,  color: 0x66ff44, ring: false },
    { pos: [90,  55, -110], r: 7,  color: 0xff3388, ring: false },
    { pos: [20, -90, -280], r: 24, color: 0xaa44ff, ring: true, ringColor: 0xdd99ff, ringInner: 1.4, ringOuter: 2.0 },
    { pos: [-200, 10, -350], r: 11, color: 0x00ffcc, ring: false },
  ];
  const list = [];
  defs.forEach(d => {
    const grp = new THREE.Group();
    // Planet surface
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(d.r, 48, 48),
      new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.35, metalness: 0.25, emissive: d.color, emissiveIntensity: 0.08 })
    );
    grp.add(mesh);
    // Atmosphere halo
    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(d.r * 1.14, 32, 32),
      new THREE.MeshStandardMaterial({ color: d.color, transparent: true, opacity: 0.10, side: THREE.FrontSide })
    );
    grp.add(atmo);
    // Band stripes (for gas giants)
    if (d.r > 12) {
      for (let b = 0; b < 5; b++) {
        const band = new THREE.Mesh(
          new THREE.TorusGeometry(d.r * 1.001, d.r * 0.05, 6, 64),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(d.color).multiplyScalar(0.7), transparent: true, opacity: 0.3 })
        );
        band.rotation.x = Math.PI / 2;
        band.position.y = (b - 2) * d.r * 0.28;
        grp.add(band);
      }
    }
    // Ring system
    if (d.ring) {
      const rg = new THREE.Mesh(
        new THREE.RingGeometry(d.r * d.ringInner, d.r * d.ringOuter, 80),
        new THREE.MeshStandardMaterial({ color: d.ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
      );
      rg.rotation.x = Math.PI / 3.5;
      grp.add(rg);
    }
    grp.position.set(...d.pos);
    scene.add(grp);
    // Light
    const pl = new THREE.PointLight(d.color, 0.7, d.r * 10);
    pl.position.copy(grp.position);
    scene.add(pl);
    list.push({ grp, speed: 0.001 + Math.random() * 0.002, axis: new THREE.Vector3(0.1, 1, 0.15).normalize() });
  });
  return list;
}

function addBlackHoles(scene) {
  const list = [];
  [[-210, -40, -450], [200, 80, -550]].forEach((pos, idx) => {
    const grp = new THREE.Group();
    // Singularity
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(6, 32, 32), new THREE.MeshBasicMaterial({ color: 0x000000 })));
    // Accretion disk rings
    [[9, 12, 0xff4400, 0.75], [13, 17, 0xff8800, 0.55], [18, 22, 0xffaa22, 0.35], [23, 28, 0xff6600, 0.2]].forEach(([inner, outer, color, op]) => {
      const disk = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 80),
        new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: op })
      );
      disk.rotation.x = Math.PI / 2.8 + idx * 0.15;
      grp.add(disk);
    });
    // Photon ring (bright white ring)
    const photon = new THREE.Mesh(
      new THREE.RingGeometry(7.5, 8.5, 80),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.95 })
    );
    photon.rotation.x = Math.PI / 2;
    grp.add(photon);
    // Jets
    [-1, 1].forEach(dir => {
      const jet = new THREE.Mesh(
        new THREE.ConeGeometry(2, 40, 16, 1, true),
        new THREE.MeshBasicMaterial({ color: 0x88aaff, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
      );
      jet.position.y = dir * 25;
      jet.rotation.x = dir > 0 ? 0 : Math.PI;
      grp.add(jet);
    });
    grp.position.set(...pos);
    scene.add(grp);
    list.push({ grp, speed: 0.004 + idx * 0.001 });
  });
  return list;
}

function addAsteroids(scene) {
  const list = [];
  for (let i = 0; i < 30; i++) {
    const s = Math.random() * 2.5 + 0.4;
    const geo = new THREE.DodecahedronGeometry(s, 0);
    // Slightly distort vertices
    const verts = geo.attributes.position.array;
    for (let v = 0; v < verts.length; v++) verts[v] += (Math.random() - 0.5) * s * 0.4;
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x775544, roughness: 0.95, metalness: 0.05 }));
    mesh.position.set((Math.random() - 0.5) * 350, (Math.random() - 0.5) * 180, (Math.random() - 0.5) * 220 - 30);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);
    list.push({ mesh, vx: (Math.random() - 0.5) * 0.07, vy: (Math.random() - 0.5) * 0.03, spin: (Math.random() - 0.5) * 0.018 });
  }
  return list;
}

function addComets(scene) {
  const list = [];
  for (let i = 0; i < 5; i++) {
    const grp = new THREE.Group();
    // Nucleus
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(1.4, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xaaddff, emissive: 0x66aaff, emissiveIntensity: 2.5 })));
    // Coma glow
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.12 })));
    // Ion tail
    const tailLen = 25 + Math.random() * 20;
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.6, tailLen, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, side: THREE.DoubleSide }));
    tail.rotation.z = Math.PI / 2;
    tail.position.x = -tailLen / 2 - 1.5;
    grp.add(tail);
    // Dust tail (wider, yellower)
    const dust = new THREE.Mesh(new THREE.ConeGeometry(2, tailLen * 0.7, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffeeaa, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
    dust.rotation.z = Math.PI / 2 + 0.15;
    dust.position.x = -tailLen * 0.35;
    grp.add(dust);

    grp.position.set((Math.random() - 0.5) * 500, (Math.random() - 0.5) * 250, (Math.random() - 0.5) * 100 - 40);
    grp.rotation.z = (Math.random() - 0.5) * 0.3;
    scene.add(grp);
    list.push({ grp, vx: 0.2 + Math.random() * 0.25, vy: (Math.random() - 0.5) * 0.04 });
  }
  return list;
}

function addUFOs(scene) {
  const list = [];
  for (let i = 0; i < 4; i++) {
    const grp = new THREE.Group();
    const color = NEON[i * 2 % NEON.length];
    // Hull (flattened sphere)
    const hull = new THREE.Mesh(
      (() => { const g = new THREE.SphereGeometry(5, 40, 20); g.scale(1, 0.32, 1); return g; })(),
      new THREE.MeshStandardMaterial({ color: 0xbbbbcc, roughness: 0.08, metalness: 0.95 })
    );
    grp.add(hull);
    // Glass dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x99ffff, transparent: true, opacity: 0.55, roughness: 0, metalness: 0.5 })
    );
    dome.position.y = 1.4;
    grp.add(dome);
    // Neon rim
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(5.3, 0.35, 12, 60),
      new THREE.MeshBasicMaterial({ color })));
    // Portal lights (small spheres on rim)
    for (let p = 0; p < 10; p++) {
      const a = (p / 10) * Math.PI * 2;
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8),
        new THREE.MeshBasicMaterial({ color: NEON[(p + i) % NEON.length] }));
      light.position.set(Math.cos(a) * 5.3, 0, Math.sin(a) * 5.3);
      grp.add(light);
    }
    // Tractor beam
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(4, 16, 20, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    beam.position.y = -9; beam.rotation.x = Math.PI;
    grp.add(beam);

    const pl = new THREE.PointLight(color, 2, 40);
    pl.position.y = -4;
    grp.add(pl);

    grp.position.set(-90 + i * 55, 18 - i * 8, -25 - i * 18);
    scene.add(grp);
    list.push({ grp, phase: i * 1.5, speed: 0.007 + i * 0.002, baseY: grp.position.y });
  }
  return list;
}

function addRockets(scene) {
  const list = [];
  const colors = [0xff3333, 0x3333ff, 0x33ff33, 0xff33ff];
  for (let i = 0; i < 4; i++) {
    const grp = new THREE.Group();
    const accent = colors[i];
    // Body
    grp.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 8, 20),
      new THREE.MeshStandardMaterial({ color: 0xdde2ff, roughness: 0.2, metalness: 0.85 })));
    // Nose cone
    const nose = new THREE.Mesh(new THREE.ConeGeometry(1, 3.5, 20),
      new THREE.MeshStandardMaterial({ color: accent, roughness: 0.2, metalness: 0.7 }));
    nose.position.y = 5.75; grp.add(nose);
    // Fins (4x)
    for (let f = 0; f < 4; f++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.5, 1.8),
        new THREE.MeshStandardMaterial({ color: accent }));
      const a = (f / 4) * Math.PI * 2;
      fin.position.set(Math.cos(a) * 1.3, -3, Math.sin(a) * 1.3);
      grp.add(fin);
    }
    // Window
    const win = new THREE.Mesh(new THREE.CircleGeometry(0.5, 16),
      new THREE.MeshBasicMaterial({ color: 0x88eeff }));
    win.position.set(1.01, 1, 0); win.rotation.y = Math.PI / 2;
    grp.add(win);
    // Exhaust cone
    const ex = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.2, 16),
      new THREE.MeshStandardMaterial({ color: 0x444455, roughness: 0.3 }));
    ex.position.y = -4.6; ex.rotation.x = Math.PI; grp.add(ex);
    // Flame layers
    [[1.1, 4, 0xff6600, 0.9], [0.7, 3, 0xffaa00, 0.85], [0.4, 2, 0xffff66, 0.8]].forEach(([r, h, c, op]) => {
      const fl = new THREE.Mesh(new THREE.ConeGeometry(r, h, 12),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op }));
      fl.position.y = -5.5 - h * 0.3; fl.rotation.x = Math.PI; grp.add(fl);
    });

    grp.rotation.z = (Math.random() - 0.5) * 0.3;
    grp.position.set(-120 + i * 80, -30 + i * 15, -35 - i * 12);
    scene.add(grp);
    list.push({ grp, vy: 0.035 + Math.random() * 0.025, phase: i * 1.8, startY: grp.position.y });
  }
  return list;
}

function addPlatonicSolids(scene) {
  const list = [];
  const geos = [
    new THREE.TetrahedronGeometry(7),
    new THREE.OctahedronGeometry(7),
    new THREE.IcosahedronGeometry(7),
    new THREE.DodecahedronGeometry(7),
    new THREE.BoxGeometry(10, 10, 10),
  ];
  geos.forEach((geo, i) => {
    const color = NEON[(i * 2 + 1) % NEON.length];
    const grp = new THREE.Group();
    // Translucent solid
    grp.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color, emissive: color, emissiveIntensity: 0.5,
      transparent: true, opacity: 0.12, side: THREE.DoubleSide,
    })));
    // Glowing wireframe
    grp.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true })));
    // Edge glow (slightly scaled out)
    const outerGeo = geo.clone();
    outerGeo.scale(1.05, 1.05, 1.05);
    grp.add(new THREE.Mesh(outerGeo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.2 })));
    // Inner point light
    grp.add(new THREE.PointLight(color, 1.2, 35));

    grp.position.set(-100 + i * 50, 12 - i * 9, -70 + i * 12);
    scene.add(grp);
    list.push({ grp, rx: 0.004 + i * 0.002, ry: 0.007 + i * 0.001, rz: 0.002 + i * 0.001 });
  });
  return list;
}

function addToroids(scene) {
  const list = [];
  for (let i = 0; i < 8; i++) {
    const color = NEON[(i + 3) % NEON.length];
    const grp = new THREE.Group();
    const R = 8, r = 1.4;
    // Main torus
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(R, r, 28, 100),
      neonStdMat(color, 2.0)));
    // Secondary winding torus (perpendicular)
    const inner = new THREE.Mesh(new THREE.TorusGeometry(R * 0.6, r * 0.6, 16, 60),
      neonStdMat(NEON[(i + 5) % NEON.length], 1.5));
    inner.rotation.x = Math.PI / 2;
    grp.add(inner);
    // Winding coil rings around the main torus path
    for (let w = 0; w < 20; w++) {
      const angle = (w / 20) * Math.PI * 2;
      const wring = new THREE.Mesh(new THREE.TorusGeometry(r * 1.1, r * 0.22, 8, 16),
        new THREE.MeshBasicMaterial({ color }));
      wring.position.set(Math.cos(angle) * R, Math.sin(angle) * R, 0);
      wring.lookAt(0, 0, 0);
      wring.rotateX(Math.PI / 2);
      grp.add(wring);
    }
    // Ion field — orbiting particles
    for (let p = 0; p < 6; p++) {
      const pa = (p / 6) * Math.PI * 2;
      const ion = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8),
        new THREE.MeshBasicMaterial({ color: NEON[(p + i) % NEON.length] }));
      ion.position.set(Math.cos(pa) * R, Math.sin(pa) * R, 0);
      ion.userData = { angle: pa, speed: 0.02 + p * 0.005, R };
      grp.add(ion);
    }
    grp.add(new THREE.PointLight(color, 1.8, 45));

    grp.position.set(-140 + i * 40, -12 + Math.sin(i) * 22, -90 + i * 18);
    grp.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * 0.5);
    scene.add(grp);
    list.push({ grp, ry: 0.006 + i * 0.001, rx: 0.003, phase: i, ions: grp.children.filter(c => c.userData.speed) });
  }
  return list;
}

function addInventionBubbles(scene) {
  const defs = [
    { name: "MEG Generator",        geo: new THREE.TorusKnotGeometry(2.2, 0.6, 120, 18),  color: 0x00ffff },
    { name: "Scalar Transmitter",   geo: new THREE.TorusGeometry(2.5, 0.7, 20, 60),        color: 0xff00ff },
    { name: "Zero-Point Extractor", geo: new THREE.IcosahedronGeometry(3, 2),              color: 0x00ff88 },
    { name: "Anenergy Pump",        geo: new THREE.TorusKnotGeometry(2, 0.5, 80, 16, 3, 5), color: 0xff6600 },
    { name: "Prioré Device",        geo: new THREE.OctahedronGeometry(2.8, 1),             color: 0xffff00 },
    { name: "Torsion Generator",    geo: new THREE.DodecahedronGeometry(2.8, 1),           color: 0xff0088 },
    { name: "Resonance Cavity",     geo: new THREE.CylinderGeometry(1.2, 2, 5, 16),       color: 0x8800ff },
    { name: "BioEM Interface",      geo: new THREE.SphereGeometry(3, 16, 16),             color: 0x00aaff },
  ];
  const list = [];
  defs.forEach((d, i) => {
    const grp = new THREE.Group();
    // Outer bubble shell
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: d.color, emissive: d.color, emissiveIntensity: 0.25,
      transparent: true, opacity: 0.18,
      roughness: 0.0, metalness: 1.0, side: THREE.DoubleSide,
    });
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(6, 40, 40), bubbleMat));
    // Wire shell
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(6.1, 20, 20),
      new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, transparent: true, opacity: 0.18 })));
    // Inner invention device
    const device = new THREE.Mesh(d.geo, neonStdMat(d.color, 2.8));
    grp.add(device);
    // Orbiting ions around device
    for (let p = 0; p < 5; p++) {
      const ion = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshBasicMaterial({ color: NEON[(i + p) % NEON.length] }));
      ion.userData = { angle: (p / 5) * Math.PI * 2, orbitR: 4.5, speed: 0.02 + p * 0.007 };
      grp.add(ion);
    }
    // Point light
    grp.add(new THREE.PointLight(d.color, 1.5, 40));

    grp.position.set(-175 + i * 50, 8 - (i % 3) * 18, -55 - (i % 4) * 18);
    scene.add(grp);
    list.push({
      grp, device,
      ions: grp.children.filter(c => c.userData.speed),
      phase: i * 0.9, speed: 0.003 + i * 0.0008, floatAmp: 5 + i * 0.4, baseY: grp.position.y,
    });
  });
  return list;
}

function addIonField(scene) {
  const count = 500;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const vel = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 250;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
    vel[i * 3]     = (Math.random() - 0.5) * 0.04;
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    const c = new THREE.Color(NEON[Math.floor(Math.random() * NEON.length)]);
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color",    new THREE.BufferAttribute(col, 3));
  const mesh = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.4, vertexColors: true, sizeAttenuation: true }));
  scene.add(mesh);
  return { mesh, vel };
}

function addShootingStars(scene) {
  const list = [];
  for (let i = 0; i < 8; i++) {
    const color = Math.random() > 0.5 ? 0xffffff : NEON[Math.floor(Math.random() * NEON.length)];
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-50, -10, 0)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
    const line = new THREE.Line(geo, mat);
    line.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 120, -20);
    scene.add(line);
    list.push({ line, mat, life: Math.random() * 180, maxLife: 100 + Math.random() * 80, vx: 1.8 + Math.random() * 2, vy: -(Math.random() * 0.6 + 0.15) });
  }
  return list;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CosmicResearchBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000008);
    scene.fog = new THREE.FogExp2(0x000008, 0.0015);

    const camera = new THREE.PerspectiveCamera(72, mount.clientWidth / mount.clientHeight, 0.1, 4000);
    camera.position.set(0, 0, 90);

    // Lights
    scene.add(new THREE.AmbientLight(0x112244, 1.0));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(150, 150, 80);
    scene.add(sun);
    // Colored fill lights
    [[0x00ffff, 80, 50], [0xff00ff, -80, -50], [0x00ff88, 0, 80]].forEach(([c, x, y]) => {
      const pl = new THREE.PointLight(c, 0.8, 250);
      pl.position.set(x, y, 30);
      scene.add(pl);
    });

    // Build scene elements
    const stars      = addStarfield(scene);
    const mw         = addMilkyWay(scene);
    const planets    = addPlanets(scene);
    const blackHoles = addBlackHoles(scene);
    const asteroids  = addAsteroids(scene);
    const comets     = addComets(scene);
    const ufos       = addUFOs(scene);
    const rockets    = addRockets(scene);
    const platonics  = addPlatonicSolids(scene);
    const toroids    = addToroids(scene);
    const bubbles    = addInventionBubbles(scene);
    const { mesh: ionMesh, vel: ionVel } = addIonField(scene);
    const shooters   = addShootingStars(scene);

    // Resize
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Camera gentle drift
      camera.position.x = Math.sin(t * 0.035) * 18;
      camera.position.y = Math.cos(t * 0.022) * 10;
      camera.lookAt(0, 0, 0);

      stars.rotation.y += 0.00004;
      mw.rotation.y    += 0.00002;

      // Planets
      planets.forEach(p => { p.grp.rotateOnAxis(p.axis, p.speed); });

      // Black holes
      blackHoles.forEach(bh => {
        bh.grp.rotation.z += bh.speed;
        bh.grp.rotation.y += bh.speed * 0.25;
      });

      // Asteroids
      asteroids.forEach(a => {
        a.mesh.position.x += a.vx;
        a.mesh.position.y += a.vy;
        a.mesh.rotation.y += a.spin;
        if (a.mesh.position.x > 200)  a.mesh.position.x = -200;
        if (a.mesh.position.x < -200) a.mesh.position.x =  200;
        if (a.mesh.position.y > 100)  a.mesh.position.y = -100;
      });

      // Comets
      comets.forEach(c => {
        c.grp.position.x += c.vx;
        c.grp.position.y += c.vy;
        if (c.grp.position.x > 350) {
          c.grp.position.x = -350;
          c.grp.position.y = (Math.random() - 0.5) * 250;
        }
      });

      // UFOs
      ufos.forEach(u => {
        u.grp.position.y = u.baseY + Math.sin(t * 0.6 + u.phase) * 5;
        u.grp.position.x += Math.sin(t * u.speed * 8 + u.phase) * 0.04;
        u.grp.rotation.y += 0.012;
      });

      // Rockets
      rockets.forEach(r => {
        r.grp.position.y += r.vy;
        r.grp.position.x += Math.sin(t * 0.25 + r.phase) * 0.03;
        if (r.grp.position.y > 160) r.grp.position.y = -120;
      });

      // Platonic solids
      platonics.forEach(p => {
        p.grp.rotation.x += p.rx;
        p.grp.rotation.y += p.ry;
        p.grp.rotation.z += p.rz;
      });

      // Toroids + orbiting ions
      toroids.forEach((tor, i) => {
        tor.grp.rotation.y += tor.ry;
        tor.grp.rotation.x += tor.rx;
        tor.grp.position.y += Math.sin(t * 0.35 + tor.phase) * 0.015;
        tor.ions.forEach(ion => {
          ion.userData.angle += ion.userData.speed;
          ion.position.set(
            Math.cos(ion.userData.angle) * ion.userData.R,
            Math.sin(ion.userData.angle) * ion.userData.R,
            0
          );
        });
      });

      // Invention bubbles
      bubbles.forEach(b => {
        b.grp.position.y = b.baseY + Math.sin(t * 0.45 + b.phase) * b.floatAmp;
        b.grp.position.x += Math.sin(t * 0.12 + b.phase * 0.6) * 0.01;
        b.grp.rotation.y += b.speed;
        b.device.rotation.y += b.speed * 2.2;
        b.device.rotation.x += b.speed * 0.6;
        b.ions.forEach(ion => {
          ion.userData.angle += ion.userData.speed;
          ion.position.set(
            Math.cos(ion.userData.angle) * ion.userData.orbitR,
            Math.sin(ion.userData.angle * 0.7) * 2,
            Math.sin(ion.userData.angle) * ion.userData.orbitR,
          );
        });
      });

      // Ion field drift
      const ipos = ionMesh.geometry.attributes.position.array;
      for (let i = 0; i < 500; i++) {
        ipos[i * 3]     += ionVel[i * 3];
        ipos[i * 3 + 1] += ionVel[i * 3 + 1];
        ipos[i * 3 + 2] += ionVel[i * 3 + 2];
        if (Math.abs(ipos[i * 3])     > 130) ionVel[i * 3]     *= -1;
        if (Math.abs(ipos[i * 3 + 1]) > 65)  ionVel[i * 3 + 1] *= -1;
        if (Math.abs(ipos[i * 3 + 2]) > 65)  ionVel[i * 3 + 2] *= -1;
      }
      ionMesh.geometry.attributes.position.needsUpdate = true;

      // Shooting stars
      shooters.forEach(ss => {
        ss.life++;
        if (ss.life > ss.maxLife) {
          ss.life = 0;
          ss.line.position.set((Math.random() - 0.5) * 350, (Math.random() - 0.5) * 130, -20);
          ss.line.rotation.z = (Math.random() - 0.5) * 0.3;
        }
        const p = ss.life / ss.maxLife;
        ss.mat.opacity = (p < 0.15 ? p / 0.15 : p > 0.65 ? (1 - p) / 0.35 : 1.0) * 0.95;
        ss.line.position.x += ss.vx;
        ss.line.position.y += ss.vy;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: "#000008" }}
    />
  );
}