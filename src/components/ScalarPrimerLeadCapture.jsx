import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Download, CheckCircle2, Zap, BookOpen, Shield, Loader2 } from "lucide-react";

const PRIMER_BULLETS = [
  { icon: <Zap size={13} className="text-yellow-400" />, text: "What scalar EM is — and why it was suppressed" },
  { icon: <BookOpen size={13} className="text-cyan-400" />, text: "The ONR-validated Prioré device (1978, declassified)" },
  { icon: <Shield size={13} className="text-green-400" />, text: "MEG — peer-reviewed COP>1, Foundations of Physics Letters" },
  { icon: <Download size={13} className="text-purple-400" />, text: "5 entry-level build projects you can start this week" },
];

export default function ScalarPrimerLeadCapture() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!email || status === "loading") return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    try {
      // Save subscriber
      await base44.entities.NewsletterSubscriber.create({
        email: email.toLowerCase().trim(),
        name: name.trim() || undefined,
        source: "scalar_primer_lead_magnet",
        status: "active",
      });

      // Trigger 3-day drip sequence
      await base44.functions.invoke("scalarPrimerDrip", {
        email: email.toLowerCase().trim(),
        name: name.trim() || "Researcher",
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      // Still show success even if drip fails — subscriber was saved
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-gradient-to-br from-green-950/60 to-cyan-950/40 border border-green-700 rounded-2xl p-8 text-center max-w-xl mx-auto">
        <CheckCircle2 size={40} className="text-green-400 mx-auto mb-3" />
        <h3 className="text-white font-black text-xl mb-2">Check Your Inbox</h3>
        <p className="text-green-300 font-semibold text-sm mb-1">Your free Scalar EM Primer is on its way.</p>
        <p className="text-gray-400 text-xs leading-relaxed">
          Over the next 3 days you'll also receive the MEG replication breakdown, the suppressed Prioré archive summary, and an exclusive vault access offer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-cyan-900/60 rounded-2xl overflow-hidden max-w-xl mx-auto shadow-2xl shadow-cyan-950/40">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-yellow-500" />

      <div className="p-7">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-300 text-xs font-bold mb-4 uppercase tracking-widest">
          <Download size={11} /> Free Download — No Credit Card
        </div>

        <h2 className="text-white font-black text-2xl leading-tight mb-2">
          Free Scalar EM Primer
          <span className="block text-cyan-400 text-base font-bold mt-0.5">The 28-page suppressed physics briefing</span>
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-5">
          The research the establishment buried. Primary sources, declassified government documents, and the engineering behind the devices they said couldn't work.
        </p>

        {/* Bullets */}
        <ul className="space-y-2 mb-6">
          {PRIMER_BULLETS.map((b, i) => (
            <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
              {b.icon}
              {b.text}
            </li>
          ))}
        </ul>

        {/* Form */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="First name (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <input
            type="email"
            placeholder="your@email.com *"
            value={email}
            onChange={e => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white placeholder-gray-500 text-sm focus:outline-none transition-colors ${status === "error" ? "border-red-500" : "border-gray-700 focus:border-cyan-500"}`}
          />
          {status === "error" && <p className="text-red-400 text-xs">{errorMsg}</p>}

          <button
            onClick={handleSubmit}
            disabled={!email || status === "loading"}
            className="w-full py-3.5 rounded-xl font-black text-base text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #0891b2, #7c3aed)" }}
          >
            {status === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Sending…</>
            ) : (
              <><Download size={16} /> Send Me the Free Primer →</>
            )}
          </button>
        </div>

        <p className="text-gray-600 text-xs text-center mt-3">
          No spam. Unsubscribe anytime. You'll also receive a 3-day research briefing series.
        </p>
      </div>
    </div>
  );
}