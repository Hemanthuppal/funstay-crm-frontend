import React, { useState } from 'react';
import DataTable from './../../../Layout/Table/TableLayout';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import Navbar from '../../../Shared/Navbar/Navbar';

const TeamMembers = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to access state
  const [collapsed, setCollapsed] = useState(false);

  // Access teamMembers from location.state
  const teamMembers = location.state?.teamMembers || [];

  const memberColumns = [
    {
      Header: "Employee ID",
      accessor: "id",
      Cell: ({ value }) => `EMP${String(value).padStart(5, "0")}`,
    },
    { Header: "Name", accessor: "name" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Email", accessor: "email" },
    { Header: "Designation", accessor: "role" },
  ];

  return (
    <div className="Admin-myteamcontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Admin-myteam ${collapsed ? "collapsed" : ""}`}>
        <div className="ViewCustomer-container mb-5">
          <div className="ViewCustomer-table-container">
          <div className="back-button mt-3 d-flex justify-content-start">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back
            </button>
          </div>
            
                
              <h2 className='text-center'>Team Members</h2>
         
            <DataTable columns={memberColumns} data={teamMembers} />
            {/* <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
              >
                Back
              </button> */}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;