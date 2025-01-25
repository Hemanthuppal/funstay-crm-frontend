import React, { useState } from "react";
import { FaBell, FaEnvelope, FaCaretDown, FaBars } from "react-icons/fa";
import './Navbar.css';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="admin-nav-navbar">
      <div className="admin-nav-nav-container">
        {/* Logo Section */}
        <div className="admin-nav-logo-section">
          <img
            src="https://media.licdn.com/dms/image/v2/C560BAQH-6AaMW4Bayg/company-logo_200_200/company-logo_200_200/0/1630671617216/funstay_experientialtravel_logo?e=2147483647&v=beta&t=LZ5v7JeyUIx3ruq9SQs2mC6givIiu1wPpoAZe3m3-9w"
            alt="Logo"
            className="admin-nav-logo"
          />
          <span className="admin-nav-logo-text">Funstay</span>
        </div>

        {/* Toggle Button */}
        <div
          className="admin-nav-toggle"
          onClick={() => setShowMenu(!showMenu)}
        >
          <FaBars />
        </div>

        {/* Collapsible Menu Section */}
        <div
          className={`admin-nav-collapsible-menu ${
            showMenu ? "active" : ""
          }`}
        >
          {/* Links Section */}
          <div className="admin-nav-links">
            <a className="nav-link" href="/managers">Managers</a>
            <a className="nav-link" href="/employees">Employees</a>
            <a className="nav-link" href="/reports">Reports</a>
          </div>

        

          {/* Icons Section */}
          <div className="admin-nav-icons">
            <div className="admin-nav-icon-container">
              <FaBell className="admin-nav-feather-icon" />
              <span className="admin-nav-badge">5</span>
            </div>
            <div className="admin-nav-icon-container">
              <FaEnvelope className="admin-nav-feather-icon" />
              <span className="admin-nav-badge">10</span>
            </div>
            <div
              className="admin-nav-icon-container"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="admin-nav-profile">
                <img
                  src="https://i.pravatar.cc/40?img=10"
                  alt="Profile"
                  className="admin-nav-profile-img"
                />
                <FaCaretDown className="admin-nav-caret-icon" />
              </div>
              {showDropdown && (
                <div className="admin-nav-profile-dropdown">
                  <div className="admin-nav-profile-header">
                    <strong>Admin Name</strong>
                  </div>
                  <div className="admin-nav-profile-item">Profile</div>
                  <div className="admin-nav-profile-item">Settings</div>
                  <div className="admin-nav-profile-item">Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
