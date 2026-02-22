import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");

    // only try when we have a jwt
    if (token) {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };
          const res = await axios.get("http://localhost:5000/api/orders/myorders", config);
          setOrders(res.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err.response || err);
        }
      };

      fetchOrders();
    }
  }, [user]);

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Please login to view your orders</h2>;

  return (
    <div className="container">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((o) => (
          <div className="order-card" key={o._id} style={orderCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>Order Total: ₹{o.totalPrice}</h4>
              <span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span>
            </div>

            {/* Simplified Build Details for your Object structure */}
            {o.build && (
              <div className="order-components">
                <h5>Components:</h5>
                <ul>
                  {Array.isArray(o.build)
                    ? o.build.map((buildItem, idx) => (
                        buildItem && (
                          <li key={idx}>
                            <strong>Build {idx + 1}:</strong> {buildItem.totalPrice || "details"}
                          </li>
                        )
                      ))
                    : Object.entries(o.build).map(([key, part]) => (
                        part && (
                          <li key={key}>
                            <strong>{key.toUpperCase()}:</strong> {part.name}
                          </li>
                        )
                      ))}
                </ul>
              </div>
            )}

            <div className="tracking-bar" style={trackingBarStyle}>
              <div className={`step ${o.status !== "Cancelled" ? "active" : ""}`}>Confirmed</div>
              <div className={`step ${["Shipped", "Delivered"].includes(o.status) ? "active" : ""}`}>Shipped</div>
              <div className={`step ${o.status === "Delivered" ? "active" : ""}`}>Out for Delivery</div>
              <div className={`step ${o.status === "Delivered" ? "active" : ""}`}>Delivered</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Simple inline styles for immediate testing
const orderCardStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "15px",
  backgroundColor: "#fff"
};

const trackingBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
  borderTop: "1px solid #eee",
  paddingTop: "10px"
};