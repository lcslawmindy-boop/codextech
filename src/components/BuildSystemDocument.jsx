import { AlertCircle, Zap, Wrench, Package, Info, Lock, CheckCircle2 } from "lucide-react";

export default function BuildSystemDocument({ system }) {
  const sections = [
    { id: "overview", label: "System Overview", icon: Info },
    { id: "intent", label: "Design Intent", icon: Zap },
    { id: "architecture", label: "Component Architecture", icon: Wrench },
    { id: "bom", label: "Bill of Materials", icon: Package },
    { id: "functional", label: "Functional Explanation", icon: CheckCircle2 },
    { id: "implementation", label: "Implementation Path", icon: Lock },
    { id: "safety", label: "Safety & Constraints", icon: AlertCircle },
    { id: "outcomes", label: "Expected Outcomes", icon: Zap },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800 text-blue-300 text-xs font-bold mb-4 uppercase tracking-widest">
          <Wrench size={12} /> Experimental Engineering Framework
        </div>
        <h1 className="text-4xl font-black text-white mb-3">{system.title}</h1>
        <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">{system.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
        {system.metadata && Object.entries(system.metadata).map(([key, value]) => (
          <div key={key}>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{key}</p>
            <p className="text-white font-bold text-sm">{value}</p>
          </div>
        ))}
      </div>

      {/* Table of Contents */}
      <div className="mb-12 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">Documentation Outline</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gray-800/40 hover:bg-gray-700/40 transition-colors text-gray-300 hover:text-white"
              >
                <Icon size={16} className="text-cyan-400 flex-shrink-0" />
                <span className="text-sm font-semibold">{section.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {/* 1. System Overview */}
        <section id="overview" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-950/40 border border-blue-800 flex items-center justify-center text-lg">1</div>
            <h2 className="text-2xl font-black text-white">System Overview</h2>
          </div>
          {system.overview ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300 space-y-4">
              {Array.isArray(system.overview) ? (
                system.overview.map((para, i) => <p key={i} className="leading-relaxed">{para}</p>)
              ) : (
                <p className="leading-relaxed">{system.overview}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 2. Design Intent */}
        <section id="intent" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-950/40 border border-purple-800 flex items-center justify-center text-lg">2</div>
            <h2 className="text-2xl font-black text-white">Design Intent</h2>
          </div>
          {system.designIntent ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300 space-y-4">
              {Array.isArray(system.designIntent) ? (
                system.designIntent.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="text-cyan-400 font-bold flex-shrink-0">→</span>
                    <p className="leading-relaxed">{item}</p>
                  </div>
                ))
              ) : (
                <p className="leading-relaxed">{system.designIntent}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 3. Component Architecture */}
        <section id="architecture" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-950/40 border border-green-800 flex items-center justify-center text-lg">3</div>
            <h2 className="text-2xl font-black text-white">Component Architecture</h2>
          </div>
          {system.architecture ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              {system.architecture.subsystems ? (
                <div className="space-y-6">
                  {system.architecture.subsystems.map((subsys, i) => (
                    <div key={i} className="border-l-2 border-cyan-700 pl-4">
                      <h4 className="text-white font-bold mb-2">{subsys.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{subsys.description}</p>
                      {subsys.components && (
                        <ul className="space-y-1 text-gray-300 text-sm">
                          {subsys.components.map((comp, j) => (
                            <li key={j} className="flex gap-2">
                              <span className="text-cyan-400">•</span> {comp}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">{system.architecture}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 4. Bill of Materials */}
        <section id="bom" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-yellow-950/40 border border-yellow-800 flex items-center justify-center text-lg">4</div>
            <h2 className="text-2xl font-black text-white">Bill of Materials (BOM)</h2>
          </div>
          {system.bom ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-300 font-bold">Component</th>
                    <th className="px-6 py-3 text-center text-gray-300 font-bold">Qty</th>
                    <th className="px-6 py-3 text-left text-gray-300 font-bold">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {system.bom.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-6 py-3 text-white font-semibold">{item.component}</td>
                      <td className="px-6 py-3 text-center text-gray-400">{item.quantity}</td>
                      <td className="px-6 py-3 text-gray-400 text-xs">{item.specification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 5. Functional Explanation */}
        <section id="functional" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-pink-950/40 border border-pink-800 flex items-center justify-center text-lg">5</div>
            <h2 className="text-2xl font-black text-white">Functional Explanation</h2>
          </div>
          {system.functional ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300 space-y-4">
              {Array.isArray(system.functional) ? (
                system.functional.map((para, i) => <p key={i} className="leading-relaxed">{para}</p>)
              ) : (
                <p className="leading-relaxed">{system.functional}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 6. Implementation Path */}
        <section id="implementation" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/40 border border-indigo-800 flex items-center justify-center text-lg">6</div>
            <h2 className="text-2xl font-black text-white">Implementation Path</h2>
          </div>
          {system.implementation ? (
            <div className="space-y-4">
              {system.implementation.phases && system.implementation.phases.map((phase, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-2">Phase {i + 1}: {phase.title}</h4>
                  <p className="text-gray-400 text-sm mb-3">{phase.description}</p>
                  {phase.steps && (
                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                      {phase.steps.map((step, j) => <li key={j}>{step}</li>)}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 7. Safety & Constraints */}
        <section id="safety" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-950/40 border border-red-800 flex items-center justify-center text-lg">7</div>
            <h2 className="text-2xl font-black text-white">Safety & Constraints</h2>
          </div>
          {system.safety ? (
            <div className="space-y-4">
              {system.safety.hazards && (
                <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-6">
                  <h4 className="text-red-300 font-bold mb-3">Identified Hazards</h4>
                  <ul className="space-y-2 text-gray-300">
                    {system.safety.hazards.map((hazard, i) => (
                      <li key={i} className="flex gap-3">
                        <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{hazard}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {system.safety.constraints && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h4 className="text-white font-bold mb-3">Operating Constraints</h4>
                  <ul className="space-y-2 text-gray-300">
                    {system.safety.constraints.map((constraint, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-cyan-400">•</span> {constraint}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>

        {/* 8. Expected Outcomes */}
        <section id="outcomes" className="scroll-mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-teal-950/40 border border-teal-800 flex items-center justify-center text-lg">8</div>
            <h2 className="text-2xl font-black text-white">Expected Outcomes</h2>
          </div>
          {system.outcomes ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-gray-300 space-y-4">
              {Array.isArray(system.outcomes) ? (
                system.outcomes.map((outcome, i) => (
                  <div key={i} className="flex gap-3">
                    <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{outcome}</p>
                  </div>
                ))
              ) : (
                <p className="leading-relaxed">{system.outcomes}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Section not configured</p>
          )}
        </section>
      </div>

      {/* Footer Disclaimer */}
      <div className="mt-12 bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
        <div className="flex gap-4">
          <AlertCircle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-gray-300 text-sm">
              <span className="font-bold text-white">Research Use Only.</span> This documentation presents experimental engineering frameworks for technical evaluation and prototype development in controlled laboratory environments. No component of this system has been verified as commercially viable or safe for uncontrolled deployment. Comprehensive safety analysis, peer review, and regulatory assessment are required before any operational implementation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}