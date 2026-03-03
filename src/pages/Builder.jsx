import { useState, useEffect } from "react";
import SelectBox from "../components/SelectBox";
import axios from "axios";
import { FaCheck, FaTimes, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBuild } from "../context/BuildContext";

export default function Builder() {
  const [types, setTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [openBox, setOpenBox] = useState(null);
  const navigate = useNavigate();
  const { selectedParts: contextParts, setSelectedParts } = useBuild();

  // when user returns to builder (e.g. from summary), prefill selections
  useEffect(() => {
    if (contextParts) {
      const parts = contextParts.selectedParts || contextParts;
      setSelected(parts);
    }
  }, [contextParts]);

  /* ===== Fetch data ===== */
  useEffect(() => {
    const load = async () => {
      const [typesRes, prodRes] = await Promise.all([
        axios.get("/api/component-types"),
        // request all components by asking for a high limit (0 means no limit on server)
        axios.get("/api/components", { params: { limit: 0 } }),
      ]);

      setTypes(typesRes.data || []);
      setProducts(prodRes.data?.data || prodRes.data || []);
    };
    load();
  }, []);

  /* ===== Select Component ===== */
  const handleSelect = (type, item) => {
    setSelected((prev) => ({ ...prev, [type]: item }));
  };

  /* ===== Total Price ===== */
  const totalPrice = Object.values(selected).reduce(
    (sum, p) => sum + (p?.price || 0),
    0,
  );

  /* ===== Compatibility ===== */
  const cpu = selected.CPU;
  const mb = selected.Motherboard;
  const ram = selected.RAM;
  const gpu = selected.GPU;
  const psu = selected.PSU;

  const cpuMbCompat = cpu && mb ? cpu.socket === mb.socket : null;
  const ramCompat = ram && mb ? ram.type === mb.ramType : null;
  const gpuPsuCompat = gpu && psu ? psu.watt >= gpu.watt : null;

  return (
    <div className="builder-page">
      {/* LEFT SIDE */}
      <div className="builder-left">
        <h2>🖥️ Build Your Custom PC</h2>

        {types.map((type) => (
          <SelectBox
            title={type.name}
            options={products.filter((p) => p.type === type.name)}
            selected={selected[type.name]}
            onSelect={(item) => handleSelect(type.name, item)}
            isOpen={openBox === type.name}
            setOpenBox={setOpenBox}
          />
        ))}
      </div>

      {/* RIGHT SIDE SUMMARY */}
      <div className="builder-right">
        <h3>Compatibility</h3>
        <CompatRow label="CPU & Motherboard" ok={cpuMbCompat} />
        <CompatRow label="RAM & Motherboard" ok={ramCompat} />
        <CompatRow label="GPU & PSU" ok={gpuPsuCompat} />

        <h3>Selected Parts</h3>
        {types.map((type) => {
          const item = selected[type.name];
          return (
            <div key={type._id} className="summary-row">
              {type.name}
              <span>{item?.name || "Not selected"}</span>
              <span>₹{item?.price || 0}</span>
            </div>
          );
        })}

        <h2>Total ₹{totalPrice}</h2>

        <button
          className="summary-btn"
          onClick={() => {
            // store just the selected parts object; total price is recalculated in summary
            setSelectedParts(selected);
            navigate("/summary");
          }}
        >
          <FaClipboardList /> View Summary
        </button>
      </div>
    </div>
  );
}

function CompatRow({ label, ok }) {
  return (
    <div className="compat-row">
      {label} :
      {ok === null ? (
        " Select"
      ) : ok ? (
        <FaCheck color="green" />
      ) : (
        <FaTimes color="red" />
      )}
    </div>
  );
}
