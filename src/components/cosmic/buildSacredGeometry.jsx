import * as THREE from "three";
import { NEON, neonMat, wireframeMat, glowMat, rand, GOLD, SACRED_GOLD } from "./cosmicUtils";

// All platonic solids + sacred geometry forms
export function buildSacredGeometry(scene) {
  const list = [];

  // ── 1. All 5 Platonic Solids (large, glowing) ──────────────────────────────
  const platonicDefs = [
    { geo: new THREE.TetrahedronGeometry(9),    name: "Tetrahedron",   color: 0xff0088 },
    { geo: new THREE.OctahedronGeometry(9),     name: "Octahedron",    color: 0x00ffff },
    { geo: new THREE.IcosahedronGeometry(9),    name: "Icosahedron",   color: 0x00ff88 },
    { geo: new THREE.DodecahedronGeometry(9),   name: "Dodecahedron",  color: 0xff6600 },
    { geo: new THREE.BoxGeometry(13, 13, 13),   name: "Hexahedron",    color: 0x8800ff },
  ];
  platonicDefs.forEach((d, i) => {
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(d.geo, glowMat(d.color, 0.1)));
    grp.add(new THREE.Mesh(d.geo, wireframeMat(d.color)));
    // Outer glow shell
    const outerGeo = d.geo.clone();
    outerGeo.scale(1.08, 1.08, 1.08);
    grp.add(new THREE.Mesh(outerGeo, wireframeMat(d.color, 0.18)));
    // Inner core sphere
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(2, 16, 16), neonMat(d.color, 3)));
    grp.add(new THREE.PointLight(d.color, 2, 50));
    grp.position.set(-120 + i * 60, 20 - i * 10, -80 + i * 10);
    scene.add(grp);
    list.push({ grp, rx: rand(0.003, 0.009), ry: rand(0.005, 0.012), rz: rand(0.001, 0.004) });
  });

  // ── 2. Merkaba (Star Tetrahedron) ─────────────────────────────────────────
  const merkPos = [[-60, 35, -40], [80, -20, -60], [0, 50, -30]];
  merkPos.forEach((pos, idx) => {
    const grp = new THREE.Group();
    const col = [GOLD, 0x00ffff, 0xff00ff][idx];
    const t1 = new THREE.Mesh(new THREE.TetrahedronGeometry(8), glowMat(col, 0.15));
    const t2 = new THREE.Mesh(new THREE.TetrahedronGeometry(8), glowMat(col, 0.15));
    t2.rotation.x = Math.PI; t2.rotation.y = Math.PI;
    const w1 = new THREE.Mesh(new THREE.TetrahedronGeometry(8), wireframeMat(col));
    const w2 = new THREE.Mesh(new THREE.TetrahedronGeometry(8), wireframeMat(col));
    w2.rotation.x = Math.PI; w2.rotation.y = Math.PI;
    grp.add(t1, t2, w1, w2);
    grp.add(new THREE.PointLight(col, 1.5, 40));
    grp.position.set(...pos);
    scene.add(grp);
    list.push({ grp, rx: 0.004, ry: 0.008 + idx * 0.002, rz: 0.003 });
  });

  // ── 3. Flower of Life rings ───────────────────────────────────────────────
  [[-90, -30, -50], [110, 40, -70], [-20, -55, -45]].forEach((pos, fi) => {
    const grp = new THREE.Group();
    const col = [SACRED_GOLD, 0x00ffff, 0xff00ff][fi];
    // Central ring
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(5, 0.15, 8, 48), neonMat(col, 2)));
    // 6 surrounding petals
    for (let p = 0; p < 6; p++) {
      const angle = (p / 6) * Math.PI * 2;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5, 0.12, 8, 48), neonMat(col, 1.5));
      ring.position.set(Math.cos(angle) * 5, Math.sin(angle) * 5, 0);
      grp.add(ring);
    }
    // Outer circle
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(10, 0.18, 8, 64), neonMat(col, 1.2)));
    grp.add(new THREE.PointLight(col, 1.2, 35));
    grp.position.set(...pos);
    scene.add(grp);
    list.push({ grp, rx: 0.001, ry: 0.006 + fi * 0.002, rz: 0.002 });
  });

  // ── 4. Sri Yantra triangles ───────────────────────────────────────────────
  [[150, -40, -80], [-140, 50, -90]].forEach((pos, si) => {
    const grp = new THREE.Group();
    const col = si === 0 ? GOLD : 0xff00ff;
    // Layered triangles pointing up and down
    for (let layer = 0; layer < 4; layer++) {
      const scale = 1 - layer * 0.2;
      const up = new THREE.Mesh(new THREE.TetrahedronGeometry(8 * scale, 0), wireframeMat(col, 0.6));
      const down = new THREE.Mesh(new THREE.TetrahedronGeometry(8 * scale, 0), wireframeMat(col, 0.6));
      up.rotation.y = (layer * Math.PI) / 4;
      down.rotation.x = Math.PI; down.rotation.y = (layer * Math.PI) / 4;
      grp.add(up, down);
    }
    grp.add(new THREE.PointLight(col, 1, 30));
    grp.position.set(...pos);
    scene.add(grp);
    list.push({ grp, rx: 0.002, ry: 0.005 + si * 0.003, rz: 0.001 });
  });

  // ── 5. Torus Knots (sacred geometry patterns) ─────────────────────────────
  const knotDefs = [
    { p: 2, q: 3, color: 0x00ffff }, { p: 3, q: 5, color: 0xff00ff },
    { p: 5, q: 7, color: 0x00ff88 }, { p: 2, q: 5, color: 0xffff00 },
    { p: 3, q: 7, color: 0xff6600 }, { p: 4, q: 9, color: 0x8800ff },
  ];
  knotDefs.forEach((k, i) => {
    const grp = new THREE.Group();
    const geo = new THREE.TorusKnotGeometry(5, 0.8, 150, 20, k.p, k.q);
    grp.add(new THREE.Mesh(geo, neonMat(k.color, 2.2)));
    grp.add(new THREE.PointLight(k.color, 1.5, 40));
    grp.position.set(-180 + i * 72, -25 + Math.sin(i) * 25, -95 + i * 12);
    scene.add(grp);
    list.push({ grp, rx: rand(0.002, 0.007), ry: rand(0.004, 0.01), rz: 0.001 });
  });

  // ── 6. Metatron's Cube (13-sphere construct) ──────────────────────────────
  [[-30, 0, -55], [60, 30, -65]].forEach((pos, mi) => {
    const grp = new THREE.Group();
    const col = mi === 0 ? GOLD : 0x00ffff;
    const sphereR = 3;
    const positions = [[0,0,0]];
    for (let r = 0; r < 6; r++) {
      const a = (r / 6) * Math.PI * 2;
      positions.push([Math.cos(a) * sphereR * 2, Math.sin(a) * sphereR * 2, 0]);
    }
    for (let r = 0; r < 6; r++) {
      const a = (r / 6) * Math.PI * 2 + Math.PI / 6;
      positions.push([Math.cos(a) * sphereR * 4, Math.sin(a) * sphereR * 4, 0]);
    }
    positions.forEach(p => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(sphereR, 12, 12), glowMat(col, 0.12));
      const sw = new THREE.Mesh(new THREE.SphereGeometry(sphereR, 12, 12), wireframeMat(col, 0.4));
      s.position.set(...p); sw.position.set(...p);
      grp.add(s, sw);
    });
    // Connect centers with lines
    const lineGeo = new THREE.BufferGeometry();
    const linePts = [];
    positions.forEach((p, idx) => {
      positions.forEach((q, jdx) => {
        if (idx < jdx) { linePts.push(...p, ...q); }
      });
    });
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePts), 3));
    const lineMesh = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.25 }));
    grp.add(lineMesh);
    grp.add(new THREE.PointLight(col, 1.2, 55));
    grp.position.set(...pos);
    scene.add(grp);
    list.push({ grp, rx: 0.001, ry: 0.004 + mi * 0.002, rz: 0.001 });
  });

  // ── 7. Vesica Piscis ─────────────────────────────────────────────────────
  [[40, 40, -50], [-80, -40, -60]].forEach((pos, vi) => {
    const grp = new THREE.Group();
    const col = [0xffaa00, 0x00ff88][vi];
    const r = 7;
    [-r * 0.5, r * 0.5].forEach(offset => {
      grp.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.2, 8, 64), neonMat(col, 1.8)));
      grp.children[grp.children.length - 1].position.x = offset;
    });
    grp.add(new THREE.PointLight(col, 1, 25));
    grp.position.set(...pos);
    scene.add(grp);
    list.push({ grp, rx: 0.002, ry: 0.006 + vi * 0.002, rz: 0.003 });
  });

  return list;
}

export function tickSacredGeo(list) {
  list.forEach(item => {
    item.grp.rotation.x += item.rx;
    item.grp.rotation.y += item.ry;
    item.grp.rotation.z += item.rz;
  });
}