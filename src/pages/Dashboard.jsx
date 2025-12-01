import React, { useState, useEffect } from "react";
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
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    const authStatus = localStorage.getItem("isAuthenticated");
    
    if (!currentUser || !authStatus) {
      toast.error("Please login to access the dashboard");
      navigate("/login");
      return;
    }
    
    setIsAuthenticated(true);
  }, [navigate]);
  
  // Load initial state from localStorage or use defaults
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem("dashboardData");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading dashboard data from localStorage:", error);
    }
    return null;
  };

  const savedData = loadFromLocalStorage();

  const [activeTab, setActiveTab] = useState(
    savedData?.activeTab || "active"
  );
  const [showPostQuestion, setShowPostQuestion] = useState(
    savedData?.showPostQuestion || false
  );
  const [showCreateCase, setShowCreateCase] = useState(
    savedData?.showCreateCase || false
  );
  const [isClosing, setIsClosing] = useState(false);

  // Select states
  const [postQuestionJurisdiction, setPostQuestionJurisdiction] =
    useState(savedData?.postQuestionJurisdiction || null);
  const [createCaseJurisdiction, setCreateCaseJurisdiction] = useState(
    savedData?.createCaseJurisdiction || null
  );
  const [createCaseConsultantType, setCreateCaseConsultantType] =
    useState(savedData?.createCaseConsultantType || null);
  const [createCaseLawType, setCreateCaseLawType] = useState(
    savedData?.createCaseLawType || null
  );
  const [createCaseSubCategory, setCreateCaseSubCategory] = useState(
    savedData?.createCaseSubCategory || null
  );

  // Form field states
  const [postQuestionText, setPostQuestionText] = useState(
    savedData?.postQuestionText || ""
  );
  const [createCaseText, setCreateCaseText] = useState(
    savedData?.createCaseText || ""
  );
  const [acceptTerms, setAcceptTerms] = useState(
    savedData?.acceptTerms || false
  );
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Load posted questions from localStorage
  const loadPostedQuestions = () => {
    try {
      const saved = localStorage.getItem("postedQuestions");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading posted questions from localStorage:", error);
    }
    return [];
  };

  const [postedQuestions, setPostedQuestions] = useState(loadPostedQuestions());

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

  // Save all dashboard data to localStorage whenever any state changes
  useEffect(() => {
    const dashboardData = {
      activeTab,
      showPostQuestion,
      showCreateCase,
      postQuestionJurisdiction,
      createCaseJurisdiction,
      createCaseConsultantType,
      createCaseLawType,
      createCaseSubCategory,
      postQuestionText,
      createCaseText,
      acceptTerms,
    };

    try {
      localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
    } catch (error) {
      console.error("Error saving dashboard data to localStorage:", error);
    }
  }, [
    activeTab,
    showPostQuestion,
    showCreateCase,
    postQuestionJurisdiction,
    createCaseJurisdiction,
    createCaseConsultantType,
    createCaseLawType,
    createCaseSubCategory,
    postQuestionText,
    createCaseText,
    acceptTerms,
  ]);

  // Save posted questions to localStorage whenever postedQuestions changes
  useEffect(() => {
    try {
      localStorage.setItem("postedQuestions", JSON.stringify(postedQuestions));
    } catch (error) {
      console.error("Error saving posted questions to localStorage:", error);
    }
  }, [postedQuestions]);

  const handleAddQuestionClick = () => {
    setShowPostQuestion(true);
  };

  const handleClosePostQuestion = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPostQuestion(false);
      setIsClosing(false);
      // Reset form
      setPostQuestionText("");
      setPostQuestionJurisdiction(null);
      setSelectedFiles([]);
      // Clear form data from localStorage when closing
      try {
        localStorage.setItem("postQuestions_questionText", JSON.stringify(""));
        localStorage.setItem("postQuestions_questionJurisdiction", JSON.stringify(""));
      } catch (error) {
        console.error("Error clearing form data from localStorage:", error);
      }
    }, 300); // Match animation duration
  };

  // Handle posting a question
  const handlePostQuestion = () => {
    if (!postQuestionText.trim()) {
      toast.error("Please enter your question");
      return;
    }

    const newQuestion = {
      id: Date.now().toString(),
      question: postQuestionText,
      jurisdiction: postQuestionJurisdiction,
      files: selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    // Add the new question to the posted questions array
    setPostedQuestions((prev) => [newQuestion, ...prev]);

    // Show success message
    toast.success("Question posted successfully!");

    // Reset form
    setPostQuestionText("");
    setPostQuestionJurisdiction(null);
    setSelectedFiles([]);
    handleClosePostQuestion();
  };

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
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
                  Welcome Back! Noon
                </h1>
                <p className="text-gray-600 mb-4 dashboard-welcome-subtitle">
                  Dubai internet city UAE
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
                      <p className="text-gray-700 mb-4">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis.
                      </p>
                      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-eye-fill text-black me-2"></i>
                          <span className="text-black">Views: 260</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-chat-dots-fill text-black me-2"></i>
                          <span className="text-black">Ans: 60</span>
                        </div>
                      </div>
                      <div
                        className="d-flex align-items-center justify-content-center bg-light rounded-pill py-2 px-3 dashboard-date-pill"
                        style={{ width: "40%" }}
                      >
                        <span className="text-black dashboard-date-text">
                          Jan 05 - 2025 - 10:25 AM
                        </span>
                      </div>
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

                      <div className="d-flex align-items-start mb-4">
                        <div className="symbol symbol-50px me-3 flex-shrink-0">
                          <img
                            src={notificationProfile}
                            alt="Jackline Dim"
                            className="rounded-circle"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-dark mb-1">
                            Jackline Dim
                          </h6>
                          <p className="text-gray-600 mb-0 small">
                            Lorem ipsum dolor sit amet.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-start mb-4">
                        <div className="symbol symbol-50px me-3 flex-shrink-0">
                          <img
                            src={notificationProfile}
                            alt="Maxwell Clarck"
                            className="rounded-circle"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-dark mb-1">
                            Maxwell Clarck
                          </h6>
                          <p className="text-gray-600 mb-0 small">
                            Lorem ipsum dolor sit amet.
                          </p>
                        </div>
                      </div>

                      <div className="d-flex align-items-start">
                        <div className="symbol symbol-50px me-3 flex-shrink-0">
                          <img
                            src={notificationProfile}
                            alt="Jackline Dim"
                            className="rounded-circle"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-dark mb-1">
                            Jackline Dim
                          </h6>
                          <p className="text-gray-600 mb-0 small">
                            Lorem ipsum dolor sit amet.
                          </p>
                        </div>
                      </div>
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
                  {[1, 2].map((_, index) => (
                    <div
                      key={index}
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
                                src={notificationProfile}
                                alt="Shamra Joseph"
                                className="rounded-circle me-3"
                                width="48"
                                height="48"
                              />
                              <div>
                                <h6 className="fw-bold text-dark mb-0">
                                  Shamra Joseph
                                </h6>
                                <small className="text-muted">
                                  Corporate lawyer
                                </small>
                              </div>
                            </div>
                          </div>

                          {/* Practice Areas */}
                          <div className="col-md-3 col-sm-6 mb-2 mb-md-0">
                            <div className="text-muted small">
                              Criminal Law, Tax Law+
                            </div>
                          </div>

                          {/* Renewal Date */}
                          <div className="col-md-3 col-sm-6 mb-2 mb-md-0">
                            <div className="text-muted small">
                              Renew 21 September
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-md-2 col-sm-12 text-md-end">
                            <div className="fw-semibold text-dark">
                              1.99 USD
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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

                  <div
                    className="card mb-3 my-cases-row-hover"
                    data-aos="fade-up"
                    data-aos-delay="700"
                  >
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-dark mb-0">
                          Crimes Against Persons
                        </h6>
                        <span className="badge bg-black text-white dashboard-case-badge">
                          Case# 2548
                        </span>
                      </div>
                      <p className="text-gray-600 mb-0 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem ipsum accusantium doloremque laudantium.
                      </p>
                    </div>
                  </div>

                  <div
                    className="card mb-3 my-cases-row-hover"
                    data-aos="fade-up"
                    data-aos-delay="800"
                  >
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-dark mb-0">
                          Crimes Against Persons
                        </h6>
                        <span className="badge bg-black text-white dashboard-case-badge">
                          Case# 2548
                        </span>
                      </div>
                      <p className="text-gray-600 mb-0 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem ipsum accusantium doloremque laudantium.
                      </p>
                    </div>
                  </div>

                  <div
                    className="card mb-3 my-cases-row-hover"
                    data-aos="fade-up"
                    data-aos-delay="900"
                  >
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-dark mb-0">
                          Crimes Against Persons
                        </h6>
                        <span className="badge bg-black text-white dashboard-case-badge">
                          Case# 2548
                        </span>
                      </div>
                      <p className="text-gray-600 mb-0 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem ipsum accusantium doloremque laudantium.
                      </p>
                    </div>
                  </div>
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

                  <div
                    className="d-flex align-items-start mb-4 notification-item-hover"
                    data-aos="fade-up"
                    data-aos-delay="1100"
                  >
                    <div className="symbol symbol-40px me-3 flex-shrink-0">
                      <img
                        src={notificationProfile}
                        alt="Notification"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-gray-600 mb-2 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        volupta accusantium doloremque laudantium, totam rem.
                      </p>
                      <span className="text-gray-500 small">1 hour</span>
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-start mb-4 notification-item-hover"
                    data-aos="fade-up"
                    data-aos-delay="1200"
                  >
                    <div className="symbol symbol-40px me-3 flex-shrink-0">
                      <img
                        src={notificationProfile}
                        alt="Notification"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-gray-600 mb-2 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        volupta accusantium doloremque laudantium, totam rem.
                      </p>
                      <span className="text-gray-500 small">2 hours</span>
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-start mb-4 notification-item-hover"
                    data-aos="fade-up"
                    data-aos-delay="1300"
                  >
                    <div className="symbol symbol-40px me-3 flex-shrink-0">
                      <img
                        src={notificationProfile}
                        alt="Notification"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-gray-600 mb-2 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        volupta accusantium doloremque laudantium, totam rem.
                      </p>
                      <span className="text-gray-500 small">3 hours</span>
                    </div>
                  </div>

                  <div
                    className="d-flex align-items-start notification-item-hover"
                    data-aos="fade-up"
                    data-aos-delay="1400"
                  >
                    <div className="symbol symbol-40px me-3 flex-shrink-0">
                      <img
                        src={notificationProfile}
                        alt="Notification"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <p className="text-gray-600 mb-2 small">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        volupta accusantium doloremque laudantium, totam rem.
                      </p>
                      <span className="text-gray-500 small">4 hours</span>
                    </div>
                  </div>
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
                  />
                </div>
              </div>

              {/* Explain Case */}
              <div className="mb-3">
                <textarea
                  className="form-control form-control-lg dashboard-textarea"
                  placeholder="Explain Your Case"
                  rows="4"
                  value={createCaseText}
                  onChange={(e) => setCreateCaseText(e.target.value)}
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
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
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
                value={postQuestionText}
                onChange={(e) => setPostQuestionText(e.target.value)}
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
              <div className="position-relative">
                <select
                  className="form-select"
                  value={postQuestionJurisdiction || ""}
                  onChange={(e) => setPostQuestionJurisdiction(e.target.value)}
                  style={{
                    width: "606px",
                    height: "79px",
                    border: "1px solid #C9C9C9",
                    borderRadius: "8px",
                  }}
                >
                  <option value="">Jurisdiction</option>
                  <option value="us">United States</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                </select>
                <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-3">
              <input
                type="file"
                id="fileInput"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setSelectedFiles((prev) => [...prev, ...files]);
                }}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <div
                className="d-flex align-items-center justify-content-start border border-2 border-dashed rounded"
                style={{
                  border: "1.5px dashed #C9C9C9",
                  width: "606px",
                  minHeight: "80px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  padding: selectedFiles.length > 0 ? "10px" : "0",
                }}
                onClick={() => document.getElementById("fileInput").click()}
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
                <div className="flex-grow-1">
                  {selectedFiles.length === 0 ? (
                    <p className="text-muted mb-0">Attach Document</p>
                  ) : (
                    <div>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center justify-content-between mb-2"
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "5px 10px",
                            borderRadius: "4px",
                          }}
                        >
                          <span className="text-dark small">
                            {file.name.length > 30
                              ? file.name.substring(0, 30) + "..."
                              : file.name}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFiles((prev) =>
                                prev.filter((_, i) => i !== index)
                              );
                            }}
                            style={{
                              color: "#dc3545",
                              fontSize: "18px",
                              lineHeight: "1",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <p className="text-muted mb-0 small mt-1">
                        Click to add more files
                      </p>
                    </div>
                  )}
                </div>
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
              onClick={handlePostQuestion}
              style={{
                height: "63px",
                fontSize: "20px",
                fontWeight: "500",
                backgroundColor: "#474747",
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
          className="offcanvas-backdrop fade show"
          onClick={handleClosePostQuestion}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1040,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.2)",
            transition: "all 0.3s ease-out",
            animation: isClosing ? "fadeOut 0.3s ease-in" : "fadeIn 0.3s ease-out",
          }}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
