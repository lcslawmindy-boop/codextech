import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, TrendingUp, Mail, Copy, CheckCircle2, Award, Target } from 'lucide-react';

export default function InvestorMatchDashboard({ opportunityId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [outreachTemplate, setOutreachTemplate] = useState(null);
  const [personalizeLevel, setPersonalizeLevel] = useState('standard');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [opportunityId]);

  const loadMatches = async () => {
    try {
      const res = await base44.functions.invoke('scoreAndMatchInvestors', {
        opportunity_id: opportunityId
      });
      if (res.data?.matches) {
        setMatches(res.data.matches);
        if (res.data.matches.length > 0) {
          setSelectedMatch(res.data.matches[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOutreach = async (investorId, level) => {
    try {
      const res = await base44.functions.invoke('generateOutreachTemplate', {
        opportunity_id: opportunityId,
        investor_id: investorId,
        personalization_level: level
      });
      setOutreachTemplate(res.data);
    } catch (error) {
      console.error('Failed to generate template:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Matches List */}
      <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-black text-white mb-4">Top Investor Matches</h3>
        
        {matches.length === 0 ? (
          <p className="text-gray-500 text-sm">No qualified investor matches found.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {matches.map((match) => (
              <button
                key={match.investor_id}
                onClick={() => {
                  setSelectedMatch(match);
                  setOutreachTemplate(null);
                }}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedMatch?.investor_id === match.investor_id
                    ? 'bg-cyan-950/30 border-cyan-600'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-white text-sm">{match.investor_alias}</span>
                  <span className="bg-cyan-600 text-white text-xs font-black px-2 py-1 rounded">
                    {match.total_score}%
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  <p>Investment Range: ${match.investment_range.min}–${match.investment_range.max}</p>
                  <p>Completed Deals: {match.completed_deals}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Match Details & Outreach */}
      <div className="lg:col-span-2 space-y-6">
        {selectedMatch && (
          <>
            {/* Score Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h4 className="font-black text-white mb-4">Match Score Breakdown</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedMatch.score_breakdown).map(([factor, score]) => (
                  <div key={factor} className="bg-gray-800/50 rounded p-3">
                    <p className="text-xs text-gray-400 capitalize mb-1">
                      {factor.replace(/_/g, ' ')}
                    </p>
                    <p className="text-lg font-black text-cyan-400">{score} pts</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connection Points */}
            {selectedMatch.connection_points && selectedMatch.connection_points.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h4 className="font-black text-white mb-4 flex items-center gap-2">
                  <Target size={16} /> Connection Points
                </h4>
                <ul className="space-y-2">
                  {selectedMatch.connection_points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Personalization Level */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h4 className="font-black text-white mb-4">Generate Outreach Template</h4>
              <div className="flex gap-2 mb-4">
                {['casual', 'standard', 'direct', 'technical'].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setPersonalizeLevel(level);
                      generateOutreach(selectedMatch.investor_id, level);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      personalizeLevel === level
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Template */}
            {outreachTemplate && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-white flex items-center gap-2">
                    <Mail size={16} /> Email Template
                  </h4>
                  <button
                    onClick={() => copyToClipboard(outreachTemplate.email_body)}
                    className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded flex items-center gap-1"
                  >
                    <Copy size={12} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="bg-gray-800/50 rounded p-4 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Subject:</p>
                  <p className="text-sm font-bold text-white mb-4">{outreachTemplate.subject_line}</p>
                  <p className="text-xs text-gray-400 mb-2">Body:</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap font-mono text-xs">
                    {outreachTemplate.email_body}
                  </p>
                </div>

                {/* Pitch Angles */}
                {outreachTemplate.pitch_angles && outreachTemplate.pitch_angles.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Alternative Pitch Angles</p>
                    <div className="space-y-2">
                      {outreachTemplate.pitch_angles.map((angle, i) => (
                        <div key={i} className="bg-gray-800/30 rounded p-3 border-l-2 border-cyan-600">
                          <p className="text-xs font-bold text-cyan-400">{angle.angle}</p>
                          <p className="text-xs text-gray-300 mt-1">{angle.pitch}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Timing */}
                <div className="bg-amber-950/20 border border-amber-800/50 rounded p-3 text-xs text-amber-200">
                  <p className="font-bold mb-1">Follow-up Recommendation</p>
                  <p>Reach out in {outreachTemplate.recommended_follow_up_days} days if no response.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}