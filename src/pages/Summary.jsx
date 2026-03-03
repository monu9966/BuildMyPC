import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import { API } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useBuild } from "../context/BuildContext";
import { FaShoppingCart, FaEdit, FaSave, FaFilePdf } from "react-icons/fa";

export default function Summary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedParts } = useBuild();
  const [types, setTypes] = useState([]);
  const { cart, addToCart } = useCart();

  // handle cases where context stored an object with { selectedParts, totalPrice }
  const parts =
    selectedParts && selectedParts.selectedParts
      ? selectedParts.selectedParts
      : selectedParts || {};

  /* ===== Load component types ===== */
  useEffect(() => {
    axios
      .get("/api/component-types")
      .then((res) => setTypes(res.data || []))
      .catch(() => alert("Error loading types"));
  }, []);

  /* ===== Total Price ===== */
  const totalPrice = Object.values(parts).reduce(
    (sum, item) => sum + (item?.price || 0),
    0,
  );

  const buildData = {
    id: JSON.stringify(selectedParts),
    components: selectedParts,
    totalPrice,
  };

  const alreadyInCart = cart.some((item) => item.id === buildData.id);

  /* ===== Save Build ===== */
  const handleSave = async () => {
    if (!user) {
      alert("Please login to save your build");
      navigate("/login");
      return;
    }

    try {
      await API.post("/builds", {
        userId: user._id,
        components: parts,
        totalPrice,
      });
      alert("Build saved!");
    } catch {
      alert("Save failed");
    }
  };

  /* ===== PDF ===== */
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("BuildMyPC Summary", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Component", "Name", "Price"]],
      body: types.map((t) => [
        t.name,
        parts[t.name]?.name || "-",
        parts[t.name]?.price || 0,
      ]),
    });

    doc.text(`Total: ₹${totalPrice}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("BuildMyPC.pdf");
  };

  const shareBuild = async () => {
    if (!user) {
      alert("Please login to share your build");
      navigate("/login");
      return;
    }

    try {
      // make sure we send the normalized parts map, not the wrapped object
      const res = await API.post("/builds/share", {
        components: parts,
        totalPrice,
      });

      const link = `${window.location.origin}/build/${res.data.id}`;

      await navigator.clipboard.writeText(link);
      alert("Build link copied! 🔗");
    } catch {
      alert("Error sharing build");
    }
  };

  return (
    <div className="summary-page">
      <h2>🖥️ PC Build Summary</h2>

      <div className="summary-grid">
        {/* LEFT SIDE */}
        <div className="summary-left">
          {types.map((type) => {
            const item = parts[type.name];
            return (
              <div key={type._id} className="summary-card">
                <img
                  src={item?.image || "/default-avatar.png"}
                  alt={item?.name}
                />
                <div>
                  <b>{type.name}</b>
                  <p>{item?.name || "Not Selected"}</p>
                </div>
                <span>₹{item?.price || 0}</span>
              </div>
            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="summary-right">
          <h3>Total Price</h3>
          <h1>₹{totalPrice}</h1>

          <button
            onClick={() =>
              alreadyInCart ? navigate("/cart") : addToCart(buildData)
            }
          >
            {alreadyInCart ? "Go to Cart 🛒" : "Add to Cart"}
          </button>

          <button onClick={() => navigate("/builder")}>
            <FaEdit /> Edit Build
          </button>

          <button onClick={handleSave} disabled={!user}>
            <FaSave /> Save Build
          </button>

          <button onClick={downloadPDF}>
            <FaFilePdf /> Download PDF
          </button>

          <button onClick={shareBuild} disabled={!user}>
            🔗 Share Build
          </button>
        </div>
      </div>
    </div>
  );
}
