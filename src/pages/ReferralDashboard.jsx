import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, DollarSign, Users, TrendingUp, Mail, Share2, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ReferralDashboard() {
  const [user, setUser] = useState(null);
  const [referralCode, setReferralCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [referrals, setReferrals] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      if (currentUser) {
        // Get or generate referral code
        const codeResponse = await base44.functions.invoke("generateReferralCode", {});
        setReferralCode(codeResponse.data.code);
        setInviteUrl(codeResponse.data.url);

        // Load referral history
        const referralList = await base44.entities.Referral.filter({ 
          referrer_email: currentUser.email 
        });
        setReferrals(referralList || []);

        // Calculate total affiliate earnings
        const completed = (referralList || []).filter(r => r.status === 'completed');
        const credits = completed.reduce((sum, ref) => sum + (ref.store_credit_amount || 0), 0);
        setTotalCredits(credits);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareEmail = () => {
    const subject = "Join ZARP and Get Member Benefits";
    const body = `I've been using ZARP and thought you might find it valuable. Use my referral link to get started: ${inviteUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleShareTwitter = () => {
    const text = `Check out ZARP - AI-powered IP platform for inventors. Use my referral link: ${inviteUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please log in to access referrals</p>
          <button onClick={() => base44.auth.redirectToLogin()} className="px-6 py-2 bg-cyan-600 rounded-lg font-bold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const completedReferrals = referrals.filter(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 px-6 py-5 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-6 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <DollarSign size={20} className="text-green-400" /> Affiliate Program
            </h1>
            <p className="text-gray-500 text-xs mt-1">Earn cash commissions for each membership signup</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign size={20} className="text-green-400" />
              <p className="text-gray-400 text-sm">Total Commissions Earned</p>
            </div>
            <p className="text-4xl font-black text-green-400">${totalCredits}</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} className="text-cyan-400" />
              <p className="text-gray-400 text-sm">Successful Referrals</p>
            </div>
            <p className="text-4xl font-black text-cyan-400">{completedReferrals.length}</p>
          </div>
          <div className="p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-purple-400" />
              <p className="text-gray-400 text-sm">Avg. Commission per Ref</p>
            </div>
            <p className="text-4xl font-black text-purple-400">
              ${completedReferrals.length > 0 ? Math.round(totalCredits / completedReferrals.length) : 0}
            </p>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-purple-950/40 border border-cyan-900/50">
          <h2 className="text-white font-black text-xl mb-2">Your Affiliate Link</h2>
          <p className="text-gray-400 text-sm mb-6">Share this link. You earn a cash commission every time someone purchases a membership.</p>
          
          <div className="flex gap-3 mb-6">
            <div className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-sm truncate">
              {inviteUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Copy size={16} /> {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleShareEmail}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-bold transition-all flex items-center gap-2"
            >
              <Mail size={14} /> Email
            </button>
            <button
              onClick={handleShareTwitter}
              className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-sm font-bold transition-all flex items-center gap-2"
            >
              <Share2 size={14} /> Twitter
            </button>
          </div>
        </div>

        {/* Referral History */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">Referral History</h2>
          
          {completedReferrals.length === 0 ? (
            <div className="text-center py-12 rounded-2xl bg-gray-900/60 border border-gray-800 border-dashed">
              <Users size={32} className="mx-auto text-gray-700 mb-3" />
              <p className="text-gray-500">No commissions earned yet</p>
              <p className="text-gray-600 text-sm mt-2">Share your affiliate link and start earning!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedReferrals.map((ref, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">{ref.referred_name || ref.referred_email}</p>
                    <p className="text-gray-500 text-xs">
                      {ref.membership_tier && ref.membership_tier.charAt(0).toUpperCase() + ref.membership_tier.slice(1)} membership
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-black">+${ref.store_credit_amount} commission</p>
                    <p className="text-gray-500 text-xs">
                      {ref.completed_date && new Date(ref.completed_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="mt-12 p-6 rounded-2xl bg-gray-900/60 border border-gray-800">
          <h3 className="text-white font-black text-lg mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">1</div>
              <div>
                <p className="text-white font-bold text-sm">Share Your Affiliate Link</p>
                <p className="text-gray-500 text-xs mt-1">Copy your unique affiliate link and share it with your audience.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">2</div>
              <div>
                <p className="text-white font-bold text-sm">They Purchase a Membership</p>
                <p className="text-gray-500 text-xs mt-1">Your referral clicks your link and buys any ZARP membership plan.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">3</div>
              <div>
                <p className="text-white font-bold text-sm">You Earn Cash Commission</p>
                <p className="text-gray-500 text-xs mt-1">Earn 20% commission on every membership sale — paid out directly to you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}