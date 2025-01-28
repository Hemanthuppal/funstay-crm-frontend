import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./AddQuotationModal.css";

const AddQuotationModal = () => {
  const [quotationRows, setQuotationRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addRow = () => {
    const customerName = document.getElementById("customerName").value;
    const checkInDate = document.getElementById("checkInDate").value;
    const checkOutDate = document.getElementById("checkOutDate").value;
    const occupancy = document.getElementById("occupancy").value;

    const newRow = {
      customerName,
      checkInDate,
      checkOutDate,
      occupancy,
      gstRate: "",
      rowTotal: "",
    };

    setQuotationRows([...quotationRows, newRow]);
  };

  const updateTotal = () => {
    const totalAmount = quotationRows.reduce((sum, row) => {
      return sum + (parseFloat(row.rowTotal) || 0);
    }, 0);
    setTotal(totalAmount.toFixed(2));
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...quotationRows];
    updatedRows[index][field] = value;
    setQuotationRows(updatedRows);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add New Quotation
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" className="quotation">
        <Modal.Header closeButton>
          <Modal.Title>Add New Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="customerName" className="form-label">
                  Customer Name
                </label>
                <input type="text" className="form-control" id="customerName" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input type="email" className="form-control" id="email" required />
              </div>

              <div className="col-md-6">
                <label htmlFor="checkInDate" className="form-label">
                  Check In Date
                </label>
                <input type="date" className="form-control" id="checkInDate" required />
              </div>
              <div className="col-md-6">
                <label htmlFor="checkOutDate" className="form-label">
                  Check Out Date
                </label>
                <input type="date" className="form-control" id="checkOutDate" required />
              </div>

              <div className="col-12">
                <label htmlFor="occupancy" className="form-label">
                  Adults - Children
                </label>
                <input
                  type="text"
                  className="form-control" id="occupancy"
                  placeholder="e.g., 2 adults - 1 child"
                  required
                />
              </div>

              <div className="col-12">
                <h6 className="section-title">Quotation Details</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Check In Date</th>
                        <th>Check Out Date</th>
                        <th>Adults - Children</th>
                        <th>GST Rate</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotationRows.map((row, index) => (
                        <tr key={index}>
                          <td>{row.customerName}</td>
                          <td>{row.checkInDate}</td>
                          <td>{row.checkOutDate}</td>
                          <td>{row.occupancy}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              step="0.01"
                              value={row.gstRate}
                              onChange={(e) =>
                                handleInputChange(index, "gstRate", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              step="0.01"
                              value={row.rowTotal}
                              onChange={(e) =>
                                handleInputChange(index, "rowTotal", e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" className="btn btn-primary" onClick={addRow}>
                  Add
                </button>
              </div>

              <div className="col-12">
                <label htmlFor="total" className="form-label">
                  Total (₹)
                </label>
                <input type="number" className="form-control" id="total" value={total} readOnly />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateTotal}>
            Generate Estimate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddQuotationModal;