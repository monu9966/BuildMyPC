import { useEffect, useState } from "react";
import { getCart } from "../services/cartApi";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTrash, FaShoppingCart, FaCheck } from "react-icons/fa";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [builds, setBuilds] = useState([]);
  const navigate = useNavigate();

  if (!user) return <h2>Please login first</h2>;

  const total = cart.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  useEffect(() => {
    getCart(user._id).then((res) => {
      setBuilds(res.data?.items || []);
    });
  }, []);

  return (
    <div className="container">
      <h2>
        <FaShoppingCart style={{ marginRight: "10px" }} /> My Cart
      </h2>
      {cart.length === 0 && <p>No items in cart</p>}

      {cart.map((item, i) => (
        <div className="cart-card" key={i}>
          <h4>PC Build {i + 1}</h4>
          <p>Total: ₹{item.totalPrice}</p>

          <button
            onClick={() => removeFromCart(i)}
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
