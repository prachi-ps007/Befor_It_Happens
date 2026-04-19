// src/pages/Simulator.jsx

import { useEffect, useRef, useState } from "react";
import MineMap from "../components/MINEMAP";
import AlertsFeed from "../components/AlertsFeed";
import useSimulation from "../hooks/useSimulation";
import {
  calculateRiskScore,
  getRiskLevel,
  getPrediction,
} from "../utils/riskEngine";
import {
  saveSimulation,
  saveAlert,
  saveAction,
} from "../services/firestore";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const fmt1  = (v) => Number(v).toFixed(1);
const fmt2  = (v) => Number(v).toFixed(2);

/* ── Underground palette ── */
const AMBER  = "#C9872A";
const AMBER2 = "#E8A83E";
const RUST   = "#8B3A1A";
const STONE  = "#1A1410";
const COAL   = "#0D0B09";
const SEAM   = "#2A1E10";
const DUST   = "#3D2E1A";

const RISK_THEME = {
  safe:     { primary: "#6DBB7A", dim: "rgba(109,187,122,0.12)", label: "ALL CLEAR",  glyph: "◆" },
  warning:  { primary: "#E8A83E", dim: "rgba(232,168,62,0.14)",  label: "CAUTION",    glyph: "▲" },
  danger:   { primary: "#D95F3B", dim: "rgba(217,95,59,0.16)",   label: "DANGER",     glyph: "⬟" },
  critical: { primary: "#C0392B", dim: "rgba(192,57,43,0.20)",   label: "CRITICAL",   glyph: "⬛" },
};
const theme = (level) => RISK_THEME[level] || RISK_THEME.safe;

/* ── Gauge arc component ── */
function GaugeArc({ value, max, color, label, unit, warn, danger }) {
  const pct = Math.min(1, value / max);
  const cx = 65, cy = 65, r = 52;
  const startAngle = Math.PI * 0.75;   // 135° — bottom-left
  const sweepAngle = Math.PI * 1.5;    // 270° sweep

  const pt = (a) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  });

  const start    = pt(startAngle);
  const trackEnd = pt(startAngle + sweepAngle);
  const arcEnd   = pt(startAngle + sweepAngle * pct);

  const largeArc   = sweepAngle * pct > Math.PI ? 1 : 0;
  const largeTrack = 1;

  const col =
    value >= danger
      ? RISK_THEME.danger.primary
      : value >= warn
      ? RISK_THEME.warning.primary
      : color;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 6, flex: 1,
    }}>
      <svg width="130" height="110" viewBox="0 0 130 110">
        {/* track */}
        <path
          d={`M${start.x},${start.y} A${r},${r} 0 ${largeTrack},1 ${trackEnd.x},${trackEnd.y}`}
          fill="none" stroke={SEAM} strokeWidth="8" strokeLinecap="round"
        />
        {/* value arc */}
        {pct > 0 && (
          <path
            d={`M${start.x},${start.y} A${r},${r} 0 ${largeArc},1 ${arcEnd.x},${arcEnd.y}`}
            fill="none" stroke={col} strokeWidth="8" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${col}88)` }}
          />
        )}
        {/* needle tip */}
        <circle
          cx={arcEnd.x} cy={arcEnd.y} r="5.5" fill={col}
          style={{ filter: `drop-shadow(0 0 6px ${col})` }}
        />
        {/* value */}
        <text
          x={cx} y={cy + 10}
          textAnchor="middle" fontSize="18" fill={col}
          style={{ fontFamily: "'Share Tech Mono',monospace", fontWeight: "bold" }}
        >
          {fmt2(value)}
        </text>
        <text
          x={cx} y={cy + 26}
          textAnchor="middle" fontSize="9" fill={`${AMBER}88`}
          style={{ fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.1em" }}
        >
          {unit}
        </text>
      </svg>
      <div style={{
        fontSize: 9, letterSpacing: "0.25em",
        color: `${AMBER}66`,
        fontFamily: "'Share Tech Mono',monospace",
      }}>
        {label}
      </div>
    </div>
  );
}

/* ── Strata crack line ── */
const StrataLine = ({ y, opacity = 0.6 }) => (
  <div style={{
    position: "absolute", left: 0, right: 0, top: y, height: 1,
    background: `linear-gradient(90deg,transparent,${SEAM},${DUST},${SEAM},transparent)`,
    opacity, pointerEvents: "none",
  }} />
);

/* ── Rock texture overlay ── */
const RockOverlay = () => (
  <div style={{
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
    backgroundImage: `
      repeating-linear-gradient(167deg, transparent, transparent 42px, rgba(42,30,16,0.15) 42px, rgba(42,30,16,0.15) 43px),
      repeating-linear-gradient(12deg,  transparent, transparent 68px, rgba(26,20,16,0.10) 68px, rgba(26,20,16,0.10) 69px),
      repeating-linear-gradient(90deg,  transparent, transparent 120px,rgba(13,11,9,0.06) 120px,rgba(13,11,9,0.06)121px)
    `,
  }} />
);

export default function Simulator() {
  const { data, trend } = useSimulation();
  const [zones, setZones]   = useState({ A: "safe", B: "safe", C: "safe" });
  const [alerts, setAlerts] = useState([]);
  const [clock, setClock]   = useState("");
  const prevRef = useRef(zones);

  useEffect(() => {
    const t = setInterval(() => {
      const n = new Date();
      setClock(
        [n.getHours(), n.getMinutes(), n.getSeconds()]
          .map((v) => String(v).padStart(2, "0"))
          .join(":")
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const score      = calculateRiskScore(data);
  const level      = getRiskLevel(score);
  const prediction = getPrediction({ data, trend });
  const t          = theme(level);

  useEffect(() => { setZones({ A: level, B: level, C: level }); }, [level]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveSimulation({
        methane: data.methane,
        oxygen: data.oxygen,
        temperature: data.temperature,
        riskScore: score,
        riskLevel: level,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [data, score, level]);

  useEffect(() => {
    const prev = prevRef.current;
    Object.entries(zones).forEach(([zone, risk]) => {
      if (prev[zone] !== risk) {
        if (risk === "danger")  addAlert(`Zone ${zone} DANGER`, "danger");
        if (risk === "warning") addAlert(`Zone ${zone} WARNING`, "warning");
      }
    });
    prevRef.current = zones;
  }, [zones]);

  const addAlert = (message, severity) => {
    const id = Date.now();
    const alertObj = { message, severity, time: new Date().toLocaleTimeString() };
    setAlerts((prev) => [{ id, ...alertObj }, ...prev].slice(0, 5));
    setTimeout(() => setAlerts((prev) => prev.filter((a) => a.id !== id)), 5000);
    saveAlert(alertObj);
  };

  const handleAction = (actionName) => {
    const action = { action: actionName, time: new Date().toLocaleTimeString(), riskLevel: level };
    addAlert(`ACT: ${actionName}`, "warning");
    saveAction(action);
  };

  const ACTIONS = ["VENTILATION", "EVAC ALARM", "LOCK SHAFT", "COMM LINK", "DEPLOY CREW", "FLUSH GAS"];

  return (
    <div style={{
      minHeight: "100vh", background: COAL,
      padding: "0", color: `${AMBER}cc`,
      fontFamily: "'Share Tech Mono',monospace",
      position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Teko:wght@300;400;500&display=swap');

        ::-webkit-scrollbar { width:4px; background:${COAL}; }
        ::-webkit-scrollbar-thumb { background:${SEAM}; }

        @keyframes lanternFlicker {
          0%,100%{opacity:1} 8%{opacity:0.92} 20%{opacity:0.97} 45%{opacity:0.94} 70%{opacity:1} 88%{opacity:0.91}
        }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes riskPulse{0%,100%{opacity:1}50%{opacity:0.7}}
        @keyframes dustDrift{0%{transform:translateX(0)}100%{transform:translateX(40px)}}
        @keyframes actionPress{0%,100%{transform:none}50%{transform:scale(0.97) translateY(1px)}}

        .action-btn {
          background: linear-gradient(180deg, ${SEAM} 0%, ${STONE} 100%);
          border-top: 1px solid ${DUST};
          border-left: 1px solid ${DUST};
          border-right: 1px solid #0a0806;
          border-bottom: 2px solid #0a0806;
          color: ${AMBER};
          padding: 9px 16px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 0.18em;
          cursor: pointer; transition: all 0.12s;
          position: relative; overflow: hidden;
        }
        .action-btn::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(180deg, rgba(201,135,42,0.08) 0%, transparent 100%);
          opacity:0; transition:opacity 0.15s;
        }
        .action-btn:hover { color:${AMBER2}; border-top-color:${AMBER}55; }
        .action-btn:hover::before { opacity:1; }
        .action-btn:active { animation:actionPress 0.12s ease; border-bottom-width:1px; }

        .sensor-panel {
          background: linear-gradient(160deg, ${STONE} 0%, #100d0a 100%);
          border: 1px solid ${SEAM};
          border-top: 2px solid ${DUST};
          position: relative; overflow: hidden;
          padding: 16px 20px;
        }
        .sensor-panel::before {
          content:'';position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,${AMBER}44,transparent);
        }

        .risk-badge {
          display:inline-flex; align-items:center; gap:8px;
          border:1px solid currentColor; padding:6px 14px;
          letter-spacing:0.2em; font-size:11px;
        }

        .section-label {
          font-size:8px; letter-spacing:0.4em;
          color:${AMBER}55; margin-bottom:8px;
          border-bottom:1px solid ${SEAM}; padding-bottom:4px;
        }
      `}</style>

      <RockOverlay />

      {/* Lantern ambient glow — top */}
      <div style={{
        position: "fixed", top: -80, left: "50%", transform: "translateX(-50%)",
        width: 600, height: 200, borderRadius: "50%",
        background: `radial-gradient(ellipse,${AMBER}18 0%,transparent 70%)`,
        pointerEvents: "none", zIndex: 2,
        animation: "lanternFlicker 6s ease-in-out infinite",
      }} />

      {/* ══ TOP BAR ══ */}
      <div style={{
        background: `linear-gradient(180deg,#110e0b 0%,${COAL} 100%)`,
        borderBottom: `1px solid ${SEAM}`,
        padding: "12px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Pickaxe glyph */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 24 L18 10" stroke={AMBER} strokeWidth="2" strokeLinecap="round"/>
            <path d="M18 10 L24 4 L22 8 L26 6 L20 12 L24 16 L18 10Z" fill={AMBER} opacity="0.8"/>
            <circle cx="4" cy="24" r="2" fill={AMBER} opacity="0.6"/>
          </svg>
          <div>
            <div style={{
              fontFamily: "'Teko',sans-serif", fontSize: 22, fontWeight: 500,
              color: AMBER2, letterSpacing: "0.08em", lineHeight: 1,
              textShadow: `0 0 20px ${AMBER}55`,
            }}>
              SHAFT CONTROL
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.35em", color: `${AMBER}44` }}>
              UNDERGROUND SAFETY SIMULATOR
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Depth indicator */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.3em", color: `${AMBER}44` }}>DEPTH</div>
            <div style={{ fontSize: 16, color: AMBER, fontFamily: "'Teko'", letterSpacing: "0.05em" }}>−200 m</div>
          </div>
          <div style={{ width: 1, height: 32, background: SEAM }} />
          {/* Clock */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.3em", color: `${AMBER}44` }}>SHIFT TIME</div>
            <div style={{ fontSize: 16, color: AMBER2, letterSpacing: "0.08em" }}>{clock}</div>
          </div>
          <div style={{ width: 1, height: 32, background: SEAM }} />
          {/* Risk badge */}
          <div
            className="risk-badge"
            style={{
              color: t.primary,
              borderColor: `${t.primary}66`,
              background: t.dim,
              animation: level !== "safe" ? "riskPulse 2s infinite" : "none",
            }}
          >
            <span style={{ fontSize: 14 }}>{t.glyph}</span>
            <span style={{ fontFamily: "'Teko'", fontSize: 16, fontWeight: 500, letterSpacing: "0.15em" }}>
              {t.label}
            </span>
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr 240px",
        gap: 0, height: "calc(100vh - 60px)",
        position: "relative", zIndex: 5,
      }}>

        {/* ── LEFT PANEL: Sensors + Actions ── */}
        <div style={{
          borderRight: `1px solid ${SEAM}`,
          display: "flex", flexDirection: "column",
          background: `linear-gradient(180deg,${STONE}88 0%,${COAL}88 100%)`,
          overflow: "hidden",
        }}>
          {/* Strata lines decorative */}
          <div style={{ position: "absolute", left: 0, width: 300, top: 0, bottom: 0, pointerEvents: "none" }}>
            <StrataLine y="160" opacity={0.4} />
            <StrataLine y="320" opacity={0.3} />
            <StrataLine y="480" opacity={0.25} />
          </div>

          {/* ── Sensor readings ── */}
          <div className="sensor-panel" style={{ flex: "0 0 auto" }}>
            <div className="section-label">▸ SENSOR ARRAY // LIVE</div>
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
              padding: "8px 0 4px",
              gap: 8,
            }}>
              <GaugeArc
                value={data.methane}
                max={5}
                unit="%"
                label="METHANE"
                color="#6DBB7A"
                warn={2}
                danger={4}
              />
              <div style={{ width: 1, height: 100, background: SEAM, alignSelf: "center" }} />
              <GaugeArc
                value={data.oxygen}
                max={22}
                unit="%"
                label="OXYGEN"
                color={AMBER2}
                warn={19}
                danger={17}
              />
              <div style={{ width: 1, height: 100, background: SEAM, alignSelf: "center" }} />
              <GaugeArc
                value={data.temperature}
                max={60}
                unit="°C"
                label="TEMPERATURE"
                color="#D95F3B"
                warn={35}
                danger={45}
              />
            </div>
          </div>

          {/* Risk score */}
          <div className="sensor-panel" style={{ flex: "0 0 auto", marginTop: 1 }}>
            <div className="section-label">▸ RISK ASSESSMENT</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 8, color: `${AMBER}44`, letterSpacing: "0.2em", marginBottom: 4 }}>
                  COMPOSITE SCORE
                </div>
                <div style={{
                  fontFamily: "'Teko'", fontSize: 44, fontWeight: 500,
                  color: t.primary, lineHeight: 1,
                  textShadow: `0 0 20px ${t.primary}66`,
                }}>
                  {score}
                </div>
                <div style={{ fontSize: 8, color: `${t.primary}88`, letterSpacing: "0.2em" }}>/100</div>
              </div>
              {/* Score bar */}
              <div style={{ flex: 1, marginLeft: 20 }}>
                <div style={{
                  height: 6, background: SEAM, borderRadius: 1, overflow: "hidden",
                  marginBottom: 8, position: "relative",
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${score}%`,
                    background: `linear-gradient(90deg,#6DBB7A,${score > 60 ? "#E8A83E" : "#6DBB7A"},${score > 80 ? "#C0392B" : "transparent"})`,
                    transition: "width 0.8s ease",
                    boxShadow: `0 0 8px ${t.primary}88`,
                  }} />
                </div>
                <div style={{
                  fontSize: 9, color: `${t.primary}cc`, letterSpacing: "0.1em",
                  lineHeight: 1.4, maxWidth: 120,
                }}>
                  {prediction.message}
                </div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Action buttons */}
          <div style={{
            padding: "16px", borderTop: `1px solid ${SEAM}`,
            background: `linear-gradient(0deg,${STONE} 0%,transparent 100%)`,
          }}>
            <div className="section-label">▸ EMERGENCY CONTROLS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {ACTIONS.map((btn) => (
                <button key={btn} className="action-btn" onClick={() => handleAction(btn)}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTER: Mine Map ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          background: `linear-gradient(160deg,#0e0c09 0%,${COAL} 100%)`,
          overflow: "hidden", position: "relative",
        }}>
          {/* Coal dust drift overlay */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
            backgroundImage: `
              radial-gradient(ellipse at 20% 80%, rgba(42,30,16,0.3) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(26,20,16,0.25) 0%, transparent 50%)
            `,
          }} />

          <div style={{
            padding: "14px 20px 8px", borderBottom: `1px solid ${SEAM}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div className="section-label" style={{ margin: 0 }}>▸ MINE LAYOUT // SECTOR 7</div>
            <div style={{ display: "flex", gap: 12, fontSize: 8, color: `${AMBER}44`, letterSpacing: "0.15em" }}>
              {Object.entries(zones).map(([zone, status]) => (
                <span key={zone} style={{ color: RISK_THEME[status]?.primary || AMBER }}>
                  {zone}: {status.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, padding: "16px", position: "relative", zIndex: 3 }}>
            <MineMap zones={zones} />
          </div>
        </div>

        {/* ── RIGHT PANEL: Alerts ── */}
        <div style={{
          borderLeft: `1px solid ${SEAM}`,
          display: "flex", flexDirection: "column",
          background: `linear-gradient(180deg,${STONE}88 0%,${COAL}88 100%)`,
          overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 16px 10px",
            borderBottom: `1px solid ${SEAM}`,
          }}>
            <div className="section-label" style={{ marginBottom: 4 }}>▸ INCIDENT FEED</div>
            <div style={{ fontSize: 8, color: `${AMBER}33`, letterSpacing: "0.2em" }}>
              {alerts.length === 0 ? "NO ACTIVE EVENTS" : `${alerts.length} ACTIVE`}
            </div>
          </div>
          <div style={{ flex: 1, padding: "12px", overflow: "hidden" }}>
            <AlertsFeed externalAlerts={alerts} />
          </div>

          {/* Bottom status strip */}
          <div style={{
            padding: "10px 16px", borderTop: `1px solid ${SEAM}`,
            background: STONE, fontSize: 8, color: `${AMBER}33`,
            letterSpacing: "0.2em",
          }}>
            <div style={{ marginBottom: 3 }}>UPLINK: STABLE</div>
            <div>FIBER DEPTH: −205m</div>
            <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
              {["A", "B", "C"].map((z) => (
                <div
                  key={z}
                  style={{
                    flex: 1, textAlign: "center", padding: "3px 0",
                    background: RISK_THEME[zones[z]]?.dim || "transparent",
                    border: `1px solid ${RISK_THEME[zones[z]]?.primary || SEAM}44`,
                    color: RISK_THEME[zones[z]]?.primary || AMBER,
                    fontSize: 9,
                  }}
                >
                  Z{z}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
