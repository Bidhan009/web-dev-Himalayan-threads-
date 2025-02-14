// userRoute.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyUserToken } = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/signup", upload.single("profilePic"), userController.signup);
router.post("/login", userController.login);
router.get("/products", userController.getProducts);
router.get("/profile", verifyUserToken, userController.getUserProfile);
router.put("/profile", verifyUserToken, userController.updateUserProfile);

module.exports = router;