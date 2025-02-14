import React, { useEffect, useState } from "react";
import { getAllProducts, deleteProduct } from "../../api/adminAPI";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import { toast } from "react-toastify";
import { API } from "../../environment";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            toast.error("Access Denied! Please log in.");
            navigate("/AdminLogin");
        } else {
            setIsAuthenticated(true);
            fetchProducts();
        }
    }, [navigate]);

    useEffect(() => {
        document.body.classList.add(styles.adminDashboard);
        return () => document.body.classList.remove(styles.adminDashboard);
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully!");
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product.");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        toast.success("Logged out successfully");
        navigate("/AdminLogin");
    };

    return (
        isAuthenticated && (
            <div className={styles.dashboardContainer}>
                <nav className={styles.navbar}>
                    <div className={styles.navLeft}>
                        <h2>Admin Panel</h2>
                    </div>
                    <div className={styles.navRight}>
                        <Link to="/admin/add-product" className={styles.addProductBtn}>Add Product</Link>
                        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                    </div>
                </nav>

                {loading ? (
                    <p className={styles.loadingText}>Loading products...</p>
                ) : (
                    <div className={styles.dashboardContent}>
                        <h3>Welcome, Admin!</h3>
                        <p>Manage your products efficiently from this panel.</p>

                        <div className={styles.productList}>
                            {products.length === 0 ? (
                                <p>No products yet. Click "Add Product" to start.</p>
                            ) : (
                                <table className={styles.productTable}>
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Gender</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <img src={`${API.BASE_URL}${product.image_url}`} alt={product.name} className={styles.productImage} />
                                                </td>
                                                <td>{product.name}</td>
                                                <td>{product.description}</td>
                                                <td>${product.price}</td>
                                                <td>{product.gender}</td>
                                                <td>
                                                    <Link to={`/admin/edit-product/${product.id}`} className={styles.editBtn}>Edit</Link>
                                                    <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>Delete</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default AdminDashboard;
