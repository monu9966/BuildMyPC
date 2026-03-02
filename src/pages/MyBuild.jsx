import { useEffect, useState } from "react";
import { getMyBuilds } from "../services/endpoints";
import { FaSave, FaClock } from "react-icons/fa";

function MyBuilds() {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    getMyBuilds().then(res => setBuilds(res.data));
  }, []);

  return (
    <div>
      <h2><FaSave style={{ marginRight: "8px" }} /> My Saved Builds</h2>
      <h3>Saved PC Builds </h3>

      {builds.map((b) => (
        <div key={b._id} className="builder-card">
          <p><strong>Total:</strong> ₹{b.totalPrice}</p>
          <p><FaClock style={{ marginRight: "8px" }} /> Date: {new Date(b.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default MyBuilds;
