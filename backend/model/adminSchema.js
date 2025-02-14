const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Admin = sequelize.define("admin", {
    adminId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

// (async () => {
//     try {
//         await Admin.sync();
//         console.log("Admin table has been created successfully.");
//     } catch (error) {
//         console.log("Error: ", error.message);
//     }
// })();

module.exports = Admin;
