import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";
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
      <h1 className="logo-text">the flavor lab</h1>
      <nav>
        <ol className="navigation-list">
          <li className="navigation-item">
            <a href="/" className="navigation-link">
              home
            </a>
          </li>
          {isAuthenticated ? (
            <>
              <li className="navigation-item">
                <a href="/explore" className="navigation-link">
                  explore
                </a>
              </li>
              <li className="navigation-item">
                <a href="/create" className="navigation-link">
                  create
                </a>
              </li>
              <li className="navigation-item">
                <a href="/recipes" className="navigation-link">
                  my recipes
                </a>
              </li>
              <li className="navigation-item">
                <a href="/shopping" className="navigation-link">
                  shopping list
                </a>
              </li>
              <li className="navigation-item">
                <a href="/bookmark" className="navigation-link">
                  bookmark
                </a>
              </li>
              <li className="navigation-item">
                <a href="/settings" className="navigation-link">
                  settings
                </a>
              </li>

              <li className="navigation-item">
                <a href="#" className="navigation-link" onClick={handleLogout}>
                  Logout
                </a>
              </li>

              <li className="navigation-item">
                <a href="#" className="navigation-link">
                  {user.firstName}
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="navigation-item">
                <a href="/login" className="navigation-link">
                  login
                </a>
              </li>
              <li className="navigation-item">
                <a href="/sign up" className="navigation-link">
                  sign up
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
