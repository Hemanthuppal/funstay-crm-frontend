import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./AddLeads.css";
import Navbar from "../../../../Shared/Sales-ExecutiveNavbar/Navbar";
import { useNavigate } from "react-router-dom";
import baseURL from "../../../../Apiservices/Api";

const DynamicForm = () => {
  const [formData, setFormData] = useState({
    lead_type: "group",
    name: '',
    email: '',
    phone_number: '',
    country_code: '+1', // Default country code
    primarySource: '',
    secondarySource: '',
    destination: '',
    another_name: '',
    another_email: '',
    another_phone_number: '',
    corporate_id: 1,
    description: '',
    
  });


  const [message, setMessage] = useState(""); // State for success/error message
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const nameInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post(`${baseURL}/api/leads`, formData);
      console.log(response.data);

      // Set success message
      setMessage("Lead added successfully!");

      // Reset form data
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        country_code: '+1', // Reset to default country code
        primarySource: '',
        secondarySource: '',
        another_name: '',
        another_email: '',
        another_phone_number: '',
        destination: '',
        description: '',
      });
    } catch (error) {
      console.error("Error adding lead:", error);
      // Set error message
      setMessage("Failed to add lead. Please try again.");
    }
  };

  const renderForm = () => {
    const subDropdownOptions = {
      Community: ["BNI", "Rotary", "Lions", "Association", "Others"],
      "Purchased Leads": ["Tripcrafter", "Others"],
      "Social Media": ["Linkedin", "Others"],
      Google: ["Google Organic", "Google Ad", "Youtube Organic", "Youtube Paid"],
      Meta: [
        "Facebook Organic",
        "Instagram Organic",
        "Facebook (Paid)",
        "Instagram (Paid)",
        "Others",
      ],
    };

    // Handle changes in the main dropdown
    const handleSourceChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      // Clear the subdropdown selection when a new main dropdown is selected
      if (name === "primarySource") {
        setFormData({ ...formData, [name]: value, secondarySource: "" });
      }
    };

    return (
      <div className="addleads-form-grid">
        <div className="addleads-input-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            ref={nameInputRef}
            required
            autoFocus
          />
        </div>
        <div className="addleads-input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="addleads-input-group">
          <label>Phone Number</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Country Code Input */}
            <select
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              style={{
                width: "80px",
                marginRight: "10px",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <option value="+1">+1 (USA)</option>
              <option value="+91">+91 (India)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+81">+81 (Japan)</option>
              {/* Add more country codes as needed */}
            </select>

            {/* Phone Number Input */}
            <input
              type="text"
              name="phone_number"
              placeholder="Enter Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>
        </div>
        <div className="addleads-input-group">
          <label>Primary Source</label>
          <select
            name="primarySource"
            value={formData.primarySource}
            onChange={handleSourceChange}
          >
            <option value="">Select Source</option>
            <option value="Referral">Referral/Repeat</option>
            <option value="Partner Promotion">Partner Promotion</option>
            <option value="Media Coverage">Media Coverage</option>
            <option value="Blog">Blog</option>
            <option value="Community">Community</option>
            <option value="Purchased Leads">Purchased Leads</option>
            <option value="Social Media">Social Media</option>
            <option value="Google">Google</option>
            <option value="Meta">Meta</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Conditionally render the subdropdown */}
        {formData.primarySource && subDropdownOptions[formData.primarySource] && (
          <div className="addleads-input-group">
            <label>{formData.primarySource} SubSource</label>
            <select
              name="secondarySource"
              value={formData.secondarySource || ""}
              onChange={handleChange}
            >
              <option value="">Select SubSource</option>
              {subDropdownOptions[formData.primarySource].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="addleads-input-group">
          <label>Another Name</label>
          <input
            type="text"
            name="another_name"
            placeholder="Enter Another Name"
            value={formData.another_name}
            onChange={handleChange}
          />
        </div>
        <div className="addleads-input-group">
          <label>Another Email</label>
          <input
            type="email"
            name="another_email"
            placeholder="Enter Another Email"
            value={formData.another_email}
            onChange={handleChange}
          />
        </div>
        <div className="addleads-input-group">
          <label>Another Phone Number</label>
          <input
            type="text"
            name="another_phone_number"
            placeholder="Enter Another Phone Number"
            value={formData.another_phone_number}
            onChange={handleChange}
          />
        </div>
        <div className="addleads-input-group">
          <label>Destination</label>
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={formData.destination}
            onChange={handleChange}
          />
        </div>
        <div className="addleads-input-group full-width">
          <label>Description</label>
          <textarea
            type="text"
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="addleads-form-container">
          <h2 className="addleads-form-header">Add Leads</h2>
          {message && <div className="alert alert-info">{message}</div>} {/* Display message */}
          <form onSubmit={handleSubmit} className="addleads-form">
            {renderForm()}
            <div className="addleads-form-footer">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Back
              </button>
              <button className="btn btn-primary" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;