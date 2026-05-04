import { useState, useEffect } from "react";

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

      {/* Animated neon glow pulse */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,220,255,0.08) 0%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Animated Matrix digital rain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity: 0.4,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "200%",
            background: "linear-gradient(180deg, transparent 0%, rgba(0,255,150,0.1) 50%, transparent 100%)",
            animation: "matrixRain 15s linear infinite",
          }}
        />
      </div>

      {/* Pulsing electric arc grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            rgba(0,220,255,0.08) 0px,
            rgba(0,220,255,0.04) 2px,
            rgba(0,255,150,0.06) 4px,
            transparent 6px
          )`,
          animation: "gridPulse 3s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Cyan neon corner glow spots */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "8%",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(0,220,255,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "glowFloat 6s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "12%",
          width: "250px",
          height: "250px",
          background: "radial-gradient(circle, rgba(0,255,150,0.25) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "glowFloat 8s ease-in-out infinite",
          animationDelay: "1s",
          pointerEvents: "none",
        }}
      />

      {/* Animated scanline effect for digital intensity */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, rgba(0,220,255,0.02) 0px, rgba(0,220,255,0.02) 1px, transparent 1px, transparent 2px)",
          animation: "scanShift 8s linear infinite",
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

      <style>{`
        @keyframes matrixRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes glowFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}