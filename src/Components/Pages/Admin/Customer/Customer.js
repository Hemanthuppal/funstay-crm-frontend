import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DataTable from './../../../Layout/Table/TableLayout'; 
import Navbar from "../../../Shared/Navbar/Navbar";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { baseURL } from "../../../Apiservices/Api";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../AuthContext/AuthContext";

const AdminCustomer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]); 
  const navigate = useNavigate();
  const { authToken, userId } = useContext(AuthContext);
const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/customers`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (response.status === 200) {
          const existingCustomers = response.data
            .filter(customer => customer.customer_status == "existing") 
            .map(customer => ({
              ...customer,
              formattedId: `CUS${String(customer.id).padStart(4, '0')}` 
            })); 
          
          setData(existingCustomers); 
        } else {
          console.error("Error fetching customers:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        alert("Failed to fetch customers.");
      }
    };
  
    fetchCustomers();
  }, [authToken]);
  

  


  const navigateToCustomerDetails = (id) => {
    navigate(`/a-customerdetails/${id}`, {
      state: { id: id },
    });
  };


    const navigateToEditLead = (id) => {
      navigate(`/a-editcustomerdetails/${id}`, {
        state: { id: id },
      });
    };
  
   
  const handleDeleteCustomer = async (customerId) => {
   
    try {
      const response = await axios.delete(`${baseURL}/api/customers/${customerId}`);
      setMessage(response.data.message); 
      setTimeout(() => setMessage(""), 3000);

      setData((prevCustomers) => prevCustomers.filter(customer => customer.id !== customerId));

    } catch (error) {
      console.error("Error deleting customer:", error);
      setMessage("Failed to delete customer. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };


  const columns = React.useMemo(
    () => [
      {
        Header: "S.No",
        accessor: (row, index) => index + 1,  
      },
      {
        Header: "Customer ID",
        accessor: "id", 
       
      },
      {
        Header: "Name",
        accessor: "name", 
        Cell: ({ row }) => (
          <div
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            onClick={() => navigateToCustomerDetails(row.original.id)}
          >
            {row.original.name}
          </div>
        ),
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
              Header: "Actions",
              Cell: ({ row }) => (
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                  <FaEye
                    style={{ color: "#ff9966", cursor: "pointer" }}
                    onClick={() => navigateToCustomerDetails(row.original.id)}
                  />
 <FaTrash
                    style={{ color: "#ff9966", cursor: "pointer" }}
                    onClick={() => handleDeleteCustomer(row.original.id)}
                  />
                   <FaEdit
    style={{ color: "#ff9966", cursor: "pointer" }}
    onClick={() => navigateToEditLead(row.original.id)}
  />

                </div>
              ),
            }
    ],
    []
  );

 

  return (
    <div className="AdminCustomercontainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`AdminCustomer ${collapsed ? "collapsed" : ""}`}>
        <div className="AdminCustomer-container mb-5">
          <div className="AdminCustomer-table-container">
            <h3 className="d-flex justify-content-between align-items-center">Customer Details</h3>
            {message && <div className="alert alert-success">{message}</div>}
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomer;