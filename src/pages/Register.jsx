import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { FaUserPlus, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // ⭐ VERY IMPORTANT

    if (!name || !email || !password) {
      alert("All fields required");
      return;
    }

    try {
      await registerUser({ name, email, password });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2><FaUserPlus style={{ marginRight: "8px" }} /> Create Account</h2>

        <div style={{ position: "relative" }}>
          <FaUser style={{ position: "absolute", left: "10px", top: "15px", color: "#666" }} />
          <input
            className="auth-input"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <FaEnvelope style={{ position: "absolute", left: "10px", top: "15px", color: "#666" }} />
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
        </div>

        <div style={{ position: "relative" }}>
          <FaLock style={{ position: "absolute", left: "10px", top: "15px", color: "#666" }} />
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingLeft: "40px" }}
          />
        </div>

        {/* ⭐ IMPORTANT */}
        <button className="auth-btn" type="submit">
          <FaUserPlus style={{ marginRight: "8px" }} /> Register
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
