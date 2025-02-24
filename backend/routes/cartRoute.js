const express = require("express");
const router = express.Router();
const { sequelize } = require("../database/db"); // ✅ Import Sequelize
const { QueryTypes } = require("sequelize");

// ✅ GET: Fetch User's Cart Items
router.get("/:user_id", async (req, res) => {
    try {
        const { user_id } = req.params;
        const API_BASE_URL = "http://localhost:5000"; // Update if running on a different domain

        const cartItems = await sequelize.query(
            `SELECT p.id, p.name, p.price, 
                CONCAT(:API_BASE_URL, p.image_url) AS image_url, 
                c.quantity 
             FROM cart c 
             JOIN "Products" p ON c.product_id = p.id 
             WHERE c.user_id = :user_id`,
            {
                replacements: { user_id, API_BASE_URL },
                type: QueryTypes.SELECT,
            }
        );

        res.json(cartItems);
    } catch (err) {
        console.error("❌ Error fetching cart:", err);
        res.status(500).json({ error: "Failed to fetch cart items" });
    }
});



// ✅ POST: Add Product to Cart
router.post("/add", async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        if (!user_id || !product_id) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        // Check if product exists
        const productCheck = await sequelize.query(
            `SELECT id FROM "Products" WHERE id = :product_id`,
            {
                replacements: { product_id },
                type: QueryTypes.SELECT,
            }
        );

        if (productCheck.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if item is already in cart
        const existingCartItem = await sequelize.query(
            `SELECT * FROM cart WHERE user_id = :user_id AND product_id = :product_id`,
            {
                replacements: { user_id, product_id },
                type: QueryTypes.SELECT,
            }
        );

        if (existingCartItem.length > 0) {
            // If item exists, update quantity
            await sequelize.query(
                `UPDATE cart SET quantity = quantity + 1 WHERE user_id = :user_id AND product_id = :product_id`,
                {
                    replacements: { user_id, product_id },
                    type: QueryTypes.UPDATE,
                }
            );
            res.json({ message: "Product quantity updated in cart" });
        } else {
            // If new item, insert it
            await sequelize.query(
                `INSERT INTO cart (user_id, product_id, quantity) VALUES (:user_id, :product_id, 1)`,
                {
                    replacements: { user_id, product_id },
                    type: QueryTypes.INSERT,
                }
            );
            res.json({ message: "Product added to cart" });
        }
    } catch (err) {
        console.error("❌ Error adding to cart:", err);
        res.status(500).json({ error: "Failed to add product to cart" });
    }
});

router.delete("/remove/:user_id/:product_id", async (req, res) => {
    try {
        const { user_id, product_id } = req.params;

        if (!user_id || !product_id) {
            return res.status(400).json({ error: "User ID and Product ID are required" });
        }

        // Check if item exists in cart before deleting
        const cartItem = await sequelize.query(
            `SELECT * FROM cart WHERE user_id = :user_id AND product_id = :product_id`,
            {
                replacements: { user_id, product_id },
                type: QueryTypes.SELECT,
            }
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        // Remove item from cart
        await sequelize.query(
            `DELETE FROM cart WHERE user_id = :user_id AND product_id = :product_id`,
            {
                replacements: { user_id, product_id },
                type: QueryTypes.DELETE,
            }
        );

        res.json({ message: "Product removed from cart" });
    } catch (err) {
        console.error("❌ Error removing from cart:", err);
        res.status(500).json({ error: "Failed to remove product from cart" });
    }
});

// ✅ PATCH: Update Product Quantity in Cart
router.patch("/update-quantity", async (req, res) => {
    try {
        const { user_id, product_id, action } = req.body;

        if (!user_id || !product_id || !["increase", "decrease"].includes(action)) {
            return res.status(400).json({ error: "Invalid request parameters" });
        }

        // Check if item exists in cart
        const cartItem = await sequelize.query(
            `SELECT quantity FROM cart WHERE user_id = :user_id AND product_id = :product_id`,
            {
                replacements: { user_id, product_id },
                type: QueryTypes.SELECT,
            }
        );

        if (cartItem.length === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        let newQuantity = action === "increase" ? cartItem[0].quantity + 1 : cartItem[0].quantity - 1;

        // Prevent quantity from being less than 1
        if (newQuantity < 1) {
            return res.status(400).json({ error: "Quantity cannot be less than 1" });
        }

        // Update quantity in cart
        await sequelize.query(
            `UPDATE cart SET quantity = :newQuantity WHERE user_id = :user_id AND product_id = :product_id`,
            {
                replacements: { user_id, product_id, newQuantity },
                type: QueryTypes.UPDATE,
            }
        );

        res.json({ message: "Cart updated", newQuantity });
    } catch (err) {
        console.error("❌ Error updating cart:", err);
        res.status(500).json({ error: "Failed to update cart" });
    }
});

module.exports = router;
