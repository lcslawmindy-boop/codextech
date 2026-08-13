import { useRef, useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { ZoomIn, ZoomOut, Maximize2, Crosshair, Network } from "lucide-react";
import { DOMAINS, CONNECTION_TYPES, getNodeRadius, SUPPRESSION_STATUS } from "@/lib/researchGraphData";
import { goldenSpiralPositions, goldenSpiralCurve, buildDomainCardTexture, BackgroundCarousel, GRAPH_BG_IMAGES, buildMetatronCube, buildLightningEdgeGeometry } from "@/lib/graphScene3D";
import MatrixRainOverlay from "@/components/research-graph/MatrixRainOverlay";
import BgSlideshow from "@/components/research-graph/BgSlideshow";

// ── 3D Interactive Research Graph ──────────────────────────────────────────
// Three.js force-directed graph: labeled nodes colored by domain, labeled edges
// colored by connection type, hover lights up connected edges to show linkage.

const DOMAIN_MAP = new Map(DOMAINS.map(d => [d.id, d]));
const CONN_MAP = new Map(Object.entries(CONNECTION_TYPES));

// Apply a callback to every material on a group's descendants
const applyMats = (group, fn) => { if (!group) return; group.traverse(o => { if (o.material) fn(o.material); }); };


export default function GraphCanvas3D({ allNodes, allEdges, filters, selectedNode, onNodeClick, focusNode, graphMode, settings, searchQuery, bgImages }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodeMeshesRef = useRef([]);
  const edgeLinesRef = useRef(null);
  const metatronRef = useRef(null);
  const labelsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const cameraSphericalRef = useRef({ radius: 780, theta: 0, phi: Math.PI / 2.6 });
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const pointerDownPosRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const autoRotateTimerRef = useRef(null);
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

    // Scene — transparent so the CSS slideshow behind shows through
    const scene = new THREE.Scene();
    // No scene.background — CSS layer provides the background images
    sceneRef.current = scene;

    // Stub carousel (no-op — CSS slideshow handles backgrounds)
    const bgCarousel = new BackgroundCarousel();

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
    renderer.setClearColor(0x000000, 0); // fully transparent
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

    // ── Golden spiral placement (Twilight-Zone layout) ──
    const positions = goldenSpiralPositions(visibleNodes);
    const posArray = new Float32Array(visibleNodes.length * 3);
    visibleNodes.forEach((n, i) => {
      const p = positions.get(n.numericId);
      posArray[i * 3] = p.x;
      posArray[i * 3 + 1] = p.y;
      posArray[i * 3 + 2] = p.z;
    });

    // Graph group — holds the spiral, cards, and edges; rotates slowly
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    // ── Golden spiral guide line (neon green, glowing) ──
    const spiralPts = goldenSpiralCurve(900);
    const spiralGeo = new THREE.BufferGeometry().setFromPoints(spiralPts);
    const spiralMat = new THREE.LineBasicMaterial({ color: 0x39FF14, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false });
    const spiralLine = new THREE.Line(spiralGeo, spiralMat);
    graphGroup.add(spiralLine);

    // ── 3D laser axis — four colored beams rotating from the center ──
    const AXIS_LEN = 900;
    const axisColors = [0x00BFFF /* blue */, 0xFF8C00 /* orange */, 0x39FF14 /* green */, 0xB026FF /* purple */];
    const axisGroup = new THREE.Group();
    axisColors.forEach((col, i) => {
      const angle = (i / axisColors.length) * Math.PI * 2;
      const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        dir.clone().multiplyScalar(AXIS_LEN),
      ]);
      const axisMat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
      const axisLine = new THREE.Line(axisGeo, axisMat);
      axisLine.userData = { baseAngle: angle, color: col };
      axisGroup.add(axisLine);

      // glowing core orb at the tip of each beam
      const orbGeo = new THREE.SphereGeometry(6, 12, 12);
      const orbMat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.copy(dir.clone().multiplyScalar(AXIS_LEN));
      orb.userData = { baseAngle: angle };
      axisGroup.add(orb);
    });
    // vertical center beam (white-green core)
    const vGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -AXIS_LEN, 0),
      new THREE.Vector3(0, AXIS_LEN, 0),
    ]);
    const vMat = new THREE.LineBasicMaterial({ color: 0xAFFFA0, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    axisGroup.add(new THREE.Line(vGeo, vMat));
    graphGroup.add(axisGroup);

    // ── Metatron's Cube + Platonic solids on the axis center ──
    const metatron = buildMetatronCube(140);
    metatronRef.current = metatron;
    graphGroup.add(metatron);

    // ── 3D realistic research cards (billboarded, one shared texture per domain) ──
    const cardGeo = new THREE.PlaneGeometry(1, 1.3);
    const domainTex = new Map(DOMAINS.map(d => [d.id, buildDomainCardTexture(d)]));

    const nodeGroup = new THREE.Group();
    graphGroup.add(nodeGroup);
    const meshes = [];
    visibleNodes.forEach((n, i) => {
      const r = Math.max(11, getNodeRadius(n) * 1.15);
      const color = new THREE.Color(n.domainColor);
      const tex = domainTex.get(n.domainId);
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, opacity: 0.92, side: THREE.DoubleSide, depthWrite: false,
      });
      const card = new THREE.Mesh(cardGeo, mat);
      card.scale.setScalar(r);

      const mesh = new THREE.Group();
      mesh.add(card);
      mesh.position.set(posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2]);
      mesh.userData = { node: n, index: i, baseColor: color.clone(), baseOpacity: 0.92, card, cardMat: mat };
      nodeGroup.add(mesh);
      meshes.push(mesh);
    });
    nodeMeshesRef.current = meshes;

    // ── Lightning-bolt edges (jagged neon polylines with energy pulse) ──
    const nodeById = new Map(visibleNodes.map((n, i) => [n.numericId, i]));
    const nodePosMap = new Map();
    visibleNodes.forEach((n, i) => nodePosMap.set(n.numericId, meshes[i].position));
    const bolt = buildLightningEdgeGeometry(visibleEdges, nodePosMap);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(bolt.positions, 3));
    edgeGeo.setAttribute("color", new THREE.BufferAttribute(bolt.colors, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: Math.max(0.65, settings.edgeOpacity || 0.65),
      linewidth: 2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLines.userData = { segments: bolt.segments, baseOpacity: Math.max(0.65, settings.edgeOpacity || 0.65) };
    graphGroup.add(edgeLines);
    edgeLinesRef.current = edgeLines;

    // Edge list (used for label placement)
    const edgeList = visibleEdges.map(e => ({
      source: nodeById.get(e.source),
      target: nodeById.get(e.target),
      typeColor: e.typeColor || "#C9A84C",
    })).filter(e => e.source !== undefined && e.target !== undefined);

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

      // (background handled by CSS slideshow)

      // ── Rotate the golden spiral graph group (Twilight-Zone sweep) ──
      graphGroup.rotation.y += 0.016 * 0.08;

      // ── Rotate the 3D laser axis from the center ──
      axisGroup.rotation.y += 0.016 * 0.35;
      axisGroup.children.forEach((c, i) => {
        if (c.userData && c.userData.baseAngle !== undefined && c.geometry && c.geometry.attributes && c.geometry.attributes.position) {
          // pulsing opacity for laser flicker
          c.material.opacity = 0.6 + Math.sin(pulseClockRef.current * 2 + i) * 0.25;
        }
      });

      // ── Metatron's cube + Platonic solids rotation ──
      if (metatronRef.current?.update) metatronRef.current.update(0.016);

      // ── Lightning-bolt energy pulse — flickering opacity shocks ──
      if (edgeLinesRef.current) {
        const el = edgeLinesRef.current;
        const base = el.userData.baseOpacity || 0.65;
        // rapid energy-shock flicker
        el.material.opacity = base * (0.6 + Math.abs(Math.sin(pulseClockRef.current * 4)) * 0.4 + Math.random() * 0.15);
      }

      // ── Billboard each card to face the camera (pop-out effect) ──
      if (cameraRef.current) {
        const invGroup = graphGroup.quaternion.clone().invert();
        const targetQ = invGroup.multiply(cameraRef.current.quaternion);
        meshes.forEach((mesh, i) => {
          const ud = mesh.userData;
          ud.card.quaternion.copy(targetQ);
          // Only breathe opacity when nothing is hovered — hover owns opacity/scale
          if (!hoveredNode) {
            const breath = 0.86 + Math.sin(pulseClockRef.current * 0.6 + i * 0.4) * 0.06;
            ud.cardMat.opacity = breath;
            mesh.scale.setScalar(1);
          }
        });
      }

      // Update label positions
      const childCount = visibleNodes.length + (settings.showLabels && edgeList.length < 200 ? visibleEdges.length : 0);
      if (labelsDiv.childNodes.length === childCount) {
        const _wp = new THREE.Vector3();
        visibleNodes.forEach((n, i) => {
          const mesh = meshes[i];
          if (!mesh) return;
          const label = labelsDiv.childNodes[i];
          if (!label) return;
          mesh.getWorldPosition(_wp);
          const v = _wp.clone().project(camera);
          const x = (v.x * 0.5 + 0.5) * width;
          const y = (-v.y * 0.5 + 0.5) * height;
          const vis = v.z < 1;
          label.style.transform = `translate(${x}px, ${y}px)`;
          label.style.display = vis ? "block" : "none";
        });
        // Edge labels at midpoint
        if (settings.showLabels && edgeList.length < 200) {
          const _ws = new THREE.Vector3();
          const _wt = new THREE.Vector3();
          visibleEdges.forEach((e, i) => {
            const label = labelsDiv.childNodes[visibleNodes.length + i];
            if (!label) return;
            const sIdx = nodeById.get(e.source);
            const tIdx = nodeById.get(e.target);
            if (sIdx === undefined || tIdx === undefined) return;
            const sm = meshes[sIdx], tm = meshes[tIdx];
            if (!sm || !tm) return;
            sm.getWorldPosition(_ws); tm.getWorldPosition(_wt);
            const mid = _ws.clone().add(_wt).multiplyScalar(0.5);
            const v = mid.project(camera);
            const x = (v.x * 0.5 + 0.5) * width;
            const y = (-v.y * 0.5 + 0.5) * height;
            const vis = v.z < 1;
            label.style.transform = `translate(${x}px, ${y}px)`;
            label.style.display = vis ? "block" : "none";
          });
        }
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

      // Edge labels (connection type) — only when showLabels is on
      if (settings.showLabels && edgeList.length < 200) {
        visibleEdges.forEach((e, i) => {
          const label = document.createElement("div");
          const ct = CONN_MAP.get(e.type);
          label.textContent = ct ? ct.label : "";
          label.dataset.edgeIdx = i;
          label.style.cssText = `position:absolute;left:0;top:0;transform-origin:0 0;white-space:nowrap;font-size:7px;font-family:JetBrains Mono,monospace;color:${e.typeColor || "#C9A84C"};background:rgba(13,17,23,0.8);padding:0px 3px;border-radius:2px;pointer-events:none;text-shadow:0 0 3px #000;opacity:0.85;`;
          labelsDiv.appendChild(label);
        });
      }

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
      bgCarousel.dispose();
      cardGeo.dispose();
      spiralGeo.dispose();
    };
  }, [visibleNodes, visibleEdges, settings.edgeOpacity, settings.showLabels]);

  // Camera orbit controls (manual)
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const onPointerDown = (e) => {
      isDraggingRef.current = true;
      autoRotateRef.current = false;
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
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
      sph.radius = Math.max(80, Math.min(3000, sph.radius));
      const cam = cameraRef.current;
      cam.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cam.lookAt(0, 0, 0);
      setZoomLevel(780 / sph.radius);
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
      // Nodes are Groups — intersect their children, then walk up to the group
      const intersects = raycasterRef.current.intersectObjects(nodeMeshesRef.current, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.node) obj = obj.parent;
        if (obj && obj.userData.node) {
          const node = obj.userData.node;
          setHoveredNode(node);
          setTooltip({ node, x: e.clientX - rect.left, y: e.clientY - rect.top });
          mount.style.cursor = "pointer";
          autoRotateRef.current = false; // pause rotation so the node is clickable
          return;
        }
      }
      setHoveredNode(null);
      setTooltip(null);
      mount.style.cursor = "grab";
      // resume auto-rotation after a brief pause when no longer hovering
      if (!isDraggingRef.current) {
        clearTimeout(autoRotateTimerRef.current);
        autoRotateTimerRef.current = setTimeout(() => { autoRotateRef.current = true; }, 2500);
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
      // Dim non-connected cards, highlight connected
      meshes.forEach(mesh => {
        const isConnected = connectedIds.has(mesh.userData.node.numericId);
        const ud = mesh.userData;
        ud.cardMat.opacity = isConnected ? 1 : 0.12;
        const scale = (ud.node.numericId === hoveredNode.numericId ? 1.6 : 1);
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
      const hc = new THREE.Color(hoveredNode.domainColor);
      const stride = (edgeLines.userData.segments + 1) * 3; // 6 verts * 3 = 18
      visibleEdges.forEach((e, i) => {
        const isConn = e.source === hoveredNode.numericId || e.target === hoveredNode.numericId;
        const base = i * stride;
        if (isConn) {
          // Connected edges take the hovered node's color — bold & clear
          for (let v = 0; v < stride; v += 3) {
            colors[base + v] = hc.r; colors[base + v + 1] = hc.g; colors[base + v + 2] = hc.b;
          }
        } else {
          // Dim to gray
          for (let v = 0; v < stride; v += 3) {
            colors[base + v] = orig[base + v] * 0.15;
            colors[base + v + 1] = orig[base + v + 1] * 0.15;
            colors[base + v + 2] = orig[base + v + 2] * 0.15;
          }
        }
      });
      edgeColorAttr.needsUpdate = true;
      edgeLines.material.opacity = 1;
    } else {
      // Reset
      meshes.forEach(mesh => {
        const ud = mesh.userData;
        ud.cardMat.opacity = ud.baseOpacity;
        mesh.scale.setScalar(1);
      });
      if (edgeLines.userData.origColors) {
        const edgeColorAttr = edgeLines.geometry.attributes.color;
        edgeColorAttr.array.set(edgeLines.userData.origColors);
        edgeColorAttr.needsUpdate = true;
      }
      edgeLines.material.opacity = Math.max(0.5, settings.edgeOpacity || 0.5);
    }
  }, [hoveredNode, adjacency, visibleEdges, settings.edgeOpacity]);

  // Click handler
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const onClick = (e) => {
      if (!cameraRef.current || !sceneRef.current) return;
      // Skip if this click was actually the end of a drag-rotate
      const ddx = e.clientX - pointerDownPosRef.current.x;
      const ddy = e.clientY - pointerDownPosRef.current.y;
      if (Math.sqrt(ddx * ddx + ddy * ddy) > 6) return;
      const rect = mount.getBoundingClientRect();
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(nodeMeshesRef.current, true);
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData.node) obj = obj.parent;
        if (obj && obj.userData.node) {
          onNodeClick(obj.userData.node);
          return;
        }
      }
      onNodeClick(null);
    };
    mount.addEventListener("click", onClick);
    return () => mount.removeEventListener("click", onClick);
  }, [onNodeClick]);

  // Zoom controls
  const handleZoomIn = () => {
    const sph = cameraSphericalRef.current;
    sph.radius = Math.max(80, sph.radius * 0.8);
    if (cameraRef.current) {
      cameraRef.current.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cameraRef.current.lookAt(0, 0, 0);
      setZoomLevel(780 / sph.radius);
    }
  };
  const handleZoomOut = () => {
    const sph = cameraSphericalRef.current;
    sph.radius = Math.min(3000, sph.radius * 1.25);
    if (cameraRef.current) {
      cameraRef.current.position.set(
        sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta),
        sph.radius * Math.cos(sph.phi),
        sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta)
      );
      cameraRef.current.lookAt(0, 0, 0);
      setZoomLevel(780 / sph.radius);
    }
  };
  const handleFitAll = () => {
    cameraSphericalRef.current = { radius: 780, theta: 0, phi: Math.PI / 2.6 };
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
      <BgSlideshow opacity={0.75} images={bgImages} />
      <div ref={mountRef} className="w-full h-full" style={{ cursor: "grab", position: "relative", zIndex: 1, touchAction: "none" }} />
      <MatrixRainOverlay opacity={0.28} />

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
          <span className="text-amber-400">GOLDEN SPIRAL</span>
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

      {/* Legend — Color Key */}
      {settings.showLegend && (
        <div className="absolute bottom-3 left-3 z-10 max-w-[300px]">
          <div className="bg-slate-950/95 border border-slate-800 rounded-lg p-3 backdrop-blur">
            <p className="text-amber-400 text-[9px] font-black uppercase tracking-wider mb-1" style={{ fontFamily: "Orbitron, sans-serif" }}>Color Key — Research Topics</p>
            <p className="text-slate-500 text-[7px] mb-2">Node size = connection count · each domain has its own color</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {DOMAINS.map(d => (
                <div key={d.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color, boxShadow: `0 0 4px ${d.color}` }} />
                  <span className="text-slate-300 text-[8px] truncate">{d.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800">
              <p className="text-slate-400 text-[8px] font-bold uppercase mb-1">Suppression Status</p>
              <div className="grid grid-cols-1 gap-y-0.5">
                {SUPPRESSION_STATUS.map(s => (
                  <div key={s.id} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-slate-400 text-[7px] truncate">{s.label}</span>
                  </div>
                ))}
              </div>
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
            <p className="text-amber-400 text-[8px] mt-2">Hover a card → it pops out & its edges light up · drag to rotate the spiral</p>
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