import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const [ menuOpen, setMenuOpen] = useState(false);

  // Helper function to close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <h2 className="logo">BuildMyPC</h2>

      {/* Hamburger icon */}
      <div
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>
      
      {/* Nav links */}      
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)} style={styles.link}>
          Home
        </Link>
        <Link to="/builder" onClick={() => setMenuOpen(false)} style={styles.link}>PC Builder</Link>

        {user && (
          <>
          <Link to="/summary" onClick={() => setMenuOpen(false)} style={styles.link}>View Summary</Link>
          </>
        )}

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
