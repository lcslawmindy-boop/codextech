import { useEffect, useRef } from "react";
import * as THREE from "three";

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

export default function Invention3DCardSmall({ invention }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 160;

    // Create canvas if it doesn't exist
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvasRef.current = canvas;
      container.appendChild(canvas);
    }

    // Set canvas size to match container
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    try {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1f2937);

      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 2.5;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "low-power" });
      renderer.setSize(width, height, false);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x0ea5e9, 0.8);
      pointLight.position.set(4, 4, 4);
      scene.add(pointLight);

      const geometryType = DEVICE_GEOMETRIES[invention.title] || "device";
      let mesh;

      switch (geometryType) {
        case "toroid":
          mesh = new THREE.Mesh(
            new THREE.TorusGeometry(0.8, 0.3, 16, 80),
            new THREE.MeshPhongMaterial({ color: 0x0ea5e9, emissive: 0x0a4f8f })
          );
          break;
        case "sphere-coil": {
          const group = new THREE.Group();
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 32, 32),
            new THREE.MeshPhongMaterial({ color: 0x10b981, emissive: 0x047857 })
          );
          const toroid = new THREE.Mesh(
            new THREE.TorusGeometry(0.95, 0.12, 16, 80),
            new THREE.MeshPhongMaterial({ color: 0x0ea5e9 })
          );
          toroid.rotation.x = Math.PI / 4;
          group.add(sphere);
          group.add(toroid);
          mesh = group;
          break;
        }
        case "oscillator": {
          const group = new THREE.Group();
          const cylinder = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 1.2, 32),
            new THREE.MeshPhongMaterial({ color: 0xa855f7 })
          );
          const coil = new THREE.Mesh(
            new THREE.TorusGeometry(0.5, 0.08, 16, 80),
            new THREE.MeshPhongMaterial({ color: 0x0ea5e9 })
          );
          coil.rotation.z = Math.PI / 3;
          group.add(cylinder);
          group.add(coil);
          mesh = group;
          break;
        }
        case "chamber":
          mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.95, 0.8),
            new THREE.MeshPhongMaterial({ color: 0xf59e0b })
          );
          break;
        case "rotor": {
          const group = new THREE.Group();
          const disk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32),
            new THREE.MeshPhongMaterial({ color: 0x8b5cf6 })
          );
          const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16),
            new THREE.MeshPhongMaterial({ color: 0x6b7280 })
          );
          group.add(disk);
          group.add(shaft);
          mesh = group;
          break;
        }
        case "antenna": {
          const group = new THREE.Group();
          for (let i = 0; i < 4; i++) {
            const rod = new THREE.Mesh(
              new THREE.CylinderGeometry(0.04, 0.04, 0.95, 8),
              new THREE.MeshPhongMaterial({ color: 0xfbbf24 })
            );
            rod.position.set(
              Math.cos(i * Math.PI / 2) * 0.4,
              0.2,
              Math.sin(i * Math.PI / 2) * 0.4
            );
            group.add(rod);
          }
          const base = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 16, 16),
            new THREE.MeshPhongMaterial({ color: 0x6b7280 })
          );
          group.add(base);
          mesh = group;
          break;
        }
        default:
          mesh = new THREE.Mesh(
            new THREE.IcosahedronGeometry(0.8, 4),
            new THREE.MeshPhongMaterial({ color: 0x0ea5e9 })
          );
      }

      scene.add(mesh);

      let animationFrameId;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (mesh.rotation) {
          mesh.rotation.x += 0.004;
          mesh.rotation.y += 0.006;
        }
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      };
    } catch (err) {
      console.error("3D render error:", err);
      return () => {};
    }
  }, [invention]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}