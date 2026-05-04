import { useState } from 'react';
import { Lock, Download, Users, Clock, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IPMarketplaceVDRSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const features = [
    {
      icon: <Lock size={20} className="text-cyan-400" />,
      title: 'Secure Document Storage',
      desc: 'Encrypted upload and storage of sensitive technical documentation, patents, and due diligence files.'
    },
    {
      icon: <Clock size={20} className="text-purple-400" />,
      title: 'Time-Limited Access',
      desc: 'Granular access controls with expiration dates. Revoke access instantly when deals close.'
    },
    {
      icon: <Download size={20} className="text-green-400" />,
      title: 'Flexible Permissions',
      desc: 'Grant view-only or download access per investor. Folder-level restrictions available.'
    },
    {
      icon: <Users size={20} className="text-orange-400" />,
      title: 'Access Audit Trail',
      desc: 'Complete logging of who accessed what, when, and for how long. View and download counts.'
    },
    {
      icon: <Shield size={20} className="text-pink-400" />,
      title: 'IP Protection',
      desc: 'Prevent unauthorized sharing with automated access verification and NDA tracking.'
    },
    {
      icon: <Users size={20} className="text-blue-400" />,
      title: 'Multi-Investor Deals',
      desc: 'Manage access for multiple investors simultaneously with customized document sets per party.'
    },
  ];

  const useCases = [
    {
      title: 'Pre-Acquisition Due Diligence',
      description: 'Provide potential acquirers with secure access to complete technical documentation, patent filings, manufacturing specs, and financial records.',
      icon: '📊'
    },
    {
      title: 'Investor Funding Rounds',
      description: 'Share detailed IP valuations, freedom-to-operate analyses, prior art research, and commercialization roadmaps with Series A/B investors.',
      icon: '💰'
    },
    {
      title: 'Patent Licensing Negotiations',
      description: 'Exchange detailed claims charts, technical specifications, and licensing templates with potential licensees.',
      icon: '⚖️'
    },
    {
      title: 'Strategic Partnerships',
      description: 'Securely share development roadmaps, component BOMs, and manufacturing capabilities with co-inventors and strategic partners.',
      icon: '🤝'
    },
  ];

  return (
    <div className="space-y-16 py-16">
      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-cyan-700/50 bg-cyan-950/30">
          <Lock size={14} className="text-cyan-400" />
          <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">VDR System</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Secure Virtual Data Room
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
          Time-limited, encrypted document sharing for IP deals. Inventors control access. Investors get transparency. Everyone stays protected.
        </p>
        <Link to="/vdr-admin" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-sm text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(90deg, #4400ff, #0099ff)", boxShadow: "0 4px 24px rgba(0,150,255,0.3)" }}>
          Access VDR Administration <ArrowRight size={16} />
        </Link>
      </section>

      {/* Features Grid */}
      <section>
        <h3 className="text-2xl font-black text-white mb-8 text-center">Core Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
              <div className="mb-3">{feature.icon}</div>
              <h4 className="text-white font-black text-base mb-2">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h3 className="text-2xl font-black text-white mb-8 text-center">Use Cases</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((useCase, i) => (
            <div
              key={i}
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-cyan-700 transition"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">{useCase.icon}</span>
                <div className="flex-1">
                  <h4 className="text-white font-black text-base mb-1">{useCase.title}</h4>
                  <p className={`text-gray-400 text-sm leading-relaxed transition-all ${expandedIndex === i ? 'line-clamp-none' : 'line-clamp-2'}`}>
                    {useCase.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-white mb-8 text-center">How It Works</h3>
        <div className="space-y-4">
          {[
            { step: '1', title: 'Upload Documents', desc: 'Inventors organize sensitive files into folders (Patents, Technical, Financials, Legal) and upload to secure VDR.' },
            { step: '2', title: 'Grant Access', desc: 'Create access grants for specific investors. Set expiration dates, permission levels (view-only or download), and folder restrictions.' },
            { step: '3', title: 'Share Access Link', desc: 'Generate time-limited access links that investors use to view documents. All access is logged automatically.' },
            { step: '4', title: 'Monitor & Revoke', desc: 'Track who accessed what files, for how long, and how many times. Revoke access instantly if needed.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-black flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h4 className="text-white font-black text-base mb-1">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-black text-white mb-3">Included with Membership</h3>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Virtual Data Room access is included with all IP Marketplace features. No additional charges for documents, storage, or access grants.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="px-4 py-2 rounded-lg bg-green-950/40 border border-green-900/50 text-green-300">
            ✓ Unlimited Documents
          </div>
          <div className="px-4 py-2 rounded-lg bg-green-950/40 border border-green-900/50 text-green-300">
            ✓ Unlimited Access Grants
          </div>
          <div className="px-4 py-2 rounded-lg bg-green-950/40 border border-green-900/50 text-green-300">
            ✓ Full Audit Logs
          </div>
        </div>
      </section>
    </div>
  );
}