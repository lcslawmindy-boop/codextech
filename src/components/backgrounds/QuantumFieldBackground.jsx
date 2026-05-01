import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function QuantumFieldBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    scene.fog = new THREE.FogExp2(0x000510, 0.006);

    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 2000);
    camera.position.set(0, 0, 120);

    // ── Wave interference field ──────────────────────────────────────────────
    const fieldW = 80, fieldH = 80, fieldRes = 80;
    const fieldGeo = new THREE.PlaneGeometry(200, 200, fieldW - 1, fieldH - 1);
    fieldGeo.rotateX(-Math.PI / 2);
    fieldGeo.translate(0, -30, 0);
    const fieldMat = new THREE.MeshBasicMaterial({
      color: 0x0044ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const fieldMesh = new THREE.Mesh(fieldGeo, fieldMat);
    scene.add(fieldMesh);

    // ── Particle cloud ───────────────────────────────────────────────────────
    const particleCount = 3000;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pCol = new Float32Array(particleCount * 3);
    const pVel = new Float32Array(particleCount * 3);
    const pPhase = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 300;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 200;
      pVel[i * 3] = (Math.random() - 0.5) * 0.04;
      pVel[i * 3 + 1] = (Math.random() - 0.5) * 0.04;
      pVel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
      pPhase[i] = Math.random() * Math.PI * 2;
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 1, 0.6);
      pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
    const pMesh = new THREE.Points(pGeo, new THREE.PointsMaterial({
      size: 0.7, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.8,
    }));
    scene.add(pMesh);

    // ── Probability orbital shells ───────────────────────────────────────────
    const orbitals = [];
    for (let o = 0; o < 5; o++) {
      const r = 15 + o * 12;
      const orbitColor = new THREE.Color().setHSL(0.58 + o * 0.05, 1, 0.6);
      for (let ring = 0; ring < 3; ring++) {
        const pts = [];
        const tilt = (ring / 3) * Math.PI;
        for (let s = 0; s <= 120; s++) {
          const a = (s / 120) * Math.PI * 2;
          pts.push(new THREE.Vector3(
            Math.cos(a) * r,
            Math.sin(a) * Math.sin(tilt) * r,
            Math.sin(a) * Math.cos(tilt) * r
          ));
        }
        const orbitLine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: orbitColor, transparent: true, opacity: 0.35 - o * 0.04 })
        );
        scene.add(orbitLine);
        orbitals.push({ line: orbitLine, rx: (Math.random() - 0.5) * 0.003, ry: 0.004 + o * 0.001 });
      }

      // Electron particle
      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 12, 12),
        new THREE.MeshBasicMaterial({ color: orbitColor })
      );
      electron.userData = { r, phase: (o / 5) * Math.PI * 2, tilt: (o / 5) * Math.PI, speed: 0.3 + o * 0.12 };
      scene.add(electron);
      const eLight = new THREE.PointLight(orbitColor, 1.2, 18);
      scene.add(eLight);
      electron.userData.light = eLight;
      orbitals.push({ electron, isElectron: true });
    }

    // ── EM wave propagation ribbons ──────────────────────────────────────────
    const waveRibbons = [];
    for (let w = 0; w < 4; w++) {
      const wPts = [];
      for (let s = 0; s <= 80; s++) {
        wPts.push(new THREE.Vector3(s * 2.5 - 100, 0, w * 15 - 30));
      }
      const wLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(wPts),
        new THREE.LineBasicMaterial({
          color: new THREE.Color().setHSL(0.5 + w * 0.1, 1, 0.65),
          transparent: true,
          opacity: 0.55,
        })
      );
      scene.add(wLine);
      waveRibbons.push({ line: wLine, pts: wPts, offset: w * 0.8 });
    }

    // ── Heisenberg uncertainty blobs ─────────────────────────────────────────
    const blobs = [];
    for (let b = 0; b < 8; b++) {
      const blob = new THREE.Mesh(
        new THREE.SphereGeometry(3 + Math.random() * 4, 12, 12),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color().setHSL(0.6, 0.8, 0.5 + Math.random() * 0.3),
          transparent: true,
          opacity: 0.06,
          wireframe: false,
        })
      );
      blob.position.set((Math.random() - 0.5) * 120, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80);
      blob.userData = { phase: Math.random() * Math.PI * 2, speed: 0.2 + Math.random() * 0.5 };
      scene.add(blob);
      blobs.push(blob);
    }

    scene.add(new THREE.AmbientLight(0x001133, 2));
    [0x0044ff, 0x00aaff, 0x8800ff].forEach((c, i) => {
      const pl = new THREE.PointLight(c, 1, 100);
      pl.position.set(Math.cos((i / 3) * Math.PI * 2) * 50, 0, Math.sin((i / 3) * Math.PI * 2) * 50);
      scene.add(pl);
    });

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Wave interference field deformation
      const pos = fieldMesh.geometry.attributes.position.array;
      for (let i = 0; i < fieldW * fieldH; i++) {
        const xi = (i % fieldW) / fieldW - 0.5;
        const zi = Math.floor(i / fieldW) / fieldH - 0.5;
        const r1 = Math.sqrt((xi - 0.2) ** 2 + zi ** 2);
        const r2 = Math.sqrt((xi + 0.2) ** 2 + zi ** 2);
        pos[i * 3 + 1] = -30 + Math.sin(r1 * 25 - t * 3) * 3 + Math.sin(r2 * 25 - t * 3) * 3;
      }
      fieldMesh.geometry.attributes.position.needsUpdate = true;

      // Particle drift
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3] += pVel[i * 3] + Math.sin(t * 0.3 + pPhase[i]) * 0.02;
        pPos[i * 3 + 1] += pVel[i * 3 + 1] + Math.cos(t * 0.25 + pPhase[i]) * 0.02;
        pPos[i * 3 + 2] += pVel[i * 3 + 2];
        if (Math.abs(pPos[i * 3]) > 150) pVel[i * 3] *= -1;
        if (Math.abs(pPos[i * 3 + 1]) > 100) pVel[i * 3 + 1] *= -1;
        if (Math.abs(pPos[i * 3 + 2]) > 100) pVel[i * 3 + 2] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Orbital rotation
      orbitals.forEach(o => {
        if (o.line) { o.line.rotation.x += o.rx; o.line.rotation.y += o.ry; }
        if (o.isElectron && o.electron) {
          const e = o.electron;
          const ud = e.userData;
          ud.phase += ud.speed * 0.016;
          e.position.set(
            Math.cos(ud.phase) * ud.r,
            Math.sin(ud.phase) * Math.sin(ud.tilt) * ud.r,
            Math.sin(ud.phase) * Math.cos(ud.tilt) * ud.r
          );
          ud.light.position.copy(e.position);
        }
      });

      // EM wave animation
      waveRibbons.forEach(wb => {
        const wPos = wb.line.geometry.attributes.position.array;
        for (let i = 0; i <= 80; i++) {
          wPos[i * 3 + 1] = Math.sin(i * 0.2 + t * 2 + wb.offset) * 8;
        }
        wb.line.geometry.attributes.position.needsUpdate = true;
      });

      // Blob pulse
      blobs.forEach(b => {
        const s = 1 + Math.sin(t * b.userData.speed + b.userData.phase) * 0.3;
        b.scale.setScalar(s);
        b.material.opacity = 0.04 + Math.sin(t * b.userData.speed + b.userData.phase) * 0.04;
      });

      camera.position.x = Math.sin(t * 0.05) * 20;
      camera.position.y = Math.cos(t * 0.04) * 15;
      camera.lookAt(0, 0, 0);

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

  return <div ref={mountRef} className="fixed inset-0 w-full h-full -z-10" />;
}