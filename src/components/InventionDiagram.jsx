// SVG schematic diagrams for each invention type

const diagrams = {
  toroid: ({ color = "#ef4444" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Toroid core */}
      <ellipse cx="160" cy="120" rx="70" ry="45" fill="none" stroke="#475569" strokeWidth="22" />
      <ellipse cx="160" cy="120" rx="70" ry="45" fill="none" stroke="#1e293b" strokeWidth="18" />
      {/* Windings */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => {
        const angle = (i / 12) * Math.PI * 2;
        const ox = Math.cos(angle) * 70, oy = Math.sin(angle) * 45;
        const nx = Math.cos(angle) * 55, ny = Math.sin(angle) * 35;
        return <line key={i} x1={160+ox} y1={120+oy} x2={160+nx} y2={120+ny} stroke={color} strokeWidth="3" strokeLinecap="round" />;
      })}
      {/* Copper shield ring */}
      <ellipse cx="160" cy="120" rx="90" ry="60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
      {/* Gap in shield */}
      <line x1="250" y1="110" x2="255" y2="130" stroke="#0f172a" strokeWidth="4" />
      {/* Labels */}
      <text x="160" y="200" textAnchor="middle" fill="#94a3b8" fontSize="11">Shielded Toroidal Coil</text>
      <text x="265" y="135" fill="#f59e0b" fontSize="9">Shield Gap</text>
      {/* Input/Output wires */}
      <line x1="90" y1="105" x2="40" y2="95" stroke={color} strokeWidth="2" />
      <circle cx="35" cy="93" r="4" fill={color} />
      <text x="30" y="83" fill="#94a3b8" fontSize="9">In</text>
      <line x1="90" y1="135" x2="40" y2="145" stroke="#22c55e" strokeWidth="2" />
      <circle cx="35" cy="147" r="4" fill="#22c55e" />
      <text x="10" y="157" fill="#94a3b8" fontSize="9">∇φ Out</text>
      {/* Ground symbol */}
      <line x1="35" y1="147" x2="35" y2="170" stroke="#64748b" strokeWidth="2" />
      <line x1="25" y1="170" x2="45" y2="170" stroke="#64748b" strokeWidth="2" />
      <line x1="28" y1="175" x2="42" y2="175" stroke="#64748b" strokeWidth="1.5" />
      <line x1="31" y1="179" x2="39" y2="179" stroke="#64748b" strokeWidth="1" />
      {/* DDS block */}
      <rect x="240" y="85" width="55" height="30" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="267" y="104" textAnchor="middle" fill="#93c5fd" fontSize="9">DDS</text>
      <line x1="240" y1="100" x2="230" y2="120" stroke="#3b82f6" strokeWidth="1.5" />
    </svg>
  ),

  interferometer: ({ color = "#3b82f6" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Left transmitter coil */}
      <ellipse cx="60" cy="120" rx="30" ry="50" fill="none" stroke={color} strokeWidth="3" />
      <ellipse cx="60" cy="120" rx="18" ry="35" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="60" y="185" textAnchor="middle" fill="#94a3b8" fontSize="9">TX-1</text>
      {/* Right transmitter coil */}
      <ellipse cx="260" cy="120" rx="30" ry="50" fill="none" stroke={color} strokeWidth="3" />
      <ellipse cx="260" cy="120" rx="18" ry="35" fill="#1e293b" stroke="#334155" strokeWidth="1" />
      <text x="260" y="185" textAnchor="middle" fill="#94a3b8" fontSize="9">TX-2</text>
      {/* Beam lines from TX1 */}
      {[-2,-1,0,1,2].map(i => (
        <line key={`l${i}`} x1="90" y1={120+i*15} x2="160" y2={120+i*5} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
      ))}
      {/* Beam lines from TX2 */}
      {[-2,-1,0,1,2].map(i => (
        <line key={`r${i}`} x1="230" y1={120+i*15} x2="160" y2={120+i*5} stroke={color} strokeWidth="1" strokeOpacity="0.4" />
      ))}
      {/* Energy bottle zone */}
      <ellipse cx="160" cy="120" rx="22" ry="28" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="160" y="114" textAnchor="middle" fill={color} fontSize="8">E=0</text>
      <text x="160" y="124" textAnchor="middle" fill={color} fontSize="8">B=0</text>
      <text x="160" y="134" textAnchor="middle" fill="#22c55e" fontSize="7">φ≠0</text>
      <text x="160" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11">Scalar Energy Bottle Interferometer</text>
      {/* Scalar detector */}
      <rect x="148" y="50" width="24" height="16" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
      <text x="160" y="62" textAnchor="middle" fill="#4ade80" fontSize="7">φ Det</text>
      <line x1="160" y1="66" x2="160" y2="92" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* FPGA */}
      <rect x="138" y="10" width="44" height="22" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="160" y="25" textAnchor="middle" fill="#93c5fd" fontSize="9">FPGA</text>
    </svg>
  ),

  vpo: ({ color = "#22c55e" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* LC Tank circle */}
      <circle cx="160" cy="110" r="60" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="5 4" />
      {/* Inductor symbol */}
      <path d="M 120 110 q 5 -15 10 0 q 5 -15 10 0 q 5 -15 10 0 q 5 -15 10 0" fill="none" stroke={color} strokeWidth="2.5" />
      <text x="160" y="95" textAnchor="middle" fill={color} fontSize="9">L 100µH</text>
      {/* Capacitor symbol */}
      <line x1="140" y1="140" x2="180" y2="140" stroke="#06b6d4" strokeWidth="3" />
      <line x1="140" y1="148" x2="180" y2="148" stroke="#06b6d4" strokeWidth="3" />
      <line x1="160" y1="148" x2="160" y2="165" stroke="#06b6d4" strokeWidth="2" />
      <line x1="160" y1="110" x2="160" y2="132" stroke="#06b6d4" strokeWidth="2" />
      <text x="185" y="147" fill="#06b6d4" fontSize="9">C</text>
      {/* Quartz crystal */}
      <rect x="220" y="98" width="24" height="24" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
      <line x1="224" y1="104" x2="224" y2="116" stroke="#f59e0b" strokeWidth="3" />
      <line x1="240" y1="104" x2="240" y2="116" stroke="#f59e0b" strokeWidth="3" />
      <text x="232" y="137" textAnchor="middle" fill="#f59e0b" fontSize="8">Xtal</text>
      {/* Vacuum isolation */}
      <rect x="30" y="90" width="55" height="40" rx="5" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="57" y="106" textAnchor="middle" fill="#c084fc" fontSize="8">Vacuum</text>
      <text x="57" y="118" textAnchor="middle" fill="#c084fc" fontSize="8">Ground</text>
      <line x1="85" y1="110" x2="110" y2="110" stroke="#a855f7" strokeWidth="1.5" />
      <text x="160" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11">Vacuum Potential Oscillator (VPO)</text>
      {/* MOSFET symbol */}
      <line x1="195" y1="85" x2="215" y2="85" stroke="#64748b" strokeWidth="2" />
      <line x1="210" y1="78" x2="210" y2="92" stroke="#64748b" strokeWidth="2" />
      <line x1="210" y1="78" x2="220" y2="74" stroke="#64748b" strokeWidth="2" />
      <line x1="210" y1="92" x2="220" y2="96" stroke="#64748b" strokeWidth="2" />
      <text x="205" y="70" fill="#94a3b8" fontSize="8">Q1</text>
      {/* Title */}
      <text x="160" y="30" textAnchor="middle" fill="#94a3b8" fontSize="10">LC Tank + Quartz Gate</text>
    </svg>
  ),

  biofield: ({ color = "#22c55e" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Left chamber (donor) */}
      <rect x="20" y="60" width="110" height="120" rx="6" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
      <text x="75" y="80" textAnchor="middle" fill="#ef4444" fontSize="9">Donor Cells</text>
      {/* Cell dots in donor */}
      {[[50,100],[70,115],[90,100],[60,130],[80,130],[100,115]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.7" />
      ))}
      {/* UV photon arrows */}
      {[90,105,120].map((y,i) => (
        <g key={i}>
          <line x1="132" y1={y} x2="185" y2={y} stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
          <polygon points={`182,${y-4} 190,${y} 182,${y+4}`} fill="#a855f7" />
        </g>
      ))}
      {/* Quartz window */}
      <rect x="128" y="75" width="15" height="95" rx="2" fill="#e2e8f0" fillOpacity="0.15" stroke="#93c5fd" strokeWidth="2" />
      <text x="135" y="180" textAnchor="middle" fill="#93c5fd" fontSize="7" transform="rotate(-90 135 150)">Quartz</text>
      {/* Right chamber (recipient) */}
      <rect x="190" y="60" width="110" height="120" rx="6" fill="#1e293b" stroke={color} strokeWidth="2" />
      <text x="245" y="80" textAnchor="middle" fill={color} fontSize="9">Recipient Cells</text>
      {/* Healthy cells */}
      {[[215,100],[235,115],[255,100],[225,130],[245,130],[265,115]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="8" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" opacity="0.8" />
      ))}
      {/* PMT detector */}
      <rect x="240" y="20" width="40" height="22" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="260" y="34" textAnchor="middle" fill="#f59e0b" fontSize="8">PMT</text>
      <line x1="260" y1="42" x2="260" y2="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" />
      {/* DDS driver */}
      <rect x="25" y="20" width="45" height="22" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="47" y="34" textAnchor="middle" fill="#93c5fd" fontSize="8">DDS</text>
      <line x1="47" y1="42" x2="47" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 2" />
      <text x="160" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11">Kaznacheyev UV Transmission Chamber</text>
    </svg>
  ),

  generator: ({ color = "#f59e0b" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Rotor */}
      <circle cx="160" cy="120" r="65" fill="none" stroke="#334155" strokeWidth="2" />
      <circle cx="160" cy="120" r="10" fill="#475569" stroke="#64748b" strokeWidth="2" />
      {/* 8 magnets on rotor */}
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (i/8)*Math.PI*2; const r=52;
        const x=160+Math.cos(a)*r, y=120+Math.sin(a)*r;
        const rot = (i/8)*360;
        return (
          <rect key={i} x={x-8} y={y-5} width="16" height="10" rx="2"
            fill={i%2===0 ? "#ef4444" : "#3b82f6"}
            stroke="#64748b" strokeWidth="1"
            transform={`rotate(${rot} ${x} ${y})`} />
        );
      })}
      {/* Stator coils */}
      {[0,1,2,3,4,5].map(i => {
        const a = (i/6)*Math.PI*2;
        const x=160+Math.cos(a)*90, y=120+Math.sin(a)*75;
        return <rect key={i} x={x-8} y={y-6} width="16" height="12" rx="2" fill="none" stroke={color} strokeWidth="2" />;
      })}
      {/* Spark gap symbol */}
      <line x1="245" y1="80" x2="265" y2="80" stroke="#06b6d4" strokeWidth="2" />
      <circle cx="270" cy="80" r="3" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
      <circle cx="260" cy="80" r="3" fill="#1e293b" stroke="#06b6d4" strokeWidth="1.5" />
      <text x="265" y="70" textAnchor="middle" fill="#06b6d4" fontSize="8">Spark Gap</text>
      {/* Capacitor bank */}
      <rect x="260" y="90" width="35" height="45" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      <text x="277" y="117" textAnchor="middle" fill="#c084fc" fontSize="7">Cap</text>
      <text x="277" y="127" textAnchor="middle" fill="#c084fc" fontSize="7">Bank</text>
      {/* Drive motor */}
      <rect x="15" y="100" width="40" height="40" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
      <text x="35" y="124" textAnchor="middle" fill="#4ade80" fontSize="9">Motor</text>
      <line x1="55" y1="120" x2="95" y2="120" stroke="#22c55e" strokeWidth="2" />
      <text x="160" y="210" textAnchor="middle" fill="#94a3b8" fontSize="11">8-Pole Open-System Magnetic Generator</text>
      <text x="160" y="23" textAnchor="middle" fill="#f59e0b" fontSize="9">N S N S N S N S — Rotor Magnet Polarity</text>
    </svg>
  ),

  detector: ({ color = "#a855f7" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* 4-crystal array */}
      {[[80,80],[140,80],[80,140],[140,140]].map(([x,y],i) => (
        <g key={i}>
          <rect x={x-18} y={y-12} width="36" height="24" rx="3" fill="#1e293b" stroke={color} strokeWidth="2" />
          <text x={x} y={y+4} textAnchor="middle" fill="#c084fc" fontSize="9">Xtal C{i+1}</text>
        </g>
      ))}
      {/* Summing network */}
      <rect x="175" y="98" width="40" height="24" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <text x="195" y="114" textAnchor="middle" fill="#94a3b8" fontSize="8">Σ Sum</text>
      {[80,140].map(x => [80,140].map(y => (
        <line key={`${x}${y}`} x1={x+18} y1={y} x2="175" y2="110" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      )))}
      {/* LNA block */}
      <rect x="225" y="98" width="35" height="24" rx="3" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="242" y="114" textAnchor="middle" fill="#93c5fd" fontSize="9">LNA</text>
      <line x1="215" y1="110" x2="225" y2="110" stroke="#3b82f6" strokeWidth="1.5" />
      {/* ADC/RPi */}
      <rect x="220" y="145" width="60" height="35" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
      <text x="250" y="162" textAnchor="middle" fill="#4ade80" fontSize="8">ADC 14-bit</text>
      <text x="250" y="173" textAnchor="middle" fill="#4ade80" fontSize="8">125 MSPS</text>
      <line x1="242" y1="122" x2="242" y2="145" stroke="#22c55e" strokeWidth="1.5" />
      {/* Kurtosis burst detection label */}
      <rect x="20" y="170" width="150" height="35" rx="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="95" y="185" textAnchor="middle" fill="#fbbf24" fontSize="9">Kurtosis Burst Detector</text>
      <text x="95" y="197" textAnchor="middle" fill="#78716c" fontSize="8">Fireflies Effect (Gravitobiology Fig.14)</text>
      {/* Faraday cage */}
      <rect x="60" y="58" width="120" height="105" rx="4" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5 4" />
      <text x="120" y="50" textAnchor="middle" fill="#64748b" fontSize="8">Faraday Cage</text>
      <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">Quantum Potential EMI — Fireflies Detector</text>
    </svg>
  ),

  therapy: ({ color = "#22c55e" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* DDS module */}
      <rect x="15" y="80" width="55" height="35" rx="4" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
      <text x="42" y="96" textAnchor="middle" fill="#93c5fd" fontSize="9">DDS</text>
      <text x="42" y="108" textAnchor="middle" fill="#4b5563" fontSize="7">AD9910</text>
      {/* PA */}
      <rect x="90" y="80" width="45" height="35" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
      <text x="112" y="100" textAnchor="middle" fill="#fca5a5" fontSize="9">25W PA</text>
      <line x1="70" y1="97" x2="90" y2="97" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Helmholtz coil top */}
      <ellipse cx="210" cy="75" rx="60" ry="18" fill="none" stroke={color} strokeWidth="3" />
      <text x="210" y="56" textAnchor="middle" fill={color} fontSize="8">Helmholtz Coil A</text>
      {/* Helmholtz coil bottom */}
      <ellipse cx="210" cy="165" rx="60" ry="18" fill="none" stroke={color} strokeWidth="3" />
      <text x="210" y="197" textAnchor="middle" fill={color} fontSize="8">Helmholtz Coil B</text>
      {/* Uniform field zone */}
      <rect x="155" y="88" width="110" height="65" rx="4" fill={color} fillOpacity="0.07" stroke={color} strokeWidth="1" strokeDasharray="4 3" />
      <text x="210" y="122" textAnchor="middle" fill={color} fontSize="9">Uniform B-Field</text>
      <text x="210" y="134" textAnchor="middle" fill="#4ade80" fontSize="8">Trigger Window Freq</text>
      {/* Wiring */}
      <line x1="135" y1="97" x2="150" y2="97" stroke="#ef4444" strokeWidth="1.5" />
      <line x1="150" y1="97" x2="150" y2="75" stroke="#ef4444" strokeWidth="1.5" />
      <line x1="150" y1="75" x2="150" y2="165" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
      {/* RPi control */}
      <rect x="15" y="150" width="70" height="35" rx="4" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      <text x="50" y="166" textAnchor="middle" fill="#c084fc" fontSize="8">Raspberry Pi</text>
      <text x="50" y="177" textAnchor="middle" fill="#6b7280" fontSize="7">Protocol Lib</text>
      <line x1="50" y1="150" x2="50" y2="115" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 2" />
      <line x1="50" y1="115" x2="42" y2="115" stroke="#a855f7" strokeWidth="1.5" />
      <line x1="42" y1="115" x2="42" y2="115" stroke="#a855f7" strokeWidth="1.5" />
      <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">EM Trigger Window Therapy — Helmholtz System</text>
    </svg>
  ),

  pcm: ({ color = "#06b6d4" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* BaTiO3 crystal */}
      <rect x="130" y="85" width="60" height="70" rx="4" fill="#1e293b" stroke={color} strokeWidth="2.5" />
      <text x="160" y="116" textAnchor="middle" fill={color} fontSize="8">BaTiO₃</text>
      <text x="160" y="128" textAnchor="middle" fill="#22d3ee" fontSize="7">Nonlinear</text>
      <text x="160" y="139" textAnchor="middle" fill="#22d3ee" fontSize="7">Crystal</text>
      {/* Forward pump beam */}
      <line x1="20" y1="100" x2="130" y2="100" stroke="#22c55e" strokeWidth="2" />
      <polygon points="127,96 135,100 127,104" fill="#22c55e" />
      <text x="75" y="92" textAnchor="middle" fill="#4ade80" fontSize="8">Pump Fwd →</text>
      {/* Backward pump beam */}
      <line x1="300" y1="140" x2="190" y2="140" stroke="#22c55e" strokeWidth="2" />
      <polygon points="193,136 185,140 193,144" fill="#22c55e" />
      <text x="245" y="152" textAnchor="middle" fill="#4ade80" fontSize="8">← Pump Bwd</text>
      {/* Probe beam */}
      <line x1="20" y1="170" x2="100" y2="140" stroke="#f59e0b" strokeWidth="2" />
      <polygon points="97,136 105,140 100,148" fill="#f59e0b" />
      <text x="45" y="165" fill="#fbbf24" fontSize="8">Probe →</text>
      {/* Phase conjugate output */}
      <line x1="100" y1="140" x2="20" y2="170" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 3" />
      <polygon points="37,162 25,172 30,160" fill="#ef4444" />
      <text x="45" y="185" fill="#fca5a5" fontSize="8">← Conjugate</text>
      {/* Beam splitter */}
      <line x1="100" y1="125" x2="125" y2="155" stroke="#a855f7" strokeWidth="2" />
      <text x="88" y="122" fill="#c084fc" fontSize="7">BS</text>
      {/* Pump laser labels */}
      <rect x="10" y="88" width="10" height="24" rx="2" fill="#4ade80" opacity="0.7" />
      <text x="12" y="80" fill="#4ade80" fontSize="7">532nm</text>
      <rect x="290" y="128" width="10" height="24" rx="2" fill="#4ade80" opacity="0.7" />
      <text x="286" y="125" fill="#4ade80" fontSize="7">532nm</text>
      {/* Probe laser */}
      <rect x="10" y="158" width="10" height="24" rx="2" fill="#f59e0b" opacity="0.7" />
      <text x="5" y="155" fill="#fbbf24" fontSize="7">635nm</text>
      <text x="160" y="218" textAnchor="middle" fill="#94a3b8" fontSize="11">4-Wave Mixing Phase Conjugate Mirror</text>
    </svg>
  ),

  priore: ({ color = "#ef4444" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* S''' channel (DDS1) */}
      <rect x="15" y="25" width="50" height="25" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      <text x="40" y="41" textAnchor="middle" fill="#c084fc" fontSize="8">DDS S'''</text>
      {/* S'' channel (DDS2) */}
      <rect x="15" y="70" width="50" height="25" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="40" y="86" textAnchor="middle" fill="#93c5fd" fontSize="8">DDS S''</text>
      {/* S' channel (DDS3) */}
      <rect x="15" y="115" width="50" height="25" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
      <text x="40" y="131" textAnchor="middle" fill="#4ade80" fontSize="8">DDS S'</text>
      {/* FPGA modulator */}
      <rect x="90" y="60" width="60" height="60" rx="5" fill="#1e3a5f" stroke="#3b82f6" strokeWidth="2" />
      <text x="120" y="86" textAnchor="middle" fill="#93c5fd" fontSize="8">FPGA</text>
      <text x="120" y="98" textAnchor="middle" fill="#93c5fd" fontSize="8">Mod</text>
      <text x="120" y="110" textAnchor="middle" fill="#4b5563" fontSize="7">Bearden Fig.10</text>
      <line x1="65" y1="37" x2="90" y2="70" stroke="#a855f7" strokeWidth="1.5" />
      <line x1="65" y1="82" x2="90" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="65" y1="127" x2="90" y2="110" stroke="#22c55e" strokeWidth="1.5" />
      {/* PA */}
      <rect x="170" y="75" width="45" height="30" rx="3" fill="#1e293b" stroke={color} strokeWidth="1.5" />
      <text x="192" y="94" textAnchor="middle" fill="#fca5a5" fontSize="8">50W PA</text>
      <line x1="150" y1="90" x2="170" y2="90" stroke="#3b82f6" strokeWidth="1.5" />
      {/* Treatment chamber */}
      <rect x="230" y="50" width="75" height="140" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
      <text x="267" y="72" textAnchor="middle" fill="#fbbf24" fontSize="8">Treatment</text>
      <text x="267" y="83" textAnchor="middle" fill="#fbbf24" fontSize="8">Chamber</text>
      {/* Helmholtz coil top */}
      <ellipse cx="267" cy="105" rx="30" ry="8" fill="none" stroke={color} strokeWidth="2" />
      {/* Helmholtz coil bottom */}
      <ellipse cx="267" cy="155" rx="30" ry="8" fill="none" stroke={color} strokeWidth="2" />
      {/* Patient area */}
      <ellipse cx="267" cy="130" rx="18" ry="22" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
      <text x="267" y="133" textAnchor="middle" fill={color} fontSize="7">Patient</text>
      <line x1="215" y1="90" x2="230" y2="90" stroke={color} strokeWidth="1.5" />
      <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">Prioré Multichannel EM — Bearden Fig.10</text>
    </svg>
  ),

  elfdetector: ({ color = "#ef4444" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Antenna */}
      <line x1="160" y1="20" x2="160" y2="80" stroke="#94a3b8" strokeWidth="2" />
      <line x1="130" y1="20" x2="190" y2="20" stroke="#94a3b8" strokeWidth="2" />
      <text x="160" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8">HF Antenna</text>
      {/* Upconverter */}
      <rect x="130" y="80" width="60" height="25" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="160" y="96" textAnchor="middle" fill="#fbbf24" fontSize="8">Ham-It-Up ↑</text>
      {/* RTL-SDR dongles */}
      <rect x="100" y="125" width="55" height="30" rx="3" fill="#1e293b" stroke={color} strokeWidth="2" />
      <text x="127" y="139" textAnchor="middle" fill="#fca5a5" fontSize="8">RTL-SDR #1</text>
      <text x="127" y="149" textAnchor="middle" fill="#475569" fontSize="7">TCXO 0.5ppm</text>
      <rect x="165" y="125" width="55" height="30" rx="3" fill="#1e293b" stroke={color} strokeWidth="2" />
      <text x="192" y="139" textAnchor="middle" fill="#fca5a5" fontSize="8">RTL-SDR #2</text>
      <text x="192" y="149" textAnchor="middle" fill="#475569" fontSize="7">TCXO 0.5ppm</text>
      <line x1="160" y1="105" x2="127" y2="125" stroke="#f59e0b" strokeWidth="1.5" />
      <line x1="160" y1="105" x2="192" y2="125" stroke="#f59e0b" strokeWidth="1.5" />
      {/* GPSDO */}
      <rect x="235" y="80" width="60" height="25" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
      <text x="265" y="96" textAnchor="middle" fill="#4ade80" fontSize="8">GPSDO 10MHz</text>
      <line x1="235" y1="92" x2="200" y2="140" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 3" />
      {/* RPi + display */}
      <rect x="100" y="175" width="120" height="35" rx="4" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      <text x="160" y="191" textAnchor="middle" fill="#c084fc" fontSize="8">Raspberry Pi 4B</text>
      <text x="160" y="203" textAnchor="middle" fill="#6b7280" fontSize="7">ELF Phase Coherence Detector</text>
      <line x1="127" y1="155" x2="127" y2="175" stroke="#a855f7" strokeWidth="1.5" />
      <line x1="192" y1="155" x2="192" y2="175" stroke="#a855f7" strokeWidth="1.5" />
      {/* Signal label */}
      <text x="30" y="60" fill={color} fontSize="9">5-30 MHz</text>
      <text x="30" y="72" fill={color} fontSize="9">+ 10Hz ELF?</text>
      <path d="M 25 50 Q 40 40 55 50 Q 40 60 25 50" fill={color} fillOpacity="0.3" />
      <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">ELF Carrier Lock Detector — Woodpecker Signature</text>
    </svg>
  ),

  phiriver: ({ color = "#06b6d4" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Phi Source A (high phi) */}
      <ellipse cx="60" cy="120" rx="30" ry="40" fill="none" stroke="#a855f7" strokeWidth="3" />
      <ellipse cx="60" cy="120" rx="18" ry="26" fill="#1e293b" stroke="#7c3aed" strokeWidth="1" />
      <text x="60" y="115" textAnchor="middle" fill="#c084fc" fontSize="8">φ-Source B</text>
      <text x="60" y="127" textAnchor="middle" fill="#c084fc" fontSize="8">High φ</text>
      <text x="60" y="175" textAnchor="middle" fill="#94a3b8" fontSize="8">∇φ = 0 inside</text>
      {/* Phi Source B (low phi) */}
      <ellipse cx="260" cy="120" rx="30" ry="40" fill="none" stroke="#3b82f6" strokeWidth="3" />
      <ellipse cx="260" cy="120" rx="18" ry="26" fill="#1e293b" stroke="#1d4ed8" strokeWidth="1" />
      <text x="260" y="115" textAnchor="middle" fill="#93c5fd" fontSize="8">φ-Source A</text>
      <text x="260" y="127" textAnchor="middle" fill="#93c5fd" fontSize="8">Low φ</text>
      {/* Gradient phi river (virtual particle flux) */}
      {[-1,0,1].map(off => (
        <g key={off}>
          <line x1="93" y1={120+off*14} x2="227" y2={120+off*14} stroke={color} strokeWidth={off===0?2.5:1.5} strokeOpacity={off===0?1:0.5} />
          <polygon points={`220,${120+off*14-5} 230,${120+off*14} 220,${120+off*14+5}`} fill={color} fillOpacity={off===0?1:0.5} />
        </g>
      ))}
      <text x="160" y="103" textAnchor="middle" fill={color} fontSize="9">∇φ River →</text>
      <text x="160" y="115" textAnchor="middle" fill="#22d3ee" fontSize="8">(Virtual Particle Flux)</text>
      {/* Hall bridge measurement coil */}
      <rect x="145" y="128" width="30" height="20" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
      <text x="160" y="141" textAnchor="middle" fill="#fbbf24" fontSize="7">Hall ΔΦ</text>
      {/* INA128 amp */}
      <rect x="135" y="165" width="50" height="22" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
      <text x="160" y="179" textAnchor="middle" fill="#4ade80" fontSize="8">INA128 120dB</text>
      <line x1="160" y1="148" x2="160" y2="165" stroke="#f59e0b" strokeWidth="1.5" />
      {/* ADC readout */}
      <rect x="145" y="200" width="30" height="18" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      <text x="160" y="213" textAnchor="middle" fill="#c084fc" fontSize="7">24-bit ADC</text>
      <line x1="160" y1="187" x2="160" y2="200" stroke="#22c55e" strokeWidth="1.5" />
      <text x="160" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11">Phi-River Gradient Sensor — ∇φ Detector</text>
    </svg>
  ),

  aidetector: ({ color = "#06b6d4" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* All-sky camera dome */}
      <ellipse cx="160" cy="60" rx="45" ry="30" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
      <ellipse cx="160" cy="60" rx="40" ry="25" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="160" cy="58" r="8" fill="#1e3a5f" stroke={color} strokeWidth="1.5" />
      <text x="160" y="102" textAnchor="middle" fill="#94a3b8" fontSize="9">All-Sky Camera</text>
      {/* Cloud formation types */}
      {[
        { x: 30, y: 135, label: "Radial", col: "#ef4444" },
        { x: 100, y: 135, label: "Hole-Punch", col: "#f59e0b" },
        { x: 185, y: 135, label: "Grid", col: "#22c55e" },
        { x: 265, y: 135, label: "Normal", col: "#64748b" },
      ].map(({ x, y, label, col }) => (
        <g key={label}>
          <rect x={x-25} y={y-20} width="50" height="30" rx="4" fill="#1e293b" stroke={col} strokeWidth="1.5" />
          <text x={x} y={y-4} textAnchor="middle" fill={col} fontSize="7">{label}</text>
          <line x1={x} y1={y+10} x2={x} y2={y+25} stroke={col} strokeWidth="1" strokeDasharray="3 2" />
        </g>
      ))}
      {/* AI classifier box */}
      <rect x="100" y="170" width="120" height="35" rx="5" fill="#1e3a5f" stroke={color} strokeWidth="2" />
      <text x="160" y="186" textAnchor="middle" fill={color} fontSize="9">EfficientNet-B4</text>
      <text x="160" y="198" textAnchor="middle" fill="#22d3ee" fontSize="8">Fine-tuned Classifier</text>
      {/* Arrows */}
      <line x1="160" y1="90" x2="160" y2="115" stroke={color} strokeWidth="2" />
      <polygon points="156,112 160,120 164,112" fill={color} />
      {/* Alert */}
      <rect x="240" y="175" width="65" height="22" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="272" y="189" textAnchor="middle" fill="#fbbf24" fontSize="8">Alert / Log</text>
      <line x1="220" y1="185" x2="240" y2="185" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">AI Scalar Signature Recognition — Sky Classifier</text>
    </svg>
  ),

  woodpecker: ({ color = "#ef4444" }) => (
    <svg viewBox="0 0 320 240" className="w-full h-full" style={{ background: "#0f172a" }}>
      {/* Antenna mast */}
      <line x1="160" y1="15" x2="160" y2="60" stroke="#94a3b8" strokeWidth="2.5" />
      <line x1="100" y1="15" x2="220" y2="15" stroke="#94a3b8" strokeWidth="2.5" />
      <line x1="120" y1="25" x2="200" y2="25" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="160" y="8" textAnchor="middle" fill="#94a3b8" fontSize="8">Random Wire Antenna</text>
      {/* HF upconverter */}
      <rect x="125" y="65" width="70" height="22" rx="3" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
      <text x="160" y="80" textAnchor="middle" fill="#fbbf24" fontSize="8">HF Upconverter +125MHz</text>
      <line x1="160" y1="60" x2="160" y2="65" stroke="#94a3b8" strokeWidth="2" />
      {/* RTL-SDR */}
      <rect x="120" y="100" width="80" height="25" rx="3" fill="#1e293b" stroke={color} strokeWidth="2" />
      <text x="160" y="113" textAnchor="middle" fill="#fca5a5" fontSize="8">RTL-SDR + TCXO</text>
      <text x="160" y="123" textAnchor="middle" fill="#475569" fontSize="7">2.4 MSPS / 5-30 MHz</text>
      <line x1="160" y1="87" x2="160" y2="100" stroke="#f59e0b" strokeWidth="1.5" />
      {/* PRI detector block */}
      <rect x="80" y="143" width="80" height="25" rx="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="120" y="157" textAnchor="middle" fill="#93c5fd" fontSize="8">PRI Detector</text>
      <text x="120" y="167" textAnchor="middle" fill="#4b5563" fontSize="7">10 Hz signature</text>
      {/* Audio output */}
      <rect x="180" y="143" width="60" height="25" rx="3" fill="#1e293b" stroke="#22c55e" strokeWidth="1.5" />
      <text x="210" y="157" textAnchor="middle" fill="#4ade80" fontSize="8">Audio Out</text>
      <text x="210" y="167" textAnchor="middle" fill="#4b5563" fontSize="7">tap-tap-tap</text>
      <line x1="160" y1="125" x2="120" y2="143" stroke="#3b82f6" strokeWidth="1.5" />
      <line x1="160" y1="125" x2="210" y2="143" stroke="#22c55e" strokeWidth="1.5" />
      {/* Waterfall display */}
      <rect x="60" y="185" width="200" height="25" rx="3" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <rect key={i} x={65+i*19} y={190} width="15" height="15" rx="1"
          fill={`hsl(${i*20},70%,${30+Math.sin(i)*20}%)`} opacity="0.8" />
      ))}
      <text x="160" y="225" textAnchor="middle" fill="#94a3b8" fontSize="11">Woodpecker Grid HF Scalar Signature Receiver</text>
    </svg>
  ),
};

export default function InventionDiagram({ type, color }) {
  const Diagram = diagrams[type];
  if (!Diagram) return (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 rounded-xl">
      <span className="text-gray-600 text-sm">No diagram available</span>
    </div>
  );
  return (
    <div className="w-full h-full">
      <Diagram color={color} />
    </div>
  );
}