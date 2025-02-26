import React, { useState } from "react";
import { API } from "../../environment";
import styles from "./UserProfile.module.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaEdit, FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { updateUserProfile, updateProfilePicture } from "../../api/userAPI";
import { toast } from "react-toastify";

const UserProfile = ({ user, setUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
    });
    const [profilePic, setProfilePic] = useState(null);

    // Handle Input Changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Profile Picture Upload
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setProfilePic(file);

        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            await updateProfilePicture(formData);
            toast.success("Profile picture updated successfully!");
            setUser({ ...user, profilePic: `${API.BASE_URL}/uploads/${file.name}` });
        } catch (error) {
            toast.error("Failed to update profile picture.");
        }
    };

    // Handle Profile Update
    const handleUpdateProfile = async () => {
        try {
            await updateUserProfile(formData);
            toast.success("Profile updated successfully!");
            setUser({ ...user, ...formData });
            setIsEditing(false);
        } catch (error) {
            // toast.error("Failed to update profile.");
        }
    };

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>👤 My Profile</h2>
            <div className={styles.profileCard}>
                <label htmlFor="profilePicInput" className={styles.profilePicUpload}>
                    <img 
                        src={user.profilePic ? `${API.BASE_URL}${user.profilePic}` : "/default-profile.png"} 
                        alt="Profile"
                        className={styles.profileImage}
                    />
                    <FaUpload className={styles.uploadIcon} />
                </label>
                <input 
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleProfilePicChange}
                />

                {!isEditing ? (
                    <>
                        <h3><FaUser /> {user.username}</h3>
                        <p><FaEnvelope /> <strong>Email:</strong> {user.email}</p>
                        <p><FaPhone /> <strong>Phone:</strong> {user.phone}</p>
                        <p><FaMapMarkerAlt /> <strong>Address:</strong> {user.address}</p>
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                            <FaEdit /> Update Profile
                        </button>
                    </>
                ) : (
                    <>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} className={styles.inputField} />
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.inputField} />
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={styles.inputField} />
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className={styles.inputField} />

                        <div className={styles.buttonGroup}>
                            <button className={styles.saveButton} onClick={handleUpdateProfile}>
                                <FaSave /> Save
                            </button>
                            <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
