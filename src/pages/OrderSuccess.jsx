import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const deliveryDate = location.state?.deliveryDate;

  return (
    <div className="success-page">
      <div className="success-card">
        <FaCheckCircle className="success-icon" />

        <h2>Order Placed Successfully 🎉</h2>

        <p>
          Thank you for shopping with <strong>BuildMyPC</strong>. Your order has
          been received and is being processed.
        </p>

        <div className="delivery-info">
          🚚 Estimated Delivery:
          <strong>{deliveryDate}</strong>
        </div>

        <div className="success-buttons">
          <button
            className="view-order-btn"
            onClick={() => navigate("/orders")}
          >
            View My Orders
          </button>

          <button className="shop-btn" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
