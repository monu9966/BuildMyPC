import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import defaultAvatar from "../assets/default-avatar.png";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API } from "../services/api";
import {
  FaHome,
  FaTools,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaShieldAlt,
} from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const navRef = useRef(null); 
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

useEffect(() => {
  function handleClickOutside(event) {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setMenuOpen(false);
      setDropOpen(false);   
    }
  }

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
  // helper to convert server-relative avatar path into full URL
  const avatarUrl = (path) => {
    if (!path) return "/default.png";
    if (path.startsWith("http")) return path;
    // remove trailing "/api" from baseURL
    const base = API.defaults.baseURL.replace(/\/api$/, "");
    return `${base}${path}`;
  };
  return (
    <nav className="navbar" ref={navRef}>
      {/* Logo */}
      <Link to="/" className="logo-box" onClick={closeMenu}>
        <img src={logo} alt="BuildMyPC Logo" className="logo-img" />
        <span className="logo-text">BuildMyPC</span>
      </Link>

      {/* Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      {/* Links */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <NavItem to="/" icon={<FaHome />} text="Home" onClick={closeMenu} />
        <NavItem
          to="/builder"
          icon={<FaTools />}
          text="PC Builder"
          onClick={closeMenu}
        />

        {user && (
          <>
            <NavItem
              to="/cart"
              icon={<FaShoppingCart />}
              text="My Cart"
              onClick={closeMenu}
            />

            {user.role === "admin" && (
              <NavItem
                to="/admin"
                icon={<FaShieldAlt />}
                text="Admin"
                onClick={closeMenu}
              />
            )}
          </>
        )}

        {user ? (
          <div className="user-dropdown">
            <div
              className="user-btn"
              onClick={(e) => {
                e.stopPropagation();
                setDropOpen((o) => !o);
              }}
            >
              <span className="user-name">Hi, {user.name} 👋</span>
              <img
                src={avatarUrl(user.avatar)}
                className="nav-avatar"
                alt="avatar"
              />
            </div>

            {dropOpen && (
              <div className="dropdown-menu">
                <NavItem
                  to="/profile"
                  text="👤Profile"
                  onClick={() => {
                    closeMenu();
                    setDropOpen(false);
                  }}
                />
                <NavItem
                  to="/orders"
                  icon={<FaClipboardList />}
                  text="Orders"
                  onClick={() => {
                    closeMenu();
                    setDropOpen(false);
                  }}
                />
                <NavItem
                  to="/my-builds"
                  icon={<FaTools />}
                  text="My Builds"
                  onClick={() => {
                    closeMenu();
                    setDropOpen(false);
                  }}
                />

                <button
                  onClick={() => {
                    handleLogout();
                    setDropOpen(false);
                  }}
                  className="logout-btn"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
<div className="auth-buttons">
  <Link to="/login" className="login-btn" onClick={closeMenu}>
    <FaSignInAlt /> Login
  </Link>

  <Link to="/register" className="signup-btn" onClick={closeMenu}>
    <FaUserPlus /> Sign Up
  </Link>
</div>
        )}
      </div>
    </nav>
  );
}

/* Reusable Link Component */
function NavItem({ to, icon, text, onClick }) {
  return (
    <Link to={to} className="nav-item" onClick={onClick}>
      {icon}
      <span>{text}</span>
    </Link>
  );
}
