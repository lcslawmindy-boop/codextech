import { useState, useRef } from 'react';
import { X, ChevronUp, Volume2, VolumeX, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ZARA_IMG = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9c9743087_334dc76f54a01292d408e91651da000cd556da33_full.jpg";

function useZaraSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);

  const readPage = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Gather visible text from page (headings, paragraphs, buttons)
    const selectors = 'h1, h2, h3, h4, p, .solid-section p, .solid-section h2, .solid-section h3';
    const nodes = Array.from(document.querySelectorAll(selectors));
    const text = nodes
      .map(n => n.innerText?.trim())
      .filter(t => t && t.length > 3)
      .slice(0, 40) // limit to avoid very long reads
      .join('. ');

    if (!text) return;

    const utter = new SpeechSynthesisUtterance(
      "Hello, I'm Zara, your Zenith Apex Research Assistant. Here's what's on this page: " + text
    );
    utter.rate = 0.92;
    utter.pitch = 1.1;
    utter.volume = 1;

    // Try to pick a female voice
    const voices = window.speechSynthesis.getVoices();
    const female = voices.find(v =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('google us english')
    );
    if (female) utter.voice = female;

    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speaking, readPage, stopReading };
}

export default function ZaraAlienMascot() {
  const [isOpen, setIsOpen] = useState(true);
  const [showPrompts, setShowPrompts] = useState(true);
  const { speaking, readPage, stopReading } = useZaraSpeech();

  const suggestedPrompts = [
    { text: '📚 Show me the research', href: '/vault' },
    { text: '🔨 I want to build something', href: '/invention-plans' },
    { text: '💰 What\'s the pricing?', href: '/subscribe' },
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
            0%, 100% { box-shadow: 0 0 30px rgba(0,255,100,0.7), 0 0 60px rgba(255,100,0,0.5); }
            50% { box-shadow: 0 0 60px rgba(0,255,100,1), 0 0 100px rgba(255,100,0,0.8); }
          }
          @keyframes zaraRing {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.06); }
          }
        `}</style>
        <div
          className="relative w-36 h-36 rounded-full overflow-hidden"
          style={{ animation: 'zaraFloat 3s ease-in-out infinite, zaraAura 2.5s ease-in-out infinite', border: '4px solid #00ff66' }}
        >
          <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
        </div>
        <div
          className="absolute top-0 left-0 w-36 h-36 rounded-full pointer-events-none"
          style={{ border: '2px solid rgba(255,100,0,0.8)', animation: 'zaraRing 2.5s ease-in-out infinite' }}
        />
        <div className="text-center mt-1">
          <p className="text-sm font-black leading-tight tracking-widest" style={{ color: '#00ff66', textShadow: '0 0 10px #00ff66' }}>ZARA</p>
          <p className="font-black" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#ff6600', textShadow: '0 0 8px #ff6600' }}>ZENITH APEX RESEARCH ASSISTANT</p>
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
          0%, 100% { box-shadow: 0 0 30px rgba(0,255,100,0.7), 0 0 60px rgba(255,100,0,0.4); }
          50% { box-shadow: 0 0 60px rgba(0,255,100,1), 0 0 100px rgba(255,100,0,0.7); }
        }
        @keyframes zaraFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes zaraSpeakPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,255,100,0.6); }
          50% { box-shadow: 0 0 50px rgba(0,255,100,1), 0 0 80px rgba(0,255,100,0.5); }
        }
      `}</style>

      {/* Main Chat Box */}
      <div
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          border: '2px solid #00ff66',
          boxShadow: '0 0 40px rgba(0,255,100,0.5), 0 0 20px rgba(255,100,0,0.3)',
          background: 'linear-gradient(135deg, rgba(2,12,5,0.99) 0%, rgba(5,10,3,0.99) 100%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition z-10"
          style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #00ff66' }}
        >
          <X size={16} style={{ color: '#00ff66' }} />
        </button>

        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full" style={{ background: '#ff6600', opacity: 0.7 }} />
        </div>

        {/* Hero portrait area */}
        <div className="relative flex flex-col items-center pt-4 pb-4 px-5"
          style={{ background: 'linear-gradient(180deg, rgba(0,255,100,0.08) 0%, transparent 100%)' }}
        >
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden mb-3"
            style={{ animation: 'zaraFloat 3s ease-in-out infinite, zaraAura 2.5s ease-in-out infinite', border: '4px solid #00ff66' }}
          >
            <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
          </div>

          <h3 className="font-black text-xl tracking-widest mb-0.5" style={{ color: '#00ff66', textShadow: '0 0 16px #00ff66' }}>ZARA 👁️</h3>
          <p className="font-black text-xs tracking-widest text-center" style={{ letterSpacing: '0.12em', color: '#ff6600', textShadow: '0 0 8px #ff6600' }}>
            ZENITH APEX RESEARCH ASSISTANT
          </p>

          {/* 🔊 Audio Reader Button */}
          <button
            onClick={speaking ? stopReading : readPage}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all"
            style={{
              background: speaking
                ? 'linear-gradient(90deg, rgba(255,100,0,0.3), rgba(255,50,0,0.3))'
                : 'linear-gradient(90deg, rgba(0,255,100,0.15), rgba(0,200,80,0.1))',
              border: speaking ? '2px solid #ff6600' : '2px solid #00ff66',
              color: speaking ? '#ff6600' : '#00ff66',
              boxShadow: speaking
                ? '0 0 20px rgba(255,100,0,0.5)'
                : '0 0 12px rgba(0,255,100,0.3)',
              animation: speaking ? 'zaraSpeakPulse 1s ease-in-out infinite' : 'none',
            }}
            title={speaking ? 'Stop Zara reading' : 'Let Zara read this page aloud'}
          >
            {speaking ? <Square size={13} /> : <Volume2 size={13} />}
            {speaking ? '⏹ Stop Reading' : '🔊 Let Zara Read This Page'}
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-5">
          {/* Welcome Message */}
          <p className="text-sm mb-4 leading-relaxed text-center" style={{ color: '#ccc' }}>
            Welcome, seeker. I'm <span style={{ color: '#00ff66', fontWeight: '900' }}>Zara</span> — your guide through the Zenith Apex research library. Hit{' '}
            <span style={{ color: '#ff6600', fontWeight: '900' }}>🔊 above</span> and I'll read the page to you! 🌟
          </p>

          {/* Suggested Prompts */}
          {showPrompts && (
            <div className="space-y-2 mb-4">
              {suggestedPrompts.map((prompt, idx) => (
                <Link
                  key={idx}
                  to={prompt.href}
                  className="block p-3 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: 'rgba(0,0,0,0.5)',
                    border: '1px solid rgba(0,255,100,0.3)',
                    color: '#ccc',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#ff6600';
                    e.currentTarget.style.color = '#ff6600';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,255,100,0.3)';
                    e.currentTarget.style.color = '#ccc';
                  }}
                >
                  {prompt.text}
                </Link>
              ))}
            </div>
          )}

          {/* Toggle Prompts */}
          <button
            onClick={() => setShowPrompts(!showPrompts)}
            className="w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,100,0,0.4)', color: '#ff6600' }}
          >
            <ChevronUp size={14} style={{ transform: showPrompts ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
            {showPrompts ? 'Hide suggestions' : 'Show suggestions'}
          </button>

          <p className="text-xs mt-3 text-center" style={{ color: '#444' }}>
            💡 Click any suggestion or scroll to explore
          </p>
        </div>
      </div>
    </motion.div>
  );
}