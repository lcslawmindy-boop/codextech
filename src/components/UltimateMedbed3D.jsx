import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box, Eye, RotateCw, Layers, Maximize2 } from "lucide-react";

// ── 3D Realistic Rendering of the Omega MedBed ──────────────────────────────
// Full Three.js scene: supine therapy chamber with 18 modalities visualized.
// Exploded view toggle, auto-rotate, and realistic materials/lighting.

const COLORS = {
  shell: 0x1a1a2e,
  canopy: 0x0d1b2a,
  orgone: 0x2d4a2d,
  orgoneMetal: 0x5a4a3a,
  faraday: 0x8B4513,
  coils: 0x06b6d4,
  bed: 0x1a1a1a,
  mattress: 0x2a2a3e,
  vortex: 0x14b8a6,
  nada: 0xeab308,
  resonator: 0x6366f1,
  diagnostic: 0xec4899,
  power: 0xf59e0b,
  safety: 0xef4444,
  pbm: 0xef4444,
  pemf: 0x3b82f6,
  vat: 0xa855f7,
  fir: 0xf97316,
  mct: 0xec4899,
  hit: 0x14b8a6,
  nia: 0x2dd4bf,
  chm: 0xa855f7,
  eeg: 0x8b5cf6,
  pri: 0x2dd4bf,
  rife: 0xf43f5e,
  gsc: 0x6366f1,
};

function mat(color, metalness = 0.7, roughness = 0.3, emissive, emissiveIntensity = 0) {
  const m = new THREE.MeshStandardMaterial({ color, metalness, roughness, transparent: true, opacity: 0.92 });
  if (emissive !== undefined) { m.emissive = new THREE.Color(emissive); m.emissiveIntensity = emissiveIntensity; }
  return m;
}

function buildMedBed(scene, exploded) {
  const group = new THREE.Group();
  const off = exploded ? 1 : 0;

  // ── Canopy (top) — PBM LEDs + Chromotherapy + NIA + H₂ + EEG dock ──
  const canopyGroup = new THREE.Group();
  canopyGroup.position.y = 3.5 * off;
  // Canopy shell
  const canopyShell = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 1.0), mat(COLORS.canopy, 0.6, 0.4));
  canopyGroup.add(canopyShell);
  // PBM LED arrays (overhead) — glowing red panels
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.02, 0.22),
        new THREE.MeshStandardMaterial({ color: COLORS.pbm, emissive: COLORS.pbm, emissiveIntensity: 0.6, transparent: true, opacity: 0.9 })
      );
      led.position.set(-0.8 + i * 0.4, -0.18, -0.4 + j * 0.4);
      canopyGroup.add(led);
    }
  }
  // Chromotherapy WLED strip (purple glow)
  const wled = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.04), new THREE.MeshStandardMaterial({ color: COLORS.chm, emissive: COLORS.chm, emissiveIntensity: 0.8 }));
  wled.position.set(0, -0.15, 0.45);
  canopyGroup.add(wled);
  // NIA corona emitter
  const nia = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.15, 16), new THREE.MeshStandardMaterial({ color: COLORS.nia, emissive: COLORS.nia, emissiveIntensity: 0.4 }));
  nia.position.set(0, -0.2, 0);
  canopyGroup.add(nia);
  // EEG headset dock (canopy crown)
  const eegDock = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 8, 16), new THREE.MeshStandardMaterial({ color: COLORS.eeg, emissive: COLORS.eeg, emissiveIntensity: 0.3, metalness: 0.5 }));
  eegDock.position.set(0.7, -0.2, 0.35);
  eegDock.rotation.x = Math.PI / 2;
  canopyGroup.add(eegDock);
  group.add(canopyGroup);

  // ── Safety Module (top layer) ──
  const safetyGroup = new THREE.Group();
  safetyGroup.position.y = 2.8 * off;
  const safetyCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32), mat(COLORS.safety, 0.6, 0.4, COLORS.safety, 0.08));
  safetyCyl.material.opacity = 0.85;
  safetyGroup.add(safetyCyl);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.6 }));
    led.position.set(Math.cos(a) * 0.8, 0.12, Math.sin(a) * 0.8);
    safetyGroup.add(led);
  }
  group.add(safetyGroup);

  // ── Emission Spectrum Diagnostic Ring ──
  const diagGroup = new THREE.Group();
  diagGroup.position.y = 2.2 * off;
  const diagRing = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 8, 32), mat(COLORS.diagnostic, 0.5, 0.3, COLORS.diagnostic, 0.15));
  diagGroup.add(diagRing);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const sensor = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
    sensor.position.set(Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0);
    diagGroup.add(sensor);
  }
  group.add(diagGroup);

  // ── Scalar EM Octagonal Coil Array ──
  const coilGroup = new THREE.Group();
  coilGroup.position.y = 1.5 * off;
  const coilBase = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 8), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 }));
  coilGroup.add(coilBase);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const sub = new THREE.Group();
    sub.position.set(Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95);
    sub.rotation.y = -a;
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.9, roughness: 0.1 }));
    sub.add(core);
    const winding = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.035, 8, 16), new THREE.MeshStandardMaterial({ color: COLORS.coils, metalness: 0.9, roughness: 0.2, emissive: COLORS.coils, emissiveIntensity: 0.15 }));
    sub.add(winding);
    coilGroup.add(sub);
  }
  group.add(coilGroup);

  // ── Prioré Modulator + Rife Plasma Tubes ──
  const priGroup = new THREE.Group();
  priGroup.position.y = 0.9 * off;
  const priMod = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25, 16), mat(0x1a1a2e, 0.7, 0.3));
  priGroup.add(priMod);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 16), new THREE.MeshStandardMaterial({ color: COLORS.pri, transparent: true, opacity: 0.7, emissive: COLORS.pri, emissiveIntensity: 0.4 }));
    tube.position.set(Math.cos(a) * 0.35, 0.08, Math.sin(a) * 0.35);
    priGroup.add(tube);
  }
  // Rife plasma tubes (pink glow)
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const plasma = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.3, 12), new THREE.MeshStandardMaterial({ color: COLORS.rife, transparent: true, opacity: 0.6, emissive: COLORS.rife, emissiveIntensity: 0.5 }));
    plasma.position.set(Math.cos(a) * 0.7, 0.05, Math.sin(a) * 0.7);
    priGroup.add(plasma);
  }
  group.add(priGroup);

  // ── Vedic Nada Acoustic Ring (7 chakra transducers) ──
  const nadaGroup = new THREE.Group();
  nadaGroup.position.y = 0.4 * off;
  const nadaRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.05, 8, 32), mat(COLORS.nada, 0.5, 0.3, COLORS.nada, 0.1));
  nadaGroup.add(nadaRing);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const td = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.5, roughness: 0.3, emissive: 0xfbbf24, emissiveIntensity: 0.2 }));
    td.position.set(Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9);
    nadaGroup.add(td);
  }
  group.add(nadaGroup);

  // ── Patient Bed (central) — mattress with VAT + PEMF + FIR ──
  const bedGroup = new THREE.Group();
  // Bed frame
  const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.8), mat(COLORS.bed, 0.3, 0.7));
  bedGroup.add(bedFrame);
  // Mattress (memory foam)
  const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.08, 0.75), new THREE.MeshStandardMaterial({ color: COLORS.mattress, roughness: 0.9 }));
  mattress.position.y = 0.1;
  bedGroup.add(mattress);
  // VAT transducers (8 embedded in mattress, purple glow)
  for (let i = 0; i < 8; i++) {
    const vat = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), new THREE.MeshStandardMaterial({ color: COLORS.vat, emissive: COLORS.vat, emissiveIntensity: 0.3, transparent: true, opacity: 0.7 }));
    vat.position.set(-0.8 + (i % 4) * 0.5, 0.15, i < 4 ? -0.2 : 0.2);
    bedGroup.add(vat);
  }
  // FIR panels (side walls, orange glow)
  const firLeft = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.6), new THREE.MeshStandardMaterial({ color: COLORS.fir, emissive: COLORS.fir, emissiveIntensity: 0.25, transparent: true, opacity: 0.6 }));
  firLeft.position.set(-0.45, 0.15, 0);
  firLeft.rotation.y = Math.PI / 2;
  bedGroup.add(firLeft);
  const firRight = firLeft.clone();
  firRight.position.set(0.45, 0.15, 0);
  bedGroup.add(firRight);
  group.add(bedGroup);

  // ── Under-mattress PEMF Matrix (2×2 Helmholtz) ──
  const pemfGroup = new THREE.Group();
  pemfGroup.position.y = -0.3 * off;
  for (let i = 0; i < 4; i++) {
    const x = (i % 2 === 0 ? -0.4 : 0.4);
    const z = (i < 2 ? -0.3 : 0.3);
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.04, 8, 24), new THREE.MeshStandardMaterial({ color: COLORS.pemf, metalness: 0.8, roughness: 0.2, emissive: COLORS.pemf, emissiveIntensity: 0.2 }));
    coil.position.set(x, 0, z);
    coil.rotation.x = Math.PI / 2;
    pemfGroup.add(coil);
  }
  group.add(pemfGroup);

  // ── Global Scaling Resonators (4 cardinal points) ──
  const gscGroup = new THREE.Group();
  gscGroup.position.y = -0.8 * off;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const sph = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), mat(COLORS.gsc, 0.6, 0.3, COLORS.gsc, 0.25));
    sph.position.set(Math.cos(a) * 0.85, 0, Math.sin(a) * 0.85);
    gscGroup.add(sph);
    // Mu-metal isolation shell
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1, transparent: true, opacity: 0.3, wireframe: true }));
    shell.position.copy(sph.position);
    gscGroup.add(shell);
  }
  group.add(gscGroup);

  // ── Schauberger Vortex Water System ──
  const vorGroup = new THREE.Group();
  vorGroup.position.y = -1.5 * off;
  const vorChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 0.5, 32), new THREE.MeshStandardMaterial({ color: COLORS.vortex, transparent: true, opacity: 0.35, metalness: 0.3, roughness: 0.1 }));
  vorGroup.add(vorChamber);
  const impeller = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.25, 16), new THREE.MeshStandardMaterial({ color: 0x0d9488, metalness: 0.9, roughness: 0.1 }));
  vorGroup.add(impeller);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.35, 16), new THREE.MeshStandardMaterial({ color: COLORS.vortex, transparent: true, opacity: 0.4, emissive: COLORS.vortex, emissiveIntensity: 0.25 }));
  water.position.y = 0.08;
  vorGroup.add(water);
  group.add(vorGroup);

  // ── HIT + OZO Chemical Systems Bay ──
  const chemGroup = new THREE.Group();
  chemGroup.position.y = -2.2 * off;
  const hitBox = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.3), mat(COLORS.hit, 0.5, 0.4, COLORS.hit, 0.1));
  hitBox.position.x = -0.3;
  chemGroup.add(hitBox);
  const ozoBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.25), mat(0x0ea5e9, 0.5, 0.4, 0x0ea5e9, 0.1));
  ozoBox.position.x = 0.3;
  chemGroup.add(ozoBox);
  group.add(chemGroup);

  // ── Power + Control Electronics Bay ──
  const pwrGroup = new THREE.Group();
  pwrGroup.position.y = -2.9 * off;
  const pwrBay = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 0.9), mat(COLORS.power, 0.6, 0.4));
  pwrGroup.add(pwrBay);
  // HMI screen
  const hmi = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.02), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x06b6d4, emissiveIntensity: 0.4 }));
  hmi.position.set(0, 0.22, 0.46);
  pwrGroup.add(hmi);
  // Cooling vents
  [-0.5, -0.15, 0.15, 0.5].forEach(x => {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.02), new THREE.MeshStandardMaterial({ color: 0x000000 }));
    vent.position.set(x, 0, 0.46);
    pwrGroup.add(vent);
  });
  group.add(pwrGroup);

  // ── Faraday Shield (wireframe) ──
  const faraGroup = new THREE.Group();
  faraGroup.position.y = -3.6 * off;
  const faraShield = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.12, 32), new THREE.MeshStandardMaterial({ color: COLORS.faraday, metalness: 0.5, roughness: 0.6, wireframe: true }));
  faraGroup.add(faraShield);
  group.add(faraGroup);

  // ── Orgone Accumulator Envelope (20 layers) ──
  const orgGroup = new THREE.Group();
  orgGroup.position.y = -4.3 * off;
  for (let i = 0; i < 8; i++) { // visual representation of 20 layers (8 shown)
    const layer = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4 + i * 0.04, 1.4 + i * 0.04, 0.035, 32),
      new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? COLORS.orgone : COLORS.orgoneMetal,
        metalness: i % 2 === 0 ? 0.1 : 0.7,
        roughness: i % 2 === 0 ? 0.9 : 0.3,
        transparent: true,
        opacity: 0.7,
      })
    );
    layer.position.y = -i * 0.05;
    orgGroup.add(layer);
  }
  group.add(orgGroup);

  // ── Outer Shell Base ──
  const baseGroup = new THREE.Group();
  baseGroup.position.y = -5.2 * off;
  const baseShell = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.25, 32), mat(COLORS.shell, 0.8, 0.2));
  baseGroup.add(baseShell);
  group.add(baseGroup);

  scene.add(group);
  return group;
}

export default function UltimateMedbed3D() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const medbedRef = useRef(null);
  const [exploded, setExploded] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const explodedRef = useRef(true);
  const rotateRef = useRef(true);

  useEffect(() => { explodedRef.current = exploded; }, [exploded]);
  useEffect(() => { rotateRef.current = autoRotate; }, [autoRotate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    sceneRef.current = scene;

    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(5, 2, 7);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting — dramatic studio setup
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(5, 8, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x06b6d4, 0.35);
    fill.position.set(-5, -3, -5);
    scene.add(fill);
    const rim = new THREE.PointLight(0xec4899, 0.6, 100);
    rim.position.set(0, 0, 4);
    scene.add(rim);
    const gold = new THREE.PointLight(0xfbbf24, 0.4, 50);
    gold.position.set(3, 2, -3);
    scene.add(gold);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x222244, 0x111122);
    grid.position.y = -6;
    scene.add(grid);

    medbedRef.current = buildMedBed(scene, true);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (medbedRef.current && rotateRef.current) medbedRef.current.rotation.y += 0.003;
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

  useEffect(() => {
    if (!sceneRef.current) return;
    if (medbedRef.current) sceneRef.current.remove(medbedRef.current);
    medbedRef.current = buildMedBed(sceneRef.current, explodedRef.current);
  }, [exploded]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-950 via-gray-950 to-black border border-gray-800">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, sans-serif" }}>3D Omega MedBed — ZA-MB-Ω</h3>
          <p className="text-gray-500 text-xs">18 modalities · realistic engineering render</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExploded(!exploded)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${exploded ? "bg-cyan-900/50 border border-cyan-700 text-cyan-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            <Layers size={13} /> {exploded ? "Exploded" : "Assembled"}
          </button>
          <button onClick={() => setAutoRotate(!autoRotate)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${autoRotate ? "bg-indigo-900/50 border border-indigo-700 text-indigo-300" : "bg-gray-800 border border-gray-700 text-gray-400"}`}>
            <RotateCw size={13} /> {autoRotate ? "Rotating" : "Static"}
          </button>
        </div>
      </div>

      <div ref={containerRef} className="absolute inset-0 pt-16" />

      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/90 backdrop-blur border-t border-gray-800 px-5 py-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { label: "Canopy (PBM/CHM/NIA/EEG)", color: "#a855f7" },
            { label: "Safety Module", color: "#ef4444" },
            { label: "Spectrum Diagnostic", color: "#ec4899" },
            { label: "Scalar Coil Array", color: "#06b6d4" },
            { label: "Prioré + Rife", color: "#2dd4bf" },
            { label: "Vedic Nada", color: "#eab308" },
            { label: "Bed (VAT/FIR)", color: "#a855f7" },
            { label: "PEMF Matrix", color: "#3b82f6" },
            { label: "G-Scaling Resonators", color: "#6366f1" },
            { label: "Vortex Water", color: "#14b8a6" },
            { label: "H₂ + O₃ Bay", color: "#14b8a6" },
            { label: "Power/Control", color: "#f59e0b" },
            { label: "Faraday Shield", color: "#8B4513" },
            { label: "Orgone Envelope", color: "#65a30d" },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-gray-400 text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}