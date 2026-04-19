import MineMap from "../components/MINEMAP";
import AlertsFeed from "../components/AlertsFeed";
export default function Dashboard() {
  const zones = {
  A: "safe",
  B: "warning",
  C: "danger",
};
  return (
    <div className="h-full bg-[#121212] text-white p-6 grid grid-cols-12 grid-rows-6 gap-4">

      {/* HEADER */}
      <div className="col-span-12 row-span-1 flex justify-between items-center bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        
        {/* System Status */}
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-lg font-semibold text-green-400">
            SYSTEM STATUS: SAFE
          </span>
        </div>

        {/* Time (visual handled above) */}
        <div className="text-gray-400 text-sm">
          Local System Time
        </div>

      </div>

      {/* METRIC TILES */}
      <div className="col-span-3 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <p className="text-gray-400 text-sm">Total Personnel</p>
        <h2 className="text-2xl font-bold text-orange-400">128</h2>
      </div>

      <div className="col-span-3 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <p className="text-gray-400 text-sm">Active Alerts</p>
        <h2 className="text-2xl font-bold text-yellow-400">3</h2>
      </div>

      <div className="col-span-3 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <p className="text-gray-400 text-sm">Avg Air Quality</p>
        <h2 className="text-2xl font-bold text-green-400">Good</h2>
      </div>

      <div className="col-span-3 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
        <p className="text-gray-400 text-sm">System Load</p>
        <h2 className="text-2xl font-bold text-orange-400">72%</h2>
      </div>

      {/* MAIN MAP AREA */}
      <div className="col-span-9 row-span-4 bg-[#1a1a1a] rounded-xl border border-gray-800 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
         <MineMap zones={zones} />
        </p>
      </div>

      {/* RIGHT SIDEBAR - ALERT FEED */}
      <div className="col-span-3 row-span-4 bg-[#1a1a1a] rounded-xl border border-gray-800 p-4 flex flex-col">
  
          <h3 className="text-lg font-semibold text-orange-400 mb-4">
            Alerts Feed
          </h3>

          <AlertsFeed />

        </div>

    </div>
  );
}