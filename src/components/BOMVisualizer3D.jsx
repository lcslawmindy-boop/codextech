import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ChevronDown, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

const COMPONENT_COLORS = {
  coil: 0xFF6B6B,
  magnet: 0xFF9F5A,
  core: 0x4ECDC4,
  capacitor: 0x45B7D1,
  resistor: 0xFFA07A,
  connector: 0x98D8C8,
  housing: 0x7F8487,
  wire: 0xC0C0C0,
};

function createComponentGeometry(type, scale = 1) {
  switch (type) {
    case "coil":
      const torusGeometry = new THREE.TorusGeometry(0.5 * scale, 0.2 * scale, 16, 32);
      return torusGeometry;
    case "magnet":
      const magnetGeometry = new THREE.BoxGeometry(0.3 * scale, 1.5 * scale, 0.5 * scale);
      return magnetGeometry;
    case "core":
      const coreGeometry = new THREE.CylinderGeometry(0.4 * scale, 0.4 * scale, 2 * scale, 16);
      return coreGeometry;
    case "capacitor":
      const capGeometry = new THREE.CylinderGeometry(0.2 * scale, 0.2 * scale, 0.8 * scale, 8);
      return capGeometry;
    case "resistor":
      const resGeometry = new THREE.BoxGeometry(0.15 * scale, 0.15 * scale, 0.6 * scale);
      return resGeometry;
    case "connector":
      const connGeometry = new THREE.SphereGeometry(0.15 * scale, 8, 8);
      return connGeometry;
    default:
      return new THREE.BoxGeometry(0.5 * scale, 0.5 * scale, 0.5 * scale);
  }
}

export default function BOMVisualizer3D({ bom = [] }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshesRef = useRef([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add default components if no BOM provided
    const defaultBOM = bom.length === 0 ? [
      { type: "coil", name: "Primary Coil", quantity: 1, position: [-1.5, 1, 0] },
      { type: "core", name: "Ferrite Core", quantity: 1, position: [0, 1, 0] },
      { type: "magnet", name: "Neodymium Magnet", quantity: 2, position: [1.5, 1, 0] },
      { type: "capacitor", name: "Capacitor Bank", quantity: 3, position: [-1.5, -1, 0] },
      { type: "connector", name: "Signal Connector", quantity: 2, position: [0, -1, 0] },
      { type: "resistor", name: "Current Limiting Resistor", quantity: 4, position: [1.5, -1, 0] },
    ] : bom;

    meshesRef.current = [];

    // Create component meshes
    defaultBOM.forEach((component, index) => {
      const geometry = createComponentGeometry(component.type);
      const material = new THREE.MeshPhongMaterial({ color: COMPONENT_COLORS[component.type] || 0x999999 });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(...(component.position || [index % 3 - 1, Math.floor(index / 3) - 1, 0]));
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { ...component, index };

      scene.add(mesh);
      meshesRef.current.push(mesh);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshesRef.current);

      if (intersects.length > 0) {
        const selected = intersects[0].object;
        setSelectedComponent(selected.userData);
        meshesRef.current.forEach(m => (m.material.emissive.setHex(m === selected ? 0x444444 : 0x000000)));
      }
    };

    renderer.domElement.addEventListener("click", onMouseClick);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate all meshes slightly
      meshesRef.current.forEach(mesh => {
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [bom]);

  const handleResetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const handleZoom = (direction) => {
    if (cameraRef.current) {
      const factor = direction === "in" ? 0.8 : 1.2;
      cameraRef.current.position.z *= factor;
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const groupedBOM = bom.length === 0 
    ? {
        "Coils & Cores": [{ type: "coil", name: "Primary Coil", quantity: 1 }, { type: "core", name: "Ferrite Core", quantity: 1 }],
        "Magnets": [{ type: "magnet", name: "Neodymium Magnet", quantity: 2 }],
        "Electronics": [
          { type: "capacitor", name: "Capacitor Bank", quantity: 3 },
          { type: "resistor", name: "Current Limiting Resistor", quantity: 4 },
        ],
        "Connectors": [{ type: "connector", name: "Signal Connector", quantity: 2 }],
      }
    : bom.reduce((acc, item) => {
        const category = item.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {});

  return (
    <div className="w-full space-y-4">
      {/* 3D Viewer */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div ref={containerRef} style={{ height: "500px" }} className="w-full" />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => handleZoom("in")}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} className="text-cyan-400" />
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} className="text-cyan-400" />
          </button>
          <button
            onClick={handleResetView}
            className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-colors"
            title="Reset View"
          >
            <RotateCw size={16} className="text-cyan-400" />
          </button>
        </div>

        {/* Selected Component Info */}
        {selectedComponent && (
          <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-700 rounded-lg p-4 max-w-xs">
            <p className="text-cyan-400 font-bold text-sm mb-1">{selectedComponent.name}</p>
            <p className="text-gray-400 text-xs mb-2">Quantity: {selectedComponent.quantity || 1}</p>
            <p className="text-gray-500 text-xs">{selectedComponent.type}</p>
          </div>
        )}
      </div>

      {/* BOM List */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <h4 className="text-white font-bold text-sm mb-4">Bill of Materials</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Object.entries(groupedBOM).map(([category, items]) => (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/50 transition-colors text-left"
              >
                <span className="text-gray-300 font-semibold text-sm">{category}</span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${expandedCategories[category] ? "rotate-180" : ""}`}
                />
              </button>
              {expandedCategories[category] && (
                <div className="ml-2 space-y-1 mt-1 border-l border-gray-700 pl-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <span className="text-cyan-400 font-bold">×{item.quantity || 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}