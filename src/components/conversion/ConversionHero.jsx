export default function ConversionHero() {
  return (
    <div className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center space-y-6">
        <div className="inline-block px-4 py-2 bg-blue-950/40 border border-blue-800 rounded-full text-blue-300 text-xs font-black uppercase tracking-widest">
          ✓ 40+ Patents Analyzed · 200+ Peer-Reviewed Sources · Verified Methodology
        </div>
        
        <h1 className="text-5xl font-black text-white leading-tight">
          Institutional-Grade Research Intelligence for Advanced Engineers
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Complete patent analysis, peer-reviewed research archives, and step-by-step engineering frameworks—all sourced from filed US patents, declassified reports, and verified technical specifications.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a href="#pricing" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
            View Membership Plans
          </a>
          <a href="/research-brief" className="px-8 py-3 rounded-lg border border-gray-700 hover:border-gray-600 text-white font-bold transition-colors">
            See Sample Research (Free)
          </a>
        </div>
      </div>
    </div>
  );
}