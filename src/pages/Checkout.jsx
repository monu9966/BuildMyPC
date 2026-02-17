import { useLocation } from "react-router-dom";
import { FaCreditCard, FaShoppingCart } from "react-icons/fa";
import { placeCOD } from "../services/orderApi";

export default function Checkout() {
  const { state } = useLocation();

  const handlePay = async () => {
    const res = await axios.post("/api/payment/create-order", {
      amount: totalPrice,
    });

    const options = {
      key: "YOUR_KEY",
      amount: res.data.amount,
      order_id: res.data.id,
      handler: function () {
        alert("Payment Success 🎉");
      },
    };

    new window.Razorpay(options).open();
  };

  const handleCOD = async () => {
    try {
      await placeCOD({
        components: buildData,
        totalPrice,
      });

      alert("Order placed with Cash on Delivery!");
    } catch {
      alert("Order failed");
    }
  };

  if (!state) return <h2>No build selected</h2>;

  return (
    <div className="container">
      <h2>
        <FaShoppingCart style={{ marginRight: "10px" }} /> Checkout
      </h2>
      <h3>Total Price: ₹{state.totalPrice}</h3>

      <button className="pay-btn" onClick={handlePay}>
        <FaCreditCard style={{ marginRight: "8px" }} /> Pay With Razerpay
      </button>

      <button className="buy-btn" onClick={handleCOD}>
        Cash on Delivery 🚚
      </button>
    </div>
  );
}
