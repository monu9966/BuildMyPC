import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminOrders() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const currentAllOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.max(1, Math.ceil(allOrders.length / ordersPerPage));

  // ensure currentPage stays valid if orders length changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

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
      // Refresh list after update
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
    <div className="container">
      <h2>Admin Dashboard: All Orders</h2>
      <table className="admin-table" style={tableStyle}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentAllOrders.map((order) => (
            <tr key={order._id}>
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

      {/* Pagination Buttons */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          ⬅ Prev
        </button>

        {/* numbered pages */}
        {totalPages > 1 && (
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={num === currentPage ? "active" : ""}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
        )}

        <span>
          Page {currentPage} of {totalPages} {allOrders.length === 0 && "(no orders)"}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "20px",
};
