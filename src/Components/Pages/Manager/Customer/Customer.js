import React, { useState } from "react";
import DataTable from './../../../Layout/Table/TableLayout'; // Make sure to import your DataTable component
import Navbar from "../../../Shared/ManagerNavbar/Navbar";
import './Customer.css'
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ManagerCustomer = () => {
   const [collapsed, setCollapsed] = useState(false);

   const data = [
    {
      leadId: "LD001",
      opportunityId: "OP001",
      customerId: "CU001",
      name: "Rajesh Kumar",
      mobileNo: "9876543210",
      email: "rajesh.kumar@example.com",
      addedBy: "Rajesh",
      actions: (
        <div>
          <button  className="btn btn-info view-button me-1">
              <FaEye />
          </button>
          <button className="btn btn-warning edit-button me-1 mb-1"
          > <FaEdit />
        </button>
         <button
              className="btn btn-danger delete-button me-1 mb-1">
              <FaTrash />  
              </button>
        </div>
      ),
    },
    {
      leadId: "LD002",
      opportunityId: "OP002",
      customerId: "CU002",
      name: "Jane Smith",
      mobileNo: "9123456780",
      email: "jane.smith@example.com",
      addedBy: "Mani",
      actions: (
        <div>
          <button  className="btn btn-info view-button me-1">
              <FaEye />
          </button>
          <button className="btn btn-warning edit-button me-1 mb-1"
          > <FaEdit />
        </button>
         <button
              className="btn btn-danger delete-button me-1 mb-1">
              <FaTrash />  
              </button>

        </div>
      ),
    },
    {
      leadId: "LD003",
      opportunityId: "OP003",
      customerId: "CU003",
      name: "Mike Johnson",
      mobileNo: "9012345678",
      email: "mike.johnson@example.com",
      addedBy: "Maniteja",
      actions: (
        <div>
          <button  className="btn btn-info view-button me-1">
              <FaEye />
          </button>
          <button className="btn btn-warning edit-button me-1 mb-1"
          > <FaEdit />
        </button>
         <button
              className="btn btn-danger delete-button me-1 mb-1">
              <FaTrash />  
              </button>

        </div>
      ),
    },
    {
      leadId: "LD004",
      opportunityId: "OP004",
      customerId: "CU004",
      name: "Emily Davis",
      mobileNo: "9988776655",
      email: "emily.davis@example.com",
      addedBy: "Rajesh",
      actions: (
        <div>
          <button  className="btn btn-info view-button me-1">
              <FaEye />
          </button>
          <button className="btn btn-warning edit-button me-1 mb-1"
          > <FaEdit />
        </button>
         <button
              className="btn btn-danger delete-button me-1 mb-1">
              <FaTrash />  
              </button>

        </div>
      ),
    },
    {
      leadId: "LD005",
      opportunityId: "OP005",
      customerId: "CU005",
      name: "Robert Brown",
      mobileNo: "8899776655",
      email: "robert.brown@example.com",
      addedBy: "Hemanth",
      actions: (
        <div>
           <button  className="btn btn-info view-button me-1">
              <FaEye />
          </button>
          <button className="btn btn-warning edit-button me-1 mb-1"
          > <FaEdit />
        </button>
         <button
              className="btn btn-danger delete-button me-1 mb-1">
              <FaTrash />  
              </button>

        </div>
      ),
    },
  ];
  // Columns for DataTable component
  const columns = React.useMemo(
    () => [
      // {
      //   Header: 'Lead ID',
      //   accessor: 'leadId',
      // },
      // {
      //   Header: 'Opportunity ID',
      //   accessor: 'opportunityId',
      // },
      {
        Header: 'Customer ID',
        accessor: 'customerId',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Mobile No',
        accessor: 'mobileNo',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Added By',
        accessor: 'addedBy',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
      },
    ],
    []
  );

  return (
    <div className="ManagerCustomercontainer">
    <Navbar onToggleSidebar={setCollapsed} />
    <div className={`ManagerCustomer ${collapsed ? "collapsed" : ""}`}>
      <div className="ManagerCustomer-container mb-5">
        <div className="ManagerCustomer-table-container">
          <h3 className="d-flex justify-content-between align-items-center">Customer Details</h3>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default ManagerCustomer;
