import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from './../../../../Layout/Table/TableLayoutOpp';
import { FaEdit, FaTrash, FaEye, FaDownload, FaComment, FaUserPlus, FaCopy, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import Navbar from '../../../../Shared/SalesHeadNavbar/Navbar';
import { baseURL, webhookUrl } from '../../../../Apiservices/Api';
import axios from 'axios';
import { AuthContext } from "../../../../AuthContext/AuthContext";
import { FontSizeContext } from '../../../../Shared/Font/FontContext';
import * as XLSX from 'xlsx';
import { HiUserGroup } from "react-icons/hi"; // Import icon

import './ViewLeads.css'

const AdminViewLeads = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { authToken, userId } = useContext(AuthContext);
  const [message, setMessage] = useState(null);

  const [associatesByManager, setAssociatesByManager] = useState({});

  const [pageIndex, setPageIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm-1") || "");
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem("filterStatus-1") || "");
  const [filterDestination, setFilterDestination] = useState(localStorage.getItem("filterDestination-1") || "");
  const [filterOppStatus1, setFilterOppStatus1] = useState(localStorage.getItem("filterOppStatus1-1") || "new");
  const [filterOppStatus2, setFilterOppStatus2] = useState(localStorage.getItem("filterOppStatus2-1") || "");
  const [filterManager, setFilterManager] = useState(localStorage.getItem("filterManager-1") || "");
  const [filterAssignee, setFilterAssignee] = useState(localStorage.getItem("filterAssignee-1") || "");
  const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem("filterStartDate-1") || "");
  const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem("filterEndDate-1") || "");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState(localStorage.getItem("appliedFilterStartDate-1") || "");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState(localStorage.getItem("appliedFilterEndDate-1") || "");

  const [showDateRange, setShowDateRange] = useState(false);

  const [data, setData] = useState([]); // Initialize to an empty array

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
    setPageIndex(0);
  }, [searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2, filterManager, filterAssignee, appliedFilterStartDate, appliedFilterEndDate]);
  const handleEdit = (leadId) => {
    navigate(`/a-edit-lead/${leadId}`, {
      state: { leadid: leadId },
    });
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);  // Optional: Show a message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });


  };

  const handleAddUser = (lead) => {
    navigate(`/a-create-customer-opportunity/${lead.leadid}`);
  };


  const handleViewLeads = (lead) => {
    navigate(`/h-view-lead/${lead.leadid}`, {
      state: { leadid: lead.leadid },
    });
  };
  const handleArchive = async (leadid) => {
    const confirmDelete = window.confirm("Are you sure you want to archive this lead?");
    if (!confirmDelete) return; // If the user cancels, exit the function

    try {
      const response = await fetch(`${baseURL}/api/archiveByLeadId/${leadid}`, {
        method: "PUT",
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid)); // Remove from active list
        setMessage("The lead has been archived successfully.");
      } else {
        setMessage("Failed to archive the lead. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An unexpected error occurred while archiving the lead.");
    }

    setTimeout(() => setMessage(""), 1000);
  };

  const handleDelete = async (leadid) => {
    try {
      const response = await fetch(`${baseURL}/api/deleteByLeadId/${leadid}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid));
        setMessage('The lead has been deleted successfully.');
        setTimeout(() => setMessage(""), 1000);
      } else {
        setMessage('Failed to delete the lead. Please try again later.');
        setTimeout(() => setMessage(""), 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An unexpected error occurred while deleting the lead.');
      setTimeout(() => setMessage(""), 1000);
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
        row.leadid == rowId
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
        row.leadid == rowId ? { ...row, secondaryStatus: value } : row
      )
    );
    const lead = data.find((lead) => lead.leadid == rowId);
    updateLeadStatus(rowId, lead?.primaryStatus || "", value);
  };
  const updateLeadStatus = async (leadId, primaryStatus, secondaryStatus) => {
    const body = {
      primaryStatus: primaryStatus,
      secondaryStatus: secondaryStatus,
    };
    console.log('JSON:', JSON.stringify(body, null, 2));
    try {
      const response = await axios.put(`${baseURL}/api/leads/status/${leadId}`, body);

      if (response.status == 200) {

        setMessage(response.data.message || 'Status updated successfully.');
        setTimeout(() => setMessage(""), 1000);
        console.log('Status updated:', response.data);
      } else {
        console.error('Failed to update status:', response.data);

        setMessage('Failed to update status. Please try again.');
        setTimeout(() => setMessage(""), 1000);
      }
    } catch (error) {
      console.error('Error updating status:', error);

      setMessage('An error occurred while updating the status. Please try again.');
      setTimeout(() => setMessage(""), 1000);
    }
  };

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${webhookUrl}/api/enquiries`);
        const data = await response.json();

        const filteredData = data.filter((enquiry) =>  enquiry.status == 'lead');
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

  const [managers, setManagers] = useState([]);
  const [manager, setManager] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleAddLead = () => {
    navigate('/a-add-leads');
  };

  useEffect(() => {
    const fetchManager = async () => {
      try {
        const response = await fetch(`${baseURL}/managers`);
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const result = await response.json();
        setManager(result.data);
      } catch (err) {
        console.error("Error fetching managers:", err.message);
        setError(err.message);
      }
    };

    fetchManager();
  }, []);

  const handleAssignToChange = async (assignee, leadid, managerid, status) => {
    try {
      const response = await fetch(`${baseURL}/update-assignee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadid,
          assignee,
          managerid,
          status,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setTimeout(() => setMessage(""), 1000);

        setData((prevData) =>
          prevData.map((lead) =>
            lead.leadid == leadid
              ? { ...lead, assign_to_manager: assignee }
              : lead
          )
        );
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error updating assignee:', error);
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
    fetchManagers();
  }, [userId]);
  useEffect(() => {
    const fetchAssociatesForManagers = async () => {
      const associatesData = {};
      for (const manager of managers) {
        try {
          const response = await fetch(`${baseURL}/associates/${manager.id}`);
          const data = await response.json();
          associatesData[manager.id] = data;
        } catch (error) {
          console.error("Error fetching associates: ", error);
        }
      }
      setAssociatesByManager(associatesData);
    };

    if (managers.length > 0) {
      fetchAssociatesForManagers();
    }
  }, [managers]);
  const handleSelfAssign = async (leadid) => {
    try {
      const response = await axios.post(`${baseURL}/api/assign-admin`, { leadid });

      if (response.status == 200) {
        setMessage(response.data.message);
        setTimeout(() => setMessage(""), 1000);


        // Update the local state to reflect the assignment
        setData((prevData) =>
          prevData
            .map((lead) =>
              lead.leadid == leadid ? { ...lead, adminAssign: "admin" } : lead
            )
            .filter((lead) => lead.adminAssign !== 'admin') // Remove rows where adminAssign is not "admin"
        );
      } else {
        setMessage("Failed to assign the lead. Please try again.");
        setTimeout(() => setMessage(""), 1000);
      }
    } catch (error) {
      console.error("Error assigning lead:", error);
      setMessage("An error occurred while assigning the lead. Please try again.");
      setTimeout(() => setMessage(""), 1000);
    }
  };



  useEffect(() => {
    localStorage.setItem("searchTerm-1", searchTerm);
    localStorage.setItem("filterStatus-1", filterStatus);
    localStorage.setItem("filterDestination-1", filterDestination);
    localStorage.setItem("filterOppStatus1-1", filterOppStatus1);
    localStorage.setItem("filterOppStatus2-1", filterOppStatus2);
    localStorage.setItem("filterManager-1", filterManager);
    localStorage.setItem("filterAssignee-1", filterAssignee);
    localStorage.setItem("filterStartDate-1", filterStartDate);
    localStorage.setItem("filterEndDate-1", filterEndDate);
    localStorage.setItem("appliedFilterStartDate-1", appliedFilterStartDate);
    localStorage.setItem("appliedFilterEndDate-1", appliedFilterEndDate);
  }, [
    searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2,
    filterManager, filterAssignee, filterStartDate, filterEndDate,
    appliedFilterStartDate, appliedFilterEndDate
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDestination("");
    setFilterOppStatus1("new"); // Reset to "new" when filters are cleared
    setFilterOppStatus2("");
    setFilterManager("");
    setFilterAssignee("");
    setFilterStartDate("");
    setFilterEndDate("");
    setAppliedFilterStartDate("");
    setAppliedFilterEndDate("");
    localStorage.removeItem("adminleadsFilters");
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearchTerm =
        !searchTerm ||
        Object.values(item).some(
          (val) =>
            val &&
            val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );

      const actualPrimaryStatus = item.primaryStatus ? item.primaryStatus.toLowerCase() : "new";

      const matchesPrimaryStatus =
        !filterOppStatus1 || actualPrimaryStatus === filterOppStatus1.toLowerCase();
      const matchesSecondaryStatus =
        !filterOppStatus2 || (item.secondaryStatus && item.secondaryStatus.toLowerCase() == filterOppStatus2.toLowerCase());
      const matchesAssignee = !filterAssignee || (item.assignedSalesName && item.assignedSalesName.toLowerCase() == filterAssignee.toLowerCase());
      const matchesManager = !filterManager || (item.assign_to_manager && item.assign_to_manager.toLowerCase() == filterManager.toLowerCase());
      const matchesDestination = !filterDestination || (item.destination && item.destination.toLowerCase() == filterDestination.toLowerCase());
      const matchesDateRange = (() => {
        if (appliedFilterStartDate && appliedFilterEndDate) {
          const start = new Date(appliedFilterStartDate);
          const end = new Date(appliedFilterEndDate).setHours(23, 59, 59, 999);
          const createdAt = new Date(item.created_at);
          return createdAt >= start && createdAt <= end;
        }
        return true;
      })();

      return matchesSearchTerm && matchesPrimaryStatus && matchesDestination && matchesManager && matchesAssignee && matchesSecondaryStatus && matchesDateRange;
    });
  }, [searchTerm, filterOppStatus1, filterOppStatus2, filterManager, filterAssignee, filterDestination, appliedFilterStartDate, appliedFilterEndDate, data]);

  const handleAssignLead = async (leadid, associateObj, status) => {
    // Validate that the associate object contains an id and name.
    if (!associateObj?.id || !associateObj?.name) {
      setMessage("Please select a valid associate.");
      setTimeout(() => setMessage(""), 1000);
      return;
    }
    console.log(leadid, associateObj.id, associateObj.name);
    try {
      // POST both the associate id and name to the backend.
      const response = await axios.post(`${baseURL}/api/admin-assign-lead`, {
        leadid,
        employeeId: associateObj.id,
        employeeName: associateObj.name,
        status
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(""), 1000);

      // Update the state for the lead.
      setData((prevData) =>
        prevData.map((lead) =>
          lead.leadid == leadid
            ? {
              ...lead,
              assignedSalesId: associateObj.id,
              assignedSalesName: associateObj.name,
            }
            : lead
        )
      );
    } catch (error) {
      console.error("Error assigning lead:", error);
    }
  };

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
              onClick={() => handleViewLeads(row.original)} // Navigate on click
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
        Header: " Primary Status",
        accessor: "primaryStatus",
        
       
      },
      {
        Header: " Secondary Status",
      
        accessor: "secondaryStatus",
       
      },

      {
        Header: 'Source',
        accessor: 'sources',
      },
      {
        Header: "Customer Status",
        accessor: "customer_status",


      },

      {
        Header: "Manager ",
        accessor: row => row.adminAssign || row.assign_to_manager,
      },
      

      {
        Header: "Associate",
        accessor: "assignedSalesName",
       
      },

      


    ],
    [dropdownOptions, managers]
  );

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


  // Extract team members for the selected manager
  const teamMembers = useMemo(() => {
    if (!filterManager) return [];
    const selectedManager = managers.find((manager) => manager.name.toLowerCase() == filterManager.toLowerCase());
    return selectedManager ? selectedManager.teamMembers : [];
  }, [filterManager, managers]);


  return (
    <div className="admin-ViewLeadcontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`admin-ViewLead ${collapsed ? "collapsed" : ""}`}>
        <div className="admin-ViewLead-container mb-5">
          <div className="admin-ViewLead-table-container">
            <Row className="mb-3">
              <Col className="d-flex justify-content-between align-items-center">
                <h3>Lead Details</h3>
                {message && <div className="alert alert-info">{message}</div>}
                {/* <Button onClick={handleAddLead}>Add Leads</Button> */}
              </Col>
            </Row>
            <Row className="mb-3 align-items-center">
              <Col md={6} className="d-flex align-items-center gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Free Text Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
              <Col md={3} className="d-flex justify-content-end">
                <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button></Col>
              <Col md={3} className="d-flex justify-content-end">
                <button className="btn btn-success" onClick={downloadExcel}>
                  <FaDownload /> Download Excel</button></Col>
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
                <select
                  className="form-select"
                  value={filterOppStatus1}
                  onChange={(e) => {
                    setFilterOppStatus1(e.target.value);
                    setFilterOppStatus2(""); // Reset secondary filter when primary changes
                  }}
                >
                  <option value="">Primary Status</option>
                  <option value="new">New</option> {/* Pre-select New */}
                  {dropdownOptions.primary
                    .filter((status) => status.toLowerCase() !== "new") // Prevent duplicate "New"
                    .map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                </select>
              </Col>

              <Col md={2}>
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
              <Col md={2}>
                <select className="form-select" value={filterManager} onChange={(e) => {
                  setFilterManager(e.target.value);
                  setFilterAssignee("");
                }}>
                  <option value=""> Managers</option>
                  {Array.isArray(managers) && managers.map((manager) => (
                    <option key={manager.id} value={manager.name}>{manager.name}</option>
                  ))}
                </select>
              </Col>
              <Col md={3}>
                <select className="form-select" value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}>
                  <option value="">Associates</option>
                  {teamMembers.map((member) => (
                    <option key={member.id} value={member.name}>{member.name}</option>
                  ))}
                </select>
              </Col>
            </Row>
            <DataTable columns={columns} data={filteredData} setPageIndex={setPageIndex} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewLeads;
