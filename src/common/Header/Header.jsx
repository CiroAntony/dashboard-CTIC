import React, { useState, useEffect } from "react";
import '../Header/Header.css'
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const isAdmin = localStorage.getItem("rol") === "1";

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <header className="main-nav-header">
      <div className="header__container">
        <div className="logo__box">
          <Link className="link-header" to="/app"><span className="wel-logo">TIC</span></Link>
          {isAdmin && (
            <Link to="/app/list-employees" className="list-employee">Employees</Link>
          )}
        </div>
        <div className="user__box">
          <div className="profile-container">
            <a className="btn btn-secondary dropdown-toggle" href="/" data-bs-toggle="dropdown">
              <FaRegUserCircle className="header__user-icon" /> {username}
            </a>
            <ul className="dropdown-menu">
              <li className="menu-list">
                <Link to="/app/profile-employee" className="name">Profile</Link>
              </li>
              <li className="menu-list">
                <button className="logout" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
