import { useState, useEffect } from 'react';

const BED_RENDERS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c61919fe5_IMG_8294.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/da50ced19_IMG_8295.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3184e97ef_IMG_8299.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a1705ebe0_IMG_8297.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f7383fd9a_IMG_8314.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7a6a9b7fb_IMG_8255.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cbcceb4be_IMG_8300.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/147613025_IMG_8302.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dd3bb8544_IMG_8311.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0b2a0c740_IMG_83093.jpg",
];

export default function AutismBedBackgroundCarousel() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % BED_RENDERS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* Background carousel */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {BED_RENDERS.map((img, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: currentIdx === idx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.88) 100%)',
        }}
      />

      {/* Carousel indicators */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}>
        {BED_RENDERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentIdx === idx ? '#00ff41' : 'rgba(0,255,65,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}