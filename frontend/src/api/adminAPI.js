import axios from "axios";
import { API } from "../environment"; 

// ✅ Function to retrieve admin token & set headers
const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        throw new Error("❌ Admin token is missing. Please log in again.");
    }

    let headers = { Authorization: `Bearer ${token}` };
    headers["Content-Type"] = isMultipart ? "multipart/form-data" : "application/json";

    return headers;
};

// ✅ Fetch All Products
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${API.BASE_URL}/api/admin/products`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(
            `❌ Error fetching products (Status: ${error.response?.status}):`, 
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

// ✅ Add a New Product
export const addProduct = async (formData) => {
    try {
        const response = await axios.post(`${API.BASE_URL}/api/admin/products`, formData, {
            headers: getAuthHeaders(true),
        });
        return response.data;
    } catch (error) {
        console.error(
            `❌ Error adding product (Status: ${error.response?.status}):`, 
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

// ✅ Fetch Single Product by ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${API.BASE_URL}/api/admin/products/${id}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error(
            `❌ Error fetching product (Status: ${error.response?.status}):`, 
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

// ✅ Update Product
export const updateProduct = async (id, formData) => {
    try {
        const response = await axios.put(`${API.BASE_URL}/api/admin/products/${id}`, formData, {
            headers: getAuthHeaders(true),
        });
        return response.data;
    } catch (error) {
        console.error(
            `❌ Error updating product (Status: ${error.response?.status}):`, 
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};

// ✅ Delete Product
export const deleteProduct = async (id) => {
    try {
        await axios.delete(`${API.BASE_URL}/api/admin/products/${id}`, {
            headers: getAuthHeaders(),
        });
        return true;
    } catch (error) {
        console.error(
            `❌ Error deleting product (Status: ${error.response?.status}):`, 
            error.response?.data || error.message
        );
        throw error.response?.data || error;
    }
};
