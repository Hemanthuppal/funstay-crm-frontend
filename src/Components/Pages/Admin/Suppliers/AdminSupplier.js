import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Shared/Navbar/Navbar";
import DataTable from "../../../Layout/Table/TableLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { baseURL } from "../../../Apiservices/Api";

const AdminSupplier = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const columns = [
    { Header: "Supplier Name", accessor: "supplier_name" },
    { Header: "Total Payable", accessor: "total_payable" },
    { Header: "Paid On", accessor: "paid_on" },
    { Header: "Paid Amount", accessor: "paid_amount" },
    { Header: "Balance Payment", accessor: "balance_payment" },
    { Header: "Comments", accessor: "comments" },
  ];

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch(`${baseURL}/api/suppliers`);
        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }
        const data = await response.json();
        setSuppliersData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="salesViewLeadsContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h2>Suppliers</h2>
          <Button variant="primary" onClick={() => navigate("/a-add-supplier")}>
            + Add Supplier
          </Button>
        </div>

        <div className="container mt-3">
          <DataTable 
            columns={columns} 
            data={suppliersData} 
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSupplier;