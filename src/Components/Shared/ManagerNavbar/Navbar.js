import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarCheck, FaUmbrellaBeach, FaWalking, FaFileInvoiceDollar, FaTachometerAlt, FaBell, FaEnvelope, FaCaretDown,FaRegAddressBook, FaCalendarAlt, FaBullhorn, FaUsersCog, FaHome, FaClipboardList, FaChartLine, FaUserFriends, FaPeopleCarry          } from "react-icons/fa";
import { IoHomeOutline, IoMenu } from "react-icons/io5";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Manager = ({ onToggleSidebar }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggle menu
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onToggleSidebar(!collapsed);
  };

  const handleNavItemClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    console.log('Logged out');
    navigate('/');
  };

  return (
    <>
      <div className="manager-container">
        <div className="manager-header">
          <div className="manager-header-left">
            <div
              className={`manager-sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
              onClick={toggleSidebar}
            >
              <IoMenu className="toggle-icon" />
            </div> &nbsp;&nbsp;
            <img src='https://primary0101211.s3.ap-south-1.amazonaws.com/v3/assets/images/Logo.png' alt="Logo" className="manager-company-logo" />
          </div>
          <h2 className="text-center" style={{ color: 'white' }}>Manager</h2>

          <div className="manager-header-right">
            {/* Add Leads Button */}
            <button className="btn btn-primary lead-button">Add Leads</button>

            <div className="manager-header-icons">
              <div className="manager-nav-icon-container">
                <FaBell className="manager-nav-icon" />
                <span className="manager-nav-badge">12</span>
              </div>
              <div className="manager-nav-icon-container">
                <FaEnvelope className="manager-nav-icon" />
                <span className="manager-nav-badge">24</span>
              </div>

              <div className="manager-nav-icon-container" onClick={handleProfileClick}>
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
                    <div className="manager-nav-profile-item" onClick={handleLogout}>Sign Out</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`manager-sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="manager-position-sticky">
            <ul className="nav flex-column">
              <li className="manager-nav-item">
                <Link className="nav-link" to="/m-dashboard" onClick={handleNavItemClick}>
                  <FaHome className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">Dashboard</span>}
                </Link>
              </li>

              <li className="manager-nav-item">
                <Link className="nav-link" to="/m-view-leads" onClick={handleNavItemClick}>
                  <FaClipboardList className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">All Leads</span>}
                </Link>
              </li>

              <li className="manager-nav-item">
                <Link className="nav-link" to="/m-potential-leads" onClick={handleNavItemClick}>
                  <FaChartLine className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">My Teams Opportunities</span>}
                </Link>
              </li>

              <li className="manager-nav-item">
                <Link className="nav-link" to="/m-customers" onClick={handleNavItemClick}>
                  <FaUserFriends className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">My Teams customer</span>}
                </Link>
              </li>
              <li className="manager-nav-item">
                <Link className="nav-link" to="/m-myteam" onClick={handleNavItemClick}>
                  <FaPeopleCarry className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">My Teams </span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Manager;
