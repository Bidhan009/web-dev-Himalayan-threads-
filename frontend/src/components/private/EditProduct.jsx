import React, { useEffect, useState } from "react";
import { updateProduct, getProductById } from "../../api/adminAPI";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditProduct.module.css";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        gender: "",
        image: null,
        imageUrl: ""
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct({
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    gender: data.gender,
                    image: null,
                    imageUrl: data.image_url ? `http://localhost:5000${data.image_url}` : ""
                });
            } catch (error) {
                toast.error("Failed to load product details");
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProduct({ ...product, image: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("gender", product.gender);
        if (product.image) {
            formData.append("image", product.image);
        }

        try {
            await updateProduct(id, formData);
            toast.success("Product updated successfully!");
            navigate("/admin-dashboard");
        } catch (error) {
            toast.error("Failed to update product");
        }
    };

    return (
        <div className={styles.container}>
            {/* ❌ Close Button */}
            <button className={styles.closeBtn} onClick={() => navigate("/admin-dashboard")}>
                <IoMdClose size={24} />
            </button>

            <h2 className={styles.title}>Edit Product</h2>

            <div className={styles.productInfo}>
                {/* 🖼️ Image Preview */}
                {product.imageUrl && (
                    <div className={styles.imagePreview}>
                        <img src={product.imageUrl} alt="Product Preview" />
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label>Product Name</label>
                        <input type="text" name="name" value={product.name} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Description</label>
                        <textarea name="description" value={product.description} onChange={handleChange} required />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Price</label>
                        <input type="number" name="price" value={product.price} onChange={handleChange} required />
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
                        <label>Update Image</label>
                        <input type="file" onChange={handleImageChange} />
                    </div>

                    <button type="submit" className={styles.updateButton}>Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
