import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";

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
        <h2>Create Account</h2>

        <input
          className="auth-input"
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ⭐ IMPORTANT */}
        <button className="auth-btn" type="submit">
          Register
        </button>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
