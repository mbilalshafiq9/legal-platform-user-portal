import React, { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { setPermissions, clearPermissions } from "../stores/permissionsSlice";
import logoImg from "../assets/images/login-img.png";
import logoImg2 from "../assets/images/logoImg2.png";
import logo from "../assets/images/logo.png";
import G from "../assets/images/G.png";
import notificationProfile from "../assets/images/notification-profile.png";
// import loginBgVideo from "../assets/login-bg-video.mp4"; // Moved to public folder
import "../assets/css/dark-mode.css";
import "./Login.css";

const Login = () => {
  // Load saved credentials from localStorage
  const loadSavedCredentials = () => {
    try {
      const saved = localStorage.getItem("loginCredentials");
      if (saved) {
        const credentials = JSON.parse(saved);
        return credentials;
      }
    } catch (error) {
      console.error("Error loading saved credentials:", error);
    }
    return null;
  };

  const savedCredentials = loadSavedCredentials();
  
  const [email, setEmail] = useState(savedCredentials?.email || "");
  const [password, setPassword] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );
  const navigate = useNavigate();

  // Slider data - COMMENTED OUT FOR VIDEO BACKGROUND
  // const sliderData = [
  //   {
  //     id: 1,
  //     title: "Professional Legal Services",
  //     description:
  //       "Get expert legal advice from qualified attorneys. Our platform connects you with experienced lawyers for all your business and personal legal needs.",
  //     image: logoImg,
  //   },
  //   {
  //     id: 2,
  //     title: "Legal Solutions Made Simple",
  //     description:
  //       "Connect with experienced lawyers and get expert legal advice for all your business needs. Streamlined process for quick and effective legal solutions.",
  //     image: logoImg2,
  //   },
  //   {
  //     id: 3,
  //     title: "Expert Legal Guidance",
  //     description:
  //       "Access a network of qualified attorneys ready to help you navigate complex legal challenges. Get professional guidance when you need it most.",
  //     image: logoImg,
  //   },
  //   {
  //     id: 4,
  //     title: "Secure & Confidential",
  //     description:
  //       "Your legal matters are handled with the highest level of security and confidentiality. Trust us with your sensitive legal information and documents.",
  //     image: logoImg2,
  //   },
  // ];

  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = AuthService.getCurrentUser();
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Apply dark mode on component mount and when it changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // Sync dark mode with localStorage changes from other pages
  useEffect(() => {
    const handleStorageChange = () => {
      const darkModeValue = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(darkModeValue);
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for changes (in case of same-tab updates)
    const interval = setInterval(() => {
      const darkModeValue = localStorage.getItem("darkMode") === "true";
      if (darkModeValue !== isDarkMode) {
        setIsDarkMode(darkModeValue);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [isDarkMode]);


  // Auto-advance slider - COMMENTED OUT FOR VIDEO BACKGROUND
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prevSlide) =>
  //       prevSlide === sliderData.length - 1 ? 0 : prevSlide + 1
  //     );
  //   }, 4000); // Change slide every 4 seconds

  //   return () => clearInterval(interval);
  // }, [sliderData.length]);

  // Handle dot click - COMMENTED OUT FOR VIDEO BACKGROUND
  // const handleDotClick = (index) => {
  //   setCurrentSlide(index);
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate email and password are provided
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoader(true);

    // Temporary authentication: Accept any email and password
    // This will be replaced with API integration later
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a temporary user object
      const user = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0] || 'User',
        auth_token: 'temp_token_' + Date.now(),
        isAuthenticated: true
      };

      // Save user to localStorage (using 'admin' key to match existing AuthService)
      localStorage.setItem("admin", JSON.stringify(user));
      localStorage.setItem("isAuthenticated", "true");

      // Save login credentials to localStorage
      const loginCredentials = {
        email: email,
        password: password,
        lastLogin: new Date().toISOString()
      };
      localStorage.setItem("loginCredentials", JSON.stringify(loginCredentials));

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Panel - Video Background Section */}
      <div className="left-panel" data-aos="fade-right" data-aos-delay="100">
        {/* Video Container */}
        <div className="slider-container" style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          {/* Video Background */}
          <video
            className="login-video-bg"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center center",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              maxWidth: "none",
              maxHeight: "none",
              transform: "none",
              zIndex: 1
            }}
          >
            <source src={`${process.env.PUBLIC_URL}/login-bg-video.mp4`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Gradient Overlay */}
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.3) 100%)",
              zIndex: 2
            }}
          />

          {/* Content Overlay */}
          <div className="left-panel-content" data-aos="fade-up" data-aos-delay="300" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px", zIndex: 3 }}>
            <h1 className="left-panel-title text-white text-center">
              Professional Legal Services
            </h1>
            <p className="left-panel-description text-white text-center">
              Get expert legal advice from qualified attorneys. Our platform connects you with experienced lawyers for all your business and personal legal needs.
            </p>
          </div>
        </div>

        {/* Pagination Dots - COMMENTED OUT FOR VIDEO BACKGROUND */}
        {/* <div className="pagination-dots">
          {sliderData.map((_, index) => (
            <div
              key={index}
              className={`pagination-dot ${
                index === currentSlide ? "active" : "inactive"
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div> */}
      </div>

      {/* Right Panel - Login Form Section */}
      <div className="right-panel" data-aos="fade-left" data-aos-delay="200">
        {/* Logo */}
        <div style={{ marginBottom: "60px" }} data-aos="fade-up" data-aos-delay="300">
          <img alt="Legal Platform Logo" src={logo} className="login-logo" />
        </div>

        {/* Login Form */}
        <div data-aos="fade-up" data-aos-delay="400">
          <h2 className="login-title">Login</h2>

          <form onSubmit={handleLogin} className="login-form">
            {/* Email Field */}
            <div className="form-group" data-aos="fade-up" data-aos-delay="500">
              <label className="form-label" style={{ fontSize: "18px" }}>Email</label>
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input rounded-pill login-page-inp"
                placeholder="noon@company.com"
                style={{ fontSize: "18px", width: "398px", height: "67px", paddingLeft: "30px", paddingRight: "30px" }}
              />
            </div>

            {/* Password Field */}
            <div className="form-group" data-aos="fade-up" data-aos-delay="600">
              <label className="form-label" style={{ fontSize: "18px" }}>Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input rounded-pill login-page-inp"
                  placeholder="Password"
                  autoComplete="off"
                  style={{ width: "398px", height: "67px", fontSize: "18px", paddingLeft: "30px", paddingRight: "30px" }}
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="form-group" data-aos="fade-up" data-aos-delay="650">
              <div className="d-flex align-items-start" style={{ width: "398px" }}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="agreeToTerms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    style={{ 
                      width: "18px", 
                      height: "18px", 
                      marginTop: "2px",
                      accentColor: "#000"
                    }}
                  />
                  <label className="form-check-label text-muted" htmlFor="agreeToTerms" style={{ fontSize: "14px", lineHeight: "1.4", marginLeft: "8px" }}>
                    I agree to all the{" "}
                    <a href="#" className="text-dark fw-semibold" style={{ textDecoration: "underline" }}>
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={isLoader || !agreeToTerms} className="login-button rounded-pill d-flex align-items-center justify-content-center position-relative" style={{ width: "398px", height: "67px", fontSize: "18px", opacity: agreeToTerms ? 1 : 0.6 }} data-aos="fade-up" data-aos-delay="700">
              {isLoader ? (
                <Loader size="20" text="Signing" color="white" />
              ) : (
                <>
                  <span className="login-text">Login</span>
                  <span className="login-button-arrow rounded-pill bg-white d-flex justify-content-center align-items-center position-absolute" style={{ width: "29px", height: "29px", right: "15px" }}> 
                    <i className="bi bi-arrow-right text-black fs-6"></i> 
                  </span>
                </>
              )}
            </button>

            {/* Google Login Button */}
            <button type="button" className="google-button rounded-pill login-btn-google" disabled={!agreeToTerms} style={{ width: "398px", height: "67px", fontSize: "18px", opacity: agreeToTerms ? 1 : 0.6 }} data-aos="fade-up" data-aos-delay="800">
              <span className="google-icon">
                <img src={G} alt="" className="w-35px h-35px" />
              </span>
              Continue With Google
            </button>
          </form>
        </div>

        {/* Copyright */}
        <div className="copyright" data-aos="fade-up" data-aos-delay="900">
          © 2025 Legal Platform. All rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
