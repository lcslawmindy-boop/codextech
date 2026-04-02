import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function EarthFutureScene({ year = 10, scenario = "dark" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 200);
    camera.position.set(0, 0, 6);

    const isDark = scenario === "dark";

    // Stars
    const starGeo = new THREE.BufferGeometry();
    const starPos = [];
    for (let i = 0; i < 1500; i++) {
      starPos.push((Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150);
    }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 })));

    // Earth globe
    const earthGeo = new THREE.SphereGeometry(1.8, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      color: isDark ? 0x224422 : 0x1a6b4a,
      emissive: isDark ? 0x110800 : 0x0a2a18,
      shininess: 25,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Continents (simplified with bump-like patches)
    const continentData = [
      { x: -0.3, y: 0.6, z: 1.5, sx: 0.8, sy: 0.5, sz: 0.1 }, // NA
      { x: 0.1, y: 0.2, z: 1.6, sx: 0.5, sy: 0.7, sz: 0.1 },  // SA
      { x: 0.8, y: 0.5, z: 1.4, sx: 0.6, sy: 0.4, sz: 0.1 },   // Europe
      { x: 0.9, y: 0.1, z: 1.45, sx: 0.7, sy: 0.7, sz: 0.1 },  // Africa
      { x: 1.4, y: 0.4, z: 0.9, sx: 0.8, sy: 0.6, sz: 0.1 },   // Asia
    ];
    continentData.forEach(c => {
      const cont = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 16),
        new THREE.MeshPhongMaterial({ color: isDark ? 0x2d5c2d : 0x2d8050, emissive: 0x000000 })
      );
      cont.position.set(c.x, c.y, c.z).normalize().multiplyScalar(1.82);
      cont.scale.set(c.sx, c.sy, c.sz);
      scene.add(cont);
    });

    // Atmosphere glow
    const atmoMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x884400 : 0x004488,
      transparent: true,
      opacity: isDark ? 0.25 : 0.15,
      side: THREE.BackSide,
    });
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(2.05, 32, 32), atmoMat);
    scene.add(atmo);

    // Lights
    const sunLight = new THREE.DirectionalLight(isDark ? 0xff6633 : 0xffeedd, 1.8);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(isDark ? 0x110800 : 0x0a1520, 0.6));

    const extras = [];

    if (isDark) {
      // Pollution layer
      const pollutionParticles = [];
      for (let i = 0; i < 200; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1.95 + Math.random() * 0.3;
        pollutionParticles.push(
          Math.sin(phi) * Math.cos(theta) * r,
          Math.sin(phi) * Math.sin(theta) * r,
          Math.cos(phi) * r
        );
      }
      const pollGeo = new THREE.BufferGeometry();
      pollGeo.setAttribute("position", new THREE.Float32BufferAttribute(pollutionParticles, 3));
      const pollPoints = new THREE.Points(pollGeo, new THREE.PointsMaterial({ color: 0x886622, size: 0.06, transparent: true, opacity: 0.6 }));
      scene.add(pollPoints);
      extras.push({ obj: pollPoints, type: "pollution" });

      // EMF tower beams
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.08, 2.5, 8, 1, true),
          new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.4, side: THREE.DoubleSide })
        );
        const bPos = new THREE.Vector3(Math.cos(angle), 0.3, Math.sin(angle)).normalize().multiplyScalar(1.82);
        beam.position.copy(bPos);
        beam.lookAt(0, 0, 0);
        beam.rotateX(Math.PI / 2);
        scene.add(beam);
        extras.push({ obj: beam, type: "beam" });
      }

      // Orbiting satellites (weaponized)
      for (let i = 0; i < 8; i++) {
        const sat = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.04, 0.15),
          new THREE.MeshBasicMaterial({ color: 0xff4400 })
        );
        extras.push({ obj: sat, type: "satellite", angle: (i / 8) * Math.PI * 2, speed: 0.005 + Math.random() * 0.003, r: 2.5 + Math.random() * 0.4, tilt: Math.random() * Math.PI });
        scene.add(sat);
      }

    } else {
      // HEALED scenario — clean energy grid
      const gridGeo = new THREE.BufferGeometry();
      const gridPos = [];
      for (let i = 0; i < 300; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1.88 + Math.random() * 0.05;
        gridPos.push(Math.sin(phi) * Math.cos(theta) * r, Math.sin(phi) * Math.sin(theta) * r, Math.cos(phi) * r);
      }
      gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPos, 3));
      scene.add(new THREE.Points(gridGeo, new THREE.PointsMaterial({ color: 0x00ffcc, size: 0.04, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })));

      // Healing scalar field rings around earth
      for (let i = 0; i < 4; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(2.3 + i * 0.2, 0.015, 8, 80),
          new THREE.MeshBasicMaterial({ color: 0x00ffaa, transparent: true, opacity: 0.25 - i * 0.04 })
        );
        ring.rotation.x = (i / 4) * Math.PI * 0.5;
        ring.rotation.z = (i / 4) * Math.PI * 0.3;
        scene.add(ring);
        extras.push({ obj: ring, type: "ring", idx: i });
      }

      // Clean energy satellites
      for (let i = 0; i < 8; i++) {
        const sat = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.02, 0.12),
          new THREE.MeshBasicMaterial({ color: 0x00ffcc })
        );
        extras.push({ obj: sat, type: "satellite", angle: (i / 8) * Math.PI * 2, speed: 0.004 + Math.random() * 0.003, r: 2.4 + Math.random() * 0.3, tilt: Math.random() * Math.PI });
        scene.add(sat);
      }
    }

    let frame = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 0.008;
      earth.rotation.y += 0.003;

      extras.forEach(p => {
        if (p.type === "satellite") {
          p.angle += p.speed;
          p.obj.position.set(Math.cos(p.angle) * p.r, Math.sin(p.tilt) * p.r * 0.5, Math.sin(p.angle) * p.r);
        }
        if (p.type === "ring") { p.obj.rotation.y += 0.005 + p.idx * 0.002; p.obj.material.opacity = 0.15 + Math.sin(frame + p.idx) * 0.08; }
        if (p.type === "pollution") { p.obj.rotation.y += 0.002; }
        if (p.type === "beam") { p.obj.material.opacity = 0.2 + Math.sin(frame * 3 + p.obj.position.x) * 0.2; }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const W2 = mount.clientWidth, H2 = mount.clientHeight;
      camera.aspect = W2 / H2;
      camera.updateProjectionMatrix();
      renderer.setSize(W2, H2);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [scenario]);

  return <div ref={mountRef} className="w-full h-full" />;
}