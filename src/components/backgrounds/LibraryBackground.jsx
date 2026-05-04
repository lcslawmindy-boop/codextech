import { useState, useEffect, useRef } from "react";

const MATRIX_CHARS = "ｦｧｨｩｪｫｬｭｮｯﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜﾝ0123456789";

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

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = new Array(cols).fill(1);

    const animateMatrix = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff99";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

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
      {/* Current image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${LIBRARY_IMAGES[currentIdx]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 1.5s ease-in-out",
          opacity: fading ? 0 : 1,
        }}
      />

      {/* Next image (fades in) */}
      {nextIdx !== null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${LIBRARY_IMAGES[nextIdx]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1.5s ease-in-out",
            opacity: fading ? 1 : 0,
          }}
        />
      )}

      {/* Matrix rain canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      />

      {/* Electrical surge pulses on light areas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,220,255,0.4) 0%, transparent 70%)",
          animation: "electricalSurge 2.5s ease-in-out infinite",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* Cyan pulse glow overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,220,255,0.25) 0%, transparent 60%)",
          animation: "cyanPulse 3.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Cascading green Matrix code rain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(90deg, transparent 0px, rgba(0,255,150,0.15) 2px, transparent 4px)",
          animation: "codeFlow 4s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Electric field wave layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,220,255,0.2) 0%, rgba(0,255,150,0.15) 50%, rgba(0,220,255,0.2) 100%)",
          animation: "waveShift 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Left corner cyan glow — breathing */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "5%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(0,220,255,0.6) 0%, rgba(0,220,255,0.3) 30%, transparent 70%)",
          filter: "blur(60px)",
          animation: "breatheGlow 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Right corner green glow — breathing offset */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "8%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(0,255,150,0.5) 0%, rgba(0,255,150,0.25) 35%, transparent 70%)",
          filter: "blur(70px)",
          animation: "breatheGlow 4s ease-in-out infinite",
          animationDelay: "2s",
          pointerEvents: "none",
        }}
      />

      {/* Horizontal scan bands */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, rgba(0,220,255,0.12) 0px, rgba(0,220,255,0.12) 3px, transparent 3px, transparent 6px)",
          animation: "scanlines 8s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Animated scanline effect for digital intensity */}
      <div
       style={{
         position: "absolute",
         inset: 0,
         background: "repeating-linear-gradient(0deg, rgba(0,220,255,0.02) 0px, rgba(0,220,255,0.02) 1px, transparent 1px, transparent 2px)",
         animation: "scanlines 8s linear infinite",
         pointerEvents: "none",
         opacity: 0.4,
       }}
      />

      {/* Dark overlay to keep text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.82) 100%)",
        }}
      />
    </div>
  );
}