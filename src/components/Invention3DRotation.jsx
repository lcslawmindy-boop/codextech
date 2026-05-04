import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Invention3DRotation({ title = "Device" }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const meshRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    // Setup camera
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create rotating device geometry (polyhedron)
    const geometry = new THREE.IcosahedronGeometry(1.5, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff99,
      emissive: 0x004400,
      wireframe: false,
      shininess: 100,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Add edges for tech look
    const edges = new THREE.EdgesGeometry(geometry);
    const wireframe = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00ccff }));
    mesh.add(wireframe);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ff99, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x0088ff, 0.5);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Rotate mesh
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.005;
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.z += 0.003;
      }
      
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full">
      <div ref={containerRef} style={{ width: '100%', height: '400px' }} />
      {title && (
        <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
          <p className="font-black text-lg tracking-widest" style={{
            color: '#00ff99',
            textShadow: '0 0 20px rgba(0,255,153,0.8), 0 0 40px rgba(0,200,255,0.4)',
          }}>
            {title}
          </p>
        </div>
      )}
    </div>
  );
}