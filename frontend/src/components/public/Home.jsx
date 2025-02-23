import { useNavigate } from "react-router-dom";
import HomeCSS from "./Home.module.css";
function Home() {
    const navigate = useNavigate();
    const signupPage = () => {
        navigate("/Signup");
    }
    return (
        <>
            <div className={HomeCSS["content"]}>
                <div className={HomeCSS["child-content"]}>
                    <div className={HomeCSS["home-content"]}>
                        <div className={HomeCSS["main-heading"]}>
                            <h1 className={HomeCSS["title"]}>Best clothing brand</h1>
                        </div>
                        <div className={HomeCSS["paragraph"]}>
                            <p className={HomeCSS["description"]}>Buy great products.</p>
                        </div>
                        <div className={HomeCSS["signup-btn-container"]}>
                            <button className={HomeCSS["signup-btn"]} onClick={signupPage}>Signup</button>
                        </div>
                    </div>
                    <div className={HomeCSS["home-image"]}>

                    </div>
                </div>
            </div>
        </>
    )
}
export default Home;