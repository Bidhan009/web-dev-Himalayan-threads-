import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import styles from "./Signup.module.css";
import axios from "axios";
import { API } from "../../environment";
import { toast } from "react-toastify";

function Signup() {
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const handleImageUpload = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const onSubmit = async (data) => {
        console.log("Sending Signup Data:", data); // ✅ Debugging log
    
        try {
            let formData;
    
            // ✅ If profile picture is provided, use FormData (Multipart)
            if (profilePic) {
                formData = new FormData();
                formData.append("username", data.username);
                formData.append("email", data.email);
                formData.append("phone", data.phone);
                formData.append("address", data.address);
                formData.append("password", data.password);
                formData.append("profilePic", profilePic);
            } else {
                // ✅ Otherwise, send as JSON
                formData = { 
                    username: data.username, 
                    email: data.email, 
                    phone: data.phone, 
                    address: data.address, 
                    password: data.password 
                };
            }
    
            console.log("Submitting Signup Request:", formData);
    
            const response = await axios.post(`${API.BASE_URL}/api/user/signup`, formData, {
                headers: profilePic ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
            });
    
            if (response.status === 201) {
                toast.success("Signup successful!");
                navigate("/Login");
            }
        } catch (error) {
            console.error("❌ Signup error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Signup failed, please try again.");
        }
    };
    

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <button className={styles.closeBtn} onClick={() => navigate("/")}>
                    <IoMdClose size={24} />
                </button>

                <h2 className={styles.title}>Sign Up</h2>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter your name" {...register("username", { required: "Name is required" })} />
                        {errors.username && <p className={styles.errorMsg}>{errors.username.message}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input type="text" placeholder="Enter your phone number" {...register("phone", { required: "Phone number is required" })} />
                        {errors.phone && <p className={styles.errorMsg}>{errors.phone.message}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Address</label>
                        <input type="text" placeholder="Enter your address" {...register("address", { required: "Address is required" })} />
                        {errors.address && <p className={styles.errorMsg}>{errors.address.message}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Profile Picture (Optional)</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" placeholder="Enter password" {...register("password", { required: "Password is required", minLength: { value: 6, message: "Must be at least 6 characters" } })} />
                        {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
                    </div>

                    <button type="submit" className={styles.submitBtn}>Sign Up</button>
                </form>
                <p className={styles.bottomText}>Already have an account? <Link to="/Login">Login</Link></p>
            </div>
        </div>
    );
}

export default Signup;
