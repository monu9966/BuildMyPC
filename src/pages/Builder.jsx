import { useState, useMemo, useEffect } from "react";
import SelectBox from "../components/SelectBox";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getComponents } from "../services/componentApi";

function Builder() {
  const [cpu, setCpu] = useState(null);
  const [motherboard, setMotherboard] = useState(null);
  const [ram, setRam] = useState(null);
  const [storage, setStorage] = useState(null);
  const [gpu, setGpu] = useState(null);
  const [psu, setPsu] = useState(null);
  const [cabinet, setCabinet] = useState(null);
  const [monitor, setMonitor] = useState(null);

  const [cpus, setCpus] = useState([]);
  const [motherboards, setMotherboards] = useState([]);
  const [rams, setRams] = useState([]);
  const [gpus, setGpus] = useState([]);
  const [storages, setStorages] = useState([]);
  const [psus, setPsus] = useState([]);
  const [cabinets, setCabinets] = useState([]);
  const [monitors, setMonitors] = useState([]);

  const location = useLocation();
  const usage = location.state?.usage;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setCpus((await getComponents("CPU")).data);
      setMotherboards((await getComponents("Motherboard")).data);
      setRams((await getComponents("RAM")).data);
      setGpus((await getComponents("GPU")).data);
      setStorages((await getComponents("Storage")).data);
      setPsus((await getComponents("PSU")).data);
      setCabinets((await getComponents("Cabinet")).data);
      setMonitors((await getComponents("Monitor")).data);
    };

    fetchData();
  }, []);

  // Total Price Calculation
  const totalPrice = useMemo(() => {
    return (
      (cpu?.price || 0) +
      (motherboard?.price || 0) +
      (ram?.price || 0) +
      (storage?.price || 0) +
      (gpu?.price || 0) +
      (psu?.price || 0) +
      (cabinet?.price || 0) +
      (monitor?.price || 0)
    );
  }, [cpu, motherboard, ram, storage, gpu, psu, cabinet, monitor]);

  // Compatibility rules
  const cpuMbCompat =
    cpu && motherboard ? cpu.socket === motherboard.socket : null;
  const ramCompat =
    ram && motherboard ? ram.type === motherboard.ramType : null;
  const gpuPsuCompat = gpu && psu ? psu.watt >= gpu.watt : null;

  return (
    <div className="builder-page">
      <div className="builder-container">
        <h2 className="builder-title">PC Builder</h2>

        {/* Select sections */}
        <div className="builder-card">
          <SelectBox title="CPU" options={cpus} onSelect={setCpu} />
        </div>

        <div className="builder-card">
          <SelectBox
            title="Motherboard"
            options={motherboards}
            onSelect={setMotherboard}
          />
        </div>

        <div className="builder-card">
          <SelectBox title="RAM" options={rams} onSelect={setRam} />
        </div>

        <div className="builder-card">
          <SelectBox title="Storage" options={storages} onSelect={setStorage} />
        </div>

        <div className="builder-card">
          <SelectBox title="GPU" options={gpus} onSelect={setGpu} />
        </div>

        <div className="builder-card">
          <SelectBox title="Power Supply" options={psus} onSelect={setPsu} />
        </div>

        <div className="builder-card">
          <SelectBox title="Cabinet" options={cabinets} onSelect={setCabinet} />
        </div>

        <div className="builder-card">
          <SelectBox title="Monitor" options={monitors} onSelect={setMonitor} />
        </div>

        {/* Compatibility */}
        <div className="compatibility-box">
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

        {/* Selected components */}
        <div className="selected-list">
          <h3>Selected Components</h3>

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
        </div>

        {/* Price */}
        <div className="price-box">
          <h2>Total Price</h2>
          <div className="price-value">₹{totalPrice}</div>

          <button
            className="summary-btn"
            onClick={() =>
              navigate("/summary", {
                state: {
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
              })
            }
          >
            View Summary
          </button>
        </div>
      </div>
    </div>
  );
}

export default Builder;
