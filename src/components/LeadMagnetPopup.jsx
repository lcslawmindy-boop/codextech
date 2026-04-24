/**
 * LeadMagnetPopup — Smart email capture with behavioral triggers.
 * Props:
 *   trigger: "time" | "scroll" | "exit" | "build_view"
 *   magnetId: "meg_blueprint" | "prior_art_sample" | "patent_checklist"
 *   onDismiss: fn
 *   onCapture: fn(email)
 */
import { useState, useEffect } from "react";
import { X, Check, ArrowRight, Download, Zap, Lock, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MAGNETS = {
  meg_blueprint: {
    id: "meg_blueprint",
    emoji: "⚡",
    title: "The MEG Blueprint",
    subtitle: "Free engineering breakdown — no signup wall",
    hook: "The peer-reviewed, patent-backed free energy device the mainstream suppressed in 2002.",
    deliverable: "8-page engineering PDF",
    bullets: [
      "Full schematic from US Patent 6,362,718",
      "Component list with exact specs",
      "3 failure points most builders miss",
      "Why COP>1 doesn't violate thermodynamics",
    ],
    ctaLabel: "Send Me the MEG Blueprint →",
    subLabel: "Instant delivery · No spam · Unsubscribe anytime",
    color: "#f59e0b",
    source: "meg_blueprint_popup",
  },
  prior_art_sample: {
    id: "prior_art_sample",
    emoji: "🗂️",
    title: "5 Suppressed Inventions — Primary Source Pack",
    subtitle: "What they patented. What they buried. The receipts.",
    hook: "Tesla, Moray, Gray, Priore, Searl — patent numbers, government documents, lab results.",
    deliverable: "Sourced reference PDF",
    bullets: [
      "5 inventors with full primary source citations",
      "Patent numbers, dates, and outcome records",
      "Why each one was suppressed (documented)",
      "What you can build from each today",
    ],
    ctaLabel: "Send Me the Source Pack →",
    subLabel: "Instant delivery · No spam · Unsubscribe anytime",
    color: "#8b5cf6",
    source: "prior_art_popup",
  },
  patent_checklist: {
    id: "patent_checklist",
    emoji: "🛡️",
    title: "The Inventor's Patent Checklist",
    subtitle: "What your attorney won't tell you until it's too late.",
    hook: "17 questions to answer before filing your provisional. Skipping even one can invalidate your IP.",
    deliverable: "Interactive PDF checklist",
    bullets: [
      "17 pre-filing validation questions",
      "Prior art search methodology",
      "Claim drafting red flags to avoid",
      "How to file a bulletproof provisional for <$500",
    ],
    ctaLabel: "Send Me the Checklist →",
    subLabel: "Instant delivery · No spam · Unsubscribe anytime",
    color: "#22c55e",
    source: "patent_checklist_popup",
  },
};

const TRIGGER_CONTEXT = {
  time:       { badge: "Free Download", urgency: null },
  scroll:     { badge: "Before You Go Deeper…", urgency: "You're clearly interested — get the full source pack." },
  exit:       { badge: "Wait — Don't Leave Empty-Handed", urgency: "Grab this before you go. Takes 10 seconds." },
  build_view: { badge: "You're Viewing This Build Plan", urgency: "Get the engineering breakdown delivered to your inbox." },
};

export default function LeadMagnetPopup({ trigger = "time", magnetId = "meg_blueprint", onDismiss, onCapture }) {
  const magnet = MAGNETS[magnetId] || MAGNETS.meg_blueprint;
  const ctx = TRIGGER_CONTEXT[trigger] || TRIGGER_CONTEXT.time;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!email || submitting) return;
    setError(null);
    setSubmitting(true);
    
    try {
      await base44.entities.NewsletterSubscriber.create({
        email,
        source: magnet.source,
        status: "active",
      });
      
      // Track conversion
      base44.analytics.track({
        eventName: "lead_magnet_captured",
        properties: {
          magnet_id: magnetId,
          trigger_type: trigger,
          email: email,
        }
      }).catch(() => {}); // Silent fail on analytics
      
      setSubmitted(true);
      setSubmitting(false);
      
      // Call optional callback
      if (onCapture) onCapture(email);
      
      setTimeout(() => { if (onDismiss) onDismiss(); }, 3500);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center p-4 animate-in fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95">

        {/* Color bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${magnet.color}, transparent)` }} />

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider"
              style={{ backgroundColor: `${magnet.color}20`, color: magnet.color }}>
              {ctx.badge}
            </span>
          </div>
          <button onClick={onDismiss} className="text-gray-600 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Magnet */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ backgroundColor: `${magnet.color}15`, border: `1px solid ${magnet.color}30` }}>
              {magnet.emoji}
            </div>
            <div>
              {ctx.urgency && <p className="text-gray-400 text-xs mb-1 italic">{ctx.urgency}</p>}
              <h3 className="text-white font-black text-lg leading-tight">{magnet.title}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{magnet.deliverable}</p>
            </div>
          </div>

          {/* Hook */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">"{magnet.hook}"</p>

          {/* Bullets */}
          {!submitted && (
            <div className="space-y-1.5 mb-5">
              {magnet.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <Check size={11} className="flex-shrink-0 mt-0.5" style={{ color: magnet.color }} /> {b}
                </div>
              ))}
            </div>
          )}

          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: `${magnet.color}20` }}>
                <Check size={22} style={{ color: magnet.color }} />
              </div>
              <p className="text-white font-black text-base mb-1">On its way — check your inbox.</p>
              <p className="text-gray-500 text-xs">While you wait — the free vault has 3 full build previews.</p>
            </div>
          ) : (
            <>
              {/* Email form */}
                  <div className="flex flex-col gap-2.5 mb-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(null); }}
                      onKeyDown={e => e.key === "Enter" && handleSubmit()}
                      disabled={submitting}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-800 border text-white placeholder-gray-600 text-sm focus:outline-none transition-colors ${
                        error ? "border-red-500 focus:border-red-500" : "border-gray-700 focus:border-cyan-500"
                      }`}
                    />

                    {/* Error message */}
                    {error && (
                      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-950/30 border border-red-800/50">
                        <AlertCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-300 text-xs">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || !email}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-black transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: magnet.color }}>
                      <Download size={14} />
                      {submitting ? "Sending…" : magnet.ctaLabel}
                    </button>
                  </div>
                  <p className="text-center text-gray-600 text-xs">{magnet.subLabel}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook: useLeadMagnetTrigger
 * Manages timing, scroll, and exit-intent triggers.
 * Returns: { show, trigger, dismiss }
 */
export function useLeadMagnetTrigger({
  timeDelay = 45000,    // ms before time trigger fires
  scrollPct = 60,       // % scroll before scroll trigger fires
  exitIntent = true,    // enable exit intent
  storageKey = "zarp_lm_dismissed", // prevents reshowing after dismiss
}) {
  const [show, setShow] = useState(false);
  const [trigger, setTrigger] = useState("time");

  useEffect(() => {
    // Don't show if already dismissed in this session
    if (sessionStorage.getItem(storageKey)) return;

    let fired = false;
    const fire = (t) => {
      if (fired) return;
      fired = true;
      setTrigger(t);
      setShow(true);
    };

    // Time trigger
    const timer = setTimeout(() => fire("time"), timeDelay);

    // Scroll trigger
    const onScroll = () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= scrollPct) fire("scroll");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Exit intent (desktop only)
    const onMouseLeave = (e) => {
      if (exitIntent && e.clientY <= 0) fire("exit");
    };
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(storageKey, "1");
    setShow(false);
  };

  return { show, trigger, dismiss };
}