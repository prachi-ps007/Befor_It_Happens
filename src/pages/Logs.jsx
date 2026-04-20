// src/pages/Logs.jsx

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const generateData = (type) => {
  const data = [];
  let base = type === "Methane" ? 2 : type === "CO" ? 10 : 50;
  for (let i = 0; i < 24; i++) {
    base += Math.random() * 4 - 2;
    data.push({ time: `${i}:00`, value: Math.max(0, parseFloat(base.toFixed(2))) });
  }
  return data;
};

const SENSOR_CONFIG = {
  Methane: { color: "#C9A84C", unit: "ppm", threshold: 5, label: "CH₄" },
  CO:      { color: "#B87333", unit: "ppm", threshold: 15, label: "CO" },
  Humidity:{ color: "#8BA888", unit: "%",   threshold: 70, label: "H₂O" },
};

/* SVG crack overlays — hand-tuned fissure paths */
const CrackOverlay = () => (
  <svg
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 10 }}
    viewBox="0 0 800 400"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Primary fissure — top left diagonal */}
    <polyline
      points="120,0 145,38 133,72 160,105 148,145 178,190 155,240 180,300"
      fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6"
    />
    {/* Branch fissures */}
    <polyline points="148,145 195,138 230,155 260,143" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
    <polyline points="160,105 130,95 108,110 80,100" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
    {/* Right side crack */}
    <polyline
      points="680,30 665,80 690,125 670,175 700,220 685,280 710,340 695,400"
      fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.5"
    />
    <polyline points="685,280 730,270 760,282" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.35" />
    {/* Hairline stress cracks */}
    <line x1="300" y1="0" x2="318" y2="60" stroke="#fff" strokeWidth="0.4" opacity="0.1" />
    <line x1="318" y1="60" x2="295" y2="100" stroke="#fff" strokeWidth="0.4" opacity="0.1" />
    <line x1="500" y1="200" x2="540" y2="260" stroke="#C9A84C" strokeWidth="0.6" opacity="0.2" />
    <line x1="540" y1="260" x2="515" y2="310" stroke="#C9A84C" strokeWidth="0.6" opacity="0.2" />
    {/* Impact spall — scattered debris dots */}
    {[[150,39],[143,73],[161,106],[135,96],[179,191],[156,241]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%2===0?2:1.2} fill="#C9A84C" opacity="0.5" />
    ))}
  </svg>
);

/* Displaced corner fragment */
const CornerShard = ({ style }) => (
  <div style={{
    position: "absolute",
    background: "linear-gradient(135deg, #1a1612 60%, #0d0b08)",
    border: "1px solid #C9A84C44",
    boxShadow: "inset 0 0 20px #00000088, 2px 4px 12px #00000099",
    ...style
  }} />
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0d0b08",
      border: "1px solid #C9A84C66",
      padding: "8px 14px",
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: 12,
      color: "#C9A84C",
      transform: "rotate(-0.5deg)",
    }}>
      <div style={{ color: "#888", marginBottom: 2 }}>{label}</div>
      <div>{payload[0].value}</div>
    </div>
  );
};

export default function Logs() {
  const [sensor, setSensor] = useState("Methane");
  const [data, setData] = useState(generateData("Methane"));
  const [report, setReport] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const cfg = SENSOR_CONFIG[sensor];

  useEffect(() => {
    const d = generateData(sensor);
    setData(d);
    setReport(null);
    // detect threshold breaches
    setAnomalies(d.filter(p => p.value > SENSOR_CONFIG[sensor].threshold));
  }, [sensor]);

  const generateReport = () => {
    const values = data.map(d => d.value);
    const avg = (values.reduce((a,b) => a+b, 0) / values.length).toFixed(2);
    setReport({ avg, max: Math.max(...values).toFixed(2), min: Math.min(...values).toFixed(2) });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080705",
      padding: "32px 24px",
      fontFamily: "'Share Tech Mono', monospace",
      color: "#c8b89a",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Google Font load */}
      <style>{`
       

        .reg-select {
          background: #0d0b08;
          border: 1px solid #C9A84C55;
          color: #C9A84C;
          padding: 8px 14px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          outline: none;
          transform: rotate(-0.3deg);
          cursor: pointer;
          transition: border-color 0.2s;
        }
        .reg-select:hover { border-color: #C9A84C; }
        .reg-select option { background: #0d0b08; }

        .gen-btn {
          background: transparent;
          border: 1px solid #C9A84C;
          color: #C9A84C;
          padding: 8px 20px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          cursor: pointer;
          transform: rotate(0.4deg);
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .gen-btn:hover {
          background: #C9A84C18;
          box-shadow: 0 0 12px #C9A84C33;
        }
        .log-row {
          display: grid;
          grid-template-columns: 80px 1fr 80px 90px;
          gap: 0;
          border-bottom: 1px solid #1a1612;
          padding: 7px 0;
          font-size: 11px;
          transition: background 0.15s;
        }
        .log-row:hover { background: #C9A84C08; }
        .log-row.anomaly { background: #3a1f0808; border-bottom-color: #C9A84C22; }
        .log-row.anomaly .val { color: #E07B39; }

        @keyframes flicker { 0%,100%{opacity:1} 50%{opacity:0.85} 92%{opacity:0.9} }
        .flicker { animation: flicker 4s infinite; }

        @keyframes slideIn { from{opacity:0;transform:translateY(8px) rotate(-0.5deg)} to{opacity:1;transform:translateY(0) rotate(-0.5deg)} }
        .report-card { animation: slideIn 0.4s ease forwards; }
      `}</style>

      {/* Marble texture bg layer */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, #1a150a44 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, #12100844 0%, transparent 50%),
          repeating-linear-gradient(87deg, transparent, transparent 60px, #C9A84C04 60px, #C9A84C04 61px),
          repeating-linear-gradient(3deg, transparent, transparent 80px, #ffffff03 80px, #ffffff03 81px)
        `,
      }} />

      {/* ══ HEADER ══ */}
      <div style={{ position: "relative", zIndex: 5, marginBottom: 36 }}>

        {/* Displaced shard top-right */}
        <CornerShard style={{
          position: "absolute", top: -8, right: -10,
          width: 120, height: 48,
          transform: "rotate(1.8deg) skewX(-2deg)",
          clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }} />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "#555", marginBottom: 4 }}>
              INCIDENT REGISTRY // SECTOR 7-ALPHA
            </div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 42,
              fontWeight: 300,
              color: "#C9A84C",
              letterSpacing: "0.06em",
              lineHeight: 1,
              margin: 0,
              transform: "rotate(-0.3deg)",
              textShadow: "0 2px 24px #C9A84C44",
            }}>
              ENVIRONMENTAL
              <span style={{ fontStyle: "italic", marginLeft: 12 }}>LOGS</span>
            </h1>
            <div style={{
              height: 1,
              width: 320,
              background: "linear-gradient(90deg, #C9A84C, transparent)",
              marginTop: 8,
              transform: "rotate(-0.3deg)",
            }} />
          </div>

          {/* Status badge — cracked frame */}
          <div style={{
            border: "1px solid #C9A84C44",
            padding: "10px 18px",
            transform: "rotate(1.2deg)",
            position: "relative",
            background: "#0d0b08",
          }}>
            <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#555", marginBottom: 3 }}>SYS STATUS</div>
            <div style={{ fontSize: 11, color: anomalies.length > 0 ? "#E07B39" : "#8BA888", letterSpacing: "0.1em" }} className="flicker">
              {anomalies.length > 0 ? `⚠ ${anomalies.length} BREACH` : "◆ NOMINAL"}
            </div>
            {/* cracked corner on badge */}
            <div style={{
              position:"absolute", bottom:-1, right:-1,
              width:12, height:12,
              borderRight:"1px solid #C9A84C",
              borderBottom:"1px solid #C9A84C",
              transform:"rotate(3deg) translate(2px,2px)",
            }}/>
          </div>
        </div>
      </div>

      {/* ══ CONTROLS ══ */}
      <div style={{ position: "relative", zIndex: 5, display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#444" }}>SENSOR //</div>
        <select className="reg-select" value={sensor} onChange={e => setSensor(e.target.value)}>
          <option>Methane</option>
          <option>CO</option>
          <option>Humidity</option>
        </select>
        <div style={{
          width: 1, height: 28,
          background: "linear-gradient(to bottom, transparent, #C9A84C44, transparent)"
        }} />
        <button className="gen-btn" onClick={generateReport}>
          Generate Report
        </button>
        <div style={{ marginLeft: "auto", fontSize: 10, color: "#333", letterSpacing: "0.2em" }}>
          24H · {cfg.label} · {cfg.unit}
        </div>
      </div>

      {/* ══ CHART — with crack overlay ══ */}
      <div style={{
        position: "relative", zIndex: 5,
        background: "linear-gradient(160deg, #0f0d0a, #0a0906)",
        border: "1px solid #C9A84C22",
        padding: "24px 16px 16px",
        marginBottom: 28,
        transform: "rotate(-0.2deg)",
        boxShadow: "inset 0 0 60px #00000066, 4px 6px 24px #00000088",
        overflow: "hidden",
      }}>
        <CrackOverlay />

        <div style={{ fontSize: 9, letterSpacing: "0.4em", color: "#444", marginBottom: 12 }}>
          ▸ 24-HOUR TELEMETRY TRACE // {sensor.toUpperCase()}
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid stroke="#1a1612" strokeDasharray="3 3" />
            <XAxis dataKey="time" stroke="#333" tick={{ fill: "#444", fontSize: 10, fontFamily: "'Share Tech Mono'" }} />
            <YAxis stroke="#333" tick={{ fill: "#444", fontSize: 10, fontFamily: "'Share Tech Mono'" }} />
            <Tooltip content={<CustomTooltip />} />
            {/* Threshold reference line via a second constant data line */}
            <Line
              type="monotone"
              data={data.map(d => ({ ...d, threshold: cfg.threshold }))}
              dataKey="threshold"
              stroke="#C9A84C22"
              strokeWidth={1}
              strokeDasharray="6 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={cfg.color}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: cfg.color, stroke: "#0d0b08", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Displaced corner fragment on chart */}
        <div style={{
          position:"absolute", bottom: -4, right: -4,
          width: 60, height: 40,
          background: "#0a0906",
          border: "1px solid #C9A84C33",
          transform: "rotate(2.5deg)",
          clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }} />
      </div>

      {/* ══ LOG TABLE ══ */}
      <div style={{ position: "relative", zIndex: 5, marginBottom: 28 }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 10, borderBottom: "1px solid #C9A84C22", paddingBottom: 6,
        }}>
          <div style={{ fontSize: 9, letterSpacing: "0.4em", color: "#555" }}>
            ▸ REGISTRY ENTRIES // {data.length} RECORDS
          </div>
          {anomalies.length > 0 && (
            <div style={{ fontSize: 10, color: "#E07B39", letterSpacing: "0.1em" }}>
              {anomalies.length} THRESHOLD BREACH{anomalies.length > 1 ? "ES" : ""}
            </div>
          )}
        </div>

        {/* Table header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 80px 90px",
          fontSize: 9, letterSpacing: "0.25em",
          color: "#444", padding: "4px 0", marginBottom: 4,
          borderBottom: "1px solid #1a1612"
        }}>
          <div>TIME</div>
          <div>READING</div>
          <div>UNIT</div>
          <div style={{ textAlign: "right" }}>STATUS</div>
        </div>

        {/* Only show first 12 rows */}
        <div style={{ maxHeight: 260, overflow: "hidden", position: "relative" }}>
          {data.slice(0,12).map((d, i) => {
            const isAnom = d.value > cfg.threshold;
            return (
              <div key={i} className={`log-row ${isAnom ? "anomaly" : ""}`}
                style={{ color: "#666" }}>
                <div style={{ color: "#444" }}>{d.time}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    height: 2,
                    width: `${Math.min(100, (d.value / (cfg.threshold * 3)) * 100)}%`,
                    maxWidth: 140,
                    background: isAnom ? "#E07B39" : cfg.color,
                    opacity: 0.6,
                    minWidth: 4,
                  }} />
                </div>
                <div className="val" style={{ color: isAnom ? "#E07B39" : "#888" }}>
                  {d.value}
                </div>
                <div style={{ textAlign: "right", fontSize: 10,
                  color: isAnom ? "#E07B39" : "#3a5c3a",
                  letterSpacing: "0.1em"
                }}>
                  {isAnom ? "⚠ BREACH" : "  OK"}
                </div>
              </div>
            );
          })}

          {/* Fade bottom — like rubble covering the rest */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: "linear-gradient(to top, #080705, transparent)",
          }} />
        </div>

        <div style={{ fontSize: 9, color: "#333", letterSpacing: "0.2em", marginTop: 6 }}>
          ···  {data.length - 12} RECORDS BENEATH DEBRIS  ···
        </div>
      </div>

      {/* ══ REPORT ══ */}
      {report && (
        <div className="report-card" style={{
          position: "relative",
          zIndex: 5,
          background: "linear-gradient(140deg, #0f0d09, #0a0906)",
          border: "1px solid #C9A84C44",
          padding: "24px 28px",
          transform: "rotate(-0.5deg)",
          boxShadow: "4px 8px 32px #00000088, inset 0 0 40px #00000044",
          overflow: "hidden",
        }}>
          {/* Decorative crack on report */}
          <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }} viewBox="0 0 600 200" preserveAspectRatio="xMidYMid slice">
            <polyline points="400,0 385,40 410,80 390,130 415,200" fill="none" stroke="#C9A84C" strokeWidth="0.8" opacity="0.4" />
            <polyline points="390,130 430,125 460,135" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.25" />
          </svg>

          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20, fontWeight: 300, fontStyle: "italic",
            color: "#C9A84C", letterSpacing: "0.08em", marginBottom: 16,
            textShadow: "0 0 20px #C9A84C33",
          }}>
            Analysis Report — {sensor}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[
              { label: "AVERAGE", value: report.avg, unit: cfg.unit },
              { label: "MAXIMUM", value: report.max, unit: cfg.unit, alert: parseFloat(report.max) > cfg.threshold },
              { label: "MINIMUM", value: report.min, unit: cfg.unit },
            ].map(({ label, value, unit, alert }) => (
              <div key={label} style={{
                borderLeft: `1px solid ${alert ? "#E07B39" : "#C9A84C33"}`,
                paddingLeft: 14,
              }}>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#444", marginBottom: 6 }}>{label}</div>
                <div style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 32, fontWeight: 300,
                  color: alert ? "#E07B39" : "#C9A84C",
                  lineHeight: 1,
                }}>
                  {value}
                </div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{unit}</div>
              </div>
            ))}
          </div>

          {/* Threshold note */}
          <div style={{
            marginTop: 20, paddingTop: 12,
            borderTop: "1px solid #1a1612",
            fontSize: 10, color: "#444", letterSpacing: "0.1em",
          }}>
            SAFE THRESHOLD: {cfg.threshold} {cfg.unit} &nbsp;//&nbsp;
            {parseFloat(report.max) > cfg.threshold
              ? <span style={{ color: "#E07B39" }}>MAXIMUM READING EXCEEDS THRESHOLD</span>
              : <span style={{ color: "#8BA888" }}>ALL READINGS WITHIN BOUNDS</span>
            }
          </div>
        </div>
      )}

    </div>
  );
}
