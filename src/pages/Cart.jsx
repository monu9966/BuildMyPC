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
  const { cart, addToCart, qty, clearCart, updateCartItem, removeFromCart } =
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
  // always recalc from the current parts object so removals/qty changes reflect immediately
  const totalPrice = Object.values(parts).reduce(
    (sum, item) => sum + (item?.price || 0) * (item?.qty || 1),
    0,
  );

  // buildData/alreadyInCart are only used on builder page; keep minimal here in case we need them later
  const buildData = {
    id: cartBuild ? cartBuild.id : JSON.stringify(selectedParts),
    components: cartBuild ? cartBuild.components : selectedParts,
    totalPrice,
  };

  const alreadyInCart = cart.some((item) => item.id === buildData.id);

  const changeQty = (typeName, action) => {
    const updatedParts = { ...parts };

    if (!updatedParts[typeName]) return;

    const currentQty = updatedParts[typeName].qty || 1;

    updatedParts[typeName].qty =
      action === "inc" ? currentQty + 1 : Math.max(1, currentQty - 1);

    // update build context (selectedParts)
    setBuild(updatedParts);

    // also sync to cart item if we're showing a cart build
    if (cartBuild) {
      const newTotal = Object.values(updatedParts).reduce(
        (s, itm) => s + (itm?.price || 0) * (itm?.qty || 1),
        0,
      );
      updateCartItem(cartBuild.id, {
        components: updatedParts,
        totalPrice: newTotal,
      });
    }
  };

  // remove a single component from the current build
  const handleRemove = (typeName) => {
    setRemovingId(typeName);

    setTimeout(() => {
      const updated = { ...parts };
      delete updated[typeName];
      setBuild(updated);
      if (cartBuild) {
        const newTotal = Object.values(updated).reduce(
          (s, itm) => s + (itm?.price || 0) * (itm?.qty || 1),
          0,
        );
        if (Object.keys(updated).length === 0) {
          // no components left, remove the build entirely from cart
          removeFromCart(cartBuild.id);
        } else {
          updateCartItem(cartBuild.id, {
            components: updated,
            totalPrice: newTotal,
          });
        }
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
          {Object.keys(parts).length === 0 && (
            <p>Your cart is empty. Go build something!</p>
          )}
          {types.map((type) => {
            const item = parts[type.name];
            if (!item) return null; // skip components that have been removed
            return (
              <div
                className={`cart-card ${
                  removingId === type.name ? "removing" : ""
                }`}
                key={type.name}
              >
                <img
                  src={item?.image || "/default-avatar.png"}
                  alt={item?.name}
                />
                <div>
                  <b>{type.name}</b>
                  <p>{item?.name || "Not Selected"}</p>
                </div>
                <div className="cart-actions">
                  <div className="qty-box">
                    <button onClick={() => changeQty(type.name, "dec")}>
                      −
                    </button>
                    <span>{item?.qty || 1}</span>
                    <button onClick={() => changeQty(type.name, "inc")}>
                      +
                    </button>
                  </div>

                  <div className="cart-price">
                    ₹{(item?.price || 0) * (item?.qty || 1)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(type.name)}
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="cart-right">
          <h3>Total Price</h3>
          <h1>₹{totalPrice}</h1>
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
