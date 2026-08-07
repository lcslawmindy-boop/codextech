import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── BrightSteps AATCS-P1 Modality Exploded View ───────────────────────────
// Shows each healing modality in its physical location inside the pod shell,
// with visible wiring connections routing to the central BFAC control board.

const MOD_COLORS = {
  shell: 0x1e293b,
  pbm: 0xef4444,
  fit: 0xf97316,
  sft: 0x06b6d4,
  pemf: 0x3b82f6,
  vat: 0xa855f7,
  mct: 0xec4899,
  hit: 0x14b8a6,
  nia: 0x2dd4bf,
  bio: 0xf59e0b,
  bfac: 0x10b981,
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

// Connection wire from a point to the BFAC board
function makeWire(from, to, color) {
  const points = [
    new THREE.Vector3(...from),
    new THREE.Vector3(from[0], from[1] - 0.15, from[2]),
    new THREE.Vector3(to[0], to[1] + 0.15, to[2]),
    new THREE.Vector3(...to),
  ];
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 20, 0.015, 6, false);
  return new THREE.Mesh(geo, mat(color, { metal: 0.4, rough: 0.6, emissive: color, ei: 0.15 }));
}

function buildScene(scene, exploded, highlight) {
  const group = new THREE.Group();
  const off = exploded ? 1 : 0;

  const bfacPos = [0, -1.4, 0];

  // ── BFAC Control Board (center, lower bay) ──
  const bfacGroup = new THREE.Group();
  bfacGroup.position.y = -1.4 * off + (-1.4 * (1 - off));
  const bfacBoard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.6), mat(MOD_COLORS.bfac, { emissive: MOD_COLORS.bfac, ei: highlight === "bfac" ? 0.4 : 0.15 }));
  bfacGroup.add(bfacBoard);
  // MCU chip
  const chip = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.3), mat(0x111111, { rough: 0.4 }));
  chip.position.y = 0.08;
  bfacGroup.add(chip);
  // Status LEDs
  [0, 1, 2, 3].forEach((i) => {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.6 }));
    led.position.set(-0.4 + i * 0.25, 0.08, 0.25);
    bfacGroup.add(led);
  });
  group.add(bfacGroup);

  // ── PBM LED Arrays (canopy interior, top) ──
  const pbmGroup = new THREE.Group();
  pbmGroup.position.y = 3.5 * off;
  const pbmCanopy = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.12, 32), mat(MOD_COLORS.pbm, { emissive: MOD_COLORS.pbm, ei: highlight === "pbm" ? 0.5 : 0.2 }));
  pbmCanopy.material.transparent = true;
  pbmCanopy.material.opacity = 0.7;
  pbmGroup.add(pbmCanopy);
  // LED grid dots
  for (let ring = 0; ring < 3; ring++) {
    const count = 6 + ring * 4;
    const r = 0.3 + ring * 0.3;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.4 }));
      led.position.set(Math.cos(a) * r, -0.07, Math.sin(a) * r);
      pbmGroup.add(led);
    }
  }
  group.add(pbmGroup);
  group.add(makeWire([0, 3.5 * off, 0], bfacPos, MOD_COLORS.pbm));

  // ── NIA Emitter (canopy crown, top center) ──
  const niaGroup = new THREE.Group();
  niaGroup.position.y = 4.2 * off;
  const niaBase = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), mat(MOD_COLORS.nia, { emissive: MOD_COLORS.nia, ei: highlight === "nia" ? 0.4 : 0.2 }));
  niaGroup.add(niaBase);
  const niaNeedle = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 8), mat(MOD_COLORS.nia, { ei: 0.3 }));
  niaNeedle.position.y = 0.12;
  niaGroup.add(niaNeedle);
  group.add(niaGroup);
  group.add(makeWire([0, 4.2 * off, 0], bfacPos, MOD_COLORS.nia));

  // ── SFT Scalar Coil Array (octagonal wall, 8 pairs) ──
  const sftGroup = new THREE.Group();
  sftGroup.position.y = 1.8 * off;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const x = Math.cos(a) * 1.15;
    const z = Math.sin(a) * 1.15;
    const coilG = new THREE.Group();
    coilG.position.set(x, 0, z);
    coilG.rotation.y = -a;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 12), mat(0x3a3a3a, { metal: 0.9, rough: 0.1 }));
    coilG.add(core);
    const wind = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 8, 16), mat(MOD_COLORS.sft, { emissive: MOD_COLORS.sft, ei: highlight === "sft" ? 0.4 : 0.15 }));
    coilG.add(wind);
    sftGroup.add(coilG);
  }
  group.add(sftGroup);
  group.add(makeWire([0, 1.8 * off, 0], bfacPos, MOD_COLORS.sft));

  // ── BIO Biometric Sensors (headrest + armrests) ──
  const bioGroup = new THREE.Group();
  bioGroup.position.y = 2.6 * off;
  // Headrest HRV + temp
  const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.2), mat(MOD_COLORS.bio, { emissive: MOD_COLORS.bio, ei: highlight === "bio" ? 0.4 : 0.15 }));
  headrest.position.set(0, 0, -0.9);
  bioGroup.add(headrest);
  // EEG dock (crown)
  const eeg = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16), mat(MOD_COLORS.bio, { ei: 0.2 }));
  eeg.position.set(0, 0.1, 0);
  bioGroup.add(eeg);
  group.add(bioGroup);
  group.add(makeWire([0, 2.6 * off, -0.9], bfacPos, MOD_COLORS.bio));

  // ── VAT Transducers (seat back, 4 visible) ──
  const vatGroup = new THREE.Group();
  vatGroup.position.y = 0.3 * off;
  for (let i = 0; i < 4; i++) {
    const x = -0.5 + i * 0.33;
    const td = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), mat(MOD_COLORS.vat, { emissive: MOD_COLORS.vat, ei: highlight === "vat" ? 0.4 : 0.15 }));
    td.position.set(x, 0, -0.6);
    td.rotation.x = Math.PI / 2;
    vatGroup.add(td);
  }
  group.add(vatGroup);
  group.add(makeWire([0, 0.3 * off, -0.6], bfacPos, MOD_COLORS.vat));

  // ── FIR Thermal Panels (seat back + foot) ──
  const fitGroup = new THREE.Group();
  fitGroup.position.y = 0.1 * off;
  const firBack = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.6, 0.05), mat(MOD_COLORS.fit, { emissive: MOD_COLORS.fit, ei: highlight === "fit" ? 0.4 : 0.12 }));
  firBack.position.set(0, 0.3, -0.7);
  fitGroup.add(firBack);
  const firSeat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.5), mat(MOD_COLORS.fit, { ei: 0.12 }));
  firSeat.position.set(0, 0, 0);
  fitGroup.add(firSeat);
  group.add(fitGroup);
  group.add(makeWire([0, 0.1 * off, -0.7], bfacPos, MOD_COLORS.fit));

  // ── MCT Ports (armrests, left + right) ──
  const mctGroup = new THREE.Group();
  mctGroup.position.y = 0.2 * off;
  [-0.7, 0.7].forEach((x) => {
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 16), mat(MOD_COLORS.mct, { metal: 0.9, rough: 0.1, emissive: MOD_COLORS.mct, ei: highlight === "mct" ? 0.4 : 0.15 }));
    port.position.set(x, 0.15, 0.1);
    port.rotation.x = Math.PI / 2;
    mctGroup.add(port);
  });
  group.add(mctGroup);
  group.add(makeWire([0.7, 0.2 * off, 0.1], bfacPos, MOD_COLORS.mct));

  // ── PEMF Floor Coil Matrix (2x2 grid, below seat) ──
  const pemfGroup = new THREE.Group();
  pemfGroup.position.y = -0.4 * off;
  for (let gx = 0; gx < 2; gx++) {
    for (let gz = 0; gz < 2; gz++) {
      const x = -0.35 + gx * 0.7;
      const z = -0.2 + gz * 0.4;
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 8, 24), mat(MOD_COLORS.pemf, { emissive: MOD_COLORS.pemf, ei: highlight === "pemf" ? 0.4 : 0.15 }));
      coil.position.set(x, 0, z);
      coil.rotation.x = Math.PI / 2;
      pemfGroup.add(coil);
    }
  }
  group.add(pemfGroup);
  group.add(makeWire([0, -0.4 * off, 0], bfacPos, MOD_COLORS.pemf));

  // ── HIT Hydrogen Module (lower bay, side) ──
  const hitGroup = new THREE.Group();
  hitGroup.position.set(0.8, -1.0 * off, 0);
  const h2Tank = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16), mat(MOD_COLORS.hit, { emissive: MOD_COLORS.hit, ei: highlight === "hit" ? 0.4 : 0.15 }));
  hitGroup.add(h2Tank);
  const h2Tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), mat(MOD_COLORS.hit, { opacity: 0.5, ei: 0.1 }));
  h2Tube.position.set(-0.4, 0.6, 0);
  h2Tube.rotation.z = 0.3;
  hitGroup.add(h2Tube);
  group.add(hitGroup);
  group.add(makeWire([0.8, -1.0 * off, 0], bfacPos, MOD_COLORS.hit));

  // ── Pod Shell (semi-transparent, wireframe outer) ──
  const shellGeo = new THREE.CylinderGeometry(1.4, 1.4, 4.5, 32, 1, true);
  const shellMat = new THREE.MeshStandardMaterial({
    color: MOD_COLORS.shell,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
  });
  const shell = new THREE.Mesh(shellGeo, shellMat);
  shell.position.y = 0.5;
  group.add(shell);
  // Shell wireframe edges
  const shellWire = new THREE.Mesh(shellGeo, new THREE.MeshBasicMaterial({ color: 0x334155, wireframe: true, transparent: true, opacity: 0.15, side: THREE.DoubleSide }));
  shellWire.position.y = 0.5;
  group.add(shellWire);
  // Top dome
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), shellMat);
  dome.position.y = 2.75;
  group.add(dome);
  // Floor base
  const floor = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.1, 32), mat(0x0f172a, { metal: 0.7, rough: 0.3 }));
  floor.position.y = -1.8;
  group.add(floor);

  // ── Patient bed (center reference) ──
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 0.5), mat(0x1a1a2e, { rough: 0.8 }));
  bed.position.set(0, -0.2, 0);
  group.add(bed);

  scene.add(group);
  return group;
}

const MODALITY_LEGEND = [
  { code: "PBM", label: "Photobiomodulation LEDs", color: "#ef4444", pos: "Canopy interior" },
  { code: "FIT", label: "Far-Infrared Thermal Panels", color: "#f97316", pos: "Seat back + floor" },
  { code: "SFT", label: "Scalar Field Coil Array", color: "#06b6d4", pos: "Octagonal wall" },
  { code: "PEMF", label: "PEMF Floor Matrix", color: "#3b82f6", pos: "Under seat (2×2)" },
  { code: "VAT", label: "Vibroacoustic Transducers", color: "#a855f7", pos: "Seat back" },
  { code: "MCT", label: "MicroCurrent Ports", color: "#ec4899", pos: "Armrests" },
  { code: "HIT", label: "Hydrogen Inhalation Module", color: "#14b8a6", pos: "Lower bay (side)" },
  { code: "NIA", label: "Negative Ion Air Emitter", color: "#2dd4bf", pos: "Canopy crown" },
  { code: "BIO", label: "Biometric Sensor Array", color: "#f59e0b", pos: "Headrest + armrests" },
  { code: "BFAC", label: "BFAC Control Board", color: "#10b981", pos: "Lower electronics bay" },
];

export default function TherapyPodModalityExplodedView() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
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
    scene.background = new THREE.Color(0x070a0f);
    sceneRef.current = scene;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(4.5, 2.5, 5.5);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.7);
    d1.position.set(5, 8, 5);
    scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x06b6d4, 0.25);
    d2.position.set(-5, -2, -5);
    scene.add(d2);
    const p = new THREE.PointLight(0x10b981, 0.4, 50);
    p.position.set(0, -1.4, 0);
    scene.add(p);

    const grid = new THREE.GridHelper(16, 16, 0x1e293b, 0x0f172a);
    grid.position.y = -2.2;
    scene.add(grid);

    groupRef.current = buildScene(scene, true, null);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (groupRef.current && rotateRef.current) groupRef.current.rotation.y += 0.0025;
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
    groupRef.current = buildScene(sceneRef.current, explodedRef.current, highlightRef.current);
  }, [exploded, highlight]);

  return (
    <div className="relative w-full h-[560px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-950 to-black border border-gray-800">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gray-950/85 backdrop-blur border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm">Healing Modality Connection Diagram — AATCS-P1</h3>
          <p className="text-gray-500 text-xs">Exploded view showing how each modality connects to the BFAC board</p>
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

      {/* 3D canvas */}
      <div ref={containerRef} className="absolute inset-0 pt-16" />

      {/* Modality selector + legend */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/92 backdrop-blur border-t border-gray-800 px-5 py-3">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
          {MODALITY_LEGEND.map((m) => (
            <button
              key={m.code}
              onClick={() => setHighlight(highlight === m.code ? null : m.code)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-all ${highlight === m.code ? "bg-gray-800 ring-1" : "hover:bg-gray-800/50"}`}
              style={highlight === m.code ? { boxShadow: `0 0 0 1px ${m.color}` } : {}}
            >
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: m.color, boxShadow: highlight === m.code ? `0 0 6px ${m.color}` : "none" }} />
              <div className="min-w-0">
                <p className="text-gray-200 text-[10px] font-bold leading-tight">{m.code}</p>
                <p className="text-gray-600 text-[9px] leading-tight truncate">{m.pos}</p>
              </div>
            </button>
          ))}
        </div>
        <p className="text-gray-600 text-[10px] mt-2 text-center">Click a modality to highlight its wiring path · {highlight ? `Highlighted: ${highlight}` : "None selected"}</p>
      </div>
    </div>
  );
}