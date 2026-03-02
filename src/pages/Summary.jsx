import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveBuild } from "../services/endpoints";
import { useCart } from "../context/CartContext";
import { saveCart } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { useBuild } from "../context/BuildContext";
import { FaShoppingCart, FaEdit, FaSave, FaFilePdf } from "react-icons/fa";
import axios from "axios";

function Summary() {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const { selectedParts } = useBuild();
  const [types, setTypes] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  const build = location.state;

  useEffect(() => {
    axios
      .get("/api/component-types")
      .then((res) => setTypes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const total = Object.values(selectedParts).reduce(
    (sum, item) => sum + (item?.price || 0),
    0,
  );

  if (!build) {
    return (
      <div className="container">
        <div className="card">
          <h2>No Build Found</h2>
          <button onClick={() => navigate("/builder")}>Go to PC Builder</button>
        </div>
      </div>
    );
  }

  const {
    cpu,
    motherboard,
    ram,
    storage,
    gpu,
    psu,
    cabinet,
    monitor,
    totalPrice,
  } = build;

  const buildData = {
    cpu,
    motherboard,
    ram,
    storage,
    gpu,
    psu,
    cabinet,
    monitor,
    totalPrice,
    components: [cpu, motherboard, ram, storage, gpu, psu, cabinet, monitor],
  };

  // pdf download code
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("BuildMyPC - Configuration Summary", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Component", "Name", "Price (₹)"]],
      body: [
        ["CPU", cpu?.name || "-", cpu?.price || 0],
        ["Motherboard", motherboard?.name || "-", motherboard?.price || 0],
        ["RAM", ram?.name || "-", ram?.price || 0],
        ["Storage", storage?.name || "-", storage?.price || 0],
        ["GPU", gpu?.name || "-", gpu?.price || 0],
        ["PSU", psu?.name || "-", psu?.price || 0],
        ["Cabinet", cabinet?.name || "-", cabinet?.price || 0],
        ["Monitor", monitor?.name || "-", monitor?.price || 0],
        ["TOTAL PRICE", "", totalPrice],
      ],
    });
    doc.save("BuildMyPC-Summary.pdf");
  };

  const handleSave = async () => {
    await saveBuild({
      components: {
        cpu,
        motherboard,
        ram,
        storage,
        gpu,
        psu,
        cabinet,
        monitor,
      },
      totalPrice,
    });
    alert("Build saved successfully!");
  };

  const handleSaveCart = async () => {
    await saveCart({
      userId: user._id,
      build: {
        cpu,
        motherboard,
        ram,
        storage,
        gpu,
        psu,
        cabinet,
        monitor,
        totalPrice,
      },
    });

    alert("Add to cart SucceFul!");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>PC Build Summary</h2>

        <div className="price-box">
          <h2>Selected Components</h2>

          {types.map((type) => {
            const item = selectedParts[type.name];

            return (
              <div key={type._id} className="summary-row">
                <b>{type.name}</b> :{item ? item.name : "Not selected"}
                <span> ₹{item ? item.price : 0}</span>
              </div>
            );
          })}

          <h3>Total Price: ₹{total}</h3>
        </div>


        <hr />

        <div className="price-row total-row">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
        </div>

        <button
          onClick={() => {
            addToCart(buildData);
            handleSaveCart();
          }}
        >
          <FaShoppingCart style={{ marginRight: "8px" }} /> Add to Cart
        </button>

        <button
          className="buy btn"
          onClick={() => navigate("/Cart", { state: buildData })}
        >
          <FaShoppingCart style={{ marginRight: "8px" }} /> Buy Now
        </button>

        <br />
        <button onClick={() => navigate("/builder")} style={btnStyle}>
          <FaEdit style={{ marginRight: "8px" }} /> Edit Build
        </button>

        <button onClick={handleSave} className="summary-btn">
          <FaSave style={{ marginRight: "8px" }} /> Save Build
        </button>

        <button onClick={downloadPDF} className="summary-btn">
          <FaFilePdf style={{ marginRight: "8px" }} /> Download PDF
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: "10px 20px",
  backgroundColor: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
export default Summary;
