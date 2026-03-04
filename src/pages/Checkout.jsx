import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { placeCODOrder } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import gpay from "../assets/payments/gpay.png";
import phonepe from "../assets/payments/phonepe.png";
import paytm from "../assets/payments/paytm.png";
import visa from "../assets/payments/visa.png";
import mastercard from "../assets/payments/mastercard.png";
import { useBuild } from "../context/BuildContext";
import { FaCreditCard } from "react-icons/fa";
import { getEstimatedDelivery } from "../utils/deliveryDate";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { setSelectedParts } = useBuild();
  const deliveryDate = getEstimatedDelivery(5);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [upiId, setUpiId] = useState("");

  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const validateUPI = (upi) => {
    const upiregex = /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/;
    return upiregex.test(upi);
  };

  const validateCard = (card) => {
    const num = card.number.replace(/\s+/g, "");
    const cvv = card.cvv;
    const expiry = card.expiry;

    // simple checks: 16-digit number, cvv 3 or 4 digits, expiry MM/YY
    const numOk = /^\d{16}$/.test(num);
    const cvvOk = /^\d{3,4}$/.test(cvv);
    const expOk = /^((0[1-9])|(1[0-2]))\/(\d{2})$/.test(expiry);
    return numOk && cvvOk && expOk;
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    value = value.replace(/\D/g, "");

    if (value.length >= 3) {
      return value.slice(0, 2) + "/" + value.slice(2, 4);
    }

    return value;
  };

  // always use current cart contents; skip location state entirely
  const currentCart = Array.isArray(cart) ? cart : [];
  const totalPrice = currentCart.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0,
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

  const isPaymentValid = () => {
    if (paymentMethod === "upi") {
      return validateUPI(upiId);
    }
    if (paymentMethod === "card") {
      return validateCard(cardDetails);
    }
    return true;
  };

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

    // payment-specific validation
    if (paymentMethod === "upi") {
      if (!upiId || !validateUPI(upiId)) {
        alert("Please enter a valid UPI ID (example@upi)");
        return;
      }
    }

    if (paymentMethod === "card") {
      if (!validateCard(cardDetails)) {
        alert("Please enter valid card details (number, expiry MM/YY, cvv)");
        return;
      }
    }

    try {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 3000));

      await placeCODOrder({
        build: currentCart,
        totalPrice,
        deliveryFee,
        payable,
        address,
        paymentMethod,
        estimatedDelivery: deliveryDate,
        paymentData:
          paymentMethod === "upi"
            ? { upiId }
            : paymentMethod === "card"
              ? cardDetails
              : {},
      });

      clearCart();
      setSelectedParts({});
      navigate("/order-success", { state: { deliveryDate } });
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert(`Order failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <h2>Please login to continue</h2>;

  return (
    <div className="checkout-page">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="big-spinner"></div>
            <p>Processing your order...</p>
          </div>
        </div>
      )}
      <h2>
        <FaCreditCard style={{ marginRight: "10px" }} /> Checkout
      </h2>

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
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
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
                <input
                  placeholder="Enter UPI ID (example@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="pay-box">
                <input
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={(e) =>
                    setCardDetails((c) => ({
                      ...c,
                      number: formatCardNumber(e.target.value),
                    }))
                  }
                  maxLength={19}
                />
                <input
                  placeholder="Expiry MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) =>
                    setCardDetails((c) => ({
                      ...c,
                      expiry: formatExpiry(e.target.value),
                    }))
                  }
                  maxLength={5}
                />
                <input
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChange={(e) =>
                    setCardDetails((c) => ({ ...c, cvv: e.target.value }))
                  }
                  maxLength={4}
                />
              </div>
            )}

            <button
              className="place-btn"
              onClick={handleOrder}
              disabled={
                loading ||
                currentCart.length === 0 ||
                (paymentMethod !== "cod" && !isPaymentValid())
              }
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="checkout-right">
          <h3>Order Summary</h3>
          <div className="delivery-box">
            <span className="delivery-icon">🚚</span>

            <div>
              <p className="delivery-title">Arriving By</p>
              <p className="delivery-date">{getEstimatedDelivery(5)}</p>
            </div>
          </div>
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
