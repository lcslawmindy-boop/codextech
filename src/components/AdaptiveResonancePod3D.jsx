import { useEffect, useRef } from "react";
import * as THREE from "three";

// ── AATCS-P2 Adaptive Resonance Therapy Pod — 3D Concept Render ─────────────
// Shows the pod concept: toroidal coils, Helmholtz array, isolation chamber,
// PBM panels, and acoustic transducers — all the hardware modules together.

export default function AdaptiveResonancePod3D() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.Fog(0x050510, 8, 25);

    const w = container.clientWidth;
    const h = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(5, 3, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Manual orbit controls (auto-rotate + drag)
    const spherical = { radius: 7, theta: 0, phi: Math.PI / 2.4 };
    let isDragging = false;
    let lastPointer = { x: 0, y: 0 };
    let autoRotate = true;
    const updateCamera = () => {
      camera.position.set(
        spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta),
        spherical.radius * Math.cos(spherical.phi) + 0.5,
        spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta)
      );
      camera.lookAt(0, 0.5, 0);
    };
    updateCamera();

    const onPointerDown = (e) => { isDragging = true; autoRotate = false; lastPointer = { x: e.clientX, y: e.clientY }; };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointer.x;
      const dy = e.clientY - lastPointer.y;
      spherical.theta -= dx * 0.005;
      spherical.phi -= dy * 0.005;
      spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, spherical.phi));
      lastPointer = { x: e.clientX, y: e.clientY };
      updateCamera();
    };
    const onPointerUp = () => { isDragging = false; setTimeout(() => { autoRotate = true; }, 3000); };
    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius *= e.deltaY > 0 ? 1.1 : 0.9;
      spherical.radius = Math.max(4, Math.min(14, spherical.radius));
      updateCamera();
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 0.8);
    key.position.set(5, 8, 5);
    scene.add(key);
    const cyan = new THREE.PointLight(0x06b6d4, 0.8, 15);
    cyan.position.set(-3, 1, 2);
    scene.add(cyan);
    const amber = new THREE.PointLight(0xf59e0b, 0.5, 15);
    amber.position.set(3, -1, -2);
    scene.add(amber);

    // Grid floor
    const grid = new THREE.GridHelper(20, 20, 0x1a1a3a, 0x0d0d22);
    grid.position.y = -1.8;
    scene.add(grid);

    const pod = new THREE.Group();
    scene.add(pod);

    // ── Base platform ──
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.4, 0.3, 48),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.8, roughness: 0.3 })
    );
    base.position.y = -1.5;
    pod.add(base);

    // ── Isolation chamber (transparent cylinder) ──
    const chamber = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 1.8, 3.2, 48, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0x06b6d4, transparent: true, opacity: 0.08, side: THREE.DoubleSide,
        metalness: 0.2, roughness: 0.1,
      })
    );
    chamber.position.y = 0.2;
    pod.add(chamber);

    // Chamber frame rings (top + bottom)
    [1.8, -1.4].forEach(y => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.8, 0.05, 8, 48),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 })
      );
      ring.position.y = y;
      ring.rotation.x = Math.PI / 2;
      pod.add(ring);
    });

    // Vertical support struts
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const strut = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 3.2, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 })
      );
      strut.position.set(Math.cos(a) * 1.8, 0.2, Math.sin(a) * 1.8);
      pod.add(strut);
    }

    // ── Treatment bed inside chamber ──
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.12, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.4, roughness: 0.6 })
    );
    bed.position.y = -0.8;
    pod.add(bed);

    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.08, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 })
    );
    mattress.position.y = -0.72;
    pod.add(mattress);

    // ── Toroidal magnetic field coils (2 above and below bed) ──
    [0.4, -0.4].forEach((y, idx) => {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(0.9, 0.08, 16, 48),
        new THREE.MeshStandardMaterial({
          color: 0x06b6d4, metalness: 0.7, roughness: 0.3,
          emissive: 0x06b6d4, emissiveIntensity: 0.3,
        })
      );
      torus.position.y = y;
      torus.rotation.x = Math.PI / 2;
      pod.add(torus);
      // Coil winding detail
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const wind = new THREE.Mesh(
          new THREE.SphereGeometry(0.03, 8, 8),
          new THREE.MeshStandardMaterial({ color: 0x0e7490, metalness: 0.9, roughness: 0.2 })
        );
        wind.position.set(Math.cos(a) * 0.9, y, Math.sin(a) * 0.9);
        pod.add(wind);
      }
    });

    // ── Multi-axis Helmholtz coil array (3 orthogonal pairs) ──
    const helmholtzColors = [0x10b981, 0xf59e0b, 0xa855f7];
    const helmholtzAxes = [
      { axis: "x", r: 1.5, tube: 0.04 },
      { axis: "z", r: 1.5, tube: 0.04 },
      { axis: "y", r: 1.3, tube: 0.04 },
    ];
    helmholtzAxes.forEach((cfg, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: helmholtzColors[idx], metalness: 0.6, roughness: 0.4,
        transparent: true, opacity: 0.5,
        emissive: helmholtzColors[idx], emissiveIntensity: 0.15,
      });
      for (let s = -1; s <= 1; s += 2) {
        const coil = new THREE.Mesh(new THREE.TorusGeometry(cfg.r, cfg.tube, 8, 48), mat);
        if (cfg.axis === "x") { coil.rotation.y = Math.PI / 2; coil.position.x = s * 1.6; }
        if (cfg.axis === "z") { coil.rotation.x = Math.PI / 2; coil.position.z = s * 1.6; }
        if (cfg.axis === "y") { coil.rotation.x = Math.PI / 2; coil.position.y = s * 1.5; }
        pod.add(coil);
      }
    });

    // ── PBM LED array (canopy underside) ──
    const canopy = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.7, 0.15, 48),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 })
    );
    canopy.position.y = 1.75;
    pod.add(canopy);

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.22, 0.02, 0.14),
          new THREE.MeshStandardMaterial({
            color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.6,
            transparent: true, opacity: 0.9,
          })
        );
        led.position.set(-0.55 + i * 0.27, 1.65, -0.28 + j * 0.28);
        pod.add(led);
      }
    }

    // ── Acoustic transducers (embedded in bed + side walls) ──
    for (let i = 0; i < 6; i++) {
      const td = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.3, metalness: 0.5 })
      );
      td.position.set(-0.6 + (i % 3) * 0.6, -0.74, i < 3 ? -0.2 : 0.2);
      pod.add(td);
    }

    // ── Sensor array ring (characterization module) ──
    const sensorRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.02, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.5, roughness: 0.4, emissive: 0xf59e0b, emissiveIntensity: 0.2 })
    );
    sensorRing.position.y = 0.9;
    sensorRing.rotation.x = Math.PI / 2;
    pod.add(sensorRing);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const sensor = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xf59e0b, emissiveIntensity: 0.4 })
      );
      sensor.position.set(Math.cos(a) * 1.0, 0.9, Math.sin(a) * 1.0);
      pod.add(sensor);
    }

    // ── Fiber-optic sensing lines ──
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const fiber = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 2.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x22d3ee, emissiveIntensity: 0.5, transparent: true, opacity: 0.6 })
      );
      fiber.position.set(Math.cos(a) * 1.7, 0.2, Math.sin(a) * 1.7);
      pod.add(fiber);
    }

    // ── Control electronics bay (below base) ──
    const bay = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.4, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 })
    );
    bay.position.set(0, -1.85, 0);
    pod.add(bay);

    // HMI screen
    const hmi = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.16, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x06b6d4, emissiveIntensity: 0.5 })
    );
    hmi.position.set(0, -1.7, 0.51);
    pod.add(hmi);

    // ── Cooling vents ──
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.02, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.3 })
      );
      vent.position.set(Math.cos(a) * 1.9, -1.65, Math.sin(a) * 1.9);
      vent.lookAt(0, -1.65, 0);
      pod.add(vent);
    }

    // Animation
    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      // Auto-rotate
      if (autoRotate && !isDragging) {
        spherical.theta += 0.005;
        updateCamera();
      }
      // Pulse toroidal coils
      pod.children.forEach((child, i) => {
        if (child.geometry?.type === "TorusGeometry" && child.material?.emissive) {
          child.material.emissiveIntensity = 0.2 + Math.sin(t * 2 + i) * 0.15;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const ww = containerRef.current.clientWidth;
      const hh = containerRef.current.clientHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      if (container && renderer.domElement) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}