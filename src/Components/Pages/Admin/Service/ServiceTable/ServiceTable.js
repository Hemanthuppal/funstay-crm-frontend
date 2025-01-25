import React, { useState } from "react";
import DataTable from "./../../../../Layout/Table/TableLayout"; // Import your DataTable component
import { Modal, Button, Form, Row, Col } from "react-bootstrap"; // Import necessary components from react-bootstrap
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // For edit and delete icons
import './ServiceTable.css';
import Navbar from "./../../../../Shared/Navbar/Navbar";
import InputField from "./../../../../Layout/Form/InputField"; 

const Adminservice = () => {
  const [data, setData] = useState([
    {
      sNo: 1,
      package: "Leh Ladakh Tour Package",
      duration: "7 days",
      noOfPersons: "2",
      amount: "$1500",
      description: "Explore the beauty of Leh and Ladakh, including visits to Pangong Lake, Nubra Valley, and more.",
    },
    {
      sNo: 2,
      package: "Goa Beach Holiday",
      duration: "5 days",
      noOfPersons: "4",
      amount: "$1200",
      description: "Relax on the sunny beaches of Goa with a visit to the best beach spots and local attractions.",
    },
    {
      sNo: 3,
      package: "Rajasthan Heritage Tour",
      duration: "10 days",
      noOfPersons: "3",
      amount: "$1800",
      description: "Experience Rajasthan’s culture, history, and architecture with visits to Jaipur, Udaipur, and Jodhpur.",
    },
    {
      sNo: 4,
      package: "Kerala Backwaters Tour",
      duration: "6 days",
      noOfPersons: "2",
      amount: "$1300",
      description: "A peaceful and relaxing tour of Kerala’s famous backwaters, including houseboat cruises and cultural experiences.",
    },
  ]);

  const [showModal, setShowModal] = useState(false); // To control modal visibility
  const [currentService, setCurrentService] = useState(null); // To store current service data for editing

  const handleShowModal = (service = null) => {
    setCurrentService(service);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentService(null); // Clear the form when modal is closed
  };

  const handleSave = () => {
    if (currentService) {
      // Edit existing service
      setData(prevData =>
        prevData.map(item =>
          item.sNo === currentService.sNo ? currentService : item
        )
      );
    } else {
      // Add new service (e.g., auto-generate a new `sNo`)
      setData(prevData => [
        ...prevData,
        { ...currentService, sNo: prevData.length + 1 },
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (sNo) => {
    setData(prevData => prevData.filter(item => item.sNo !== sNo));
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: "sNo",
      },
      {
        Header: "Package",
        accessor: "package",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "No. of Persons",
        accessor: "noOfPersons",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="d-flex">
            <Button
              variant="warning"
              onClick={() => handleShowModal(row.original)}
              className="me-2"
            >
              <FaEdit />
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(row.original.sNo)}
            >
              <FaTrashAlt />
            </Button>
          </div>
        ),
      },
    ],
    [data]
  );
const [formData, setFormData] = useState({
    package: "",
    duration: "",
    noOfPersons: "",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log(formData);
  };
  return (
    <div>
    <Navbar/>
      <div className="adminservice-container mb-5">
        <div className="adminservice-table-container">
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center">
              <h3>Trip Package Details</h3>
              <Button onClick={() => handleShowModal()}>Add Service</Button>
            </Col>
          </Row>
          <DataTable columns={columns} data={data} />
        </div>
      </div>

      {/* Modal for Adding/Editing Service */}
      <Modal show={showModal} size="lg" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentService ? "Edit Service" : "Add Service"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        
      <div className="text-center py-2 rounded-top bg-warning text-dark fw-bold">Services</div>
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="row mb-3">
          <div className="col-md-6">
            <InputField
              label="Package"
              type="text"
              placeholder="Enter package"
              value={formData.package}
              onChange={handleChange}
              name="package"
              required
            />
          </div>
          <div className="col-md-6">
            <InputField
              label="Duration"
              type="text"
              placeholder="Enter duration"
              value={formData.duration}
              onChange={handleChange}
              name="duration"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-3">
          <div className="col-md-6">
            <InputField
              label="No. of Persons"
              type="number"
              placeholder="Enter number of persons"
              value={formData.noOfPersons}
              onChange={handleChange}
              name="noOfPersons"
              required
            />
          </div>
          <div className="col-md-6">
            <InputField
              label="Amount"
              type="text"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              name="amount"
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="row mb-3">
          <div className="col-12">
            <InputField
              label="Description"
              type="textarea"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              name="description"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-warning text-dark fw-bold">Submit</button>
        </div>
      </form>
  
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={handleSave}>
            {currentService ? "Save Changes" : "Add Service"}
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Adminservice;
