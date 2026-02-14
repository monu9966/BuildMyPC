import axios from "axios";

const API = "http://localhost:5000/api/components";

export const getComponents = (type) => {
  if (!type) return axios.get(API);
  return axios.get(`${API}?type=${type}`);
};
export const addComponent = (data) =>
  axios.post(API, data, {
    headers: { "Content-Type": "multipart/form-data", },
  });
export const updateComponent = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteComponent = (id) => axios.delete(`${API}/${id}`);
