import React, { useState, useEffect } from "react";
import "./CreateandOpportunity.css";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../../Shared/Sales-ExecutiveNavbar/Navbar";

const CreateCustomerOpportunity = () => {
  const navigate = useNavigate();
  const { leadid } = useParams(); // Access leadid from URL parameters
  const [activeTab, setActiveTab] = useState("customer");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleTabClick = (tabName) => setActiveTab(tabName);

  const calculateDuration = (start, end) => {
    if (start && end) {
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);
      const diffTime = endDateObj - startDateObj; // Calculate the difference in milliseconds
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
      setDuration(diffDays >= 0 ? `${diffDays} days` : "Invalid duration"); // Set duration or show an error
    } else {
      setDuration(""); // Reset duration if dates are not valid
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitCustomer = async () => {
    if (!window.confirm("Are you sure you want to submit the customer data?")) {
      return; // Exit if the user cancels
    }

    setLoading(true);
    setError(null);

    // Update customer data
    try {
      const response = await axios.put(`http://localhost:5000/api/leads/update/${leadid}`, formData);
      if (response.status === 200) {
        setActiveTab("opportunity"); // Switch to opportunity tab
        // Focus on the destination input after switching tabs
        setTimeout(() => {
          document.getElementById("destination").focus();
        }, 0);
      }
    } catch (err) {
      console.error("Error updating lead data:", err);
      setError("Error updating lead data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOpportunity = async () => {
    if (!window.confirm("Are you sure you want to submit the opportunity data?")) {
      return; // Exit if the user cancels
    }

    setLoading(true);
    setError(null);

    // Create opportunity
    const opportunityData = {
      destination: formData.destination,
      start_date: startDate,
      end_date: endDate,
      duration: duration, // Include duration in the data sent to the server
      adults_count: formData.adults_count,
      children_count: formData.children_count,
      child_ages: formData.child_ages,
      approx_budget: formData.approx_budget,
      notes: formData.notes,
      reminder_setting: formData.reminder_setting,
      leadid: leadid, // Use the leadid from URL
    };

    try {
      const response = await axios.post('http://localhost:5000/api/opportunities/create', opportunityData);
      if (response.status === 201) {
        navigate("/potential-leads");
      }
    } catch (err) {
      console.error("Error creating opportunity:", err);
      setError("Error creating opportunity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLeadData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/leads/${leadid}`);
        setFormData({
          leadid: response.data.leadid,
          lead_type: response.data.lead_type,
          name: response.data.name,
          email: response.data.email,
          travel_type: response.data.travel_type,
          passport_number: response.data.passport_number,
          preferred_contact_method: response.data.preferred_contact_method,
          special_requirement: response.data.special_requirement,
        });
      } catch (err) {
        console.error("Error fetching lead data:", err);
        setError("Error fetching lead data.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeadData();
  }, [leadid]);

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="createcustomer-form-container">
          <h2 className="createcustomer-form-header">Create Customer and Opportunity</h2>
          <div className="createcustomer-tabs">
            <button
              className={`createcustomer-tab-button ${activeTab === "customer" ? "active" : ""}`}
              onClick={() => handleTabClick("customer")}
            >
              Create Customer
            </button>
            <button
              className={`createcustomer-tab-button ${activeTab === "opportunity" ? "active" : ""}`}
              onClick={() => handleTabClick("opportunity")}
            >
              Create Opportunity
            </button>
          </div>

          <div className={`createcustomer-tab-content ${activeTab === "customer" ? "active" : ""}`}>
            {/* Customer Information */}
            <div className="createcustomer-form-grid">
              <div className="createcustomer-input-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
              </div>
              <div className="createcustomer-input-group">
                <label>Customer Type</label>
                <input type="text" name="lead_type" value={formData.lead_type || ""} onChange={handleChange} />
              </div>
              <div className="createcustomer-input-group">
                <label>Email ID</label>
                <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
              </div>
              <div className="createcustomer-input-group">
                <label>Type of Travel</label>
                <input
                  type="text"
                  name="travel_type"
                  value={formData.travel_type || ""}
                  onChange={handleChange}
                  autoFocus={activeTab === "customer"} // Autofocus if active tab is customer
                />
              </div>
              <div className="createcustomer-input-group">
                <label>Passport Number</label>
                <input type="text" name="passport_number" value={formData.passport_number || ""} onChange={handleChange} />
              </div>
              <div className="createcustomer-input-group">
                <label>Preferred Contact Method</label>
                <select 
                  name="preferred_contact_method" 
                  value={formData.preferred_contact_method || ""} 
                  onChange={handleChange}
                >
                  <option value="">Select a contact method</option>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="WhatsApp">WhatsApp</option>
                  
                </select>
              </div>
              <div className="createcustomer-input-group full-width">
                <label>Special Requirement</label>
                <textarea name="special_requirement" value={formData.special_requirement || ""} onChange={handleChange}></textarea>
              </div>
            </div>
          </div>

          <div className={`createcustomer-tab-content ${activeTab === "opportunity" ? "active" : ""}`}>
            {/* Opportunity Information */}
            <div className="createcustomer-form-grid">
              <div className="createcustomer-input-group">
                <label>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination || ""}
                  onChange={handleChange}
                  autoFocus={activeTab === "opportunity"} // Autofocus if active tab is opportunity
                />
              </div>
              <div className="createcustomer-input-group">
  <label>Start Date</label>
  <input
    type="date"
    value={startDate}
    onChange={(e) => {
      const newStartDate = e.target.value;
      setStartDate(newStartDate);
      calculateDuration(newStartDate, endDate); // Pass the updated dates
    }}
  />
</div>
<div className="createcustomer-input-group">
  <label>End Date</label>
  <input
    type="date"
    value={endDate}
    onChange={(e) => {
      const newEndDate = e.target.value;
      setEndDate(newEndDate);
      calculateDuration(startDate, newEndDate); // Pass the updated dates
    }}
  />
</div>
<div className="createcustomer-input-group">
  <label>Duration (Calculated)</label>
  <input type="text" value={duration} readOnly />
</div>

              <div className="createcustomer-input-group">
                <label>No of Adults</label>
                <input
                  type="number"
                  name="adults_count"
                  value={formData.adults_count || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="createcustomer-input-group">
                <label>No of Children</label>
                <input
                  type="number"
                  name="children_count"
                  value={formData.children_count || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="createcustomer-input-group">
                <label>Child Age</label>
                <input
                  type="text"
                  name="child_ages"
                  value={formData.child_ages || ""}
                  onChange={handleChange}
                  placeholder="Based on number of children"
                />
              </div>
              <div className="createcustomer-input-group">
                <label>Approx Budget</label>
                <input
                  type="number"
                  name="approx_budget"
                  value={formData.approx_budget || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="createcustomer-input-group">
                <label>Reminder Setting</label>
                <input
                  type="date"
                  name="reminder_setting"
                  value={formData.reminder_setting || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
              <div className="createcustomer-input-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>

          <div className="createcustomer-form-footer">
            <button className="createcustomer-btn createcustomer-close-btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <button
              className="createcustomer-btn createcustomer-submit-btn"
              onClick={activeTab === "customer" ? handleSubmitCustomer : handleSubmitOpportunity}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreateCustomerOpportunity;