import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function NeuralNetworkBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050005);
    scene.fog = new THREE.FogExp2(0x050005, 0.007);

    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 1500);
    camera.position.set(0, 0, 110);

    const LAYER_COLORS = [0xff6600, 0xff9900, 0xffcc00, 0x00ff88, 0x00ccff, 0x8844ff];

    // ── Nodes in layers ──────────────────────────────────────────────────────
    const LAYERS = [5, 8, 12, 12, 8, 5];
    const allNodes = [];
    const nodesByLayer = [];

    LAYERS.forEach((count, layerIdx) => {
      const layerColor = LAYER_COLORS[layerIdx % LAYER_COLORS.length];
      const lx = (layerIdx - LAYERS.length / 2) * 30;
      const nodes = [];

      for (let n = 0; n < count; n++) {
        const ny = (n - count / 2) * 14;
        const nz = (Math.random() - 0.5) * 20;

        const node = new THREE.Group();

        // Outer ring
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(2.2, 0.25, 8, 32),
          new THREE.MeshBasicMaterial({ color: layerColor, transparent: true, opacity: 0.6 })
        );
        node.add(ring);

        // Core sphere
        const core = new THREE.Mesh(
          new THREE.SphereGeometry(1.2, 16, 16),
          new THREE.MeshBasicMaterial({ color: layerColor })
        );
        node.add(core);

        // Point light
        const pl = new THREE.PointLight(layerColor, 0.8, 20);
        node.add(pl);

        node.position.set(lx, ny, nz);
        node.userData = {
          layerIdx,
          baseY: ny,
          activation: Math.random(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random(),
          color: layerColor,
        };

        scene.add(node);
        nodes.push(node);
        allNodes.push(node);
      }
      nodesByLayer.push(nodes);
    });

    // ── Synaptic connections ─────────────────────────────────────────────────
    const connections = [];
    for (let l = 0; l < nodesByLayer.length - 1; l++) {
      const from = nodesByLayer[l];
      const to = nodesByLayer[l + 1];
      from.forEach(fromNode => {
        // Connect to random subset of next layer
        const targets = to.filter(() => Math.random() > 0.4);
        targets.forEach(toNode => {
          const pts = [fromNode.position.clone(), toNode.position.clone()];
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          const mat = new THREE.LineBasicMaterial({
            color: fromNode.userData.color,
            transparent: true,
            opacity: 0.12,
          });
          const line = new THREE.Line(geo, mat);
          scene.add(line);
          connections.push({ line, from: fromNode, to: toNode, mat, pulse: Math.random() * Math.PI * 2, active: false, signalT: -1 });
        });
      });
    }

    // ── Signal pulses traveling along connections ─────────────────────────────
    const pulses = [];
    for (let p = 0; p < 20; p++) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      if (!conn) continue;
      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
      );
      pulse.userData = {
        conn,
        t: Math.random(),
        speed: 0.004 + Math.random() * 0.008,
      };
      scene.add(pulse);
      pulses.push(pulse);
    }

    // ── Background data rain ─────────────────────────────────────────────────
    const rainCount = 500;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    const rainVel = new Float32Array(rainCount);
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3] = (Math.random() - 0.5) * 300;
      rainPos[i * 3 + 1] = (Math.random() - 0.5) * 200;
      rainPos[i * 3 + 2] = -60 - Math.random() * 100;
      rainVel[i] = 0.1 + Math.random() * 0.3;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    scene.add(new THREE.Points(rainGeo, new THREE.PointsMaterial({
      color: 0x440088, size: 0.5, transparent: true, opacity: 0.4,
    })));

    // Axis labels (XYZ indicators)
    scene.add(new THREE.AmbientLight(0x110011, 2));
    [0xff4400, 0xff8800, 0x00ffaa, 0x00aaff, 0x8844ff].forEach((c, i) => {
      const pl = new THREE.PointLight(c, 0.5, 80);
      pl.position.set((i - 2) * 40, 0, 0);
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

      // Pulse nodes
      allNodes.forEach(node => {
        const ud = node.userData;
        const activation = (Math.sin(t * ud.speed + ud.phase) + 1) / 2;
        const scale = 0.7 + activation * 0.6;
        node.scale.setScalar(scale);
        node.children[0].material.opacity = 0.2 + activation * 0.8;
        node.children[1].material.opacity = 0.4 + activation * 0.6;
        node.rotation.z += 0.005;
        node.rotation.y += 0.003;
        node.position.y = ud.baseY + Math.sin(t * 0.2 + ud.phase) * 2;
      });

      // Pulse connection lines
      connections.forEach(conn => {
        const glow = (Math.sin(t * 1.5 + conn.pulse) + 1) / 2;
        conn.mat.opacity = 0.05 + glow * 0.2;
      });

      // Move signal pulses
      pulses.forEach(p => {
        const ud = p.userData;
        ud.t += ud.speed;
        if (ud.t > 1) {
          ud.t = 0;
          ud.conn = connections[Math.floor(Math.random() * connections.length)];
        }
        if (ud.conn) {
          p.position.lerpVectors(ud.conn.from.position, ud.conn.to.position, ud.t);
          p.material.opacity = Math.sin(ud.t * Math.PI) * 0.9;
        }
      });

      // Rain fall
      for (let i = 0; i < rainCount; i++) {
        rainPos[i * 3 + 1] -= rainVel[i];
        if (rainPos[i * 3 + 1] < -100) rainPos[i * 3 + 1] = 100;
      }
      rainGeo.attributes.position.needsUpdate = true;

      // Slow camera orbit around layers
      camera.position.x = Math.sin(t * 0.04) * 30;
      camera.position.y = Math.sin(t * 0.03) * 15;
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