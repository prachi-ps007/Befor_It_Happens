import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard" },
  { path: "/simulator", label: "Simulator" },
  { path: "/personnel", label: "Personnel" },
  { path: "/logs", label: "Logs" },
  { path: "/protocols", label: "Protocols" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#1a1a1a] border-r border-gray-800 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-orange-500 text-black"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}