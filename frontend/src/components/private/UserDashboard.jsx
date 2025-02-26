import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getUserProfile,
    getAllProductsForUsers,
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
    FaHome
} from "react-icons/fa";
import Cart from "./Cart";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("home");
    const [products, setProducts] = useState([]);
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
                fetchCart(userData.userId);
            } else {
                toast.error("Failed to load user profile.");
            }
        } catch (error) {
            toast.error("Failed to load user profile.");
        }
    };

    const fetchProducts = async () => {
        try {
            const productsData = await getAllProductsForUsers();
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
            setCart([...cart, product]);
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
                        <h3>Available Products</h3>
                        <div className={styles.productGrid}>
                            {products.map((product) => (
                                <div key={product.id} className={styles.productCard} onClick={() => setSelectedProduct(product)}>
                                    <img 
                                        src={`${API.BASE_URL}${product.image_url}`} 
                                        alt={product.name} 
                                        className={styles.fullProductImage}
                                    />
                                    <h4>{product.name}</h4>
                                    <p className={styles.productPrice}><strong>${product.price}</strong></p>
                                    <button
                                        className={styles.addToCartBtn}
                                        onClick={(e) => {e.stopPropagation(); addToCart(product);}}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {selectedProduct && (
                    <div className={styles.productModal} onClick={() => setSelectedProduct(null)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <img src={`${API.BASE_URL}${selectedProduct.image_url}`} alt={selectedProduct.name} />
                            <h2>{selectedProduct.name}</h2>
                            <p>{selectedProduct.description}</p>
                            <p><strong>Price: ${selectedProduct.price}</strong></p>
                            <button className={styles.addToCartBtn} onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
                            <button className={styles.closeBtn} onClick={() => setSelectedProduct(null)}>Close</button>
                        </div>
                    </div>
                )}
                {activeTab === "cart" && <Cart cart={cart} setCart={setCart} user={user} />}
                {activeTab === "profile" && <UserProfile user={user} />}
            </main>
        </div>
    );
};

export default UserDashboard;
