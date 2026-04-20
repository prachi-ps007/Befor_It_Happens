import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/simulator");
  } catch (error) {
    console.error(error.code);

    if (error.code === "auth/user-not-found") {
      alert("No account found. Please sign up.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password.");
    } else {
      alert("Login failed.");
    }
  }
};

  return (
  <div className="flex h-screen items-center justify-center bg-[#121212] text-white">
    
    <form
      onSubmit={handleLogin}
      className="w-full max-w-sm space-y-5 bg-[#1a1a1a] p-8 rounded-2xl shadow-lg border border-gray-800"
    >
      
      <h1 className="text-2xl font-semibold text-orange-400">
        Before It Happens
      </h1>

      <p className="text-sm text-gray-400">
        Predictive Safety System
      </p>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 rounded-lg bg-[#222] border border-gray-700 focus:outline-none focus:border-orange-400"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 rounded-lg bg-[#222] border border-gray-700 focus:outline-none focus:border-yellow-400"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition font-medium text-black"
      >
        Login
      </button>

      <p className="text-sm text-gray-400 text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-yellow-400 hover:underline">
          Sign up
        </Link>
      </p>

    </form>
  </div>
);
}