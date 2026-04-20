// src/pages/Personnel.jsx

import { useState, useEffect } from "react";
import MinerDetailModal from "../components/MinerDetailModal";

const G    = "#50ff4a";
const GD   = "#00C032";
const CRIT = "#FF2222";
const WARN = "#FFB800";
const BG   = "#020a04";

const minersData = [
  { id: 1,  name: "Ravi Kumar",     status: "safe",    heartRate: 78,  zone: "A" },
  { id: 2,  name: "Arjun Singh",    status: "warning", heartRate: 96,  zone: "B" },
  { id: 3,  name: "Vikram Patel",   status: "danger",  heartRate: 120, zone: "C" },
  { id: 4,  name: "Manoj Das",      status: "safe",    heartRate: 72,  zone: "A" },
  { id: 5,  name: "Imran Khan",     status: "warning", heartRate: 102, zone: "B" },
  { id: 11, name: "Rahul Mehta",    status: "warning", heartRate: 101, zone: "B" },
  { id: 12, name: "Suresh Yadav",   status: "safe",    heartRate: 70,  zone: "A" },
  { id: 13, name: "Amit Kulkarni",  status: "danger",  heartRate: 122, zone: "C" },
  { id: 14, name: "Pooja Nair",     status: "warning", heartRate: 95,  zone: "B" },
];

const STATUS_COLOR = { danger: CRIT, warning: WARN, safe: G };
const STATUS_LABEL = { danger: "!! CRITICAL", warning: "~ WARNING", safe: "● NOMINAL" };
const STATUS_SORT  = { danger: 0, warning: 1, safe: 2 };

const Scanlines = () => (
  <div style={{
    position:"fixed", inset:0, pointerEvents:"none", zIndex:1,
    backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)`,
  }} />
);

export default function Personnel() {
  const [selectedMiner, setSelectedMiner] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 1000);
    return () => clearInterval(id);
  }, []);

  const now = new Date();
  const ts = `${String(now.getUTCHours()).padStart(2,"0")}:${String(now.getUTCMinutes()).padStart(2,"0")}:${String(now.getUTCSeconds()).padStart(2,"0")}`;

  const counts = {
    ALL: minersData.length,
    danger:  minersData.filter(m=>m.status==="danger").length,
    warning: minersData.filter(m=>m.status==="warning").length,
    safe:    minersData.filter(m=>m.status==="safe").length,
  };

  const visible = minersData
    .filter(m => filter === "ALL" || m.status === filter)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => STATUS_SORT[a.status] - STATUS_SORT[b.status]);

  return (
    <div style={{
      minHeight:"100vh", background:BG, padding:"28px 24px",
      fontFamily:"'Share Tech Mono',monospace", color:GD,
      position:"relative", overflow:"hidden",
    }}>
      <style>{`
     
        * { box-sizing: border-box; }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes scanH{0%{top:-4%}100%{top:104%}}
        @keyframes matrixRain{0%{transform:translateY(-100%);opacity:0.8}100%{transform:translateY(100vh);opacity:0.1}}
        @keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes dangerPulse{0%,100%{border-color:${CRIT}33}50%{border-color:${CRIT}88}}

        .miner-card {
          background: #010a03;
          border: 1px solid ${G}18;
          padding: 16px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, background 0.2s;
          animation: cardIn 0.3s ease forwards;
        }
        .miner-card:hover {
          background: #021205;
          border-color: ${G}55;
        }
        .miner-card:hover .card-arrow { opacity: 1; }
        .miner-card.danger { animation: cardIn 0.3s ease forwards, dangerPulse 2s infinite; }

        .card-arrow {
          position: absolute; top: 12px; right: 12px;
          font-size: 10px; color: ${G}66; opacity: 0;
          transition: opacity 0.2s; letter-spacing: 0.1em;
        }

        .filter-btn {
          background: transparent;
          border: 1px solid ${G}22;
          color: ${GD}99;
          padding: 5px 14px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px; letter-spacing: 0.15em;
          cursor: pointer; transition: all 0.15s;
        }
        .filter-btn:hover { border-color: ${G}55; color: ${G}; }
        .filter-btn.active { border-color: ${G}; color: ${G}; background: ${G}11; }
        .filter-btn.f-danger.active  { border-color: ${CRIT}; color: ${CRIT}; background: ${CRIT}11; }
        .filter-btn.f-warning.active { border-color: ${WARN}; color: ${WARN}; background: ${WARN}11; }

        .search-input {
          background: #010a03; border: 1px solid ${G}22;
          color: ${G}; font-family: 'Share Tech Mono', monospace;
          font-size: 11px; padding: 6px 12px; outline: none;
          letter-spacing: 0.08em; width: 200px;
          transition: border-color 0.2s;
        }
        .search-input::placeholder { color: ${GD}33; }
        .search-input:focus { border-color: ${G}55; }

        .bpm-bar {
          height: 2px; margin-top: 6px;
          background: linear-gradient(90deg, ${G}66, transparent);
          transition: width 1s ease;
        }
      `}</style>

      <Scanlines />

      {/* Matrix rain */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
        {[5,14,24,37,50,62,73,85,93].map((left,i) => (
          <div key={i} style={{
            position:"absolute", top:0, left:`${left}%`,
            fontSize:8, color:`${G}14`, lineHeight:"13px",
            animation:`matrixRain ${7+i*1.1}s linear ${i*0.6}s infinite`,
            whiteSpace:"pre",
          }}>
            {"01\n10\n11\n00\n1\n0\n01\n11\n10".repeat(4)}
          </div>
        ))}
      </div>

      {/* Scan beam */}
      <div style={{
        position:"fixed", left:0, right:0, height:1, zIndex:30, pointerEvents:"none",
        background:`linear-gradient(90deg,transparent,${G}33,transparent)`,
        animation:"scanH 5s linear infinite",
      }} />

      <div style={{ position:"relative", zIndex:10 }}>

        {/* ══ HEADER ══ */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:8, color:GD+"44", letterSpacing:"0.3em", marginBottom:6 }}>
            {`[SYS] ${ts} UTC // PERSONNEL REGISTRY // ACTIVE NODES: ${minersData.length}`}
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div>
              <div style={{
                fontSize:34, color:G, letterSpacing:"0.1em", lineHeight:1,
                textShadow:`0 0 20px ${G}55`,
              }}>
                PERSONNEL.<span style={{ color:GD }}>DATA</span>
              </div>
              <div style={{ height:1, width:280, background:`linear-gradient(90deg,${G},transparent)`, marginTop:6, opacity:0.5 }} />
            </div>

            {/* Threat summary */}
            <div style={{
              border:`1px solid ${G}22`, background:"#010a03",
              padding:"10px 16px", display:"flex", gap:20,
            }}>
              {[
                { label:"CRITICAL", count:counts.danger,  color:CRIT },
                { label:"WARNING",  count:counts.warning, color:WARN },
                { label:"NOMINAL",  count:counts.safe,    color:G    },
              ].map(({label,count,color}) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:20, color, textShadow:`0 0 10px ${color}66` }}>{count}</div>
                  <div style={{ fontSize:7, color:`${color}88`, letterSpacing:"0.2em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ CONTROLS ══ */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24, flexWrap:"wrap" }}>
          <span style={{ fontSize:8, color:GD+"44", letterSpacing:"0.3em" }}>FILTER //</span>
          {[
            { key:"ALL",     label:`ALL [${counts.ALL}]`,           cls:"" },
            { key:"danger",  label:`CRITICAL [${counts.danger}]`,   cls:"f-danger" },
            { key:"warning", label:`WARNING [${counts.warning}]`,   cls:"f-warning" },
            { key:"safe",    label:`NOMINAL [${counts.safe}]`,      cls:"" },
          ].map(({key, label, cls}) => (
            <button key={key}
              className={`filter-btn ${cls} ${filter===key?"active":""}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}

          <div style={{ marginLeft:"auto" }}>
            <input
              className="search-input"
              placeholder="SEARCH OPERATIVE..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ══ GRID ══ */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
          gap:12,
        }}>
          {visible.map((miner, idx) => {
            const color = STATUS_COLOR[miner.status];
            const bpmWidth = Math.min(100, ((miner.heartRate - 55) / 85) * 100);
            return (
              <div key={miner.id}
                className={`miner-card ${miner.status}`}
                style={{ animationDelay:`${idx*0.04}s`, opacity:0, animationFillMode:"forwards" }}
                onClick={() => setSelectedMiner(miner)}
              >
                {/* scan overlay per card */}
                <div style={{
                  position:"absolute", inset:0, pointerEvents:"none",
                  backgroundImage:`repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 4px)`,
                }} />

                {/* Accent line top */}
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,${color}66,transparent)` }} />

                <div className="card-arrow">[ OPEN ]</div>

                {/* ID tag */}
                <div style={{ fontSize:7, color:GD+"44", letterSpacing:"0.3em", marginBottom:8 }}>
                  {`OP-${String(miner.id).padStart(4,"0")} // ZONE-${miner.zone}`}
                </div>

                {/* Name */}
                <div style={{
                  fontSize:13, color:G, letterSpacing:"0.06em",
                  textShadow:`0 0 8px ${G}44`, marginBottom:6, lineHeight:1.2,
                }}>
                  {miner.name.toUpperCase()}
                </div>

                {/* Status */}
                <div style={{
                  fontSize:9, color, letterSpacing:"0.15em",
                  marginBottom:12,
                  animation: miner.status==="danger" ? "blink 1.4s infinite" : "none",
                }}>
                  {STATUS_LABEL[miner.status]}
                </div>

                {/* Heart rate */}
                <div style={{ fontSize:9, color:GD+"66", letterSpacing:"0.1em", marginBottom:2 }}>
                  CARDIAC
                </div>
                <div style={{ display:"flex", alignItems:"baseline", gap:4 }}>
                  <span style={{ fontSize:22, color, textShadow:`0 0 10px ${color}66` }}>
                    {miner.heartRate}
                  </span>
                  <span style={{ fontSize:8, color:GD+"55" }}>BPM</span>
                </div>
                <div className="bpm-bar" style={{ width:`${bpmWidth}%`, background:`linear-gradient(90deg,${color}88,transparent)` }} />

              </div>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div style={{
            textAlign:"center", padding:"48px 0",
            fontSize:11, color:GD+"33", letterSpacing:"0.3em",
          }}>
            NO RECORDS MATCH QUERY
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop:32, paddingTop:12, borderTop:`1px solid ${G}11`,
          fontSize:8, color:GD+"22", letterSpacing:"0.2em",
          display:"flex", justifyContent:"space-between",
        }}>
          <span>BEFORE-IT-HAPPENS // PERSONNEL MODULE v2.1</span>
          <span style={{ animation:"blink 3s infinite" }}>UPLINK ACTIVE</span>
        </div>

      </div>

      {/* Modal */}
      {selectedMiner && (
        <MinerDetailModal miner={selectedMiner} onClose={() => setSelectedMiner(null)} />
      )}
    </div>
  );
}
