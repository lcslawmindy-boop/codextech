import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Lock, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function MemberOnboardingChecklist() {
  const [user, setUser] = useState(null);
  const [checklist, setChecklist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(u => {
        setUser(u);
        // Load or create checklist for this user
        loadChecklist(u.email);
      })
      .catch(err => {
        console.error('Auth error:', err);
        setLoading(false);
      });
  }, []);

  const loadChecklist = async (userEmail) => {
    try {
      const existing = await base44.entities.MemberOnboarding.filter({ 
        user_email: userEmail 
      });
      
      if (existing.length > 0) {
        setChecklist(existing[0]);
      } else {
        // Create new checklist
        const newChecklist = await base44.entities.MemberOnboarding.create({
          user_email: userEmail,
          completed_items: [],
          progress_percent: 0,
          created_date: new Date().toISOString()
        });
        setChecklist(newChecklist);
      }
    } catch (err) {
      console.error('Error loading checklist:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = async (itemId) => {
    if (!checklist) return;

    const updated = checklist.completed_items.includes(itemId)
      ? checklist.completed_items.filter(id => id !== itemId)
      : [...checklist.completed_items, itemId];

    const progress = Math.round((updated.length / 6) * 100);

    try {
      await base44.entities.MemberOnboarding.update(checklist.id, {
        completed_items: updated,
        progress_percent: progress
      });

      setChecklist({ ...checklist, completed_items: updated, progress_percent: progress });
    } catch (err) {
      console.error('Error updating checklist:', err);
    }
  };

  if (loading) return null;
  if (!checklist || !user) return null;

  const items = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      desc: 'Add photo, bio, research interests',
      action: '/account',
      actionLabel: 'Go to Settings',
      icon: '👤'
    },
    {
      id: 'research',
      title: 'Explore the Concept Graph',
      desc: 'Click 1000+ interconnected research nodes',
      action: '/',
      actionLabel: 'Start Exploring',
      icon: '🧠'
    },
    {
      id: 'course',
      title: 'Enroll in First Course',
      desc: 'Pick Anenergy, Patent Drafting, or Build Plans',
      action: '/courses',
      actionLabel: 'Browse Courses',
      icon: '📚'
    },
    {
      id: 'tools',
      title: 'Try an IP Tool',
      desc: 'Patent claims generator, FTO analysis, valuation',
      action: '/patent-claims-generator',
      actionLabel: 'Open Tools',
      icon: '⚙️'
    },
    {
      id: 'shop',
      title: 'Browse Build Supplies',
      desc: 'Check kits, parts, and component bundles',
      action: '/build-supplies-shop',
      actionLabel: 'Shop Now',
      icon: '🛠️'
    },
    {
      id: 'investor',
      title: 'Explore Investor Tools',
      desc: 'CRM, outreach templates, acquisition packages',
      action: '/investor-crm',
      actionLabel: 'Access CRM',
      icon: '💼'
    }
  ];

  const completed = checklist.completed_items.length;

  return (
    <div className="bg-gradient-to-b from-green-950/20 to-transparent border border-green-800/40 rounded-2xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Zap size={18} className="text-green-400" />
            Getting Started Checklist
          </h3>
          <p className="text-gray-500 text-xs mt-1">Complete these steps to unlock the full platform</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-green-400">{completed}/6</div>
          <p className="text-gray-600 text-xs">{checklist.progress_percent}% complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-5 border border-gray-700">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
          style={{ width: `${checklist.progress_percent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item) => {
          const isCompleted = checklist.completed_items.includes(item.id);
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-4 transition-all ${
                isCompleted
                  ? 'bg-green-950/30 border-green-700/40'
                  : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-green-400" />
                  ) : (
                    <Circle size={20} className="text-gray-600 hover:text-gray-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm ${isCompleted ? 'text-green-300 line-through' : 'text-white'}`}>
                    {item.icon} {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                </div>

                <Link
                  to={item.action}
                  className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-900/40 hover:bg-green-800/50 border border-green-700/50 text-green-300 text-xs font-bold transition-all"
                >
                  {item.actionLabel}
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {completed === 6 && (
        <div className="mt-5 bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
          <p className="text-green-300 font-bold text-sm">🎉 You've unlocked full access!</p>
          <p className="text-gray-400 text-xs mt-1">Explore the research network, build your IP portfolio, and connect with investors.</p>
        </div>
      )}
    </div>
  );
}