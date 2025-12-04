import React, { useState, useEffect, useRef } from "react";
import AuthService from "../services/AuthService";
import { useNavigate, NavLink } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";

import notificationProfile from "../assets/images/notification-profile.png";

import postYourLegal from "../assets/images/postYourLegal.png";
import hireLawyer from "../assets/images/hireLawyer.png";
import createNewCase from "../assets/images/createNewCase.png";

import { toast } from "react-toastify";
import ApiService from "../services/ApiService";
import "../assets/css/dashboard-hover-fixes.css";
import "../assets/css/siri-border-animation.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [showPostQuestion, setShowPostQuestion] = useState(false);
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dashboard data states
  const [userInfo, setUserInfo] = useState({ name: "", location: "" });
  const [recentQuestion, setRecentQuestion] = useState(null);
  const [lawyerResponses, setLawyerResponses] = useState([]);
  const [activeLawyers, setActiveLawyers] = useState([]);
  const [inactiveLawyers, setInactiveLawyers] = useState([]);
  const [cases, setCases] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Select states
  const [postQuestionJurisdiction, setPostQuestionJurisdiction] =
    useState(null);
  const [showPostQuestionJurisdictionDropdown, setShowPostQuestionJurisdictionDropdown] = useState(false);
  const [createCaseJurisdiction, setCreateCaseJurisdiction] = useState(null);
  const [createCaseConsultantType, setCreateCaseConsultantType] =
    useState(null);
  const [createCaseLawType, setCreateCaseLawType] = useState(null);
  const [createCaseSubCategory, setCreateCaseSubCategory] = useState(null);
  const postQuestionJurisdictionRef = useRef(null);

  // Select options
  const jurisdictionOptions = [
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
    { label: "Australia", value: "au" },
  ];

  const consultantTypeOptions = [
    { label: "Individual Lawyer", value: "individual" },
    { label: "Law Firm", value: "firm" },
    { label: "Legal Consultant", value: "consultant" },
  ];

  const lawTypeOptions = [
    { label: "Criminal Law", value: "criminal" },
    { label: "Civil Law", value: "civil" },
    { label: "Corporate Law", value: "corporate" },
    { label: "Family Law", value: "family" },
  ];

  const subCategoryOptions = [
    { label: "Traffic Violations", value: "traffic" },
    { label: "White Collar Crime", value: "white-collar" },
    { label: "Drug Offenses", value: "drug" },
    { label: "Violent Crimes", value: "violent" },
  ];

  const handleAddQuestionClick = () => {
    setShowPostQuestion(true);
  };

  const handleClosePostQuestion = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPostQuestion(false);
      setIsClosing(false);
      setShowPostQuestionJurisdictionDropdown(false);
    }, 300); // Match animation duration
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await ApiService.request({
          method: "GET",
          url: "getBusinessDashboard",
        });
        const data = response.data;
        if (data.status) {
          setUserInfo(data.data.user_info || { name: "", location: "" });
          setRecentQuestion(data.data.recent_question || null);
          setLawyerResponses(data.data.lawyer_responses || []);
          setActiveLawyers(data.data.active_lawyers || []);
          setInactiveLawyers(data.data.inactive_lawyers || []);
          setCases(data.data.cases || []);
          setNotifications(data.data.notifications || []);
        } else {
          toast.error(data.message || "Failed to load dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Close post question jurisdiction dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (postQuestionJurisdictionRef.current && !postQuestionJurisdictionRef.current.contains(event.target)) {
        setShowPostQuestionJurisdictionDropdown(false);
      }
    };

    if (showPostQuestionJurisdictionDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPostQuestionJurisdictionDropdown]);

  if (loading) {
    return (
      <div className="d-flex flex-column flex-column-fluid header-main dashboard--inter-font">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column flex-column-fluid header-main dashboard--inter-font">
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          {/* Main Content Row */}
          <div className="row">
            {/* Left Column - Main Content */}
            <div className="col-md-8 pt-4 dashboard-main-content">
              {/* Welcome Header */}
              <div className="mb-6" data-aos="fade-up">
                <h1 className="text-black mb-2 dashboard-welcome-title">
                  Welcome Back! {userInfo.name || "User"}
                </h1>
                <p className="text-gray-600 mb-4 dashboard-welcome-subtitle">
                  {userInfo.location || "Location not available"}
                </p>
              </div>

              {/* Action Cards */}
              <div className="row mb-8">
                <div
                  className="col-lg-4 col-md-6 mb-4"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <div
                    className="card h-100 dashboard-card-hover dashboard-action-card"
                    onClick={handleAddQuestionClick}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body p-4 d-flex flex-column justify-content-between h-100">
                      <div>
                        <h5 className="text-black fw-bold mb-3">
                          Post Your Legal <br /> Issues
                        </h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          className="btn btn-light rounded-circle d-flex justify-content-center align-items-center portal-button-hover dashboard-action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddQuestionClick();
                          }}
                        >
                          <i className="bi bi-plus fs-1 text-dark pe-0"></i>
                        </button>
                        <img
                          src={postYourLegal}
                          alt="Post Your Legal"
                          className="rounded-circle postYourLegalImage"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4 col-md-6 mb-4"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <NavLink
                    to={"/lawyers"}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="card h-100 shadow dashboard-card-hover dashboard-action-card"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="card-body p-4 d-flex flex-column justify-content-between h-100">
                        <div>
                          <h5 className="text-dark fw-bold mb-3">
                            Hire Lawyer
                          </h5>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="dashboard-card-hover-icon">
                            <button
                              className="btn btn-light rounded-circle d-flex justify-content-center align-items-center portal-button-hover dashboard-action-button"
                              type="button"
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="bi bi-plus fs-1 text-dark pe-0"></i>
                            </button>
                          </div>
                          <img
                            src={hireLawyer}
                            alt="Hire Lawyer"
                            className="rounded-circle hireLawyerImage"
                          />
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>

                <div
                  className="col-lg-4 col-md-6 mb-4"
                  data-aos="fade-up"
                  data-aos-delay="300"
                >
                  <div
                    className="card h-100 shadow dashboard-card-hover dashboard-action-card"
                    onClick={() => setShowCreateCase(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body p-4 d-flex flex-column justify-content-between h-100">
                      <div>
                        <h5 className="text-dark fw-bold mb-3">
                          Create New Case
                        </h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <button
                          className="btn rounded-circle d-flex justify-content-center align-items-center dashboard-action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCreateCase(true);
                          }}
                        >
                          <i className="bi bi-plus fs-1 text-black p-0"></i>
                        </button>
                        <img
                          src={createNewCase}
                          alt="Create New Case"
                          className="rounded-circle createNewCaseImage"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Posted Question and Lawyer Respond */}
              <div
                className="card mb-6 shadow recent-posted-question-card recent-question-card-hover dashboard-recent-question-card"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="card-body p-4">
                  <div className="row">
                    {/* Recent Posted Question Section */}
                    <div className="col-lg-7 col-md-12 mb-4 mb-lg-0">
                      <h1 className="fw-bold text-dark mb-4">
                        Recent Posted Question
                      </h1>
                      {recentQuestion ? (
                        <>
                          <p className="text-gray-700 mb-4">
                            {recentQuestion.question}
                          </p>
                          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                            <div className="d-flex align-items-center">
                              <i className="bi bi-eye-fill text-black me-2"></i>
                              <span className="text-black">Views: {recentQuestion.views_count || 0}</span>
                            </div>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-chat-dots-fill text-black me-2"></i>
                              <span className="text-black">Ans: {recentQuestion.answers_count || 0}</span>
                            </div>
                          </div>
                          {recentQuestion.created_at && (
                            <div
                              className="d-flex align-items-center justify-content-center bg-light rounded-pill py-2 px-3 dashboard-date-pill"
                              style={{ width: "40%" }}
                            >
                              <span className="text-black dashboard-date-text">
                                {recentQuestion.created_at}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-600">No questions posted yet</p>
                      )}
                    </div>

                    {/* Lawyer Respond Section */}
                    <div className="col-lg-5 col-md-12">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                        <h2 className="fw-bold mb-0 mb-md-0 dashboard-lawyer-respond-title">
                          Lawyer Respond
                        </h2>
                        <a
                          href="#"
                          className="text-muted fw-semibold text-decoration-none text-md-end"
                        >
                          See All
                        </a>
                      </div>

                      {lawyerResponses.length > 0 ? (
                        lawyerResponses.slice(0, 3).map((lawyer, index, array) => (
                          <div key={lawyer.id || index} className={`d-flex align-items-start ${index < array.length - 1 ? 'mb-4' : ''}`}>
                            <div className="symbol symbol-50px me-3 flex-shrink-0">
                              <img
                                src={lawyer.picture || notificationProfile}
                                alt={lawyer.name}
                                className="rounded-circle"
                                onError={(e) => {
                                  e.target.src = notificationProfile;
                                }}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="fw-bold text-dark mb-1">
                                {lawyer.name}
                              </h6>
                              <p className="text-gray-600 mb-0 small">
                                {lawyer.answer || "Answered your question"}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No lawyer responses yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* My Lawyers */}
              <div
                className="card shadow-sm border-0 dashboard-my-lawyers-card"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="card-body p-4">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-dark mb-0">My Lawyers</h4>
                    
                    <NavLink to={"/my-lawyers"}>
                      <a
                        href="#"
                        className="fw-semibold text-decoration-none text-muted"
                      >
                        See All
                      </a>
                    </NavLink>
                  </div>

                  {/* Tab Buttons */}
                  <div className="my-4 lawyers-tabs">
                      <button
                        className={`btn rounded-pill portal-tab-hover ${
                          activeTab === "active"
                            ? "bg-black text-white"
                            : "btn-light text-black"
                        }`}
                        onClick={() => setActiveTab("active")}
                      >
                        Active Lawyers
                      </button>
                      <button
                        className={`btn rounded-pill portal-tab-hover ${
                          activeTab === "inactive"
                            ? "bg-black text-white"
                            : "btn-light text-black"
                        }`}
                        onClick={() => setActiveTab("inactive")}
                      >
                        Inactive Lawyers
                      </button>
                    </div>

                  {/* Lawyers List */}
                  {(activeTab === "active" ? activeLawyers : inactiveLawyers).length > 0 ? (
                    (activeTab === "active" ? activeLawyers : inactiveLawyers).map((lawyer, index) => (
                    <div
                      key={lawyer.id || index}
                      className="card mb-3 border-0 shadow-sm lawyer-card-hover"
                      data-aos="fade-up"
                      data-aos-delay={`${500 + index * 100}`}
                    >
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          {/* Profile */}
                          <div className="col-md-4 col-sm-12 mb-2 mb-md-0">
                            <div className="d-flex align-items-center">
                              <img
                                src={lawyer.lawyer_picture || notificationProfile}
                                alt={lawyer.lawyer_name}
                                className="rounded-circle me-3"
                                width="48"
                                height="48"
                                onError={(e) => {
                                  e.target.src = notificationProfile;
                                }}
                              />
                              <div>
                                <h6 className="fw-bold text-dark mb-0">
                                  {lawyer.lawyer_name}
                                </h6>
                                <small className="text-muted">
                                  {lawyer.practice_areas || "Lawyer"}
                                </small>
                              </div>
                            </div>
                          </div>

                            {/* Practice Areas */}
                            <div className="col-md-3 col-sm-6 mb-2 mb-md-0">
                              <div className="text-muted small">
                                {lawyer.practice_areas || "N/A"}
                              </div>
                            </div>

                            {/* Renewal Date */}
                            <div className="col-md-3 col-sm-6 mb-2 mb-md-0">
                              <div className="text-muted small">
                                {lawyer.renewal_date ? `Renew ${lawyer.renewal_date}` : "N/A"}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="col-md-2 col-sm-12 text-md-end">
                              <div className="fw-semibold text-dark">
                                {lawyer.price ? `${lawyer.price.toFixed(2)} ${lawyer.currency || 'USD'}` : "N/A"}
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No {activeTab === "active" ? "active" : "inactive"} lawyers found</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* My Cases */}
              <div
                className="card mb-6 shadow my-cases-card-hover"
                data-aos="fade-left"
                data-aos-delay="600"
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold text-dark mb-0">My Cases</h2>
                    <NavLink to={"/my-cases"}>
                      <a
                        href="#"
                        className="text-muted fw-semibold text-decoration-none"
                      >
                        See All
                      </a>
                    </NavLink>
                  </div>

                  {cases.length > 0 ? (
                    cases.slice(0, 3).map((caseItem, index) => (
                      <div
                        key={caseItem.id || index}
                        className="card mb-3 my-cases-row-hover"
                        data-aos="fade-up"
                        data-aos-delay={`${700 + index * 100}`}
                      >
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="fw-bold text-dark mb-0">
                              {caseItem.title}
                            </h6>
                            <span className="badge bg-black text-white dashboard-case-badge">
                              {caseItem.case_number}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-0 small">
                            {caseItem.description || "No description available"}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No cases found</p>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div
                className="card shadow notification-card-hover"
                data-aos="fade-left"
                data-aos-delay="1000"
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-black mb-0">Notifications</h4>
                    <NavLink to={"/notifications"}>
                      <a
                        href="#"
                        className="text-black fw-semibold text-decoration-none"
                      >
                        See All
                      </a>
                    </NavLink>
                  </div>

                  {notifications.length > 0 ? (
                    notifications.slice(0, 4).map((notification, index, array) => (
                      <div
                        key={notification.id || index}
                        className={`d-flex align-items-start ${index < array.length - 1 ? 'mb-4' : ''} notification-item-hover`}
                        data-aos="fade-up"
                        data-aos-delay={`${1100 + index * 100}`}
                      >
                        <div className="symbol symbol-40px me-3 flex-shrink-0">
                          <img
                            src={notification.picture || notificationProfile}
                            alt="Notification"
                            className="rounded-circle"
                            onError={(e) => {
                              e.target.src = notificationProfile;
                            }}
                          />
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-gray-600 mb-2 small">
                            {notification.message || "No message"}
                          </p>
                          <span className="text-gray-500 small">{notification.time_ago || "Just now"}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No notifications</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Case Offcanvas */}
      {showCreateCase && (
        <div
          className="offcanvas offcanvas-end show dashboard-create-case-offcanvas"
          tabIndex="-1"
        >
          <div className="offcanvas-header border-bottom p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="mb-0 fw-bold fs-5 fs-md-4">Create a Case</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateCase(false)}
              ></button>
            </div>
          </div>

          <div className="offcanvas-body p-0 d-flex flex-column dashboard-offcanvas-body">
            <div className="p-3 p-md-4 flex-grow-1 dashboard-offcanvas-content">
              {/* Top Row Selects */}
              <div className="row g-2 g-md-3 mb-3">
                <div className="col-12 col-md-6">
                  <Dropdown
                    value={createCaseJurisdiction}
                    onChange={(e) => setCreateCaseJurisdiction(e.value)}
                    options={jurisdictionOptions}
                    placeholder="Select Jurisdiction"
                    className="w-100"
                    style={{ height: "60px" }}
                    panelClassName="dashboard-dropdown-panel"
                    scrollHeight="400px"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <Dropdown
                    value={createCaseConsultantType}
                    onChange={(e) => setCreateCaseConsultantType(e.value)}
                    options={consultantTypeOptions}
                    placeholder="Type of legal consultant"
                    className="w-100"
                    style={{ height: "60px" }}
                    panelClassName="dashboard-dropdown-panel"
                    scrollHeight="400px"
                  />
                </div>
              </div>

              {/* Second Row Selects */}
              <div className="row g-2 g-md-3 mb-3">
                <div className="col-12 col-md-6">
                  <Dropdown
                    value={createCaseLawType}
                    onChange={(e) => setCreateCaseLawType(e.value)}
                    options={lawTypeOptions}
                    placeholder="Criminal Law"
                    className="w-100"
                    style={{ height: "60px" }}
                    panelClassName="dashboard-dropdown-panel"
                    scrollHeight="400px"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <Dropdown
                    value={createCaseSubCategory}
                    onChange={(e) => setCreateCaseSubCategory(e.value)}
                    options={subCategoryOptions}
                    placeholder="Select Sub Categories"
                    className="w-100"
                    style={{ height: "60px" }}
                    panelClassName="dashboard-dropdown-panel"
                    scrollHeight="400px"
                  />
                </div>
              </div>

              {/* Explain Case */}
              <div className="mb-3">
                <textarea
                  className="form-control form-control-lg dashboard-textarea"
                  placeholder="Explain Your Case"
                  rows="4"
                ></textarea>
              </div>

              {/* Attach Document */}
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-start border border-2 border-dashed rounded dashboard-file-upload p-3">
                  <div className="p-2 p-md-3 me-3 rounded-1 dashboard-file-upload-icon">
                    <i className="bi bi-paperclip fs-4 fs-md-3 d-inline-block dashboard-paperclip-icon"></i>
                  </div>

                  <p className="text-muted mb-0 fs-6">Attach Document</p>
                </div>
              </div>

              {/* Accept Terms */}
              <div className="form-check mb-4 mt-5">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="acceptTermsDashboard"
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor="acceptTermsDashboard"
                >
                  Accept all Privacy policy & Terms & conditions
                </label>
              </div>
            </div>

            {/* Submit Button - fixed at bottom */}
            <div className="p-3 p-md-4 border-top dashboard-submit-footer">
              <button className="btn text-white rounded-pill w-100 dashboard-submit-button py-3 py-md-2">
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for Create Case */}
      {showCreateCase && (
        <div
          className="offcanvas-backdrop fade show dashboard-backdrop"
          onClick={() => setShowCreateCase(false)}
        ></div>
      )}

      {/* Post Question Offcanvas */}
      {showPostQuestion && (
        <div
        className="offcanvas offcanvas-end show"
        tabIndex="-1"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          visibility: "visible",
          width: "633px",
          transition: "all 0.3s ease-out",
          borderRadius: "13px",
          margin: "20px",
          zIndex: 1045,
          transform: isClosing ? "translateX(100%)" : "translateX(0)",
          animation: isClosing ? "slideOutToRight 0.3s ease-in" : "slideInFromRight 0.3s ease-out",
          backgroundColor: "#fff",
        }}
      >
        <div className="offcanvas-header border-bottom" style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
          <div className="d-flex justify-content-between align-items-center w-100">
            <h5 className="mb-0 fw-bold">Post Question</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClosePostQuestion}
            ></button>
          </div>
        </div>

        <div className="offcanvas-body p-4" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
          {/* Question Input */}
          <div className="mb-3 siri-border-animation">
            <textarea
              className="form-control"
              placeholder="Explain Your Question"
              style={{
                resize: "none",
                width: "606px",
                height: "217px",
                border: "1px solid #C9C9C9",
                borderRadius: "8px",
                position: "relative",
                zIndex: 1,
                backgroundColor: "#ffffff",
              }}
            ></textarea>
          </div>

          {/* Jurisdiction Dropdown */}
          <div className="mb-3">
            <div className="position-relative" ref={postQuestionJurisdictionRef}>
              <button
                type="button"
                className="form-select d-flex align-items-center justify-content-between"
                onClick={() => setShowPostQuestionJurisdictionDropdown(!showPostQuestionJurisdictionDropdown)}
                style={{
                  width: "606px",
                  height: "79px",
                  border: "1px solid #C9C9C9",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                  paddingLeft: "12px",
                  paddingRight: "40px",
                }}
              >
                <span style={{ color: postQuestionJurisdiction ? "#000" : "#6c757d" }}>
                  {postQuestionJurisdiction 
                    ? jurisdictionOptions.find(j => j.value === postQuestionJurisdiction)?.label || "Jurisdiction"
                    : "Jurisdiction"
                  }
                </span>
                <i className={`bi bi-chevron-${showPostQuestionJurisdictionDropdown ? "up" : "down"} position-absolute end-0 translate-middle-y me-3 text-gray-600`} style={{ top: "50%" }}></i>
              </button>
              
              {showPostQuestionJurisdictionDropdown && (
                <div 
                  className="position-absolute bg-white border rounded shadow-lg"
                  style={{ 
                    zIndex: 1050, 
                    width: "606px", 
                    maxHeight: "400px", 
                    overflowY: "auto",
                    overflowX: "hidden",
                    top: "100%",
                    marginTop: "8px",
                    bottom: "auto"
                  }}
                >
                  {jurisdictionOptions.map((jurisdiction) => (
                    <button
                      key={jurisdiction.value}
                      type="button"
                      className="btn btn-light w-100 text-start px-3 py-2 border-0"
                      onClick={() => {
                        setPostQuestionJurisdiction(jurisdiction.value);
                        setShowPostQuestionJurisdictionDropdown(false);
                      }}
                      style={{ 
                        fontSize: "0.9rem",
                        backgroundColor: postQuestionJurisdiction === jurisdiction.value ? "#f0f0f0" : "#fff"
                      }}
                    >
                      {jurisdiction.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-3">
            <div
              className="d-flex align-items-center justify-content-start border border-2 border-dashed rounded"
              style={{
                border: "1.5px dashed #C9C9C9",
                width: "606px",
                height: "80px",
                borderRadius: "8px",
              }}
            >
              <div
                className="p-3 mx-3 rounded-1"
                style={{
                  backgroundColor: "#FDFDFD",
                  border: "1px dashed #BEBEBE",
                }}
              >
                <i
                  className="bi bi-paperclip fs-3 d-inline-block"
                  style={{
                    transform: "rotate(45deg)",
                    display: "inline-block",
                  }}
                ></i>
              </div>

              <p className="text-muted mb-0">Attach Document</p>
            </div>
          </div>

          {/* How it works Section */}
          <div className="mb-3">
            <h6 className="fw-bold mb-2">How it works</h6>
            <div className="d-flex align-items-start gap-5 my-5">
              <i
                className="bi bi-moon-fill text-black"
                style={{
                  transform: "rotate(35deg)",
                  display: "inline-block",
                }}
              ></i>
              <small className="text-muted">
                Ask your question and see the answer in Questions & Answers.
              </small>
            </div>
            <div className="d-flex align-items-start gap-5 my-5">
              <i
                className="bi bi-moon-fill text-black"
                style={{
                  transform: "rotate(35deg)",
                  display: "inline-block",
                }}
              ></i>
              <small className="text-muted">
                You will be notified when a lawyer answers.
              </small>
            </div>
          </div>

          {/* Post Question Fee */}
          <div
            className="mb-3 rounded-4"
            style={{
              border: "1px solid #D3D3D3",
              width: "606px",
              height: "92px",
              borderRadius: "8px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center h-100 rounded">
              <div className="p-3">
                <h6 className="fw-bold mb-1">Post Question Fee</h6>
                <small className="text-muted">1 Question post only</small>
              </div>
              <div
                className="text-end px-4 h-100 d-flex flex-column justify-content-center"
                style={{ borderLeft: "1px solid #D3D3D3" }}
              >
                <div className="fw-bold">USD</div>
                <div className="fw-bold fs-5">1.00</div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="btn text-white rounded-pill"
            style={{
              height: "63px",
              fontSize: "20px",
              fontWeight: "500",
              backgroundColor: "#000",
              width: "606px",
              marginTop: "25px",
            }}
          >
            Post Your Legal Issues
          </button>
        </div>
      </div>
      )}

      {/* Backdrop for Post Question */}
      {showPostQuestion && (
        <div
          className="offcanvas-backdrop fade show dashboard-backdrop"
          onClick={() => setShowPostQuestion(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
