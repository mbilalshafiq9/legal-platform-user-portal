import React, { useState, useRef, useEffect } from "react";
import "./help-support.css";

const HelpSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showContactSupportPopup, setShowContactSupportPopup] = useState(false);
  const [contactSupportTab, setContactSupportTab] = useState("email"); // email, chat, phone
  const [isClosing, setIsClosing] = useState(false);
  const [isContactSupportClosing, setIsContactSupportClosing] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "support",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I post a legal question?",
      answer: "To post a legal question, navigate to the 'Post Question' section from the dashboard or sidebar. Click on the 'Post Your Legal Issues' card, fill in your question details, select the appropriate jurisdiction, and submit. You can also attach relevant documents to provide more context."
    },
    {
      id: 2,
      question: "What types of legal services are available?",
      answer: "Our platform offers various legal services including criminal law, corporate law, family law, real estate law, intellectual property law, and tax law. You can browse lawyers by category and jurisdiction to find the right legal expert for your needs."
    },
    {
      id: 3,
      question: "How do I hire a lawyer?",
      answer: "You can hire a lawyer by visiting the 'Lawyers' page from the sidebar. Browse through available lawyers, view their profiles, practice areas, and pricing options. Click on a lawyer to see detailed information and contact them directly through the platform."
    },
    {
      id: 4,
      question: "How do I create a new case?",
      answer: "To create a new case, click on the 'Create New Case' card from the dashboard or navigate to 'My Cases' section. Fill in the required information including jurisdiction, type of legal consultant, case category, and provide a detailed explanation of your case. You can also attach relevant documents."
    },
    {
      id: 5,
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit cards, debit cards, and online payment gateways. Payment is processed securely through our platform. You can view pricing options for each service before making a decision."
    },
    {
      id: 6,
      question: "How do I view my posted questions?",
      answer: "You can view all your posted questions by navigating to the 'Post Question' or 'Ask Question' section. All your questions will be listed there with their status, number of views, and lawyer responses. You can click on any question to see detailed responses."
    },
    {
      id: 7,
      question: "Can I edit or delete my posted questions?",
      answer: "Currently, once a question is posted, it cannot be edited. However, you can view all your questions and their responses. If you need to make changes, you can post a new question with the updated information."
    },
    {
      id: 8,
      question: "How do I contact a lawyer directly?",
      answer: "You can contact lawyers through the chat feature. Navigate to 'My Lawyers' or 'Chat' section, select the lawyer you want to communicate with, and start a conversation. You can also view lawyer profiles and contact information on their detail pages."
    },
    {
      id: 9,
      question: "What should I do if I forget my password?",
      answer: "If you forget your password, you can reset it through the login page. Click on 'Forgot Password' link, enter your registered email address, and follow the instructions sent to your email to reset your password securely."
    },
    {
      id: 10,
      question: "How do I update my account information?",
      answer: "You can update your account information by clicking on your profile icon in the header and selecting 'Account Settings'. From there, you can change your email address, update your password, and modify other account details."
    },
    {
      id: 11,
      question: "Are my conversations with lawyers confidential?",
      answer: "Yes, all conversations between you and lawyers are confidential and secure. We use end-to-end encryption to protect your privacy. Your personal information and case details are never shared with third parties without your explicit consent."
    },
    {
      id: 12,
      question: "How do I know if a lawyer is available?",
      answer: "Lawyers are categorized as 'Active' or 'Inactive' in the 'My Lawyers' section. Active lawyers are currently available and responsive. You can also check their response time and availability status on their profile pages."
    },
    {
      id: 13,
      question: "What is the difference between posting a question and creating a case?",
      answer: "Posting a question is for general legal inquiries where you seek advice or information. Creating a case is for specific legal matters that require ongoing legal representation and case management. Cases involve more detailed documentation and formal legal processes."
    },
    {
      id: 14,
      question: "How do I track my case progress?",
      answer: "You can track your case progress by navigating to 'My Cases' section. Each case shows its current status, updates, and any documents or communications related to it. You'll also receive notifications for important case updates."
    },
    {
      id: 15,
      question: "Can I get a refund if I'm not satisfied with the service?",
      answer: "Refund policies vary depending on the type of service and the specific terms agreed upon. Please review the terms and conditions before making a payment. For refund requests, contact our support team through the Help & Support section."
    }
  ];

  const toggleFAQ = (index) => {
    if (openIndex === index) {
      // If clicking the same FAQ, close it
      setOpenIndex(null);
    } else {
      // Otherwise, open the clicked FAQ
      setOpenIndex(index);
    }
  };

  const handleChatIconClick = () => {
    setShowContactSupportPopup(true);
    setContactSupportTab("chat");
  };

  const handleCloseChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowChatPopup(false);
      setIsClosing(false);
    }, 300);
  };

  const handleContactSupportClick = () => {
    setShowContactSupportPopup(true);
    setContactSupportTab("email"); // Default to email tab
  };

  const handleEmailIconClick = () => {
    setShowContactSupportPopup(true);
    setContactSupportTab("email");
  };

  const handlePhoneIconClick = () => {
    setShowContactSupportPopup(true);
    setContactSupportTab("phone");
  };

  const handleCloseContactSupport = () => {
    setIsContactSupportClosing(true);
    setTimeout(() => {
      setShowContactSupportPopup(false);
      setIsContactSupportClosing(false);
      setContactSupportTab("email");
    }, 300);
  };

  const handleTabChange = (tab) => {
    setContactSupportTab(tab);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, userMessage]);
      setNewMessage("");
      
      // Simulate support response after 1 second
      setTimeout(() => {
        const supportMessage = {
          id: messages.length + 2,
          text: "Thank you for your message. Our support team will get back to you shortly.",
          sender: "support",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, supportMessage]);
      }, 1000);
    }
  };

  return (
    <div className="help-support-container">
      <div className="container-fluid help-support-wrapper">
        {/* Header Section */}
        <div className="row mb-5" data-aos="fade-up">
          <div className="col-12">
            <div className="help-support-header text-center">
              <h1 className="help-support-title mb-3">Help & Support</h1>
              <p className="help-support-subtitle">
                Find answers to frequently asked questions and get the support you need
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="row mb-5" data-aos="fade-up" data-aos-delay="100">
          <div className="col-12 col-md-10 offset-md-1">
            <div className="help-search-container">
              <i className="bi bi-search help-search-icon"></i>
              <input
                type="text"
                className="help-search-input"
                placeholder="Search for questions or topics..."
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1">
            <div className="faq-section">
              <h2 className="faq-section-title mb-4" data-aos="fade-up" data-aos-delay="200">
                Frequently Asked Questions
              </h2>
              
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className={`faq-item ${openIndex === index ? "active" : ""}`}
                  >
                    <div
                      className="faq-question"
                      onClick={() => toggleFAQ(index)}
                    >
                      <div className="faq-question-content">
                        <h3 className="faq-question-text">{faq.question}</h3>
                        <i
                          className={`bi ${
                            openIndex === index
                              ? "bi-chevron-up"
                              : "bi-chevron-down"
                          } faq-chevron`}
                        ></i>
                      </div>
                    </div>
                    <div
                      className={`faq-answer ${openIndex === index ? "show" : ""}`}
                    >
                      <p className="faq-answer-text">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="row mt-5" data-aos="fade-up">
          <div className="col-12 col-md-8 offset-md-2">
                <div className="contact-support-card">
              <div className="d-flex justify-content-center align-items-center gap-5">
                <div 
                  className="contact-support-icon" 
                  style={{ cursor: "pointer" }}
                  onClick={handleEmailIconClick}
                >
                  <i className="bi bi-envelope-fill"></i>
                </div>
                <div 
                  className="contact-support-icon" 
                  style={{ cursor: "pointer" }}
                  onClick={handleChatIconClick}
                >
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <div 
                  className="contact-support-icon" 
                  style={{ cursor: "pointer" }}
                  onClick={handlePhoneIconClick}
                >
                  <i className="bi bi-telephone-fill"></i>
                </div>
              </div>
              <h3 className="contact-support-title">Still need help?</h3>
              <p className="contact-support-text">
                If you can't find the answer you're looking for, our support team is here to help.
              </p>
              <button 
                className="contact-support-button"
                onClick={handleContactSupportClick}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Support Offcanvas */}
      {showChatPopup && (
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
              <div>
                <h5 className="mb-0 fw-bold">Chat Support</h5>
                <small className="text-muted">We're here to help</small>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseChat}
              ></button>
                </div>
              </div>

          <div className="offcanvas-body p-0 d-flex flex-column" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", height: "calc(100% - 80px)" }}>
            {/* Messages Area */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)" }}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`d-flex mb-3 ${
                    message.sender === "user" ? "justify-content-end" : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-3 ${
                      message.sender === "user"
                        ? "bg-black text-white"
                        : "bg-light text-dark"
                    }`}
                    style={{
                      maxWidth: "70%",
                      wordWrap: "break-word",
                    }}
                  >
                    <p className="mb-1" style={{ fontSize: "14px" }}>
                      {message.text}
                    </p>
                    <small
                      className={`${
                        message.sender === "user" ? "text-white-50" : "text-muted"
                      }`}
                      style={{ fontSize: "11px" }}
                    >
                      {message.timestamp}
                    </small>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <div className="border-top p-3" style={{ backgroundColor: "#f8f9fa" }}>
              <form onSubmit={handleSendMessage} className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  style={{
                    borderRadius: "25px",
                    border: "1px solid #C9C9C9",
                    padding: "10px 20px",
                  }}
                />
                <button
                  type="submit"
                  className="btn bg-black text-white rounded-pill"
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                  disabled={!newMessage.trim()}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for Chat Popup */}
      {showChatPopup && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleCloseChat}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1040,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.2)",
            transition: "all 0.3s ease-out",
          }}
        ></div>
      )}

      {/* Contact Support Popup */}
      {showContactSupportPopup && (
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
            transform: isContactSupportClosing ? "translateX(100%)" : "translateX(0)",
            animation: isContactSupportClosing ? "slideOutToRight 0.3s ease-in" : "slideInFromRight 0.3s ease-out",
            backgroundColor: "#fff",
          }}
        >
          <div className="offcanvas-header border-bottom" style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="mb-0 fw-bold">Contact Support</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseContactSupport}
              ></button>
            </div>
          </div>

          <div 
            className={`offcanvas-body ${contactSupportTab === "chat" ? "p-0 d-flex flex-column" : "p-4"}`}
            style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", height: contactSupportTab === "chat" ? "calc(100% - 80px)" : "auto" }}
          >
            {/* Tabs */}
            <div className={`d-flex gap-2 ${contactSupportTab === "chat" ? "px-4 pt-4 mb-0" : "mb-4"}`} style={{ borderBottom: "2px solid #e9ecef" }}>
              <button
                className={`btn flex-grow-1 rounded-0 border-0 pb-3 ${
                  contactSupportTab === "email"
                    ? "border-bottom border-3 border-black fw-bold text-black"
                    : "text-muted"
                }`}
                onClick={() => handleTabChange("email")}
                style={{
                  borderRadius: "0",
                  background: "transparent",
                }}
              >
                <i 
                  className="bi bi-envelope-fill me-2"
                  style={{ color: contactSupportTab === "email" ? "#000000" : "" }}
                ></i>
                Email
              </button>
              <button
                className={`btn flex-grow-1 rounded-0 border-0 pb-3 ${
                  contactSupportTab === "chat"
                    ? "border-bottom border-3 border-black fw-bold text-black"
                    : "text-muted"
                }`}
                onClick={() => handleTabChange("chat")}
                style={{
                  borderRadius: "0",
                  background: "transparent",
                }}
              >
                <i 
                  className="bi bi-chat-dots-fill me-2"
                  style={{ color: contactSupportTab === "chat" ? "#000000" : "" }}
                ></i>
                Report Ticket
              </button>
              <button
                className={`btn flex-grow-1 rounded-0 border-0 pb-3 ${
                  contactSupportTab === "phone"
                    ? "border-bottom border-3 border-black fw-bold text-black"
                    : "text-muted"
                }`}
                onClick={() => handleTabChange("phone")}
                style={{
                  borderRadius: "0",
                  background: "transparent",
                }}
              >
                <i 
                  className="bi bi-telephone-fill me-2"
                  style={{ color: contactSupportTab === "phone" ? "#000000" : "" }}
                ></i>
                Phone
              </button>
              </div>

            {/* Tab Content */}
            {contactSupportTab === "email" && (
              <div className="contact-tab-content px-4 pb-4">
                <h6 className="fw-bold mb-3">Send us an Email</h6>
                <p className="text-muted mb-4">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Your Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="your.email@example.com"
                      style={{
                        border: "1px solid #C9C9C9",
                        borderRadius: "8px",
                        height: "60px",
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Subject</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="What can we help you with?"
                      style={{
                        border: "1px solid #C9C9C9",
                        borderRadius: "8px",
                        height: "60px",
                      }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea
                      className="form-control form-control-lg"
                      placeholder="Tell us more about your inquiry..."
                      rows="5"
                      style={{
                        border: "1px solid #C9C9C9",
                        borderRadius: "8px",
                        resize: "none",
                      }}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn bg-black text-white rounded-pill w-100 py-3"
                  >
                    Send Email
                  </button>
                </form>
              </div>
            )}

            {contactSupportTab === "chat" && (
              <div className="contact-tab-content px-4 pb-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Handle form submission
                  console.log({ issueType, description, attachment });
                }}>
                  {/* Issue Type */}
                  <div className="my-5">
                    <label className="form-label fw-semibold mb-2">Issue type</label>
                    <select
                      className="form-control form-control-lg"
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      style={{
                        border: "1px solid #C9C9C9",
                        borderRadius: "8px",
                        height: "60px",
                        padding: "0 15px",
                        appearance: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 15px center",
                        paddingRight: "40px",
                      }}
                    >
                      <option value="">i.e Booking</option>
                      <option value="booking">Booking</option>
                      <option value="payment">Payment</option>
                      <option value="technical">Technical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold mb-2">Description</label>
                    <textarea
                      className="form-control form-control-lg"
                      placeholder="Describe issue."
                      rows="5"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{
                        border: "1px solid #C9C9C9",
                        borderRadius: "8px",
                        resize: "vertical",
                        padding: "15px",
                      }}
                    ></textarea>
                  </div>

                  {/* Attachment */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold mb-2">Attachment</label>
                    <div
                      className="form-control form-control-lg d-flex align-items-center justify-content-center"
                      style={{
                        border: "1px solid #C9C9C9",
                        borderRadius: "8px",
                        height: "60px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                      }}
                      onClick={() => document.getElementById('attachment-input').click()}
                    >
                      <i className="bi bi-upload me-2" style={{ fontSize: "1.2rem" }}></i>
                      <span className="text-muted">Browse attachment</span>
                      <input
                        type="file"
                        id="attachment-input"
                        className="d-none"
                        onChange={(e) => setAttachment(e.target.files[0])}
                      />
                    </div>
                    {attachment && (
                      <small className="text-muted mt-2 d-block">
                        Selected: {attachment.name}
                      </small>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn w-100 py-5 contact-support-submit-btn"
                    style={{
                      backgroundColor: "#000",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "1rem",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}

            {contactSupportTab === "phone" && (
              <div className="contact-tab-content px-4 pb-4">
                <h6 className="fw-bold mb-3">Call Us</h6>
                <p className="text-muted mb-4">
                  Reach out to our support team directly via phone.
                </p>
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <i className="bi bi-telephone-fill fs-1 text-black"></i>
                  </div>
                  <h4 className="fw-bold mb-2">+1 (555) 123-4567</h4>
                  <p className="text-muted mb-4">Available 24/7</p>
                </div>
                <a
                  href="tel:+15551234567"
                  className="btn bg-black text-white rounded-pill w-100 py-3"
                >
                  <i className="bi bi-telephone-fill me-2"></i>
                  Call Now
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for Contact Support Popup */}
      {showContactSupportPopup && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleCloseContactSupport}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1040,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.2)",
            transition: "all 0.3s ease-out",
          }}
        ></div>
      )}
    </div>
  );
};

export default HelpSupport;

