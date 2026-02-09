import { useEffect, useState } from "react";
import { getMyBuilds } from "../services/buildApi";

function MyBuilds() {
  const [builds, setBuilds] = useState([]);

  useEffect(() => {
    getMyBuilds().then(res => setBuilds(res.data));
  }, []);

  return (
    <div>
      <h2>My Saved Builds</h2>
      <h3>Save my pc </h3>

      {builds.map((b) => (
        <div key={b._id} className="builder-card">
          <p>Total: ₹{b.totalPrice}</p>
          <p>Date: {new Date(b.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default MyBuilds;
