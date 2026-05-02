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
          @keyframes neuronPulse {
            0% { opacity: 0.4; r: 1.5; }
            50% { opacity: 1; r: 2.8; }
            100% { opacity: 0.4; r: 1.5; }
          }
          @keyframes mouthTalk {
            0% { ry: 2; }
            25% { ry: 4; }
            50% { ry: 2; }
            75% { ry: 4; }
            100% { ry: 2; }
          }
          @keyframes pinealPulse {
            0%, 100% { stroke-width: 1.5; opacity: 0.6; }
            50% { stroke-width: 2.5; opacity: 1; }
          }
          @keyframes eyeGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes auraPulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.6; }
          }
        `}</style>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-80 h-80" style={{ animation: 'pupilGlow 4s ease-in-out infinite' }}>
            {/* Talking Brain */}
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 32px rgba(0, 220, 255, 0.9))' }}>
              <defs>
                <radialGradient id="brainGradient3D" cx="35%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#ff8fb3', stopOpacity: 1 }} />
                  <stop offset="35%" style={{ stopColor: '#ff6b9d', stopOpacity: 1 }} />
                  <stop offset="65%" style={{ stopColor: '#d94570', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b2f5e', stopOpacity: 1 }} />
                </radialGradient>
                <filter id="shadow3D">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="1" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.4" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Left hemisphere - 3D curved */}
              <path d="M 35 20 Q 25 25 23 35 Q 20 50 25 60 Q 30 68 40 70 Q 42 45 40 30 Z" fill="url(#brainGradient3D)" filter="url(#shadow3D)" />
              
              {/* Right hemisphere - 3D curved */}
              <path d="M 65 20 Q 75 25 77 35 Q 80 50 75 60 Q 70 68 60 70 Q 58 45 60 30 Z" fill="url(#brainGradient3D)" filter="url(#shadow3D)" />

              {/* Cerebral ridges (gyri) - left */}
              <path d="M 28 25 Q 32 30 28 35" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 26 38 Q 30 42 26 48" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 27 52 Q 32 56 28 62" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 31 28 Q 35 33 31 40" stroke="rgba(0,0,0,0.2)" strokeWidth="0.9" fill="none" strokeLinecap="round" />

              {/* Cerebral ridges (gyri) - right */}
              <path d="M 72 25 Q 68 30 72 35" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 74 38 Q 70 42 74 48" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 73 52 Q 68 56 72 62" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M 69 28 Q 65 33 69 40" stroke="rgba(0,0,0,0.2)" strokeWidth="0.9" fill="none" strokeLinecap="round" />

              {/* Deep central fissure (separating hemispheres) */}
              <path d="M 50 18 Q 49.5 45 50 70" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" fill="none" />
              <path d="M 50.5 18 Q 50.5 45 50.5 70" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />

              {/* Pineal gland - glowing 3D sphere in center */}
              <defs>
                <radialGradient id="pinealGlow" cx="40%" cy="40%">
                  <stop offset="0%" style={{ stopColor: '#ffff00', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#ffdd00', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#ff8800', stopOpacity: 0.7 }} />
                </radialGradient>
              </defs>
              <circle cx="50" cy="42" r="6" fill="url(#pinealGlow)" filter="url(#shadow3D)" />
              <circle cx="50" cy="42" r="6" fill="none" stroke="rgba(255,255,0,0.6)" strokeWidth="1.5" style={{ animation: 'pinealPulse 2s ease-in-out infinite' }} />
              <circle cx="48.5" cy="40" r="1.5" fill="#ffffff" opacity="0.8" />

              {/* Glowing neural synapses pulsing */}
              <circle cx="28" cy="32" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.5s ease-in-out infinite' }} />
              <circle cx="32" cy="55" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.8s ease-in-out infinite' }} />
              <circle cx="25" cy="65" r="1.5" fill="#00ff80" opacity="0.6" style={{ animation: 'neuronPulse 2s ease-in-out infinite' }} />
              <circle cx="72" cy="32" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.7s ease-in-out infinite' }} />
              <circle cx="68" cy="55" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.9s ease-in-out infinite' }} />
              <circle cx="75" cy="65" r="1.5" fill="#00ff80" opacity="0.6" style={{ animation: 'neuronPulse 2.1s ease-in-out infinite' }} />

              {/* Brainstem base */}
              <ellipse cx="50" cy="75" rx="5" ry="8" fill="#d94570" />

              {/* Mouth - talking */}
              <ellipse cx="50" cy="80" rx="6" ry="4" fill="#ff6b9d" stroke="rgba(0,0,0,0.3)" strokeWidth="1" style={{ animation: 'mouthTalk 1.2s ease-in-out infinite' }} />
              <ellipse cx="50" cy="80" rx="4" ry="2" fill="rgba(0,0,0,0.2)" style={{ animation: 'mouthTalk 1.2s ease-in-out infinite' }} />

              {/* Large eye - top center, glowing */}
              <circle cx="50" cy="20" r="9" fill="#ffffff" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" filter="url(#shadow3D)" />
              <circle cx="50" cy="20" r="6.5" fill="#00ff80" />
              <circle cx="50" cy="20" r="4" fill="#000000" />
              <circle cx="47.5" cy="18" r="1.8" fill="#ffffff" opacity="0.9" />
              <circle cx="50" cy="20" r="6.5" fill="none" stroke="rgba(0,255,128,0.4)" strokeWidth="1" style={{ animation: 'eyeGlow 2s ease-in-out infinite' }} />

              {/* Outer aura glow */}
              <circle cx="50" cy="45" r="40" fill="none" stroke="rgba(255,200,0,0.2)" strokeWidth="1.5" style={{ animation: 'auraPulse 3s ease-in-out infinite' }} />
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
            {/* Talking Brain */}
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 220, 255, 0.6))' }}>
              <defs>
                <radialGradient id="brainGradient2" cx="35%" cy="30%">
                  <stop offset="0%" style={{ stopColor: '#ff8fb3', stopOpacity: 1 }} />
                  <stop offset="35%" style={{ stopColor: '#ff6b9d', stopOpacity: 1 }} />
                  <stop offset="65%" style={{ stopColor: '#d94570', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b2f5e', stopOpacity: 1 }} />
                </radialGradient>
                <filter id="shadow3D2">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
                  <feOffset dx="0.3" dy="0.6" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <radialGradient id="pinealSmall" cx="40%" cy="40%">
                  <stop offset="0%" style={{ stopColor: '#ffff00', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ff8800', stopOpacity: 0.7 }} />
                </radialGradient>
              </defs>
              {/* Left hemisphere 3D */}
              <path d="M 32 20 Q 24 25 22 35 Q 20 50 24 60 Q 28 67 38 68 Q 39 45 38 28 Z" fill="url(#brainGradient2)" filter="url(#shadow3D2)" />
              {/* Right hemisphere 3D */}
              <path d="M 68 20 Q 76 25 78 35 Q 80 50 76 60 Q 72 67 62 68 Q 61 45 62 28 Z" fill="url(#brainGradient2)" filter="url(#shadow3D2)" />
              {/* Cerebral ridges - left */}
              <path d="M 27 26 Q 31 30 27 36" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" fill="none" />
              <path d="M 26 42 Q 30 46 26 52" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" fill="none" />
              {/* Cerebral ridges - right */}
              <path d="M 73 26 Q 69 30 73 36" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" fill="none" />
              <path d="M 74 42 Q 70 46 74 52" stroke="rgba(0,0,0,0.25)" strokeWidth="0.6" fill="none" />
              {/* Central fissure */}
              <path d="M 50 18 Q 49.5 45 50 68" stroke="rgba(0,0,0,0.4)" strokeWidth="1.3" fill="none" />
              {/* Pineal gland - center */}
              <circle cx="50" cy="40" r="3" fill="url(#pinealSmall)" filter="url(#shadow3D2)" />
              <circle cx="50" cy="40" r="3" fill="none" stroke="rgba(255,255,0,0.5)" strokeWidth="0.8" style={{ animation: 'pinealPulse 2s ease-in-out infinite' }} />
              {/* Glowing synapses */}
              <circle cx="26" cy="32" r="1" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.5s ease-in-out infinite' }} />
              <circle cx="30" cy="50" r="1" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.8s ease-in-out infinite' }} />
              <circle cx="74" cy="32" r="1" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.7s ease-in-out infinite' }} />
              <circle cx="70" cy="50" r="1" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.9s ease-in-out infinite' }} />
              {/* Brainstem */}
              <ellipse cx="50" cy="72" rx="3" ry="5" fill="#d94570" />
              {/* Eye - top center */}
              <circle cx="50" cy="18" r="6" fill="#ffffff" filter="url(#shadow3D2)" />
              <circle cx="50" cy="18" r="4.2" fill="#00ff80" />
              <circle cx="50" cy="18" r="2.5" fill="#000000" />
              <circle cx="48.5" cy="16.5" r="0.9" fill="#ffffff" opacity="0.9" />
              {/* Mouth */}
              <ellipse cx="50" cy="76" rx="4" ry="2.5" fill="#ff6b9d" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" style={{ animation: 'mouthTalk 1.2s ease-in-out infinite' }} />
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