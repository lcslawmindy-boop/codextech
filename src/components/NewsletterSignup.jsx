import { useState } from "react";
import { Mail, Loader2, CheckCircle2, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function NewsletterSignup({ source = "landing", compact = false }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    // Check for duplicate
    const existing = await base44.entities.NewsletterSubscriber.filter({ email });
    if (existing.length > 0) {
      setErrorMsg("This email is already subscribed.");
      setStatus("error");
      return;
    }

    await base44.entities.NewsletterSubscriber.create({ email, name, source, status: "active" });

    // Send welcome email
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: "Welcome to the Bearden Research Network",
      body: `Hello${name ? " " + name : ""},\n\nThank you for subscribing to the Bearden Scalar EM Research newsletter.\n\nYou'll receive updates on:\n• New courses and research documents\n• Scalar EM theory breakthroughs\n• Invention kit releases\n• Exclusive subscriber-only content\n\nThe suppressed physics that changes everything — now in your inbox.\n\nBearden Research Network`,
    });

    setStatus("success");
    setEmail("");
    setName("");
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-3 ${compact ? "py-3 px-4 bg-green-950/60 border border-green-800 rounded-xl" : "py-6 px-6 bg-green-950/40 border border-green-800 rounded-2xl"}`}>
        <CheckCircle2 className="text-green-400 flex-shrink-0" size={compact ? 16 : 24} />
        <div>
          <p className={`text-green-300 font-semibold ${compact ? "text-sm" : "text-base"}`}>You're subscribed!</p>
          <p className="text-green-600 text-xs">Check your inbox for a welcome email.</p>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-xl mx-auto text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Zap size={18} className="text-yellow-400" />
        <h3 className="text-white font-bold text-lg">Stay on the Cutting Edge</h3>
      </div>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Get updates on new scalar EM research, course releases, and invention kit drops. No spam — just suppressed physics.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        {errorMsg && (
          <p className="text-red-400 text-xs text-left">{errorMsg}</p>
        )}
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-sm disabled:opacity-60 transition-all"
        >
          {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
          {status === "loading" ? "Subscribing…" : "Subscribe to Research Updates"}
        </button>
      </form>
      <p className="text-gray-600 text-xs mt-3">No spam. Unsubscribe anytime. NDA-bound content.</p>
    </div>
  );
}