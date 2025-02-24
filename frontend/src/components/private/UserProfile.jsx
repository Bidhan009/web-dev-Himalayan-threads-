import React from "react";
import { API } from "../../environment";
import styles from "./UserProfile.module.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser } from "react-icons/fa";

const UserProfile = ({ user }) => {
    if (!user) {
        return <p className={styles.loading}>Loading profile...</p>;
    }

    return (
        <div className={styles.profileContainer}>
            <h2 className={styles.profileTitle}>👤 My Profile</h2>
            <div className={styles.profileCard}>
                <img 
                    src={user.profilePic ? `${API.BASE_URL}${user.profilePic}` : "/default-profile.png"} 
                    alt="Profile"
                    className={styles.profileImage}
                />
                <h3><FaUser /> {user.username}</h3>
                <p><FaEnvelope /> <strong>Email:</strong> {user.email}</p>
                <p><FaPhone /> <strong>Phone:</strong> {user.phone}</p>
                <p><FaMapMarkerAlt /> <strong>Address:</strong> {user.address}</p>
            </div>
        </div>
    );
};

export default UserProfile;
