import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Sparkles, HelpCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ZARA_TIPS = [
  { title: "Concept Graph", tip: "Start by exploring the interactive electromagnetic concept network — click nodes to drill into research." },
  { title: "Prior Art Archive", tip: "Search our 200+ documented inventions by category (MEG, Priore, Tesla tech, scalar EM, etc.)" },
  { title: "Invention Forge", tip: "Let AI generate hybrid invention concepts from two archived patents — complete with IP valuations." },
  { title: "Patent Tools", tip: "Draft provisional patents, generate claims, and run FTO analysis — all AI-assisted with USPTO formatting." },
  { title: "Build Plans", tip: "Access 40+ device build plans with full BOMs, circuit schematics, and step-by-step assembly guides." },
  { title: "Courses", tip: "40+ engineering courses on scalar electromagnetics, free energy extraction, and advanced physics." },
  { title: "Monitoring", tip: "Set up custom patent alerts to track competitive threats and new filings in your technology domain." },
  { title: "Investor Tools", tip: "Generate pitch decks, term sheets, and due diligence packages — templates powered by AI." },
];

export default function ZaraAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hey! I'm Zara, your Aethon Apex research guide. Need help navigating the platform?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Get AI response
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Zara, the friendly AI research assistant for Aethon Apex IP — a platform for electromagnetic research, suppressed physics, and invention development.

The user asked: "${userMessage}"

Available platform features to guide them toward:
- Concept Graph (interactive EM research visualization)
- Prior Art Archive (200+ documented inventions)
- Invention Forge (AI hybrid patent generator)
- Patent Suite (drafting, claims, FTO analysis)
- Build Plans (40+ device assembly guides)
- Courses (40+ engineering courses)
- Monitoring Dashboard (patent threat tracking)
- Investor Tools (pitch decks, term sheets, due diligence)

Respond in a friendly, helpful tone. Be specific about which platform feature solves their need. Keep responses to 2-3 sentences max.`,
      });

      setMessages(prev => [...prev, { role: "assistant", text: response }]);
    } catch (err) {
      console.error("Zara error:", err);
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I'm having trouble processing that. Try asking me about a specific platform feature!" }]);
    }
    setLoading(false);
  };

  const handleTipClick = (tip) => {
    setMessages(prev => [
      ...prev,
      { role: "user", text: `Tell me about ${tip.title}` },
      { role: "assistant", text: tip.tip }
    ]);
  };

  return (
    <>
      {/* Matrix Digital Rain Background */}
      <div className="fixed bottom-6 right-6 z-40 w-96 h-auto pointer-events-none">
        {[...Array(8)].map((_, colIndex) => (
          <div
            key={colIndex}
            className="absolute text-green-500 font-mono text-[10px] font-bold opacity-10"
            style={{
              left: `${colIndex * 12}%`,
              animation: `matrixFall ${8 + Math.random() * 6}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
              width: "16px",
              textAlign: "center",
            }}
          >
            {[...Array(40)]
              .map(() => Math.floor(Math.random() * 2))
              .join("\n")}
          </div>
        ))}
      </div>

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle size={16} />
          <span>Zara Assistant</span>
          <Sparkles size={14} className="animate-pulse" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header with Zara - Enhanced as person at computer */}
          <div className="flex items-stretch justify-between bg-gradient-to-r from-cyan-600 to-purple-600 text-white overflow-hidden relative">
            {/* Matrix background in header */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="absolute text-green-400 font-mono text-xs opacity-20" style={{ left: `${i * 25}%`, top: 0 }}>
                  1 0 1 0 1
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 px-5 py-3 flex-1 relative z-10">
              <div className="relative">
                <img
                  src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dce6472fe_WS2-Copy-Copy-Copy.jpg"
                  alt="Zara"
                  className="w-16 h-16 rounded-lg object-cover shadow-lg border-2 border-white/30"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full shadow-lg animate-pulse border-2 border-white" />
              </div>
              <div>
                <p className="font-bold text-base">Zara</p>
                <p className="text-xs opacity-90">AI Research Guide</p>
                <p className="text-[10px] opacity-70 mt-0.5">Studying patents & innovation</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="px-4 hover:bg-white/20 transition-colors relative z-10">
              <X size={16} />
            </button>
          </div>

          {/* Messages with Matrix effect */}
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-950 relative">
            <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute text-green-500 font-mono text-[8px] whitespace-pre"
                  style={{
                    left: `${i * 30}%`,
                    animation: `matrixFall ${6 + i * 2}s linear infinite`,
                    animationDelay: `${i}s`,
                  }}
                >
                  1 0 1 1 0 1 0 1 1 0
                </div>
              ))}
            </div>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} relative z-10`}>
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-100 border border-slate-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start relative z-10">
                <div className="bg-slate-800 text-slate-100 border border-slate-700 px-3 py-2 rounded-lg text-sm">
                  <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse" /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick tips */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/50 max-h-24 overflow-y-auto">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                <HelpCircle size={11} /> Quick Tips
              </p>
              <div className="space-y-1">
                {ZARA_TIPS.slice(0, 3).map((tip, i) => (
                  <button
                    key={i}
                    onClick={() => handleTipClick(tip)}
                    className="w-full text-left text-xs px-2 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    💡 {tip.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-slate-800 bg-slate-900">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && handleSend()}
              placeholder="Ask Zara..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(600px); opacity: 0; }
        }
      `}</style>
    </>
  );
}