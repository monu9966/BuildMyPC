import { useState } from "react";
import AdminNavbar from "../components/admin/AdminNavbar";

export default function AdminLayout({
  dashboard,
  components,
  componentTypes,
  users,
  builds,
  orders,
}) {
  const [tab, setTab] = useState("dashboard");
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-layout">
      <AdminNavbar />
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className="admin-main">
        <div className={`admin-sidebar ${open ? "show" : ""}` }>
          <button className={tab === "dashboard" ? "active" : ""} onClick={() => {setTab("dashboard"); setOpen(false);}}><span>📊 Dashboard</span></button>
          <button className={tab === "components" ? "active" : ""} onClick={() => {setTab("components"); setOpen(false);}}><span>🧩 Components</span></button>
          <button className={tab === "componentTypes" ? "active" : ""} onClick={() => {setTab("componentTypes"); setOpen(false);}}>
            <span>⚙️ Component Types</span>
          </button>
          <button className={tab === "users" ? "active" : ""} onClick={() => {setTab("users"); setOpen(false);}}><span>👥 Users</span></button>
          <button className={tab === "orders" ? "active" : ""} onClick={() => {setTab("orders"); setOpen(false);}}><span>📦 Orders</span></button>
          <button className={tab === "builds" ? "active" : ""} onClick={() => {setTab("builds"); setOpen(false);}}><span>🖥 Builds</span></button>
        </div>

        <div className="admin-content">
          {tab === "dashboard" && dashboard}
          {tab === "components" && components}
          {tab === "componentTypes" && componentTypes}
          {tab === "users" && users}
          {tab === "builds" && builds}
          {tab === "orders" && orders}
        </div>
      </div>
    </div>
  );
}
