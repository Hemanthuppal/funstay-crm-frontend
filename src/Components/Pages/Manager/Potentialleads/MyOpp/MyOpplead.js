import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaEye, FaComment, FaTrash, FaCalendarAlt, FaTimes, FaCopy } from "react-icons/fa";
import { Row, Col ,Form} from "react-bootstrap";
import { HiUserGroup } from "react-icons/hi";
import DataTable from "../../../../Layout/Table/TableLayoutOpp";
import { baseURL } from "../../../../Apiservices/Api";
import './MyOppleads.css';
import axios from 'axios';
import { AuthContext } from '../../../../AuthContext/AuthContext';

const Potentialleads = () => { 
  const { authToken, userId,userName } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(localStorage.getItem("searchTerm-m") || "");
  const [filterStatus, setFilterStatus] = useState(localStorage.getItem("filterStatus-m") || "");
  const [filterDestination, setFilterDestination] = useState(localStorage.getItem("filterDestination-m") || "");
  const [filterOppStatus1, setFilterOppStatus1] = useState(localStorage.getItem("filterOppStatus1-m") || "In Progress");
  const [filterOppStatus2, setFilterOppStatus2] = useState(localStorage.getItem("filterOppStatus2-m") || "");
 
  const [filterAssignee, setFilterAssignee] = useState(localStorage.getItem("filterAssignee-m") || "");
  const [filterStartDate, setFilterStartDate] = useState(localStorage.getItem("filterStartDate-m") || "");
  const [filterEndDate, setFilterEndDate] = useState(localStorage.getItem("filterEndDate-m") || "");
  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState(localStorage.getItem("appliedFilterStartDate-m") || "");
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState(localStorage.getItem("appliedFilterEndDate-m") || "");
  const [showDateRange, setShowDateRange] = useState(false);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]); 

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/fetch-data`);
      if (response.status == 200) {
        const filteredLeads = response.data.filter(
          (enquiry) => enquiry.managerAssign == userId && enquiry.managerid == userId && enquiry.status == "opportunity"
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
    navigate(`/m-myedit-opportunity/${rowId}`, { state: { leadid: rowId } });
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

  

  useEffect(() => {
    localStorage.setItem("searchTerm-m", searchTerm);
    localStorage.setItem("filterStatus-m", filterStatus);
    localStorage.setItem("filterDestination-m", filterDestination);
    localStorage.setItem("filterOppStatus1-m", filterOppStatus1);
    localStorage.setItem("filterOppStatus2-m", filterOppStatus2);
   
    localStorage.setItem("filterAssignee-m", filterAssignee);
    localStorage.setItem("filterStartDate-m", filterStartDate);
    localStorage.setItem("filterEndDate-m", filterEndDate);
    localStorage.setItem("appliedFilterStartDate-m", appliedFilterStartDate);
    localStorage.setItem("appliedFilterEndDate-m", appliedFilterEndDate);
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
    localStorage.removeItem("potentialLeadsFilters-m");
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
          const end = new Date(appliedFilterEndDate);
          const createdAt = new Date(item.created_at);
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
        <div style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => navigate(`/m-mydetails/${row.original.leadid}`, { state: { leadid: row.original.leadid } })}>
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
        const secondaryOptions = dropdownOptions.secondary[primaryStatus] || [];
        const isSecondaryDisabled = !primaryStatus || secondaryOptions.length == 0;

        return (
          <div className="d-flex align-items-center gap-2">
            <select value={primaryStatus} onChange={(e) => handlePrimaryStatusChange(e.target.value, row.original.leadid)} className="form-select">
              <option value="">Select Primary Status</option>
              {dropdownOptions.primary.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select value={secondaryStatus} onChange={(e) => handleSecondaryStatusChange(e.target.value, row.original.leadid)} className="form-select" disabled={isSecondaryDisabled}>
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
          <FaEye style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/m-mydetails/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
          <FaTrash style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => handleDelete(row.original.leadid)} />
          <FaComment style={{ color: "#ff9966", cursor: "pointer" }} onClick={() => navigate(`/m-myopportunity-comments/${row.original.leadid}`, { state: { leadid: row.original.leadid } })} />
        </div>
      ),
    },
   
  ], [dropdownOptions]);

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
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={6} className="d-flex align-items-center gap-2">
              <input type="text" className="form-control" placeholder="Free Text Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              {showDateRange ? (
                <FaTimes
                  onClick={() => {
                    setShowDateRange(false);
                    setFilterStartDate("");
                    setFilterEndDate("");
                    setAppliedFilterStartDate("");
                    setAppliedFilterEndDate("");
                  }} style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Hide Date Range" />
              ) : (
                <FaCalendarAlt onClick={() => setShowDateRange(true)} style={{ cursor: "pointer", fontSize: "1.5rem" }} title="Show Date Range" />
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