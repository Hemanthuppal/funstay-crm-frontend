import React, { useState,useContext } from "react";
import Navbar from "../../../Shared/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Row, Col } from "react-bootstrap";
import { baseURL } from "../../../Apiservices/Api";
import './AddSupplier.css';
import { ThemeContext } from "../../../Shared/Themes/ThemeContext";

const AddSupplier = () => {

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { themeColor } = useContext(ThemeContext);

    const [formData, setFormData] = useState({
        supplierName: "",
        totalPayable: "",
        paidOn: "",
        paidAmount: "",
        balancePayment: "",
        comments: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/api/addsupplier`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Supplier added successfully!");
                setFormData({
                    supplierName: "",
                    totalPayable: "",
                    paidOn: "",
                    paidAmount: "",
                    balancePayment: "",
                    comments: "",
                });
            } else {
                alert(data.message);
            }
            navigate('/a-supplier');
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to save supplier.");
        }
    };


    return (
        <div className="suppliercontainer" >
            <Navbar onToggleSidebar={setCollapsed} />
            <div className={`ViewSupplier ${collapsed ? "collapsed" : ""}`}>
                <div className="supplier-form-container">
                    <h2 className="supplier-form-header" style={{ "--theme-color": themeColor }} >Suppliers</h2>

                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Supplier Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Supplier Name"
                                    name="supplierName"
                                    value={formData.supplierName}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Total Payable</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Total Payable"
                                    name="totalPayable"
                                    value={formData.totalPayable}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Paid On</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="paidOn"
                                    value={formData.paidOn}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Paid Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Paid Amount"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    required
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Balance Payment</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Balance Payment"
                                    name="balancePayment"
                                    value={formData.balancePayment}
                                    onChange={handleChange}
                                />
                            </Col>

                            <Col md={6}>
                                <Form.Label>Comments</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Enter any comments"
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>

                        <Button variant="success" type="submit">
                            Save Supplier
                        </Button>
                    </Form>

                </div>
            </div>
        </div>
    );
};

export default AddSupplier;
