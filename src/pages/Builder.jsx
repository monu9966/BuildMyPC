import { useState, useEffect } from "react";
import SelectBox from "../components/SelectBox";
import axios from "axios";
import { API } from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FaCheck,
  FaTimes,
  FaClipboardList,
  FaShoppingCart,
  FaSave,
  FaFilePdf,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useBuild } from "../context/BuildContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Builder() {
  const [types, setTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState({});
  const [openBox, setOpenBox] = useState(null);
  const navigate = useNavigate();
  const { selectedParts: contextParts, setSelectedParts } = useBuild();

  const { cart, addToCart } = useCart();
  const { user } = useAuth();

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

  const buildData = {
    id: JSON.stringify(selected),
    components: selected,
    totalPrice,
  };

  const alreadyInCart = cart.some((item) => item.id === buildData.id);
  const hasSelected = Object.keys(selected).length > 0;

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save your build");
      navigate("/login");
      return;
    }

    try {
      await API.post("/builds", {
        userId: user._id,
        components: selected,
        totalPrice,
      });
      alert("Build saved!");
    } catch {
      alert("Save failed");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("BuildMyPC Summary", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Component", "Name", "Price"]],
      body: types.map((t) => [
        t.name,
        selected[t.name]?.name || "-",
        selected[t.name]?.price || 0,
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
      const res = await API.post("/builds/share", {
        components: selected,
        totalPrice,
      });

      const link = `${window.location.origin}/build/${res.data.id}`;
      await navigator.clipboard.writeText(link);
      alert("Build link copied! 🔗");
    } catch {
      alert("Error sharing build");
    }
  };

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
            key={type._id || type.name}
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

        <div className="selected-container">
          <h3 className="selected-title">Selected Components</h3>
          {types.map((type) => {
            const item = selected[type.name];
            return (
              <div key={type._id} className="selected-row">
                <div className="selected-left">
                  <span className="component-name">{type.name}</span>
                  <span className="component-value">
                    {item ? item.name : "Not selected"}
                  </span>
                </div>
                <div className="selected-price">₹{item ? item.price : 0}</div>
              </div>
            );
          })}
        </div>
        <h2 className="total-price">Total ₹{totalPrice}</h2>
        <button
          onClick={() => {
            if (alreadyInCart) {
              navigate("/cart");
            } else {
              if (!hasSelected) return; // safety
              addToCart(buildData);
              navigate("/cart");
            }
          }}
          disabled={!hasSelected}
        >
          {alreadyInCart ? (
            <>
              <FaShoppingCart /> Go to Cart
            </>
          ) : (
            <>
              <FaShoppingCart /> Add to Cart
            </>
          )}
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
