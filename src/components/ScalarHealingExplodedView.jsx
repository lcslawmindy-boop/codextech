import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Prioré Multichannel EM Healing Device — Exploded CAD View ──────────────
// Renders Antoine Prioré's suppressed architecture: rotating plasma tube,
// 3-layer DDS modulation coils, Prioré magnetic confinement, and target
// tissue platform. Modern FPGA/DDS reconstruction.

const PART_COLORS = {
  plasma: 0x06b6d4,      // Plasma tube (cyan)
  dds1: 0x3b82f6,       // DDS layer 1 (blue)
  dds2: 0x6366f1,       // DDS layer 2 (indigo)
  dds3: 0x8b5cf6,       // DDS layer 3 (purple)
  coil: 0xf59e0b,       // Copper coil (amber)
  magnet: 0xef4444,     // Magnetic confinement (red)
  platform: 0x14b8a6,   // Tissue platform (teal)
  frame: 0x1e293b,     // Frame (slate)
  shield: 0x475569,     // Faraday shield
  base: 0x0f172a,       // Base
};

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

function buildPrioraDevice(scene, exploded, highlight) {
  const group = new THREE.Group();
  const off = exploded ? 1 : 0;

  // ── Rotating Plasma Tube (top) ──
  const plasmaGroup = new THREE.Group();
  plasmaGroup.position.y = 4.5 * off;
  const plasmaTube = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25, 0.25, 1.2, 32),
    mat(PART_COLORS.plasma, { emissive: PART_COLORS.plasma, ei: highlight === "plasma" ? 0.6 : 0.3, opacity: 0.7, metal: 0.2, rough: 0.1 })
  );
  plasmaGroup.add(plasmaTube);
  // Plasma glow core
  const plasmaCore = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 1.0, 16),
    new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.5 })
  );
  plasmaGroup.add(plasmaCore);
  // Rotation motor housing
  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 16), mat(0x333333, { metal: 0.9, rough: 0.2 }));
  motor.position.y = 0.75;
  plasmaGroup.add(motor);
  group.add(plasmaGroup);

  // ── DDS Layer 3 (top modulation coil) ──
  const dds3Group = new THREE.Group();
  dds3Group.position.y = 3.2 * off;
  const dds3Ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.8, 0.08, 16, 48),
    mat(PART_COLORS.dds3, { emissive: PART_COLORS.dds3, ei: highlight === "dds3" ? 0.5 : 0.2, metal: 0.7, rough: 0.2 })
  );
  dds3Group.add(dds3Ring);
  // Winding detail
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), mat(0xfbbf24, { ei: 0.2 }));
    w.position.set(Math.cos(a) * 0.8, 0, Math.sin(a) * 0.8);
    dds3Group.add(w);
  }
  group.add(dds3Group);

  // ── DDS Layer 2 (mid modulation coil) ──
  const dds2Group = new THREE.Group();
  dds2Group.position.y = 2.4 * off;
  const dds2Ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.09, 16, 48),
    mat(PART_COLORS.dds2, { emissive: PART_COLORS.dds2, ei: highlight === "dds2" ? 0.5 : 0.2, metal: 0.7, rough: 0.2 })
  );
  dds2Group.add(dds2Ring);
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), mat(0xfbbf24, { ei: 0.2 }));
    w.position.set(Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85);
    dds2Group.add(w);
  }
  group.add(dds2Group);

  // ── DDS Layer 1 (bottom modulation coil) ──
  const dds1Group = new THREE.Group();
  dds1Group.position.y = 1.6 * off;
  const dds1Ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.9, 0.1, 16, 48),
    mat(PART_COLORS.dds1, { emissive: PART_COLORS.dds1, ei: highlight === "dds1" ? 0.5 : 0.2, metal: 0.7, rough: 0.2 })
  );
  dds1Group.add(dds1Ring);
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), mat(0xfbbf24, { ei: 0.2 }));
    w.position.set(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9);
    dds1Group.add(w);
  }
  group.add(dds1Group);

  // ── Prioré Magnetic Confinement (Helmholtz pair) ──
  const magnetGroup = new THREE.Group();
  magnetGroup.position.y = 0.8 * off;
  const magTop = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.12, 16, 48),
    mat(PART_COLORS.magnet, { emissive: PART_COLORS.magnet, ei: highlight === "magnet" ? 0.4 : 0.15, metal: 0.8, rough: 0.3 })
  );
  magTop.position.y = 0.2;
  magnetGroup.add(magTop);
  const magBot = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.12, 16, 48),
    mat(PART_COLORS.magnet, { emissive: PART_COLORS.magnet, ei: highlight === "magnet" ? 0.4 : 0.15, metal: 0.8, rough: 0.3 })
  );
  magBot.position.y = -0.2;
  magnetGroup.add(magBot);
  // Support struts
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), mat(0x666666, { metal: 0.9 }));
    strut.position.set(Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1);
    magnetGroup.add(strut);
  });
  group.add(magnetGroup);

  // ── Target Tissue Platform (center) ──
  const platformGroup = new THREE.Group();
  platformGroup.position.y = 0.1 * off;
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.6, 0.08, 32),
    mat(PART_COLORS.platform, { emissive: PART_COLORS.platform, ei: highlight === "platform" ? 0.4 : 0.1, metal: 0.4, rough: 0.6 })
  );
  platformGroup.add(platform);
  // Tissue sample
  const tissue = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 24, 24),
    new THREE.MeshStandardMaterial({ color: 0xfda4af, transparent: true, opacity: 0.6, roughness: 0.9 })
  );
  tissue.position.y = 0.08;
  platformGroup.add(tissue);
  group.add(platformGroup);

  // ── FPGA / DDS Controller Board ──
  const fpgaGroup = new THREE.Group();
  fpgaGroup.position.y = -0.8 * off;
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.1, 0.8), mat(0x0a1929, { metal: 0.5, rough: 0.4 }));
  fpgaGroup.add(board);
  // FPGA chip
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.04, 0.4), mat(0x111111, { rough: 0.3 }));
  chip.position.y = 0.07;
  fpgaGroup.add(chip);
  // DDS synthesizer chips (3x)
  [0, 1, 2].forEach(i => {
    const dds = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.15), mat([PART_COLORS.dds1, PART_COLORS.dds2, PART_COLORS.dds3][i], { ei: 0.3 }));
    dds.position.set(-0.4 + i * 0.4, 0.07, 0.25);
    fpgaGroup.add(dds);
  });
  // Status LEDs
  [0, 1, 2, 3].forEach(i => {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.6 }));
    led.position.set(-0.5 + i * 0.3, 0.07, -0.3);
    fpgaGroup.add(led);
  });
  group.add(fpgaGroup);

  // ── Faraday Shield (wireframe cylinder) ──
  const shieldGroup = new THREE.Group();
  shieldGroup.position.y = -1.8 * off;
  const shield = new THREE.Mesh(
    new THREE.CylinderGeometry(1.3, 1.3, 5.5, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: PART_COLORS.shield, metal: 0.8, rough: 0.4, wireframe: true, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  );
  shield.position.y = 1.5;
  shieldGroup.add(shield);
  group.add(shieldGroup);

  // ── Base Frame ──
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -2.6 * off;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.2, 32), mat(PART_COLORS.base, { metal: 0.8, rough: 0.2 }));
  baseGroup.add(base);
  // Leveling feet
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(a => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12), mat(0x333333, { metal: 0.9 }));
    foot.position.set(Math.cos(a) * 1.2, -0.15, Math.sin(a) * 1.2);
    baseGroup.add(foot);
  });
  group.add(baseGroup);

  scene.add(group);
  return group;
}

const PARTS_LEGEND = [
  { code: "plasma", label: "Rotating Plasma Tube", color: "#06b6d4", desc: "Mercury-argon plasma — primary EM emission source" },
  { code: "dds3", label: "DDS Layer 3 (S''')", color: "#8b5cf6", desc: "Tertiary modulation — morphogenetic template carrier" },
  { code: "dds2", label: "DDS Layer 2 (S'')", color: "#6366f1", desc: "Secondary modulation — phase conjugation mirror" },
  { code: "dds1", label: "DDS Layer 1 (S')", color: "#3b82f6", desc: "Primary modulation — base frequency carrier" },
  { code: "magnet", label: "Magnetic Confinement", color: "#ef4444", desc: "Helmholtz pair — Prioré field focusing" },
  { code: "platform", label: "Target Tissue Platform", color: "#14b8a6", desc: "Patient tissue interface — adjustable height" },
];

export default function ScalarHealingExplodedView() {
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
    camera.position.set(5, 3, 6);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    const p = new THREE.PointLight(0x8b5cf6, 0.4, 50);
    p.position.set(0, 2, 0);
    scene.add(p);

    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -3;
    scene.add(grid);

    groupRef.current = buildPrioraDevice(scene, true, null);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (groupRef.current && rotateRef.current) groupRef.current.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
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
    groupRef.current = buildPrioraDevice(sceneRef.current, explodedRef.current, highlightRef.current);
  }, [exploded, highlight]);

  return (
    <div className="relative w-full h-[560px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-950 to-black border border-gray-800">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gray-950/85 backdrop-blur border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm">Prioré Multichannel EM Device — Exploded CAD</h3>
          <p className="text-gray-500 text-xs">3-layer DDS modulation · plasma tube · Helmholtz confinement · FPGA control</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExploded(!exploded)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${exploded ? "bg-cyan-900/50 border border-cyan-700 text-cyan-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            {exploded ? "Exploded" : "Assembled"}
          </button>
          <button onClick={() => setAutoRotate(!autoRotate)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${autoRotate ? "bg-indigo-900/50 border border-indigo-700 text-indigo-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            {autoRotate ? "Rotating" : "Static"}
          </button>
        </div>
      </div>

      <div ref={containerRef} className="absolute inset-0 pt-16" />

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/92 backdrop-blur border-t border-gray-800 px-5 py-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {PARTS_LEGEND.map(p => (
            <button
              key={p.code}
              onClick={() => setHighlight(highlight === p.code ? null : p.code)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${highlight === p.code ? "bg-gray-800 ring-1" : "hover:bg-gray-800/50"}`}
              style={highlight === p.code ? { boxShadow: `0 0 0 1px ${p.color}` } : {}}
            >
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: p.color, boxShadow: highlight === p.code ? `0 0 6px ${p.color}` : "none" }} />
              <div className="min-w-0">
                <p className="text-gray-200 text-[10px] font-bold leading-tight">{p.label}</p>
                <p className="text-gray-600 text-[9px] leading-tight truncate">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}