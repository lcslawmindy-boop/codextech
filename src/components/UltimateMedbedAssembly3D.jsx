import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, CheckCircle2 } from "lucide-react";

// ── Interactive 3D Assembly Manual ──────────────────────────────────────────
// Step-by-step assembly viewer: each step adds components to the 3D scene.
// User steps through with prev/next or auto-play. The 3D model builds up
// progressively, showing exactly how each healing module fits together.

const COLORS = {
  shell: 0x1a1a2e, canopy: 0x0d1b2a, orgone: 0x2d4a2d, orgoneMetal: 0x5a4a3a,
  faraday: 0x8B4513, coils: 0x06b6d4, bed: 0x1a1a1a, mattress: 0x2a2a3e,
  vortex: 0x14b8a6, nada: 0xeab308, resonator: 0x6366f1, diagnostic: 0xec4899,
  power: 0xf59e0b, safety: 0xef4444, pbm: 0xef4444, pemf: 0x3b82f6,
  vat: 0xa855f7, fir: 0xf97316, mct: 0xec4899, hit: 0x14b8a6, nia: 0x2dd4bf,
  chm: 0xa855f7, eeg: 0x8b5cf6, pri: 0x2dd4bf, rife: 0xf43f5e, gsc: 0x6366f1,
};

function mat(color, metalness = 0.7, roughness = 0.3, emissive, ei = 0) {
  const m = new THREE.MeshStandardMaterial({ color, metalness, roughness, transparent: true, opacity: 0.92 });
  if (emissive !== undefined) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = ei; }
  return m;
}

// ── Build functions: each returns a Group added at a specific step ──────────
// Steps are ordered to match the assembly manual phases A-K.

function buildBaseFrame() {
  const g = new THREE.Group();
  // Base frame rectangle
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 1.0), mat(COLORS.shell, 0.8, 0.2));
  base.position.y = -2.5;
  g.add(base);
  // 4 vertical posts
  [[-1.0, -0.4], [1.0, -0.4], [-1.0, 0.4], [1.0, 0.4]].forEach(([x, z]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 3.0, 0.08), mat(COLORS.shell, 0.8, 0.2));
    post.position.set(x, -1.0, z);
    g.add(post);
  });
  // Leveling feet
  [[-1.0, -0.4], [1.0, -0.4], [-1.0, 0.4], [1.0, 0.4]].forEach(([x, z]) => {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.06, 12), mat(0x444444, 0.9, 0.1));
    foot.position.set(x, -2.56, z);
    g.add(foot);
  });
  return g;
}

function buildCanopy() {
  const g = new THREE.Group();
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.3, 0.9), mat(COLORS.canopy, 0.6, 0.4));
  canopy.position.y = 1.8;
  g.add(canopy);
  // Cross braces
  const brace1 = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.05, 0.05), mat(0x333333, 0.8, 0.2));
  brace1.position.set(0, 1.5, 0.4);
  g.add(brace1);
  const brace2 = brace1.clone();
  brace2.position.z = -0.4;
  g.add(brace2);
  // Linear actuator
  const actuator = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12), mat(0x666666, 0.9, 0.1));
  actuator.position.set(0, 1.65, 0);
  g.add(actuator);
  return g;
}

function buildOrgoneEnvelope() {
  const g = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const layer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3 + i * 0.05, 1.3 + i * 0.05, 2.8, 32, 1, true),
      new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? COLORS.orgone : COLORS.orgoneMetal,
        metalness: i % 2 === 0 ? 0.1 : 0.7,
        roughness: i % 2 === 0 ? 0.9 : 0.3,
        transparent: true, opacity: 0.15, side: THREE.DoubleSide,
      })
    );
    layer.position.y = -0.5;
    g.add(layer);
  }
  return g;
}

function buildFaradayShield() {
  const g = new THREE.Group();
  const shield = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.25, 2.6, 32, 1, true),
    new THREE.MeshStandardMaterial({ color: COLORS.faraday, metalness: 0.5, roughness: 0.6, wireframe: true, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
  );
  shield.position.y = -0.5;
  g.add(shield);
  return g;
}

function buildScalarCoils() {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.06, 8), mat(0x222222, 0.8, 0.2));
  ring.position.y = 0.3;
  g.add(ring);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const sub = new THREE.Group();
    sub.position.set(Math.cos(a) * 0.85, 0.3, Math.sin(a) * 0.85);
    sub.rotation.y = -a;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 16), mat(0x3a3a3a, 0.9, 0.1));
    sub.add(core);
    const winding = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: COLORS.coils, metalness: 0.9, roughness: 0.2, emissive: COLORS.coils, emissiveIntensity: 0.2 }));
    sub.add(winding);
    g.add(sub);
  }
  return g;
}

function buildPrieRife() {
  const g = new THREE.Group();
  // Prioré modulator
  const priMod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16), mat(0x1a1a2e, 0.7, 0.3));
  priMod.position.set(-0.6, 0.6, -0.5);
  g.add(priMod);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.18, 12), new THREE.MeshStandardMaterial({ color: COLORS.pri, transparent: true, opacity: 0.7, emissive: COLORS.pri, emissiveIntensity: 0.4 }));
    tube.position.set(-0.6 + Math.cos(a) * 0.25, 0.72, -0.5 + Math.sin(a) * 0.25);
    g.add(tube);
  }
  // Rife plasma tubes
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const plasma = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.25, 12), new THREE.MeshStandardMaterial({ color: COLORS.rife, transparent: true, opacity: 0.6, emissive: COLORS.rife, emissiveIntensity: 0.5 }));
    plasma.position.set(Math.cos(a) * 0.75, 0.6, Math.sin(a) * 0.75);
    g.add(plasma);
  }
  return g;
}

function buildPBM() {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.02, 0.18), new THREE.MeshStandardMaterial({ color: COLORS.pbm, emissive: COLORS.pbm, emissiveIntensity: 0.5, transparent: true, opacity: 0.9 }));
      led.position.set(-0.7 + i * 0.35, 1.62, -0.3 + j * 0.3);
      g.add(led);
    }
  }
  return g;
}

function buildPEMF() {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const x = i % 2 === 0 ? -0.35 : 0.35;
    const z = i < 2 ? -0.25 : 0.25;
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.035, 8, 24), new THREE.MeshStandardMaterial({ color: COLORS.pemf, metalness: 0.8, roughness: 0.2, emissive: COLORS.pemf, emissiveIntensity: 0.2 }));
    coil.position.set(x, -2.2, z);
    coil.rotation.x = Math.PI / 2;
    g.add(coil);
  }
  return g;
}

function buildFIR() {
  const g = new THREE.Group();
  const left = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.03, 0.5), new THREE.MeshStandardMaterial({ color: COLORS.fir, emissive: COLORS.fir, emissiveIntensity: 0.2, transparent: true, opacity: 0.6 }));
  left.position.set(-0.4, -1.8, 0);
  left.rotation.y = Math.PI / 2;
  g.add(left);
  const right = left.clone();
  right.position.x = 0.4;
  g.add(right);
  return g;
}

function buildVAT() {
  const g = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const td = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshStandardMaterial({ color: COLORS.vat, emissive: COLORS.vat, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 }));
    td.position.set(-0.7 + (i % 4) * 0.45, -1.85, i < 4 ? -0.18 : 0.18);
    g.add(td);
  }
  return g;
}

function buildMCT() {
  const g = new THREE.Group();
  // 4 electrode ports
  [[-0.8, -1.7, 0.3], [0.8, -1.7, 0.3], [-0.8, -1.7, -0.3], [0.8, -1.7, -0.3]].forEach(([x, y, z]) => {
    const port = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16), new THREE.MeshStandardMaterial({ color: COLORS.mct, metalness: 0.9, roughness: 0.1, emissive: COLORS.mct, emissiveIntensity: 0.15 }));
    port.position.set(x, y, z);
    g.add(port);
  });
  return g;
}

function buildNIA_CHM() {
  const g = new THREE.Group();
  // NIA corona emitter
  const nia = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.12, 16), new THREE.MeshStandardMaterial({ color: COLORS.nia, emissive: COLORS.nia, emissiveIntensity: 0.4 }));
  nia.position.set(0, 1.65, 0);
  g.add(nia);
  // Chromotherapy WLED strip
  const wled = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: COLORS.chm, emissive: COLORS.chm, emissiveIntensity: 0.7 }));
  wled.position.set(0, 1.62, 0.4);
  g.add(wled);
  return g;
}

function buildHIT_OZO() {
  const g = new THREE.Group();
  const hit = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.25), mat(COLORS.hit, 0.5, 0.4, COLORS.hit, 0.1));
  hit.position.set(-0.3, -2.7, 0.3);
  g.add(hit);
  const ozo = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.2), mat(0x0ea5e9, 0.5, 0.4, 0x0ea5e9, 0.1));
  ozo.position.set(0.3, -2.7, 0.3);
  g.add(ozo);
  return g;
}

function buildVortex() {
  const g = new THREE.Group();
  const chamber = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.45, 32), new THREE.MeshStandardMaterial({ color: COLORS.vortex, transparent: true, opacity: 0.35, metalness: 0.3, roughness: 0.1 }));
  chamber.position.set(0, -2.7, -0.3);
  g.add(chamber);
  const impeller = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.22, 16), mat(0x0d9488, 0.9, 0.1));
  impeller.position.set(0, -2.7, -0.3);
  g.add(impeller);
  return g;
}

function buildNadaGSC() {
  const g = new THREE.Group();
  // 7 chakra transducers
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const td = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.5, roughness: 0.3, emissive: 0xfbbf24, emissiveIntensity: 0.25 }));
    td.position.set(Math.cos(a) * 0.8, -0.5 + i * 0.3, Math.sin(a) * 0.8);
    g.add(td);
  }
  // 4 G-Scaling resonators
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const sph = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), mat(COLORS.gsc, 0.6, 0.3, COLORS.gsc, 0.25));
    sph.position.set(Math.cos(a) * 0.75, -2.3, Math.sin(a) * 0.75);
    g.add(sph);
  }
  return g;
}

function buildEEG() {
  const g = new THREE.Group();
  const dock = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 16), new THREE.MeshStandardMaterial({ color: COLORS.eeg, emissive: COLORS.eeg, emissiveIntensity: 0.3, metalness: 0.5 }));
  dock.position.set(0.6, 1.6, 0.3);
  dock.rotation.x = Math.PI / 2;
  g.add(dock);
  return g;
}

function buildDiagnostic() {
  const g = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.03, 8, 32), mat(COLORS.diagnostic, 0.5, 0.3, COLORS.diagnostic, 0.15));
  ring.position.y = 0.9;
  g.add(ring);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    sensor.position.set(Math.cos(a) * 0.9, 0.9, Math.sin(a) * 0.9);
    g.add(sensor);
  }
  return g;
}

function buildSafety() {
  const g = new THREE.Group();
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.15, 32), mat(COLORS.safety, 0.6, 0.4, COLORS.safety, 0.08));
  cyl.position.y = 1.1;
  cyl.material.opacity = 0.8;
  g.add(cyl);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.6 }));
    led.position.set(Math.cos(a) * 0.7, 1.18, Math.sin(a) * 0.7);
    g.add(led);
  }
  return g;
}

function buildPowerControl() {
  const g = new THREE.Group();
  const bay = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 0.8), mat(COLORS.power, 0.6, 0.4));
  bay.position.set(0, -2.7, -0.3);
  g.add(bay);
  const hmi = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.02), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x06b6d4, emissiveIntensity: 0.4 }));
  hmi.position.set(0, -2.55, 0.11);
  g.add(hmi);
  return g;
}

function buildBed() {
  const g = new THREE.Group();
  const bed = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.7), mat(COLORS.bed, 0.3, 0.7));
  bed.position.y = -1.9;
  g.add(bed);
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.07, 0.65), new THREE.MeshStandardMaterial({ color: COLORS.mattress, roughness: 0.9 }));
  mattress.position.y = -1.82;
  g.add(mattress);
  return g;
}

// ── Assembly step definitions (maps to build functions) ────────────────────
const BUILD_STEPS = [
  { id: "A", label: "Structural Frame", build: buildBaseFrame, color: "#64748b" },
  { id: "A2", label: "Canopy Assembly", build: buildCanopy, color: "#64748b" },
  { id: "B", label: "Orgone Envelope", build: buildOrgoneEnvelope, color: "#65a30d" },
  { id: "C1", label: "Faraday Shield", build: buildFaradayShield, color: "#8B4513" },
  { id: "C2", label: "Scalar Coil Array", build: buildScalarCoils, color: "#06b6d4" },
  { id: "D", label: "Prioré + Rife Systems", build: buildPrieRife, color: "#2dd4bf" },
  { id: "E1", label: "PBM LED Arrays", build: buildPBM, color: "#ef4444" },
  { id: "E2", label: "PEMF Matrix", build: buildPEMF, color: "#3b82f6" },
  { id: "E3", label: "FIR Panels", build: buildFIR, color: "#f97316" },
  { id: "E4", label: "Treatment Bed + VAT", build: () => { const g = new THREE.Group(); g.add(buildBed()); g.add(buildVAT()); return g; }, color: "#a855f7" },
  { id: "F1", label: "MCT Electrodes", build: buildMCT, color: "#ec4899" },
  { id: "F2", label: "NIA + Chromotherapy", build: buildNIA_CHM, color: "#2dd4bf" },
  { id: "G1", label: "H₂ + O₃ Systems", build: buildHIT_OZO, color: "#14b8a6" },
  { id: "G2", label: "Vortex Water System", build: buildVortex, color: "#0891b2" },
  { id: "H1", label: "Vedic Nada + G-Scaling", build: buildNadaGSC, color: "#eab308" },
  { id: "H2", label: "EEG Neurofeedback", build: buildEEG, color: "#8b5cf6" },
  { id: "I1", label: "Spectrum Diagnostic", build: buildDiagnostic, color: "#ec4899" },
  { id: "I2", label: "Safety Module", build: buildSafety, color: "#ef4444" },
  { id: "J", label: "Power + Control Bay", build: buildPowerControl, color: "#f59e0b" },
];

export default function UltimateMedbedAssembly3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const partsRef = useRef([]); // accumulated groups
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const stepRef = useRef(0);
  const autoRef = useRef(false);

  useEffect(() => { stepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { autoRef.current = autoPlay; }, [autoPlay]);

  // Init scene
  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    sceneRef.current = scene;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(5, 2, 7);
    camera.lookAt(0, -0.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(5, 8, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x06b6d4, 0.35);
    fill.position.set(-5, -3, -5);
    scene.add(fill);
    const rim = new THREE.PointLight(0xec4899, 0.5, 100);
    rim.position.set(0, 0, 4);
    scene.add(rim);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x222244, 0x111122);
    grid.position.y = -2.6;
    scene.add(grid);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      // Gentle rotation of accumulated parts
      partsRef.current.forEach((p, i) => {
        if (p) p.rotation.y += 0.002;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const ww = containerRef.current.clientWidth;
      const hh = containerRef.current.clientHeight;
      camera.aspect = ww / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(ww, hh);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      if (stepRef.current < BUILD_STEPS.length - 1) {
        setCurrentStep(s => s + 1);
      } else {
        setAutoPlay(false);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  // Build/rebuild parts based on currentStep
  useEffect(() => {
    if (!sceneRef.current) return;
    // Remove parts beyond currentStep
    while (partsRef.current.length > currentStep + 1) {
      const p = partsRef.current.pop();
      if (p) sceneRef.current.remove(p);
    }
    // Add parts up to currentStep
    for (let i = 0; i <= currentStep; i++) {
      if (!partsRef.current[i]) {
        const stepDef = BUILD_STEPS[i];
        const group = stepDef.build();
        // Animate in: start scaled down
        group.scale.setScalar(0.01);
        sceneRef.current.add(group);
        partsRef.current[i] = group;
        // Animate scale up
        const start = Date.now();
        const animateIn = () => {
          const elapsed = (Date.now() - start) / 500;
          if (elapsed < 1 && partsRef.current[i]) {
            const s = Math.min(1, elapsed);
            const eased = 1 - Math.pow(1 - s, 3);
            partsRef.current[i].scale.setScalar(eased);
            requestAnimationFrame(animateIn);
          } else if (partsRef.current[i]) {
            partsRef.current[i].scale.setScalar(1);
          }
        };
        animateIn();
      }
    }
  }, [currentStep]);

  const handlePrev = () => { setCurrentStep(s => Math.max(0, s - 1)); };
  const handleNext = () => { setCurrentStep(s => Math.min(BUILD_STEPS.length - 1, s + 1)); };
  const handleReset = () => { setCurrentStep(0); setAutoPlay(false); };

  const progress = ((currentStep + 1) / BUILD_STEPS.length) * 100;
  const step = BUILD_STEPS[currentStep];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>Interactive 3D Assembly Manual</h3>
          <p className="text-slate-500 text-xs">Step through each component to see how the 18 healing modules fit together</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAutoPlay(!autoPlay)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${autoPlay ? "bg-amber-400 text-slate-950" : "bg-slate-800 border border-slate-700 text-slate-400"}`}>
            {autoPlay ? <Pause size={13} /> : <Play size={13} />} {autoPlay ? "Playing" : "Auto-Play"}
          </button>
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold hover:text-white transition-colors">
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* 3D viewport + step sidebar */}
      <div className="flex flex-col md:flex-row">
        <div ref={containerRef} className="relative w-full md:flex-1 h-[400px] bg-gradient-to-b from-slate-950 to-black" />

        {/* Step list */}
        <div className="md:w-64 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 max-h-[400px] overflow-y-auto">
          <div className="sticky top-0 bg-slate-950 px-3 py-2 border-b border-slate-800 z-10">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Assembly Steps ({currentStep + 1}/{BUILD_STEPS.length})</p>
          </div>
          <div className="py-1">
            {BUILD_STEPS.map((s, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <button key={s.id + i} onClick={() => setCurrentStep(i)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors ${active ? "bg-slate-800" : "hover:bg-slate-900"}`}>
                  <div className="flex-shrink-0">
                    {done ? <CheckCircle2 size={14} className="text-green-400" /> : (
                      <div className={`w-3.5 h-3.5 rounded-full border-2 ${active ? "border-amber-400 bg-amber-400/20" : "border-slate-700"}`} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${active ? "text-amber-400" : done ? "text-slate-400" : "text-slate-500"}`}>{s.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950">
        {/* Progress bar */}
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: progress + "%", backgroundColor: step?.color || "#f59e0b" }} />
        </div>
        <div className="flex items-center justify-between gap-3">
          <button onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:text-white transition-colors">
            <ChevronLeft size={14} /> Prev
          </button>
          <div className="text-center flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate" style={{ color: step?.color }}>Step {currentStep + 1}: {step?.label}</p>
            <p className="text-slate-500 text-[10px]">{currentStep + 1} of {BUILD_STEPS.length} components assembled</p>
          </div>
          <button onClick={handleNext} disabled={currentStep === BUILD_STEPS.length - 1} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 text-slate-950 text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-300 transition-colors">
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}