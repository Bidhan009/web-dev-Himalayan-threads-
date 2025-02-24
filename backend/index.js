const express = require("express");
const app = express();
const { connection } = require("./database/db");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

// Import Routes
const authRouter = require("./routes/authRoute");
const adminRouter = require("./routes/adminRoute");
const userRouter = require("./routes/userRoute");
const cartRouter = require("./routes/cartRoute"); // ✅ Import Cart Route

const { createUploadsFolder } = require("./security/helper");
const Product = require("./model/productSchema");

// Create uploads folder if it doesn't exist
createUploadsFolder();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Register Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter); // ✅ Register Cart Routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  try {
    await connection();
    await Product.sync({ alter: true }); // ✅ Sync product model
    console.log("✅ Database connected & updated successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
