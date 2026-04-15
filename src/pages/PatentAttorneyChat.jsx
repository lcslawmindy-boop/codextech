import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Scale, Copy, CheckCircle2, Lock, Star, ChevronRight, RotateCcw, BookOpen, Gavel, FileText, Search, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

const QUESTION_CATEGORIES = [
  {
    label: "Claim Drafting",
    icon: <FileText size={13} />,
    color: "#6366f1",
    questions: [
      "How do I draft an independent claim that is both broad and defensible?",
      "What's the difference between method, apparatus, and system claims?",
      "How do I claim a software-implemented invention under 35 USC 101?",
      "How do I write dependent claims that add real value?",
    ],
  },
  {
    label: "Filing Strategy",
    icon: <Gavel size={13} />,
    color: "#22c55e",
    questions: [
      "Should I file a provisional or non-provisional first?",
      "When does it make sense to file a continuation application?",
      "What's the PCT process for international patent protection?",
      "How do I decide between trade secret and patent protection?",
    ],
  },
  {
    label: "Prior Art & FTO",
    icon: <Search size={13} />,
    color: "#f59e0b",
    questions: [
      "How do I conduct a freedom-to-operate analysis?",
      "What prior art would likely be cited against my claims?",
      "What's the difference between 35 USC 102 and 103 rejections?",
      "How do I design around a blocking patent?",
    ],
  },
  {
    label: "Prosecution",
    icon: <BookOpen size={13} />,
    color: "#06b6d4",
    questions: [
      "How do I respond to a 35 USC 103 obviousness rejection?",
      "What's the best strategy for responding to a Final Office Action?",
      "When should I file an RCE vs. appeal to the PTAB?",
      "How do I amend claims without losing priority date?",
    ],
  },
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
Format responses clearly with headers (##), numbered steps, bold key terms, and examples where helpful.
Always note when a specific situation warrants consulting a licensed patent attorney for formal legal advice.
Do not refuse to answer — give the most useful, substantive response possible.`;

export default function PatentAttorneyChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Patent Attorney, powered by Claude Sonnet.\n\nI'm trained on USPTO rules, MPEP procedures, claim drafting strategies, prosecution tactics, and IP law. Ask me anything — or pick a suggested question below.\n\n**How can I help you today?**",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  const clearChat = () => {
    setMessages([{
      role: "assistant",
      content: "Hello! I'm your AI Patent Attorney, powered by Claude Sonnet.\n\nI'm trained on USPTO rules, MPEP procedures, claim drafting strategies, prosecution tactics, and IP law. Ask me anything — or pick a suggested question below.\n\n**How can I help you today?**",
    }]);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900/95 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div className="w-9 h-9 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center flex-shrink-0">
            <Scale size={16} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-white font-black text-sm leading-tight">AI Patent Attorney</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <p className="text-green-400 text-xs font-medium">Online · USPTO-trained</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-indigo-300 text-xs font-bold">Claude Sonnet · Replaces $400/hr</span>
          </div>
          {messages.length > 1 && (
            <button onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-400 hover:text-white text-xs font-bold transition-all">
              <RotateCcw size={11} /> New Chat
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-950/30 border-b border-yellow-900/30 px-5 py-1.5 text-center flex-shrink-0">
        <p className="text-yellow-600 text-xs flex items-center justify-center gap-1.5">
          <Lock size={9} />
          AI guidance for research purposes only. For formal USPTO filings, consult a licensed patent attorney.
        </p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4 space-y-5">

          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Scale size={13} className="text-indigo-400" />
                </div>
              )}
              <div className={`max-w-[88%] ${msg.role === "user" ? "items-end flex flex-col" : "flex flex-col"}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-indigo-700 text-white rounded-tr-sm"
                    : "bg-gray-900 border border-gray-800 text-gray-200 rounded-tl-sm"
                }`}>
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      className="text-sm prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                      components={{
                        p: ({ children }) => <p className="my-1.5 leading-relaxed text-gray-200">{children}</p>,
                        ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="text-gray-300 text-sm leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                        em: ({ children }) => <em className="text-indigo-300 not-italic font-medium">{children}</em>,
                        h1: ({ children }) => <h1 className="text-base font-black text-white my-3 border-b border-gray-700 pb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-black text-indigo-300 my-2.5 uppercase tracking-wide">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold text-white my-2">{children}</h3>,
                        code: ({ inline, children }) => inline
                          ? <code className="px-1.5 py-0.5 rounded bg-gray-800 text-indigo-300 text-xs font-mono">{children}</code>
                          : <pre className="bg-gray-800 rounded-xl p-3 overflow-x-auto my-2 text-xs text-gray-300 font-mono border border-gray-700">{children}</pre>,
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-3 border-indigo-600 pl-3 my-2 text-gray-400 italic bg-indigo-950/20 rounded-r-lg py-1 pr-2">{children}</blockquote>
                        ),
                        hr: () => <hr className="border-gray-700 my-3" />,
                        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline hover:text-indigo-300">{children}</a>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                {msg.role === "assistant" && idx > 0 && (
                  <button
                    onClick={() => copyMessage(msg.content, idx)}
                    className="flex items-center gap-1 mt-1.5 ml-1 text-gray-700 hover:text-gray-400 text-xs transition-colors self-start"
                  >
                    {copiedIdx === idx
                      ? <><CheckCircle2 size={10} className="text-green-400" /> <span className="text-green-400">Copied</span></>
                      : <><Copy size={10} /> Copy</>
                    }
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-900/60 border border-indigo-700 flex items-center justify-center flex-shrink-0">
                <Scale size={13} className="text-indigo-400" />
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-indigo-400" />
                  <span className="text-gray-500 text-sm">Analyzing with Claude Sonnet…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested questions panel */}
      {showSuggestions && (
        <div className="flex-shrink-0 border-t border-gray-800 bg-gray-900/60 px-4 pt-3 pb-1 max-w-3xl mx-auto w-full">
          {/* Category tabs */}
          <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
            {QUESTION_CATEGORIES.map((cat, i) => (
              <button key={i} onClick={() => setActiveCategory(i)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all"
                style={{
                  backgroundColor: activeCategory === i ? cat.color + "20" : "transparent",
                  borderColor: activeCategory === i ? cat.color : "#374151",
                  color: activeCategory === i ? cat.color : "#6b7280",
                }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          {/* Questions for active category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pb-2">
            {QUESTION_CATEGORIES[activeCategory].questions.map((q, i) => (
              <button key={i} onClick={() => send(q)}
                className="text-left px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-700/60 hover:bg-indigo-950/20 text-gray-400 hover:text-indigo-300 text-xs transition-all flex items-start gap-1.5">
                <ChevronRight size={10} className="flex-shrink-0 mt-0.5 opacity-50" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-800 bg-gray-900/90 px-4 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask about claim drafting, filing strategy, prior art, office actions…"
            rows={2}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 placeholder-gray-600 resize-none leading-relaxed"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 flex items-center justify-center transition-all shadow-lg shadow-indigo-900/40"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-gray-700 text-xs text-center mt-1.5">Enter to send · Shift+Enter for new line · Powered by Claude Sonnet</p>
      </div>
    </div>
  );
}