import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../payments.css";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import { ThemeContext } from "../../../../Shared/Themes/ThemeContext";
import { baseURL } from "../../../../Apiservices/Api";
import { AuthContext } from '../../../../AuthContext/AuthContext';

const M_SupplierForm = () => {
  const { userId, userName } = useContext(AuthContext);
  const { leadid } = useParams();
  const navigate = useNavigate();
  const { themeColor } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [newSupplier, setNewSupplier] = useState({
    supplierName: "",
    totalPayable: "",
    paidOn: today,
    paidAmount: "",
    balancePayment: "",
    comments: "",
    nextPayment: "",
    purposeOfPayment: "", // <-- Added field
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    try {
      await fetch(`${baseURL}/api/suppliers`);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setNewSupplier((prev) => {
      // Create a new state object
      const updatedSupplier = {
        ...prev,
        [name]: value,
      };
      
      // Calculate balance payment if totalPayable or paidAmount changes
      if (name === "totalPayable" || name === "paidAmount") {
        const total = parseFloat(updatedSupplier.totalPayable) || 0;
        const paid = parseFloat(updatedSupplier.paidAmount) || 0;
        const balance = total - paid;
        
        updatedSupplier.balancePayment = balance >= 0 ? balance.toString() : "0";
      }
      
      return updatedSupplier;
    });
  };

  const handleAddSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supplierData = {
        ...newSupplier,
        leadId: leadid,
        userid: userId,
        username: userName,
        status: "Pending",
      };

      await fetch(`${baseURL}/api/suppliers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      setNewSupplier({
        supplierName: "",
        totalPayable: "",
        paidOn: "",
        paidAmount: "",
        balancePayment: "",
        comments: "",
        nextPayment: "",
        purposeOfPayment: "", // <-- Added field
      });

      fetchSuppliers();
      navigate(`/m-supplier/${leadid}`);
    } catch (err) {
      console.error("Error adding supplier:", err);
      setError("Failed to add supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="addpayment-form-container">
          <h2 className="addpayment-form-header" style={{ "--theme-color": themeColor }}>
            Add Supplier - Lead ID: {leadid}
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleAddSupplier} className="addpayment-form">
            <div className="addpayment-form-grid">
              <div className="addpayment-input-group">
                <label>Supplier Name<span style={{ color: "red" }}> *</span></label>
                <input
                  type="text"
                  name="supplierName"
                  placeholder="Enter supplier name"
                  value={newSupplier.supplierName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="addpayment-input-group">
                <label>Total Payable</label>
                <input
                  type="number"
                  name="totalPayable"
                  placeholder="Enter total payable"
                  value={newSupplier.totalPayable}
                  onChange={handleChange}
                />
              </div>

              <div className="addpayment-input-group">
                <label>Paid On</label>
                <input
                  type="date"
                  name="paidOn"
                  value={newSupplier.paidOn}
                  onChange={handleChange}
                />
              </div>

              <div className="addpayment-input-group">
                <label>Paid Amount</label>
                <input
                  type="number"
                  name="paidAmount"
                  placeholder="Enter paid amount"
                  value={newSupplier.paidAmount}
                  onChange={handleChange}
                />
              </div>

              <div className="addpayment-input-group">
                <label>Balance Payment</label>
                <input
                  type="number"
                  name="balancePayment"
                  placeholder="Enter balance"
                  value={newSupplier.balancePayment}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="addpayment-input-group">
                <label>Next Payment</label>
                <input
                  type="date"
                  name="nextPayment"
                  value={newSupplier.nextPayment}
                  onChange={handleChange}
                />
              </div> */}

              <div className="addpayment-input-group">
                <label>Purpose of Payment</label>
                <input
                  type="text"
                  name="purposeOfPayment"
                  placeholder="e.g., Material Purchase, Advance, etc."
                  value={newSupplier.purposeOfPayment}
                  onChange={handleChange}
                />
              </div>

              <div className="addpayment-input-group full-width">
                <label>Comments</label>
                <textarea
                  name="comments"
                  placeholder="Enter comments"
                  value={newSupplier.comments}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            <div className="addpayment-form-footer">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Supplier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default M_SupplierForm;