import axios from "axios";

const API = "http://localhost:5000/api/orders";

export const placeCOD = (data) =>
    axios.post(`${API}/cod`, data, {
        headers: { Authorization: localStorage.getItem("token") }
    });