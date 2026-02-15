import { useState } from "react";

export default function AdminLayout({
  dashboard,
  components,
  users,
  builds,
}) {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <div className="admin-sidebar">
        <h2 className="logo">BuildMyPC</h2>

        <button onClick={() => setTab("dashboard")}>📊 Dashboard</button>
        <button onClick={() => setTab("components")}>🧩 Components</button>
        <button onClick={() => setTab("users")}>👥 Users</button>
        <button onClick={() => setTab("builds")}>🖥 Builds</button>
      </div>

      {/* CONTENT */}
      <div className="admin-content">
        {tab === "dashboard" && dashboard}
        {tab === "components" && components}
        {tab === "users" && users}
        {tab === "builds" && builds}
      </div>
    </div>
  );
}
