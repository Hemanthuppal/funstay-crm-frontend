import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const FollowupModal = ({ show, onHide, leadName }) => {
  const [followups, setFollowups] = useState([
    {
      id: 1,
      tripName: 'Trip to Paris',
      startDate: '2025-01-10',
      endDate: '2025-01-15',
      duration: '5 days',
      description: 'Business meeting and client visit.',
    },
    {
      id: 2,
      tripName: 'Conference in London',
      startDate: '2025-02-20',
      endDate: '2025-02-22',
      duration: '2 days',
      description: 'Attending the annual tech conference.',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    duration: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFollowup = () => {
    setFollowups([...followups, { ...formData, id: followups.length + 1 }]);
    setShowForm(false);
    setFormData({
      tripName: '',
      startDate: '',
      endDate: '',
      duration: '',
      description: '',
    });
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Follow-ups for {leadName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!showForm ? (
          <>
            <Button className="mb-3" onClick={() => setShowForm(true)}>
              Add Follow-up
            </Button>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Trip Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {followups.length > 0 ? (
                  followups.map((followup, index) => (
                    <tr key={followup.id}>
                      <td>{followup.id}</td>
                      <td>{followup.tripName}</td>
                      <td>{followup.startDate}</td>
                      <td>{followup.endDate}</td>
                      <td>{followup.duration}</td>
                      <td>{followup.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No follow-ups available.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        ) : (
            <Form>
            <div className="row">
              {/* First Column */}
              <div className="col-6">
                <Form.Group controlId="tripName">
                  <Form.Label>Trip Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="tripName"
                    value={formData.tripName}
                    placeholder="Enter trip name"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
          
              <div className="col-6">
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
          
            <div className="row">
              {/* Second Column */}
              <div className="col-6">
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
          
              <div className="col-6">
                <Form.Group controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration"
                    value={formData.duration}
                    placeholder="Enter duration"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
          
            <div className="row">
              {/* Full-width Description */}
              <div className="col-12">
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    placeholder="Enter description"
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>
          
            <div className="row mt-3">
              <div className="col-12 text-end">
                <Button onClick={handleAddFollowup}>Save Follow-up</Button>
              </div>
            </div>
          </Form>
          
          
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowupModal;
