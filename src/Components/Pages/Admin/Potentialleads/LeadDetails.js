import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from '../../../Shared/Navbar/Navbar';

import "./LeadDetails.css";

const LeadDetails = () => {
        const handleAddReceipt = () => {
                console.log("Add Receipt clicked");
        };

        const handleAddQuotation = () => {
                console.log("Add Quotation clicked");
        };

        const [collapsed, setCollapsed] = useState(false);


        return (

                <div className="Admin-ViewOpportunitycontainer">
                        <Navbar onToggleSidebar={setCollapsed} />
                        <div className={`Admin-ViewOpportunity ${collapsed ? "collapsed" : ""}`}>
                                <div className="container py-4">
                                        {/* <div className="d-flex justify-content-end mb-3 gap-2">
                                                <button className="btn btn-gradient-left" onClick={handleAddReceipt}>
                                                        Add Receipt
                                                </button>
                                                <button className="btn btn-gradient-right" onClick={handleAddQuotation}>
                                                        Add Quotation
                                                </button>

                                        </div> */}


                                        {/* Lead Details Card */}
                                          {/* Lead Details Card */}
                                          <div className="card mb-4">
                                                <div className="card-body">
                                                        <h2 className="card-title">Lead Details</h2>

                                                        <div className="mb-3 d-flex flex-wrap">
                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                        Lead Name:
                                                                </span>
                                                                <span className="text-muted">Hemanth Uppala</span>
                                                        </div>

                                                        <div className="mb-3 d-flex flex-wrap">
                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                        Email:
                                                                </span>
                                                                <span className="text-muted">uppalahemanth4@gmail.com</span>
                                                        </div>

                                                        <div className="mb-3 d-flex flex-wrap">
                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                        Mobile Number:
                                                                </span>
                                                                <span className="text-muted">9666010238</span>
                                                        </div>

                                                        {/* <div className="d-flex flex-wrap">
                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                        Opportunity Status:
                                                                </span>
                                                                <span className="text-muted">In Progress</span>
                                                        </div> */}
                                                </div>
                                        </div>

                                        {/* Lead Information Card */}
                                        <div className="card">
                                                <div className="card-body">
                                                        <h2 className="card-title">Lead Information</h2>

                                                        <div className="row">
                                                                {/* Column 1 */}
                                                                <div className="col-md-6">
                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Lead ID:
                                                                                </span>
                                                                                <span className="text-muted">LD001</span>
                                                                        </div>

                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Lead Type:
                                                                                </span>
                                                                                <span className="text-muted">Group</span>
                                                                        </div>

                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Opportunity Staus:
                                                                                </span>
                                                                                <span className="text-muted">In progress</span>
                                                                        </div>

                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Source:
                                                                                </span>
                                                                                <span className="text-muted">Referal</span>
                                                                        </div>

                                                                        <div className="d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Destination:
                                                                                </span>
                                                                                <span className="text-muted">Goa</span>
                                                                        </div>
                                                                </div>

                                                                {/* Column 2 */}
                                                                <div className="col-md-6">
                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Start Date:
                                                                                </span>
                                                                                <span className="text-muted">14-02-2025</span>
                                                                        </div>

                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        End Date:
                                                                                </span>
                                                                                <span className="text-muted">20-02-2025</span>
                                                                        </div>

                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Budget:
                                                                                </span>
                                                                                <span className="text-muted">20000</span>
                                                                        </div>

                                                                        <div className="mb-3 d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Lead Date:
                                                                                </span>
                                                                                <span className="text-muted">12/12/2024</span>
                                                                        </div>

                                                                        <div className="d-flex flex-wrap">
                                                                                <span className="fw-bold me-2" style={{ minWidth: "150px" }}>
                                                                                        Description:
                                                                                </span>
                                                                                <span className="text-muted">OK</span>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>



                                <h2 className="text-center mb-4">Quotations</h2>
                                <div className="card p-4 shadow-sm">
                                        <div className="row">
                                                {/* Left Section */}
                                                <div className="col-md-6">
                                                        <div className="card p-4 shadow-sm mb-4">
                                                        <h5>Quotation Number: <span className="fw-bold">QN00101</span></h5>
                                                        <p><strong>Lead Name:</strong> Hemanth Uppala</p>
                                                        <p><strong>Grand Total:</strong> 2000</p>
                                                        <p><strong>Created Date:</strong> 12/28/2024, 11:09:50 AM</p>
                                                        <p><strong>Destination:</strong> Goa Trip</p>
                                                        {/* <p><strong>Mode of Training:</strong> Online Training</p> */}
                                                        <a href="#" className="text-primary">View Quotation PDF</a>
                                                        <div className="mt-3">
                                                                <button className="btn btn-email-blue">Send Email</button>
                                                        </div>
                                                        <div className="mt-3">
                                                                <label><strong>Status:</strong></label>
                                                                <input type="text" className="form-control mt-2" value="Confirmed" readOnly />
                                                        </div>
                                                        </div>
                                                </div>

                                                {/* Right Section */}
                                                {/* <div className="col-md-6">
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h5>Invoice Number: <span className="fw-bold">IN00043</span></h5>
                                                                <button className="btn btn-email-blue">Send Email</button>
                                                        </div>
                                                        <button className="btn btn-custom-red w-30 mb-3">Generate Receipt</button>
                                                        <div className="mb-2">
                                                                <strong>Paid:</strong> 26250 <strong className="ms-3">Balance:</strong> 0
                                                        </div>
                                                        <div>
                                                                <p className="mb-1">
                                                                        <a href="#" className="text-primary">RECP0039</a>
                                                                        <button className="btn btn-receipt-email">Send Receipt Email</button>
                                                                </p>
                                                                <p>
                                                                        <a href="#" className="text-primary">RECP0040</a>
                                                                        <button className="btn btn-receipt-email">Send Receipt Email</button>
                                                                </p>
                                                        </div>
                                                </div> */}
                                                 <div className="col-md-6">
                                                 <div className="card p-4 shadow-sm mb-4">
                                                        <h5>Quotation Number: <span className="fw-bold">QN00102</span></h5>
                                                        <p><strong>Lead Name:</strong> Hemanth Uppala</p>
                                                        <p><strong>Grand Total:</strong> 2000</p>
                                                        <p><strong>Discount:</strong> 500</p>
                                                        <p><strong>Amount:</strong> 19050</p>
                                                        <p><strong>Created Date:</strong> 12/28/2024, 11:09:50 AM</p>
                                                        <p><strong>Destination:</strong> Goa Trip</p>
                                                        {/* <p><strong>Mode of Training:</strong> Online Training</p> */}
                                                        <a href="#" className="text-primary">View Quotation PDF</a>
                                                        <div className="mt-3">
                                                                <button className="btn btn-email-blue">Send Email</button>
                                                        </div>
                                                        <div className="mt-3">
                                                                <label><strong>Status:</strong></label>
                                                                <input type="text" className="form-control mt-2" value="Confirmed" readOnly />
                                                        </div>
                                                        </div>
                                                </div>
                                        </div>
                                </div>

                        </div>
                </div>
        );
};

export default LeadDetails;
