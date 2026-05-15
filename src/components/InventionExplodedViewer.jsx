import { useEffect, useRef, useState } from "react";
import { X, Layers, Package, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import * as THREE from "three";

// Generate deterministic parts from an invention title
function getPartsForInvention(title = "", description = "") {
  const text = `${title} ${description}`.toLowerCase();

  const partSets = {
    meg: [
      { name: "Nanocrystalline Toroid Core", color: "#a855f7", role: "Magnetic gateway to vacuum B(3) field", layer: 0 },
      { name: "Bifilar Primary Coil (850T)", color: "#06b6d4", role: "Primary electromagnetic winding", layer: 1 },
      { name: "Secondary Output Coil (1200T)", color: "#22c55e", role: "Energy extraction winding", layer: 2 },
      { name: "MOSFET H-Bridge Driver", color: "#f97316", role: "Asymmetric switching controller", layer: 3 },
      { name: "Permanent Magnet Array", color: "#ec4899", role: "Flux bias source", layer: 4 },
      { name: "Power Analyzer & Measurement Board", color: "#fbbf24", role: "COP measurement interface", layer: 5 },
    ],
    priore: [
      { name: "AD9910 DDS Signal Generator", color: "#06b6d4", role: "Multi-channel frequency synthesis", layer: 0 },
      { name: "Artix-7 FPGA Modulation Board", color: "#a855f7", role: "S'/S''/S''' modulation chain controller", layer: 1 },
      { name: "Helmholtz Coil Pair (Primary)", color: "#22c55e", role: "Primary EM field applicator", layer: 2 },
      { name: "50W RF Power Amplifier", color: "#f97316", role: "Signal power stage", layer: 3 },
      { name: "Faraday Shielded Chamber", color: "#64748b", role: "Environmental isolation enclosure", layer: 4 },
      { name: "Therapy Protocol Software", color: "#fbbf24", role: "Treatment session controller", layer: 5 },
    ],
    elf: [
      { name: "Dual RTL-SDR Receiver Modules", color: "#06b6d4", role: "Multi-channel RF spectrum capture", layer: 0 },
      { name: "GPS-Disciplined OCXO", color: "#a855f7", role: "High-stability frequency reference", layer: 1 },
      { name: "Phase Coherence DSP Board", color: "#22c55e", role: "ELF cross-correlation firmware", layer: 2 },
      { name: "Wideband HF Antenna Array", color: "#f97316", role: "5–30 MHz signal reception", layer: 3 },
      { name: "CCPCI Flask Dashboard", color: "#fbbf24", role: "Real-time monitoring interface", layer: 4 },
    ],
    kaznacheyev: [
      { name: "UV-Grade Fused Silica Windows", color: "#06b6d4", role: "UV-transparent biophoton optical path", layer: 0 },
      { name: "Hamamatsu PMT R7400", color: "#a855f7", role: "Single-photon UV detection", layer: 1 },
      { name: "Dual Cell Culture Chamber", color: "#22c55e", role: "Donor/recipient tissue compartments", layer: 2 },
      { name: "DDS-Programmable UV LED Driver", color: "#f97316", role: "Frequency-tuned UV illumination", layer: 3 },
      { name: "Phase-Contrast Microscope Port", color: "#ec4899", role: "Real-time cell morphology monitor", layer: 4 },
      { name: "Peltier Temperature Controller", color: "#fbbf24", role: "37°C cell culture environment", layer: 5 },
    ],
    therapy: [
      { name: "DDS Frequency Synthesizer", color: "#22c55e", role: "Biological trigger window generator", layer: 0 },
      { name: "Helmholtz Coil Wristband", color: "#06b6d4", role: "EM field applicator", layer: 1 },
      { name: "Trigger Window Protocol Library", color: "#a855f7", role: "47 verified frequency presets", layer: 2 },
      { name: "Programmable Power Amplifier", color: "#f97316", role: "Field strength controller", layer: 3 },
      { name: "Bluetooth Control Module", color: "#fbbf24", role: "Mobile app interface", layer: 4 },
    ],
    default: [
      { name: "Primary Coil Assembly", color: "#06b6d4", role: "Main electromagnetic transducer", layer: 0 },
      { name: "Control Electronics Board", color: "#a855f7", role: "Signal processing & timing", layer: 1 },
      { name: "Power Stage Module", color: "#f97316", role: "Energy conditioning circuit", layer: 2 },
      { name: "Sensor Array", color: "#22c55e", role: "Measurement & feedback system", layer: 3 },
      { name: "Enclosure & Shielding", color: "#64748b", role: "Faraday isolation housing", layer: 4 },
      { name: "Interface & Output Board", color: "#fbbf24", role: "User control & data output", layer: 5 },
    ],
  };

  if (text.includes("meg") || text.includes("motionless") || text.includes("electromagnetic generator")) return partSets.meg;
  if (text.includes("prioré") || text.includes("priore") || text.includes("multichannel em")) return partSets.priore;
  if (text.includes("elf") || text.includes("psychotronic detector") || text.includes("carrier lock")) return partSets.elf;
  if (text.includes("kaznacheyev") || text.includes("krcic") || text.includes("biophoton")) return partSets.kaznacheyev;
  if (text.includes("therapy") || text.includes("trigger window")) return partSets.therapy;
  return partSets.default;
}

// Shape factories for each part layer
function buildPartMesh(layer, color, exploded, totalLayers) {
  const shapes = ["box", "cylinder", "torus", "sphere", "ring", "capsule"];
  const shape = shapes[layer % shapes.length];
  const c = new THREE.Color(color);
  const mat = new THREE.MeshStandardMaterial({
    color: c,
    emissive: c,
    emissiveIntensity: 0.35,
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
    opacity: 0.92,
  });

  let geo;
  const s = 0.55 - layer * 0.04;
  if (shape === "box") geo = new THREE.BoxGeometry(s * 1.6, s * 0.35, s * 1.6);
  else if (shape === "cylinder") geo = new THREE.CylinderGeometry(s * 0.7, s * 0.7, s * 0.4, 24);
  else if (shape === "torus") geo = new THREE.TorusGeometry(s * 0.65, s * 0.18, 16, 32);
  else if (shape === "sphere") geo = new THREE.SphereGeometry(s * 0.55, 20, 20);
  else if (shape === "ring") geo = new THREE.TorusGeometry(s * 0.8, s * 0.08, 12, 40);
  else geo = new THREE.CapsuleGeometry(s * 0.3, s * 0.5, 8, 16);

  const mesh = new THREE.Mesh(geo, mat);
  const yBase = (layer - (totalLayers - 1) / 2) * 0.45;
  const yExploded = (layer - (totalLayers - 1) / 2) * 1.5;
  mesh.position.y = exploded ? yExploded : yBase;
  mesh.userData.targetY = exploded ? yExploded : yBase;
  mesh.userData.baseY = yBase;
  mesh.userData.layer = layer;
  return mesh;
}

export default function InventionExplodedViewer({ invention, onClose }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshesRef = useRef([]);
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const rotRef = useRef({ x: 0.3, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const zoomRef = useRef(5.5);

  const [exploded, setExploded] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);

  const parts = getPartsForInvention(invention.title, invention.description);
  const color = invention.color || "#06b6d4";

  // Init Three.js
  useEffect(() => {
    if (!mountRef.current) return;
    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#03070f");
    scene.fog = new THREE.Fog("#03070f", 8, 20);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, zoomRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.position.set(4, 6, 5);
    scene.add(dl);
    const pl = new THREE.PointLight(new THREE.Color(color), 2, 8);
    pl.position.set(0, 0, 3);
    scene.add(pl);

    // Grid floor
    const grid = new THREE.GridHelper(6, 12, new THREE.Color(color), new THREE.Color(color));
    grid.position.y = -2;
    grid.material.opacity = 0.12;
    grid.material.transparent = true;
    scene.add(grid);

    // Build part meshes
    const meshes = parts.map((part, i) => {
      const mesh = buildPartMesh(i, part.color, false, parts.length);
      scene.add(mesh);
      return mesh;
    });
    meshesRef.current = meshes;

    // Animate
    const animate = () => {
      if (!dragRef.current) {
        velRef.current.y += (0.005 - velRef.current.y) * 0.05;
        velRef.current.x *= 0.95;
      }
      rotRef.current.x += velRef.current.x;
      rotRef.current.y += velRef.current.y;
      velRef.current.x *= dragRef.current ? 0.85 : 0.96;
      velRef.current.y *= dragRef.current ? 0.85 : 0.998;

      const group = new THREE.Group();
      meshes.forEach(m => {
        // Lerp Y position for explosion animation
        m.position.y += (m.userData.targetY - m.position.y) * 0.12;
        m.rotation.y += 0.008;
        group.add(m.clone());
      });

      scene.rotation.x = rotRef.current.x;
      scene.rotation.y = rotRef.current.y;
      camera.position.z = zoomRef.current;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle explode toggle
  useEffect(() => {
    meshesRef.current.forEach((mesh, i) => {
      const yExploded = (i - (parts.length - 1) / 2) * 1.5;
      const yBase = (i - (parts.length - 1) / 2) * 0.45;
      mesh.userData.targetY = exploded ? yExploded : yBase;
    });
  }, [exploded]);

  // Drag rotation
  const onPointerDown = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { x, y };
    velRef.current = { x: 0, y: 0 };
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    velRef.current.y = (x - dragRef.current.x) * 0.012;
    velRef.current.x = (y - dragRef.current.y) * 0.012;
    dragRef.current = { x, y };
  };
  const onPointerUp = () => { dragRef.current = null; };

  const zoom = (dir) => {
    zoomRef.current = Math.max(3, Math.min(9, zoomRef.current + dir));
    if (cameraRef.current) cameraRef.current.position.z = zoomRef.current;
  };

  const resetView = () => {
    rotRef.current = { x: 0.3, y: 0 };
    velRef.current = { x: 0, y: 0.005 };
    zoomRef.current = 5.5;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="relative w-full max-w-4xl mx-4 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: "linear-gradient(160deg,#06101f,#030c1a)",
          border: `1px solid ${color}40`,
          boxShadow: `0 0 60px ${color}20`,
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: `${color}30` }}
        >
          <div className="flex-1 min-w-0 mr-4">
            <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color }}>
              3D Exploded View
            </p>
            <h2 className="text-white font-black text-base leading-tight truncate">{invention.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Explode toggle */}
            <button
              onClick={() => setExploded(e => !e)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all"
              style={
                exploded
                  ? { background: `${color}30`, border: `1px solid ${color}`, color }
                  : { background: "#0d1626", border: "1px solid #334155", color: "#94a3b8" }
              }
            >
              <Layers size={13} />
              {exploded ? "Assembled" : "Explode"}
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body: canvas + parts list */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* 3D Canvas */}
          <div className="flex-1 relative min-w-0" style={{ minHeight: 340 }}>
            <div
              ref={mountRef}
              className="w-full h-full"
              style={{ cursor: "grab", minHeight: 340, touchAction: "none" }}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            />

            {/* Canvas controls overlay */}
            <div className="absolute bottom-3 left-3 flex flex-col gap-1.5">
              <button onClick={() => zoom(-0.8)} className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs">
                <ZoomIn size={13} />
              </button>
              <button onClick={() => zoom(0.8)} className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs">
                <ZoomOut size={13} />
              </button>
              <button onClick={resetView} className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs">
                <RotateCcw size={12} />
              </button>
            </div>

            <p className="absolute bottom-3 right-3 text-slate-600 text-[10px] font-mono">drag to rotate</p>

            {/* Exploded label overlay */}
            {exploded && (
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
                style={{ background: `${color}22`, border: `1px solid ${color}60`, color }}
              >
                <Layers size={11} /> Exploded View Active
              </div>
            )}
          </div>

          {/* Parts List Panel */}
          <div
            className="w-64 flex-shrink-0 overflow-y-auto border-l"
            style={{ borderColor: `${color}20`, background: "#020c18" }}
          >
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={13} style={{ color }} />
                <p className="text-xs font-black uppercase tracking-widest" style={{ color }}>
                  Build Components
                </p>
              </div>

              <p className="text-slate-600 text-[10px] mb-4 leading-relaxed">
                {exploded
                  ? "Assembly layers separated. Click a part to highlight."
                  : "Toggle 'Explode' to visualize assembly layers."}
              </p>

              <div className="space-y-2">
                {parts.map((part, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPart(selectedPart === i ? null : i)}
                    className="w-full text-left rounded-xl p-3 transition-all border"
                    style={
                      selectedPart === i
                        ? { background: `${part.color}18`, borderColor: part.color }
                        : { background: "#0a1520", borderColor: "#1e2d40" }
                    }
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: part.color, boxShadow: `0 0 6px ${part.color}` }}
                      />
                      <span className="text-white text-[11px] font-bold leading-snug">{part.name}</span>
                    </div>
                    <p className="text-slate-500 text-[10px] leading-snug pl-4">{part.role}</p>
                  </button>
                ))}
              </div>

              {/* Source note */}
              <div className="mt-4 pt-3 border-t" style={{ borderColor: `${color}20` }}>
                <p className="text-slate-700 text-[9px] leading-relaxed">
                  <span className="font-bold text-slate-600">Source:</span> {invention.source || "US Patent / Peer-Reviewed Documentation"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: quick stats */}
        <div
          className="px-5 py-3 border-t flex items-center justify-between flex-wrap gap-2"
          style={{ borderColor: `${color}20` }}
        >
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span><span className="font-bold text-slate-300">{parts.length}</span> assembly components</span>
            <span><span className="font-bold text-slate-300">{invention.buildTime || "2–4 wks"}</span> build time</span>
            <span><span className="font-bold" style={{ color }}>{invention.price}</span> full plans</span>
          </div>
          <p className="text-[10px] text-slate-700 italic">For educational & research visualization only</p>
        </div>
      </div>
    </div>
  );
}