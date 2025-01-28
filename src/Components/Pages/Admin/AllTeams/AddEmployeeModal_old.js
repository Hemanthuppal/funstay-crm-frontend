import React, { useState, useEffect } from "react";
import {baseURL} from "../../../Apiservices/Api";

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployeeSuccess = () => {} }) => {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    role: "",
    assignManager: "",
  });

  const [managers, setManagers] = useState([]); // Store the list of managers
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch managers when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchManagers();
    }
  }, [isOpen]);

  const fetchManagers = async () => {
    try {
      const response = await fetch(`${baseURL}/managers`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`, // Pass JWT token for authentication
        },
      });
      const data = await response.json();

      if (response.ok) {
        setManagers(data.data); // Set managers list
      } else {
        throw new Error(data.message || "Failed to fetch managers.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddEmployee = async () => {
    const { name, mobile, email, password, role, assignManager } = newEmployee;
  
    if (!name || !mobile || !email || !password || !role) {
      alert("Please fill in all the fields.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch(`${baseURL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`, // Pass JWT token for authentication
        },
        body: JSON.stringify(newEmployee),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add employee.");
      }
  
      // Reset newEmployee form
      setNewEmployee({
        name: "",
        mobile: "",
        email: "",
        password: "",
        role: "",
        assignManager: "",
      });
  
      // Close the modal and pass the new employee data
      onAddEmployeeSuccess(data);
      alert("Employee added successfully.");
      onClose(); // Close the modal after successful employee addition
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return isOpen ? (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Employee</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <strong>Error:</strong> {error}
              </div>
            )}
            <form>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Mobile"
                    value={newEmployee.mobile}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, mobile: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Password"
                    value={newEmployee.password}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, password: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <select
                    className="form-control"
                    value={newEmployee.role}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, role: e.target.value })
                    }
                  >
                    <option value="">Select Role</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                {newEmployee.role === "employee" && (
                  <div className="col-md-6 mb-3">
                    <select
                      className="form-control"
                      value={newEmployee.assignManager}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          assignManager: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Manager</option>
                      {managers.map((manager) => (
                        <option key={manager.id} value={manager.id}>
                          {manager.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddEmployee}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddEmployeeModal;
