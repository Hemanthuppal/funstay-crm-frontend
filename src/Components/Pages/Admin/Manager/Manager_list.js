import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from './../../../Layout/Table/TableLayout'; // Import the reusable DataTable component
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Row, Col, Modal } from 'react-bootstrap';
import AddLeads from './Manager'; // Import the DynamicForm component
import './Manager_list.css'
import Navbar from '../../../Shared/Navbar/Navbar';

const Manager = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', mobile: '1234567890', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', mobile: '9876543210', email: 'jane.smith@example.com' },
    { id: 3, name: 'Alice Brown', mobile: '5556667777', email: 'alice.brown@example.com' },
  ]); // Static data for table
  const [loading, setLoading] = useState(false); // Loading state is false as data is static
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedLead, setSelectedLead] = useState(null); // State to hold selected lead for editing

  const columns = useMemo(
    () => [
      {
        Header: 'Sr. No.',
        Cell: ({ row }) => row.index + 1, // Generate a sequential number based on the row index
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Action',
        Cell: ({ row }) => (
          <div>
            <button
              className="edit-btn edit-button"
              onClick={() => handleEdit(row.original)}
            >
              <FaEdit />
            </button>
            <button
              className="delete-btn delete-button"
              onClick={() => handleDelete(row.original.id)}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleEdit = (lead) => {
    setSelectedLead(lead); // Set the selected lead for editing
    setShowModal(true); // Show the modal
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
    setData(data.filter((item) => item.id !== id)); // Remove item from the data
  };

  const handleAddLead = () => {
    setSelectedLead(null); // Clear the selected lead, as it's for adding a new lead
    setShowModal(true); // Show the modal for adding a new lead
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedLead(null); // Reset selected lead
  };

  return (
    <div>
      <Navbar/>
    <div className="Manager_list-container mb-5">
      <div className="Manager_list-table-container">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <h3>Manager Details</h3>
            <Button onClick={handleAddLead}>Add Managers</Button> {/* Open modal for adding a new lead */}
          </Col>
        </Row>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </div>

      {/* Modal for editing or adding the lead */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedLead ? 'Edit Manager' : 'Add Manager'}</Modal.Title> {/* Change title based on action */}
        </Modal.Header>
        <Modal.Body>
          <AddLeads selectedLead={selectedLead} /> {/* Pass selectedLead as a prop */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={() => {}}>
            {selectedLead ? 'Save Changes' : 'Add Manager'} 
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default Manager;
