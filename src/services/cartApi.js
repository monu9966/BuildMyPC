import axios from "axios";

const API = "http:/localhost:5000/api/cart";

export const saveCart = (data) =>
    axios.post(`${API}/save`, data);

export const getCart = (userId) =>
    axios.get(`${API}/${userId}`);