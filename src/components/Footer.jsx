import { Link } from "react-router-dom";
import {
  FaHome,
  FaTools,
  FaSignInAlt,
  FaReact,
  FaServer,
  FaDatabase,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* About */}
        <div className="footer-section">
          <h2>BuildMyPC 💻</h2>
          <p>
            Smart PC customization platform to build compatible
            computers within your budget.
          </p>

          <div className="socials">
            <a href="#"><FaGithub /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaEnvelope /></a>
          </div>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/"><FaHome /> Home</Link>
          <Link to="/builder"><FaTools /> Builder</Link>
          <Link to="/login"><FaSignInAlt /> Login</Link>
        </div>

        {/* Tech Stack */}
        <div className="footer-section">
          <h3>Tech Stack</h3>
          <p><FaReact /> React + Vite</p>
          <p><FaServer /> Node.js + Express</p>
          <p><FaDatabase /> MongoDB Atlas</p>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: monukumar.dev@gmail.com</p>
          <p>Mumbai, India 🇮🇳</p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} BuildMyPC | Developed by Monu Kumar
      </div>
    </footer>
  );
}