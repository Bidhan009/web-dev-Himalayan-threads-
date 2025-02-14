import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../environment";
import { toast } from "react-toastify";
import styles from "./Login.module.css";

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            console.log("Login Request:", data);
            const response = await axios.post(`${API.BASE_URL}/api/user/login`, data);
            
            if (response.status === 200) {
                // ✅ Store token
                localStorage.setItem("userToken", response.data.token);
                toast.success("Login successful!");

                // ✅ Redirect to User Dashboard (Fixed Route)
                navigate("/user-dashboard");
            }
        } catch (error) {
            console.error("❌ Login error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login failed, please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" {...register("email", { required: "Email is required" })} />
                        {errors.email && <p className={styles.errorMsg}>{errors.email.message}</p>}
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" placeholder="Enter password" {...register("password", { required: "Password is required" })} />
                        {errors.password && <p className={styles.errorMsg}>{errors.password.message}</p>}
                    </div>

                    <button type="submit" className={styles.submitBtn}>Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
