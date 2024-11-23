import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaInternetExplorer } from "react-icons/fa";
import { MdCreateNewFolder } from "react-icons/md";
import { GiShoppingCart } from "react-icons/gi";
import { BiSolidBookBookmark } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { RiLogoutBoxFill } from "react-icons/ri";
import { RiLoginBoxFill } from "react-icons/ri";
import { FaRupeeSign } from "react-icons/fa";
import "./header.css";
import logo from '../../assets/flavor logo.jpeg';
import useUserStore from "../../store/userStore";


function Header() {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const user = useUserStore((state) => state.user);
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="header-navigation">
      <div className="header-logo">
      <img src={logo} alt="Flavor Logo" className="logo-img" />
      <h1 className="logo-text">the Flavor lab</h1>
      </div>

      <nav>
        <ol className="navigation-list">
          <li className="navigation-item">
            <a href="/" className="navigation-link">
              <FaHome className="nav-icon" />
              <span className="nav-text">home</span>
            </a>
          </li>
          {isAuthenticated ? (
            <>
              <li className="navigation-item">
                <a href="/explore" className="navigation-link">
                  <FaInternetExplorer className="nav-icon" />
                  <span className="nav-text">explore</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/create" className="navigation-link">
                  <MdCreateNewFolder className="nav-icon" />
                  <span className="nav-text">create</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/recipes" className="navigation-link">
                  <BiSolidBookBookmark className="nav-icon" />
                  <span className="nav-text">my recipes</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/shopping" className="navigation-link">
                  <GiShoppingCart className="nav-icon" />
                  <span className="nav-text">shopping list</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/bookmarks" className="navigation-link">
                  <BiSolidBookBookmark className="nav-icon" />
                  <span className="nav-text">bookmark</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/settings" className="navigation-link">
                  <IoSettingsSharp className="nav-icon" />
                  <span className="nav-text">settings</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="#" className="navigation-link" onClick={handleLogout}>
                  <RiLogoutBoxFill className="nav-icon" />
                  <span className="nav-text">Logout</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="#" className="navigation-link">
                  <span className="nav-text">{user.firstName}</span>
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="navigation-item">
                <a href="/login" className="navigation-link">
                  <RiLoginBoxFill className="nav-icon" />
                  <span className="nav-text">login</span>
                </a>
              </li>
              <li className="navigation-item">
                <a href="/sign-up" className="navigation-link">
                  < FaRupeeSign className="nav-icon" />
                  <span className="nav-text">sign up</span>
                </a>
              </li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
}

export default Header;

