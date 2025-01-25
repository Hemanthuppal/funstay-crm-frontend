
import React, { useState } from "react";
import InputField from "./../../../Layout/Form/InputField"; // Import the InputField component
import Navbar from '../../../Shared/Navbar/Navbar'
function ServicesForm() {
  const [formData, setFormData] = useState({
    package: "",
    duration: "",
    noOfPersons: "",
    amount: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    console.log(formData);
  };

  return (
    <div>
        <Navbar/>
    <div className="container bg-white shadow rounded-4 p-4" style={{ maxWidth: "700px" }}>
      <div className="text-center py-2 rounded-top bg-warning text-dark fw-bold">Services</div>
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="row mb-3">
          <div className="col-md-6">
            <InputField
              label="Package"
              type="text"
              placeholder="Enter package"
              value={formData.package}
              onChange={handleChange}
              name="package"
              required
            />
          </div>
          <div className="col-md-6">
            <InputField
              label="Duration"
              type="text"
              placeholder="Enter duration"
              value={formData.duration}
              onChange={handleChange}
              name="duration"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-3">
          <div className="col-md-6">
            <InputField
              label="No. of Persons"
              type="number"
              placeholder="Enter number of persons"
              value={formData.noOfPersons}
              onChange={handleChange}
              name="noOfPersons"
              required
            />
          </div>
          <div className="col-md-6">
            <InputField
              label="Amount"
              type="text"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              name="amount"
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="row mb-3">
          <div className="col-12">
            <InputField
              label="Description"
              type="textarea"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleChange}
              name="description"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="btn btn-warning text-dark fw-bold">Submit</button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default ServicesForm;
