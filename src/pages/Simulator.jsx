import { useState, useEffect, useRef } from "react";
import MineMap from "../components/MINEMAP";
import AlertsFeed from "../components/AlertsFeed";
import useSimulation from "../hooks/useSimulation";
import {
  calculateRiskScore,
  getRiskLevel,
  getPrediction,
} from "../utils/riskEngine";

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const fmt1   = (v) => Number(v).toFixed(1);
const fmt2   = (v) => Number(v).toFixed(2);

/* ─── colour map ───────────────────────────────────────────────────────────── */
const RISK_THEME = {
  safe:    { primary: "#4ade80", dim: "rgba(74,222,128,0.15)",  pulse: "rgba(74,222,128,0.6)",  label: "NOMINAL",   hex: "#4ade80" },
  warning: { primary: "#facc15", dim: "rgba(250,204,21,0.15)",  pulse: "rgba(250,204,21,0.6)",  label: "CAUTION",   hex: "#facc15" },
  danger:  { primary: "#f87171", dim: "rgba(248,113,113,0.18)", pulse: "rgba(248,113,113,0.7)", label: "DANGER",    hex: "#f87171" },
  critical:{ primary: "#ff4040", dim: "rgba(255,64,64,0.22)",   pulse: "rgba(255,64,64,0.8)",   label: "CRITICAL",  hex: "#ff4040" },
};
const theme = (level) => RISK_THEME[level] || RISK_THEME.safe;

/* ─── VU-meter bar ─────────────────────────────────────────────────────────── */
function VuBar({ value, max, color, vertical = false, segments = 12 }) {
  const pct   = clamp(value / max, 0, 1);
  const filled = Math.round(pct * segments);
  const bars  = Array.from({ length: segments }, (_, i) => {
    const lit = i < filled;
    const idx = i / segments;
    const barColor = idx > 0.75 ? "#f87171" : idx > 0.5 ? "#facc15" : color;
    return { lit, color: barColor };
  });

  if (vertical) {
    return (
      <div style={{ display: "flex", flexDirection: "column-reverse", gap: "2px", height: "100%", width: "12px" }}>
        {bars.map((b, i) => (
          <div key={i} style={{
            flex: 1, borderRadius: "1px",
            background: b.lit ? b.color : "rgba(255,255,255,0.06)",
            boxShadow: b.lit ? `0 0 4px ${b.color}88` : "none",
            transition: "background 0.1s",
          }} />
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: "2px", width: "100%", height: "10px" }}>
      {bars.map((b, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: "1px",
          background: b.lit ? b.color : "rgba(255,255,255,0.06)",
          boxShadow: b.lit ? `0 0 4px ${b.color}88` : "none",
          transition: "background 0.1s",
        }} />
      ))}
    </div>
  );
}

/* ─── Dial gauge (SVG arc) ─────────────────────────────────────────────────── */
function DialGauge({ value, max, label, unit, color, size = 90 }) {
  const pct   = clamp(value / max, 0, 1);
  const r     = (size - 12) / 2;
  const cx    = size / 2;
  const cy    = size / 2;
  const start = Math.PI * 0.75;
  const sweep = Math.PI * 1.5;
  const angle = start + sweep * pct;
  const arcX  = (a) => cx + r * Math.cos(a);
  const arcY  = (a) => cy + r * Math.sin(a);

  // background arc path
  const bgD = [
    `M ${arcX(start)} ${arcY(start)}`,
    `A ${r} ${r} 0 1 1 ${arcX(start + sweep - 0.001)} ${arcY(start + sweep - 0.001)}`,
  ].join(" ");

  // filled arc path
  const fgD = pct < 0.01 ? "" : [
    `M ${arcX(start)} ${arcY(start)}`,
    `A ${r} ${r} 0 ${sweep * pct > Math.PI ? 1 : 0} 1 ${arcX(angle)} ${arcY(angle)}`,
  ].join(" ");

  // needle tip
  const nLen = r - 4;
  const nx   = cx + nLen * Math.cos(angle);
  const ny   = cy + nLen * Math.sin(angle);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* tick marks */}
        {Array.from({ length: 9 }, (_, i) => {
          const ta = start + (sweep / 8) * i;
          const r1 = r + 2, r2 = r - 4;
          return (
            <line key={i}
              x1={cx + r1 * Math.cos(ta)} y1={cy + r1 * Math.sin(ta)}
              x2={cx + r2 * Math.cos(ta)} y2={cy + r2 * Math.sin(ta)}
              stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          );
        })}
        {/* bg arc */}
        <path d={bgD} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" strokeLinecap="round" />
        {/* fg arc */}
        {fgD && <path d={fgD} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}99)`, transition: "all 0.4s ease" }} />}
        {/* needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="1.5" strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 3px ${color})`, transition: "all 0.4s ease" }} />
        <circle cx={cx} cy={cy} r="3" fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        {/* value */}
        <text x={cx} y={cy + 16} textAnchor="middle" fill={color}
          fontSize="13" fontFamily="'Share Tech Mono', monospace" fontWeight="700">
          {fmt1(value)}
        </text>
        <text x={cx} y={cy + 27} textAnchor="middle" fill="rgba(200,175,130,0.45)"
          fontSize="7" fontFamily="'Share Tech Mono', monospace" letterSpacing="1">
          {unit}
        </text>
      </svg>
      <div style={{
        fontSize: "9px", letterSpacing: "2px",
        color: "rgba(155,118,52,0.6)", fontFamily: "'Share Tech Mono', monospace",
      }}>{label}</div>
    </div>
  );
}

/* ─── Oscilloscope-style waveform ──────────────────────────────────────────── */
function Waveform({ history, color, height = 48, label }) {
  const W = 220, H = height;
  const pts = history.slice(-40);
  if (pts.length < 2) return null;
  const mn  = Math.min(...pts);
  const mx  = Math.max(...pts) || mn + 1;
  const toX = (i) => (i / (pts.length - 1)) * W;
  const toY = (v) => H - ((v - mn) / (mx - mn)) * (H - 8) - 4;
  const d   = pts.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  return (
    <div style={{ position: "relative" }}>
      <div style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(155,118,52,0.5)", marginBottom: "4px",
        fontFamily: "'Share Tech Mono', monospace" }}>{label}</div>
      <svg width={W} height={H} style={{ display: "block" }}>
        {/* grid lines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="0" y1={H * f} x2={W} y2={H * f}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="4 6" />
        ))}
        {/* fill */}
        <path d={`${d} L${W},${H} L0,${H} Z`} fill={`${color}12`} />
        {/* line */}
        <path d={d} fill="none" stroke={color} strokeWidth="1.5"
          style={{ filter: `drop-shadow(0 0 3px ${color}88)` }} />
        {/* current dot */}
        <circle cx={toX(pts.length - 1)} cy={toY(pts[pts.length - 1])} r="3"
          fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }}>
          <animate attributeName="r" values="2.5;4;2.5" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

/* ─── Risk score ring ──────────────────────────────────────────────────────── */
function RiskRing({ score, level }) {
  const t   = theme(level);
  const pct = clamp(score / 100, 0, 1);
  const R   = 54, size = 130, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * R;
  const dash = pct * circ * 0.72;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* decorative outer ring */}
        <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="3 5" />
        {/* bg track */}
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke="rgba(255,255,255,0.07)" strokeWidth="8"
          strokeDasharray={`${circ * 0.72} ${circ * 0.28}`}
          strokeDashoffset={circ * 0.14}
          strokeLinecap="round" transform={`rotate(126 ${cx} ${cy})`} />
        {/* value arc */}
        <circle cx={cx} cy={cy} r={R} fill="none"
          stroke={t.primary} strokeWidth="8"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.14}
          strokeLinecap="round"
          transform={`rotate(126 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${t.primary}99)`, transition: "stroke-dasharray 0.6s ease, stroke 0.4s ease" }} />
        {/* inner text */}
        <text x={cx} y={cy - 8} textAnchor="middle" fill={t.primary}
          fontSize="26" fontFamily="'Share Tech Mono', monospace" fontWeight="700">
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(200,175,130,0.5)"
          fontSize="8" fontFamily="'Share Tech Mono', monospace" letterSpacing="2">
          RISK INDEX
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fill={t.primary}
          fontSize="10" fontFamily="'Share Tech Mono', monospace" letterSpacing="3" fontWeight="700">
          {t.label}
        </text>
      </svg>
    </div>
  );
}

/* ─── Prediction countdown strip ───────────────────────────────────────────── */
function PredictionStrip({ prediction, level }) {
  const t = theme(level);
  const hasCountdown = prediction.timeToDanger != null;
  return (
    <div style={{
      background: t.dim,
      border: `1px solid ${t.primary}44`,
      borderLeft: `3px solid ${t.primary}`,
      borderRadius: "3px",
      padding: "10px 14px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* shimmer */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: "80px",
        background: `linear-gradient(90deg, transparent, ${t.primary}0a, transparent)`,
        animation: "shimmer 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(155,118,52,0.55)",
        fontFamily: "'Share Tech Mono', monospace", marginBottom: "4px" }}>
        ◈ PREDICTIVE ENGINE
      </div>
      <div style={{ fontSize: "13px", color: "rgba(218,195,160,0.9)",
        fontFamily: "'Barlow Condensed', sans-serif", lineHeight: 1.3 }}>
        {prediction.message}
      </div>
      {hasCountdown && (
        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "9px", color: "rgba(155,118,52,0.5)", letterSpacing: "2px",
            fontFamily: "'Share Tech Mono', monospace" }}>ETA CRITICAL</span>
          <span style={{ fontSize: "20px", fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 700, color: t.primary,
            animation: level === "danger" ? "flashText 0.9s ease-in-out infinite" : "none" }}>
            {prediction.timeToDanger}s
          </span>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN SIMULATOR
   ═══════════════════════════════════════════════════════════════════════════ */
export default function Simulator() {
  const { data, trend } = useSimulation();

  const [zones,  setZones]  = useState({ A: "safe", B: "safe", C: "safe" });
  const [alerts, setAlerts] = useState([]);
  const [clock,  setClock]  = useState("");
  const [metHistory, setMetHistory] = useState({ methane: [], oxygen: [], temperature: [] });

  /* clock */
  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setClock([n.getHours(), n.getMinutes(), n.getSeconds()]
        .map((v) => String(v).padStart(2, "0")).join(":"));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* history ring-buffer (last 60 ticks) */
  useEffect(() => {
    setMetHistory((prev) => ({
      methane:     [...prev.methane.slice(-59),     data.methane],
      oxygen:      [...prev.oxygen.slice(-59),      data.oxygen],
      temperature: [...prev.temperature.slice(-59), data.temperature],
    }));
  }, [data]);

  /* risk engine */
  const score      = calculateRiskScore(data);
  const level      = getRiskLevel(score);
  const prediction = getPrediction({ data, trend });
  const t          = theme(level);

  /* zone update */
  useEffect(() => {
    setZones({ A: level, B: level, C: level });
  }, [level]);

  /* alert on zone change */
  const prevRef = useRef(zones);
  useEffect(() => {
    const prev = prevRef.current;
    Object.entries(zones).forEach(([zone, risk]) => {
      if (prev[zone] !== risk) {
        if (risk === "danger")  addAlert(`Zone ${zone} entered DANGER`,  "danger");
        if (risk === "warning") addAlert(`Zone ${zone} warning level`,   "warning");
      }
    });
    prevRef.current = zones;
  }, [zones]);

  const addAlert = (message, severity) => {
    const id = Date.now();
    setAlerts((prev) => [{ id, message, severity, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== id)), 5000);
  };

  /* ── render ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap');

        .sim-root, .sim-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .sim-root {
          font-family: 'Barlow Condensed', sans-serif;
          background: #080604;
          height: 100vh;
          width: 100%;
          color: rgba(218,195,158,0.9);
          position: relative;
          overflow: hidden;
        }

        /* deep rock texture */
        .sim-root::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(165deg, transparent, transparent 60px, rgba(80,56,28,0.06) 60px, rgba(80,56,28,0.06) 61px),
            repeating-linear-gradient(82deg,  transparent, transparent 90px, rgba(55,36,14,0.04) 90px, rgba(55,36,14,0.04) 91px);
          pointer-events: none; z-index: 0;
        }

        /* vignette */
        .sim-root::after {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,0,0.72) 100%);
          pointer-events: none; z-index: 0;
        }

        /* scanline */
        @keyframes scan { 0% { top: -8%; } 100% { top: 108%; } }
        .scanline {
          position: absolute; left: 0; right: 0; height: 55px;
          background: linear-gradient(transparent, rgba(255,255,255,0.012), transparent);
          animation: scan 10s linear infinite;
          pointer-events: none; z-index: 50;
        }

        /* shared animations */
        @keyframes pulseRing {
          0%,100% { box-shadow: 0 0 0 0 var(--pulse-color); }
          50%      { box-shadow: 0 0 0 10px transparent; }
        }
        @keyframes flashText { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes shimmer   { 0%{left:-80px} 100%{left:calc(100% + 80px)} }
        @keyframes blink     { 0%,90%,100%{opacity:1} 95%{opacity:0.2} }

        /* ── layout ── */
        .sim-layout {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 220px 1fr 260px;
          grid-template-rows: 56px 1fr 110px;
          gap: 3px;
          padding: 3px;
          height: 100vh;
        }

        /* ── panel base ── */
        .rp {
          position: relative; overflow: hidden;
          background: #100d0a;
          border: 1px solid #302010;
        }
        .rp::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(158deg, transparent, transparent 38px, rgba(80,56,28,0.055) 38px, rgba(80,56,28,0.055) 39px),
            repeating-linear-gradient(75deg,  transparent, transparent 55px, rgba(55,36,14,0.04)  55px, rgba(55,36,14,0.04)  56px);
          pointer-events: none; z-index: 0;
        }
        /* amber vein top */
        .rp::after {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, #c8901855 35%, #c8901899 50%, #c8901855 65%, transparent);
          z-index: 2;
        }
        .rp > * { position: relative; z-index: 1; }

        /* ── panel section label ── */
        .sec-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 3px;
          color: rgba(155,118,52,0.48);
          padding: 8px 12px 4px;
          border-bottom: 1px solid #2a1a08;
          flex-shrink: 0;
        }

        /* ── header ── */
        .sim-header {
          grid-column: 1 / -1;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 18px;
          background: #0a0806;
          border-bottom: 2px solid #3a2410;
        }
        .sim-header::after { display: none; }

        .h-brand {
          display: flex; align-items: center; gap: 12px;
        }
        .h-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 16px; letter-spacing: 4px; color: #c8a040; line-height: 1;
        }
        .h-sub {
          font-size: 8px; letter-spacing: 3px; color: rgba(140,100,44,0.5); margin-top: 3px;
        }
        .h-center {
          display: flex; align-items: center; gap: 20px;
        }
        .h-stat {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
        }
        .h-stat-label { font-size: 8px; letter-spacing: 2px; color: rgba(155,118,52,0.5); font-family: 'Share Tech Mono', monospace; }
        .h-stat-value { font-size: 13px; font-family: 'Share Tech Mono', monospace; font-weight: 700; }
        .h-sep { width: 1px; height: 28px; background: rgba(80,56,28,0.35); }

        @keyframes pulseDot {
          0%,100% { box-shadow: 0 0 0 0 var(--dc); }
          50%      { box-shadow: 0 0 0 7px transparent; }
        }
        .status-pill {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px; letter-spacing: 2px;
          padding: 5px 12px;
          border-radius: 2px;
          border: 1px solid;
          transition: all 0.4s;
        }
        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          animation: pulseDot 2s infinite;
        }
        .h-clock { font-family: 'Share Tech Mono', monospace; font-size: 13px; color: rgba(155,118,52,0.5); letter-spacing: 2px; }

        /* ── left column ── */
        .left-col {
          grid-row: 2/ 4;
          display: flex; flex-direction: column; gap: 8px;
        }

        .gauge-panel {
          flex-shrink: 0;
          display: flex; flex-direction: column;
        }
        .gauge-row {
          display: flex; justify-content: space-around; align-items: center;
          padding: 8px 6px 12px;
          gap: 1px;
        }

        .vu-panel {
          flex: 1;
          display: flex; flex-direction: column;
        }
        .vu-meters {
          flex: 1;
          display: flex; align-items: flex-end; justify-content: space-around;
          padding: 10px 12px 12px;
          gap: 8px;
        }
        .vu-col {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          flex: 1;
        }
        .vu-col-label {
          font-size: 7px; letter-spacing: 1px; color: rgba(155,118,52,0.5);
          font-family: 'Share Tech Mono', monospace; text-align: center;
        }

        /* ── center column ── */
        .center-col {
          grid-row: 2 / 3;
          display: flex; flex-direction: column;
        }
        .map-body {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 10px; min-height: 0;
        }

        /* ── right column ── */
        .right-col {
          grid-row: 2 / 4;
          display: flex; flex-direction: column; gap: 3px;
        }

        .risk-panel {
          flex-shrink: 0;
          display: flex; flex-direction: column; align-items: center;
          padding: 14px 12px 10px; gap: 10px;
        }

        .pred-panel {
          flex-shrink: 0;
          padding: 10px 12px; display: flex; flex-direction: column; gap: 8px;
        }

        .alerts-panel {
          flex: 1; display: flex; flex-direction: column; min-height: 0;
        }
        .alerts-body {
          flex: 1; overflow-y: auto; padding: 8px; min-height: 0;
        }
        .alerts-body::-webkit-scrollbar { width: 3px; }
        .alerts-body::-webkit-scrollbar-track { background: #0a0806; }
        .alerts-body::-webkit-scrollbar-thumb { background: #3a2410; border-radius: 2px; }

        /* ── bottom strip ── */
        .bottom-strip {
          grid-column: 1 / 3;
          display: flex; flex-direction: column; justify-content: center;
          padding: 8px 14px; gap: 6px;
        }
        .waveform-row {
          display: flex; gap: 20px; align-items: flex-start;
        }

        .ctrl-strip {
          grid-column: 3;
          display: flex; flex-direction: column; gap: 3px;
        }
        .ctrl-buttons {
          flex: 1; display: flex; flex-wrap: wrap;
          gap: 4px; padding: 8px;
          align-content: flex-start;
        }
        .ctrl-btn {
          flex: 1; min-width: 80px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(80,56,28,0.4);
          color: rgba(200,175,130,0.7);
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px; letter-spacing: 1px;
          padding: 8px 4px; cursor: pointer;
          border-radius: 2px; text-align: center;
          transition: all 0.15s;
        }
        .ctrl-btn:hover {
          background: rgba(200,145,26,0.1);
          border-color: rgba(200,145,26,0.5);
          color: #c8901a;
        }
        .ctrl-btn:active { transform: scale(0.97); }
        .ctrl-btn.active {
          background: rgba(74,222,128,0.1);
          border-color: rgba(74,222,128,0.5);
          color: #4ade80;
        }

        /* divider */
        .vdiv { width: 1px; background: rgba(80,56,28,0.3); align-self: stretch; margin: 0 4px; }
      `}</style>

      <div className="sim-root">
        <div className="scanline" />

        <div className="sim-layout">

          {/* ══════════════════════════════════════════════
              HEADER
              ══════════════════════════════════════════════ */}
          <div className="rp sim-header">
            <div className="h-brand">
              {/* logo mark */}
              <svg width="32" height="32" viewBox="0 0 32 32">
                <polygon points="16,2 30,28 2,28" fill="none" stroke="#4a3214" strokeWidth="1.2" />
                <polygon points="16,8 26,26 6,26" fill="#160f08" />
                <circle cx="16" cy="20" r="5.5" fill="none" stroke="#c8901a" strokeWidth="1.5" />
                <line x1="16" y1="8" x2="16" y2="14.5" stroke="#c8901a" strokeWidth="1.5" />
                <circle cx="16" cy="6.5" r="2" fill="#f87171">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
                </circle>
              </svg>
              <div>
                <div className="h-title">CONTROL ROOM — BEFORE IT HAPPENS</div>
                <div className="h-sub">DEEP MINE PREDICTIVE SAFETY SIMULATOR · v2.4.1 · ACTIVE SESSION</div>
              </div>
            </div>

            {/* live sensor summary */}
            <div className="h-center">
              {[
                { label: "CH₄", value: fmt2(data.methane) + "%",  color: data.methane > 1.5 ? "#f87171" : data.methane > 0.8 ? "#facc15" : "#4ade80" },
                { label: "O₂",  value: fmt2(data.oxygen)  + "%",  color: data.oxygen < 19.5  ? "#f87171" : data.oxygen < 20.5  ? "#facc15" : "#60a5fa" },
                { label: "TEMP",value: fmt1(data.temperature) + "°C", color: data.temperature > 38 ? "#f87171" : data.temperature > 32 ? "#facc15" : "#4ade80" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: i > 0 ? "0" : "0" }}>
                  {i > 0 && <div className="vdiv" />}
                  <div className="h-stat" style={{ padding: "0 12px" }}>
                    <span className="h-stat-label">{s.label}</span>
                    <span className="h-stat-value" style={{ color: s.color }}>{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* status + clock */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                className="status-pill"
                style={{
                  color: t.primary,
                  borderColor: `${t.primary}55`,
                  background: t.dim,
                  "--dc": t.pulse,
                }}
              >
                <div className="status-dot" style={{ background: t.primary, "--dc": t.pulse }} />
                {t.label}
              </div>
              <div className="h-clock">{clock || "--:--:--"}</div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              LEFT — GAUGES + VU METERS
              ══════════════════════════════════════════════ */}
          <div className="left-col">

            {/* dial gauges */}
            <div className="rp gauge-panel">
              <div className="sec-label">◈ SENSOR GAUGES</div>
              <div className="gauge-row">
                <DialGauge value={data.methane}     max={5}   label="METHANE"  unit="%"  color={data.methane > 1.5 ? "#f87171" : data.methane > 0.8 ? "#facc15" : "#4ade80"} size={80} />
                <DialGauge value={data.oxygen}      max={21}  label="OXYGEN"   unit="%"  color={data.oxygen < 19.5 ? "#f87171" : "#60a5fa"}  size={80} />
                <DialGauge value={data.temperature} max={60}  label="TEMP"     unit="°C" color={data.temperature > 38 ? "#f87171" : data.temperature > 30 ? "#facc15" : "#4ade80"} size={80} />
              </div>
            </div>

            {/* VU bar meters */}
            <div className="rp vu-panel">
              <div className="sec-label">◈ LEVEL METERS</div>
              <div className="vu-meters">
                {[
                  { label: "CH₄",  value: data.methane,     max: 5,  color: "#f87171" },
                  { label: "O₂",   value: 21 - data.oxygen, max: 3,  color: "#60a5fa" },
                  { label: "TEMP", value: data.temperature, max: 60, color: "#facc15" },
                  { label: "RISK", value: score,            max: 100, color: t.primary },
                ].map((m, i) => (
                  <div key={i} className="vu-col">
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "120px" }}>
                      <VuBar value={m.value} max={m.max} color={m.color} vertical segments={16} />
                    </div>
                    <div className="vu-col-label">{m.label}</div>
                    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "9px", color: m.color }}>
                      {fmt1(m.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════
              CENTER — MINE MAP
              ══════════════════════════════════════════════ */}
          <div className="rp center-col">
            <div className="sec-label">◈ MINE SCHEMATIC — LIVE ZONE STATUS</div>
            <div className="map-body">
              <MineMap zones={zones} />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              RIGHT — RISK RING + PREDICTION + ALERTS
              ══════════════════════════════════════════════ */}
          <div className="right-col">

            {/* risk ring */}
            <div className="rp risk-panel">
              <div className="sec-label" style={{ alignSelf: "stretch" }}>◈ RISK ENGINE</div>
              <RiskRing score={score} level={level} />
              {/* score bar */}
              <div style={{ width: "100%" }}>
                <VuBar value={score} max={100} color={t.primary} segments={20} />
              </div>
            </div>

            {/* prediction */}
            <div className="rp pred-panel">
              <div className="sec-label" style={{ margin: "-10px -12px 6px", padding: "8px 12px 4px" }}>◈ PREDICTION</div>
              <PredictionStrip prediction={prediction} level={level} />
            </div>

            {/* alerts */}
            <div className="rp alerts-panel">
              <div className="sec-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#f87171",
                  animation: "blink 1.1s infinite",
                }} />
                ALERT FEED
              </div>
              <div className="alerts-body">
                <AlertsFeed externalAlerts={alerts} />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════
              BOTTOM — WAVEFORMS
              ══════════════════════════════════════════════ */}
          <div className="rp bottom-strip">
            <div className="sec-label" style={{ margin: "-8px -14px 6px", padding: "6px 14px 4px" }}>◈ SENSOR HISTORY</div>
            <div className="waveform-row">
              <Waveform history={metHistory.methane}     color="#f87171" height={44} label="METHANE %" />
              <Waveform history={metHistory.oxygen}      color="#60a5fa" height={44} label="OXYGEN %" />
              <Waveform history={metHistory.temperature} color="#facc15" height={44} label="TEMPERATURE °C" />
            </div>
          </div>

          {/* ══════════════════════════════════════════════
              BOTTOM RIGHT — CONTROL BUTTONS
              ══════════════════════════════════════════════ */}
          <div className="rp ctrl-strip">
            <div className="sec-label">◈ CONTROLS</div>
            <div className="ctrl-buttons">
              {[
                "VENTILATION",
                "EVAC ALARM",
                "LOCK SHAFT",
                "COMM LINK",
                "DEPLOY CREW",
                "FLUSH GAS",
              ].map((btn) => (
                <button key={btn} className="ctrl-btn">{btn}</button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
