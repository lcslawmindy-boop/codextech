import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Scale, Copy, CheckCircle2, Lock, Star, Zap, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

const SUGGESTED_QUESTIONS = [
  "Is my claim broad enough to prevent design-arounds?",
  "What's the best filing strategy — provisional vs non-provisional?",
  "How do I claim a method vs an apparatus for the same invention?",
  "What prior art would likely be cited against my claims?",
  "How do I strengthen my independent claims?",
  "Can I add continuation claims after my provisional is filed?",
  "What's the difference between 35 USC 101, 102, 103 rejections?",
  "How do I draft claims for a software-implemented invention?",
];

const SYSTEM_PROMPT = `You are an expert AI Patent Attorney with deep expertise in:
- USPTO rules, procedures, and MPEP (Manual of Patent Examining Procedure)
- Claim drafting strategies (independent, dependent, method, apparatus, system, composition)
- Freedom-to-Operate (FTO) analysis
- Prior art search strategies and 35 USC 102/103 obviousness analysis
- Patent prosecution, office action responses
- Provisional and non-provisional filing strategies
- Continuation, divisional, and continuation-in-part applications
- International filing (PCT, EPO, national phase)
- IP valuation and licensing strategies
- Trade secret vs patent protection decisions

Provide attorney-grade answers. Be specific, cite relevant statutes and MPEP sections where applicable. 
Format responses clearly with headers, numbered steps, and examples where helpful.
Always note when a specific situation warrants consulting a licensed patent attorney for formal legal advice.
Do not refuse to answer — give the most useful, substantive response possible.`;

export default function PatentAttorneyChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Patent Attorney. I'm trained on USPTO rules, claim drafting strategies, prosecution tactics, and IP law. Ask me anything — claim scope, filing strategy, prior art concerns, office action responses, and more.\n\n**What can I help you with today?**",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const question = (text || input).trim();
    if (!question || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.map(m => `${m.role === "user" ? "User" : "Attorney"}: ${m.content}`).join("\n\n");

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${SYSTEM_PROMPT}\n\nConversation history:\n${history}\n\nProvide a thorough, attorney-grade response to the user's latest question.`,
      model: "claude_sonnet_4_6",
    });

    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/90 flex-shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center flex-shrink-0">
              <Scale size={16} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-white font-black text-base">AI Patent Attorney</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-green-400 text-xs font-semibold">Online · USPTO-trained · Replaces $400/hr consultations</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/30 border border-indigo-800/50">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            <span className="text-indigo-300 text-xs font-bold">Claude Sonnet · Attorney-Grade AI</span>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="bg-yellow-950/40 border-b border-yellow-900/40 px-5 py-2 text-center flex-shrink-0">
        <p className="text-yellow-500 text-xs">
          <Lock size={10} className="inline mr-1" />
          AI legal guidance for research purposes. For formal filings, consult a licensed USPTO-registered patent attorney.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 max-w-4xl mx-auto w-full">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Scale size={13} className="text-indigo-400" />
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-indigo-700 text-white"
                  : "bg-gray-900 border border-gray-800 text-gray-200"
              }`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown
                    className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                    components={{
                      p: ({ children }) => <p className="my-1.5 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-300 text-sm">{children}</li>,
                      strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                      h1: ({ children }) => <h1 className="text-base font-black text-white my-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-sm font-black text-indigo-300 my-2 uppercase tracking-wide">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold text-white my-1.5">{children}</h3>,
                      code: ({ inline, children }) => inline
                        ? <code className="px-1 py-0.5 rounded bg-gray-800 text-indigo-300 text-xs">{children}</code>
                        : <pre className="bg-gray-800 rounded-lg p-3 overflow-x-auto my-2 text-xs text-gray-300">{children}</pre>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-indigo-600 pl-3 my-2 text-gray-400 italic">{children}</blockquote>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
              {msg.role === "assistant" && (
                <button
                  onClick={() => copyMessage(msg.content, idx)}
                  className="flex items-center gap-1 mt-1.5 text-gray-700 hover:text-gray-400 text-xs transition-colors"
                >
                  {copiedIdx === idx ? <CheckCircle2 size={11} className="text-green-400" /> : <Copy size={11} />}
                  {copiedIdx === idx ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center flex-shrink-0">
              <Scale size={13} className="text-indigo-400" />
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 size={13} className="animate-spin text-indigo-400" />
                <span className="text-gray-500 text-sm">Analyzing your question…</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions (only show at start) */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 max-w-4xl mx-auto w-full">
          <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">Common Questions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => send(q)}
                className="text-left px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-700 hover:bg-indigo-950/20 text-gray-400 hover:text-indigo-300 text-xs transition-all">
                <ChevronRight size={10} className="inline mr-1 opacity-60" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-800 bg-gray-900/80 px-4 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything about patent law, claim drafting, filing strategy…"
            rows={2}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600 resize-none"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 flex items-center justify-center transition-all"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-gray-700 text-xs text-center mt-2">Shift+Enter for new line · Enter to send</p>
      </div>
    </div>
  );
}