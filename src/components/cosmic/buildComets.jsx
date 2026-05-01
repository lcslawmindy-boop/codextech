import * as THREE from "three";
import { rand, NEON } from "./cosmicUtils";

export function buildComets(scene) {
  const list = [];

  for (let i = 0; i < 8; i++) {
    const grp = new THREE.Group();
    const speed = rand(0.25, 0.7);

    // Nucleus — icy, rough sphere
    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(rand(0.8, 1.8), 1),
      new THREE.MeshStandardMaterial({ color: 0xaaccdd, roughness: 0.6, metalness: 0.1, emissive: 0x334455, emissiveIntensity: 0.5 })
    );
    grp.add(nucleus);

    // Coma — soft glowing sphere
    grp.add(new THREE.Mesh(
      new THREE.SphereGeometry(4, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    ));
    grp.add(new THREE.Mesh(
      new THREE.SphereGeometry(2.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xaaddff, transparent: true, opacity: 0.14 })
    ));

    // Ion tail — straight, blue-white
    const tailLen = rand(30, 60);
    const ionTail = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, tailLen, 10, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x88ddff, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    ionTail.rotation.z = Math.PI / 2;
    ionTail.position.x = -(tailLen / 2 + 2);
    grp.add(ionTail);

    // Secondary ion tail layer (thinner, brighter)
    const ionTail2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, tailLen * 0.8, 6, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    ionTail2.rotation.z = Math.PI / 2;
    ionTail2.position.x = -(tailLen * 0.4 + 2);
    grp.add(ionTail2);

    // Dust tail — wider, slightly curved angle, yellowish
    const dustLen = rand(20, 45);
    const dustTail = new THREE.Mesh(
      new THREE.ConeGeometry(3, dustLen, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffeeaa, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
    );
    dustTail.rotation.z = Math.PI / 2 + 0.18;
    dustTail.position.x = -(dustLen * 0.4);
    dustTail.position.y = dustLen * 0.08;
    grp.add(dustTail);

    // Outgassing jets (small bright streaks from nucleus)
    for (let j = 0; j < 3; j++) {
      const jLen = rand(3, 7);
      const jet = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, jLen, 5, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xccffff, transparent: true, opacity: 0.6 })
      );
      jet.rotation.z = -Math.PI / 2 + (j - 1) * 0.4;
      jet.position.x = jLen * 0.4;
      jet.position.y = (j - 1) * 0.4;
      grp.add(jet);
    }

    // Particle debris cloud
    const debrisGeo = new THREE.BufferGeometry();
    const debrisCount = 40;
    const dPos = new Float32Array(debrisCount * 3);
    for (let d = 0; d < debrisCount; d++) {
      dPos[d * 3]     = rand(-tailLen * 0.8, 0);
      dPos[d * 3 + 1] = (Math.random() - 0.5) * 4;
      dPos[d * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    debrisGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    grp.add(new THREE.Points(debrisGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.3, transparent: true, opacity: 0.5 })));

    grp.position.set(rand(-500, -200), rand(-200, 200), rand(-100, 20));
    grp.rotation.z = rand(-0.3, 0.3);
    scene.add(grp);
    list.push({ grp, vx: speed, vy: rand(-0.03, 0.03) });
  }
  return list;
}

export function tickComets(list) {
  list.forEach(c => {
    c.grp.position.x += c.vx;
    c.grp.position.y += c.vy;
    if (c.grp.position.x > 500) {
      c.grp.position.x = -500;
      c.grp.position.y = rand(-200, 200);
    }
  });
}