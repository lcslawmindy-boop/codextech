import { useState } from 'react';
import { X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ZARA_IMG = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9c9743087_334dc76f54a01292d408e91651da000cd556da33_full.jpg";

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
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2"
        title="Chat with Zara"
      >
        <style>{`
          @keyframes zaraFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes zaraAura {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 160, 50, 0.6), 0 0 40px rgba(100, 80, 255, 0.4); }
            50% { box-shadow: 0 0 40px rgba(255, 160, 50, 1), 0 0 80px rgba(100, 80, 255, 0.7); }
          }
          @keyframes zaraRing {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.05); }
          }
        `}</style>
        <div
          className="relative w-24 h-24 rounded-full overflow-hidden"
          style={{ animation: 'zaraFloat 3s ease-in-out infinite, zaraAura 2.5s ease-in-out infinite', border: '3px solid rgba(255,180,50,0.9)' }}
        >
          <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
          {/* Cosmic overlay shimmer */}
          <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,160,50,0.15) 0%, transparent 70%)' }} />
        </div>
        {/* Outer ring */}
        <div
          className="absolute top-0 left-0 w-24 h-24 rounded-full pointer-events-none"
          style={{ border: '2px solid rgba(180,100,255,0.6)', animation: 'zaraRing 2.5s ease-in-out infinite' }}
        />
        <div className="text-center">
          <p className="text-xs font-black text-amber-400 leading-tight tracking-widest">ASK ZARA</p>
          <p className="text-xs text-purple-300 font-bold" style={{ fontSize: '9px' }}>ALL-SEEING GUIDE</p>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs">
      <style>{`
        @keyframes zaraAura {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 160, 50, 0.6), 0 0 40px rgba(100, 80, 255, 0.4); }
          50% { box-shadow: 0 0 40px rgba(255, 160, 50, 1), 0 0 80px rgba(100, 80, 255, 0.7); }
        }
      `}</style>
      {/* Main Chat Box */}
      <div
        className="bg-gray-900 border-2 rounded-2xl p-5 shadow-2xl"
        style={{
          borderColor: '#7c4dff',
          boxShadow: '0 0 24px rgba(124, 77, 255, 0.5), 0 0 12px rgba(255, 160, 50, 0.3)',
          background: 'linear-gradient(135deg, rgba(10,5,25,0.98) 0%, rgba(15,8,35,0.98) 100%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 border border-purple-500 rounded-full flex items-center justify-center hover:bg-gray-800 transition"
        >
          <X size={16} className="text-purple-400" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0"
            style={{ animation: 'zaraAura 2.5s ease-in-out infinite', border: '2px solid rgba(255,160,50,0.8)' }}
          >
            <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-amber-400 text-sm tracking-widest">ZARA 👁️</h3>
            <p className="text-xs text-purple-300">All-Seeing Research Guide</p>
          </div>
        </div>

        {/* Welcome Message */}
        <p className="text-sm text-gray-300 mb-4 leading-relaxed">
          Welcome, seeker. I'm <span className="text-amber-400 font-bold">Zara</span> — your all-seeing guide through this knowledge library. What shall we explore? 🌟
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
          💡 Click any suggestion or scroll to explore
        </p>
      </div>
    </div>
  );
}