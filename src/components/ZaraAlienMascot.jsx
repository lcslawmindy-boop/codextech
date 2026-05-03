import { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, Volume2, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ZARA_IMG = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/788fdfafa_334dc76f54a01292d408e91651da000cd556da33_full.jpg";

/* ── Matrix Rain Canvas ── */
function MatrixRain({ width = 340, height = 200 }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cols = Math.floor(width / 14);
    const drops = Array(cols).fill(1);
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ∑∇∆Ψ∞Φ';
    let raf;
    const draw = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '13px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random() > 0.9 ? '#ffffff' : '#00ff41';
        ctx.fillStyle = brightness;
        ctx.fillText(char, i * 14, y * 14);
        if (y * 14 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [width, height]);
  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }} />;
}

/* ── Lightning Avatar ── */
function LightningAvatar() {
  return (
    <div style={{ position: 'relative', width: '128px', height: '128px' }}>
      <style>{`
        @keyframes zaraPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px #4400ff, 0 0 50px #0066ff, 0 0 80px #4400ff; }
          50% { transform: scale(1.04); box-shadow: 0 0 40px #ffffff, 0 0 80px #4400ff, 0 0 120px #0088ff; }
        }
        @keyframes zaraVibrate {
          0%, 100% { transform: translate(0,0) scale(1); }
          10% { transform: translate(-2px, 1px) scale(1.01); }
          20% { transform: translate(2px, -1px) scale(0.99); }
          30% { transform: translate(-1px, 2px) scale(1.01); }
          40% { transform: translate(1px, -2px) scale(1); }
          50% { transform: translate(-2px, -1px) scale(1.02); }
          60% { transform: translate(2px, 1px) scale(0.99); }
          70% { transform: translate(-1px, -2px) scale(1); }
          80% { transform: translate(1px, 2px) scale(1.01); }
          90% { transform: translate(0px, -1px) scale(1); }
        }
        @keyframes scalarRing1 {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes scalarRing2 {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes scalarRing3 {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes bolt1 {
          0%, 85%, 87%, 89%, 100% { opacity: 0; }
          86%, 88% { opacity: 1; }
        }
        @keyframes bolt2 {
          0%, 55%, 57%, 60%, 100% { opacity: 0; }
          56%, 59% { opacity: 1; }
        }
        @keyframes bolt3 {
          0%, 30%, 32%, 35%, 100% { opacity: 0; }
          31%, 34% { opacity: 1; }
        }
        @keyframes bolt4 {
          0%, 70%, 72%, 74%, 100% { opacity: 0; }
          71%, 73% { opacity: 1; }
        }
        @keyframes whiteFlash {
          0%, 84%, 90%, 100% { opacity: 0; }
          86%, 88% { opacity: 0.6; }
        }
        .zara-img-wrap {
          animation: zaraPulse 2s ease-in-out infinite, zaraVibrate 0.12s linear infinite;
        }
      `}</style>

      {/* Scalar quantum wave rings */}
      {[
        { anim: 'scalarRing1 2s ease-out infinite', color: '#4400ff', delay: '0s' },
        { anim: 'scalarRing2 2s ease-out infinite', color: '#0088ff', delay: '0.6s' },
        { anim: 'scalarRing3 2s ease-out infinite', color: '#ffffff', delay: '1.2s' },
      ].map((r, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: '50%', left: '50%',
          width: '128px', height: '128px',
          marginTop: '-64px', marginLeft: '-64px',
          borderRadius: '50%',
          border: `2px solid ${r.color}`,
          animation: r.anim,
          animationDelay: r.delay,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Main image circle */}
      <div
        className="zara-img-wrap"
        style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '4px solid #4400ff',
          zIndex: 2,
        }}
      >
        <img src={ZARA_IMG} alt="Zara" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>

      {/* White flash overlay on lightning */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(180,180,255,0.7)',
        animation: 'whiteFlash 3s linear infinite',
        zIndex: 3, pointerEvents: 'none',
      }} />

      {/* Lightning bolts SVG — multiple angles */}
      {[
        { anim: 'bolt1 3s linear infinite', pts: '-20,0 -35,40 -25,40 -45,100', color: '#ffffff', w: 3 },
        { anim: 'bolt2 2.8s linear infinite', pts: '148,10 135,55 145,55 125,115', color: '#88ccff', w: 2.5 },
        { anim: 'bolt3 4.1s linear infinite', pts: '20,148 35,100 25,100 50,40', color: '#ffffff', w: 2 },
        { anim: 'bolt4 3.5s linear infinite', pts: '108,148 95,95 108,95 85,30', color: '#aaddff', w: 2 },
      ].map((b, i) => (
        <div key={i} style={{ position: 'absolute', inset: '-20px', zIndex: 5, pointerEvents: 'none', animation: b.anim }}>
          <svg width="170" height="170" style={{ position: 'absolute', overflow: 'visible' }}>
            <defs>
              <filter id={`lg${i}`}><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <polyline points={b.pts} stroke={b.color} strokeWidth={b.w} fill="none" filter={`url(#lg${i})`} opacity="0.95"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

/* ── Speech hook ── */
function useZaraSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef(null);
  const readPage = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const nodes = Array.from(document.querySelectorAll('h1,h2,h3,h4,p,.solid-section p'));
    const text = nodes.map(n => n.innerText?.trim()).filter(t => t && t.length > 3).slice(0, 40).join('. ');
    if (!text) return;
    const utter = new SpeechSynthesisUtterance("Hello, I'm Zara, your Zenith Apex Research Assistant. Here's what's on this page: " + text);
    utter.rate = 1.05; utter.pitch = 1.6; utter.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => ['karen','catherine','lee','google australian','milena','yuri','russian'].some(k => v.name.toLowerCase().includes(k)));
    if (preferred) utter.voice = preferred;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    utterRef.current = utter;
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };
  const stopReading = () => { window.speechSynthesis.cancel(); setSpeaking(false); };
  return { speaking, readPage, stopReading };
}

/* ── Main Component ── */
export default function ZaraAlienMascot() {
  const [isOpen, setIsOpen] = useState(true);
  const [showPrompts, setShowPrompts] = useState(true);
  const { speaking, readPage, stopReading } = useZaraSpeech();

  const suggestedPrompts = [
    { text: '📚 Show me the research vault', href: '/vault' },
    { text: '🔨 Build plans & device guides', href: '/invention-plans' },
    { text: '💰 View membership pricing', href: '/subscribe' },
    { text: '🚀 Patent strategy guide', href: '/patent-intelligence' },
    { text: '💡 Take a quick demo tour', href: '/research-brief' },
  ];

  if (!isOpen) {
    return (
      <motion.button
        drag dragMomentum={false}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <LightningAvatar />
        <div className="text-center mt-2">
          <p className="font-black text-sm tracking-widest" style={{ color: '#88aaff', textShadow: '0 0 10px #4400ff' }}>ZARA</p>
          <p className="font-black" style={{ fontSize: '9px', letterSpacing: '0.1em', color: '#00ff41' }}>ZENITH APEX AI</p>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      drag dragMomentum={false}
      className="fixed bottom-6 right-6 z-50"
      style={{ width: '360px', touchAction: 'none' }}
    >
      <div
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          border: '2px solid #4400ff',
          boxShadow: '0 0 40px rgba(68,0,255,0.7), 0 0 80px rgba(0,100,255,0.4)',
          background: '#000',
        }}
      >
        {/* Close */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition z-20"
          style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid #4400ff' }}
        >
          <X size={16} style={{ color: '#88aaff' }} />
        </button>

        {/* Drag handle */}
        <div className="flex justify-center pt-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full" style={{ background: '#4400ff', opacity: 0.8 }} />
        </div>

        {/* Portrait */}
        <div className="flex flex-col items-center pt-4 pb-4 px-5" style={{ background: 'rgba(0,0,20,0.95)' }}>
          <LightningAvatar />
          <h3 className="font-black text-xl tracking-widest mt-3 mb-0.5" style={{ color: '#88aaff', textShadow: '0 0 16px #4400ff, 0 0 30px #0088ff' }}>
            ZARA 👁️
          </h3>
          <p className="font-black text-xs tracking-widest text-center" style={{ color: '#00ff41', textShadow: '0 0 8px #00ff41', letterSpacing: '0.12em' }}>
            ZENITH APEX RESEARCH ASSISTANT
          </p>

          {/* Read button */}
          <button
            onClick={speaking ? stopReading : readPage}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all"
            style={{
              background: speaking ? 'rgba(255,50,0,0.2)' : 'rgba(68,0,255,0.2)',
              border: speaking ? '2px solid #ff4400' : '2px solid #4400ff',
              color: speaking ? '#ff8866' : '#88aaff',
              boxShadow: speaking ? '0 0 20px rgba(255,80,0,0.5)' : '0 0 16px rgba(68,0,255,0.6)',
            }}
          >
            {speaking ? <Square size={13} /> : <Volume2 size={13} />}
            {speaking ? '⏹ Stop Reading' : '🔊 Let Zara Read This Page'}
          </button>
        </div>

        {/* Body — Matrix rain background */}
        <div style={{ position: 'relative', background: '#000' }}>
          <MatrixRain width={360} height={showPrompts ? 260 : 80} />

          {/* Content over matrix */}
          <div style={{ position: 'relative', zIndex: 2, padding: '16px 20px 20px' }}>
            {/* Welcome */}
            <div style={{
              background: 'rgba(0,0,0,0.82)',
              border: '1px solid rgba(0,255,65,0.4)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '12px',
            }}>
              <p style={{ color: '#e8e8e8', fontSize: '13px', lineHeight: '1.6', fontFamily: 'sans-serif', fontWeight: '500' }}>
                Welcome, seeker. I'm <span style={{ color: '#00ff41', fontWeight: '900' }}>Zara</span> — your guide through the Zenith Apex research library.
                Hit <span style={{ color: '#88aaff', fontWeight: '900' }}>🔊 above</span> and I'll read the page aloud for you! 🌟
              </p>
            </div>

            {/* Prompts */}
            {showPrompts && (
              <div className="space-y-2 mb-3">
                {suggestedPrompts.map((prompt, idx) => (
                  <Link
                    key={idx}
                    to={prompt.href}
                    style={{
                      display: 'block',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.85)',
                      border: '1px solid rgba(68,0,255,0.5)',
                      color: '#e0e0ff',
                      fontSize: '13px',
                      fontFamily: 'sans-serif',
                      fontWeight: '600',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#00ff41';
                      e.currentTarget.style.color = '#00ff41';
                      e.currentTarget.style.background = 'rgba(0,20,0,0.9)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'rgba(68,0,255,0.5)';
                      e.currentTarget.style.color = '#e0e0ff';
                      e.currentTarget.style.background = 'rgba(0,0,0,0.85)';
                    }}
                  >
                    {prompt.text}
                  </Link>
                ))}
              </div>
            )}

            {/* Toggle */}
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(68,0,255,0.4)',
                color: '#88aaff',
                fontSize: '12px',
                fontFamily: 'sans-serif',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <ChevronUp size={14} style={{ transform: showPrompts ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              {showPrompts ? 'Hide suggestions' : 'Show suggestions'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}