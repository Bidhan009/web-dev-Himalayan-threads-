import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserProfile,
    getAllProductsForUsers,
    getProductsByCategory,
    addToCartAPI,
    getCartItems
} from "../../api/userAPI";
import { API } from "../../environment";
import styles from "./UserDashboard.module.css";
import { toast } from "react-toastify";
import {
    FaUserCircle,
    FaShoppingCart,
    FaSignOutAlt,
    FaHome,
    FaCaretDown
} from "react-icons/fa";
import Cart from "./Cart";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("home");
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showDropdown, setShowDropdown] = useState(false);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchUserProfile();
        fetchProducts();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const userData = await getUserProfile();
            if (userData) {
                setUser(userData);
                fetchCart(userData.userId);
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
            const productsData =
                category === "All"
                    ? await getAllProductsForUsers()
                    : await getProductsByCategory(category);
            setProducts(productsData);
        } catch (error) {
            toast.error("Failed to load products.");
        }
    };

    const fetchCart = async (userId) => {
        try {
            const cartItems = await getCartItems(userId);
            setCart(cartItems);
        } catch (error) {
            toast.error("Failed to load cart.");
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            toast.error("Please log in to add items to cart.");
            return;
        }

        try {
            await addToCartAPI(user.userId, product.id);
            const updatedCart = cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );

            if (!updatedCart.some(item => item.id === product.id)) {
                updatedCart.push({ ...product, quantity: 1 });
            }

            setCart(updatedCart);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error("Error adding product to cart.");
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <h2 className={styles.brand}>Himalayan Threads</h2>
                <button
                    onClick={() => setActiveTab("home")}
                    className={activeTab === "home" ? styles.active : ""}
                >
                    <FaHome size={20} /> Home
                </button>
                <button
                    onClick={() => setActiveTab("profile")}
                    className={activeTab === "profile" ? styles.active : ""}
                >
                    <FaUserCircle size={20} /> Profile
                </button>
                <button
                    onClick={() => setActiveTab("cart")}
                    className={activeTab === "cart" ? styles.active : ""}
                >
                    <FaShoppingCart size={20} /> My Cart ({cart.length})
                </button>
                <button
                    className={styles.logoutBtn}
                    onClick={() => {
                        localStorage.removeItem("userToken");
                        toast.success("Logged out successfully!");
                        navigate("/Login");
                    }}
                >
                    <FaSignOutAlt size={20} /> Logout
                </button>
            </aside>

            <main className={styles.content}>
                {activeTab === "home" && (
                    <section className={styles.homeSection}>
                        <div className={styles.homeHeader}>
                            <h3>Available Products</h3>
                            <div className={styles.dropdownContainer}>
                                <button
                                    className={styles.dropdownBtn}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    {selectedCategory} <FaCaretDown />
                                </button>
                                {showDropdown && (
                                    <div className={styles.dropdownMenu}>
                                        {["All", "Men", "Women", "Unisex"].map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => fetchProducts(category)}
                                                className={selectedCategory === category ? styles.selectedCategory : ""}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.productGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard}>
                                    <img src={`${API.BASE_URL}${product.image_url}`} alt={product.name} className={styles.productImage} />
                                    <h4>{product.name}</h4>
                                    <p className={styles.productDescription}>{product.description}</p>
                                    <p className={styles.productPrice}><strong>${product.price}</strong></p>
                                    <button
                                        className={styles.addToCartBtn}
                                        onClick={() => addToCart(product)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "cart" && <Cart cart={cart} setCart={setCart} user={user} />}
                {activeTab === "profile" && <UserProfile user={user} />}
            </main>
        </div>
    );
};

export default UserDashboard;
