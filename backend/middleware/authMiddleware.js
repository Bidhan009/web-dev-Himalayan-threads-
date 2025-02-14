const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Middleware to Verify Admin Token
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 Admin Token Decoded:", decoded); // ✅ Debugging Log
        if (decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only!" });
        }
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token. Please log in again." });
    }
};

// ✅ Middleware to Verify User Token
const verifyUserToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("📌 User Token Decoded:", decoded); // ✅ Debugging Log

        if (!decoded.role || decoded.role !== "user") {  // ✅ Fix: Proper role check
            return res.status(403).json({ message: "Access denied. Users only!" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token. Please log in again." });
    }
};

module.exports = { verifyAdminToken, verifyUserToken };
