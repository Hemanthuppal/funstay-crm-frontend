import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../../Shared/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaDownload, FaEye, FaComment, FaTrash, FaCalendarAlt, FaTimes, FaCopy } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import DataTable from "../../../../Layout/Table/TableLayoutOpp";
import { baseURL } from "../../../../Apiservices/Api";
import "./Myopp.css";
import axios from "axios";
import { AuthContext } from "../../../../AuthContext/AuthContext";
import { ThemeContext } from "../../../../Shared/Themes/ThemeContext";
import { FontSizeContext } from "../../../../Shared/Font/FontContext";
import * as XLSX from 'xlsx';


const Potentialleads = () => {
  const { authToken, userId } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { themeColor } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm-op1") || "");
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem("filterStatus-op1") || "");
  const [filterDestination, setFilterDestination] = useState(localStorage.getItem("filterDestination-op1") || "");
  const [filterOppStatus1, setFilterOppStatus1] = useState(localStorage.getItem("filterOppStatus1-op1") || "In Progress");
  const [filterOppStatus2, setFilterOppStatus2] = useState(localStorage.getItem("filterOppStatus2-op1") || "");
  const [filterManager, setFilterManager] = useState(localStorage.getItem("filterManager-op1") || "");
  const [filterAssignee, setFilterAssignee] = useState(localStorage.getItem("filterAssignee-op1") || "");
  const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem("filterStartDate-op1") || "");
  const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem("filterEndDate-op1") || "");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState(localStorage.getItem("appliedFilterStartDate-op1") || "");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState(localStorage.getItem("appliedFilterEndDate-op1") || "");
  // const [showDateRange, setShowDateRange] = useState(false);
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState([]);

        const [showDateRange, setShowDateRange] = useState(
          localStorage.getItem("showDateRange-op1") === "true"
        );
        
        // Save state to localStorage when values change
        useEffect(() => {
          localStorage.setItem("showDateRange-op1", showDateRange);
        }, [showDateRange]);
      

  
    const downloadExcel = () => {
      if (!filteredData || filteredData.length === 0) {
        alert("No data available to export.");
        return;
      }
  
      // Define the fields to export
      const fields = [
        { key: "leadid", label: "LEAD ID", width: 15 },
        { key: "name", label: "NAME", width: 20 },
        { key: "email", label: "EMAIL", width: 25 },
        { key: "country_code", label: "COUNTRY CODE", width: 10 },
        { key: "phone_number", label: "PHONE NUMBER", width: 15 },
        { key: "sources", label: "SOURCES", width: 20 },
        { key: "another_name", label: "ANOTHER NAME", width: 20 },
        { key: "another_email", label: "ANOTHER EMAIL", width: 25 },
        { key: "another_phone_number", label: "ANOTHER PHONE NUMBER", width: 15 },
        //  { key: "description", label: "DESCRIPTION", width: 30 },
        //  { key: "origincity", label: "ORIGIN CITY", width: 15 },
        //  { key: "destination", label: "DESTINATION", width: 15 },
        //  { key: "created_at", label: "CREATED AT", width: 20 },
        { key: "primarySource", label: "PRIMARY SOURCE", width: 20 },
        { key: "secondarysource", label: "SECONDARY SOURCE", width: 20 },
        { key: "channel", label: "CHANNEL", width: 15 },
        { key: "travel_origincity", label: "ORIGIN CITY", width: 15 },
        { key: "travel_destination", label: "DESTINATION", width: 15 },
        { key: "travel_created_at", label: "CREATED AT", width: 20 },
        { key: "start_date", label: "START DATE", width: 20 },
        { key: "end_date", label: "END DATE", width: 20 },
        { key: "duration", label: "DURATION", width: 15 },
        { key: "adults_count", label: "ADULTS COUNT", width: 15 },
        { key: "children_count", label: "CHILDREN COUNT", width: 15 },
        { key: "child_ages", label: "CHILD AGES", width: 20 },
        { key: "approx_budget", label: "BUDGET", width: 15 },
        { key: "travel_description", label: "DESCRIPTION", width: 20 },
      ];
  
      // Transform the data to only include specified fields
      const exportData = filteredData.map(row => {
        let newRow = {};
        fields.forEach(field => {
          newRow[field.label] = row[field.key] || ""; // Use field label as header
        });
        return newRow;
      });
  
      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);
  
      // Apply column widths
      ws["!cols"] = fields.map(field => ({ width: field.width }));
  
      // Append sheet and save file
      XLSX.utils.book_append_sheet(wb, ws, "Filtered Opportunities");
      const fileName = `Filtered_Opportunities_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
    };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });


  };
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/fetch-data`);
      if (response.status == 200) {
        const filteredLeads = response.data.filter((enquiry) => enquiry.adminAssign == 'admin' && enquiry.status == "opportunity");
        setData(filteredLeads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${baseURL}/employees/managers`);
      setManagers(response.data.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchManagers();
  }, [userId]);

  const dropdownOptions = {
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
  };

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.leadid == rowId
          ? { ...row, opportunity_status1: value, opportunity_status2: "" }
          : row
      );
      handleUpdateStatus(rowId, value, "");
      return updatedData;
    });
  };

  const handleSecondaryStatusChange = (value, rowId) => {
    setData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.leadid == rowId ? { ...row, opportunity_status2: value } : row
      );
      const primaryStatus = updatedData.find((row) => row.leadid == rowId).opportunity_status1;
      handleUpdateStatus(rowId, primaryStatus, value);
      return updatedData;
    });
  };

  const handleUpdateStatus = async (leadId, primaryStatus, secondaryStatus) => {
    const body = {
      opportunity_status1: primaryStatus,
      opportunity_status2: secondaryStatus,
    };
    try {
      const response = await axios.put(`${baseURL}/api/update-status/${leadId}`, body);
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

  const handleEdit = (rowId) => {
    navigate(`/a-myedit-opportunity/${rowId}`, { state: { leadid: rowId } });
  };




  const handleArchive = async (leadid) => {
    const confirmDelete = window.confirm("Are you sure you want to archive this Opportunity?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${baseURL}/api/opportunity/archive/${leadid}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid)); // Remove from active list
        setMessage('Opportunity has been archived successfully.');
      } else {
        console.error('Error archiving record');
        setMessage('Failed to archive the opportunity. Please try again.');
      }
      setTimeout(() => {
        setMessage('');
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while archiving the opportunity.');
      setTimeout(() => {
        setMessage('');
      }, 1000);
    }
  };



  useEffect(() => {
    localStorage.setItem("searchTerm-op1", searchTerm);
    localStorage.setItem("filterStatus-op1", filterStatus);
    localStorage.setItem("filterDestination-op1", filterDestination);
    localStorage.setItem("filterOppStatus1-op1", filterOppStatus1);
    localStorage.setItem("filterOppStatus2-op1", filterOppStatus2);
    localStorage.setItem("filterManager-op1", filterManager);
    localStorage.setItem("filterAssignee-op1", filterAssignee);
    localStorage.setItem("filterStartDate-op1", filterStartDate);
    localStorage.setItem("filterEndDate-op1", filterEndDate);
    localStorage.setItem("appliedFilterStartDate-op1", appliedFilterStartDate);
    localStorage.setItem("appliedFilterEndDate-op1", appliedFilterEndDate);
  }, [
    searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2,
    filterManager, filterAssignee, filterStartDate, filterEndDate,
    appliedFilterStartDate, appliedFilterEndDate
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDestination("");
    setFilterOppStatus1("In Progress");
    setFilterOppStatus2("");
    setFilterManager("");
    setFilterAssignee("");
    setFilterStartDate("");
    setFilterEndDate("");
    setAppliedFilterStartDate("");
    setAppliedFilterEndDate("");
    localStorage.removeItem("potentialLeadsFilters-op1");
  };


  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesFreeText = !searchTerm || Object.values(item).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !filterStatus || (item.status && item.status.toLowerCase() == filterStatus.toLowerCase());
      const matchesDestination = !filterDestination || (item.travel_destination && item.travel_destination.toLowerCase() == filterDestination.toLowerCase());
      const actualPrimaryStatus = item.opportunity_status1 ? item.opportunity_status1.toLowerCase() : "In Progress";
      const matchesOppStatus1 =
        !filterOppStatus1 || actualPrimaryStatus === filterOppStatus1.toLowerCase();
      const matchesOppStatus2 = !filterOppStatus2 || (item.opportunity_status2 && item.opportunity_status2.toLowerCase() == filterOppStatus2.toLowerCase());
      const matchesManager = !filterManager || (item.assign_to_manager && item.assign_to_manager.toLowerCase() == filterManager.toLowerCase());
      const matchesAssignee = !filterAssignee || (item.assignedSalesName && item.assignedSalesName.toLowerCase() == filterAssignee.toLowerCase());
      const matchesDateRange = (() => {
        if (appliedFilterStartDate && appliedFilterEndDate) {
          const start = new Date(appliedFilterStartDate);
          const end = new Date(appliedFilterEndDate).setHours(23, 59, 59, 999);
          const createdAt = new Date(item.travel_created_at);
          return createdAt >= start && createdAt <= end;
        }
        return true;
      })();

      return matchesFreeText && matchesStatus && matchesDestination && matchesOppStatus1 && matchesOppStatus2 && matchesManager && matchesAssignee && matchesDateRange;
    });
  }, [searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2, filterManager, filterAssignee, appliedFilterStartDate, appliedFilterEndDate, data]);

  const columns = useMemo(() => [
    { Header: "Opp Id", accessor: "leadid" },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row }) => (
        <div style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => navigate(`/a-mydetails/${row.original.leadid}`, { state: { leadid: row.original.leadid } })}>
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
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "200px",
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "150px",
            }}
            title={row.original.email}
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
        const { fontSize } = useContext(FontSizeContext);
        const primaryStatus = row.original.opportunity_status1;
        const secondaryStatus = row.original.opportunity_status2;
        const secondaryOptions = dropdownOptions.secondary[primaryStatus] || [];
        const isSecondaryDisabled = !primaryStatus || secondaryOptions.length == 0;

        return (
          <div className="d-flex align-items-center gap-2"
            style={{
              fontSize: fontSize,
            }}
          >
            <select value={primaryStatus} onChange={(e) => handlePrimaryStatusChange(e.target.value, row.original.leadid)} className="form-select"
              style={{ fontSize: fontSize }}
            >
              <option value="">Select Primary Status</option>
              {dropdownOptions.primary.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select value={secondaryStatus} onChange={(e) => handleSecondaryStatusChange(e.target.value, row.original.leadid)} className="form-select" disabled={isSecondaryDisabled}
              style={{ fontSize: fontSize }}
            >
              <option value="">Select Secondary Status</option>
              {secondaryOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
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
          <FaEdit style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => handleEdit(row.original.leadid)} />
          <FaEye style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/a-mydetails/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
          <FaTrash style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => handleArchive(row.original.leadid)} />
          <FaComment style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/a-myopportunity-comments/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
        </div>
      ),
    },

  ], [dropdownOptions]);


  const uniqueDestinations = useMemo(() => {

    const normalizedDestinations = data
      .map(item => item.travel_destination?.trim())
      .filter(dest => dest)
      .map(dest => dest.toLowerCase());


    return [...new Set(normalizedDestinations)]
      .map(dest => dest.charAt(0).toUpperCase() + dest.slice(1));
  }, [data]);



  return (
    <div className="salesOpportunitycontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesOpportunity ${collapsed ? "collapsed" : ""}`}>
        <div className="potentialleads-table-container">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center fixed">
              <h3>My Opportunity Details</h3>
              {message && <div className="alert alert-info">{message}</div>}
              <button className="btn btn-success" onClick={downloadExcel}>
                <FaDownload /> Download Excel</button>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={6} className="d-flex align-items-center gap-2">
              <input type="text" className="form-control" placeholder="Free Text Search..." value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                localStorage.setItem("searchTerm-op1", e.target.value);
              }} />
              {showDateRange ? (
                <FaTimes
                  onClick={() => {
                    setShowDateRange(false);
                    localStorage.setItem("showDateRange-op1", "false");
                    setFilterStartDate("");
                    setFilterEndDate("");
                    setAppliedFilterStartDate("");
                    setAppliedFilterEndDate("");
                    localStorage.removeItem("filterStartDate-op1");
                    localStorage.removeItem("filterEndDate-op1");
                    localStorage.removeItem("appliedFilterStartDate-op1");
                    localStorage.removeItem("appliedFilterEndDate-op1");
                  }}
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                  title="Hide Date Range"
                />
              ) : (
                <FaCalendarAlt
                onClick={() => {
                  setShowDateRange(true);
                  localStorage.setItem("showDateRange-op1", "true");
                }} style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Show Date Range" />
              )}
              {showDateRange && (
                <div className="d-flex align-items-center gap-2">
                  <input type="date" className="form-control" value={filterStartDate} onChange={(e) => setFilterStartDate(e.target.value)} />
                  <span>to</span>
                  <input type="date" className="form-control" value={filterEndDate} onChange={(e) => setFilterEndDate(e.target.value)} />
                  <button className="btn btn-primary" onClick={() => { setAppliedFilterStartDate(filterStartDate); setAppliedFilterEndDate(filterEndDate); }}>OK</button>
                </div>
              )}
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button></Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}>
              <select className="form-select" value={filterDestination} onChange={(e) => setFilterDestination(e.target.value)}>
                <option value=""> Destinations</option>
                {uniqueDestinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </Col>
            <Col md={2}>
              <select className="form-select" value={filterOppStatus1} onChange={(e) => { setFilterOppStatus1(e.target.value); setFilterOppStatus2(""); }}>
                <option value="">Primary Status</option>
                {dropdownOptions.primary.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </Col>
            <Col md={2}>
              <select className="form-select" value={filterOppStatus2} onChange={(e) => setFilterOppStatus2(e.target.value)}>
                <option value="">Secondary Status</option>
                {dropdownOptions.secondary[filterOppStatus1]?.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </Col>

          </Row>
          {data.length == 0 ? (
            <div>No data available</div>
          ) : (
            <DataTable columns={columns} data={filteredData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Potentialleads;