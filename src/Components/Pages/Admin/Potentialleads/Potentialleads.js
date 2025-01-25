import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../../Shared/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { FaEdit, FaEye ,FaComment } from 'react-icons/fa';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import DataTable from '../../../Layout/Table/TableLayout'; // Import the reusable DataTable component
import FollowupModal from './Followup';
import './PotentialLeads.css';
import EditOppLead from './EditOppLead';
import LeadOppView from './LeadOppView';

const AdminDashboard = () => {
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [leadForFollowup, setLeadForFollowup] = useState(null);
const [collapsed, setCollapsed] = useState(false);
const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);




  const navigate = useNavigate();
  const [data, setData] = useState([
    { id: 1, opportunityid: 'OPP001', customerid: 'CUST001', name: 'Maniteja', mobile: '1234567890', email: 'mani.@example.com', opportunitystatus: 'In Progress', quotation: 'QUO006', comments: 'Comment1' },
    { id: 2, opportunityid: 'OPP002', customerid: 'CUST002', name: 'Rajesh', mobile: '9876543210', email: 'raj.@example.com', opportunitystatus: 'Confirmed', quotation: 'QUO007', comments: 'Comment2' },
    { id: 3, opportunityid: 'OPP003', customerid: 'CUST003', name: 'Sharvani', mobile: '5556667777', email: 'sharvani.@example.com', opportunitystatus: 'Lost', quotation: 'QUO008', comments: 'Comment3' },
    { id: 4, opportunityid: 'OPP004', customerid: 'CUST004', name: 'Hemanth', mobile: '9988776655', email: 'hemanth.@example.com', opportunitystatus: 'Cancelled', quotation: 'QUO009', comments: 'Comment4' },
  ]);

  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [dropdownOptions, setDropdownOptions] = useState({
    primary: ['In Progress', 'Confirmed', 'Lost', 'Duplicate', 'Cancelled'],
    secondary: {
      'In Progress': ['Understood Requirement', 'Sent first quote', 'Sent amended quote' ,'Negotiation Process', 'Verbally Confirmed-Awaiting token amount'],
      'Confirmed': ['Upcoming Trip','Ongoing Trip','Trip Completed'],
      'Lost': ['Plan Cancelled','Plan Postponed','High Quote','Low Budget','No response','Options not available','just checking price','Booked from other source','Delay in quote','Concern about reliability/trust','Did not like payment terms','Did not like cancellation policy','Booked different option from us'],
      'Duplicate': ['Duplicate'],
      'Cancelled':['Force Majeure','Medical Urgency','Personal Reason']},});
const sampleComments = [
  { text: 'Follow-up call scheduled.', time: '2025-01-11 10:30 AM' },
  { text: 'Sent quotation for the project.', time: '2025-01-10 4:15 PM' },
  { text: 'Customer requested additional details.', time: '2025-01-09 2:45 PM' },
];

  const handlePrimaryStatusChange = (value, rowId) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.opportunityid === rowId
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
        row.opportunityid === rowId ? { ...row, secondaryStatus: value } : row
  ));
};
  const columns = useMemo(
    () => [
      { Header: 'Opportunity ID', accessor: 'opportunityid' },
      // { Header: 'Customer ID', accessor: 'customerid' },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <span
            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
            onClick={() => navigate(`/a-potential-leads/${row.original.opportunityid}`)}
          >
            {row.original.name}
          </span>
        ),
      },          { Header: 'Mobile No', accessor: 'mobile' },
      { Header: 'Email', accessor: 'email' },
      {
        Header: 'Opportunity Status',
        Cell: ({ row }) => (
          <div className="d-flex align-items-center">
            {/* Primary Dropdown */}
            <select
              value={row.original.primaryStatus}
              onChange={(e) =>
                handlePrimaryStatusChange(e.target.value, row.original.opportunityid)
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
                handleSecondaryStatusChange(e.target.value, row.original.opportunityid)
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
  ),},
      { Header: 'Quotation', accessor: 'quotation' },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <div>
            <button className="btn btn-warning edit-button mb-1" onClick={() => handleEdit(row.original)}>
              <FaEdit />
            </button>
            <button className="btn btn-info view-button" onClick={() => handleView(row.original)}>
              <FaEye />
            </button>
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
    ],
    [dropdownOptions]
  );

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
    const handleCloseViewModal = () => {
      setShowViewModal(false);
    };

  return (
    <div className="Admin-ViewOpportunitycontainer">
    <Navbar onToggleSidebar={setCollapsed} />
    <div className={`Admin-ViewOpportunity ${collapsed ? "collapsed" : ""}`}>
      <div className="Admin-ViewOpportunity-table-container">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <h3>Opportunity Leads</h3>
          </Col>
        </Row>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>
      {/* comment modal */}
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


      <FollowupModal
        show={showFollowupModal}
        onHide={() => setShowFollowupModal(false)}
        leadName={leadForFollowup?.name}
      />
      {selectedLead && (
          <>
            <EditOppLead
              show={showEditModal}
              handleClose={() => setShowEditModal(false)}
              lead={selectedLead}
              handleSave={handleSaveEdit}
            />
            <LeadOppView
              show={showViewModal}
              handleClose={() => setShowViewModal(false)}
              lead={selectedLead}
            />
          </>
        )}
    </div>
    </div>
  );
};

export default AdminDashboard;
