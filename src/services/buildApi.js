import axios from "axios";

const API = "http://localhost:5000/api/builds";

export const saveBuild = (data) =>
  axios.post(`${API}/save`, data, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

export const getMyBuilds = () =>
  axios.get(`${API}/my`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
