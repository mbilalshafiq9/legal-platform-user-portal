import React, { useState } from "react";
import notificationProfile from "../../assets/images/notification-profile.png";

const List = () => {
  const [notifications] = useState([
    {
      id: 1,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 2,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 3,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 4,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 5,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 6,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 7,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
    {
      id: 8,
      name: "Maxwell Clarck",
      message: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.",
      time: "1 hour",
      isUnread: true,
      avatar: notificationProfile,
    },
  ]);

  return (
    <div className="d-flex flex-column flex-column-fluid notification-header">
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" className="app-container container-xxl">
          {/* Notifications List */}
          <div className="row">
            <div className="col-12">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="card mb-3 shadow-sm"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "#f8f9fa",
                    border: "none",
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      {/* Avatar with unread indicator */}
                      <div className="position-relative me-3">
                        <img
                          src={notification.avatar}
                          alt={notification.name}
                          className="rounded-circle"
                          style={{ width: "48px", height: "48px" }}
                        />
                        {notification.isUnread && (
                          <div
                            className="position-absolute top-0 end-0"
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "#000",
                              borderRadius: "50%",
                              border: "2px solid white",
                            }}
                          ></div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-fill">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold text-dark mb-0">
                            {notification.name}
                          </h6>
                          <span className="text-muted fs-7">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-muted mb-0" style={{ lineHeight: "1.5" }}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
