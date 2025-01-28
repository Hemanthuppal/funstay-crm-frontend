import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import DataTable from './../../../Layout/Table/TableLayout';
import Navbar from "../../../Shared/Navbar/Navbar";
import '../Customer/Customer.css';
import './AllTeams.css';

import axios from 'axios';
import { baseURL } from "../../../Apiservices/Api";
import { useNavigate } from "react-router-dom";

const AdminCustomer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [managers, setManagers] = useState([]);

  const handleAddEmployee = () => {
    navigate('/addemployee');
  };

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get(`${baseURL}/employees/managers`);
        setManagers(response.data.data);
      } catch (error) {
        console.error("Error fetching managers:", error);
      }
    };
    fetchManagers();
  }, []);

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await axios.delete(`${baseURL}/employees/${id}`);
      if (response.status === 204) {
        // Remove the deleted employee from the state
        setManagers(managers.filter(manager => manager.id !== id));
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const columns = [
    {
      Header: "S.No",
      accessor: (row, index) => index + 1,
    },
    { Header: "Name", accessor: "name" },
    { Header: "Mobile No", accessor: "mobile" },
    { Header: "Email", accessor: "email" },
    { Header: "Designation", accessor: "role" },
    {
      Header: "No. of Team Members",
      accessor: "teamMembers",
      Cell: ({ row }) => (
        <button
          className="btn btn-link"
          onClick={() => {
            setSelectedTeam(row.original.teamMembers);
            setIsModalOpen(true);
          }}
        >
          {row.original.employeeCount}
        </button>
      ),
    },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div>
          <button
            className="btn btn-info me-2"
            onClick={() => {
              setSelectedTeam(row.original.teamMembers);
              setIsModalOpen(true);
            }}
          >
            <FaEye />
          </button>
          {/* <button className="btn btn-warning me-2">
            <FaEdit />
          </button> */}
          <button
            className="btn btn-danger"
            onClick={() => handleDeleteEmployee(row.original.id)} // Assuming 'id' is the unique identifier
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  const memberColumns = [
    {
      Header: "S.No",
      accessor: (row, index) => index + 1,
    },
    { Header: "Name", accessor: "name" },
    { Header: "Mobile", accessor: "mobile" },
    { Header: "Email", accessor: "email" },
    { Header: "Designation", accessor: "role" },
    // {
    //   Header: "Actions",
    //   Cell: ({ row }) => (
    //     <div>
    //       <button className="btn btn-info me-2">
    //         <FaEye />
    //       </button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="Admin-myteamcontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`Admin-myteam ${collapsed ? "collapsed" : ""}`}>
        <div className="ViewCustomer-container mb-5">
          <div className="ViewCustomer-table-container">
            <h3 className="d-flex justify-content-between align-items-center w-100">
              <span></span>
              <button
                className="btn btn-primary"
                onClick={handleAddEmployee}
              >
                + Add Employee
              </button>
            </h3>
            <DataTable columns={columns} data={managers} />
          </div>
        </div>
      </div>

      {/* Team Members Modal */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <DataTable columns={memberColumns} data={selectedTeam || []} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomer;