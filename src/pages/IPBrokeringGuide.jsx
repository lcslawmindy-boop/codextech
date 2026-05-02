import { Shield, DollarSign, CheckCircle2, AlertCircle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function IPBrokeringGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-4">ZAT IP Brokering & Transaction Guide</h1>
          <p className="text-gray-300 text-lg">How we keep your IP deals secure, transparent, and protected</p>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <DollarSign className="text-green-400" size={28} /> How Money is Handled
          </h2>
          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Seller Posts IP Deal',
                desc: 'Inventor lists IP, patents, or invention with asking price. Details are encrypted and only visible to verified buyers.',
              },
              {
                step: '2',
                title: 'Buyer Initiates Offer',
                desc: 'Investor makes an offer through encrypted messaging. Both parties negotiate terms via ZAT platform (anonymously).',
              },
              {
                step: '3',
                title: 'Deal Agreement',
                desc: 'Both parties agree on final terms. A formal Deal Contract is created with milestones, deliverables, and payment schedule.',
              },
              {
                step: '4',
                title: 'Funds Held in Escrow',
                desc: 'Buyer sends 100% of agreed deal amount to ZAT Stripe Escrow Account. ZAT verifies and holds funds securely. Seller sees funds are locked in.',
              },
              {
                step: '5',
                title: 'Milestones Completed',
                desc: 'Seller delivers IP documents, patents, technical specs, or other agreed deliverables. Buyer can verify and approve each milestone.',
              },
              {
                step: '6',
                title: 'Deal Verified & Released',
                desc: 'When buyer confirms satisfaction, ZAT releases 95% to seller. ZAT automatically transfers 5% commission to own account.',
              },
              {
                step: '7',
                title: 'Payout to Seller',
                desc: 'Funds arrive in seller\'s verified bank account within 2–3 business days. Commission deducted upfront—no surprises.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl bg-gray-900 border border-gray-700 hover:border-cyan-700 transition-colors">
                <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0 font-black text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Protection */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Shield className="text-cyan-400" size={28} /> Security & Fraud Protection
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <Lock size={24} />,
                title: 'Encrypted Communications',
                desc: 'All messages between inventors and investors are encrypted (AES-256). ZAT cannot read them. Anonymity protected.',
              },
              {
                icon: <DollarSign size={24} />,
                title: 'Stripe Escrow System',
                desc: 'All funds held by Stripe (not ZAT directly). Stripe is PCI-DSS certified. Buyer\'s credit card never shared with seller.',
              },
              {
                icon: <CheckCircle2 size={24} />,
                title: 'Milestone Verification',
                desc: 'Deals are structured in milestones. Buyer must verify completion before release. ZAT acts as neutral arbiter.',
              },
              {
                icon: <AlertCircle size={24} />,
                title: 'Dispute Resolution',
                desc: 'If parties disagree, ZAT reviews evidence and makes binding decision. Funds held until resolved. Appeal process available.',
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-700/30">
                <div className="text-cyan-400 mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Commission & Fees */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">💰 Pricing & Commission</h2>
          <div className="bg-gray-900 border border-cyan-700/50 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-700">
              <span className="text-gray-300">ZAT Commission on closed deals:</span>
              <span className="text-2xl font-black text-green-400">5%</span>
            </div>
            <div className="text-sm text-gray-400 space-y-2">
              <p><strong>Example Deal:</strong></p>
              <p>• Deal Amount: $100,000</p>
              <p>• ZAT Commission (5%): $5,000</p>
              <p>• Seller Receives: $95,000 (net)</p>
              <p>• Timeline: Funds arrive in 2–3 business days</p>
            </div>
          </div>
        </section>

        {/* What We Know About You */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">🔐 What ZAT Knows (For Compliance)</h2>
          <div className="bg-yellow-950/20 border border-yellow-700/50 rounded-2xl p-6">
            <p className="text-gray-300 mb-4">To comply with financial regulations and prevent fraud, ZAT collects:</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✓ Your real name (for tax reporting & commission payout)</li>
              <li>✓ Your email address (tied to your bank account)</li>
              <li>✓ Last 4 digits of your bank account (for verification)</li>
              <li>✓ Basic KYC (Know Your Customer) verification for accounts over $50K</li>
              <li>✓ Tax ID / SSN (U.S.) or equivalent (for 1099 reporting)</li>
              <li>✓ Transaction history (timestamps, amounts, parties involved)</li>
            </ul>
            <p className="text-gray-400 text-sm mt-4">
              <strong>What we DON'T know:</strong> The specific details of your IP deals, technical specs, or confidential information. Those are encrypted.
            </p>
          </div>
        </section>

        {/* Dispute Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">⚖️ Dispute Resolution Process</h2>
          <div className="space-y-4">
            {[
              { stage: 'Hour 0', title: 'Dispute Filed', desc: 'Party initiates dispute via ZAT portal with evidence (messages, contracts, milestone proof).' },
              { stage: 'Hours 0–24', title: 'Funds Frozen', desc: 'ZAT immediately freezes escrow release. Funds remain secure in Stripe account.' },
              { stage: 'Days 1–3', title: 'Evidence Collection', desc: 'ZAT collects evidence from both parties. Independent review of messages, deliverables, and agreement.' },
              { stage: 'Days 3–5', title: 'Arbitration', desc: 'ZAT makes binding decision based on contract terms and evidence. Decision sent to both parties.' },
              { stage: 'Days 5–7', title: 'Resolution', desc: 'Funds released per decision. If seller wins: 95% + dispute resolution fee. If buyer wins: full refund.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-900 border border-gray-700">
                <div className="font-black text-cyan-400 text-sm whitespace-nowrap">{item.stage}</div>
                <div>
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Terms & Guarantees */}
        <section className="mb-12">
          <h2 className="text-2xl font-black text-white mb-6">✅ ZAT Guarantees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              '100% Fund Security (backed by Stripe PCI-DSS)',
              'Anonymity Protected (encrypted comms)',
              '2–3 Day Payout Guarantee',
              'Dispute Resolution within 7 days',
              'No Hidden Fees',
              'Bank-Grade Encryption (AES-256)',
            ].map((guarantee, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-green-950/20 border border-green-700/50">
                <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                <span className="text-green-100 font-bold">{guarantee}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-6 p-8 rounded-2xl bg-gradient-to-br from-cyan-950/20 to-blue-950/20 border border-cyan-700/50">
          <h2 className="text-2xl font-black text-white">Ready to Start Brokering IP Deals?</h2>
          <p className="text-gray-300">Create your member profile, set up secure encrypted messaging, and browse active IP listings.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/member-profile-setup" className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors">
              Create Member Profile
            </Link>
            <Link to="/ip-marketplace" className="px-6 py-3 rounded-lg border-2 border-cyan-600 hover:border-cyan-500 text-cyan-400 font-bold transition-colors">
              Browse Deals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}