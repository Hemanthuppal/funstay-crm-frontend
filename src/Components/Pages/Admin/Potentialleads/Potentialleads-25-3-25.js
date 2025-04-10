import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/Navbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaEye, FaDownload, FaComment, FaTrash, FaCalendarAlt, FaTimes, FaCopy, FaHistory, FaSave } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import DataTable from "../../../Layout/Table/TableLayoutOpp";
import { baseURL } from "../../../Apiservices/Api";
import "./PotentialLeads.css";
import axios from "axios";
import { AuthContext } from "../../../AuthContext/AuthContext";
import { HiOutlinePaperClip, HiUserGroup } from "react-icons/hi";
import { FontSizeContext } from '../../../Shared/Font/FontContext';
// import { HiUserGroup } from "react-icons/hi"; 
import * as XLSX from 'xlsx';

const Potentialleads = () => {
  const { authToken, userId } = useContext(AuthContext);
  const { fontSize } = useContext(FontSizeContext);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [associatesByManager, setAssociatesByManager] = useState({});
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm") || "");
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem("filterStatus") || "");
  const [filterDestination, setFilterDestination] = useState(localStorage.getItem("filterDestination") || "");
  const [filterOppStatus1, setFilterOppStatus1] = useState(localStorage.getItem("filterOppStatus1") || "In Progress");
  const [filterOppStatus2, setFilterOppStatus2] = useState(localStorage.getItem("filterOppStatus2") || "");
  const [filterManager, setFilterManager] = useState(localStorage.getItem("filterManager") || "");
  const [filterAssignee, setFilterAssignee] = useState(localStorage.getItem("filterAssignee") || "");
  const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem("filterStartDate") || "");
  const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem("filterEndDate") || "");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState(localStorage.getItem("appliedFilterStartDate") || "");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState(localStorage.getItem("appliedFilterEndDate") || "");
  // const [showDateRange, setShowDateRange] = useState(false);
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState([]); 


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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);  // Optional: Show a message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });


  };
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/fetch-data`);
      if (response.status == 200) {
        const filteredLeads = response.data.filter((enquiry) => enquiry.adminAssign !== 'admin' && enquiry.status == "opportunity");
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
    navigate(`/a-edit-opportunity/${rowId}`, { state: { leadid: rowId } });
  };
  const handleArchive = async (leadid) => {
    const confirmDelete = window.confirm("Are you sure you want to archive this Opportunity?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${baseURL}/api/archiveByLeadId/${leadid}`, {
        method: 'PUT',
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid)); // Remove from active list
        setMessage('The Opportunity has been archived successfully.');
      } else {
        setMessage('Failed to archive the lead. Please try again later.');
      }
      setTimeout(() => setMessage(""), 1000);
    } catch (error) {
      console.error("Error:", error);
      setMessage('An unexpected error occurred while archiving the lead.');
      setTimeout(() => setMessage(""), 1000);
    }
  };

  const handleDelete = async (leadid) => {
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
  useEffect(() => {
    localStorage.setItem("searchTerm", searchTerm);
    localStorage.setItem("filterStatus", filterStatus);
    localStorage.setItem("filterDestination", filterDestination);
    localStorage.setItem("filterOppStatus1", filterOppStatus1);
    localStorage.setItem("filterOppStatus2", filterOppStatus2);
    localStorage.setItem("filterManager", filterManager);
    localStorage.setItem("filterAssignee", filterAssignee);
    localStorage.setItem("filterStartDate", filterStartDate);
    localStorage.setItem("filterEndDate", filterEndDate);
    localStorage.setItem("appliedFilterStartDate", appliedFilterStartDate);
    localStorage.setItem("appliedFilterEndDate", appliedFilterEndDate);
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
    localStorage.removeItem("potentialLeadsFilters");
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
          const start = new Date(appliedFilterStartDate).getTime();
          const end = new Date(appliedFilterEndDate).setHours(23, 59, 59, 999);
          const createdAt = new Date(item.travel_created_at).getTime();

          return createdAt >= start && createdAt <= end;
        }

        return true;
      })();

      return matchesFreeText && matchesStatus && matchesDestination && matchesOppStatus1 && matchesOppStatus2 && matchesManager && matchesAssignee && matchesDateRange;
    });
  }, [searchTerm, filterStatus, filterDestination, filterOppStatus1, filterOppStatus2, filterManager, filterAssignee, appliedFilterStartDate, appliedFilterEndDate, data]);

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

  const columns = useMemo(() => [
    { Header: "Opp Id", accessor: "leadid" },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row }) => (
        <div style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => navigate(`/a-details/${row.original.leadid}`, { state: { leadid: row.original.leadid } })}>
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
            <select value={primaryStatus} onChange={(e) => handlePrimaryStatusChange(e.target.value, row.original.leadid)} className="form-select" style={{ fontSize: fontSize }} >
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
      minWidth: 150, // Reduce width (adjust as needed)
      maxWidth: 180, // Limit max width
      width: 160, // Set an approximate fixed width
      Cell: ({ row }) => {
        const navigate = useNavigate();
        const [selectedFile, setSelectedFile] = useState(null);
        const [emailSent, setEmailSent] = useState(row.original.email_sent);


        const handleFileChange = (event) => {
          setSelectedFile(event.target.files[0]);
        };

        const handleUpload = async () => {
          if (!selectedFile) {
            alert("Please choose a file before saving.");
            return;
          }
          const formData = new FormData();
          formData.append("file", selectedFile);
          formData.append("email", row.original.email);
          formData.append("leadid", row.original.leadid);
          try {
            await axios.post(`${baseURL}/api/upload-quotation`, formData);
            await axios.post(`${baseURL}/api/update-email-status`, {
              leadid: row.original.leadid,
            });
            alert("File uploaded and email sent successfully!");
          } catch (error) {
            console.error("Error uploading file:", error);
            alert("Error sending email.");
          }
        };

        const handleViewHistory = () => {
          navigate(`/email-history/${row.original.leadid}`, { state: { email: row.original.email } });
        };


        return (
          <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "nowrap" }}>
            {emailSent ? (
              <button
                onClick={handleViewHistory}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "5px" }}
              >
                <FaHistory size={16} color="blue" />
              </button>
            ) : (
              <>
                <input type="file" onChange={handleFileChange} style={{ width: "100px" }} />
                <button
                  onClick={handleUpload}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "5px" }}
                >
                  <FaSave size={16} color="green" /> {/* Reduced icon size */}
                </button>
              </>
            )}
          </div>
        );
      },
    },
    {
      Header: "Manager ",
      Cell: ({ row }) => {
        const assignedManagerId = row.original.managerid || "";
        const assignedManagerName = row.original.assign_to_manager || "";

        const [selectedManager, setSelectedManager] = useState(
          assignedManagerId ? `${assignedManagerId}|${assignedManagerName}` : ""
        );
        const [showIcon, setShowIcon] = useState(false);

        useEffect(() => {
          setSelectedManager(
            assignedManagerId ? `${assignedManagerId}|${assignedManagerName}` : ""
          );
          setShowIcon(false);
        }, [assignedManagerId, assignedManagerName]);

        const handleChange = (e) => {
          const newValue = e.target.value;
          setSelectedManager(newValue);
          setShowIcon(newValue !== `${assignedManagerId}|${assignedManagerName}`);
        };

        const handleAssignClick = async () => {
          if (selectedManager) {
            const [managerid, assignee] = selectedManager.split("|");

            if (selectedManager == "self") {
              // Call the new API for self assignment
              await handleSelfAssign(row.original.leadid);
            } else {
              handleAssignToChange(assignee, row.original.leadid, managerid, row.original.status,);
            }

            // await handleAssignToChange(assignee, row.original.leadid, managerid);

            // ✅ Update row data manually to trigger re-render
            row.original.managerid = managerid;
            row.original.assign_to_manager = assignee;

            // ✅ Update state to reflect change instantly
            setSelectedManager(`${managerid}|${assignee}`);
            setShowIcon(false);
          }
        };

        return (
          <div className="d-flex align-items-center" style={{ fontSize: fontSize }}>
            <select
              value={selectedManager}
              onChange={handleChange}
              className="form-select me-2"
              style={{ maxWidth: "150px", fontSize: fontSize }}
            >
              <option value="">Select Assignee</option>
              <option value="self">Self</option>
              {managers.map((manager, index) => (
                <option key={index} value={`${manager.id}|${manager.name}`}>
                  {manager.name}
                </option>
              ))}
            </select>
            {showIcon && (
              <HiUserGroup
                style={{ color: "#ff9966", cursor: "pointer", fontSize: "18px" }}
                onClick={handleAssignClick}
              />
            )}
          </div>
        );
      },
    },

    {
      Header: "Associate",
      Cell: ({ row }) => {
        const initialAssociateValue = row.original.assignedSalesId
          ? `${row.original.assignedSalesId}|${row.original.assignedSalesName}`
          : "";

        const [selectedAssociate, setSelectedAssociate] = useState(initialAssociateValue);
        const [showIcon, setShowIcon] = useState(false);

        const managerId = row.original.managerid;
        const associates = managerId ? associatesByManager[managerId] || [] : [];

        useEffect(() => {
          setSelectedAssociate(initialAssociateValue);
          setShowIcon(false);
        }, [row.original.assignedSalesId, row.original.assignedSalesName]);

        const handleChange = (e) => {
          const newValue = e.target.value;
          setSelectedAssociate(newValue);
          setShowIcon(newValue !== initialAssociateValue);
        };

        const handleAssignClick = async () => {
          if (selectedAssociate) {
            const [associateId, associateName] = selectedAssociate.split("|");
            await handleAssignLead(row.original.leadid, { id: associateId, name: associateName }, row.original.status);
            // No need to update row.original directly; state is already updated in handleAssignLead
            setShowIcon(false);
          }
        };

        return (
          <div className="d-flex align-items-center" style={{ fontSize: fontSize }}>
            <select
              value={selectedAssociate}
              onChange={handleChange}
              className="form-select me-2" style={{ fontSize: fontSize }}
            >
              <option value="">Select Associate</option>
              {associates.map((associate, index) => (
                <option key={index} value={`${associate.id}|${associate.name}`}>
                  {associate.name}
                </option>
              ))}
            </select>
            {showIcon && (
              <HiUserGroup
                style={{ color: "#ff9966", cursor: "pointer", fontSize: "18px" }}
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
          <FaEye style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/a-details/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
          <FaTrash style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => handleArchive(row.original.leadid)} />
          <FaComment style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/a-opportunity-comments/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
        </div>
      ),
    },

  ], [dropdownOptions]);

  // const uniqueDestinations = useMemo(() => {
  //   const normalizedDestinations = data.map((item) => item.travel_destination.trim().toLowerCase());
  //   const uniqueNormalizedDestinations = [...new Set(normalizedDestinations)];
  //   return uniqueNormalizedDestinations.map((dest) => dest.charAt(0).toUpperCase() + dest.slice(1));
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

  // Extract team members for the selected manager
  const teamMembers = useMemo(() => {
    if (!filterManager) return [];
    const selectedManager = managers.find((manager) => manager.name.toLowerCase() == filterManager.toLowerCase());
    return selectedManager ? selectedManager.teamMembers : [];
  }, [filterManager, managers]);

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
              <input type="text" className="form-control" placeholder="Free Text Search..." value={searchTerm} 
              onChange={(e) => {
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
                  }}
                  style={{ cursor: "pointer", fontSize: "1.5rem" }}
                  title="Hide Date Range"
                />
              ) : (
                <FaCalendarAlt 
                onClick={() => {
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