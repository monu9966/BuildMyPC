import axios from "axios";

const API = "http://localhost:5000/api/orders";

export const placeCODOrder = (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
        return Promise.reject(new Error("No authentication token available"));
    }
    return axios.post(`${API}/cod`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const getOrders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        return Promise.reject(new Error("No authentication token available"));
    }
    return axios.get(`${API}/myorders`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};