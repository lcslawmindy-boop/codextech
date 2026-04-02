import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HumanBodyScene({ mode = "damage" }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 1.5, 5.5);
    camera.lookAt(0, 1, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0x111122, 0.8);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(mode === "damage" ? 0xff3333 : 0x33ffaa, 1.5);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(mode === "damage" ? 0xff2200 : 0x00ffcc, 2, 10);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    const group = new THREE.Group();
    scene.add(group);

    const healColor = 0x00ffcc;
    const damageColor = 0xff2200;
    const bodyColor = mode === "damage" ? 0x334466 : 0x224455;

    // ── Body parts
    const mat = (col, emissive = 0x000000, opacity = 1, wire = false) =>
      new THREE.MeshPhongMaterial({ color: col, emissive, transparent: opacity < 1, opacity, wireframe: wire, shininess: 60 });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), mat(bodyColor, mode === "damage" ? 0x220000 : 0x002211));
    head.position.set(0, 3.1, 0);
    group.add(head);

    // Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.3, 16), mat(bodyColor));
    neck.position.set(0, 2.78, 0);
    group.add(neck);

    // Torso
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.1, 8, 16), mat(bodyColor, mode === "damage" ? 0x330000 : 0x003322));
    torso.position.set(0, 1.9, 0);
    group.add(torso);

    // Pelvis
    const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), mat(bodyColor));
    pelvis.scale.set(1, 0.6, 0.8);
    pelvis.position.set(0, 1.18, 0);
    group.add(pelvis);

    // Upper arms
    [-1, 1].forEach(side => {
      const ua = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.65, 8, 12), mat(bodyColor));
      ua.position.set(side * 0.68, 2.1, 0);
      ua.rotation.z = side * 0.18;
      group.add(ua);
      // Forearm
      const fa = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.6, 8, 12), mat(bodyColor));
      fa.position.set(side * 0.82, 1.42, 0);
      fa.rotation.z = side * 0.3;
      group.add(fa);
      // Hand
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), mat(bodyColor));
      hand.position.set(side * 0.95, 1.0, 0);
      group.add(hand);
    });

    // Thighs
    [-1, 1].forEach(side => {
      const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.75, 8, 12), mat(bodyColor));
      thigh.position.set(side * 0.22, 0.55, 0);
      group.add(thigh);
      // Lower leg
      const lower = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.7, 8, 12), mat(bodyColor));
      lower.position.set(side * 0.23, -0.25, 0);
      group.add(lower);
      // Foot
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.35), mat(bodyColor));
      foot.position.set(side * 0.23, -0.72, 0.08);
      group.add(foot);
    });

    // ── Internal organs (semi-transparent)
    const brain = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), mat(mode === "damage" ? 0xff4444 : 0x44ffaa, mode === "damage" ? 0x880000 : 0x006644, 0.7));
    brain.position.set(0, 3.15, 0);
    group.add(brain);

    const heart = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), mat(mode === "damage" ? 0xff2222 : 0xff88aa, mode === "damage" ? 0xaa0000 : 0x440022, 0.85));
    heart.position.set(-0.15, 2.15, 0.25);
    group.add(heart);

    // Spine
    for (let i = 0; i < 14; i++) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.09, 8), mat(mode === "damage" ? 0xffaa44 : 0x44ffcc, 0, 0.9));
      disc.position.set(0, 2.5 - i * 0.17, -0.2);
      group.add(disc);
    }

    const particles = [];
    const pCount = mode === "damage" ? 120 : 180;

    if (mode === "damage") {
      // ── DAMAGE MODE: EMF wave particles piercing the body
      const waveGeo = new THREE.BufferGeometry();
      const wavePositions = [];
      for (let i = 0; i < pCount; i++) {
        wavePositions.push(
          (Math.random() - 0.5) * 6,
          Math.random() * 4.5,
          (Math.random() - 0.5) * 6
        );
      }
      waveGeo.setAttribute("position", new THREE.Float32BufferAttribute(wavePositions, 3));
      const waveMat = new THREE.PointsMaterial({ color: damageColor, size: 0.06, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
      const wavePoints = new THREE.Points(waveGeo, waveMat);
      scene.add(wavePoints);
      particles.push({ obj: wavePoints, type: "damage" });

      // Damage rings around organs
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xff3300, wireframe: true, transparent: true, opacity: 0.5 });
      [[0, 3.15, 0], [-0.15, 2.15, 0.25], [0.1, 2.0, 0]].forEach(pos => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 32), ringMat);
        ring.position.set(...pos);
        scene.add(ring);
        particles.push({ obj: ring, type: "ring" });
      });

      // EMF arrows (cones showing penetration)
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const arrow = new THREE.Mesh(
          new THREE.ConeGeometry(0.04, 0.3, 8),
          new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.7 })
        );
        arrow.position.set(Math.cos(angle) * 1.8, 1.5 + Math.sin(i) * 0.8, Math.sin(angle) * 1.8);
        arrow.rotation.z = Math.PI;
        scene.add(arrow);
        particles.push({ obj: arrow, type: "arrow", angle, i });
      }

    } else {
      // ── HEAL MODE: healing energy flowing around / into the body
      const healGeo = new THREE.BufferGeometry();
      const healPos = [];
      for (let i = 0; i < pCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 1.2 + Math.random() * 0.8;
        healPos.push(Math.sin(phi) * Math.cos(theta) * r, 1.5 + Math.cos(phi) * 1.8 * Math.random(), Math.sin(phi) * Math.sin(theta) * r);
      }
      healGeo.setAttribute("position", new THREE.Float32BufferAttribute(healPos, 3));
      const healMat = new THREE.PointsMaterial({ color: healColor, size: 0.05, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
      const healPoints = new THREE.Points(healGeo, healMat);
      scene.add(healPoints);
      particles.push({ obj: healPoints, type: "heal" });

      // Healing toroid
      const toroidMat = new THREE.MeshBasicMaterial({ color: healColor, wireframe: true, transparent: true, opacity: 0.3 });
      const toroid = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.35, 12, 48), toroidMat);
      toroid.position.set(0, 1.8, 0);
      toroid.rotation.x = Math.PI / 2;
      scene.add(toroid);
      particles.push({ obj: toroid, type: "toroid" });

      // Scalar wave rings
      for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5 + i * 0.18, 0.02, 8, 32),
          new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.4 - i * 0.06 }));
        ring.position.set(0, 1.8, 0);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
        particles.push({ obj: ring, type: "healring", idx: i });
      }

      // DNA helix representation
      for (let i = 0; i < 40; i++) {
        const t = (i / 40) * Math.PI * 4;
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8),
          new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ffaa : 0x00aaff, transparent: true, opacity: 0.8 }));
        sphere.position.set(Math.cos(t) * 0.2, 1.0 + (i / 40) * 2.2, Math.sin(t) * 0.2 + 0.3);
        scene.add(sphere);
        particles.push({ obj: sphere, type: "dna", t });
      }
    }

    // Wireframe overlay on body
    const wireGroup = group.clone();
    wireGroup.traverse(child => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({ color: mode === "damage" ? 0xff4400 : 0x00ffcc, wireframe: true, transparent: true, opacity: 0.08 });
      }
    });
    scene.add(wireGroup);

    // Ground grid
    const gridHelper = new THREE.GridHelper(8, 16, mode === "damage" ? 0x330000 : 0x003322, mode === "damage" ? 0x220000 : 0x002211);
    gridHelper.position.y = -0.85;
    scene.add(gridHelper);

    sceneRef.current = { renderer, scene, camera };

    let frame = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      frame += 0.01;

      group.rotation.y = Math.sin(frame * 0.3) * 0.25;
      wireGroup.rotation.y = group.rotation.y;

      particles.forEach(p => {
        if (p.type === "damage") {
          const pos = p.obj.geometry.attributes.position.array;
          for (let i = 0; i < pos.length; i += 3) {
            pos[i + 0] += (Math.random() - 0.5) * 0.04;
            pos[i + 2] += (Math.random() - 0.5) * 0.04;
          }
          p.obj.geometry.attributes.position.needsUpdate = true;
          p.obj.rotation.y += 0.008;
        }
        if (p.type === "ring") { p.obj.scale.setScalar(1 + Math.sin(frame * 3 + p.obj.position.y) * 0.2); p.obj.material.opacity = 0.3 + Math.sin(frame * 2) * 0.2; }
        if (p.type === "arrow") { p.obj.position.x = Math.cos(p.angle + frame * 0.5) * 1.8; p.obj.position.z = Math.sin(p.angle + frame * 0.5) * 1.8; }
        if (p.type === "heal") { p.obj.rotation.y += 0.006; p.obj.rotation.x += 0.002; }
        if (p.type === "toroid") { p.obj.rotation.z += 0.012; p.obj.material.opacity = 0.2 + Math.sin(frame * 1.5) * 0.15; }
        if (p.type === "healring") { p.obj.scale.setScalar(1 + Math.sin(frame * 2 + p.idx * 0.5) * 0.12); p.obj.material.opacity = Math.max(0.05, 0.35 - p.idx * 0.05 + Math.sin(frame * 2 + p.idx) * 0.1); }
        if (p.type === "dna") { p.obj.position.x = Math.cos(p.t + frame * 0.8) * 0.2; p.obj.position.z = Math.sin(p.t + frame * 0.8) * 0.2 + 0.3; }
      });

      // Pulsing heart
      const heartScale = 1 + Math.sin(frame * 4) * 0.12;
      heart.scale.setScalar(heartScale);
      brain.material.emissiveIntensity = 0.5 + Math.sin(frame * 2) * 0.3;
      pointLight.intensity = 1.5 + Math.sin(frame * 2) * 0.5;

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
  }, [mode]);

  return <div ref={mountRef} className="w-full h-full" />;
}