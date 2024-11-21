import React from "react";
import { FaLink } from "react-icons/fa"; 
import { FaGithub } from "react-icons/fa"; 
import logo from "../../assets/flavor logo.jpeg"; 
import "./footer.css";

function Footer({ portfolioUrl, githubUrl }) {
  return (
    <div className="footer">
      <div className="footer-logo">
       
        <img src={logo} alt="Flavor Logo" className="footer-logo-img" />
      </div>
      <div className="footer-info">
        <p>&copy;2024 BlogIt. All rights reserved.</p>
        <p>Made by Florah Nduati</p>
      </div>
      <div className="footer-links">
 
        {portfolioUrl && (
          <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaLink /> Portfolio
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
            <FaGithub /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}

export default Footer;

