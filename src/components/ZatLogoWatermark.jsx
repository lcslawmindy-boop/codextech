import { useEffect, useState } from 'react';

export default function ZatLogoWatermark() {
  const [logoUrl] = useState('https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png');

  useEffect(() => {
    // Preload logo
    const img = new Image();
    img.src = logoUrl;
  }, [logoUrl]);

  return (
    <div className="fixed bottom-6 right-6 z-[9990] pointer-events-none flex flex-col items-center gap-2">
      <img
        src={logoUrl}
        alt="Zenith Apex Tech"
        className="rounded-lg opacity-75 hover:opacity-100 transition-opacity"
        style={{
          width: '240px',
          height: '240px',
          filter: 'drop-shadow(0 0 12px rgba(0, 220, 255, 0.8)) drop-shadow(0 0 24px rgba(0, 180, 255, 0.5))',
          animation: 'zatPulse 3s ease-in-out infinite',
        }}
      />
      <div className="font-black text-cyan-300 tracking-widest text-center opacity-80 whitespace-nowrap" style={{ fontSize: '22px', textShadow: '0 0 12px rgba(0, 220, 255, 0.8)', lineHeight: '1.2', letterSpacing: '4px' }}>
        T.E.C.H
      </div>
      <div className="font-bold text-cyan-300 tracking-widest text-center opacity-80 whitespace-normal max-w-[220px]" style={{ fontSize: '11px', textShadow: '0 0 10px rgba(0, 220, 255, 0.7)', lineHeight: '1.3', letterSpacing: '0.5px', marginTop: '2px' }}>
        Tethering · Electromagnetic · Consciousness · Hub
      </div>
      <div className="font-semibold text-cyan-200 text-center opacity-90 whitespace-normal max-w-[240px]" style={{ fontSize: '10px', textShadow: '0 0 10px rgba(0, 220, 255, 0.7)', lineHeight: '1.5', marginTop: '8px', letterSpacing: '0.3px' }}>
        Anchor advanced EM knowledge to conscious practice. Unite inventors. Expose suppressed technologies. Build the future.
      </div>
      <style>{`
        @keyframes zatPulse {
          0%, 100% { opacity: 0.75; filter: drop-shadow(0 0 12px rgba(0, 220, 255, 0.8)) drop-shadow(0 0 24px rgba(0, 180, 255, 0.5)); }
          50% { opacity: 0.95; filter: drop-shadow(0 0 16px rgba(0, 220, 255, 1)) drop-shadow(0 0 32px rgba(0, 180, 255, 0.7)); }
        }
      `}</style>
    </div>
  );
}