import React from 'react';
import { createPortal } from 'react-dom';
import Lottie from 'lottie-react';
import AuthService from '../services/AuthService';
import logoutAnimation from '../assets/images/logout.json';

const LogoutModal = ({ show, onClose, onConfirm }) => {
  const handleLogout = () => {
    AuthService.logout();
    onConfirm();
  };

  if (!show) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="offcanvas-backdrop fade show"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          transition: "all 0.3s ease-out",
        }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          style={{
            maxWidth: "400px",
            width: "90%",
            margin: "0 auto",
            pointerEvents: "auto",
          }}
        >
          <div
            className="modal-content"
            style={{
              borderRadius: "20px",
              border: "none",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
              backgroundColor: "#fff",
              position: "relative",
              maxWidth: "450px",
              width: "90%",
            }}
          >
            {/* Close Button - Top Right */}
            <button
              type="button"
              onClick={onClose}
              className="logout-modal-close-btn"
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
                e.target.style.color = "#000";
                const icon = e.target.querySelector("i");
                if (icon) icon.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = "#000";
                const icon = e.target.querySelector("i");
                if (icon) icon.style.color = "#000";
              }}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Modal Content */}
            <div
              style={{
                padding: "3rem 2.5rem 2rem 2.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Animation */}
              <div
                className="d-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "120px",
                  height: "120px",
                }}
              >
                <Lottie
                  animationData={logoutAnimation}
                  loop={true}
                  autoplay={true}
                  style={{ width: "120px", height: "120px" }}
                />
              </div>

              {/* Message */}
              <h4 className="fw-bold text-dark mb-3" style={{ fontSize: "20px", lineHeight: "1.4" }}>
                Are you sure you want to logout?
              </h4>
              <p className="text-muted mb-4" style={{ fontSize: "16px", lineHeight: "1.5" }}>
                You will need to sign in again to access your account.
              </p>

              {/* Action Button */}
              <button
                type="button"
                className="btn w-100 logout-modal-button"
                onClick={handleLogout}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  backgroundColor: "#000",
                  border: "none",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                  marginTop: "1rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#333";
                  e.target.style.color = "#ffffff";
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#000";
                  e.target.style.color = "#ffffff";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Use React Portal to render at document root level
  return createPortal(modalContent, document.body);
};

export default LogoutModal;
