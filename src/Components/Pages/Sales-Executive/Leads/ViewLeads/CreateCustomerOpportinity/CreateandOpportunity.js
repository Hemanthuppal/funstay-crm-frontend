import React, { useState, useEffect } from "react";
import "./CreateandOpportunity.css";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../../../Shared/Sales-ExecutiveNavbar/Navbar";

import baseURL from "../../../../../Apiservices/Api";

const CreateCustomerOpportunity = () => {
  const navigate = useNavigate();
  const { leadid } = useParams();
  const [activeTab, setActiveTab] = useState("customer");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [childrenAges, setChildrenAges] = useState([]);
  const [message, setMessage] = useState("");
  const handleTabClick = (tabName) => setActiveTab(tabName);

  const calculateDuration = (start, end) => {
    if (start && end) {
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);
      const diffTime = endDateObj - startDateObj;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration(diffDays >= 0 ? `${diffDays} days` : "Invalid duration");
    } else {
      setDuration("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

   
    if (name === "children_count") {
      const count = parseInt(value) || 0;
      setChildrenAges(Array.from({ length: count }, (_, i) => childrenAges[i] || ""));
    }
  };

  const handleChildAgeChange = (index, value) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = value;
    setChildrenAges(updatedAges);
  };

  const handleSubmitCustomer = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${baseURL}/api/leads/update/${leadid}`, formData);
      if (response.status === 200) {
        setMessage("Customer data submitted successfully!");
        setActiveTab("opportunity");
      }
    } catch (err) {
      console.error("Error updating lead data:", err);
      setError("Error updating lead data.");
    
      setMessage('Failed to update customer data. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOpportunity = async () => {
    setLoading(true);
    setError(null);

    const opportunityData = {
      destination: formData.destination,
      start_date: startDate,
      end_date: endDate,
      duration: duration,
      adults_count: formData.adults_count,
      children_count: formData.children_count,
      child_ages: childrenAges.join(','), 
      approx_budget: formData.approx_budget,
      notes: formData.notes,
      reminder_setting: formData.reminder_setting,
      leadid: leadid,
    };

    try {
      const response = await axios.post(`${baseURL}/api/opportunities/create`, opportunityData);
      if (response.status === 201) {
       
setMessage('Opportunity created successfully!')
        navigate("/potential-leads");
      }
    } catch (err) {
      console.error("Error creating opportunity:", err);
      setError("Error creating opportunity. Please try again.");
      
      setMessage('Failed to create opportunity. Please try again.')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLeadData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseURL}/api/leads/${leadid}`);
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
          {message && <div className="alert alert-info">{message}</div>} 
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
                  autoFocus={activeTab === "customer"}
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
           
            <div className="createcustomer-form-grid">
              <div className="createcustomer-input-group">
                <label>Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination || ""}
                  onChange={handleChange}
                  autoFocus={activeTab === "opportunity"}
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
                    calculateDuration(newStartDate, endDate);
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
                    calculateDuration(startDate, newEndDate);
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

             
              {Array.from({ length: formData.children_count || 0 }, (_, index) => (
                <div className="createcustomer-input-group" key={index}>
                  <label>Child Age {index + 1}</label>
                  <select
                    value={childrenAges[index] || ""}
                    onChange={(e) => handleChildAgeChange(index, e.target.value)}
                  >
                    <option value="">Select Age</option>
                    {Array.from({ length: 12 }, (_, age) => (
                      <option key={age} value={age + 1}>{age + 1}</option>
                    ))}
                  </select>
                </div>
              ))}

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
              <div className="createcustomer-input-group full-width">
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