
// src/pages/Logs.jsx

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* 🎯 Generate fake 24h data */
const generateData = (type) => {
  const data = [];
  let base = type === "Methane" ? 2 : type === "CO" ? 10 : 50;

  for (let i = 0; i < 24; i++) {
    base += Math.random() * 4 - 2; // fluctuation
    data.push({
      time: `${i}:00`,
      value: Math.max(0, base.toFixed(2)),
    });
  }
  return data;
};

export default function Logs() {
  const [sensor, setSensor] = useState("Methane");
  const [data, setData] = useState(generateData("Methane"));
  const [report, setReport] = useState(null);

  /* 🔁 regenerate when sensor changes */
  useEffect(() => {
    setData(generateData(sensor));
    setReport(null);
  }, [sensor]);

  /* 📊 report generator */
  const generateReport = () => {
    const values = data.map((d) => Number(d.value));
    const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    const max = Math.max(...values);
    const min = Math.min(...values);

    setReport({
      avg,
      max,
      min,
    });
  };

  const getColor = () => {
    if (sensor === "Methane") return "#f87171";
    if (sensor === "CO") return "#facc15";
    return "#60a5fa";
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl text-orange-400 mb-6">
        Environmental Logs
      </h1>

      {/* 🔽 Controls */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={sensor}
          onChange={(e) => setSensor(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-700 px-3 py-2 rounded"
        >
          <option>Methane</option>
          <option>CO</option>
          <option>Humidity</option>
        </select>

        <button
          onClick={generateReport}
          className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
        >
          Generate Report
        </button>
      </div>

      {/* 📈 Chart */}
      <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-800 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid stroke="#333" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={getColor()}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📄 Report */}
      {report && (
        <div className="bg-[#111] border border-gray-800 p-4 rounded-xl">
          <h2 className="text-lg text-yellow-400 mb-2">
            Summary Report
          </h2>
          <p>Sensor: {sensor}</p>
          <p>Average: {report.avg}</p>
          <p>Max: {report.max}</p>
          <p>Min: {report.min}</p>
        </div>
      )}
    </div>
  );
}

