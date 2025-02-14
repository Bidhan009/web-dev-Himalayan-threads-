const Admin = require("../model/adminSchema");
const Product = require("../model/productSchema"); // ✅ Ensure Product model is imported
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");

// ✅ Fetch all products
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({ order: [["createdAt", "DESC"]] });
        res.status(200).json(products);
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

// ✅ Fetch a single product
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("❌ Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
};

// ✅ Add a new product with gender field
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, gender } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!name || !description || !price || !gender || !imageUrl) {
            return res.status(400).json({ message: "All fields including an image are required" });
        }

        const newProduct = await Product.create({ name, description, price, gender, image_url: imageUrl });
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ message: "Error adding product", error: error.message });
    }
};

// ✅ Update a product (with image handling)
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, gender } = req.body;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let imageUrl = product.image_url;

        if (req.file) {
            // ✅ Delete old image before updating
            if (imageUrl) {
                const oldImagePath = path.join(__dirname, "..", imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            imageUrl = `/uploads/${req.file.filename}`;
        }

        await product.update({ name, description, price, gender, image_url: imageUrl });

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// ✅ Delete a product (and its image)
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ✅ Remove image file
        if (product.image_url) {
            const imagePath = path.join(__dirname, "..", product.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};
