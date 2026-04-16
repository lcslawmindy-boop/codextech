import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Loader2, Copy, CheckCircle2, TrendingUp, Mail, Calendar, FileText, Clock, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import InvestorCRMDetailPanel from "@/components/InvestorCRMDetailPanel";

const PIPELINE_STAGES = [
  { id: "prospect", label: "Prospect", icon: "🎯", color: "#6b7280" },
  { id: "initial_outreach", label: "Initial Outreach", icon: "📧", color: "#3b82f6" },
  { id: "responded", label: "Responded", icon: "✉️", color: "#8b5cf6" },
  { id: "meeting_scheduled", label: "Meeting Scheduled", icon: "📅", color: "#ec4899" },
  { id: "due_diligence", label: "Due Diligence", icon: "🔍", color: "#f59e0b" },
  { id: "term_sheet", label: "Term Sheet", icon: "📋", color: "#10b981" },
  { id: "negotiating", label: "Negotiating", icon: "🤝", color: "#06b6d4" },
  { id: "closed", label: "Closed", icon: "✅", color: "#22c55e" }
];

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-500 hover:text-gray-300 text-xs transition-all">
      {copied ? <CheckCircle2 size={10} className="text-green-400" /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function InvestorOutreachWorkflow() {
  const [investors, setInvestors] = useState([]);
  const [ranked, setRanked] = useState([]);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [detailedInvestor, setDetailedInvestor] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [followUpReminders, setFollowUpReminders] = useState(null);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      base44.entities.InvestorOutreach.filter({ user_email: user.email })
        .then(data => setInvestors(data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleScoreInvestors = async () => {
    setScoring(true);
    try {
      const response = await base44.functions.invoke("scoreInvestorLikelihood", {});
      if (response.data.success) {
        setRanked(response.data.ranked_investors);
      }
    } catch (err) {
      console.error('Scoring failed:', err);
    } finally {
      setScoring(false);
    }
  };

  const handleGenerateReminders = async () => {
    setLoadingReminders(true);
    try {
      const response = await base44.functions.invoke("scheduleFollowUpReminder", {});
      if (response.data.success) {
        setFollowUpReminders(response.data);
      }
    } catch (err) {
      console.error('Reminder generation failed:', err);
    } finally {
      setLoadingReminders(false);
    }
  };

  const handleCRMDetailOpen = (inv) => {
    const fullInvestor = investors.find(i => i.id === inv.investor_id) || inv;
    setDetailedInvestor(fullInvestor);
  };

  const handleGenerateTemplate = async (inv, stage) => {
    setSelectedInvestor(inv);
    setTemplate(null);
    setLoading(true);

    try {
      const response = await base44.functions.invoke("generateInvestorTemplate", {
        stage: stage || inv.current_stage,
        investor_name: inv.investor_name,
        investor_org: inv.investor_org,
        platform_name: "ZARP AI-Assisted IP Generation System",
        target_investment: 1500000
      });

      if (response.data.success) {
        setTemplate(response.data.template);
      }
    } catch (err) {
      console.error('Template generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Link to="/investor-portal" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-black text-base flex items-center gap-2">
              <TrendingUp size={14} className="text-yellow-400" /> Investor Outreach Pipeline
            </h1>
            <p className="text-gray-500 text-xs">AI-guided workflow with templates · Likelihood scoring · Deal progression tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleScoreInvestors} disabled={scoring || investors.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-800 hover:bg-yellow-700 disabled:opacity-40 text-white text-xs font-black transition-all">
            {scoring ? <Loader2 size={12} className="animate-spin" /> : <TrendingUp size={12} />}
            {scoring ? "Scoring..." : "Rank Investors"}
          </button>
          <button onClick={handleGenerateReminders} disabled={loadingReminders || investors.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-black transition-all">
            {loadingReminders ? <Loader2 size={12} className="animate-spin" /> : <Clock size={12} />}
            {loadingReminders ? "Generating..." : "Follow-up Reminders"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 max-w-7xl mx-auto w-full">
        {ranked.length > 0 && (
          <div className="mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-950/20 border border-green-800/50 rounded-2xl p-4">
                <p className="text-green-400 text-xs font-black uppercase tracking-widest mb-1">Hot Prospects</p>
                <p className="text-white font-black text-2xl">{ranked.filter(i => i.likelihood_score >= 75).length}</p>
                <p className="text-gray-600 text-xs mt-1">Ready to close</p>
              </div>
              <div className="bg-yellow-950/20 border border-yellow-800/50 rounded-2xl p-4">
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest mb-1">Warm Leads</p>
                <p className="text-white font-black text-2xl">{ranked.filter(i => i.likelihood_score >= 50 && i.likelihood_score < 75).length}</p>
                <p className="text-gray-600 text-xs mt-1">Nurture & engage</p>
              </div>
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4">
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Cold Leads</p>
                <p className="text-white font-black text-2xl">{ranked.filter(i => i.likelihood_score < 50).length}</p>
                <p className="text-gray-600 text-xs mt-1">Low priority</p>
              </div>
            </div>

            {/* Ranked Investors */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800 bg-yellow-950/20">
                <p className="text-yellow-400 text-xs font-black uppercase tracking-widest">Ranked by Likelihood to Purchase</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Rank</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Investor</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Org</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Stage</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-400">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-400">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((inv, idx) => (
                      <tr key={inv.investor_id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-bold text-yellow-400">#{idx + 1}</td>
                        <td className="px-4 py-3 text-sm font-bold text-white">{inv.investor_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-400">{inv.investor_org || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 uppercase">{inv.investor_type || "—"}</td>
                        <td className="px-4 py-3 text-xs">
                          <span className="px-2 py-1 rounded-lg bg-gray-800 text-gray-300">{inv.current_stage.replace(/_/g, " ")}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-2 w-20 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full" style={{
                                width: `${inv.likelihood_score}%`,
                                backgroundColor: inv.likelihood_score >= 75 ? "#22c55e" : inv.likelihood_score >= 50 ? "#f59e0b" : "#6b7280"
                              }} />
                            </div>
                            <span className="text-xs font-black w-8 text-right">{inv.likelihood_score}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-bold">
                          <span className={`px-2 py-1 rounded-lg ${
                            inv.likelihood_score >= 75 ? "bg-green-900/30 text-green-400" :
                            inv.likelihood_score >= 50 ? "bg-yellow-900/30 text-yellow-400" :
                            "bg-gray-800 text-gray-500"
                          }`}>
                            {inv.recommendation}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => handleGenerateTemplate(inv, inv.current_stage)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 text-xs font-bold transition-all">
                              <Mail size={10} /> Template
                            </button>
                            <button onClick={() => handleCRMDetailOpen(inv)}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-800/40 text-purple-400 text-xs font-bold transition-all">
                              <FileText size={10} /> Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Follow-up Reminders */}
        {followUpReminders && followUpReminders.reminders_generated > 0 && (
          <div className="mb-8 bg-red-950/20 border border-red-800/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-red-800/50 bg-red-950/30">
              <div className="flex items-center justify-between">
                <p className="text-red-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={12} /> {followUpReminders.reminders_generated} Follow-up Reminders
                </p>
                <div className="flex gap-2 text-xs text-red-300">
                  {followUpReminders.summary.critical > 0 && <span className="px-2 py-1 bg-red-900/40 rounded">🔴 {followUpReminders.summary.critical} Critical</span>}
                  {followUpReminders.summary.high > 0 && <span className="px-2 py-1 bg-orange-900/40 rounded">🟠 {followUpReminders.summary.high} High</span>}
                </div>
              </div>
            </div>
            <div className="space-y-2 p-4 max-h-64 overflow-y-auto">
              {followUpReminders.reminders.map((reminder, idx) => (
                <div key={idx} className={`border rounded-lg p-3 ${
                  reminder.urgency === "critical" ? "bg-red-900/20 border-red-700" :
                  reminder.urgency === "high" ? "bg-orange-900/20 border-orange-700" :
                  "bg-yellow-900/20 border-yellow-700"
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{reminder.investor_name}</p>
                      <p className="text-gray-400 text-xs mt-1">{reminder.suggested_action}</p>
                      <p className={`text-xs mt-1 font-bold ${
                        reminder.urgency === "critical" ? "text-red-300" :
                        reminder.urgency === "high" ? "text-orange-300" :
                        "text-yellow-300"
                      }`}>
                        {reminder.days_overdue} days overdue • Last contact: {new Date(reminder.last_contact).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCRMDetailOpen(reminder)}
                      className="flex-shrink-0 px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold">
                      Follow up
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Stages Guide */}
        <div className="mb-8">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-4">Deal Progression Stages</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {PIPELINE_STAGES.map(stage => (
              <div key={stage.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center hover:border-gray-700 transition-colors">
                <p className="text-2xl mb-1">{stage.icon}</p>
                <p className="text-xs font-bold text-white">{stage.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Template Display */}
        {template && (
          <div className="bg-gray-900 border border-blue-800/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 bg-blue-950/20">
              <p className="text-blue-400 text-xs font-black uppercase tracking-widest">
                Communication Template: {selectedInvestor?.investor_name}
              </p>
            </div>
            <div className="p-5 space-y-5">
              {/* Subject Line */}
              {template.subject_line && (
                <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Subject Line</p>
                    <CopyBtn text={template.subject_line} />
                  </div>
                  <p className="text-white font-bold">{template.subject_line}</p>
                </div>
              )}

              {/* Opening */}
              {template.opening && (
                <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Opening Hook</p>
                    <CopyBtn text={template.opening} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{template.opening}</p>
                </div>
              )}

              {/* Value Proposition */}
              {template.value_prop && (
                <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Value Proposition</p>
                    <CopyBtn text={template.value_prop} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{template.value_prop}</p>
                </div>
              )}

              {/* Key Points */}
              {template.key_points && (
                <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                  <p className="text-gray-400 text-xs font-black uppercase tracking-wider mb-3">Key Points</p>
                  <ul className="space-y-2">
                    {template.key_points.map((point, i) => (
                      <li key={i} className="text-gray-300 text-sm leading-relaxed">• {point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Call to Action */}
              {template.call_to_action && (
                <div className="border border-gray-800 rounded-xl p-4 bg-green-950/20 border-green-800/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-green-400 text-xs font-black uppercase tracking-wider">Call to Action</p>
                    <CopyBtn text={template.call_to_action} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed font-semibold">{template.call_to_action}</p>
                </div>
              )}

              {/* Closing */}
              {template.closing && (
                <div className="border border-gray-800 rounded-xl p-4 bg-gray-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-wider">Closing</p>
                    <CopyBtn text={template.closing} />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{template.closing}</p>
                </div>
              )}

              {/* Optional Attachments */}
              {template.optional_attachments && (
                <div className="border border-gray-800 rounded-xl p-4 bg-amber-950/20 border-amber-800/50">
                  <p className="text-amber-400 text-xs font-black uppercase tracking-wider mb-2">Suggested Attachments</p>
                  <ul className="space-y-1">
                    {template.optional_attachments.map((attach, i) => (
                      <li key={i} className="text-gray-300 text-sm">📎 {attach}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Copy Full Email */}
              <button
                onClick={() => {
                  const fullEmail = `${template.subject_line}\n\n${template.opening}\n\n${template.value_prop}\n\n${template.key_points.join('\n')}\n\n${template.call_to_action}\n\n${template.closing}`;
                  navigator.clipboard.writeText(fullEmail);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 hover:bg-blue-700 text-white font-black text-sm transition-all">
                <Copy size={14} /> Copy Full Email
              </button>
            </div>
          </div>
        )}

        {!ranked.length && !loading && (
          <div className="text-center py-12">
            <TrendingUp size={40} className="text-gray-800 mx-auto mb-4" />
            <p className="text-gray-600 font-bold text-sm mb-2">No investors ranked yet</p>
            <p className="text-gray-700 text-xs">Click "Rank Investors" to analyze your pipeline and generate outreach templates.</p>
          </div>
        )}
      </div>

      {/* CRM Detail Panel */}
      <InvestorCRMDetailPanel
        investor={detailedInvestor}
        onClose={() => setDetailedInvestor(null)}
        onUpdate={() => {
          if (user) {
            base44.entities.InvestorOutreach.filter({ user_email: user.email })
              .then(data => setInvestors(data));
          }
        }}
      />
    </div>
  );
}