import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import notificationProfile from "../../assets/images/notification-profile.png";
import "../../assets/css/case-details-button.css";

const Details = () => {
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

  const [searchTerm, setSearchTerm] = useState(
    loadFromLocalStorage("myCases_searchTerm", "")
  );
  const [showCreateCase, setShowCreateCase] = useState(
    loadFromLocalStorage("myCases_details_showCreateCase", false)
  );

  // Default case details with professional text
  const defaultCaseDetails = {
    caseId: "Case# 2548",
    title: "Explain Your Case",
    description:
      "I am seeking legal representation for a complex criminal matter involving allegations of financial misconduct. The case involves multiple parties and requires expertise in both criminal defense and corporate law. I need an experienced attorney who can navigate the intricacies of UAE jurisdiction and provide strategic counsel throughout the legal proceedings. The matter is time-sensitive and requires immediate attention to protect my rights and interests.",
    countryRegion: "UAE Jurisdiction",
    legalConsultant: "Legal Advisor",
    caseCategory: "Criminal Law",
    subCategory: "Crimes Against Persons",
    caseValue: "$1M",
    caseBudget: "$2000",
  };

  const [caseDetails, setCaseDetails] = useState(
    loadFromLocalStorage("myCases_caseDetails", defaultCaseDetails)
  );

  // Default lawyers data
  const defaultLawyers = [
    {
      id: 1,
      name: "Shamra Joseph",
      role: "Corporate lawyer",
      specialization: "Criminal Law, Tax Law+",
      renewal: "Renew 21 September",
      price: "1.99 USD",
      avatar: notificationProfile,
    },
    {
      id: 2,
      name: "Shamra Joseph",
      role: "Corporate lawyer",
      specialization: "Criminal Law, Tax Law+",
      renewal: "Renew 21 September",
      price: "1.99 USD",
      avatar: notificationProfile,
    },
    {
      id: 3,
      name: "Shamra Joseph",
      role: "Corporate lawyer",
      specialization: "Criminal Law, Tax Law+",
      renewal: "Renew 21 September",
      price: "1.99 USD",
      avatar: notificationProfile,
    },
    {
      id: 4,
      name: "Shamra Joseph",
      role: "Corporate lawyer",
      specialization: "Criminal Law, Tax Law+",
      renewal: "Renew 21 September",
      price: "1.99 USD",
      avatar: notificationProfile,
    },
  ];

  const [lawyers, setLawyers] = useState(
    loadFromLocalStorage("myCases_lawyers", defaultLawyers)
  );

  // Form states for Create Case offcanvas
  const [createCaseForm, setCreateCaseForm] = useState({
    jurisdiction: loadFromLocalStorage("myCases_createCase_jurisdiction", ""),
    legalConsultantType: loadFromLocalStorage("myCases_createCase_legalConsultantType", ""),
    caseCategory: loadFromLocalStorage("myCases_createCase_caseCategory", ""),
    subCategory: loadFromLocalStorage("myCases_createCase_subCategory", ""),
    explainCase: loadFromLocalStorage("myCases_createCase_explainCase", ""),
    acceptTerms: loadFromLocalStorage("myCases_createCase_acceptTerms", false),
  });

  // Save all data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("myCases_searchTerm", JSON.stringify(searchTerm));
      localStorage.setItem("myCases_caseDetails", JSON.stringify(caseDetails));
      localStorage.setItem("myCases_lawyers", JSON.stringify(lawyers));
      localStorage.setItem("myCases_details_showCreateCase", JSON.stringify(showCreateCase));
      localStorage.setItem("myCases_createCase_jurisdiction", JSON.stringify(createCaseForm.jurisdiction));
      localStorage.setItem("myCases_createCase_legalConsultantType", JSON.stringify(createCaseForm.legalConsultantType));
      localStorage.setItem("myCases_createCase_caseCategory", JSON.stringify(createCaseForm.caseCategory));
      localStorage.setItem("myCases_createCase_subCategory", JSON.stringify(createCaseForm.subCategory));
      localStorage.setItem("myCases_createCase_explainCase", JSON.stringify(createCaseForm.explainCase));
      localStorage.setItem("myCases_createCase_acceptTerms", JSON.stringify(createCaseForm.acceptTerms));
    } catch (error) {
      console.error("Error saving MyCases data to localStorage:", error);
    }
  }, [searchTerm, caseDetails, lawyers, createCaseForm, showCreateCase]);

  const handleFormChange = (field, value) => {
    setCreateCaseForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitCase = () => {
    if (!createCaseForm.acceptTerms) {
      toast.error("Please accept the Privacy policy & Terms & conditions");
      return;
    }

    if (!createCaseForm.explainCase.trim()) {
      toast.error("Please provide a case description");
      return;
    }

    // Create new case
    const newCaseId = `Case# ${Date.now()}`;
    const newCase = {
      caseId: newCaseId,
      title: "Explain Your Case",
      description: createCaseForm.explainCase,
      countryRegion: createCaseForm.jurisdiction || "UAE Jurisdiction",
      legalConsultant: createCaseForm.legalConsultantType || "Legal Advisor",
      caseCategory: createCaseForm.caseCategory || "Criminal Law",
      subCategory: createCaseForm.subCategory || "Crimes Against Persons",
      caseValue: "$1M",
      caseBudget: "$2000",
    };

    setCaseDetails(newCase);
    toast.success("Case created successfully!");
    
    // Reset form
    setCreateCaseForm({
      jurisdiction: "",
      legalConsultantType: "",
      caseCategory: "",
      subCategory: "",
      explainCase: "",
      acceptTerms: false,
    });
    
    setShowCreateCase(false);
  };

  return (
    <div className="container-fluid case-details--mukta-font">
      {/* Search and Filter Section */}
      <div 
        className="row mb-4 bg-white px-4 py-5 case-details-search-section"
        data-aos="fade-up"
      >
        <div className="col-12 px-0">
          <div className="d-flex gap-3 align-items-center">
            {/* Search Bar */}
            <div
              className="position-relative flex-grow-1"
              style={{ maxWidth: "400px" }}
            >
              <input
                type="text"
                className="form-control form-control-lg rounded-pill case-details-search-input portal-form-hover"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-muted fs-4 ms-4"></i>
            </div>

            {/* Filter Button */}
            {/* <button
              className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2 case-details-filter-btn portal-button-hover"
            >
              <i className="bi bi-funnel"></i>
              Filter
            </button> */}

            {/* Add New Case Button */}
            <button
              className="btn rounded-pill px-4 py-2 d-flex justify-content-center align-items-center gap-2 case-details-add-case-btn portal-button-hover" style={{ marginLeft: "80px" }}
              type="button"
              onClick={() => setShowCreateCase(true)}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center case-details-add-case-icon"
              >
                <i
                  className="bi bi-plus text-white fs-1 pe-0 case-details-add-case-icon-plus"
                ></i>
              </div>
              Add New Case
            </button>
          </div>
        </div>
      </div>

      {/* Explain Your Case Section */}
      <div 
        className="row mb-4 case-details-main-section"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div className="col-12 rounded-4">
          <div
            className="card bg-white case-details-explain-card case-card-hover"
          >
            <div className="card-body p-0">
              <div className="d-flex justify-content-between align-items-center mb-3 p-4">
                <h4 className="text-dark mb-0 case-details-explain-title">{caseDetails.title}</h4>
                <span
                  className="badge bg-light text-dark px-3 py-2 rounded-pill case-details-explain-badge portal-badge-hover"
                >
                  {caseDetails.caseId}
                </span>
              </div>
              <p
                className="text-muted mb-0 px-3 pb-3 case-details-explain-description"
              >
                {caseDetails.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Details Section */}
      <div 
        className="row mb-4 case-details-main-section"
        data-aos="fade-up"
        data-aos-delay="200"
      >
        <div className="col-lg-4 col-md-6 mb-3">
          <div
            className="card h-100 shadow-sm case-details-info-card case-details-info-hover"
            data-aos="fade-right"
            data-aos-delay="300"
          >
            <div className="card-body p-4">
              <div
                className="mb-3 pb-3 case-details-info-divider"
              >
                <small
                  className="text-muted d-block mb-1 case-details-info-label"
                >
                  Country Region
                </small>
                <span
                  className="case-details-info-value"
                >
                  {caseDetails.countryRegion}
                </span>
              </div>
              <div>
                <small
                  className="text-muted d-block mb-1 case-details-info-label"
                >
                  Type of legal consultant
                </small>
                <span
                  className="case-details-info-value"
                >
                  {caseDetails.legalConsultant}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-3">
          <div
            className="card h-100 shadow-sm case-details-info-card case-details-info-hover"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="card-body p-4">
              <div
                className="mb-3 pb-3 case-details-info-divider"
              >
                <small
                  className="text-muted d-block mb-1 case-details-info-label"
                >
                  Select Case Category
                </small>
                <span
                  className="case-details-info-value"
                >
                  {caseDetails.caseCategory}
                </span>
              </div>
              <div>
                <small
                  className="text-muted d-block mb-1 case-details-info-label"
                >
                  Select Sub Categories
                </small>
                <span
                  className="case-details-info-value"
                >
                  {caseDetails.subCategory}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-3">
          <div
            className="card shadow-sm case-details-financial-card case-details-info-hover"
            data-aos="fade-left"
            data-aos-delay="500"
          >
            <div className="card-body p-4 h-100">
              <div className="row h-100">
                <div
                  className="col-6 d-flex flex-column justify-content-center align-items-start case-details-financial-divider"
                >
                  <small
                    className="d-block mb-2 case-details-financial-label"
                  >
                    Case Value
                  </small>
                  <span
                    className="case-details-financial-value"
                  >
                    {caseDetails.caseValue}
                  </span>
                </div>
                <div className="col-6 d-flex flex-column justify-content-center align-items-start">
                  <small
                    className="d-block mb-2 case-details-financial-label"
                  >
                    Case Budget
                  </small>
                  <span
                    className="case-details-financial-value"
                  >
                    {caseDetails.caseBudget}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lawyers Respond Section */}
      <div 
        className="row case-details-lawyers-section"
        data-aos="fade-up"
        data-aos-delay="600"
      >
        <div className="col-12">
          <div
            className="card bg-transparent border-0 case-details-lawyers-card"
          >
            <div className="card-body p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold text-dark mb-0 case-details-lawyers-title">Lawyers Respond</h4>
              </div>

              {/* Lawyers List */}
              {lawyers.map((lawyer, index) => (
                <div
                  key={lawyer.id}
                  className="card mb-3 border-0 shadow-sm case-details-lawyer-card case-lawyer-portal-hover"
                  data-aos="fade-up"
                  data-aos-delay={700 + (index * 100)}
                >
                  <div className="card-body d-flex align-items-center justify-content-between flex-wrap p-3">
                    {/* Profile */}
                    <div
                      className="d-flex align-items-center case-details-lawyer-profile"
                    >
                      <img
                        src={lawyer.avatar}
                        alt={lawyer.name}
                        className="rounded-circle me-5"
                        width="48"
                        height="48"
                      />
                      <div>
                        <h6 className="fw-bold mb-0" style={{ fontSize: "18px", color: "#474747" }}>
                          {lawyer.name}
                        </h6>
                      </div>
                    </div>

                    {/* Practice Role */}
                    <div
                      className="case-details-lawyer-practice"
                    >
                      {lawyer.role}
                    </div>

                    {/* Practice Areas */}
                    <div
                      className="case-details-lawyer-practice"
                    >
                      {lawyer.specialization}
                    </div>

                    {/* Renewal Date */}
                    <div
                      className="case-details-lawyer-renewal"
                    >
                      {lawyer.renewal}
                    </div>

                    {/* Price */}
                    <div className="case-details-lawyer-price">{lawyer.price}</div>

                    {/* Arrow */}
                    <div className="case-details-lawyer-arrow">
                      <i className="bi bi-chevron-right"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Case Offcanvas */}
      {showCreateCase && (
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
            transition: "all 0.3s ease",
            borderRadius: "13px",
            margin: "20px",
            zIndex: 1045,
          }}
        >
          <div className="offcanvas-header border-bottom">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="mb-0 fw-bold">Create a Case</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateCase(false)}
              ></button>
            </div>
          </div>

          <div className="offcanvas-body p-0 d-flex flex-column" style={{ height: "100%" }}>
            <div className="p-4 flex-grow-1" style={{ overflowY: "auto" }}>
              {/* Top Row Selects */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.jurisdiction}
                      onChange={(e) => handleFormChange("jurisdiction", e.target.value)}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select Jurisdiction</option>
                      <option value="UAE Jurisdiction">UAE Jurisdiction</option>
                      <option value="Saudi Arabia Jurisdiction">Saudi Arabia Jurisdiction</option>
                      <option value="Kuwait Jurisdiction">Kuwait Jurisdiction</option>
                      <option value="Qatar Jurisdiction">Qatar Jurisdiction</option>
                      <option value="Bahrain Jurisdiction">Bahrain Jurisdiction</option>
                      <option value="Oman Jurisdiction">Oman Jurisdiction</option>
                    </select>
                    {/* <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i> */}
                  </div>
                </div>
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.legalConsultantType}
                      onChange={(e) => handleFormChange("legalConsultantType", e.target.value)}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Type of legal consultant</option>
                      <option value="Legal Advisor">Legal Advisor</option>
                      <option value="Corporate Lawyer">Corporate Lawyer</option>
                      <option value="Criminal Defense Attorney">Criminal Defense Attorney</option>
                      <option value="Family Law Attorney">Family Law Attorney</option>
                      <option value="Real Estate Lawyer">Real Estate Lawyer</option>
                      <option value="Tax Attorney">Tax Attorney</option>
                    </select>
                    {/* <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i> */}
                  </div>
                </div>
              </div>

              {/* Second Row Selects */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.caseCategory}
                      onChange={(e) => handleFormChange("caseCategory", e.target.value)}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select Case Category</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                      <option value="Family Law">Family Law</option>
                      <option value="Real Estate Law">Real Estate Law</option>
                      <option value="Tax Law">Tax Law</option>
                      <option value="Employment Law">Employment Law</option>
                      <option value="Intellectual Property Law">Intellectual Property Law</option>
                    </select>
                    {/* <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i> */}
                  </div>
                </div>
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.subCategory}
                      onChange={(e) => handleFormChange("subCategory", e.target.value)}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select Sub Categories</option>
                      <option value="Crimes Against Persons">Crimes Against Persons</option>
                      <option value="Property Crimes">Property Crimes</option>
                      <option value="White Collar Crimes">White Collar Crimes</option>
                      <option value="Drug Crimes">Drug Crimes</option>
                      <option value="Traffic Violations">Traffic Violations</option>
                    </select>
                    {/* <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i> */}
                  </div>
                </div>
              </div>

              {/* Explain Case */}
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Explain Your Case"
                  value={createCaseForm.explainCase}
                  onChange={(e) => handleFormChange("explainCase", e.target.value)}
                  style={{
                    resize: "none",
                    width: "100%",
                    height: "217px",
                    border: "1px solid #C9C9C9",
                    borderRadius: "12px",
                  }}
                ></textarea>
              </div>

              {/* Attach Document */}
              <div className="mb-3">
                <div
                  className="d-flex align-items-center justify-content-start border border-2 border-dashed rounded"
                  style={{
                    border: "1.5px dashed #C9C9C9",
                    width: "100%",
                    height: "80px",
                    borderRadius: "12px",
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

              {/* Accept Terms */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="acceptTerms"
                  checked={createCaseForm.acceptTerms}
                  onChange={(e) => handleFormChange("acceptTerms", e.target.checked)}
                />
                <label className="form-check-label ms-2" htmlFor="acceptTerms">
                  Accept all Privacy policy & Terms & conditions
                </label>
              </div>
            </div>

            {/* Submit Button - fixed at bottom */}
            <div className="p-4 border-top" style={{ backgroundColor: "#fff", borderRadius: "13px" }}>
              <button
                className="btn text-white rounded-pill w-100"
                onClick={handleSubmitCase}
                style={{
                  height: "63px",
                  fontSize: "20px",
                  fontWeight: "500",
                  backgroundColor: "#474747",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for Create Case */}
      {showCreateCase && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowCreateCase(false)}
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

export default Details;
