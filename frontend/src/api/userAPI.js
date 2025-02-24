import axios from "axios";
import { API } from "../environment"; 

const getAuthHeaders = (isMultipart = false) => {
    const token = localStorage.getItem("userToken");

    if (!token) {
        console.error("❌ User token is missing. Please log in.");
        throw new Error("User token is missing. Please log in.");
    }

    console.log("📌 Sending Token in Request:", token);

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    };
};

// ✅ Fetch All Products
export const getAllProductsForUsers = async () => {
    try {
        console.log("📌 Fetching all products...");
        const response = await axios.get(`${API.BASE_URL}/api/user/products`);
        
        if (response.data && response.data.data) {
            console.log("✅ Products Fetched:", response.data.data);
            return response.data.data;
        } else {
            console.warn("⚠️ No products found.");
            return [];
        }
    } catch (error) {
        console.error("❌ Error fetching products:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Fetch Products by Category
export const getProductsByCategory = async (category) => {
    try {
        console.log(`📌 Fetching products in category: ${category}`);
        const response = await axios.get(`${API.BASE_URL}/api/user/products`, {
            params: { category },
        });

        if (response.data && response.data.data) {
            console.log(`✅ Products Fetched for ${category}:`, response.data.data);
            return response.data.data;
        } else {
            console.warn("⚠️ No products found for the selected category.");
            return [];
        }
    } catch (error) {
        console.error(`❌ Error fetching products for ${category}:`, error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Fetch User Profile
// ✅ Fetch User Profile
export const getUserProfile = async () => {
    try {
        console.log("📌 Fetching user profile...");
        const response = await axios.get(`${API.BASE_URL}/api/user/profile`, {
            headers: getAuthHeaders(),
        });

        if (response.data && response.data.data) {
            console.log("✅ User Profile Data:", response.data.data);
            return response.data.data;
        } else {
            console.warn("⚠️ No user profile data found.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error fetching user profile:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};



// ✅ Update User Profile
export const updateUserProfile = async (formData) => {
    try {
        console.log("📌 Updating user profile...");
        const response = await axios.put(`${API.BASE_URL}/api/user/profile`, formData, {
            headers: getAuthHeaders(),
        });
        console.log("✅ Profile Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating user profile:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Update Profile Picture
export const updateProfilePicture = async (formData) => {
    try {
        console.log("📌 Updating profile picture...");
        const response = await axios.put(`${API.BASE_URL}/api/user/profile/picture`, formData, {
            headers: getAuthHeaders(true),
        });
        console.log("✅ Profile Picture Updated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error updating profile picture:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/* ──────────────────────────────────────────── */
/* 🔥 CART API FUNCTIONS ADDED BELOW */
/* ──────────────────────────────────────────── */

// ✅ Add Product to Cart
export const addToCartAPI = async (userId, productId) => {
    try {
        console.log(`📌 Adding product ${productId} to cart for user ${userId}...`);
        const response = await axios.post(`${API.BASE_URL}/api/cart/add`, {
            user_id: userId,
            product_id: productId
        }, {
            headers: getAuthHeaders()
        });

        console.log("✅ Product added to cart:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error adding to cart:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Fetch User's Cart
export const getCartItems = async (userId) => {
    try {
        console.log(`📌 Fetching cart items for user ${userId}...`);
        const response = await axios.get(`${API.BASE_URL}/api/cart/${userId}`, {
            headers: getAuthHeaders()
        });

        if (response.data) {
            console.log("✅ Cart Items:", response.data);
            return response.data;
        } else {
            console.warn("⚠️ No cart items found.");
            return [];
        }
    } catch (error) {
        console.error("❌ Error fetching cart:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Remove Product from Cart
// ✅ Remove a product from the cart
export const removeFromCartAPI = async (user_id, product_id) => {
    try {
        console.log(`📌 Removing product ${product_id} from cart for user ${user_id}...`);
        const response = await axios.delete(`${API.BASE_URL}/api/cart/remove/${user_id}/${product_id}`, {
            headers: getAuthHeaders(),
        });
        console.log("✅ Product removed from cart:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Error removing from cart:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

// ✅ Update Product Quantity in Cart
export const updateCartQuantityAPI = async (user_id, product_id, action) => {
    try {
        console.log(`📌 Updating quantity: ${action} for product ${product_id}`);
        const response = await axios.patch(`${API.BASE_URL}/api/cart/update-quantity`, {
            user_id,
            product_id,
            action
        }, {
            headers: getAuthHeaders(),
        });

        console.log("✅ Cart quantity updated:", response.data);
        return response.data.newQuantity;
    } catch (error) {
        console.error("❌ Error updating cart quantity:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};
