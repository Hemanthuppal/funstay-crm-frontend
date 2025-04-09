// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaPlus } from 'react-icons/fa';
// import { useNavigate, useParams } from "react-router-dom";
// import Navbar from '../../../../Shared/Navbar/Navbar';
// import { baseURL } from '../../../../Apiservices/Api';
// import DataTable from "../../../../Layout/Table/TableLayout";
// import './Supplier.css';

// const SupplierTable = () => {
//   const [suppliers, setSuppliers] = useState([]);
//   const [totals, setTotals] = useState({
//     totalPayable: 0,
//     paidAmount: 0,
//     balancePayment: 0,
//   });
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("payables");
//   const { leadid } = useParams();

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const fetchSuppliers = async () => {
//     try {
//       const res = await axios.get(`${baseURL}/api/suppliers?leadid=${leadid}`);
//       setSuppliers(res.data);

//       // Calculate totals
//       const totals = res.data.reduce(
//         (acc, curr) => {
//           acc.totalPayable += Number(curr.total_payable || 0);
//           acc.paidAmount += Number(curr.paid_amount || 0);
//           acc.balancePayment += Number(curr.balance_payment || 0);
//           return acc;
//         },
//         { totalPayable: 0, paidAmount: 0, balancePayment: 0 }
//       );

//       setTotals(totals);
//     } catch (err) {
//       console.error('Error fetching suppliers:', err);
//     }
//   };

//   const columns = [
//     { Header: "Supplier Name", accessor: "supplier_name" },
//     { Header: "Total Payable", accessor: "total_payable" },
//     // { Header: "Paid On", accessor: "paid_on" },
//     { Header: "Paid Amount", accessor: "paid_amount" },
//     { Header: "Balance Payment", accessor: "balance_payment" },
//     { Header: "Comments", accessor: "comments" },
//     { Header: "Purpose of Payment", accessor: "purpose" },
//     {
//       Header: "Actions",
//       Cell: ({ row }) => (
//         <div className="btn-group">
//           <FaPlus 
//             style={{ color: "#ff9966", cursor: "pointer", marginRight: "10px" }}
//             onClick={() => navigate(`/a-suppliers/${row.original.id}/${leadid}`)}
//           />
//           <button
//             className="btn btn-sm btn-outline-primary"
//             onClick={() => navigate(`/a-suppliers/${row.original.id}/history`)}
//           >
//             View
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const tableData = suppliers.map((supplier, index) => ({
//     ...supplier,
//     serial: index + 1
//   }));

//   return (
//     <div className="salesViewLeadsContainer">
//   <Navbar />
//   <div className="salesViewLeads">
//   <div className="payments-tabs">
//   <button
//     className={activeTab === "payables" ? "active" : ""}
//     onClick={() => {
//       setActiveTab("payables");
//     }}
//   >
//     Payables
//   </button>
//   <button
//     className={activeTab === "receivables" ? "active" : ""}
//     onClick={() => {
//       setActiveTab("receivables");
//       navigate(`/a-payments/${leadid}`);
//     }}
//   >
//     Receivables
//   </button>
// </div>

//     <div className="tableHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
      
//       <h3>Supplier List</h3>
//       <button
//         className="addSupplierBtn"
//         onClick={() => navigate(`/a-add-supplier/${leadid}`)} // Change route as needed
//       >
//         + Add Supplier
//       </button>
//     </div>
//     {/* Totals Section */}
//     <div className="totals-summary" style={{
//           margin: "20px 0",
//           backgroundColor: "#f9f9f9",
//           border: "1px solid #ddd",
//           padding: "15px",
//           borderRadius: "8px",
//           display: "flex",
//           justifyContent: "space-around",
//           fontWeight: "bold"
//         }}>
//           <span>Total Payable: ₹ {totals.totalPayable.toFixed(2)}</span>
//           <span>Paid Amount: ₹ {totals.paidAmount.toFixed(2)}</span>
//           <span>Balance Payment: ₹ {totals.balancePayment.toFixed(2)}</span>
//         </div>
    
//     <DataTable columns={columns} data={tableData} />
    
//   </div>
// </div>

//   );
// };

// export default SupplierTable;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router-dom";
import Navbar from '../../../../Shared/ManagerNavbar/Navbar';
import { baseURL } from '../../../../Apiservices/Api';
import DataTable from "../../../../Layout/Table/TableLayout";
import './Supplier.css';

const M_SupplierTable = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [totals, setTotals] = useState({
    totalPayable: 0,
    paidAmount: 0,
    balancePayment: 0,
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("payables");
  const { leadid } = useParams();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/suppliers?leadid=${leadid}`);
      setSuppliers(res.data);

      // Calculate totals
      const totals = res.data.reduce(
        (acc, curr) => {
          acc.totalPayable += Number(curr.total_payable || 0);
          acc.paidAmount += Number(curr.paid_amount || 0);
          acc.balancePayment += Number(curr.balance_payment || 0);
          return acc;
        },
        { totalPayable: 0, paidAmount: 0, balancePayment: 0 }
      );

      setTotals(totals);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const columns = [
    {
      Header: "S.No",
      accessor: (_, rowIndex) => rowIndex + 1,
      Cell: ({ row }) => row.index + 1,
  },
    { Header: "Supplier Name", accessor: "supplier_name" },
    { Header: "Total Payable", accessor: "total_payable" },
    { Header: "Paid On", accessor: "paid_on" },
    { Header: "Paid Amount", accessor: "paid_amount" },
    { Header: "Balance Payment", accessor: "balance_payment" },
    { Header: "Comments", accessor: "comments" },
    { Header: "Purpose of Payment", accessor: "purpose" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Actions",
      Cell: ({ row }) => (
        <div className="btn-group">
          <FaPlus
            style={{ color: "#ff9966", cursor: "pointer", marginRight: "10px" }}
            onClick={() =>
              navigate(`/m-suppliers/${row.original.id}/${leadid}`, {
                state: { supplier: row.original }
              })
            }
          />
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => navigate(`/m-suppliers/${row.original.id}/history`)}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const tableData = suppliers.map((supplier, index) => ({
    ...supplier,
    serial: index + 1
  }));

  return (
    <div className="salesViewLeadsContainer">
      <Navbar />
      <div className="salesViewLeads">
      <div className="payments-tabs">
          <button
            className={activeTab === "payables" ? "active" : ""}
            onClick={() => setActiveTab("payables")}
          >
            Payables
          </button>
          <button
            className={activeTab === "receivables" ? "active" : ""}
            onClick={() => {
              setActiveTab("receivables");
              navigate(`/m-payments/${leadid}`);
            }}
          >
            Receivables
          </button>
        </div>
        <div className="tableHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <h3>Supplier List</h3>
          <button
            className="addSupplierBtn"
            onClick={() => navigate(`/m-add-supplier/${leadid}`)}
          >
            + Add Supplier
          </button>
        </div>

        {/* Totals Section */}
        <div className="totals-summary" style={{
          margin: "20px 0",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-around",
          fontWeight: "bold"
        }}>
          <span>Total Payable: ₹ {totals.totalPayable.toFixed(2)}</span>
          <span>Paid Amount: ₹ {totals.paidAmount.toFixed(2)}</span>
          <span>Balance Payment: ₹ {totals.balancePayment.toFixed(2)}</span>
        </div>

        <DataTable columns={columns} data={tableData} />
      </div>
    </div>
  );
};

export default M_SupplierTable;