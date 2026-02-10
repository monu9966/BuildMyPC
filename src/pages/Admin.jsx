import { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  getBuilds,
  deleteBuild,
} from "../services/adminApi";

function Admin() {
  const [users, setUsers] = useState([]);
  const [builds, setBuilds] = useState([]);

  const [stats, setStats] = useState({
    users: 0,
    builds: 0,
    revenue: 0,
  });

  const loadData = async () => {
    const u = await getUsers();
    const b = await getBuilds();

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
