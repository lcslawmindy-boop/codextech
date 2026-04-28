import { AlertCircle, Shield, BookOpen, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResearchDisclaimer() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-5 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="text-xs text-gray-500 hover:text-gray-300 mb-4 inline-block">← Back</Link>
          <h1 className="text-2xl font-bold">Research Disclaimer & Terms</h1>
          <p className="text-gray-500 text-sm mt-1">Important legal information about research content</p>
        </div>
      </div>

      <div className="px-6 py-12 max-w-4xl mx-auto">
        {/* Overview */}
        <section className="mb-12 bg-yellow-950/20 border border-yellow-900/40 rounded-2xl p-8">
          <div className="flex gap-4">
            <AlertCircle size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-white font-black text-xl mb-3">Research Framework Disclosure</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                This platform provides research documentation, theoretical engineering frameworks, and historical analysis based on published academic and technical sources. This content is for educational and research purposes only. No warranties, claims about functionality, medical applications, or commercial viability are made.
              </p>
            </div>
          </div>
        </section>

        {/* Key Disclaimers */}
        <section className="mb-12">
          <h2 className="text-white font-black text-2xl mb-6">Key Disclaimers</h2>

          <div className="space-y-6">
            {[
              {
                icon: <Zap className="text-cyan-400" />,
                title: "Theoretical Frameworks Only",
                text: "All engineering systems documented on this platform are based on theoretical models and published research. No claims are made that these systems produce usable energy, medical effects, or any measurable output. The frameworks are for research and educational exploration only."
              },
              {
                icon: <BookOpen className="text-purple-400" />,
                title: "No Warranties or Guarantees",
                text: "This platform provides information 'as-is' without warranties of any kind. We do not warrant that following any documentation will produce results, that systems are safe, functional, or suitable for any purpose. Building or testing systems is entirely at the user's risk."
              },
              {
                icon: <Shield className="text-green-400" />,
                title: "High-Voltage Safety",
                text: "Any systems involving high-voltage electronics present serious safety hazards including electrocution, fire, and equipment damage. We do not recommend amateur construction. Any experimental work requires proper training, institutional oversight, and comprehensive safety protocols approved by qualified safety professionals."
              },
              {
                icon: <AlertCircle className="text-red-400" />,
                title: "No Medical or Therapeutic Claims",
                text: "No content on this platform claims to prevent, treat, cure, or mitigate any disease or medical condition. Medical applications mentioned in historical research are for reference only. Do not use any documented systems for health purposes."
              }
            ].map((item, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex gap-4 mb-3">
                  <div className="text-2xl flex-shrink-0">{item.icon}</div>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                </div>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Attribution & Citations */}
        <section className="mb-12 bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-black text-xl mb-6">Attribution & Sources</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-cyan-300 font-bold mb-2">Primary Theoretical Sources</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• <strong>James Clerk Maxwell</strong> (1865): "A Dynamical Theory of the Electromagnetic Field" — original quaternion formulation</li>
                <li>• <strong>T.E. Bearden</strong> (1982-2019): Published research on scalar electromagnetics, MEG systems, and potential theory</li>
                <li>• <strong>Oliver Heaviside</strong> (1884): Vector notation reformulation (and modifications to Maxwell's original framework)</li>
                <li>• <strong>Josiah Willard Gibbs</strong> (1888): Vector notation standardization</li>
              </ul>
            </div>

            <div>
              <h3 className="text-cyan-300 font-bold mb-2">Academic & Peer-Reviewed Literature</h3>
              <p className="text-gray-300 text-sm">
                All modules include citations to peer-reviewed publications from IEEE, Nature Physics, Physics Letters, and related journals. Historical research (Soviet bioelectromagnetics, DARPA technical reports) is cited with original sources.
              </p>
            </div>

            <div>
              <h3 className="text-cyan-300 font-bold mb-2">Patent Analysis</h3>
              <p className="text-gray-300 text-sm">
                Patent analyses are based on publicly available USPTO and international patent office records. Patent citations do not imply that claimed inventions are functional or that patents have been validated by independent testing.
              </p>
            </div>
          </div>
        </section>

        {/* Liability & Legal */}
        <section className="mb-12">
          <h2 className="text-white font-black text-xl mb-6">Liability & Legal Information</h2>

          <div className="space-y-4 text-gray-300 text-sm">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-3">Limitation of Liability</h3>
              <p>
                This platform and its operators are not liable for any damages, injuries, or losses resulting from the use or misuse of information provided. This includes but is not limited to: electrical injuries, property damage, environmental damage, business losses, or any direct or indirect consequences.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-3">User Responsibility</h3>
              <p>
                Users of this platform assume full responsibility for their actions. Any experimental work is conducted entirely at the user's risk. Users must comply with all local, state, and federal laws. Users must obtain all necessary permits, insurance, and safety certifications before conducting any experimental work.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-3">No Professional Advice</h3>
              <p>
                This platform does not provide professional engineering, legal, medical, or financial advice. Content is for informational purposes. Consult qualified professionals (licensed engineers, safety experts, legal counsel) before proceeding with any project.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold mb-3">Intellectual Property</h3>
              <p>
                All content on this platform is provided for educational use. Referenced patents, publications, and research remain the intellectual property of their original authors and patent holders. Users must respect all applicable copyright and patent laws.
              </p>
            </div>
          </div>
        </section>

        {/* Research Ethics */}
        <section className="mb-12 bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-white font-black text-xl mb-6">Responsible Research Standards</h2>

          <p className="text-gray-300 text-sm mb-6">
            This platform is intended for use by qualified researchers and engineers working within institutional frameworks. Responsible research requires:
          </p>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold flex-shrink-0">1.</span>
              <span><strong>Institutional Oversight:</strong> Work conducted within a recognized research institution with safety review and approval.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold flex-shrink-0">2.</span>
              <span><strong>Safety Protocols:</strong> Comprehensive safety plans reviewed by qualified safety professionals before work begins.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold flex-shrink-0">3.</span>
              <span><strong>Proper Training:</strong> Personnel involved have appropriate technical training for the work being conducted.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold flex-shrink-0">4.</span>
              <span><strong>Documentation:</strong> All work is properly documented and results are honestly reported (no falsification).</span>
            </li>
            <li className="flex gap-3">
              <span className="text-cyan-400 font-bold flex-shrink-0">5.</span>
              <span><strong>Peer Review:</strong> Results are subject to peer review and independent verification before any claims are made.</span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mb-12 text-center">
          <h3 className="text-white font-black text-lg mb-4">Questions or Concerns?</h3>
          <p className="text-gray-400 text-sm mb-6">
            If you have questions about sourcing, citations, or content accuracy, contact us directly.
          </p>
          <a
            href="mailto:research@example.com"
            className="inline-block px-6 py-3 rounded-lg border border-cyan-700 text-cyan-300 hover:bg-cyan-700/10 transition-colors font-bold text-sm"
          >
            Contact Support
          </a>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs border-t border-gray-800 pt-8">
          <p>Last updated: April 2026</p>
          <p>This disclaimer applies to all content on the research platform.</p>
        </div>
      </div>
    </div>
  );
}