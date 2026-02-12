import axios from "axios";

const API = "http://localhost:5000/api/components";

export const getComponents = () => axios.get(API);
export const addComponent = (data) => axios.post(API, data);
export const updateComponent = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteComponent = (id) => axios.delete(`${API}/${id}`);