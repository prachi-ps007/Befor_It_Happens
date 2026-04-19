
// src/pages/Personnel.jsx

import { useState } from "react";
import MinerDetailModal from "../components/MinerDetailModal";

/* 🧪 Dummy Data */
const minersData = [
  { id: 1, name: "Ravi Kumar", status: "safe", heartRate: 78, zone: "A" },
  { id: 2, name: "Arjun Singh", status: "warning", heartRate: 96, zone: "B" },
  { id: 3, name: "Vikram Patel", status: "danger", heartRate: 120, zone: "C" },
  { id: 4, name: "Manoj Das", status: "safe", heartRate: 72, zone: "A" },
  { id: 5, name: "Imran Khan", status: "warning", heartRate: 102, zone: "B" },
  { id: 11, name: "Rahul Mehta", status: "warning", heartRate: 101, zone: "B" }, 
  { id: 12, name: "Suresh Yadav", status: "safe", heartRate: 70, zone: "A" }, 
  { id: 13, name: "Amit Kulkarni", status: "danger", heartRate: 122, zone: "C" }, 
  { id: 14, name: "Pooja Nair", status: "warning", heartRate: 95, zone: "B" }, 
 
];


/* 🎨 Status Styles */
const getStatusStyle = (status) => {
  if (status === "safe")
    return "bg-green-500/20 text-green-400 border-green-500/30";
  if (status === "warning")
    return "bg-yellow-400/20 text-yellow-300 border-yellow-400/30";
  return "bg-red-500/20 text-red-400 border-red-500/30";
};

export default function Personnel() {
  const [selectedMiner, setSelectedMiner] = useState(null);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-6 text-orange-400 tracking-wide">
        Miner Directory
      </h1>

      {/* 🧱 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {minersData.map((miner) => (
          <div
            key={miner.id}
            onClick={() => setSelectedMiner(miner)}
            className="cursor-pointer bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 
                       hover:border-orange-400 hover:scale-[1.02] transition duration-200"
          >
            {/* Name */}
            <div className="text-lg font-semibold mb-2">
              {miner.name}
            </div>

            {/* Status */}
            <div
              className={`inline-block px-2 py-1 text-xs rounded border mb-3 ${getStatusStyle(
                miner.status
              )}`}
            >
              {miner.status.toUpperCase()}
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400 space-y-1">
              <div>❤️ Heart Rate: {miner.heartRate} bpm</div>
              <div>📍 Zone: {miner.zone}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 Modal */}
      {selectedMiner && (
        <MinerDetailModal
          miner={selectedMiner}
          onClose={() => setSelectedMiner(null)}
        />
      )}
    </div>
  );
}



