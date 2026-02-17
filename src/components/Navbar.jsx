import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaTools, FaShoppingCart, FaClipboardList, FaSignOutAlt, FaUserPlus, FaSignInAlt, FaBars, FaTimes, FaShieldAlt } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Helper function to close menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <h2 className="logo">BuildMyPC</h2>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Nav links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)} style={styles.link}>
          <FaHome style={{ marginRight: "8px" }} /> Home
        </Link>
        <Link
          to="/builder"
          onClick={() => setMenuOpen(false)}
          style={styles.link}
        >
          <FaTools style={{ marginRight: "8px" }} /> PC Builder
        </Link>

        {user && (
          <>
            <Link
              to="/summary"
              onClick={() => setMenuOpen(false)}
              style={styles.link}
            >
              <FaClipboardList style={{ marginRight: "8px" }} /> View Summary
            </Link>

            <Link to="/cart" style={styles.link}>
              <FaShoppingCart style={{ marginRight: "8px" }} /> Cart
            </Link>

            <Link to="/my-builds" onClick={() => setMenuOpen(false)}>
              <FaTools style={{ marginRight: "8px" }} /> MyBuild
            </Link>

            {/* ⭐ ADMIN BUTTON */}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={closeMenu} style={styles.link}>
                <FaShieldAlt style={{ marginRight: "8px" }} /> Admin
              </Link>
            )}
          </>
        )}

        {user ? (
          <>
            <span className="nav-user">Hi, {user.name} 👋</span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt style={{ marginRight: "8px" }} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              style={styles.signupBtn}
            >
              <FaUserPlus style={{ marginRight: "8px" }} /> Sign Up
            </Link>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={styles.link}
            >
              <FaSignInAlt style={{ marginRight: "8px" }} /> Login
            </Link>
          </>
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
  authGroup: {
    display: "inline-flex",
    alignItems: "center",
  },
  signupBtn: {
    // backgroundColor: "#07e37c", // Green color to match your "View Summary" button
    color: "white",
    // padding: "8px 16px",
    borderRadius: "5px",
    marginLeft: "20px",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Navbar;
