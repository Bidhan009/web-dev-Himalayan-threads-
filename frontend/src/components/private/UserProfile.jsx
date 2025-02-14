import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../../api/userAPI";
import styles from "./UserProfile.module.css";
import { toast } from "react-toastify";

const UserProfile = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const data = await getUserProfile();
            setUser(data.data);
        } catch (error) {
            toast.error("Failed to fetch profile.");
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(user);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h2>User Profile</h2>
            <form onSubmit={handleSubmit}>
                <label>Full Name</label>
                <input type="text" name="username" value={user.username} onChange={handleChange} />

                <label>Email</label>
                <input type="email" name="email" value={user.email} onChange={handleChange} disabled />

                <label>Phone</label>
                <input type="text" name="phone" value={user.phone} onChange={handleChange} />

                <label>Address</label>
                <input type="text" name="address" value={user.address} onChange={handleChange} />

                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UserProfile;
