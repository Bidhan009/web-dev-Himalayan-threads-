import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateProfilePicture, getAllProductsForUsers, getProductsByCategory } from "../../api/userAPI";
import { API } from "../../environment";  // ✅ Ensure API is imported correctly
import styles from "./UserDashboard.module.css";
import { toast } from "react-toastify";
import { FaUserCircle, FaShoppingCart, FaSignOutAlt, FaHome, FaCamera, FaCaretDown } from "react-icons/fa";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState("home");
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchUserProfile();
        fetchProducts();
    }, []);

    // ✅ Fetch User Profile
    const fetchUserProfile = async () => {
        try {
            console.log("📌 Fetching user profile...");
            const userData = await getUserProfile();
            if (userData) {
                console.log("✅ User Profile Loaded:", userData);
                setUser(userData);
            } else {
                console.warn("⚠️ No user data received.");
                toast.error("Failed to load user profile.");
            }
        } catch (error) {
            console.error("❌ Error fetching user profile:", error);
            toast.error("Failed to load user profile.");
        }
    };

    // ✅ Fetch Products (All or Category)
    const fetchProducts = async (category = "all") => {
        try {
            console.log(`📌 Fetching products in category: ${category}`);
            const productsData = category === "all" ? await getAllProductsForUsers() : await getProductsByCategory(category);

            if (productsData.length > 0) {
                console.log("✅ Products Loaded:", productsData);
                setProducts(productsData);
            } else {
                console.warn("⚠️ No products available.");
                setProducts([]);
                toast.info("No products available.");
            }
        } catch (error) {
            console.error("❌ Error fetching products:", error);
            toast.error("Failed to load products.");
        }
    };

    // ✅ Handle Profile Picture Update
    const handleProfilePictureChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                console.log("📌 Uploading new profile picture...");
                const formData = new FormData();
                formData.append("profilePic", file);
                await updateProfilePicture(formData);
                toast.success("Profile picture updated successfully!");
                fetchUserProfile();
            } catch (error) {
                console.error("❌ Error updating profile picture:", error);
                toast.error("Failed to update profile picture.");
            }
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* ✅ Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <h2 className={styles.brand}>Himalayan Threads</h2>
                <button onClick={() => setActiveTab("home")} className={activeTab === "home" ? styles.active : ""}>
                    <FaHome size={20} /> Home
                </button>
                <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? styles.active : ""}>
                    <FaUserCircle size={20} /> Profile
                </button>
                <button onClick={() => setActiveTab("cart")} className={activeTab === "cart" ? styles.active : ""}>
                    <FaShoppingCart size={20} /> My Cart
                </button>
                <button className={styles.logoutBtn} onClick={() => {
                    localStorage.removeItem("userToken");
                    toast.success("Logged out successfully!");
                    navigate("/Login");
                }}>
                    <FaSignOutAlt size={20} /> Logout
                </button>
            </aside>

            {/* ✅ Main Content */}
            <main className={styles.content}>
                {activeTab === "home" && (
                    <section className={styles.homeSection}>
                        <div className={styles.homeHeader}>
                            <h3>Available Products</h3>

                            {/* ✅ Category Dropdown */}
                            <div className={styles.dropdown}>
                                <button className={styles.dropdownBtn} onClick={() => setShowDropdown(!showDropdown)}>
                                    Category <FaCaretDown />
                                </button>
                                {showDropdown && (
                                    <div className={styles.dropdownContent}>
                                        <button onClick={() => fetchProducts("all")}>All</button>
                                        <button onClick={() => fetchProducts("Men")}>Men</button>
                                        <button onClick={() => fetchProducts("Women")}>Women</button>
                                        <button onClick={() => fetchProducts("Unisex")}>Unisex</button>
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
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "profile" && (
                    <section className={styles.profileSection}>
                        <h3>My Profile</h3>
                        <div className={styles.profilePicture}>
                            <img src={user.profilePic ? `${API.BASE_URL}${user.profilePic}` : "/default-profile.png"} alt="Profile" />
                            <label className={styles.uploadIcon}>
                                <FaCamera size={20} />
                                <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                            </label>
                        </div>
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Address:</strong> {user.address}</p>
                    </section>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
