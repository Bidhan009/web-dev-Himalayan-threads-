import React from "react";
import styles from "./Cart.module.css";

const Cart = ({ cart }) => {
    return (
        <section className={styles.cartSection}>
            <h3>My Cart</h3>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className={styles.cartGrid}>
                    {cart.map((product, index) => (
                        <div key={index} className={styles.cartItem}>
                            <img src={product.image_url} alt={product.name} />
                            <div>
                                <h4>{product.name}</h4>
                                <p><strong>${product.price}</strong></p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Cart;
