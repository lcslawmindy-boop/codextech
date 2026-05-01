import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CosmicResearchBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000005);
    scene.fog = new THREE.FogExp2(0x000005, 0.002);

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 3000);
    camera.position.set(0, 0, 80);

    // ── Neon Colors ───────────────────────────────────────────────────────────
    const NEON = [0x00ffff, 0xff00ff, 0x00ff88, 0xff6600, 0xffff00, 0xff0088, 0x8800ff, 0x00aaff];
    const neonMat = (hex, emissive = 1.5) => new THREE.MeshStandardMaterial({
      color: hex, emissive: hex, emissiveIntensity: emissive,
      roughness: 0.1, metalness: 0.8,
    });
    const neonLine = (hex) => new THREE.LineBasicMaterial({ color: hex });

    // ── Starfield ─────────────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry();
    const starCount = 8000;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 2000;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 2000;
      const c = new THREE.Color().setHSL(Math.random(), 0.4, 0.8 + Math.random() * 0.2);
      starColors[i * 3] = c.r; starColors[i * 3 + 1] = c.g; starColors[i * 3 + 2] = c.b;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.4, vertexColors: true, sizeAttenuation: true }));
    scene.add(stars);

    // ── Milky Way Band ────────────────────────────────────────────────────────
    const mwGeo = new THREE.BufferGeometry();
    const mwCount = 5000;
    const mwPos = new Float32Array(mwCount * 3);
    const mwCol = new Float32Array(mwCount * 3);
    for (let i = 0; i < mwCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 200 + Math.random() * 600;
      const spread = (Math.random() - 0.5) * 40;
      mwPos[i * 3] = Math.cos(theta) * r;
      mwPos[i * 3 + 1] = spread;
      mwPos[i * 3 + 2] = Math.sin(theta) * r - 400;
      const brightness = 0.5 + Math.random() * 0.5;
      const hue = 0.55 + Math.random() * 0.15;
      const c = new THREE.Color().setHSL(hue, 0.6, brightness);
      mwCol[i * 3] = c.r; mwCol[i * 3 + 1] = c.g; mwCol[i * 3 + 2] = c.b;
    }
    mwGeo.setAttribute("position", new THREE.BufferAttribute(mwPos, 3));
    mwGeo.setAttribute("color", new THREE.BufferAttribute(mwCol, 3));
    scene.add(new THREE.Points(mwGeo, new THREE.PointsMaterial({ size: 0.6, vertexColors: true, sizeAttenuation: true, opacity: 0.8, transparent: true })));

    // ── Planets ───────────────────────────────────────────────────────────────
    const planetData = [
      { pos: [-120, 30, -200], r: 18, color: 0xff6600, ring: true, ringColor: 0xffaa44 },
      { pos: [150, -40, -300], r: 12, color: 0x4488ff, ring: false },
      { pos: [-60, 60, -150], r: 8, color: 0x88ff44, ring: false },
      { pos: [80, 50, -100], r: 6, color: 0xff4488, ring: false },
      { pos: [0, -80, -250], r: 22, color: 0xaa44ff, ring: true, ringColor: 0xcc88ff },
    ];
    const planets = [];
    planetData.forEach(pd => {
      const geo = new THREE.SphereGeometry(pd.r, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: pd.color, roughness: 0.4, metalness: 0.2,
        emissive: pd.color, emissiveIntensity: 0.15,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pd.pos);
      scene.add(mesh);
      planets.push({ mesh, speed: Math.random() * 0.002 + 0.001, axis: new THREE.Vector3(0, 1, 0.3).normalize() });

      // Atmosphere glow
      const atmoGeo = new THREE.SphereGeometry(pd.r * 1.12, 32, 32);
      const atmoMat = new THREE.MeshStandardMaterial({ color: pd.color, transparent: true, opacity: 0.12, side: THREE.FrontSide });
      const atmo = new THREE.Mesh(atmoGeo, atmoMat);
      atmo.position.copy(mesh.position);
      scene.add(atmo);

      // Ring system
      if (pd.ring) {
        const rGeo = new THREE.RingGeometry(pd.r * 1.4, pd.r * 2.2, 64);
        const rMat = new THREE.MeshStandardMaterial({ color: pd.ringColor, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = Math.PI / 3;
        ring.position.copy(mesh.position);
        scene.add(ring);
      }

      // Point light from planet
      const pLight = new THREE.PointLight(pd.color, 0.6, pd.r * 8);
      pLight.position.copy(mesh.position);
      scene.add(pLight);
    });

    // ── Black Holes ────────────────────────────────────────────────────────────
    const blackHoles = [];
    [[-200, -30, -400], [180, 70, -500]].forEach(pos => {
      const group = new THREE.Group();
      group.position.set(...pos);

      // Event horizon disk
      const ehGeo = new THREE.RingGeometry(0.1, 10, 64);
      const ehMat = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
      group.add(new THREE.Mesh(ehGeo, ehMat));

      // Accretion disk layers
      [12, 16, 20].forEach((r, i) => {
        const adGeo = new THREE.RingGeometry(r, r + 3, 64);
        const hue = [0.05, 0.08, 0.12][i];
        const adMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(hue, 1, 0.6),
          side: THREE.DoubleSide, transparent: true, opacity: 0.6 - i * 0.15,
        });
        const disk = new THREE.Mesh(adGeo, adMat);
        disk.rotation.x = Math.PI / 2.5 + i * 0.1;
        group.add(disk);
      });

      // Gravitational lensing ring glow
      const lensGeo = new THREE.RingGeometry(10, 11, 64);
      const lensMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
      group.add(new THREE.Mesh(lensGeo, lensMat));

      group.rotation.x = Math.PI / 4;
      scene.add(group);
      blackHoles.push({ group, speed: 0.003 });
    });

    // ── Asteroids ─────────────────────────────────────────────────────────────
    const asteroids = [];
    for (let i = 0; i < 25; i++) {
      const geo = new THREE.DodecahedronGeometry(Math.random() * 2 + 0.5, 0);
      const mat = new THREE.MeshStandardMaterial({ color: 0x886655, roughness: 0.9, metalness: 0.1 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 200 - 50);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);
      asteroids.push({ mesh, vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.04, spin: (Math.random() - 0.5) * 0.02 });
    }

    // ── Comets ────────────────────────────────────────────────────────────────
    const comets = [];
    for (let i = 0; i < 4; i++) {
      const group = new THREE.Group();
      // Head
      const headGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const headMat = new THREE.MeshStandardMaterial({ color: 0xaaddff, emissive: 0x66aaff, emissiveIntensity: 2 });
      group.add(new THREE.Mesh(headGeo, headMat));
      // Tail (cone)
      const tailGeo = new THREE.ConeGeometry(0.5, 20 + Math.random() * 15, 8, 1, true);
      const tailMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const tail = new THREE.Mesh(tailGeo, tailMat);
      tail.rotation.z = Math.PI / 2;
      tail.position.x = -12;
      group.add(tail);
      group.position.set((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100 - 50);
      group.rotation.z = (Math.random() - 0.5) * 0.5;
      scene.add(group);
      comets.push({ group, vx: Math.random() * 0.3 + 0.15, vy: (Math.random() - 0.5) * 0.05 });
    }

    // ── UFOs ──────────────────────────────────────────────────────────────────
    const ufos = [];
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group();
      // Body (flattened sphere)
      const bodyGeo = new THREE.SphereGeometry(4, 32, 16);
      bodyGeo.scale(1, 0.35, 1);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.1, metalness: 0.9 });
      group.add(new THREE.Mesh(bodyGeo, bodyMat));
      // Dome
      const domeGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMat = new THREE.MeshStandardMaterial({ color: 0x88ffff, transparent: true, opacity: 0.6, roughness: 0, metalness: 0.5 });
      const dome = new THREE.Mesh(domeGeo, domeMat);
      dome.position.y = 1.2;
      group.add(dome);
      // Neon rim lights
      const rimGeo = new THREE.TorusGeometry(4.2, 0.3, 8, 40);
      const rimMat = new THREE.MeshBasicMaterial({ color: NEON[i % NEON.length] });
      group.add(new THREE.Mesh(rimGeo, rimMat));
      // Beam
      const beamGeo = new THREE.ConeGeometry(3, 12, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.15, side: THREE.DoubleSide });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = -7;
      beam.rotation.x = Math.PI;
      group.add(beam);

      group.position.set(-60 + i * 50, 20 - i * 10, -30 - i * 20);
      scene.add(group);
      ufos.push({ group, phase: i * Math.PI * 0.6, speed: 0.008 + i * 0.003 });
    }

    // ── Rockets ───────────────────────────────────────────────────────────────
    const rockets = [];
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group();
      // Body
      const bodyGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
      group.add(new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ color: 0xddddff, roughness: 0.3, metalness: 0.8 })));
      // Nose
      const noseGeo = new THREE.ConeGeometry(0.8, 2.5, 16);
      const nose = new THREE.Mesh(noseGeo, new THREE.MeshStandardMaterial({ color: 0xff4444, roughness: 0.3 }));
      nose.position.y = 4.25;
      group.add(nose);
      // Fins
      for (let f = 0; f < 4; f++) {
        const finGeo = new THREE.BoxGeometry(0.1, 2, 1.5);
        const fin = new THREE.Mesh(finGeo, new THREE.MeshStandardMaterial({ color: 0x4444ff }));
        fin.position.set(Math.cos(f * Math.PI / 2) * 1.2, -2.5, Math.sin(f * Math.PI / 2) * 1.2);
        group.add(fin);
      }
      // Exhaust flame
      const flameGeo = new THREE.ConeGeometry(0.6, 3, 8);
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.8 });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = -4.5;
      flame.rotation.x = Math.PI;
      group.add(flame);
      const innerFlame = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 8), new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.9 }));
      innerFlame.position.y = -3.8; innerFlame.rotation.x = Math.PI;
      group.add(innerFlame);

      group.rotation.z = (Math.random() - 0.5) * 0.5;
      group.position.set(-100 + i * 80, -20 + i * 30, -40 - i * 15);
      scene.add(group);
      rockets.push({ group, vy: 0.04 + Math.random() * 0.03, phase: i * 2 });
    }

    // ── Neon Platonic Solids (Wireframe) ──────────────────────────────────────
    const platonic = [];
    const platonicGeos = [
      new THREE.TetrahedronGeometry(6, 0),
      new THREE.OctahedronGeometry(6, 0),
      new THREE.IcosahedronGeometry(6, 0),
      new THREE.DodecahedronGeometry(6, 0),
      new THREE.BoxGeometry(9, 9, 9),
    ];
    platonicGeos.forEach((geo, i) => {
      const color = NEON[i % NEON.length];
      // Solid inner
      const solid = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.6,
        transparent: true, opacity: 0.15, wireframe: false,
      }));
      // Wireframe glow
      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true }));
      const group = new THREE.Group();
      group.add(solid, wire);
      group.position.set(-80 + i * 40, 10 - i * 8, -60 + i * 10);
      scene.add(group);
      platonic.push({ group, rx: Math.random() * 0.008 + 0.003, ry: Math.random() * 0.01 + 0.005, rz: 0.002 });
    });

    // ── Neon Toroidal Coils ───────────────────────────────────────────────────
    const toroids = [];
    for (let i = 0; i < 6; i++) {
      const color = NEON[(i + 2) % NEON.length];
      const group = new THREE.Group();
      // Outer torus
      const torusGeo = new THREE.TorusGeometry(7, 1.2, 24, 80);
      group.add(new THREE.Mesh(torusGeo, neonMat(color, 1.8)));
      // Inner tube windings (stacked rings)
      for (let w = 0; w < 16; w++) {
        const angle = (w / 16) * Math.PI * 2;
        const wGeo = new THREE.TorusGeometry(2.2, 0.25, 8, 20);
        const winding = new THREE.Mesh(wGeo, new THREE.MeshBasicMaterial({ color }));
        winding.position.set(Math.cos(angle) * 7, Math.sin(angle) * 7, 0);
        winding.lookAt(0, 0, 0);
        winding.rotateX(Math.PI / 2);
        group.add(winding);
      }
      // Point light
      const light = new THREE.PointLight(color, 1.5, 30);
      group.add(light);

      group.position.set(-100 + i * 40, -10 + Math.sin(i) * 20, -80 + i * 15);
      group.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(group);
      toroids.push({ group, rx: 0.005 + i * 0.001, ry: 0.008, phase: i });
    }

    // ── Invention Bubbles (labeled floating spheres) ───────────────────────────
    const inventionNames = ["MEG Generator", "Scalar Transmitter", "Zero-Point Extractor", "Anenergy Pump", "Prioré Device", "Torsion Generator", "Resonance Cavity", "BioEM Interface"];
    const inventionBubbles = [];
    inventionNames.forEach((name, i) => {
      const color = NEON[i % NEON.length];
      const group = new THREE.Group();
      // Glass bubble
      const bubbleGeo = new THREE.SphereGeometry(5, 32, 32);
      const bubbleMat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 0.3,
        transparent: true, opacity: 0.2, roughness: 0, metalness: 0.9, side: THREE.DoubleSide,
      });
      group.add(new THREE.Mesh(bubbleGeo, bubbleMat));
      // Inner device shape
      const innerGeos = [
        new THREE.TorusKnotGeometry(2, 0.5, 80, 16),
        new THREE.TorusGeometry(2, 0.6, 16, 40),
        new THREE.IcosahedronGeometry(2.5, 1),
        new THREE.OctahedronGeometry(2.5, 0),
        new THREE.CylinderGeometry(0.5, 1.5, 4, 8),
        new THREE.SphereGeometry(2, 8, 8),
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.TetrahedronGeometry(2.5, 0),
      ];
      const inner = new THREE.Mesh(innerGeos[i], neonMat(color, 2.5));
      group.add(inner);
      // Wireframe shell
      group.add(new THREE.Mesh(bubbleGeo.clone(), new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.3 })));

      group.position.set(-140 + i * 40, 15 - (i % 3) * 20, -50 - (i % 4) * 15);
      scene.add(group);
      inventionBubbles.push({ group, inner, phase: i * 0.8, speed: 0.004 + i * 0.001, floatAmp: 4 + i * 0.5 });
    });

    // ── Ion Particles ─────────────────────────────────────────────────────────
    const ionGeo = new THREE.BufferGeometry();
    const ionCount = 300;
    const ionPos = new Float32Array(ionCount * 3);
    const ionCol = new Float32Array(ionCount * 3);
    for (let i = 0; i < ionCount; i++) {
      ionPos[i * 3] = (Math.random() - 0.5) * 200;
      ionPos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      ionPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
      const c = new THREE.Color(NEON[Math.floor(Math.random() * NEON.length)]);
      ionCol[i * 3] = c.r; ionCol[i * 3 + 1] = c.g; ionCol[i * 3 + 2] = c.b;
    }
    ionGeo.setAttribute("position", new THREE.BufferAttribute(ionPos, 3));
    ionGeo.setAttribute("color", new THREE.BufferAttribute(ionCol, 3));
    const ionMesh = new THREE.Points(ionGeo, new THREE.PointsMaterial({ size: 1.2, vertexColors: true, sizeAttenuation: true }));
    scene.add(ionMesh);

    // ── Shooting Stars ────────────────────────────────────────────────────────
    const shootingStars = [];
    for (let i = 0; i < 6; i++) {
      const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(-40, -8, 0)];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      const line = new THREE.Line(geo, mat);
      line.position.set((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 100, -30);
      scene.add(line);
      shootingStars.push({ line, mat, life: Math.random() * 200, maxLife: 120 + Math.random() * 80, vx: 1.5 + Math.random() * 1.5, vy: -(Math.random() * 0.5 + 0.2) });
    }

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x111133, 0.8));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(100, 100, 100);
    scene.add(sunLight);
    NEON.slice(0, 4).forEach((color, i) => {
      const pl = new THREE.PointLight(color, 1.2, 200);
      pl.position.set(Math.cos(i * Math.PI / 2) * 60, Math.sin(i * Math.PI / 2) * 40, 0);
      scene.add(pl);
    });

    // ── Galaxy Nebula Sprites ─────────────────────────────────────────────────
    const nebulaMat = new THREE.SpriteMaterial({ color: 0x4422aa, transparent: true, opacity: 0.08 });
    for (let i = 0; i < 5; i++) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.6, 0.8, 0.4), transparent: true, opacity: 0.06 }));
      sprite.scale.set(300, 200, 1);
      sprite.position.set((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 200, -600 + i * -100);
      scene.add(sprite);
    }

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation Loop ────────────────────────────────────────────────────────
    let frame = 0;
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      frame++;

      // Slow camera drift
      camera.position.x = Math.sin(t * 0.04) * 15;
      camera.position.y = Math.sin(t * 0.025) * 8;
      camera.lookAt(0, 0, 0);

      // Stars drift
      stars.rotation.y += 0.00005;

      // Planets orbit
      planets.forEach(p => { p.mesh.rotateOnAxis(p.axis, p.speed); });

      // Black holes spin
      blackHoles.forEach(bh => { bh.group.rotation.z += bh.speed; bh.group.rotation.y += bh.speed * 0.3; });

      // Asteroids drift
      asteroids.forEach(a => {
        a.mesh.position.x += a.vx;
        a.mesh.position.y += a.vy;
        a.mesh.rotation.y += a.spin;
        if (a.mesh.position.x > 200) a.mesh.position.x = -200;
        if (a.mesh.position.y > 100) a.mesh.position.y = -100;
      });

      // Comets streak
      comets.forEach(c => {
        c.group.position.x += c.vx;
        c.group.position.y += c.vy;
        if (c.group.position.x > 300) { c.group.position.x = -300; c.group.position.y = (Math.random() - 0.5) * 200; }
      });

      // UFOs hover + bob
      ufos.forEach(u => {
        u.group.position.x += Math.sin(t * u.speed * 10 + u.phase) * 0.05;
        u.group.position.y = u.group.position.y + Math.sin(t * 0.5 + u.phase) * 0.02;
        u.group.rotation.y += 0.015;
      });

      // Rockets fly up
      rockets.forEach(r => {
        r.group.position.y += r.vy;
        r.group.position.x += Math.sin(t * 0.3 + r.phase) * 0.02;
        if (r.group.position.y > 150) { r.group.position.y = -100; }
      });

      // Platonic solids rotate
      platonic.forEach(p => {
        p.group.rotation.x += p.rx;
        p.group.rotation.y += p.ry;
        p.group.rotation.z += p.rz;
      });

      // Toroids spin
      toroids.forEach((tor, i) => {
        tor.group.rotation.y += tor.ry;
        tor.group.rotation.x += tor.rx;
        tor.group.position.y += Math.sin(t * 0.4 + tor.phase) * 0.02;
      });

      // Invention bubbles float + spin inner device
      inventionBubbles.forEach(b => {
        b.group.position.y += Math.sin(t * 0.5 + b.phase) * 0.02;
        b.group.rotation.y += b.speed;
        b.inner.rotation.y += b.speed * 2;
        b.inner.rotation.x += b.speed * 0.5;
        b.group.position.x += Math.sin(t * 0.15 + b.phase * 0.7) * 0.01;
      });

      // Ion particles drift
      const ionPositions = ionMesh.geometry.attributes.position.array;
      for (let i = 0; i < ionCount; i++) {
        ionPositions[i * 3 + 1] += 0.02;
        if (ionPositions[i * 3 + 1] > 60) ionPositions[i * 3 + 1] = -60;
      }
      ionMesh.geometry.attributes.position.needsUpdate = true;

      // Shooting stars
      shootingStars.forEach(ss => {
        ss.life++;
        if (ss.life > ss.maxLife) {
          ss.life = 0;
          ss.line.position.set((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 100, -30);
          ss.line.rotation.z = (Math.random() - 0.5) * 0.4;
        }
        const p = ss.life / ss.maxLife;
        ss.mat.opacity = p < 0.2 ? p / 0.2 : p > 0.7 ? (1 - p) / 0.3 : 1.0;
        ss.mat.opacity *= 0.9;
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
      style={{ background: "#000005" }}
    />
  );
}