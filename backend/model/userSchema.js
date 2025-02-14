const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const User = sequelize.define("User", {
    userId: {
        type: DataTypes.UUID,  // ✅ Using UUID instead of INTEGER
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50], // ✅ Ensures min 3, max 50 characters
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,  // ✅ Ensures valid email format
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,  // ✅ Optional field
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,  // ✅ Optional field
    },
    profilePic: {
        type: DataTypes.STRING,  // ✅ Stores image path
        allowNull: true, // Optional (users may not upload a profile pic)
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,  // ✅ Enables createdAt & updatedAt fields
    paranoid: true,  // ✅ Enables soft deletes (Optional)
});

// ✅ Sync Table (Only Run in Development Mode)
(async () => {
    try {
        await User.sync({ alter: true }); // ✅ alter = updates schema without deleting data
        console.log("✅ User table has been updated successfully.");
    } catch (error) {
        console.log("❌ Error creating User table:", error.message);
    }
})();

module.exports = User;
