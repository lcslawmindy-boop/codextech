/**
 * ZenithLogoCorner — fixed neon logo signature shown on every page.
 * Renders above all content (z-index 9998) in the bottom-left corner.
 */
export default function ZenithLogoCorner() {
  return (
    <div
      className="fixed bottom-4 left-3 flex flex-col items-start gap-1 pointer-events-none"
      style={{ zIndex: 9998 }}
    >
      {/* Dark backing plate */}
      <div
        className="flex items-center gap-2 px-2.5 py-2 rounded-xl"
        style={{
          background: "rgba(0,5,18,0.88)",
          border: "1.5px solid rgba(0,220,255,0.75)",
          boxShadow: "0 0 18px rgba(0,200,255,0.45), inset 0 0 10px rgba(0,120,255,0.08)",
        }}
      >
        <img
          src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6722a4c01_839284090_logo.png"
          alt="Zenith Apex Tech"
          className="h-9 w-9 rounded-lg"
          style={{
            filter: "drop-shadow(0 0 10px rgba(0,220,255,1)) drop-shadow(0 0 4px rgba(255,255,255,0.8)) brightness(1.3)",
          }}
        />
        <div className="flex flex-col leading-tight">
          <span
            className="text-white font-black tracking-widest"
            style={{
              fontSize: "9px",
              textShadow: "0 0 10px rgba(0,220,255,1), 0 0 4px rgba(255,255,255,0.9)",
              letterSpacing: "0.12em",
            }}
          >
            ZENITH APEX TECH
          </span>
          <span
            className="font-bold"
            style={{
              fontSize: "6px",
              color: "rgba(0,230,255,0.85)",
              textShadow: "0 0 8px rgba(0,200,255,0.8)",
              letterSpacing: "0.08em",
            }}
          >
            TEST · ENGINEER · CONSTRUCT
          </span>
        </div>
      </div>
    </div>
  );
}