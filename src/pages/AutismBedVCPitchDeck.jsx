import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, Target, BarChart3, ArrowRight, Download } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueProjection = [
  { year: 2026, units: 5, mrr: 87750, arr: 1053000 },
  { year: 2027, units: 25, mrr: 438750, arr: 5265000 },
  { year: 2028, units: 80, mrr: 1404000, arr: 16848000 },
  { year: 2029, units: 200, mrr: 3510000, arr: 42120000 },
  { year: 2030, units: 500, mrr: 8775000, arr: 105300000 },
];

const unitEconomics = [
  { name: 'MSRP', value: 55000, color: '#00ff99' },
  { name: 'COGS', value: 17600, color: '#ff6b6b' },
  { name: 'Gross Profit', value: 37400, color: '#00ccff' },
];

const pricingTiers = [
  { tier: 'MedBed Lite', hw: 12000, saas: 99, market: 'Home wellness', annual: 210000 },
  { tier: 'MedBed Pro', hw: 55000, saas: 499, market: 'Clinical/wellness', annual: 280000 },
  { tier: 'MedBed Elite', hw: 75000, saas: 999, market: 'Enterprise/hospital', annual: 350000 },
  { tier: 'EM Trigger', hw: 28000, saas: 299, market: 'Research/PEMF', annual: 180000 },
];

const marketSegments = [
  { segment: 'Autism Therapy Centers', size: 8200, penetration: 0.05, revenue: 82000000 },
  { segment: 'Clinical Wellness Centers', size: 15000, penetration: 0.08, revenue: 132000000 },
  { segment: 'Private Practices (Neurology)', size: 4500, penetration: 0.06, revenue: 27000000 },
  { segment: 'Home/Consumer (Subscription)', size: 3500000, penetration: 0.001, revenue: 210000000 },
];

const topInvestors = [
  { rank: 1, name: 'Khosla Ventures', focus: 'Deeptech, Climate, Health', check: '50M-500M', contact: 'healthcare@khosla.com', notes: 'Early-stage medtech, neuroscience' },
  { rank: 2, name: 'Founders Fund', focus: 'AI, Biotech, Payments', check: '25M-100M', contact: 'invest@foundersfund.com', notes: 'Bold bets on future technologies' },
  { rank: 3, name: 'Sequoia Capital', focus: 'Enterprise, Healthcare', check: 'Flexible', contact: 'healthcare@sequoia.com', notes: 'World-class medtech exits' },
  { rank: 4, name: 'a16z Bio + Health', focus: 'Biotech, Digital Health', check: '10M-50M', contact: 'invest@a16z.com', notes: 'Backed Ginkgo, 23andMe' },
  { rank: 5, name: 'Y Combinator + Continuity', focus: 'Hardware, Biotech', check: '2M-20M seed', contact: 'applications@ycombinator.com', notes: 'YC portfolio + S18/S19 rounds' },
  { rank: 6, name: 'Andreessen Horowitz (a16z)', focus: 'Growth + Enterprise', check: 'Series B+', contact: 'invest@a16z.com', notes: 'Supports neuroscience ventures' },
  { rank: 7, name: 'Sapphire Ventures', focus: 'SaaS, Enterprise', check: '25M-100M', contact: 'invest@sapphireventures.com', notes: 'Healthcare platform plays' },
  { rank: 8, name: 'Silver Lake Partners', focus: 'Tech, Healthcare', check: '100M+', contact: 'info@silverlake.com', notes: 'Growth equity in medtech' },
  { rank: 9, name: 'Lightspeed Venture Partners', focus: 'Deeptech, Healthcare', check: '20M-80M', contact: 'invest@lsvp.com', notes: 'Portfolio: Aspiration, TPG' },
  { rank: 10, name: 'Bessemer Venture Partners', focus: 'Enterprise, Biotech', check: '10M-50M', contact: 'bvp@bvp.com', notes: 'Cloud 100 healthcare exits' },
  { rank: 11, name: 'Norwest Venture Partners', focus: 'Healthcare, SaaS', check: '15M-75M', contact: 'healthcare@nvp.com', notes: 'Neurology & autism focus' },
  { rank: 12, name: 'GV (Google Ventures)', focus: 'AI, Healthcare, Climate', check: '10M-50M', contact: 'invest@gv.com', notes: 'AI-adaptive therapeutic devices' },
  { rank: 13, name: 'Accel Partners', focus: 'Enterprise, Healthtech', check: '20M-100M', contact: 'invest@accel.com', notes: 'Portfolio: Calm, Ada' },
  { rank: 14, name: 'Felicis Ventures', focus: 'Biotech, Enterprise', check: '10M-50M', contact: 'invest@felicisventures.com', notes: 'Bold healthcare bets' },
  { rank: 15, name: 'Insight Partners', focus: 'Enterprise SaaS', check: '50M-200M', contact: 'invest@insightpartners.com', notes: 'Healthcare platform scaling' },
];

export default function AutismBedVCPitchDeck() {
  const [activeTab, setActiveTab] = useState('executive');

  return (
    <div className="min-h-screen bg-black px-6 py-10 relative" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 border border-cyan-500/40 bg-cyan-950/30">
            <TrendingUp size={13} className="text-cyan-400" />
            <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">VC Pitch Deck</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-3">Autism Sensory Regulation Bed</h1>
          <p className="text-gray-400 text-lg max-w-2xl">AI-Adaptive Therapeutic Sensory Platform | Series A Target: $18M | TAM: $89B</p>
        </div>

        {/* Key Metrics Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Target Valuation', value: '$480M', icon: DollarSign },
            { label: 'TAM', value: '$89B', icon: Target },
            { label: 'Series A Target', value: '$18M', icon: TrendingUp },
            { label: 'Gross Margin', value: '68%', icon: BarChart3 },
            { label: 'Payback Period', value: '6-14 mo', icon: Users },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-gradient-to-br from-purple-950/50 to-blue-950/50 border border-purple-700/40 rounded-2xl p-5 backdrop-blur">
                <Icon size={16} className="text-purple-400 mb-2" />
                <p className="text-gray-500 text-xs font-bold uppercase mb-1">{m.label}</p>
                <p className="text-white font-black text-xl">{m.value}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-4">
          {[
            { id: 'executive', label: 'Executive Summary' },
            { id: 'financials', label: 'Financial Projections' },
            { id: 'uniteconomics', label: 'Unit Economics' },
            { id: 'market', label: 'Market Analysis' },
            { id: 'investors', label: 'Investor Targets' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-900/70 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-4">The Opportunity</h2>
              <p className="text-gray-300 text-base leading-relaxed mb-6">
                3.5M+ children on autism spectrum in US alone experience sensory dysregulation. Current solutions are passive (blankets, white noise). We're building the first <strong>AI-adaptive, multi-modal therapeutic bed</strong> that monitors biometrics in real-time and delivers personalized sensory interventions.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '8 Sensory Modalities', value: 'Integrated' },
                  { label: 'Real-Time Biometrics', value: 'HRV, EEG, GSR' },
                  { label: 'AI Personalization', value: 'Per-child' },
                  { label: 'Data Ownership', value: 'Caregiver' },
                ].map((s, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                    <p className="text-gray-500 text-xs font-bold mb-1">{s.label}</p>
                    <p className="text-white font-black text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900/70 border border-green-900/40 rounded-2xl p-8 backdrop-blur">
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                  <span className="text-green-400">✓</span> Market Need
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• 22% CAGR in autism diagnosis (2000–2023)</li>
                  <li>• 70% of families lack affordable early intervention tools</li>
                  <li>• Meltdown prevention = $15K–$50K savings per incident</li>
                  <li>• Clinical data supports multi-modal sensory therapy</li>
                </ul>
              </div>
              <div className="bg-gray-900/70 border border-blue-900/40 rounded-2xl p-8 backdrop-blur">
                <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                  <span className="text-blue-400">→</span> Go-To-Market
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Direct-to-clinic (wellness centers, therapists)</li>
                  <li>• B2B2C (insurance partnerships, NGOs)</li>
                  <li>• Consumer subscription (home rentals, $99–$999/mo)</li>
                  <li>• Research licensing (universities, clinical trials)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-6">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-6">5-Year Revenue Projection</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueProjection}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ background: '#1a1a2e', border: '1px solid #00ccff', borderRadius: '8px' }}
                    formatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="arr" stroke="#00ff99" strokeWidth={3} name="Annual Revenue" />
                </LineChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-500 text-xs font-bold">2026</p>
                  <p className="text-white font-black text-lg">$1.05M</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-500 text-xs font-bold">2028</p>
                  <p className="text-white font-black text-lg">$16.8M</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-500 text-xs font-bold">2030</p>
                  <p className="text-white font-black text-lg">$105.3M</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-6">Unit Economics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={unitEconomics} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: $${value.toLocaleString()}`} outerRadius={100} fill="#8884d8" dataKey="value">
                    {unitEconomics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-500 text-xs font-bold">MSRP</p>
                  <p className="text-white font-black text-lg">$55K</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-500 text-xs font-bold">COGS (Target)</p>
                  <p className="text-white font-black text-lg">$17.6K</p>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-500 text-xs font-bold">Gross Profit</p>
                  <p className="text-green-400 font-black text-lg">$37.4K</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uniteconomics' && (
          <div className="space-y-6">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-6">MedBed Pro Unit Economics (Clinical)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Hardware Cost (MSRP)</span>
                    <span className="text-white font-black">$55,000</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="text-gray-400">COGS (32% target)</span>
                    <span className="text-white font-black">$17,600</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Gross Profit (Hardware)</span>
                    <span className="text-green-400 font-black">$37,400</span>
                  </div>
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-gray-300 font-bold">Annual SaaS Revenue</span>
                    <span className="text-cyan-400 font-black">$5,988 ($499/mo)</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-800">
                    <span className="text-gray-400">Annual Consumables</span>
                    <span className="text-white font-black">$1,500</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-gray-400">5-Year LTV per Unit</span>
                    <span className="text-white font-black">$97,340</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-950/50 to-blue-950/50 border border-purple-700/40 rounded-xl p-6">
                  <h3 className="text-white font-black text-sm mb-4">Revenue per Bed (Annual)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minimum (70% utilization)</span>
                      <span className="text-green-400 font-black">$210,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maximum (100% utilization)</span>
                      <span className="text-green-400 font-black">$351,000</span>
                    </div>
                    <div className="border-t border-purple-700/40 mt-3 pt-3">
                      <p className="text-purple-300 text-xs font-bold">ROI Payback: 6–14 months</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-6">Pricing Tiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {pricingTiers.map((tier, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <p className="text-cyan-400 font-black text-sm mb-3">{tier.tier}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hardware</span>
                        <span className="text-white font-bold">${(tier.hw/1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">SaaS</span>
                        <span className="text-white font-bold">${tier.saas}/mo</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <p className="text-gray-500 mb-1">{tier.market}</p>
                        <p className="text-green-400 font-black">${(tier.annual/1000).toFixed(0)}K annual</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-6">Total Addressable Market (TAM)</h2>
              <div className="space-y-4">
                {marketSegments.map((seg, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-5">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white font-black">{seg.segment}</p>
                      <p className="text-green-400 font-black text-lg">${(seg.revenue / 1000000).toFixed(0)}M</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div><span className="text-gray-500">Total Units:</span> <span className="text-white font-bold">{seg.size.toLocaleString()}</span></div>
                      <div><span className="text-gray-500">Penetration:</span> <span className="text-white font-bold">{(seg.penetration * 100).toFixed(2)}%</span></div>
                      <div><span className="text-gray-500">Est. Revenue:</span> <span className="text-cyan-400 font-bold">${(seg.revenue / 1000000).toFixed(0)}M</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-cyan-950/50 to-purple-950/50 border border-cyan-700/40 rounded-xl p-6 mt-6">
                <p className="text-gray-400 text-sm mb-2">Total TAM Opportunity</p>
                <p className="text-white font-black text-3xl">$451M</p>
                <p className="text-gray-500 text-xs mt-2">Conservative estimate: 5-year addressable TAM across 4 primary segments</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'investors' && (
          <div className="space-y-6">
            <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 backdrop-blur">
              <h2 className="text-2xl font-black text-white mb-6">Top 15 Target VCs for Series A</h2>
              <div className="space-y-3 max-h-[800px] overflow-y-auto pr-4">
                {topInvestors.map((inv) => (
                  <div key={inv.rank} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-cyan-700/50 transition">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-cyan-400 font-black text-lg">#{inv.rank}</p>
                        <p className="text-white font-black text-sm">{inv.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-bold">FOCUS</p>
                        <p className="text-gray-300 text-xs">{inv.focus}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-bold">CHECK SIZE</p>
                        <p className="text-white font-black text-xs">{inv.check}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-bold">CONTACT</p>
                        <p className="text-cyan-400 text-xs break-all">{inv.contact}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs font-bold">NOTES</p>
                        <p className="text-gray-300 text-xs">{inv.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-950/50 to-teal-950/50 border border-green-700/40 rounded-2xl p-8">
              <h3 className="text-white font-black text-lg mb-4">Outreach Strategy</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>✓ <strong>Tier 1 (Khosla, Founders Fund, Sequoia):</strong> Lead with neuroscience data + $480M valuation narrative</li>
                <li>✓ <strong>Tier 2 (a16z, YC Continuity):</strong> Emphasize AI/ML personalization + 22% CAGR autism market</li>
                <li>✓ <strong>Tier 3 (Growth equity):</strong> Target on $16.8M–$105M revenue trajectory + unit economics</li>
                <li>✓ <strong>Timeline:</strong> 3-month fund raise starting Q2 2026</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}