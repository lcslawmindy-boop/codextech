import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CircuitBoardBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.008);

    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 60, 80);
    camera.lookAt(0, 0, 0);

    const TRACE = 0x0088ff;
    const ACTIVE = 0x00ccff;
    const NODE = 0x00aaff;

    // PCB base board
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(300, 0.8, 200),
      new THREE.MeshStandardMaterial({ color: 0x0a1a0a, roughness: 0.9, metalness: 0.1 })
    );
    board.position.y = -2;
    scene.add(board);

    // Copper pad grid
    const padMat = new THREE.MeshStandardMaterial({ color: 0xcc8800, roughness: 0.3, metalness: 0.9 });
    for (let px = -12; px <= 12; px += 2) {
      for (let pz = -8; pz <= 8; pz += 2) {
        const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 12), padMat);
        pad.position.set(px * 8, -1.5, pz * 8);
        scene.add(pad);
      }
    }

    // Trace lines — horizontal and vertical routes
    const traceMat = new THREE.MeshStandardMaterial({ color: TRACE, roughness: 0.2, metalness: 0.8, emissive: 0x004488, emissiveIntensity: 0.5 });
    const traces = [];
    const traceCount = 80;
    for (let i = 0; i < traceCount; i++) {
      const isHoriz = Math.random() > 0.5;
      const length = 20 + Math.random() * 60;
      const geo = isHoriz
        ? new THREE.BoxGeometry(length, 0.3, 0.6)
        : new THREE.BoxGeometry(0.6, 0.3, length);
      const trace = new THREE.Mesh(geo, traceMat.clone());
      trace.material.emissiveIntensity = 0.2;
      trace.position.set(
        (Math.random() - 0.5) * 250,
        -1.3,
        (Math.random() - 0.5) * 160
      );
      scene.add(trace);
      traces.push({ mesh: trace, phase: Math.random() * Math.PI * 2, speed: 0.5 + Math.random() * 2 });
    }

    // IC chips
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.3 });
    const chipLabelMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.9 });
    for (let c = 0; c < 20; c++) {
      const w = 6 + Math.random() * 10;
      const d = 4 + Math.random() * 6;
      const chip = new THREE.Mesh(new THREE.BoxGeometry(w, 0.8, d), chipMat);
      chip.position.set((Math.random() - 0.5) * 240, -1.2, (Math.random() - 0.5) * 150);
      chip.rotation.y = Math.floor(Math.random() * 4) * Math.PI / 2;
      scene.add(chip);

      // Pin rows on each side
      const pinMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.1 });
      const pinCount = Math.floor(w / 1.2);
      for (let p = 0; p < pinCount; p++) {
        [1, -1].forEach(side => {
          const pin = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.8), pinMat);
          pin.position.set(chip.position.x - w / 2 + p * 1.2, -1.6, chip.position.z + side * (d / 2 + 0.4));
          scene.add(pin);
        });
      }

      // LED indicator
      const ledColor = [0x00ff44, 0xff4400, 0xffcc00, 0x00aaff][Math.floor(Math.random() * 4)];
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshBasicMaterial({ color: ledColor }));
      led.position.set(chip.position.x + w / 2 - 0.5, -0.6, chip.position.z + d / 2 - 0.5);
      led.userData = { baseColor: ledColor, phase: Math.random() * Math.PI * 2 };
      scene.add(led);
      traces.push({ mesh: led, isLed: true, phase: Math.random() * Math.PI * 2, speed: 1 + Math.random() * 3 });
    }

    // Data packets (glowing spheres traveling along traces)
    const packets = [];
    for (let p = 0; p < 30; p++) {
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 8, 8),
        new THREE.MeshBasicMaterial({ color: ACTIVE })
      );
      packet.userData = {
        x: (Math.random() - 0.5) * 250,
        z: (Math.random() - 0.5) * 160,
        dir: Math.random() > 0.5 ? 1 : -1,
        axis: Math.random() > 0.5 ? "x" : "z",
        speed: 0.3 + Math.random() * 0.8,
        range: 30 + Math.random() * 80,
        light: null,
      };
      packet.position.set(packet.userData.x, -0.8, packet.userData.z);
      scene.add(packet);

      // Trailing point light
      const pl = new THREE.PointLight(ACTIVE, 0.8, 12);
      pl.position.copy(packet.position);
      scene.add(pl);
      packet.userData.light = pl;
      packets.push(packet);
    }

    // Capacitors
    for (let cap = 0; cap < 25; cap++) {
      const capGroup = new THREE.Group();
      capGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 2, 12),
        new THREE.MeshStandardMaterial({ color: 0x224411, roughness: 0.6 })));
      const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.4, 12),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }));
      stripe.position.y = 0.8;
      capGroup.add(stripe);
      capGroup.position.set((Math.random() - 0.5) * 230, -0.4, (Math.random() - 0.5) * 145);
      scene.add(capGroup);
    }

    // Lights
    scene.add(new THREE.AmbientLight(0x002244, 1.5));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.5));
    const blueGlow = new THREE.PointLight(0x0044ff, 2, 150);
    blueGlow.position.set(0, 20, 0);
    scene.add(blueGlow);

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

      // Pulse traces
      traces.forEach(tr => {
        if (tr.isLed) {
          const pulse = Math.sin(t * tr.speed + tr.phase) > 0.5 ? 1 : 0;
          tr.mesh.material.opacity = pulse;
        } else {
          const intensity = 0.15 + Math.sin(t * tr.speed + tr.phase) * 0.15;
          tr.mesh.material.emissiveIntensity = intensity;
        }
      });

      // Move data packets
      packets.forEach(p => {
        const ud = p.userData;
        if (ud.axis === "x") {
          p.position.x += ud.speed * ud.dir;
          if (Math.abs(p.position.x - ud.x) > ud.range) ud.dir *= -1;
        } else {
          p.position.z += ud.speed * ud.dir;
          if (Math.abs(p.position.z - ud.z) > ud.range) ud.dir *= -1;
        }
        ud.light.position.copy(p.position);
      });

      // Gentle camera tilt
      camera.position.x = Math.sin(t * 0.05) * 25;
      camera.position.y = 55 + Math.sin(t * 0.03) * 10;
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