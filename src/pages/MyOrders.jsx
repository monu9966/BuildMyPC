import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import { FaCheckCircle, FaBox, FaTruck, FaHome } from "react-icons/fa";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");

    if (token) {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          const res = await axios.get(
            "http://localhost:5000/api/orders/myorders",
            config,
          );

          setOrders(res.data);
        } catch (err) {
          console.error("Failed to fetch orders:", err);
        }
      };

      fetchOrders();
    }
  }, [user]);

  const toggleOrderDetails = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("BuildMyPC Invoice", 14, 20);

    doc.setFontSize(12);

    doc.text(`Order ID: ${order._id}`, 14, 35);
    doc.text(
      `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      14,
      45,
    );
    doc.text(`Status: ${order.status}`, 14, 55);

    autoTable(doc, {
      startY: 65,
      head: [["Component", "Name", "Price"]],
      body: Array.isArray(order.build)
        ? order.build.map((b, i) => [
            `Build ${i + 1}`,
            "Custom PC Build",
            `₹${b.totalPrice}`,
          ])
        : Object.entries(order.build || {}).map(([key, part]) => [
            key.toUpperCase(),
            part?.name || "",
            `₹${part?.price || 0}`,
          ]),
    });

    doc.text(
      `Total Price: ₹${order.totalPrice}`,
      14,
      doc.lastAutoTable.finalY + 10,
    );

    doc.save(`Invoice_${order._id}.pdf`);
  };

  if (!user)
    return <h2 className="orders-login">Please login to view your orders</h2>;

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="orders-empty">You have no orders yet.</p>
      ) : (
        orders.map((o) => (
          <div
            key={o._id}
            className="order-card"
            onClick={() => toggleOrderDetails(o._id)}
          >
            {/* HEADER */}
            <div className="order-header">
              <div className="order-id-row">
                <p className="order-id">
                  Order ID: <strong>#{o._id.slice(-8).toUpperCase()}</strong>
                </p>

                <button
                  className="copy-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(o._id);
                    alert("Order ID copied!");
                  }}
                >
                  Copy
                </button>
              </div>

              <h4>Order Total: ₹{o.totalPrice}</h4>

              <span className={`status ${o.status?.toLowerCase()}`}>
                {o.status}
              </span>
            </div>

            {/* ORDER DETAILS */}
            {openOrderId === o._id && o.build && (
              <div className="order-details">
                <div className="order-details-row">
                  <span className="order-icon">📅</span>
                  Ordered on:{" "}
                  <strong>
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </strong>
                </div>
                <div className="order-details-row">
                  <span className="order-icon">🚚</span>
                  Estimated Delivery: <strong>{o.estimatedDelivery}</strong>
                </div>
                <button
                  className="invoice-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadInvoice(o);
                  }}
                >
                  <FaFilePdf /> Download Invoice
                </button>

                <h5 className="order-comp-name">Components</h5>
                <ul>
                  {Array.isArray(o.build)
                    ? o.build.map((b, i) => (
                        <li key={i}>
                          <strong>Build {i + 1}</strong> - ₹{b.totalPrice}
                        </li>
                      ))
                    : Object.entries(o.build).map(
                        ([key, part]) =>
                          part && (
                            <li key={key}>
                              <strong>{key.toUpperCase()}</strong> : {part.name}
                            </li>
                          ),
                      )}
                </ul>
              </div>
            )}

            {/* TRACKING */}
            <div className="tracker">
              <div
                className="progress-line"
                style={{
                  width:
                    o.status === "Confirmed"
                      ? "25%"
                      : o.status === "Shipped"
                        ? "50%"
                        : o.status === "Out for Delivery"
                          ? "75%"
                          : o.status === "Delivered"
                            ? "100%"
                            : "25%",
                }}
              ></div>
              <div
                className={`tracker-step ${["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"].includes(o.status) ? "active" : ""}`}
              >
                <FaCheckCircle className="tracker-icon" />
                <p>Confirmed</p>
              </div>

              <div
                className={`tracker-step ${["Shipped", "Out for Delivery", "Delivered"].includes(o.status) ? "active" : ""}`}
              >
                <FaBox className="tracker-icon" />
                <p>Shipped</p>
              </div>

              <div
                className={`tracker-step ${["Out for Delivery", "Delivered"].includes(o.status) ? "active" : ""}`}
              >
                <FaTruck className="tracker-icon" />
                <p>Out for Delivery</p>
              </div>

              <div
                className={`tracker-step ${o.status === "Delivered" ? "active" : ""}`}
              >
                <FaHome className="tracker-icon" />
                <p>Delivered</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
