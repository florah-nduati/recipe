import React from "react";
import {
  FaLink,
  FaGithub,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaArrowUp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import logo from "../../assets/flavor logo.jpeg";
import "./footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="footer">
      {/* Logo Section */}
      <div>
        <img src={logo} alt="Flavor Logo" className="footer-logo-img" />
      </div>

      {/* Footer Info */}
      <div className="footer-info">
        <p>&copy; 2024 simply recipes. All rights reserved.</p>
        <p>Made with 💖 by Florah Nduati</p>
      </div>

      {/* Links Section */}
      <div className="footer-links">
        <a
          href="https://portfolio-website-blond-seven.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <FaLink /> Portfolio
        </a>
        <a
          href="https://github.com/florah-nduati"
          me
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <FaGithub /> GitHub
        </a>
      </div>

      {/* Social Media Section */}
      <div className="footer-links">
        <a
          href="https://www.facebook.com/profile.php?id=100072898805438"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <FaFacebook /> Facebook
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <FaTwitter /> Twitter
        </a>
        <a
          href="https://www.instagram.com/pflozzie/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <FaInstagram /> Instagram
        </a>
      </div>

      {/* Back to Top */}
      <div className="footer-links">
        <button onClick={scrollToTop} className="footer-link">
          <FaArrowUp /> Back to Top
        </button>
      </div>
    </div>
  );
};

export default Footer;
