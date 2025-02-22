import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateProfilePicture, getAllProductsForUsers, getProductsByCategory } from "../../api/userAPI";
import { API } from "../../environment";  
import styles from "./UserDashboard.module.css";
import { toast } from "react-toastify";
import { FaUserCircle, FaShoppingCart, FaSignOutAlt, FaHome, FaCamera, FaCaretDown, FaTimes } from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState("home");
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showDropdown, setShowDropdown] = useState(false);
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchUserProfile();
        fetchProducts();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userData = await getUserProfile();
            if (userData) {
                setUser(userData);
            } else {
                toast.error("Failed to load user profile.");
            }
        } catch (error) {
            toast.error("Failed to load user profile.");
        }
    };

    const fetchProducts = async (category = "All") => {
        try {
            setSelectedCategory(category);
            setShowDropdown(false);
            const productsData = category === "All" ? await getAllProductsForUsers() : await getProductsByCategory(category);
            setProducts(productsData);
        } catch (error) {
            toast.error("Failed to load products.");
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <h2 className={styles.brand}>Himalayan Threads</h2>
                <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? styles.active : ""}>
                    <FaHome size={20} /> Home
                </button>
                <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? styles.active : ""}>
                    <FaUserCircle size={20} /> Profile
                </button>
                <button onClick={() => setActiveTab("cart")} className={activeTab === "cart" ? styles.active : ""}>
                    <FaShoppingCart size={20} /> My Cart ({cart.length})
                </button>
                <button className={styles.logoutBtn} onClick={() => {
                    localStorage.removeItem("userToken");
                    toast.success("Logged out successfully!");
                    navigate("/Login");
                }}>
                    <FaSignOutAlt size={20} /> Logout
                </button>
            </aside>

            <main className={styles.content}>
                {activeTab === "home" && (
                    <section className={styles.homeSection}>
                        <div className={styles.homeHeader}>
                            <h3>Available Products</h3>
                            <div className={styles.dropdownContainer}>
                                <button className={styles.dropdownBtn} onClick={() => setShowDropdown(!showDropdown)}>
                                    {selectedCategory} <FaCaretDown />
                                </button>
                                {showDropdown && (
                                    <div className={styles.dropdownMenu}>
                                        <button onClick={() => fetchProducts("All")} className={selectedCategory === "All" ? styles.selectedCategory : ""}>All</button>
                                        <button onClick={() => fetchProducts("Men")} className={selectedCategory === "Men" ? styles.selectedCategory : ""}>Men</button>
                                        <button onClick={() => fetchProducts("Women")} className={selectedCategory === "Women" ? styles.selectedCategory : ""}>Women</button>
                                        <button onClick={() => fetchProducts("Unisex")} className={selectedCategory === "Unisex" ? styles.selectedCategory : ""}>Unisex</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.productGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <img src={`${API.BASE_URL}${product.image_url}`} alt={product.name} />
                                    <h4>{product.name}</h4>
                                    <p>{product.description}</p>
                                    <p><strong>${product.price}</strong></p>
                                    <button className={styles.addToCartBtn}>
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
