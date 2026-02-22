import { useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout({
  dashboard,
  components,
  users,
  builds,
  orders,
}) {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="admin-layout">
      {/* NAVBAR */}
      <AdminNavbar />

      {/* SIDEBAR + CONTENT WRAPPER */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* SIDEBAR */}
        <div className="admin-sidebar">
          <button onClick={() => setTab("dashboard")}>📊 Dashboard</button>
          <button onClick={() => setTab("components")}>🧩 Components</button>
          <button onClick={() => setTab("users")}>👥 Users</button>
          <button onClick={() => setTab("builds")}>🖥 Builds</button>
          <button onClick={() => setTab("orders")}>📦 Orders</button>
        </div>

        {/* CONTENT */}
        <div className="admin-content">
          {tab === "dashboard" && dashboard}
          {tab === "components" && components}
          {tab === "users" && users}
          {tab === "builds" && builds}
          {tab === "orders" && orders}
        </div>
      </div>
    </div>
  );
}
