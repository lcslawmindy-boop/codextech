import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

const INVENTIONS = [
  "MEG Replication Device",
  "Scalar EM Lab",
  "Prioré Device",
  "Anenergy Pump",
  "TRD-1 Telomere Device",
];

export default function NewCommunityPost() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    invention_name: INVENTIONS[0],
    title: "",
    content: "",
    post_type: "build_photo",
    image_url: ""
  });

  useState(() => {
    base44.auth.me().then(u => {
      if (!u) {
        alert("Please log in to post.");
        navigate("/");
      } else {
        setCurrentUser(u);
      }
    });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const res = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: res.file_url }));
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    await base44.entities.CommunityPost.create({
      ...form,
      author_email: currentUser?.email,
      author_name: currentUser?.full_name || "Anonymous"
    });
    setLoading(false);
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4 sticky top-0 z-10 bg-gray-950/95 backdrop-blur">
        <Link to="/community" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Forum
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">Share Your Build</h1>
          <p className="text-gray-400">Help the community by sharing your build photos, tips, and solutions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invention selector */}
          <div>
            <label className="block text-sm font-bold mb-2">Which Invention?</label>
            <select
              value={form.invention_name}
              onChange={(e) => setForm(f => ({ ...f, invention_name: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white focus:outline-none focus:border-cyan-500">
              {INVENTIONS.map(inv => (
                <option key={inv} value={inv}>{inv}</option>
              ))}
            </select>
          </div>

          {/* Post type */}
          <div>
            <label className="block text-sm font-bold mb-2">Post Type</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "build_photo", label: "📸 Build Photo", desc: "Share a photo of your build" },
                { value: "troubleshooting", label: "🔧 Troubleshooting", desc: "Ask for help with issues" },
                { value: "tip", label: "💡 Tip", desc: "Share a helpful tip" },
                { value: "question", label: "❓ Question", desc: "Ask a technical question" }
              ].map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, post_type: type.value }))}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    form.post_type === type.value
                      ? "bg-cyan-900/30 border-cyan-600"
                      : "bg-gray-900 border-gray-800 hover:border-gray-700"
                  }`}>
                  <p className="font-bold text-sm">{type.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., My MEG Build Complete! / Help: Coil Overheating"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
              maxLength={100}
            />
            <p className="text-xs text-gray-600 mt-1">{form.title.length}/100</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Share details about your build, troubleshooting question, or helpful tip..."
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-gray-600 mt-1">{form.content.length}/2000</p>
          </div>

          {/* Image upload */}
          {form.post_type === "build_photo" && (
            <div>
              <label className="block text-sm font-bold mb-2">Build Photo</label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {form.image_url ? (
                  <div>
                    <p className="text-green-400 font-bold text-sm mb-2">✓ Photo uploaded</p>
                    <img src={form.image_url} alt="Preview" className="h-32 mx-auto rounded-lg mb-2" />
                    <p className="text-xs text-gray-500">Click to change</p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-gray-400 text-sm">Uploading...</span>
                  </div>
                ) : (
                  <div>
                    <Upload size={24} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-300 font-bold text-sm">Click to upload</p>
                    <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || !form.title.trim() || !form.content.trim()}
              className="flex-1 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? "Publishing..." : "Publish Post"}
            </button>
            <Link
              to="/community"
              className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all">
              Cancel
            </Link>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-950/20 border border-blue-800/30 rounded-lg p-4">
            <p className="text-xs text-blue-300 font-semibold mb-2">Community Guidelines</p>
            <ul className="text-xs text-blue-200 space-y-1 leading-relaxed">
              <li>• Be respectful and constructive</li>
              <li>• Share high-quality photos (if applicable)</li>
              <li>• Provide detailed context and specs</li>
              <li>• Follow all safety guidelines</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}