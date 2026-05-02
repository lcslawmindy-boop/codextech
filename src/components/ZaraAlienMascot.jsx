import { useState } from 'react';
import { X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ZaraAlienMascot() {
  const [isOpen, setIsOpen] = useState(true);
  const [showPrompts, setShowPrompts] = useState(true);

  const suggestedPrompts = [
    { text: '📚 Show me the research', href: '/vault' },
    { text: '🔨 I want to build something', href: '/invention-plans' },
    { text: '💰 What\'s the pricing?', href: '#pricing' },
    { text: '🚀 Patent strategy guide', href: '/patent-intelligence' },
    { text: '💡 Quick demo tour', href: '/research-brief' },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40"
        title="Chat with Zara"
        style={{ animation: 'eyeballBlink 3s ease-in-out infinite' }}
      >
        <style>{`
          @keyframes eyeballBlink {
            0%, 10%, 90%, 100% { transform: scaleY(1); }
            5% { transform: scaleY(0.1); }
          }
          @keyframes pupilGlow {
            0%, 100% { filter: drop-shadow(0 0 12px rgba(173, 216, 230, 0.6)); }
            50% { filter: drop-shadow(0 0 24px rgba(173, 216, 230, 0.9)); }
          }
          @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}</style>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-80 h-80" style={{ animation: 'pupilGlow 4s ease-in-out infinite' }}>
            {/* 3D Realistic Eyeball */}
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 32px rgba(173, 216, 230, 0.9))' }}>
              <defs>
                {/* Advanced 3D sphere gradient */}
                <radialGradient id="eyeSphere" cx="30%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                  <stop offset="40%" style={{ stopColor: '#f5f9ff', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#e0f0ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#c9e3ff', stopOpacity: 1 }} />
                </radialGradient>

                {/* Enhanced iris gradient */}
                <radialGradient id="irisGradient" cx="45%" cy="40%">
                  <stop offset="0%" style={{ stopColor: '#5dade2', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#2e8bb3', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1a5276', stopOpacity: 1 }} />
                </radialGradient>

                {/* Iris ring texture */}
                <radialGradient id="irisRing" cx="50%" cy="50%">
                  <stop offset="85%" style={{ stopColor: 'rgba(100, 180, 220, 0.3)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(46, 139, 179, 0.6)', stopOpacity: 1 }} />
                </radialGradient>

                {/* Premium highlight */}
                <radialGradient id="highlight" cx="35%" cy="35%">
                  <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                </radialGradient>

                {/* Secondary shine */}
                <radialGradient id="shine2" cx="40%" cy="40%">
                  <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,0.8)', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0)', stopOpacity: 0 }} />
                </radialGradient>
              </defs>

              {/* Main white sclera sphere */}
              <circle cx="50" cy="50" r="32" fill="url(#eyeSphere)" />

              {/* Depth shadow edge */}
              <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />

              {/* Inner sphere shading */}
              <circle cx="50" cy="50" r="32" fill="rgba(0,0,0,0.05)" opacity="0.3" />

              {/* Iris - large and detailed */}
              <circle cx="50" cy="50" r="20" fill="url(#irisGradient)" />

              {/* Iris ring detail */}
              <circle cx="50" cy="50" r="20" fill="url(#irisRing)" opacity="0.6" />

              {/* Iris radial texture */}
              <g stroke="rgba(46, 139, 179, 0.2)" strokeWidth="0.5" opacity="0.4">
                <line x1="50" y1="30" x2="50" y2="70" />
                <line x1="50" y1="30" x2="50" y2="70" transform="rotate(30 50 50)" />
                <line x1="50" y1="30" x2="50" y2="70" transform="rotate(60 50 50)" />
                <line x1="50" y1="30" x2="50" y2="70" transform="rotate(90 50 50)" />
                <line x1="50" y1="30" x2="50" y2="70" transform="rotate(120 50 50)" />
                <line x1="50" y1="30" x2="50" y2="70" transform="rotate(150 50 50)" />
              </g>

              {/* Deep black pupil */}
              <circle cx="50" cy="50" r="12" fill="#0a0a0a" />

              {/* Pupil inner glow */}
              <circle cx="50" cy="50" r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

              {/* Large primary highlight - ultra glossy */}
              <circle cx="38" cy="38" r="9" fill="url(#highlight)" opacity="0.98" />

              {/* Secondary bright shine */}
              <circle cx="62" cy="62" r="4" fill="url(#shine2)" opacity="0.85" />

              {/* Tertiary micro-shine */}
              <circle cx="58" cy="45" r="1.5" fill="#ffffff" opacity="0.7" />

              {/* Twinkling effect on primary highlight */}
              <circle cx="38" cy="38" r="8" fill="#ffffff" opacity="0" style={{ animation: 'twinkle 2.5s ease-in-out infinite' }} />

              {/* Upper eyelid */}
              <path d="M 18 50 Q 50 25 82 50 L 82 45 Q 50 22 18 45 Z" fill="rgba(20, 30, 50, 0.8)" opacity="0.9" />

              {/* Lower eyelid */}
              <path d="M 18 50 Q 50 75 82 50 L 82 55 Q 50 78 18 55 Z" fill="rgba(20, 30, 50, 0.7)" opacity="0.85" />
            </svg>
          </div>
            <div className="text-center">
            <p className="text-sm font-black text-blue-400 leading-tight">ASK ZARA</p>
            <p className="text-xs text-blue-300 font-bold">YOUR ZENITH APEX RESEARCH ASSISTANT</p>
            </div>
            </div>
            </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs">
      {/* Main Chat Box */}
      <div
        className="bg-gray-900 border-2 rounded-2xl p-5 shadow-2xl"
        style={{
          borderColor: '#4a90e2',
          boxShadow: '0 0 24px rgba(74, 144, 226, 0.4), 0 0 12px rgba(74, 144, 226, 0.2)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 border border-blue-500 rounded-full flex items-center justify-center hover:bg-gray-800 transition"
          >
          <X size={16} className="text-blue-400" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            {/* 3D Realistic Eyeball */}
             <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(173, 216, 230, 0.6))' }}>
               <defs>
                 <radialGradient id="eyeSphere2" cx="35%" cy="35%">
                   <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                   <stop offset="70%" style={{ stopColor: '#f0f8ff', stopOpacity: 1 }} />
                   <stop offset="100%" style={{ stopColor: '#e6f2ff', stopOpacity: 1 }} />
                 </radialGradient>
                 <radialGradient id="irisGradient2" cx="45%" cy="45%">
                   <stop offset="0%" style={{ stopColor: '#87ceeb', stopOpacity: 1 }} />
                   <stop offset="60%" style={{ stopColor: '#5dade2', stopOpacity: 1 }} />
                   <stop offset="100%" style={{ stopColor: '#2e8bb3', stopOpacity: 1 }} />
                 </radialGradient>
                 <radialGradient id="highlight2" cx="40%" cy="40%">
                   <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
                   <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                 </radialGradient>
               </defs>
               {/* White sclera */}
               <circle cx="50" cy="50" r="30" fill="url(#eyeSphere2)" />
               <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
               {/* Light blue iris */}
               <circle cx="50" cy="50" r="18" fill="url(#irisGradient2)" />
               <circle cx="50" cy="50" r="18" fill="none" stroke="rgba(45, 139, 179, 0.3)" strokeWidth="0.8" opacity="0.5" />
               {/* Pupil */}
               <circle cx="50" cy="50" r="11" fill="#000000" />
               <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
               {/* Highlights */}
               <circle cx="42" cy="42" r="5" fill="url(#highlight2)" opacity="0.85" />
               <circle cx="58" cy="58" r="2" fill="#ffffff" opacity="0.5" />
               <circle cx="55" cy="46" r="1" fill="#ffffff" opacity="0.3" />
             </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-black text-blue-400 text-sm">ZARA 👁️</h3>
             <p className="text-xs text-gray-400">Your guide</p>
          </div>
        </div>

        {/* Welcome Message */}
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Welcome, friend! I'm <span className="text-blue-400 font-bold">Zara</span> the All-Seeing Eye. I'm here to help you explore, learn, and build amazing things. What interests you? 🌟
        </p>

        {/* Suggested Prompts */}
        {showPrompts && (
          <div className="space-y-2 mb-4">
            {suggestedPrompts.map((prompt, idx) => (
              <Link
                key={idx}
                to={prompt.href}
                className="block p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-500 transition text-xs text-gray-300 hover:text-amber-400 font-semibold"
              >
                {prompt.text}
              </Link>
            ))}
          </div>
        )}

        {/* Toggle Prompts */}
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-gray-400 hover:text-amber-400 transition flex items-center justify-center gap-2 font-semibold"
        >
          <ChevronUp size={14} style={{ transform: showPrompts ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          {showPrompts ? 'Hide suggestions' : 'Show suggestions'}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Pro tip: Click any suggestion or scroll down to explore features
        </p>
      </div>
    </div>
  );
}