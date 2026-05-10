import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Device3DVisualization({ deviceName, color = "#3b82f6" }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111827);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 3);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(color, 1, 100);
    pointLight.position.set(-5, 5, 5);
    scene.add(pointLight);

    // Create generic device based on name
    const device = createDevice(deviceName, color);
    scene.add(device);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      device.rotation.x += 0.003;
      device.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [deviceName, color]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function createDevice(name, color) {
  const group = new THREE.Group();
  const colorObj = new THREE.Color(color);

  // Normalize color for better visibility
  const normalizedColor = new THREE.Color(color);

  // Generic coil/toroidal base
  const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 32);
  const torusMaterial = new THREE.MeshStandardMaterial({
    color: normalizedColor,
    metalness: 0.4,
    roughness: 0.6,
    emissive: normalizedColor,
    emissiveIntensity: 0.2,
  });
  const torus = new THREE.Mesh(torusGeometry, torusMaterial);
  group.add(torus);

  // Central core cylinder
  const cylinderGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
  const cylinderMaterial = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.3,
    roughness: 0.7,
  });
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  group.add(cylinder);

  // Decorative spheres (coil winding representation)
  const sphereGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: normalizedColor,
    metalness: 0.5,
    roughness: 0.5,
    emissive: normalizedColor,
    emissiveIntensity: 0.3,
  });

  const positions = [
    { x: 0, y: 0.8, z: 0 },
    { x: 0, y: -0.8, z: 0 },
    { x: 0.8, y: 0, z: 0 },
    { x: -0.8, y: 0, z: 0 },
  ];

  positions.forEach((pos) => {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial.clone());
    sphere.position.set(pos.x, pos.y, pos.z);
    group.add(sphere);
  });

  // Energy field glow (wireframe)
  const wireGeometry = new THREE.IcosahedronGeometry(1.4, 3);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: normalizedColor,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const wire = new THREE.Mesh(wireGeometry, wireMaterial);
  group.add(wire);

  return group;
}