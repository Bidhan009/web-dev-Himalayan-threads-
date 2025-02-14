const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { verifyAdminToken } = require("../middleware/authMiddleware"); // ✅ Correct import
const upload = require("../middleware/multerConfig");

// ✅ Securing Admin Routes
router.get("/products", verifyAdminToken, adminController.getProducts);
router.get("/products/:id", verifyAdminToken, adminController.getProductById);
router.post("/products", verifyAdminToken, upload.single("image"), adminController.addProduct);
router.put("/products/:id", verifyAdminToken, upload.single("image"), adminController.updateProduct);
router.delete("/products/:id", verifyAdminToken, adminController.deleteProduct);


module.exports = router;
