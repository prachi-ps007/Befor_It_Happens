import { useAuth } from "../context/AuthContext";
export default function Navbar() {

  const { logout } = useAuth();

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
      <h1 className="text-xl font-semibold text-orange-400">
        Before It Happens
      </h1>
      <div className="text-sm text-gray-400">Predictive Safety System</div>
      <button onClick={logout} className="text-sm text-gray-400 hover:text-white">
        Logout
      </button>
    </div>
  );
}