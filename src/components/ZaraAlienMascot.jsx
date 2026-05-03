import { useState, useRef } from 'react';
import { X, ChevronUp, Volume2, VolumeX, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ZARA_IMG = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/788fdfafa_334dc76f54a01292d408e91651da000cd556da33_full.jpg";

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
    utter.rate = 1.05;
    utter.pitch = 1.6;
    utter.volume = 1;

    // Try to pick a female Australian or Russian voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.toLowerCase().includes('karen') ||        // Australian female (macOS)
      v.name.toLowerCase().includes('catherine') ||    // Australian female
      v.name.toLowerCase().includes('lee') ||          // Australian female
      v.name.toLowerCase().includes('google australian') ||
      v.name.toLowerCase().includes('milena') ||       // Russian female
      v.name.toLowerCase().includes('yuri') ||         // Russian
      v.name.toLowerCase().includes('russian')
    );
    if (preferred) utter.voice = preferred;

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

function LightningBox() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <style>{`
        @keyframes liquidWave {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
          50% { border-radius: 50% 40% 60% 30% / 40% 70% 50% 60%; }
          75% { border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes lightningFlash1 {
          0%, 89%, 91%, 93%, 100% { opacity: 0; }
          90%, 92% { opacity: 1; }
        }
        @keyframes lightningFlash2 {
          0%, 74%, 76%, 79%, 100% { opacity: 0; }
          75%, 78% { opacity: 1; }
        }
        @keyframes lightningFlash3 {
          0%, 44%, 46%, 49%, 100% { opacity: 0; }
          45%, 48% { opacity: 1; }
        }
        @keyframes neonPulse {
          0%, 100% { 
            box-shadow: 0 0 20px #4400ff, 0 0 40px #0088ff, 0 0 80px #4400ff, inset 0 0 30px rgba(68,0,255,0.3);
          }
          50% { 
            box-shadow: 0 0 40px #0088ff, 0 0 80px #ffffff, 0 0 120px #4400ff, inset 0 0 60px rgba(0,136,255,0.5);
          }
        }
        @keyndef sphereRoll {
          0% { transform: translateX(-8px) translateY(4px) rotate(0deg); }
          25% { transform: translateX(8px) translateY(-4px) rotate(90deg); }
          50% { transform: translateX(4px) translateY(8px) rotate(180deg); }
          75% { transform: translateX(-4px) translateY(-8px) rotate(270deg); }
          100% { transform: translateX(-8px) translateY(4px) rotate(360deg); }
        }
        @keyframes sphereRoll {
          0% { transform: translateX(-8px) translateY(4px) rotate(0deg); }
          25% { transform: translateX(8px) translateY(-4px) rotate(90deg); }
          50% { transform: translateX(4px) translateY(8px) rotate(180deg); }
          75% { transform: translateX(-4px) translateY(-8px) rotate(270deg); }
          100% { transform: translateX(-8px) translateY(4px) rotate(360deg); }
        }
        .zara-liquid-box {
          animation: liquidWave 4s ease-in-out infinite, neonPulse 1.5s ease-in-out infinite;
        }
        .zara-sphere {
          animation: sphereRoll 6s linear infinite;
        }
        .zara-lightning-1 { animation: lightningFlash1 3s linear infinite; }
        .zara-lightning-2 { animation: lightningFlash2 2.7s linear infinite; }
        .zara-lightning-3 { animation: lightningFlash3 4.1s linear infinite; }
      `}</style>

      {/* Outer liquid morphing neon box */}
      <div
        className="zara-liquid-box"
        style={{
          position: 'absolute',
          inset: '-8px',
          background: 'linear-gradient(135deg, rgba(68,0,255,0.15) 0%, rgba(0,100,255,0.2) 50%, rgba(68,0,255,0.15) 100%)',
          border: '3px solid #4400ff',
          zIndex: 0,
        }}
      />

      {/* Rolling sphere inside */}
      <div
        className="zara-sphere"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40px',
          height: '40px',
          marginTop: '-20px',
          marginLeft: '-20px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(0,136,255,0.6) 40%, rgba(68,0,255,0.4) 80%)',
          boxShadow: '0 0 20px #0088ff, 0 0 40px #4400ff, 0 0 60px rgba(0,136,255,0.8)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Lightning bolt 1 */}
      <div className="zara-lightning-1" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <polyline points="20,0 35,35 25,35 45,80 30,80 55,130" stroke="#ffffff" strokeWidth="2.5" fill="none" filter="url(#glow)" opacity="0.9"/>
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
        </svg>
      </div>

      {/* Lightning bolt 2 */}
      <div className="zara-lightning-2" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <polyline points="80,10 65,50 75,50 55,100 70,100 45,145" stroke="#88aaff" strokeWidth="2" fill="none" opacity="0.85"/>
        </svg>
      </div>

      {/* Lightning bolt 3 */}
      <div className="zara-lightning-3" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          <polyline points="50,5 40,40 52,40 35,90 48,90 30,140" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7"/>
        </svg>
      </div>

      {/* Electric outline border flashing */}
      <div
        className="zara-lightning-1"
        style={{
          position: 'absolute',
          inset: '-4px',
          border: '2px solid #ffffff',
          borderRadius: 'inherit',
          boxShadow: '0 0 30px #ffffff, 0 0 60px #4400ff',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
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
        <div className="relative w-36 h-36" style={{ animation: 'zaraFloat 3s ease-in-out infinite' }}>
          <LightningBox />
          <div className="absolute inset-0 rounded-full overflow-hidden" style={{ border: '4px solid #4400ff', zIndex: 4, boxShadow: '0 0 30px #4400ff, 0 0 60px #0088ff' }}>
            <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
          </div>
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
          style={{ background: 'linear-gradient(180deg, rgba(68,0,255,0.12) 0%, transparent 100%)' }}
        >
          <div
            className="relative w-32 h-32 mb-3"
            style={{ animation: 'zaraFloat 3s ease-in-out infinite' }}
          >
            <LightningBox />
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ border: '4px solid #4400ff', zIndex: 4, boxShadow: '0 0 30px #4400ff, 0 0 60px #0088ff' }}
            >
              <img src={ZARA_IMG} alt="Zara" className="w-full h-full object-cover object-top" />
            </div>
          </div>

          <h3 className="font-black text-xl tracking-widest mb-0.5" style={{ color: '#88aaff', textShadow: '0 0 16px #4400ff, 0 0 30px #0088ff' }}>ZARA 👁️</h3>
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