import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <h2 className="admin-logo"><FaShieldAlt style={{ marginRight: "8px" }} /> BuildMyPC Admin</h2>
      </div>

      <div className="admin-navbar-right">
        <div className="admin-navbar-user">
          <span className="admin-user-name">{user?.name}</span>
          <span className="admin-user-role">Admin</span>
        </div>

        <button
          onClick={handleBackToDashboard}
          className="admin-nav-btn back-btn"
          title="Back to home"
        >
          <FaHome style={{ marginRight: "8px" }} /> Home
        </button>

        <button onClick={handleLogout} className="admin-nav-btn logout-btn">
          <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
        </button>
      </div>
    </nav>
  );
}
