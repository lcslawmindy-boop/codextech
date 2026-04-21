import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Film, Trophy, Users, Calendar, Upload, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ContestPage() {
  const [contest, setContest] = useState(null);
  const [entries, setEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [userEntry, setUserEntry] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    invention_name: "",
    invention_description: "",
    video_file: null
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load active contest
      const contests = await base44.entities.Contest.filter({ status: "active" });
      if (contests && contests.length > 0) {
        setContest(contests[0]);
        
        // Load entries
        const contestEntries = await base44.entities.ContestEntry.filter({ 
          contest_id: contests[0].id,
          status: "approved"
        });
        setEntries(contestEntries || []);
      }

      // Try to get current user
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        if (currentUser && contests && contests.length > 0) {
          const myEntry = await base44.entities.ContestEntry.filter({
            contest_id: contests[0].id,
            entrant_email: currentUser.email
          });
          if (myEntry && myEntry.length > 0) {
            setUserEntry(myEntry[0]);
          }
        }
      } catch {
        // User not authenticated - no problem, public app
      }
    } catch (error) {
      console.error("Error loading contest data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, video_file: file }));
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUploading(true);

    if (!user) {
      setError("Please sign in to submit an entry");
      setUploading(false);
      return;
    }

    if (!formData.invention_name || !formData.video_file) {
      setError("Please fill in all fields");
      setUploading(false);
      return;
    }

    try {
      // Upload video file
      const uploadResponse = await base44.integrations.Core.UploadFile({
        file: formData.video_file
      });

      // Create contest entry
      await base44.entities.ContestEntry.create({
        contest_id: contest.id,
        entrant_email: user.email,
        entrant_name: user.full_name || user.email,
        invention_name: formData.invention_name,
        invention_description: formData.invention_description,
        video_url: uploadResponse.file_url,
        submitted_date: new Date().toISOString(),
        status: "pending"
      });

      setSuccess("Entry submitted! Our team will review your video.");
      setFormData({
        invention_name: "",
        invention_description: "",
        video_file: null
      });
      setShowUploadForm(false);
      
      // Reload user's entry
      setTimeout(() => loadData(), 1000);
    } catch (error) {
      setError(error.message || "Failed to submit entry");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Trophy size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500">No active contest at the moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-6 bg-gray-700" />
          <h1 className="text-white font-black text-lg flex items-center gap-2">
            <Trophy size={20} className="text-yellow-400" /> {contest.title}
          </h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-12 max-w-4xl mx-auto">
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-yellow-950/40 to-orange-950/40 border border-yellow-900/30">
          <div className="flex items-start gap-6 mb-6">
            <Trophy size={48} className="text-yellow-400 flex-shrink-0" />
            <div>
              <h2 className="text-white font-black text-3xl mb-2">{contest.grand_prize}</h2>
              <p className="text-gray-400 text-lg">{contest.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Entries</p>
              <p className="text-2xl font-black text-yellow-400">{entries.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Deadline</p>
              <p className="text-lg font-bold text-white">{new Date(contest.end_date).toLocaleDateString()}</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Status</p>
              <p className="text-lg font-bold text-cyan-400">Active</p>
            </div>
          </div>

          {contest.rules && (
            <div className="mt-6 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
              <p className="text-gray-300 text-sm whitespace-pre-line">{contest.rules}</p>
            </div>
          )}
        </div>

        {/* User Entry Status */}
        {user && (
          <div className="mb-12 p-6 rounded-xl border border-gray-800 bg-gray-900/60">
            {userEntry ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={20} className={userEntry.status === 'approved' ? 'text-green-400' : 'text-yellow-400'} />
                  <p className="text-white font-bold">Your Entry</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-white font-bold text-sm mb-1">{userEntry.invention_name}</p>
                  <p className="text-gray-400 text-xs mb-3">{userEntry.invention_description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded ${userEntry.status === 'approved' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                      {userEntry.status === 'approved' ? 'Approved' : 'Pending Review'}
                    </span>
                    <span>{new Date(userEntry.submitted_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-white font-bold mb-4">Enter the contest to win!</p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="w-full px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Upload size={16} /> Submit Your Build Video
                </button>
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className="mb-12 p-6 rounded-xl border border-cyan-900/30 bg-cyan-950/20">
            <p className="text-gray-300 mb-4">Sign in to submit your entry</p>
            <button
              onClick={() => base44.auth.redirectToLogin()}
              className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && user && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-white font-black text-2xl mb-6">Submit Your Entry</h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/50 flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-950/40 border border-green-900/50 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Invention Name*</label>
                  <input
                    type="text"
                    value={formData.invention_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, invention_name: e.target.value }))}
                    placeholder="e.g., Scalar EM Energy Generator"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.invention_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, invention_description: e.target.value }))}
                    placeholder="Briefly describe your invention and the build process"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Build Video*</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <Film size={32} className="mx-auto text-gray-600 mb-2" />
                    <p className="text-gray-400 text-sm mb-3">Click to upload your build video (MP4, WebM)</p>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-bold cursor-pointer transition-all">
                      Choose File
                    </label>
                    {formData.video_file && (
                      <p className="text-green-400 text-xs mt-3">✓ {formData.video_file.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      setError("");
                    }}
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !formData.invention_name || !formData.video_file}
                    className="flex-1 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? "Uploading..." : "Submit Entry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Featured Entries */}
        <div>
          <h2 className="text-white font-black text-2xl mb-6 flex items-center gap-2">
            <Film size={24} /> Submitted Entries ({entries.length})
          </h2>

          {entries.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-gray-900/60 border border-gray-800 border-dashed">
              <Users size={32} className="mx-auto text-gray-700 mb-3" />
              <p className="text-gray-500">No entries yet. Be the first to compete!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden hover:border-cyan-700/50 transition-all">
                  <div className="w-full h-40 bg-gray-800 relative flex items-center justify-center">
                    <video src={entry.video_url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Film size={48} className="text-white/60" />
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white font-bold text-sm mb-1">{entry.invention_name}</p>
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{entry.invention_description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{entry.entrant_name}</span>
                      <span>{entry.video_views || 0} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}