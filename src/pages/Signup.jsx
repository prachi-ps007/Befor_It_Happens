import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <form onSubmit={handleSignup} className="space-y-4 bg-gray-900 p-6 rounded-lg">
        
        <h2 className="text-xl font-bold text-orange-400">Sign Up</h2>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-2 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-2 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-orange-500 p-2 rounded">
          Sign Up
        </button>

        <p className="text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-yellow-400">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}