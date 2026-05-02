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
          {/* 3D Eyeball */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 16px rgba(100, 180, 255, 0.7))' }}>
            {/* White of eye */}
            <circle cx="50" cy="50" r="30" fill="#fff" />
            {/* Iris */}
            <circle cx="50" cy="50" r="18" fill="#4a90e2" />
            {/* Pupil */}
            <circle cx="50" cy="50" r="12" fill="#000" />
            {/* Eye shine/reflection */}
            <circle cx="44" cy="44" r="6" fill="#fff" opacity="0.8" />
            <circle cx="54" cy="56" r="2" fill="#fff" opacity="0.6" />
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
            {/* 3D Eyeball */}
             <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
               {/* White of eye */}
               <circle cx="50" cy="50" r="30" fill="#fff" />
               {/* Iris */}
               <circle cx="50" cy="50" r="18" fill="#4a90e2" />
               {/* Pupil */}
               <circle cx="50" cy="50" r="12" fill="#000" />
               {/* Eye shine/reflection */}
               <circle cx="44" cy="44" r="6" fill="#fff" opacity="0.8" />
               <circle cx="54" cy="56" r="2" fill="#fff" opacity="0.6" />
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