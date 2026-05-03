import { useState, useRef } from 'react';
import { X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      <motion.button
        drag
        dragMomentum={false}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
        title="Chat with Zara"
      >
        <style>{`
          @keyframes zaraFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes zaraAura {
            0%, 100% { box-shadow: 0 0 30px rgba(255, 160, 50, 0.7), 0 0 60px rgba(100, 80, 255, 0.5); }
            50% { box-shadow: 0 0 60px rgba(255, 160, 50, 1), 0 0 100px rgba(100, 80, 255, 0.8); }
          }
          @keyframes zaraRing {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.06); }
          }
        `}</style>
        <div
          className="relative w-36 h-36 rounded-full overflow-hidden"
          style={{ animation: 'zaraFloat 3s ease-in-out infinite, zaraAura 2.5s ease-in-out infinite', border: '4px solid rgba(255,180,50,0.95)' }}
        >
          <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,160,50,0.15) 0%, transparent 70%)' }} />
        </div>
        {/* Outer ring */}
        <div
          className="absolute top-0 left-0 w-36 h-36 rounded-full pointer-events-none"
          style={{ border: '2px solid rgba(180,100,255,0.7)', animation: 'zaraRing 2.5s ease-in-out infinite' }}
        />
        <div className="text-center mt-1">
          <p className="text-sm font-black text-amber-400 leading-tight tracking-widest">ZARA</p>
          <p className="text-purple-300 font-black" style={{ fontSize: '10px', letterSpacing: '0.12em' }}>ZENITH APEX RESEARCH ASSISTANT</p>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-50"
      style={{ width: '340px', touchAction: 'none' }}
    >
      <style>{`
        @keyframes zaraAura {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 160, 50, 0.7), 0 0 60px rgba(100, 80, 255, 0.5); }
          50% { box-shadow: 0 0 60px rgba(255, 160, 50, 1), 0 0 100px rgba(100, 80, 255, 0.8); }
        }
        @keyframes zaraFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Main Chat Box */}
      <div
        className="bg-gray-900 border-2 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          borderColor: '#7c4dff',
          boxShadow: '0 0 40px rgba(124, 77, 255, 0.6), 0 0 20px rgba(255, 160, 50, 0.3)',
          background: 'linear-gradient(135deg, rgba(10,5,25,0.99) 0%, rgba(15,8,35,0.99) 100%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 bg-gray-900 border border-purple-500 rounded-full flex items-center justify-center hover:bg-gray-800 transition z-10"
        >
          <X size={16} className="text-purple-400" />
        </button>

        {/* Drag handle hint */}
        <div className="flex justify-center pt-2 pb-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-purple-700/60" />
        </div>

        {/* Hero portrait area */}
        <div className="relative flex flex-col items-center pt-4 pb-4 px-5"
          style={{ background: 'linear-gradient(180deg, rgba(124,77,255,0.15) 0%, transparent 100%)' }}
        >
          {/* Big portrait */}
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden mb-3"
            style={{ animation: 'zaraFloat 3s ease-in-out infinite, zaraAura 2.5s ease-in-out infinite', border: '4px solid rgba(255,180,50,0.95)' }}
          >
            <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,160,50,0.15) 0%, transparent 70%)' }} />
          </div>

          {/* Name & title */}
          <h3 className="font-black text-amber-400 text-xl tracking-widest mb-0.5">ZARA 👁️</h3>
          <p className="text-purple-300 font-black text-xs tracking-widest text-center" style={{ letterSpacing: '0.12em' }}>
            ZENITH APEX RESEARCH ASSISTANT
          </p>
        </div>

        {/* Body */}
        <div className="px-5 pb-5">
          {/* Welcome Message */}
          <p className="text-sm text-gray-300 mb-4 leading-relaxed text-center">
            Welcome, seeker. I'm <span className="text-amber-400 font-bold">Zara</span> — your guide through the Zenith Apex research library. What shall we explore? 🌟
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
            <ChevronUp size={14} style={{ transform: showPrompts ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            {showPrompts ? 'Hide suggestions' : 'Show suggestions'}
          </button>

          <p className="text-xs text-gray-600 mt-3 text-center">
            💡 Click any suggestion or scroll to explore
          </p>
        </div>
      </div>
    </motion.div>
  );
}