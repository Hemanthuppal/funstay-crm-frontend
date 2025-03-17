import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DataTable from './../../../Layout/Table/TableLayout';
import Navbar from "../../../Shared/Navbar/Navbar";
import { FaEye, FaEdit, FaTrash, FaCopy } from "react-icons/fa";
import { baseURL } from "../../../Apiservices/Api";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../AuthContext/AuthContext";

const AdminCustomer = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage("Copied to clipboard!");
      setTimeout(() => setMessage(""), 1000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/customers`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.status === 200) {
        const existingCustomers = response.data
          .filter(customer => customer.customer_status === "existing")
          .map(customer => ({
            ...customer,
            formattedId: `CUS${String(customer.id).padStart(4, '0')}`
          }));

        setData(existingCustomers);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to fetch customers.");
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/tags`);
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    fetchCustomers(); // Fetch all customers on component mount
  }, [authToken]);

  // Fetch filtered customers based on selected tag
  useEffect(() => {
    const fetchFilteredCustomers = async () => {
      if (selectedTag) {
        try {
          const response = await axios.get(`${baseURL}/api/tagfilter`, {
            params: { tag: selectedTag },
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.status === 200) {
            setData(response.data);
          }
        } catch (error) {
          console.error("Error fetching filtered customers:", error);
          alert("Failed to fetch filtered customers.");
        }
      } else {
        // If no tag is selected, fetch all customers again
        fetchCustomers();
      }
    };
    fetchFilteredCustomers();
  }, [selectedTag, authToken]);
  console.log(`${baseURL}/api/tagfilter?tag=${selectedTag}`);
  const navigateToCustomerDetails = (id) => {
    navigate(`/a-customerdetails/${id}`, { state: { id } });
  };

  const navigateToEditLead = (id) => {
    navigate(`/a-editcustomerdetails/${id}`, { state: { id } });
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await axios.delete(`${baseURL}/api/customers/${customerId}`);
      setData(prev => prev.filter(customer => customer.id !== customerId));
      setMessage("Customer deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting customer:", error);
      setMessage("Failed to delete customer");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const columns = React.useMemo(
    () => [
      // {
      //   Header: "S.No",
      //   accessor: (row, index) => index + 1,
      // },
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
        Header: "Mobile",
        accessor: "phone_number",
        Cell: ({ row }) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <a
              href={`https://wa.me/${row.original.phone_number}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}
              title="Chat on WhatsApp"
            >
              {row.original.phone_number}
            </a>
            <FaCopy
              style={{ marginLeft: "8px", cursor: "pointer", color: "#ff9966" }}
              onClick={() => copyToClipboard(row.original.phone_number)}
              title="Copy Phone Number"
            />
          </div>
        ),
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ row }) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between", // Push copy button to the right
              width: "100%",
              maxWidth: "200px", // Adjust width as needed
            }}
          >
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
              }}
              title={row.original.email} // Show full email on hover
            >
              {row.original.email}
            </div>
            <FaCopy
              style={{ cursor: "pointer", color: "#ff9966" }}
              onClick={() => copyToClipboard(row.original.email)}
              title="Copy Email"
            />
          </div>
        ),
      },
      {
        Header: "Origin City",
        accessor: "origincity",

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
          <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Customer Details</h3>
              <select 
                className="form-select w-25"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option value="">All Tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.value}>
                    {tag.value}
                  </option>
                ))}
              </select>
            </div>
            
            {message && <div className="alert alert-success">{message}</div>}
            {data.length === 0 ? (
              <div className="alert alert-info">No customers found for the selected tag.</div>
            ) : (
              <DataTable columns={columns} data={data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomer;