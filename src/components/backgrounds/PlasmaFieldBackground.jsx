import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PlasmaFieldBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000208);
    scene.fog = new THREE.FogExp2(0x000208, 0.005);

    const camera = new THREE.PerspectiveCamera(70, mount.clientWidth / mount.clientHeight, 0.1, 2000);
    camera.position.set(0, 20, 100);
    camera.lookAt(0, 0, 0);

    // ── Central plasma torus ─────────────────────────────────────────────────
    const torusGeo = new THREE.TorusGeometry(22, 6, 40, 120);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x0022ff,
      emissive: 0x0011aa,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.7,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // Inner hot plasma core
    const coreGeo = new THREE.TorusGeometry(22, 2, 20, 80);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.9 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // ── Magnetic field lines ─────────────────────────────────────────────────
    const fieldLines = [];
    for (let f = 0; f < 20; f++) {
      const angle = (f / 20) * Math.PI * 2;
      const pts = [];
      const R = 22, r = 20;
      for (let s = 0; s <= 200; s++) {
        const t = (s / 200) * Math.PI * 2;
        const u = angle + t * 0.3;
        const x = (R + r * Math.cos(t)) * Math.cos(u);
        const y = r * Math.sin(t);
        const z = (R + r * Math.cos(t)) * Math.sin(u);
        pts.push(new THREE.Vector3(x, y, z));
      }
      const fieldColor = new THREE.Color().setHSL(0.58 + (f / 20) * 0.1, 1, 0.6);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: fieldColor, transparent: true, opacity: 0.3 + Math.random() * 0.2 })
      );
      scene.add(line);
      fieldLines.push({ line, phase: (f / 20) * Math.PI * 2 });
    }

    // ── Arcing plasma bolts ──────────────────────────────────────────────────
    const arcs = [];
    for (let a = 0; a < 12; a++) {
      const pts = [];
      const startAngle = (a / 12) * Math.PI * 2;
      const endAngle = startAngle + Math.PI * (0.5 + Math.random());
      const startR = 22, endR = 22;
      const segments = 20;
      for (let s = 0; s <= segments; s++) {
        const ta = startAngle + (endAngle - startAngle) * (s / segments);
        const jitter = (Math.random() - 0.5) * 8;
        pts.push(new THREE.Vector3(
          Math.cos(ta) * (startR + jitter),
          Math.sin(ta * 0.7) * 15 + jitter * 0.5,
          Math.sin(ta) * (endR + jitter)
        ));
      }
      const arcColor = new THREE.Color().setHSL(0.52 + Math.random() * 0.15, 1, 0.7);
      const arc = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: arcColor, transparent: true, opacity: 0 })
      );
      scene.add(arc);
      arcs.push({ arc, flashAt: Math.random() * 5, interval: 1.5 + Math.random() * 4 });
    }

    // ── Particle streams orbiting torus ───────────────────────────────────────
    const streamCount = 2000;
    const sGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(streamCount * 3);
    const sCol = new Float32Array(streamCount * 3);
    const sPhase = new Float32Array(streamCount);
    for (let i = 0; i < streamCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const torusAngle = Math.random() * Math.PI * 2;
      const R = 22 + (Math.random() - 0.5) * 20;
      const r = (Math.random() - 0.5) * 16;
      sPos[i * 3] = (R + r) * Math.cos(angle);
      sPos[i * 3 + 1] = r * Math.sin(torusAngle);
      sPos[i * 3 + 2] = (R + r) * Math.sin(angle);
      sPhase[i] = Math.random() * Math.PI * 2;
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.12, 1, 0.65 + Math.random() * 0.3);
      sCol[i * 3] = c.r; sCol[i * 3 + 1] = c.g; sCol[i * 3 + 2] = c.b;
    }
    sGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sGeo.setAttribute("color", new THREE.BufferAttribute(sCol, 3));
    const streamMesh = new THREE.Points(sGeo, new THREE.PointsMaterial({
      size: 0.6, vertexColors: true, transparent: true, opacity: 0.8,
    }));
    scene.add(streamMesh);

    // ── Outer containment shell ───────────────────────────────────────────────
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x000888, transparent: true, opacity: 0.06, side: THREE.BackSide, wireframe: false })
    );
    scene.add(shell);
    const shellWire = new THREE.Mesh(
      new THREE.SphereGeometry(50, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x003366, transparent: true, opacity: 0.08, wireframe: true })
    );
    scene.add(shellWire);

    // ── Tokamak support structure ─────────────────────────────────────────────
    for (let s = 0; s < 12; s++) {
      const a = (s / 12) * Math.PI * 2;
      const strut = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 55, 8),
        new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.4, metalness: 0.9 })
      );
      strut.position.set(Math.cos(a) * 38, 0, Math.sin(a) * 38);
      strut.rotation.x = Math.PI / 2;
      strut.rotation.z = a;
      scene.add(strut);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0x001133, 1.5));
    const plasmaLight = new THREE.PointLight(0x0088ff, 4, 80);
    plasmaLight.position.set(0, 0, 0);
    scene.add(plasmaLight);
    [[60, 0, 0], [-60, 0, 0], [0, 60, 0]].forEach(([x, y, z]) => {
      const pl = new THREE.PointLight(0x004488, 1, 100);
      pl.position.set(x, y, z);
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

      // Torus rotation
      torus.rotation.y += 0.003;
      torus.rotation.x = Math.sin(t * 0.3) * 0.1;
      core.rotation.y -= 0.008;

      // Plasma color pulse
      const hue = 0.56 + Math.sin(t * 0.5) * 0.04;
      torusMat.emissive.setHSL(hue, 1, 0.4);
      coreMat.color.setHSL(hue + 0.05, 1, 0.75);
      plasmaLight.color.setHSL(hue, 1, 0.6);
      plasmaLight.intensity = 3 + Math.sin(t * 2.5) * 1.5;

      // Particle stream orbit
      for (let i = 0; i < streamCount; i++) {
        const speed = 0.003 + (sPhase[i] % 0.005);
        const a = Math.atan2(sPos[i * 3 + 2], sPos[i * 3]) + speed;
        const R = Math.sqrt(sPos[i * 3] ** 2 + sPos[i * 3 + 2] ** 2);
        sPos[i * 3] = Math.cos(a) * R;
        sPos[i * 3 + 2] = Math.sin(a) * R;
        sPos[i * 3 + 1] += Math.sin(t + sPhase[i]) * 0.04;
        if (Math.abs(sPos[i * 3 + 1]) > 12) sPos[i * 3 + 1] *= 0.95;
      }
      sGeo.attributes.position.needsUpdate = true;

      // Field line pulse
      fieldLines.forEach(fl => {
        const opacity = 0.15 + Math.sin(t * 1.5 + fl.phase) * 0.15;
        fl.line.material.opacity = Math.max(0, opacity);
      });

      // Arc flash
      arcs.forEach(a => {
        const age = t - a.flashAt;
        a.arc.material.opacity = age >= 0 ? Math.max(0, 1 - age * 3) * 0.9 : 0;
        if (t > a.flashAt + a.interval) {
          a.flashAt = t;
        }
      });

      // Shell rotation
      shell.rotation.y += 0.001;
      shellWire.rotation.x += 0.0005;

      // Camera orbit
      camera.position.x = Math.sin(t * 0.05) * 50 + Math.sin(t * 0.08) * 20;
      camera.position.y = Math.cos(t * 0.04) * 30 + 20;
      camera.position.z = Math.cos(t * 0.05) * 50 + Math.cos(t * 0.08) * 20;
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