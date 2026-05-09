export default function CodextechWatermark() {
  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-none">
      <style>{`
        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 0 0 10px #ffffff, 0 0 20px #0ea5e9, 0 0 30px #0ea5e9;
            opacity: 0.9;
          }
          50% {
            text-shadow: 0 0 20px #ffffff, 0 0 30px #0ea5e9, 0 0 40px #06b6d4;
            opacity: 1;
          }
        }
        .neon-watermark {
          font-family: 'Monaco', 'Courier New', monospace;
          font-weight: 900;
          font-size: 12px;
          letter-spacing: 2px;
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