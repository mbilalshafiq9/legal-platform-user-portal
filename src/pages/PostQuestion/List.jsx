import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import notificationProfile from "../../assets/images/notification-profile.png";
import NoQuestion from "../../assets/images/NoQuestion.png";
import successAnimation from "../../assets/images/Succes.json";
import "../../assets/css/siri-border-animation.css";

const List = () => {
  // Load data from localStorage
  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
    }
    return defaultValue;
  };

  // Load posted questions from Dashboard if available
  const loadPostedQuestionsFromDashboard = () => {
    try {
      const postedQuestions = loadFromLocalStorage("postedQuestions", []);
      return postedQuestions.map((q, index) => ({
        id: q.id || Date.now() + index,
        title: q.question || "",
        date: q.date || new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }) + " - " + (q.time || new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })),
        views: 0,
        answers: 0,
        isHighlighted: index === 0,
        jurisdiction: q.jurisdiction || null,
        timestamp: q.timestamp || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Error loading posted questions from dashboard:", error);
      return [];
    }
  };

  // Load questions from localStorage or use defaults
  const defaultQuestions = [
    {
      id: 1,
      title:
        "Hi, I want some help with understanding my employment contract. Can someone explain the non-compete clause and what it means for my future career opportunities?",
      date: "Nov 24 - 2025 - 10:25 AM",
      views: 0,
      answers: 0,
      isHighlighted: true,
    },
    {
      id: 2,
      title:
        "I'm dealing with a landlord dispute regarding security deposit return. They're claiming damages that were pre-existing when I moved in. What are my legal rights and how should I proceed?",
      date: "Nov 23 - 2025 - 02:15 PM",
      views: 12,
      answers: 3,
      isHighlighted: false,
    },
    {
      id: 3,
      title:
        "Need advice on intellectual property rights for my startup. We're developing a mobile app and want to protect our code and design. What steps should we take for copyright and trademark protection?",
      date: "Nov 22 - 2025 - 09:30 AM",
      views: 45,
      answers: 8,
      isHighlighted: false,
    },
    {
      id: 4,
      title:
        "My business partner and I are having disagreements about profit distribution. We signed a partnership agreement but it's unclear on this matter. How can we resolve this legally?",
      date: "Nov 21 - 2025 - 04:20 PM",
      views: 28,
      answers: 5,
      isHighlighted: false,
    },
    {
      id: 5,
      title:
        "I received a cease and desist letter regarding a domain name I own. The company claims I'm infringing on their trademark. Is this a valid claim and what should I do?",
      date: "Nov 20 - 2025 - 11:45 AM",
      views: 67,
      answers: 12,
      isHighlighted: false,
    },
    {
      id: 6,
      title:
        "Looking for guidance on estate planning. I want to set up a will and trust for my family but don't know where to start. What documents do I need and what should I consider?",
      date: "Nov 19 - 2025 - 08:10 AM",
      views: 34,
      answers: 7,
      isHighlighted: false,
    },
  ];

  // Load popup states from localStorage
  const savedSelectedQuestion = loadFromLocalStorage("postQuestions_selectedQuestion", null);
  const savedShowDetail = loadFromLocalStorage("postQuestions_showDetail", false);
  const savedShowPostQuestion = loadFromLocalStorage("postQuestions_showPostQuestion", false);
  const savedQuestionText = loadFromLocalStorage("postQuestions_questionText", "");
  const savedQuestionJurisdiction = loadFromLocalStorage("postQuestions_questionJurisdiction", "");

  const [selectedQuestion, setSelectedQuestion] = useState(savedSelectedQuestion);
  const [showDetail, setShowDetail] = useState(savedShowDetail);
  const [showPostQuestion, setShowPostQuestion] = useState(savedShowPostQuestion);
  const [isClosing, setIsClosing] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Form states
  const [questionText, setQuestionText] = useState(savedQuestionText);
  const [questionJurisdiction, setQuestionJurisdiction] = useState(savedQuestionJurisdiction);

  // Load questions from localStorage or merge with dashboard questions
  const savedQuestions = loadFromLocalStorage("postQuestions_questions", []);
  const dashboardQuestions = loadPostedQuestionsFromDashboard();
  
  // Initialize questions: use defaults if no saved data, otherwise merge all
  const initializeQuestions = () => {
    // If no saved questions and no dashboard questions, use defaults
    if (savedQuestions.length === 0 && dashboardQuestions.length === 0) {
      return defaultQuestions;
    }
    
    // Merge all questions: defaults + dashboard + saved, avoiding duplicates by ID
    const allQuestions = [...defaultQuestions, ...dashboardQuestions, ...savedQuestions];
    // Remove duplicates based on ID, keeping the first occurrence
    const uniqueQuestions = allQuestions.filter(
      (q, index, self) => index === self.findIndex((t) => t.id === q.id)
    );
    return uniqueQuestions;
  };

  const [questions, setQuestions] = useState(initializeQuestions());

  // Load lawyer responses from localStorage
  const getLawyerResponsesForQuestion = (questionId) => {
    const allResponses = loadFromLocalStorage("postQuestions_lawyerResponses", {});
    return allResponses[questionId] || [];
  };

  const [lawyerResponses, setLawyerResponses] = useState([]);

  // Initialize with defaults on first load if localStorage is empty
  useEffect(() => {
    const savedQuestions = loadFromLocalStorage("postQuestions_questions", []);
    const dashboardQuestions = loadPostedQuestionsFromDashboard();
    
    // If no questions exist, initialize with defaults
    if (savedQuestions.length === 0 && dashboardQuestions.length === 0 && questions.length === 0) {
      setQuestions(defaultQuestions);
    }
  }, []); // Run only on mount

  // Save questions to localStorage whenever they change
  useEffect(() => {
    try {
      if (questions.length > 0) {
        localStorage.setItem("postQuestions_questions", JSON.stringify(questions));
      }
    } catch (error) {
      console.error("Error saving questions to localStorage:", error);
    }
  }, [questions]);

  // Save popup states and form data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("postQuestions_showPostQuestion", JSON.stringify(showPostQuestion));
      localStorage.setItem("postQuestions_showDetail", JSON.stringify(showDetail));
      localStorage.setItem("postQuestions_selectedQuestion", JSON.stringify(selectedQuestion));
      localStorage.setItem("postQuestions_questionText", JSON.stringify(questionText));
      localStorage.setItem("postQuestions_questionJurisdiction", JSON.stringify(questionJurisdiction));
    } catch (error) {
      console.error("Error saving postQuestions popup states to localStorage:", error);
    }
  }, [showPostQuestion, showDetail, selectedQuestion, questionText, questionJurisdiction]);

  // Update lawyer responses when question is selected
  useEffect(() => {
    if (selectedQuestion) {
      const responses = getLawyerResponsesForQuestion(selectedQuestion.id);
      setLawyerResponses(responses);
    } else {
      setLawyerResponses([]);
    }
  }, [selectedQuestion]);

  const handleCardClick = (question) => {
    setSelectedQuestion(question);
    setShowDetail(true);
    // Increment views when question is clicked
    const updatedQuestions = questions.map((q) =>
      q.id === question.id ? { ...q, views: (q.views || 0) + 1 } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleAddQuestionClick = () => {
    setShowPostQuestion(true);
  };

  const handleClosePostQuestion = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPostQuestion(false);
      setIsClosing(false);
      // Reset form
      setQuestionText("");
      setQuestionJurisdiction("");
      // Clear form data from localStorage when closing
      try {
        localStorage.setItem("postQuestions_questionText", JSON.stringify(""));
        localStorage.setItem("postQuestions_questionJurisdiction", JSON.stringify(""));
      } catch (error) {
        console.error("Error clearing form data from localStorage:", error);
      }
    }, 300); // Match animation duration
  };

  const handlePostQuestion = () => {
    if (!questionText.trim()) {
      toast.error("Please enter your question");
      return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const formattedTime = currentDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newQuestion = {
      id: Date.now(),
      title: questionText.trim(),
      date: `${formattedDate} - ${formattedTime}`,
      views: 0,
      answers: 0,
      isHighlighted: questions.length === 0,
      jurisdiction: questionJurisdiction || null,
      timestamp: currentDate.toISOString(),
    };

    // Add new question to the beginning of the list
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);

    // Also save to Dashboard's posted questions
    try {
      const postedQuestions = loadFromLocalStorage("postedQuestions", []);
      const dashboardQuestion = {
        id: newQuestion.id.toString(),
        question: newQuestion.title,
        jurisdiction: newQuestion.jurisdiction,
        timestamp: newQuestion.timestamp,
        date: formattedDate,
        time: formattedTime,
      };
      postedQuestions.unshift(dashboardQuestion);
      localStorage.setItem("postedQuestions", JSON.stringify(postedQuestions));
    } catch (error) {
      console.error("Error saving to dashboard questions:", error);
    }

    // Show success animation
    setShowSuccessAnimation(true);
    
    // Auto-close animation and popup after 3 seconds (user can also close manually)
    setTimeout(() => {
      setShowSuccessAnimation(false);
      handleClosePostQuestion();
    }, 3000);
  };

  return (
    <div
      className="d-flex flex-column flex-column-fluid ask-question--mukta-font"
      style={{ marginTop: "20px" }}
    >
      <div className="app-content flex-column-fluid">
        {/* Search and Filter Bar */}
        <div
          className="d-flex gap-3 mb-6 bg-white p-4 border-top border-bottom post-question-list-header"
          style={{ marginTop: "-20px" }}
          data-aos="fade-up"
        >
          <div className="flex-fill" style={{ maxWidth: "40%" }}>
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg rounded-pill portal-form-hover"
                placeholder="Search"
                style={{ borderRadius: "12px", paddingLeft: "45px" }}
              />
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-gray-600"></i>
            </div>
          </div>

          <div className="d-flex gap-3 flex-wrap flex-md-nowrap">
            {/* <button
              className="btn btn-transparent border rounded-pill d-flex align-items-center gap-2 portal-button-hover"
              style={{ borderRadius: "12px", minWidth: "120px" }}
            >
              <i className="bi bi-funnel text-black"></i>
              Filter
            </button> */}

            <button
              className="btn border rounded-pill d-flex align-items-center gap-2 bg-black text-white post-question-action-btn"
              style={{ borderRadius: "12px", border: "none" }}
              onClick={handleAddQuestionClick}
            >
              <i className="bi bi-plus rounded-pill w-20px h-20px bg-white text-black d-flex justify-content-center align-items-center pe-0"></i>
              Post New Question
            </button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="container-fluid px-3 px-md-4">
          <div className="row g-3 g-md-4">
            {questions.length === 0 ? (
              <div className="col-12 d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
                <div className="text-center p-5">
                  <div className="mb-4">
                    <img src={NoQuestion} alt="No Question" style={{ maxWidth: "200px", height: "auto" }} />
                  </div>
                  <h4 className="text-muted mb-2 fw-bold">No Questions</h4>
                  <p className="text-muted mb-0">
                    You don't have any questions yet.
                  </p>
                </div>
              </div>
            ) : (
              questions.map((question, index) => (
              <div
                key={question.id}
                className="col-lg-3 col-md-6 mb-4"
                data-aos="fade-up"
                data-aos-delay={`${100 + index * 100}`}
              >
                <div
                  className={`card portal-card-hover h-100 post-question-card ${
                    question.isHighlighted ? "text-black" : "bg-white"
                  }`}
                  style={{
                    borderRadius: "12px",
                    height: "300px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleCardClick(question)}
                >
                  <div className="card-body p-3 p-md-4 d-flex flex-column">
                    {/* Date */}
                    <div className="mb-2 mb-md-3">
                      <small className="text-muted">{question.date}</small>
                    </div>

                    {/* Question Content */}
                    <div className="flex-fill mb-3 mb-md-4">
                      <p
                        className={`${
                          question.isHighlighted ? "text-black" : "text-dark"
                        } mb-0`}
                        style={{ 
                          fontSize: "clamp(14px, 4vw, 20px)", 
                          fontWeight: "500",
                          lineHeight: "1.4",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical"
                        }}
                      >
                        {question.title}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="d-flex align-items-center justify-content-between stats-bottom-content">
                      <div className="d-flex align-items-center gap-1 gap-md-2">
                        <i className="bi bi-eye-fill text-muted"></i>
                        <span className="text-muted">Views: {question.views}</span>
                      </div>

                      <div className="d-flex align-items-center gap-1 gap-md-2">
                        <i className="bi bi-chat-dots-fill text-muted"></i>
                        <span className="text-muted">
                          Ans: {question.answers}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Question Detail Offcanvas */}
      {selectedQuestion && (
        <div
          className={`offcanvas offcanvas-end ${showDetail ? "show" : ""}`}
          tabIndex="-1"
          style={{
            visibility: showDetail ? "visible" : "hidden",
            width: "400px",
            right: showDetail ? "0" : "-400px",
            transition: "all 0.3s ease",
            borderRadius: "30px",
            margin: "20px",
          }}
        >
          <div className="offcanvas-header border-bottom" style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <small className="text-black">{selectedQuestion.date}</small>
              </div>
              <div className="d-flex gap-2">
                <button className="btn bg-black text-white btn-sm">
                  Mark Closed
                </button>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetail(false)}
                ></button>
              </div>
            </div>
          </div>

          <div className="offcanvas-body p-0" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
            {/* Question Details */}
            <div className="p-4">
              <h5 className="mb-3">{selectedQuestion.title}</h5>

              <div className="d-flex align-items-center gap-4 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-eye-fill text-gray-600"></i>
                  <span className="text-black">
                    Views: {selectedQuestion.views}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-chat-dots-fill text-gray-600"></i>
                  <span className="text-black">
                    Ans: {selectedQuestion.answers}
                  </span>
                </div>
              </div>
            </div>

            {/* Lawyers Respond Section */}
            <div className="border-top">
              <div className="p-4">
                <h6 className="mb-4">Lawyers Respond</h6>

                <div
                  className="d-flex flex-column gap-3"
                  // style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {lawyerResponses.map((lawyer) => (
                    <div
                      key={lawyer.id}
                      className="d-flex align-items-start justify-content-between border-bottom pb-3"
                    >
                      {/* Left Side: Profile + Message */}
                      <div className="d-flex align-items-start gap-3">
                        {/* Profile Picture */}
                        <img
                          src={lawyer.avatar}
                          alt={lawyer.name}
                          className="rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />

                        {/* Text Content */}
                        <div>
                          <div className="d-flex flex-column">
                            <strong
                              className="text-dark"
                              style={{ fontSize: "14px" }}
                            >
                              {lawyer.name}
                            </strong>
                            <small className="text-black">{lawyer.title}</small>
                          </div>

                          <p
                            className="text-black mb-1 mt-2"
                            style={{ fontSize: "14px" }}
                          >
                            {lawyer.response}
                          </p>
                        </div>
                      </div>

                      {/* Right Side*/}
                      <div className="text-end ms-3">
                        <small className="text-muted d-block mb-2">
                          {lawyer.time}
                        </small>
                        <NavLink to="/chat">
                          <button
                            className="btn btn-outline-dark bg-dark p-5 rounded-pill text-white btn-sm rounded-circle d-flex justify-content-center align-items-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              padding: 0,
                              borderWidth: "1px",
                            }}
                          >
                            <i
                              className="bi bi-chat-dots-fill p-0 text-white"
                              style={{ fontSize: "14px" }}
                            ></i>
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
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
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
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
                  value={questionJurisdiction}
                  onChange={(e) => setQuestionJurisdiction(e.target.value)}
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
                  className="text-end px-5 h-100 d-flex flex-column justify-content-center"
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

      {/* Backdrop */}
      {showDetail && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowDetail(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1040,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,1)",
          }}
        ></div>
      )}

      {/* Success Animation Modal */}
      {showSuccessAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={() => {
            setShowSuccessAnimation(false);
            handleClosePostQuestion();
          }}
        >
          <div
            className="success-animation-modal"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "3rem 2.5rem 2rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
              maxWidth: "450px",
              width: "90%",
              animation: "fadeIn 0.3s ease-out",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right */}
            <button
              type="button"
              onClick={() => {
                setShowSuccessAnimation(false);
                handleClosePostQuestion();
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#000",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "all 0.2s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
              }}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Animation */}
            <div style={{ marginBottom: "1.5rem" }}>
              <Lottie
                animationData={successAnimation}
                loop={false}
                autoplay={true}
                style={{ width: "200px", height: "200px" }}
              />
            </div>

            {/* Success Message */}
            <h4
              className="fw-bold success-animation-text mb-4"
              style={{
                color: "#212529",
                fontSize: "20px",
                textAlign: "center",
                lineHeight: "1.4",
              }}
            >
              Question Posted Successfully!
            </h4>

            {/* Action Button */}
            <button
              type="button"
              className="btn text-white w-100"
              onClick={() => {
                setShowSuccessAnimation(false);
                handleClosePostQuestion();
              }}
              style={{
                height: "50px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                backgroundColor: "#000",
                border: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#333";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#000";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
