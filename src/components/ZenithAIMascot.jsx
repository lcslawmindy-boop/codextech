import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Loader2, BookOpen, Zap, Lightbulb, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';

export default function ZenithAIMascot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey! I\'m ZARA, your Zenith Apex research assistant. Need help navigating the platform or have questions about electromagnetics?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are ZARA, a friendly AI mascot for Zenith Apex Technology. You help users navigate the research platform, explain electromagnetic concepts, and provide guidance on features. Keep responses concise and helpful. User asks: ${userMsg}`,
        add_context_from_internet: false,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  const ui = (
    <motion.div 
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        setPosition({ x: position.x + info.offset.x, y: position.y + info.offset.y });
      }}
      style={{ x: position.x, y: position.y }}
      className="fixed bottom-24 right-6 z-[9991]"
    >
      {open && (
        <div
          className="mb-3 rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
          style={{
            background: 'rgba(0,0,20,0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(0,220,255,0.6)',
            width: 320,
            height: 420,
            boxShadow: '0 0 30px rgba(0,220,255,0.5), inset 0 0 20px rgba(0,200,255,0.1)',
          }}
        >
          <div className="flex items-center justify-between p-3 border-b border-cyan-700/30">
            <div>
              <h3 className="font-black text-cyan-300 text-sm">ZARA Assistant</h3>
              <p className="text-xs text-gray-500">Zenith Research AI</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-cyan-900/20 rounded transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 1 && (
              <div className="space-y-2">
                <div className="text-xs text-gray-400 font-semibold mb-3">Quick navigation:</div>
                <NavLink to="/free-vault" icon={<BookOpen size={12} />} label="Research Archive" />
                <NavLink to="/courses" icon={<Zap size={12} />} label="Courses" />
                <NavLink to="/invention-plans" icon={<Lightbulb size={12} />} label="Build Plans" />
                <NavLink to="/patent-attorney-chat" icon={<Zap size={12} />} label="Patent Tools" />
                <NavLink to="/ip-marketplace" icon={<Users size={12} />} label="IP Marketplace" />
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="rounded-lg px-3 py-2 max-w-[80%] text-xs"
                  style={{
                    background: msg.role === 'user' ? 'rgba(0,220,255,0.2)' : 'rgba(80,200,255,0.1)',
                    color: msg.role === 'user' ? '#00ffff' : '#a0d8ff',
                    borderLeft: `2px solid ${msg.role === 'user' ? '#00ffff' : '#00d4ff'}`,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <Loader2 size={14} className="text-cyan-400 animate-spin" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t border-cyan-700/30 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ZARA..."
              className="flex-1 px-2 py-1 rounded text-xs bg-gray-900 border border-cyan-700/30 text-cyan-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-1 rounded hover:bg-cyan-900/30 transition-colors disabled:opacity-50"
            >
              <Send size={14} className="text-cyan-400" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(0,220,255,0.8), rgba(0,180,255,0.6))',
          border: '2px solid rgba(0,220,255,0.9)',
          color: '#fff',
          boxShadow: '0 0 20px rgba(0,220,255,0.8)',
        }}
      >
        {open ? '✕' : 'ζ'}
      </button>
    </motion.div>
  );

  return createPortal(ui, document.body);
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-3 py-2 rounded bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700/40 text-cyan-300 hover:text-cyan-100 transition-all text-xs font-semibold"
    >
      {icon}
      {label}
    </Link>
  );
}