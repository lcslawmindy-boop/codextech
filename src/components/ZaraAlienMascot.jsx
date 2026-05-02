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
          @keyframes pupilGaze {
            0% { cx: 50; cy: 48; }
            25% { cx: 55; cy: 45; }
            50% { cx: 48; cy: 52; }
            75% { cx: 52; cy: 46; }
            100% { cx: 50; cy: 48; }
          }
          @keyframes eyeClose {
            0% { opacity: 1; }
            40% { opacity: 1; }
            50% { opacity: 0.3; }
            60% { opacity: 1; }
            100% { opacity: 1; }
          }
        `}</style>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-80 h-80" style={{ animation: 'pupilGlow 4s ease-in-out infinite' }}>
            {/* Owl Head */}
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 32px rgba(0, 220, 255, 0.9))' }}>
              <defs>
                <radialGradient id="owlHead" cx="40%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#2a4a6a', stopOpacity: 1 }} />
                  <stop offset="60%" style={{ stopColor: '#1a3a5a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0a2a4a', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="owlEye" cx="40%" cy="40%">
                  <stop offset="0%" style={{ stopColor: '#ffff00', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#ffdd00', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffaa00', stopOpacity: 1 }} />
                </radialGradient>
              </defs>

              {/* Head circle */}
              <circle cx="50" cy="55" r="35" fill="url(#owlHead)" />

              {/* Left ear tuft */}
              <ellipse cx="25" cy="20" rx="6" ry="15" fill="#1a3a5a" style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.5))' }} />

              {/* Right ear tuft */}
              <ellipse cx="75" cy="20" rx="6" ry="15" fill="#1a3a5a" style={{ filter: 'drop-shadow(0 -2px 4px rgba(0,0,0,0.5))' }} />

              {/* Left eye white */}
              <circle cx="35" cy="45" r="12" fill="#ffffff" />
              <circle cx="35" cy="45" r="12" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

              {/* Right eye white */}
              <circle cx="65" cy="45" r="12" fill="#ffffff" />
              <circle cx="65" cy="45" r="12" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />

              {/* Left iris */}
              <circle cx="35" cy="45" r="9" fill="url(#owlEye)" />

              {/* Right iris */}
              <circle cx="65" cy="45" r="9" fill="url(#owlEye)" />

              {/* Left pupil */}
              <circle cx="35" cy="45" r="6" fill="#000000" />

              {/* Right pupil */}
              <circle cx="65" cy="45" r="6" fill="#000000" />

              {/* Eye shine - left */}
              <circle cx="33" cy="42" r="2" fill="#ffffff" opacity="0.9" />

              {/* Eye shine - right */}
              <circle cx="63" cy="42" r="2" fill="#ffffff" opacity="0.9" />

              {/* Beak */}
              <path d="M 50 55 L 48 63 L 52 63 Z" fill="#ff8800" />

              {/* Face disc outline */}
              <circle cx="50" cy="55" r="35" fill="none" stroke="rgba(0, 220, 255, 0.3)" strokeWidth="2" />

              {/* Feather texture lines */}
              <g stroke="rgba(0, 0, 0, 0.1)" strokeWidth="0.5" opacity="0.4">
                <path d="M 35 75 Q 40 80 45 78" fill="none" />
                <path d="M 55 78 Q 60 80 65 75" fill="none" />
                <path d="M 30 70 Q 25 72 28 78" fill="none" />
                <path d="M 70 70 Q 75 72 72 78" fill="none" />
              </g>
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
            {/* Owl Head */}
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 220, 255, 0.6))' }}>
              <defs>
                <radialGradient id="owlHead2" cx="40%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#2a4a6a', stopOpacity: 1 }} />
                  <stop offset="60%" style={{ stopColor: '#1a3a5a', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#0a2a4a', stopOpacity: 1 }} />
                </radialGradient>
                <radialGradient id="owlEye2" cx="40%" cy="40%">
                  <stop offset="0%" style={{ stopColor: '#ffff00', stopOpacity: 1 }} />
                  <stop offset="70%" style={{ stopColor: '#ffdd00', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffaa00', stopOpacity: 1 }} />
                </radialGradient>
              </defs>
              {/* Head */}
              <circle cx="50" cy="55" r="35" fill="url(#owlHead2)" />
              {/* Left ear tuft */}
              <ellipse cx="25" cy="20" rx="6" ry="15" fill="#1a3a5a" />
              {/* Right ear tuft */}
              <ellipse cx="75" cy="20" rx="6" ry="15" fill="#1a3a5a" />
              {/* Left eye white */}
              <circle cx="35" cy="45" r="12" fill="#ffffff" />
              {/* Right eye white */}
              <circle cx="65" cy="45" r="12" fill="#ffffff" />
              {/* Left iris */}
              <circle cx="35" cy="45" r="9" fill="url(#owlEye2)" />
              {/* Right iris */}
              <circle cx="65" cy="45" r="9" fill="url(#owlEye2)" />
              {/* Left pupil */}
              <circle cx="35" cy="45" r="6" fill="#000000" />
              {/* Right pupil */}
              <circle cx="65" cy="45" r="6" fill="#000000" />
              {/* Eye shine - left */}
              <circle cx="33" cy="42" r="1.5" fill="#ffffff" opacity="0.9" />
              {/* Eye shine - right */}
              <circle cx="63" cy="42" r="1.5" fill="#ffffff" opacity="0.9" />
              {/* Beak */}
              <path d="M 50 55 L 48 63 L 52 63 Z" fill="#ff8800" />
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