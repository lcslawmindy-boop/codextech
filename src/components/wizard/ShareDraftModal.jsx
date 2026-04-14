import { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  X, Link2, Copy, CheckCircle2, Loader2, Clock, MessageSquare,
  Shield, Trash2, Eye, AlertCircle
} from "lucide-react";

const EXPIRY_OPTIONS = [
  { label: "24 hours", hours: 24 },
  { label: "3 days", hours: 72 },
  { label: "7 days", hours: 168 },
  { label: "30 days", hours: 720 },
];

export default function ShareDraftModal({ doc, onClose }) {
  const [expiresIn, setExpiresIn] = useState(72);
  const [allowComments, setAllowComments] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [token, setToken] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!doc.title?.trim()) {
      setError("Please add a title to your patent draft before sharing.");
      return;
    }
    setLoading(true);
    setError(null);
    const res = await base44.functions.invoke("sharedPatentDraft", {
      action: "create",
      document: doc,
      expiresInHours: expiresIn,
      allowComments,
    });
    const { token } = res.data;
    const url = `${window.location.origin}/patent-review/${token}`;
    setShareUrl(url);
    setToken(token);
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const revoke = async () => {
    setRevoking(true);
    await base44.functions.invoke("sharedPatentDraft", { action: "revoke", token });
    setRevoked(true);
    setRevoking(false);
  };

  const expiresAt = expiresIn
    ? new Date(Date.now() + expiresIn * 3600000).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-indigo-400" />
            <h2 className="text-white font-black text-base">Share Patent Draft</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Draft info */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Sharing</p>
            <p className="text-white font-bold text-sm">{doc.title || "Untitled Patent Draft"}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {(doc.claims?.independent || []).filter(c => c.trim()).length} independent claims ·{" "}
              {(doc.claims?.dependent || []).filter(c => c.trim()).length} dependent claims
            </p>
          </div>

          {!shareUrl ? (
            <>
              {/* Expiry */}
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                  <Clock size={11} /> Link Expiry
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {EXPIRY_OPTIONS.map(opt => (
                    <button key={opt.hours} onClick={() => setExpiresIn(opt.hours)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        expiresIn === opt.hours
                          ? "bg-indigo-900/60 border-indigo-600 text-white"
                          : "border-gray-700 text-gray-400 hover:border-gray-600"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allow comments */}
              <div>
                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                  <MessageSquare size={11} /> Reviewer Options
                </label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3">
                  <div
                    onClick={() => setAllowComments(v => !v)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      allowComments ? "bg-indigo-600 border-indigo-600" : "border-gray-600"
                    }`}>
                    {allowComments && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Allow reviewers to add comments</p>
                    <p className="text-gray-500 text-xs">Attorneys and co-inventors can annotate specific sections</p>
                  </div>
                </label>
              </div>

              {/* Security notice */}
              <div className="flex items-start gap-2 bg-blue-950/20 border border-blue-900/30 rounded-xl p-3">
                <Shield size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300/70 text-xs leading-relaxed">
                  The link is cryptographically secure and time-limited. Anyone with the link can view the draft — do not share publicly. The link can be revoked at any time.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-950/30 border border-red-800 rounded-xl px-4 py-3">
                  <AlertCircle size={13} className="text-red-400" />
                  <p className="text-red-300 text-xs">{error}</p>
                </div>
              )}

              <button onClick={generate} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-black text-sm transition-all disabled:opacity-60">
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Link2 size={15} />}
                {loading ? "Generating secure link…" : "Generate Share Link"}
              </button>
            </>
          ) : revoked ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-red-900/40 border border-red-700 flex items-center justify-center mx-auto mb-3">
                <Shield size={20} className="text-red-400" />
              </div>
              <p className="text-white font-black text-base mb-1">Link Revoked</p>
              <p className="text-gray-500 text-sm">The share link is now invalid. No one can access this draft.</p>
            </div>
          ) : (
            <>
              <div className="bg-green-950/20 border border-green-800/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-green-400" />
                  <p className="text-green-300 font-black text-sm">Share link generated</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5">
                  <p className="text-gray-300 text-xs flex-1 truncate font-mono">{shareUrl}</p>
                  <button onClick={copy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold flex-shrink-0 transition-all">
                    {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 text-center">
                  <Clock size={13} className="text-gray-500 mx-auto mb-1" />
                  <p className="text-gray-500 mb-0.5">Expires</p>
                  <p className="text-white font-bold">{expiresAt}</p>
                </div>
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-3 text-center">
                  <MessageSquare size={13} className="text-gray-500 mx-auto mb-1" />
                  <p className="text-gray-500 mb-0.5">Comments</p>
                  <p className="text-white font-bold">{allowComments ? "Enabled" : "Disabled"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-yellow-950/20 border border-yellow-800/30 rounded-xl p-3">
                <Eye size={12} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-300/70 text-xs">Share this link with your patent attorney or co-inventors. They can view the full draft and add comments without creating an account.</p>
              </div>

              <button onClick={revoke} disabled={revoking}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-800 text-red-400 hover:bg-red-950/30 text-xs font-bold transition-all disabled:opacity-50">
                {revoking ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                {revoking ? "Revoking…" : "Revoke this link"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}