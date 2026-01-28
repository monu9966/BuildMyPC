import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UsageCard from "../components/UsageCard";
import { useState } from "react";

function Home() {
  const [usage, setUsage] = useState(null);
  const navigate = useNavigate();

  const handleBuild = () => {
    if (!usage) {
      alert("Please select PC usage");
      return;
    }
    navigate("/builder", { state: { usage } });
  };

  return (
    <div className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to BuildMyPC 💻</h1>
        <p className="hero-subtitle">
          Customize your custom pc easily by selecting compatible components
          based on your budget and needs.
        </p></div>
        <div className="section">
        <h3>Selceted Usage: {usage || "Not selected"}</h3>

        <div className="usage-container">
          <UsageCard
            title="🎮 Gaming"
            description="High performance PC for gaming"
            selected={usage === "Gaming"}
            onClick={() => setUsage("Gaming")}
          />

          <UsageCard
            title="🏢 Office"
            description="Reliable PC for office & work"
            selected={usage === "Office"}
            onClick={() => setUsage("Office")}
          />

          <UsageCard
            title="🎓 Student"
            description="Affordable PC for study & learning"
            selected={usage === "Student"}
            onClick={() => setUsage("Student")}
          />
        </div>
        <button onClick={handleBuild} style={btnStyle}>
          Start Building
        </button>
        <Link></Link></div>
    </div>
  );
}

const btnStyle = {
  padding: "12px 25px",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Home;


