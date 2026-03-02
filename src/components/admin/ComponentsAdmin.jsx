import { useEffect, useState, useRef } from "react";
import Pagination from "../Pagination";
import axios from "axios";
import {
  addComponent,
  updateComponent,
  deleteComponent,
} from "../../services/endpoints";

export default function ComponentsAdmin({ refresh }) {
  const [components, setComponents] = useState([]);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [category, setCategory] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 10;

  const [totalPages, setTotalPages] = useState(1);

  const load = async () => {
    const res = await axios.get("/api/components", {
      params: {
        search,
        category,
        page: currentPage,
        limit: componentsPerPage,
      },
    });

    setComponents(res.data.data);
    if (res.data.totalPages != null) {
      setTotalPages(res.data.totalPages);
    }
  };

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

  useEffect(() => {
    load();
  }, [search, category, currentPage]);

  useEffect(() => {
    axios
      .get("/api/component-types")
      .then((res) => setTypes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async () => {
    try {
      if (!form.type || !form.name || !form.price) {
        alert("Type, Name, Price required ❌");
        return;
      }

      const data = new FormData();

      Object.keys(form).forEach((k) => {
        if (form[k] !== null && form[k] !== "") data.append(k, form[k]);
      });

      if (editingId) {
        await updateComponent(editingId, data);
        alert("Component Updated ✅");
        setEditingId(null);
      } else {
        await addComponent(data);
        alert("Component Added ✅");
        setCurrentPage(1);
      }

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

      if (refresh) refresh();
      load();
    } catch (err) {
      console.log(err);
      alert("Error saving component ❌");
    }
  };

  return (
    <div className="admin-container">
      <h2>🧩 Components</h2>

      <input
        className="search-input"
        placeholder="Search component..."
        value={search}
        onChange={(e) => {
          setCurrentPage(1);
          setSearch(e.target.value);
        }}
      />
      <select
        value={category}
        onChange={(e) => {
          setCurrentPage(1);
          setCategory(e.target.value);
        }}
      >
        <option value="">All Categories</option>

        {types.map((t) => (
          <option key={t._id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="">Select Component Type</option>

        {types.map((t) => (
          <option key={t._id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
      <div className="form-row">
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
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button className="btn-primary" onClick={handleSubmit}>
          {editingId ? "➕ Update" : "➕ Add"}
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Components Type</th>
            <th>Components Name</th>
            <th>Price</th>
            <th>Added Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {components.map((c) => (
            <tr key={c._id}>
              <td>
                {components.indexOf(c) + 1 + (currentPage - 1) * componentsPerPage}
              </td>
              <td>{c.type}</td>
              <td>{c.name}</td>
              <td>₹{c.price}</td>
              <td>
                {new Date(c.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
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
                      load();
                      if (
                        components.length - 1 <=
                          (currentPage - 1) * componentsPerPage &&
                        currentPage > 1
                      ) {
                        setCurrentPage(currentPage - 1);
                      }
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

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
