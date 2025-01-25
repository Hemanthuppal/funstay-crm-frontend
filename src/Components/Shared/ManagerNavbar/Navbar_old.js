// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './Navbar.css';

// const Manager = () => {
//   return (
//     <nav className="manager navbar navbar-expand-lg navbar-light bg-light mb-3">
//       <div className="container-fluid">
//       <div className="navbar-nav me-auto">
//         <a className="nav-link" href="/m-view-leads">Leads</a>
//         <a className="nav-link" href="/m-potential-leads">Potential Leads</a>
//           <a className="nav-link" href="/">Quotation</a>
//           <a className="nav-link" href="/m-customers">Customer</a>
//         </div>
//         <div className="navbar-nav">
//           <a className="nav-link btn btn-outline-primary mx-1" href="/manageradd-leads">Add Lead</a>
         
//         </div>
//       </div>
//     </nav>
//   );
// };

import React, { useState } from "react";
import { FaBell, FaEnvelope, FaCaretDown, FaBars } from "react-icons/fa";
import './Navbar.css';

const Manager = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggle menu

  return (
    <nav className="manager-nav-navbar">
      <div className="manager-nav-nav-container">
        {/* Logo Section */}
        <div className="manager-nav-logo-section">
          <img
            src="https://media.licdn.com/dms/image/v2/C560BAQH-6AaMW4Bayg/company-logo_200_200/company-logo_200_200/0/1630671617216/funstay_experientialtravel_logo?e=2147483647&v=beta&t=LZ5v7JeyUIx3ruq9SQs2mC6givIiu1wPpoAZe3m3-9w"
            alt="Logo"
            className="manager-nav-logo"
          />
          <span className="manager-nav-logo-text">Funstay</span>
        </div>

        {/* Toggle Button for Tablet and Mobile */}
        <div className="manager-nav-toggle" onClick={() => setShowMenu(!showMenu)}>
          <FaBars />
        </div>

        {/* Collapsible Menu Section */}
        <div className={`manager-nav-collapsible-menu ${showMenu ? "active" : ""}`}>
          {/* Buttons Section */}
          <div className="manager-nav-buttons">
            <a className="nav-link" href="/m-view-leads">Leads</a>
            <a className="nav-link" href="/m-potential-leads">Potential Leads</a>
            <a className="nav-link" href="/">Quotation</a>
            <a className="nav-link" href="/m-customers">Customer</a>
            <a className="nav-link" href="/m-myteam">MyTeam</a>

          </div>

          {/* Add Leads Button */}
          <button className="btn btn-primary lead-button">Add Leads</button>

          {/* Icons Section */}
          <div className="manager-nav-icons">
            <div className="manager-nav-icon-container">
              <FaBell className="manager-nav-feather-icon" />
              <span className="manager-nav-badge">12</span>
            </div>

            <div className="manager-nav-icon-container">
              <FaEnvelope className="manager-nav-feather-icon" />
              <span className="manager-nav-badge">24</span>
            </div>

            <div
              className="manager-nav-icon-container"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="manager-nav-profile">
                <img
                  src="https://i.pravatar.cc/40?img=4"
                  alt="Profile"
                  className="manager-nav-profile-img"
                />
                <FaCaretDown className="manager-nav-caret-icon" />
              </div>
              {showDropdown && (
                <div className="manager-nav-profile-dropdown">
                  <div className="manager-nav-profile-header">
                    <strong>Alex Johnson</strong>
                  </div>
                  <div className="manager-nav-profile-item">Your Profile</div>
                  <div className="manager-nav-profile-item">Settings</div>
                  <div className="manager-nav-profile-item">Help Center</div>
                  <div className="manager-nav-profile-item">Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Manager;
