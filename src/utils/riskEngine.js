// Normalize helper (0 → 1 scale)
const normalize = (value, min, max) => {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

// 🔥 1. Risk Score (0–100)
export function calculateRiskScore({ methane, oxygen, temperature }) {
  // Normalize each factor
  const ch4 = normalize(methane, 0, 10);       // higher = worse
  const o2 = normalize(21 - oxygen, 0, 6);     // lower oxygen = worse
  const temp = normalize(temperature, 20, 60); // higher = worse

  // Weighted formula
  const score =
    ch4 * 0.5 +   // methane is most dangerous
    o2 * 0.3 +    // oxygen next
    temp * 0.2;   // temperature

  return Math.round(score * 100);
}

// 🔥 2. Risk Level
export function getRiskLevel(score) {
  if (score >= 70) return "danger";
  if (score >= 40) return "warning";
  return "safe";
}

// 🔥 3. Prediction Logic
export function getPrediction({ data, trend }) {
  let message = "Stable conditions";
  let timeToDanger = null;

  // Methane rising → biggest signal
  if (trend.methane === "increasing" && data.methane > 3) {
    message = "Methane rising — risk increasing";
    timeToDanger = estimateTime(data.methane, 5, 0.3);
  }

  // Oxygen dropping
  if (trend.oxygen === "decreasing" && data.oxygen < 19.5) {
    message = "Oxygen dropping — unsafe levels approaching";
    timeToDanger = estimateTime(data.oxygen, 18, -0.2);
  }

  // Temperature spike
  if (trend.temperature === "increasing" && data.temperature > 40) {
    message = "Temperature rising — heat risk building";
    timeToDanger = estimateTime(data.temperature, 55, 0.5);
  }

  return {
    message,
    timeToDanger,
  };
}

// 🔥 4. Time Estimation (simple linear projection)
function estimateTime(current, dangerThreshold, ratePerTick) {
  if (ratePerTick === 0) return null;

  const ticks = (dangerThreshold - current) / ratePerTick;

  if (ticks <= 0) return 0;

  // each tick ≈ 2.5 seconds (from your simulation)
  return Math.round(ticks * 2.5);
}