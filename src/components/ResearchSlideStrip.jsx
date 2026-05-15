import { useEffect, useRef } from "react";

const SLIDES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/215d76f18_001.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d90b85a99_002.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c8264cd74_003.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5e55045ec_004.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f9693b257_005.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/685a0ebf5_006.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0f7729813_007.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/369f41c5e_008.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3f49dc436_009.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8fb3e496a_010.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/576f2d6cb_011.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aa21d0bf7_012.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/30a678201_013.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/500221ecb_014.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c90639884_015.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9d0d95325_016.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/621a15263_017.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/108ec233a_018.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/476e0feb4_019.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a964f08c5_020.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/62d38eb04_021.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1e7f4f655_022.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0a0293183_023.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b1bb6b2f9_024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e867e46cb_025.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/63093f209_026.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dfb53b207_027.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6911501a1_028.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3931b7b36_029.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bb87388fb_030.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/665ce455e_031.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/81b382fb6_032.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a2ed19dcb_033.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5a6c2db87_034.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/844d03b89_035.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/04469d350_036.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/389a97e61_037.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3bda05877_038.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1123b238c_039.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e546eae85_040.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5bf18b565_041.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8a4b493a7_042.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ec1d5e595_043.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/faba316ea_044.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/82560878e_045.jpg",
];

// Duplicate for seamless infinite loop
const ALL_SLIDES = [...SLIDES, ...SLIDES];

export default function ResearchSlideStrip() {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const posRef = useRef(0);

  useEffect(() => {
    const SPEED = 0.4; // px per frame — slow scroll

    const step = () => {
      posRef.current += SPEED;
      const track = trackRef.current;
      if (!track) return;

      // Each image card: 220px height + 8px gap = 228px
      const singleSetHeight = SLIDES.length * 168;
      if (posRef.current >= singleSetHeight) {
        posRef.current -= singleSetHeight;
      }

      track.style.transform = `translateY(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="hidden lg:block flex-shrink-0 overflow-hidden relative"
      style={{ width: 160, height: "100vh", position: "sticky", top: 0 }}
    >
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #020617, transparent)" }} />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, #020617, transparent)" }} />

      <div ref={trackRef} style={{ willChange: "transform" }}>
        {ALL_SLIDES.map((src, i) => (
          <div
            key={i}
            style={{ marginBottom: 8, width: 160, height: 160, flexShrink: 0 }}
            className="overflow-hidden rounded-lg border border-slate-800/60"
          >
            <img
              src={src}
              alt={`research-slide-${(i % SLIDES.length) + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}