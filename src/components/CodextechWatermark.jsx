export default function CodextechWatermark() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 0 0 20px #ffffff, 0 0 40px #0ea5e9, 0 0 60px #0ea5e9;
            opacity: 0.8;
          }
          50% {
            text-shadow: 0 0 40px #ffffff, 0 0 60px #0ea5e9, 0 0 80px #06b6d4;
            opacity: 1;
          }
        }
        .neon-watermark {
          font-family: 'Monaco', 'Courier New', monospace;
          font-weight: 900;
          font-size: 48px;
          letter-spacing: 4px;
          color: #ffffff;
          animation: glow-pulse 3s ease-in-out infinite;
          text-transform: uppercase;
          white-space: nowrap;
        }
      `}</style>
      <div className="neon-watermark">mycodextech.com</div>
    </div>
  );
}