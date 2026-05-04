import { useState, useEffect } from 'react';

export default function TopLogoHeader() {
  const [logoUrl] = useState('https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a90918e3c_ZARPlogo.png');

  useEffect(() => {
    const img = new Image();
    img.src = logoUrl;
  }, [logoUrl]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9992] flex items-center justify-center pt-3 pb-3"
      style={{
        background: 'linear-gradient(180deg, rgba(6,9,18,0.97), rgba(6,9,18,0.85))',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,200,255,0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        <img
          src={logoUrl}
          alt="Zenith Apex Technology"
          className="rounded-lg object-contain"
          style={{
            width: '48px',
            height: '48px',
            filter: 'drop-shadow(0 0 10px rgba(0,200,255,0.6))',
          }}
        />
        <div className="flex flex-col">
          <div
            className="font-black tracking-widest text-cyan-300"
            style={{ fontSize: '16px', textShadow: '0 0 10px rgba(0,200,255,0.6)', letterSpacing: '3px' }}
          >
            ZENITH APEX
          </div>
          <div
            className="font-bold text-cyan-400/70 tracking-widest"
            style={{ fontSize: '9px', letterSpacing: '2px' }}
          >
            ELECTROMAGNETIC RESEARCH PLATFORM
          </div>
        </div>
      </div>
    </div>
  );
}