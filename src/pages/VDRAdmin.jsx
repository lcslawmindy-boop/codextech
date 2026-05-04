import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Upload, Users, Settings, Trash2, Eye, Download, Plus, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AdminGuard from '@/components/AdminGuard';

const FOLDERS = ['Overview', 'IP & Patents', 'Technical', 'Financials', 'Legal', 'Other'];

function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('Overview');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await base44.entities.VDRDocument.filter({ is_active: true }, '-created_date', 100);
      setDocuments(docs);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name.replace(/\.[^/.]+$/, ''));
        formData.append('folder', selectedFolder);

        const res = await base44.functions.invoke('vdrUploadDocument', formData);
        if (res.data.success) {
          loadDocuments();
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Delete this document?')) return;
    try {
      await base44.entities.VDRDocument.update(docId, { is_active: false });
      loadDocuments();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const visibleDocs = documents.filter(d => d.folder === selectedFolder);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-900 border border-cyan-900/40 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Upload size={20} className="text-cyan-400" />
          <h2 className="text-xl font-black text-white">Upload Documents</h2>
        </div>

        <div className="mb-4">
          <label className="text-sm font-bold text-gray-300 mb-2 block">Select Folder</label>
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            {FOLDERS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div className="border-2 border-dashed border-cyan-900/50 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload size={24} className="text-cyan-400 mx-auto mb-2" />
            <p className="text-white font-bold text-sm mb-1">Drop files or click to upload</p>
            <p className="text-gray-500 text-xs">PDF, DOC, XLS, ZIP supported</p>
          </label>
          {uploading && <p className="text-cyan-400 text-sm mt-2">Uploading...</p>}
        </div>
      </div>

      {/* Documents List */}
      <div>
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Eye size={20} className="text-green-400" />
          {selectedFolder} Documents ({visibleDocs.length})
        </h2>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 size={24} className="text-cyan-400 animate-spin mx-auto" />
          </div>
        ) : visibleDocs.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center text-gray-400">
            No documents in {selectedFolder}
          </div>
        ) : (
          <div className="space-y-2">
            {visibleDocs.map(doc => (
              <div key={doc.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{doc.name}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-500">
                    <span>{(doc.file_size_bytes / 1024 / 1024).toFixed(2)}MB</span>
                    <span>{doc.view_count} views</span>
                    <span>{doc.download_count} downloads</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AccessManager() {
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGrant, setNewGrant] = useState({ email: '', access_level: 'view_only', folder_access: [], expires_days: 30 });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      setLoading(true);
      const accessGrants = await base44.entities.VDRAccessGrant.filter({ is_active: true }, '-created_date', 100);
      setGrants(accessGrants);
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrant = async (e) => {
    e.preventDefault();
    if (!newGrant.email) return;

    setCreating(true);
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + newGrant.expires_days);

      const res = await base44.functions.invoke('vdrCreateAccessGrant', {
        email: newGrant.email,
        access_level: newGrant.access_level,
        folder_access: newGrant.folder_access,
        expires_at: expiresAt.toISOString(),
      });

      if (res.data.success) {
        setNewGrant({ email: '', access_level: 'view_only', folder_access: [], expires_days: 30 });
        loadGrants();
      }
    } catch (error) {
      console.error('Create grant error:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeGrant = async (grantId) => {
    if (!confirm('Revoke access?')) return;
    try {
      await base44.entities.VDRAccessGrant.update(grantId, { is_active: false });
      loadGrants();
    } catch (error) {
      console.error('Revoke error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* New Grant Form */}
      <div className="bg-gray-900 border border-green-900/40 rounded-2xl p-6">
        <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Plus size={20} className="text-green-400" />
          Grant New Access
        </h2>

        <form onSubmit={handleCreateGrant} className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-300 mb-1 block">Investor Email</label>
            <input
              type="email"
              required
              value={newGrant.email}
              onChange={(e) => setNewGrant({ ...newGrant, email: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              placeholder="investor@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold text-gray-300 mb-1 block">Access Level</label>
              <select
                value={newGrant.access_level}
                onChange={(e) => setNewGrant({ ...newGrant, access_level: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              >
                <option value="view_only">View Only</option>
                <option value="download">Download</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-300 mb-1 block">Expires In (days)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={newGrant.expires_days}
                onChange={(e) => setNewGrant({ ...newGrant, expires_days: parseInt(e.target.value) })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-2 rounded-lg font-bold text-sm bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white transition-colors"
          >
            {creating ? 'Granting Access...' : 'Grant Access'}
          </button>
        </form>
      </div>

      {/* Active Grants */}
      <div>
        <h2 className="text-xl font-black text-white mb-4">Active Access Grants ({grants.length})</h2>

        {loading ? (
          <div className="text-center py-10">
            <Loader2 size={24} className="text-cyan-400 animate-spin mx-auto" />
          </div>
        ) : grants.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center text-gray-400">
            No active grants
          </div>
        ) : (
          <div className="space-y-2">
            {grants.map(grant => (
              <div key={grant.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:border-gray-700 transition">
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">{grant.email}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-800 rounded">{grant.access_level}</span>
                    <span>Accessed {grant.access_count} times</span>
                    {grant.expires_at && <span>Expires {new Date(grant.expires_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeGrant(grant.id)}
                  className="p-2 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VDRAdminDashboard() {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-950">
        {/* Header */}
        <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-4 flex items-center gap-3">
              <Settings size={24} className="text-cyan-400" />
              VDR Administration
            </h1>

            <div className="flex gap-3">
              {[
                { id: 'documents', label: 'Documents', icon: <Upload size={16} /> },
                { id: 'access', label: 'Access Control', icon: <Users size={16} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          {activeTab === 'documents' && <DocumentManager />}
          {activeTab === 'access' && <AccessManager />}
        </div>
      </div>
    </AdminGuard>
  );
}