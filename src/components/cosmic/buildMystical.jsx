import * as THREE from "three";
import { NEON, neonMat, glowMat, wireframeMat, rand, GOLD } from "./cosmicUtils";

// ── UFOs ──────────────────────────────────────────────────────────────────────
export function buildUFOs(scene) {
  const list = [];
  for (let i = 0; i < 8; i++) {
    const grp = new THREE.Group();
    const color = NEON[(i * 3) % NEON.length];
    // Hull
    const hull = new THREE.Mesh(
      (() => { const g = new THREE.SphereGeometry(5 + i * 0.3, 40, 20); g.scale(1, 0.3, 1); return g; })(),
      new THREE.MeshStandardMaterial({ color: 0xbbc2cc, roughness: 0.06, metalness: 0.97 })
    );
    grp.add(hull);
    // Dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x99ffff, transparent: true, opacity: 0.55, roughness: 0, metalness: 0.5 })
    );
    dome.position.y = 1.4;
    grp.add(dome);
    // Alien silhouette inside dome
    const alienHead = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x225522 }));
    alienHead.position.y = 2.2;
    grp.add(alienHead);
    // Big alien eyes
    [-0.4, 0.4].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x000000 }));
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
      eye.position.set(ex, 2.35, 0.7);
      pupil.position.set(ex, 2.35, 0.9);
      grp.add(eye, pupil);
    });
    // Neon rim
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(5.4 + i * 0.3, 0.38, 12, 60), neonMat(color)));
    // Portal lights
    for (let p = 0; p < 12; p++) {
      const a = (p / 12) * Math.PI * 2;
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8),
        new THREE.MeshBasicMaterial({ color: NEON[(p + i * 2) % NEON.length] }));
      light.position.set(Math.cos(a) * (5.4 + i * 0.3), 0, Math.sin(a) * (5.4 + i * 0.3));
      grp.add(light);
    }
    // Tractor beam
    const beam = new THREE.Mesh(
      new THREE.ConeGeometry(5, 18, 20, 1, true),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
    );
    beam.position.y = -10; beam.rotation.x = Math.PI;
    grp.add(beam);
    // Spinning rings underneath
    for (let r = 0; r < 3; r++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3 - r * 0.7, 0.12, 6, 32),
        new THREE.MeshBasicMaterial({ color: NEON[(r + i) % NEON.length] })
      );
      ring.position.y = -1 - r * 0.5;
      ring.userData = { spinSpeed: 0.05 + r * 0.03 };
      grp.add(ring);
    }
    const pl = new THREE.PointLight(color, 2.5, 50);
    pl.position.y = -5;
    grp.add(pl);

    grp.position.set(rand(-180, 180), rand(5, 40), rand(-60, -10));
    scene.add(grp);
    list.push({ grp, phase: i * 1.2, speed: 0.006 + i * 0.001, baseY: grp.position.y,
      spinRings: grp.children.filter(c => c.userData.spinSpeed) });
  }
  return list;
}

export function tickUFOs(list, t) {
  list.forEach(u => {
    u.grp.position.y = u.baseY + Math.sin(t * 0.55 + u.phase) * 6;
    u.grp.position.x += Math.sin(t * u.speed * 9 + u.phase) * 0.05;
    u.grp.rotation.y += 0.01;
    u.spinRings.forEach(r => { r.rotation.y += r.userData.spinSpeed; });
  });
}

// ── Angels with Eyeball Wings ────────────────────────────────────────────────
export function buildAngels(scene) {
  const list = [];
  const angelPositions = [
    [-80, 60, -40], [80, 60, -50], [0, 80, -35],
    [-130, 30, -60], [130, 30, -55],
  ];
  angelPositions.forEach((pos, idx) => {
    const grp = new THREE.Group();
    const color = [GOLD, 0x00ffff, 0xff00ff, 0xffaa00, 0x00ff88][idx];

    // Ethereal body (elongated sphere)
    const body = new THREE.Mesh(
      (() => { const g = new THREE.SphereGeometry(2, 20, 20); g.scale(0.7, 1.6, 0.7); return g; })(),
      new THREE.MeshStandardMaterial({ color: 0xffffee, roughness: 0.2, metalness: 0.1, emissive: 0xffffcc, emissiveIntensity: 0.4, transparent: true, opacity: 0.85 })
    );
    grp.add(body);

    // Glowing halo
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.2, 8, 48),
      new THREE.MeshBasicMaterial({ color: GOLD }));
    halo.position.y = 3.8; halo.rotation.x = Math.PI / 8;
    grp.add(halo);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xffe8cc, roughness: 0.5, metalness: 0, emissive: 0xffe8cc, emissiveIntensity: 0.2 }));
    head.position.y = 3.0;
    grp.add(head);

    // Eyes on head (face)
    [-0.35, 0.35].forEach(ex => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff }));
      eye.position.set(ex, 3.1, 1.0);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x111100 }));
      pupil.position.set(ex, 3.1, 1.18);
      grp.add(eye, pupil);
    });

    // Multiple wings with eyeballs (6 wing pairs = 12 wings like seraphim)
    const wingAngles = [-0.6, -0.3, 0, 0.3, 0.6, 0.9];
    const wingSides = [-1, 1];
    wingAngles.forEach((wAngle, wi) => {
      wingSides.forEach(side => {
        const wingGrp = new THREE.Group();

        // Wing membrane (feather-like elongated shape)
        const wingGeo = (() => {
          const g = new THREE.SphereGeometry(1, 8, 8);
          g.scale(0.35, 1 + wi * 0.3, 1 + wi * 0.15);
          return g;
        })();
        const wingMat = new THREE.MeshStandardMaterial({
          color, emissive: color, emissiveIntensity: 0.4,
          transparent: true, opacity: 0.4, side: THREE.DoubleSide,
        });
        const wing = new THREE.Mesh(wingGeo, wingMat);
        wingGrp.add(wing);

        // EYEBALL on each wing — the defining feature
        const eyeballGrp = new THREE.Group();
        // Sclera (white)
        eyeballGrp.add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 })));
        // Iris (glowing)
        const irisColor = NEON[(wi + idx) % NEON.length];
        eyeballGrp.add(new THREE.Mesh(
          new THREE.SphereGeometry(0.2, 16, 16),
          new THREE.MeshBasicMaterial({ color: irisColor })
        ));
        // Pupil
        const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0x000000 }));
        pupil.position.z = 0.15;
        eyeballGrp.add(pupil);
        // Eyelids (torus slivers)
        eyeballGrp.add(new THREE.Mesh(
          new THREE.TorusGeometry(0.28, 0.06, 4, 20, Math.PI),
          new THREE.MeshBasicMaterial({ color })
        ));
        eyeballGrp.position.set(0, 0.3, 0.4);
        wingGrp.add(eyeballGrp);

        // Wing feather lines
        for (let f = 0; f < 5; f++) {
          const fLine = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.8 + f * 0.15, 0.04),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
          );
          fLine.position.x = (f - 2) * 0.07;
          fLine.position.y = 0.2;
          wingGrp.add(fLine);
        }

        wingGrp.position.set(side * 2.5, wAngle * 3, 0);
        wingGrp.rotation.z = side * (0.5 + wi * 0.15);
        wingGrp.rotation.y = side * 0.3;
        grp.add(wingGrp);
      });
    });

    // Divine glow aura
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.04 })));
    grp.add(new THREE.PointLight(color, 2, 40));
    grp.add(new THREE.PointLight(GOLD, 1, 25));

    grp.position.set(...pos);
    grp.rotation.y = Math.random() * Math.PI * 2;
    scene.add(grp);
    list.push({ grp, phase: idx * 1.1, baseY: pos[1], floatSpeed: 0.4 + idx * 0.08 });
  });
  return list;
}

export function tickAngels(list, t) {
  list.forEach(a => {
    a.grp.position.y = a.baseY + Math.sin(t * a.floatSpeed + a.phase) * 4;
    a.grp.rotation.y += 0.003;
  });
}

// ── Akashic Record portals ────────────────────────────────────────────────────
export function buildAkashicPortals(scene) {
  const list = [];
  const portals = [
    { pos: [-160, 0, -80], color: 0x8800ff },
    { pos: [160, 10, -90], color: 0x00aaff },
    { pos: [0, -50, -70], color: 0xaa00ff },
  ];
  portals.forEach((p, i) => {
    const grp = new THREE.Group();
    // Portal ring
    grp.add(new THREE.Mesh(new THREE.TorusGeometry(14, 1.2, 16, 80), neonMat(p.color)));
    // Inner rings (nested)
    [10, 6, 3].forEach((r, ri) => {
      grp.add(new THREE.Mesh(new THREE.TorusGeometry(r, 0.4, 12, 60), neonMat(NEON[(ri + i * 3) % NEON.length], 1.5)));
    });
    // Portal surface (shimmering plane)
    const portal = new THREE.Mesh(
      new THREE.CircleGeometry(13, 64),
      new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.08, side: THREE.DoubleSide })
    );
    grp.add(portal);
    // Sacred symbols orbiting the portal
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      const sym = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8, 0),
        new THREE.MeshBasicMaterial({ color: NEON[(s + i) % NEON.length] })
      );
      sym.position.set(Math.cos(a) * 16, Math.sin(a) * 16, 0);
      sym.userData = { angle: a, orbitR: 16, speed: 0.008 + s * 0.002 };
      grp.add(sym);
    }
    // Grid lines (akashic data)
    for (let g = 0; g < 12; g++) {
      const angle = (g / 12) * Math.PI * 2;
      const linePts = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 12, Math.sin(angle) * 12, 0)
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
      grp.add(new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.2 })));
    }
    grp.add(new THREE.PointLight(p.color, 2.5, 60));
    grp.position.set(...p.pos);
    scene.add(grp);
    list.push({ grp, orbs: grp.children.filter(c => c.userData.speed), ry: 0.004 + i * 0.002 });
  });
  return list;
}

export function tickAkashic(list, t) {
  list.forEach(p => {
    p.grp.rotation.y += p.ry;
    p.grp.rotation.z += p.ry * 0.3;
    p.orbs.forEach(orb => {
      orb.userData.angle += orb.userData.speed;
      orb.position.set(
        Math.cos(orb.userData.angle) * orb.userData.orbitR,
        Math.sin(orb.userData.angle) * orb.userData.orbitR,
        Math.sin(orb.userData.angle * 2) * 3
      );
      orb.rotation.y += 0.05;
    });
  });
}