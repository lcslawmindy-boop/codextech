/**
 * ScalarWaveWatermark
 * Animated C.O.D.E.X.T.E.C.H. logo with scalar wave ripples emanating outward
 * like a pulsing heartbeat. Used as background watermark on landing pages.
 */
export default function ScalarWaveWatermark({ className = "fixed inset-0 pointer-events-none" }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 1024 1024"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Define animations */}
        <defs>
          <style>{`
            @keyframes heartbeat {
              0% { r: 180px; opacity: 0.4; }
              25% { r: 280px; opacity: 0.2; }
              50% { r: 380px; opacity: 0.1; }
              75% { r: 280px; opacity: 0.2; }
              100% { r: 180px; opacity: 0.4; }
            }
            
            @keyframes ripple1 {
              0% { r: 180px; opacity: 0.5; stroke-width: 2px; }
              100% { r: 420px; opacity: 0; stroke-width: 1px; }
            }
            
            @keyframes ripple2 {
              0% { r: 180px; opacity: 0; stroke-width: 2px; }
              50% { opacity: 0.4; }
              100% { r: 420px; opacity: 0; stroke-width: 1px; }
            }
            
            @keyframes glow {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.6; }
            }
            
            .heartbeat-circle {
              animation: heartbeat 1.5s ease-in-out infinite;
            }
            
            .ripple-wave-1 {
              animation: ripple1 1.5s ease-out infinite;
            }
            
            .ripple-wave-2 {
              animation: ripple2 1.5s ease-out infinite;
              animation-delay: 0.5s;
            }
            
            .glow-anim {
              animation: glow 1.5s ease-in-out infinite;
            }
          `}</style>
        </defs>

        {/* Centered container — positioned at center of viewport */}
        <g transform="translate(512, 512)">
          {/* Multiple ripple waves for scalar wave effect */}
          <circle
            cx="0"
            cy="0"
            r="180"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.3"
            className="ripple-wave-1"
          />
          <circle
            cx="0"
            cy="0"
            r="180"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2"
            opacity="0.2"
            className="ripple-wave-2"
          />

          {/* Pulsing background circle (heartbeat effect) */}
          <circle
            cx="0"
            cy="0"
            r="180"
            fill="rgba(6, 182, 212, 0.05)"
            className="heartbeat-circle"
          />

          {/* Lock/gear symbol (C.O.D.E.X.T.E.C.H. icon representation) */}
          <g className="glow-anim">
            {/* Outer gear shape */}
            <circle cx="0" cy="0" r="120" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.4" />

            {/* Gear teeth */}
            <g stroke="#06b6d4" strokeWidth="1.5" opacity="0.3">
              <line x1="0" y1="-130" x2="0" y2="-150" />
              <line x1="92" y1="-92" x2="106" y2="-106" />
              <line x1="130" y1="0" x2="150" y2="0" />
              <line x1="92" y1="92" x2="106" y2="106" />
              <line x1="0" y1="130" x2="0" y2="150" />
              <line x1="-92" y1="92" x2="-106" y2="106" />
              <line x1="-130" y1="0" x2="-150" y2="0" />
              <line x1="-92" y1="-92" x2="-106" y2="-106" />
            </g>

            {/* Vault door — thick outer frame */}
            <rect x="-70" y="-70" width="140" height="140" fill="none" stroke="#06b6d4" strokeWidth="5" opacity="0.7" rx="8" />
            
            {/* Vault door inner frame */}
            <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.4" rx="4" />

            {/* Vault dial/combination lock circle */}
            <circle cx="0" cy="0" r="35" fill="none" stroke="#06b6d4" strokeWidth="4" opacity="0.6" />
            <circle cx="0" cy="0" r="28" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" />

            {/* Center spindle */}
            <circle cx="0" cy="0" r="6" fill="#06b6d4" opacity="0.6" />

            {/* Dial tick marks */}
            <g stroke="#06b6d4" strokeWidth="2" opacity="0.4">
              <line x1="0" y1="-32" x2="0" y2="-37" />
              <line x1="23" y1="-23" x2="26" y2="-26" />
              <line x1="32" y1="0" x2="37" y2="0" />
              <line x1="23" y1="23" x2="26" y2="26" />
              <line x1="0" y1="32" x2="0" y2="37" />
              <line x1="-23" y1="23" x2="-26" y2="26" />
              <line x1="-32" y1="0" x2="-37" y2="0" />
              <line x1="-23" y1="-23" x2="-26" y2="-26" />
            </g>
          </g>

          {/* Scalar wave pattern (radiating lines) */}
          <g stroke="#06b6d4" strokeWidth="1" opacity="0.15">
            <line x1="0" y1="0" x2="0" y2="-200" />
            <line x1="0" y1="0" x2="141" y2="-141" />
            <line x1="0" y1="0" x2="200" y2="0" />
            <line x1="0" y1="0" x2="141" y2="141" />
            <line x1="0" y1="0" x2="0" y2="200" />
            <line x1="0" y1="0" x2="-141" y2="141" />
            <line x1="0" y1="0" x2="-200" y2="0" />
            <line x1="0" y1="0" x2="-141" y2="-141" />
          </g>
        </g>

        {/* Corner branding text */}
        <text x="512" y="900" textAnchor="middle" fill="#06b6d4" fontSize="24" fontWeight="bold" opacity="0.2">
          C.O.D.E.X.T.E.C.H.
        </text>
      </svg>
    </div>
  );
}

/**
 * SVG Watermark for PDF backgrounds
 * Returns raw SVG string for embedding in PDFs
 */
export function getPdfWatermarkSvg() {
  return `
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @keyframes heartbeat { 0% { r: 180px; opacity: 0.2; } 100% { r: 420px; opacity: 0; } }
          .heartbeat { animation: heartbeat 2s ease-out infinite; }
        </style>
      </defs>
      <g transform="translate(512, 512)">
        <circle cx="0" cy="0" r="180" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.15" class="heartbeat" />
        <circle cx="0" cy="0" r="120" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.1" />
        <circle cx="0" cy="0" r="60" fill="none" stroke="#06b6d4" stroke-width="3" opacity="0.15" />
        <circle cx="0" cy="0" r="40" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.1" />
        <circle cx="0" cy="-15" r="8" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.15" />
        <rect x="-3" y="0" width="6" height="20" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.15" />
        <g stroke="#06b6d4" stroke-width="1" opacity="0.08">
          <line x1="0" y1="0" x2="0" y2="-200" />
          <line x1="0" y1="0" x2="141" y2="-141" />
          <line x1="0" y1="0" x2="200" y2="0" />
          <line x1="0" y1="0" x2="141" y2="141" />
          <line x1="0" y1="0" x2="0" y2="200" />
          <line x1="0" y1="0" x2="-141" y2="141" />
          <line x1="0" y1="0" x2="-200" y2="0" />
          <line x1="0" y1="0" x2="-141" y2="-141" />
        </g>
      </g>
      <text x="512" y="900" text-anchor="middle" fill="#06b6d4" font-size="24" font-weight="bold" opacity="0.1">
        C.O.D.E.X.T.E.C.H.
      </text>
    </svg>
  `;
}