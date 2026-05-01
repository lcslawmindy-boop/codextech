import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RadarSweepBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010a04);

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 2000);
    camera.position.set(0, 120, 0);
    camera.lookAt(0, 0, 0);

    // Grid floor — tactical green
    const gridMat = new THREE.LineBasicMaterial({ color: 0x00ff44, transparent: true, opacity: 0.18 });
    const gridSize = 300;
    const gridDiv = 24;
    const step = gridSize / gridDiv;
    for (let i = 0; i <= gridDiv; i++) {
      const x = -gridSize / 2 + i * step;
      const pts = [new THREE.Vector3(x, 0, -gridSize / 2), new THREE.Vector3(x, 0, gridSize / 2)];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
      const pts2 = [new THREE.Vector3(-gridSize / 2, 0, x), new THREE.Vector3(gridSize / 2, 0, x)];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts2), gridMat));
    }

    // Concentric radar rings
    const rings = [];
    for (let r = 1; r <= 6; r++) {
      const rad = r * 22;
      const pts = [];
      for (let a = 0; a <= 128; a++) {
        const angle = (a / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(angle) * rad, 0.1, Math.sin(angle) * rad));
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x00ff44, transparent: true, opacity: 0.25 + r * 0.03 })
      );
      scene.add(ring);
      rings.push(ring);
    }

    // Radar sweep arm
    const sweepGeo = new THREE.BufferGeometry();
    const sweepPts = [new THREE.Vector3(0, 0.2, 0), new THREE.Vector3(135, 0.2, 0)];
    sweepGeo.setFromPoints(sweepPts);
    const sweepLine = new THREE.Line(sweepGeo, new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.9 }));
    scene.add(sweepLine);

    // Sweep fan mesh (trailing glow)
    const fanSegments = 32;
    const fanPositions = [];
    for (let s = 0; s <= fanSegments; s++) {
      const a = -(s / fanSegments) * (Math.PI * 0.55);
      fanPositions.push(0, 0.1, 0);
      fanPositions.push(Math.cos(a) * 135, 0.1, Math.sin(a) * 135);
    }
    const fanGeo = new THREE.BufferGeometry();
    fanGeo.setAttribute("position", new THREE.Float32BufferAttribute(fanPositions, 3));
    const fanMesh = new THREE.Mesh(fanGeo, new THREE.MeshBasicMaterial({ color: 0x00ff44, transparent: true, opacity: 0.06, side: THREE.DoubleSide }));
    scene.add(fanMesh);

    // Blip dots — contact markers
    const blips = [];
    for (let b = 0; b < 18; b++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 110;
      const blipMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0 })
      );
      blipMesh.position.set(Math.cos(angle) * dist, 0.5, Math.sin(angle) * dist);
      blipMesh.userData = { angle, dist, flashAt: -1 };
      scene.add(blipMesh);
      blips.push(blipMesh);
      // Glow ring around blip
      const blipRing = new THREE.Mesh(
        new THREE.RingGeometry(1.5, 2.5, 16),
        new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0, side: THREE.DoubleSide })
      );
      blipRing.rotation.x = -Math.PI / 2;
      blipRing.position.copy(blipMesh.position);
      blipRing.position.y = 0.2;
      blipMesh.userData.ring = blipRing;
      scene.add(blipRing);
    }

    // Cross-hairs at center
    const crossSize = 8;
    [
      [new THREE.Vector3(-crossSize, 0.3, 0), new THREE.Vector3(crossSize, 0.3, 0)],
      [new THREE.Vector3(0, 0.3, -crossSize), new THREE.Vector3(0, 0.3, crossSize)],
    ].forEach(pts => {
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: 0x00ff44, transparent: true, opacity: 0.6 })));
    });

    // Floating threat labels (text-like boxes)
    const labelMat = new THREE.MeshBasicMaterial({ color: 0x00ff44, transparent: true, opacity: 0.15, wireframe: true });
    for (let l = 0; l < 6; l++) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(8, 0.2, 4), labelMat);
      const angle = (l / 6) * Math.PI * 2;
      const dist = 40 + Math.random() * 80;
      box.position.set(Math.cos(angle) * dist, 2, Math.sin(angle) * dist);
      scene.add(box);
    }

    // Ambient light
    scene.add(new THREE.AmbientLight(0x00ff44, 0.3));

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let animId;
    let sweepAngle = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      sweepAngle += 0.012;

      // Rotate sweep
      sweepLine.rotation.y = sweepAngle;
      fanMesh.rotation.y = sweepAngle;

      // Check blips swept
      blips.forEach(blip => {
        const blipAngle = Math.atan2(blip.position.z, blip.position.x);
        let delta = ((sweepAngle % (Math.PI * 2)) - blipAngle + Math.PI * 4) % (Math.PI * 2);
        if (delta < 0.15) {
          blip.userData.flashAt = t;
        }
        const age = t - blip.userData.flashAt;
        const op = blip.userData.flashAt < 0 ? 0 : Math.max(0, 1 - age * 0.8);
        blip.material.opacity = op;
        if (blip.userData.ring) blip.userData.ring.material.opacity = op * 0.5;
      });

      // Slow camera orbit
      camera.position.x = Math.sin(t * 0.04) * 30;
      camera.position.z = Math.cos(t * 0.04) * 30;
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