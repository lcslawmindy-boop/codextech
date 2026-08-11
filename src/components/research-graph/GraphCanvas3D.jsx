import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut, Maximize2, Crosshair, Network } from "lucide-react";
import { DOMAINS, CONNECTION_TYPES, getNodeRadius } from "@/lib/researchGraphData";

// ── 3D Interactive Research Graph ──────────────────────────────────────────
// Three.js force-directed graph: labeled nodes colored by domain, labeled edges
// colored by connection type, hover lights up connected edges to show linkage.

const DOMAIN_MAP = new Map(DOMAINS.map(d => [d.id, d]));
const CONN_MAP = new Map(Object.entries(CONNECTION_TYPES));

// Simple 3D force simulation (charge + spring + center gravity)
function simulate3D(nodes, edges, iterations = 300) {
  const pos = new Map();
  // Initial random positions on a sphere
  nodes.forEach((n, i) => {
    const r = 200 + Math.random() * 100;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos.set(n.numericId, new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ));
  });

  const k = 40; // spring length
  const repulsion = 1200;
  const centerGravity = 0.015;

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion (O(n²) — fine for ~500 nodes at 300 iters)
    for (let i = 0; i < nodes.length; i++) {
      const pi = pos.get(nodes[i].numericId);
      for (let j = i + 1; j < nodes.length; j++) {
        const pj = pos.get(nodes[j].numericId);
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const dz = pi.z - pj.z;
        let distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 1) distSq = 1;
        const force = repulsion / distSq;
        const dist = Math.sqrt(distSq);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        const fz = (dz / dist) * force;
        pi.x += fx; pi.y += fy; pi.z += fz;
        pj.x -= fx; pj.y -= fy; pj.z -= fz;
      }
    }
    // Spring attraction along edges
    edges.forEach(e => {
      const p1 = pos.get(e.source);
      const p2 = pos.get(e.target);
      if (!p1 || !p2) return;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dz = p2.z - p1.z;
      const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy + dz * dz));
      const force = (dist - k) * 0.05;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;
      p1.x += fx; p1.y += fy; p1.z += fz;
      p2.x -= fx; p2.y -= fy; p2.z -= fz;
    });
    // Center gravity
    pos.forEach(p => {
      p.x -= p.x * centerGravity;
      p.y -= p.y * centerGravity;
      p.z -= p.z * centerGravity;
    });
  }
  return pos;
}

export default function GraphCanvas3D({ allNodes, allEdges, filters, selectedNode, onNodeClick, focusNode, graphMode, settings, searchQuery }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodeMeshesRef = useRef([]);
  const edgeLinesRef = useRef(null);
  const labelsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const cameraSphericalRef = useRef({ radius: 500, theta: 0, phi: Math.PI / 2.6 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const pulseClockRef = useRef(0);

  // Filter nodes/edges
  const { visibleNodes, visibleEdges } = useMemo(() => {
    const visN = allNodes.filter(n => {
      if (filters.domains.length > 0 && !filters.domains.includes(n.domainId)) return false;
      if (filters.evidence.length > 0 && !filters.evidence.includes(n.evidence)) return false;
      if (filters.suppression.length > 0 && !filters.suppression.includes(n.suppressionId)) return false;
      if (filters.targetSystems.length > 0 && !n.targetSystems.some(t => filters.targetSystems.includes(t))) return false;
      if (filters.minConnections > 0 && n.connectionCount < filters.minConnections) return false;
      if (filters.eraMin && n.year < filters.eraMin) return false;
      if (filters.eraMax && n.year > filters.eraMax) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!n.label.toLowerCase().includes(q) && !n.researcher.toLowerCase().includes(q) && !n.tags.some(t => t.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    const visIds = new Set(visN.map(n => n.numericId));
    const visE = allEdges.filter(e => visIds.has(e.source) && visIds.has(e.target));
    if (focusNode) {
      const focusId = focusNode.numericId;
      const directConnIds = new Set([focusId]);
      visE.forEach(e => {
        if (e.source === focusId) directConnIds.add(e.target);
        if (e.target === focusId) directConnIds.add(e.source);
      });
      const filtered = visN.filter(n => directConnIds.has(n.numericId));
      const filteredIds = new Set(filtered.map(n => n.numericId));
      const filteredEdges = visE.filter(e => filteredIds.has(e.source) && filteredIds.has(e.target));
      return { visibleNodes: filtered, visibleEdges: filteredEdges };
    }
    return { visibleNodes: visN, visibleEdges: visE };
  }, [allNodes, allEdges, filters, focusNode, searchQuery]);

  // Build adjacency for hover highlighting
  const adjacency = useMemo(() => {
    const adj = new Map();
    visibleEdges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, new Set());
      if (!adj.has(e.target)) adj.set(e.target, new Set());
      adj.get(e.source).add(e.target);
      adj.get(e.target).add(e.source);
    });
    return adj;
  }, [visibleEdges]);

  // Main Three.js setup
  useEffect(() => {
    if (!mountRef.current || visibleNodes.length === 0) return;
    setLoading(true);

    const mount = mountRef.current;
    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 5000);
    const sph = cameraSphericalRef.current;
    camera.position.set(
      sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
      sph.radius * Math.cos(sph.phi),
      sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
    );
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);

    // Simulate positions
    const positions = simulate3D(visibleNodes, visibleEdges, 250);
    const posArray = new Float32Array(visibleNodes.length * 3);
    visibleNodes.forEach((n, i) => {
      const p = positions.get(n.numericId);
      posArray[i * 3] = p.x;
      posArray[i * 3 + 1] = p.y;
      posArray[i * 3 + 2] = p.z;
    });

    // Nodes as spheres
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);
    const meshes = [];
    visibleNodes.forEach((n, i) => {
      const r = getNodeRadius(n) * 0.6;
      const geo = new THREE.SphereGeometry(Math.max(2, r), 12, 12);
      const color = new THREE.Color(n.domainColor);
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        metalness: 0.3,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2]);
      mesh.userData = { node: n, index: i, baseColor: color.clone(), baseEmissive: 0.3 };
      nodeGroup.add(mesh);
      meshes.push(mesh);
    });
    nodeMeshesRef.current = meshes;

    // Edges as line segments
    const edgeGeo = new THREE.BufferGeometry();
    const edgePositions = new Float32Array(visibleEdges.length * 6);
    const edgeColors = new Float32Array(visibleEdges.length * 6);
    const nodeById = new Map(visibleNodes.map((n, i) => [n.numericId, i]));
    visibleEdges.forEach((e, i) => {
      const sIdx = nodeById.get(e.source);
      const tIdx = nodeById.get(e.target);
      if (sIdx === undefined || tIdx === undefined) return;
      const sp = meshes[sIdx].position;
      const tp = meshes[tIdx].position;
      edgePositions[i * 6] = sp.x; edgePositions[i * 6 + 1] = sp.y; edgePositions[i * 6 + 2] = sp.z;
      edgePositions[i * 6 + 3] = tp.x; edgePositions[i * 6 + 4] = tp.y; edgePositions[i * 6 + 5] = tp.z;
      const c = new THREE.Color(e.typeColor || "#C9A84C");
      edgeColors[i * 6] = c.r; edgeColors[i * 6 + 1] = c.g; edgeColors[i * 6 + 2] = c.b;
      edgeColors[i * 6 + 3] = c.r; edgeColors[i * 6 + 4] = c.g; edgeColors[i * 6 + 5] = c.b;
    });
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: settings.edgeOpacity || 0.35,
      linewidth: 1,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    scene.add(edgeLines);
    edgeLinesRef.current = edgeLines;

    // Labels overlay (HTML)
    const labelsDiv = document.createElement("div");
    labelsDiv.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;";
    mount.appendChild(labelsDiv);
    labelsRef.current = labelsDiv;

    // Render loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      pulseClockRef.current += 0.016;

      // Cinematic auto-rotation — slow camera sweep, pauses while dragging
      if (autoRotateRef.current && !isDraggingRef.current && cameraRef.current) {
        const sph = cameraSphericalRef.current;
        sph.theta += 0.0015;
        const cam = cameraRef.current;
        cam.position.set(
          sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
          sph.radius * Math.cos(sph.phi),
          sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
        );
        cam.lookAt(0, 0, 0);
      }

      // Pulsing glow on nodes (cinematic breathing effect)
      const pulse = 0.3 + Math.sin(pulseClockRef.current) * 0.15;
      meshes.forEach((mesh, i) => {
        if (mesh.userData.baseEmissive !== undefined) {
          // Only pulse non-hovered nodes; hovered highlighting handles its own emissive
          mesh.material.emissiveIntensity = pulse + (i % 7) * 0.02;
        }
      });

      // Update label positions
      if (labelsDiv.childNodes.length === visibleNodes.length) {
        visibleNodes.forEach((n, i) => {
          const mesh = meshes[i];
          if (!mesh) return;
          const label = labelsDiv.childNodes[i];
          if (!label) return;
          const v = mesh.position.clone().project(camera);
          const x = (v.x * 0.5 + 0.5) * width;
          const y = (-v.y * 0.5 + 0.5) * height;
          const visible = v.z < 1;
          label.style.transform = `translate(${x}px, ${y}px)`;
          label.style.display = visible ? "block" : "none";
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    // Create label elements after a tick (so they exist)
    setTimeout(() => {
      labelsDiv.innerHTML = "";
      visibleNodes.forEach(n => {
        const label = document.createElement("div");
        const showLabel = settings.showLabels || (n.connectionCount >= 16);
        label.textContent = n.label.length > 22 ? n.label.substring(0, 20) + "…" : n.label;
        label.style.cssText = `position:absolute;left:0;top:0;transform-origin:0 0;white-space:nowrap;font-size:9px;font-family:Inter,sans-serif;color:${showLabel ? "#F0F6FF" : "transparent"};background:${showLabel ? "rgba(13,17,23,0.7)" : "transparent"};padding:1px 4px;border-radius:3px;border:1px solid ${showLabel ? n.domainColor + "60" : "transparent"};pointer-events:none;text-shadow:0 0 4px #000;`;
        labelsDiv.appendChild(label);
      });
      setLoading(false);
    }, 100);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      if (labelsDiv.parentNode) labelsDiv.parentNode.removeChild(labelsDiv);
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
    };
  }, [visibleNodes, visibleEdges, settings.edgeOpacity, settings.showLabels]);

  // Camera orbit controls (manual)
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      lastPointerRef.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current && cameraRef.current) {
        const dx = e.clientX - lastPointerRef.current.x;
        const dy = e.clientY - lastPointerRef.current.y;
        const sph = cameraSphericalRef.current;
        sph.theta -= dx * 0.005;
        sph.phi -= dy * 0.005;
        sph.phi = Math.max(0.1, Math.min(Math.PI - 0.1, sph.phi));
        const cam = cameraRef.current;
        cam.position.set(
          sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
          sph.radius * Math.cos(sph.phi),
          sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
        );
        cam.lookAt(0, 0, 0);
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onPointerUp = () => {
      isDraggingRef.current = false;
      // Resume auto-rotation after 3 seconds of inactivity
      setTimeout(() => { autoRotateRef.current = true; }, 3000);
    };
    const onWheel = (e) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const sph = cameraSphericalRef.current;
      sph.radius *= e.deltaY > 0 ? 1.1 : 0.9;
      sph.radius = Math.max(50, Math.min(2000, sph.radius));
      const cam = cameraRef.current;
      cam.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cam.lookAt(0, 0, 0);
      setZoomLevel(500 / sph.radius);
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("wheel", onWheel);
    };
  }, []);

  // Hover detection via raycaster
  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    let raf = null;

    const checkHover = (e) => {
      if (!cameraRef.current || !sceneRef.current || nodeMeshesRef.current.length === 0) return;
      const rect = mount.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(nodeMeshesRef.current);
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const node = mesh.userData.node;
        setHoveredNode(node);
        setTooltip({ node, x: e.clientX - rect.left, y: e.clientY - rect.top });
        mount.style.cursor = "pointer";
      } else {
        setHoveredNode(null);
        setTooltip(null);
        mount.style.cursor = "grab";
      }
    };

    const onMove = (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => checkHover(e));
    };
    mount.addEventListener("pointermove", onMove);
    return () => {
      mount.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [visibleNodes]);

  // Apply hover highlighting
  useEffect(() => {
    const meshes = nodeMeshesRef.current;
    const edgeLines = edgeLinesRef.current;
    if (!meshes.length || !edgeLines) return;

    if (hoveredNode) {
      const connectedIds = adjacency.get(hoveredNode.numericId) || new Set();
      connectedIds.add(hoveredNode.numericId);
      // Dim non-connected nodes, highlight connected
      meshes.forEach(mesh => {
        const isConnected = connectedIds.has(mesh.userData.node.numericId);
        mesh.material.opacity = isConnected ? 1 : 0.15;
        mesh.material.transparent = true;
        mesh.material.emissiveIntensity = isConnected ? 0.8 : 0.05;
        const scale = mesh.userData.node.numericId === hoveredNode.numericId ? 1.5 : 1;
        mesh.scale.setScalar(scale);
      });
      // Light up connected edges, dim others
      const edgeColorAttr = edgeLines.geometry.attributes.color;
      const colors = edgeColorAttr.array;
      const posAttr = edgeLines.geometry.attributes.position;
      const positions = posAttr.array;
      // Store original colors if not already
      if (!edgeLines.userData.origColors) {
        edgeLines.userData.origColors = new Float32Array(colors);
      }
      const orig = edgeLines.userData.origColors;
      visibleEdges.forEach((e, i) => {
        const isConn = e.source === hoveredNode.numericId || e.target === hoveredNode.numericId;
        if (isConn) {
          // Brighten
          colors[i * 6] = Math.min(1, orig[i * 6] * 2.5);
          colors[i * 6 + 1] = Math.min(1, orig[i * 6 + 1] * 2.5);
          colors[i * 6 + 2] = Math.min(1, orig[i * 6 + 2] * 2.5);
          colors[i * 6 + 3] = colors[i * 6];
          colors[i * 6 + 4] = colors[i * 6 + 1];
          colors[i * 6 + 5] = colors[i * 6 + 2];
        } else {
          // Dim to gray
          colors[i * 6] = orig[i * 6] * 0.15;
          colors[i * 6 + 1] = orig[i * 6 + 1] * 0.15;
          colors[i * 6 + 2] = orig[i * 6 + 2] * 0.15;
          colors[i * 6 + 3] = colors[i * 6];
          colors[i * 6 + 4] = colors[i * 6 + 1];
          colors[i * 6 + 5] = colors[i * 6 + 2];
        }
      });
      edgeColorAttr.needsUpdate = true;
      edgeLines.material.opacity = 1;
    } else {
      // Reset
      meshes.forEach(mesh => {
        mesh.material.opacity = 0.9;
        mesh.material.transparent = true;
        mesh.material.emissiveIntensity = mesh.userData.baseEmissive;
        mesh.scale.setScalar(1);
      });
      if (edgeLines.userData.origColors) {
        const edgeColorAttr = edgeLines.geometry.attributes.color;
        edgeColorAttr.array.set(edgeLines.userData.origColors);
        edgeColorAttr.needsUpdate = true;
      }
      edgeLines.material.opacity = settings.edgeOpacity || 0.35;
    }
  }, [hoveredNode, adjacency, visibleEdges, settings.edgeOpacity]);

  // Click handler
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const onClick = (e) => {
      if (!cameraRef.current || !sceneRef.current) return;
      const rect = mount.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(nodeMeshesRef.current);
      if (intersects.length > 0) {
        onNodeClick(intersects[0].object.userData.node);
      } else {
        onNodeClick(null);
      }
    };
    mount.addEventListener("click", onClick);
    return () => mount.removeEventListener("click", onClick);
  }, [onNodeClick]);

  // Zoom controls
  const handleZoomIn = () => {
    const sph = cameraSphericalRef.current;
    sph.radius = Math.max(50, sph.radius * 0.8);
    if (cameraRef.current) {
      cameraRef.current.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cameraRef.current.lookAt(0, 0, 0);
      setZoomLevel(500 / sph.radius);
    }
  };
  const handleZoomOut = () => {
    const sph = cameraSphericalRef.current;
    sph.radius = Math.min(2000, sph.radius * 1.25);
    if (cameraRef.current) {
      cameraRef.current.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cameraRef.current.lookAt(0, 0, 0);
      setZoomLevel(500 / sph.radius);
    }
  };
  const handleFitAll = () => {
    cameraSphericalRef.current = { radius: 500, theta: 0, phi: Math.PI / 2.6 };
    if (cameraRef.current) {
      const sph = cameraSphericalRef.current;
      cameraRef.current.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cameraRef.current.lookAt(0, 0, 0);
      setZoomLevel(1);
    }
  };
  const handleCenter = handleFitAll;

  const modeLabel = focusNode ? `FOCUS: ${focusNode.label}` :
    (filters.domains.length > 0 || filters.evidence.length > 0 || filters.suppression.length > 0) ?
    `FILTERED — ${visibleNodes.length} nodes · ${visibleEdges.length} edges` :
    `3D GRAPH — ${visibleNodes.length} nodes · ${visibleEdges.length} edges`;

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      <div ref={mountRef} className="w-full h-full" style={{ cursor: "grab" }} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-30">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto mb-3" />
            <p className="text-amber-400 text-sm font-bold" style={{ fontFamily: "Orbitron, sans-serif" }}>Building 3D research graph...</p>
          </div>
        </div>
      )}

      {/* Mode indicator */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono flex items-center gap-1.5">
          <Network size={10} className="text-amber-400" />
          <span className="text-amber-400">{modeLabel}</span>
        </div>
        <div className="px-2 py-1.5 rounded-lg bg-slate-950 border border-amber-400/30 text-[9px] font-mono flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-400">CINEMATIC</span>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-3 right-3 z-10">
        <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
          {Math.round(zoomLevel * 100)}%
        </div>
      </div>

      {/* Hover connection count badge */}
      {hoveredNode && (
        <div className="absolute top-14 left-3 z-10">
          <div className="px-3 py-2 rounded-lg bg-slate-950 border border-amber-400/40 text-[10px]">
            <span className="text-amber-400 font-bold">🔗 {adjacency.get(hoveredNode.numericId)?.size || 0} connections</span>
            <span className="text-slate-400 ml-2">lit up</span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && tooltip.node && (
        <div
          className="absolute z-20 pointer-events-none max-w-[280px]"
          style={{ left: Math.min(tooltip.x + 15, (mountRef.current?.clientWidth || 800) - 290), top: Math.min(tooltip.y + 15, (mountRef.current?.clientHeight || 600) - 200) }}
        >
          <div className="bg-slate-950 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
            <div className="h-1" style={{ backgroundColor: tooltip.node.domainColor }} />
            <div className="p-3">
              <p className="text-white text-xs font-bold leading-tight">{tooltip.node.label}</p>
              <p className="text-slate-400 text-[10px] mt-0.5">{tooltip.node.researcher} — {tooltip.node.year}</p>
              <div className="flex items-center gap-2 mt-2 text-[9px]">
                <span className="text-amber-400 font-bold">🔗 {adjacency.get(tooltip.node.numericId)?.size || 0} links</span>
                <span style={{ color: tooltip.node.suppressionColor }}>{tooltip.node.suppression}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tooltip.node.tags.slice(0, 4).map(t => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[8px]">{t}</span>
                ))}
              </div>
              <p className="text-amber-400 text-[9px] mt-2">Click to explore · Drag to rotate · Scroll to zoom</p>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      {settings.showLegend && (
        <div className="absolute bottom-3 left-3 z-10 max-w-[280px]">
          <div className="bg-slate-950/95 border border-slate-800 rounded-lg p-3 backdrop-blur">
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-2">Node Size = Connections</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {DOMAINS.map(d => (
                <div key={d.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-400 text-[8px] truncate">{d.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800">
              <p className="text-slate-400 text-[8px] font-bold uppercase mb-1">Edge Colors (connection type)</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                {Object.entries(CONNECTION_TYPES).map(([key, ct]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 flex-shrink-0" style={{ backgroundColor: ct.color }} />
                    <span className="text-slate-400 text-[7px] truncate">{ct.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-amber-400 text-[8px] mt-2">Hover a node → connected edges light up</p>
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1">
        <button onClick={handleZoomIn} className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
        <button onClick={handleZoomOut} className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
        <button onClick={handleFitAll} className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors" title="Fit All"><Maximize2 size={16} /></button>
        <button onClick={handleCenter} className="w-9 h-9 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400/50 transition-colors" title="Center"><Crosshair size={16} /></button>
      </div>
    </div>
  );
}