import axios from "axios";

const API = "http://localhost:5000/api/admin";

const token = () => ({
  headers: { Authorization: localStorage.getItem("token") },
});

export const getUsers = () =>
  axios.get(`${API}/users`, token());

export const deleteUser = (id) =>
  axios.delete(`${API}/users/${id}`, token());

export const getBuilds = () =>
  axios.get(`${API}/builds`, token());

export const deleteBuild = (id) =>
  axios.delete(`${API}/builds/${id}`, token());
