import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./../../../../Layout/Table/TableLayout";
import { FaEdit, FaTrash, FaEye, FaUser, FaUserPlus, FaComment } from "react-icons/fa";
import { Button, Row, Col } from "react-bootstrap";
import Navbar from "../../../../Shared/Sales-ExecutiveNavbar/Navbar";
import "./ViewLeads.css";
import axios from 'axios';
import baseURL from "../../../../Apiservices/Api";
import { io } from 'socket.io-client';

const ViewLeads = () => {
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);

  const handleEdit = (leadId) => {
    navigate(`/edit-lead/${leadId}`, {
      state: { leadid: leadId },
    });
  };

  const handleAddUser  = (lead) => {
    navigate(`/create-customer-opportunity/${lead.leadid}`);
  };

  const handleAddLead = () => {
    navigate('/add-lead');
  };

  const handleDelete = async (leadid) => {
    try {
      const response = await fetch(`${baseURL}/api/deleteByLeadId/${leadid}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setData((prevData) => prevData.filter((item) => item.leadid !== leadid));
        setMessage('The lead has been deleted successfully.');
      } else {
        setMessage('Failed to delete the lead. Please try again later.');
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An unexpected error occurred while deleting the lead.');
    }
  };

  const dropdownOptions = {
    primary: ["New", "No Response", "Duplicate", "False Lead", "Lost"],
    secondary: {
      New: ["Yet to Contact", "Not picking up call", "Asked to call later"],
      "No Response": [],
      Duplicate: [],
      "False Lead": [],
      Lost: ["Plan Cancelled", "Plan Delayed", "Already Booked", "Others"],
    },
  };

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId
          ? {
              ...row,
              primaryStatus: value,
              secondaryStatus: "", // Reset secondary status when primary changes
            }
          : row
      )
    );
    const lead = data.find((lead) => lead.leadid === rowId);
    updateLeadStatus(rowId, value, ""); // Update without secondary status
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

    try {
      const response = await axios.put(`${baseURL}/api/leads/status/${leadId}`, body);
      
      if (response.status === 200) {
        setMessage(response.data.message); // Use the message from the response
        console.log('Status updated:', response.data);
      } else {
        console.error('Failed to update status:', response.data);
        setMessage('Failed to update status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setMessage('An error occurred while updating the status. Please try again.');
    }
  };

  const initializeSocket = () => {
    // const socket = io('http://175.29.21.7:94', {
      const socket = io(' http://localhost:4000', {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    });
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setIsConnected(false);
    });
    socket.on('newEnquiry', (newEnquiry) => {
      console.log('Received new enquiry:', newEnquiry);
      setData((prevEnquiries) => [...prevEnquiries, newEnquiry]);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      const retryConnection = setInterval(() => {
        console.log('Retrying WebSocket connection...');
        socket.connect();
      }, 3000);
      socket.on('connect', () => {
        clearInterval(retryConnection);
      });
    });

    return socket;
  };

  useEffect(() => {
    const socket = initializeSocket();
    return () => {
      console.log('Component unmounted. Disconnecting WebSocket...');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log('Component mounted. Starting to fetch existing enquiries...');
    const fetchEnquiries = async () => {
      try {
        console.log('Fetching existing enquiries from server...');
        // const response = await fetch('http://175.29.21.7:94/enquiries');
        const response = await fetch('http://localhost:4000/enquiries');
        const data = await response.json();
        console.log('Enquiries fetched:', data);
        setData(data);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

  


  const handleViewLeads = (lead) => {
    navigate(`/view-lead/${lead.leadid}`, {
      state: { leadid: lead.leadid },
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,
      },
      {
        Header: "Lead Type",
        accessor: "lead_type",
      },
      {
        Header: "Lead Name",
        accessor: "name",
      },
      {
        Header: "Mobile No",
        accessor: "phone_number",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Lead Status",
        Cell: ({ row }) => {
          const primaryStatus = row.original.primaryStatus;
          const secondaryOptions = dropdownOptions.secondary[primaryStatus] || [];
          const isSecondaryDisabled = !primaryStatus || secondaryOptions.length === 0;

          return (
            <div className="d-flex align-items-center">
              <select
                value={primaryStatus}
                onChange={(e) =>
                  handlePrimaryStatusChange(e.target.value, row.original.leadid)
                }
                className="form-select me-2"
              >
                <option value="">Select Primary Status</option>
                {dropdownOptions.primary.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={row.original.secondaryStatus}
                onChange={(e) =>
                  handleSecondaryStatusChange(e.target.value, row.original.leadid)
                }
                className="form-select"
                disabled={isSecondaryDisabled} // Disable if no primary status or no secondary options
              >
                <option value="">Select Secondary Status</option>
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
        Header: "Source",
        accessor: "sources",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div>
            <button
              className="btn btn-warning edit-button me-1 mb-1"
              onClick={() => handleEdit(row.original.leadid)}
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-danger delete-button me-1 mb-1"
              onClick={() => handleDelete(row.original.leadid)}
            >
              <FaTrash />
            </button>
            <button
              className="btn btn-info view-button me-1"
              onClick={() => handleViewLeads(row.original)}
            >
              <FaEye />
            </button>
            <button
              className="btn btn-success add-user-button me-1"
              onClick={() => handleAddUser (row.original)}
            >
              <FaUser Plus />
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
      },
    ],
    [data]
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
                <Button onClick={handleAddLead}>Add Leads</Button>
              </Col>
            </Row>
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLeads;