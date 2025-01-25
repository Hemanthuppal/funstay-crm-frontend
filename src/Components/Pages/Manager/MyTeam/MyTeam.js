import React, { useState} from 'react';
import DataTable from './../../../Layout/Table/TableLayout'; // Make sure to import your DataTable component
import Navbar from "../../../Shared/ManagerNavbar/Navbar";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import './MyTeam.css';

const MyTeam = () => {
  const [collapsed, setCollapsed] = useState(false);
  const data = [
    {
      employeeId: "E001",
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "rajesh.kumar@example.com",
    
      designation: "Manager",
      actions: (
        <div>
           <button  className="btn btn-info view-button me-1">
                       <FaEye />
                   </button>
                   <button className="btn btn-warning edit-button me-1 mb-1"
                   > <FaEdit />
                 </button>
        </div>
      ),
    },
    {
      employeeId: "E002",
      name: "Jane Smith",
      mobile: "9123456780",

      email: "jane.smith@example.com",
      designation: "Admin",
      actions: (
        <div>
           <button  className="btn btn-info view-button me-1">
                       <FaEye />
                   </button>
                   <button className="btn btn-warning edit-button me-1 mb-1"
                   > <FaEdit />
                 </button>
        </div>
      ),
    },
    {
      employeeId: "E003",
      name: "Mike Johnson",
      mobile: "9012345678",

      email: "mike.johnson@example.com",
      designation: "Staff",
      actions: (
        <div>
           <button  className="btn btn-info view-button me-1">
                       <FaEye />
                   </button>
                   <button className="btn btn-warning edit-button me-1 mb-1"
                   > <FaEdit />
                 </button>
        </div>
      ),
    },
    {
      employeeId: "E004",
      name: "Emily Davis",
      mobile: "9988776655",

      email: "emily.davis@example.com",
      designation: "Manager",
      actions: (
        <div>
         <button  className="btn btn-info view-button me-1">
                     <FaEye />
                 </button>
                 <button className="btn btn-warning edit-button me-1 mb-1"
                 > <FaEdit />
               </button>
        </div>
      ),
    },
    {
      employeeId: "E005",
      name: "Robert Brown",
      mobile: "8899776655",

      email: "robert.brown@example.com",
      designation: "Staff",
      actions: (
        <div>
          <button  className="btn btn-info view-button me-1">
                      <FaEye />
                  </button>
                  <button className="btn btn-warning edit-button me-1 mb-1"
                  > <FaEdit />
                </button>
        </div>
      ),
    },
  ];

  // Columns for DataTable component
  const columns = React.useMemo(
    () => [
      {
        Header: 'Employee ID',
        accessor: 'employeeId',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
    
      {
        Header: 'Designation',
        accessor: 'designation',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
      },
    ],
    []
  );

  return (
    <div className="manager-myteamcontainer">
    <Navbar onToggleSidebar={setCollapsed} />
    <div className={`manager-myteam ${collapsed ? "collapsed" : ""}`}>
      <div className="manager-myteam-container mb-5">
        <div className="manager-myteam-table-container">
          <h3 className="d-flex justify-content-between align-items-center"></h3>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default MyTeam;
