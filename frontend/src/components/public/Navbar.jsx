import { useNavigate, Link } from "react-router-dom";
import NavbarCSS from "./Navbar.module.css";

function Navbar() {
    const navigate = useNavigate();
    const loginPage = () => {
        navigate("/Login")
    }
    const AdminLogin = () => {
        navigate("/AdminLogin")
    }

    return (
        <div className={NavbarCSS["navbar"]}>
            <div className={NavbarCSS["website-name"]}>
                <h3 className={NavbarCSS["title"]}>HimalayanThreads</h3>
            </div>

            <ul className={NavbarCSS["list"]}>
                <li className={NavbarCSS["nav-li"]}>  <Link to="/">HOME</Link></li>
                <li className={NavbarCSS["nav-li"]}><Link to="/loginpage">SHOP</Link></li>

                {/* <li className="nav-li"><a href="#">AUTHORS</a></li> */}
            </ul>

            <div className={NavbarCSS["adminlogin-btn-container"]}>
                <button className={NavbarCSS["adminlogin-btn"]} onClick={AdminLogin}>AdminLogin</button>
            </div>


            <div className={NavbarCSS["login-btn-container"]}>
                <button className={NavbarCSS["login-btn"]} onClick={loginPage}>Login</button>
            </div>
        </div>
    )
}
export default Navbar;