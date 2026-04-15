import { useState } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, MessageSquare, Clock, Send, Edit3, CheckCircle2, X, Loader2, Eye, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ROLES = ["inventor", "attorney", "reviewer"];
const ROLE_COLORS = { inventor: "#6366f1", attorney: "#22c55e", reviewer: "#f59e0b" };

const SECTION_KEYS = [
  { key: "title", label: "Title of Invention" },
  { key: "field", label: "Field of Invention" },
  { key: "background", label: "Background" },
  { key: "summary", label: "Summary of Invention" },
  { key: "description", label: "Detailed Description" },
  { key: "claims", label: "Claims" },
  { key: "abstract", label: "Abstract" },
];

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function CommentThread({ comments, sectionKey, onAdd, currentUser }) {
  const [text, setText] = useState("");
  const sectionComments = comments.filter(c => c.section === sectionKey);

  const submit = () => {
    if (!text.trim()) return;
    onAdd({ section: sectionKey, author: currentUser.alias, role: currentUser.role, text, ts: new Date().toISOString(), resolved: false });
    setText("");
  };

  return (
    <div className="border-t border-gray-800 mt-3 pt-3 space-y-2">
      {sectionComments.map((c, i) => (
        <div key={i} className={`flex gap-2 ${c.resolved ? "opacity-40" : ""}`}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ backgroundColor: (ROLE_COLORS[c.role] || "#888") + "30", color: ROLE_COLORS[c.role] || "#888" }}>
            {c.author[0]}
          </div>
          <div className="flex-1 bg-gray-800/60 rounded-xl px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold" style={{ color: ROLE_COLORS[c.role] || "#888" }}>{c.author}</span>
              <span className="text-gray-600 text-xs capitalize">{c.role}</span>
              <span className="text-gray-700 text-xs ml-auto">{timeAgo(c.ts)}</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{c.text}</p>
          </div>
        </div>
      ))}
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="Add comment…"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-600 placeholder-gray-600" />
        <button onClick={submit} disabled={!text.trim()}
          className="px-3 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 disabled:opacity-40 text-white transition-all">
          <Send size={11} />
        </button>
      </div>
    </div>
  );
}

function SectionEditor({ sKey, label, content, onSave, comments, onAddComment, currentUser, canEdit }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(content);
  const [showComments, setShowComments] = useState(false);
  const count = comments.filter(c => c.section === sKey && !c.resolved).length;

  const save = () => {
    onSave(sKey, draft);
    setEditing(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-800/40">
        <p className="text-white font-black text-sm">{label}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowComments(s => !s)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all ${showComments ? "bg-indigo-900/40 border border-indigo-700 text-indigo-300" : "bg-gray-800 text-gray-500 hover:text-gray-300"}`}>
            <MessageSquare size={10} />
            {count > 0 && <span className="text-xs text-yellow-400">{count}</span>}
          </button>
          {canEdit && !editing && (
            <button onClick={() => { setDraft(content); setEditing(true); }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-all">
              <Edit3 size={10} /> Edit
            </button>
          )}
          {editing && (
            <div className="flex gap-1">
              <button onClick={save} className="px-2 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-white text-xs font-bold">Save</button>
              <button onClick={() => setEditing(false)} className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs">Cancel</button>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-3">
        {editing ? (
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={6}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-600 resize-none" />
        ) : (
          <p className={`text-sm leading-relaxed ${content ? "text-gray-300" : "text-gray-700 italic"}`}>
            {content || `No content yet for ${label}.`}
          </p>
        )}
        {showComments && (
          <CommentThread comments={comments} sectionKey={sKey} onAdd={onAddComment} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}

export default function CollabPatentDraft() {
  const [currentUser] = useState({ alias: "InventorA", role: "inventor" });
  const [collaborators] = useState([
    { alias: "InventorA", role: "inventor", online: true },
    { alias: "AttySmith", role: "attorney", online: true },
    { alias: "ReviewerX", role: "reviewer", online: false },
  ]);

  const [sections, setSections] = useState({
    title: "Motionless Electromagnetic Generator with Asymmetric Regauging",
    field: "This invention relates to electromagnetic energy conversion devices, specifically to motionless generators that exploit asymmetric regauging of the local vacuum energy.",
    background: "Conventional electromagnetic generators are limited by Lorentz symmetry constraints that prevent net energy extraction from the vacuum. Existing overunity claims lack rigorous theoretical frameworks.",
    summary: "",
    description: "",
    claims: "",
    abstract: "",
  });

  const [versions, setVersions] = useState([
    { ts: new Date(Date.now() - 7200000).toISOString(), author: "InventorA", note: "Initial draft" },
    { ts: new Date(Date.now() - 3600000).toISOString(), author: "AttySmith", note: "Claim restructuring" },
  ]);

  const [comments, setComments] = useState([
    { section: "claims", author: "AttySmith", role: "attorney", text: "Independent claim 1 is too narrow — the 'motionless' limitation will invite design-arounds. Consider broader functional language.", ts: new Date(Date.now() - 1800000).toISOString(), resolved: false },
    { section: "background", author: "ReviewerX", role: "reviewer", text: "Add cite to Bearden US 6,362,718 here.", ts: new Date(Date.now() - 900000).toISOString(), resolved: false },
  ]);

  const [showVersions, setShowVersions] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiSection, setAiSection] = useState("");

  const canEdit = currentUser.role === "inventor" || currentUser.role === "attorney";

  const saveSection = (key, value) => {
    setSections(p => ({ ...p, [key]: value }));
    setVersions(prev => [...prev, { ts: new Date().toISOString(), author: currentUser.alias, note: `Edited: ${SECTION_KEYS.find(s => s.key === key)?.label}` }]);
  };

  const addComment = (comment) => {
    setComments(prev => [...prev, comment]);
  };

  const generateSection = async (key) => {
    setAiSection(key);
    setGenerating(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an expert USPTO patent attorney. Generate the "${SECTION_KEYS.find(s => s.key === key)?.label}" section for this patent application:

Invention Title: ${sections.title}
Field: ${sections.field}
Background: ${sections.background}
Summary so far: ${sections.summary}

Write a complete, USPTO-compliant ${key} section. Be specific and technically precise. No placeholders.`,
      model: "claude_sonnet_4_6",
    });
    saveSection(key, res);
    setGenerating(false);
    setAiSection("");
  };

  const totalComments = comments.filter(c => !c.resolved).length;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><ArrowLeft size={14} /> Back</Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2"><Users size={14} className="text-indigo-400" /> Collaborative Patent Draft</h1>
            <p className="text-gray-500 text-xs">Multi-user editing · Comment threads · Version history · Role-based access</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Collaborators */}
          <div className="hidden sm:flex items-center gap-1">
            {collaborators.map((c, i) => (
              <div key={i} className="relative">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2"
                  style={{ backgroundColor: (ROLE_COLORS[c.role] || "#888") + "30", borderColor: ROLE_COLORS[c.role] || "#888", color: ROLE_COLORS[c.role] || "#888" }}>
                  {c.alias[0]}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-gray-900 ${c.online ? "bg-green-400" : "bg-gray-600"}`} />
              </div>
            ))}
            {totalComments > 0 && (
              <div className="ml-2 px-2 py-0.5 rounded-full bg-yellow-900/40 border border-yellow-700 text-yellow-400 text-xs font-black">
                {totalComments} open
              </div>
            )}
          </div>
          <button onClick={() => setShowVersions(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-gray-300 text-xs font-bold transition-all">
            <Clock size={11} /> History ({versions.length})
          </button>
        </div>
      </div>

      {/* Version history panel */}
      {showVersions && (
        <div className="border-b border-gray-800 bg-gray-900/60 px-5 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-4 overflow-x-auto">
            {[...versions].reverse().map((v, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2">
                <Clock size={11} className="text-gray-500" />
                <p className="text-gray-400 text-xs">{v.note}</p>
                <p className="text-gray-600 text-xs">{timeAgo(v.ts)}</p>
                <span className="text-xs font-bold" style={{ color: ROLE_COLORS[collaborators.find(c => c.alias === v.author)?.role] || "#888" }}>{v.author}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role legend */}
      <div className="bg-gray-900/40 border-b border-gray-800 px-5 py-2 flex items-center gap-4">
        <span className="text-gray-600 text-xs">Your role:</span>
        <span className="text-xs font-black px-2 py-0.5 rounded-full capitalize"
          style={{ backgroundColor: (ROLE_COLORS[currentUser.role] || "#888") + "25", color: ROLE_COLORS[currentUser.role] || "#888" }}>
          {currentUser.role} ({currentUser.alias})
        </span>
        {!canEdit && <span className="text-gray-600 text-xs flex items-center gap-1"><Eye size={10} /> View only</span>}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-4xl mx-auto w-full space-y-4">
        {SECTION_KEYS.map(s => (
          <div key={s.key} className="relative">
            <SectionEditor
              sKey={s.key}
              label={s.label}
              content={sections[s.key]}
              onSave={saveSection}
              comments={comments}
              onAddComment={addComment}
              currentUser={currentUser}
              canEdit={canEdit}
            />
            {canEdit && !sections[s.key] && (
              <button onClick={() => generateSection(s.key)} disabled={generating}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-900/40 border border-indigo-700 hover:bg-indigo-800/40 text-indigo-300 text-xs font-black transition-all disabled:opacity-40">
                {generating && aiSection === s.key ? <Loader2 size={10} className="animate-spin" /> : <Zap size={10} />}
                {generating && aiSection === s.key ? "Generating…" : "AI Draft"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}