// src/components/MinerDetailModal.jsx

import { useEffect, useState, useRef } from "react";

const G    = "#00FF41";
const GD   = "#00C032";
const GM   = "#003B0F";
const CRIT = "#FF2222";
const WARN = "#FFB800";
const BG   = "#020a04";

const STATUS_COLOR = {
  danger:  CRIT,
  warning: WARN,
  safe:    G,
};

const Scanlines = () => (
  <div style={{
    position:"absolute", inset:0, pointerEvents:"none", zIndex:20,
    backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.22) 2px,rgba(0,0,0,0.22) 4px)`,
  }} />
);

/* Typing effect */
const useTyped = (str, speed=22) => {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const t = setInterval(() => {
      setOut(str.slice(0, i+1));
      i++;
      if(i >= str.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [str]);
  return out;
};

export default function MinerDetailModal({ miner, onClose }) {
  const [heartData, setHeartData] = useState([miner.heartRate]);
  const [bodyTemp]  = useState((36.2 + Math.random() * 1.2).toFixed(1));
  const [o2Level]   = useState((94 + Math.random() * 5).toFixed(0));
  const [glitch, setGlitch] = useState(false);
  const [tick, setTick] = useState(0);
  const svgRef = useRef(null);

  const color = STATUS_COLOR[miner.status] || G;
  const typed = useTyped(`> ACCESSING PROFILE: ${miner.name.toUpperCase()}...`);

  useEffect(() => {
    const id = setInterval(() => {
      setHeartData(prev => {
        const next = Math.max(60, Math.min(140, prev[prev.length-1] + (Math.random()*6-3)));
        return [...prev.slice(-29), parseFloat(next.toFixed(1))];
      });
      setTick(t => t+1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // random glitch flash
  useEffect(() => {
    const id = setInterval(() => {
      if(Math.random() < 0.15) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 120);
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const bpm = heartData[heartData.length-1].toFixed(0);
  const W = 360, H = 110;
  const pts = heartData.map((v,i) => {
    const x = (i / (heartData.length-1)) * W;
    const y = H - ((v - 55) / 90) * H;
    return `${x},${y}`;
  }).join(" ");

  const now = new Date();
  const ts = `${String(now.getUTCHours()).padStart(2,"0")}:${String(now.getUTCMinutes()).padStart(2,"0")}:${String(now.getUTCSeconds()).padStart(2,"0")}`;

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:50,
      background:"rgba(0,5,1,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(2px)",
    }}
      onClick={e => { if(e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
       
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes borderPulse{0%,100%{box-shadow:0 0 8px ${G}22}50%{box-shadow:0 0 24px ${G}44}}
        @keyframes scanH{0%{top:-5%}100%{top:105%}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.96) translateY(8px)}to{opacity:1;transform:none}}
        @keyframes heartPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
        .close-btn{
          position:absolute;top:12px;right:12px;
          background:transparent;border:1px solid ${G}33;
          color:${GD};font-family:'Share Tech Mono',monospace;font-size:11px;
          padding:4px 10px;cursor:pointer;letter-spacing:0.1em;
          transition:all 0.15s;
        }
        .close-btn:hover{border-color:${CRIT};color:${CRIT};}
        .stat-row{
          display:grid;grid-template-columns:120px 1fr;
          padding:5px 0;border-bottom:1px solid #0a1a0a;
          font-size:11px;align-items:center;
        }
      `}</style>

      <div style={{
        position:"relative", background:BG,
        border:`1px solid ${G}33`, width:440,
        fontFamily:"'Share Tech Mono',monospace",
        color:GD, overflow:"hidden",
        animation:"modalIn 0.25s ease forwards, borderPulse 3s infinite",
        filter: glitch ? "hue-rotate(180deg)" : "none",
        transition:"filter 0.05s",
      }}>
        <Scanlines />

        {/* Horizontal scan beam */}
        <div style={{
          position:"absolute",left:0,right:0,height:1,zIndex:25,pointerEvents:"none",
          background:`linear-gradient(90deg,transparent,${G}44,transparent)`,
          animation:"scanH 4s linear infinite",
        }} />

        {/* Corner brackets */}
        {[
          {top:0,left:0,borderTop:`1px solid ${G}`,borderLeft:`1px solid ${G}`},
          {top:0,right:0,borderTop:`1px solid ${G}`,borderRight:`1px solid ${G}`},
          {bottom:0,left:0,borderBottom:`1px solid ${G}`,borderLeft:`1px solid ${G}`},
          {bottom:0,right:0,borderBottom:`1px solid ${G}`,borderRight:`1px solid ${G}`},
        ].map((s,i) => (
          <div key={i} style={{ position:"absolute", width:14, height:14, ...s }} />
        ))}

        <button className="close-btn" onClick={onClose}>[ CLOSE ]</button>

        <div style={{ padding:"22px 24px 20px" }}>

          {/* Terminal header */}
          <div style={{ fontSize:8, color:GD+"55", letterSpacing:"0.3em", marginBottom:8 }}>
            {`[SYS] ${ts} UTC // ID:${String(miner.id).padStart(4,"0")} // NODE:ALPHA`}
          </div>

          {/* Typing line */}
          <div style={{ fontSize:10, color:GD, letterSpacing:"0.1em", marginBottom:10, minHeight:16 }}>
            {typed}<span style={{ animation:"blink 1s infinite" }}>█</span>
          </div>

          {/* Name */}
          <div style={{
            fontSize:22, color:G, letterSpacing:"0.1em", lineHeight:1,
            textShadow:`0 0 16px ${G}66`, marginBottom:4,
          }}>
            {miner.name.toUpperCase()}
          </div>

          {/* Status chip */}
          <div style={{
            display:"inline-block", fontSize:9, letterSpacing:"0.25em",
            color, border:`1px solid ${color}44`,
            background:`${color}11`, padding:"3px 10px", marginBottom:16,
          }}>
            ◈ {miner.status.toUpperCase()}
          </div>

          {/* Stats table */}
          <div style={{ marginBottom:16 }}>
            {[
              { label:"ZONE",      value:`SECTOR-${miner.zone}` },
              { label:"BODY TEMP", value:`${bodyTemp} °C`, alert: parseFloat(bodyTemp) > 37.5 },
              { label:"O₂ SAT",    value:`${o2Level}%`,   alert: parseInt(o2Level) < 96 },
              { label:"EXPOSURE",  value:`${Math.floor(Math.random()*8+1)}H ${Math.floor(Math.random()*60)}M` },
            ].map(({label, value, alert}) => (
              <div key={label} className="stat-row">
                <div style={{ fontSize:8, letterSpacing:"0.2em", color:GD+"55" }}>{label}</div>
                <div style={{ color: alert ? WARN : G, fontSize:12 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Heart rate monitor */}
          <div style={{
            background:"#010a03", border:`1px solid ${G}1a`,
            padding:"12px 14px", position:"relative", overflow:"hidden",
          }}>
            <Scanlines />
            <div style={{
              fontSize:8, letterSpacing:"0.3em", color:GD+"55", marginBottom:8,
              display:"flex", justifyContent:"space-between",
            }}>
              <span>▸ CARDIAC TELEMETRY // LIVE</span>
              <span style={{ animation:"blink 1s infinite" }}>● REC</span>
            </div>

            {/* ECG line chart */}
            <svg ref={svgRef} width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
              style={{ display:"block" }}>
              {/* Grid lines */}
              {[0.25,0.5,0.75].map(f => (
                <line key={f} x1={0} y1={H*f} x2={W} y2={H*f}
                  stroke={`${G}0d`} strokeWidth={1} />
              ))}
              {/* Glow fill */}
              <defs>
                <linearGradient id="hfill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
              </defs>
              {heartData.length > 1 && (
                <polygon
                  points={`0,${H} ${pts} ${W},${H}`}
                  fill="url(#hfill)"
                />
              )}
              {heartData.length > 1 && (
                <polyline
                  points={pts}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                />
              )}
              {/* Live dot */}
              {heartData.length > 1 && (() => {
                const last = heartData[heartData.length-1];
                const y = H - ((last - 55) / 90) * H;
                return <circle cx={W} cy={y} r={3} fill={color} style={{ filter:`drop-shadow(0 0 4px ${color})` }} />;
              })()}
            </svg>

            {/* BPM readout */}
            <div style={{
              marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center"
            }}>
              <div style={{ fontSize:8, color:GD+"44", letterSpacing:"0.2em" }}>HEART RATE</div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{
                  fontSize:9, color:color,
                  animation:"heartPulse 1s infinite",
                  display:"inline-block",
                }}>♥</span>
                <span style={{
                  fontSize:20, color,
                  textShadow:`0 0 12px ${color}88`,
                }}>
                  {bpm}
                </span>
                <span style={{ fontSize:9, color:GD+"55" }}>BPM</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop:12, fontSize:8, color:GD+"33", letterSpacing:"0.2em",
            display:"flex", justifyContent:"space-between",
          }}>
            <span>UPLINK: STABLE</span>
            <span>{`SAMPLES: ${heartData.length}`}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
