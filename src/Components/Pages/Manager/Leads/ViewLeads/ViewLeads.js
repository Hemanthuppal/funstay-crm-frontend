import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from './../../../../Layout/Table/TableLayout';
import { FaEdit, FaTrash, FaEye,FaUserPlus,FaComment } from 'react-icons/fa';
import { Button, Row, Col,Modal } from 'react-bootstrap';
import Navbar from '../../../../Shared/ManagerNavbar/Navbar';
import EditLead from './EditLead'; // Import the EditLead modal
import LeadView from './LeadView'; 
import './ViewLeads.css'
const ViewLeads = () => {
  const navigate = useNavigate();
const [collapsed, setCollapsed] = useState(false);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [leadForFollowup, setLeadForFollowup] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);



  const handleEdit = (lead) => {
    setSelectedLead(lead);
    setShowEditModal(true);
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
    setShowViewModal(true);
  };

  const handleSaveEdit = (updatedLead) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.leadid === updatedLead.leadid ? updatedLead : item
      )
    );
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    setData(data.filter((item) => item.leadid !== id));
  };

  const handleFollowup = (lead) => {
    setLeadForFollowup(lead);
    setShowFollowupModal(true);
  };
  const handleAddUser = (leadData) => {
    console.log("Add user functionality triggered for:", leadData);
    // Add your logic here, e.g., redirecting to a new page or opening a modal
  };
  
  const [data, setData] = useState([
    {
      leadid: 1,
      leadname: 'John Doe',
      mobile: '1234567890',
      email: 'john.doe@example.com',
      leadstatus: 'New Lead',
      source: 'Facebook',
      assignedTo: '',
    },
    {
      leadid: 2,
      leadname: 'Jane Smith',
      mobile: '9876543210',
      email: 'jane.smith@example.com',
      leadstatus: 'Junk Lead',
      source: 'Facebook',
      assignedTo: '',
    },
    {
      leadid: 3,
      leadname: 'Alice Brown',
      mobile: '5556667777',
      email: 'alice.brown@example.com',
      leadstatus: 'Qualified',
      source: 'LinkedIn',
      assignedTo: '',
    },
    {
      leadid: 4,
      leadname: 'Michael Green',
      mobile: '2223334444',
      email: 'michael.green@example.com',
      leadstatus: 'Qualified',
      source: 'Google Ads',
      assignedTo: '',
    },
    {
      leadid: 5,
      leadname: 'Emily White',
      mobile: '9998887777',
      email: 'emily.white@example.com',
      leadstatus: 'No Response',
      source: 'Referral',
      assignedTo: '',
    },
    {
      leadid: 6,
      leadname: 'David Black',
      mobile: '6665554444',
      email: 'david.black@example.com',
      leadstatus: 'Disqualified',
      source: 'Event',
      assignedTo: '',
    },
  ]);
  const handleAssignToChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId ? { ...row, assignedTo: value } : row
      )
    );
  };
  const [dropdownOptions, setDropdownOptions] = useState({
    primary: ['New', 'No Response', 'Duplicate', 'False Lead', 'Lost'],
    secondary: {
      'New': ['Yet to Contact', 'Not picking up call ','Asked to call alter'],
      'No Response': ['No Response'],
      'Duplicate': ['Duplicate'],
      'False Lead': ['False Lead'],
      'Lost': ['Plan Cancelled', 'Plan Delayed','Already Booked','Others'],
    },
    assignTo: ['Alice Johnson', 'Bob Smith', 'Charlie Brown'],
  });
  const sampleComments = [
    { text: 'Follow-up call scheduled.', time: '2025-01-11 10:30 AM' },
    { text: 'Sent quotation for the project.', time: '2025-01-10 4:15 PM' },
    { text: 'Customer requested additional details.', time: '2025-01-09 2:45 PM' },
  ];

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId
          ? {
              ...row,
              primaryStatus: value,
              secondaryStatus: '', // Reset secondary status on primary change
            }
          : row
      )
    );
  };

  const handleSecondaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.leadid === rowId ? { ...row, secondaryStatus: value } : row
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Lead ID',
        accessor: 'leadid',
      },
      {
        Header: 'Lead Name',
        accessor: 'leadname',
      },
      {
        Header: 'Mobile No',
        accessor: 'mobile',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Lead Status',
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
              {(dropdownOptions.secondary[row.original.primaryStatus] || []).map(
                (option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                )
              )}
            </select>
          </div>
        ),
      },
      
      {
        Header: 'Source',
        accessor: 'source',
      },
      {
        Header: 'Assign To',
        Cell: ({ row }) => (
          <select
            value={row.original.assignedTo}
            onChange={(e) =>
              handleAssignToChange(e.target.value, row.original.leadid)
            }
            className="form-select"
          >
            <option value="">Select Assignee</option>
            {dropdownOptions.assignTo.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <button
className="btn btn-warning edit-button me-1 mb-1"
              onClick={() => handleEdit(row.original)}
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
               onClick={() => handleView(row.original)}
            >
              <FaEye />
            </button>
            {/* <button
              className="add-user-btn add-user-button"
              onClick={() => handleAddUser(row.original)}
            >
              <FaUserPlus />
            </button> */}
          </div>

        ),
      },
      {
        Header: 'Comments',
        accessor: 'comments',
        Cell: ({ row }) => (
          <button
            className="btn btn-info "
            onClick={() => {
              setSelectedLead(row.original);
              setShowCommentsModal(true);
            }}
          >
            <FaComment />
          </button>
        ),
      }
      ,
    ],
    [dropdownOptions]
  );

  

  return (
    <div className="manager-ViewLeadcontainer">
    <Navbar onToggleSidebar={setCollapsed} />
    <div className={`manager-ViewLead ${collapsed ? "collapsed" : ""}`}>
      <div className="manager-ViewLead-container mb-5">
        <div className="manager-ViewLead-table-container">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center">
              <h3>Lead Details</h3>
              {/* // <Button onClick={() => console.log('Add Lead')}>Add Lead</Button> */}
            </Col>
          </Row>
          <DataTable columns={columns} data={data} />
        </div>
        <Modal show={showCommentsModal} onHide={() => setShowCommentsModal(false)} size="lg">
              <Modal.Header closeButton className='comment-modal-header'>
                <Modal.Title>
                  <div className="d-flex justify-content-between align-items-center w-100">
                    <span>Comments</span>
                    <span className="text-muted">{selectedLead?.opportunityid}</span>
                  </div>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {sampleComments.map((comment, index) => (
                  <div key={index} className="mb-3">
                    <p className="text-muted mb-1">{comment.time}</p>
                    <p>{comment.text}</p>
                  </div>
                ))}
              </Modal.Body>
              <Modal.Footer className="opp-modal-footer">
                <Button className='opp-comment-btn-secondary' onClick={() => setShowCommentsModal(false)}>
                  Close
                </Button>
                <Button className='opp-comment-btn-primary' onClick={() => alert('Update action')}>
                  Update
                </Button>
              </Modal.Footer>
            </Modal>
        {selectedLead && (
        <>
          <EditLead
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            lead={selectedLead}
            handleSave={handleSaveEdit}
          />
          <LeadView
            show={showViewModal}
            handleClose={() => setShowViewModal(false)}
            lead={selectedLead}
          />
        </>
      )}
      </div>
    </div></div>
  );
};

export default ViewLeads;
