import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminOrders() {
  const { user } = useAuth();

  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const totalPages = Math.ceil(allOrders.length / ordersPerPage);

  const paginatedOrders = allOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  useEffect(() => {
    const token = user?.token || localStorage.getItem("token");
    const fetchAdminOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          "http://localhost:5000/api/orders/admin/all",
          config,
        );

        setAllOrders(res.data);
        setCurrentPage(1); // reset pagination when new data arrives
      } catch (err) {
        console.error("Admin fetch failed:", err.response || err);
      }
    };

    if (token) fetchAdminOrders();
  }, [user]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.put(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status: newStatus },
        config,
      );

      setAllOrders(
        allOrders.map((o) =>
          o._id === orderId ? { ...o, status: res.data.status } : o,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err.response || err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-container">
      <h2>📦 All Orders</h2>
      <table className="admin-table" style={tableStyle}>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order) => (
            <tr key={order._id}>
              <td>{allOrders.indexOf(order) + 1 + (currentPage - 1) * ordersPerPage}</td>
              <td>{order._id}</td>
              <td>{order.address?.name || order.userId?.name || "Guest"}</td>
              <td>₹{order.totalPrice}</td>
              <td>
                <span className={`status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <select
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  value={order.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};
