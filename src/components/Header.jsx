import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import blank from "../assets/images/notification-profile.png";
import ApiService from "../services/ApiService";
import { toast } from "react-toastify";
import moment from "moment";
import circle from "../assets/images/yellow-circle.png";
import { NavLink } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/css/profile-dropdown.css";
import "../assets/css/dark-mode.css";
import "../assets/css/dark-mode-animations.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = useState(
    JSON.parse(localStorage.getItem("admin")) || {
      name: "Super Administrator",
      email: "admin@emiratihub.com",
    }
  );
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      time: "1 hour",
      avatar: blank,
    },
    {
      id: 2,
      message:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      time: "2 hours",
      avatar: blank,
    },
    {
      id: 3,
      message:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      time: "3 hours",
      avatar: blank,
    },
    {
      id: 4,
      message:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      time: "4 hours",
      avatar: blank,
    },
  ]);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const profileDropdownTimeoutRef = useRef(null);
  const notificationDropdownTimeoutRef = useRef(null);

  // Check if we're on the Ask Question page
  const isAskQuestionPage =
    location.pathname.includes("/companies") ||
    location.pathname.includes("/ask-question");

  // Check if we're on the Chat page
  const isChatPage =
    location.pathname.includes("/users") ||
    location.pathname.includes("/messages");

  // Check if we're on the My Lawyers page
  const isMyLawyersPage =
    location.pathname.includes("/jobs") ||
    location.pathname.includes("/my-lawyers");

  // Check if we're on the My Cases page
  const isMyCasesPage = location.pathname.includes("/my-cases");

  // Check if we're on the Lawyers page
  const isLawyersPage = location.pathname.includes("/lawyers");

  // Check if we're on the Notifications page
  const isNotificationsPage = location.pathname.includes("/notifications");

  // Check if we're on the Case Details page
  const isCaseDetailsPage =
    location.pathname.includes("/my-cases/") &&
    location.pathname !== "/my-cases";

  // Check if we're on the Employees page
  const isEmployeesPage = location.pathname.includes("/employees");

  // Check if we're on the Employee Details page
  const isEmployeeDetailsPage =
    location.pathname.includes("/employees/") &&
    location.pathname !== "/employees";

  const logout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleProfileClick = () => {
    navigate("/employees/detail");
    setShowProfileDropdown(false);
  };

  // Handle profile dropdown with delay to prevent closing when moving cursor to dropdown
  const handleProfileDropdownEnter = () => {
    // Clear any pending timeout
    if (profileDropdownTimeoutRef.current) {
      clearTimeout(profileDropdownTimeoutRef.current);
      profileDropdownTimeoutRef.current = null;
    }
    setShowProfileDropdown(true);
  };

  const handleProfileDropdownLeave = () => {
    // Add a small delay before closing to allow cursor to move to dropdown
    profileDropdownTimeoutRef.current = setTimeout(() => {
      setShowProfileDropdown(false);
      profileDropdownTimeoutRef.current = null;
    }, 200); // 200ms delay
  };

  // Handle notification dropdown with delay to prevent closing when moving cursor to dropdown
  const handleNotificationDropdownEnter = () => {
    // Clear any pending timeout
    if (notificationDropdownTimeoutRef.current) {
      clearTimeout(notificationDropdownTimeoutRef.current);
      notificationDropdownTimeoutRef.current = null;
    }
    setShowNotificationDropdown(true);
  };

  const handleNotificationDropdownLeave = () => {
    // Add a small delay before closing to allow cursor to move to dropdown
    notificationDropdownTimeoutRef.current = setTimeout(() => {
      setShowNotificationDropdown(false);
      notificationDropdownTimeoutRef.current = null;
    }, 200); // 200ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (profileDropdownTimeoutRef.current) {
        clearTimeout(profileDropdownTimeoutRef.current);
      }
      if (notificationDropdownTimeoutRef.current) {
        clearTimeout(notificationDropdownTimeoutRef.current);
      }
    };
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    // Create transition overlay effect
    const overlay = document.createElement('div');
    overlay.className = 'mode-transition-overlay';
    document.body.appendChild(overlay);
    
    // Apply dark mode class to body with smooth transition
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
      document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    } else {
      document.body.classList.remove("dark-mode");
      document.body.style.transition = "background-color 0.3s ease, color 0.3s ease";
    }
    
    // Add a temporary class for page transition effect
    document.body.classList.add("mode-transitioning");
    
    // Remove overlay and transition class after animation
    setTimeout(() => {
      document.body.classList.remove("mode-transitioning");
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 600);
  };

  useEffect(() => {
    // getNotifications();
    
    // Apply dark mode on component mount
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const getNotifications = async () => {
    try {
      const response = await ApiService.request({
        method: "GET",
        url: "getNotifications",
      });
      const data = response.data;
      if (data.status) {
        setNotifications(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await ApiService.request({
        method: "POST",
        url: "clearAllNotifications",
      });
      const data = response.data;
      if (data.status) {
        setNotifications([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Notification Dropdown Component
  const NotificationDropdown = () => (
    <div
      className="notification-dropdown position-absolute bg-white shadow-lg rounded-3 border"
      style={{
        top: "100%",
        right: "0",
        width: "320px",
        maxHeight: "300px",
        zIndex: 1050,
        marginTop: "10px",
      }}
      onMouseEnter={handleNotificationDropdownEnter}
      onMouseLeave={handleNotificationDropdownLeave}
    >
      <div
        className="notification-list"
        style={{ maxHeight: "200px", overflowY: "auto" }}
      >
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="notification-item p-2 border-bottom"
          >
            <div className="d-flex align-items-start">
              <div className="symbol symbol-30px me-2">
                <img
                  src={notification.avatar}
                  alt="Notification"
                  className="rounded-circle"
                  style={{ width: "30px", height: "30px", objectFit: "cover" }}
                />
              </div>
              <div className="flex-grow-1">
                <p
                  className="text-dark mb-1 fs-8"
                  style={{ lineHeight: "1.3", fontSize: "12px" }}
                >
                  {notification.message}
                </p>
                <small className="text-muted fs-9" style={{ fontSize: "10px" }}>
                  {notification.time}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 text-center border-top">
        <NavLink
          to="/notifications"
          className="btn bg-black text-white btn-sm w-100"
          onClick={() => setShowNotificationDropdown(false)}
          style={{ fontSize: "12px", padding: "4px 8px" }}
        >
          See All
        </NavLink>
      </div>
    </div>
  );

  // Profile Dropdown Component
  const ProfileDropdown = () => (
    <div
      className="profile-dropdown position-absolute bg-white shadow-lg rounded-3 border"
      style={{
        top: "100%",
        right: "0",
        width: "275px",
        zIndex: 1050,
        marginTop: "5px",
      }}
      onMouseEnter={handleProfileDropdownEnter}
      onMouseLeave={handleProfileDropdownLeave}
    >
      <div className="p-3">
        <div className="d-flex align-items-center mb-3">
          <div className="symbol symbol-50px me-3">
            <img
              src={blank}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold text-dark fs-5 mb-1">{user.name}</div>
            <div className="text-muted fs-7">{user.email}</div>
          </div>
        </div>
        <div className="separator my-3"></div>
        <div className="d-flex flex-column gap-2">
          <button
            onClick={handleProfileClick}
            className="btn btn-transparent text-start p-2 text-muted"
            style={{ fontSize: "14px" }}
          >
            Account Settings
          </button>
          <button
            onClick={logout}
            className="btn btn-transparent text-start p-2 text-muted"
            style={{ fontSize: "14px" }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="kt_app_header"
      className="app-header modern-header-container"
      data-aos="fade-down"
    >
      {isAskQuestionPage ? (
        // Ask Question Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">Post question</h1>
              <p className="text-gray-600 fs-6 mb-0">Post Connect and Solve</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="symbol symbol-40px position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <div className="symbol-label text-white rounded-circle cursor-pointer">
                <img
                  src={blank}
                  className="w-40px h-40px rounded-circle"
                  alt="Profile"
                />
              </div>
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isChatPage ? (
        // Chat Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">Messages</h1>
              <p className="text-gray-600 fs-6 mb-0">
                Quick, Clear and concise communications.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="symbol symbol-40px position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <div className="symbol-label bg-warning text-white rounded-circle cursor-pointer">
                <img
                  src={blank}
                  className="w-40px h-40px rounded-circle"
                  alt="Profile"
                />
              </div>
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isMyLawyersPage ? (
        // My Lawyers Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">My Lawyers</h1>
              <p className="text-gray-600 fs-6 mb-0">
                Stay updated with your legal team anytime.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="symbol symbol-40px position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <div className="symbol-label bg-warning text-white rounded-circle cursor-pointer">
                <img
                  src={blank}
                  className="w-40px h-40px rounded-circle"
                  alt="Profile"
                />
              </div>
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isMyCasesPage ? (
        // My Cases Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">My Cases</h1>
              <p className="text-gray-600 fs-6 mb-0">
                View all your cases and connect with interested lawyers.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="modern-icon-container position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <img
                src={blank}
                className="w-40px h-40px rounded-circle cursor-pointer"
                alt="Profile"
              />
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isLawyersPage ? (
        // Lawyers Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">
                Explore Lawyers / Lawyers{" "}
              </h1>
              <p className="text-gray-600 fs-6 mb-0">
                Search, compare, and connect with verified lawyers instantly.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="modern-icon-container position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <img
                src={blank}
                className="w-40px h-40px rounded-circle cursor-pointer"
                alt="Profile"
              />
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isNotificationsPage ? (
        // Notifications Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">Notifications</h1>
              <p className="text-gray-600 fs-6 mb-0">Listing notifications</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div className="modern-icon-container position-relative">
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                style={{ fontSize: "0.6rem" }}
              >
                3
              </span>
            </div>
            <div 
              className="modern-icon-container position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <img
                src={blank}
                className="w-40px h-40px rounded-circle cursor-pointer"
                alt="Profile"
              />
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isCaseDetailsPage ? (
        // Case Summary Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">Case Summary</h1>
              <p className="text-gray-600 fs-6 mb-0">Detail</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="modern-icon-container position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <img
                src={blank}
                className="w-40px h-40px rounded-circle cursor-pointer"
                alt="Profile"
              />
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isEmployeeDetailsPage ? (
        // Employee Details Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">Employee Details</h1>
              <p className="text-gray-600 fs-6 mb-0">
                View and manage employee information.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="modern-icon-container position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <img
                src={blank}
                className="w-40px h-40px rounded-circle cursor-pointer"
                alt="Profile"
              />
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : isEmployeesPage ? (
        // Employees Page Header
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            {/* Mobile menu toggle */}
            <div
              className="d-flex align-items-center d-lg-none me-3"
              title="Show sidebar menu"
            >
              <div
                className="btn btn-icon btn-active-color-primary w-35px h-35px"
                id="kt_app_sidebar_mobile_toggle"
              >
                <i className="bi bi-list text-gray-600 fs-1"></i>
              </div>
            </div>
            <div>
              <h1 className="fw-bold text-dark fs-2 mb-2">Team</h1>
              <p className="text-gray-600 fs-6 mb-0">
                Add your team members and send invites.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
            
            <div
              className="modern-icon-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell text-gray-600 fs-4"></i>
              {notifications.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-black"
                  style={{ fontSize: "0.6rem" }}
                >
                  {notifications.length}
                </span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>
            <div 
              className="modern-icon-container position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <img
                src={blank}
                className="w-40px h-40px rounded-circle cursor-pointer"
                alt="Profile"
              />
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      ) : (
        // Default Header Layout
        <div className="modern-header-layout d-flex align-items-center justify-content-between w-100">
          {/* Mobile menu toggle */}
          <div
            className="d-flex align-items-center d-lg-none me-3"
            title="Show sidebar menu"
          >
            <div
              className="btn btn-icon btn-active-color-primary w-35px h-35px"
              id="kt_app_sidebar_mobile_toggle"
            >
              <i className="bi bi-list text-gray-600 fs-1"></i>
            </div>
          </div>

          {/* Search Bar */}
          <div className="modern-search-container flex-grow-1 me-4">
            <div className="modern-search-wrapper position-relative">
              <input
                type="search"
                name="search"
                placeholder="Search"
                className="modern-search-input"
              />
              <i className="bi bi-search modern-search-icon position-absolute"></i>
            </div>
          </div>

          {/* Right side icons */}
          <div className="modern-icons-container d-flex align-items-center gap-5image.png">
            {/* Dark Mode Toggle */}
            <motion.div 
              className="modern-icon-container dark-mode-toggle"
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                <motion.i
                  key={isDarkMode ? "sun" : "moon"}
                  className={`modern-icon ${isDarkMode ? 'bi bi-sun' : 'bi bi-moon'}`}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>

            {/* Messages Icon */}
            <NavLink to="/chat">
              <div className="modern-icon-container">
                <i className="bi bi-chat-dots modern-icon"></i>
              </div>
            </NavLink>

            {/* Notifications Icon */}
            <div
              className="modern-notification-container position-relative"
              onMouseEnter={handleNotificationDropdownEnter}
              onMouseLeave={handleNotificationDropdownLeave}
            >
              <i className="bi bi-bell modern-icon"></i>
              {notifications.length > 0 && (
                <span className="modern-notification-indicator"></span>
              )}
              {showNotificationDropdown && <NotificationDropdown />}
            </div>

            {/* User Profile */}
            <div
              className="app-navbar-item ms-1 ms-lg-3 position-relative"
              onMouseEnter={handleProfileDropdownEnter}
              onMouseLeave={handleProfileDropdownLeave}
            >
              <div className="cursor-pointer symbol symbol-35px symbol-md-40px profile-dropdown">
                <img src={blank} alt="user" className="modern-profile-image" />
              </div>
              {showProfileDropdown && <ProfileDropdown />}
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        show={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default Header;
