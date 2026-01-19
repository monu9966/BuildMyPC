import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2 className="logo">BuildMyPC</h2>
      <div className="nav-links">
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/builder" style={styles.link}>
          PC Builder
        </Link>
        <Link to="/summary" style={styles.link}>
          View Summary
        </Link>

        {user ? (
          <>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  link: {
    color: "#fff",
    marginLeft: "20px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
