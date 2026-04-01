import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bookmark, FileText, Sparkles, Trash2, ExternalLink, StickyNote } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { groupColors } from "../lib/beardenData";

const TABS = [
  { id: "saved_node", label: "Saved Nodes", icon: Bookmark },
  { id: "exported_doc", label: "Exported Docs", icon: FileText },
  { id: "ai_summary", label: "AI Summaries", icon: Sparkles },
];

function GroupBadge({ group }) {
  const color = groupColors[group] || "#6b7280";
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
      style={{ backgroundColor: color + "25", color }}
    >
      {group}
    </span>
  );
}

function ActivityCard({ item, onDelete, onNoteChange }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(item.note || "");

  const saveNote = async () => {
    await base44.entities.ResearchActivity.update(item.id, { note });
    onNoteChange(item.id, note);
    setEditing(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {item.node_group && <GroupBadge group={item.node_group} />}
            <span className="text-white font-semibold text-sm">{item.node_label}</span>
          </div>

          {item.type === "saved_node" && item.node_description && (
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.node_description}</p>
          )}

          {item.type === "exported_doc" && item.doc_url && (
            <a
              href={item.doc_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs mt-1 transition-colors"
            >
              <ExternalLink size={11} /> {item.doc_title || "Open Document"}
            </a>
          )}

          {item.type === "ai_summary" && item.summary_text && (
            <p className="text-purple-200 text-xs leading-relaxed italic line-clamp-3">"{item.summary_text}"</p>
          )}

          {/* Note section */}
          <div className="mt-2">
            {editing ? (
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-200 text-xs focus:outline-none focus:border-gray-500"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note…"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') saveNote(); if (e.key === 'Escape') setEditing(false); }}
                />
                <button onClick={saveNote} className="text-green-400 text-xs hover:text-green-300">Save</button>
                <button onClick={() => setEditing(false)} className="text-gray-500 text-xs hover:text-gray-300">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-400 text-xs transition-colors"
              >
                <StickyNote size={10} />
                {note ? <span className="text-gray-500">{note}</span> : "Add note…"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-gray-700 text-xs">
            {new Date(item.created_date).toLocaleDateString()}
          </span>
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-700 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyResearch() {
  const [activeTab, setActiveTab] = useState("saved_node");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.ResearchActivity.filter({ type: activeTab }, "-created_date", 50);
    setItems(all);
    setLoading(false);
  };

  useEffect(() => { load(); }, [activeTab]);

  const handleDelete = async (id) => {
    await base44.entities.ResearchActivity.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleNoteChange = (id, note) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, note } : i));
  };

  const counts = {};
  // We'll load counts separately
  useEffect(() => {
    TABS.forEach(async (tab) => {
      const res = await base44.entities.ResearchActivity.filter({ type: tab.id }, "-created_date", 1000);
      counts[tab.id] = res.length;
    });
  }, []);

  const activeTabMeta = TABS.find(t => t.id === activeTab);
  const Icon = activeTabMeta?.icon;

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft size={15} /> Back to Graph
        </Link>
        <div className="w-px h-5 bg-gray-700" />
        <div>
          <h1 className="text-white font-bold text-lg tracking-tight">My Research</h1>
          <p className="text-gray-500 text-xs">Your saved nodes, exported docs & AI summaries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-4 border-b border-gray-800 flex-shrink-0">
        {TABS.map(tab => {
          const T = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "text-white border-indigo-500 bg-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-300"
              }`}
            >
              <T size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {Icon && <Icon size={36} className="text-gray-700 mb-3" />}
            <p className="text-gray-500 text-sm">No {activeTabMeta?.label.toLowerCase()} yet.</p>
            <p className="text-gray-600 text-xs mt-1">
              {activeTab === "saved_node" && "Click 🔖 on any node panel to save it here."}
              {activeTab === "exported_doc" && "Use 'Export to Doc' in the node panel to create Google Docs."}
              {activeTab === "ai_summary" && "Generate AI summaries in the node panel — they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
            {items.map(item => (
              <ActivityCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onNoteChange={handleNoteChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}