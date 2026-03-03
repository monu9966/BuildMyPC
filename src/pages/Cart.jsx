import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaShoppingCart, FaCheck, FaPlus, FaMinus } from "react-icons/fa";

export default function Cart() {
  const { cart, removeFromCart, clearCart, changeQty } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <h2>Please login first</h2>;

  // compute cost considering quantity
  const total = cart.reduce(
    (sum, b) => sum + (b.totalPrice || 0) * (b.qty || 1),
    0,
  );

  return (
    <div className="container">
      <h2>
        <FaShoppingCart style={{ marginRight: "10px" }} /> My Cart
      </h2>
      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((item, i) => (
        <div className="cart-card" key={item.id || i}>
          <h4>PC Build {i + 1}</h4>
          <p>Price: ₹{item.totalPrice}</p>

          <div className="qty-controls">
            <button onClick={() => changeQty(item.id, "dec")}> <FaMinus /> </button>
            <span>{item.qty || 1}</span>
            <button onClick={() => changeQty(item.id, "inc")}> <FaPlus /> </button>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            style={{ backgroundColor: "#e74c3c" }}
          >
            <FaTrash style={{ marginRight: "8px" }} /> Remove
          </button>
        </div>
      ))}

      <h3>Total Price: ₹{total}</h3>

      <button
        onClick={() => navigate("/checkout", { state: cart })}
        style={{ backgroundColor: "#27ae60" }}
      >
        <FaCheck style={{ marginRight: "8px" }} /> Buy All
      </button>

      <button onClick={clearCart} style={{ backgroundColor: "#95a5a6" }}>
        <FaTrash style={{ marginRight: "8px" }} /> Clear Cart
      </button>
    </div>
  );
}
