import { useEffect, useState } from "react";
import Pagination from "../Pagination";
import axios from "axios";
import {
  addComponentType,
  updateComponentType,
  deleteComponentType,
} from "../../services/endpoints";

export default function AdminComponentTypes() {
  const [types, setTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const typesPerPage = 5;

  const totalPages = Math.ceil(types.length / typesPerPage);

  const paginatedTypes = types.slice(
    (currentPage - 1) * typesPerPage,
    currentPage * typesPerPage,
  );

  const loadTypes = async () => {
    const res = await axios.get("/api/component-types");
    setTypes(Array.isArray(res.data) ? res.data : []);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const addType = async () => {
    if (editId) {
      await axios.put(`/api/component-types/${editId}`, {
        name,
        order,
        icon: "",
      });
      alert("✅ Component Type Updated Successfully");
    } else {
      await axios.post("/api/component-types", { name, order, icon });
      alert("✅ Component Type Added Successfully");
    }
    setName("");
    setIcon("");
    setEditId(null);
    loadTypes();
  };

  const editType = (t) => {
    setName(t.name);
    setIcon(t.icon);
    setEditId(t._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteType = async (id) => {
    await axios.delete(`/api/component-types/${id}`);
    loadTypes();
  };

  return (
    <div className="admin-container">
      <h2>⚙️Add Component Type</h2>

      <div className="form-row">
        <input
          placeholder="Component Name (CPU, Mouse...)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIcon(e.target.files[0])}
        />

        <button className="btn-primary" disabled={!name} onClick={addType}>
          {" "}
          {editId ? "➕ Update" : "➕ Add"}{" "}
        </button>
      </div>
      <h3>Existing Types</h3>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Icon</th>
            <th>Component Types Add Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedTypes.map((t) => (
            <tr key={t._id}>
              <td>{types.indexOf(t) + 1}</td>
              <td>{t.name}</td>
              <td>{t.icon ? <img src={t.icon} alt={t.name} className="type-icon" /> : "No Icon"}</td>
              <td>
                {new Date(t.createdAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td>
                <button className="btn-edit" onClick={() => editType(t)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this type? This will also delete all components of this type.",
                      )
                    ) {
                      deleteType(t._id);
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
