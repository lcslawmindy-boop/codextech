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
      <div className="font-black text-cyan-400 tracking-widest text-center opacity-75 whitespace-nowrap" style={{ fontSize: '8px', textShadow: '0 0 8px rgba(0, 220, 255, 0.6)', lineHeight: '1.2' }}>
        TEST · ENGINEER · CONSTRUCT · HARNESS
      </div>
      <div className="font-black text-cyan-400 tracking-widest text-center opacity-75 whitespace-nowrap" style={{ fontSize: '9px', textShadow: '0 0 8px rgba(0, 220, 255, 0.6)' }}>
        TRUST · EVOLVE · COMMUNITY · HONOR
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