// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./payments.css";
// import { baseURL } from "../../../Apiservices/Api";

// const AddPaymentPage = () => {
//   const { leadid } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     paidAmount: "",
//     balanceAmount: "",
//     paidOn: "",
//     remarks: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const customerid = `LEAD-CUST-${leadid}`; // Or get real customerid from state if available
  
//     const dataToSend = {
//         leadid,
//         paid_amount: formData.paidAmount,
//         balance_amount: formData.balanceAmount,
//         paid_on: formData.paidOn,
//         remarks: formData.remarks,
//     };
  
//     try {
//       const response = await fetch(`${baseURL}/api/payments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(dataToSend),
//       });
  
//       if (response.ok) {
//         alert("Payment saved successfully");
//         navigate(`/a-payments/${leadid}`);
//       } else {
//         alert("Error saving payment");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Network error");
//     }
//   };
  

//   return (
//     <div className="payments-container">
//       <h2>Add Payment - Lead ID: {leadid}</h2>
//       <form onSubmit={handleSubmit} className="payments-form">
//         <div className="payments-form-group">
//           <label>Paid Amount</label>
//           <input
//             type="text"
//             name="paidAmount"
//             value={formData.paidAmount}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="payments-form-group">
//           <label>Balance Amount</label>
//           <input
//             type="text"
//             name="balanceAmount"
//             value={formData.balanceAmount}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="payments-form-group">
//           <label>Paid On</label>
//           <input
//             type="date"
//             name="paidOn"
//             value={formData.paidOn}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="payments-form-group">
//           <label>Remarks</label>
//           <textarea
//             name="remarks"
//             value={formData.remarks}
//             onChange={handleChange}
//           />
//         </div>

//         <button type="submit" className="payments-submit-btn">
//           Submit Payment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddPaymentPage;


import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./payments.css";
import Navbar from "../../../Shared/Navbar/Navbar";
import { ThemeContext } from "../../../Shared/Themes/ThemeContext";
import { baseURL } from "../../../Apiservices/Api";

const AddPaymentPage = () => {
  const { leadid } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { themeColor } = useContext(ThemeContext);

  const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const [formData, setFormData] = useState({
    paidAmount: "",
    balanceAmount: "",
    // paidOn: "",
    paidOn: today,
    remarks: "",
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeadAndPayments = async () => {
      try {
        setLoading(true);
        const leadRes = await fetch(`${baseURL}/api/leads/${leadid}`);
        const leadData = await leadRes.json();
        // setTotalAmount(leadData.total_amount);

         // Fetch travel opportunities and get total_amount from the one matching leadid
      const travelRes = await fetch(`${baseURL}/travel-opportunity`);
      const travelData = await travelRes.json();
      console.log("Travel Opportunities:", travelData);

      const opportunity = travelData.find((item) => item.leadid == leadid);
      if (opportunity) {
        setTotalAmount(opportunity.approx_budget);
      } else {
        console.warn(`No travel opportunity found for leadid: ${leadid}`);
        setTotalAmount(0);
      }

        const paymentsRes = await fetch(`${baseURL}/api/payments?leadid=${leadid}`);
        const paymentsData = await paymentsRes.json();

        const paid = paymentsData.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0);
        setTotalPaid(paid);
      } catch (error) {
        console.error("Error loading payment data", error);
        setError("Failed to load payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchLeadAndPayments();
  }, [leadid]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "paidAmount") {
      const paidInput = parseFloat(value) || 0;
      const remaining = totalAmount - totalPaid - paidInput;

      setFormData((prev) => ({
        ...prev,
        paidAmount: value,
        balanceAmount: remaining.toFixed(2),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dataToSend = {
      leadid,
      paid_amount: formData.paidAmount,
      balance_amount: formData.balanceAmount,
      paid_on: formData.paidOn,
      remarks: formData.remarks,
    };

    try {
      const response = await fetch(`${baseURL}/api/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        navigate(`/a-payments/${leadid}`, { state: { success: "Payment saved successfully" } });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error saving payment");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="addpayment-form-container">
          <h2 className="addpayment-form-header" style={{ "--theme-color": themeColor }}>Add Payment - Lead ID: {leadid}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <div className="payment-summary">
            <p>
              <strong>Total Amount:</strong> ₹{totalAmount} <br />
              <strong>Total Paid:</strong> ₹{totalPaid} <br />
              <strong>Remaining:</strong>{" "}
              <span style={{ color: totalAmount - totalPaid > 0 ? "red" : "green" }}>
                ₹{(totalAmount - totalPaid).toFixed(2)}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="addpayment-form">
            <div className="addpayment-form-grid">
              <div className="addpayment-input-group">
                <label>
                  Paid Amount<span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="number"
                  name="paidAmount"
                  placeholder="Enter amount"
                  value={formData.paidAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="addpayment-input-group">
                <label>Balance Amount</label>
                <input
                  type="text"
                  name="balanceAmount"
                  value={formData.balanceAmount}
                  readOnly
                  className="readonly-input"
                />
              </div>

              <div className="addpayment-input-group">
                <label>
                  Paid On<span style={{ color: "red" }}> *</span>
                </label>
                <input
                  type="date"
                  name="paidOn"
                  value={formData.paidOn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="addpayment-input-group full-width">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  placeholder="Enter remarks (optional)"
                  value={formData.remarks}
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
                {loading ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentPage;

