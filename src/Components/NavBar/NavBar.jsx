import React, { useContext, useState, useRef, useEffect } from "react";
import styles from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { TockenContext } from "../../Context/Token";
import { CartContent } from "../../Context/cartContent";

function NavBar() {
  let { token, setToken } = useContext(TockenContext);
  let navigate = useNavigate();
  let { numOfCartItems } = useContext(CartContent);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  let userInfo = null;
  if (token) {
    try {
      const payload = token.split(".")[1];
      userInfo = JSON.parse(atob(payload));
    } catch (e) {
      console.error("Invalid token");
    }
  }

  function logOut() {
    localStorage.removeItem("userToken");
    setToken(null);
    setShowProfile(false);
    navigate("/login");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg ${styles.navbar}`}>
        <div className="container">
          <Link
            className="navbar-brand d-flex align-items-center fw-bold"
            to={"home"}
          >
            <img src={logo} className={styles.logo} alt="ShopLogo" />
          </Link>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fa-solid fa-bars text-dark fs-4"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {token && (
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className={`nav-link ${styles.navLink}`} to={"home"}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${styles.navLink}`}
                    to={"products"}
                  >
                    Products
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link ${styles.navLink}`}
                    to={"categories"}
                  >
                    Categories
                  </Link>
                </li>
              </ul>
            )}

            <ul className="ms-auto navbar-nav align-items-center">
              <li className={`nav-item ${styles.socialIcons} d-none d-lg-flex`}>
                <Link
                  to={
                    "https://www.instagram.com/tech.engune135?igsh=MXN0bHUydWNjbTUxNQ=="
                  }
                >
                  <i className="fa-brands fa-instagram"></i>
                </Link>
                <Link to={"https://www.facebook.com/share/17X15KRGb3/"}>
                  <i className="fa-brands fa-facebook"></i>
                </Link>
                <Link to={"https://x.com/wmhmd0889"}>
                  {" "}
                  <i className="fa-brands fa-twitter"></i>
                </Link>
              </li>

              {token ? (
                <>
                  <li className="nav-item me-3">
                    <Link className="nav-link" to={"cart"}>
                      <div className={styles.cartIconWrap}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        {numOfCartItems > 0 && (
                          <span className={styles.cartBadge}>
                            {numOfCartItems}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>

                  {/* User Profile Dropdown */}
                  <li
                    className={`nav-item ${styles.profileWrap}`}
                    ref={dropdownRef}
                  >
                    <button
                      className={styles.btnProfile}
                      onClick={() => setShowProfile(!showProfile)}
                      title="Account"
                    >
                      <i className="fa-regular fa-user"></i>
                    </button>

                    <div
                      className={`${styles.profileDropdown} ${showProfile ? styles.show : ""}`}
                    >
                      {userInfo && (
                        <>
                          <div className={styles.profileHeader}>
                            <div className={styles.profileAvatar}>
                              {userInfo.email ? userInfo.email.charAt(0) : "U"}
                            </div>
                            <div className={styles.profileInfo}>
                              <div className={styles.profileName}>
                                {userInfo.name || "User"}
                              </div>
                              <div className={styles.profileEmail}>
                                {userInfo.email}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3 d-flex justify-content-between align-items-center">
                            <span
                              style={{
                                fontSize: 13,
                                color: "var(--text-muted)",
                              }}
                            >
                              Role
                            </span>
                            <span className={styles.roleBadge}>
                              {userInfo.role}
                            </span>
                          </div>

                          {userInfo.role === "ADMIN" && (
                            <Link
                              to="/admin"
                              className="btn btn-premium w-100 mb-2"
                              style={{ fontSize: 14, padding: "8px" }}
                              onClick={() => setShowProfile(false)}
                            >
                              <i className="fa-solid fa-gauge me-2"></i> Admin
                              Panel
                            </Link>
                          )}
                        </>
                      )}

                      <button
                        className={`w-100 ${styles.btnSignOut}`}
                        onClick={logOut}
                      >
                        <i className="fa-solid fa-arrow-right-from-bracket me-2"></i>{" "}
                        Log Out
                      </button>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item me-2">
                    <Link className={`nav-link ${styles.navLink}`} to={"login"}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-premium" to={"register"}>
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}


export default NavBar;
