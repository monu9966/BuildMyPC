import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if(!token) return <Navigate to="/login" />;

}

export default ProtectedRoute;