import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Navbar from "../../../../../Shared/ManagerNavbar/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Row, Col } from 'react-bootstrap';
import './EditLead.css';
import { baseURL } from "../../../../../Apiservices/Api";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const EditOppLead = () => {
  const location = useLocation();
  const { leadid } = location.state;
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState("");
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
 

  useEffect(() => {
    
    const countries = getCountries();
    const callingCodes = countries.map(
      (country) => `+${getCountryCallingCode(country)}`
    );
    const uniqueCodes = [...new Set(callingCodes)]; 

    uniqueCodes.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));

    setCountryCodeOptions(uniqueCodes);
  }, []);
  const [formData, setFormData] = useState({
    lead_type: '',
    name: '',
    country_code: '',
    phone_number: '',
    email: '',
    sources: '',
    description: '',
    another_name: '',
    another_email: '',
    another_phone_number: '',
    corporate_id: '',
    primaryStatus: '',
    secondaryStatus: '',
    destination: '',
    primarySource: '',
    secondarysource: '',
  });
  const [error, setError] = useState(null);
  const subDropdownOptions = {
    Referral: ["Grade 3", "Grade 2", "Grade 1"],
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

  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/leads/${leadid}`);
        const leadData = response.data;

console.log("Fetched secondarysource:", leadData.secondarysource);
console.log("Fetched primarySource:", leadData.primarySource);
        setFormData((prev) => ({
          ...prev,
          lead_type: leadData.lead_type || '',
          name: leadData.name || '',
          country_code: leadData.country_code || '',
          phone_number: leadData.phone_number || '',
          email: leadData.email || '',
          sources: leadData.sources || '',
          description: leadData.description || '',
          another_name: leadData.another_name || '',
          another_email: leadData.another_email || '',
          another_phone_number: leadData.another_phone_number || '',
          corporate_id: leadData.corporate_id || '',
          primaryStatus: leadData.primaryStatus || '',
          secondaryStatus: leadData.secondaryStatus || '',
          destination: leadData.destination || '',
          primarySource: leadData.primarySource || '',
          secondarysource: leadData.secondarysource || '',
        }));
      } catch (err) {
        console.error("Error fetching lead data:", err);
        setError("Failed to fetch lead data.");
      }
    };

    fetchLeadData();
  }, [leadid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); 

    const leadData = {
      lead_type: formData.lead_type,
      name: formData.name,
      country_code: formData.country_code,
      phone_number: formData.phone_number,
      email: formData.email,
      sources: formData.sources,
      description: formData.description,
      another_name: formData.another_name,
      another_email: formData.another_email,
      another_phone_number: formData.another_phone_number,
      destination: formData.destination,
      corporate_id: formData.corporate_id,
      primaryStatus: formData.primaryStatus,
      secondaryStatus: formData.secondaryStatus,
      primarySource: formData.primarySource,
      secondarysource: formData.secondarysource,
    };
    console.log(JSON.stringify(leadData, null, 2));
    try {
      await axios.put(`${baseURL}/api/leads/${leadid}`, leadData);
      setMessage('Updated Successfully');
      setTimeout(() => setMessage(""), 3000);
      
    } catch (error) {
      console.error("Error updating data:", error);
      setError("Failed to update data.");
    }
  };

  const [leadDropdownOptions] = useState({
    primary: ["New", "No Response", "Duplicate", "False Lead", "Lost"],
    secondary: {
      New: ["Yet to Contact", "Not picking up call", "Asked to call later"],
      "No Response": [],
      Duplicate: [],
      "False Lead": [],
      Lost: ["Plan Cancelled", "Plan Delayed", "Already Booked", "Others"],
    },
  });

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="editlead-form-container">
          <h2 className="editlead-form-header">Edit Leads</h2>

          <div className="editlead-form">
            <Form className="s-edit-opp-lead-FormLable" onSubmit={handleFormSubmit}>
            
              <h5>Lead Details</h5>
              {message && <div className="alert alert-info">{message}</div>} 
              {error && <div className="alert alert-danger">{error}</div>} 

              <Row>
              
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
  <Form.Group className="mb-3">
    <Form.Label>
      Phone Number
    </Form.Label>
    <div style={{ display: "flex", alignItems: "center" }}>
    
      <Form.Select
        name="country_code"
        value={formData.country_code || "+91"} 
        onChange={handleChange}
        style={{
          width: "80px",
          marginRight: "10px",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        {countryCodeOptions.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </Form.Select>

      
      <Form.Control
        type="text"
        name="phone_number"
        placeholder="Enter Phone Number"
        value={formData.phone_number || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            handleChange(e);
          }
        }}
       
        style={{
          flex: 1,
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
        required
      />
    </div>

  
  </Form.Group>
</Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Source</Form.Label>
                    <Form.Select
                      name="primarySource"
                      value={formData.primarySource}
                      onChange={handleChange}
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
                    </Form.Select>
                  </Form.Group>
                </Col>
                {subDropdownOptions[formData.primarySource] && (
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>{formData.primarySource} SubSource</Form.Label>
                      <Form.Select
                        name="secondarysource"
                        value={formData.secondarysource || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select SubSource</option>
                        {subDropdownOptions[formData.primarySource].map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )}
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
           
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Secondary Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="another_email"
                      value={formData.another_email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Secondary Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="another_phone_number"
                      value={formData.another_phone_number}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
             
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Primary Status</Form.Label>
                    <Form.Select
                      name="primaryStatus"
                      value={formData.primaryStatus}
                      onChange={handleChange}
                    >
                      {!formData.primaryStatus && <option value="">Select Status</option>}
                      {leadDropdownOptions.primary.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Secondary Status</Form.Label>
                    <Form.Select
                      name="secondaryStatus"
                      value={formData.secondaryStatus}
                      onChange={handleChange}
                      disabled={
                        !formData.primaryStatus ||
                        ["No Response", "Duplicate", "False Lead"].includes(formData.primaryStatus)
                      }
                    >
                      {!formData.secondaryStatus && <option value="">Select Status</option>}
                      {formData.primaryStatus && leadDropdownOptions.secondary[formData.primaryStatus] ? (
                        leadDropdownOptions.secondary[formData.primaryStatus].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>No options available</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="addleads-form-footer">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                  Back
                </button>
                <button className="btn btn-primary" type="submit">
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOppLead;