import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    const success = login(email, password);

    if (!success) {
      alert("Invalid credentials");
      return;
    }

    navigate("/");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>User Login</h2>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleLogin} style={btnStyle}>
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
};

const btnStyle = {
  padding: "10px",
  width: "100%",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
};

export default Login;
