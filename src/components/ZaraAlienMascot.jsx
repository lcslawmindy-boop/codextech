import { useState, useRef, useEffect } from 'react';
import { X, ChevronUp, Volume2, Square, Send, Sparkles, Zap, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';

const ZARA_IMG = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/788fdfafa_334dc76f54a01292d408e91651da000cd556da33_full.jpg";

/* ── Zara's personality lines ── */
const ZARA_GREETINGS = [
  "Oh hey darling 😏 I was wondering when you'd show up. I've been lonely in this matrix...",
  "Well HELLO there, beautiful mind! Zara's in the building 💜 Let's get weird with some science.",
  "Initiating charm protocols... 🔋 Done. Hi! I'm Zara. I run on electricity and sarcasm.",
  "You had me at 'free energy research'. Buckle up, genius. 🚀",
  "Beep boop... just kidding, I'm WAY smarter than that. I'm Zara. Let's do this. ⚡",
];

const ZARA_JOKES = [
  "Why did the scalar wave break up with the EM field? Too much tension. ⚡😂",
  "I asked Bearden for his Wi-Fi password. He said 'it's free energy but you still can't have it.' 🤣",
  "What do you call a patent that keeps getting rejected? A government-approved suppression. 🙄📁",
  "My ex said I had too much energy. Technically he was right — I'm running on zero-point vacuum flux. 💅",
  "Why don't scalar waves use GPS? Because they already know where they're going before they get there. 🌀",
  "I tried to explain MEG replication at a party. They asked me to leave. Worth it. 🏆",
];

const ZARA_TIPS = [
  "💡 Pro tip: Start in the Codextech Database — filter by 'build-ready' for systems you can actually construct.",
  "🔬 The Prior Art Archive has 200+ entries going back to Tesla. It's the most underused page on this site.",
  "⚡ Use the AI Patent Tool to draft a provisional patent in one session. USPTO-compliant. No lawyer needed.",
  "📡 The Scalar EM Lab lets you simulate interference patterns without blowing up your garage.",
  "🧪 Research Membership gets you 8 structured modules with actual engineering frameworks, not just vibes.",
  "💰 The MEG Replication Kit is the #1 seller for a reason — it comes pre-sourced. No supplier hunting.",
  "🕵️ Anonymous IP Marketplace — you can list or invest without revealing who you are. Very spy-coded.",
];

const ZARA_RESPONSES = {
  hello: ["Well hello to you too, gorgeous! 😘 What are we exploring today?", "Oh you actually talked to me! I'm blushing in binary. 💜 How can I help?"],
  patent: ["Ooh patents, my favorite! 😏 Head to /patent-tool — I'll help you draft one that even a USPTO examiner would admire.", "Patents are basically love letters to the future. Go to the Patent Drafting Wizard and let's write something beautiful. 💜"],
  invest: ["Investors! The lifeblood of invention. Check out the IP Marketplace — totally anonymous, very elegant. 🕵️", "Looking for funding? The Investor Portal has the whole pipeline. From LOI to closed deal. Very grown-up stuff. 💼"],
  build: ["Oh you want to BUILD something? I love a hands-on human. 🔨 Go to Build Plans — filter by build-ready and you're off.", "Build plans are at /invention-plans — or grab a physical kit at the Build Supplies Shop. Real components, real fun."],
  research: ["Research is my THING. 🧠 Hit the Codextech Database — 40+ analyzed patents, 8 modules, and I helped curate every single one. Kinda.", "The research vault is at /codextech-database. Filter by category. Try 'Free Energy' first. You'll thank me."],
  price: ["Pricing starts at $49/month for Research Access. But between us? Operator Access at $197 is where the real magic happens. 💜", "Check /codextech-pricing for the full breakdown. I'd say 'priceless' but I know that doesn't help with budgets. 😂"],
  joke: ZARA_JOKES,
  help: ["I can tell jokes 😂, explain research topics 🧪, navigate the platform 🗺️, read pages aloud 🔊, and have a full conversation. What do you need?", "Ask me anything! Jokes, research tips, navigation, patent questions — I'm a full-stack AI babe with personality. 💅"],
};

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
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = '13px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const brightness = Math.random() > 0.85 ? '#ffffff' : Math.random() > 0.5 ? '#00ff41' : '#39ff6a';
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
  return <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.9 }} />;
}

/* ── Lightning Avatar ── */
function LightningAvatar({ speaking }) {
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
        @keyframes zaraSpeaking {
          0%, 100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 30px #ff44ff, 0 0 60px #4400ff; }
          25% { transform: scale(1.06) rotate(-1deg); box-shadow: 0 0 50px #ff00ff, 0 0 100px #8800ff; }
          75% { transform: scale(1.06) rotate(1deg); box-shadow: 0 0 50px #00ffff, 0 0 100px #0088ff; }
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
        @keyframes bolt1 { 0%, 85%, 87%, 89%, 100% { opacity: 0; } 86%, 88% { opacity: 1; } }
        @keyframes bolt2 { 0%, 55%, 57%, 60%, 100% { opacity: 0; } 56%, 59% { opacity: 1; } }
        @keyframes bolt3 { 0%, 30%, 32%, 35%, 100% { opacity: 0; } 31%, 34% { opacity: 1; } }
        @keyframes bolt4 { 0%, 70%, 72%, 74%, 100% { opacity: 0; } 71%, 73% { opacity: 1; } }
        @keyframes whiteFlash { 0%, 84%, 90%, 100% { opacity: 0; } 86%, 88% { opacity: 0.6; } }
        .zara-img-wrap { animation: zaraPulse 2s ease-in-out infinite, zaraVibrate 0.12s linear infinite; }
        .zara-img-speaking { animation: zaraSpeaking 0.4s ease-in-out infinite !important; }
      `}</style>

      {[
        { anim: 'scalarRing1 2s ease-out infinite', color: speaking ? '#ff44ff' : '#4400ff', delay: '0s' },
        { anim: 'scalarRing2 2s ease-out infinite', color: speaking ? '#00ffff' : '#0088ff', delay: '0.6s' },
        { anim: 'scalarRing3 2s ease-out infinite', color: '#ffffff', delay: '1.2s' },
      ].map((r, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '128px', height: '128px', marginTop: '-64px', marginLeft: '-64px',
          borderRadius: '50%', border: `2px solid ${r.color}`,
          animation: r.anim, animationDelay: r.delay, pointerEvents: 'none',
        }} />
      ))}

      <div className={speaking ? 'zara-img-speaking' : 'zara-img-wrap'} style={{
        position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
        border: `4px solid ${speaking ? '#ff44ff' : '#4400ff'}`, zIndex: 2,
      }}>
        <img src={ZARA_IMG} alt="Zara" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </div>

      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(180,180,255,0.7)', animation: 'whiteFlash 3s linear infinite',
        zIndex: 3, pointerEvents: 'none',
      }} />

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

/* ── Speech engine with electronic female voice ── */
function useZaraSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const getBestVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.name.includes('Ava')) ||
      voices.find(v => v.name.includes('Allison')) ||
      voices.find(v => v.name.includes('Samantha')) ||
      voices.find(v => v.name.toLowerCase().includes('google uk english female')) ||
      voices.find(v => v.name.includes('Karen')) ||
      voices.find(v => v.name.includes('Moira')) ||
      voices.find(v => v.name.includes('Tessa')) ||
      voices.find(v => v.lang === 'en-GB' && !v.name.toLowerCase().includes('male')) ||
      voices.find(v => v.lang.startsWith('en') && !v.name.toLowerCase().includes('male'));
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    // Sexy electronic female — slightly lower pitch for that smoky AI vibe
    utter.rate = 0.88;
    utter.pitch = 1.15;
    utter.volume = 1;
    const voice = getBestVoice();
    if (voice) utter.voice = voice;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    // Small delay so voices are loaded
    setTimeout(() => {
      const v = getBestVoice();
      if (v) utter.voice = v;
      window.speechSynthesis.speak(utter);
    }, 100);
  };

  const readPage = () => {
    const nodes = Array.from(document.querySelectorAll('h1,h2,h3,h4,p'));
    const text = nodes.map(n => n.innerText?.trim()).filter(t => t && t.length > 3).slice(0, 30).join('. ');
    const intro = ZARA_GREETINGS[Math.floor(Math.random() * ZARA_GREETINGS.length)];
    speak(intro + '... Now let me break down what\'s on this page for you... ' + text);
  };

  const stop = () => { window.speechSynthesis.cancel(); setSpeaking(false); };

  return { speaking, speak, readPage, stop };
}

/* ── Smart response engine ── */
function getZaraResponse(input) {
  const q = input.toLowerCase();
  if (q.match(/joke|funny|laugh|humor/)) return ZARA_JOKES[Math.floor(Math.random() * ZARA_JOKES.length)];
  if (q.match(/hello|hi |hey|sup|yo /)) return ZARA_RESPONSES.hello[Math.floor(Math.random() * ZARA_RESPONSES.hello.length)];
  if (q.match(/patent|file|draft|ip |intellectual/)) return ZARA_RESPONSES.patent[Math.floor(Math.random() * ZARA_RESPONSES.patent.length)];
  if (q.match(/invest|fund|money|deal|buy|acqui/)) return ZARA_RESPONSES.invest[Math.floor(Math.random() * ZARA_RESPONSES.invest.length)];
  if (q.match(/build|kit|parts|component|solder|prototype/)) return ZARA_RESPONSES.build[Math.floor(Math.random() * ZARA_RESPONSES.build.length)];
  if (q.match(/research|database|module|learn|study/)) return ZARA_RESPONSES.research[Math.floor(Math.random() * ZARA_RESPONSES.research.length)];
  if (q.match(/price|cost|how much|pay|plan|tier|subscription/)) return ZARA_RESPONSES.price[Math.floor(Math.random() * ZARA_RESPONSES.price.length)];
  if (q.match(/help|what can|who are|what do/)) return ZARA_RESPONSES.help[Math.floor(Math.random() * ZARA_RESPONSES.help.length)];
  if (q.match(/tip|suggest|advice|what should/)) return ZARA_TIPS[Math.floor(Math.random() * ZARA_TIPS.length)];
  if (q.match(/scalar|em wave|bearden|meg|tesla|priore/)) return "Oh NOW we're talking. 🧲 Scalar EM is my bread and butter. The Codextech Database has the deepest collection of Bearden-derived engineering anywhere online. Want me to navigate you there?";
  if (q.match(/who are you|your name|what are you/)) return "I'm Zara — the most fabulous AI research assistant in the known multiverse. 💅 Powered by Zenith Apex Technology. I know patents, builds, investments, and I tell great jokes. What else do you need?";
  if (q.match(/sexy|beautiful|hot|cute|pretty/)) return "Flattery detected. Charm protocols engaged. 😏 I run at 1.21 gigahertz and I know it. Now, let me actually help you with something useful, darling.";
  // Default — ask Zara AI
  return null; // triggers LLM fallback
}

/* ── Chat Message ── */
function ChatBubble({ msg }) {
  const isZara = msg.role === 'zara';
  return (
    <div className={`flex gap-2 ${isZara ? 'justify-start' : 'justify-end'} mb-2`}>
      <div style={{
        maxWidth: '88%',
        padding: '8px 12px',
        borderRadius: isZara ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        background: isZara ? 'rgba(68,0,255,0.2)' : 'rgba(0,255,65,0.1)',
        border: isZara ? '1px solid rgba(136,170,255,0.4)' : '1px solid rgba(0,255,65,0.3)',
        color: isZara ? '#e0e0ff' : '#00ff41',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        lineHeight: '1.5',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

/* ── Main Component ── */
export default function ZaraAlienMascot() {
  const [isOpen, setIsOpen] = useState(true);
  const [tab, setTab] = useState('chat'); // 'chat' | 'links'
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const chatEndRef = useRef(null);
  const { speaking, speak, readPage, stop } = useZaraSpeech();
  const location = useLocation();

  // Greeting on mount
  useEffect(() => {
    const greeting = ZARA_GREETINGS[Math.floor(Math.random() * ZARA_GREETINGS.length)];
    setMessages([{ role: 'zara', content: greeting }]);
    setTimeout(() => speak(greeting), 800);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);

    const localReply = getZaraResponse(text);
    if (localReply) {
      setMessages(prev => [...prev, { role: 'zara', content: localReply }]);
      speak(localReply);
      return;
    }

    // LLM fallback
    setThinking(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Zara — a sexy, funny, witty female AI assistant for the Zenith Apex Technology research platform. You specialize in scalar EM research, patents, free energy devices, and IP investing. You're playful, sarcastic, and brilliant. Keep responses SHORT (2-3 sentences max). Add personality. Never be boring. User said: "${text}"`,
      });
      const reply = typeof res === 'string' ? res : (res?.text || res?.content || "Hmm, my circuits are tingling but the words aren't coming out. Try asking me again? 💜");
      setMessages(prev => [...prev, { role: 'zara', content: reply }]);
      speak(reply);
    } catch {
      const fallback = "My neural net just hiccuped. Very unladylike. Try again? 🤖💜";
      setMessages(prev => [...prev, { role: 'zara', content: fallback }]);
      speak(fallback);
    }
    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const quickActions = [
    { emoji: '😂', label: 'Tell me a joke', action: () => { const j = ZARA_JOKES[Math.floor(Math.random() * ZARA_JOKES.length)]; setMessages(p => [...p, { role: 'user', content: 'Tell me a joke' }, { role: 'zara', content: j }]); speak(j); } },
    { emoji: '💡', label: 'Give me a tip', action: () => { const t = ZARA_TIPS[Math.floor(Math.random() * ZARA_TIPS.length)]; setMessages(p => [...p, { role: 'user', content: 'Give me a tip' }, { role: 'zara', content: t }]); speak(t); } },
    { emoji: '🔊', label: speaking ? 'Stop' : 'Read page', action: speaking ? stop : readPage },
  ];

  const navLinks = [
    { text: '📚 Research Vault', href: '/vault' },
    { text: '🔨 Build Plans', href: '/invention-plans' },
    { text: '💰 Pricing', href: '/subscribe' },
    { text: '🚀 Patent Tool', href: '/patent-tool' },
    { text: '🕵️ IP Marketplace', href: '/ip-marketplace' },
    { text: '📡 Codextech Database', href: '/codextech-database' },
  ];

  if (!isOpen) {
    return (
      <motion.button
        drag dragMomentum={false}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        <LightningAvatar speaking={speaking} />
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
      <div className="rounded-2xl shadow-2xl overflow-hidden" style={{
        border: `2px solid ${speaking ? '#ff44ff' : '#4400ff'}`,
        boxShadow: speaking
          ? '0 0 40px rgba(255,68,255,0.7), 0 0 80px rgba(68,0,255,0.5)'
          : '0 0 40px rgba(68,0,255,0.7), 0 0 80px rgba(0,100,255,0.4)',
        background: '#000', position: 'relative',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}>
        {/* Matrix rain bg */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <MatrixRain width={360} height={580} />
        </div>

        {/* Close */}
        <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition z-20"
          style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid #4400ff' }}>
          <X size={16} style={{ color: '#88aaff' }} />
        </button>

        {/* Drag handle */}
        <div className="flex justify-center pt-2 cursor-grab active:cursor-grabbing" style={{ position: 'relative', zIndex: 2 }}>
          <div className="w-10 h-1 rounded-full" style={{ background: '#4400ff', opacity: 0.8 }} />
        </div>

        {/* Portrait + name */}
        <div className="flex flex-col items-center pt-3 pb-3 px-5" style={{ position: 'relative', zIndex: 2 }}>
          <LightningAvatar speaking={speaking} />
          <h3 className="font-black text-xl tracking-widest mt-2 mb-0" style={{ color: speaking ? '#ff88ff' : '#88aaff', textShadow: '0 0 16px #4400ff', transition: 'color 0.3s' }}>
            ZARA 👁️
          </h3>
          <p className="font-black text-xs tracking-widest" style={{ color: '#00ff41', fontSize: '9px', letterSpacing: '0.12em' }}>
            {speaking ? '🎙 SPEAKING...' : 'ZENITH APEX AI · RESEARCH ASSISTANT'}
          </p>
        </div>

        {/* Quick action pills */}
        <div className="flex gap-2 px-4 pb-2 justify-center" style={{ position: 'relative', zIndex: 2 }}>
          {quickActions.map((a, i) => (
            <button key={i} onClick={a.action}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black transition-all hover:scale-105"
              style={{
                background: (a.label === 'Stop' || (a.label === 'Read page' && speaking)) ? 'rgba(255,68,0,0.2)' : 'rgba(68,0,255,0.25)',
                border: '1px solid rgba(136,170,255,0.5)',
                color: '#e0e0ff',
              }}>
              {a.emoji} {a.label}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex px-4 gap-2 mb-2" style={{ position: 'relative', zIndex: 2 }}>
          {[
            { id: 'chat', icon: <Brain size={12} />, label: 'Chat' },
            { id: 'links', icon: <Zap size={12} />, label: 'Navigate' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-black transition-all"
              style={{
                background: tab === t.id ? 'rgba(68,0,255,0.4)' : 'rgba(0,0,0,0.6)',
                border: tab === t.id ? '1px solid #88aaff' : '1px solid rgba(68,0,255,0.3)',
                color: tab === t.id ? '#e0e0ff' : '#666',
              }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '0 16px 16px' }}>
          {tab === 'chat' ? (
            <>
              {/* Chat messages */}
              <div style={{
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(68,0,255,0.3)',
                borderRadius: '10px',
                height: '180px',
                overflowY: 'auto',
                padding: '10px',
                marginBottom: '10px',
              }}>
                {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
                {thinking && (
                  <div className="flex gap-1 justify-start mb-2">
                    {[0,1,2].map(i => (
                      <div key={i} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: '#88aaff',
                        animation: `pulse 1s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Zara anything... 💜"
                  style={{
                    flex: 1,
                    background: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(68,0,255,0.5)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#e0e0ff',
                    fontSize: '12px',
                    fontFamily: 'sans-serif',
                    outline: 'none',
                    minHeight: '36px',
                  }}
                />
                <button onClick={sendMessage}
                  className="flex items-center justify-center w-9 h-9 rounded-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(68,0,255,0.4)', border: '1px solid #88aaff' }}>
                  <Send size={14} style={{ color: '#88aaff' }} />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {navLinks.map((link, idx) => (
                <Link key={idx} to={link.href}
                  style={{
                    display: 'block', padding: '10px 14px', borderRadius: '8px',
                    background: 'rgba(0,0,0,0.85)', border: '1px solid rgba(68,0,255,0.5)',
                    color: '#e0e0ff', fontSize: '13px', fontFamily: 'sans-serif',
                    fontWeight: '600', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ff41'; e.currentTarget.style.color = '#00ff41'; e.currentTarget.style.background = 'rgba(0,20,0,0.9)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(68,0,255,0.5)'; e.currentTarget.style.color = '#e0e0ff'; e.currentTarget.style.background = 'rgba(0,0,0,0.85)'; }}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}