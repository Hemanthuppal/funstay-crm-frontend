import React, { useState,useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarCheck, FaUmbrellaBeach, FaWalking, FaFileInvoiceDollar, FaTachometerAlt, FaBell, FaEnvelope, FaCaretDown,FaRegAddressBook, FaCalendarAlt, FaBullhorn, FaUsersCog, FaHome, FaClipboardList, FaChartLine, FaUserFriends, FaPeopleCarry          } from "react-icons/fa";
import { IoHomeOutline, IoMenu } from "react-icons/io5";
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate ,useLocation} from 'react-router-dom';
import { AuthContext } from "../../AuthContext/AuthContext";
import { baseURL } from "../../Apiservices/Api";
import { ThemeContext } from "../Themes/ThemeContext";

const Sales = ({ onToggleSidebar }) => {

  const [formData, setFormData] = useState({
    imageUrl: "",
  });
  const [notifications, setNotifications] = useState([]);
  const { themeColor } = useContext(ThemeContext);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
   const [emailNotifications, setEmailNotifications] = useState([]);
      const [showEmailNotificationDropdown, setShowEmailNotificationDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggle menu
  const navigate = useNavigate();
  const location = useLocation();
  const { logout,userName,userId,authToken } = useContext(AuthContext);

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
      await fetch(`${baseURL}/sales/notifications/${notificationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // const handleNotificationClick = async (notification) => {
  //   await markNotificationAsRead(notification.id);
  //   setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
  //   setShowNotificationDropdown(false);
  
  //   if (notification.leadid) {
  //     navigate(`/opportunity-comments/${notification.leadid}`);
  //   } else {
  //     navigate('/View-lead');
  //   }
  //   // Use a timeout to ensure navigation happens before the reload
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 0);
  // };


  
  const handleNotificationClick = async (notification) => {
    await markNotificationAsRead(notification.id);
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    setShowNotificationDropdown(false);
  
    // Navigate based on conditions
    if (notification.status === "lead") {
      navigate("/View-lead");
    } else if (notification.status === "opportunity") {
      navigate("/potential-leads");
    } else if (notification.leadid) {
      navigate(`/opportunity-comments/${notification.leadid}`);
    } else {
      navigate("/View-leads");
    }
  
    // Use a timeout to ensure navigation happens before the reload
    setTimeout(() => {
      window.location.reload();
    }, 0);
  };
  // useEffect(() => {
  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await fetch(`${baseURL}/sales/notifications?managerid=${userId}`);
  //       const data = await response.json();
  //       if (data.notifications) setNotifications(data.notifications);
  //     } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   };

  //   fetchNotifications();
  //   const interval = setInterval(fetchNotifications, 5000);
  //   return () => clearInterval(interval);
  // }, [userId]);

  const fetchNotifications = async () => {
      try {
        const response = await fetch(`${baseURL}/api/sales/email/notifications?managerid=${userId}`);
        const data = await response.json();
        setNotifications(data.notifications || []); // Fallback to empty array if undefined
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]); // Set to empty array on error
      }
    };
  
    const fetchEmailNotifications = async () => {
      try {
        const response = await fetch(`${baseURL}/api/sales/email/notifications?managerid=${userId}`);
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
        navigate(`/s_email-history/${emailnotification.leadid}`, { state: { email: emailnotification.email } });
      } else {
        navigate('/potential-leads');
      }
    };

  return (
    <>
      <div className="sales-container">
        <div className="sales-header"style={{ "--theme-color": themeColor }}>
          <div className="sales-header-left">
            <div
              className={`sales-sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
              onClick={toggleSidebar}
            >
              <IoMenu className="toggle-icon" />
            </div> &nbsp;&nbsp;
            <img src='https://primary0101211.s3.ap-south-1.amazonaws.com/v3/assets/images/Logo.png' alt="Logo" className="sales-company-logo" />
          </div>
          <h2 className="text-center user-sales" style={{ color: 'white' }}> {userName ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase() : ""} - Associate</h2>

          <div className="sales-header-right">
            {/* Add Leads Button */}
            {/* <button className="btn lead-button">Add Leads</button> */}

            <div className="sales-header-icons">
              <div className="sales-nav-icon-container" onClick={toggleNotificationDropdown}>
                <FaBell className="sales-nav-icon" />
                {/* <span className="sales-nav-badge">12</span> */}

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
                                  {/* <div style={{ fontWeight: notification.read ? "normal" : "bold" }}>
                                  {notification.name}{notification.message}
                                  </div> */}
       <div style={{ fontWeight: notification.read ? "normal" : "bold" }}>
  {`${(notification.name || "")} ${(notification.message || "")}`.slice(0, 40)}
  {(notification.name?.length || 0) + (notification.message?.length || 0) > 40 ? "..." : ""}
</div>


                                  {/* <div style={{ fontWeight: notification.read ? "normal" : "bold" }}>
  {(notification.name + notification.message).length > 40 
    ? (notification.name + notification.message).slice(0, 40) + "..." 
    : notification.name + notification.message}
</div> */}

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

              <div className="sales-nav-icon-container" onClick={handleProfileClick}>
                <div className="sales-nav-profile">
                {formData.imageUrl ? (
        <img
          src={`${baseURL}${formData.imageUrl}`}
          alt="Profile"
           className="sales-nav-profile-img"
        />
      ) : (
        <img
          src="https://i.pravatar.cc/100?img=4" // Fallback image
          alt="Default Profile"
          className="sales-nav-profile-img"
        />
      )}
                  {/* <img
                    src="https://i.pravatar.cc/40?img=4"
                    alt="Profile"
                    className="sales-nav-profile-img"
                  /> */}
                  <FaCaretDown className="sales-nav-caret-icon" />
                </div>
                {showDropdown && (
                  <div className="sales-nav-profile-dropdown">
                    <div className="sales-nav-profile-header">
                      <strong> {userName ? userName.charAt(0).toUpperCase() + userName.slice(1).toLowerCase() : ""}</strong>
                    </div>
                    <div
      className="sales-nav-profile-item"
      onClick={() => navigate("/profile")}
    >
      Your Profile
    </div>
                    {/* <div className="sales-nav-profile-item">Settings</div>
                    <div className="sales-nav-profile-item">Help Center</div> */}
                    <div className="sales-nav-profile-item" onClick={handleLogout}>Sign Out</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`sales-sidebar ${collapsed ? "collapsed" : ""}`} style={{ "--theme-color": themeColor }}>
          <div className="sales-position-sticky">
            <ul className="nav flex-column">
              <li
                className={`sales-nav-item ${location.pathname === "/s-dashboard" ? "active" : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/s-dashboard"
                  onClick={handleNavItemClick}
                >
                  <FaHome className="sales-nav-icon" />
                  {!collapsed && <span className="link_text">Dashboard</span>}
                </Link>
              </li>
               {/* <li
                className={`sales-nav-item ${location.pathname.startsWith ("/s-allleads")||
                    location.pathname.startsWith( "/s-view-lead")
                   ? "active" : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/s-allleads"
                  onClick={handleNavItemClick}
                >
                  <FaHome className="sales-nav-icon" />
                  {!collapsed && <span className="link_text">All Leads</span>}
                </Link>
              </li> */}
              <li
                className={`sales-nav-item ${location.pathname.startsWith("/View-lead") ||
                    location.pathname.startsWith("/edit-lead") ||
                    location.pathname.startsWith("/add-lead") ||
                    location.pathname.startsWith("/comments") ||
                    location.pathname.startsWith("/view-lead") ||
                    location.pathname.startsWith("/create-customer-opportunity")
                    ? "active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/View-lead"
                  onClick={handleNavItemClick}
                >
                  <FaUsers className="sales-nav-icon" />
                  {!collapsed && <span className="link_text">My Leads</span>}
                </Link>
              </li>
              <li
                className={`sales-nav-item ${location.pathname.startsWith("/potential-leads") ||
                    location.pathname.startsWith("/edit-opportunity") ||
                    location.pathname.startsWith("/opportunity-comments") ||
                    location.pathname.startsWith("/details") ||
                    location.pathname.startsWith("/s_email-history") 
                    ? "active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/potential-leads"
                  onClick={handleNavItemClick}
                >
                  <FaChartLine className="sales-nav-icon" />
                  {!collapsed && (
                    <span className="link_text">My Opportunities</span>
                  )}
                </Link>
              </li>

              <li
                className={`sales-nav-item ${location.pathname.startsWith("/s-customers") ||                   
                    location.pathname.startsWith("/sales-details") ||
                    location.pathname.startsWith("/customerdetails")||
                    location.pathname.startsWith("/editcustomerdetails") 
                    ? "active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/s-customers"
                  onClick={handleNavItemClick}
                >
                  <FaUserFriends className="sales-nav-icon" />
                  {!collapsed && <span className="link_text">My Customers</span>}
                </Link>
              </li>
              <li
                className={`sales-nav-item ${location.pathname.startsWith("/s-myteam") ||                   
                    location.pathname.startsWith("/s-myteam")
                    
                    ? "active"
                    : ""
                  }`}
              >
                <Link
                  className="nav-link"
                  to="/s-myteam"
                  onClick={handleNavItemClick}
                >
                  <FaUserFriends className="sales-nav-icon" />
                  {!collapsed && <span className="link_text">My Team</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sales;
