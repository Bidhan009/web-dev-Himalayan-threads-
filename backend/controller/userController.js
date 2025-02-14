const User = require("../model/userSchema");
const Product = require("../model/productSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/multerConfig");  // ✅ Corrected path
 // Import multer config
const { Op } = require("sequelize");

// ✅ User Signup
exports.signup = async (req, res) => {
    try {
        const { username, email, phone, address, password } = req.body;

        if (!username || !email || !phone || !address || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        console.log("Signup Request Body:", req.body);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            phone,
            address,
            password: hashedPassword,
            profilePic: req.file ? `/uploads/${req.file.filename}` : null, // ✅ Save profile pic if uploaded
        });

        res.status(201).json({ message: "User registered successfully", data: newUser });
    } catch (error) {
        console.error("❌ Error signing up:", error);
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

// ✅ User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Validate Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // ✅ Generate JWT Token with user role
        const token = jwt.sign(
            { userId: user.userId, role: "user" }, // ✅ Include "role: user"
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("❌ Error logging in:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

// ✅ Fetch all products for users
// ✅ Fetch all products for users
exports.getProducts = async (req, res) => {
    try {
        console.log("📌 Fetching all products...");
        const products = await Product.findAll({
            order: [["createdAt", "DESC"]], // Sorting by newest first
        });

        if (!products || products.length === 0) {
            console.warn("⚠️ No products found in the database.");
            return res.status(200).json({ message: "No products available", data: [] });
        }

        console.log("✅ Products Retrieved:", products);
        res.status(200).json({ data: products });
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};


// ✅ Fetch user profile
// ✅ Fetch user profile
exports.getUserProfile = async (req, res) => {
    try {
        console.log(`📌 Fetching user profile for userId: ${req.user.userId}`);

        const user = await User.findByPk(req.user.userId, {
            attributes: ["userId", "username", "email", "phone", "address", "profilePic", "createdAt", "updatedAt", "deletedAt"],
        });

        if (!user) {
            console.warn("⚠️ User not found in database.");
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ User Profile Retrieved:", user);
        res.status(200).json({ data: user });
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
};

// ✅ Update user profile
exports.updateUserProfile = async (req, res) => {
    try {
        const { username, email, phone, address } = req.body;
        const user = await User.findByPk(req.user.userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        await user.update({
            username,
            email,
            phone,
            address,
            profilePic: req.file ? `/uploads/${req.file.filename}` : user.profilePic, // ✅ Update profile pic if uploaded
        });

        res.status(200).json({ message: "Profile updated successfully", data: user });
    } catch (error) {
        console.error("❌ Error updating user profile:", error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};
