

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./../../../../Layout/Table/TableLayout";
import { FaEdit, FaTrash, FaEye, FaUserPlus, FaComment } from "react-icons/fa";
import { Button, Row, Col, Modal, Form } from "react-bootstrap";
import Navbar from "../../../../Shared/Sales-ExecutiveNavbar/Navbar";
import "./ViewLeads.css";
import axios from 'axios';
import baseURL from "../../../../Apiservices/Api";
import { io } from 'socket.io-client';

const ViewLeads = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [statusChangeCount, setStatusChangeCount] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [comments, setComments] = useState([]);
  const [existingNumbers, setExistingNumbers] = useState(new Set());
  const [data, setData] = useState([]);

  useEffect(() => {
    // Populate existing numbers when data is fetched
    const numbers = new Set(data.map((leadid) => leadid.phone_number));
    setExistingNumbers(numbers);
  }, [data]);
  const handleEdit = (leadId) => {
    navigate(`/edit-lead/${leadId}`, {
      state: { leadid: leadId },
    });
  };
  const handleView = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };
  const handleAddUser = (lead) => {
    // Navigate to CreateCustomerOpportunity and pass leadid
    navigate(`/create-customer-opportunity/${lead.leadid}`); // Adjust the path as necessary
  };
  const handleAddLead = () => {
    // Navigate to the Add Leads page
    navigate('/add-lead'); // Adjust the path as necessary
  };
  const handleDelete = async (leadid) => {
    const confirmDelete = window.confirm('Are you sure? You won\'t be able to revert this action!');

    if (confirmDelete) {
      try {
        const response = await fetch(`${baseURL}/api/deleteByLeadId/${leadid}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setData((prevData) => prevData.filter((item) => item.leadid !== leadid));
          alert('The lead has been deleted successfully.');
        } else {
          alert('Failed to delete the lead. Please try again later.');
        }
      } catch (error) {
        console.error("Error:", error);
        alert('An unexpected error occurred while deleting the lead.');
      }
    } else {
      alert('Delete action was canceled.');
    }
  };

  const [dropdownOptions, setDropdownOptions] = useState({
    primary: ["New", "No Response", "Duplicate", "False Lead", "Lost"],
    secondary: {
      New: ["Yet to Contact", "Not picking up call ", "Asked to call alter"],
      "No Response": ["No Response"],
      Duplicate: ["Duplicate"],
      "False Lead": ["False Lead"],
      Lost: ["Plan Cancelled", "Plan Delayed", "Already Booked", "Others"],
    },
  });
  useEffect(() => {
    if (selectedLead?.leadid) {
      axios
        .get(`${baseURL}/comments/${selectedLead.leadid}`) // Corrected template literal
        .then((response) => {
          // Sort the comments by timestamp in descending order in case backend order fails
          const sortedComments = response.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setComments(sortedComments);
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  }, [selectedLead]);
  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId
          ? {
            ...row,
            primaryStatus: value,
            secondaryStatus: "", // Reset secondary status on primary change
          }
          : row
      )
    );
    // Update status in the backend
    const lead = data.find((lead) => lead.leadid === rowId);
    updateLeadStatus(rowId, value, lead?.secondaryStatus || "");
    setStatusChangeCount((prev) => prev + 1); // Increment count for primary status change
  };

  const handleSecondaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId ? { ...row, secondaryStatus: value } : row
      )
    );
    // Update status in the backend
    const lead = data.find((lead) => lead.leadid === rowId);
    updateLeadStatus(rowId, lead?.primaryStatus || "", value);
    setStatusChangeCount((prev) => prev + 1); // Increment count for secondary status change
  };
  const updateLeadStatus = async (leadId, primaryStatus, secondaryStatus) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/leads/status/${leadId}`,
        {
          primaryStatus,
          secondaryStatus,
        }
      );

      if (response.status === 200) {
        setData((prevData) =>
          prevData.map((lead) =>
            lead.leadid === leadId
              ? { ...lead, primaryStatus, secondaryStatus }
              : lead
          )
        );

        setStatusChangeCount((prevCount) => ({
          ...prevCount,
          [leadId]: (prevCount[leadId] || 0) + 1,
        }));

        if ((statusChangeCount[leadId] || 0) + 1 === 2) {
          alert('Lead status updated successfully!');
          setStatusChangeCount((prevCount) => ({
            ...prevCount,
            [leadId]: 0,
          }));
        }
      } else {
        alert('Failed to update lead status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
      alert('An error occurred while updating the lead status. Please try again.');
    }
  };

  const initializeSocket = () => {
    const socket = io('http://localhost:4000', {
      transports: ['websocket'], // Force WebSocket transport
    });

    // Event listener for successful connection
    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
    });

    // Event listener for connection errors
    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setIsConnected(false);
    });

    // Event listener for new enquiry event
    socket.on('newEnquiry', (newEnquiry) => {
      console.log('Received new enquiry:', newEnquiry);
      setData((prevEnquiries) => [...prevEnquiries, newEnquiry]);
    });

    // Retry connection logic in case of an error
    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);

      // Attempt to reconnect every 3 seconds if disconnected
      const retryConnection = setInterval(() => {
        console.log('Retrying WebSocket connection...');
        socket.connect();
      }, 3000);

      // Clear retry logic when the socket reconnects
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
        const response = await fetch('http://175.29.21.7:94/enquiries');
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
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {/* Primary Dropdown */}
            <select
              value={row.original.primaryStatus}
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

            {/* Secondary Dropdown */}
            <select
              value={row.original.secondaryStatus}
              onChange={(e) =>
                handleSecondaryStatusChange(e.target.value, row.original.leadid)
              }
              className="form-select"
              disabled={!row.original.primaryStatus} // Disable until a primary status is selected
            >
              <option value="">Select Secondary Status</option>
              {(
                dropdownOptions.secondary[row.original.primaryStatus] || []
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        ),
      },

      {
        Header: "Source",
        accessor: "sources",
      },
      // {
      //   Header: "Customer Status",
      //   accessor: "customerstatus",
      //   Cell: ({ row }) => {
      //     // Logic to check if the number is new or existing
      //     const isExisting = data.some(
      //       (item) =>
      //         item.phone_number === row.original.phone_number &&
      //         item.leadid !== row.original.leadid // Ignore the current entry
      //     );
      //     return <span>{isExisting ? "Existing Customer" : "New Customer"}</span>;
      //   },
      // },
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
              onClick={() => handleAddUser(row.original)}
            >
              <FaUserPlus />
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
      ,
    ],
    [data]
    [dropdownOptions]
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
