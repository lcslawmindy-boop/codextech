import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, FileText, TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import LibraryBackground from '@/components/backgrounds/LibraryBackground';
import jsPDF from 'jspdf';

const ROI_DATA = [
  { year: 'Y1', units: 300, revenue: 2.5, cogs: 1.2, opex: 0.8, margin: 0.5 },
  { year: 'Y2', units: 1200, revenue: 10.2, cogs: 4.5, opex: 2.2, margin: 3.5 },
  { year: 'Y3', units: 5000, revenue: 42.5, cogs: 18.0, opex: 8.0, margin: 16.5 },
  { year: 'Y4', units: 12000, revenue: 102.0, cogs: 40.8, opex: 15.0, margin: 46.2 },
  { year: 'Y5', units: 25000, revenue: 212.5, cogs: 85.0, opex: 28.0, margin: 99.5 },
];

const REVENUE_MIX = [
  { name: 'Direct Consumer Sales', value: 40 },
  { name: 'Clinical/School Licensing', value: 25 },
  { name: 'Component/Kit Sales', value: 20 },
  { name: 'Data Licensing', value: 10 },
  { name: 'Software Subscription', value: 5 },
];

const FUNDING_PHASES = [
  { phase: 'Phase 1 (Months 1–6)', amount: '$75K', milestone: 'Prototype + Pilot Study' },
  { phase: 'Phase 2 (Months 7–12)', amount: '$250K', milestone: 'Beta Launch + B2B Partnerships' },
  { phase: 'Phase 3 (Year 2)', amount: '$2M', milestone: 'Manufacturing Scale + Market Entry' },
  { phase: 'Series A', amount: '$10M+', milestone: 'National Distribution + FDA Pathway' },
];

const COLORS = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b'];

export default function AutismBedBusinessStrategy() {
  const [activeTab, setActiveTab] = useState('roi');

  const exportPDF = async () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(24);
    doc.text('Autism Sensory Regulation Bed', 20, 20);
    doc.setFontSize(12);
    doc.text('Business Strategy & ROI Projection', 20, 30);
    doc.setFontSize(10);
    doc.text(`Founder: Mother, Mechanical Engineering Student, Patent Law Intern`, 20, 40);

    let y = 50;
    doc.setFontSize(14);
    doc.text('5-Year Revenue Projection', 20, y);
    y += 10;
    doc.setFontSize(9);
    doc.text('Year 1: $2.5M | Year 2: $10.2M | Year 3: $42.5M | Year 4: $102M | Year 5: $212.5M', 20, y);

    y += 15;
    doc.setFontSize(14);
    doc.text('Market Opportunity', 20, y);
    y += 10;
    doc.setFontSize(9);
    doc.text('TAM: $21B (3.5M US children × $6K average) | SAM: $1.2B (5-year addressable)', 20, y);
    y += 7;
    doc.text('SOM Year 1: $2.5M (300 units) | SOM Year 3: $42.5M (5,000 units)', 20, y);

    y += 15;
    doc.setFontSize(14);
    doc.text('Monetization Strategy', 20, y);
    y += 10;
    doc.setFontSize(9);
    REVENUE_MIX.forEach(item => {
      doc.text(`${item.name}: ${item.value}%`, 20, y);
      y += 6;
    });

    y += 10;
    doc.setFontSize(14);
    doc.text('Funding Roadmap', 20, y);
    y += 10;
    doc.setFontSize(9);
    FUNDING_PHASES.forEach(phase => {
      doc.text(`${phase.phase} — ${phase.amount} for ${phase.milestone}`, 20, y);
      y += 6;
    });

    doc.save('Autism_Bed_Business_Strategy.pdf');
  };

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <LibraryBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/60 backdrop-blur px-6 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <Link to="/autism-bed-business-strategy" className="text-gray-300 hover:text-white text-sm font-bold transition">
              Autism Bed Business Strategy
            </Link>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-sm transition"
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-16 border-b border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-cyan-500/40 bg-cyan-950/30">
              <TrendingUp size={13} className="text-cyan-400" />
              <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">5-Year Projection</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">From $75K to $212.5M</h1>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              Complete business strategy for scaling the autism sensory regulation bed from prototype to national market leader.
            </p>
          </div>
        </section>

        {/* Tabs */}
        <div className="border-b border-white/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex gap-4 flex-wrap">
            {[
              { id: 'roi', label: '5-Year ROI', icon: TrendingUp },
              { id: 'revenue', label: 'Revenue Mix', icon: DollarSign },
              { id: 'funding', label: 'Funding Phases', icon: Target },
              { id: 'strategy', label: 'Go-to-Market', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-sm transition ${
                  activeTab === tab.id ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'roi' && (
              <div className="space-y-6">
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8">
                  <h3 className="text-white font-black text-lg mb-6">5-Year Revenue & Margin Projection</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={ROI_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="year" stroke="#999" />
                      <YAxis stroke="#999" label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333' }} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="Total Revenue" />
                      <Line type="monotone" dataKey="margin" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} name="Net Margin" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Year 1 Revenue', val: '$2.5M', detail: '300 units' },
                    { label: 'Year 3 Revenue', val: '$42.5M', detail: '5,000 units/year' },
                    { label: 'Year 5 Projection', val: '$212.5M', detail: '25,000 units/year' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6 text-center">
                      <p className="text-gray-500 text-xs uppercase mb-2">{stat.label}</p>
                      <p className="text-2xl font-black text-cyan-400">{stat.val}</p>
                      <p className="text-gray-400 text-xs mt-1">{stat.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8">
                  <h3 className="text-white font-black text-lg mb-6">Diversified Revenue Streams</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={REVENUE_MIX} cx="50%" cy="50%" labelLine={false} label={(entry) => `${entry.name}: ${entry.value}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                          {REVENUE_MIX.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-3">
                      {REVENUE_MIX.map((item, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-4 h-4 rounded" style={{ background: COLORS[i % COLORS.length] }} />
                            <p className="text-white font-black text-sm">{item.name}</p>
                          </div>
                          <p className="text-gray-400 text-xs">{item.value}% of revenue mix</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'funding' && (
              <div className="space-y-4">
                {FUNDING_PHASES.map((phase, i) => (
                  <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
                      <span className="text-white font-black">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-black mb-1">{phase.phase}</p>
                      <p className="text-gray-400 text-sm mb-2">{phase.milestone}</p>
                      <p className="text-cyan-400 font-bold text-sm">{phase.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="space-y-4">
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-black text-lg mb-4">Phase 1: Prototype & Clinical Validation (Months 1–6)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Complete prototype build with all 8 sensory modalities</li>
                    <li>• IRB-approved pilot study with 10–20 autistic children</li>
                    <li>• Collect longitudinal biometric data & caregiver feedback</li>
                    <li>• File provisional patent + full patent applications</li>
                    <li>• Publish preliminary findings in autism research journals</li>
                    <li>• Budget: $75K (materials, assembly, ethics review)</li>
                  </ul>
                </div>
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-black text-lg mb-4">Phase 2: Beta Launch & B2B Partnerships (Months 7–12)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Launch pre-order campaign: 10–50 units at $8,500 each</li>
                    <li>• Partner with autism centers, schools, therapy clinics for licensing pilots</li>
                    <li>• Develop caregiver SaaS portal ($29/mo recurring revenue)</li>
                    <li>• Build component kit for DIY builders ($400–$600)</li>
                    <li>• Begin partnership discussions with major medical device distributors</li>
                    <li>• Budget: $250K (marketing, SaaS dev, partnerships)</li>
                  </ul>
                </div>
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-black text-lg mb-4">Phase 3: Manufacturing & National Scale (Year 2+)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Secure manufacturing partner for 1,000+ unit production runs</li>
                    <li>• Explore FDA pathway for medical device classification</li>
                    <li>• Launch B2C e-commerce platform + B2B sales team</li>
                    <li>• License biometric data to autism research consortiums</li>
                    <li>• Target Series A or strategic acquisition ($50M+ valuation)</li>
                    <li>• Budget: $2M (manufacturing setup, FDA, sales infrastructure)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-black text-white mb-4">Ready to Move Forward?</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/autism-bed-crowdfund"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-black text-sm text-white bg-purple-600 hover:bg-purple-500 transition">
                Join the Crowdfund
              </Link>
              <Link to="/admin-autism-bed"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-black text-sm text-white bg-cyan-600 hover:bg-cyan-500 transition">
                Admin Dashboard
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}