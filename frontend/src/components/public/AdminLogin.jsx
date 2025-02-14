import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import AdminLoginCSS from "./AdminLogin.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { API } from "../../environment";

function AdminLogin() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    useEffect(() => {
        if (localStorage.getItem("adminToken")) {
            navigate("/admin-dashboard");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API.BASE_URL}/api/auth/admin-login`, credentials, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.data && response.data.data.access_token) {
                localStorage.setItem("adminToken", response.data.data.access_token);
                toast.success("Admin Login successful");
                navigate("/admin-dashboard");
            } else {
                toast.error("Invalid Admin Credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Error logging in. Please check credentials.");
        }
    };

    return (
        <div className={AdminLoginCSS["admin-login-form"]}>
            <div className={AdminLoginCSS["admin-login-form-child"]}>
                <div className={AdminLoginCSS["admin-login-form-content"]}>
                    <div className={AdminLoginCSS["exit-button-container"]}>
                        <button onClick={() => navigate("/")}>
                            <X />
                        </button>
                    </div>
                    <h2>ADMIN LOGIN</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={AdminLoginCSS["input-field"]}>
                            <input
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={AdminLoginCSS["input-field"]}>
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className={AdminLoginCSS["admin-login-button"]}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
