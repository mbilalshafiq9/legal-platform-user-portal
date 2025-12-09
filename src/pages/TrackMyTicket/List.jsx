import React, { useState, useEffect } from "react";
import "./track-my-ticket.css";

const TrackMyTicket = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Tickets");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Sample ticket data
  const tickets = [
    {
      id: 1,
      refNumber: "PR779120",
      issueType: "Other",
      date: "02 Dec 2025, 02:13 PM",
      status: "OPEN",
    },
    {
      id: 2,
      refNumber: "PR465836",
      issueType: "Other",
      date: "30 Nov 2025, 09:09 AM",
      status: "RESOLVED",
    },
  ];

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED").length;

  const getStatusBadgeClass = (status) => {
    if (status === "OPEN") {
      return "badge ticket-status-open";
    } else if (status === "RESOLVED") {
      return "badge ticket-status-resolved";
    }
    return "badge bg-secondary text-white";
  };

  const toggleDropdown = (ticketId) => {
    setOpenDropdownId(openDropdownId === ticketId ? null : ticketId);
  };

  const handleActionClick = (action, ticket) => {
    console.log(`Action: ${action} for ticket: ${ticket.refNumber}`);
    setOpenDropdownId(null);
    // Add your action handlers here
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-dropdown-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="track-ticket-container">
      <div className="container">
        {/* Summary Cards Section */}
        <div className="row mb-5">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="ticket-summary-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="ticket-summary-label text-muted mb-2">
                    Total Tickets
                  </h6>
                  <h3 className="ticket-summary-value mb-0">{totalTickets}</h3>
                </div>
                <div className="ticket-summary-icon">
                  <i className="bi bi-ticket-perforated"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <div className="ticket-summary-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="ticket-summary-label text-muted mb-2">Open</h6>
                  <h3 className="ticket-summary-value mb-0">{openTickets}</h3>
                </div>
                <div className="ticket-summary-icon">
                  <i className="bi bi-clock"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-4 mb-md-0">
            <div className="ticket-summary-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="ticket-summary-label text-muted mb-2">
                    Resolved
                  </h6>
                  <h3 className="ticket-summary-value mb-0">
                    {resolvedTickets}
                  </h3>
                </div>
                <div className="ticket-summary-icon">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Tickets Section */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2 className="ticket-section-title mb-0">All Tickets</h2>
                  <div className="d-flex align-items-center gap-3">
                    <div className="dropdown">
                      <button
                        className="btn btn-light dropdown-toggle"
                        type="button"
                        id="ticketFilterDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {selectedFilter}
                        {/* <i className="bi bi-chevron-down ms-2"></i> */}
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="ticketFilterDropdown"
                      >
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFilter("All Tickets");
                            }}
                          >
                            All Tickets
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFilter("Open");
                            }}
                          >
                            Open
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedFilter("Resolved");
                            }}
                          >
                            Resolved
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th className="text-muted fw-semibold text-uppercase fs-7">
                          Ref #
                        </th>
                        <th className="text-muted fw-semibold text-uppercase fs-7">
                          Issue type
                        </th>
                        <th className="text-muted fw-semibold text-uppercase fs-7">
                          Date
                        </th>
                        <th className="text-muted fw-semibold text-uppercase fs-7">
                          Status
                        </th>
                        <th className="text-muted fw-semibold text-uppercase fs-7">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="fw-semibold text-dark">
                            {ticket.refNumber}
                          </td>
                          <td className="text-dark">{ticket.issueType}</td>
                          <td className="text-dark">{ticket.date}</td>
                          <td>
                            <span
                              className={`${getStatusBadgeClass(
                                ticket.status
                              )} rounded-pill px-3 py-2`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-dropdown-container position-relative">
                              <button
                                className="btn btn-sm btn-light"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleDropdown(ticket.id);
                                }}
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "6px",
                                  padding: "4px 8px",
                                }}
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              {openDropdownId === ticket.id && (
                                <ul 
                                  className="dropdown-menu show"
                                  style={{
                                    position: "absolute",
                                    right: 0,
                                    top: "100%",
                                    marginTop: "4px",
                                    zIndex: 1000,
                                    minWidth: "160px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    border: "1px solid #e9ecef",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <li>
                                    <a 
                                      className="dropdown-item" 
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleActionClick("view", ticket);
                                      }}
                                    >
                                      <i className="bi bi-eye me-2"></i>
                                      View Details
                                    </a>
                                  </li>
                                  <li>
                                    <a 
                                      className="dropdown-item" 
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleActionClick("edit", ticket);
                                      }}
                                    >
                                      <i className="bi bi-pencil me-2"></i>
                                      Edit
                                    </a>
                                  </li>
                                  {ticket.status === "OPEN" && (
                                    <li>
                                      <a 
                                        className="dropdown-item" 
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleActionClick("close", ticket);
                                        }}
                                      >
                                        <i className="bi bi-check-circle me-2"></i>
                                        Close Ticket
                                      </a>
                                    </li>
                                  )}
                                  {ticket.status === "RESOLVED" && (
                                    <li>
                                      <a 
                                        className="dropdown-item" 
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleActionClick("reopen", ticket);
                                        }}
                                      >
                                        <i className="bi bi-arrow-counterclockwise me-2"></i>
                                        Reopen
                                      </a>
                                    </li>
                                  )}
                                  <li>
                                    <a 
                                      className="dropdown-item text-danger" 
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleActionClick("delete", ticket);
                                      }}
                                    >
                                      <i className="bi bi-trash me-2"></i>
                                      Delete
                                    </a>
                                  </li>
                                </ul>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackMyTicket;

