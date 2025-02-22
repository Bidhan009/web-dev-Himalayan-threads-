import React, { useEffect, useState } from "react";
import { getAllProductsForUsers, getProductsByCategory } from "../../api/userAPI";
import { API } from "../../environment";
import styles from "./Home.module.css";
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = ({ addToCart }) => {
    const [products, setProducts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async (category = "all") => {
        const productsData = category === "all" ? await getAllProductsForUsers() : await getProductsByCategory(category);
        setProducts(productsData);
    };

    return (
        <section className={styles.homeSection}>
            <div className={styles.homeHeader}>
                <h3>Available Products</h3>
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
                    <div key={product.id} className={styles.productCard} onClick={() => navigate(`/product/${product.id}`)}>
                        <img src={`${API.BASE_URL}${product.image_url}`} alt={product.name} />
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <p><strong>${product.price}</strong></p>
                        <button className={styles.addToCartBtn} onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Home;
