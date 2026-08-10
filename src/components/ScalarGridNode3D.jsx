import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Scalar Energy Grid Node — City-Scale Generator Tower ──────────────────
// Open-system vacuum energy extractor for the light timeline's
// city-scale deployment. Standing-wave scalar field generator with
// phase-conjugate output array.

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metal ?? 0.85,
    roughness: opts.rough ?? 0.25,
    transparent: opts.opacity !== undefined,
    opacity: opts.opacity ?? 1,
    emissive: opts.emissive !== undefined ? opts.emissive : 0x000000,
    emissiveIntensity: opts.ei ?? 0,
  });
}

function buildGridNode(scene, exploded, highlight) {
  const group = new THREE.Group();
  const off = exploded ? 1 : 0;

  // ── Apex Scalar Emitter (top) ──
  const apexGroup = new THREE.Group();
  apexGroup.position.y = 5.5 * off;
  // Emitter dome
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, transparent: true, opacity: 0.4, metalness: 0.2, roughness: 0.1,
      emissive: highlight === "apex" ? 0x06b6d4 : 0x06b6d4, emissiveIntensity: highlight === "apex" ? 0.6 : 0.3,
    })
  );
  apexGroup.add(dome);
  // Inner emitter core
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x22d3ee, emissiveIntensity: 0.9 }));
  apexGroup.add(core);
  // Antenna spike
  const spike = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.05, 0.6, 8), mat(0xc0c0c0, { metal: 0.95, rough: 0.15 }));
  spike.position.y = 0.3;
  apexGroup.add(spike);
  group.add(apexGroup);

  // ── Phase Conjugate Output Ring (top array) ──
  const ringGroup = new THREE.Group();
  ringGroup.position.y = 4.5 * off;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.06, 16, 48), mat(0x3b82f6, { metal: 0.8, rough: 0.2, emissive: 0x3b82f6, ei: highlight === "ring" ? 0.5 : 0.2 }));
  ringGroup.add(ring);
  // 8 emitter nodes on ring
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x3b82f6, emissiveIntensity: 0.6 }));
    node.position.set(Math.cos(a) * 0.6, 0, Math.sin(a) * 0.6);
    ringGroup.add(node);
  }
  group.add(ringGroup);

  // ── Primary Coil Stack (3 toroidal coils) ──
  const coilStackGroup = new THREE.Group();
  coilStackGroup.position.y = 3.5 * off;
  [0, 1, 2].forEach((i) => {
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.08, 16, 40),
      mat(0xb87333, { metal: 0.9, rough: 0.3, emissive: highlight === "coils" ? 0xb87333 : 0x000000, ei: highlight === "coils" ? 0.2 : 0 })
    );
    coil.position.y = -i * 0.25;
    coilStackGroup.add(coil);
    // Winding dots
    for (let j = 0; j < 32; j++) {
      const a = (j / 32) * Math.PI * 2;
      const w = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), mat(0xd4a574, { metal: 0.95, rough: 0.2 }));
      w.position.set(Math.cos(a) * 0.5, -i * 0.25, Math.sin(a) * 0.5);
      coilStackGroup.add(w);
    }
  });
  group.add(coilStackGroup);

  // ── Central Column (support mast) ──
  const colGroup = new THREE.Group();
  colGroup.position.y = 2.2 * off;
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 2.5, 16), mat(0x4a5568, { metal: 0.8, rough: 0.35 }));
  colGroup.add(column);
  // Column bands
  [0.8, 0, -0.8].forEach(y => {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 8, 24), mat(0x06b6d4, { metal: 0.7, rough: 0.2, ei: 0.3 }));
    band.position.y = y;
    band.rotation.x = Math.PI / 2;
    colGroup.add(band);
  });
  group.add(colGroup);

  // ── Control Module (mid-section) ──
  const ctrlGroup = new THREE.Group();
  ctrlGroup.position.y = 0.8 * off;
  const module = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.6), mat(0x2a2a3e, { metal: 0.7, rough: 0.4 }));
  ctrlGroup.add(module);
  // Display panel
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.2, 0.02), new THREE.MeshStandardMaterial({ color: 0x0a1929, emissive: 0x06b6d4, emissiveIntensity: 0.4 }));
  panel.position.set(0, 0, 0.31);
  ctrlGroup.add(panel);
  // Status LEDs
  [0, 1, 2].forEach(i => {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.8 }));
    led.position.set(-0.15 + i * 0.15, -0.12, 0.31);
    ctrlGroup.add(led);
  });
  group.add(ctrlGroup);

  // ── Base Platform ──
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -0.2 * off;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.3, 32), mat(0x3a3a4e, { metal: 0.7, rough: 0.4 }));
  baseGroup.add(base);
  // Base trim ring
  const trim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.04, 8, 32), mat(0x06b6d4, { metal: 0.8, rough: 0.2, ei: 0.4 }));
  trim.position.y = 0.12;
  baseGroup.add(trim);
  // Cooling vents
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.15, 0.03), mat(0x111122, { metal: 0.5, rough: 0.6 }));
    vent.position.set(Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0);
    vent.rotation.y = a;
    baseGroup.add(vent);
  }
  group.add(baseGroup);

  // ── Foundation ──
  const foundGroup = new THREE.Group();
  foundGroup.position.y = -0.6 * off;
  const foundation = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.2, 32), mat(0x555566, { metal: 0.5, rough: 0.6 }));
  foundGroup.add(foundation);
  // Bolts
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8), mat(0x888888, { metal: 0.95, rough: 0.2 }));
    bolt.position.set(Math.cos(a) * 1.2, 0.05, Math.sin(a) * 1.2);
    foundGroup.add(bolt);
  }
  group.add(foundGroup);

  scene.add(group);
  return group;
}

const PARTS = [
  { code: "apex", label: "Scalar Emitter Dome", color: "#06b6d4" },
  { code: "ring", label: "Phase Conjugate Array", color: "#3b82f6" },
  { code: "coils", label: "Primary Coil Stack", color: "#b87333" },
];

export default function ScalarGridNode3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const groupRef = useRef(null);
  const [exploded, setExploded] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [highlight, setHighlight] = useState(null);
  const explodedRef = useRef(true);
  const rotateRef = useRef(true);
  const highlightRef = useRef(null);

  useEffect(() => { explodedRef.current = exploded; }, [exploded]);
  useEffect(() => { rotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { highlightRef.current = highlight; }, [highlight]);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050810);
    sceneRef.current = scene;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 1000);
    camera.position.set(6, 3, 7);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(6, 12, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
    fill.position.set(-5, 3, -5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x06b6d4, 0.4);
    rim.position.set(0, 5, -8);
    scene.add(rim);

    const grid = new THREE.GridHelper(18, 18, 0x1e293b, 0x0f172a);
    grid.position.y = -0.8;
    scene.add(grid);

    groupRef.current = buildGridNode(scene, true, null);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (groupRef.current && rotateRef.current) groupRef.current.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    if (groupRef.current) sceneRef.current.remove(groupRef.current);
    groupRef.current = buildGridNode(sceneRef.current, explodedRef.current, highlightRef.current);
  }, [exploded, highlight]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-950 to-black border border-gray-800">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-gray-950/85 backdrop-blur border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm">Scalar Energy Grid Node — City Generator</h3>
          <p className="text-gray-500 text-xs">Open-system vacuum extractor · standing-wave field · phase conjugate output</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setExploded(!exploded)} className={`px-2.5 py-1 rounded text-[10px] font-bold ${exploded ? "bg-cyan-900/50 border border-cyan-700 text-cyan-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            {exploded ? "Exploded" : "Assembled"}
          </button>
          <button onClick={() => setAutoRotate(!autoRotate)} className={`px-2.5 py-1 rounded text-[10px] font-bold ${autoRotate ? "bg-indigo-900/50 border border-indigo-700 text-indigo-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            {autoRotate ? "Rot" : "Static"}
          </button>
        </div>
      </div>
      <div ref={containerRef} className="absolute inset-0 pt-14" />
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/92 backdrop-blur border-t border-gray-800 px-4 py-2">
        <div className="flex flex-wrap gap-1.5">
          {PARTS.map(p => (
            <button key={p.code} onClick={() => setHighlight(highlight === p.code ? null : p.code)} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] ${highlight === p.code ? "bg-gray-800" : "hover:bg-gray-800/50"}`}>
              <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }} />
              <span className="text-gray-300 font-semibold">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}