import React, { useState, useEffect, useContext } from "react";
import DataTable from "./../../../Layout/Table/TableLayout"; // Make sure to import your DataTable component
import Navbar from "../../../Shared/Sales-ExecutiveNavbar/Navbar";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import './MyTeamSales.css';
import { AuthContext } from '../../../../Components/AuthContext/AuthContext';
import axios from 'axios';
import { baseURL } from '../../../Apiservices/Api';

const MyTeamSales = () => {
  const { userId } = useContext(AuthContext); // Get the userId from context
  const [collapsed, setCollapsed] = useState(false);
  const [managerData, setManagerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the data for the manager and assigned employees using the userId
    axios.get(`${baseURL}/${userId}`)
      .then((response) => {
        setManagerData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
        setError("Failed to fetch data.");
        setLoading(false);
      });
  }, [userId]);

  // Columns for DataTable component
  const columns = React.useMemo(
    () => [
      {
        Header: "S.no",
        accessor: (_row, index) => index + 1,
      },
      // {
      //   Header: "Employee ID",
      //   accessor: "id",
      //   Cell: ({ value }) => `EMP${String(value).padStart(5, "0")}`, 
      // },      
      
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
      // {
      //   Header: "Actions",
      //   accessor: "actions",
      //   Cell: () => (
      //     <div>
      //       <FaEye /> <FaEdit /> <FaTrash />
      //     </div>
      //   ),
      // },
    ],
    []
  );

  // Check if data is loading or if there was an error
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Prepare data for the table
  const data = [
    {
      employeeId: managerData.manager.id,
      name: managerData.manager.name,
      mobile: managerData.manager.mobile,
      email: managerData.manager.email,
      designation: "Manager",
    },
    ...managerData.assignedEmployees.map((emp) => ({
      employeeId: emp.id,
      name: emp.name,
      mobile: emp.mobile, // Replace with the actual mobile if available
      email: emp.email, // Replace with the actual email if available
      designation: "sales Executive",
    })),
  ];

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
