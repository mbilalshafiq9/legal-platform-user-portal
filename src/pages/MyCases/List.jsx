import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import notificationProfile from "../../assets/images/notification-profile.png";
import { toast } from "react-toastify";
import ApiService from "../../services/ApiService";

const List = () => {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateCase, setShowCreateCase] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);
  
  // Dropdown data states
  const [jurisdictions, setJurisdictions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [arbitrators, setArbitrators] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  const initialFormState = {
    jurisdiction: "",
    consultantType: "",
    category: "",
    subCategory: "",
    description: "",
    caseBudget: "",
    caseValue: "",
    attachments: [],
  };

  const [newCaseData, setNewCaseData] = useState(initialFormState);

  const handleCloseCase = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowCreateCase(false);
      setIsClosing(false);
    }, 300);
  };

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
      if (!newCaseData.category) {
        setSubCategories([]);
        setNewCaseData(prev => ({ ...prev, subCategory: "" }));
        return;
      }

      try {
        const response = await ApiService.request({
          method: "GET",
          url: "getSubCategories",
          data: { categories: JSON.stringify([newCaseData.category]) }
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
  }, [newCaseData.category]);

  // Fetch cases from API
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await ApiService.request({
          method: "GET",
          url: "myCases",
        });
        const data = response.data;
        if (data.status && data.data && data.data.cases) {
          // Transform API data to match component format
          const transformedCases = data.data.cases.map((caseItem) => {
            // Get first category name
            const categoryName = caseItem.categories?.[0]?.name || caseItem.sub_categories?.[0]?.name || "Case";
            // Get jurisdiction names
            const jurisdictionNames = caseItem.jurisdictions?.map(j => j.name).join(", ") || "";
            // Parse attachments if available
            let attachments = [];
            if (caseItem.attachments) {
              try {
                attachments = typeof caseItem.attachments === 'string' 
                  ? JSON.parse(caseItem.attachments) 
                  : caseItem.attachments;
              } catch (e) {
                attachments = [];
              }
            }
            
            return {
              id: caseItem.id,
              caseType: categoryName,
              caseId: `Case# ${caseItem.id}`,
              description: caseItem.description || "",
              jurisdiction: jurisdictionNames || "N/A",
              caseBudget: caseItem.case_budget ? `$${caseItem.case_budget}` : "$0",
              respond: caseItem.interests?.length || 0,
              rawData: caseItem, // Keep raw data for details view
            };
          });
          setCases(transformedCases);
          setPagination(data.data.pagination);
        } else {
          setCases([]);
        }
      } catch (error) {
        console.error("Error fetching cases:", error);
        toast.error("Failed to load cases");
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Handle search with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      const fetchCases = async () => {
        try {
          setLoading(true);
          const response = await ApiService.request({
            method: "GET",
            url: "myCases",
            data: searchTerm ? { search: searchTerm } : {},
          });
          const data = response.data;
          if (data.status && data.data && data.data.cases) {
            const transformedCases = data.data.cases.map((caseItem) => {
              const categoryName = caseItem.categories?.[0]?.name || caseItem.sub_categories?.[0]?.name || "Case";
              const jurisdictionNames = caseItem.jurisdictions?.map(j => j.name).join(", ") || "";
              
              return {
                id: caseItem.id,
                caseType: categoryName,
                caseId: `Case# ${caseItem.id}`,
                description: caseItem.description || "",
                jurisdiction: jurisdictionNames || "N/A",
                caseBudget: caseItem.case_budget ? `$${caseItem.case_budget}` : "$0",
                respond: caseItem.interests_count || 0,
                rawData: caseItem,
              };
            });
            setCases(transformedCases);
            setPagination(data.data.pagination);
          } else {
            setCases([]);
          }
        } catch (error) {
          console.error("Error fetching cases:", error);
          setCases([]);
        } finally {
          setLoading(false);
        }
      };

      fetchCases();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleNewCaseChange = (field, value) => {
    setNewCaseData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitNewCase = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newCaseData.description.trim()) {
      toast.error("Please describe your case");
      return;
    }
    if (!newCaseData.jurisdiction) {
      toast.error("Please select jurisdiction");
      return;
    }
    if (!newCaseData.consultantType) {
      toast.error("Please select type of legal consultant");
      return;
    }
    if (!newCaseData.category) {
      toast.error("Please select category");
      return;
    }
    if (!newCaseData.subCategory) {
      toast.error("Please select sub category");
      return;
    }

    try {
      // Create FormData for case creation
      const formData = new FormData();
      formData.append('description', newCaseData.description.trim());
      formData.append('jurisdictions', JSON.stringify([parseInt(newCaseData.jurisdiction)]));
      formData.append('type_legal_consultant', newCaseData.consultantType);
      formData.append('categories', JSON.stringify([parseInt(newCaseData.category)]));
      formData.append('sub_categories', JSON.stringify([parseInt(newCaseData.subCategory)]));
      
      // Set consultation_type as empty array if not provided
      formData.append('consultation_type', JSON.stringify([]));
      
      if (newCaseData.caseBudget) {
        formData.append('case_budget', newCaseData.caseBudget);
      }
      if (newCaseData.caseValue) {
        formData.append('case_value', newCaseData.caseValue);
      }
      
      // Add attachments if any
      if (newCaseData.attachments && newCaseData.attachments.length > 0) {
        newCaseData.attachments.forEach((file) => {
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
        setNewCaseData(initialFormState);
        handleCloseCase();
        
        // Refresh cases list
        const refreshResponse = await ApiService.request({
          method: "GET",
          url: "myCases",
        });
        const refreshData = refreshResponse.data;
        if (refreshData.status && refreshData.data && refreshData.data.cases) {
          const transformedCases = refreshData.data.cases.map((caseItem) => {
            const categoryName = caseItem.categories?.[0]?.name || caseItem.sub_categories?.[0]?.name || "Case";
            const jurisdictionNames = caseItem.jurisdictions?.map(j => j.name).join(", ") || "";
            
            return {
              id: caseItem.id,
              caseType: categoryName,
              caseId: `Case# ${caseItem.id}`,
              description: caseItem.description || "",
              jurisdiction: jurisdictionNames || "N/A",
              caseBudget: caseItem.case_budget ? `$${caseItem.case_budget}` : "$0",
              respond: caseItem.interests?.length || 0,
              rawData: caseItem,
            };
          });
          setCases(transformedCases);
          setPagination(refreshData.data.pagination);
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
    setNewCaseData(prev => ({ ...prev, attachments: files }));
  };

  // Cases are already filtered by API search, no need for client-side filtering

  return (
    <div className="container-fluid case-details--mukta-font">
      {/* Search and Filter Section */}
      <div className="row mb-4 bg-white px-4 py-5" style={{
              borderBottom: "1px solid #e6e6e6",
              borderTop: "1px solid #e6e6e6",
              marginTop: "30px",
            }} data-aos="fade-up">
        <div className="col-12 px-0">
          <div className="d-flex gap-3 align-items-center">
            {/* Search Bar */}
            <div className="position-relative flex-grow-1" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                className="form-control form-control-lg rounded-pill portal-form-hover"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "45px",
                  width: "483px",
                  height: "45px",
                  border: "1px solid #e9ecef",
                  backgroundColor: "#fff",
                }}
              />
              <i className="bi bi-search position-absolute top-50 translate-middle-y text-black fs-3 ms-4"></i>
            </div>

            {/* Filter Button
            <button
              className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2 portal-button-hover"
              style={{
                fontSize: "18px",
                fontWeight: "500",
                border: "1px solid #e9ecef",
                backgroundColor: "#f8f9fa",
                width: "121px",
                height: "58px",
                marginLeft: "80px",
              }}
            >
              <i className="bi bi-funnel"></i>
              Filter
            </button> */}

            {/* Add New Case Button */}
            <button
              className="btn btn-outline-dark rounded-pill px-4 py-2 d-flex justify-content-center align-items-center gap-2 portal-button-hover my-cases-add-button"
              style={{
                fontWeight: "500",
                marginLeft: "80px",
                border: "none",
              }}
              type="button"
              onClick={() => setShowCreateCase(true)}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#f8f9fa",
                }}
              >
                <i className="bi bi-plus text-black bg-white rounded-pill d-flex justify-content-center align-items-center pe-0"></i>
              </div>
              Add New Case
            </button>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="row" style={{ marginLeft: "30px", marginRight: "30px" }}>
        {loading ? (
          <div className="col-12 d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : cases.length === 0 ? (
          <div className="col-12 d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <h4 className="text-muted mb-2">No Cases Found</h4>
              <p className="text-muted">You don't have any cases yet.</p>
            </div>
          </div>
        ) : (
        cases.map((caseItem, index) => (
          <div key={caseItem.id} className="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay={`${100 + index * 100}`}>
            <div 
              className="card h-100 shadow-sm portal-card-hover" 
              style={{ 
                cursor: "pointer",
                height: "300px"
              }}
              onClick={() => navigate(`/my-cases/${caseItem.id}`)}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0 my-cases-card-title" style={{ fontSize: "16px", color: "#474747", fontWeight: "500" }}>
                    {caseItem.caseType}
                  </h5>
                  <span
                    className="badge bg-black text-white px-3 py-2 rounded-pill my-cases-card-badge"
                    style={{ fontSize: "12px", fontWeight: "500" }}
                  >
                    {caseItem.caseId}
                  </span>
                </div>
                
                <p className="mb-4 my-cases-card-description" style={{ fontSize: "14px", color: "#474747" }}>
                  {caseItem.description}
                </p>

                <div className="row text-center my-cases-card-details">
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <small className="mb-1 my-cases-card-label" style={{ fontSize: "14px", color: "#989898", fontWeight: "400" }}>Jurisdiction</small>
                      <span className="my-cases-card-value" style={{ color: "#474747", fontSize: "16px", fontWeight: "500" }}>{caseItem.jurisdiction}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <small className="mb-1 my-cases-card-label" style={{ fontSize: "14px", color: "#989898", fontWeight: "400" }}>Case Budget</small>
                      <span className="my-cases-card-value" style={{ color: "#474747", fontSize: "16px", fontWeight: "500" }}>{caseItem.caseBudget}</span>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="d-flex flex-column">
                      <small className="mb-1 my-cases-card-label" style={{ fontSize: "14px", color: "#989898", fontWeight: "400" }}>Respond</small>
                      <span className="my-cases-card-value" style={{ color: "#474747", fontSize: "16px", fontWeight: "500" }}>{caseItem.respond}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
        )}
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
            transition: "all 0.3s ease-out",
            borderRadius: "13px",
            margin: "20px",
            zIndex: 1045,
            transform: isClosing ? "translateX(100%)" : "translateX(0)",
            animation: isClosing ? "slideOutToRight 0.3s ease-in" : "slideInFromRight 0.3s ease-out",
            backgroundColor: "#fff",
          }}
        >
          <div className="offcanvas-header">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h3 className="mb-0 fw-bold">Create a Case</h3>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseCase}
              ></button>
            </div>
          </div>

          <form className="offcanvas-body p-0 d-flex flex-column" style={{ height: "100%" }} onSubmit={handleSubmitNewCase}>
            <div className="p-4 flex-grow-1" style={{ overflowY: "auto" }}>
              {/* Top Row Selects */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="position-relative">
                    <select
                      className="form-select"
                      value={newCaseData.jurisdiction}
                      onChange={(e) => handleNewCaseChange("jurisdiction", e.target.value)}
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
                      value={newCaseData.consultantType}
                      onChange={(e) => handleNewCaseChange("consultantType", e.target.value)}
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
                      value={newCaseData.category}
                      onChange={(e) => handleNewCaseChange("category", e.target.value)}
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
                      value={newCaseData.subCategory}
                      onChange={(e) => handleNewCaseChange("subCategory", e.target.value)}
                      disabled={!newCaseData.category || loadingDropdowns}
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
                  value={newCaseData.description}
                  onChange={(e) => handleNewCaseChange("description", e.target.value)}
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
                    value={newCaseData.caseBudget}
                    onChange={(e) => handleNewCaseChange("caseBudget", e.target.value)}
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
                    value={newCaseData.caseValue}
                    onChange={(e) => handleNewCaseChange("caseValue", e.target.value)}
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
                {newCaseData.attachments.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {newCaseData.attachments.length} file(s) selected
                    </small>
                  </div>
                )}
              </div>

              {/* Accept Terms */}
              <div className="form-check mb-4">
                <input className="form-check-input" type="checkbox" id="acceptTermsList" />
                <label className="form-check-label ms-2" htmlFor="acceptTermsList">
                  Accept all Privacy policy & Terms & conditions
                </label>
              </div>
            </div>

            {/* Submit Button - fixed at bottom */}
            <div className="p-4" style={{ backgroundColor: "#fff", borderRadius: "13px" }}>
              <button
                className="btn text-white rounded-pill w-100"
                type="submit"
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
          </form>
        </div>
      )}

      {/* Backdrop for Create Case */}
      {showCreateCase && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={handleCloseCase}
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

export default List;
