import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import notificationProfile from "../../assets/images/lawyerImg.png";
import lawyersImg from "../../assets/images/Lawyers.png";
import NoLawyer from "../../assets/images/NoLawyer.png";

// Import all profile images for slider
import profile1 from "../../assets/images/profiles/profile1.jpeg";
import profile2 from "../../assets/images/profiles/profile2.jpeg";
import profile3 from "../../assets/images/profiles/profile3.jpeg";
import profile4 from "../../assets/images/profiles/profile4.jpeg";
import profile5 from "../../assets/images/profiles/profile5.jpeg";
import profile6 from "../../assets/images/profiles/profile6.jpeg";
import profile7 from "../../assets/images/profiles/profile7.jpeg";
import profile8 from "../../assets/images/profiles/profile8.jpeg";
import profile9 from "../../assets/images/profiles/profile9.jpeg";
import profile10 from "../../assets/images/profiles/profile10.jpeg";
import profile11 from "../../assets/images/profiles/profile11.jpeg";
import profile12 from "../../assets/images/profiles/profile12.jpeg";
import profile13 from "../../assets/images/profiles/profile13.jpeg";
import profile14 from "../../assets/images/profiles/profile14.jpeg";
import profile15 from "../../assets/images/profiles/profile15.jpeg";

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

  const [selectedFilter, setSelectedFilter] = useState(
    loadFromLocalStorage("lawyers_selectedFilter", "Company")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    loadFromLocalStorage("lawyers_selectedCategory", "")
  );
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(
    loadFromLocalStorage("lawyers_selectedJurisdiction", "")
  );
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showJurisdictionDropdown, setShowJurisdictionDropdown] = useState(false);
  const [showLawyerDetail, setShowLawyerDetail] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [imageLoadingStates, setImageLoadingStates] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Profile images array for slider
  const profileImages = [
    profile1, profile2, profile3, profile4, profile5,
    profile6, profile7, profile8, profile9, profile10,
    profile11, profile12, profile13, profile14, profile15
  ];
  const pricingOptions = [
    { label: "$275 / One Time Service", value: "one-time" },
    { label: "$150 / Hourly Consultation", value: "hourly" },
  ];
  const [selectedPricingOption, setSelectedPricingOption] = useState("one-time");
  const [showPricingOptions, setShowPricingOptions] = useState(false);

  const currentPricingLabel =
    pricingOptions.find((option) => option.value === selectedPricingOption)
      ?.label || pricingOptions[0].label;

  const handleLawyerClick = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowLawyerDetail(true);
    setCurrentSlideIndex(0); // Reset slider to first image when opening
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % profileImages.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + profileImages.length) % profileImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleImageLoad = (imageId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: 'loaded'
    }));
  };

  const handleImageError = (imageId) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [imageId]: 'error'
    }));
  };

  // Default company lawyers data
  const defaultCompanyLawyers = [
    {
      id: 1,
      type: "Company",
      firmName: "Sofia Lawyer",
      rating: 4.5,
      location: "Dubai, United Arab Emirates",
      specialization: "Commercial Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Commercial Law",
      jurisdiction: "UAE",
      description: "Sophia grant is a distinguished attorney with over a decade of experience in providing comprehensive legal services to clients across various industries."
    },
    {
      id: 2,
      type: "Company",
      firmName: "Al-Rashid & Associates",
      rating: 4.8,
      location: "Abu Dhabi, UAE",
      specialization: "Corporate Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Corporate Law",
      jurisdiction: "UAE",
      description: "Premier corporate law firm with expertise in mergers, acquisitions, and corporate governance. Serving businesses of all sizes."
    },
    {
      id: 3,
      type: "Company",
      firmName: "Dubai Legal Partners",
      rating: 4.3,
      location: "Dubai, UAE",
      specialization: "Real Estate Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Real Estate Law",
      jurisdiction: "UAE",
      description: "Specialized real estate law firm handling property transactions and development projects throughout the UAE."
    },
    {
      id: 7,
      type: "Company",
      firmName: "Gulf Legal Solutions",
      rating: 4.6,
      location: "Sharjah, UAE",
      specialization: "Tax Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Tax Law",
      jurisdiction: "UAE",
      description: "Expert tax law firm providing comprehensive tax planning and compliance services for individuals and businesses."
    },
    {
      id: 8,
      type: "Company",
      firmName: "Arabian Legal Group",
      rating: 4.7,
      location: "Dubai, UAE",
      specialization: "Intellectual Property Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Intellectual Property Law",
      jurisdiction: "UAE",
      description: "Leading IP law firm specializing in patents, trademarks, copyrights, and trade secret protection."
    },
    {
      id: 9,
      type: "Company",
      firmName: "Emirates Corporate Law",
      rating: 4.4,
      location: "Abu Dhabi, UAE",
      specialization: "Employment Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Employment Law",
      jurisdiction: "UAE",
      description: "Dedicated employment law practice helping employers and employees navigate workplace legal matters."
    }
  ];

  // Default individual lawyers data
  const defaultIndividualLawyers = [
    {
      id: 4,
      type: "Individual",
      name: "Dr. Sarah Ahmed",
      title: "Senior Partner",
      rating: 4.9,
      location: "Dubai, UAE",
      specialization: "Criminal Defense + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Criminal Law",
      jurisdiction: "UAE",
      description: "Experienced criminal defense attorney with 15+ years of practice in UAE courts. Known for strategic defense and client advocacy."
    },
    {
      id: 5,
      type: "Individual",
      name: "Mohammed Al-Zahra",
      title: "Senior Associate",
      rating: 4.6,
      location: "Abu Dhabi, UAE",
      specialization: "Family Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Family Law",
      jurisdiction: "UAE",
      description: "Dedicated family law practitioner specializing in divorce, custody, and inheritance matters with a compassionate approach."
    },
    {
      id: 6,
      type: "Individual",
      name: "Emily Johnson",
      title: "Partner",
      rating: 4.7,
      location: "Dubai, UAE",
      specialization: "Immigration Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Immigration Law",
      jurisdiction: "UAE",
      description: "Expert immigration lawyer helping clients with visa applications and residency matters. Fluent in multiple languages."
    },
    {
      id: 10,
      type: "Individual",
      name: "Ahmed Hassan",
      title: "Senior Counsel",
      rating: 4.8,
      location: "Dubai, UAE",
      specialization: "Commercial Litigation + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Commercial Law",
      jurisdiction: "UAE",
      description: "Seasoned commercial litigator with extensive experience in complex business disputes and contract negotiations."
    },
    {
      id: 11,
      type: "Individual",
      name: "Fatima Al-Mansoori",
      title: "Principal Attorney",
      rating: 4.9,
      location: "Abu Dhabi, UAE",
      specialization: "Corporate Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Corporate Law",
      jurisdiction: "UAE",
      description: "Corporate law expert specializing in M&A transactions, corporate restructuring, and regulatory compliance."
    },
    {
      id: 12,
      type: "Individual",
      name: "James Wilson",
      title: "Partner",
      rating: 4.5,
      location: "Dubai, UAE",
      specialization: "Real Estate Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Real Estate Law",
      jurisdiction: "UAE",
      description: "Real estate attorney with deep knowledge of property law, development projects, and commercial leasing."
    },
    {
      id: 13,
      type: "Individual",
      name: "Layla Mohammed",
      title: "Senior Associate",
      rating: 4.7,
      location: "Sharjah, UAE",
      specialization: "Tax Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Tax Law",
      jurisdiction: "UAE",
      description: "Tax law specialist providing strategic tax planning and dispute resolution services for high-net-worth individuals."
    },
    {
      id: 14,
      type: "Individual",
      name: "Robert Chen",
      title: "Counsel",
      rating: 4.6,
      location: "Dubai, UAE",
      specialization: "Intellectual Property Law + Jurisdiction: UAE+",
      image: lawyersImg,
      category: "Intellectual Property Law",
      jurisdiction: "UAE",
      description: "IP attorney with expertise in patent prosecution, trademark registration, and IP litigation across various industries."
    }
  ];

  // Load lawyers from localStorage or use defaults
  const [companyLawyers, setCompanyLawyers] = useState(
    loadFromLocalStorage("lawyers_companyLawyers", defaultCompanyLawyers)
  );

  const [individualLawyers, setIndividualLawyers] = useState(
    loadFromLocalStorage("lawyers_individualLawyers", defaultIndividualLawyers)
  );

  const categories = ["Commercial Law", "Corporate Law", "Criminal Law", "Family Law", "Real Estate Law", "Immigration Law", "Tax Law"];
  const jurisdictions = ["UAE", "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman"];

  const filters = ["Company", "Individual", "Categories", "Jurisdiction"];

  // Get current data based on selected filter
  const getCurrentData = () => {
    let data = [];
    
    if (selectedFilter === "Company") {
      data = companyLawyers;
    } else if (selectedFilter === "Individual") {
      data = individualLawyers;
    } else if (selectedFilter === "Categories") {
      // Show all lawyers from both company and individual, filtered by category
      data = [...companyLawyers, ...individualLawyers];
      if (selectedCategory) {
        data = data.filter(lawyer => lawyer.category === selectedCategory);
      }
    } else if (selectedFilter === "Jurisdiction") {
      // Show all lawyers from both company and individual, filtered by jurisdiction
      data = [...companyLawyers, ...individualLawyers];
      if (selectedJurisdiction) {
        data = data.filter(lawyer => lawyer.jurisdiction === selectedJurisdiction);
      }
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(lawyer => {
        const searchableText = selectedFilter === "Individual" 
          ? `${lawyer.name} ${lawyer.title} ${lawyer.specialization} ${lawyer.location}`
          : `${lawyer.firmName} ${lawyer.specialization} ${lawyer.location}`;
        return searchableText.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    return data;
  };

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("lawyers_selectedFilter", JSON.stringify(selectedFilter));
      localStorage.setItem("lawyers_selectedCategory", JSON.stringify(selectedCategory));
      localStorage.setItem("lawyers_selectedJurisdiction", JSON.stringify(selectedJurisdiction));
      localStorage.setItem("lawyers_companyLawyers", JSON.stringify(companyLawyers));
      localStorage.setItem("lawyers_individualLawyers", JSON.stringify(individualLawyers));
    } catch (error) {
      console.error("Error saving lawyers data to localStorage:", error);
    }
  }, [selectedFilter, selectedCategory, selectedJurisdiction, companyLawyers, individualLawyers]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    if (filter !== "Categories") {
      setSelectedCategory("");
    }
    if (filter !== "Jurisdiction") {
      setSelectedJurisdiction("");
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleJurisdictionSelect = (jurisdiction) => {
    setSelectedJurisdiction(jurisdiction);
    setShowJurisdictionDropdown(false);
  };

  // Preload images for better performance
  useEffect(() => {
    const preloadImages = () => {
      const imagesToPreload = [lawyersImg, notificationProfile];
      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };
    
    preloadImages();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.position-relative')) {
        setShowCategoryDropdown(false);
        setShowJurisdictionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="container-fluid">
      {/* Search and Filter Section */}
      <div className="row mb-4" data-aos="fade-up">
        <div className="col-12 px-0">
          {/* Search Bar */}
          <div
            className="d-flex justify-content-center mb-4 bg-white lawyers-list-header-bar"
            style={{
              borderBottom: "0.1px solid #e6e6e6",
              borderTop: "0.1px solid #e6e6e6",
              marginTop: "28px"
            }}
          >
            <div
              className="position-relative my-5"
              style={{ width: "100%", maxWidth: "1096px" }}
            >
              <input
                type="text"
                className="form-control form-control-lg portal-form-hover"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  paddingLeft: "50px",
                  paddingRight: "20px",
                  height: "50px",
                  border: "1px solid #e9ecef",
                  backgroundColor: "#ffffff",
                  borderRadius: "25px",
                  fontSize: "1rem",
                  boxShadow: "none",
                }}
              />
              <i
                className="bi bi-search position-absolute top-50 translate-middle-y text-muted fs-5"
                style={{ left: "20px" }}
              ></i>
            </div>
          </div>
        </div>
         {/* Filter Buttons */}
         <div className="d-flex justify-content-start gap-3 flex-wrap lawyers-filter-tabs">
           {filters.map((filter) => (
             <div key={filter} className="position-relative">
               {filter === "Categories" ? (
                 <div className="position-relative">
                   <button
                     className={`btn px-4 py-2 portal-button-hover ${
                       selectedFilter === filter
                         ? "bg-black text-white"
                         : "bg-white text-black"
                     }`}
                     onClick={() => {
                       handleFilterClick(filter);
                       setShowCategoryDropdown(!showCategoryDropdown);
                       setShowJurisdictionDropdown(false);
                     }}
                     style={{
                       fontSize: "0.9rem",
                       fontWeight: "500",
                       borderRadius: "25px",
                       border: selectedFilter === filter ? "none" : "1px solid #e9ecef",
                       minWidth: "120px",
                       height: "40px",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       gap: "8px",
                     }}
                   >
                     {selectedCategory || filter}
                     <i className="bi bi-chevron-down" style={{ fontSize: "0.8rem" }}></i>
                   </button>
                   
                   {showCategoryDropdown && (
                     <div className="position-absolute top-100 start-0 mt-1 bg-white border rounded shadow-lg lawyers-filter-dropdown" style={{ zIndex: 1000, minWidth: "200px" }}>
                       {categories.map((category) => (
                         <button
                           key={category}
                           className="btn btn-light w-100 text-start px-3 py-2 border-0 lawyers-filter-dropdown-item"
                           onClick={() => handleCategorySelect(category)}
                           style={{ fontSize: "0.9rem" }}
                         >
                           {category}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
               ) : filter === "Jurisdiction" ? (
                 <div className="position-relative">
                   <button
                     className={`btn px-4 py-2 portal-button-hover ${
                       selectedFilter === filter
                         ? "bg-black text-white"
                         : "bg-white text-black"
                     }`}
                     onClick={() => {
                       handleFilterClick(filter);
                       setShowJurisdictionDropdown(!showJurisdictionDropdown);
                       setShowCategoryDropdown(false);
                     }}
                     style={{
                       fontSize: "0.9rem",
                       fontWeight: "500",
                       borderRadius: "25px",
                       border: selectedFilter === filter ? "none" : "1px solid #e9ecef",
                       minWidth: "120px",
                       height: "40px",
                       display: "flex",
                       alignItems: "center",
                       justifyContent: "center",
                       gap: "8px",
                     }}
                   >
                     {selectedJurisdiction || filter}
                     <i className="bi bi-chevron-down" style={{ fontSize: "0.8rem" }}></i>
                   </button>
                   
                   {showJurisdictionDropdown && (
                     <div className="position-absolute top-100 start-0 mt-1 bg-white border rounded shadow-lg lawyers-filter-dropdown" style={{ zIndex: 1000, minWidth: "200px" }}>
                       {jurisdictions.map((jurisdiction) => (
                         <button
                           key={jurisdiction}
                           className="btn btn-light w-100 text-start px-3 py-2 border-0 lawyers-filter-dropdown-item"
                           onClick={() => handleJurisdictionSelect(jurisdiction)}
                           style={{ fontSize: "0.9rem" }}
                         >
                           {jurisdiction}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
               ) : (
                 <button
                   className={`btn px-4 py-2 ${
                     selectedFilter === filter
                       ? "bg-black text-white"
                       : "bg-white text-black"
                   }`}
                   onClick={() => handleFilterClick(filter)}
                   style={{
                     fontSize: "0.9rem",
                     fontWeight: "500",
                     borderRadius: "25px",
                     border: selectedFilter === filter ? "none" : "1px solid #e9ecef",
                     minWidth: "120px",
                     height: "40px",
                     display: "flex",
                     alignItems: "center",
                     justifyContent: "center",
                     gap: "8px",
                   }}
                 >
                   {filter}
                 </button>
               )}
             </div>
           ))}
         </div>
      </div>

      {/* Lawyers Grid */}
      <div className="row">
        {getCurrentData().length === 0 ? (
          <div className="col-12 d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
            <div className="text-center p-5">
              <div className="mb-4">
                <img src={NoLawyer} alt="No Lawyer" style={{ maxWidth: "200px", height: "auto" }} />
              </div>
              <h4 className="text-muted mb-2 fw-bold">No Lawyers Hired</h4>
              <p className="text-muted mb-0">
                You haven't hired any lawyers yet.
              </p>
            </div>
          </div>
        ) : (
          getCurrentData().map((lawyer, index) => (
          <div key={lawyer.id} className="col-lg-4 col-md-6 mb-4" data-aos="fade-up" data-aos-delay={`${100 + index * 100}`}>
            <div
              className="card h-100 shadow-sm portal-card-hover"
              style={{
                borderRadius: "15px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer"
              }}
              onClick={() => handleLawyerClick(lawyer)}
            >
              <div
                className="card-img-top position-relative"
                style={{
                  borderTopRightRadius: "15px",
                  borderTopLeftRadius: "15px",
                  overflow: "hidden"
                }}
              >
                <img
                  src={lawyer.image}
                  className="card-img-top"
                  alt={lawyer.type === "Individual" ? lawyer.name : lawyer.firmName}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => handleImageLoad(`lawyer-${lawyer.id}`)}
                  onError={() => handleImageError(`lawyer-${lawyer.id}`)}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    width: "100%",
                    borderTopRightRadius: "15px",
                    borderTopLeftRadius: "15px",
                    backgroundColor: "#f8f9fa"
                  }}
                />
              </div>
              <div className="card-body p-4">
                {lawyer.type === "Individual" ? (
                  <>
                    <h5 className="card-title fw-bold text-dark mb-2" style={{ fontSize: "1.1rem", lineHeight: "1.3" }}>
                      {lawyer.name}
                    </h5>
                    <p className="text-muted mb-3" style={{ fontSize: "0.9rem", fontWeight: "500" }}>{lawyer.title}</p>
                    <div className="d-flex align-items-center justify-content-start mb-3">
                      <div className="d-flex align-items-center me-5">
                        <i className="bi bi-star-fill text-dark me-1" style={{ fontSize: "0.9rem" }}></i>
                        <span className="fw-bold text-dark lawyers-rating-hover" style={{ fontSize: "0.9rem" }}>
                          {lawyer.rating}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-geo-alt-fill text-muted me-1" style={{ fontSize: "0.8rem" }}></i>
                        <span className="text-muted" style={{ fontSize: "1rem" }}>{lawyer.location}</span>
                      </div>
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>{lawyer.specialization}</p>
                  </>
                ) : (
                  <>
                    <h5 className="card-title fw-bold text-dark mb-2" style={{ fontSize: "1.6rem", lineHeight: "1.3" }}>
                      {lawyer.firmName}
                    </h5>
                    <div className="d-flex align-items-center justify-content-start mb-3">
                      <div className="d-flex align-items-center me-5">
                        <i className="bi bi-star-fill text-dark me-1" style={{ fontSize: "0.9rem" }}></i>
                        <span className="fw-bold text-dark lawyers-rating-hover" style={{ fontSize: "0.9rem" }}>
                          {lawyer.rating}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-geo-alt-fill text-muted me-1" style={{ fontSize: "0.8rem" }}></i>
                        <span className="text-muted" style={{ fontSize: "0.85rem" }}>{lawyer.location}</span>
                      </div>
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: "0.8rem", lineHeight: "1.4" }}>{lawyer.specialization}</p>
                  </>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Lawyer Detail Offcanvas */}
      {showLawyerDetail && selectedLawyer && (
        <div
          className="offcanvas offcanvas-end show"
          tabIndex="-1"
          style={{ position: "fixed" }}
        >
          <div
            className="position-absolute top-0 start-0 m-3"
            style={{ zIndex: 1100 }}
          >
            <button
              type="button"
              className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center lawyer-detail-close-btn"
              style={{ width: "30px", height: "33px" }}
              onClick={() => setShowLawyerDetail(false)}
              aria-label="Close lawyer details"
            >
              <i className="bi bi-x-lg fs-5 pe-0"></i>
            </button>
          </div>
          <div
            className="position-absolute top-0 end-0 m-3"
            style={{ zIndex: 1100 }}
          >
            <button
              type="button"
              className="btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center lawyer-detail-close-btn"
              style={{ width: "30px", height: "33px" }}
              onClick={() => setShowLawyerDetail(false)}
              aria-label="Close lawyer details"
            >
              <i className="bi bi-upload fs-5 pe-0"></i>
            </button>
          </div>
          {/* <div className="offcanvas-header p-3 p-md-4">
            <div className="d-flex justify-content-between align-items-center w-100">
              <h5 className="mb-0 fw-bold fs-5 fs-md-4">Lawyer Detail</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowLawyerDetail(false)}
              ></button>
            </div>
          </div> */}

          <div className="offcanvas-body p-0 d-flex flex-column" style={{ height: "100%" }}>
            <div className="p-0 flex-grow-1" style={{ overflowY: "auto" }}>
              {/* Image Slider */}
              <div className="mb-4 position-relative" style={{ height: "390px" }}>
                {/* Slider Container */}
                <div
                  className="position-relative w-100 h-100"
                  style={{ 
                    overflow: "hidden",
                    borderTopRightRadius: "15px",
                    borderTopLeftRadius: "15px",
                    backgroundColor: "#f8f9fa"
                  }}
                >
                  {/* Images */}
                  {profileImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Profile ${index + 1}`}
                      className="w-100 h-100"
                      loading="lazy"
                      decoding="async"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        opacity: index === currentSlideIndex ? 1 : 0,
                        transition: "opacity 0.5s ease-in-out",
                        borderTopRightRadius: "15px",
                        borderTopLeftRadius: "15px",
                      }}
                    />
                  ))}

                  {/* Navigation Arrows */}
                  <button
                    type="button"
                    className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3 shadow-sm"
                    style={{
                      width: "20px",
                      height: "33px",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}
                    onClick={prevSlide}
                    aria-label="Previous image"
                  >
                    <i className="bi bi-chevron-left pe-1" style={{ fontSize: "1rem" }}></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-3 shadow-sm"
                    style={{
                      width: "20px",
                      height: "33px",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                    }}
                    onClick={nextSlide}
                    aria-label="Next image"
                  >
                    <i className="bi bi-chevron-right pe-0" style={{ fontSize: "1rem" }}></i>
                  </button>

                  {/* Dots Indicator */}
                  <div
                    className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
                    style={{ zIndex: 10 }}
                  >
                    <div className="d-flex gap-2">
                      {profileImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn p-0 border-0"
                          onClick={() => goToSlide(index)}
                          style={{
                            width: index === currentSlideIndex ? "24px" : "8px",
                            height: "8px",
                            borderRadius: "4px",
                            backgroundColor: index === currentSlideIndex ? "#ffffff" : "rgba(255, 255, 255, 0.5)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              {/* <div className="d-flex gap-2 mb-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="rounded"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef"
                    }}
                  >
                    <img 
                      src={notificationProfile} 
                      className="w-100 h-100" 
                      alt="Lawyer profile thumbnail"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div> */}

              {/* Location */}
              <div className="mb-2 px-3">
                <small className="text-muted fs-3">{selectedLawyer.location}</small>
              </div>

              {/* Name and Rating */}
              <div className="d-flex justify-content-between align-items-center mb-3 px-3 lawyer-card-title">
                <h1 className="fw-bold text-dark mb-0">
                  {selectedLawyer.type === "Individual" ? selectedLawyer.name : selectedLawyer.firmName}
                </h1>
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2">
                    {selectedLawyer.type === "Individual" ? selectedLawyer.title : "Commercial Lawyer"}
                  </span>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill text-dark me-1"></i>
                    <span className="fw-bold">{selectedLawyer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted mb-4 px-3" style={{ lineHeight: "1.6" }}>
                {selectedLawyer.description || "Experienced legal professional with expertise in various areas of law. Committed to providing high-quality legal services and achieving the best outcomes for clients."}
              </p>
              <div className="px-3">
                <h2>Jurisdiction</h2>
                <p className="text-muted">UAE Jurisdiction</p>
              </div>

              <div className="px-3">
                <h2>Expertise</h2>
                <p className="text-muted">Criminal Law, Environment Law, Human rights l...</p>
              </div>

              {/* Services */}
              <div className="mb-4 px-3">
                <h6 className="fw-bold text-dark mb-3">Services</h6>
                <div className="d-flex flex-column gap-2">
                  {[
                    "Legal consultation and advice",
                    "Document preparation and review",
                    "Court representation",
                    "Contract negotiation"
                  ].map((service, index) => (
                    <div key={index} className="d-flex align-items-center">
                      <i className="bi bi-check-circle-fill text-black me-2"></i>
                      <span className="text-muted">{service}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-4 px-3">
                <h6 className="fw-bold text-dark mb-3">Reviews</h6>
                
                {/* Overall Rating */}
                <div className="d-flex align-items-center mb-3">
                  <div className="d-flex me-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className="bi bi-star-fill text-dark"></i>
                    ))}
                  </div>
                  <span className="fw-bold me-2">5 out of 5</span>
                  <span className="text-muted">41 total review</span>
                </div>

                {/* Rating Breakdown */}
                <div className="mb-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="d-flex align-items-center mb-2">
                      <span className="text-muted me-2" style={{ minWidth: "20px" }}>{rating} star</span>
                      
                      <div className="flex-grow-1 me-2">
                        <div
                          className="bg-dark"
                          style={{
                            height: "8px",
                            width: rating === 5 ? "100%" : rating === 4 ? "75%" : rating === 3 ? "50%" : rating === 2 ? "25%" : "0%",
                            borderRadius: "4px"
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Individual Reviews */}
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-start">
                    <img
                      src={notificationProfile}
                      alt="Reviewer"
                      className="rounded-circle me-3"
                      loading="lazy"
                      decoding="async"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold">Mark Jorden</span>
                        <small className="text-muted">2 hour ago</small>
                      </div>
                      <div className="d-flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className="bi bi-star-fill" style={{ fontSize: "0.9rem", color: "#000" }}></i>
                        ))}
                      </div>
                      <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                        Excellent service and professional approach. Highly recommended!
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <img
                      src={notificationProfile}
                      alt="Reviewer"
                      className="rounded-circle me-3"
                      loading="lazy"
                      decoding="async"
                      style={{ width: "40px", height: "40px" }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold">Shamra Joseph</span>
                        <small className="text-muted">2 hour ago</small>
                      </div>
                      <div className="d-flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className="bi bi-star-fill" style={{ fontSize: "0.9rem", color: "#000" }}></i>
                        ))}
                      </div>
                      <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                        Great experience working with this lawyer. Very knowledgeable and helpful.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing and Action Section - Fixed at bottom */}
            <div className="p-4" style={{ backgroundColor: "#000", borderBottomRightRadius: "15px", borderBottomLeftRadius: "15px" }}>
              {/* Pricing and Dropdown in Same Row */}
              <div className="d-flex align-items-center justify-content-between mb-4 p-3 rounded" style={{ backgroundColor: "#000" }}>
                <p className="text-white fw-bold mb-0" style={{ fontSize: "1.5rem" }}>
                  {currentPricingLabel}
                </p>
                <button
                  onClick={() => setShowPricingOptions(!showPricingOptions)}
                  className="btn d-flex align-items-center gap-2 text-white"
                  style={{
                    backgroundColor: "#000",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    padding: "8px 16px"
                  }}
                >
                  <span>2 options</span>
                  <i className={`bi bi-chevron-${showPricingOptions ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {/* Expanded Pricing Options */}
              {showPricingOptions && (
                <div className="mb-4" style={{ transition: "all 0.3s ease" }}>
                  {pricingOptions.map((option, index) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        setSelectedPricingOption(option.value);
                        setShowPricingOptions(false);
                      }}
                      className="d-flex align-items-center p-3 mb-2 rounded"
                    style={{
                        backgroundColor: selectedPricingOption === option.value ? "#007bff" : "#ffffff",
                        border: selectedPricingOption === option.value ? "none" : "1px solid #e0e0e0",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: selectedPricingOption === option.value ? "#ffffff" : "transparent",
                          border: selectedPricingOption === option.value ? "none" : "2px solid #ccc"
                        }}
                      >
                        {selectedPricingOption === option.value && (
                          <i className="bi bi-check" style={{ fontSize: "14px", fontWeight: "bold", color: "#007bff" }}></i>
                        )}
                      </div>
                      <span
                        style={{
                          color: selectedPricingOption === option.value ? "#ffffff" : "#000000",
                          fontWeight: selectedPricingOption === option.value ? "500" : "400"
                        }}
                      >
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center">
                <button
                  className="btn d-flex align-items-center justify-content-center rounded-pill"
                  style={{ 
                    height: "50px", 
                    width: "180px", 
                    backgroundColor: "#474747",
                    border: "none",
                    color: "#ffffff"
                  }}
                >
                  <i className="bi bi-apple me-2 text-white" style={{ fontSize: "1.2rem" }}></i>
                  <span>Apple</span>
                </button>
                <button
                  className="btn rounded-pill fw-bold"
                  style={{ 
                    height: "50px", 
                    width: "190px",
                    backgroundColor: "#808080", 
                    color: "#ffffff",
                    border: "none",
                    fontSize: "1rem"
                  }}
                >
                  Get Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for Lawyer Detail */}
      {showLawyerDetail && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setShowLawyerDetail(false)}
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
