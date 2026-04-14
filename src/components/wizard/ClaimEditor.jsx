import { useState } from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { CLAIM_RULES, validateField } from "@/lib/patentValidation";

function ValidationBadge({ rules, text }) {
  const results = validateField(text, rules);
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const allGood = passed === total;
  const [open, setOpen] = useState(false);

  if (!text.trim()) return null;

  return (
    <div className="mt-1.5">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
          allGood ? "bg-green-950/40 text-green-400 border border-green-800" : "bg-yellow-950/40 text-yellow-400 border border-yellow-800"
        }`}>
        {allGood ? <CheckCircle2 size={10} /> : <AlertCircle size={10} />}
        {passed}/{total} USPTO rules
        {open ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
      </button>
      {open && (
        <div className="mt-2 space-y-1 pl-1">
          {results.map(r => (
            <div key={r.id} className={`flex items-start gap-2 text-xs ${r.passed ? "text-gray-500" : "text-yellow-400"}`}>
              {r.passed ? <CheckCircle2 size={10} className="text-green-500 flex-shrink-0 mt-0.5" /> : <AlertCircle size={10} className="text-yellow-500 flex-shrink-0 mt-0.5" />}
              <span>{r.passed ? r.label : r.hint}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClaimEditor({ claims, onChange }) {
  const independent = claims.independent || [""];
  const dependent = claims.dependent || [""];

  const updateInd = (i, val) => {
    const updated = [...independent];
    updated[i] = val;
    onChange({ ...claims, independent: updated });
  };

  const updateDep = (i, val) => {
    const updated = [...dependent];
    updated[i] = val;
    onChange({ ...claims, dependent: updated });
  };

  const addInd = () => onChange({ ...claims, independent: [...independent, ""] });
  const addDep = () => onChange({ ...claims, dependent: [...dependent, ""] });

  const removeInd = (i) => onChange({ ...claims, independent: independent.filter((_, idx) => idx !== i) });
  const removeDep = (i) => onChange({ ...claims, dependent: dependent.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-8">
      {/* Independent Claims */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-black text-sm">Independent Claims</h3>
            <p className="text-gray-500 text-xs mt-0.5">Broadest claims — must stand alone. Start with "A", "An", or "The". Use "comprising".</p>
          </div>
          <button onClick={addInd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-900/40 border border-indigo-700 text-indigo-300 text-xs font-bold hover:bg-indigo-800/40 transition-all">
            <Plus size={12} /> Add Claim
          </button>
        </div>
        <div className="space-y-4">
          {independent.map((claim, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-400 text-xs font-black uppercase tracking-wider">Claim {i + 1} (Independent)</span>
                {independent.length > 1 && (
                  <button onClick={() => removeInd(i)} className="text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <textarea
                value={claim}
                onChange={e => updateInd(i, e.target.value)}
                rows={4}
                placeholder={`A system for [field], comprising:\na [first element] configured to [function];\na [second element] operably connected to the [first element]; and\na [third element] configured to [output function].`}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-600 resize-none font-mono leading-relaxed"
              />
              <ValidationBadge rules={CLAIM_RULES.independent} text={claim} />
            </div>
          ))}
        </div>
      </div>

      {/* Dependent Claims */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-black text-sm">Dependent Claims</h3>
            <p className="text-gray-500 text-xs mt-0.5">Must reference a prior claim. Use "wherein" or "further comprising" to add limitations.</p>
          </div>
          <button onClick={addDep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 text-xs font-bold hover:bg-gray-700 transition-all">
            <Plus size={12} /> Add Claim
          </button>
        </div>
        <div className="space-y-4">
          {dependent.map((claim, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Claim {independent.length + i + 1} (Dependent)</span>
                {dependent.length > 1 && (
                  <button onClick={() => removeDep(i)} className="text-gray-600 hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <textarea
                value={claim}
                onChange={e => updateDep(i, e.target.value)}
                rows={3}
                placeholder={`The system of claim 1, wherein the [element] further comprises [additional limitation].`}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-gray-500 resize-none font-mono leading-relaxed"
              />
              <ValidationBadge rules={CLAIM_RULES.dependent} text={claim} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}