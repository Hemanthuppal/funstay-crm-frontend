import React, { useState, useMemo, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/Sales-ExecutiveNavbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaEye, FaComment, FaCalendarAlt, FaTimes, FaCopy } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import DataTable from "../../../Layout/Table/TableLayoutOpp";
import { baseURL } from "../../../Apiservices/Api";
import "./PotentialLeads.css";
import axios from "axios";
import { AuthContext } from "../../../AuthContext/AuthContext";

const Potentialleads = () => {
  const { authToken, userRole, userId } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPrimaryChanged, setIsPrimaryChanged] = useState(false);
  const [isSecondaryChanged, setIsSecondaryChanged] = useState(false);
  // const [dropdownOptions] = useState({
  //   primary: ["In Progress", "Confirmed", "Lost", "Duplicate", "Cancelled"],
  //   secondary: {
  //     "In Progress": [
  //       "Understood Requirement",
  //       "Sent first quote",
  //       "Sent amended quote",
  //       "Negotiation Process",
  //       "Verbally Confirmed-Awaiting token amount",
  //     ],
  //     Confirmed: ["Upcoming Trip", "Ongoing Trip", "Trip Completed"],
  //     Lost: [
  //       "Plan Cancelled",
  //       "Plan Postponed",
  //       "High Quote",
  //       "Low Budget",
  //       "No response",
  //       "Options not available",
  //       "just checking price",
  //       "Booked from other source",
  //       "Delay in quote",
  //       "Concern about reliability/trust",
  //       "Did not like payment terms",
  //       "Did not like cancellation policy",
  //       "Booked different option from us",
  //     ],
  //     Duplicate: ["Duplicate"],
  //     Cancelled: ["Force Majeure", "Medical Urgency", "Personal Reason"],
  //   },
  // });



  const [dropdownOptions] = useState({
    primary: ["In Progress", "Confirmed", "Lost", "Duplicate"],
    secondary: {
      "In Progress": [
        "Understood Requirement",
        "Sent first quote",
        "Amendment Requested",
        "Sent amended quote",
        "Negotiation Process",
        "Verbally Confirmed-Awaiting token amount",
      ],
      Confirmed: ["Upcoming Trip", "Ongoing Trip", "Trip Completed"],
      Lost: [
        "Plan Cancelled",
        "Plan Postponed",
        "High Quote",
        "Low Budget",
        "No response",
        "Options not available",
        "just checking price",
        "Booked from other source",
        "Delay in quote",
        "Concern about reliability/trust",
        "Did not like payment terms",
        "Did not like cancellation policy",
        "Booked different option from us",
      ],
      Duplicate: ["Duplicate"],

    },
  });


  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [filterOppStatus1, setFilterOppStatus1] = useState("");
  const [filterOppStatus2, setFilterOppStatus2] = useState("");

  // Date filter states for input and applied values
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState("");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.leadid == rowId
          ? { ...row, opportunity_status1: value, opportunity_status2: "" }
          : row
      );
      handleUpdateStatus(rowId, value, "");
      setIsPrimaryChanged(true);
      return updatedData;
    });
  };

  const handleSecondaryStatusChange = (value, rowId) => {
    setData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.leadid == rowId ? { ...row, opportunity_status2: value } : row
      );
      const primaryStatus = updatedData.find((row) => row.leadid == rowId)
        .opportunity_status1;
      handleUpdateStatus(rowId, primaryStatus, value);
      setIsSecondaryChanged(true);
      return updatedData;
    });
  };

  const handleUpdateStatus = async (leadId, primaryStatus, secondaryStatus) => {
    const body = {
      opportunity_status1: primaryStatus,
      opportunity_status2: secondaryStatus,
    };
    console.log(JSON.stringify(body, null, 2));
    try {
      const response = await axios.put(
        `${baseURL}/api/update-status/${leadId}`,
        body
      );
      if (response.status == 200) {
        let statusChangeMessage = "";
        if (primaryStatus && secondaryStatus) {
          statusChangeMessage = "Both statuses updated successfully!";
        } else if (primaryStatus) {
          statusChangeMessage = "Primary status updated successfully!";
        } else if (secondaryStatus) {
          statusChangeMessage = "Secondary status updated successfully!";
        }
        if (primaryStatus && secondaryStatus) {
          setMessage(statusChangeMessage);
          setTimeout(() => setMessage(""), 3000);
        }
        console.log("Status updated:", response.data);
      } else {
        console.error("Failed to update status:", response.data);
        setMessage("Failed to update status. Please try again.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setMessage("An error occurred while updating the status. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!"); // Optional: Show a message
      setTimeout(() => setMessage(""), 1000); // Clear message after 3 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const navigateToLead = (leadId) => {
    navigate(`/details/${leadId}`, {
      state: { leadid: leadId },
    });
  };

  const handleEdit = (leadId) => {
    navigate(`/edit-opportunity/${leadId}`, {
      state: { leadid: leadId },
    });
  };

  const [leadIds, setLeadIds] = useState([]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/fetch-data`);
      if (response.status == 200) {
        const leads = response.data;
        const filteredLeads = leads.filter(
          (enquiry) =>
            enquiry.assignedSalesId == userId && enquiry.status == "opportunity"
        );
        console.log("opportunity data :", filteredLeads);
        setData(filteredLeads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);

    }
  };

  useEffect(() => {
    if (data.length > 0) {
      const ids = data.map((lead) => lead.leadid);
      setLeadIds(ids);
      console.log("Lead IDs:", ids);
    }
  }, [data]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const [customerIdMap, setCustomerIdMap] = useState({});
  const opportunityIdRef = useRef(null);
  const [opportunityIdMap, setOpportunityIdMap] = useState({});

  const fetchCustomerData = async (leadid) => {
    try {
      const response = await axios.get(`${baseURL}/api/customers/by-lead/${leadid}`);
      if (response.status == 200) {
        const customerData = response.data;
        setCustomerIdMap((prev) => ({
          ...prev,
          [leadid]: {
            customerId: customerData.id || "N/A",
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const fetchOpportunityData = async () => {
    try {
      const response = await axios.get(`${baseURL}/travel-opportunity`);
      if (response.status == 200) {
        const mapping = response.data.reduce((acc, opportunity) => {
          acc[opportunity.leadid] = {
            opportunityId: opportunity.id || "N/A",
          };
          return acc;
        }, {});
        setOpportunityIdMap(mapping);
      }
    } catch (error) {
      console.error("Error fetching travel opportunities:", error);
    }
  };

  const formattedData = useMemo(() => {
    return data.map((item) => {
      const customerData = customerIdMap[item.leadid] || { customerId: "N/A" };
      const opportunityData = opportunityIdMap[item.leadid] || { opportunityId: "N/A" };
      return {
        ...item,
        formattedOppId:
          opportunityData.opportunityId !== "N/A"
            ? `OPP${String(opportunityData.opportunityId).padStart(4, "0")}`
            : "N/A",
        formattedCustomerId:
          customerData.customerId !== "N/A"
            ? `CUS${String(customerData.customerId).padStart(4, "0")}`
            : "N/A",
      };
    });
  }, [data, customerIdMap, opportunityIdMap]);



  // const uniqueDestinations = useMemo(() => {
  //   const destinations = formattedData
  //     .map((item) => item.travel_destination)
  //     .filter((dest) => dest && dest.trim() !== "");
  //   return Array.from(new Set(destinations));
  // }, [formattedData]);

  const uniqueDestinations = useMemo(() => {
    // Normalize the destinations by trimming spaces and converting to lowercase
    const normalizedDestinations = data.map(item => item.travel_destination.trim().toLowerCase());

    // Use a Set to get unique values, then convert back to the original format
    const uniqueNormalizedDestinations = [...new Set(normalizedDestinations)];

    // Map back to the original format (if needed)
    return uniqueNormalizedDestinations.map(dest => dest.charAt(0).toUpperCase() + dest.slice(1));
  }, [formattedData]);


  const staticOppStatus2Options = useMemo(() => {
    if (filterOppStatus1) {
      return dropdownOptions.secondary[filterOppStatus1] || [];
    }
    const allSecondary = Object.values(dropdownOptions.secondary).flat();
    return Array.from(new Set(allSecondary));
  }, [filterOppStatus1, dropdownOptions]);

  // Use appliedFilterStartDate and appliedFilterEndDate for filtering by date.
  const filteredData = useMemo(() => {
    return formattedData.filter((item) => {
      const matchesFreeText =
        !searchTerm ||
        Object.values(item).some(
          (val) =>
            val &&
            val
              .toString()
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        !filterStatus ||
        (item.status &&
          item.status.toLowerCase() == filterStatus.toLowerCase());
      const matchesDestination =
        !filterDestination ||
        (item.travel_destination &&
          item.travel_destination.toLowerCase() == filterDestination.toLowerCase());
      const matchesOppStatus1 =
        !filterOppStatus1 ||
        (item.opportunity_status1 &&
          item.opportunity_status1.toLowerCase() == filterOppStatus1.toLowerCase());
      const matchesOppStatus2 =
        !filterOppStatus2 ||
        (item.opportunity_status2 &&
          item.opportunity_status2.toLowerCase() == filterOppStatus2.toLowerCase());

      const matchesDateRange = (() => {
        if (appliedFilterStartDate && appliedFilterEndDate) {
          const start = new Date(appliedFilterStartDate);
          const end = new Date(appliedFilterEndDate);
          const createdAt = new Date(item.created_at);
          return createdAt >= start && createdAt <= end;
        } else if (appliedFilterStartDate) {
          const start = new Date(appliedFilterStartDate);
          const createdAt = new Date(item.created_at);
          return createdAt >= start;
        } else if (appliedFilterEndDate) {
          const end = new Date(appliedFilterEndDate);
          const createdAt = new Date(item.created_at);
          return createdAt <= end;
        }
        return true;
      })();

      return (
        matchesFreeText &&
        matchesStatus &&
        matchesDestination &&
        matchesOppStatus1 &&
        matchesOppStatus2 &&
        matchesDateRange
      );
    });
  }, [
    searchTerm,
    filterStatus,
    filterDestination,
    filterOppStatus1,
    filterOppStatus2,
    appliedFilterStartDate,
    appliedFilterEndDate,
    formattedData,
  ]);

  useEffect(() => {
    const leadIds = data.map((item) => item.leadid);
    leadIds.forEach((leadid) => {
      fetchCustomerData(leadid);
    });
    fetchOpportunityData();
  }, [data]);

  const columns = useMemo(
    () => [
      {
        Header: "Opp Id",
        accessor: "leadid",
      },
      // {
      //   Header: "Customer Id",
      //   accessor: "customerid",
      // },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div
            style={{
              cursor: "pointer",
              color: "blue",
              textDecoration: "underline",
            }}
            onClick={() => navigateToLead(row.original.leadid)}
          >
            {row.original.name}
          </div>
        ),
      },
      {
        Header: "Mobile",
        accessor: "phone_number",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <a
              href={`https://wa.me/${row.original.phone_number}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
              title="Chat on WhatsApp"
            >
              {row.original.phone_number}
            </a>
            <FaCopy
              style={{ marginLeft: "8px", cursor: "pointer", color: "#ff9966" }}
              onClick={() => copyToClipboard(row.original.phone_number)}
              title="Copy Phone Number"
            />
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Push copy button to the right
              width: "100%",
              maxWidth: "200px", // Adjust width as needed
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
              }}
              title={row.original.email} // Show full email on hover
            >
              {row.original.email}
            </div>
            <FaCopy
              style={{ cursor: "pointer", color: "#ff9966" }}
              onClick={() => copyToClipboard(row.original.email)}
              title="Copy Email"
            />
          </div>
        ),
      },
      {
        Header: "Opportunity Status",
        accessor: "opportunityStatus",
        Cell: ({ row }) => {
          const primaryStatus = row.original.opportunity_status1;
          const secondaryStatus = row.original.opportunity_status2;
          const secondaryOptions =
            dropdownOptions.secondary[primaryStatus] || [];
          const isSecondaryDisabled =
            !primaryStatus || secondaryOptions.length == 0;
          return (
            <div className="d-flex align-items-center gap-2">
              <select
                value={primaryStatus}
                onChange={(e) =>
                  handlePrimaryStatusChange(e.target.value, row.original.leadid)
                }
                className="form-select fixed-select opp-dropdown"
              >
                {!primaryStatus && (
                  <option value="">Select Primary Status</option>
                )}
                {dropdownOptions.primary.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={secondaryStatus}
                onChange={(e) =>
                  handleSecondaryStatusChange(e.target.value, row.original.leadid)
                }
                className="form-select fixed-select"
                disabled={isSecondaryDisabled}
              >
                {!secondaryStatus && (
                  <option value="">Select Secondary Status</option>
                )}
                {secondaryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        },
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaEdit
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => handleEdit(row.original.leadid)}
            />
            <FaEye
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => navigateToLead(row.original.leadid)}
            />
          </div>
        ),
      },
      {
        Header: "Comments",
        accessor: "comments",
        Cell: ({ row }) => (
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <FaComment
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => {
                navigate(`/opportunity-comments/${row.original.leadid}`);
              }}
            />
          </div>
        ),
      },
    ],
    [dropdownOptions]
  );

  return (
    <div className="salesOpportunitycontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesOpportunity ${collapsed ? "collapsed" : ""}`}>
        <div className="potentialleads-table-container">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center fixed">
              <h3>Opportunity Details</h3>
              {message && <div className="alert alert-info">{message}</div>}
            </Col>
          </Row>
          <div>
            {/* Free text search and calendar toggle */}
            <Row className="mb-3 align-items-center">
              <Col md={6} className="d-flex align-items-center gap-2">
                {/* Free text search input */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Free Text Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Calendar/X toggle */}
                {showDateRange ? (
                  <FaTimes
                  onClick={() => {
                    setShowDateRange(false);
                    setFilterStartDate("");
                    setFilterEndDate("");
                    setAppliedFilterStartDate("");
                    setAppliedFilterEndDate("");
                  }}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    title="Hide Date Range"
                  />
                ) : (
                  <FaCalendarAlt
                    onClick={() => setShowDateRange(true)}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    title="Show Date Range"
                  />
                )}

                {/* Date range inputs */}
                {showDateRange && (
                  <div className="d-flex align-items-center gap-2">
                    <input
                      type="date"
                      className="form-control"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="date"
                      className="form-control"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setAppliedFilterStartDate(filterStartDate);
                        setAppliedFilterEndDate(filterEndDate);
                      }}
                    >
                      OK
                    </button>
                  </div>
                )}
              </Col>
            </Row>

            {/* Other filters */}
            <Row className="mb-3">
              <Col md={3}>
                <select
                  className="form-select"
                  value={filterDestination}
                  onChange={(e) => setFilterDestination(e.target.value)}
                >
                  <option value="">Destinations</option>
                  {uniqueDestinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={3}>
                <select
                  className="form-select"
                  value={filterOppStatus1}
                  onChange={(e) => {
                    setFilterOppStatus1(e.target.value);
                    // Reset secondary filter when primary changes
                    setFilterOppStatus2("");
                  }}
                >
                  <option value="">Primary Status</option>
                  {dropdownOptions.primary.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={3}>
                <select
                  className="form-select"
                  value={filterOppStatus2}
                  onChange={(e) => setFilterOppStatus2(e.target.value)}
                >
                  <option value="">Secondary Status</option>
                  {staticOppStatus2Options.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Potentialleads;
