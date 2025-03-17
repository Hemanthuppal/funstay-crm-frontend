import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "./Components/Layout/Table/TableLayout";
import { webhookUrl } from "./Components/Apiservices/Api";

const dropdownOptions = {
  primary: ["New", "No Response", "Duplicate", "False Lead", "Junk", "Plan Cancelled"],
  secondary: {
    New: ["Yet to Contact", "Not picking up call", "Asked to call later"],
    "No Response": [],
    Duplicate: [],
    Junk: ["Plan Cancelled", "Plan Delayed", "Already Booked", "Others"],
    "Plan Cancelled": [],
  },
};

const Tabelfilter = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [categoryFilter, setCategoryFilter] = useState(""); // New filter state

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${webhookUrl}/api/enquiries`);

        if (response.status === 200) {
          setData(response.data); // Set the fetched data into state
        } else {
          console.error("Error fetching customers:", response.statusText);
          setError("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setError("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchCustomers();
  }, []);

  const handlePrimaryStatusChange = (value, leadId) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.leadid === leadId ? { ...item, primaryStatus: value, secondaryStatus: "" } : item
      )
    );
  };

  const handleSecondaryStatusChange = (value, leadId) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.leadid === leadId ? { ...item, secondaryStatus: value } : item
      )
    );
  };

  // Define columns inside the component and pass the handlers
  const columns = [
    {
      Header: "S.No",
      accessor: (row, index) => index + 1,
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Mobile",
      accessor: "phone_number",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Category", // New column for category
      accessor: "category",
    },
    {
      Header: "Lead Status",
      Cell: ({ row }) => {
        const primaryStatus = row.original.primaryStatus || "";
        const secondaryStatus = row.original.secondaryStatus || "";
        const secondaryOptions = dropdownOptions.secondary[primaryStatus] || [];
        const isSecondaryDisabled = !primaryStatus || secondaryOptions.length === 0;

        return (
          <div className="d-flex align-items-center">
            <select
              value={primaryStatus}
              onChange={(e) =>
                handlePrimaryStatusChange(e.target.value, row.original.leadid)
              }
              className="form-select me-2"
            >
              <option value="">Select Primary Status</option>
              {dropdownOptions.primary.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              value={secondaryStatus}
              onChange={(e) =>
                handleSecondaryStatusChange(e.target.value, row.original.leadid)
              }
              className="form-select"
              disabled={isSecondaryDisabled}
            >
              <option value="">Select Secondary Status</option>
              {secondaryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      },
    },
  ];

  // Apply category filter to the data
  const filteredData = categoryFilter
    ? data.filter((item) => item.category === categoryFilter)
    : data;

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return (
    <div>
      {/* Add a category filter dropdown */}
      <div className="mb-3">
        <label htmlFor="categoryFilter" className="form-label">Filter by Category:</label>
        <select
          id="categoryFilter"
          className="form-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Category1">Category 1</option>
          <option value="Category2">Category 2</option>
          <option value="Category3">Category 3</option>
        </select>
      </div>

      {/* Pass the filtered data to the DataTable */}
      <DataTable columns={columns} data={filteredData} />
    </div>
  );
};

export default Tabelfilter;