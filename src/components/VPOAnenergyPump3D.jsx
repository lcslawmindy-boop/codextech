import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── VPO Anenergy Pump — Vacuum Potential Oscillator ───────────────────────
// T. Henry Moray / Bearden architecture: vacuum energy extraction via
// phi-ratio scalar field coupling to cellular ATPase.
// Realistic rendering with metallic surfaces, emissive plasma, and glass.

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metal ?? 0.85,
    roughness: opts.rough ?? 0.25,
    transparent: opts.opacity !== undefined,
    opacity: opts.opacity ?? 1,
    emissive: opts.emissive !== undefined ? opts.emissive : 0x000000,
    emissiveIntensity: opts.ei ?? 0,
    envMapIntensity: opts.env ?? 1.0,
  });
}

function buildVPOPump(scene, exploded, highlight) {
  const group = new THREE.Group();
  const off = exploded ? 1 : 0;

  // ── Vacuum Energy Collector (top sphere — Moray tube) ──
  const collectorGroup = new THREE.Group();
  collectorGroup.position.y = 4.2 * off;
  // Glass envelope
  const envelope = new THREE.Mesh(
    new THREE.SphereGeometry(0.55, 32, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, transparent: true, opacity: 0.25, metalness: 0, roughness: 0.05,
      transmission: 0.8, thickness: 0.3, ior: 1.5,
      emissive: highlight === "collector" ? 0x06b6d4 : 0x000000, emissiveIntensity: highlight === "collector" ? 0.3 : 0,
    })
  );
  collectorGroup.add(envelope);
  // Inner plasma core
  const plasma = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x06b6d4, emissiveIntensity: 0.8, transparent: true, opacity: 0.7 })
  );
  collectorGroup.add(plasma);
  // Plasma glow halo
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.15 })
  );
  collectorGroup.add(halo);
  // Electrode caps (top and bottom of tube)
  const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16), mat(0xc0c0c0, { metal: 0.95, rough: 0.15 }));
  capTop.position.y = 0.5;
  collectorGroup.add(capTop);
  const capBot = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 16), mat(0xc0c0c0, { metal: 0.95, rough: 0.15 }));
  capBot.position.y = -0.5;
  collectorGroup.add(capBot);
  group.add(collectorGroup);

  // ── Phi-Ratio Coupling Coil (toroidal — primary) ──
  const phiGroup = new THREE.Group();
  phiGroup.position.y = 3.0 * off;
  // Toroidal coil — copper
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.14, 24, 64),
    mat(0xb87333, { metal: 0.9, rough: 0.3, emissive: highlight === "coil" ? 0xb87333 : 0x000000, ei: highlight === "coil" ? 0.2 : 0 })
  );
  phiGroup.add(torus);
  // Winding detail — copper wire wraps
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const wire = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), mat(0xd4a574, { metal: 0.95, rough: 0.2 }));
    wire.position.set(Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7);
    phiGroup.add(wire);
  }
  // Inner core (ferrite)
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), mat(0x1a1a2e, { metal: 0.4, rough: 0.6 }));
  phiGroup.add(core);
  group.add(phiGroup);

  // ── Resonance Crystal Array (quartz — phi-ratio positioned) ──
  const crystalGroup = new THREE.Group();
  crystalGroup.position.y = 2.0 * off;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.12, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0xa78bfa, transparent: true, opacity: 0.7, metalness: 0.1, roughness: 0.05,
        transmission: 0.6, ior: 2.0,
        emissive: 0x8b5cf6, emissiveIntensity: highlight === "crystals" ? 0.5 : 0.2,
      })
    );
    crystal.position.set(Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5);
    crystal.rotation.y = a;
    crystalGroup.add(crystal);
  }
  group.add(crystalGroup);

  // ── VPO Circuit Board (oscillator) ──
  const circuitGroup = new THREE.Group();
  circuitGroup.position.y = 1.2 * off;
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.08, 0.8), mat(0x0a3d2e, { metal: 0.3, rough: 0.7 }));
  circuitGroup.add(board);
  // Capacitor cylinders
  [0, 1, 2].forEach(i => {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16), mat(0x1a3a5e, { metal: 0.7, rough: 0.4 }));
    cap.position.set(-0.4 + i * 0.4, 0.14, -0.2);
    circuitGroup.add(cap);
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.02, 16), mat(0xc0c0c0, { metal: 0.95 }));
    capTop.position.set(-0.4 + i * 0.4, 0.25, -0.2);
    circuitGroup.add(capTop);
  });
  // Main oscillator chip
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.35), mat(0x111111, { metal: 0.6, rough: 0.3 }));
  chip.position.set(0, 0.08, 0.2);
  circuitGroup.add(chip);
  // Status LEDs
  [0, 1, 2].forEach(i => {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.8 }));
    led.position.set(-0.15 + i * 0.15, 0.08, 0.35);
    circuitGroup.add(led);
  });
  group.add(circuitGroup);

  // ── Output Coupling Stage (ATPase interface) ──
  const outputGroup = new THREE.Group();
  outputGroup.position.y = 0.4 * off;
  const coupling = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.25, 24), mat(0x14b8a6, { metal: 0.6, rough: 0.4, emissive: highlight === "output" ? 0x14b8a6 : 0x000000, ei: highlight === "output" ? 0.3 : 0.05 }));
  outputGroup.add(coupling);
  // Output ring
  const outRing = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.04, 12, 32), mat(0x5eead4, { metal: 0.8, rough: 0.2, ei: 0.2 }));
  outputGroup.add(outRing);
  group.add(outputGroup);

  // ── Heat Dissipation Fins ──
  const finGroup = new THREE.Group();
  finGroup.position.y = -0.3 * off;
  for (let i = 0; i < 8; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.15), mat(0x808080, { metal: 0.9, rough: 0.3 }));
    fin.position.y = -i * 0.06;
    finGroup.add(fin);
  }
  group.add(finGroup);

  // ── Base Housing ──
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -1.2 * off;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.35, 32), mat(0x2a2a3e, { metal: 0.7, rough: 0.4 }));
  baseGroup.add(base);
  // Base ring trim
  const trim = new THREE.Mesh(new THREE.TorusGeometry(0.87, 0.03, 8, 32), mat(0x06b6d4, { metal: 0.8, rough: 0.2, ei: 0.3 }));
  trim.position.y = 0.15;
  baseGroup.add(trim);
  // Vent slots
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.12, 0.02), mat(0x111122, { metal: 0.5, rough: 0.6 }));
    vent.position.set(Math.cos(a) * 0.82, 0, Math.sin(a) * 0.82);
    vent.rotation.y = a;
    baseGroup.add(vent);
  }
  group.add(baseGroup);

  // ── Mounting Feet ──
  const feetGroup = new THREE.Group();
  feetGroup.position.y = -1.5 * off;
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.1, 12), mat(0x333333, { metal: 0.9, rough: 0.2 }));
    foot.position.set(Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7);
    feetGroup.add(foot);
    // Rubber pad
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 12), mat(0x1a1a1a, { metal: 0.1, rough: 0.9 }));
    pad.position.set(Math.cos(a) * 0.7, -0.06, Math.sin(a) * 0.7);
    feetGroup.add(pad);
  });
  group.add(feetGroup);

  scene.add(group);
  return group;
}

const PARTS = [
  { code: "collector", label: "Vacuum Energy Collector", color: "#06b6d4" },
  { code: "coil", label: "Phi-Ratio Coupling Coil", color: "#b87333" },
  { code: "crystals", label: "Resonance Crystal Array", color: "#a78bfa" },
  { code: "output", label: "ATPase Output Coupling", color: "#14b8a6" },
];

export default function VPOAnenergyPump3D() {
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
    camera.position.set(5, 2.5, 6);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    containerRef.current.appendChild(renderer.domElement);

    // Realistic lighting setup
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(6, 10, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.3);
    fill.position.set(-5, 3, -5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x06b6d4, 0.4);
    rim.position.set(0, 5, -8);
    scene.add(rim);
    const accent = new THREE.PointLight(0x8b5cf6, 0.5, 30);
    accent.position.set(0, 3, 2);
    scene.add(accent);

    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -1.8;
    scene.add(grid);

    groupRef.current = buildVPOPump(scene, true, null);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (groupRef.current && rotateRef.current) groupRef.current.rotation.y += 0.004;
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
    groupRef.current = buildVPOPump(sceneRef.current, explodedRef.current, highlightRef.current);
  }, [exploded, highlight]);

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-950 to-black border border-gray-800">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 bg-gray-950/85 backdrop-blur border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm">VPO Anenergy Pump — Vacuum Energy Generator</h3>
          <p className="text-gray-500 text-xs">Moray/Bearden architecture · phi-ratio scalar coupling · ATPase resonance</p>
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