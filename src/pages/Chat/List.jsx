import React, { useState } from "react";
import notificationProfile from "../../assets/images/notification-profile.png";
import circle from "../../assets/images/yellow-circle.png";
import NoMessage from "../../assets/images/NoMessage.png";

const formatMessageText = (text = "") => {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

const List = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [activeSubTab, setActiveSubTab] = useState("active");
  const [selectedContact, setSelectedContact] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "I will review the contract and get back to you with my analysis.",
      time: "10:30 AM",
      isFromUser: false,
    },
    {
      id: 2,
      text: "Thank you for the quick response. I'll wait for your feedback.",
      time: "10:32 AM",
      isFromUser: true,
    },
  ]);

  // Sample lawyers data - Active Lawyers
  const activeLawyers = [
    {
      id: 1,
      name: "Shamra Joseph",
      title: "Corporate lawyer",
      status: "Active",
      avatar: notificationProfile,
      specializations: "Criminal Law, Tax Law+",
      renewalDate: "Renew 21 September",
      price: "1.99 USD",
      unreadCount: 0,
    },
    {
      id: 2,
      name: "Joseph Dan",
      title: "Corporate lawyer",
      status: "Active",
      avatar: notificationProfile,
      specializations: "Criminal Law, Tax Law+",
      renewalDate: "Renew 21 September",
      price: "1.99 USD",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "Dan Smith",
      title: "Corporate lawyer",
      status: "Active",
      avatar: notificationProfile,
      specializations: "Criminal Law, Tax Law+",
      renewalDate: "Renew 21 September",
      price: "1.99 USD",
      unreadCount: 3,
    },
    {
      id: 4,
      name: "Sarah Mitchell",
      title: "Family Law Attorney",
      status: "Active",
      avatar: notificationProfile,
      specializations: "Family Law, Divorce Law+",
      renewalDate: "Renew 15 October",
      price: "2.25 USD",
      unreadCount: 1,
    },
    {
      id: 5,
      name: "Robert Johnson",
      title: "Real Estate Lawyer",
      status: "Active",
      avatar: notificationProfile,
      specializations: "Real Estate Law, Property Law+",
      renewalDate: "Renew 28 October",
      price: "1.85 USD",
      unreadCount: 0,
    },
  ];

  // Sample lawyers data - Inactive Lawyers
  const inactiveLawyers = [
    {
      id: 7,
      name: "David Brown",
      title: "Tax Attorney",
      status: "Inactive",
      avatar: notificationProfile,
      specializations: "Tax Law, Corporate Law+",
      renewalDate: "Expired 15 October",
      price: "2.50 USD",
      unreadCount: 0,
    },
    {
      id: 8,
      name: "Lisa Davis",
      title: "Real Estate Lawyer",
      status: "Inactive",
      avatar: notificationProfile,
      specializations: "Real Estate Law, Property Law+",
      renewalDate: "Expired 10 November",
      price: "1.75 USD",
      unreadCount: 1,
    },
    {
      id: 9,
      name: "John Smith",
      title: "Criminal Defense",
      status: "Inactive",
      avatar: notificationProfile,
      specializations: "Criminal Law, Defense Law+",
      renewalDate: "Expired 5 December",
      price: "3.00 USD",
      unreadCount: 0,
    },
    {
      id: 10,
      name: "Maria Rodriguez",
      title: "Immigration Lawyer",
      status: "Inactive",
      avatar: notificationProfile,
      specializations: "Immigration Law, Visa Law+",
      renewalDate: "Expired 20 November",
      price: "2.75 USD",
      unreadCount: 0,
    },
    {
      id: 11,
      name: "James Wilson",
      title: "Personal Injury Attorney",
      status: "Inactive",
      avatar: notificationProfile,
      specializations: "Personal Injury Law, Tort Law+",
      renewalDate: "Expired 12 December",
      price: "2.15 USD",
      unreadCount: 2,
    },
  ];

  // Sample chat contacts
  const chatContacts = [
    {
      id: 1,
      name: "Emily Chen",
      lastMessage:
        "I've reviewed your case documents. Let's discuss the strategy.",
      time: "2:30 PM",
      unread: 2,
      avatar: notificationProfile,
    },
    {
      id: 2,
      name: "Robert Martinez",
      lastMessage: "The contract amendments are ready for your review.",
      time: "1:15 PM",
      unread: 0,
      avatar: notificationProfile,
    },
    {
      id: 3,
      name: "Jennifer Lee",
      lastMessage: "We need to schedule a consultation for next week.",
      time: "11:45 AM",
      unread: 1,
      avatar: notificationProfile,
    },
    {
      id: 4,
      name: "Alex Thompson",
      lastMessage: "I'll send you the updated legal brief by tomorrow.",
      time: "10:20 AM",
      unread: 0,
      avatar: notificationProfile,
    },
    {
      id: 5,
      name: "Sarah Williams",
      lastMessage: "The court hearing has been rescheduled to next Friday.",
      time: "09:30 AM",
      unread: 1,
      avatar: notificationProfile,
    },
    {
      id: 6,
      name: "Michael Brown",
      lastMessage: "I've prepared the settlement agreement for your review.",
      time: "08:45 AM",
      unread: 0,
      avatar: notificationProfile,
    },
    {
      id: 7,
      name: "Lisa Garcia",
      lastMessage: "The property documents are ready for signature.",
      time: "08:15 AM",
      unread: 2,
      avatar: notificationProfile,
    },
    {
      id: 8,
      name: "David Wilson",
      lastMessage: "We need to discuss the tax implications of this deal.",
      time: "07:30 AM",
      unread: 0,
      avatar: notificationProfile,
    },
  ];

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      const newMsg = {
        id: messages.length + 1,
        text: formatMessageText(newMessage),
        time: currentTime,
        isFromUser: true,
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const getCurrentData = () => {
    if (activeTab === "lawyers") {
      return activeSubTab === "active" ? activeLawyers : inactiveLawyers;
    } else {
      return chatContacts;
    }
  };

  // Calculate unread counts for badges
  const getUnreadChatsCount = () => {
    return chatContacts.reduce(
      (total, contact) => total + (contact.unread || 0),
      0
    );
  };

  const getUnreadLawyersCount = () => {
    const activeUnread = activeLawyers.reduce(
      (total, lawyer) => total + (lawyer.unreadCount || 0),
      0
    );
    const inactiveUnread = inactiveLawyers.reduce(
      (total, lawyer) => total + (lawyer.unreadCount || 0),
      0
    );
    return activeUnread + inactiveUnread;
  };

  return (
    <div className="d-flex flex-column flex-column-fluid my-lawyers-page my-lawyers-main-container dashboard--inter-font">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-0">
        <div
          id="kt_app_content_container"
          className="app-container container-xxl h-100 px-0 mx-0"
        >
          <div className="row h-100 g-0" data-aos="fade-up">
            {/* Left Panel - Contact List */}
            <div className={`col-lg-4 col-md-5 ${selectedContact ? 'd-none d-lg-block' : ''}`}>
              <div className="d-flex flex-column h-100 my-lawyers-left-panel">
                {/* Main Tabs */}
                <div className="py-4">
                  <div className="d-flex gap-2 my-lawyers-tabs-container">
                    <button
                      className={`btn flex-fill d-flex align-items-center justify-content-center gap-2 portal-tab-hover my-lawyers-main-tab ${
                        activeTab === "chats"
                          ? "border-bottom-3px text-black rounded-0 active"
                          : "text-black"
                      }`}
                      onClick={() => setActiveTab("chats")}
                    >
                      Chats
                      {getUnreadChatsCount() > 0 && (
                        <span className="badge bg-black text-white rounded-pill">
                          {getUnreadChatsCount()}
                        </span>
                      )}
                    </button>
                    <button
                      className={`btn flex-fill d-flex align-items-center justify-content-center gap-2 portal-tab-hover my-lawyers-main-tab ${
                        activeTab === "lawyers"
                          ? "border-bottom-3px text-black rounded-0 active"
                          : "text-black"
                      }`}
                      onClick={() => setActiveTab("lawyers")}
                    >
                      My Lawyers
                      {getUnreadLawyersCount() > 0 && (
                        <span className="badge bg-black text-white rounded-pill">
                          {getUnreadLawyersCount()}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sub Tabs (only for Lawyers tab) */}
                {activeTab === "lawyers" && (
                  <div className="px-4 pb-3">
                    <div className="d-flex gap-2">
                      <button
                        className={`btn flex-fill ${
                          activeSubTab === "active"
                            ? "bg-black text-white"
                            : "btn-light text-black"
                        }`}
                        onClick={() => setActiveSubTab("active")}
                      >
                        Active Lawyers
                      </button>
                      <button
                        className={`btn flex-fill ${
                          activeSubTab === "inactive"
                            ? "bg-black text-white"
                            : "btn-light text-black"
                        }`}
                        onClick={() => setActiveSubTab("inactive")}
                      >
                        Inactive Lawyers
                      </button>
                    </div>
                  </div>
                )}

                {/* Search Bar for Chats Tab */}
                {activeTab === "chats" && (
                  <div className="p-4">
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-pill my-lawyers-search-input"
                        placeholder="Search"
                      />
                      <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted fs-4 ms-4"></i>
                    </div>
                  </div>
                )}

                {/* Contact List */}
                <div
                  className={`flex-fill overflow-auto d-flex justify-content-start align-items-center flex-column ${
                    activeTab === "chats"
                      ? "my-lawyers-contact-list-chats"
                      : "my-lawyers-contact-list"
                  }`}
                >
                  {getCurrentData().map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-3 cursor-pointer mb-3 my-lawyers-contact-card portal-card-hover ${
                        selectedContact?.id === item.id
                          ? "my-lawyers-contact-card-active"
                          : "bg-white"
                      }`}
                      onClick={() => handleContactSelect(item)}
                    >
                      {activeTab === "lawyers" ? (
                        // Lawyers Layout
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center flex-fill">
                            <div className="symbol symbol-40px me-3">
                              <img
                                src={item.avatar}
                                alt={item.name}
                                className="rounded-circle my-lawyers-avatar-40"
                              />
                            </div>
                            <div className="flex-fill">
                              <h6 className="mb-1 fw-bold text-dark chat-lawyer-name">
                                {item.name}
                              </h6>
                              <p className="text-muted mb-1 fs-7">
                                {item.title}
                              </p>
                              <p className="text-muted mb-2 fs-8 d-none d-md-block">
                                {item.specializations}
                              </p>
                              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                                <small className="text-muted mb-1 mb-md-0">
                                  {item.renewalDate}
                                </small>
                                <div className="d-flex align-items-center gap-2">
                                  <span className="fw-bold text-dark chat-lawyer-price">
                                    {item.price}
                                  </span>
                                  {item.unreadCount > 0 && (
                                    <span className="badge bg-dark text-white rounded-circle my-lawyers-unread-badge">
                                      {item.unreadCount}
                                    </span>
                                  )}
                                  <i className="bi bi-chevron-right text-muted"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Chats Layout - Clean minimalist design
                        <div className="d-flex align-items-center">
                          <div className="symbol symbol-40px me-3">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="rounded-circle my-lawyers-avatar-40"
                            />
                          </div>
                          <div className="flex-fill my-lawyers-chat-flex-fill">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <h6 className="mb-0 fw-bold text-dark text-truncate me-2 my-lawyers-name-truncate chat-contact-name">
                                {item.name}
                              </h6>
                              <small className="text-muted fs-8 chat-contact-time">
                                {item.time}
                              </small>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <p
                                className="text-muted mb-0 fs-7 my-lawyers-message-text flex-fill me-2"
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  maxWidth: "calc(100% - 40px)",
                                }}
                              >
                                {item.lastMessage}
                              </p>
                              {item.unread > 0 && (
                                <span
                                  className={`badge text-white rounded-pill my-lawyers-chat-unread-badge chat-contact-badge ${
                                    item.unread === 3
                                      ? "bg-success"
                                      : "bg-black"
                                  }`}
                                  style={{
                                    minWidth: "20px",
                                    height: "20px",
                                    fontSize: "0.7rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {item.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel - Chat Interface */}
            <div className={`col-lg-8 col-md-7 d-flex flex-column my-lawyers-right-panel ${selectedContact ? 'col-12' : ''}`}>
              {selectedContact ? (
                // Chat Interface - Only show when contact is selected
                <>
                  {/* Conversation Header */}
                  <div className="p-4 bg-white my-lawyers-conversation-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        {/* Mobile Back Button */}
                        <button 
                          className="btn btn-sm d-lg-none me-3"
                          onClick={() => setSelectedContact(null)}
                        >
                          <i className="bi bi-arrow-left"></i>
                        </button>
                        <div className="symbol symbol-40px me-3">
                          <img
                            src={selectedContact.avatar}
                            alt={selectedContact.name}
                            className="rounded-circle my-lawyers-avatar-40"
                          />
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold text-dark">
                            {selectedContact.name}
                          </h6>
                          <small className="text-muted">
                            {activeTab === "chats"
                              ? "Lawyer"
                              : `${selectedContact.title || "Lawyer"}`}
                          </small>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm">
                          <i className="bi bi-search"></i>
                        </button>
                        <button className="btn btn-sm">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-fill p-4 overflow-auto my-lawyers-messages-area">
                    <div className="d-flex flex-column gap-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`d-flex ${
                            message.isFromUser
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div
                            className={`d-flex align-items-end ${
                              message.isFromUser ? "flex-row-reverse" : ""
                            }`}
                          >
                            <div className="symbol symbol-30px me-2">
                              <div className="symbol-label bg-black text-white rounded-circle">
                                <img
                                  src={circle}
                                  alt="avatar"
                                  className="rounded-circle my-lawyers-avatar-30"
                                />
                              </div>
                            </div>
                            <div
                              className={`p-3 rounded-3 my-lawyers-message-bubble ${
                                message.isFromUser
                                  ? "bg-dark text-white"
                                  : "bg-white text-dark"
                              }`}
                            >
                              <p className="mb-0">{message.text}</p>
                              <small
                                className={`${
                                  message.isFromUser
                                    ? "text-white-50"
                                    : "text-muted"
                                }`}
                              >
                                {message.time}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-3 p-lg-4 border-top bg-white rounded-3 shadow mx-2 mx-lg-5 my-lawyers-message-input">
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <div className="flex-fill">
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-pill"
                          placeholder="Write a Messages..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendMessage()
                          }
                        />
                      </div>
                      <button className="btn btn-sm d-none d-md-block">
                        <i className="bi bi-paperclip"></i>
                      </button>
                      <button
                        className="btn btn-dark rounded-circle d-flex justify-content-center align-items-center my-lawyers-send-button"
                        onClick={handleSendMessage}
                      >
                        <i className="bi bi-send-fill text-white"></i>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Empty State - Only show when no contact is selected
                <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                  <div className="text-center p-5">
                    <div className="mb-4">
                      <img src={NoMessage} alt="No Message" style={{ maxWidth: "200px", height: "auto" }} />
                    </div>
                    <h4 className="text-muted mb-2 fw-bold">No Messages, Yet.</h4>
                    <p className="text-muted mb-0">
                      You don't have any messages yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
