import { motion, AnimatePresence } from "framer-motion";

export default function AlertsFeed({ externalAlerts = [] }) {

  const config = {
    danger: {
      border:  "#f87171",
      bg:      "rgba(248,113,113,0.07)",
      label:   "#f87171",
      tag:     "CRITICAL",
      dot:     "#f87171",
      dotAnim: "0.8s",
    },
    warning: {
      border:  "#facc15",
      bg:      "rgba(250,204,21,0.07)",
      label:   "#facc15",
      tag:     "WARNING",
      dot:     "#facc15",
      dotAnim: "1.4s",
    },
    info: {
      border:  "#60a5fa",
      bg:      "rgba(96,165,250,0.06)",
      label:   "#60a5fa",
      tag:     "INFO",
      dot:     "#60a5fa",
      dotAnim: "2.5s",
    },
  };

  const getCfg = (sev) => config[sev] || config.info;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@400;600&display=swap');

        .af-wrap {
          height: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
        }

        .af-item {
          position: relative;
          overflow: hidden;
          border-radius: 3px;
          padding: 9px 11px 9px 13px;
          font-family: 'Barlow Condensed', sans-serif;
        }

        /* Rock grain overlay on each alert */
        .af-item::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(162deg, transparent, transparent 35px, rgba(255,255,255,0.018) 35px, rgba(255,255,255,0.018) 36px);
          pointer-events: none;
          z-index: 0;
        }
        .af-item > * { position: relative; z-index: 1; }

        @keyframes afPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }

        .af-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .af-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .af-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          letter-spacing: 2px;
          font-weight: 700;
        }

        .af-zone {
          font-family: 'Share Tech Mono', monospace;
          font-size: 8px;
          color: rgba(155,118,52,0.55);
          letter-spacing: 1px;
          margin-left: auto;
        }

        .af-msg {
          font-size: 12px;
          line-height: 1.35;
          color: rgba(218,195,160,0.85);
          margin-bottom: 4px;
        }

        .af-time {
          font-family: 'Share Tech Mono', monospace;
          font-size: 9px;
          color: rgba(155,118,52,0.45);
          letter-spacing: 1px;
        }

        /* Shimmer on danger items */
        @keyframes shimmer {
          0%   { left: -80%; }
          100% { left: 120%; }
        }
        .af-shimmer {
          position: absolute;
          top: 0; bottom: 0;
          width: 60px;
          background: linear-gradient(90deg, transparent, rgba(248,113,113,0.06), transparent);
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        /* Empty state */
        .af-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 100%;
          color: rgba(155,118,52,0.35);
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 2px;
        }
      `}</style>

      <div className="af-wrap">
        <AnimatePresence>
          {externalAlerts.length === 0 ? (
            <div className="af-empty">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(155,118,52,0.25)" strokeWidth="1" />
                <line x1="14" y1="8" x2="14" y2="15" stroke="rgba(155,118,52,0.35)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="14" cy="19" r="1.2" fill="rgba(155,118,52,0.35)" />
              </svg>
              NO ACTIVE ALERTS
            </div>
          ) : (
            externalAlerts.map((alert) => {
              const c = getCfg(alert.severity);
              return (
                <motion.div
                  key={alert.id}
                  className="af-item"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0,  opacity: 1 }}
                  exit={{    x: 60, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    background:   c.bg,
                    borderLeft:   `2px solid ${c.border}`,
                    borderTop:    `1px solid ${c.border}22`,
                    borderRight:  `1px solid ${c.border}11`,
                    borderBottom: `1px solid ${c.border}11`,
                  }}
                >
                  {/* Shimmer on danger */}
                  {alert.severity === "danger" && <div className="af-shimmer" />}

                  {/* Top row: dot + tag + zone */}
                  <div className="af-row">
                    <div
                      className="af-dot"
                      style={{
                        background: c.dot,
                        animation: `afPulse ${c.dotAnim} ease-in-out infinite`,
                      }}
                    />
                    <span className="af-tag" style={{ color: c.label }}>{c.tag}</span>
                    {alert.zone && (
                      <span className="af-zone">ZONE {alert.zone}</span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="af-msg">{alert.message}</div>

                  {/* Timestamp */}
                  <div className="af-time">⏱ {alert.time}</div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
