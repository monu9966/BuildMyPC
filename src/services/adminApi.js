import axios from "axios";

const API = "http://localhost:5000/api/admin";

// helper that looks for token either from localStorage key or stored user object
const token = () => {
  let t = localStorage.getItem("token");
  if (!t) {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      t = u?.token;
    } catch {}
  }
  return {
    headers: { Authorization: `Bearer ${t}` },
  };
};

export const getUsers = () =>
  axios.get(`${API}/users`, token());

export const deleteUser = (id) =>
  axios.delete(`${API}/users/${id}`, token());

export const getBuilds = () =>
  axios.get(`${API}/builds`, token());

export const deleteBuild = (id) =>
  axios.delete(`${API}/builds/${id}`, token());

// Admin: fetch all orders (admin-only route)
export const getOrders = () =>
  axios.get("http://localhost:5000/api/orders/admin/all", token());