import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminPromoBlast() {
  const [subject, setSubject] = useState('🔥 72-Hour Flash Sale: Build Kits Up to 30% Off (Member Exclusive)');
  const [body, setBody] = useState(`Hi [Member],

**MEMBER EXCLUSIVE 72-HOUR FLASH SALE** 🔥

Your Zenith Apex membership unlocks early access to our biggest sale of the quarter.

✨ **What's On Sale:**
→ TRZ Reactor Starter: $389 → $311 (20% OFF)
→ Prioré Device Bundle: $349 → $279 (20% OFF)
→ MEG Replication Kit: $287 → $230 (20% OFF)
→ TRD-1 Telomere Device: $194 → $165 (15% OFF)
→ Anenergy Course: $197 → $148 (25% OFF)

💼 **Bundle Deals (Biggest Savings):**
→ Reactor Master Bundle: Save $240+
→ Biotech Longevity Bundle: Save $200+

⏰ **Sale Ends In 72 Hours** — Limited quantities available.

🛒 **Start Shopping Now:**
Visit: https://zarp.ai/flash-sale

All products include detailed build guides, sourcing lists, and member support.
30-day satisfaction guarantee on all orders.

— Zenith Apex Team`);

  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendBlast = async () => {
    setSending(true);
    setResult(null);

    try {
      const response = await base44.functions.invoke('sendPromoBulkEmail', {
        promo_subject: subject,
        promo_body: body,
        discount_percent: 20
      });

      setResult({
        success: true,
        sent: response.data.sent_count,
        total: response.data.total_members,
        errors: response.data.errors
      });
    } catch (err) {
      setResult({
        success: false,
        error: err.message
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-5 py-3 flex items-center gap-4 flex-shrink-0">
        <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
          <ArrowLeft size={14} /> Admin Hub
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-black text-base">Promo Email Blast</h1>
          <p className="text-gray-500 text-xs">Send promotional email to all active members</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Editor */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-gray-400 text-xs font-black uppercase tracking-widest block mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600"
              placeholder="Email subject line"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-black uppercase tracking-widest block mb-2">
              Email Body
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={12}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-600 resize-none"
              placeholder="Email content..."
            />
            <p className="text-gray-600 text-xs mt-2">
              Tip: Use [Member] or [Name] as placeholders for personalization
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-3">Preview</p>
          <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700 space-y-2">
            <div>
              <p className="text-gray-600 text-xs uppercase tracking-wider">Subject:</p>
              <p className="text-white text-sm font-bold">{subject}</p>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <p className="text-gray-600 text-xs uppercase tracking-wider mb-2">Body Preview:</p>
              <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-line">
                {body.substring(0, 300)}...
              </p>
            </div>
          </div>
        </div>

        {/* Send button & status */}
        {result && (
          <div className={`border rounded-2xl p-5 ${
            result.success
              ? 'bg-green-950/30 border-green-700'
              : 'bg-red-950/30 border-red-700'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                {result.success ? (
                  <>
                    <p className="text-green-300 font-bold">Emails sent successfully!</p>
                    <p className="text-green-400 text-sm mt-1">
                      Sent to {result.sent} of {result.total} members
                    </p>
                    {result.errors && result.errors.length > 0 && (
                      <p className="text-yellow-300 text-xs mt-2">
                        {result.errors.length} emails failed to send
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-red-300 font-bold">Error sending emails</p>
                    <p className="text-red-400 text-sm mt-1">{result.error}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSendBlast}
          disabled={sending || !subject.trim() || !body.trim()}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-700 to-red-700 hover:from-orange-600 hover:to-red-600 disabled:opacity-40 text-white font-black text-base transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Sending to all members...
            </>
          ) : (
            <>
              <Send size={18} />
              Send Email Blast to All Members
            </>
          )}
        </button>

        <p className="text-gray-600 text-xs text-center">
          This will send to all users with status = "converted" in the BetaApplication entity.
        </p>
      </div>
    </div>
  );
}