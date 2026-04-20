// src/components/AlertsFeed.jsx

import { motion, AnimatePresence } from "framer-motion";

const AMBER  = "#C9872A";
const AMBER2 = "#E8A83E";
const COAL   = "#0D0B09";
const SEAM   = "#2A1E10";
const STONE  = "#1A1410";

export default function AlertsFeed({ externalAlerts = [] }) {

  const config = {
    danger: {
      border:  "#D95F3B",
      bg:      "rgba(217,95,59,0.08)",
      label:   "#D95F3B",
      tag:     "⬟ CRITICAL",
      dot:     "#D95F3B",
      dotAnim: "0.7s",
      shimmer: true,
    },
    warning: {
      border:  "#E8A83E",
      bg:      "rgba(232,168,62,0.07)",
      label:   "#E8A83E",
      tag:     "▲ WARNING",
      dot:     "#E8A83E",
      dotAnim: "1.4s",
      shimmer: false,
    },
    info: {
      border:  "#7A9E8A",
      bg:      "rgba(122,158,138,0.06)",
      label:   "#7A9E8A",
      tag:     "◆ STATUS",
      dot:     "#7A9E8A",
      dotAnim: "2.5s",
      shimmer: false,
    },
  };

  const getCfg = (sev) => config[sev] || config.info;

  return (
    <>
      <style>{`
      

        .af-wrap {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
        }

        .af-item {
          position: relative;
          overflow: hidden;
          padding: 10px 12px;
          border-left-width: 2px;
          border-left-style: solid;
        }

        /* Rock strata grain behind each alert */
        .af-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              158deg,
              transparent, transparent 28px,
              rgba(42,30,16,0.18) 28px, rgba(42,30,16,0.18) 29px
            );
          pointer-events: none;
          z-index: 0;
        }
        .af-item > * { position: relative; z-index: 1; }

        @keyframes afPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }

        @keyframes coalShimmer {
          0%   { left: -80%; }
          100% { left: 140%; }
        }

        .af-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .af-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 5px;
        }

        .af-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
          font-weight: 700;
        }

        .af-time-zone {
          margin-left: auto;
          font-family: 'Share Tech Mono', monospace;
          font-size: 7px;
          color: rgba(201,135,42,0.4);
          letter-spacing: 0.1em;
        }

        .af-msg {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          line-height: 1.4;
          color: rgba(232,168,62,0.75);
          margin-bottom: 5px;
          letter-spacing: 0.05em;
        }

        .af-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .af-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          color: rgba(201,135,42,0.35);
          letter-spacing: 0.1em;
        }

        .af-depth {
          font-family: 'Share Tech Mono', monospace;
          font-size: 7px;
          color: rgba(201,135,42,0.25);
          letter-spacing: 0.1em;
        }

        .af-shimmer {
          position: absolute;
          top: 0; bottom: 0;
          width: 50px;
          background: linear-gradient(90deg, transparent, rgba(217,95,59,0.08), transparent);
          animation: coalShimmer 2.5s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        .af-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          height: 100%;
          color: rgba(201,135,42,0.3);
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.25em;
          text-align: center;
        }
      `}</style>

      <div className="af-wrap">
        <AnimatePresence>
          {externalAlerts.length === 0 ? (
            <div className="af-empty">
              {/* Lantern icon */}
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                <rect x="10" y="6" width="12" height="26" rx="3" fill="none" stroke="rgba(201,135,42,0.25)" strokeWidth="1"/>
                <rect x="13" y="2" width="6" height="5" rx="1" fill="none" stroke="rgba(201,135,42,0.2)" strokeWidth="1"/>
                <line x1="16" y1="32" x2="16" y2="38" stroke="rgba(201,135,42,0.2)" strokeWidth="1"/>
                <ellipse cx="16" cy="19" rx="4" ry="5" fill="rgba(201,135,42,0.12)"/>
                <ellipse cx="16" cy="19" rx="2" ry="2.5" fill="rgba(232,168,62,0.15)"/>
              </svg>
              <div>NO ACTIVE ALERTS</div>
              <div style={{ fontSize:7, opacity:0.6 }}>SHAFT MONITORING NOMINAL</div>
            </div>
          ) : (
            externalAlerts.map((alert) => {
              const c = getCfg(alert.severity);
              return (
                <motion.div
                  key={alert.id}
                  className="af-item"
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0,  opacity: 1 }}
                  exit={{    x: 40, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    background:    c.bg,
                    borderLeft:    `2px solid ${c.border}`,
                    borderTop:     `1px solid ${c.border}18`,
                    borderRight:   `1px solid ${c.border}0a`,
                    borderBottom:  `1px solid ${c.border}0a`,
                  }}
                >
                  {c.shimmer && <div className="af-shimmer" />}

                  <div className="af-row">
                    <div
                      className="af-dot"
                      style={{
                        background: c.dot,
                        boxShadow: `0 0 4px ${c.dot}`,
                        animation: `afPulse ${c.dotAnim} ease-in-out infinite`,
                      }}
                    />
                    <span className="af-tag" style={{ color: c.label }}>{c.tag}</span>
                    {alert.zone && (
                      <span className="af-time-zone">ZONE {alert.zone}</span>
                    )}
                  </div>

                  <div className="af-msg">{alert.message}</div>

                  <div className="af-footer">
                    <div className="af-time">⏱ {alert.time}</div>
                    <div className="af-depth">−200m</div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
