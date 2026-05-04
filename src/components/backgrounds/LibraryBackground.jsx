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

      {/* Animated electric field lines overlay */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.15,
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <style>{`
            @keyframes pulse {
              0%, 100% { opacity: 0.06; }
              50% { opacity: 0.12; }
            }
            @keyframes flowVertical {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            @keyframes flowHorizontal {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes glowPulse {
              0%, 100% { filter: drop-shadow(0 0 4px rgba(0,220,255,0.4)); }
              50% { filter: drop-shadow(0 0 12px rgba(0,220,255,0.8)); }
            }
            .flow-line-v { animation: flowVertical 8s linear infinite; }
            .flow-line-h { animation: flowHorizontal 6s linear infinite; }
            .glow-element { animation: glowPulse 3s ease-in-out infinite; }
          `}</style>
        </defs>
        
        {/* Vertical flowing lines */}
        <line x1="15%" y1="0" x2="15%" y2="100%" stroke="rgba(0,220,255,0.6)" strokeWidth="1.5" className="flow-line-v" />
        <line x1="35%" y1="0" x2="35%" y2="100%" stroke="rgba(0,255,150,0.4)" strokeWidth="1" className="flow-line-v" style={{ animationDelay: "2s" }} />
        <line x1="65%" y1="0" x2="65%" y2="100%" stroke="rgba(0,220,255,0.5)" strokeWidth="1.2" className="flow-line-v" style={{ animationDelay: "1s" }} />
        <line x1="85%" y1="0" x2="85%" y2="100%" stroke="rgba(0,255,150,0.3)" strokeWidth="1" className="flow-line-v" style={{ animationDelay: "3s" }} />
        
        {/* Horizontal flowing lines */}
        <line x1="0" y1="20%" x2="100%" y2="20%" stroke="rgba(0,220,255,0.3)" strokeWidth="1" className="flow-line-h" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,255,150,0.25)" strokeWidth="1.2" className="flow-line-h" style={{ animationDelay: "1.5s" }} />
        <line x1="0" y1="80%" x2="100%" y2="80%" stroke="rgba(0,220,255,0.3)" strokeWidth="1" className="flow-line-h" style={{ animationDelay: "2.5s" }} />
        
        {/* Glow nodes */}
        <circle cx="20%" cy="30%" r="3" fill="none" stroke="rgba(0,220,255,0.8)" strokeWidth="2" className="glow-element" />
        <circle cx="80%" cy="40%" r="2.5" fill="none" stroke="rgba(0,255,150,0.6)" strokeWidth="1.5" className="glow-element" style={{ animationDelay: "0.5s" }} />
        <circle cx="50%" cy="70%" r="3.5" fill="none" stroke="rgba(0,220,255,0.7)" strokeWidth="2" className="glow-element" style={{ animationDelay: "1.5s" }} />
      </svg>

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
        @keyframes pulse {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.12; }
        }
        @keyframes scanShift {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
      `}</style>
    </div>
  );
}