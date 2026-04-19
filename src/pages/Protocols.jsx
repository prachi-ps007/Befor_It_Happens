import { useState } from "react";

/* ── PROTOCOL DATA ── */
const protocolsData = [
  {
    id: 1,
    name: "Fire",
    code: "FIR-01",
    severity: "CRITICAL",
    icon: "🔥",
    color: "#ef4444",
    dim: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.35)",
    steps: [
      "Activate fire alarm immediately",
      "Shut down all nearby machinery",
      "Use fire extinguishers if safe",
      "Evacuate all personnel immediately",
      "Report to designated assembly point",
    ],
  },
  {
    id: 2,
    name: "Gas Leak",
    code: "GAS-02",
    severity: "CRITICAL",
    icon: "☣",
    color: "#f97316",
    dim: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.35)",
    steps: [
      "Don oxygen mask before proceeding",
      "Shut off all gas valves in zone",
      "Increase shaft ventilation to max",
      "Evacuate all affected zones",
      "Notify control room immediately",
    ],
  },
  {
    id: 3,
    name: "Flood",
    code: "FLD-03",
    severity: "HIGH",
    icon: "💧",
    color: "#38bdf8",
    dim: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.35)",
    steps: [
      "Isolate electrical supply in area",
      "Move all personnel to higher ground",
      "Seal all entry and exit points",
      "Activate emergency water pumps",
      "Alert rescue and recovery team",
    ],
  },
  {
    id: 4,
    name: "Collapse",
    code: "COL-04",
    severity: "CRITICAL",
    icon: "⚠",
    color: "#c89020",
    dim: "rgba(200,144,32,0.12)",
    border: "rgba(200,144,32,0.35)",
    steps: [
      "Sound collapse alarm immediately",
      "Do not re-enter affected zone",
      "Account for all personnel on site",
      "Establish safe perimeter boundary",
      "Contact structural rescue team",
    ],
  },
  {
    id: 5,
    name: "Power Failure",
    code: "PWR-05",
    severity: "MEDIUM",
    icon: "⚡",
    color: "#facc15",
    dim: "rgba(250,204,21,0.1)",
    border: "rgba(250,204,21,0.3)",
    steps: [
      "Switch to emergency lighting",
      "Halt all active drilling operations",
      "Check backup generator status",
      "Secure open shaft entry points",
      "Await clearance from control room",
    ],
  },
  {
    id: 6,
    name: "Medical",
    code: "MED-06",
    severity: "HIGH",
    icon: "+",
    color: "#4ade80",
    dim: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.3)",
    steps: [
      "Call emergency medical response",
      "Do not move injured personnel",
      "Apply first aid if trained",
      "Clear path for rescue access",
      "Document incident details",
    ],
  },
];

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');

  .proto-root {
    background: #0d0e0f;
    color: #e2e8f0;
    font-family: 'Share Tech Mono', 'Courier New', monospace;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
  }
  .proto-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent, transparent 2px,
      rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px
    );
    pointer-events: none;
    z-index: 100;
  }

  /* ── PAGE HEADER ── */
  .proto-hdr {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid #2a2d30;
    position: relative;
  }
  .proto-hdr::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0;
    width: 120px; height: 2px;
    background: linear-gradient(90deg, #c89020, transparent);
  }
  .proto-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: 5px;
    color: #f5c842;
    line-height: 1;
  }
  .proto-subtitle {
    font-size: 8px;
    letter-spacing: 3px;
    color: #4b5563;
    margin-top: 4px;
  }
  .proto-count {
    font-size: 9px;
    letter-spacing: 2px;
    color: #4b5563;
    text-align: right;
  }
  .proto-count span {
    color: #c89020;
    font-size: 18px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    display: block;
    line-height: 1;
  }

  /* ── SEARCH ── */
  .search-wrap {
    position: relative;
    margin-bottom: 20px;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 11px;
    color: #4b5563;
    letter-spacing: 0;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    box-sizing: border-box;
    background: #111314;
    border: 1px solid #2a2d30;
    border-radius: 4px;
    padding: 10px 14px 10px 34px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    color: #e2e8f0;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input::placeholder { color: #2a2d30; letter-spacing: 2px; }
  .search-input:focus { border-color: #c89020; }

  /* ── FILTER TABS ── */
  .filter-row {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .filter-btn {
    background: #111314;
    border: 1px solid #2a2d30;
    border-radius: 3px;
    padding: 5px 12px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    letter-spacing: 2px;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.15s;
  }
  .filter-btn:hover { border-color: #7a5810; color: #c89020; }
  .filter-btn.active { border-color: #c89020; color: #f5c842; background: rgba(200,144,32,0.08); }

  /* ── PROTOCOL GRID ── */
  .proto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
    margin-bottom: 24px;
  }

  .proto-card {
    background: #111314;
    border: 1px solid #2a2d30;
    border-radius: 4px;
    padding: 14px 16px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, background 0.2s;
  }
  .proto-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--card-color), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .proto-card:hover::before,
  .proto-card.active::before { opacity: 1; }
  .proto-card:hover { border-color: var(--card-color); background: rgba(255,255,255,0.02); }
  .proto-card.active { border-color: var(--card-color); background: var(--card-dim); }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .card-icon {
    width: 32px; height: 32px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    border: 1px solid var(--card-border);
    background: var(--card-dim);
    flex-shrink: 0;
    color: var(--card-color);
  }
  .sev-badge {
    font-size: 7px;
    letter-spacing: 1.5px;
    padding: 2px 6px;
    border-radius: 2px;
    border: 1px solid var(--card-border);
    background: var(--card-dim);
    color: var(--card-color);
  }
  .card-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #e2e8f0;
    margin-bottom: 2px;
  }
  .card-code { font-size: 8px; letter-spacing: 2px; color: #4b5563; }
  .card-steps-hint { font-size: 8px; color: #4b5563; letter-spacing: 1px; margin-top: 8px; }

  /* ── CHECKLIST PANEL ── */
  .checklist-panel {
    background: #111314;
    border: 1px solid #2a2d30;
    border-radius: 4px;
    overflow: hidden;
    animation: slide-in 0.2s ease;
  }
  @keyframes slide-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cl-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #2a2d30;
    background: rgba(255,255,255,0.02);
    position: relative;
    overflow: hidden;
  }
  .cl-header::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cl-color), transparent);
  }
  .cl-title-row { display: flex; align-items: center; gap: 12px; }
  .cl-icon {
    width: 36px; height: 36px;
    border-radius: 3px;
    border: 1px solid var(--cl-border);
    background: var(--cl-dim);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    color: var(--cl-color);
  }
  .cl-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 3px;
    color: var(--cl-color);
  }
  .cl-code { font-size: 8px; letter-spacing: 2px; color: #4b5563; margin-top: 2px; }

  .cl-progress-wrap { text-align: right; }
  .cl-pct {
    font-family: 'Rajdhani', sans-serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--cl-color);
    line-height: 1;
  }
  .cl-pct-label { font-size: 7px; letter-spacing: 2px; color: #4b5563; margin-top: 2px; }

  .cl-progress-bar {
    height: 3px;
    background: #1a1c1e;
    position: relative;
  }
  .cl-progress-fill {
    height: 100%;
    background: var(--cl-color);
    transition: width 0.4s ease;
  }

  .cl-steps { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }

  .step-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid #1f2125;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
    background: transparent;
    position: relative;
    overflow: hidden;
  }
  .step-row:hover { border-color: #2a2d30; background: rgba(255,255,255,0.02); }
  .step-row.done {
    border-color: rgba(74,222,128,0.2);
    background: rgba(74,222,128,0.04);
  }
  .step-row.done::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: #4ade80;
  }

  .step-num {
    font-size: 8px;
    letter-spacing: 1px;
    color: #4b5563;
    width: 18px;
    flex-shrink: 0;
    text-align: right;
  }
  .step-check {
    width: 16px; height: 16px;
    border-radius: 2px;
    border: 1px solid #2a2d30;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
    font-size: 9px;
    color: transparent;
    background: transparent;
  }
  .step-row.done .step-check {
    border-color: #4ade80;
    background: rgba(74,222,128,0.15);
    color: #4ade80;
  }
  .step-text {
    font-size: 11px;
    letter-spacing: 0.5px;
    color: #94a3b8;
    flex: 1;
    transition: all 0.15s;
  }
  .step-row.done .step-text {
    color: #4b5563;
    text-decoration: line-through;
  }

  .cl-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border-top: 1px solid #1f2125;
    background: rgba(0,0,0,0.2);
  }
  .cl-status { font-size: 8px; letter-spacing: 2px; }
  .cl-reset-btn {
    background: transparent;
    border: 1px solid #2a2d30;
    border-radius: 3px;
    padding: 4px 12px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 8px;
    letter-spacing: 2px;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.15s;
  }
  .cl-reset-btn:hover { border-color: #7a5810; color: #c89020; }

  .empty-state {
    grid-column: 1 / -1;
    padding: 40px;
    text-align: center;
    font-size: 10px;
    letter-spacing: 2px;
    color: #4b5563;
    border: 1px dashed #2a2d30;
    border-radius: 4px;
  }
`;

const FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM"];

export default function Protocols() {
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("ALL");
  const [selected,  setSelected]  = useState(null);
  const [completed, setCompleted] = useState({});

  const filtered = protocolsData
    .filter(p => filter === "ALL" || p.severity === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  const selectProtocol = (p) => {
    setSelected(p);
    setCompleted({});
  };

  const toggleStep = (i) =>
    setCompleted(prev => ({ ...prev, [i]: !prev[i] }));

  const resetChecklist = () => setCompleted({});

  const doneCount  = selected ? selected.steps.filter((_, i) => completed[i]).length : 0;
  const totalSteps = selected ? selected.steps.length : 0;
  const pct        = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;

  const allDone = doneCount === totalSteps && totalSteps > 0;

  return (
    <>
      <style>{CSS}</style>
      <div className="proto-root">

        {/* ── PAGE HEADER ── */}
        <div className="proto-hdr">
          <div>
            <div className="proto-title">EMERGENCY PROTOCOLS</div>
            <div className="proto-subtitle">MINE SAFETY RESPONSE SYSTEM &nbsp;|&nbsp; LEVEL 3 OPERATIONS</div>
          </div>
          <div className="proto-count">
            <span>{filtered.length}</span>
            PROTOCOLS ACTIVE
          </div>
        </div>

        {/* ── SEARCH ── */}
        <div className="search-wrap">
          <span className="search-icon">[ SEARCH ]</span>
          <input
            className="search-input"
            type="text"
            placeholder="SEARCH PROTOCOLS..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── FILTER TABS ── */}
        <div className="filter-row">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── PROTOCOL CARDS ── */}
        <div className="proto-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">NO PROTOCOLS MATCH SEARCH QUERY</div>
          ) : (
            filtered.map(p => (
              <div
                key={p.id}
                className={`proto-card ${selected?.id === p.id ? "active" : ""}`}
                style={{
                  "--card-color":  p.color,
                  "--card-dim":    p.dim,
                  "--card-border": p.border,
                }}
                onClick={() => selectProtocol(p)}
              >
                <div className="card-top">
                  <div className="card-icon">{p.icon}</div>
                  <div className="sev-badge">{p.severity}</div>
                </div>
                <div className="card-name">{p.name.toUpperCase()}</div>
                <div className="card-code">{p.code}</div>
                <div className="card-steps-hint">{p.steps.length} STEPS &nbsp;·&nbsp; TAP TO ACTIVATE</div>
              </div>
            ))
          )}
        </div>

        {/* ── CHECKLIST ── */}
        {selected && (
          <div
            className="checklist-panel"
            style={{
              "--cl-color":  selected.color,
              "--cl-dim":    selected.dim,
              "--cl-border": selected.border,
            }}
          >
            <div className="cl-header">
              <div className="cl-title-row">
                <div className="cl-icon">{selected.icon}</div>
                <div>
                  <div className="cl-name">{selected.name.toUpperCase()} PROTOCOL</div>
                  <div className="cl-code">{selected.code} &nbsp;|&nbsp; {selected.severity}</div>
                </div>
              </div>
              <div className="cl-progress-wrap">
                <div className="cl-pct">{pct}%</div>
                <div className="cl-pct-label">COMPLETE</div>
              </div>
            </div>

            {/* progress bar */}
            <div className="cl-progress-bar">
              <div className="cl-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            {/* steps */}
            <div className="cl-steps">
              {selected.steps.map((step, i) => (
                <div
                  key={i}
                  className={`step-row ${completed[i] ? "done" : ""}`}
                  onClick={() => toggleStep(i)}
                >
                  <div className="step-num">0{i + 1}</div>
                  <div className="step-check">{completed[i] ? "✓" : ""}</div>
                  <div className="step-text">{step}</div>
                </div>
              ))}
            </div>

            <div className="cl-footer">
              <div
                className="cl-status"
                style={{ color: allDone ? "#4ade80" : "#4b5563" }}
              >
                {allDone
                  ? "✓ ALL STEPS COMPLETED — PROTOCOL FULFILLED"
                  : `${doneCount} / ${totalSteps} STEPS COMPLETED`}
              </div>
              <button className="cl-reset-btn" onClick={resetChecklist}>
                RESET
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
