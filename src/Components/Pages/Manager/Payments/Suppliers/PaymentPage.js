import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { baseURL } from "../../../../Apiservices/Api";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import { ThemeContext } from "../../../../Shared/Themes/ThemeContext";
import "../payments.css";
import { AuthContext } from '../../../../AuthContext/AuthContext';

const M_PaymentPage = () => {
  const { userId, userName } = useContext(AuthContext);
  const { leadid, supplierId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { themeColor } = useContext(ThemeContext);
  const [collapsed, setCollapsed] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    supplierName: "",
    totalPayable: "",
    paidOn: "",
    paidAmount: "",
    balancePayment: "",
    comments: "",
    // nextPayment: "",
    remainingPaid: "",
  });

  useEffect(() => {
    if (location.state && location.state.supplier) {
      const supplier = location.state.supplier;
      setPaymentForm({
        supplierName: supplier.supplier_name || "",
        totalPayable: supplier.total_payable || "",
        paidOn: supplier.paid_on || "",
        paidAmount: supplier.paid_amount || "",
        balancePayment: supplier.balance_payment || "",
        comments: supplier.comments || "",
        // nextPayment: supplier.next_payment || "",
        remainingPaid: "",
      });
    } else {
      console.error("Supplier data not found in navigation state.");
    }
  }, [location.state]);

  const handleModalPayment = async () => {
    try {
      const { remainingPaid, nextPayment } = paymentForm;

      await axios.post(`${baseURL}/api/suppliers/${supplierId}/payment`, {
        paidAmount: remainingPaid,
        nextPayment,
        comments: paymentForm.comments,
        userid: userId,
        username: userName,
        status: "Pending",
      });

      navigate(`/m-supplier/${leadid}`);
    } catch (err) {
      console.error("Error submitting payment:", err);
    }
  };

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="addpayment-form-container">
          <h2 className="addpayment-form-header" style={{ "--theme-color": themeColor }}>
            Update Payment - {paymentForm.supplierName}
          </h2>

          <div className="addpayment-form">
            <div className="addpayment-form-grid">
              {/* Disabled Fields */}
              <div className="addpayment-input-group">
                <label>Total Payable</label>
                <input type="text" value={`₹${paymentForm.totalPayable}`} disabled />
              </div>

              <div className="addpayment-input-group">
                <label>Paid On</label>
                <input type="text" value={paymentForm.paidOn} disabled />
              </div>

              <div className="addpayment-input-group">
                <label>Paid Amount</label>
                <input type="text" value={`₹${paymentForm.paidAmount}`} disabled />
              </div>

              <div className="addpayment-input-group">
                <label>Balance</label>
                <input type="text" value={`₹${paymentForm.balancePayment}`} disabled />
              </div>

              {/* Editable Fields */}
              <div className="addpayment-input-group">
                <label>Remaining Payment</label>
                <input
                  type="number"
                  name="remainingPaid"
                  placeholder="Enter amount"
                  value={paymentForm.remainingPaid}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, remainingPaid: e.target.value })
                  }
                />
              </div>

              <div className="addpayment-input-group">
                <label>Comments</label>
                <textarea
                  name="comments"
                  value={paymentForm.comments}
                  rows={3}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, comments: e.target.value })
                  }
                />
              </div>

              {/* <div className="addpayment-input-group">
                <label>Next Payment</label>
                <input
                  type="date"
                  name="nextPayment"
                  value={paymentForm.nextPayment}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, nextPayment: e.target.value })
                  }
                />
              </div> */}
            </div>

            <div className="addpayment-form-footer">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={handleModalPayment}>
                Submit Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default M_PaymentPage;