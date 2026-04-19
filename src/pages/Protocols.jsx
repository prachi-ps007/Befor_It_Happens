
// src/pages/Protocols.jsx

import { useState } from "react";

/* 📘 Protocol Data */
const protocolsData = [
  {
    id: 1,
    name: "Fire",
    steps: [
      "Activate fire alarm",
      "Shut down machinery",
      "Use fire extinguishers",
      "Evacuate immediately",
      "Report to assembly point",
    ],
  },
  {
    id: 2,
    name: "Gas Leak",
    steps: [
      "Wear oxygen mask",
      "Shut off gas valves",
      "Increase ventilation",
      "Evacuate affected zones",
      "Notify control room",
    ],
  },
  {
    id: 3,
    name: "Flood",
    steps: [
      "Stop electrical supply",
      "Move to higher ground",
      "Seal entry points",
      "Activate water pumps",
      "Alert rescue team",
    ],
  },
];

export default function Protocols() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState({});

  /* 🔍 Filter */
  const filtered = protocolsData.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ✅ Toggle step */
  const toggleStep = (index) => {
    setCompleted((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl text-orange-400 mb-6">
        Emergency Protocols
      </h1>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search protocols..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded"
      />

      {/* 📋 List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => {
              setSelected(p);
              setCompleted({});
            }}
            className="cursor-pointer bg-[#1a1a1a] border border-gray-800 p-4 rounded hover:border-orange-400"
          >
            <h2 className="text-lg">{p.name}</h2>
          </div>
        ))}
      </div>

      {/* 📑 Checklist */}
      {selected && (
        <div className="mt-8 bg-[#111] border border-gray-800 p-5 rounded-xl">
          <h2 className="text-xl text-yellow-400 mb-4">
            {selected.name} Protocol
          </h2>

          <div className="space-y-3">
            {selected.steps.map((step, i) => (
              <label
                key={i}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!completed[i]}
                  onChange={() => toggleStep(i)}
                />
                <span
                  className={`${
                    completed[i] ? "line-through text-gray-500" : ""
                  }`}
                >
                  {step}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

