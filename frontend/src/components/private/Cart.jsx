import React, { useEffect } from "react";
import { getCartItems, removeFromCartAPI, updateCartQuantityAPI } from "../../api/userAPI";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import styles from "./Cart.module.css";
import { toast } from "react-toastify";

const Cart = ({ cart, setCart, user }) => {
    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        if (!user.userId) return;
        try {
            const cartItems = await getCartItems(user.userId);
            setCart(cartItems);
        } catch (error) {
            console.error("Error fetching cart");
        }
    };

    const updateQuantity = async (productId, action) => {
        try {
            const newQuantity = await updateCartQuantityAPI(user.userId, productId, action);
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        } catch (error) {
            toast.error("Failed to update quantity");
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await removeFromCartAPI(user.userId, productId);
            setCart(cart.filter((item) => item.id !== productId));
            toast.success("Product removed from cart.");
        } catch (error) {
            toast.error("Error removing product from cart.");
        }
    };

    return (
        <div className={styles.cartContainer}>
            <h3 className={styles.cartTitle}>🛒 My Shopping Cart</h3>
            {cart.length === 0 ? (
                <p className={styles.emptyCart}>Your cart is empty.</p>
            ) : (
                <div className={styles.cartList}>
                    {cart.map((product) => (
                        <div key={product.id} className={styles.cartItem}>
                            {/* ✅ Product Image */}
                            <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className={styles.productImage}
                                onError={(e) => e.target.src = "/default-image.png"}
                            />

                            {/* ✅ Product Details */}
                            <div className={styles.productInfo}>
                                <h4 className={styles.productName}>{product.name}</h4>
                                <p className={styles.productPrice}>💰 ${product.price}</p>
                                <p className={styles.productQuantity}><strong>Quantity:</strong> {product.quantity}</p>

                                {/* ✅ Quantity Controls (Functional) */}
                                <div className={styles.quantityControls}>
                                    <button 
                                        className={styles.qtyBtn} 
                                        onClick={() => updateQuantity(product.id, "decrease")}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span>{product.quantity}</span>
                                    <button 
                                        className={styles.qtyBtn} 
                                        onClick={() => updateQuantity(product.id, "increase")}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                            </div>

                            {/* ✅ Remove Button */}
                            <button className={styles.removeBtn} onClick={() => removeFromCart(product.id)}>
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cart;
