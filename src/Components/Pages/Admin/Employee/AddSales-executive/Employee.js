import React, { useState } from 'react';
import InputField from './../../../../Layout/Form/InputField'; // Import InputField component
import Navbar from '../../../../Shared/Navbar/Navbar_old';
import axios from 'axios';

const Employee = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        pancard: '',
        password: '',
        salary: '',
        bankAccount: '',
        pfNumber: '',
        address: '',
        assignedManager: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        axios.post('http://localhost:5000/add-users', formData)
            .then((response) => {
                alert('User added successfully!');
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error adding manager:', error);
                alert('Failed to add user');
            });
    };

    return (
        <div className="">
            {/* <Navbar/> */}
            <h2 className="text-center mb-4 ">Employee Registration Form</h2>
            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <InputField 
                            label="Name" 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <InputField 
                            label="Email" 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <InputField 
                            label="Mobile Number" 
                            type="tel" 
                            name="mobile" 
                            value={formData.mobile} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <InputField 
                            label="PAN Card Number" 
                            type="text" 
                            name="pancard" 
                            value={formData.pancard} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <InputField 
                            label="Password" 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <InputField 
                            label="Salary (INR)" 
                            type="number" 
                            name="salary" 
                            value={formData.salary} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <InputField 
                            label="Bank Account Number" 
                            type="text" 
                            name="bankAccount" 
                            value={formData.bankAccount} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <InputField 
                            label="PF No" 
                            type="text" 
                            name="pfNumber" 
                            value={formData.pfNumber} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                </div>
                <div className='row mb-3'>
                <div className="col-md-6">
                    <InputField 
                        label="Address" 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        required
                    />
                </div>
                <div className="col-md-6">
  <InputField
    label="Assigned Manager"
    type="select"
    name="assignedManager"
    value={formData.assignedManager}
    onChange={handleChange}
    required
    options={[
      { value: "", label: "Select a manager" },
      { value: "John Doe", label: "John Doe" },
      { value: "Jane Smith", label: "Jane Smith" },
      { value: "Emily Johnson", label: "Emily Johnson" },
      { value: "Michael Brown", label: "Michael Brown" },
    ]}
  />
</div>


                </div>
                <div className='text-center'>
                <button type="submit" className="btn btn-primary  w-50">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default Employee;

