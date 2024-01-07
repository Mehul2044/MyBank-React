import logo from "../../assets/logo.png"
import styles from "./HeaderMain.module.css";
import {Link, useNavigate} from "react-router-dom";
import {authActions} from "../../store/authentication-slice";
import {useDispatch} from "react-redux";

function HeaderMainAdmin() {
    const dispatch = useDispatch();
    const navigator = useNavigate();

    const logoutHandler = () => {
        dispatch(authActions.logoutAdmin());
        navigator("/admin", {replace: true});
    }

    return <>
        <nav className={`navbar fixed-top ${styles.navbarStyle}`}>
            <div className="container-fluid">
                <button className={`navbar-toggler btn btn-outline-light ${styles.toggleButton}`} type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <Link className="navbar-brand" to="/main/dashboard"><img src={logo} style={{width: "10rem"}}
                                                                         alt={"logo"}/></Link>
                <span className="me-2"><button className={`btn btn-danger ${styles.logoutButton}`}
                                               data-bs-target="#logoutModal"
                                               data-bs-toggle="modal">Log Out</button></span>
                <div className={`offcanvas offcanvas-start ${styles.offCanvasStyle}`} tabIndex="-1" id="offcanvasNavbar"
                     aria-labelledby="offcanvasNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className={`offcanvas-title`} id="offcanvasNavbarLabel"><Link className={styles.offTitle}
                                                                                          to="/admin/main/dashboard">ADMIN
                            PORTAL</Link></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"
                                aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`}
                                          to="/admin/main/dashboard"><i
                                        className="fa-solid fa-globe"></i> Dashboard</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/admin/main/loan"><i
                                        className="fa-solid fa-piggy-bank"></i> Manage Loans</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/admin/main/account_requests"><i
                                        className="fa-regular fa-file"></i> Account
                                        Opening Forms</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to="/admin/main/transactions"><i
                                        className="fa-solid fa-list"></i> View
                                        Transactions</Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-item">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to={"/admin/main/view_queries"}><i
                                        className="fa-solid fa-question"></i> Manage
                                        Customer Queries
                                    </Link>
                                </div>
                            </li>
                            <hr/>
                            <li className="nav-link">
                                <div data-bs-dismiss={"offcanvas"}>
                                    <Link className={`nav-link ${styles.links}`} to={"/admin/main/delete_account"}><i
                                        className="fa-solid fa-trash"></i> Account
                                        Deletion Requests
                                    </Link>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
        <div className="modal fade" id="logoutModal" tabIndex="-1" aria-labelledby="logoutModalLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Confirm Logout?</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to logout?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        <button className="btn btn-danger" data-bs-target="#logoutModal" data-bs-toggle="modal"
                                style={{color: "white", textDecoration: "none"}} onClick={logoutHandler}>Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default HeaderMainAdmin;