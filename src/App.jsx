import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Simulator from "./pages/Simulator";
import Personnel from "./pages/Personnel";
import Logs from "./pages/Logs";
import Protocols from "./pages/Protocols";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import "./index.css";


export default function App() {
  function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? <Navigate to="/dashboard" /> : <Login />;
}
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
              <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
        <Route path="/simulator" element={
          <ProtectedRoute>
            <Layout><Simulator /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/personnel" element={
          <ProtectedRoute>
            <Layout><Personnel /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/logs" element={
          <ProtectedRoute>
            <Layout><Logs /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/protocols" element={
          <ProtectedRoute>
            <Layout><Protocols /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}