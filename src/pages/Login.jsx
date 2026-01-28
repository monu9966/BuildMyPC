import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      const token = res.data?.token || res.token;
      const userData = res.data?.user || res.user;

      if (token) {
        localStorage.setItem("token", token);
        login(userData, token);
        navigate("/");
      }
    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>User Login</h2>

        <input
          className="auth-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <span
          className="eye-btn"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁"}
        </span>

        <button className="auth-btn" type="submit">
          Login
        </button>

        <p className="auth-link">
          New user? <Link to="/register">Create account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
