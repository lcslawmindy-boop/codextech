import { useEffect, useState } from 'react';

export default function ZatLogoWatermark() {
  const [logoUrl] = useState('https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png');

  useEffect(() => {
    // Preload logo
    const img = new Image();
    img.src = logoUrl;
  }, [logoUrl]);

  return (
    <div className="fixed bottom-6 right-6 z-[9990] pointer-events-none flex flex-col items-center gap-3">
      {/* Neon Sphere */}
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(0, 255, 200, 1), rgba(0, 220, 255, 0.6), rgba(0, 180, 255, 0.2))',
          boxShadow: '0 0 20px rgba(0, 255, 200, 0.9), 0 0 40px rgba(0, 220, 255, 0.6), inset -2px -2px 8px rgba(0, 0, 0, 0.4)',
          border: '2px solid rgba(0, 255, 200, 0.8)',
          animation: 'neoPulseSphere 2s ease-in-out infinite',
        }}
      />
      <img
        src={logoUrl}
        alt="Zenith Apex Tech"
        className="rounded-lg opacity-80 hover:opacity-100 transition-opacity"
        style={{
          width: '300px',
          height: '300px',
          filter: 'drop-shadow(0 0 16px rgba(0, 220, 255, 0.9)) drop-shadow(0 0 32px rgba(0, 180, 255, 0.6))',
          animation: 'zatPulse 3s ease-in-out infinite',
          marginTop: '20px',
        }}
      />
      <div className="font-black text-cyan-300 tracking-widest text-center opacity-90 whitespace-normal max-w-[300px]" style={{ fontSize: '28px', textShadow: '0 0 16px rgba(0, 220, 255, 1), 0 0 8px rgba(0, 200, 255, 0.8)', lineHeight: '1.1', letterSpacing: '3px', marginTop: '4px' }}>
        ZENITH APEX T.E.C.H
      </div>
      <div className="font-bold text-cyan-300 tracking-widest text-center opacity-85 whitespace-normal max-w-[280px]" style={{ fontSize: '13px', textShadow: '0 0 12px rgba(0, 220, 255, 0.8)', lineHeight: '1.3', letterSpacing: '0.5px' }}>
        Tethering · Electromagnetic · Consciousness · Hub
      </div>
      <div className="font-semibold text-cyan-200 text-center opacity-90 whitespace-normal max-w-[300px] italic" style={{ fontSize: '12px', textShadow: '0 0 10px rgba(0, 220, 255, 0.7)', lineHeight: '1.6', letterSpacing: '0.3px' }}>
        "Anchor advanced EM knowledge to conscious practice. Unite inventors. Expose suppressed technologies. Build the future."
      </div>
      <style>{`
        @keyframes zatPulse {
          0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 16px rgba(0, 220, 255, 0.9)) drop-shadow(0 0 32px rgba(0, 180, 255, 0.6)); }
          50% { opacity: 1; filter: drop-shadow(0 0 20px rgba(0, 220, 255, 1)) drop-shadow(0 0 40px rgba(0, 180, 255, 0.8)); }
        }
        @keyframes neoPulseSphere {
          0%, 100% { boxShadow: 0 0 20px rgba(0, 255, 200, 0.9), 0 0 40px rgba(0, 220, 255, 0.6), inset -2px -2px 8px rgba(0, 0, 0, 0.4); }
          50% { boxShadow: 0 0 30px rgba(0, 255, 200, 1), 0 0 60px rgba(0, 220, 255, 0.8), inset -2px -2px 12px rgba(0, 0, 0, 0.5); }
        }
      `}</style>
    </div>
  );
}