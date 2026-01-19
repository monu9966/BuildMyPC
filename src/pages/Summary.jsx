import { useLocation, useNavigate } from "react-router-dom";

function Summary() {
  const location = useLocation();
  const navigate = useNavigate();

  const build = location.state;

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

  const { cpu, motherboard, ram, storage, gpu, psu, totalPrice } = build;

  return (
    <div className="container">
      <div className="card">
        <h2>PC Build Summary</h2>
        <ul>
          <li>
            <b>CPU:</b> {cpu?.name}
          </li>
          <li>
            <b>Motherboard:</b> {motherboard?.name}
          </li>
          <li>
            <b>RAM:</b> {ram?.name}
          </li>
          <li>
            <b>Storage:</b> {storage?.name}
          </li>
          <li>
            <b>GPU:</b> {gpu?.name}
          </li>
          <li>
            <b>Power Supply:</b> {psu?.name}
          </li>
        </ul>

        <hr />
        <h2>Total Price: ₹{totalPrice}</h2>
        <br />
        <button onClick={() => navigate("/builder")} style={btnStyle}>
          Edit Build
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
