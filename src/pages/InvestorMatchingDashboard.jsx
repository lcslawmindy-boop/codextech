import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Target, Brain } from 'lucide-react';
import InvestorMatchDashboard from '@/components/IPMarketplace/InvestorMatchDashboard';

export default function InvestorMatchingDashboard() {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/ip-marketplace" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm">
            <ArrowLeft size={14} /> Back to Marketplace
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">Investor Matching Engine</h1>
              <p className="text-gray-400 text-sm mt-1">AI-powered lead scoring and personalized outreach</p>
            </div>
            <div className="flex items-center gap-1 px-4 py-2 rounded-lg bg-cyan-950/30 border border-cyan-800">
              <Brain size={16} className="text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300">AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-cyan-950/40 to-gray-900 border border-cyan-800/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="text-cyan-400" size={24} />
              <div>
                <p className="text-sm text-gray-400">Scoring Factors</p>
                <h3 className="text-lg font-black text-white mt-1">5 Core Metrics</h3>
                <p className="text-xs text-gray-500 mt-2">Investment range, expertise, history, verification, preferences</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-950/40 to-gray-900 border border-purple-800/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Target className="text-purple-400" size={24} />
              <div>
                <p className="text-sm text-gray-400">Match Quality</p>
                <h3 className="text-lg font-black text-white mt-1">30+ Score Min</h3>
                <p className="text-xs text-gray-500 mt-2">Only qualified investors shown; ranked by fit</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-950/40 to-gray-900 border border-green-800/50 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Brain className="text-green-400" size={24} />
              <div>
                <p className="text-sm text-gray-400">Outreach</p>
                <h3 className="text-lg font-black text-white mt-1">4 Tone Levels</h3>
                <p className="text-xs text-gray-500 mt-2">Casual, standard, direct, technical personalization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h3 className="font-black text-white mb-3">How It Works</h3>
          <ol className="space-y-2 text-sm text-gray-300">
            <li><span className="font-bold text-cyan-400">1.</span> Select an opportunity from your IP Marketplace listings</li>
            <li><span className="font-bold text-cyan-400">2.</span> Algorithm scores all investors against your opportunity criteria</li>
            <li><span className="font-bold text-cyan-400">3.</span> View top 20 matches with detailed score breakdown</li>
            <li><span className="font-bold text-cyan-400">4.</span> Generate personalized outreach templates by tone</li>
            <li><span className="font-bold text-cyan-400">5.</span> Send pitches with optimal follow-up timing</li>
          </ol>
        </div>

        {/* Opportunity Selector & Dashboard */}
        {selectedOpportunity ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Matching Results: {selectedOpportunity.alias}</h2>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-sm text-cyan-400 hover:text-cyan-300 font-bold"
              >
                Change Opportunity →
              </button>
            </div>
            <InvestorMatchDashboard opportunityId={selectedOpportunity.id} />
          </>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
            <p className="text-gray-400 mb-4">Select an opportunity to view investor matches and generate outreach</p>
            <button
              onClick={() => setSelectedOpportunity({ id: 'sample-123', alias: 'MEG Replication Kit' })}
              className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm"
            >
              Load Sample Opportunity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}