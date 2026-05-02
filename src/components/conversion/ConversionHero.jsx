export default function ConversionHero() {
  const logoUrl = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bcf3bcb42_df887ac44_logo.png";

  return (
    <div className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-start gap-8">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <img
              src={logoUrl}
              alt="Zenith Apex Tech"
              className="w-32 h-32 rounded-lg"
              style={{
                filter: "drop-shadow(0 0 16px rgba(59, 130, 246, 0.6))",
              }}
            />
          </div>

          {/* Company Name & Mission on Right */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-black text-white leading-tight mb-2">
                ZENITH APEX T.E.C.H
              </h1>
              <p className="text-gray-400 text-sm tracking-widest font-bold">
                Tethering · Electromagnetic · Consciousness · Hub
              </p>
            </div>

            <p className="text-lg text-gray-300 italic leading-relaxed max-w-2xl">
              "Enable inventors and engineers with institutional-grade research. Bridge patents to commercialization. Build scalable technology businesses."
            </p>

            <p className="text-sm text-gray-500">
              Institutional-grade research intelligence for advanced engineers and serious builders.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href="#pricing" className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
                View Membership Plans
              </a>
              <a href="/research-brief" className="px-6 py-2.5 rounded-lg border border-gray-700 hover:border-gray-600 text-white font-bold text-sm transition-colors">
                Free Sample
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}