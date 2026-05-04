import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, Volume2, Sun, Wind, Activity } from 'lucide-react';

export default function AutismBed3DVisualization() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const bedsRef = useRef([]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Add soft lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 15, 10);
    scene.add(directionalLight);

    // Purple/cyan accent lighting
    const accentLight1 = new THREE.PointLight(0x7c3aed, 0.5, 30);
    accentLight1.position.set(-8, 8, -8);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(0x06b6d4, 0.5, 30);
    accentLight2.position.set(8, 8, 8);
    scene.add(accentLight2);

    // Camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Build the Bed ──
    const bedGroup = new THREE.Group();

    // Bed frame (titanium-like)
    const frameGeometry = new THREE.BoxGeometry(2.5, 0.3, 1.5);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.7,
      roughness: 0.2,
    });
    const bedFrame = new THREE.Mesh(frameGeometry, frameMaterial);
    bedGroup.add(bedFrame);

    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(2.4, 0.15, 1.4);
    const mattressMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.3,
      roughness: 0.6,
    });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.y = 0.25;
    bedGroup.add(mattress);

    // Chromotherapy LED dome (top)
    const domeGeometry = new THREE.SphereGeometry(1.3, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00aaff,
      emissiveIntensity: 0.3,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    dome.position.y = 1.2;
    bedGroup.add(dome);

    // Faraday mesh canopy (wireframe sides)
    const canopyGeometry = new THREE.BoxGeometry(2.6, 1.4, 1.6);
    const canopyMaterial = new THREE.LineBasicMaterial({ color: 0x00ff99, linewidth: 2 });
    const canopyWireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(canopyGeometry),
      canopyMaterial
    );
    canopyWireframe.position.y = 0.7;
    bedGroup.add(canopyWireframe);

    // PEMF coils (electromagnetic field visualization)
    const coilGroup = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const coilGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 100);
      const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        emissive: 0x6d28d9,
        emissiveIntensity: 0.4,
      });
      const coil = new THREE.Mesh(coilGeometry, coilMaterial);
      coil.rotation.z = Math.PI / 2;
      coil.position.set(i === 0 ? -0.8 : 0.8, 0.3, 0);
      coilGroup.add(coil);
    }
    bedGroup.add(coilGroup);

    // Vibroacoustic transducers (underside speakers)
    for (let i = 0; i < 4; i++) {
      const speakerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
      const speakerMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const speaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
      const xPos = (i % 2 === 0 ? -1 : 1) * 0.7;
      const zPos = (i < 2 ? -0.5 : 0.5);
      speaker.position.set(xPos, -0.15, zPos);
      bedGroup.add(speaker);
    }

    // Aromatherapy diffuser ports (small vents on sides)
    for (let i = 0; i < 6; i++) {
      const ventGeometry = new THREE.BoxGeometry(0.1, 0.05, 0.3);
      const ventMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffaa,
        emissive: 0x00dd99,
        emissiveIntensity: 0.2,
      });
      const vent = new THREE.Mesh(ventGeometry, ventMaterial);
      const side = i < 3 ? -1.3 : 1.3;
      vent.position.set(side, 0.2 + (i % 3) * 0.3, -0.6 + (i % 3) * 0.6);
      bedGroup.add(vent);
    }

    // Control PCB (front panel)
    const pcbGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.1);
    const pcbMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a3a,
      metalness: 0.6,
      roughness: 0.3,
    });
    const pcb = new THREE.Mesh(pcbGeometry, pcbMaterial);
    pcb.position.set(0, 0.5, 0.8);
    bedGroup.add(pcb);

    // Small indicator LEDs on PCB
    for (let i = 0; i < 4; i++) {
      const ledGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const colors = [0xff0000, 0x00ff00, 0x0088ff, 0xffaa00];
      const ledMaterial = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.8,
      });
      const led = new THREE.Mesh(ledGeometry, ledMaterial);
      led.position.set(-0.2 + i * 0.15, 0.6, 0.85);
      bedGroup.add(led);
    }

    scene.add(bedGroup);
    bedsRef.current = [bedGroup];

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (isAutoRotate) {
        bedGroup.rotation.y += 0.002;
      }

      // Pulsing glow on dome
      const pulse = Math.sin(Date.now() * 0.003) * 0.2 + 0.4;
      dome.material.emissiveIntensity = pulse;

      // Pulsing PEMF coils
      coilGroup.children.forEach((coil, i) => {
        coil.material.emissiveIntensity = Math.sin(Date.now() * 0.004 + i) * 0.3 + 0.5;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isAutoRotate]);

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 5, 8);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="w-full bg-gray-950 rounded-2xl overflow-hidden border border-gray-800">
      <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
      
      {/* Controls */}
      <div className="bg-gray-900/70 border-t border-gray-800 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
          Interactive 3D Model — Drag to rotate | Scroll to zoom
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-xs transition ${
              isAutoRotate
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <RotateCcw size={12} /> {isAutoRotate ? 'Auto-Rotating' : 'Static'}
          </button>
          <button
            onClick={resetView}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 font-black text-xs transition"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gray-900/50 px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-gray-800">
        {[
          { icon: Sun, label: 'Chromotherapy Dome', color: '#00ffff' },
          { icon: Activity, label: 'PEMF Coils', color: '#7c3aed' },
          { icon: Volume2, label: 'Vibroacoustic', color: '#333333' },
          { icon: Wind, label: 'Aromatherapy Vents', color: '#00ffaa' },
          { icon: Activity, label: 'EEG/Biometric PCB', color: '#1a1a3a' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <item.icon size={12} style={{ color: item.color }} />
            <span className="text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}