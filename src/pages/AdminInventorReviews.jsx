import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Shield, FileText, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminInventorReviews() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const data = await base44.entities.OpportunityCard.list();
      setListings(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const pendingReview = listings.filter(l => !l.verified_inventor);
  const verified = listings.filter(l => l.verified_inventor);

  const handleVerify = async (listing) => {
    setSubmitting(true);
    await base44.entities.OpportunityCard.update(listing.id, {
      verified_inventor: true,
      patent_docs_verified: true,
      identity_verified: true,
      verification_date: new Date().toISOString(),
      verified_by_admin: user?.email,
      verification_notes: verificationNotes
    });
    
    setListings(listings.map(l => 
      l.id === listing.id 
        ? { ...l, verified_inventor: true, patent_docs_verified: true, identity_verified: true, verification_notes: verificationNotes, verification_date: new Date().toISOString() }
        : l
    ));
    
    setSelectedListing(null);
    setVerificationNotes('');
    setSubmitting(false);
  };

  const handleUnverify = async (listing) => {
    setSubmitting(true);
    await base44.entities.OpportunityCard.update(listing.id, {
      verified_inventor: false,
      patent_docs_verified: false,
      identity_verified: false,
      verification_date: null,
      verified_by_admin: null,
      verification_notes: ''
    });
    
    setListings(listings.map(l => 
      l.id === listing.id 
        ? { ...l, verified_inventor: false, patent_docs_verified: false, identity_verified: false }
        : l
    ));
    
    setSelectedListing(null);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
        <Loader2 className="animate-spin text-cyan-400" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-2xl flex items-center gap-2">
              <Shield size={24} className="text-cyan-400" /> Inventor Verification
            </h1>
            <p className="text-gray-500 text-xs mt-1">Review patents, confirm identity, award verified status</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-400 text-xs mb-1">Total Listings</div>
            <div className="text-3xl font-bold text-white">{listings.length}</div>
          </div>
          <div className="bg-gray-900 border border-yellow-800 rounded-xl p-4">
            <div className="text-yellow-400 text-xs mb-1 flex items-center gap-1">
              <AlertCircle size={12} /> Pending Review
            </div>
            <div className="text-3xl font-bold text-yellow-400">{pendingReview.length}</div>
          </div>
          <div className="bg-gray-900 border border-green-800 rounded-xl p-4">
            <div className="text-green-400 text-xs mb-1 flex items-center gap-1">
              <CheckCircle2 size={12} /> Verified
            </div>
            <div className="text-3xl font-bold text-green-400">{verified.length}</div>
          </div>
        </div>

        {/* Pending Review */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-500" /> Pending Review ({pendingReview.length})
          </h2>
          {pendingReview.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
              ✓ No listings awaiting review
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReview.map(listing => (
                <div key={listing.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between hover:border-yellow-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white">{listing.headline}</h3>
                    <p className="text-xs text-gray-400 mt-1">{listing.alias} • {listing.category}</p>
                  </div>
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold transition-colors whitespace-nowrap"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verified */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" /> Verified Inventors ({verified.length})
          </h2>
          {verified.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
              No verified listings yet
            </div>
          ) : (
            <div className="space-y-3">
              {verified.map(listing => (
                <div key={listing.id} className="bg-gray-900 border border-green-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={14} className="text-green-400" />
                      <h3 className="font-bold text-white">{listing.headline}</h3>
                    </div>
                    <p className="text-xs text-gray-400">{listing.alias} • Verified {new Date(listing.verification_date).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleUnverify(listing)}
                    className="px-4 py-2 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-red-300 text-xs font-bold transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{selectedListing.headline}</h2>
              <button onClick={() => setSelectedListing(null)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Listing Info */}
              <div className="bg-gray-800 rounded-xl p-4 space-y-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Inventor</div>
                  <div className="font-bold text-white">{selectedListing.alias}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Category</div>
                    <div className="text-sm text-gray-300">{selectedListing.category}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Stage</div>
                    <div className="text-sm text-gray-300">{selectedListing.stage}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Problem Statement</div>
                  <div className="text-sm text-gray-300">{selectedListing.problem_statement}</div>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-3">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <FileText size={16} className="text-blue-400" /> Verification Steps
                </h3>
                
                <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-cyan-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Patent Documents Verified</div>
                    <div className="text-xs text-gray-400">Reviewed patent filings and claims</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-cyan-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">Identity Confirmed</div>
                    <div className="text-xs text-gray-400">Verified inventor's legal identity</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-cyan-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">No Red Flags</div>
                    <div className="text-xs text-gray-400">No conflicts, prior claims, or legal issues</div>
                  </div>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <AlertCircle size={14} /> Verification Notes
                </label>
                <textarea
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                  placeholder="Document any findings, concerns, or positive aspects from your review..."
                  className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleVerify(selectedListing)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  {submitting ? 'Verifying...' : 'Award Verified Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}