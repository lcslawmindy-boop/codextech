import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, AlertCircle, Zap, Mail, Target, TrendingUp, Calendar, MessageSquare, Eye } from "lucide-react";

const STEPS = [
  {
    number: 1,
    title: "Define Your Target Investor Profile",
    icon: <Target size={20} />,
    description: "Before you reach out to anyone, know who you're looking for.",
    details: [
      "What industry/sector are they focused on? (e.g., energy, biotech, aerospace)",
      "What check size do they write? ($250K, $1M, $5M+)",
      "What stage do they invest in? (seed, early growth, later stage)",
      "What geographies do they cover?",
      "Do they have experience with your type of IP/technology?"
    ],
    action: "Write down 3-5 clear criteria that describe your ideal investor.",
    color: "blue"
  },
  {
    number: 2,
    title: "Build Your Investor List",
    icon: <MessageSquare size={20} />,
    description: "Compile a database of potential investors who match your profile.",
    details: [
      "Research angel investors, VCs, and strategic corporate investors",
      "Use Crunchbase, PitchBook, AngelList to find leads",
      "Look at competitors—who funded them?",
      "Ask your network for warm introductions",
      "Aim for 50-100 qualified prospects to start"
    ],
    action: "Go to Investor CRM and manually add investors or import from a CSV.",
    cta: "/investor-crm",
    ctaLabel: "Open Investor CRM",
    color: "purple"
  },
  {
    number: 3,
    title: "Add Context to Each Investor",
    icon: <AlertCircle size={20} />,
    description: "Research and document what you know about each prospect.",
    details: [
      "Recent investments they've made (shows their interests)",
      "Their stated focus areas and thesis",
      "Key team members and their background",
      "Why they might care about YOUR solution",
      "Any personal/professional connections you share"
    ],
    action: "Click into each investor in CRM and fill in notes field with research findings.",
    color: "amber"
  },
  {
    number: 4,
    title: "Rank Investors by Likelihood",
    icon: <TrendingUp size={20} />,
    description: "Use the AI scoring engine to identify your hottest prospects.",
    details: [
      "The system analyzes deal stage progression (cold → meeting → term sheet)",
      "Scores engagement based on communication history",
      "Rates fit based on investment size alignment",
      "Factors in response patterns (who actually replies)",
      "Generates an overall likelihood score (0-100%)"
    ],
    action: "Open Investor Outreach Pipeline and click 'Rank Investors' to auto-score.",
    cta: "/investor-outreach",
    ctaLabel: "View Outreach Pipeline",
    color: "green"
  },
  {
    number: 5,
    title: "Start with Warm Intros (Not Cold)",
    icon: <Mail size={20} />,
    description: "Your first outreach attempts should leverage warm connections.",
    details: [
      "Ask your network for introductions to investors you researched",
      "A warm intro dramatically increases response rates (50%+ vs 5%)",
      "Provide your introducer 2-3 bullet points to mention about you",
      "Thank them immediately after the connection is made",
      "Only go cold (full outreach) if warm intros aren't available"
    ],
    action: "Identify 5-10 investors where you have a mutual connection. Reach out to your connection first.",
    color: "pink"
  },
  {
    number: 6,
    title: "Craft Personalized Outreach Emails",
    icon: <Zap size={20} />,
    description: "Use AI to generate tailored, high-conversion emails for each investor.",
    details: [
      "Click 'AI Email' button in the Outreach Pipeline",
      "System pulls their profile, past communications, and investment history",
      "Claude generates a personalized email referencing specific details about them",
      "Email includes a clear call-to-action (usually 'quick call' or 'brief demo')",
      "Subject line is crafted to break through inbox noise"
    ],
    action: "Open Outreach Pipeline, rank investors, then click 'AI Email' on your top 3 prospects.",
    color: "cyan"
  },
  {
    number: 7,
    title: "Track Opens & Clicks",
    icon: <Eye size={20} />,
    description: "Monitor investor engagement in real-time.",
    details: [
      "When you send an email, tracking is automatic",
      "See who opened your email (and how many times)",
      "See which links they clicked and when",
      "Engagement score builds (0-100%) as they interact",
      "CRM is updated automatically—no manual logging needed"
    ],
    action: "After sending emails, check the investor's CRM detail panel for engagement metrics.",
    color: "orange"
  },
  {
    number: 8,
    title: "Strategic Follow-Up (The Most Critical Step)",
    icon: <Calendar size={20} />,
    description: "Most deals die from poor follow-up, not initial rejection.",
    details: [
      "If no reply in 3-5 days, send a follow-up (don't ghost)",
      "Follow-up system auto-generates reminders for overdue contacts",
      "Different follow-up based on stage: cold → warm → interested → negotiating",
      "Vary your approach (email → Slack → phone → LinkedIn message)",
      "Persistence + respect = most deals are ultimately made after 3-5 touches"
    ],
    action: "Click 'Follow-up Reminders' button to auto-generate a list of who needs a nudge today.",
    color: "red"
  },
  {
    number: 9,
    title: "Move Through Deal Stages",
    icon: <TrendingUp size={20} />,
    description: "Progress investors through your pipeline as engagement increases.",
    details: [
      "Prospect → Initial Outreach → Responded → Meeting Scheduled → Due Diligence",
      "When they reply, move to 'Responded'",
      "When they agree to call, move to 'Meeting Scheduled'",
      "Document any updates in their communication log",
      "Your deal probability increases as they move right"
    ],
    action: "In CRM, update each investor's stage as they progress. Log all communications.",
    color: "indigo"
  },
  {
    number: 10,
    title: "Close & Deliver",
    icon: <CheckCircle2 size={20} />,
    description: "When they're ready, move to term sheet and close.",
    details: [
      "Once they're in due diligence, shift to sharing materials (not selling)",
      "Use the VDR (Virtual Data Room) to share sensitive docs securely",
      "Have term sheet ready when requested",
      "Keep communication open and transparent",
      "Celebrate the win—you've earned it"
    ],
    action: "Use Investor Package and Term Sheet tools to move toward close.",
    cta: "/investor-package",
    ctaLabel: "View Investor Package",
    color: "emerald"
  }
];

const COMMON_MISTAKES = [
  {
    mistake: "Going to cold email too fast",
    fix: "Exhaust your warm intro network first. Cold outreach is a last resort."
  },
  {
    mistake: "Not personalizing—sending generic mass emails",
    fix: "Use the AI email tool—it references their specific investments and interests."
  },
  {
    mistake: "Giving up after one or two no-replies",
    fix: "Set up follow-up reminders. Most deals require 3-5+ touches."
  },
  {
    mistake: "Poor data entry in CRM",
    fix: "Document everything: what you sent, when they replied, what was discussed."
  },
  {
    mistake: "Talking too much about yourself, not listening",
    fix: "Ask what they care about. Let THEM talk. Mirror their priorities back."
  },
  {
    mistake: "No clear ask—leaving meetings ambiguous",
    fix: "Always end with: 'Next step would be...' Be specific about what you need."
  },
  {
    mistake: "Targeting too broad (everyone is a prospect)",
    fix: "Focus. Pick 50 highly-targeted investors. Depth beats breadth."
  },
  {
    mistake: "Not tracking what you've sent",
    fix: "Use the tracking system. See opens/clicks. Follow up on engaged investors first."
  }
];

const QUICK_TIMELINE = [
  { week: "Week 1", task: "Define target profile. Research 50-100 prospects. Build investor list." },
  { week: "Week 2-3", task: "Add context to each investor. Get warm intros lined up." },
  { week: "4+", task: "Ongoing: Send personalized outreach → Track engagement → Follow up → Schedule calls → Negotiate." }
];

export default function InvestorOutreachGuide() {
  return (
    <div className="w-screen min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80 sticky top-0 z-10">
        <div>
          <h1 className="text-white font-black text-2xl">Investor Outreach 101</h1>
          <p className="text-gray-500 text-sm">Step-by-step guide for first-time fundraisers</p>
        </div>
        <Link to="/investor-outreach" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-white font-bold text-sm transition-all">
          Go to Pipeline <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-8">
        {/* Quick Timeline */}
        <div className="bg-blue-950/20 border border-blue-800/50 rounded-2xl p-6">
          <h2 className="text-blue-400 font-black text-lg mb-4 flex items-center gap-2">
            <Calendar size={20} /> Quick Timeline
          </h2>
          <div className="space-y-3">
            {QUICK_TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="font-bold text-blue-400 text-sm min-w-fit">{item.week}</div>
                <p className="text-gray-300 text-sm">{item.task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Steps */}
        <div>
          <h2 className="text-white font-black text-xl mb-6">The 10-Step Process</h2>
          <div className="space-y-4">
            {STEPS.map((step, idx) => {
              const colorClasses = {
                blue: "border-blue-800/50 bg-blue-950/20",
                purple: "border-purple-800/50 bg-purple-950/20",
                amber: "border-amber-800/50 bg-amber-950/20",
                green: "border-green-800/50 bg-green-950/20",
                pink: "border-pink-800/50 bg-pink-950/20",
                cyan: "border-cyan-800/50 bg-cyan-950/20",
                orange: "border-orange-800/50 bg-orange-950/20",
                red: "border-red-800/50 bg-red-950/20",
                indigo: "border-indigo-800/50 bg-indigo-950/20",
                emerald: "border-emerald-800/50 bg-emerald-950/20"
              };

              const iconColorClasses = {
                blue: "text-blue-400",
                purple: "text-purple-400",
                amber: "text-amber-400",
                green: "text-green-400",
                pink: "text-pink-400",
                cyan: "text-cyan-400",
                orange: "text-orange-400",
                red: "text-red-400",
                indigo: "text-indigo-400",
                emerald: "text-emerald-400"
              };

              return (
                <div key={idx} className={`border rounded-2xl p-6 ${colorClasses[step.color]}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 ${iconColorClasses[step.color]}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${iconColorClasses[step.color]}`}>
                          STEP {step.number}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-lg">{step.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-lg p-4 mb-4 space-y-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex gap-3 text-sm text-gray-300">
                        <span className="text-gray-600 flex-shrink-0">•</span>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm italic">{step.action}</p>
                    {step.cta && (
                      <Link to={step.cta} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${iconColorClasses[step.color]} hover:opacity-80`}>
                        {step.ctaLabel} <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="bg-red-950/20 border border-red-800/50 rounded-2xl p-6">
          <h2 className="text-red-400 font-black text-lg mb-4 flex items-center gap-2">
            <AlertCircle size={20} /> Common Mistakes (And How to Avoid Them)
          </h2>
          <div className="space-y-3">
            {COMMON_MISTAKES.map((item, i) => (
              <div key={i} className="border-b border-red-800/30 pb-3 last:border-0">
                <p className="text-red-300 font-bold text-sm mb-1">❌ {item.mistake}</p>
                <p className="text-gray-400 text-sm">✅ {item.fix}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics to Track */}
        <div className="bg-yellow-950/20 border border-yellow-800/50 rounded-2xl p-6">
          <h2 className="text-yellow-400 font-black text-lg mb-4">📊 Key Metrics to Track</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">Response Rate</p>
              <p className="text-gray-400 text-xs">% of emails that get a reply. Target: 10-20% for cold, 50%+ for warm.</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">Meeting Rate</p>
              <p className="text-gray-400 text-xs">% of responses that convert to calls. Target: 30-50% of replies → meetings.</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">Deal Velocity</p>
              <p className="text-gray-400 text-xs">Days from first touch to term sheet. Target: 60-90 days with active follow-up.</p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <p className="text-yellow-300 font-bold text-sm mb-2">Pipeline Size</p>
              <p className="text-gray-400 text-xs">Total prospect count. Target: 50-100 qualified investors at any time.</p>
            </div>
          </div>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-purple-950/20 to-blue-950/20 border border-purple-800/50 rounded-2xl p-6">
          <h2 className="text-purple-400 font-black text-lg mb-4">💡 Pro Tips</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✓ <strong>Timing matters:</strong> Send emails Tuesday-Thursday, 9-11am in their timezone</li>
            <li>✓ <strong>Consistency beats perfection:</strong> Send 5 thoughtful emails today, not 1 email per week</li>
            <li>✓ <strong>Specificity wins:</strong> "Your investment in Company X shows interest in [problem]..." beats "I'm looking for funding"</li>
            <li>✓ <strong>Social proof:</strong> Mention mutual connections, shared board seats, or similar portfolio companies</li>
            <li>✓ <strong>Follow-up is expected:</strong> Not aggressive. Most investors expect 2-3 follow-ups before deciding</li>
            <li>✓ <strong>Always optimize:</strong> Track which emails get the most opens/clicks. Iterate on subject lines and openings</li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center py-8 border-t border-gray-800">
          <h3 className="text-white font-black text-lg mb-4">Ready to Start?</h3>
          <Link to="/investor-crm" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white font-black transition-all">
            Open Investor CRM & Build Your List <ArrowRight size={16} />
          </Link>
          <p className="text-gray-500 text-xs mt-4">Or explore the <Link to="/investor-outreach" className="text-blue-400 hover:underline">Outreach Pipeline</Link> if you already have investors added.</p>
        </div>
      </div>
    </div>
  );
}