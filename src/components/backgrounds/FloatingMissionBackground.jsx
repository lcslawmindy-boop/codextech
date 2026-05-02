import { useEffect, useState } from 'react';

export default function FloatingMissionBackground() {
  const [logoUrl] = useState('https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png');

  useEffect(() => {
    const img = new Image();
    img.src = logoUrl;
  }, [logoUrl]);

  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
      <div className="text-center space-y-8 max-w-2xl px-6">
        {/* Logo */}
        <img
          src={logoUrl}
          alt="Zenith Apex Tech"
          className="w-48 h-48 mx-auto rounded-lg"
          style={{
            opacity: 0.9,
            filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))',
            animation: 'neoPulse 3s ease-in-out infinite',
          }}
        />

        {/* Company Name */}
        <h1
          className="font-black tracking-widest text-4xl"
          style={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(200, 240, 255, 0.4)',
            animation: 'neoPulse 3s ease-in-out infinite',
            letterSpacing: '0.2em',
          }}
        >
          ZENITH APEX T.E.C.H
        </h1>

        {/* Mission Statement */}
        <p
          className="text-lg font-semibold italic"
          style={{
            color: '#ffffff',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.6), 0 0 30px rgba(200, 240, 255, 0.3)',
            animation: 'neoPulse 3.5s ease-in-out infinite',
            lineHeight: '1.8',
          }}
        >
          "Anchor advanced EM knowledge to conscious practice. Unite inventors. Expose suppressed technologies. Build the future."
        </p>
      </div>

      <style>{`
        @keyframes neoPulse {
          0%, 100% {
            opacity: 0.85;
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.6), 0 0 30px rgba(200, 240, 255, 0.3);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 25px rgba(255, 255, 255, 0.9), 0 0 50px rgba(200, 240, 255, 0.5);
          }
        }
      `}</style>
    </div>
  );
}