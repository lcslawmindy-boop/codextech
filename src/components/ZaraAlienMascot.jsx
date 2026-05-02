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
          {/* 3D Lion head */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 16px rgba(245, 166, 35, 0.7))' }}>
            {/* Mane - back layer */}
            <circle cx="50" cy="45" r="28" fill="#d4820f" opacity="0.7" />
            {/* Mane - front layer */}
            <circle cx="50" cy="45" r="28" fill="#f5a623" />
            {/* Mane spikes */}
            <circle cx="30" cy="30" r="6" fill="#e67e22" />
            <circle cx="20" cy="45" r="6" fill="#e67e22" />
            <circle cx="30" cy="60" r="6" fill="#e67e22" />
            <circle cx="70" cy="30" r="6" fill="#e67e22" />
            <circle cx="80" cy="45" r="6" fill="#e67e22" />
            <circle cx="70" cy="60" r="6" fill="#e67e22" />
            {/* Face */}
            <circle cx="50" cy="50" r="20" fill="#f5a623" />
            {/* Eyes */}
            <ellipse cx="42" cy="46" rx="4" ry="6" fill="#000" />
            <ellipse cx="58" cy="46" rx="4" ry="6" fill="#000" />
            {/* Eye shine */}
            <circle cx="43" cy="44" r="1.5" fill="#fff" />
            <circle cx="59" cy="44" r="1.5" fill="#fff" />
            {/* Nose */}
            <ellipse cx="50" cy="54" rx="3" ry="2.5" fill="#000" />
            {/* Mouth */}
            <path d="M 50 54 Q 48 57 45 56" stroke="#000" strokeWidth="1.5" fill="none" />
            <path d="M 50 54 Q 52 57 55 56" stroke="#000" strokeWidth="1.5" fill="none" />
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
          borderColor: '#f5a623',
          boxShadow: '0 0 24px rgba(245, 166, 35, 0.4), 0 0 12px rgba(245, 166, 35, 0.2)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 border border-amber-500 rounded-full flex items-center justify-center hover:bg-gray-800 transition"
        >
          <X size={16} className="text-amber-400" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12 flex-shrink-0">
            {/* 3D Lion Head */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              {/* Mane - back layer */}
              <circle cx="50" cy="45" r="28" fill="#d4820f" opacity="0.7" />
              {/* Mane - front layer with texture */}
              <circle cx="50" cy="45" r="28" fill="#f5a623" />
              {/* Mane spikes */}
              <circle cx="30" cy="30" r="6" fill="#e67e22" />
              <circle cx="20" cy="45" r="6" fill="#e67e22" />
              <circle cx="30" cy="60" r="6" fill="#e67e22" />
              <circle cx="70" cy="30" r="6" fill="#e67e22" />
              <circle cx="80" cy="45" r="6" fill="#e67e22" />
              <circle cx="70" cy="60" r="6" fill="#e67e22" />
              {/* Face */}
              <circle cx="50" cy="50" r="20" fill="#f5a623" />
              {/* Eyes */}
              <ellipse cx="42" cy="46" rx="4" ry="6" fill="#000" />
              <ellipse cx="58" cy="46" rx="4" ry="6" fill="#000" />
              {/* Eye shine */}
              <circle cx="43" cy="44" r="1.5" fill="#fff" />
              <circle cx="59" cy="44" r="1.5" fill="#fff" />
              {/* Nose */}
              <ellipse cx="50" cy="54" rx="3" ry="2.5" fill="#000" />
              {/* Mouth */}
              <path d="M 50 54 Q 48 57 45 56" stroke="#000" strokeWidth="1.5" fill="none" />
              <path d="M 50 54 Q 52 57 55 56" stroke="#000" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-black text-amber-400 text-sm">ZARA 🦁</h3>
            <p className="text-xs text-gray-400">Your powerful guide</p>
          </div>
        </div>

        {/* Welcome Message */}
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Welcome, friend! I'm <span className="text-amber-400 font-bold">Zara</span> the Research Lion. I'm here to help you explore, learn, and build amazing things. What interests you? 🌟
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