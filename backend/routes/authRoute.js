const express = require("express");
const { adminLogin } = require("../controller/AuthController");

const router = express.Router();

// ✅ Admin Login Route (No Authentication Required)
router.post("/admin-login", adminLogin); // ❌ Removed `.js` (incorrect syntax)

module.exports = router;
