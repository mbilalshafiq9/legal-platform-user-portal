import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import notificationProfile from "../../assets/images/notification-profile.png";
import NoQuestion from "../../assets/images/NoQuestion.png";
import "../../assets/css/siri-border-animation.css";

const List = () => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showPostQuestion, setShowPostQuestion] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      title:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Jan 05 - 2025 - 10:25 AM",
      views: 260,
      answers: 60,
      isHighlighted: true,
    },
    {
      id: 2,
      title:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Jan 05 - 2025 - 10:25 AM",
      views: 260,
      answers: 60,
      isHighlighted: false,
    },
    {
      id: 3,
      title:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Jan 05 - 2025 - 10:25 AM",
      views: 260,
      answers: 60,
      isHighlighted: false,
    },
    {
      id: 4,
      title:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Jan 05 - 2025 - 10:25 AM",
      views: 260,
      answers: 60,
      isHighlighted: false,
    },
    {
      id: 5,
      title:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Jan 05 - 2025 - 10:25 AM",
      views: 260,
      answers: 60,
      isHighlighted: false,
    },
    {
      id: 6,
      title:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      date: "Jan 05 - 2025 - 10:25 AM",
      views: 260,
      answers: 60,
      isHighlighted: false,
    },
  ]);

  // Sample lawyer responses data
  const lawyerResponses = [
    {
      id: 1,
      name: "Shamra Joseph",
      title: "Corporate lawyer",
      response:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
      time: "10:35 AM",
      avatar: notificationProfile,
    },
    {
      id: 2,
      name: "Shamra Joseph",
      title: "Corporate lawyer",
      response:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
      time: "10:35 AM",
      avatar: notificationProfile,
    },
    {
      id: 3,
      name: "Shamra Joseph",
      title: "Corporate lawyer",
      response:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
      time: "10:35 AM",
      avatar: notificationProfile,
    },
    {
      id: 4,
      name: "Shamra Joseph",
      title: "Corporate lawyer",
      response:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
      time: "10:35 AM",
      avatar: notificationProfile,
    },
    {
      id: 5,
      name: "Shamra Joseph",
      title: "Corporate lawyer",
      response:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.",
      time: "10:35 AM",
      avatar: notificationProfile,
    },
  ];

  const handleCardClick = (question) => {
    setSelectedQuestion(question);
    setShowDetail(true);
  };

  const handleAddQuestionClick = () => {
    setShowPostQuestion(true);
  };

  const handleClosePostQuestion = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowPostQuestion(false);
      setIsClosing(false);
    }, 300); // Match animation duration
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

                      {/* Right Side: Time + Chat Button */}
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
                  style={{
                    width: "606px",
                    height: "79px",
                    border: "1px solid #C9C9C9",
                    borderRadius: "8px",
                  }}
                >
                  <option>Jurisdiction</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
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
    </div>
  );
};

export default List;
