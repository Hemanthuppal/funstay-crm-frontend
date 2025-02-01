import React, { useState ,useContext} from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarCheck, FaUmbrellaBeach, FaWalking, FaFileInvoiceDollar, FaTachometerAlt, FaBell, FaEnvelope, FaCaretDown,FaRegAddressBook, FaCalendarAlt, FaBullhorn, FaUsersCog, FaHome, FaClipboardList, FaChartLine, FaUserFriends, FaPeopleCarry          } from "react-icons/fa";
import { IoHomeOutline, IoMenu } from "react-icons/io5";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate ,useLocation} from 'react-router-dom';
import { AuthContext } from "../../AuthContext/AuthContext";

const Manager = ({ onToggleSidebar }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggle menu
  const navigate = useNavigate();
  const { logout,userName } = useContext(AuthContext);

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
    logout(); // Clears authToken, userRole, and userId
    console.log('Logged out');
    navigate('/'); // Redirect to the home or login page
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
          <h2 className="text-center" style={{ color: 'white' }}> {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : ""} - Manager</h2>

          <div className="manager-header-right">
            {/* Add Leads Button */}
            {/* <button className="btn btn-primary lead-button">Add Leads</button> */}

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
                    <strong> {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : ""}</strong>

                    </div>
                    <div className="manager-nav-profile-item">Your Profile</div>
                    {/* <div className="manager-nav-profile-item">Settings</div>
                    <div className="manager-nav-profile-item">Help Center</div> */}
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
              {/* <li className="manager-nav-item">
                <Link className="nav-link" to="/m-dashboard" onClick={handleNavItemClick}>
                  <FaHome className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">Dashboard</span>}
                </Link>
              </li> */}

              <li
                className={`manager-nav-item ${location.pathname.startsWith("/m-view-leads") ||
                  location.pathname.startsWith("/m-edit-lead") ||
                  location.pathname.startsWith("/m-add-leads") ||
                  location.pathname.startsWith("/m-comments") ||
                  location.pathname.startsWith("/m-view-lead") ||
                  location.pathname.startsWith("/m-create-customer-opportunity")
                  ? "active"
                  : ""
                  }`}
              >
                <Link className="nav-link" to="/m-view-leads" onClick={handleNavItemClick}>
                  <FaClipboardList className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">All Leads</span>}
                </Link>
              </li>

              <li
                className={`manager-nav-item ${location.pathname.startsWith("/m-potential-leads") ||
                    location.pathname.startsWith("/m-edit-opportunity") ||
                    location.pathname.startsWith("/m-opportunity-comments") ||
                    location.pathname.startsWith("/m-details")
                    ? "active"
                    : ""
                  }`}
              >
                <Link className="nav-link" to="/m-potential-leads" onClick={handleNavItemClick}>
                  <FaChartLine className="manager-nav-icon" />
                  {!collapsed && <span className="link_text">My Teams Opportunities</span>}
                </Link>
              </li>

              <li
  className={`manager-nav-item ${
    location.pathname.startsWith("/m-customers") ||
    location.pathname.startsWith("/m-customer-details") ||
    location.pathname.startsWith("/m-customerdetails")
      ? "active"
      : ""
  }`}
>
  <Link className="nav-link" to="/m-customers" onClick={handleNavItemClick}>
    <FaUserFriends className="manager-nav-icon" />
    {!collapsed && <span className="link_text">My Teams customer</span>}
  </Link>
</li>

              <li
                className={`manager-nav-item ${location.pathname === "/m-myteam" ? "active" : ""
                  }`}
              >
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
