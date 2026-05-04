import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Lock, Upload, Users, FileText, Calendar, CheckCircle2, AlertCircle, Loader2, Download, Eye, Folder } from 'lucide-react';
import { useParams } from 'react-router-dom';

const FOLDERS = ['Overview', 'IP & Patents', 'Technical', 'Financials', 'Legal', 'Other'];

export default function VDRPortal() {
  const { token } = useParams();
  const [user, setUser] = useState(null);
  const [vdrData, setVdrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState('Overview');
  const [documentDetails, setDocumentDetails] = useState(null);

  useEffect(() => {
    const loadVDRData = async () => {
      try {
        setLoading(true);
        const currentUser = await base44.auth.me().catch(() => null);
        setUser(currentUser);

        if (!currentUser) {
          setVdrData({ hasAccess: false, reason: 'Please log in to access the VDR' });
          return;
        }

        const res = await base44.functions.invoke('vdrVerifyAccess', {});
        setVdrData(res.data);
      } catch (error) {
        console.error('VDR load error:', error);
        setVdrData({ hasAccess: false, reason: 'Failed to load VDR access' });
      } finally {
        setLoading(false);
      }
    };

    loadVDRData();
  }, []);

  const handleDocumentView = async (docId) => {
    try {
      await base44.functions.invoke('vdrLogAccess', { document_id: docId, action: 'view' });
    } catch (error) {
      console.error('Log error:', error);
    }
  };

  const handleDocumentDownload = async (docId, fileName) => {
    try {
      await base44.functions.invoke('vdrLogAccess', { document_id: docId, action: 'download' });
      // Trigger download
      const link = document.createElement('a');
      link.href = vdrData.documents.find(d => d.id === docId)?.file_url || '';
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading Virtual Data Room...</p>
        </div>
      </div>
    );
  }

  if (!vdrData?.hasAccess) {
    return (
      <div className="min-h-screen bg-gray-950 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 border border-red-900/50 rounded-2xl p-8 text-center">
            <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-white mb-3">Access Denied</h1>
            <p className="text-gray-400 mb-6">{vdrData?.reason || 'You do not have access to this Virtual Data Room.'}</p>
            <p className="text-gray-500 text-sm">Contact the deal sponsor for access credentials.</p>
          </div>
        </div>
      </div>
    );
  }

  const visibleDocs = vdrData.documents?.filter(d => !selectedFolder || d.folder === selectedFolder) || [];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={20} className="text-cyan-400" />
            <h1 className="text-3xl font-black text-white">Virtual Data Room</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-400" />
              Access Level: <span className="text-white font-bold">{vdrData.access_level.replace('_', ' ').toUpperCase()}</span>
            </div>
            {vdrData.expires_at && (
              <div className="flex items-center gap-1">
                <Calendar size={16} className="text-yellow-400" />
                Expires: <span className="text-white font-bold">{new Date(vdrData.expires_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Folder Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-10">
          {FOLDERS.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(selectedFolder === folder ? null : folder)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-black text-sm transition-all ${
                !selectedFolder || selectedFolder === folder
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Folder size={14} />
              {folder}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {visibleDocs.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
            <FileText size={40} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No documents in this folder</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => setDocumentDetails(doc)}
                className="bg-gray-900 border border-gray-800 hover:border-cyan-700 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-cyan-900/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950/50 border border-cyan-900/50 flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-sm leading-tight truncate">{doc.name}</h3>
                      <p className="text-gray-500 text-xs mt-1">{doc.folder}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded whitespace-nowrap ml-2">
                    {doc.file_type}
                  </span>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                  <p className="text-gray-400 text-xs">Size: {(doc.file_size_bytes / 1024 / 1024).toFixed(2)}MB</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    {doc.view_count} views
                  </div>
                  <div className="flex items-center gap-1">
                    <Download size={12} />
                    {doc.download_count} downloads
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDocumentView(doc.id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors"
                  >
                    <Eye size={13} /> View
                  </button>
                  {vdrData.access_level === 'download' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDocumentDownload(doc.id, doc.file_name);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white font-bold text-xs transition-colors"
                    >
                      <Download size={13} /> Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-gray-900/50 px-6 py-6 text-center text-xs text-gray-600">
        <p>All access is logged and monitored. Unauthorized distribution of materials is prohibited.</p>
      </div>
    </div>
  );
}