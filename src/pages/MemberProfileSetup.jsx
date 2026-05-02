import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function MemberProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState('type'); // type, info, verify, complete
  const [profileType, setProfileType] = useState('inventor');
  const [displayName, setDisplayName] = useState('');
  const [alias, setAlias] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('');
  const [investmentMin, setInvestmentMin] = useState('');
  const [investmentMax, setInvestmentMax] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProfile = async () => {
    if (!displayName || !alias) {
      setError('Display name and alias are required');
      return;
    }

    setLoading(true);
    try {
      const user = await base44.auth.me();
      const profileData = {
        user_email: user.email,
        profile_type: profileType,
        display_name: displayName,
        anonymous_alias: alias,
        bio,
        expertise_areas: expertise ? expertise.split(',').map(e => e.trim()) : [],
        investment_range_min: investmentMin ? parseFloat(investmentMin) : null,
        investment_range_max: investmentMax ? parseFloat(investmentMax) : null,
        status: 'active',
        communications_encrypted: true,
      };

      await base44.entities.MemberProfile.create(profileData);
      setStep('complete');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-cyan-700/50 rounded-2xl p-8" style={{ boxShadow: '0 0 24px rgba(0,220,255,0.3)' }}>
          <h1 className="text-3xl font-black text-white mb-2">Create Member Profile</h1>
          <p className="text-gray-400 text-sm mb-8">Required to use ZAT features and communicate with other members. Your real identity is protected.</p>

          {step === 'type' && (
            <div className="space-y-4">
              <p className="text-white font-bold mb-4">I am a:</p>
              {[
                { value: 'inventor', label: '💡 Inventor', desc: 'Selling IP, patents, or inventions' },
                { value: 'investor', label: '💰 Investor', desc: 'Seeking IP deals and partnerships' },
                { value: 'both', label: '🔄 Both', desc: 'Both inventor and investor' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setProfileType(opt.value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    profileType === opt.value
                      ? 'border-cyan-500 bg-cyan-950/20'
                      : 'border-gray-700 hover:border-cyan-700'
                  }`}
                >
                  <p className="font-bold text-white">{opt.label}</p>
                  <p className="text-gray-400 text-sm">{opt.desc}</p>
                </button>
              ))}
              <button
                onClick={() => setStep('info')}
                className="w-full mt-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {step === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold text-sm mb-2">Full Name (for our records)</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your real name"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-xs text-gray-500 mt-1">Used only for commission payments and tax purposes</p>
              </div>

              <div>
                <label className="block text-white font-bold text-sm mb-2">Public Alias (displayed in marketplace)</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g., EM_Researcher_2024"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
                <p className="text-xs text-gray-500 mt-1">Others see only this name, not your real identity</p>
              </div>

              <div>
                <label className="block text-white font-bold text-sm mb-2">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief description of your work or interests"
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {profileType !== 'investor' && (
                <div>
                  <label className="block text-white font-bold text-sm mb-2">Areas of Expertise (comma-separated)</label>
                  <input
                    type="text"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    placeholder="e.g., Scalar EM, Free Energy, Patent Strategy"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {profileType !== 'inventor' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-bold text-sm mb-2">Min Investment</label>
                      <input
                        type="number"
                        value={investmentMin}
                        onChange={(e) => setInvestmentMin(e.target.value)}
                        placeholder="$50,000"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-bold text-sm mb-2">Max Investment</label>
                      <input
                        type="number"
                        value={investmentMax}
                        onChange={(e) => setInvestmentMax(e.target.value)}
                        placeholder="$5,000,000"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {error && <div className="flex gap-2 p-3 rounded-lg bg-red-950/30 border border-red-700 text-red-300 text-sm"><AlertCircle size={16} />{error}</div>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('type')}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-700 text-white font-bold hover:border-gray-600"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateProfile}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 size={64} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-2">Profile Created!</h2>
                <p className="text-gray-400">Your member profile is active. You can now browse deals, communicate with other members, and participate in the IP marketplace.</p>
              </div>
              <button
                onClick={() => navigate('/ip-marketplace')}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Go to Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}