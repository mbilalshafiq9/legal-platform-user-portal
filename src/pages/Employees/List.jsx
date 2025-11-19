import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import notificationProfile from "../../assets/images/notification-profile.png";

const EmployeesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const navigate = useNavigate();

  // Sample employee data
  const employees = [
    {
      id: 1,
      name: "Shamra Joseph",
      location: "Dubai UAE",
      employeeId: "#26975PL",
      email: "shamara@joseph.com",
      phone: "+971 24 578 9472",
      role: "HR Management",
      profileImage: notificationProfile,
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      location: "Riyadh KSA",
      employeeId: "#26976PL",
      email: "ahmed@hassan.com",
      phone: "+966 50 123 4567",
      role: "Software Developer",
      profileImage: notificationProfile,
    },
    {
      id: 3,
      name: "Sarah Wilson",
      location: "London UK",
      employeeId: "#26977PL",
      email: "sarah@wilson.com",
      phone: "+44 20 1234 5678",
      role: "Project Manager",
      profileImage: notificationProfile,
    },
    {
      id: 4,
      name: "Mohammed Ali",
      location: "Cairo Egypt",
      employeeId: "#26978PL",
      email: "mohammed@ali.com",
      phone: "+20 10 1234 5678",
      role: "Designer",
      profileImage: notificationProfile,
    },
    {
      id: 5,
      name: "Emma Thompson",
      location: "New York USA",
      employeeId: "#26979PL",
      email: "emma@thompson.com",
      phone: "+1 555 123 4567",
      role: "Marketing Manager",
      profileImage: notificationProfile,
    },
    {
      id: 6,
      name: "Omar Khalil",
      location: "Beirut Lebanon",
      employeeId: "#26980PL",
      email: "omar@khalil.com",
      phone: "+961 70 123 456",
      role: "Sales Executive",
      profileImage: notificationProfile,
    },
  ];

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEmployeeClick = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  return (
    <div className="container-fluid employees--mukta-font">
      {/* Search and Filter Section */}
      <div
        className="row mb-4 bg-white px-4 py-5"
        style={{
          borderBottom: "0.1px solid #e6e6e6",
          borderTop: "0.1px solid #e6e6e6",
          marginTop: "30px",
          paddingLeft: "30px",
        }}
        data-aos="fade-up"
      >
        <div className="col-12">
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <div
              className="position-relative"
              style={{ flex: "1", minWidth: "200px", maxWidth: "500px" }}
            >
              <i
                className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                style={{ zIndex: 10 }}
              ></i>
              <input
                type="text"
                className="form-control py-3 portal-form-hover"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: "50px",
                  border: "1px solid #e0e0e0",
                  fontSize: "14px",
                  paddingLeft: "45px",
                }}
              />
            </div>

            {/* <button 
              className="btn btn-white px-4 py-3 d-flex align-items-center gap-2 employees-filter-button"
              style={{ 
                borderRadius: "50px",
                border: "1px solid #e0e0e0",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "#fff",
                color: "#000"
              }}
            >
              <i className="bi bi-sliders2"></i>
              Filter
            </button> */}

            <button
              className="btn btn-white px-4 py-3 d-flex align-items-center gap-2 employees-add-button"
              style={{
                borderRadius: "50px",
                border: "none",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "#ffffff",
                color: "#000000",
              }}
              onClick={() => setShowAddEmployee(true)}
            >
              <i className="bi bi-plus-circle-fill"></i>
              Add New Team
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-4 py-4">
        {/* Employees Grid */}
        <div className="row">
          {filteredEmployees.map((employee, index) => (
            <div
              key={employee.id}
              className="col-lg-4 col-md-6 mb-4"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div
                className="card h-100 portal-card-hover"
                style={{ borderRadius: "12px", cursor: "pointer" }}
                onClick={() => handleEmployeeClick(employee.id)}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start mb-3">
                    <div className="symbol symbol-60px me-3">
                      <img
                        src={employee.profileImage}
                        alt={employee.name}
                        className="rounded-circle"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="fw-bold text-dark mb-1">
                        {employee.name}
                      </h5>
                      <p className="text-gray-600 mb-0">{employee.location}</p>
                    </div>
                  </div>

                  <div className="employee-details">
                    {/* Default layout - 2 rows with 2 items each */}
                    <div className="employee-details-default">
                      <div className="row mb-2">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-person-fill text-dark me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-dark fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              {employee.employeeId}
                            </span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-envelope-fill text-dark me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-dark fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              {employee.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-telephone-fill text-dark me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-dark fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              {employee.phone}
                            </span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-gear-fill text-dark me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-dark fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              Role: {employee.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover layout - 2 rows with 2 items each */}
                    <div className="employee-details-hover">
                      <div className="row mb-2">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-person-fill text-white me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-white fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              {employee.employeeId}
                            </span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-envelope-fill text-white me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-white fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              {employee.email}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-telephone-fill text-white me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-white fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              {employee.phone}
                            </span>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center">
                            <i
                              className="bi bi-gear-fill text-white me-2"
                              style={{ width: "14px", fontSize: "12px" }}
                            ></i>
                            <span
                              className="text-white fw-semibold"
                              style={{ fontSize: "13px" }}
                            >
                              Role: {employee.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Employee Offcanvas */}
      <div
        className={`offcanvas offcanvas-end ${showAddEmployee ? "show" : ""}`}
        tabIndex="-1"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          visibility: showAddEmployee ? "visible" : "hidden",
          zIndex: 1045,
        }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">Add New Team</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowAddEmployee(false)}
          ></button>
        </div>
        <div
          className="offcanvas-body p-0 d-flex flex-column"
          style={{ height: "100%" }}
        >
          <div className="p-4 flex-grow-1" style={{ overflowY: "auto" }}>
            <form>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control portal-form-hover"
                  placeholder="Enter full name"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control portal-form-hover"
                  placeholder="Enter email address"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Phone</label>
                <input
                  type="tel"
                  className="form-control portal-form-hover"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Location</label>
                <input
                  type="text"
                  className="form-control portal-form-hover"
                  placeholder="Enter location"
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <select className="form-select portal-form-hover">
                  <option value="">Select role</option>
                  <option value="hr">HR Management</option>
                  <option value="developer">Software Developer</option>
                  <option value="manager">Project Manager</option>
                  <option value="designer">Designer</option>
                  <option value="marketing">Marketing Manager</option>
                  <option value="sales">Sales Executive</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Employee ID</label>
                <input
                  type="text"
                  className="form-control portal-form-hover"
                  placeholder="Enter employee ID"
                />
              </div>
            </form>
          </div>
          <div
            className="p-4 border-top"
            style={{
              backgroundColor: "#fff",
              borderBottomLeftRadius: "15px",
              borderBottomRightRadius: "15px",
            }}
          >
            <button
              className="btn text-white rounded-pill w-100 portal-button-hover"
              style={{
                height: "63px",
                fontSize: "20px",
                fontWeight: "500",
                backgroundColor: "#474747",
              }}
            >
              Add Employee
            </button>
          </div>
        </div>
      </div>
      {showAddEmployee && <div className="offcanvas-backdrop fade show"></div>}
    </div>
  );
};

export default EmployeesList;
