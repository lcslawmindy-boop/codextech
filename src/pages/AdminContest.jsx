import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, FileCheck, User, Calendar, Award, Loader2, CheckCircle2, XCircle, Settings } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AdminContest() {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [entries, setEntries] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rules: "",
    grand_prize: "1 Year Free Membership",
    grand_prize_value: 0,
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser?.role !== 'admin') {
        return;
      }
      setUser(currentUser);

      const allContests = await base44.entities.Contest.list();
      setContests(allContests || []);

      if (allContests && allContests.length > 0) {
        setSelectedContest(allContests[0]);
        const contestEntries = await base44.entities.ContestEntry.filter({ 
          contest_id: allContests[0].id 
        });
        setEntries(contestEntries || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContest = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newContest = await base44.entities.Contest.create({
        ...formData,
        status: "active"
      });

      setContests([...contests, newContest]);
      setSelectedContest(newContest);
      setShowCreateForm(false);
      setFormData({
        title: "",
        description: "",
        rules: "",
        grand_prize: "1 Year Free Membership",
        grand_prize_value: 0,
        start_date: "",
        end_date: ""
      });
    } catch (error) {
      console.error("Error creating contest:", error);
      alert("Failed to create contest");
    } finally {
      setSubmitting(false);
    }
  };

  const approveEntry = async (entryId) => {
    try {
      await base44.entities.ContestEntry.update(entryId, {
        status: "approved",
        approved_date: new Date().toISOString()
      });
      const updated = entries.map(e => 
        e.id === entryId ? { ...e, status: "approved" } : e
      );
      setEntries(updated);
    } catch (error) {
      console.error("Error approving entry:", error);
    }
  };

  const rejectEntry = async (entryId, reason) => {
    try {
      await base44.entities.ContestEntry.update(entryId, {
        status: "rejected",
        rejection_reason: reason
      });
      const updated = entries.map(e => 
        e.id === entryId ? { ...e, status: "rejected" } : e
      );
      setEntries(updated);
    } catch (error) {
      console.error("Error rejecting entry:", error);
    }
  };

  const selectWinner = async (entryId) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    try {
      // Update contest
      await base44.entities.Contest.update(selectedContest.id, {
        winner_id: entryId,
        winner_email: entry.entrant_email,
        winner_announcement_date: new Date().toISOString()
      });

      // Mark entry as featured
      await base44.entities.ContestEntry.update(entryId, {
        status: "featured"
      });

      loadData();
      alert(`Winner selected: ${entry.entrant_name}`);
    } catch (error) {
      console.error("Error selecting winner:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Admin access required</p>
      </div>
    );
  }

  const pendingEntries = entries.filter(e => e.status === 'pending');
  const approvedEntries = entries.filter(e => e.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
              <ArrowLeft size={14} /> Back
            </Link>
            <div className="w-px h-6 bg-gray-700" />
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <Trophy size={20} /> Contest Management
            </h1>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm"
          >
            + New Contest
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Contest Selector */}
        {contests.length > 0 && (
          <div className="mb-8 flex gap-3 pb-6 border-b border-gray-800">
            {contests.map(contest => (
              <button
                key={contest.id}
                onClick={() => {
                  setSelectedContest(contest);
                  const filtered = entries.filter(e => e.contest_id === contest.id);
                  setEntries(filtered);
                }}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                  selectedContest?.id === contest.id
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {contest.title}
              </button>
            ))}
          </div>
        )}

        {selectedContest && (
          <>
            {/* Contest Info */}
            <div className="mb-8 p-6 rounded-xl bg-gray-900 border border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-white font-black text-2xl">{selectedContest.title}</h2>
                  <p className="text-gray-400 text-sm mt-2">{selectedContest.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  selectedContest.status === 'active' 
                    ? 'bg-green-900/30 text-green-400' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {selectedContest.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Prize</p>
                  <p className="text-white font-bold">{selectedContest.grand_prize}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Start Date</p>
                  <p className="text-white font-bold">{new Date(selectedContest.start_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">End Date</p>
                  <p className="text-white font-bold">{new Date(selectedContest.end_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase mb-1">Total Entries</p>
                  <p className="text-white font-black text-lg">{entries.length}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-500 text-xs uppercase mb-2">Pending Review</p>
                <p className="text-3xl font-black text-yellow-400">{pendingEntries.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-500 text-xs uppercase mb-2">Approved</p>
                <p className="text-3xl font-black text-green-400">{approvedEntries.length}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
                <p className="text-gray-500 text-xs uppercase mb-2">Winner Selected</p>
                <p className="text-3xl font-black text-purple-400">{selectedContest.winner_id ? "✓" : "—"}</p>
              </div>
            </div>

            {/* Pending Entries */}
            {pendingEntries.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                  <FileCheck size={20} /> Pending Review ({pendingEntries.length})
                </h3>
                <div className="space-y-3">
                  {pendingEntries.map(entry => (
                    <div key={entry.id} className="p-4 rounded-lg bg-gray-900 border border-yellow-900/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-bold">{entry.invention_name}</p>
                          <p className="text-gray-500 text-xs mt-1">{entry.entrant_name} ({entry.entrant_email})</p>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-900/30 text-yellow-400">
                          Pending
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{entry.invention_description}</p>
                      <div className="flex gap-3">
                        <a 
                          href={entry.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-bold"
                        >
                          View Video
                        </a>
                        <button
                          onClick={() => approveEntry(entry.id)}
                          className="px-4 py-2 rounded-lg bg-green-900/40 hover:bg-green-900/60 border border-green-700 text-green-400 text-sm font-bold"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => rejectEntry(entry.id, "Does not meet contest requirements")}
                          className="px-4 py-2 rounded-lg bg-red-900/40 hover:bg-red-900/60 border border-red-700 text-red-400 text-sm font-bold"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Entries */}
            {approvedEntries.length > 0 && (
              <div className="mb-8">
                <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} /> Approved Entries ({approvedEntries.length})
                </h3>
                <div className="space-y-3">
                  {approvedEntries.map(entry => (
                    <div key={entry.id} className="p-4 rounded-lg bg-gray-900 border border-green-900/30">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-bold">{entry.invention_name}</p>
                          <p className="text-gray-500 text-xs mt-1">{entry.entrant_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded text-xs font-bold bg-green-900/30 text-green-400">
                            Approved
                          </span>
                          {selectedContest.winner_id === entry.id && (
                            <span className="px-2 py-1 rounded text-xs font-bold bg-purple-900/30 text-purple-400">
                              🏆 Winner
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{entry.invention_description}</p>
                      <div className="flex gap-3">
                        <a 
                          href={entry.video_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-bold"
                        >
                          View Video
                        </a>
                        {selectedContest.winner_id !== entry.id && (
                          <button
                            onClick={() => selectWinner(entry.id)}
                            className="px-4 py-2 rounded-lg bg-purple-900/40 hover:bg-purple-900/60 border border-purple-700 text-purple-400 text-sm font-bold flex items-center gap-2"
                          >
                            <Award size={14} /> Select as Winner
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Create Contest Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="text-white font-black text-2xl mb-6">Create New Contest</h2>

              <form onSubmit={handleCreateContest} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Contest Title*</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Build Challenge 2026"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the contest"
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Rules</label>
                  <textarea
                    value={formData.rules}
                    onChange={(e) => setFormData(prev => ({ ...prev, rules: e.target.value }))}
                    placeholder="Contest rules and requirements"
                    rows="4"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Grand Prize</label>
                    <input
                      type="text"
                      value={formData.grand_prize}
                      onChange={(e) => setFormData(prev => ({ ...prev, grand_prize: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Prize Value ($)</label>
                    <input
                      type="number"
                      value={formData.grand_prize_value}
                      onChange={(e) => setFormData(prev => ({ ...prev, grand_prize_value: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Start Date*</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">End Date*</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold flex items-center justify-center gap-2"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Trophy size={16} />}
                    {submitting ? "Creating..." : "Create Contest"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}