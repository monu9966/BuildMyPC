import { useState, useRef } from "react";
import {
  addComponent,
  updateComponent,
  deleteComponent,
} from "../../services/componentApi";

export default function ComponentsAdmin({ components = [], refresh }) {

  const [form, setForm] = useState({
    type: "",
    name: "",
    price: "",
    socket: "",
    ramType: "",
    watt: "",
    image: null,
  });

  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef();

  // ✅ SUBMIT
  const handleSubmit = async () => {
    try {
      if (!form.type || !form.name || !form.price) {
        alert("Type, Name, Price required ❌");
        return;
      }

      const data = new FormData();

      Object.keys(form).forEach((k) => {
        if (form[k]) data.append(k, form[k]);
      });

      if (editingId) {
        await updateComponent(editingId, data);
        alert("Component Updated ✅");
        setEditingId(null);
      } else {
        await addComponent(data);
        alert("Component Added ✅");
      }

      // reset
      setForm({
        type: "",
        name: "",
        price: "",
        socket: "",
        ramType: "",
        watt: "",
        image: null,
      });

      if (fileRef.current) fileRef.current.value = "";

      refresh();

    } catch (err) {
      console.log(err);
      alert("Error saving component ❌");
    }
  };

  return (
    <>
      <h2>Components</h2>

      {/* ===== FORM ===== */}

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="">Select Type</option>
        <option value="CPU">CPU</option>
        <option value="GPU">GPU</option>
        <option value="RAM">RAM</option>
        <option value="Motherboard">Motherboard</option>
        <option value="Storage">Storage</option>
        <option value="PSU">PSU</option>
        <option value="Cabinet">Cabinet</option>
        <option value="Monitor">Monitor</option>
      </select>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      {/* Optional fields */}
      {(form.type === "CPU" || form.type === "Motherboard") && (
        <input
          placeholder="Socket"
          value={form.socket}
          onChange={(e) => setForm({ ...form, socket: e.target.value })}
        />
      )}

      {form.type === "RAM" && (
        <input
          placeholder="RAM Type"
          value={form.ramType}
          onChange={(e) => setForm({ ...form, ramType: e.target.value })}
        />
      )}

      {(form.type === "GPU" || form.type === "PSU") && (
        <input
          type="number"
          placeholder="Watt"
          value={form.watt}
          onChange={(e) => setForm({ ...form, watt: e.target.value })}
        />
      )}

      <input
        type="file"
        ref={fileRef}
        onChange={(e) =>
          setForm({ ...form, image: e.target.files[0] })
        }
      />

      <button className="btn btn-primary" onClick={handleSubmit}>
        {editingId ? "Update" : "Add"}
      </button>

      {/* ===== TABLE ===== */}
      <table className="admin-table">
        <tbody>
          {components.map((c) => (
            <tr key={c._id}>
              <td>{c.type}</td>
              <td>{c.name}</td>
              <td>₹{c.price}</td>

              <td>
                <button
                  onClick={() => {
                    setForm({
                      type: c.type,
                      name: c.name,
                      price: c.price,
                      socket: c.socket || "",
                      ramType: c.ramType || "",
                      watt: c.watt || "",
                      image: null,
                    });
                    setEditingId(c._id);
                  }}
                className="btn btn-edit"
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (window.confirm("Delete component?")) {
                      await deleteComponent(c._id);
                      refresh();
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
