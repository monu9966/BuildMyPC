import { Link } from "react-router-dom";
import { FaHome, FaTools, FaSignInAlt, FaReact, FaServer, FaDatabase } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left */}
        <div className="footer-section">
          <h3>BuildMyPC 💻</h3>
          <p>
            Smart PC customization platform to build compatible
            computers within your budget.
          </p>
        </div>

        {/* Middle */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/"><FaHome style={{ marginRight: "8px" }} /> Home</Link>
          <Link to="/builder"><FaTools style={{ marginRight: "8px" }} /> Builder</Link>
          <Link to="/login"><FaSignInAlt style={{ marginRight: "8px" }} /> Login</Link>
        </div>

        {/* Right */}
        <div className="footer-section">
          <h4>Tech Stack</h4>
          <p><FaReact style={{ marginRight: "8px" }} /> React + Vite</p>
          <p><FaServer style={{ marginRight: "8px" }} /> Node.js + Express</p>
          <p><FaDatabase style={{ marginRight: "8px" }} /> MongoDB Atlas</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} BuildMyPC | Developed by Monu Kumar
      </div>
    </footer>
  );
}

export default Footer;
   