const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    gender: { // ✅ Added new column
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Men', 'Women', 'Unisex']],
        },
    },
    image_url: {
        type: DataTypes.STRING,
    },
}, {
    timestamps: true,
});

module.exports = Product;
