const fs = require("fs");
const path = require("path");

// Ensure the 'uploads' directory exists
const createUploadsFolder = () => {
    const uploadPath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log("✅ Uploads folder created successfully.");
    } else {
        console.log("✅ Uploads folder already exists.");
    }
};

module.exports = { createUploadsFolder };
