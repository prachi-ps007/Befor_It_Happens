export default function MineMap({ zones }) {
  // zones = { A: "safe", B: "warning", C: "danger" }

  const palette = {
    safe:    { stroke: "#4ade80", fill: "rgba(74,222,128,0.10)",  glow: "rgba(74,222,128,0.25)",  label: "#4ade80" },
    warning: { stroke: "#facc15", fill: "rgba(250,204,21,0.10)",  glow: "rgba(250,204,21,0.22)",  label: "#facc15" },
    danger:  { stroke: "#f87171", fill: "rgba(248,113,113,0.12)", glow: "rgba(248,113,113,0.30)", label: "#f87171" },
  };

  const getP = (risk) => palette[risk] || { stroke: "#555", fill: "rgba(80,80,80,0.1)", glow: "transparent", label: "#888" };

  const pA = getP(zones.A);
  const pB = getP(zones.B);
  const pC = getP(zones.C);

  const statusText = { safe: "SAFE", warning: "CAUTION", danger: "DANGER" };

  return (
    <svg
      viewBox="0 0 480 300"
      style={{ width: "100%", height: "100%", fontFamily: "'Share Tech Mono', monospace" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Defs ── */}
      <defs>
        {/* Rock background pattern */}
        <pattern id="rockbg" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <rect width="48" height="48" fill="#0e0b08" />
          <line x1="0" y1="14" x2="48" y2="13" stroke="#2a1e10" strokeWidth="0.6" />
          <line x1="0" y1="30" x2="48" y2="31" stroke="#221808" strokeWidth="0.4" />
          <line x1="0" y1="44" x2="48" y2="43" stroke="#2a1e10" strokeWidth="0.5" />
          <line x1="16" y1="0" x2="15" y2="48" stroke="#1e1508" strokeWidth="0.3" />
          <line x1="36" y1="0" x2="37" y2="48" stroke="#1e1508" strokeWidth="0.2" />
        </pattern>

        {/* Glows */}
        <filter id="glowG" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glowY" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glowR" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Background rock ── */}
      <rect width="480" height="300" fill="url(#rockbg)" />

      {/* ── Rock strata lines ── */}
      <line x1="0" y1="72"  x2="480" y2="70"  stroke="#2e2010" strokeWidth="1.8" />
      <line x1="0" y1="148" x2="480" y2="150" stroke="#261a0c" strokeWidth="1.2" />
      <line x1="0" y1="218" x2="480" y2="216" stroke="#2e2010" strokeWidth="1.4" />
      <line x1="0" y1="272" x2="480" y2="274" stroke="#201508" strokeWidth="0.8" />

      {/* ── Depth markers ── */}
      {[["SURFACE", 14], ["−50 m", 80], ["−130 m", 156], ["−200 m", 224]].map(([d, y]) => (
        <text key={d} x="6" y={y} fill="rgba(100,72,36,0.45)" fontSize="7" letterSpacing="1">{d}</text>
      ))}

      {/* ── Tunnel system ── */}
      {[
        "M55,100 L155,100",
        "M155,100 L155,160 L240,160",
        "M240,100 L340,100",
        "M340,100 L340,160 L420,160",
        "M240,160 L240,220 L155,220",
        "M55,220 L155,220",
      ].map((d, i) => (
        <g key={i}>
          <path d={d} stroke="#3d2c18" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d={d} stroke="#100c08" strokeWidth="7"  strokeLinecap="round" fill="none" />
          <path d={d} stroke="rgba(80,58,28,0.18)" strokeWidth="1" strokeLinecap="round" fill="none" strokeDasharray="5 10" />
        </g>
      ))}

      {/* ── Main shaft (vertical bar left) ── */}
      <rect x="36" y="18" width="14" height="250" rx="3" fill="#14100c" stroke="#2e2010" strokeWidth="0.5" />
      <line x1="43" y1="18" x2="43" y2="268" stroke="rgba(80,58,28,0.25)" strokeWidth="0.5" strokeDasharray="5 5" />
      <text x="24" y="148" fill="rgba(100,72,36,0.4)" fontSize="7" letterSpacing="1" transform="rotate(-90 24 148)">MAIN SHAFT</text>

      {/* ══════════════ ZONE A ══════════════ */}
      <g style={{ cursor: "pointer" }}>
        {/* Outer glow ring when danger/warning */}
        {zones.A !== "safe" && (
          <rect x="58" y="54" width="118" height="62" rx="6" fill="none" stroke={pA.glow} strokeWidth="6" opacity="0.5"
            filter={zones.A === "danger" ? "url(#glowR)" : "url(#glowY)"}>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.8s" repeatCount="indefinite" />
          </rect>
        )}
        <rect x="62" y="58" width="110" height="54" rx="5"
          fill={pA.fill} stroke={pA.stroke} strokeWidth={zones.A === "danger" ? "2" : "1.2"}
          style={{ transition: "all 0.5s" }}
          filter={zones.A === "danger" ? "url(#glowR)" : zones.A === "warning" ? "url(#glowY)" : undefined} />
        {/* Header band */}
        <rect x="62" y="58" width="110" height="18" rx="5" fill={pA.fill} />
        <rect x="62" y="69" width="110" height="7" fill={pA.fill} />
        <text x="72" y="71" fill={pA.label} fontSize="9" letterSpacing="2" fontWeight="700">ZONE A</text>
        <text x="146" y="71" fill={pA.label} fontSize="7" opacity="0.6" textAnchor="end">−50m</text>
        <text x="72" y="86" fill="rgba(200,180,140,0.6)" fontSize="7">STATUS</text>
        <text x="115" y="86" fill={pA.label} fontSize="7" fontWeight="700" letterSpacing="1">{statusText[zones.A] || "—"}</text>
        <text x="72" y="100" fill="rgba(200,180,140,0.55)" fontSize="7">O₂ 20.9%  TEMP 24°C</text>
        {/* Blinking sensor dot */}
        <circle cx="162" cy="82" r="3" fill={pA.stroke}>
          <animate attributeName="opacity" values="1;0.2;1" dur={zones.A === "danger" ? "0.7s" : "2s"} repeatCount="indefinite" />
        </circle>
      </g>

      {/* ══════════════ ZONE B ══════════════ */}
      <g style={{ cursor: "pointer" }}>
        {zones.B !== "safe" && (
          <rect x="238" y="54" width="118" height="62" rx="6" fill="none" stroke={pB.glow} strokeWidth="6" opacity="0.5"
            filter={zones.B === "danger" ? "url(#glowR)" : "url(#glowY)"}>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.6s" repeatCount="indefinite" />
          </rect>
        )}
        <rect x="242" y="58" width="110" height="54" rx="5"
          fill={pB.fill} stroke={pB.stroke} strokeWidth={zones.B === "danger" ? "2" : "1.2"}
          style={{ transition: "all 0.5s" }}
          filter={zones.B === "danger" ? "url(#glowR)" : zones.B === "warning" ? "url(#glowY)" : undefined} />
        <rect x="242" y="58" width="110" height="18" rx="5" fill={pB.fill} />
        <rect x="242" y="69" width="110" height="7" fill={pB.fill} />
        <text x="252" y="71" fill={pB.label} fontSize="9" letterSpacing="2" fontWeight="700">ZONE B</text>
        <text x="342" y="71" fill={pB.label} fontSize="7" opacity="0.6" textAnchor="end">−130m</text>
        <text x="252" y="86" fill="rgba(200,180,140,0.6)" fontSize="7">STATUS</text>
        <text x="295" y="86" fill={pB.label} fontSize="7" fontWeight="700" letterSpacing="1">{statusText[zones.B] || "—"}</text>
        <text x="252" y="100" fill="rgba(200,180,140,0.55)" fontSize="7">O₂ 20.1%  TEMP 31°C</text>
        <circle cx="342" cy="82" r="3" fill={pB.stroke}>
          <animate attributeName="opacity" values="1;0.2;1" dur={zones.B === "danger" ? "0.7s" : "1.5s"} repeatCount="indefinite" />
        </circle>
      </g>

      {/* ══════════════ ZONE C ══════════════ */}
      <g style={{ cursor: "pointer" }}>
        {zones.C !== "safe" && (
          <rect x="148" y="164" width="128" height="72" rx="6" fill="none" stroke={pC.glow} strokeWidth="8" opacity="0.5"
            filter={zones.C === "danger" ? "url(#glowR)" : "url(#glowY)"}>
            <animate attributeName="opacity" values="0.25;0.65;0.25" dur="1.2s" repeatCount="indefinite" />
          </rect>
        )}
        {/* Gas cloud behind zone C if danger */}
        {zones.C === "danger" && (
          <g opacity="0.5">
            <ellipse cx="212" cy="215" rx="50" ry="18" fill={pC.glow}>
              <animate attributeName="rx" values="44;56;44" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="195" cy="210" rx="28" ry="12" fill={pC.glow} opacity="0.5" />
            <ellipse cx="232" cy="212" rx="22" ry="10" fill={pC.glow} opacity="0.4" />
          </g>
        )}
        <rect x="152" y="168" width="120" height="64" rx="5"
          fill={pC.fill} stroke={pC.stroke} strokeWidth={zones.C === "danger" ? "2.2" : "1.2"}
          style={{ transition: "all 0.5s" }}
          filter={zones.C === "danger" ? "url(#glowR)" : zones.C === "warning" ? "url(#glowY)" : undefined} />
        <rect x="152" y="168" width="120" height="20" rx="5" fill={pC.fill} />
        <rect x="152" y="180" width="120" height="8" fill={pC.fill} />
        <text x="162" y="182" fill={pC.label} fontSize="9" letterSpacing="2" fontWeight="700">ZONE C</text>
        <text x="264" y="182" fill={pC.label} fontSize="7" opacity="0.6" textAnchor="end">−200m</text>
        <text x="162" y="198" fill="rgba(200,180,140,0.6)" fontSize="7">STATUS</text>
        <text x="205" y="198" fill={pC.label} fontSize="7" fontWeight="700" letterSpacing="1">{statusText[zones.C] || "—"}</text>
        <text x="162" y="213" fill="rgba(200,180,140,0.55)" fontSize="7">O₂ 19.2%  TEMP 42°C</text>
        <text x="162" y="225" fill={pC.label} fontSize="7" opacity="0.8">CH₄ 44.7ppm ▲</text>
        <circle cx="262" cy="192" r="4" fill={pC.stroke}>
          <animate attributeName="opacity" values="1;0.15;1" dur="0.8s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* ── Legend ── */}
      <rect x="380" y="232" width="88" height="58" rx="3" fill="rgba(14,11,8,0.88)" stroke="#2e2010" strokeWidth="0.5" />
      <text x="390" y="246" fill="rgba(155,118,52,0.5)" fontSize="7" letterSpacing="1">LEGEND</text>
      {[
        { col: "#4ade80", label: "SAFE",    y: 258 },
        { col: "#facc15", label: "CAUTION", y: 271 },
        { col: "#f87171", label: "DANGER",  y: 284 },
      ].map(({ col, label, y }) => (
        <g key={label}>
          <rect x="390" y={y - 7} width="8" height="8" rx="1" fill={`${col}25`} stroke={col} strokeWidth="0.8" />
          <text x="402" y={y} fill="rgba(200,175,130,0.55)" fontSize="7">{label}</text>
        </g>
      ))}

      {/* ── Compass ── */}
      <g transform="translate(454, 22)">
        <circle cx="0" cy="0" r="13" fill="#0e0b08" stroke="#2e2010" strokeWidth="0.5" />
        <text x="0" y="-4" textAnchor="middle" fill="rgba(155,118,52,0.55)" fontSize="7" letterSpacing="1">N</text>
        <line x1="0" y1="-9" x2="0" y2="-2" stroke="rgba(155,118,52,0.5)" strokeWidth="1.2" />
        <polygon points="0,-10 2,-5 -2,-5" fill="rgba(248,113,113,0.7)" />
      </g>
    </svg>
  );
}
