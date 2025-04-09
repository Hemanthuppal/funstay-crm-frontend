import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { baseURL } from '../../../../Apiservices/Api';
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import { ThemeContext } from "../../../../Shared/Themes/ThemeContext";
import "../payments.css";

const M_HistoryPage = () => {
  const { supplierId } = useParams();
  const [history, setHistory] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const { themeColor } = useContext(ThemeContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/suppliers/${supplierId}/history`);
        setHistory(res.data);
      } catch (err) {
        console.error('Error fetching history:', err);
      }
    };

    fetchHistory();
  }, [supplierId]);

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? 'collapsed' : ''}`}>
        <div className="addpayment-form-container">
          <h2 className="addpayment-form-header" style={{ "--theme-color": themeColor }}>
            Transaction History
          </h2>

          {history.length === 0 ? (
            <p className="no-history-text">No transaction history found.</p>
          ) : (
            <div className="transaction-history-list">
              {history.map((h, idx) => (
                <div className="transaction-history-item" key={idx}>
                  <div className="history-main-row">
                    <span className="history-amount">₹{h.paid_amount}</span>
                    <span className="history-date">{h.paid_on}</span>
                  </div>
                  {h.next_payment && (
                    <div className="history-next-row">
                      <span className="next-label">Next Payment:</span>
                      <span className="next-date">{h.next_payment}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default M_HistoryPage;
