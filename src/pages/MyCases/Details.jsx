import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import notificationProfile from "../../assets/images/notification-profile.png";
import ApiService from "../../services/ApiService";
import "../../assets/css/case-details-button.css";

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseDetails, setCaseDetails] = useState(null);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateCase, setShowCreateCase] = useState(false);
  
  // Dropdown data states
  const [jurisdictions, setJurisdictions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [arbitrators, setArbitrators] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // Form states for Create Case offcanvas
  const [createCaseForm, setCreateCaseForm] = useState({
    jurisdiction: "",
    legalConsultantType: "",
    category: "",
    subCategory: "",
    explainCase: "",
    acceptTerms: false,
    caseBudget: "",
    caseValue: "",
    attachments: [],
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoadingDropdowns(true);
        
        // Fetch dropdown data (jurisdictions and arbitrators)
        const dropdownResponse = await ApiService.request({
          method: "GET",
          url: "getDropdownData",
        });
        const dropdownData = dropdownResponse.data;
        if (dropdownData.status && dropdownData.data) {
          if (dropdownData.data.jurisdictions) {
            setJurisdictions(dropdownData.data.jurisdictions);
          }
          if (dropdownData.data.arbitrators) {
            setArbitrators(dropdownData.data.arbitrators);
          }
        }
        
        // Fetch categories
        const categoriesResponse = await ApiService.request({
          method: "GET",
          url: "getCategories",
        });
        const categoriesData = categoriesResponse.data;
        if (categoriesData.status && categoriesData.data) {
          setCategories(categoriesData.data);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        toast.error("Failed to load form data");
      } finally {
        setLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch subcategories when category is selected
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!createCaseForm.category) {
        setSubCategories([]);
        setCreateCaseForm(prev => ({ ...prev, subCategory: "" }));
        return;
      }

      try {
        const response = await ApiService.request({
          method: "GET",
          url: "getSubCategories",
          data: { categories: JSON.stringify([createCaseForm.category]) }
        });
        const data = response.data;
        if (data.status && data.data) {
          setSubCategories(data.data);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [createCaseForm.category]);

  // Fetch case details from API
  useEffect(() => {
    const fetchCaseDetails = async () => {
      if (!id) {
        navigate("/my-cases");
        return;
      }

      try {
        setLoading(true);
        const response = await ApiService.request({
          method: "GET",
          url: "getCaseDetails",
          data: { case_id: id }
        });
        
        const data = response.data;
        if (data.status && data.data) {
          const caseData = data.data;
          
          // Transform case details
          setCaseDetails({
            id: caseData.id,
            caseId: `Case# ${caseData.id}`,
            title: "Case Details",
            description: caseData.description || "",
            countryRegion: caseData.jurisdictions?.map(j => j.name).join(", ") || "",
            legalConsultant: caseData.type_legal_consultant || "",
            caseCategory: caseData.categories?.[0]?.name || "",
            subCategory: caseData.sub_categories?.[0]?.name || "",
            caseValue: caseData.case_value ? `$${caseData.case_value}` : "",
            caseBudget: caseData.case_budget ? `$${caseData.case_budget}` : "",
            consultationType: caseData.consultation_type || [],
            languages: caseData.languages || [],
            attachments: caseData.attachments || [],
            rawData: caseData,
          });

          // Transform lawyers/interests data
          const interests = caseData.interests || [];
          const transformedLawyers = interests.map((interest) => {
            const lawyer = interest.lawyer;
            if (!lawyer) return null;

            // Get categories/subcategories
            const categories = lawyer.categories?.map(c => c.name).join(", ") || "";
            const subCategories = lawyer.sub_categories?.map(sc => sc.name).join(", ") || "";
            const specialization = categories || subCategories || "Lawyer";

            return {
              id: lawyer.id,
              name: lawyer.name || "",
              role: categories || subCategories || "Lawyer",
              specialization: specialization,
              renewal: interest.created_at ? new Date(interest.created_at).toLocaleDateString() : "",
              price: interest.price || "",
              avatar: lawyer.picture || notificationProfile,
              interestId: interest.id,
              rawData: interest,
            };
          }).filter(Boolean);

          setLawyers(transformedLawyers);
        } else {
          toast.error(data.message || "Failed to load case details");
          navigate("/my-cases");
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
        toast.error("Failed to load case details");
        navigate("/my-cases");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [id, navigate]);

  const handleFormChange = (field, value) => {
    setCreateCaseForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitCase = async () => {
    // Validation
    if (!createCaseForm.acceptTerms) {
      toast.error("Please accept the Privacy policy & Terms & conditions");
      return;
    }

    if (!createCaseForm.explainCase.trim()) {
      toast.error("Please provide a case description");
      return;
    }
    if (!createCaseForm.jurisdiction) {
      toast.error("Please select jurisdiction");
      return;
    }
    if (!createCaseForm.legalConsultantType) {
      toast.error("Please select type of legal consultant");
      return;
    }
    if (!createCaseForm.category) {
      toast.error("Please select category");
      return;
    }
    if (!createCaseForm.subCategory) {
      toast.error("Please select sub category");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', createCaseForm.explainCase.trim());
      formData.append('jurisdictions', JSON.stringify([parseInt(createCaseForm.jurisdiction)]));
      formData.append('type_legal_consultant', createCaseForm.legalConsultantType);
      formData.append('categories', JSON.stringify([parseInt(createCaseForm.category)]));
      formData.append('sub_categories', JSON.stringify([parseInt(createCaseForm.subCategory)]));
      
      // Set consultation_type as empty array if not provided
      formData.append('consultation_type', JSON.stringify([]));
      
      if (createCaseForm.caseBudget) {
        formData.append('case_budget', createCaseForm.caseBudget);
      }
      if (createCaseForm.caseValue) {
        formData.append('case_value', createCaseForm.caseValue);
      }
      
      // Add attachments if any
      if (createCaseForm.attachments && createCaseForm.attachments.length > 0) {
        createCaseForm.attachments.forEach((file) => {
          formData.append('attachments[]', file);
        });
      }

      const response = await ApiService.request({
        method: "POST",
        url: "createCase",
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      if (data.status) {
        toast.success(data.message || "Case created successfully!");
        setCreateCaseForm({
          jurisdiction: "",
          legalConsultantType: "",
          category: "",
          subCategory: "",
          explainCase: "",
          acceptTerms: false,
          caseBudget: "",
          caseValue: "",
          attachments: [],
        });
        setShowCreateCase(false);
        // Navigate to the new case details
        if (data.data && data.data.id) {
          navigate(`/my-cases/${data.data.id}`);
        } else {
          navigate("/my-cases");
        }
      } else {
        toast.error(data.message || "Failed to create case");
      }
    } catch (error) {
      console.error("Error creating case:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        toast.error("Failed to create case. Please try again.");
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      toast.error("You can upload maximum 4 files only");
      return;
    }
    setCreateCaseForm(prev => ({ ...prev, attachments: files }));
  };

  if (loading) {
    return (
      <div className="container-fluid case-details--mukta-font">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!caseDetails) {
    return (
      <div className="container-fluid case-details--mukta-font">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
          <div className="text-center">
            <h4 className="text-muted mb-2">Case Not Found</h4>
            <button className="btn btn-primary" onClick={() => navigate("/my-cases")}>
              Back to Cases
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid case-details--mukta-font">
      {/* Search and Filter Section */}
      <div 
        className="row mb-4 bg-white px-4 py-5 case-details-search-section"
        data-aos="fade-up"
      >
        <div className="col-12 px-0">
          <div className="d-flex gap-3 align-items-center">
            {/* Back Button */}
            <button
              className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2"
              onClick={() => navigate("/my-cases")}
              style={{ marginRight: "auto" }}
            >
              <i className="bi bi-arrow-left"></i>
              Back
            </button>

            {/* Add New Case Button */}
            <button
              className="btn rounded-pill px-4 py-2 d-flex justify-content-center align-items-center gap-2 case-details-add-case-btn portal-button-hover"
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
                <h4 className="text-dark mb-0 case-details-explain-title">Case Details</h4>
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
              {lawyers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">No lawyers have shown interest in this case yet.</p>
                </div>
              ) : (
              lawyers.map((lawyer, index) => (
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
              ))
              )}
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
                      disabled={loadingDropdowns}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select Jurisdiction</option>
                      {jurisdictions.map((jurisdiction) => (
                        <option key={jurisdiction.id} value={jurisdiction.id}>
                          {jurisdiction.name}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i>
                  </div>
                </div>
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.legalConsultantType}
                      onChange={(e) => handleFormChange("legalConsultantType", e.target.value)}
                      disabled={loadingDropdowns}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Type of legal consultant</option>
                      {arbitrators.map((arbitrator) => (
                        <option key={arbitrator.id} value={arbitrator.name}>
                          {arbitrator.name}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i>
                  </div>
                </div>
              </div>

              {/* Second Row Selects */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.category}
                      onChange={(e) => handleFormChange("category", e.target.value)}
                      disabled={loadingDropdowns}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i>
                  </div>
                </div>
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={createCaseForm.subCategory}
                      onChange={(e) => handleFormChange("subCategory", e.target.value)}
                      disabled={!createCaseForm.category || loadingDropdowns}
                      style={{
                        width: "100%",
                        height: "56px",
                        border: "1px solid #C9C9C9",
                        borderRadius: "12px",
                      }}
                    >
                      <option value="">Select Sub Category</option>
                      {subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down position-absolute top-50 end-0 translate-middle-y me-3 text-gray-600"></i>
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

              {/* Case Budget & Case Value */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Case Budget (USD)"
                    value={createCaseForm.caseBudget}
                    onChange={(e) => handleFormChange("caseBudget", e.target.value)}
                    style={{
                      height: "56px",
                      border: "1px solid #C9C9C9",
                      borderRadius: "12px",
                    }}
                  />
                </div>
                <div className="col-6">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Case Value (USD)"
                    value={createCaseForm.caseValue}
                    onChange={(e) => handleFormChange("caseValue", e.target.value)}
                    style={{
                      height: "56px",
                      border: "1px solid #C9C9C9",
                      borderRadius: "12px",
                    }}
                  />
                </div>
              </div>

              {/* Attach Document */}
              <div className="mb-3">
                <label className="form-label">Attach Documents (Max 4 files, 2MB each)</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{
                    height: "56px",
                    border: "1px solid #C9C9C9",
                    borderRadius: "12px",
                  }}
                />
                {createCaseForm.attachments.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {createCaseForm.attachments.length} file(s) selected
                    </small>
                  </div>
                )}
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
