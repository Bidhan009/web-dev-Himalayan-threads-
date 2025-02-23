import React from "react";
import styles from "./Cart.module.css";
import { FaTimes } from "react-icons/fa";

const Cart = ({ cart, setCart }) => {
    const removeFromCart = (index) => {
        setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    };

    return (
        <section className={styles.cartSection}>
            <h3>My Cart</h3>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                cart.map((product, index) => (
                    <div key={index} className={styles.cartItem}>
                        <img src={product.image_url} alt={product.name} />
                        <div className={styles.cartInfo}>
                            <h4>{product.name}</h4>
                            <p><strong>${product.price}</strong></p>
                        </div>
                        <button 
                            className={styles.removeBtn} 
                            onClick={() => removeFromCart(index)}
                        >
                            <FaTimes />
                        </button>
                    </div>
                ))
            )}
        </section>
    );
};

export default Cart;
