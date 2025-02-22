import React from "react";
import styles from "./Profile.module.css";

const Profile = () => {
    return (
        <section className={styles.profileSection}>
            <h3>My Profile</h3>
            <button className={styles.updateProfileBtn}>Update Profile</button>
        </section>
    );
};

export default Profile;
