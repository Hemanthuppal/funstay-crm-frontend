import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarCheck, FaUmbrellaBeach, FaWalking, FaFileInvoiceDollar, FaPalette, FaBriefcase, FaArchive, FaUserCheck, FaTags, FaTachometerAlt, FaMapMarkerAlt, FaBell, FaEnvelope, FaCaretDown, FaRegAddressBook, FaCalendarAlt, FaBullhorn, FaUsersCog, FaHome, FaClipboardList, FaChartLine, FaUserFriends, FaPeopleCarry, FaHSquare } from "react-icons/fa";
import { IoHomeOutline, IoMenu } from "react-icons/io5";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from "../../AuthContext/AuthContext";
import { baseURL } from "../../Apiservices/Api";
import { adminMail,headofSalesMail } from "../../Apiservices/Api";
import { ThemeContext } from "../Themes/ThemeContext";

const Navbar = ({ onToggleSidebar }) => {
  const [formData, setFormData] = useState({
    imageUrl: "",
  });
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggle menu
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, userName, userId, authToken ,userEmail} = useContext(AuthContext);
  const { themeColor } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState([]);
  const [emailNotifications, setEmailNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showEmailNotificationDropdown, setShowEmailNotificationDropdown] = useState(false);
  const [emailCount, setEmailCount] = useState(0);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    onToggleSidebar(!collapsed);
  };

  useEffect(() => {
    // Fetch employee details when the component mounts
    const fetchEmployeeDetails = async () => {
      try {
        const response = await fetch(`${baseURL}/employee/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setFormData({
          imageUrl: data.image || "", // Assuming image URL is returned
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchEmployeeDetails();
  }, [userId, authToken]);

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

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowEmailNotificationDropdown(false); // Close email dropdown if open
  };

  const toggleEmailNotificationDropdown = () => {
    setShowEmailNotificationDropdown(!showEmailNotificationDropdown);
    setShowNotificationDropdown(false); // Close bell dropdown if open
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await fetch(`${baseURL}/api/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification.id);
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    setShowNotificationDropdown(false);

    // Navigate based on whether the notification has a leadid
    if (notification.leadid) {
      navigate(`/a-opportunity-comments/${notification.leadid}`);
    } else {
      navigate('/a-view-lead');
    }

    // Use a timeout to ensure navigation happens before the reload
    setTimeout(() => {
      window.location.reload();
    }, 0);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${baseURL}/email/notifications?managerid=${adminMail}`);
      const data = await response.json();
      setNotifications(data.notifications || []); // Fallback to empty array if undefined
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]); // Set to empty array on error
    }
  };

  const fetchEmailNotifications = async () => {
    try {
      const response = await fetch(`${baseURL}/api/email/notifications`);
      const data = await response.json();
      const emails = data.emailnotifications || []; // Fallback to empty array if undefined
      setEmailNotifications(emails);
      // setEmailCount(emails.length);
    } catch (error) {
      console.error("Error fetching email notifications:", error);
      setEmailNotifications([]); // Set to empty array on error
      // setEmailCount(0);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
      await fetchEmailNotifications();
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const markEmailNotificationAsRead = async (emailnotificationId) => {
    try {
      await fetch(`${baseURL}/api/email/notifications/${emailnotificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    } catch (error) {
      console.error("Error marking email notification as read:", error);
    }
  };

  const handleEmailNotificationClick = async (emailnotification) => {
    await markEmailNotificationAsRead(emailnotification.id);
    setEmailNotifications((prev) => prev.filter((n) => n.id !== emailnotification.id));
    setShowEmailNotificationDropdown(false);

    // Navigate based on whether the notification has a leadid
    if (emailnotification.leadid) {
      navigate(`/email-history/${emailnotification.leadid}`, { state: { email: emailnotification.email } });
    } else {
      navigate('/a-potential-leads');
    }
  };

  return (
    <>
      <div className="admin-container">
        <div className="admin-header" style={{ "--theme-color": themeColor }}>
          <div className="admin-header-left">
            <div
              className={`admin-sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
              onClick={toggleSidebar}
            >
              <IoMenu className="toggle-icon" />
            </div> &nbsp;&nbsp;
            <img src={'https://primary0101211.s3.ap-south-1.amazonaws.com/v3/assets/images/Logo.png'} alt="Logo" className="admin-company-logo" />
          </div>
          <h2 className="text-center user-admin" style={{ color: 'white' }}>
  {userEmail === headofSalesMail ? "Head of Sales" : userName}
</h2>
          <div className="admin-header-right">
            <div className="admin-header-icons">
              {/* Bell Notifications */}
              <div className="admin-nav-icon-container" onClick={toggleNotificationDropdown}>
                <FaBell className="admin-nav-icon" />
                {(notifications?.length || 0) > 0 && (
                  <span className="admin-nav-badge">{notifications?.length || 0}</span>
                )}
                {showNotificationDropdown && (
                  <div className="notification-dropdown">
                    <div className="notification-dropdown-header">Notifications</div>
                    <div className="notification-dropdown-body">
                      {!notifications || notifications.length === 0 ? (
                        <div className="notification-item">No new notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="notification-item"
                            onClick={() => handleNotificationClick(notification)}
                            style={{ padding: "8px", cursor: "pointer" }}
                          >
                            <div style={{ fontWeight: notification.read ? "normal" : "bold" }}>
                              {notification.message.length > 40
                                ? `${notification.message.slice(0, 40)}...`
                                : notification.message}
                            </div>
                            <div style={{ fontSize: "0.8em", color: "#888" }}>
                              {new Date(notification.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Email Notifications */}


              <div className="admin-nav-icon-container" onClick={toggleEmailNotificationDropdown}>
                <FaEnvelope className="admin-nav-icon" />
                {(emailNotifications?.length || 0) > 0 && (
                  <span className="admin-nav-badge">{emailNotifications.length}</span>
                )}
                {showEmailNotificationDropdown && (
                  <div className="notification-dropdown">
                    <div className="notification-dropdown-header">Email Notifications</div>
                    <div className="notification-dropdown-body">
                      {(!emailNotifications || emailNotifications.length === 0) ? (
                        <div className="notification-item">No new email notifications</div>
                      ) : (
                        emailNotifications.map((emailnotification) => (
                          <div
                            key={emailnotification.id}
                            className="notification-item"
                            onClick={() => handleEmailNotificationClick(emailnotification)}
                            style={{ padding: "8px", cursor: "pointer" }}
                          >
                            <div style={{ fontWeight: emailnotification.read ? "normal" : "bold" }}>
                              {emailnotification.text?.length > 40
                                ? `${emailnotification.text.slice(0, 40)}...`
                                : emailnotification.text}
                            </div>
                            <div style={{ fontSize: "0.8em", color: "#888" }}>
                              {new Date(emailnotification.created_at).toLocaleString()}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>


              <div className="admin-nav-icon-container">
                <Link className="nav-link" to="/themes">

                  <FaPalette className="admin-nav-icon" style={{ cursor: "pointer" }} />
                </Link>
              </div>


              <div className="admin-nav-icon-container" onClick={handleProfileClick}>
                <div className="admin-nav-profile">

                  {formData.imageUrl ? (
                    <img
                      src={`${baseURL}${formData.imageUrl}`}
                      alt="Profile"
                      className="admin-nav-profile-img"
                    />
                  ) : (
                    <img
                      src="https://i.pravatar.cc/100?img=4" // Fallback image
                      alt="Default Profile"
                      className="admin-nav-profile-img"
                    />
                  )}
                  {/* <img
                    src="https://i.pravatar.cc/40?img=4"
                    alt="Profile"
                    className="admin-nav-profile-img"
                  /> */}
                  <FaCaretDown className="admin-nav-caret-icon" />
                </div>
                {showDropdown && (
                  <div className="admin-nav-profile-dropdown">
                    <div className="admin-nav-profile-header">
                      <strong>{userName}</strong>
                    </div>
                    <div
                      className="admin-nav-profile-item"
                      onClick={() => navigate("/a-profile")}
                    >
                      Your Profile
                    </div>
                    {/* <div className="admin-nav-profile-item">Your Profile</div> */}
                    {/* <div className="admin-nav-profile-item">Settings</div>
                    <div className="admin-nav-profile-item">Help Center</div> */}
                    <div className="admin-nav-profile-item" onClick={handleLogout}>Sign Out</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`} style={{ "--theme-color": themeColor }}>
        <div className="admin-position-sticky">
          <ul className="nav flex-column">
            <li className={`admin-nav-item ${location.pathname.startsWith("/dashboard") ? "active"
              : ""
              }`}>
              <Link className="nav-link" to="/dashboard" onClick={handleNavItemClick}>
                <FaHome className="admin-nav-icon" />
                {!collapsed && <span className="link_text">Dashboard</span>}
              </Link>
            </li>

            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-view-lead") ||
                location.pathname.startsWith("/a-edit-lead") ||
                location.pathname.startsWith("/a-add-leads") ||
                location.pathname.startsWith("/a-comments") ||
                location.pathname.startsWith("/a-view-lead") ||
                location.pathname.startsWith("/a-create-customer-opportunity")
                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-view-lead" onClick={handleNavItemClick}>
                <FaClipboardList className="admin-nav-icon" />
                {!collapsed && <span className="link_text">All Leads</span>}
              </Link>
            </li>
            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-myleads") ||
                location.pathname.startsWith("/a-myedit-lead") ||
                location.pathname.startsWith("/a-myadd-leads") ||
                location.pathname.startsWith("/a-mycomments") ||
                location.pathname.startsWith("/a-myview-lead") ||
                location.pathname.startsWith("/a-mycreate-customer-opportunity")
                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-myleads" onClick={handleNavItemClick}>
                <FaUserCheck className="admin-nav-icon" />
                {!collapsed && <span className="link_text">My Leads</span>}
              </Link>
            </li>
            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-potential-leads") ||
                location.pathname.startsWith("/a-edit-opportunity") ||
                location.pathname.startsWith("/a-opportunity-comments") ||
                location.pathname.startsWith("/a-details") ||
                location.pathname.startsWith("/email-history")
                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-potential-leads" onClick={handleNavItemClick}>
                <FaChartLine className="admin-nav-icon" />
                {!collapsed && <span className="link_text">All Opportunities</span>}
              </Link>
            </li>
            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-myopp") ||
                location.pathname.startsWith("/a-myedit-opportunity") ||
                location.pathname.startsWith("/a-myopportunity-comments") ||
                location.pathname.startsWith("/a-mydetails") ||
                location.pathname.startsWith("/a_myemail-history")
                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-myopp" onClick={handleNavItemClick}>
                <FaBriefcase className="admin-nav-icon" />
                {!collapsed && <span className="link_text">My Opportunities</span>}
              </Link>
            </li>
            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-customers") ||
                location.pathname.startsWith("/a-customer-details") ||
                location.pathname.startsWith("/a-customerdetails") ||
                location.pathname.startsWith("/a-editcustomerdetails")

                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-customers" onClick={handleNavItemClick}>
                <FaUserFriends className="admin-nav-icon" />
                {!collapsed && <span className="link_text">All customer</span>}
              </Link>
            </li>
            {userName === "Admin" && (
              <>
                <li
                  className={`admin-nav-item ${location.pathname.startsWith("/a-destinations") ? "active" : ""
                    }`}
                >
                  <Link className="nav-link" to="/a-destinations" onClick={handleNavItemClick}>
                    <FaMapMarkerAlt className="admin-nav-icon" />
                    {!collapsed && <span className="link_text">All Destinations</span>}
                  </Link>
                </li>

                <li
                  className={`admin-nav-item ${location.pathname.startsWith("/a-tags") ? "active" : ""
                    }`}
                >
                  <Link className="nav-link" to="/a-tags" onClick={handleNavItemClick}>
                    <FaTags className="admin-nav-icon" />
                    {!collapsed && <span className="link_text">All Tags</span>}
                  </Link>
                </li>
              </>
            )}
            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-archivedata")


                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-archivedata" onClick={handleNavItemClick}>
                <FaArchive className="admin-nav-icon" />
                {!collapsed && <span className="link_text">Archieved Data </span>}
              </Link>



            </li>
            <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-allteams") ||
                location.pathname.startsWith("/addemployee") ||
                location.pathname.startsWith("/team-members") ||
                location.pathname.startsWith("/editemployee")

                ? "active"
                : ""
                }`}
            >
              <Link className="nav-link" to="/a-allteams" onClick={handleNavItemClick}>
                <FaPeopleCarry className="admin-nav-icon" />
                {!collapsed && <span className="link_text">All Teams </span>}
              </Link>



            </li>

            {/* <li
              className={`admin-nav-item ${location.pathname.startsWith("/a-supplier") ? "active" : ""
                }`}
            >
              <Link className="nav-link" to="/a-supplier" onClick={handleNavItemClick}>
                <FaTags className="admin-nav-icon" />
                {!collapsed && <span className="link_text">Suppliers</span>}
              </Link>
            </li> */}



          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
