import React from 'react';

const ProfileForm = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="form-container bg-white rounded shadow-sm" style={{ maxWidth: '700px', width: '90%' }}>
        {/* Form Header */}
        <div className="form-header text-center py-3" style={{ backgroundColor: '#f5a623', color: 'black', fontWeight: 'bold' }}>
          Profile
        </div>

        {/* Form Body */}
        <div className="form-body p-3">
          {/* First Row */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="name" className="mb-2">Name</label>
                <input type="text" className="form-control" id="name" placeholder="Enter name" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="email" className="mb-2">Email</label>
                <input type="email" className="form-control" id="email" placeholder="Enter email" />
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="mobile" className="mb-2">Mobile Number</label>
                <input type="text" className="form-control" id="mobile" placeholder="Enter mobile number" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="dob" className="mb-2">Date of Birth</label>
                <input type="date" className="form-control" id="dob" />
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="qualification" className="mb-2">Qualification</label>
                <input type="text" className="form-control" id="qualification" placeholder="Enter qualification" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="image" className="mb-2">Upload Image</label>
                <input type="file" className="form-control" id="image" />
              </div>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="address" className="mb-2">Address</label>
                <textarea className="form-control" id="address" placeholder="Enter address"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="form-footer text-center py-3">
          <button className="btn btn-warning text-dark px-4 py-2" style={{ backgroundColor: '#f5a623' }}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
