import React, { useState } from "react";
import { addProduct } from "../../api/adminAPI";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io"; // Import Close Icon

const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        gender: "",
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("gender", product.gender);
        formData.append("image", product.image);

        try {
            await addProduct(formData);
            toast.success("Product added successfully!");
            navigate("/admin-dashboard");
        } catch (error) {
            toast.error("Error adding product");
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                {/* ✅ Properly Positioned Cross Button */}
                <button className={styles.closeBtn} onClick={() => navigate("/admin-dashboard")}>
                    <IoMdClose size={22} />
                </button>

                <h2 className={styles.title}>Add New Product</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter product name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Enter product description"
                            value={product.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Gender</label>
                        <select name="gender" value={product.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Men">Men</option>
                            <option value="Women">Women</option>
                            <option value="Unisex">Unisex</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Product Image</label>
                        <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
