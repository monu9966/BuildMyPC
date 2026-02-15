import { useState, useEffect } from "react";
import { getBuilds, getUsers } from "../../services/adminApi";
import { getComponents } from "../../services/componentApi";

export default function DashboardAdmin({ dashboard = [], refresh }) {
    const [stats, setStats] = useState({
        users: 0,
        builds: 0,
        revenue: 0,
    });

  
    const loadData = async () => {
      try {
        const u = await getUsers();
        const b = await getBuilds();
        const c = await getComponents();

        const totalRevenue = b.data.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

        setStats({
          users: Array.isArray(u.data) ? u.data.length : 0,
          builds: Array.isArray(b.data) ? b.data.length : 0,
          revenue: totalRevenue,
        });
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      }
    };

    useEffect(() => {
      loadData();
    }, [refresh]);

  return (
    <>
      <h2>Welcome Admin 👑</h2>
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
    </>
  );
}
