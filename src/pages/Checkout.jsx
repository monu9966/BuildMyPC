import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeCODOrder } from "../services/orderApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; 
import gpay from "../assets/payments/gpay.png";
import phonepe from "../assets/payments/phonepe.png";
import paytm from "../assets/payments/paytm.png";
import visa from "../assets/payments/visa.png";
import mastercard from "../assets/payments/mastercard.png";


export default function Checkout() {
  const { state } = useLocation();
  const { user } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // state may come from cart (array) or a single build (object) when clicking "Buy Now"
  const cart = Array.isArray(state) ? state : state ? [state] : [];

  const totalPrice = cart.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleOrder = async () => {
    if (!user) return alert("Please login before placing an order");
    if (cart.length === 0) return alert("Your cart is empty");

    try {
      if (!address.fullName || !address.street) {
        return alert("Please provide your name and street address");
      }

      await placeCODOrder({
        build: cart,
        totalPrice,
        address,
      });

      alert("Order Placed Successfully 🚚");
      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed", err);
      const msg = err.response?.data?.message || err.message;
      alert(`Failed to place order: ${msg}`);
    }
  };

  if (!user) return <h2>Please login to continue</h2>;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      {cart.length === 0 && <p>No items to checkout.</p>}

      {cart.map((b, idx) => (
        <div className="order-box" key={idx}>
          <h4>PC Build {idx + 1}</h4>
          <p>Total: ₹{b.totalPrice}</p>

          {/* display component details from build object */}
          <ul>
            {b.cpu && <li>CPU: {b.cpu.name || ""}</li>}
            {b.motherboard && <li>Motherboard: {b.motherboard.name || ""}</li>}
            {b.ram && <li>RAM: {b.ram.name || ""}</li>}
            {b.storage && <li>Storage: {b.storage.name || ""}</li>}
            {b.gpu && <li>GPU: {b.gpu.name || ""}</li>}
            {b.psu && <li>PSU: {b.psu.name || ""}</li>}
            {b.cabinet && <li>Cabinet: {b.cabinet.name || ""}</li>}
            {b.monitor && <li>Monitor: {b.monitor.name || ""}</li>}
          </ul>
        </div>
      ))}

      <h3>Order Total: ₹{totalPrice}</h3>

      <h3>Delivery Address</h3>

      <div className="address-grid">
        <input
          placeholder="Full Name"
          value={address.fullName}
          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
        />

        <input
          placeholder="Phone"
          value={address.phone}
          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
        />

        <input
          placeholder="Street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
        />

        <input
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />

        <input
          placeholder="State"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
        />

        <input
          placeholder="Pincode"
          value={address.pincode}
          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
        />
      </div>

      <div className="payment-box">
        <h3>Payment Method</h3>
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
          <img src={gpay} alt="UPI" className="pay-icon" />
          <img src={phonepe} alt="UPI" className="pay-icon" />
          <img src={paytm} alt="UPI" className="pay-icon" />
        </label>

        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Debit / Credit Card
          <img src={visa} alt="Visa" className="pay-icon" />
          <img src={mastercard} alt="MasterCard" className="pay-icon" />
        </label>

        {/* SHOW UPI INPUT */}
        {paymentMethod === "upi" && (
          <div className="pay-box">
            <input placeholder="Enter UPI ID (example@upi)" />
          </div>
        )}

        {/* SHOW CARD INPUT */}
        {paymentMethod === "card" && (
          <div className="pay-box">
            <input placeholder="Card Number" />
            <input placeholder="Expiry MM/YY" />
            <input placeholder="CVV" />
          </div>
        )}

        <button
          className="place-btn"
          onClick={handleOrder}
          disabled={cart.length === 0}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
