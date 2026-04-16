import { useState, useEffect } from 'react';
import { Mail, Eye, Link2, Zap, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function EmailTrackingStatus({ investorId, onEngagement }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTracking();
    const interval = setInterval(loadTracking, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [investorId]);

  const loadTracking = async () => {
    try {
      const records = await base44.entities.EmailTracking.filter({
        investor_id: investorId
      });
      
      if (records && records.length > 0) {
        // Get most recent email
        const latest = records.sort((a, b) => 
          new Date(b.sent_at) - new Date(a.sent_at)
        )[0];
        
        setTracking(latest);

        // Notify if newly engaged
        if (onEngagement && (latest.status === 'opened' || latest.status === 'clicked')) {
          onEngagement(latest);
        }
      }
    } catch (err) {
      console.error('Error loading tracking data:', err);
    }
  };

  if (!tracking) {
    return null;
  }

  return (
    <div className="bg-blue-950/20 border border-blue-800/50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-blue-400 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
          <Mail size={12} /> Email Tracking
        </p>
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
          tracking.status === 'clicked' ? 'bg-green-900/30 text-green-400' :
          tracking.status === 'opened' ? 'bg-blue-900/30 text-blue-400' :
          'bg-gray-800 text-gray-400'
        }`}>
          {tracking.status.charAt(0).toUpperCase() + tracking.status.slice(1)}
        </span>
      </div>

      <div className="space-y-1">
        {/* Subject */}
        <p className="text-gray-400 text-xs truncate">📧 {tracking.subject}</p>

        {/* Sent time */}
        <p className="text-gray-500 text-xs">
          <Clock size={10} className="inline mr-1" />
          Sent {new Date(tracking.sent_at).toLocaleDateString()} at {new Date(tracking.sent_at).toLocaleTimeString()}
        </p>

        {/* Open status */}
        {tracking.opened ? (
          <div className="flex items-center gap-2">
            <Eye size={10} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-bold">
              Opened {tracking.open_count}x {tracking.first_opened_at && 
                `(first on ${new Date(tracking.first_opened_at).toLocaleDateString()})`}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Eye size={10} className="text-gray-600" />
            <span className="text-gray-500 text-xs">Not yet opened</span>
          </div>
        )}

        {/* Click status */}
        {tracking.total_clicks > 0 ? (
          <div className="flex items-center gap-2">
            <Link2 size={10} className="text-green-400" />
            <span className="text-green-400 text-xs font-bold">
              {tracking.total_clicks} link{tracking.total_clicks > 1 ? 's' : ''} clicked
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link2 size={10} className="text-gray-600" />
            <span className="text-gray-500 text-xs">No clicks yet</span>
          </div>
        )}

        {/* Engagement score */}
        <div className="flex items-center gap-2 mt-2">
          <Zap size={10} className="text-yellow-400" />
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${tracking.engagement_score}%` }}
            />
          </div>
          <span className="text-yellow-400 text-xs font-bold">{tracking.engagement_score}%</span>
        </div>

        {/* Last engagement */}
        {tracking.last_engagement && (
          <p className="text-gray-500 text-xs mt-1">
            Last activity: {new Date(tracking.last_engagement).toLocaleDateString()}
          </p>
        )}

        {/* Clicked URLs */}
        {tracking.links_clicked && tracking.links_clicked.length > 0 && (
          <div className="mt-2 pt-2 border-t border-blue-800/30">
            <p className="text-gray-500 text-xs mb-1">Clicked links:</p>
            <div className="space-y-0.5">
              {tracking.links_clicked.map((link, i) => (
                <p key={i} className="text-blue-300 text-xs truncate">
                  • {new URL(link.url).hostname} ({link.click_count}x)
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}