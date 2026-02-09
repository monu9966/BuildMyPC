import { useEffect, useState } from "react";
import axios from "axios";

function Admin() {
  const [users, setUsers] = useState([]);
  const [builds, setBuilds] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/admin/users", {
      headers: { Authorization: token },
    }).then(res => setUsers(res.data));

    axios.get("http://localhost:5000/api/admin/builds", {
      headers: { Authorization: token },
    }).then(res => setBuilds(res.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Users</h3>
      {users.map(u => (
        <p key={u._id}>{u.name} - {u.email}</p>
      ))}

      <h3>Builds</h3>
      {builds.map(b => (
        <p key={b._id}>₹{b.totalPrice}</p>
      ))}
    </div>
  );
}

export default Admin;
