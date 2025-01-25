import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './EditLead.css'; // Import the CSS file

const ManagereditLead = ({ show, handleClose, lead, handleSave }) => {
  const [formData, setFormData] = React.useState({ ...lead });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    handleSave(formData);
  };

  return (
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className='m-edit-lead-header'>
          <Modal.Title>Edit Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="m-edit-lead-FormLable">
                    {/* Customer Details Section */}
                    <h5>Customer Details</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Customer Name (optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email ID (optional)</Form.Label>
                          <Form.Control
                            type="email"
                            name="emailId"
                            value={formData.emailId}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>City (optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Country (optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Source</Form.Label>
                          <Form.Control
                            type="text"
                            name="source"
                            value={formData.ssource}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
          
                    <hr />
          
                    {/* Opportunity Details Section */}
                    <h5>Opportunity Details</h5>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Destination (optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="destination"
                            value={formData.destination}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Start Date (optional)</Form.Label>
                          <Form.Control
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>End Date (optional)</Form.Label>
                          <Form.Control
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Duration (Calculated)(optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>No of Adults (optional)</Form.Label>
                          <Form.Control
                            type="number"
                            name="adults"
                            value={formData.adults}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>No of Children (optional)</Form.Label>
                          <Form.Control
                            type="number"
                            name="children"
                            value={formData.children}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Child Age (Based on no.of child) (optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="childAge"
                            value={formData.childAge}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Approx Budget (optional)</Form.Label>
                          <Form.Control
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Assignee</Form.Label>
                          <Form.Control
                            type="text"
                            name="assignee"
                            value={formData.assignee}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Notes (optional)</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Comments with Date (optional)</Form.Label>
                          <Form.Control
                            type="text"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Reminder Setting (optional) </Form.Label>
                          <Form.Control
                            type="datetime-local"
                            name="reminder"
                            value={formData.reminder}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Form>
        </Modal.Body>
        <Modal.Footer className='m-edit-lead-footer'>
          <Button className='m-edit-lead-btn-secondary' onClick={handleClose}>
            Close
          </Button>
          <Button className='m-edit-lead-btn-primary' onClick={handleFormSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default ManagereditLead;
