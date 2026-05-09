import React from 'react';
import styles from './Footer.module.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6">
            <img src={logo} alt="Shop Logo" className={styles.footerLogo} />
            <p className={styles.footerText}>
              Your premium destination for the best products online. We deliver quality, speed, and exceptional customer service directly to your door.
            </p>
            <div className={styles.socialIcons}>
              <a href="https://www.facebook.com/share/17X15KRGb3/" className={styles.socialIcon}><i className="fa-brands fa-facebook-f"></i></a>
              <a href="https://x.com/wmhmd0889" className={styles.socialIcon}><i className="fa-brands fa-twitter"></i></a>
              <a href="https://www.instagram.com/tech.engune135?igsh=MXN0bHUydWNjbTUxNQ==" className={styles.socialIcon}><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.youtube.com/@9nemi641" className={styles.socialIcon}><FaYoutube /></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h4 className={styles.footerTitle}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
             
            </ul>
          </div>

          {/* <div className="col-lg-2 col-md-6">
            <h4 className={styles.footerTitle}>Support</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Contact Us</Link></li>
            </ul>
          </div> */}

          <div className="col-lg-4 col-md-6">
            <h4 className={styles.footerTitle}>Newsletter</h4>
            <p className={styles.footerText} style={{ marginBottom: 10 }}>
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
              <button type="submit" className="btn-premium px-3">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>

        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Shop googoogaagaa. All rights reserved. Built with ❤️.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
