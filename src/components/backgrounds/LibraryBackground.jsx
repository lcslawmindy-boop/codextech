import { useState, useEffect, useRef } from "react";

const MATRIX_CHARS = "0123456789";
const MATRIX_SYMBOLS = "☆✦✧◇◈◆★✪✫✬✭✮✯✡♦♣♠♥☯☸☹☺☻♻∞§¶†‡※⁂⁎";

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

export default function LibraryBackground() {
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * LIBRARY_IMAGES.length));
  const [nextIdx, setNextIdx] = useState(null);
  const [fading, setFading] = useState(false);
  const canvasRef = useRef(null);

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

    let time = 0;

    const animateMatrix = () => {
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

      // Draw Metatron Cube (swirling from center)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 80 + Math.sin(time * 0.02) * 40;
      const rotation = time * 0.003;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);
      
      // Golden ratio proportions for Metatron
      const phi = 1.618;
      const baseSize = scale;
      
      // Draw outer hexagon
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(time * 0.015) * 0.15})`;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.4 + Math.sin(time * 0.015) * 0.2;
      
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
      
      // Draw inner circles and connecting lines
      for (let r = 1; r < 4; r++) {
        ctx.beginPath();
        ctx.arc(0, 0, (baseSize / phi) * r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.25 + Math.sin(time * 0.02 + r) * 0.12})`;
        ctx.stroke();
      }
      
      // Draw radiating lines
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * baseSize * 1.2, Math.sin(angle) * baseSize * 1.2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.2 + Math.sin(time * 0.025 + i) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
      ctx.globalAlpha = 1;

      time++;
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
          opacity: 0.45,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />





      {/* Dark overlay to keep text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.94) 50%, rgba(0,0,0,0.97) 100%)",
        }}
      />
    </div>
  );
}