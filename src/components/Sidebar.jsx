import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    code: "SYS-01",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8" y="1" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="1" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
        <rect x="8" y="8" width="5" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    ),
  },
  {
    path: "/simulator",
    label: "Simulator",
    code: "SIM-02",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 4v3.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    path: "/personnel",
    label: "Personnel",
    code: "PRS-03",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2.5 12c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    path: "/logs",
    label: "Logs",
    code: "LOG-04",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2" y="1" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <line x1="4.5" y1="4.5" x2="9.5" y2="4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="4.5" y1="7"   x2="9.5" y2="7"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="4.5" y1="9.5" x2="7.5" y2="9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    path: "/protocols",
    label: "Protocols",
    code: "PRO-05",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5l4.5 2.6v5.8L7 12.5 2.5 9.9V4.1L7 1.5z" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;600;700&display=swap');

  .sidebar-root {
    width: 220px;
    min-height: 100vh;
    background: #0d0e0f;
    border-right: 1px solid #2a2d30;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;
    font-family: 'Share Tech Mono', 'Courier New', monospace;
  }

  /* right-edge glow line */
  .sidebar-root::after {
    content: '';
    position: absolute;
    top: 0; right: -1px; bottom: 0;
    width: 1px;
    background: linear-gradient(180deg, transparent 0%, #3d2e0a 30%, #c89020 50%, #3d2e0a 70%, transparent 100%);
    opacity: 0.5;
    animation: edge-pulse 4s ease-in-out infinite;
  }
  @keyframes edge-pulse { 0%,100%{opacity:0.3} 50%{opacity:0.7} }

  /* ── LOGO BLOCK ── */
  .sb-logo {
    padding: 16px 14px 14px;
    border-bottom: 1px solid #1f2125;
    position: relative;
    overflow: hidden;
  }
  .sb-logo::before {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, #c89020, transparent);
    opacity: 0.6;
  }
  .sb-logo-icon {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .sb-shaft {
    width: 28px; height: 28px; flex-shrink: 0;
  }
  .sb-app-name {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 3px;
    color: #f5c842;
    line-height: 1.2;
  }
  .sb-app-sub {
    font-size: 7px;
    letter-spacing: 2px;
    color: #3d2e0a;
  }
  .sb-depth-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
  }
  .sb-depth-label { font-size: 7px; letter-spacing: 2px; color: #4b5563; }
  .sb-depth-val   { font-size: 7px; letter-spacing: 1px; color: #c89020; }

  /* ── SECTION LABEL ── */
  .sb-section {
    padding: 12px 14px 4px;
    font-size: 7px;
    letter-spacing: 3px;
    color: #2a2d30;
  }

  /* ── NAV ITEMS ── */
  .sb-nav { flex: 1; padding: 4px 10px; display: flex; flex-direction: column; gap: 3px; }

  .sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 3px;
    border: 1px solid transparent;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: all 0.15s ease;
    cursor: pointer;
  }
  .sb-link:hover {
    background: rgba(255,255,255,0.025);
    border-color: #2a2d30;
  }
  .sb-link.active {
    background: rgba(200,144,32,0.1);
    border-color: #3d2e0a;
  }
  .sb-link.active::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: #c89020;
    border-radius: 0 1px 1px 0;
  }
  .sb-link.active::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, #c89020, transparent);
  }

  .sb-link-icon {
    width: 14px; height: 14px;
    flex-shrink: 0;
    color: #4b5563;
    transition: color 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .sb-link:hover .sb-link-icon { color: #7a5810; }
  .sb-link.active .sb-link-icon { color: #c89020; }

  .sb-link-body { flex: 1; min-width: 0; }
  .sb-link-label {
    font-size: 10px;
    letter-spacing: 2px;
    color: #4b5563;
    transition: color 0.15s;
    display: block;
    line-height: 1;
  }
  .sb-link:hover .sb-link-label { color: #94a3b8; }
  .sb-link.active .sb-link-label { color: #f5c842; }

  .sb-link-code {
    font-size: 7px;
    letter-spacing: 1px;
    color: #2a2d30;
    margin-top: 2px;
    display: block;
    transition: color 0.15s;
  }
  .sb-link:hover .sb-link-code { color: #3d2e0a; }
  .sb-link.active .sb-link-code { color: #7a5810; }

  .sb-link-arrow {
    font-size: 8px;
    color: transparent;
    transition: color 0.15s;
    flex-shrink: 0;
  }
  .sb-link.active .sb-link-arrow { color: #c89020; }

  /* ── BOTTOM STATUS ── */
  .sb-footer {
    padding: 10px 14px 14px;
    border-top: 1px solid #1f2125;
  }
  .sb-status-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
  .sb-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px #4ade80;
    animation: sb-blink 1.4s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes sb-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .sb-status-text { font-size: 7px; letter-spacing: 2px; color: #4ade80; }

  .sb-bars { display: flex; flex-direction: column; gap: 4px; }
  .sb-bar-row { display: flex; align-items: center; gap: 6px; }
  .sb-bar-label { font-size: 7px; letter-spacing: 1px; color: #2a2d30; width: 22px; }
  .sb-bar-track { flex: 1; height: 2px; background: #1f2125; border-radius: 1px; overflow: hidden; }
  .sb-bar-fill  { height: 100%; border-radius: 1px; }
  .sb-bar-val   { font-size: 7px; color: #2a2d30; width: 24px; text-align: right; }

  .sb-ver {
    margin-top: 10px;
    font-size: 7px;
    letter-spacing: 2px;
    color: #1f2125;
    text-align: center;
  }
`;

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      <style>{CSS}</style>
      <div className="sidebar-root">

        {/* ── LOGO ── */}
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <svg className="sb-shaft" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3"  y="2"  width="22" height="3" rx="0.8" fill="#c89020"/>
              <rect x="7"  y="5"  width="3"  height="16" fill="#7a5810"/>
              <rect x="18" y="5"  width="3"  height="16" fill="#7a5810"/>
              <rect x="10" y="11" width="8"  height="10" rx="0.8" fill="#c89020" opacity="0.7"/>
              <rect x="3"  y="21" width="22" height="2.5" rx="0.8" fill="#7a5810"/>
              <circle cx="14" cy="26" r="1.8" fill="#f5c842"/>
              <line x1="14" y1="24" x2="14" y2="21" stroke="#f5c842" strokeWidth="1.2"/>
            </svg>
            <div>
              <div className="sb-app-name">BEFORE IT{"\n"}HAPPENS</div>
            </div>
          </div>
          <div className="sb-app-sub">PREDICTIVE MINE SAFETY</div>
          <div className="sb-depth-row">
            <span className="sb-depth-label">SHAFT DEPTH</span>
            <span className="sb-depth-val">-320m</span>
          </div>
        </div>

        {/* ── NAV SECTION ── */}
        <div className="sb-section">NAVIGATION</div>
        <nav className="sb-nav">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sb-link ${active ? "active" : ""}`}
              >
                <div className="sb-link-icon">{item.icon}</div>
                <div className="sb-link-body">
                  <span className="sb-link-label">{item.label.toUpperCase()}</span>
                  <span className="sb-link-code">{item.code}</span>
                </div>
                <span className="sb-link-arrow">›</span>
              </Link>
            );
          })}
        </nav>

        {/* ── FOOTER STATUS ── */}
        <div className="sb-footer">
          <div className="sb-status-row">
            <div className="sb-dot"/>
            <span className="sb-status-text">ALL SYSTEMS NOMINAL</span>
          </div>
          <div className="sb-bars">
            <div className="sb-bar-row">
              <span className="sb-bar-label">AIR</span>
              <div className="sb-bar-track"><div className="sb-bar-fill" style={{ width: "82%", background: "#4ade80" }}/></div>
              <span className="sb-bar-val">82%</span>
            </div>
            <div className="sb-bar-row">
              <span className="sb-bar-label">NET</span>
              <div className="sb-bar-track"><div className="sb-bar-fill" style={{ width: "95%", background: "#c89020" }}/></div>
              <span className="sb-bar-val">95%</span>
            </div>
            <div className="sb-bar-row">
              <span className="sb-bar-label">PWR</span>
              <div className="sb-bar-track"><div className="sb-bar-fill" style={{ width: "67%", background: "#f97316" }}/></div>
              <span className="sb-bar-val">67%</span>
            </div>
          </div>
          <div className="sb-ver">v2.4.1 &nbsp;·&nbsp; BUILD 0419</div>
        </div>

      </div>
    </>
  );
}
