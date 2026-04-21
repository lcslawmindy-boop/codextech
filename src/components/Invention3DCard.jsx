import { useEffect, useRef, useState } from "react";
import { Download, ChevronRight } from "lucide-react";
import * as THREE from "three";
import { inventionVisuals } from "@/lib/inventionVisuals";
import { deviceImages } from "@/lib/deviceImages";

const DEVICE_GEOMETRIES = {
  "Anenergy Pump Demonstration Circuit": "toroid",
  "Scalar Energy Bottle Interferometer": "sphere-coil",
  "Vacuum Potential Oscillator (VPO) Circuit Kit": "oscillator",
  "Biofield Frequency Exposure Chamber": "chamber",
  "Open-System Magnetic Generator (Prototype Plans)": "rotor",
  "Quantum Potential EMI Detector": "antenna",
  "EM Trigger Window Therapy Device": "device",
  "Morphogenetic Field Coherence Monitor": "monitor",
  "Whittaker Wave Phase Conjugate Mirror System": "mirror",
  "Prioré-Type Multichannel EM Therapy System": "multi-channel",
  "ELF Carrier Lock Detection System": "detector",
  "Phi-River Gradient Sensor": "sensor",
  "MEG Replication Kit": "generator",
  "Asymmetric Regauging Overunity Generator": "generator",
  "Telomere Regeneration Device (TRD-1)": "chamber",
  "Portable Porthole Disease Treatment System": "chamber",
  "Time-Reversal Zone Cold Fusion Reactor": "reactor",
  "Atmospheric Scalar EM Signature Recognition System": "antenna",
  "Woodpecker Grid Standing Wave Detector": "detector",
  "T-Polarized EM Wave Transducer": "transducer",
  "Psychoenergetics Cellular Control System": "control",
  "Bedini Environmental EM Signal Conditioner": "conditioner",
  "Waddington Valley EM Tracer System": "tracer",
  "Cloning Efficiency Enhancement System": "chamber",
  "Kaznacheyev Reversal Cell Imprinting Chamber": "chamber",
  "UV Biophoton Disease Reversal Spectrometer": "spectrometer",
  "MorphoYield TRZ-Agri Array": "array",
  "Aegis-SV Adaptive Scalar Counterphase Shield": "shield",
};

function create3DScene(canvasRef, geometryType) {
  if (!canvasRef.current) return () => {};

  const canvas = canvasRef.current;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (width === 0 || height === 0) return () => {};

  try {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x0ea5e9, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let mesh;

    // Create geometry based on type
    switch (geometryType) {
      case "toroid": {
        const tubeGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
        mesh = new THREE.Mesh(tubeGeometry, new THREE.MeshPhongMaterial({ color: 0x0ea5e9, emissive: 0x0a4f8f }));
        break;
      }
      case "sphere-coil": {
        const group = new THREE.Group();
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x047857 }));
        const toroid = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.15, 16, 100), new THREE.MeshPhongMaterial({ color: 0x0ea5e9, emissive: 0x0a4f8f }));
        toroid.rotation.x = Math.PI / 4;
        group.add(sphere);
        group.add(toroid);
        mesh = group;
        break;
      }
      case "oscillator": {
        const group = new THREE.Group();
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 32), new THREE.MeshPhongMaterial({ color: 0xa855f7, emissive: 0x7c3aed }));
        const coil = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.1, 16, 100), new THREE.MeshPhongMaterial({ color: 0x0ea5e9 }));
        coil.rotation.z = Math.PI / 3;
        group.add(cylinder);
        group.add(coil);
        mesh = group;
        break;
      }
      case "chamber": {
        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1.2, 1), new THREE.MeshPhongMaterial({ color: 0xf59e0b, emissive: 0xd97706, wireframe: true }));
        mesh = box;
        break;
      }
      case "rotor": {
        const disk = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 32), new THREE.MeshPhongMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9 }));
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16), new THREE.MeshPhongMaterial({ color: 0x6b7280 }));
        const group = new THREE.Group();
        group.add(disk);
        group.add(shaft);
        mesh = group;
        break;
      }
      case "antenna": {
        const group = new THREE.Group();
        for (let i = 0; i < 4; i++) {
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8), new THREE.MeshPhongMaterial({ color: 0xfbbf24 }));
          rod.position.set(Math.cos(i * Math.PI / 2) * 0.5, 0.3, Math.sin(i * Math.PI / 2) * 0.5);
          group.add(rod);
        }
        const base = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshPhongMaterial({ color: 0x6b7280 }));
        group.add(base);
        mesh = group;
        break;
      }
      default: {
        mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 4), new THREE.MeshPhongMaterial({ color: 0x0ea5e9, emissive: 0x0a4f8f }));
      }
    }

    scene.add(mesh);

    // Animation loop
    let animationId;
    let isRunning = true;

    const animate = () => {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);
      if (mesh.rotation) {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = canvas.clientWidth || width;
      const newHeight = canvas.clientHeight || height;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      isRunning = false;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  } catch (error) {
    console.warn("Three.js scene initialization failed:", error);
    return () => {};
  }
}

export default function Invention3DCard({ invention, tier }) {
  const canvasRef = useRef(null);
  const [showSpecs, setShowSpecs] = useState(false);
  const visual = inventionVisuals[invention.title];
  const geometryType = DEVICE_GEOMETRIES[invention.title] || "device";

  useEffect(() => {
    const cleanup = create3DScene(canvasRef, geometryType);
    return cleanup;
  }, [geometryType]);

  const deviceImage = deviceImages[invention.title];

  return (
    <div className="group rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-cyan-700/50 transition-all flex flex-col h-full">
      {/* 3D Image or Canvas */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-950 overflow-hidden">
        {deviceImage ? (
          <img src={deviceImage} alt={invention.title} className="w-full h-full object-cover" />
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-2xl">{invention.icon}</span>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm leading-snug">{invention.title}</h3>
            <p className="text-gray-500 text-xs mt-1">{invention.tagline}</p>
          </div>
        </div>

        {visual && (
          <button
            onClick={() => setShowSpecs(!showSpecs)}
            className="text-cyan-400 text-xs font-bold mt-2 hover:text-cyan-300 transition-colors"
          >
            {showSpecs ? "Hide specs" : "View specs"}
          </button>
        )}

        {showSpecs && visual && (
          <div className="mt-3 p-3 rounded-lg bg-gray-800/40 border border-gray-700/50 text-xs space-y-2">
            <div>
              <p className="text-cyan-400 font-bold text-xs">What It Is</p>
              <p className="text-gray-300 text-xs mt-1 leading-snug">{visual.whatItIs}</p>
            </div>
            {visual.realWorldSize && (
              <p className="text-gray-500 text-xs"><span className="text-gray-400 font-semibold">Size:</span> {visual.realWorldSize}</p>
            )}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-800">
          <button className="w-full px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2">
            <Download size={12} /> Download PDF & Guide
          </button>
        </div>
      </div>
    </div>
  );
}