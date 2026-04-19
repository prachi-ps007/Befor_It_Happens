import { useState, useEffect, useRef } from "react";
import MineMap from "../components/MINEMAP";
import AlertsFeed from "../components/AlertsFeed";
import useSimulation from "../hooks/useSimulation";
import {
  calculateRiskScore,
  getRiskLevel,
  getPrediction
} from "../utils/riskEngine";

export default function Simulator() {
  const { data, trend } = useSimulation();

  // 🔥 Zones (driven by risk engine)
  const [zones, setZones] = useState({
    A: "safe",
    B: "safe",
    C: "safe",
  });

  // 🔔 Alerts
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message, severity) => {
    const newAlert = {
      id: Date.now(),
      message,
      severity,
      time: new Date().toLocaleTimeString(),
    };

    setAlerts((prev) => [newAlert, ...prev].slice(0, 5));

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
    }, 5000);
  };

  // 🧠 Risk Engine
  const score = calculateRiskScore(data);
  const level = getRiskLevel(score);
  const prediction = getPrediction({ data, trend });

  // 🔁 Update zones from risk level
  useEffect(() => {
    setZones({
      A: level,
      B: level,
      C: level,
    });
  }, [level]);

  // 🚨 Alert ONLY on change (no spam)
  const prevZonesRef = useRef(zones);

  useEffect(() => {
    const prevZones = prevZonesRef.current;

    Object.entries(zones).forEach(([zone, risk]) => {
      if (prevZones[zone] !== risk) {
        if (risk === "danger") {
          addAlert(`🚨 Zone ${zone} entered DANGER`, "danger");
        } else if (risk === "warning") {
          addAlert(`⚠️ Zone ${zone} warning level`, "warning");
        }
      }
    });

    prevZonesRef.current = zones;
  }, [zones]);

  return (
    <div className="h-full grid grid-cols-12 gap-4 p-4 bg-[#121212] text-white">

      {/* TOP: SENSOR + PREDICTION PANEL */}
      <div className="col-span-12 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        
        <div className="text-sm text-gray-400">
          CH4: {data.methane.toFixed(2)}% | 
          O2: {data.oxygen.toFixed(2)}% | 
          Temp: {data.temperature.toFixed(1)}°C
        </div>

        <div className="text-lg text-orange-400 mt-2">
          Risk Score: {score} ({level.toUpperCase()})
        </div>

        <div className="text-yellow-400 text-sm mt-1">
          {prediction.message}
          {prediction.timeToDanger &&
            ` — danger in ${prediction.timeToDanger}s`}
        </div>

      </div>

      {/* LEFT: MAP */}
      <div className="col-span-8 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <MineMap zones={zones} />
      </div>

      {/* RIGHT: ALERTS */}
      <div className="col-span-4 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <h3 className="text-orange-400 mb-4">Alerts Feed</h3>
        <AlertsFeed externalAlerts={alerts} />
      </div>

    </div>
  );
}