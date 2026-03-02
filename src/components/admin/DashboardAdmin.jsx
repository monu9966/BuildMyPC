import { useState, useEffect } from "react";
import {
  getUsers,
  getOrders,
  getBuilds,
  getComponentTypes,
  getComponents,
} from "../../services/endpoints";

export default function DashboardAdmin({ dashboard = [], refresh }) {
  const [stats, setStats] = useState({
    users: 0,
    componentTypes: 0,
    components: 0,
    orders: 0,
    builds: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [u, o, b, c, t] = await Promise.all([
        getUsers(),
        getOrders(),
        getBuilds(),
        getComponents(),
        getComponentTypes(),
      ]);

      const users = Array.isArray(u.data) ? u.data.length : 0;
      const orders = Array.isArray(o.data) ? o.data.length : 0;
      const builds = Array.isArray(b.data) ? b.data.length : 0;
      const components = Array.isArray(c.data) ? c.data.length : 0;
      const componentTypes = Array.isArray(t.data) ? t.data.length : 0;

      const revenue = Array.isArray(o.data)
        ? o.data.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
        : 0;

      setStats({
        users,
        orders,
        builds,
        components,
        componentTypes,
        revenue,
      });

      setError("");
    } catch (err) {
      console.error("admin dashboard data load Error:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  if (loading) return <h3>Loading dashboard...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="admin-container">
      <h2>Welcome Admin 👑</h2>

      <div className="stats-grid">
        <Stat title="👥 Users" value={stats.users} />
        <Stat title="📦 Orders" value={stats.orders} />
        <Stat title="🖥 Builds" value={stats.builds} />
        <Stat title="🧩 Components" value={stats.components} />
        <Stat title="⚙️ Component Types" value={stats.componentTypes} />
        <Stat title="💰 Revenue" value={`₹${stats.revenue}`} />
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="stat-card">
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

