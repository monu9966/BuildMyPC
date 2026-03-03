import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { placeCODOrder } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import gpay from "../assets/payments/gpay.png";
import phonepe from "../assets/payments/phonepe.png";
import paytm from "../assets/payments/paytm.png";
import visa from "../assets/payments/visa.png";
import mastercard from "../assets/payments/mastercard.png";
import { useBuild } from "../context/BuildContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { setSelectedParts } = useBuild();

  const [paymentMethod, setPaymentMethod] = useState("cod");

  // always use current cart contents; skip location state entirely
  const currentCart = Array.isArray(cart) ? cart : [];
  const totalPrice = currentCart.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0
  );

  // fixed delivery charge (could be dynamic later)
  const deliveryFee = 100;
  const payable = totalPrice + (currentCart.length ? deliveryFee : 0);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleOrder = async () => {
    if (!user) {
      alert("Please login before placing an order");
      navigate("/login");
      return;
    }

    if (currentCart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!address.fullName || !address.street) {
      alert("Please complete delivery details");
      return;
    }

    try {
      await placeCODOrder({
        build: currentCart,
        totalPrice,
        deliveryFee,
        payable,
        address,
        paymentMethod,
      });

      alert("Order Placed Successfully 🚚");
      clearCart();
      setSelectedParts({});
      navigate("/orders");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`Order failed: ${msg}`);
    }
  };

  if (!user) return <h2>Please login to continue</h2>;

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-grid">

        {/* LEFT SIDE */}
        <div className="checkout-left">

          {/* Address */}
          <h3>Delivery Address</h3>

          <div className="address-grid">
            <input
              placeholder="Full Name"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />

            <input
              placeholder="Phone"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />

            <input
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />

            <input
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />

            <input
              placeholder="Pincode"
              value={address.pincode}
              onChange={(e) =>
                setAddress({ ...address, pincode: e.target.value })
              }
            />
          </div>

          {/* Payment */}
          <div className="payment-box">
            <h3>Payment Method</h3>

            <label className="payment-option">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              UPI
              <img src={gpay} alt="gpay" className="pay-icon" />
              <img src={phonepe} alt="phonepe" className="pay-icon" />
              <img src={paytm} alt="paytm" className="pay-icon" />
            </label>

            <label className="payment-option">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Debit / Credit Card
              <img src={visa} alt="visa" className="pay-icon" />
              <img src={mastercard} alt="mastercard" className="pay-icon" />
            </label>

            {paymentMethod === "upi" && (
              <div className="pay-box">
                <input placeholder="Enter UPI ID (example@upi)" />
              </div>
            )}

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
              disabled={currentCart.length === 0}
            >
              Place Order
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h3>Order Summary</h3>
          {currentCart.length === 0 && <p>No items in cart.</p>}

          {currentCart.map((b, i) => (
            <div key={i} className="summary-item">
              <span>PC Build {i + 1}</span>
              <span>₹{b.totalPrice}</span>
            </div>
          ))}

          <div className="summary-item">
            <span>Delivery Fee</span>
            <span>₹{currentCart.length ? deliveryFee : 0}</span>
          </div>

          <div className="summary-total">
            <span>Total Payable:</span> 
            <span>₹{payable}</span>
          </div>
        </div>

      </div>
    </div>
  );
}