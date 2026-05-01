import * as THREE from "three";
import { NEON, neonMat, glowMat, wireframeMat, rand } from "./cosmicUtils";

const GOLD = 0xffd700;

// ── Dollar Signs ──────────────────────────────────────────────────────────────
function makeDollarSign(color) {
  const grp = new THREE.Group();
  // Vertical bar
  grp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 5, 12), neonMat(color, 2)));
  // S-curve rings (top + bottom)
  for (let r = 0; r < 2; r++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.22, 8, 32, Math.PI),
      neonMat(color, 2));
    ring.position.y = r === 0 ? 1.2 : -1.2;
    ring.rotation.z = r === 0 ? 0 : Math.PI;
    ring.rotation.y = r === 0 ? 0 : Math.PI;
    grp.add(ring);
  }
  grp.add(new THREE.PointLight(color, 1.2, 20));
  return grp;
}

// ── Satellite ─────────────────────────────────────────────────────────────────
function makeSatellite(color) {
  const grp = new THREE.Group();
  // Body box
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 1.5),
    new THREE.MeshStandardMaterial({ color: 0xaabbcc, roughness: 0.2, metalness: 0.9 })));
  // Solar panels (left + right)
  [-1, 1].forEach(side => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(3, 0.06, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x003388, roughness: 0.3, metalness: 0.5, emissive: 0x001133, emissiveIntensity: 0.5 }));
    panel.position.x = side * 2.3;
    grp.add(panel);
    // Panel grid lines
    for (let g = 0; g < 4; g++) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.07, 1.4),
        new THREE.MeshBasicMaterial({ color: 0x4488ff }));
      line.position.set(side * 2.3 + (g - 1.5) * 0.55, 0, 0);
      grp.add(line);
    }
  });
  // Dish antenna
  const dish = new THREE.Mesh(new THREE.ConeGeometry(0.7, 0.3, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.3, metalness: 0.8 }));
  dish.position.y = 0.8; dish.rotation.x = Math.PI;
  grp.add(dish);
  // Beacon light
  grp.add(new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8),
    new THREE.MeshBasicMaterial({ color })));
  grp.add(new THREE.PointLight(color, 1, 15));
  return grp;
}

// ── Flying Car ────────────────────────────────────────────────────────────────
function makeFlyingCar(color) {
  const grp = new THREE.Group();
  // Car body
  const body = new THREE.Mesh(
    (() => { const g = new THREE.BoxGeometry(4, 1.2, 2); return g; })(),
    new THREE.MeshStandardMaterial({ color, roughness: 0.2, metalness: 0.8, emissive: color, emissiveIntensity: 0.15 })
  );
  grp.add(body);
  // Roof
  const roof = new THREE.Mesh(
    (() => { const g = new THREE.BoxGeometry(2.5, 0.8, 1.8); return g; })(),
    new THREE.MeshStandardMaterial({ color, roughness: 0.1, metalness: 0.9 })
  );
  roof.position.y = 1.0;
  grp.add(roof);
  // Windshield
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x88ddff, transparent: true, opacity: 0.5, roughness: 0, metalness: 0.3 })));
  // Wheels (hovering)
  [[-1.4, -0.7, 1.1], [1.4, -0.7, 1.1], [-1.4, -0.7, -1.1], [1.4, -0.7, -1.1]].forEach(p => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.18, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 }));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(...p);
    grp.add(wheel);
  });
  // Thruster jets (4)
  [[-1.5, -0.9, 0.9], [1.5, -0.9, 0.9], [-1.5, -0.9, -0.9], [1.5, -0.9, -0.9]].forEach(p => {
    const jet = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1, 10, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    jet.position.set(...p); jet.rotation.x = Math.PI;
    grp.add(jet);
    grp.add(new THREE.PointLight(0x00aaff, 0.5, 6));
  });
  // Neon underglow
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.04, 2.2),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4 })));
  grp.add(new THREE.PointLight(color, 1.5, 25));
  return grp;
}

// ── Pig with Wings ────────────────────────────────────────────────────────────
function makePigWithWings() {
  const grp = new THREE.Group();
  const pink = 0xff88aa;
  // Body
  grp.add(new THREE.Mesh(
    (() => { const g = new THREE.SphereGeometry(1.8, 16, 12); g.scale(1.3, 1, 1); return g; })(),
    new THREE.MeshStandardMaterial({ color: pink, roughness: 0.6 })
  ));
  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12),
    new THREE.MeshStandardMaterial({ color: pink, roughness: 0.6 }));
  head.position.set(1.8, 0.4, 0);
  grp.add(head);
  // Snout
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.3, 12),
    new THREE.MeshStandardMaterial({ color: 0xff99bb, roughness: 0.5 }));
  snout.position.set(2.7, 0.35, 0); snout.rotation.z = Math.PI / 2;
  grp.add(snout);
  // Nostrils
  [-0.15, 0.15].forEach(y => {
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xcc5577 }))
    ).position?.set?.(2.88, 0.35 + y, 0.1);
    // Fix: add separately
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xcc5577 }));
    n.position.set(2.88, 0.35 + y, 0.1);
    grp.add(n);
  });
  // Eyes
  [-0.35, 0.35].forEach(z => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x111111 }));
    eye.position.set(2.55, 0.7, z);
    grp.add(eye);
  });
  // Ears
  [-1, 1].forEach(side => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 8),
      new THREE.MeshStandardMaterial({ color: pink }));
    ear.position.set(1.6, 1.2, side * 0.7);
    ear.rotation.z = side * 0.3;
    grp.add(ear);
  });
  // Wings (feathered)
  [-1, 1].forEach(side => {
    const wing = new THREE.Group();
    const wMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, transparent: true, opacity: 0.9 });
    for (let f = 0; f < 5; f++) {
      const feather = new THREE.Mesh(
        (() => { const g = new THREE.SphereGeometry(0.3 + f * 0.1, 8, 6); g.scale(0.5, 2 + f * 0.5, 0.3); return g; })(),
        wMat
      );
      feather.position.set(-0.3 + f * 0.25, 0, 0);
      feather.rotation.z = -0.3 + f * 0.1;
      wing.add(feather);
    }
    wing.position.set(-0.5, 0.8, side * 1.9);
    wing.rotation.y = side * 0.4;
    wing.rotation.x = -0.3;
    grp.add(wing);
  });
  // Curly tail
  const tailGeo = new THREE.TorusGeometry(0.4, 0.1, 6, 16, Math.PI * 1.5);
  const tail = new THREE.Mesh(tailGeo, new THREE.MeshStandardMaterial({ color: pink }));
  tail.position.set(-2.2, 0, 0); tail.rotation.y = Math.PI / 2;
  grp.add(tail);
  grp.add(new THREE.PointLight(pink, 1, 15));
  return grp;
}

// ── Unicorn ───────────────────────────────────────────────────────────────────
function makeUnicorn() {
  const grp = new THREE.Group();
  const white = 0xfff0ff;
  // Body
  const body = new THREE.Mesh(
    (() => { const g = new THREE.SphereGeometry(2, 16, 12); g.scale(1.8, 1, 1.2); return g; })(),
    new THREE.MeshStandardMaterial({ color: white, roughness: 0.3, metalness: 0.1 })
  );
  grp.add(body);
  // Neck
  const neck = new THREE.Mesh(
    (() => { const g = new THREE.CylinderGeometry(0.7, 0.9, 2.5, 12); return g; })(),
    new THREE.MeshStandardMaterial({ color: white, roughness: 0.3 })
  );
  neck.position.set(2, 1.5, 0); neck.rotation.z = -0.5;
  grp.add(neck);
  // Head
  const head = new THREE.Mesh(
    (() => { const g = new THREE.SphereGeometry(0.9, 16, 12); g.scale(1.4, 1, 1); return g; })(),
    new THREE.MeshStandardMaterial({ color: white, roughness: 0.3 })
  );
  head.position.set(3.2, 2.8, 0);
  grp.add(head);
  // HORN (spiral)
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.2, 2, 12),
    neonMat(GOLD, 3));
  horn.position.set(4.0, 3.8, 0); horn.rotation.z = -0.3;
  grp.add(horn);
  // Mane (layered rings)
  for (let m = 0; m < 5; m++) {
    const maneColor = [0xff88ff, 0xffaaff, 0xcc88ff, 0x88ffff, 0xffff88][m];
    const mane = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.18, 6, 20, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: maneColor, roughness: 0.5 }));
    mane.position.set(2.8 - m * 0.2, 2.5 - m * 0.3, 0);
    mane.rotation.z = 0.5 + m * 0.1;
    grp.add(mane);
  }
  // Legs
  [[-1.2, -2, 0.7], [1.2, -2, 0.7], [-1.2, -2, -0.7], [1.2, -2, -0.7]].forEach(p => {
    grp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 2.5, 10),
      new THREE.MeshStandardMaterial({ color: white, roughness: 0.3 })
    )).position?.set?.(...p);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 2.5, 10),
      new THREE.MeshStandardMaterial({ color: white, roughness: 0.3 }));
    leg.position.set(...p);
    grp.add(leg);
  });
  // Eyes
  [-0.4, 0.4].forEach(z => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x8800ff }));
    eye.position.set(3.9, 2.85, z);
    grp.add(eye);
  });
  // Glitter aura
  grp.add(new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xff88ff, transparent: true, opacity: 0.04 })));
  grp.add(new THREE.PointLight(0xff88ff, 1.5, 25));
  grp.add(new THREE.PointLight(GOLD, 1, 15));
  return grp;
}

// ── Egyptian Pyramid ──────────────────────────────────────────────────────────
function makePyramid(color) {
  const grp = new THREE.Group();
  // Pyramid body
  grp.add(new THREE.Mesh(new THREE.ConeGeometry(6, 8, 4),
    new THREE.MeshStandardMaterial({ color: 0xddbb66, roughness: 0.7, metalness: 0.2, emissive: color, emissiveIntensity: 0.1 })));
  // Wireframe overlay
  grp.add(new THREE.Mesh(new THREE.ConeGeometry(6.02, 8.02, 4),
    wireframeMat(color, 0.3)));
  // Eye of Ra at top
  const eyeGrp = new THREE.Group();
  eyeGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.MeshBasicMaterial({ color: GOLD })));
  eyeGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: color })));
  eyeGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0x000000 })));
  eyeGrp.position.y = 4.5;
  grp.add(eyeGrp);
  // Glowing base edges
  const baseSize = 6;
  const corners = [
    [baseSize, 0, baseSize], [-baseSize, 0, baseSize],
    [-baseSize, 0, -baseSize], [baseSize, 0, -baseSize],
  ];
  corners.forEach((c, i) => {
    const next = corners[(i + 1) % 4];
    const pts = [new THREE.Vector3(...c), new THREE.Vector3(...next)];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    grp.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })));
  });
  // Sacred symbols around base
  for (let s = 0; s < 4; s++) {
    const a = (s / 4) * Math.PI * 2 + Math.PI / 4;
    const sym = new THREE.Mesh(new THREE.TetrahedronGeometry(0.8, 0),
      neonMat(GOLD, 2));
    sym.position.set(Math.cos(a) * 4, -3.8, Math.sin(a) * 4);
    grp.add(sym);
  }
  grp.add(new THREE.PointLight(color, 1.5, 40));
  grp.add(new THREE.PointLight(GOLD, 0.8, 20));
  return grp;
}

// ── Egyptian God (Anubis-style) ───────────────────────────────────────────────
function makeEgyptianGod(color) {
  const grp = new THREE.Group();
  const gold = GOLD;
  // Body (robed figure)
  grp.add(new THREE.Mesh(
    (() => { const g = new THREE.CylinderGeometry(0.8, 1.5, 5, 12); return g; })(),
    new THREE.MeshStandardMaterial({ color: 0x222211, roughness: 0.5, metalness: 0.3 })
  ));
  // Gold collar
  grp.add(new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.25, 6, 32),
    neonMat(gold, 1.5)));
  grp.children[grp.children.length - 1].position.y = 2.2;
  const collar = grp.children[grp.children.length - 1];
  collar.position.y = 2.2;
  // Chest collar fixed
  const collarMesh = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.25, 6, 32), neonMat(gold, 1.5));
  collarMesh.position.y = 2.2;
  grp.add(collarMesh);
  // Head (jackal / animal head)
  const head = new THREE.Mesh(
    (() => { const g = new THREE.SphereGeometry(1, 16, 12); g.scale(0.7, 1.1, 0.9); return g; })(),
    new THREE.MeshStandardMaterial({ color: 0x111100, roughness: 0.4, metalness: 0.5 })
  );
  head.position.y = 3.8;
  grp.add(head);
  // Long animal ears/snout
  const snout = new THREE.Mesh(
    (() => { const g = new THREE.CylinderGeometry(0.25, 0.15, 2, 8); return g; })(),
    new THREE.MeshStandardMaterial({ color: 0x111100, roughness: 0.5 })
  );
  snout.position.set(0.8, 4.0, 0); snout.rotation.z = -Math.PI / 3;
  grp.add(snout);
  // Tall pointed ears
  [-0.5, 0.5].forEach(x => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x111100 }));
    ear.position.set(x, 5.2, 0);
    grp.add(ear);
  });
  // Staff
  const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 7, 8),
    neonMat(gold, 1.5));
  staff.position.set(2, 0, 0);
  grp.add(staff);
  // Ankh atop staff
  const ankh = new THREE.Group();
  ankh.add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 8, 24),
    neonMat(gold, 2)));
  ankh.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 8),
    neonMat(gold, 2)));
  ankh.children[1].position.y = -1.0;
  for (let s = 0; s < 2; s++) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8),
      neonMat(gold, 2));
    arm.rotation.z = Math.PI / 2;
    arm.position.y = -0.3 + s * 0.6 - 0.3;
    arm.position.x = 0;
    ankh.add(arm);
  }
  const crossH = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 8), neonMat(gold, 2));
  crossH.rotation.z = Math.PI / 2; crossH.position.y = -0.8;
  ankh.add(crossH);
  ankh.position.set(2, 3.8, 0);
  grp.add(ankh);
  // Eyes (glowing)
  [-0.25, 0.25].forEach(x => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 10),
      new THREE.MeshBasicMaterial({ color }));
    eye.position.set(x + 0.4, 4.1, 0.7);
    grp.add(eye);
  });
  grp.add(new THREE.PointLight(color, 1.5, 30));
  grp.add(new THREE.PointLight(gold, 1, 20));
  return grp;
}

// ── Microscope ────────────────────────────────────────────────────────────────
function makeMicroscope(color) {
  const grp = new THREE.Group();
  const silver = 0xaabbcc;
  // Base
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 1.8),
    new THREE.MeshStandardMaterial({ color: silver, roughness: 0.2, metalness: 0.9 })));
  // Arm
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 5, 12),
    new THREE.MeshStandardMaterial({ color: silver, roughness: 0.2, metalness: 0.9 }));
  arm.position.set(-0.5, 2.7, 0);
  grp.add(arm);
  // Stage
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, 1.5),
    new THREE.MeshStandardMaterial({ color: silver, roughness: 0.2, metalness: 0.9 })
  )).position?.set?.(-0.5, 1.5, 0);
  const stage = new THREE.Mesh(new THREE.BoxGeometry(2, 0.15, 1.5),
    new THREE.MeshStandardMaterial({ color: silver, roughness: 0.2, metalness: 0.9 }));
  stage.position.set(-0.5, 1.5, 0);
  grp.add(stage);
  // Turret
  const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.3, 0.6, 12),
    new THREE.MeshStandardMaterial({ color: 0x333344, roughness: 0.3, metalness: 0.8 }));
  turret.position.set(-0.5, 3.2, 0);
  grp.add(turret);
  // Objective lenses
  for (let l = 0; l < 3; l++) {
    const a = (l / 3) * Math.PI * 2;
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.1, 0.8, 10),
      new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.1, metalness: 0.8 }));
    lens.position.set(-0.5 + Math.cos(a) * 0.35, 2.8 - 0.4, Math.sin(a) * 0.35);
    grp.add(lens);
  }
  // Eyepiece
  const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.25, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.2, metalness: 0.9 }));
  eyepiece.position.set(0.3, 4.5, 0); eyepiece.rotation.z = -0.4;
  grp.add(eyepiece);
  // Lens glow
  grp.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 })));
  grp.children[grp.children.length - 1].position.set(-0.5, 0.9, 0);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }));
  glow.position.set(-0.5, 0.9, 0);
  grp.add(glow);
  grp.add(new THREE.PointLight(color, 1, 15));
  return grp;
}

// ── Light Bulb ────────────────────────────────────────────────────────────────
function makeLightBulb(color) {
  const grp = new THREE.Group();
  // Glass globe
  grp.add(new THREE.Mesh(
    (() => { const g = new THREE.SphereGeometry(1.2, 20, 16); g.scale(1, 1.2, 1); return g; })(),
    new THREE.MeshStandardMaterial({ color: 0xffffee, transparent: true, opacity: 0.25, roughness: 0, metalness: 0.1, emissive: color, emissiveIntensity: 0.6 })
  ));
  // Filament (spiral wire)
  const filPts = [];
  for (let i = 0; i < 60; i++) {
    const t = (i / 60) * Math.PI * 6;
    filPts.push(new THREE.Vector3(Math.cos(t) * 0.25, -0.4 + i * 0.016, Math.sin(t) * 0.25));
  }
  grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(filPts),
    new THREE.LineBasicMaterial({ color: GOLD })));
  // Base ridges
  for (let r = 0; r < 5; r++) {
    const ridge = new THREE.Mesh(new THREE.TorusGeometry(0.55 - r * 0.02, 0.06, 6, 24),
      new THREE.MeshStandardMaterial({ color: 0x888866, roughness: 0.3, metalness: 0.8 }));
    ridge.position.y = -1.1 - r * 0.15;
    grp.add(ridge);
  }
  // Screw base
  grp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.7, 16),
    new THREE.MeshStandardMaterial({ color: 0x888866, roughness: 0.2, metalness: 0.9 })));
  grp.children[grp.children.length - 1].position.y = -1.85;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.7, 16),
    new THREE.MeshStandardMaterial({ color: 0x888866, roughness: 0.2, metalness: 0.9 }));
  base.position.y = -1.85;
  grp.add(base);
  // Glow
  grp.add(new THREE.PointLight(color, 3, 20));
  return grp;
}

// ── Textbook ──────────────────────────────────────────────────────────────────
function makeTextbook(color) {
  const grp = new THREE.Group();
  // Book body
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 3.5, 0.5),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.0 })));
  // Spine
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.5, 0.55),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.7).getHex(), roughness: 0.8 })));
  grp.children[grp.children.length - 1].position.x = -1.32;
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.5, 0.55),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.7).getHex(), roughness: 0.8 }));
  spine.position.x = -1.32;
  grp.add(spine);
  // Cover circuit pattern lines
  for (let l = 0; l < 6; l++) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 0.01),
      new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.5 }));
    line.position.set(0.2, -1.2 + l * 0.5, 0.26);
    grp.add(line);
  }
  // Title symbol (glowing octahedron on cover)
  grp.add(new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0),
    neonMat(GOLD, 2)));
  grp.children[grp.children.length - 1].position.set(0, 0.8, 0.28);
  const icon = new THREE.Mesh(new THREE.OctahedronGeometry(0.45, 0), neonMat(GOLD, 2));
  icon.position.set(0, 0.8, 0.28);
  grp.add(icon);
  grp.add(new THREE.PointLight(color, 0.8, 12));
  return grp;
}

// ── Lab Coat Figure ───────────────────────────────────────────────────────────
function makeLabCoat(color) {
  const grp = new THREE.Group();
  // Lab coat body (white)
  grp.add(new THREE.Mesh(
    (() => { const g = new THREE.CylinderGeometry(1.2, 1.5, 4.5, 12); return g; })(),
    new THREE.MeshStandardMaterial({ color: 0xf0f0ff, roughness: 0.5 })
  ));
  // Collar lapels
  [-0.4, 0.4].forEach(x => {
    const lapel = new THREE.Mesh(
      (() => { const g = new THREE.BoxGeometry(0.5, 1.5, 0.1); return g; })(),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
    );
    lapel.position.set(x, 1.5, 1.1); lapel.rotation.z = x > 0 ? -0.3 : 0.3;
    grp.add(lapel);
  });
  // Pocket
  grp.add(new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xddddee })));
  grp.children[grp.children.length - 1].position.set(-0.6, 0.5, 1.2);
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xddddee }));
  pocket.position.set(-0.6, 0.5, 1.2);
  grp.add(pocket);
  // Pen in pocket
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 8),
    new THREE.MeshBasicMaterial({ color }));
  pen.position.set(-0.6, 0.85, 1.25);
  grp.add(pen);
  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0xffe8cc, roughness: 0.5 }));
  head.position.y = 3.5;
  grp.add(head);
  // Hair
  const hair = new THREE.Mesh(
    (() => { const g = new THREE.SphereGeometry(0.95, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.45); return g; })(),
    new THREE.MeshStandardMaterial({ color: 0x554433, roughness: 0.9 })
  );
  hair.position.y = 3.5; hair.rotation.x = Math.PI;
  grp.add(hair);
  // Eyes + glasses
  [-0.3, 0.3].forEach(x => {
    const glass = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 6, 20),
      new THREE.MeshBasicMaterial({ color: 0x333333 }));
    glass.position.set(x, 3.55, 0.85);
    grp.add(glass);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0x88aaff, transparent: true, opacity: 0.3 }));
    lens.position.set(x, 3.55, 0.88);
    grp.add(lens);
  });
  // Arms
  [-1, 1].forEach(side => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.22, 3, 10),
      new THREE.MeshStandardMaterial({ color: 0xf0f0ff, roughness: 0.5 }));
    arm.position.set(side * 1.6, 0.3, 0); arm.rotation.z = side * 0.3;
    grp.add(arm);
    // Hand holding flask
    const flask = new THREE.Group();
    flask.add(new THREE.Mesh(
      (() => { const g = new THREE.CylinderGeometry(0.2, 0.35, 0.7, 10); return g; })(),
      new THREE.MeshStandardMaterial({ color: 0x88ffaa, transparent: true, opacity: 0.6, roughness: 0, metalness: 0.1 })
    ));
    flask.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.18, 0.4, 10),
      new THREE.MeshStandardMaterial({ color: 0x88ffaa, transparent: true, opacity: 0.6 })));
    flask.children[1].position.y = 0.55;
    flask.position.set(side * 2.1, -1.2, 0.4);
    grp.add(flask);
    grp.add(new THREE.PointLight(0x88ffaa, 0.5, 8));
  });
  grp.add(new THREE.PointLight(color, 1, 20));
  return grp;
}

// ── Coil / Tesla Coil ─────────────────────────────────────────────────────────
function makeTeslaCoil(color) {
  const grp = new THREE.Group();
  // Base platform
  grp.add(new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.8, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0x443322, roughness: 0.6, metalness: 0.4 })));
  // Primary coil (thick torus)
  for (let r = 0; r < 4; r++) {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(1.8 - r * 0.15, 0.22, 8, 40),
      new THREE.MeshStandardMaterial({ color: 0xcc8800, roughness: 0.3, metalness: 0.9 }));
    coil.position.y = 0.8 + r * 0.35;
    grp.add(coil);
  }
  // Secondary coil (tall wound)
  for (let r = 0; r < 12; r++) {
    const sec = new THREE.Mesh(new THREE.TorusGeometry(1.0 - r * 0.03, 0.1, 6, 32),
      new THREE.MeshStandardMaterial({ color: 0xcc8800, roughness: 0.2, metalness: 0.95 }));
    sec.position.y = 2.3 + r * 0.4;
    grp.add(sec);
  }
  // Toroidal capacitor (top)
  const topTorus = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.55, 16, 60),
    new THREE.MeshStandardMaterial({ color: 0xbbbbcc, roughness: 0.1, metalness: 0.95 }));
  topTorus.position.y = 7.5; topTorus.rotation.x = Math.PI / 2;
  grp.add(topTorus);
  // Lightning bolts (spiky lines)
  for (let b = 0; b < 6; b++) {
    const a = (b / 6) * Math.PI * 2;
    const bPts = [];
    let x = Math.cos(a) * 1.5, y = 7.5, z = Math.sin(a) * 1.5;
    bPts.push(new THREE.Vector3(x, y, z));
    for (let seg = 0; seg < 5; seg++) {
      x += (Math.random() - 0.5) * 1.5 + Math.cos(a) * 0.8;
      y += (Math.random() - 0.5) * 1.5;
      z += (Math.random() - 0.5) * 1.5 + Math.sin(a) * 0.8;
      bPts.push(new THREE.Vector3(x, y, z));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(bPts);
    grp.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 })));
  }
  grp.add(new THREE.PointLight(color, 3, 40));
  grp.add(new THREE.PointLight(0xffffff, 1, 20));
  return grp;
}

// ── 12D Polytope (hypercube / 24-cell approximation) ─────────────────────────
function make12DPolytope(color) {
  const grp = new THREE.Group();
  const r = 7;
  const vertices = [];
  // Generate vertices of a 4D hypercube projected to 3D
  for (let i = 0; i < 16; i++) {
    const w = (i & 1) ? 1 : -1;
    const x = (i & 2) ? 1 : -1;
    const y = (i & 4) ? 1 : -1;
    const z = (i & 8) ? 1 : -1;
    // Simple 4D → 3D projection
    const scale = 1 / (2 - w * 0.4);
    vertices.push(new THREE.Vector3(x * r * scale, y * r * scale, z * r * scale));
  }
  // Draw edges (connect vertices that differ by 1 bit)
  const linePts = [];
  for (let a = 0; a < vertices.length; a++) {
    for (let b = a + 1; b < vertices.length; b++) {
      if (popcount(a ^ b) === 1) {
        linePts.push(vertices[a], vertices[b]);
      }
    }
  }
  const geo = new THREE.BufferGeometry().setFromPoints(linePts);
  grp.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 })));
  // Vertex spheres
  vertices.forEach(v => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8),
      neonMat(color, 2.5));
    s.position.copy(v);
    grp.add(s);
  });
  // Inner rotating octahedron
  grp.add(new THREE.Mesh(new THREE.OctahedronGeometry(r * 0.4, 0), wireframeMat(color, 0.4)));
  grp.add(new THREE.PointLight(color, 1.5, 40));
  return grp;
}
function popcount(n) { let c = 0; while (n) { c += n & 1; n >>= 1; } return c; }

// ── Star Tetrahedron (Merkaba) ────────────────────────────────────────────────
function makeStarTetrahedron(color) {
  const grp = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const tet = new THREE.Mesh(new THREE.TetrahedronGeometry(6, 0), glowMat(color, 0.2));
    const wire = new THREE.Mesh(new THREE.TetrahedronGeometry(6, 0), wireframeMat(color));
    if (i === 1) { tet.rotation.x = Math.PI; tet.rotation.z = Math.PI / 3; wire.rotation.x = Math.PI; wire.rotation.z = Math.PI / 3; }
    grp.add(tet, wire);
  }
  // Inner rotating sphere
  grp.add(new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), neonMat(color, 3)));
  // Orbiting tetrahedra
  for (let o = 0; o < 4; o++) {
    const a = (o / 4) * Math.PI * 2;
    const mini = new THREE.Mesh(new THREE.TetrahedronGeometry(1.5, 0), neonMat(NEON[(o * 3) % NEON.length], 2));
    mini.position.set(Math.cos(a) * 8, Math.sin(a) * 3, Math.sin(a) * 8);
    mini.userData = { orbitAngle: a, orbitSpeed: 0.015 + o * 0.005 };
    grp.add(mini);
  }
  grp.add(new THREE.PointLight(color, 2, 50));
  return grp;
}

// ── Main export ───────────────────────────────────────────────────────────────
export function buildWonderObjects(scene) {
  const list = [];

  // Dollar signs (6)
  const dollarColors = [0x00ff44, 0xffdd00, 0x00ffaa, 0xff4400, 0xaaffaa, 0xffff00];
  dollarColors.forEach((c, i) => {
    const grp = makeDollarSign(c);
    grp.position.set(-250 + i * 100, rand(-20, 30), rand(-200, -80));
    grp.scale.setScalar(rand(1.5, 3));
    scene.add(grp);
    list.push({ grp, rx: 0.003, ry: rand(0.005, 0.015), rz: 0.002, phase: i * 1.2, baseY: grp.position.y });
  });

  // Satellites (5)
  for (let i = 0; i < 5; i++) {
    const grp = makeSatellite(NEON[(i * 4) % NEON.length]);
    grp.position.set(rand(-300, 300), rand(30, 80), rand(-300, -100));
    grp.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, 0.5));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.004, rz: 0.001, phase: i, baseY: grp.position.y });
  }

  // Flying cars (4)
  const carColors = [0xff2244, 0x00aaff, 0xffaa00, 0x00ff88];
  carColors.forEach((c, i) => {
    const grp = makeFlyingCar(c);
    grp.position.set(-150 + i * 100, rand(10, 40), rand(-150, -50));
    grp.scale.setScalar(rand(2, 3.5));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.003, rz: 0, phase: i * 2.1, baseY: grp.position.y, flyX: rand(-0.02, 0.02) });
  });

  // Pigs with wings (3)
  for (let i = 0; i < 3; i++) {
    const grp = makePigWithWings();
    grp.position.set(rand(-200, 200), rand(20, 50), rand(-120, -40));
    grp.scale.setScalar(rand(2.5, 4));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.005, rz: 0, phase: i * 3, baseY: grp.position.y });
  }

  // Unicorns (2)
  for (let i = 0; i < 2; i++) {
    const grp = makeUnicorn();
    grp.position.set(i === 0 ? -180 : 180, rand(5, 25), rand(-100, -30));
    grp.scale.setScalar(rand(2, 3));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.004, rz: 0, phase: i * 4, baseY: grp.position.y });
  }

  // Pyramids (4)
  const pyramidColors = [0xffcc00, 0xff6600, 0x00ffff, 0xff00ff];
  pyramidColors.forEach((c, i) => {
    const grp = makePyramid(c);
    grp.position.set(-220 + i * 150, rand(-30, -10), rand(-300, -150));
    grp.scale.setScalar(rand(2.5, 5));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.002 + i * 0.001, rz: 0, phase: i, baseY: grp.position.y });
  });

  // Egyptian gods (3)
  const godColors = [GOLD, 0x00ffff, 0xff00ff];
  godColors.forEach((c, i) => {
    const grp = makeEgyptianGod(c);
    grp.position.set(-100 + i * 100, rand(-10, 20), rand(-200, -80));
    grp.scale.setScalar(rand(3, 5));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.003, rz: 0, phase: i * 1.5, baseY: grp.position.y });
  });

  // Microscopes (4)
  const scopeColors = [0x00ffff, 0xff00ff, 0x00ff88, 0xffff00];
  scopeColors.forEach((c, i) => {
    const grp = makeMicroscope(c);
    grp.position.set(-180 + i * 120, rand(-15, 15), rand(-180, -60));
    grp.scale.setScalar(rand(2.5, 4));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.004, rz: 0, phase: i * 2, baseY: grp.position.y });
  });

  // Light bulbs (8) — scattered everywhere
  for (let i = 0; i < 8; i++) {
    const grp = makeLightBulb(NEON[(i * 2) % NEON.length]);
    grp.position.set(rand(-280, 280), rand(-30, 60), rand(-250, -30));
    grp.scale.setScalar(rand(2, 4));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.006, rz: 0.002, phase: i * 0.9, baseY: grp.position.y });
  }

  // Textbooks (6)
  const bookColors = [0xff4444, 0x4488ff, 0x44ff88, 0xffaa22, 0xaa44ff, 0xff44aa];
  bookColors.forEach((c, i) => {
    const grp = makeTextbook(c);
    grp.position.set(-250 + i * 100, rand(-20, 40), rand(-200, -60));
    grp.rotation.set(rand(-0.3, 0.3), rand(0, Math.PI * 2), rand(-0.2, 0.2));
    grp.scale.setScalar(rand(2, 3.5));
    scene.add(grp);
    list.push({ grp, rx: 0.001, ry: 0.005, rz: 0.001, phase: i * 1.8, baseY: grp.position.y });
  });

  // Lab coats (3)
  const coatColors = [0x00aaff, 0xff4488, 0x44ff88];
  coatColors.forEach((c, i) => {
    const grp = makeLabCoat(c);
    grp.position.set(-100 + i * 100, rand(-10, 15), rand(-160, -60));
    grp.scale.setScalar(rand(2, 3.5));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.003, rz: 0, phase: i * 2.5, baseY: grp.position.y });
  });

  // Tesla coils (5)
  const coilColors = [0x00ffff, 0xff00ff, 0xffff00, 0xff6600, 0x00ff88];
  coilColors.forEach((c, i) => {
    const grp = makeTeslaCoil(c);
    grp.position.set(-200 + i * 100, rand(-20, 5), rand(-220, -80));
    grp.scale.setScalar(rand(1.5, 3));
    scene.add(grp);
    list.push({ grp, rx: 0, ry: 0.005, rz: 0, phase: i, baseY: grp.position.y });
  });

  // 12D Polytopes (4) — big complex structures
  const polyColors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff88];
  polyColors.forEach((c, i) => {
    const grp = make12DPolytope(c);
    grp.position.set(-200 + i * 140, rand(-30, 30), rand(-350, -150));
    grp.scale.setScalar(rand(1.2, 2));
    scene.add(grp);
    list.push({ grp, rx: rand(0.001, 0.004), ry: rand(0.003, 0.008), rz: rand(0.001, 0.003), phase: i, baseY: grp.position.y });
  });

  // Star Tetrahedra / Merkabas (6)
  const merkColors = [GOLD, 0x00ffff, 0xff00ff, 0x00ff88, 0xff6600, 0x8800ff];
  merkColors.forEach((c, i) => {
    const grp = makeStarTetrahedron(c);
    grp.position.set(-250 + i * 100, rand(-40, 40), rand(-300, -100));
    grp.scale.setScalar(rand(0.8, 1.8));
    scene.add(grp);
    list.push({ grp, rx: rand(0.002, 0.006), ry: rand(0.005, 0.012), rz: rand(0.001, 0.004), phase: i * 1.3, baseY: grp.position.y });
  });

  return list;
}

export function tickWonderObjects(list, t) {
  list.forEach((item, idx) => {
    item.grp.rotation.x += item.rx;
    item.grp.rotation.y += item.ry;
    item.grp.rotation.z += item.rz;
    item.grp.position.y = item.baseY + Math.sin(t * 0.4 + item.phase) * 4;
    if (item.flyX) item.grp.position.x += Math.sin(t * 0.15 + item.phase) * 0.08;
  });
}