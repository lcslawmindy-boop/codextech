import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, TrendingUp, DollarSign, Target, Users, BarChart3, FileText } from 'lucide-react';
import LibraryBackground from '@/components/backgrounds/LibraryBackground';

const COST_BREAKDOWN = [
  { item: 'Therapeutic Bed Frame (Titanium alloy)', cost: 2800 },
  { item: 'EEG Neural Interface (14-ch, BLE)', cost: 1850 },
  { item: 'Biometric Suite (HRV / GSR / SpO2)', cost: 680 },
  { item: 'PEMF Helmholtz Coil Pair', cost: 890 },
  { item: 'Vibroacoustic Transducer Array (×4)', cost: 640 },
  { item: 'EMF Faraday Shielding Canopy', cost: 640 },
  { item: 'Chromotherapy LED Dome System', cost: 880 },
  { item: 'Aromatherapy Diffusion Array', cost: 280 },
  { item: 'AI Control PCB + Raspberry Pi', cost: 580 },
  { item: 'Weighted Pressure Bladder System', cost: 420 },
  { item: 'Sensory Accessory Tray Kit', cost: 195 },
  { item: 'Safety E-Stop + Emergency Relay', cost: 300 },
];

const MONETIZATION_PATHS = [
  { title: 'Direct Consumer Sales', desc: '$8,500–$12,000 per unit (high margins)', rev: '40%' },
  { title: 'Clinical/Educational Licensing', desc: 'Schools, therapy centers, hospitals (recurring)', rev: '25%' },
  { title: 'Component/Kit Sales', desc: '$200–$400 DIY kits for individual builders', rev: '20%' },
  { title: 'Data Licensing', desc: 'Anonymized biometric insights to autism research orgs', rev: '10%' },
  { title: 'Software/App Subscription', desc: '$29/mo per family for extended caregiver portal', rev: '5%' },
];

const MARKET_SIZE = [
  { segment: 'US Autism Spectrum Children (3–17)', val: '3.5M' },
  { segment: 'TAM @ $6K avg per household', val: '$21B' },
  { segment: 'SAM (addressable, 5 years)', val: '$1.2B' },
  { segment: 'SOM (Year 1 realistic)', val: '$2.5M' },
];

export default function AdminAutismBedDashboard() {
  const [tab, setTab] = useState('overview');
  const prototypeCost = COST_BREAKDOWN.reduce((sum, i) => sum + i.cost, 0);

  const exportPDF = () => {
    alert('PDF export coming. Strategic business deck with cost/ROI projections.');
  };

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
      <LibraryBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/60 backdrop-blur px-6 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">← Back to Platform</Link>
            <h1 className="text-2xl font-black text-white">Autism Sensory Bed — Business Strategy</h1>
            <div className="w-20" />
          </div>
        </div>

        {/* Hero */}
        <section className="px-6 py-16 text-center border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-pink-500/40 bg-pink-950/30">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-xs font-black tracking-widest text-pink-400 uppercase">Strategic Business Hub</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              From Prototype to Market:<br />
              <span style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                The Autism Bed Path to Scale
              </span>
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto mb-6">
              Founder: Mother of an autistic child, mechanical engineering student, patent law intern. Mission: Bring evidence-based sensory regulation to market with clinical rigor.
            </p>
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition"
            >
              <Download size={16} /> Download Strategy Deck (PDF)
            </button>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="border-b border-white/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex gap-4 flex-wrap">
            {[
              { id: 'overview', icon: Target, label: 'Overview' },
              { id: 'costs', icon: DollarSign, label: 'Cost Breakdown' },
              { id: 'monetization', icon: TrendingUp, label: 'Monetization' },
              { id: 'market', icon: BarChart3, label: 'Market Size' },
              { id: 'strategy', icon: FileText, label: 'Go-to-Market' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-black text-sm transition ${
                  tab === t.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <section className="px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8">
                  <h3 className="text-2xl font-black text-white mb-4">The Opportunity</h3>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    3.5 million children on the autism spectrum in the US lack a scalable, data-driven sensory regulation tool. Current solutions are passive, static, and non-adaptive. We're building the first intelligent bed that continuously monitors anxiety and delivers multi-modal calming responses.
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                    The founder's lived experience as a parent combined with mechanical engineering expertise and patent law knowledge creates a unique market advantage.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { val: '$75K', label: 'Prototype Phase Cost' },
                      { val: '8', label: 'Sensory Systems' },
                      { val: '3.5M', label: 'US Market' },
                      { val: '$21B', label: 'TAM' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-gray-800 rounded-lg p-4 text-center">
                        <p className="text-xl font-black text-white">{stat.val}</p>
                        <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'costs' && (
              <div className="space-y-6">
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 border-b border-gray-700 bg-gray-800 font-black text-sm text-gray-400 uppercase">
                    <span>Component</span>
                    <span>Cost</span>
                  </div>
                  {COST_BREAKDOWN.map((item, i) => (
                    <div key={i} className={`grid grid-cols-[1fr_auto] gap-4 px-6 py-3 text-sm ${i % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                      <span className="text-gray-300">{item.item}</span>
                      <span className="text-cyan-400 font-black">${item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1fr_auto] gap-4 px-6 py-4 border-t border-gray-700 bg-gray-800">
                    <span className="text-white font-black">Total Prototype Cost</span>
                    <span className="text-white font-black text-lg">${prototypeCost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-purple-950/50 border border-purple-900 rounded-xl p-6">
                  <p className="text-gray-400 text-sm mb-3"><strong className="text-white">Manufacturing Volume Discount (1000 units):</strong> ~35–40% reduction via component aggregation & assembly optimization. Per-unit cost drops to $3,200–$3,800.</p>
                  <p className="text-gray-400 text-sm"><strong className="text-white">Margin Target:</strong> 60–70% gross margin at $8,500 retail price per unit.</p>
                </div>
              </div>
            )}

            {tab === 'monetization' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MONETIZATION_PATHS.map((path, i) => (
                    <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                      <p className="text-white font-black text-lg mb-2">{path.title}</p>
                      <p className="text-gray-400 text-sm mb-4">{path.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-cyan-400 font-bold text-xs">Revenue Mix</span>
                        <span className="text-cyan-400 font-black text-lg">{path.rev}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-green-950/50 border border-green-900 rounded-xl p-6">
                  <p className="text-gray-400 text-sm"><strong className="text-white">Year 1 Projection (Conservative):</strong> 300 units sold (direct + licensing) = $2.5M revenue. Year 3: 5,000 units/year = $42.5M revenue run rate.</p>
                </div>
              </div>
            )}

            {tab === 'market' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                    <h4 className="text-white font-black mb-4">Market Sizing</h4>
                    {MARKET_SIZE.map((m, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-b-0">
                        <span className="text-gray-400 text-sm">{m.segment}</span>
                        <span className="text-cyan-400 font-black">{m.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                    <h4 className="text-white font-black mb-4">Competitive Landscape</h4>
                    <div className="space-y-3 text-sm text-gray-400">
                      <p><strong className="text-white">Direct Competitors:</strong> None. This is a white space.</p>
                      <p><strong className="text-white">Adjacent Solutions:</strong> Weighted blankets ($200–$500), therapy mats, sound machines — all passive.</p>
                      <p><strong className="text-white">Our Advantage:</strong> First data-driven, adaptive, multi-modal system with clinical monitoring.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'strategy' && (
              <div className="space-y-4">
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-black text-lg mb-4">Phase 1: Prototype & Validation (Months 1–6)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✓ Complete prototype build ($75K)</li>
                    <li>✓ IRB-approved pilot study with 10–20 children</li>
                    <li>✓ Gather longitudinal biometric data & caregiver feedback</li>
                    <li>✓ Patent applications filed (provisional + full)</li>
                  </ul>
                </div>
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-black text-lg mb-4">Phase 2: Beta Launch & B2B Partnerships (Months 7–12)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✓ 10–50 unit pre-order campaign ($8,500/unit)</li>
                    <li>✓ Partner with autism centers & schools for licensing pilots</li>
                    <li>✓ Develop SaaS caregiver portal (recurring revenue)</li>
                    <li>✓ Publish research findings in peer-reviewed journals</li>
                  </ul>
                </div>
                <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-black text-lg mb-4">Phase 3: Scale & Market Entry (Year 2+)</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>✓ Manufacturer partnership for 1,000+ unit production runs</li>
                    <li>✓ FDA pathway exploration for medical device classification</li>
                    <li>✓ B2C e-commerce launch + institutional sales team</li>
                    <li>✓ Series A or acquisition discussions (target: $50M+ valuation)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-black text-white mb-4">Ready to Invest or Partner?</h3>
            <p className="text-gray-400 mb-6">View the crowdfunding details or schedule a strategic call.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/autism-bed-crowdfund"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-black text-sm text-white bg-purple-600 hover:bg-purple-500 transition">
                Crowdfund Details <ArrowRight size={14} />
              </Link>
              <Link to="/autism-bed-business-strategy"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-black text-sm text-white bg-cyan-600 hover:bg-cyan-500 transition">
                Full Strategy Deck <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}