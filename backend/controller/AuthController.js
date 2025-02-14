const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";

// ✅ Ensure JWT Secret exists
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env file!");
    process.exit(1);
}

// ✅ Function to Generate JWT Token
const generateToken = (admin) => {
    return jwt.sign(admin, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
};

// ✅ Admin Login Function (No Authentication Required)
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // ✅ Validate hardcoded credentials
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            const token = generateToken({ email, role: "admin" });

            return res.status(200).json({
                data: { access_token: token },
                message: "Admin logged in successfully",
            });
        }

        return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        console.error("❌ Admin Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Middleware to Verify JWT Token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(403).json({ message: "Access denied. No token provided." });
        }

        const token = authHeader.split(" ")[1]; // ✅ Extract Bearer token
        if (!token) {
            return res.status(403).json({ message: "Access denied. Invalid token format." });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = { adminLogin, verifyToken };
