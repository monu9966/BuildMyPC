import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  const build = location.state;

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

  return (
    <div className="container">
      <div className="card">
        <h2>PC Build Summary</h2>
        <ul>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>CPU:</b> {cpu?.name || "Not selected"}{" "}
              </span>
              <span>₹{cpu?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>Motherboard:</b> {motherboard?.name || "Not selected"}{" "}
              </span>
              <span>₹{motherboard?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>RAM:</b> {ram?.name || "Not selected"}{" "}
              </span>
              <span>₹{ram?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                <b>Storage:</b> {storage?.name || "Not selected"}{" "}
              </span>
              <span>₹{storage?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>GPU:</b> {gpu?.name || "Not selected"}{" "}
              </span>
              <span>₹{gpu?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>PSU:</b> {psu?.name || "Not selected"}{" "}
              </span>
              <span>₹{psu?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>Cabinet:</b> {cabinet?.name || "Not selected"}{" "}
              </span>
              <span>₹{cabinet?.price || 0}</span>
            </div>
          </li>
          <li>
            <div className="price-row">
              <span>
                {" "}
                <b>Monitor:</b> {monitor?.name || "Not selected"}{" "}
              </span>
              <span>₹{monitor?.price || 0}</span>
            </div>
          </li>
        </ul>

        <hr />

        <div className="price-row total-row">
          <span>Total Price:</span>
          <span>₹{totalPrice}</span>
        </div>

        <br />
        <button onClick={() => navigate("/builder")} style={btnStyle}>
          Edit Build
        </button>

        <button onClick={downloadPDF} className="summary-btn">
          Download PDF
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
