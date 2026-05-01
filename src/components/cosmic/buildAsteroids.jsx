import * as THREE from "three";
import { rand, randSign } from "./cosmicUtils";

// Realistic asteroid with craters, rocky texture, tumbling motion
export function buildAsteroids(scene) {
  const list = [];
  const rockColors = [0x8a6a4a, 0x6a5a4a, 0x7a7060, 0x9a8a6a, 0x5a4a3a];

  for (let i = 0; i < 50; i++) {
    const grp = new THREE.Group();
    const baseR = rand(0.4, 3.5);

    // Core body — use IcosahedronGeometry for more organic shape
    const geo = new THREE.IcosahedronGeometry(baseR, 1);
    const verts = geo.attributes.position.array;
    for (let v = 0; v < verts.length; v++) {
      verts[v] += (Math.random() - 0.5) * baseR * 0.55;
    }
    geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();

    const col = rockColors[Math.floor(Math.random() * rockColors.length)];
    const mat = new THREE.MeshStandardMaterial({
      color: col, roughness: 0.95, metalness: 0.05,
      flatShading: true,
    });
    const body = new THREE.Mesh(geo, mat);
    grp.add(body);

    // Crater dents (small dark spheres pressed into surface)
    const craterCount = Math.floor(rand(2, 6));
    for (let c = 0; c < craterCount; c++) {
      const ca = Math.random() * Math.PI * 2;
      const cb = Math.random() * Math.PI;
      const cr = baseR * rand(0.08, 0.22);
      const cGeo = new THREE.SphereGeometry(cr, 8, 8);
      const cMat = new THREE.MeshStandardMaterial({ color: 0x333328, roughness: 1 });
      const crater = new THREE.Mesh(cGeo, cMat);
      crater.position.set(
        Math.sin(cb) * Math.cos(ca) * baseR * 0.88,
        Math.cos(cb) * baseR * 0.88,
        Math.sin(cb) * Math.sin(ca) * baseR * 0.88,
      );
      grp.add(crater);
    }

    // Glint — tiny metallic patch
    if (Math.random() > 0.6) {
      const glint = new THREE.Mesh(
        new THREE.SphereGeometry(baseR * 0.08, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0xccccaa, roughness: 0.1, metalness: 1 })
      );
      glint.position.set(baseR * 0.7, baseR * 0.3, 0);
      grp.add(glint);
    }

    // Dust cloud around large asteroids
    if (baseR > 2.5) {
      const dustGeo = new THREE.SphereGeometry(baseR * 1.8, 8, 8);
      const dustMat = new THREE.MeshBasicMaterial({
        color: 0x8a7060, transparent: true, opacity: 0.06, side: THREE.DoubleSide,
      });
      grp.add(new THREE.Mesh(dustGeo, dustMat));
    }

    grp.position.set(
      rand(-400, 400), rand(-200, 200), rand(-250, 50)
    );
    grp.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    scene.add(grp);

    list.push({
      grp,
      vx: rand(-0.06, 0.06),
      vy: rand(-0.03, 0.03),
      vz: rand(-0.01, 0.01),
      rx: rand(-0.015, 0.015),
      ry: rand(-0.012, 0.012),
      rz: rand(-0.008, 0.008),
    });
  }
  return list;
}

export function tickAsteroids(list) {
  list.forEach(a => {
    a.grp.position.x += a.vx;
    a.grp.position.y += a.vy;
    a.grp.position.z += a.vz;
    a.grp.rotation.x += a.rx;
    a.grp.rotation.y += a.ry;
    a.grp.rotation.z += a.rz;
    if (a.grp.position.x > 420)  a.grp.position.x = -420;
    if (a.grp.position.x < -420) a.grp.position.x =  420;
    if (a.grp.position.y > 220)  a.grp.position.y = -220;
    if (a.grp.position.y < -220) a.grp.position.y =  220;
  });
}