import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/Sales-ExecutiveNavbar/Navbar";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { FaEdit, FaEye, FaComment, FaTrash } from "react-icons/fa";
import {  Row, Col, } from "react-bootstrap";
import DataTable from "../../../Layout/Table/TableLayout"; 
import baseURL from "../../../Apiservices/Api";
import './PotentialLeads.css';
import axios from 'axios';

const Potentialleads = () => {
  const [message, setMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/allleads`);
      if (response.status === 200) {
       
        const filteredLeads = response.data.filter(lead => lead.status === 'opportunity');
        setData(filteredLeads); 
      } else {
        console.error('Error fetching leads:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      alert('Failed to fetch leads.');
    }
  };
  useEffect(() => {
    fetchLeads();
  }, []);

  const [loading, setLoading] = useState(false);
  const [isPrimaryChanged, setIsPrimaryChanged] = useState(false);
  const [isSecondaryChanged, setIsSecondaryChanged] = useState(false);
  const [dropdownOptions] = useState({
    primary: ["In Progress", "Confirmed", "Lost", "Duplicate", "Cancelled"],
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
      Cancelled: ["Force Majeure", "Medical Urgency", "Personal Reason"],
    },
  });

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) => {
      const updatedData = prevData.map((row) =>
        row.leadid === rowId
          ? {
            ...row,
            opportunity_status1: value,
            opportunity_status2: "",
          }
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
        row.leadid === rowId ? { ...row, opportunity_status2: value } : row
      );
      const primaryStatus = updatedData.find((row) => row.leadid === rowId).opportunity_status1;
      
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
  
    try {
      const response = await axios.put(`${baseURL}/api/update-status/${leadId}`, body);
      
      if (response.status === 200) {
       
        let statusChangeMessage = '';
  
        if (primaryStatus && secondaryStatus) {
          statusChangeMessage = 'Both statuses updated successfully!';
        } else if (primaryStatus) {
          statusChangeMessage = 'Primary status updated successfully!';
        } else if (secondaryStatus) {
          statusChangeMessage = 'Secondary status updated successfully!';
        }
  
        // Only show the SweetAlert if both statuses have been updated
        if (primaryStatus && secondaryStatus) {
        
          setMessage(statusChangeMessage)
        }
  
        console.log('Status updated:', response.data);
      } else {
        console.error('Failed to update status:', response.data);
        
        setMessage('Failed to update status. Please try again.')
      }
    } catch (error) {
      console.error('Error updating status:', error);
    
    
      setMessage('An error occurred while updating the status. Please try again.')
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
  const columns = useMemo(
    () => [
      // {
      //   Header: "S.No",
      //   accessor: (row, index) => index + 1,
      // },
      {
        Header: "Lead Id ",
        accessor: "leadcode",
        Cell: ({ row }) => (
          <span
            className="name-link"
            onClick={() => navigateToLead(row.original.leadid)}
            style={{ cursor: "pointer" }}
          >
            {row.original.lead_type}
          </span>
        ),
      },
      {
        Header: "Opportunity Type",
        accessor: "lead_type",
        Cell: ({ row }) => (
          <span
            className="name-link"
            onClick={() => navigateToLead(row.original.leadid)}
            style={{ cursor: "pointer" }}
          >
            {row.original.lead_type}
          </span>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <span
            className="name-link"
            onClick={() => navigateToLead(row.original.leadid)}
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
          >
            {row.original.name}
          </span>
        ),
      },
      {
        Header: "Mobile No",
        accessor: "phone_number",
        Cell: ({ row }) => (
          <span className="name-link"
            onClick={() => navigateToLead(row.original.leadid)}
            style={{ cursor: "pointer" }}
          >
            {row.original.phone_number}
          </span>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ row }) => (
          <span
            className="name-link"
            onClick={() => navigateToLead(row.original.leadid)}
            style={{ cursor: "pointer" }}
          >
            {row.original.email}
          </span>
        ),
      },
      {
        Header: "Opportunity Status 1",
        accessor: "opportunity_status1",
        Cell: ({ row }) => (
          <select
            value={row.original.opportunity_status1}
            onChange={(e) => handlePrimaryStatusChange(e.target.value, row.original.leadid)}
            className="form-select"
          >
            <option value="">Select Status</option>
            {dropdownOptions.primary.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ),
      },
      {
        Header: "Opportunity Status 2",
        accessor: "opportunity_status2",
        Cell: ({ row }) => (
          <select
            value={row.original.opportunity_status2}
            onChange={(e) => handleSecondaryStatusChange(e.target.value, row.original.leadid)}
            className="form-select"
            disabled={!row.original.opportunity_status1} // Disable until a primary status is selected
          >
            <option value="">Select Status</option>
            {dropdownOptions.secondary[row.original.opportunity_status1]?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ),
      },
      {
        Header: "Action",
        Cell: ({ row }) => (
          <div>
            <button
              className="btn btn-warning edit-button me-1 mb-1"
              onClick={() => handleEdit(row.original.leadid)}
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-info view-button me-1"
              onClick={() =>navigateToLead(row.original.leadid)}
            >
              <FaEye />
            </button>
            <button
              className="btn btn-danger delete-button me-1 mb-1"
              onClick={() => handleDelete(row.original.leadid)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
      {
        Header: 'Comments',
        accessor: 'comments',
        Cell: ({ row }) => (
          <button
            className="btn btn-info"
            onClick={() => {
              navigate(`/comments/${row.original.leadid}`);
            }}
          >
            <FaComment />
          </button>
        ),
      }
    ],
    [dropdownOptions]
  );

  return (
    <div className="salesOpportunitycontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesOpportunity ${collapsed ? "collapsed" : ""}`}>
        <div className="potentialleads-table-container">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center">
              <h3>Opportunity Details</h3>
              {message && <div className="alert alert-info">{message}</div>} {/* Display message */}

            </Col>
          </Row>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Potentialleads;