import { useState, useMemo } from "react";
import SelectBox from "../components/SelectBox";
import {
  cpus,
  motherboards,
  rams,
  storages,
  gpus,
  psus,
} from "../data/components";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Builder() {
  const [cpu, setCpu] = useState(null);
  const [motherboard, setMotherboard] = useState(null);
  const [ram, setRam] = useState(null);
  const [storage, setStorage] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [psu, setPsu] = useState(null);

  const location = useLocation();
  const usage = location.state?.usage;
  const navigate = useNavigate();

  // Total Price Calculation
  const totalPrice = useMemo(() => {
    return (
      (cpu?.price || 0) +
      (motherboard?.price || 0) +
      (ram?.price || 0) +
      (storage?.price || 0) +
      (gpu?.price || 0) +
      (psu?.price || 0)
    );
  }, [cpu, motherboard, ram, storage, gpu, psu]);

  // Compatibility rules
  const cpuMbCompat =
    cpu && motherboard ? cpu.socket === motherboard.socket : null;
  const ramCompat =
    ram && motherboard ? ram.type === motherboard.ramType : null;
  const gpuPsuCompat = gpu && psu ? psu.watt >= gpu.watt : null;

  return (
    <div className="container">
      <h2>PC Builder</h2>

      <SelectBox title="CPU" options={cpus} onSelect={setCpu} />
      <SelectBox
        title="Motherboard"
        options={motherboards}
        onSelect={setMotherboard}
      />
      <SelectBox title="RAM" options={rams} onSelect={setRam} />
      <SelectBox title="Storage" options={storages} onSelect={setStorage} />
      <SelectBox title="GPU" options={gpus} onSelect={setGpu} />
      <SelectBox title="Power Supply" options={psus} onSelect={setPsu} />

      <div className="card">
        <div className="card">
          <h3>Compatibility Status</h3>
          <p>
            CPU & Motherboard:{" "}
            {cpuMbCompat === null
              ? "Select"
              : cpuMbCompat
                ? "✅ Compatible"
                : "❌ Not Compatible"}
          </p>
          <p>
            RAM & Motherboard:{" "}
            {ramCompat === null
              ? "Select"
              : ramCompat
                ? "✅ Compatible"
                : "❌ Not Compatible"}
          </p>
          <p>
            GPU & PSU:{" "}
            {gpuPsuCompat === null
              ? "Select"
              : gpuPsuCompat
                ? "✅ Compatible"
                : "❌ Not Compatible"}
          </p>
        </div>

        <h3>Selected Components.</h3>
        <ul>
          <li>CPU: {cpu?.name || "Not selected"}</li>
          <li>Motherboard: {motherboard?.name || "Not selected"} </li>
          <li>RAM: {ram?.name || "Not selected"} </li>
          <li>Storage: {storage?.name || "Not selected"}</li>
          <li>GPU: {gpu?.name || "Not selected"} </li>
          <li>PSU: {psu?.name || "Not selected"} </li>
        </ul>
      </div>

      <div>
        <h2>Total Price</h2>
        <h1 style={{ color: "#0d6efd" }}>₹{totalPrice}</h1>
      </div>

      <button
        onClick={() =>
          navigate("/summary", {
            state: {
              cpu,
              motherboard,
              ram,
              storage,
              gpu,
              psu,
              totalPrice,
            },
          })
        }
        style={{
          padding: "12px 25px",
          backgroundColor: "#198754",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        View Summary
      </button>
    </div>
  );
}

export default Builder;
