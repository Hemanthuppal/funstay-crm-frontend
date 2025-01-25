import React, { useState } from "react";
import DataTable from "./../../../Layout/Table/TableLayout"; // Make sure to import your DataTable component
import Navbar from "../../../Shared/Sales-ExecutiveNavbar/Navbar";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import './MyTeamSales.css';

const MyTeamSales = () => {
  const [collapsed, setCollapsed] = useState(false);
  const data = [
    {
      employeeId: "E001",
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "rajesh.kumar@example.com",

      designation: "Manager",
    },
    {
      employeeId: "E002",
      name: "Jane Smith",
      mobile: "9123456780",

      email: "jane.smith@example.com",
      designation: "Admin",
    },
    {
      employeeId: "E003",
      name: "Mike Johnson",
      mobile: "9012345678",

      email: "mike.johnson@example.com",
      designation: "Staff",
    },
    {
      employeeId: "E004",
      name: "Emily Davis",
      mobile: "9988776655",

      email: "emily.davis@example.com",
      designation: "Manager",
    },
    {
      employeeId: "E005",
      name: "Robert Brown",
      mobile: "8899776655",

      email: "robert.brown@example.com",
      designation: "Staff",
    },
  ];

  // Columns for DataTable component
  const columns = React.useMemo(
    () => [
      {
        Header: "Employee ID",
        accessor: "employeeId",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Mobile",
        accessor: "mobile",
      },
      {
        Header: "Email",
        accessor: "email",
      },

      {
        Header: "Designation",
        accessor: "designation",
      },
    ],
    []
  );

  return (
    <div className="salesmyteamcontainer">
    <Navbar onToggleSidebar={setCollapsed} />
    <div className={`salesmyteam ${collapsed ? "collapsed" : ""}`}>
      <div className="Sales-myteam-container mb-5">
        <div className="Sales-myteam-table-container">
          <h3 className="d-flex justify-content-between align-items-center"></h3>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default MyTeamSales;
