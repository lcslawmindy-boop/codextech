import { useState, useEffect, useRef } from "react";

const MATRIX_CHARS = "0123456789";
const MATRIX_SYMBOLS = "☆✦✧◇◈◆★✪✫✬✭✮✯✡♦♣♠♥☯☸☹☺☻♻∞§¶†‡※⁂⁎";

// Sacred geometry drawing functions
function drawOrbitingTetrahedron(ctx, centerX, centerY, radius, angle, time, color) {
  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;
  const size = 20 + Math.sin(time * 0.02) * 3;
  const rotation = time * 0.01;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 2;
  
  // Tetrahedron vertices
  const h = size;
  const base = size * 1.2;
  const vertices = [
    [0, -h], [base * 0.866, h * 0.5], [-base * 0.866, h * 0.5]
  ];
  
  // Draw edges
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(vertices[i][0], vertices[i][1]);
    ctx.lineTo(vertices[(i + 1) % 3][0], vertices[(i + 1) % 3][1]);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawOrbitingCube(ctx, centerX, centerY, radius, angle, time, color) {
  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;
  const size = 18 + Math.sin(time * 0.025) * 2;
  const rotation = time * 0.012;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 2;
  
  // Cube faces
  const s = size;
  const corners = [
    [-s, -s], [s, -s], [s, s], [-s, s]
  ];
  
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(corners[i][0], corners[i][1]);
    ctx.lineTo(corners[(i + 1) % 4][0], corners[(i + 1) % 4][1]);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawOrbitingOctahedron(ctx, centerX, centerY, radius, angle, time, color) {
  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;
  const size = 22 + Math.sin(time * 0.018) * 3;
  const rotation = time * 0.015;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.lineWidth = 2;
  
  // Octahedron (diamond)
  const vertices = [
    [0, -size], [size * 0.707, 0], [0, size], [-size * 0.707, 0]
  ];
  
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(vertices[i][0], vertices[i][1]);
    ctx.lineTo(vertices[(i + 1) % 4][0], vertices[(i + 1) % 4][1]);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawFlowerOfLife(ctx, centerX, centerY, radius, time, color) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(time * 0.005);
  
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.8;
  
  const r = radius;
  const circleRadius = r / 2;
  
  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
  ctx.stroke();
  
  // Six petals around center
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const cx = Math.cos(angle) * circleRadius;
    const cy = Math.sin(angle) * circleRadius;
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Outer ring
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.restore();
}

function drawMetatronsCube(ctx, centerX, centerY, size, time, color) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(time * 0.008);
  
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 15;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.75;
  
  const s = size;
  
  // Outer cube vertices
  const outer = [
    [-s, -s], [s, -s], [s, s], [-s, s]
  ];
  
  // Inner vertices
  const inner = outer.map(v => [v[0] * 0.5, v[1] * 0.5]);
  
  // Draw outer square
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(outer[i][0], outer[i][1]);
    ctx.lineTo(outer[(i + 1) % 4][0], outer[(i + 1) % 4][1]);
    ctx.stroke();
  }
  
  // Draw inner square
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(inner[i][0], inner[i][1]);
    ctx.lineTo(inner[(i + 1) % 4][0], inner[(i + 1) % 4][1]);
    ctx.stroke();
  }
  
  // Connect outer to inner
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(outer[i][0], outer[i][1]);
    ctx.lineTo(inner[i][0], inner[i][1]);
    ctx.stroke();
  }
  
  ctx.restore();
}

const LIBRARY_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/879bbe3f2_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2dd3c3b1a_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e6b1f5a3d_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2bac8c613_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/44d11338c_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b650fcee0_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fb3a895b6_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7aa4f18af_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b646110c5_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d5232f7cb_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/13f15ca12_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f08bd2930_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b95d4c179_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/61de25458_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f1c1aa2da_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/14cb245d4_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cdfa04aeb_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1a95c5bed_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/657318438_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7b3a9a8ec_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fb1f112c2_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a7501387c_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bfb6fb8e2_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/51fc058e5_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e98f0452e_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a6e56d2e1_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/eb7c7f679_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1c36b2717_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5a56ff89a_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/976caf105_generated_image.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f4fb93cfd_generated_image.png",
];

// Enhanced 3D library consciousness images
const CONSCIOUSNESS_IMAGES = [
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/179c02c33_GWN3q.png", depth: 0.8, scale: 1.2, angle: 0 }, // Akashics Library
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/394d5932e_1000_F_971892795_RX3cpf8xMUbbE4vJ2MnOerElgOeodidS.jpg", depth: 0.6, scale: 0.9, angle: Math.PI * 0.5 }, // Brain consciousness
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d9e99dbf9_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg", depth: 0.7, scale: 1.1, angle: Math.PI }, // Modern library
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0e1fff3d2_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947-Copy.jpg", depth: 0.5, scale: 0.95, angle: Math.PI * 1.5 }, // Blurred library
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0cf0b1d3d_6e9914fb6d6d4a305dd2fbe4c30e098d-Copy.jpg", depth: 0.9, scale: 1.3, angle: 0.5 }, // Grand ceiling
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/89ddb8038_maxresdefault.jpg", depth: 0.65, scale: 1.0, angle: 1.0 }, // Starry ceiling
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/16ea6b61f_How-to-Access-and-Read-the-Akashic-Records.jpg", depth: 0.4, scale: 0.85, angle: 2.0 }, // Hand energy
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/581300e53_a-long-row-of-bookshelves-in-a-library-free-photo.jpg", depth: 0.75, scale: 1.15, angle: 2.5 }, // Neon library
];

export default function LibraryBackground() {
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * LIBRARY_IMAGES.length));
  const [nextIdx, setNextIdx] = useState(null);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentIdx + 1) % LIBRARY_IMAGES.length;
      setNextIdx(next);
      setFading(true);
      setTimeout(() => {
        setCurrentIdx(next);
        setNextIdx(null);
        setFading(false);
      }, 1500);
    }, 12000);
    return () => clearInterval(timer);
  }, [currentIdx]);

  // Matrix and circuit board effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 14;
    const gridSize = 40;
    const rows = Math.ceil(canvas.height / gridSize);
    const cols = Math.ceil(canvas.width / gridSize);
    const horizontalLines = Math.ceil(canvas.height / 60);
    const binaryStreamCount = Math.ceil(canvas.width / 80);
    
    // Horizontal matrix streams (bidirectional)
    const streams = Array.from({ length: horizontalLines }, (_, i) => ({
      y: Math.random() * canvas.height,
      speed: Math.random() * 0.5 + 0.3,
      x: i % 2 === 0 ? 0 : canvas.width,
      direction: i % 2 === 0 ? 1 : -1, // 1 = right, -1 = left
    }));

    // Falling binary code streams
    const binaryStreams = Array.from({ length: binaryStreamCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      speed: Math.random() * 1.5 + 1,
      color: ['#00ff00', '#ffffff'][Math.floor(Math.random() * 2)],
    }));

    const animateMatrix = () => {
      timeRef.current++;
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);



      // Horizontal neon green matrix streams
      ctx.fillStyle = "#00ff00";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.font = `bold ${fontSize * 1.5}px monospace`;

      streams.forEach((stream) => {
        stream.x += stream.speed * stream.direction;
        
        // Reset when off-screen
        if (stream.direction === 1 && stream.x > canvas.width) {
          stream.x = -100;
          stream.y = Math.random() * canvas.height;
          stream.speed = Math.random() * 0.5 + 0.3;
        } else if (stream.direction === -1 && stream.x < -200) {
          stream.x = canvas.width + 100;
          stream.y = Math.random() * canvas.height;
          stream.speed = Math.random() * 0.5 + 0.3;
        }

        for (let i = 0; i < 20; i++) {
          const text = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.fillText(text, stream.x + i * fontSize * stream.direction, stream.y);
        }
      });

      // Falling binary code
      binaryStreams.forEach((stream) => {
        stream.y += stream.speed;
        if (stream.y > canvas.height) {
          stream.y = -50;
          stream.x = Math.random() * canvas.width;
          stream.speed = Math.random() * 1.5 + 1;
        }

        ctx.fillStyle = stream.color;
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.font = `bold 22px monospace`;
        for (let i = 0; i < 8; i++) {
          const binary = Math.random() > 0.5 ? '1' : '0';
          const opacity = 1 - (i * 0.08);
          ctx.globalAlpha = opacity;
          ctx.fillText(binary, stream.x, stream.y + i * 24);
        }
        ctx.globalAlpha = 1;
      });

      // Draw bright neon plasma spiral with indigo border
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 80 + Math.sin(timeRef.current * 0.02) * 40;
      const rotation = timeRef.current * 0.003;
      const surgePulse = 0.8 + Math.sin(timeRef.current * 0.03) * 0.4;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      const phi = 1.618;
      const baseSize = scale;
      
      // Bright neon plasma colors with surge
      const plasmaColors = [
        `rgba(255, 150, 0, ${(0.8 + Math.sin(timeRef.current * 0.03) * 0.2) * surgePulse})`,
        `rgba(255, 50, 150, ${(0.75 + Math.sin(timeRef.current * 0.03 + 2) * 0.25) * surgePulse})`,
        `rgba(150, 50, 255, ${(0.85 + Math.sin(timeRef.current * 0.03 + 4) * 0.15) * surgePulse})`,
      ];
      
      // Indigo border outer hexagon
      ctx.strokeStyle = `rgba(75, 0, 255, ${0.9 * surgePulse})`;
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * baseSize;
        const y = Math.sin(angle) * baseSize;
        if (i === 0) ctx.beginPath();
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      // Bright neon inner circles
      for (let r = 1; r < 4; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, (baseSize / phi) * r, 0, Math.PI * 2);
        ctx.strokeStyle = plasmaColors[r % 3];
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      
      // Bright neon surging radiating lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6 + timeRef.current * 0.01;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * baseSize * 1.2, Math.sin(angle) * baseSize * 1.2);
        ctx.strokeStyle = plasmaColors[i % 3];
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Draw large realistic clock in center with twilight zone flashing
      const clockRadius = 120;
      
      // Twilight zone flash effect (rapid pulse)
      const flashPulse = Math.abs(Math.sin(timeRef.current * 0.15)) > 0.7 ? 1 : 0.3;
      
      // Clock outer ring with glow
      ctx.strokeStyle = `rgba(75, 0, 255, ${0.9 * flashPulse})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, clockRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Clock inner ring
      ctx.strokeStyle = `rgba(150, 100, 255, ${0.6 * flashPulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, clockRadius - 8, 0, Math.PI * 2);
      ctx.stroke();
      
      // Tick marks
      ctx.strokeStyle = `rgba(200, 150, 255, ${0.7 * flashPulse})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 60; i++) {
        const angle = (i * Math.PI) / 30 - Math.PI / 2;
        const isHourMark = i % 5 === 0;
        const innerR = isHourMark ? clockRadius - 16 : clockRadius - 12;
        const outerR = clockRadius - 4;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(angle) * innerR, centerY + Math.sin(angle) * innerR);
        ctx.lineTo(centerX + Math.cos(angle) * outerR, centerY + Math.sin(angle) * outerR);
        ctx.stroke();
      }
      
      // Clock numbers (12, 3, 6, 9) - larger and brighter
      ctx.fillStyle = `rgba(255, 200, 0, ${1 * flashPulse})`;
      ctx.font = `bold 24px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("12", centerX, centerY - clockRadius + 25);
      ctx.fillText("3", centerX + clockRadius - 25, centerY);
      ctx.fillText("6", centerX, centerY + clockRadius - 25);
      ctx.fillText("9", centerX - clockRadius + 25, centerY);
      
      // Hour hand - spinning continuously
      const hourAngle = timeRef.current * 0.0001 - Math.PI / 2;
      ctx.strokeStyle = `rgba(255, 100, 0, ${0.95 * flashPulse})`;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(hourAngle) * clockRadius * 0.45, centerY + Math.sin(hourAngle) * clockRadius * 0.45);
      ctx.stroke();
      
      // Minute hand - spinning continuously (faster)
      const minuteAngle = timeRef.current * 0.002 - Math.PI / 2;
      ctx.strokeStyle = `rgba(150, 50, 255, ${0.95 * flashPulse})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(minuteAngle) * clockRadius * 0.65, centerY + Math.sin(minuteAngle) * clockRadius * 0.65);
      ctx.stroke();
      
      // Second hand - spinning continuously (fastest)
      const secondAngle = timeRef.current * 0.01 - Math.PI / 2;
      ctx.strokeStyle = `rgba(100, 255, 150, ${0.8 * flashPulse})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(secondAngle) * clockRadius * 0.75, centerY + Math.sin(secondAngle) * clockRadius * 0.75);
      ctx.stroke();
      
      // Center hub
      ctx.fillStyle = `rgba(255, 150, 0, ${1 * flashPulse})`;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw realistic suns orbiting center
      const sunDistance = 180 + Math.sin(timeRef.current * 0.008) * 40;
      const sunAngle = timeRef.current * 0.003;
      const sunX = centerX + Math.cos(sunAngle) * sunDistance;
      const sunY = centerY + Math.sin(sunAngle) * sunDistance;
      
      // Outer sun corona glow (realistic)
      const coronaGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 45);
      coronaGradient.addColorStop(0, `rgba(255, 220, 100, 0.6)`);
      coronaGradient.addColorStop(0.6, `rgba(255, 150, 50, 0.2)`);
      coronaGradient.addColorStop(1, `rgba(255, 100, 0, 0)`);
      ctx.fillStyle = coronaGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 45, 0, Math.PI * 2);
      ctx.fill();
      
      // Middle photosphere layer
      const photosphereGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 28);
      photosphereGradient.addColorStop(0, `rgba(255, 255, 150, 1)`);
      photosphereGradient.addColorStop(0.8, `rgba(255, 200, 80, 0.9)`);
      photosphereGradient.addColorStop(1, `rgba(255, 140, 20, 0.6)`);
      ctx.fillStyle = photosphereGradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
      ctx.fill();
      
      // Core bright center
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun flare rays (realistic)
      ctx.strokeStyle = `rgba(255, 220, 100, 0.4)`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const rayAngle = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(rayAngle) * 28, sunY + Math.sin(rayAngle) * 28);
        ctx.lineTo(sunX + Math.cos(rayAngle) * 50, sunY + Math.sin(rayAngle) * 50);
        ctx.stroke();
      }
      
      // Platonic solids orbiting with sacred geometry
      const geometryOrbitRadius = 220;
      const platonic1Angle = timeRef.current * 0.005;
      const platonic2Angle = timeRef.current * 0.006 + Math.PI * 0.66;
      const platonic3Angle = timeRef.current * 0.0045 + Math.PI * 1.33;
      
      // Tetrahedron (royal indigo)
      drawOrbitingTetrahedron(ctx, centerX, centerY, geometryOrbitRadius, platonic1Angle, timeRef.current, '#6C3AFF');
      
      // Cube (fluorescent blue)
      drawOrbitingCube(ctx, centerX, centerY, geometryOrbitRadius, platonic2Angle, timeRef.current, '#00AAFF');
      
      // Octahedron (light cyan)
      drawOrbitingOctahedron(ctx, centerX, centerY, geometryOrbitRadius, platonic3Angle, timeRef.current, '#00FFFF');
      
      // Flower of Life orbiting
      drawFlowerOfLife(ctx, centerX + Math.cos(timeRef.current * 0.004) * 300, centerY + Math.sin(timeRef.current * 0.004) * 300, 35, timeRef.current, '#00FFFF');
      
      // Metatron's Cube orbiting
      drawMetatronsCube(ctx, centerX + Math.cos(timeRef.current * 0.0035 + Math.PI) * 320, centerY + Math.sin(timeRef.current * 0.0035 + Math.PI) * 320, 40, timeRef.current, '#6C3AFF');
      
      ctx.globalAlpha = 1;
requestAnimationFrame(animateMatrix);
    };

    animateMatrix();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >


      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.65,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />





      {/* 3D Consciousness/Library Image Layer */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", perspective: "1200px" }}>
        {CONSCIOUSNESS_IMAGES.map((img, idx) => {
          const rotAngle = (timeRef.current * 0.0008 + img.angle) % (Math.PI * 2);
          const orbitRadius = 280 + idx * 60;
          const x = Math.cos(rotAngle) * orbitRadius;
          const y = Math.sin(rotAngle) * orbitRadius * 0.6;
          const scale = img.scale + Math.sin(timeRef.current * 0.003 + idx) * 0.15;
          const opacity = 0.15 + Math.sin(timeRef.current * 0.004 + idx * 0.8) * 0.08;
          
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotateZ(${rotAngle * 20}deg)`,
                width: `${120 + idx * 20}px`,
                height: `${120 + idx * 20}px`,
                backgroundImage: `url('${img.url}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
                opacity,
                boxShadow: `0 0 40px rgba(100,150,255,${opacity * 0.5}), inset 0 0 30px rgba(0,200,255,${opacity * 0.3})`,
                border: `2px solid rgba(100,200,255,${opacity * 0.4})`,
                backdropFilter: "blur(2px)",
                transition: "all 0.1s ease-out",
              }}
            />
          );
        })}
      </div>

      {/* Dark overlay to keep text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.93) 0%, rgba(0,0,0,0.91) 50%, rgba(0,0,0,0.94) 100%)",
        }}
      />
    </div>
  );
}