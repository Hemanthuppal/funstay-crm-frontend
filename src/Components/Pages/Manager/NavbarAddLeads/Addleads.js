import React, { useState } from 'react';
import InputField from './../../../Layout/Form/InputField'; // Import the InputField component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Navbar from './../../../Shared/ManagerNavbar/Navbar';

const DynamicForm = () => {
  const [selectedOption, setSelectedOption] = useState('corporate');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    sources: '',
    groupName: '',
    leaderName: '',
    leaderEmail: '',
    anotherName: '',
    anotherEmail: '',
    anotherPhoneNumber: '',
    corporateId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderForm = () => {
    switch (selectedOption) {
      case 'individual':
        return (
          <form>
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Phone Number"
                  type="text"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                />
              </div>
              <div className="col-md-6">
  <InputField
    label="Sources"
    type="select"
    name="sources"
    value={formData.sources}
    onChange={handleChange}
    options={[
      { value: "Website", label: "Website" },
      { value: "Referral", label: "Referral" },
      { value: "Advertisement", label: "Advertisement" },
      { value: "Other", label: "Other" },
    ]}
  />
</div>

            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Description"
                  type="text"
                  placeholder="Enter Your Description"
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                />
              </div>
            </div>
          </form>
        );
      case 'group':
        return (
          <form>
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Phone Number"
                  type="text"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                />
              </div>
              <div className="col-md-6">
  <InputField
    label="Sources"
    type="select"
    name="sources"
    value={formData.sources}
    onChange={handleChange}
    options={[
      { value: "Website", label: "Website" },
      { value: "Referral", label: "Referral" },
      { value: "Advertisement", label: "Advertisement" },
      { value: "Other", label: "Other" },
    ]}
  />
</div>

            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Another Name"
                  type="text"
                  placeholder="Enter Another Name"
                  value={formData.anotherName}
                  onChange={handleChange}
                  name="anotherName"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Another Email"
                  type="email"
                  placeholder="Enter Another Email"
                  value={formData.anotherEmail}
                  onChange={handleChange}
                  name="anotherEmail"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Another Phone Number"
                  type="text"
                  placeholder="Enter Another Phone Number"
                  value={formData.anotherPhoneNumber}
                  onChange={handleChange}
                  name="anotherPhoneNumber"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Description"
                  type="text"
                  placeholder="Enter Your Description"
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                />
              </div>
            </div>
          </form>
        );
      case 'corporate':
        return (
          <form>
            <div className="row">
              <div className="col-md-6">
                <InputField
                  label="Name"
                  type="text"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Email"
                  type="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  name="email"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Phone Number"
                  type="text"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                />
              </div>
              <div className="col-md-6">
  <InputField
    label="Sources"
    type="select"
    name="sources"
    value={formData.sources}
    onChange={handleChange}
    options={[
      { value: "Website", label: "Website" },
      { value: "Referral", label: "Referral" },
      { value: "Advertisement", label: "Advertisement" },
      { value: "Other", label: "Other" },
    ]}
  />
</div>

            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Another Name"
                  type="text"
                  placeholder="Enter Another Name"
                  value={formData.anotherName}
                  onChange={handleChange}
                  name="anotherName"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Another Email"
                  type="email"
                  placeholder="Enter Another Email"
                  value={formData.anotherEmail}
                  onChange={handleChange}
                  name="anotherEmail"
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <InputField
                  label="Another Phone Number"
                  type="text"
                  placeholder="Enter Another Phone Number"
                  value={formData.anotherPhoneNumber}
                  onChange={handleChange}
                  name="anotherPhoneNumber"
                />
              </div>
              <div className="col-md-6">
                <InputField
                  label="Corporate ID"
                  type="text"
                  placeholder="Enter Corporate ID"
                  value={formData.corporateId}
                  onChange={handleChange}
                  name="corporateId"
                />
              </div>
            </div>
            <div className="col-md-6">
                <InputField
                  label="Description"
                  type="text"
                  placeholder="Enter Your Description"
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                />
              </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="container card " style={{ maxWidth: '600px', marginTop: '20px' }}>
      <div className="mb-5 mt-5">
      <h3>Add Leads</h3>
      <div>
        <label>
          <input
            type="radio"
            name="formType"
            value="individual"
            checked={selectedOption === 'individual'}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Individual
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="formType"
            value="group"
            checked={selectedOption === 'group'}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Group
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="radio"
            name="formType"
            value="corporate"
            checked={selectedOption === 'corporate'}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          Corporate
        </label>
      </div>
      <div style={{ marginTop: '20px' }}>{renderForm()}</div>
      <button type="submit" className="btn btn-warning" style={{ marginTop: '20px' }}>
        Submit
      </button>
    </div>
    </div>
    </div>
  );
};

export default DynamicForm;
