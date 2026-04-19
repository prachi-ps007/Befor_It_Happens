export default function MineMap({ zones }) {
  // zones = { A: "safe", B: "warning", C: "danger" }

  const getColor = (risk) => {
    switch (risk) {
      case "safe":
        return "#22c55e"; // green
      case "warning":
        return "#facc15"; // yellow
      case "danger":
        return "#ef4444"; // red
      default:
        return "#444";
    }
  };

  return (
    <svg
      viewBox="0 0 300 200"
      className="w-full h-full"
    >
      {/* Zone A */}
      <rect
        x="10"
        y="10"
        width="130"
        height="80"
        rx="8"
        fill={getColor(zones.A)}
        className="transition-all duration-500"
      />
      <text x="20" y="40" fill="white" fontSize="12">
        Zone A
      </text>

      {/* Zone B */}
      <rect
        x="160"
        y="10"
        width="130"
        height="80"
        rx="8"
        fill={getColor(zones.B)}
        className="transition-all duration-500"
      />
      <text x="170" y="40" fill="white" fontSize="12">
        Zone B
      </text>

      {/* Zone C */}
      <rect
        x="85"
        y="110"
        width="130"
        height="80"
        rx="8"
        fill={getColor(zones.C)}
        className="transition-all duration-500"
      />
      <text x="95" y="140" fill="white" fontSize="12">
        Zone C
      </text>
    </svg>
  );
}