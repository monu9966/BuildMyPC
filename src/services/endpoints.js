import { API } from "./api";

/* AUTH */
export const loginUser = (data) =>
  API.post("/auth/login", data).then((res) => res.data);
export const registerUser = (data) =>
  API.post("/auth/register", data).then((res) => res.data);

/* USERS */
export const getUsers = () => API.get("/admin/users");
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

/* COMPONENTS */
export const getComponents = () => API.get("/components");
export const addComponent = (data) => API.post("/components", data);
export const updateComponent = (id, data) => API.put(`/components/${id}`, data);
export const deleteComponent = (id) => API.delete(`/components/${id}`);

/* COMPONENT TYPES */
export const getComponentTypes = () => API.get("/component-types");
export const addComponentType = (data) => API.post("/component-types", data);
export const updateComponentType = (id, data) =>
  API.put(`/component-types/${id}`, data);
export const deleteComponentType = (id) => API.delete(`/component-types/${id}`);

/* BUILDS */
export const getBuilds = () => API.get("/builds/my");
export const getMyBuilds = () => API.get("/builds/admin/all");
export const saveBuild = (data) => API.post("/builds", data);
export const deleteBuild = (id) => API.delete(`/builds/${id}`);

/* ORDERS */
export const getOrders = () => API.get("/orders/admin/all");
export const placeCODOrder = (data) => API.post("/orders/cod", data);

/* CART */
export const getCart = () => API.get("/cart");
export const saveCart = (data) => API.post("/cart", data);
export const removeFromCart = (id) => API.delete(`/cart/${id}`);

// Add this to api.js
export const fetchSearchResults = async (query) => {
    try {
        // This hits your backend search route
        const response = await API.get(`/components/search?q=${query}`);
        return await response.data;
    } catch (error) {
        console.error("Search fetch error:", error);
        return [];
    }
};

export const fetchProductById = (id) => 
  API.get(`/components/${id}`).then(res => res.data);