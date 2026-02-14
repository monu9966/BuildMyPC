import { useEffect, useState } from "react";
import { useRef } from "react";


import {
  getUsers,
  deleteUser,
  getBuilds,
  deleteBuild,
} from "../services/adminApi";

import {
  getComponents,
  addComponent,
  updateComponent,
  deleteComponent,
} from "../services/componentApi";

function Admin() {
  const [users, setUsers] = useState([]);
  const [builds, setBuilds] = useState([]);

  const [stats, setStats] = useState({
    users: 0,
    builds: 0,
    revenue: 0,
  });

  const [components, setComponents] = useState([]);
  const [form, setForm] = useState({
    type: "",
    name: "",
    price: "",
    price: "",
    socket: "",
    ramType: "",
    watt: "",
    image: "",
  });

  const fileRef = useRef();
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    const u = await getUsers();
    const b = await getBuilds();
    const c = await getComponents();

    setComponents(c.data);
    setUsers(u.data);
    setBuilds(b.data);

    const totalRevenue = b.data.reduce((sum, item) => sum + item.totalPrice, 0);

    setStats({
      users: u.data.length,
      builds: b.data.length,
      revenue: totalRevenue,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    loadData();
  };

  const handleDeleteBuild = async (id) => {
    await deleteBuild(id);
    loadData();
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <h3>Components</h3>

      {/* ADD / EDIT FORM */}
      <div className="comp-form">
        <select
          value={form.type}
          onChange={(e) =>
            setForm({
              type: e.target.value,
              name: "",
              price: "",
              socket: "",
              ramType: "",
              watt: "",
            })
          }
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

        {(form.type === "Motherboard" || form.type === "CPU") && (
          <input
            placeholder="Socket (optional)"
            value={form.socket || ""}
            onChange={(e) => setForm({ ...form, socket: e.target.value })}
          />
        )}

        {form.type === "RAM" && (
          <input
            placeholder="RAM Type (e.g. DDR4)"
            value={form.ramType || ""}
            onChange={(e) => setForm({ ...form, ramType: e.target.value })}
          />
        )}

        {(form.type === "GPU" || form.type === "PSU") && (
          <input
            type="number"
            placeholder="Watt (optional)"
            value={form.watt || ""}
            onChange={(e) => setForm({ ...form, watt: e.target.value })}
          />
        )}

        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button
          onClick={async () => {
            try {
              // 🔹 UPDATE
              if (editingId) {
                const data = new FormData();
                Object.keys(form).forEach((key) => {
                  data.append(key, form[key]);
                });

                await updateComponent(editingId, data);
                alert("Component updated!");
                setEditingId(null);
              }

              // 🔹 ADD
              else {
                const data = new FormData();
                Object.keys(form).forEach((key) => {
                  data.append(key, form[key]);
                });

                await addComponent(data);
                alert("Component added!");
              }

              // 🔹 Reset Form
              setForm({
                type: "",
                name: "",
                price: "",
                socket: "",
                ramType: "",
                watt: "",
                image: "",
              });
              fileRef.current.value = "";
              loadData();
            } catch (err) {
              console.log(err);
              alert("Select all  adding component");
            }
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* TABLE */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {components.map((c) => (
            <tr key={c._id}>
              <td>{c.type}</td>
              <td>{c.name}</td>
              <td>₹{c.price}</td>
              <td>
                <button
                  onClick={() => {
                    setForm(c);
                    setEditingId(c._id);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmDelete = window.confirm("Are you sure?");
                    if (!confirmDelete) return;

                    await deleteComponent(c._id);
                    loadData();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>👥 Users</h4>
          <h2>{stats.users}</h2>
        </div>

        <div className="stat-card">
          <h4>🖥 Builds</h4>
          <h2>{stats.builds}</h2>
        </div>

        <div className="stat-card">
          <h4>💰 Revenue</h4>
          <h2>₹{stats.revenue}</h2>
        </div>
      </div>

      {/* USERS */}
      <h3>Users</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* BUILDS */}
      <h3>Builds</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Total Price</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {builds.map((b) => (
            <tr key={b._id}>
              <td>{b.userId?.name}</td>
              <td>₹{b.totalPrice}</td>
              <td>{new Date(b.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBuild(b._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
