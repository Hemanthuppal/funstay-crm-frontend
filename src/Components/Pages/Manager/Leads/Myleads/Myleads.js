import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./../../../../Layout/Table/TableLayoutOpp";
import { Button, Row, Col, Form } from "react-bootstrap";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import { FaEdit, FaTrash, FaEye, FaUserPlus, FaComment, FaSyncAlt, FaCopy, FaCalendarAlt, FaTimes, FaDownload } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import "./Myleads.css";
import axios from "axios";
import { AuthContext } from "../../../../AuthContext/AuthContext";
import { baseURL } from "../../../../Apiservices/Api";
import { webhookUrl } from "../../../../Apiservices/Api";
import * as XLSX from 'xlsx';
import { FontSizeContext } from "../../../../Shared/Font/FontContext";

const ViewLeads = () => {
  const [message, setMessage] = useState('');
  const { authToken, userId, managerId, userName } = useContext(AuthContext);
  const [data, setData] = useState([]);
 


  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm-m1") || "");
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem("filterStatus-m1") || "");
  const [filterDestination, setFilterDestination] = useState(localStorage.getItem("filterDestination-m1") || "");
  const [filterOppStatus1, setFilterOppStatus1] = useState(localStorage.getItem("filterOppStatus1-m1") || "New");
  const [filterOppStatus2, setFilterOppStatus2] = useState(localStorage.getItem("filterOppStatus2-m1") || "");

  const [filterAssignee, setFilterAssignee] = useState(localStorage.getItem("filterAssignee-m1") || "");
  const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem("filterStartDate-m1") || "");
  const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem("filterEndDate-m1") || "");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState(localStorage.getItem("appliedFilterStartDate-m1") || "");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState(localStorage.getItem("appliedFilterEndDate-m1") || "");
   const [showDateRange, setShowDateRange] = useState(
      localStorage.getItem("showDateRange-m1") === "true"
    ); 
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
   useEffect(() => {
      localStorage.setItem("showDateRange-m1", showDateRange);
    }, [showDateRange]); 

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);  // Optional: Show a message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

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
      { key: "description", label: "DESCRIPTION", width: 30 },
      { key: "secondarysource", label: "SECONDARY SOURCE", width: 20 },
      { key: "origincity", label: "ORIGIN CITY", width: 15 },
      { key: "destination", label: "DESTINATION", width: 15 },
      { key: "created_at", label: "CREATED AT", width: 20 },
      { key: "primaryStatus", label: "PRIMARY STATUS", width: 15 },
      { key: "secondaryStatus", label: "SECONDARY STATUS", width: 15 },
      { key: "primarySource", label: "PRIMARY SOURCE", width: 20 },
      { key: "channel", label: "CHANNEL", width: 15 }
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
    XLSX.utils.book_append_sheet(wb, ws, "Filtered Leads");
    const fileName = `Filtered_Leads_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };


  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${webhookUrl}/api/enquiries`);
        const data = await response.json();
        const filteredData = data.filter((enquiry) => enquiry.managerAssign == userId && enquiry.managerid == userId && enquiry.status == "lead");
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching enquiries:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${baseURL}/employeesassign`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEnquiries();
    fetchEmployees();
  }, [authToken, userId]);

  const handleEdit = (leadId) => {
    navigate(`/m-myedit-lead/${leadId}`, {
      state: { leadid: leadId },
    });
  };

  const handleAddUser = (lead) => {
    navigate(`/m-mycreate-customer-opportunity/${lead.leadid}`);
  };
  const handleAddLead = () => {
    navigate('/m-add-leads');
  };


  const handleViewLeads = (lead) => {
    navigate(`/m-myview-lead/${lead.leadid}`, {
      state: { leadid: lead.leadid },
    });
  };

  const handleDelete = async (leadid) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this Lead?");
    // if (!confirmDelete) return;
    try {
      const response = await fetch(`${baseURL}/api/deleteByLeadId/${leadid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid));
        setMessage('The lead has been deleted successfully.');
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage('Failed to delete the lead. Please try again later.');
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An unexpected error occurred while deleting the lead.');
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const dropdownOptions = {
    primary: ["New", "No Response", "Duplicate", "False Lead", "Junk", "Plan Cancelled"],
    secondary: {
      New: ["Yet to Contact", "Not picking up call", "Asked to call later"],
      "No Response": [],
      Duplicate: [],
      "False Lead": [],
      Junk: ["Plan Cancelled", "Plan Delayed", "Already Booked", "Others"],
      "Plan Cancelled": [],
    },
  };

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId
          ? {
            ...row,
            primaryStatus: value,
            secondaryStatus: "",
          }
          : row
      )
    );
    updateLeadStatus(rowId, value, "");
  };

  const handleSecondaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId ? { ...row, secondaryStatus: value } : row
      )
    );
    const lead = data.find((lead) => lead.leadid === rowId);
    updateLeadStatus(rowId, lead?.primaryStatus || "", value);
  };
  const updateLeadStatus = async (leadId, primaryStatus, secondaryStatus) => {
    const body = {
      primaryStatus: primaryStatus,
      secondaryStatus: secondaryStatus,
    };
    console.log(JSON.stringify(body, null, 2));
    try {
      const response = await axios.put(`${baseURL}/api/leads/status/${leadId}`, body);

      if (response.status === 200) {

        setMessage(response.data.message || 'Status updated successfully.');
        setTimeout(() => setMessage(""), 3000);
        console.log('Status updated:', response.data);
      } else {
        console.error('Failed to update status:', response.data);
        setMessage('Failed to update status. Please try again.');
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('An error occurred while updating the status. Please try again.');
      setTimeout(() => setMessage(""), 3000);
    }
  };





  useEffect(() => {
    localStorage.setItem("searchTerm-m1", searchTerm);
    localStorage.setItem("filterStatus-m1", filterStatus);
    localStorage.setItem("filterDestination-m1", filterDestination);
    localStorage.setItem("filterOppStatus1-m1", filterOppStatus1);
    localStorage.setItem("filterOppStatus2-m1", filterOppStatus2);

    localStorage.setItem("filterAssignee-m1", filterAssignee);
    localStorage.setItem("filterStartDate-m1", filterStartDate);
    localStorage.setItem("filterEndDate-m1", filterEndDate);
    localStorage.setItem("appliedFilterStartDate-m1", appliedFilterStartDate);
    localStorage.setItem("appliedFilterEndDate-m1", appliedFilterEndDate);
  }, [
    searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2,
    filterAssignee, filterStartDate, filterEndDate,
    appliedFilterStartDate, appliedFilterEndDate
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDestination("");
    setFilterOppStatus1("New"); // Reset to "new" when filters are cleared
    setFilterOppStatus2("");

    setFilterAssignee("");
    setFilterStartDate("");
    setFilterEndDate("");
    setAppliedFilterStartDate("");
    setAppliedFilterEndDate("");
    localStorage.removeItem("potentialLeadsFilters");
  };


  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesFreeText = !searchTerm || Object.values(item).some(val => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()));
      const actualPrimaryStatus = item.primaryStatus ? item.primaryStatus.toLowerCase() : "New";
      const matchesPrimaryStatus =
        !filterOppStatus1 || actualPrimaryStatus === filterOppStatus1.toLowerCase();
      const matchesSecondaryStatus =
        !filterOppStatus2 || (item.secondaryStatus && item.secondaryStatus.toLowerCase() === filterOppStatus2.toLowerCase());
      const matchesDestination = !filterDestination || (item.destination && item.destination.toLowerCase() == filterDestination.toLowerCase());
      const matchesAssignee = !filterAssignee || (item.assignedSalesName && item.assignedSalesName.toLowerCase() == filterAssignee.toLowerCase());
      const matchesDateRange = (() => {
        if (appliedFilterStartDate && appliedFilterEndDate) {
          const start = new Date(appliedFilterStartDate);
          const end = new Date(appliedFilterEndDate).setHours(23, 59, 59, 999);
          const createdAt = new Date(item.created_at);
          return createdAt >= start && createdAt <= end;
        }
        return true;
      })();


      return matchesFreeText && matchesPrimaryStatus && matchesDestination && matchesAssignee && matchesSecondaryStatus && matchesDateRange;
    });
  }, [searchTerm, filterOppStatus1, filterAssignee, filterDestination, filterOppStatus2, appliedFilterStartDate, appliedFilterEndDate, data]);

  const uniqueDestinations = useMemo(() => {
    // Filter out empty destinations and normalize valid ones
    const normalizedDestinations = data
      .map(item => item.destination?.trim()) // Trim spaces and handle potential undefined/null values
      .filter(dest => dest) // Remove empty values
      .map(dest => dest.toLowerCase()); // Convert to lowercase for uniqueness

    // Get unique values and format them
    return [...new Set(normalizedDestinations)]
      .map(dest => dest.charAt(0).toUpperCase() + dest.slice(1)); // Capitalize first letter
  }, [data]);


  const columns = useMemo(
    () => [

      {
        Header: "Lead Id",
        accessor: "leadid",

      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            <div
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
              onClick={() => handleViewLeads(row.original)}
            >
              {row.original.name}
            </div>
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
        Header: "Lead Status",
        Cell: ({ row }) => {
          const { fontSize } = useContext(FontSizeContext);
          const primaryStatus = row.original.primaryStatus;
          const secondaryStatus = row.original.secondaryStatus;
          const secondaryOptions = dropdownOptions.secondary[primaryStatus] || [];
          const isSecondaryDisabled = !primaryStatus || secondaryOptions.length === 0;

          return (
            <div className="d-flex align-items-center" style={{ fontSize: fontSize }}>
              <select
                value={primaryStatus}
                onChange={(e) =>
                  handlePrimaryStatusChange(e.target.value, row.original.leadid)
                }
                className="form-select me-2"
                style={{ fontSize: fontSize }}
              >
                {!primaryStatus && <option value="">Select Primary Status</option>}
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
                className="form-select"
                style={{ fontSize: fontSize }}
                disabled={isSecondaryDisabled}
              >
                {!secondaryStatus && <option value="">Select Secondary Status</option>}
                {secondaryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          );
        },
      }
      ,
      {
        Header: "Source",
        accessor: "sources",
      },

      {
        Header: "Customer Status",
        accessor: "customer_status",


      },







      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FaEdit
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => handleEdit(row.original.leadid)}
            />
            <FaEye
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => handleViewLeads(row.original)}
            />
            {/* <FaTrash
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => handleDelete(row.original.leadid)}
            /> */}
            <FaUserPlus
              style={{ color: "ff9966", cursor: "pointer" }}
              onClick={() => handleAddUser(row.original)}
            />
            <FaComment
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => navigate(`/m-mycomments/${row.original.leadid}`, { state: { leadid: row.original.leadid } })}
            />
          </div>
        ),
      }

    ],
    [employees]
  );

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="ViewLead-container mb-5">
          <div className="ViewLead-table-container">
            <Row className="mb-3">
              <Col className="d-flex justify-content-between align-items-center">
                <h3>Lead Details</h3>
                {message && <div className="alert alert-info">{message}</div>}
                {/* <Button onClick={handleAddLead}>Add Leads</Button> */}
                <button className="btn btn-success" onClick={downloadExcel}>
                <FaDownload /> Download Excel</button>
              </Col>
            </Row>
            <Row className="mb-3 align-items-center">
              <Col md={6} className="d-flex align-items-center gap-2">
              <input type="text" className="form-control" placeholder="Free Text Search..." value={searchTerm} 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                localStorage.setItem("searchTerm-m1", e.target.value);
              }} />
                {showDateRange ? (
                  <FaTimes
                    onClick={() => {
                      setShowDateRange(false);
                      localStorage.setItem("showDateRange-m1", "false");
                      setFilterStartDate("");
                      setFilterEndDate("");
                      setAppliedFilterStartDate("");
                      setAppliedFilterEndDate("");
                      localStorage.removeItem("filterStartDate-m1");
                      localStorage.removeItem("filterEndDate-m1");
                      localStorage.removeItem("appliedFilterStartDate-m1");
                      localStorage.removeItem("appliedFilterEndDate-m1");
                    }} style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Hide Date Range" />
                ) : (
                  <FaCalendarAlt 
                  onClick={() => {
                    setShowDateRange(true);
                    localStorage.setItem("showDateRange-m1", "true");
                  }}style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Show Date Range" />
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
                  <option value="">Destinations</option>
                  {uniqueDestinations.map((dest) => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </Col>
              <Col md={3}>
                <select
                  className="form-select"
                  value={filterOppStatus1}
                  onChange={(e) => {
                    setFilterOppStatus1(e.target.value);
                    setFilterOppStatus2(""); // Reset secondary filter when primary changes
                  }}
                >
                  <option value="">Primary Status</option>
                  <option value="New">New</option> {/* Pre-select New */}
                  {dropdownOptions.primary
                    .filter((status) => status.toLowerCase() !== "new") // Prevent duplicate "New"
                    .map((status) => (
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
                  {dropdownOptions.secondary[filterOppStatus1]?.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </Col>
            </Row>
            <DataTable columns={columns} data={filteredData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeads;