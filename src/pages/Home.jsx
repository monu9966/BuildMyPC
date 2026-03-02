import { useNavigate } from "react-router-dom";
import UsageCard from "../components/UsageCard";
import { useState } from "react";
import { FaGamepad, FaBriefcase, FaUserGraduate, FaPlay } from "react-icons/fa";

export default function Home() {
  const [usage, setUsage] = useState(null);
  const navigate = useNavigate();

  const handleBuild = () => {
    if (!usage) return alert("Please select PC usage");
    navigate("/builder", { state: { usage } });
  };

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Build Your Dream PC 💻</h1>
          <p>Select compatible components within your budget</p>
          <button onClick={handleBuild} navigate="/builder" className="cta-btn">
            <FaPlay /> Start Building
          </button>
        </div>
      </section>

      {/* USAGE */}
      <section className="usage-section">
        <h2>Select PC Usage</h2>
        <p className="selected">
          Selected: <b>{usage || "Not selected"}</b>
        </p>

        <div className="usage-grid">
          <UsageCard
            title="Gaming"
            icon={<FaGamepad />}
            description="High performance gaming PC"
            selected={usage === "Gaming"}
            onClick={() => setUsage("Gaming")}
          />

          <UsageCard
            title="Office"
            icon={<FaBriefcase />}
            description="Reliable office PC"
            selected={usage === "Office"}
            onClick={() => setUsage("Office")}
          />

          <UsageCard
            title="Student"
            icon={<FaUserGraduate />}
            description="Affordable learning PC"
            selected={usage === "Student"}
            onClick={() => setUsage("Student")}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why BuildMyPC?</h2>
        <div className="feature-grid">
          <div>✔ Compatibility Check</div>
          <div>✔ Budget Optimization</div>
          <div>✔ Save & Share Builds</div>
          <div>✔ Admin Component Control</div>
        </div>
      </section>

    </div>
  );
}