import { useEffect, useRef, useState } from "react";

const FACES = [
  {
    id: "invention",
    label: "Invention Library",
    color: "#a855f7",
    bg: "#1a0a2e",
    icon: "⚗️",
    lines: ["40+ Build Plans", "Full BOM", "Schematics", "Patent-Sourced"],
  },
  {
    id: "specs",
    label: "Tech Specs & BOM",
    color: "#f97316",
    bg: "#1e0f00",
    icon: "📐",
    lines: ["Calibrated Specs", "Part Numbers", "Digikey / Mouser", "Assembly Guides"],
  },
  {
    id: "patent",
    label: "Patent Suite",
    color: "#06b6d4",
    bg: "#00141a",
    icon: "📜",
    lines: ["USPTO Drafting", "Novelty Analysis", "FTO Research", "Threat Monitoring"],
  },
  {
    id: "bearden",
    label: "Bearden Graph",
    color: "#22c55e",
    bg: "#001a08",
    icon: "🕸️",
    lines: ["100+ Nodes", "Concept Network", "Scalar EM Links", "Interactive Graph"],
  },
  {
    id: "forge",
    label: "Invention Forge",
    color: "#fbbf24",
    bg: "#1a1200",
    icon: "⚡",
    lines: ["AI Hybrid IP", "Synergy Score", "Patent Claims", "IP Valuation"],
  },
  {
    id: "vdr",
    label: "VDR Room",
    color: "#ec4899",
    bg: "#1a0010",
    icon: "🔐",
    lines: ["Secure Data Room", "NDA-Gated Access", "Investor Packages", "Audit Logs"],
  },
];

// Project a 3D point to 2D screen coordinates
function project(x, y, z, rotX, rotY, size) {
  // Rotate around Y axis
  const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  // Rotate around X axis
  const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
  const y2 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  // Perspective
  const fov = size * 2.8;
  const dist = fov / (fov + z2 + size * 1.2);
  return { sx: x1 * dist, sy: y2 * dist, z: z2, depth: z2 };
}

// Draw a single face of the cube on canvas
function drawFace(ctx, corners2d, face, alpha, cx, cy) {
  const pts = corners2d;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx + pts[0].sx, cy + pts[0].sy);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i].sx, cy + pts[i].sy);
  ctx.closePath();
  ctx.clip();

  // Face background
  ctx.fillStyle = face.bg;
  ctx.fill();

  // Subtle gradient overlay for depth
  const grad = ctx.createLinearGradient(
    cx + pts[0].sx, cy + pts[0].sy,
    cx + pts[2].sx, cy + pts[2].sy
  );
  grad.addColorStop(0, `rgba(255,255,255,0.08)`);
  grad.addColorStop(0.5, `rgba(0,0,0,0.0)`);
  grad.addColorStop(1, `rgba(0,0,0,0.35)`);
  ctx.fillStyle = grad;
  ctx.fill();

  // Border
  ctx.beginPath();
  ctx.moveTo(cx + pts[0].sx, cy + pts[0].sy);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(cx + pts[i].sx, cy + pts[i].sy);
  ctx.closePath();
  ctx.strokeStyle = face.color;
  ctx.lineWidth = 2;
  ctx.shadowColor = face.color;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Compute face centroid for text placement
  const cxf = pts.reduce((s, p) => s + cx + p.sx, 0) / pts.length;
  const cyf = pts.reduce((s, p) => s + cy + p.sy, 0) / pts.length;

  // Determine face "screen size" for font scaling
  const dx = Math.abs(pts[1].sx - pts[0].sx);
  const dy = Math.abs(pts[2].sy - pts[1].sy);
  const faceSize = Math.min(dx, dy, 90);
  const scale = Math.max(0.5, faceSize / 90);

  // Draw icon
  ctx.font = `${Math.round(22 * scale)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = face.color;
  ctx.shadowColor = face.color;
  ctx.shadowBlur = 10;
  ctx.fillText(face.icon, cxf, cyf - 28 * scale);
  ctx.shadowBlur = 0;

  // Label
  ctx.font = `bold ${Math.round(10 * scale)}px monospace`;
  ctx.fillStyle = face.color;
  ctx.shadowColor = face.color;
  ctx.shadowBlur = 6;
  ctx.fillText(face.label, cxf, cyf - 10 * scale);
  ctx.shadowBlur = 0;

  // Feature lines
  ctx.font = `${Math.round(7.5 * scale)}px monospace`;
  ctx.fillStyle = "rgba(200,220,240,0.85)";
  face.lines.forEach((line, i) => {
    ctx.fillText("· " + line, cxf, cyf + 6 * scale + i * 11 * scale);
  });

  ctx.restore();
}

export default function FeatureCube3D({ size = 110 }) {
  const canvasRef = useRef(null);
  const rotXRef = useRef(-0.35);
  const rotYRef = useRef(0.5);
  const velXRef = useRef(0);
  const velYRef = useRef(0.008);
  const dragRef = useRef(null);
  const frameRef = useRef(null);
  const [hoveredFace, setHoveredFace] = useState(null);

  const S = size; // half-size of cube

  // Cube face definitions: [face index, corners in 3D, normal direction]
  const FACE_DEFS = [
    { fi: 0, pts: [[-S,-S, S],[S,-S, S],[S, S, S],[-S, S, S]], norm: [0,0,1]  }, // front
    { fi: 1, pts: [[ S,-S,-S],[-S,-S,-S],[-S, S,-S],[ S, S,-S]], norm: [0,0,-1] }, // back
    { fi: 2, pts: [[-S,-S,-S],[-S,-S, S],[-S, S, S],[-S, S,-S]], norm: [-1,0,0] }, // left
    { fi: 3, pts: [[ S,-S, S],[ S,-S,-S],[ S, S,-S],[ S, S, S]], norm: [1,0,0]  }, // right
    { fi: 4, pts: [[-S,-S,-S],[S,-S,-S],[S,-S, S],[-S,-S, S]], norm: [0,-1,0] }, // top
    { fi: 5, pts: [[-S, S, S],[S, S, S],[S, S,-S],[-S, S,-S]], norm: [0,1,0]  }, // bottom
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = canvas.width, H = canvas.height;
    const ctx = canvas.getContext("2d");
    const cx = W / 2, cy = H / 2;

    const render = () => {
      // Auto-rotate with damping
      if (!dragRef.current) {
        velYRef.current += (0.008 - velYRef.current) * 0.02;
        velXRef.current += (0 - velXRef.current) * 0.02;
      }
      rotXRef.current += velXRef.current;
      rotYRef.current += velYRef.current;
      velXRef.current *= 0.92;
      velYRef.current *= dragRef.current ? 0.85 : 0.995;

      ctx.clearRect(0, 0, W, H);

      // Dark background with subtle grid
      ctx.fillStyle = "#030d1a";
      ctx.fillRect(0, 0, W, H);

      // Grid floor
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < W; gx += 30) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      for (let gy = 0; gy < H; gy += 30) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
      ctx.restore();

      const rx = rotXRef.current, ry = rotYRef.current;

      // Project all face vertices and compute depth + visibility
      const projected = FACE_DEFS.map(fd => {
        const corners2d = fd.pts.map(([x, y, z]) => project(x, y, z, rx, ry, S));
        // Backface culling: check normal
        const [nx, ny, nz] = fd.norm;
        const cosR = Math.cos(ry), sinR = Math.sin(ry);
        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const nx1 = nx * cosR + nz * sinR;
        const nz1 = -nx * sinR + nz * cosR;
        const ny2 = ny * cosX - nz1 * sinX;
        const nz2 = ny * sinX + nz1 * cosX;
        const visible = nz2 < 0;
        const avgDepth = corners2d.reduce((s, p) => s + p.depth, 0) / corners2d.length;
        return { ...fd, corners2d, visible, avgDepth };
      });

      // Sort back-to-front
      const sorted = projected.filter(f => f.visible).sort((a, b) => b.avgDepth - a.avgDepth);

      sorted.forEach(fd => {
        const face = FACES[fd.fi];
        const isHovered = hoveredFace === fd.fi;
        drawFace(ctx, fd.corners2d, face, isHovered ? 1 : 0.9, cx, cy);
      });

      // Cube corner dots (neon rivet look)
      const corners3d = [
        [-S,-S,-S],[S,-S,-S],[-S,S,-S],[S,S,-S],
        [-S,-S, S],[S,-S, S],[-S,S, S],[S,S, S],
      ];
      corners3d.forEach(([x,y,z]) => {
        const p = project(x,y,z,rx,ry,S);
        ctx.beginPath();
        ctx.arc(cx + p.sx, cy + p.sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,220,255,0.7)";
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [S, hoveredFace]);

  // Mouse / touch drag
  const onPointerDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { x: clientX - rect.left, y: clientY - rect.top };
    velXRef.current = 0; velYRef.current = 0;
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mx = clientX - rect.left, my = clientY - rect.top;
    const dx = mx - dragRef.current.x, dy = my - dragRef.current.y;
    velYRef.current = dx * 0.012;
    velXRef.current = dy * 0.012;
    dragRef.current = { x: mx, y: my };
  };
  const onPointerUp = () => { dragRef.current = null; };

  const W = 360, H = 360;

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: "block", cursor: "grab", borderRadius: 16 }}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      />
      <p style={{ textAlign: "center", color: "rgba(100,160,200,0.6)", fontSize: 11, marginTop: 6, fontFamily: "monospace" }}>
        drag to rotate
      </p>
    </div>
  );
}