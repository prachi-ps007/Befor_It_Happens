// src/components/MINEMAP.jsx

export default function MineMap({ zones }) {
  // zones = { A: "safe", B: "warning", C: "danger" }

  const palette = {
    safe:    { stroke:"#6DBB7A", fill:"rgba(109,187,122,0.09)",  glow:"rgba(109,187,122,0.22)", label:"#6DBB7A", tag:"CLEAR"   },
    warning: { stroke:"#E8A83E", fill:"rgba(232,168,62,0.10)",   glow:"rgba(232,168,62,0.25)",  label:"#E8A83E", tag:"CAUTION" },
    danger:  { stroke:"#D95F3B", fill:"rgba(217,95,59,0.12)",    glow:"rgba(217,95,59,0.28)",   label:"#D95F3B", tag:"DANGER"  },
  };

  const getP = (r) => palette[r] || { stroke:"#3D2E1A", fill:"rgba(42,30,16,0.1)", glow:"transparent", label:"#5A4020", tag:"—" };

  const pA = getP(zones.A);
  const pB = getP(zones.B);
  const pC = getP(zones.C);

  const AMBER    = "#C9872A";
  const COAL     = "#0D0B09";
  const SEAM     = "#2A1E10";
  const STRATA1  = "#3D2810";
  const STRATA2  = "#221508";

  return (
    <svg
      viewBox="0 0 520 340"
      style={{ width:"100%", height:"100%", fontFamily:"'Share Tech Mono', monospace" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Rock background tile */}
        <pattern id="rockbg" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="#0e0b08"/>
          {/* horizontal strata */}
          <line x1="0" y1="12"  x2="64" y2="11"  stroke="#221508" strokeWidth="0.8"/>
          <line x1="0" y1="28"  x2="64" y2="29"  stroke="#1a1006" strokeWidth="0.5"/>
          <line x1="0" y1="44"  x2="64" y2="43"  stroke="#221508" strokeWidth="0.7"/>
          <line x1="0" y1="58"  x2="64" y2="59"  stroke="#1a1006" strokeWidth="0.4"/>
          {/* vertical joints */}
          <line x1="20" y1="0"  x2="19" y2="64"  stroke="#1a1006" strokeWidth="0.3"/>
          <line x1="46" y1="0"  x2="47" y2="64"  stroke="#1a1006" strokeWidth="0.2"/>
          {/* mineral flecks */}
          <circle cx="8"  cy="8"  r="0.8" fill="#3D2810" opacity="0.5"/>
          <circle cx="38" cy="22" r="0.6" fill="#4A3418" opacity="0.4"/>
          <circle cx="54" cy="48" r="0.9" fill="#3D2810" opacity="0.5"/>
        </pattern>

        {/* Amber tunnel fill */}
        <pattern id="tunnelFill" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#120d08"/>
          <line x1="0" y1="10" x2="20" y2="10" stroke="#1a1006" strokeWidth="0.4"/>
        </pattern>

        {/* Glows */}
        <filter id="glowG" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glowY" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glowR" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lantern" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="10" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* Gas cloud gradient */}
        <radialGradient id="gasGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D95F3B" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#D95F3B" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* ── Rock background ── */}
      <rect width="520" height="340" fill="url(#rockbg)"/>

      {/* ── Major geological strata ── */}
      <path d="M0,78 Q130,74 260,80 Q390,76 520,78" fill="none" stroke={STRATA1} strokeWidth="2.5"/>
      <path d="M0,79 Q130,76 260,82 Q390,78 520,80" fill="none" stroke={STRATA2} strokeWidth="1.2"/>

      <path d="M0,158 Q130,154 260,162 Q390,156 520,160" fill="none" stroke={STRATA1} strokeWidth="2.0"/>
      <path d="M0,159 Q130,156 260,164 Q390,158 520,162" fill="none" stroke={STRATA2} strokeWidth="0.8"/>

      <path d="M0,238 Q130,234 260,242 Q390,236 520,240" fill="none" stroke={STRATA1} strokeWidth="1.6"/>
      <path d="M0,298 Q130,295 260,302 Q390,297 520,300" fill="none" stroke={STRATA2} strokeWidth="0.8"/>

      {/* ── Depth labels ── */}
      {[["SURFACE",10],["−50 m",86],["−130 m",166],["−200 m",246],["−280 m",306]].map(([d,y]) => (
        <text key={d} x="6" y={y} fill={`${AMBER}33`} fontSize="7" letterSpacing="1">{d}</text>
      ))}

      {/* ── Main shaft (left vertical) ── */}
      <rect x="36" y="16" width="16" height="290" rx="2" fill="url(#tunnelFill)" stroke={SEAM} strokeWidth="0.8"/>
      {/* Rail lines inside shaft */}
      <line x1="40" y1="20" x2="40" y2="300" stroke={`${AMBER}15`} strokeWidth="0.5" strokeDasharray="8 6"/>
      <line x1="48" y1="20" x2="48" y2="300" stroke={`${AMBER}15`} strokeWidth="0.5" strokeDasharray="8 6"/>
      {/* Cross ties */}
      {[40,70,100,130,160,190,220,250,280].map(y => (
        <line key={y} x1="37" y1={y} x2="51" y2={y} stroke={`${AMBER}18`} strokeWidth="1.5"/>
      ))}
      <text x="24" y="165" fill={`${AMBER}30`} fontSize="7" letterSpacing="1" transform="rotate(-90 24 165)">MAIN SHAFT</text>

      {/* ── Ore cart on shaft ── */}
      <g transform="translate(36,200)">
        <rect x="1" y="-8" width="14" height="10" rx="1" fill={SEAM} stroke={`${AMBER}44`} strokeWidth="0.8"/>
        <circle cx="4"  cy="3" r="2" fill="#1a1410" stroke={`${AMBER}33`} strokeWidth="0.5"/>
        <circle cx="12" cy="3" r="2" fill="#1a1410" stroke={`${AMBER}33`} strokeWidth="0.5"/>
      </g>

      {/* ── Tunnel network ── */}
      {[
        "M52,108 L165,108",
        "M165,108 L165,172 L252,172",
        "M252,108 L360,108",
        "M360,108 L360,172 L440,172",
        "M252,172 L252,238 L165,238",
        "M52,238 L165,238",
      ].map((d,i) => (
        <g key={i}>
          {/* Tunnel walls — outer shadow */}
          <path d={d} stroke="#060503" strokeWidth="18" strokeLinecap="square" fill="none"/>
          {/* Tunnel fill */}
          <path d={d} stroke="#110e0a" strokeWidth="13" strokeLinecap="square" fill="none"/>
          {/* Ceiling highlight */}
          <path d={d} stroke={`${AMBER}08`} strokeWidth="1" strokeLinecap="square" fill="none" strokeDasharray="4 8"/>
          {/* Rail tracks */}
          <path d={d} stroke={`${AMBER}12`} strokeWidth="1" strokeLinecap="square" fill="none" strokeDasharray="6 4"/>
        </g>
      ))}

      {/* Tunnel junction circles */}
      {[[165,108],[252,108],[360,108],[165,172],[252,172],[360,172],[165,238],[252,238]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="#0e0b08" stroke={`${AMBER}22`} strokeWidth="0.8"/>
      ))}

      {/* ══════════════ ZONE A ══════════════ */}
      <g>
        {zones.A !== "safe" && (
          <rect x="65" y="62" width="128" height="68" rx="4" fill="none" stroke={pA.glow} strokeWidth="8" opacity="0.4"
            filter={zones.A==="danger"?"url(#glowR)":"url(#glowY)"}>
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur="2s" repeatCount="indefinite"/>
          </rect>
        )}

        {/* Zone body */}
        <rect x="69" y="66" width="120" height="60" rx="3"
          fill={pA.fill} stroke={pA.stroke} strokeWidth={zones.A==="danger"?"1.8":"1"}
          style={{transition:"all 0.6s"}}
          filter={zones.A==="danger"?"url(#glowR)":zones.A==="warning"?"url(#glowY)":undefined}/>

        {/* Header band */}
        <rect x="69" y="66" width="120" height="20" rx="3" fill={`${pA.stroke}22`}/>
        <rect x="69" y="79" width="120" height="7" fill={`${pA.stroke}22`}/>

        {/* Zone label */}
        <text x="80" y="80" fill={pA.label} fontSize="10" letterSpacing="2" fontWeight="700">ZONE A</text>
        <text x="179" y="80" fill={`${pA.label}88`} fontSize="7" textAnchor="end" letterSpacing="1">−50m</text>

        {/* Status */}
        <text x="80" y="97" fill={`${pA.label}77`} fontSize="7" letterSpacing="1">STATUS</text>
        <text x="118" y="97" fill={pA.label} fontSize="7" fontWeight="700" letterSpacing="1">{pA.tag}</text>

        {/* Sensor readings */}
        <text x="80" y="112" fill={`rgba(232,168,62,0.45)`} fontSize="6" letterSpacing="0.5">O₂ 20.9%  T 24°C</text>

        {/* Sensor dot */}
        <circle cx="178" cy="92" r="3.5" fill={pA.stroke} style={{filter:`drop-shadow(0 0 3px ${pA.stroke})`}}>
          <animate attributeName="opacity" values="1;0.2;1" dur={zones.A==="danger"?"0.7s":"2.2s"} repeatCount="indefinite"/>
        </circle>

        {/* Lantern icon */}
        <g opacity="0.4" transform="translate(148,70)">
          <rect x="0" y="2" width="6" height="10" rx="1" fill="none" stroke={pA.stroke} strokeWidth="0.6"/>
          <ellipse cx="3" cy="7" rx="1.5" ry="2" fill={pA.stroke} opacity="0.5"/>
        </g>
      </g>

      {/* ══════════════ ZONE B ══════════════ */}
      <g>
        {zones.B !== "safe" && (
          <rect x="258" y="62" width="128" height="68" rx="4" fill="none" stroke={pB.glow} strokeWidth="8" opacity="0.4"
            filter={zones.B==="danger"?"url(#glowR)":"url(#glowY)"}>
            <animate attributeName="opacity" values="0.25;0.55;0.25" dur="1.8s" repeatCount="indefinite"/>
          </rect>
        )}
        <rect x="262" y="66" width="120" height="60" rx="3"
          fill={pB.fill} stroke={pB.stroke} strokeWidth={zones.B==="danger"?"1.8":"1"}
          style={{transition:"all 0.6s"}}
          filter={zones.B==="danger"?"url(#glowR)":zones.B==="warning"?"url(#glowY)":undefined}/>
        <rect x="262" y="66" width="120" height="20" rx="3" fill={`${pB.stroke}22`}/>
        <rect x="262" y="79" width="120" height="7" fill={`${pB.stroke}22`}/>

        <text x="273" y="80" fill={pB.label} fontSize="10" letterSpacing="2" fontWeight="700">ZONE B</text>
        <text x="372" y="80" fill={`${pB.label}88`} fontSize="7" textAnchor="end" letterSpacing="1">−130m</text>
        <text x="273" y="97" fill={`${pB.label}77`} fontSize="7" letterSpacing="1">STATUS</text>
        <text x="311" y="97" fill={pB.label} fontSize="7" fontWeight="700" letterSpacing="1">{pB.tag}</text>
        <text x="273" y="112" fill="rgba(232,168,62,0.45)" fontSize="6" letterSpacing="0.5">O₂ 20.1%  T 31°C</text>

        <circle cx="371" cy="92" r="3.5" fill={pB.stroke} style={{filter:`drop-shadow(0 0 3px ${pB.stroke})`}}>
          <animate attributeName="opacity" values="1;0.2;1" dur={zones.B==="danger"?"0.7s":"1.8s"} repeatCount="indefinite"/>
        </circle>

        <g opacity="0.4" transform="translate(342,70)">
          <rect x="0" y="2" width="6" height="10" rx="1" fill="none" stroke={pB.stroke} strokeWidth="0.6"/>
          <ellipse cx="3" cy="7" rx="1.5" ry="2" fill={pB.stroke} opacity="0.5"/>
        </g>
      </g>

      {/* ══════════════ ZONE C ══════════════ */}
      <g>
        {zones.C !== "safe" && (
          <rect x="154" y="172" width="136" height="78" rx="4" fill="none" stroke={pC.glow} strokeWidth="10" opacity="0.4"
            filter={zones.C==="danger"?"url(#glowR)":"url(#glowY)"}>
            <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.3s" repeatCount="indefinite"/>
          </rect>
        )}

        {/* Gas cloud if danger */}
        {zones.C === "danger" && (
          <g>
            <ellipse cx="222" cy="240" rx="58" ry="22" fill="url(#gasGrad)">
              <animate attributeName="rx" values="50;66;50" dur="4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="200" cy="234" rx="30" ry="14" fill="url(#gasGrad)" opacity="0.6">
              <animate attributeName="ry" values="12;18;12" dur="3s" repeatCount="indefinite"/>
            </ellipse>
            <ellipse cx="244" cy="237" rx="24" ry="12" fill="url(#gasGrad)" opacity="0.4">
              <animate attributeName="ry" values="10;15;10" dur="3.5s" repeatCount="indefinite"/>
            </ellipse>
          </g>
        )}

        <rect x="158" y="176" width="128" height="70" rx="3"
          fill={pC.fill} stroke={pC.stroke} strokeWidth={zones.C==="danger"?"2":"1.2"}
          style={{transition:"all 0.6s"}}
          filter={zones.C==="danger"?"url(#glowR)":zones.C==="warning"?"url(#glowY)":undefined}/>
        <rect x="158" y="176" width="128" height="22" rx="3" fill={`${pC.stroke}22`}/>
        <rect x="158" y="190" width="128" height="8" fill={`${pC.stroke}22`}/>

        <text x="170" y="191" fill={pC.label} fontSize="10" letterSpacing="2" fontWeight="700">ZONE C</text>
        <text x="277" y="191" fill={`${pC.label}88`} fontSize="7" textAnchor="end" letterSpacing="1">−200m</text>
        <text x="170" y="208" fill={`${pC.label}77`} fontSize="7" letterSpacing="1">STATUS</text>
        <text x="210" y="208" fill={pC.label} fontSize="7" fontWeight="700" letterSpacing="1">{pC.tag}</text>
        <text x="170" y="222" fill="rgba(232,168,62,0.45)" fontSize="6" letterSpacing="0.5">O₂ 19.2%  T 42°C</text>
        <text x="170" y="234" fill={pC.label} fontSize="7" opacity="0.85">CH₄ 44.7ppm ▲</text>

        <circle cx="276" cy="200" r="4" fill={pC.stroke} style={{filter:`drop-shadow(0 0 5px ${pC.stroke})`}}>
          <animate attributeName="opacity" values="1;0.15;1" dur="0.8s" repeatCount="indefinite"/>
        </circle>

        <g opacity="0.4" transform="translate(248,178)">
          <rect x="0" y="2" width="6" height="10" rx="1" fill="none" stroke={pC.stroke} strokeWidth="0.6"/>
          <ellipse cx="3" cy="7" rx="1.5" ry="2" fill={pC.stroke} opacity="0.5"/>
        </g>
      </g>

      {/* ── Ventilation shaft (right side) ── */}
      <rect x="470" y="16" width="12" height="290" rx="2" fill="url(#tunnelFill)" stroke={SEAM} strokeWidth="0.6"/>
      <text x="490" y="165" fill={`${AMBER}25`} fontSize="6" letterSpacing="1" transform="rotate(90 490 165)">VENT SHAFT</text>
      {/* Airflow arrows */}
      {[40,80,120,160,200,240,280].map(y => (
        <text key={y} x="469" y={y} fill={`${AMBER}20`} fontSize="8">↑</text>
      ))}

      {/* ── Legend ── */}
      <rect x="408" y="250" width="96" height="70" rx="2" fill="rgba(14,11,8,0.92)" stroke={SEAM} strokeWidth="0.8"/>
      <text x="418" y="264" fill={`${AMBER}44`} fontSize="7" letterSpacing="1.5">LEGEND</text>
      <line x1="408" y1="268" x2="504" y2="268" stroke={SEAM} strokeWidth="0.5"/>
      {[
        { col:"#6DBB7A", label:"CLEAR",   y:282 },
        { col:"#E8A83E", label:"CAUTION", y:297 },
        { col:"#D95F3B", label:"DANGER",  y:312 },
      ].map(({col,label,y}) => (
        <g key={label}>
          <rect x="418" y={y-8} width="7" height="7" rx="1" fill={`${col}20`} stroke={col} strokeWidth="0.8"/>
          <text x="430" y={y} fill="rgba(200,175,130,0.5)" fontSize="7" letterSpacing="0.5">{label}</text>
        </g>
      ))}

      {/* ── Compass rose ── */}
      <g transform="translate(490,28)">
        <circle cx="0" cy="0" r="14" fill="#0e0b08" stroke={SEAM} strokeWidth="0.8"/>
        <circle cx="0" cy="0" r="2" fill={`${AMBER}44`}/>
        <polygon points="0,-10 2,-4 -2,-4" fill={`rgba(217,95,59,0.6)`}/>
        <polygon points="0,10 2,4 -2,4" fill={`${AMBER}33`}/>
        <text x="0" y="-12" textAnchor="middle" fill={`${AMBER}44`} fontSize="6" letterSpacing="0.5">N</text>
      </g>

      {/* ── Scale bar ── */}
      <g transform="translate(410,232)">
        <line x1="0" y1="0" x2="60" y2="0" stroke={`${AMBER}33`} strokeWidth="0.8"/>
        <line x1="0" y1="-3" x2="0" y2="3" stroke={`${AMBER}33`} strokeWidth="0.8"/>
        <line x1="60" y1="-3" x2="60" y2="3" stroke={`${AMBER}33`} strokeWidth="0.8"/>
        <text x="30" y="-5" textAnchor="middle" fill={`${AMBER}33`} fontSize="6">50 m</text>
      </g>
    </svg>
  );
}
