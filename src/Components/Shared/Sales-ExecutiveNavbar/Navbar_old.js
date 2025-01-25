import React, { useState } from "react";
import { FaBell, FaEnvelope, FaCaretDown, FaBars } from "react-icons/fa";
import './Navbar.css';

const Sales = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggle menu

  return (
    <nav className="sales-nav-navbar">
      <div className="sales-nav-nav-container">
        {/* Logo Section */}
        <div className="sales-nav-logo-section">
          <img
            src="https://media.licdn.com/dms/image/v2/C560BAQH-6AaMW4Bayg/company-logo_200_200/company-logo_200_200/0/1630671617216/funstay_experientialtravel_logo?e=2147483647&v=beta&t=LZ5v7JeyUIx3ruq9SQs2mC6givIiu1wPpoAZe3m3-9w"
            alt="Logo"
            className="sales-nav-logo"
          />
          <span className="sales-nav-logo-text">Funstay</span>
        </div>

        {/* Toggle Button for Tablet and Mobile */}
        <div className="sales-nav-toggle" onClick={() => setShowMenu(!showMenu)}>
          <FaBars />
        </div>

        {/* Collapsible Menu Section */}
        <div className={`sales-nav-collapsible-menu ${showMenu ? "active" : ""}`}>
          {/* Buttons Section */}
          <div className="sales-nav-buttons">
            <a className="nav-link" href="/view-lead">Leads</a>
            <a className="nav-link" href="/potential-leads">Potential Leads</a>
            <a className="nav-link" href="/quotation">Quotation</a>
            <a className="nav-link" href="/s-customers">Customer</a>
            <a className="nav-link" href="/s-myteam">MyTeam</a>

          </div>

          {/* Add Leads Button */}
          <button className="btn btn-primary sales-lead-button">Add Leads</button>

          {/* Icons Section */}
          <div className="sales-nav-icons">
            <div className="sales-nav-icon-container">
              <FaBell className="sales-nav-feather-icon" />
              <span className="sales-nav-badge">12</span>
            </div>

            <div className="sales-nav-icon-container">
              <FaEnvelope className="sales-nav-feather-icon" />
              <span className="sales-nav-badge">24</span>
            </div>

            <div
              className="sales-nav-icon-container"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="sales-nav-profile">
                <img
                  src="https://i.pravatar.cc/40?img=4"
                  alt="Profile"
                  className="sales-nav-profile-img"
                />
                <FaCaretDown className="sales-nav-caret-icon" />
              </div>
              {showDropdown && (
                <div className="sales-nav-profile-dropdown">
                  <div className="sales-nav-profile-header">
                    <strong>Alex Johnson</strong>
                  </div>
                  <div className="sales-nav-profile-item">Your Profile</div>
                  <div className="sales-nav-profile-item">Settings</div>
                  <div className="sales-nav-profile-item">Help Center</div>
                  <div className="sales-nav-profile-item">Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sales;
