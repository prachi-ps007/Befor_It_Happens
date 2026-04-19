
import { useEffect, useState } from "react";

export default function MinerDetailModal({ miner, onClose }) {
  const [heartData, setHeartData] = useState([miner.heartRate]);

  // 🔁 simulate live heart rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartData((prev) => {
        const next = Math.max(
          60,
          Math.min(140, prev[prev.length - 1] + (Math.random() * 6 - 3))
        );
        return [...prev.slice(-19), next];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getColor = () => {
    if (miner.status === "danger") return "#ef4444";
    if (miner.status === "warning") return "#facc15";
    return "#22c55e";
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 w-[420px] relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-xl text-orange-400 mb-2">{miner.name}</h2>

        <div
          className="inline-block px-2 py-1 text-xs rounded mb-4"
          style={{ background: getColor() + "33", color: getColor() }}
        >
          {miner.status.toUpperCase()}
        </div>

        {/* Body temp */}
        <div className="text-sm text-gray-400 mb-4">
          🌡️ Body Temp: {(36 + Math.random()).toFixed(1)} °C
        </div>

        {/* ❤️ Chart */}
        <div className="bg-black/40 p-3 rounded">
          <svg width="100%" height="120">
            {heartData.map((val, i) => {
              if (i === 0) return null;
              const x1 = ((i - 1) / 20) * 100 + "%";
              const x2 = (i / 20) * 100 + "%";
              const y1 = 120 - val;
              const y2 = 120 - heartData[i];

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={getColor()}
                  strokeWidth="2"
                  style={{ transition: "all 0.3s ease" }}
                />
              );
            })}
          </svg>

          <div className="text-xs text-gray-400 mt-2">
            ❤️ Heart Rate: {heartData[heartData.length - 1].toFixed(0)} bpm
          </div>
        </div>
      </div>
    </div>
  );
}

