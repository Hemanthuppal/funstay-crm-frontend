import React, { useState, useRef, useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import "./AddLeads.css";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../../Apiservices/Api";
import { AuthContext } from '../../../../AuthContext/AuthContext';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
const DynamicForm = () => {
  const { authToken, userId, userName, userMobile, userEmail, userRole, assignManager, managerId, } = useContext(AuthContext);
  const [countryCodeOptions, setCountryCodeOptions] = useState([]);
  const [loading,setLoading] = useState(false);

useEffect(() => {
 
  const countries = getCountries();
  const callingCodes = countries.map(country => `+${getCountryCallingCode(country)}`);
  const uniqueCodes = [...new Set(callingCodes)]; 
  
  
  uniqueCodes.sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  
  setCountryCodeOptions(uniqueCodes);
}, []);
  const [formData, setFormData] = useState({
    lead_type: "group",
    name: '',
    email: '',
    phone_number: '',
    country_code: '+91',
    primarySource: '',
    secondarysource: '',
    origincity: '',
    destination: '',
    another_name: '',
    another_email: '',
    another_phone_number: '',
    corporate_id: 1,
    description: '',
    assignedSalesId: "",
    assignedSalesName: "",
    assign_to_manager: userName,
    managerid: userId,
    manager_id:null,
  });


  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const nameInputRef = useRef(null);
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${baseURL}/employeesassign`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setEmployees(response.data); 
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, [authToken, userId]);



  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "assignedSalesId") {
      const selectedEmployeeId = Number(value); 
      const selectedEmployee = employees.find(employee => employee.id === selectedEmployeeId);
      
      setFormData({
        ...formData,
        assignedSalesId: selectedEmployeeId,
        assignedSalesName: selectedEmployee ? selectedEmployee.name : '', 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  
  const validateEmail = (email) => {
   
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };



  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setMessage(""); 

    
    if (formData.phone_number.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    
    const dataToSubmit = {
      ...formData,
      assignedSalesName: formData.assignedSalesName, 
      employee_id:formData.assignedSalesId
    };

    console.log(JSON.stringify(dataToSubmit));
    try {
      const response = await axios.post(`${baseURL}/api/leads`, dataToSubmit);
      console.log(response.data);

    
      setMessage("Lead added successfully!");
      setTimeout(() => setMessage(""), 3000);


      setFormData({
        lead_type: "group",
        name: '',
        email: '',
        phone_number: '',
        country_code: '+1', 
        primarySource: '',
        secondarysource: '',
        another_name: '',
        another_email: '',
        another_phone_number: '',
        origincity: '',
        destination: '',
        description: '',
        assignedSalesId: "",
        assignedSalesName: "", 
        assign_to_manager: userName,
        managerid: userId,
        
      });
    } catch (error) {
      console.error("Error adding lead:", error);
     
      setMessage("Error: Failed to add lead. Please try again.");
      setTimeout(() => setMessage(""), 3000);
  
  } finally {
    setLoading(false);
  }
  };
  const handleSubmitAndClose = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      await handleSubmit(e); // Call the original handleSubmit function
      navigate("/m-view-leads"); // Redirect to leads list page after saving
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };


  const renderForm = () => {
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

  
    const handleSourceChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

    
      if (name === "primarySource") {
        setFormData({ ...formData, [name]: value, secondarysource: "" });
      }
    };

    return (
      <div className="addleads-form-grid">
        <div className="addleads-input-group">
          <label>Name<span style={{ color: "red" }}> *</span></label>
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
          <label>Email<span style={{ color: "red" }}> *</span></label>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              onBlur={() => {
                if (!validateEmail(formData.email)) {
                  setEmailError("Please enter a valid email address.");
                } else {
                  setEmailError("");
                }
              }}
            />
        
            {emailError && <span style={{ color: "red", fontSize: "12px" }}>{emailError}</span>}
          </div>
        </div>
        <div className="addleads-input-group">
  <label>Phone Number<span style={{ color: "red" }}> *</span></label>
  <div style={{ display: "flex", alignItems: "center" }}>
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
      {countryCodeOptions.map(code => (
        <option key={code} value={code}>{code}</option>
      ))}
    </select>

    
    <input
      type="text"
      name="phone_number"
      placeholder="Enter Phone Number"
      value={formData.phone_number}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          handleChange(e);
        }
      }}
      onBlur={(e) => {
        if (formData.phone_number.length !== 10) {
          setPhoneError("Please enter a valid number.");
        } else {
          setPhoneError("");
        }
      }}
      style={{
        flex: 1,
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
      maxLength={10}
      required
    />
  </div>
  {phoneError && <span style={{ color: "red", fontSize: "12px" }}>{phoneError}</span>}
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
        {formData.primarySource && subDropdownOptions[formData.primarySource] && (
          <div className="addleads-input-group">
            <label>{formData.primarySource} SubSource</label>
            <select
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
            </select>
          </div>
        )}
        <div className="addleads-input-group">
          <label>Assign To</label>
          <select
            name="assignedSalesId" 
            value={formData.assignedSalesId}  
            onChange={handleChange}
          >
            <option value="">Select Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
         
        </div>


       
        <div className="addleads-input-group">
          <label>Secondary Email</label>
          <input
            type="email"
            name="another_email"
            placeholder="Enter Another Email"
            value={formData.another_email}
            onChange={handleChange}
          />
        </div>
        <div className="addleads-input-group">
          <label>Secondary Phone Number</label>
          <input
            type="text"
            name="another_phone_number"
            placeholder="Enter Another Phone Number"
            value={formData.another_phone_number}
            onChange={handleChange}
            maxLength={10}
          />
        </div>
        <div className="addleads-input-group">
          <label>Origin City</label>
          <input
            type="text"
            name="origincity"
            placeholder="Enter Origin City"
            value={formData.origincity}
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
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-info">{message}</div>} 
          <form onSubmit={handleSubmit} className="addleads-form">
            {renderForm()}
            <div className="addleads-form-footer">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                Back
              </button>
              <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-success"
                type="button"
                disabled={loading}
                onClick={handleSubmitAndClose} // Now this function exists!
              >
                {loading ? "Saving..." : "Save & Close"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;


