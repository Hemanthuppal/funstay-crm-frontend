import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/ManagerNavbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaEye, FaDownload, FaComment, FaTrash, FaDollarSign, FaSpinner, FaSave, FaCalendarAlt, FaTimes, FaCopy } from "react-icons/fa";
import { Row, Col, Form } from "react-bootstrap";
import { HiUserGroup } from "react-icons/hi";
import DataTable from "../../../Layout/Table/TableLayoutOpp";
import { baseURL } from "../../../Apiservices/Api";
import './PotentialLeads.css';
import axios from 'axios';
import { AuthContext } from '../../../AuthContext/AuthContext';
import { FontSizeContext } from "../../../Shared/Font/FontContext";
import * as XLSX from 'xlsx';

const Potentialleads = () => {
  const { authToken, userId, userName } = useContext(AuthContext);
  const { fontSize } = useContext(FontSizeContext);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "");
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem("filterStatus") || "");
  const [filterDestination, setFilterDestination] = useState(localStorage.getItem("filterDestination") || "");
  const [filterOppStatus1, setFilterOppStatus1] = useState(localStorage.getItem("filterOppStatus1") || "In Progress");
  const [filterOppStatus2, setFilterOppStatus2] = useState(localStorage.getItem("filterOppStatus2") || "");

  const [filterAssignee, setFilterAssignee] = useState(localStorage.getItem("filterAssignee") || "");
  const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem("filterStartDate") || "");
  const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem("filterEndDate") || "");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState(localStorage.getItem("appliedFilterStartDate") || "");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState(localStorage.getItem("appliedFilterEndDate") || "");
  // const [showDateRange, setShowDateRange] = useState(false);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [showDateRange, setShowDateRange] = useState(
    localStorage.getItem("showDateRange") === "true"
  );

  // Save state to localStorage when values change
  useEffect(() => {
    localStorage.setItem("showDateRange", showDateRange);
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

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/fetch-data`);
      if (response.status == 200) {
        const filteredLeads = response.data.filter(
          (enquiry) => enquiry.managerAssign !== userId && enquiry.managerid == userId && enquiry.status == "opportunity"
        );
        setData(filteredLeads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });


  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseURL}/employeesassign`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchEmployees(); // Fetch employees when the component mounts
  }, [userId]);

  const dropdownOptions = {
    primary: ["In Progress", "Confirmed", "Lost", "Duplicate"],
    secondary: {
      "In Progress": [
        "Understood Requirement",
        "Sent first quote",
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


  const handleEdit = (rowId) => {
    navigate(`/m-edit-opportunity/${rowId}`, { state: { leadid: rowId } });
  };

  const handleDelete = async (leadid) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this Opportunity?");
    // if (!confirmDelete) return;
    try {
      const response = await fetch(`${baseURL}/api/opportunity/${leadid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid));
        setMessage('Opportunity has been deleted successfully.');
        setTimeout(() => {
          setMessage('');
        }, 1000);
      } else {
        console.error('Error deleting record');
        setMessage('Failed to delete the opportunity. Please try again.');
        setTimeout(() => {
          setMessage('');
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while deleting the opportunity.');
      setTimeout(() => {
        setMessage('');
      }, 1000);
    }
  };

  const handleAssignLead = async (leadid, employeeId, status) => {
    const selectedEmp = employees.find((emp) => emp.id === parseInt(employeeId));
    const employeeName = selectedEmp ? selectedEmp.name : "";

    if (!employeeName) {
      setMessage("Please select a valid employee.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/assign-lead`, {
        leadid,
        employeeId,
        employeeName,
        status,
        userId,
        userName,
      });

      if (response.status === 200) {
        // Update the local state immediately
        setData((prevData) =>
          prevData.map((lead) =>
            lead.leadid === leadid
              ? { ...lead, assignedSalesName: employeeName, assignedSalesId: employeeId }
              : lead
          )
        );
        setMessage(response.data.message);
        setTimeout(() => setMessage(""), 1000);
      }
    } catch (error) {
      console.error("Error assigning lead:", error);
      setMessage("An error occurred while assigning the lead.");
      setTimeout(() => setMessage(""), 1000);
    }
  };

  const handleSelfAssign = async (leadid) => {
    try {
      const response = await axios.post(`${baseURL}/api/assign-manager`, {
        leadid,
        userId, // Use the userId from context
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setTimeout(() => setMessage(""), 3000);
        window.location.reload();

        // Update the local state to reflect the assignment
        setData((prevData) =>
          prevData.map((lead) =>
            lead.leadid === leadid ? { ...lead, managerAssign: userId } : lead
          )
        );
      } else {
        setMessage('Failed to assign the lead. Please try again.');
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error assigning lead:", error);
      setMessage('An error occurred while assigning the lead. Please try again.');
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("filterStatus", filterStatus);
    localStorage.setItem("filterDestination", filterDestination);
    localStorage.setItem("filterOppStatus1", filterOppStatus1);
    localStorage.setItem("filterOppStatus2", filterOppStatus2);

    localStorage.setItem("filterAssignee", filterAssignee);
    localStorage.setItem("filterStartDate", filterStartDate);
    localStorage.setItem("filterEndDate", filterEndDate);
    localStorage.setItem("appliedFilterStartDate", appliedFilterStartDate);
    localStorage.setItem("appliedFilterEndDate", appliedFilterEndDate);
  }, [
    searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2,
    filterAssignee, filterStartDate, filterEndDate,
    appliedFilterStartDate, appliedFilterEndDate
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDestination("");
    setFilterOppStatus1("In Progress");
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
      const matchesStatus = !filterStatus || (item.status && item.status.toLowerCase() == filterStatus.toLowerCase());
      const matchesDestination = !filterDestination || (item.travel_destination && item.travel_destination.toLowerCase() == filterDestination.toLowerCase());
      const actualPrimaryStatus = item.opportunity_status1 ? item.opportunity_status1.toLowerCase() : "In Progress";
      const matchesOppStatus1 =
        !filterOppStatus1 || actualPrimaryStatus === filterOppStatus1.toLowerCase();
      const matchesOppStatus2 = !filterOppStatus2 || (item.opportunity_status2 && item.opportunity_status2.toLowerCase() == filterOppStatus2.toLowerCase());
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

      return matchesFreeText && matchesStatus && matchesDestination && matchesOppStatus1 && matchesOppStatus2 && matchesAssignee && matchesDateRange;
    });
  }, [searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2, filterAssignee, appliedFilterStartDate, appliedFilterEndDate, data]);

  const columns = useMemo(() => [
    { Header: "Opp Id", accessor: "leadid" },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row }) => (
        <div style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => navigate(`/m-details/${row.original.leadid}`, { state: { leadid: row.original.leadid } })}>
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
        const { fontSize } = useContext(FontSizeContext);
        const primaryStatus = row.original.opportunity_status1;
        const secondaryStatus = row.original.opportunity_status2;
        const secondaryOptions = dropdownOptions.secondary[primaryStatus] || [];
        const isSecondaryDisabled = !primaryStatus || secondaryOptions.length == 0;

        return (
          <div className="d-flex align-items-center gap-2" style={{ fontSize: fontSize }}>
            <select value={primaryStatus} onChange={(e) => handlePrimaryStatusChange(e.target.value, row.original.leadid)} className="form-select" style={{ fontSize: fontSize }}>
              <option value="">Select Primary Status</option>
              {dropdownOptions.primary.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select value={secondaryStatus} onChange={(e) => handleSecondaryStatusChange(e.target.value, row.original.leadid)} className="form-select" disabled={isSecondaryDisabled} style={{ fontSize: fontSize }}>
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
      Header: "Quotation",
      accessor: "quotation_id",
      minWidth: 150,
      maxWidth: 180,
      width: 160,
      Cell: ({ row }) => {
        const navigate = useNavigate();
        const [selectedFile, setSelectedFile] = useState(null);
        const [isUploading, setIsUploading] = useState(false);
        const [showQuotationId, setShowQuotationId] = useState(row.original.quotation_id);

        const handleFileChange = (event) => {
          const file = event.target.files[0];

          if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("File size must be less than 2MB.");
            return;
          }

          setSelectedFile(file);
        };


        const handleUpload = async () => {
          if (!selectedFile) {
            alert("Please choose a file before saving.");
            return;
          }

          setIsUploading(true);
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("email", row.original.email);
          formData.append("leadid", row.original.leadid);

          try {
            // 1. Upload the file
            const uploadResponse = await axios.post(`${baseURL}/api/upload-quotation`, formData);

            // 2. Update email status and get the quotation_id
            const statusResponse = await axios.post(`${baseURL}/api/update-email-status`, {
              leadid: row.original.leadid,
            });

            // 3. Immediately update the UI
            setShowQuotationId(statusResponse.data.quotation_id || row.original.quotation_id);

            // 4. Update the main data state
            setData(prevData =>
              prevData.map(item =>
                item.leadid === row.original.leadid
                  ? {
                    ...item,
                    email_sent: true,
                    quotation_id: statusResponse.data.quotation_id || item.quotation_id
                  }
                  : item
              )
            );

            alert("File uploaded and email sent successfully!");
          } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error sending email.");
          } finally {
            setIsUploading(false);
          }
        };

        const handleNavigate = () => {
          navigate(`/m_email-history/${row.original.leadid}`, {
            state: { email: row.original.email }
          });
        };

        return (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            flexWrap: "nowrap"
          }}>
            {showQuotationId || row.original.email_sent ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate();
                }}
                style={{
                  textDecoration: "underline",
                  color: "blue",
                  cursor: "pointer"
                }}
              >
                {showQuotationId || "View"}
              </a>
            ) : (
              <>
                {/* Hidden File Input */}
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id={`fileInput-${row.original.leadid}`}
                  disabled={isUploading}
                />

                {/* Clickable File Name OR File Input */}
                {selectedFile ? (
                  <label
                    htmlFor={`fileInput-${row.original.leadid}`}
                    style={{
                      fontSize: "12px",
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {selectedFile.name}
                  </label>
                ) : (
                  <label
                    htmlFor={`fileInput-${row.original.leadid}`}
                    style={{ cursor: "pointer", border: "1px solid #ccc", padding: "2px 5px", borderRadius: "4px" }}
                  >
                    Choose
                  </label>
                )}

                {/* Upload Button with Loader */}
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    padding: "5px"
                  }}
                >
                  {isUploading ? (
                    <FaSpinner size={16} color="blue" className="spin-animation" />
                  ) : (
                    <FaSave size={16} color="green" />
                  )}
                </button>


              </>
            )}
          </div>
        );
      },
    }

    ,
    {
      Header: "Assign",
      accessor: "id",
      Cell: ({ cell: { row } }) => {
        const assignedSalesId = row.original.assignedSalesId || "";
        const [selectedEmployee, setSelectedEmployee] = useState(assignedSalesId);
        const [showIcon, setShowIcon] = useState(false);

        const handleChange = (e) => {
          const newValue = e.target.value;
          setSelectedEmployee(newValue);
          setShowIcon(newValue !== assignedSalesId);
        };

        const handleAssignClick = async () => {
          if (selectedEmployee) {
            if (selectedEmployee === "self") {
              // Call the new API for self assignment
              await handleSelfAssign(row.original.leadid);
            } else {
              handleAssignLead(row.original.leadid, selectedEmployee, row.original.status);
            }
            setShowIcon(false); // Hide icon after assignment
          } else {
            setMessage("Please select an employee to assign the lead.");
            setTimeout(() => setMessage(""), 3000);
          }
        };

        return (
          <div className="d-flex align-items-center" style={{ fontSize: fontSize }}>
            <Form.Select
              value={selectedEmployee}
              onChange={handleChange}
              className="me-2" style={{ fontSize: fontSize }}
            >
              <option value="">Select Employee</option>
              <option value="self">Self</option> {/* Add Self option */}
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </Form.Select>
            {showIcon && (
              <HiUserGroup
                style={{ color: "#ff9966", cursor: "pointer", fontSize: "20px" }}
                onClick={handleAssignClick}
              />
            )}
          </div>
        );
      },
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaEdit style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => handleEdit(row.original.leadid)} />
          <FaEye style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/m-details/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
          {/* <FaTrash style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => handleDelete(row.original.leadid)} /> */}
          <FaComment style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/m-opportunity-comments/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
          <FaDollarSign
            style={{ color: "#ff9966", cursor: "pointer" }}
            onClick={() =>
              navigate(`/m-payments/${row.original.leadid}`, {
                state: { leadid: row.original.leadid },
              })
            }
          />
        </div>
      ),
    },

  ], [dropdownOptions]);

  // const uniqueDestinations = useMemo(() => {
  //   // Normalize the destinations by trimming spaces and converting to lowercase
  //   const normalizedDestinations = data.map(item => item.travel_destination.trim().toLowerCase());

  //   // Use a Set to get unique values, then convert back to the original format
  //   const uniqueNormalizedDestinations = [...new Set(normalizedDestinations)];

  //   // Map back to the original format (if needed)
  //   return uniqueNormalizedDestinations.map(dest => dest.charAt(0).toUpperCase() + dest.slice(1));
  // }, [data]);
  const uniqueDestinations = useMemo(() => {
    // Filter out empty destinations and normalize valid ones
    const normalizedDestinations = data
      .map(item => item.travel_destination?.trim()) // Trim spaces and handle potential undefined/null values
      .filter(dest => dest) // Remove empty values
      .map(dest => dest.toLowerCase()); // Convert to lowercase for uniqueness

    // Get unique values and format them
    return [...new Set(normalizedDestinations)]
      .map(dest => dest.charAt(0).toUpperCase() + dest.slice(1)); // Capitalize first letter
  }, [data]);

  return (
    <div className="salesOpportunitycontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesOpportunity ${collapsed ? "collapsed" : ""}`}>
        <div className="potentialleads-table-container">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center fixed">
              <h3>Opportunity Details</h3>
              {message && <div className="alert alert-info">{message}</div>}
              <button className="btn btn-success" onClick={downloadExcel}>
                <FaDownload /> Download Excel</button>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={6} className="d-flex align-items-center gap-2">
              <input type="text" className="form-control" placeholder="Free Text Search..." value={searchTerm} onChange={(e) => {
                setSearchTerm(e.target.value);
                localStorage.setItem("searchTerm", e.target.value);
              }} />
              {showDateRange ? (
                <FaTimes
                  onClick={() => {
                    setShowDateRange(false);
                    localStorage.setItem("showDateRange", "false");
                    setFilterStartDate("");
                    setFilterEndDate("");
                    setAppliedFilterStartDate("");
                    setAppliedFilterEndDate("");
                    localStorage.removeItem("filterStartDate");
                    localStorage.removeItem("filterEndDate");
                    localStorage.removeItem("appliedFilterStartDate");
                    localStorage.removeItem("appliedFilterEndDate");
                  }} style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Hide Date Range" />
              ) : (
                <FaCalendarAlt onClick={() => {
                  setShowDateRange(true);
                  localStorage.setItem("showDateRange", "true");
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
                <option value="">Destinations</option>
                {uniqueDestinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
            </Col>
            <Col md={3}>
              <select className="form-select" value={filterOppStatus1} onChange={(e) => { setFilterOppStatus1(e.target.value); setFilterOppStatus2(""); }}>
                <option value="">Primary Status</option>
                {dropdownOptions.primary.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </Col>
            <Col md={3}>
              <select className="form-select" value={filterOppStatus2} onChange={(e) => setFilterOppStatus2(e.target.value)}>
                <option value="">Secondary Status</option>
                {dropdownOptions.secondary[filterOppStatus1]?.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </Col>
            <Col md={3}>
              <select className="form-select" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
                <option value="">Associates</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.name}>{employee.name}</option>
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