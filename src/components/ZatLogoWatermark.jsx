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
      <div className="font-black text-cyan-400 tracking-widest text-center opacity-75 whitespace-nowrap" style={{ fontSize: '8px', textShadow: '0 0 8px rgba(0, 220, 255, 0.6)', lineHeight: '1.2' }}>
        TEACH · EXPLORE · CONSTRUCT · HARNESS
      </div>
      <div className="font-bold text-cyan-300 tracking-widest text-center opacity-80 whitespace-nowrap" style={{ fontSize: '10px', textShadow: '0 0 10px rgba(0, 220, 255, 0.7)', lineHeight: '1.2', letterSpacing: '1px' }}>
        Transmit · Electromagnetics · Coherence · Harness
      </div>
      <div className="font-semibold text-cyan-200 text-center opacity-85 whitespace-normal max-w-[200px]" style={{ fontSize: '9px', textShadow: '0 0 8px rgba(0, 220, 255, 0.6)', lineHeight: '1.4', marginTop: '6px', letterSpacing: '0.5px' }}>
        Share advanced EM knowledge, unite inventors through coherent understanding, and help them build/patent real solutions.
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