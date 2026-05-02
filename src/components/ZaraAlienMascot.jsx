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
        className="fixed bottom-6 right-6 z-40 animate-bounce"
        title="Chat with Zara"
      >
        <div className="relative w-16 h-16">
          {/* Alien head */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 12px rgba(0, 255, 128, 0.6))' }}>
            {/* Head */}
            <ellipse cx="50" cy="50" rx="35" ry="40" fill="#00ff80" opacity="0.9" />
            {/* Large eyes */}
            <ellipse cx="35" cy="40" rx="12" ry="16" fill="#000" />
            <ellipse cx="65" cy="40" rx="12" ry="16" fill="#000" />
            {/* Eye shine */}
            <circle cx="37" cy="38" r="4" fill="#00ffff" />
            <circle cx="67" cy="38" r="4" fill="#00ffff" />
            {/* Smile */}
            <path d="M 40 60 Q 50 68 60 60" stroke="#000" strokeWidth="2" fill="none" />
            {/* Antennae */}
            <line x1="45" y1="10" x2="40" y2="0" stroke="#00ff80" strokeWidth="3" />
            <line x1="55" y1="10" x2="60" y2="0" stroke="#00ff80" strokeWidth="3" />
            <circle cx="40" cy="0" r="3" fill="#ff00ff" />
            <circle cx="60" cy="0" r="3" fill="#ff00ff" />
          </svg>
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
          borderColor: '#00ff80',
          boxShadow: '0 0 24px rgba(0, 255, 128, 0.4), 0 0 12px rgba(0, 255, 128, 0.2)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 border border-green-500 rounded-full flex items-center justify-center hover:bg-gray-800 transition"
        >
          <X size={16} className="text-green-400" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <ellipse cx="50" cy="50" rx="35" ry="40" fill="#00ff80" opacity="0.9" />
              <ellipse cx="35" cy="40" rx="12" ry="16" fill="#000" />
              <ellipse cx="65" cy="40" rx="12" ry="16" fill="#000" />
              <circle cx="37" cy="38" r="4" fill="#00ffff" />
              <circle cx="67" cy="38" r="4" fill="#00ffff" />
              <path d="M 40 60 Q 50 68 60 60" stroke="#000" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-black text-green-400 text-sm">ZARA 👽</h3>
            <p className="text-xs text-gray-400">Your guide to everything</p>
          </div>
        </div>

        {/* Welcome Message */}
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Welcome, friend! I'm <span className="text-green-400 font-bold">Zara</span> from planet Research. I'm here to help you explore, learn, and build amazing things. What interests you? 🌟
        </p>

        {/* Suggested Prompts */}
        {showPrompts && (
          <div className="space-y-2 mb-4">
            {suggestedPrompts.map((prompt, idx) => (
              <Link
                key={idx}
                to={prompt.href}
                className="block p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500 transition text-xs text-gray-300 hover:text-green-400 font-semibold"
              >
                {prompt.text}
              </Link>
            ))}
          </div>
        )}

        {/* Toggle Prompts */}
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="w-full py-2 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs text-gray-400 hover:text-green-400 transition flex items-center justify-center gap-2 font-semibold"
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