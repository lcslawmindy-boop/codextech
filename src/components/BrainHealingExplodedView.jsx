import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Brain/Neural Scalar Healing Device — Exploded CAD ─────────────────────
// Schumann-trigger window + alpha-band phase conjugate scalar field device
// for neuroregeneration, trauma recovery, and neurological disease reversal.

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: opts.metal ?? 0.6,
    roughness: opts.rough ?? 0.3,
    transparent: opts.opacity !== undefined,
    opacity: opts.opacity ?? 1,
    emissive: opts.emissive !== undefined ? opts.emissive : color,
    emissiveIntensity: opts.ei ?? 0,
  });
}

function buildBrainDevice(scene, exploded, highlight) {
  const group = new THREE.Group();
  const off = exploded ? 1 : 0;

  // ── Helmet Shell (top) ──
  const helmetGroup = new THREE.Group();
  helmetGroup.position.y = 3.5 * off;
  const helmet = new THREE.Mesh(
    new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8),
    mat(0x1e293b, { metal: 0.5, rough: 0.4, opacity: 0.3, emissive: 0x06b6d4, ei: highlight === "helmet" ? 0.3 : 0.05 })
  );
  helmetGroup.add(helmet);
  group.add(helmetGroup);

  // ── Scalar Coil Crown (8-coil array around head) ──
  const coilGroup = new THREE.Group();
  coilGroup.position.y = 2.5 * off;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const coil = new THREE.Mesh(
      new THREE.TorusGeometry(0.15, 0.04, 8, 16),
      mat(0x06b6d4, { emissive: 0x06b6d4, ei: highlight === "coils" ? 0.5 : 0.2, metal: 0.8 })
    );
    coil.position.set(Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85);
    coil.rotation.x = Math.PI / 2;
    coil.rotation.y = -a;
    coilGroup.add(coil);
  }
  group.add(coilGroup);

  // ── EEG Sensor Array ──
  const eegGroup = new THREE.Group();
  eegGroup.position.y = 2.0 * off;
  const eegRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 8, 32), mat(0x10b981, { emissive: 0x10b981, ei: highlight === "eeg" ? 0.4 : 0.15 }));
  eegGroup.add(eegRing);
  // 19 EEG electrodes (10-20 system)
  for (let i = 0; i < 19; i++) {
    const a = (i / 19) * Math.PI * 2;
    const el = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), mat(0x10b981, { ei: 0.3 }));
    el.position.set(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9);
    eegGroup.add(el);
  }
  group.add(eegGroup);

  // ── Head Rest / Interface ──
  const restGroup = new THREE.Group();
  restGroup.position.y = 1.2 * off;
  const rest = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2.5), mat(0x14b8a6, { rough: 0.8, opacity: 0.5, emissive: 0x14b8a6, ei: highlight === "rest" ? 0.3 : 0.05 }));
  restGroup.add(rest);
  group.add(restGroup);

  // ── Schumann Resonance Generator ──
  const schumannGroup = new THREE.Group();
  schumannGroup.position.y = 0.2 * off;
  const gen = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), mat(0x3b82f6, { emissive: 0x3b82f6, ei: highlight === "schumann" ? 0.5 : 0.2 }));
  schumannGroup.add(gen);
  // 7.83 Hz indicator
  const ind = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x60a5fa, emissiveIntensity: 0.7 }));
  ind.position.y = 0.15;
  schumannGroup.add(ind);
  group.add(schumannGroup);

  // ── Phase Conjugate Mirror Assembly ──
  const pcmGroup = new THREE.Group();
  pcmGroup.position.y = -0.5 * off;
  const pcm = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 0.6), mat(0x8b5cf6, { emissive: 0x8b5cf6, ei: highlight === "pcm" ? 0.5 : 0.2 }));
  pcmGroup.add(pcm);
  // Crystal array
  for (let i = 0; i < 5; i++) {
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.06), mat(0xa78bfa, { ei: 0.4, metal: 0.9, rough: 0.1 }));
    crystal.position.set(-0.35 + i * 0.17, 0.1, 0);
    pcmGroup.add(crystal);
  }
  group.add(pcmGroup);

  // ── FPGA Controller ──
  const fpgaGroup = new THREE.Group();
  fpgaGroup.position.y = -1.3 * off;
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.7), mat(0x0a1929, { metal: 0.5 }));
  fpgaGroup.add(board);
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.04, 0.3), mat(0x111111));
  chip.position.y = 0.06;
  fpgaGroup.add(chip);
  group.add(fpgaGroup);

  // ── Base ──
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -2.0 * off;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.15, 32), mat(0x0f172a, { metal: 0.8 }));
  baseGroup.add(base);
  group.add(baseGroup);

  scene.add(group);
  return group;
}

export default function BrainHealingExplodedView() {
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
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(4, 2.5, 5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.7);
    d1.position.set(5, 8, 5);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x06b6d4, 0.3);
    d2.position.set(-5, -2, -5);
    scene.add(d2);

    const grid = new THREE.GridHelper(14, 14, 0x1e293b, 0x0f172a);
    grid.position.y = -2.5;
    scene.add(grid);

    groupRef.current = buildBrainDevice(scene, true, null);

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
    groupRef.current = buildBrainDevice(sceneRef.current, explodedRef.current, highlightRef.current);
  }, [exploded, highlight]);

  const parts = [
    { code: "helmet", label: "Helmet Shell", color: "#1e293b" },
    { code: "coils", label: "Scalar Coil Crown", color: "#06b6d4" },
    { code: "eeg", label: "EEG 10-20 Array", color: "#10b981" },
    { code: "schumann", label: "7.83 Hz Generator", color: "#3b82f6" },
    { code: "pcm", label: "Phase Conjugate Mirror", color: "#8b5cf6" },
  ];

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-950 to-black border border-gray-800">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-gray-950/85 backdrop-blur border-b border-gray-800">
        <h3 className="text-white font-bold text-xs">Brain/Neural Scalar Device — 7.83 Hz + Alpha Phase Conjugate</h3>
        <div className="flex gap-1.5">
          <button onClick={() => setExploded(!exploded)} className={`px-2 py-1 rounded text-[10px] font-bold ${exploded ? "bg-cyan-900/50 border border-cyan-700 text-cyan-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            {exploded ? "Exploded" : "Assembled"}
          </button>
          <button onClick={() => setAutoRotate(!autoRotate)} className={`px-2 py-1 rounded text-[10px] font-bold ${autoRotate ? "bg-indigo-900/50 border border-indigo-700 text-indigo-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            {autoRotate ? "Rot" : "Static"}
          </button>
        </div>
      </div>
      <div ref={containerRef} className="absolute inset-0 pt-12" />
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/92 backdrop-blur border-t border-gray-800 px-4 py-2">
        <div className="flex flex-wrap gap-1.5">
          {parts.map(p => (
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