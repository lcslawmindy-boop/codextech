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
            50% { opacity: 1; r: 2.5; }
            100% { opacity: 0.4; r: 1.5; }
          }
          @keyframes mouthTalk {
            0% { ry: 3; }
            25% { ry: 5; }
            50% { ry: 3; }
            75% { ry: 5; }
            100% { ry: 3; }
          }
        `}</style>
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-80 h-80" style={{ animation: 'pupilGlow 4s ease-in-out infinite' }}>
            {/* Talking Brain */}
            <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 32px rgba(0, 220, 255, 0.9))' }}>
              <defs>
                <radialGradient id="brainGradient" cx="40%" cy="35%">
                  <stop offset="0%" style={{ stopColor: '#ff6b9d', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#c44569', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b2f5e', stopOpacity: 1 }} />
                </radialGradient>
              </defs>

              {/* Left hemisphere */}
              <ellipse cx="35" cy="45" rx="22" ry="28" fill="url(#brainGradient)" />

              {/* Right hemisphere */}
              <ellipse cx="65" cy="45" rx="22" ry="28" fill="url(#brainGradient)" />

              {/* Brain ridges - left */}
              <path d="M 30 25 Q 35 30 30 35" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
              <path d="M 25 35 Q 30 40 25 48" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
              <path d="M 28 50 Q 33 55 28 62" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />

              {/* Brain ridges - right */}
              <path d="M 70 25 Q 65 30 70 35" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
              <path d="M 75 35 Q 70 40 75 48" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />
              <path d="M 72 50 Q 67 55 72 62" stroke="rgba(0,0,0,0.2)" strokeWidth="1" fill="none" />

              {/* Central fissure */}
              <path d="M 50 15 Q 50 40 50 70" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" />

              {/* Glowing synapses - left side */}
              <circle cx="25" cy="30" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.5s ease-in-out infinite' }} />
              <circle cx="32" cy="55" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.8s ease-in-out infinite' }} />
              <circle cx="28" cy="65" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 2s ease-in-out infinite' }} />

              {/* Glowing synapses - right side */}
              <circle cx="75" cy="30" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.7s ease-in-out infinite' }} />
              <circle cx="68" cy="55" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.9s ease-in-out infinite' }} />
              <circle cx="72" cy="65" r="2" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 2.1s ease-in-out infinite' }} />

              {/* Mouth - talking */}
              <ellipse cx="50" cy="75" rx="8" ry="6" fill="#ff6b9d" stroke="rgba(0,0,0,0.3)" strokeWidth="1" style={{ animation: 'mouthTalk 1.2s ease-in-out infinite' }} />

              {/* Mouth inner */}
              <ellipse cx="50" cy="75" rx="5" ry="3" fill="rgba(0,0,0,0.2)" style={{ animation: 'mouthTalk 1.2s ease-in-out infinite' }} />

              {/* Large eye - top center */}
              <circle cx="50" cy="25" r="10" fill="#ffffff" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              <circle cx="50" cy="25" r="7" fill="#00ff80" />
              <circle cx="50" cy="25" r="4" fill="#000000" />
              <circle cx="48" cy="23" r="1.5" fill="#ffffff" opacity="0.9" />

              {/* Outer glow */}
              <circle cx="50" cy="45" r="38" fill="none" stroke="rgba(0, 220, 255, 0.3)" strokeWidth="2" />
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
                <radialGradient id="brainGradient2" cx="40%" cy="35%">
                  <stop offset="0%" style={{ stopColor: '#ff6b9d', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#c44569', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8b2f5e', stopOpacity: 1 }} />
                </radialGradient>
              </defs>
              {/* Left hemisphere */}
              <ellipse cx="35" cy="45" rx="22" ry="28" fill="url(#brainGradient2)" />
              {/* Right hemisphere */}
              <ellipse cx="65" cy="45" rx="22" ry="28" fill="url(#brainGradient2)" />
              {/* Brain ridges - left */}
              <path d="M 30 25 Q 35 30 30 35" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" fill="none" />
              <path d="M 25 35 Q 30 40 25 48" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" fill="none" />
              {/* Brain ridges - right */}
              <path d="M 70 25 Q 65 30 70 35" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" fill="none" />
              <path d="M 75 35 Q 70 40 75 48" stroke="rgba(0,0,0,0.2)" strokeWidth="0.8" fill="none" />
              {/* Central fissure */}
              <path d="M 50 15 Q 50 40 50 70" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" fill="none" />
              {/* Glowing synapses - left */}
              <circle cx="25" cy="30" r="1.5" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.5s ease-in-out infinite' }} />
              <circle cx="32" cy="55" r="1.5" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.8s ease-in-out infinite' }} />
              {/* Glowing synapses - right */}
              <circle cx="75" cy="30" r="1.5" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.7s ease-in-out infinite' }} />
              <circle cx="68" cy="55" r="1.5" fill="#00ff80" opacity="0.7" style={{ animation: 'neuronPulse 1.9s ease-in-out infinite' }} />
              {/* Large eye - top center */}
              <circle cx="50" cy="20" r="8" fill="#ffffff" stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
              <circle cx="50" cy="20" r="5.5" fill="#00ff80" />
              <circle cx="50" cy="20" r="3" fill="#000000" />
              <circle cx="48.5" cy="18.5" r="1" fill="#ffffff" opacity="0.9" />

              {/* Mouth - talking */}
              <ellipse cx="50" cy="75" rx="6" ry="4" fill="#ff6b9d" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" style={{ animation: 'mouthTalk 1.2s ease-in-out infinite' }} />
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