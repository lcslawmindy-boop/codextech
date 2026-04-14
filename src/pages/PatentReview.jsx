import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Shield, Loader2, AlertCircle, Clock, MessageSquare,
  CheckCircle2, Send, ChevronDown, ChevronUp, FileText
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const SECTIONS = [
  "General", "Title", "Abstract", "Background", "Summary",
  "Detailed Description", "Claims — Independent", "Claims — Dependent", "Drawings"
];

function CommentThread({ comments, section }) {
  const filtered = comments.filter(c => c.section === section || section === "All");
  if (!filtered.length) return null;
  return (
    <div className="space-y-2 mt-3">
      {filtered.map(c => (
        <div key={c.id} className="bg-indigo-950/20 border border-indigo-800/30 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-indigo-400 text-xs font-black">{c.author}</span>
            <span className="text-gray-600 text-xs">·</span>
            <span className="text-gray-600 text-xs">{new Date(c.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
            {c.section !== "General" && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">{c.section}</span>
            )}
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{c.text}</p>
        </div>
      ))}
    </div>
  );
}

function SectionBlock({ title, content, comments, allowComments, onAddComment }) {
  const [open, setOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const sectionComments = comments.filter(c => c.section === title);

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await onAddComment({ section: title, text, author });
    setText("");
    setDone(true);
    setSubmitting(false);
    setTimeout(() => { setDone(false); setShowForm(false); }, 2000);
  };

  if (!content) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/40 transition-colors">
        <div className="flex items-center gap-3">
          <FileText size={14} className="text-indigo-400" />
          <span className="text-white font-black text-sm">{title}</span>
          {sectionComments.length > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/40">
              <MessageSquare size={9} /> {sectionComments.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-800">
          <div className="mt-4 bg-gray-950/60 rounded-xl px-4 py-4">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>

          <CommentThread comments={comments} section={title} />

          {allowComments && (
            <div className="mt-3">
              {!showForm ? (
                <button onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                  <MessageSquare size={11} /> Add comment on {title}
                </button>
              ) : done ? (
                <p className="text-green-400 text-xs flex items-center gap-1.5">
                  <CheckCircle2 size={11} /> Comment added
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  <input value={author} onChange={e => setAuthor(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none" />
                  <div className="flex gap-2">
                    <textarea value={text} onChange={e => setText(e.target.value)} rows={2}
                      placeholder={`Comment on ${title}…`}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none resize-none" />
                    <div className="flex flex-col gap-1">
                      <button onClick={submit} disabled={submitting || !text.trim()}
                        className="px-3 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-white disabled:opacity-50 transition-all">
                        {submitting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                      </button>
                      <button onClick={() => setShowForm(false)}
                        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-500 hover:text-white text-xs transition-all">✕</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PatentReview() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState(null);
  const [generalComment, setGeneralComment] = useState("");
  const [generalAuthor, setGeneralAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    base44.functions.invoke("sharedPatentDraft", { action: "get", token })
      .then(res => setDraft(res.data.draft))
      .catch(err => setError(err?.response?.data?.error || "This link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [token]);

  const addComment = async ({ section, text, author }) => {
    const res = await base44.functions.invoke("sharedPatentDraft", {
      action: "comment", token, section, text, author,
    });
    // Optimistically add to local state
    setDraft(d => ({ ...d, comments: [...(d.comments || []), res.data.comment] }));
  };

  const submitGeneral = async () => {
    if (!generalComment.trim()) return;
    setSubmitting(true);
    await addComment({ section: "General", text: generalComment, author: generalAuthor });
    setGeneralComment("");
    setGeneralAuthor("");
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-indigo-400" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-900/30 border border-red-800 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-400" />
        </div>
        <h1 className="text-white font-black text-xl mb-2">Link Unavailable</h1>
        <p className="text-gray-400 text-sm leading-relaxed">{error}</p>
      </div>
    </div>
  );

  const doc = draft.document;
  const comments = draft.comments || [];
  const indClaims = (doc.claims?.independent || []).filter(c => c.trim());
  const depClaims = (doc.claims?.dependent || []).filter(c => c.trim());
  const expiresAt = new Date(draft.expires_at);
  const hoursLeft = Math.max(0, Math.round((expiresAt - Date.now()) / 3600000));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-900/90 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={13} className="text-indigo-400" />
                <span className="text-indigo-400 text-xs font-black uppercase tracking-wider">Secure Patent Draft Review</span>
              </div>
              <h1 className="text-white font-black text-lg leading-tight">{doc.title || "Untitled Patent Draft"}</h1>
              {doc.inventors?.filter(i => i.name.trim()).length > 0 && (
                <p className="text-gray-500 text-xs mt-0.5">
                  Inventor(s): {doc.inventors.filter(i => i.name.trim()).map(i => i.name).join(", ")}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 text-right">
              <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                hoursLeft < 12 ? "bg-red-900/40 text-red-400 border border-red-800" : "bg-gray-800 text-gray-400 border border-gray-700"
              }`}>
                <Clock size={11} />
                {hoursLeft < 1 ? "Expires soon" : hoursLeft < 24 ? `${hoursLeft}h remaining` : `${Math.round(hoursLeft / 24)}d remaining`}
              </div>
              <p className="text-gray-700 text-xs mt-1">{draft.view_count} view{draft.view_count !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span>{indClaims.length} independent claim{indClaims.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{depClaims.length} dependent claim{depClaims.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
            {draft.allow_comments && (
              <>
                <span>·</span>
                <span className="text-indigo-400 flex items-center gap-1"><MessageSquare size={10} /> Comments enabled</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-2">
        {/* Reviewer notice */}
        <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
          <Shield size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-black text-sm mb-0.5">Confidential Patent Draft</p>
            <p className="text-blue-300/60 text-xs leading-relaxed">
              This document is shared for review purposes only. Do not distribute this link. All content is proprietary and subject to attorney-client privilege and/or co-inventor confidentiality. This is a pre-filing draft, not a filed patent application.
            </p>
          </div>
        </div>

        <SectionBlock title="Abstract" content={doc.abstract} comments={comments} allowComments={draft.allow_comments} onAddComment={addComment} />
        <SectionBlock title="Background" content={doc.background} comments={comments} allowComments={draft.allow_comments} onAddComment={addComment} />
        <SectionBlock title="Summary" content={doc.summary} comments={comments} allowComments={draft.allow_comments} onAddComment={addComment} />
        <SectionBlock title="Detailed Description" content={doc.description} comments={comments} allowComments={draft.allow_comments} onAddComment={addComment} />

        {/* Claims */}
        {(indClaims.length > 0 || depClaims.length > 0) && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
            <div className="px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-indigo-400" />
                <span className="text-white font-black text-sm">Claims</span>
                <span className="text-xs text-gray-500">{indClaims.length + depClaims.length} total</span>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              {indClaims.map((claim, i) => (
                <div key={i} className="bg-gray-950/60 rounded-xl px-4 py-4">
                  <p className="text-indigo-400 text-xs font-black uppercase tracking-wider mb-2">Claim {i + 1} — Independent</p>
                  <p className="text-gray-200 text-sm leading-relaxed font-mono">{claim}</p>
                </div>
              ))}
              {depClaims.map((claim, i) => (
                <div key={i} className="bg-gray-950/40 rounded-xl px-4 py-4">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-2">Claim {indClaims.length + i + 1} — Dependent</p>
                  <p className="text-gray-300 text-sm leading-relaxed font-mono">{claim}</p>
                </div>
              ))}
              {/* Comment on claims */}
              {draft.allow_comments && (
                <SectionBlock title="Claims — Independent" content={null} comments={comments} allowComments={draft.allow_comments} onAddComment={addComment} />
              )}
            </div>
          </div>
        )}

        <SectionBlock title="Drawings" content={doc.drawings} comments={comments} allowComments={draft.allow_comments} onAddComment={addComment} />

        {/* General comment box */}
        {draft.allow_comments && (
          <div className="bg-gray-900 border border-indigo-800/30 rounded-2xl p-5 mt-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={15} className="text-indigo-400" />
              <h3 className="text-white font-black text-sm">General Comments</h3>
              {comments.filter(c => c.section === "General").length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800/40">
                  {comments.filter(c => c.section === "General").length}
                </span>
              )}
            </div>

            <CommentThread comments={comments} section="General" />

            <div className="mt-4 space-y-2">
              <input value={generalAuthor} onChange={e => setGeneralAuthor(e.target.value)}
                placeholder="Your name or role (e.g., Patent Attorney, Co-Inventor)"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600" />
              <textarea value={generalComment} onChange={e => setGeneralComment(e.target.value)} rows={4}
                placeholder="Add your overall feedback, suggested revisions, or questions about this draft…"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none" />
              <button onClick={submitGeneral} disabled={submitting || !generalComment.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-black transition-all disabled:opacity-50">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : submitted ? <CheckCircle2 size={14} /> : <Send size={14} />}
                {submitting ? "Submitting…" : submitted ? "Comment added!" : "Submit Comment"}
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-gray-700 text-xs pt-4 pb-8">
          Zenith Apex Patent Drafting Wizard · Confidential · Shared link expires {expiresAt.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}