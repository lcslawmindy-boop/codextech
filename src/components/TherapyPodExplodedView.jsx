import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Exploded CAD View of the Therapy Pod ──────────────────────────────────
// Renders a realistic exploded-view CAD model using raw Three.js showing all
// major subsystems separated along the vertical axis.

const PART_COLORS = {
  shell: 0x1a1a2e,
  orgone: 0x2d4a2d,
  faraday: 0x8B4513,
  coilArray: 0x06b6d4,
  bed: 0x1a1a1a,
  vortex: 0x14b8a6,
  manifold: 0xeab308,
  resonator: 0x6366f1,
  diagnostic: 0xec4899,
  power: 0xf59e0b,
  safety: 0xef4444,
};

function createPart(color, emissive, emissiveIntensity = 0) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
    opacity: 0.9,
  });
  if (emissive !== undefined) {
    mat.emissive = new THREE.Color(emissive);
    mat.emissiveIntensity = emissiveIntensity;
  }
  return mat;
}

function buildExplodedPod(scene, exploded) {
  const group = new THREE.Group();
  const offset = exploded ? 1 : 0;

  // ── Top: Safety & Interlock Module ──
  {
    const safetyGroup = new THREE.Group();
    safetyGroup.position.y = 6 * offset;
    const cyl = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.3, 0.25, 32),
      createPart(PART_COLORS.safety, PART_COLORS.safety, 0.1)
    );
    cyl.material.transparent = true;
    cyl.material.opacity = 0.85;
    safetyGroup.add(cyl);
    // Status LEDs
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const led = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.5 })
      );
      led.position.set(Math.cos(angle) * 0.9, 0.15, Math.sin(angle) * 0.9);
      safetyGroup.add(led);
    }
    group.add(safetyGroup);
  }

  // ── Control Electronics & HMI ──
  {
    const ctrlGroup = new THREE.Group();
    ctrlGroup.position.y = 4.8 * offset;
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.4, 1.6),
      createPart(PART_COLORS.power)
    );
    ctrlGroup.add(box);
    // HMI Screen
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.3, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0a0a0a, emissive: 0x06b6d4, emissiveIntensity: 0.3 })
    );
    screen.position.set(0, 0.25, 0.81);
    ctrlGroup.add(screen);
    group.add(ctrlGroup);
  }

  // ── Global Scaling Resonator Array ──
  {
    const resGroup = new THREE.Group();
    resGroup.position.y = 3.8 * offset;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const sph = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 16, 16),
        createPart(PART_COLORS.resonator, PART_COLORS.resonator, 0.2)
      );
      sph.position.set(Math.cos(angle) * 1.0, 0, Math.sin(angle) * 1.0);
      resGroup.add(sph);
    }
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.15, 16),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 })
    );
    resGroup.add(hub);
    group.add(resGroup);
  }

  // ── Emission Spectrum Diagnostic Ring ──
  {
    const diagGroup = new THREE.Group();
    diagGroup.position.y = 3.0 * offset;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.2, 0.05, 8, 32),
      createPart(PART_COLORS.diagnostic, PART_COLORS.diagnostic, 0.15)
    );
    diagGroup.add(ring);
    // Porthole sensors
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const sensor = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
      );
      sensor.position.set(Math.cos(angle) * 1.2, 0, Math.sin(angle) * 1.2);
      diagGroup.add(sensor);
    }
    group.add(diagGroup);
  }

  // ── Scalar EM Coil Array (Octagonal) ──
  {
    const coilGroup = new THREE.Group();
    coilGroup.position.y = 2.0 * offset;
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.3, 1.3, 0.1, 8),
      new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 })
    );
    coilGroup.add(base);
    // 8 Coil pairs
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const subGroup = new THREE.Group();
      subGroup.position.set(Math.cos(angle) * 1.15, 0, Math.sin(angle) * 1.15);
      subGroup.rotation.y = -angle;
      // Ferrite core
      const core = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.9, roughness: 0.1 })
      );
      subGroup.add(core);
      // Copper winding
      const winding = new THREE.Mesh(
        new THREE.TorusGeometry(0.12, 0.04, 8, 16),
        new THREE.MeshStandardMaterial({ color: PART_COLORS.coilArray, metalness: 0.9, roughness: 0.2, emissive: PART_COLORS.coilArray, emissiveIntensity: 0.1 })
      );
      subGroup.add(winding);
      coilGroup.add(subGroup);
    }
    group.add(coilGroup);
  }

  // ── Prioré Multichannel Modulator ──
  {
    const priGroup = new THREE.Group();
    priGroup.position.y = 1.2 * offset;
    const mod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.6, 0.6, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, metalness: 0.7, roughness: 0.3 })
    );
    priGroup.add(mod);
    // Electron tubes
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const tube = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16),
        new THREE.MeshStandardMaterial({ color: 0x2dd4bf, transparent: true, opacity: 0.7, emissive: 0x2dd4bf, emissiveIntensity: 0.3 })
      );
      tube.position.set(Math.cos(angle) * 0.4, 0.1, Math.sin(angle) * 0.4);
      priGroup.add(tube);
    }
    group.add(priGroup);
  }

  // ── Vedic Nada Acoustic Manifold ──
  {
    const nadaGroup = new THREE.Group();
    nadaGroup.position.y = 0.5 * offset;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.0, 0.06, 8, 32),
      createPart(PART_COLORS.manifold, PART_COLORS.manifold, 0.1)
    );
    nadaGroup.add(ring);
    // 7 chakra transducers
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const td = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.5, roughness: 0.3 })
      );
      td.position.set(Math.cos(angle) * 1.0, 0, Math.sin(angle) * 1.0);
      nadaGroup.add(td);
    }
    group.add(nadaGroup);
  }

  // ── Patient Treatment Bed (Central) ──
  {
    const bedGroup = new THREE.Group();
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.15, 0.7),
      new THREE.MeshStandardMaterial({ color: PART_COLORS.bed, metalness: 0.3, roughness: 0.7 })
    );
    bedGroup.add(bed);
    const surface = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.02, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 })
    );
    surface.position.y = 0.1;
    bedGroup.add(surface);
    group.add(bedGroup);
  }

  // ── Schauberger Vortex Water System ──
  {
    const vorGroup = new THREE.Group();
    vorGroup.position.y = -1.2 * offset;
    const chamber = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.5, 0.6, 32),
      new THREE.MeshStandardMaterial({ color: PART_COLORS.vortex, transparent: true, opacity: 0.4, metalness: 0.3, roughness: 0.1 })
    );
    vorGroup.add(chamber);
    const impeller = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x0d9488, metalness: 0.9, roughness: 0.1 })
    );
    vorGroup.add(impeller);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: PART_COLORS.vortex, transparent: true, opacity: 0.3, emissive: PART_COLORS.vortex, emissiveIntensity: 0.2 })
    );
    water.position.y = 0.1;
    vorGroup.add(water);
    group.add(vorGroup);
  }

  // ── Power Distribution Bay ──
  {
    const pwrGroup = new THREE.Group();
    pwrGroup.position.y = -2.2 * offset;
    const bay = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 0.5, 1.2),
      createPart(PART_COLORS.power)
    );
    pwrGroup.add(bay);
    // Cooling vents
    [-0.6, -0.2, 0.2, 0.6].forEach((x) => {
      const vent = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.3, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
      );
      vent.position.set(x, 0, 0.61);
      pwrGroup.add(vent);
    });
    group.add(pwrGroup);
  }

  // ── Faraday Shield (wireframe) ──
  {
    const faraGroup = new THREE.Group();
    faraGroup.position.y = -3.2 * offset;
    const shield = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.15, 32),
      new THREE.MeshStandardMaterial({ color: PART_COLORS.faraday, metalness: 0.5, roughness: 0.6, wireframe: true })
    );
    faraGroup.add(shield);
    group.add(faraGroup);
  }

  // ── Orgone Accumulator Envelope ──
  {
    const orgGroup = new THREE.Group();
    orgGroup.position.y = -4.2 * offset;
    for (let i = 0; i < 4; i++) {
      const layer = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6 + i * 0.05, 1.6 + i * 0.05, 0.04, 32),
        new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? PART_COLORS.orgone : 0x5a4a3a,
          metalness: i % 2 === 0 ? 0.1 : 0.7,
          roughness: i % 2 === 0 ? 0.9 : 0.3,
        })
      );
      layer.position.y = -i * 0.06;
      orgGroup.add(layer);
    }
    group.add(orgGroup);
  }

  // ── Outer Shell Base ──
  {
    const baseGroup = new THREE.Group();
    baseGroup.position.y = -5.2 * offset;
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.7, 0.3, 32),
      new THREE.MeshStandardMaterial({ color: PART_COLORS.shell, metalness: 0.8, roughness: 0.2 })
    );
    baseGroup.add(base);
    group.add(baseGroup);
  }

  scene.add(group);
  return group;
}

export default function TherapyPodExplodedView() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const podGroupRef = useRef(null);
  const [exploded, setExploded] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const explodedRef = useRef(true);
  const rotateRef = useRef(true);

  // Keep refs in sync with state for animation loop
  useEffect(() => { explodedRef.current = exploded; }, [exploded]);
  useEffect(() => { rotateRef.current = autoRotate; }, [autoRotate]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(4, 2, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 0.3);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);
    const pointLight = new THREE.PointLight(0xec4899, 0.5, 100);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x222222, 0x111111);
    grid.position.y = -6;
    scene.add(grid);

    // Build pod
    podGroupRef.current = buildExplodedPod(scene, true);

    // Animation
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (podGroupRef.current && rotateRef.current) {
        podGroupRef.current.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Rebuild on exploded toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    // Remove old pod
    if (podGroupRef.current) {
      sceneRef.current.remove(podGroupRef.current);
    }
    podGroupRef.current = buildExplodedPod(sceneRef.current, explodedRef.current);
  }, [exploded]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-950 to-black border border-gray-800">
      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-gray-950/80 backdrop-blur border-b border-gray-800">
        <div>
          <h3 className="text-white font-bold text-sm">3D Exploded CAD View — ZA-TP-001</h3>
          <p className="text-gray-500 text-xs">All subsystems shown in separated assembly view</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExploded(!exploded)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              exploded ? "bg-cyan-900/50 border border-cyan-700 text-cyan-300" : "bg-gray-800 border border-gray-700 text-gray-400"
            }`}
          >
            {exploded ? "Exploded" : "Assembled"}
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              autoRotate ? "bg-indigo-900/50 border border-indigo-700 text-indigo-300" : "bg-gray-800 border border-gray-700 text-gray-400"
            }`}
          >
            {autoRotate ? "Rotating" : "Static"}
          </button>
        </div>
      </div>

      {/* 3D Canvas container */}
      <div ref={containerRef} className="absolute inset-0 pt-16" />

      {/* Legend overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gray-950/90 backdrop-blur border-t border-gray-800 px-5 py-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {[
            { label: "Safety Module", color: "#ef4444" },
            { label: "Control/HMI", color: "#f59e0b" },
            { label: "G-Scaling Resonators", color: "#6366f1" },
            { label: "Spectrum Diagnostic", color: "#ec4899" },
            { label: "Scalar Coil Array", color: "#06b6d4" },
            { label: "Prioré Modulator", color: "#2dd4bf" },
            { label: "Nada Acoustic", color: "#eab308" },
            { label: "Treatment Bed", color: "#1a1a1a" },
            { label: "Vortex Water", color: "#14b8a6" },
            { label: "Power Bay", color: "#f59e0b" },
            { label: "Faraday Shield", color: "#8B4513" },
            { label: "Orgone Envelope", color: "#2d4a2d" },
          ].map((item) => (
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