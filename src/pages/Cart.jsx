import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { API } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useBuild } from "../context/BuildContext";
import { FaShoppingCart, FaCreditCard, FaTrash } from "react-icons/fa";
import { getDeliveryRange } from "../utils/deliveryDate";

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedParts } = useBuild();
  const [types, setTypes] = useState([]);
  const { cart, addToCart, changeQty, clearCart, updateCartItem, removeFromCart } =
    useCart();
  // removed unused state for cart removal animation
  const [removingId, setRemovingId] = useState(null);
  // useBuild provides setSelectedParts, rename for clarity
  const { setSelectedParts: setBuild } = useBuild();

  // use first build in cart if present, otherwise fall back to current selection
  const cartBuild = cart && cart.length > 0 ? cart[0] : null;
  const parts = cartBuild
    ? cartBuild.components || {}
    : selectedParts && selectedParts.selectedParts
      ? selectedParts.selectedParts
      : selectedParts || {};

  useEffect(() => {
    axios
      .get("/api/component-types")
      .then((res) => setTypes(res.data || []))
      .catch(() => alert("Error loading types"));
  }, []);

  /* ===== Total Price ===== */
  const cartTotal = cart.reduce((sum, item) => {
    if (item.components) {
      return sum + (item.totalPrice || 0);
    }
    return sum + (item.price || 0) * (item.qty || 1);
  }, 0);

  const handleRemoveSingle = (id) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const changeBuildQty = (cartItemId, typeName, action) => {
    const cartItem = cart.find(c => c.id === cartItemId);
    if (!cartItem || !cartItem.components) return;

    const updatedComponents = { ...cartItem.components };
    const currentItem = updatedComponents[typeName];
    if (!currentItem) return;

    const currentQty = currentItem.qty || 1;
    currentItem.qty = action === "inc" ? currentQty + 1 : Math.max(1, currentQty - 1);

    const newTotalPrice = Object.values(updatedComponents).reduce(
      (sum, c) => sum + (c?.price || 0) * (c?.qty || 1),
      0
    );

    updateCartItem(cartItemId, {
      components: updatedComponents,
      totalPrice: newTotalPrice
    });
  };

  const handleRemoveBuildItem = (cartItemId, typeName) => {
    setRemovingId(`${cartItemId}-${typeName}`);
    setTimeout(() => {
      const cartItem = cart.find(c => c.id === cartItemId);
      if (!cartItem || !cartItem.components) return;

      const updatedComponents = { ...cartItem.components };
      delete updatedComponents[typeName];

      if (Object.keys(updatedComponents).length === 0) {
        removeFromCart(cartItemId);
      } else {
        const newTotalPrice = Object.values(updatedComponents).reduce(
          (sum, c) => sum + (c?.price || 0) * (c?.qty || 1),
          0
        );
        updateCartItem(cartItemId, {
          components: updatedComponents,
          totalPrice: newTotalPrice
        });
      }
      setRemovingId(null);
    }, 300);
  };

  return (
    <div className="cart-page">
      <h2>
        <FaShoppingCart style={{ marginRight: "10px" }} /> My Cart
      </h2>

      <div className="cart-grid">
        {/* LEFT SIDE */}
        <div className="cart-left">
          {cart.length === 0 && (
            <p>Your cart is empty. Go build something or shop components!</p>
          )}

          {cart.map((cartItem) => {
            // Case 1: Individual Product
            if (!cartItem.components) {
              const imageUrl = cartItem.image
                ? (cartItem.image.startsWith("http") ? cartItem.image : `${API.defaults.baseURL.replace(/\/api$/, "")}${cartItem.image}`)
                : "/default-avatar.png";

              return (
                <div
                  className={`cart-card ${removingId === cartItem.id ? "removing" : ""}`}
                  key={cartItem.id}
                >
                  <img src={imageUrl} alt={cartItem.name} />
                  <div>
                    <b>{cartItem.type}</b>
                    <p>{cartItem.name}</p>
                  </div>
                  <div className="cart-actions">
                    <div className="qty-box">
                      <button onClick={() => changeQty(cartItem.id, "dec")}>−</button>
                      <span>{cartItem.qty}</span>
                      <button onClick={() => changeQty(cartItem.id, "inc")}>+</button>
                    </div>
                    <div className="cart-price">
                      ₹{(cartItem.price || 0) * (cartItem.qty || 1)}
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveSingle(cartItem.id)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            }

            // Case 2: Custom Build (multiple components)
            return Object.keys(cartItem.components).map((typeName) => {
              const item = cartItem.components[typeName];
              const uniqueKey = `${cartItem.id}-${typeName}`;
              const imageUrl = item.image
                ? (item.image.startsWith("http") ? item.image : `${API.defaults.baseURL.replace(/\/api$/, "")}${item.image}`)
                : "/default-avatar.png";

              return (
                <div
                  className={`cart-card ${removingId === typeName ? "removing" : ""}`}
                  key={uniqueKey}
                >
                  <img src={imageUrl} alt={item.name} />
                  <div>
                    <b>{typeName} <small>(Build Item)</small></b>
                    <p>{item.name}</p>
                  </div>
                  <div className="cart-actions">
                    <div className="qty-box">
                      <button onClick={() => changeBuildQty(cartItem.id, typeName, "dec")}>−</button>
                      <span>{item.qty || 1}</span>
                      <button onClick={() => changeBuildQty(cartItem.id, typeName, "inc")}>+</button>
                    </div>
                    <div className="cart-price">
                      ₹{(item.price || 0) * (item.qty || 1)}
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveBuildItem(cartItem.id, typeName)}>
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              );
            });
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="cart-right">
          <h3>Total Price</h3>
          <h1>₹{cartTotal}</h1>
          <div className="delivery-box">
            <span className="delivery-icon">🚚</span>
            <div>
              <p className="delivery-title">Estimated Delivery</p>
              <p className="delivery-date">{getDeliveryRange()}</p>
            </div>
          </div>
          <button onClick={() => navigate("/checkout")}>
            <FaCreditCard /> Checkout
          </button>
          <button
            onClick={() => {
              // clear items in cart context and also reset current build if desired
              clearCart();
              setBuild({});
            }}
          >
            <FaTrash /> Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
