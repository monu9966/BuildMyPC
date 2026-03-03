import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewBuild() {
  const { id } = useParams();
  const [build, setBuild] = useState(null);

  useEffect(() => {
    axios.get(`/api/builds/public/${id}`)
      .then(res => setBuild(res.data))
      .catch(() => alert("Build not found"));
  }, [id]);

  if (!build) return <h2>Loading...</h2>;

  return (
    <div className="summary-page">
      <h2>Shared PC Build</h2>

      <div className="summary-grid">
        <div className="summary-left">
          {build.components && build.components.length > 0 ? (
            build.components.map((item, idx) => (
              <div key={idx} className="summary-card">
                <img
                  src={item.image || "/default-avatar.png"}
                  alt={item.name}
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div>
                  <b>{item.typeName || `Component ${idx + 1}`}</b>
                  <p>{item.name}</p>
                </div>
                <span>₹{item.price}</span>
              </div>
            ))
          ) : (
            <p>No components available</p>
          )}
        </div>
      </div>

      <h3>Total ₹{build.totalPrice}</h3>
    </div>
  );
}