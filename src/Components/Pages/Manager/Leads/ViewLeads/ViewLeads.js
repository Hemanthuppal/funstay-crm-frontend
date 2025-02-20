import React, { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "./../../../../Layout/Table/TableLayout";
import { Button, Row, Col, Form } from "react-bootstrap";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import { FaEdit, FaTrash, FaEye, FaUserPlus, FaComment ,FaSyncAlt,FaCopy} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import "./ViewLeads.css";
import axios from "axios";
import { AuthContext } from "../../../../AuthContext/AuthContext";
import { baseURL } from "../../../../Apiservices/Api";
import { webhookUrl } from "../../../../Apiservices/Api";

const ViewLeads = () => {
  const [message, setMessage] = useState('');
  const { authToken, userId, managerId, userName } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);  // Optional: Show a message
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });};
  
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${webhookUrl}/api/enquiries`);
        const data = await response.json();
        const filteredData = data.filter((enquiry) => enquiry.managerid == userId && enquiry.status == "lead");
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
    navigate(`/m-edit-lead/${leadId}`, {
      state: { leadid: leadId },
    });
  };

  const handleAddUser = (lead) => {
    navigate(`/m-create-customer-opportunity/${lead.leadid}`);
  };
  const handleAddLead = () => {
    navigate('/m-add-leads');
  };


  const handleViewLeads = (lead) => {
    navigate(`/m-view-lead/${lead.leadid}`, {
      state: { leadid: lead.leadid },
    });
  };

  const handleDelete = async (leadid) => {
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

  
  const handleAssignLead = async (leadid, employeeId) => {
    const selectedEmp = employees.find((emp) => emp.id === parseInt(employeeId));
    const employeeName = selectedEmp ? selectedEmp.name : "";

    if (!employeeName) {
      setMessage("Please select a valid employee.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    console.log(leadid, employeeId, employeeName,  userName);
    try {
      const response = await axios.post(`${baseURL}/api/assign-lead`, {
        leadid,
        employeeId,
        employeeName,
        userId,
        userName
      });
      setMessage(response.data.message);
      setTimeout(() => setMessage(""), 3000);
    
      setData((prevData) =>
        prevData.map((lead) =>
          lead.leadid === leadid ? { ...lead, assignedSalesName: employeeName } : lead
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
                 {row.original.phone_number}
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
          const primaryStatus = row.original.primaryStatus;
          const secondaryStatus = row.original.secondaryStatus;
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
        Header: "Assign",
        accessor: "id",
        Cell: ({ cell: { row } }) => {
          const assignedSalesId = row.original.assignedSalesId || "";
          const [selectedEmployee, setSelectedEmployee] = useState(assignedSalesId);
          const [showIcon, setShowIcon] = useState(false);
      
          const handleChange = (e) => {
            const newValue = e.target.value;
            setSelectedEmployee(newValue);
            setShowIcon(newValue !== assignedSalesId); // Show icon only if selection changes
          };
      
          const handleAssignClick = () => {
            if (selectedEmployee) {
              handleAssignLead(row.original.leadid, selectedEmployee);
              setShowIcon(false); // Hide icon after assignment
            } else {
              setMessage("Please select an employee to assign the lead.");
              setTimeout(() => setMessage(""), 3000);
            }
          };
      
          return (
            <div className="d-flex align-items-center">
              <Form.Select
                value={selectedEmployee}
                onChange={handleChange}
                className="me-2"
              >
                <option value="">Select Employee</option>
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
            <FaTrash
              style={{ color: "#ff9966", cursor: "pointer" }}
              onClick={() => handleDelete(row.original.leadid)}
            />
            <FaUserPlus
              style={{ color: "ff9966", cursor: "pointer" }}
              onClick={() => handleAddUser(row.original)}
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