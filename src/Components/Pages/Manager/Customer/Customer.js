


import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from './../../../Layout/Table/TableLayout'; // Make sure to import your DataTable component
import Navbar from "../../../Shared/ManagerNavbar/Navbar";
import "./Customer.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {baseURL} from "../../../Apiservices/Api";
import { useNavigate } from 'react-router-dom';

const SalesCustomer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]); // State for storing leads
  const navigate = useNavigate();

  // Fetch leads on component load
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/allleads`);
        if (response.status === 200) {
          // Filter leads with 'Opportunity' status
          const filteredLeads = response.data.filter(
            (lead) => lead.status == "opportunity"
          );
          setData(filteredLeads); // Update state with filtered leads
        } else {
          console.error("Error fetching leads:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        alert("Failed to fetch leads.");
      }
    };

    fetchLeads();
  }, []);

  const navigateToLead = (leadId) => {
    navigate(`/details/${leadId}`, {
      state: { leadid: leadId },
    });
  };

  // Columns for DataTable component
  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,  // This will generate the serial number based on the row index
      },
      {
        Header: "Customer ID",
        accessor: "leadcode",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Mobile No",
        accessor: "phone_number",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      // {
      //   Header: "Duration",
      //   accessor: "duration",
      // },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <button
              className="btn btn-primary btn-sm me-2"
              onClick={()  =>navigateToLead(row.original.leadid)}
            >
              <FaEye />
            </button>
            {/* <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => editCustomer(row.original)}
            >
              <FaEdit />
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteCustomer(row.original.leadId)}
            >
              <FaTrash />
            </button> */}
          </div>
        ),
      },
    ],
    []
  );

  // Placeholder actions
  const viewCustomer = (customer) => {
    alert(`Viewing customer: ${customer.name}`);
  };

  const editCustomer = (customer) => {
    alert(`Editing customer: ${customer.name}`);
  };

  const deleteCustomer = (leadId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      // Perform delete logic here
      alert(`Customer with ID ${leadId} deleted.`);
    }
  };

  return (
    <div className="ManagerCustomercontainer">
    <Navbar onToggleSidebar={setCollapsed} />
    <div className={`ManagerCustomer ${collapsed ? "collapsed" : ""}`}>
      <div className="ManagerCustomer-container mb-5">
        <div className="ManagerCustomer-table-container">
            <h3 className="d-flex justify-content-between align-items-center">
              Customer Details
            </h3>
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesCustomer;
