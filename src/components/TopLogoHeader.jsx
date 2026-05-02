import { useState, useEffect } from 'react';

export default function TopLogoHeader() {
  const [logoUrl] = useState('https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png');

  useEffect(() => {
    const img = new Image();
    img.src = logoUrl;
  }, [logoUrl]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9992] flex items-center justify-center pt-4 pb-3" style={{ background: 'linear-gradient(180deg, rgba(10,10,26,0.95), rgba(10,10,26,0.8))', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center gap-4">
        <img
          src={logoUrl}
          alt="T.E.C.H"
          className="rounded-lg"
          style={{
            width: '60px',
            height: '60px',
            filter: 'drop-shadow(0 0 12px rgba(0, 220, 255, 0.8)) drop-shadow(0 0 24px rgba(0, 180, 255, 0.5))',
          }}
        />
        <div className="flex flex-col gap-1">
          <div className="font-black text-cyan-300 tracking-widest" style={{ fontSize: '20px', textShadow: '0 0 12px rgba(0, 220, 255, 0.8)', letterSpacing: '4px' }}>
            T.E.C.H
          </div>
          <div className="font-bold text-cyan-300 tracking-widest whitespace-nowrap" style={{ fontSize: '10px', textShadow: '0 0 10px rgba(0, 220, 255, 0.7)', lineHeight: '1.2', letterSpacing: '0.5px' }}>
            Tethering · Electromagnetic · Consciousness · Hub
          </div>
          <div className="font-semibold text-cyan-200 whitespace-normal max-w-[300px]" style={{ fontSize: '9px', textShadow: '0 0 8px rgba(0, 220, 255, 0.6)', lineHeight: '1.3', letterSpacing: '0.3px' }}>
            Anchor EM knowledge. Unite inventors. Build the future.
          </div>
        </div>
      </div>
    </div>
  );
}