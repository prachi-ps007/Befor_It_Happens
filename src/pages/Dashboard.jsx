import { useState, useEffect } from "react";
import MineMap from "../components/MINEMAP";
import AlertsFeed from "../components/AlertsFeed";

export default function Dashboard() {
  const zones = {
    A: "safe",
    B: "warning",
    C: "danger",
  };

  const [clock, setClock] = useState("");

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

  const externalAlerts = [
    { id: 1, severity: "danger",  message: "CH₄ at 44.2 ppm — Zone C threshold breached", time: "14:22:05" },
    { id: 2, severity: "danger",  message: "Temp spike 42°C — heat source proximity",       time: "14:21:48" },
    { id: 3, severity: "warning", message: "CO rising — predicted critical in 18 min",       time: "14:20:33" },
  ];

  const metrics = [
    { label: "Total Personnel", value: "128",  display: "72%",  color: "#c89020" },
    { label: "Active Alerts",   value: "3",    display: "30%",  color: "#facc15" },
    { label: "Avg Air Quality", value: "Good", display: "80%",  color: "#4ade80" },
    { label: "System Load",     value: "72%",  display: "72%",  color: "#fb923c" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600;700&display=swap');

        /* ── Reset scoped to our root ── */
        .mine-root, .mine-root * { box-sizing: border-box; margin: 0; padding: 0; }

        .mine-root {
          font-family: 'Barlow Condensed', sans-serif;
          background: #0c0906;
          height: 100vh;
          width: 100%;
          color: rgba(218,195,160,0.88);
          position: relative;
          overflow: hidden;
        }

        /* Full-viewport rock strata grain */
        .mine-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(165deg, transparent, transparent 55px, rgba(80,58,32,0.05) 55px, rgba(80,58,32,0.05) 56px),
            repeating-linear-gradient(82deg,  transparent, transparent 80px, rgba(55,38,18,0.04) 80px, rgba(55,38,18,0.04) 81px);
          pointer-events: none;
          z-index: 0;
        }

        /* Radial vignette */
        .mine-root::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.68) 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* Scanline animation */
        @keyframes scan {
          0%   { top: -8%; }
          100% { top: 108%; }
        }
        .scanline {
          position: absolute;
          left: 0; right: 0;
          height: 50px;
          background: linear-gradient(transparent, rgba(255,255,255,0.013), transparent);
          animation: scan 9s linear infinite;
          pointer-events: none;
          z-index: 50;
        }

        /* ── Layout grid ── */
        .mine-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: 58px 88px 1fr;
          gap: 3px;
          padding: 3px;
          height: 100%;
        }

        /* ── Panel base ── */
        .rp {
          position: relative;
          overflow: hidden;
          background: #110e0b;
          border: 1px solid #352818;
        }
        /* inner grain */
        .rp::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(158deg, transparent, transparent 40px, rgba(80,58,32,0.05) 40px, rgba(80,58,32,0.05) 41px),
            repeating-linear-gradient(78deg,  transparent, transparent 60px, rgba(55,38,18,0.04) 60px, rgba(55,38,18,0.04) 61px);
          pointer-events: none;
          z-index: 0;
        }
        /* amber vein line at top */
        .rp::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #c8901845 35%, #c8901890 50%, #c8901845 65%, transparent 100%);
          z-index: 2;
        }
        .rp > * { position: relative; z-index: 1; }

        /* ── Grid helpers ── */
        .c12 { grid-column: span 12; }
        .c9  { grid-column: span 9; }
        .c3  { grid-column: span 3; }
        .r4  { grid-row: span 4; }

        /* ── HEADER ── */
        .mine-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          background: #0d0a07;
          border-bottom: 2px solid #3a2612;
        }
        /* suppress top vein on header */
        .mine-header::after { display: none; }

        .h-logo { display: flex; align-items: center; gap: 12px; }
        .h-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 17px;
          letter-spacing: 4px;
          color: #c8a045;
          line-height: 1;
        }
        .h-sub {
          font-size: 9px;
          letter-spacing: 3px;
          color: rgba(145,105,52,0.52);
          margin-top: 3px;
        }

        @keyframes pulseGreen {
          0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.65); }
          50%      { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
        }
        @keyframes pulseRed {
          0%,100% { box-shadow: 0 0 0 0 rgba(248,113,113,0.7); }
          50%      { box-shadow: 0 0 0 8px rgba(248,113,113,0); }
        }

        .status-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          color: #4ade80;
        }
        .status-dot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #4ade80;
          animation: pulseGreen 2s infinite;
        }
        .h-clock {
          font-family: 'Share Tech Mono', monospace;
          font-size: 13px;
          color: rgba(155,118,58,0.5);
          letter-spacing: 2px;
        }

        /* ── Metric tile ── */
        .metric-tile {
          padding: 13px 16px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .m-label {
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(155,118,58,0.55);
          text-transform: uppercase;
        }
        .m-value {
          font-family: 'Share Tech Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          line-height: 1.1;
        }
        .m-bar {
          height: 3px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }
        .m-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.6s ease;
        }

        /* ── Map panel ── */
        .map-panel {
          display: flex;
          flex-direction: column;
        }
        .map-header {
          padding: 9px 14px 6px;
          border-bottom: 1px solid #2c1f0e;
          font-size: 9px;
          letter-spacing: 3px;
          color: rgba(155,118,58,0.48);
          flex-shrink: 0;
        }
        .map-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          min-height: 0;
        }

        /* ── Alerts sidebar ── */
        .alerts-panel {
          display: flex;
          flex-direction: column;
        }
        .alerts-head {
          padding: 11px 14px 8px;
          border-bottom: 1px solid #2c1f0e;
          font-size: 10px;
          letter-spacing: 3px;
          color: #c8901a;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .alerts-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #f87171;
          animation: pulseRed 1.1s infinite;
        }
        .alerts-body {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          min-height: 0;
        }
        .alerts-body::-webkit-scrollbar { width: 3px; }
        .alerts-body::-webkit-scrollbar-track { background: #0d0a07; }
        .alerts-body::-webkit-scrollbar-thumb { background: #3a2612; border-radius: 2px; }
      `}</style>

      <div className="mine-root">
        <div className="scanline" />

        <div className="mine-grid">

          {/* ── HEADER ── */}
          <div className="rp mine-header c12">
            <div className="h-logo">
              <svg width="34" height="34" viewBox="0 0 34 34">
                <polygon points="17,3 31,28 3,28" fill="none" stroke="#4a3218" strokeWidth="1.2" />
                <polygon points="17,9 27,27 7,27" fill="#1a1008" />
                <circle cx="17" cy="21" r="5.5" fill="none" stroke="#c8901a" strokeWidth="1.5" />
                <line x1="17" y1="9" x2="17" y2="15.5" stroke="#c8901a" strokeWidth="1.5" />
                <circle cx="17" cy="7" r="2.2" fill="#f87171">
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.2s" repeatCount="indefinite" />
                </circle>
              </svg>
              <div>
                <div className="h-title">BEFORE IT HAPPENS</div>
                <div className="h-sub">PREDICTIVE MINE SAFETY SYSTEM · v2.4</div>
              </div>
            </div>

            <div className="status-pill">
              <div className="status-dot" />
              SYSTEM STATUS: SAFE
            </div>

            <div className="h-clock">{clock || "--:--:--"} LOCAL</div>
          </div>

          {/* ── METRIC TILES ── */}
          {metrics.map((m, i) => (
            <div key={i} className="rp c3 metric-tile">
              <div className="m-label">{m.label}</div>
              <div className="m-value" style={{ color: m.color }}>{m.value}</div>
              <div className="m-bar">
                <div className="m-bar-fill" style={{ width: m.display, background: m.color }} />
              </div>
            </div>
          ))}

          {/* ── MINE MAP ── */}
          <div className="rp c9 r4 map-panel">
            <div className="map-header">⬛ MINE SCHEMATIC — LIVE SENSOR VIEW</div>
            <div className="map-body">
              <MineMap zones={zones} />
            </div>
          </div>

          {/* ── ALERTS SIDEBAR ── */}
          <div className="rp c3 r4 alerts-panel">
            <div className="alerts-head">
              <div className="alerts-dot" />
              ALERTS FEED
            </div>
            <div className="alerts-body">
              <AlertsFeed externalAlerts={externalAlerts} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
