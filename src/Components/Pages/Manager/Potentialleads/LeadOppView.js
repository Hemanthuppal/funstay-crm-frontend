import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import './LeadOppView.css'

const LeadOppView = ({ show, handleClose, lead }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className='m-LeadOppView-modal-header'>
        <Modal.Title>Lead Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Customer Details Section */}
          <Col md={6}>
            <h5>Customer Details</h5>
            <p><strong>Customer Name:</strong> {lead?.leadname}</p>
            <p><strong>Phone Number:</strong> {lead?.mobile}</p>
            <p><strong>Email ID:</strong> {lead?.email}</p>
            <p><strong>City:</strong> {lead?.city}</p>
            <p><strong>Country:</strong> {lead?.country}</p>
            <p><strong>Source:</strong> {lead?.source}</p>
            <hr />
            <h5>Opportunity Details</h5>
            <p><strong>Destination:</strong> {lead?.destination}</p>
            <p><strong>Start Date:</strong> {lead?.startdate}</p>
            <p><strong>End Date:</strong> {lead?.enddate}</p>
            <p><strong>Duration:</strong> {lead?.duration}</p>
            <p><strong>Number of Adults:</strong> {lead?.noofadults}</p>
            <p><strong>Number of Children:</strong> {lead?.noofchildren}</p>
            <p><strong>Child Age:</strong> {lead?.childage}</p>
            <p><strong>Approx Budget:</strong> {lead?.budget}</p>
            <p><strong>Assignee:</strong> {lead?.assignee}</p>
            <p><strong>Remainder Setting:</strong> {lead?.remainder}</p>
          </Col>

          <Col md={6}>
            <h5>Additional Details</h5>
            <p><strong>Notes: </strong>{lead?.notes}</p>
            <div className="m-Opp-Notesection"></div>
            <hr />
            <p><strong>Comments with Date: </strong>{lead?.comments}</p>
            <div className="m-Opp-Commentsection"></div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className='m-LeadOppView-footer'>
        <Button className='m-LeadOppView-btn-secondary' onClick={handleClose}>
          Close
        </Button>
        <Button className='m-LeadOppView-btn-primary' >Edit</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LeadOppView;
