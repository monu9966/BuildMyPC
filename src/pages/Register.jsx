import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

function Register() {
    const [email, setEmail] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();
    const { register } = useAuth();
    
    const handleRegister = async () => {
        if (!email || !password) {
            alert("All fields required");
            return;
        }

        try {
            await registerUser({ email, password });

            alert("Registration successful. Please login.");
            navigate("/login");    
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Registration failed";
            alert(errorMsg);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Create Account</h2>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                <button onClick={handleRegister} style={btnStyle}>Register</button>
                <p style={{ marginTop: "10px"}}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
};

const btnStyle = {
    width: "100%",
    padding: "10px",
    backgroundColor: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
};

export default Register;