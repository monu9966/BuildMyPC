
import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import DashboardAdmin from "../components/admin/DashboardAdmin";
import ComponentsAdmin from "../components/admin/ComponentsAdmin";
import UsersAdmin from "../components/admin/UsersAdmin";
import BuildsAdmin from "../components/admin/BuildsAdmin";
import { getComponents } from "../services/componentApi";
import { getUsers, getBuilds } from "../services/adminApi";

export default function Admin() {
  const [dashboard, setDashboard] = useState([]);
  const [components, setComponents] = useState([]);
  const [users, setUsers] = useState([]);
  const [builds, setBuilds] = useState([]);

  const loadData = async () => {
    try {
      const [cRes, uRes, bRes] = await Promise.all([
        getComponents(),
        getUsers(),
        getBuilds(),
      ]);

      setComponents(cRes.data || []);
      setUsers(uRes.data || []);
      setBuilds(bRes.data || []);
    } catch (err) {
      console.error("Admin loadData error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout
      dashboard={<DashboardAdmin dashboard={dashboard} refresh={loadData} />}
      components={<ComponentsAdmin components={components} refresh={loadData} />}
      users={<UsersAdmin users={users} refresh={loadData} />}
      builds={<BuildsAdmin builds={builds} refresh={loadData} />}
    />
  );
}
