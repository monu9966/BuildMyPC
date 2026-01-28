import { Link } from "react-router-dom";
// import "./Footer.css";

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
          <Link to="/">Home</Link>
          <Link to="/builder">Builder</Link>
          <Link to="/login">Login</Link>
        </div>

        {/* Right */}
        <div className="footer-section">
          <h4>Tech Stack</h4>
          <p>React + Vite</p>
          <p>Node.js + Express</p>
          <p>MongoDB Atlas</p>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} BuildMyPC | Developed by Monu Kumar
      </div>
    </footer>
  );
}

export default Footer;
   