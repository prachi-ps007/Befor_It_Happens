import { useEffect, useState, useRef } from "react";

// helper: random step
const randomStep = (min, max) => Math.random() * (max - min) + min;

// helper: clamp values
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

export default function useSimulation() {
  const [data, setData] = useState({
    methane: 1.2,   // % CH4
    oxygen: 20.9,   // % O2
    temperature: 28 // °C
  });

  const [trend, setTrend] = useState({
    methane: "stable",
    oxygen: "stable",
    temperature: "stable"
  });

  const prevRef = useRef(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const next = {
          methane: clamp(prev.methane + randomStep(-0.2, 0.3), 0, 10),
          oxygen: clamp(prev.oxygen + randomStep(-0.3, 0.2), 15, 22),
          temperature: clamp(prev.temperature + randomStep(-0.5, 0.7), 10, 60)
        };

        // calculate trends
        const newTrend = {
          methane:
            next.methane > prev.methane
              ? "increasing"
              : next.methane < prev.methane
              ? "decreasing"
              : "stable",

          oxygen:
            next.oxygen > prev.oxygen
              ? "increasing"
              : next.oxygen < prev.oxygen
              ? "decreasing"
              : "stable",

          temperature:
            next.temperature > prev.temperature
              ? "increasing"
              : next.temperature < prev.temperature
              ? "decreasing"
              : "stable"
        };

        setTrend(newTrend);
        prevRef.current = next;

        return next;
      });
    }, 2500); // 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return { data, trend };
}