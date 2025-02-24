const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔹 Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Generate Safe File Names (Removes Special Characters)
const sanitizeFileName = (originalname) => {
    return originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "");
};

// 🔹 Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const safeFilename = sanitizeFileName(file.originalname);
        cb(null, `${Date.now()}-${safeFilename}`);
    },
});

// 🔹 Allow Only Images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed!"), false);
    }
};

// 🔹 Initialize Multer with File Size Limit & Error Handling
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    onError: (err, next) => {
        console.error("Multer Error:", err);
        next(err);
    },
});

module.exports = upload;
