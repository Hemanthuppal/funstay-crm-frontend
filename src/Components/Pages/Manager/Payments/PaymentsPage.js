// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./payments.css";
// import Navbar from "../../../Shared/Navbar/Navbar";
// import { baseURL } from "../../../Apiservices/Api";
// import DataTable from "../../../Layout/Table/TableLayout";

// const PaymentsPage = () => {
//     const { leadid } = useParams();
//     const navigate = useNavigate();
//     const [collapsed, setCollapsed] = useState(false);

//     const [customer, setCustomer] = useState(null);
//     const [receivables, setReceivables] = useState([]);
//     const [activeTab, setActiveTab] = useState("receivables");

//     useEffect(() => {
//         // Fetch lead details
//         fetch(`${baseURL}/api/leads/${leadid}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 setCustomer((prev) => ({
//                     ...prev,
//                     leadid: data.leadid,
//                     customerid: data.customerid,
//                     name: data.name,
//                     email: data.email,
//                     // totalAmount will come from the next fetch
//                 }));
//             })
//             .catch((err) => console.error("Error fetching lead:", err));

//         fetch(`${baseURL}/travel-opportunity`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log("All travel opportunities:", data);

//                 // Find the one that matches the leadid
//                 const matchedOpportunity = data.find(item => item.leadid == leadid);

//                 if (matchedOpportunity) {
//                     setCustomer((prev) => ({
//                         ...prev,
//                         totalAmount: matchedOpportunity.approx_budget, // or totalAmount
//                     }));
//                 } else {
//                     console.warn("No travel opportunity found for leadid:", leadid);
//                 }
//             })
//             .catch((err) => console.error("Error fetching travel opportunities:", err));
//     }, [leadid]);


//     useEffect(() => {
//         fetch(`${baseURL}/api/payments?leadid=${leadid}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 setReceivables(data);
//             })
//             .catch((err) => console.error("Error fetching receivables:", err));
//     }, [leadid]);

//     if (!customer) {
//         return <div className="payments-container">Loading lead info...</div>;
//     }

//     // Calculate totals
//     const totalPaid = receivables.reduce(
//         (acc, curr) => acc + parseFloat(curr.paid_amount || 0),
//         0
//     );
//     const balanceRemaining = customer.totalAmount - totalPaid;

//     // Prepare data for DataTable
//     const tableColumns = [
//         {
//             Header: "S.No",
//             accessor: (_, rowIndex) => rowIndex + 1,
//             Cell: ({ row }) => row.index + 1,
//         },
//         { Header: "Paid Amount", accessor: "paid_amount", Cell: ({ value }) => `₹${value}` },
//         { Header: "Balance Amount", accessor: "balance_amount", Cell: ({ value }) => `₹${value}` },
//         { Header: "Paid On", accessor: "paid_on" },
//         { Header: "Remarks", accessor: "remarks" },
//     ];

//     return (
//         <div className="salesViewLeadsContainer">
//             <Navbar onToggleSidebar={setCollapsed} />
//             <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
//                 <div className="payments-tabs">
//                     <button
//                         className={activeTab === "payables" ? "active" : ""}
//                         onClick={() => {
//                             setActiveTab("payables");
//                             navigate(`/a-supplier/${leadid}`);
//                         }}
//                     >
//                         Payables
//                     </button>
//                     <button
//                         className={activeTab === "receivables" ? "active" : ""}
//                         onClick={() => setActiveTab("receivables")}
//                     >
//                         Receivables
//                     </button>
//                 </div>
//                 <h2>Payments - Lead ID: {customer.leadid}</h2>
//                 <div className="totals-summary" style={{
//                     margin: "20px 0",
//                     backgroundColor: "#f9f9f9",
//                     border: "1px solid #ddd",
//                     padding: "15px",
//                     borderRadius: "8px",
//                     display: "flex",
//                     justifyContent: "space-around",
//                     fontWeight: "bold"
//                 }}>
//                      <span>Name: {customer.name}</span>
//                      <span>Email: {customer.email}</span>
//                     <span>Total Amount: ₹{customer.totalAmount}</span>
//                     <span>Total Paid: ₹{totalPaid}</span>
//                     <span>
//                         Balance Remaining:{" "}
//                         <span style={{ color: balanceRemaining > 0 ? "red" : "green" }}>
//                             ₹{balanceRemaining}
//                         </span>
//                     </span>
//                 </div>

//                 {activeTab === "receivables" && (
//                     <>
//                         <div className="payments-table-header">
//                             <button
//                                 className="btn btn-primary"
//                                 onClick={() => navigate(`/a-add-payment/${leadid}`)}
//                             >
//                                 Add Payment
//                             </button>
//                         </div>

//                         {receivables.length > 0 ? (
//                             <DataTable
//                                 columns={tableColumns}
//                                 data={receivables}
//                                 pagination
//                                 searchable
//                             />
//                         ) : (
//                             <div className="no-payments-found">No payments found.</div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PaymentsPage;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./payments.css";
import Navbar from "../../../Shared/ManagerNavbar/Navbar";
import { baseURL } from "../../../Apiservices/Api";
import DataTable from "../../../Layout/Table/TableLayout";

const M_PaymentsPage = () => {
    const { leadid } = useParams();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const [customer, setCustomer] = useState(null);
    const [receivables, setReceivables] = useState([]);
    const [activeTab, setActiveTab] = useState("receivables");

    const [isEditingAmount, setIsEditingAmount] = useState(false); // toggle edit mode
    const [editedAmount, setEditedAmount] = useState(""); // temp input value

    // Fetch lead and opportunity data
    useEffect(() => {
        // Get lead data
        fetch(`${baseURL}/api/leads/${leadid}`)
            .then((res) => res.json())
            .then((data) => {
                setCustomer((prev) => ({
                    ...prev,
                    leadid: data.leadid,
                    customerid: data.customerid,
                    name: data.name,
                    email: data.email,
                }));
            })
            .catch((err) => console.error("Error fetching lead:", err));

        // Get travel opportunity data
        fetch(`${baseURL}/travel-opportunity`)
            .then((res) => res.json())
            .then((data) => {
                const matchedOpportunity = data.find(item => item.leadid == leadid);
                if (matchedOpportunity) {
                    setCustomer((prev) => ({
                        ...prev,
                        id: matchedOpportunity.id, // Store ID for update
                        totalAmount: matchedOpportunity.approx_budget,
                    }));
                    setEditedAmount(matchedOpportunity.approx_budget);
                }
            })
            .catch((err) => console.error("Error fetching travel opportunities:", err));
    }, [leadid]);

    // Fetch payment data
    useEffect(() => {
        fetch(`${baseURL}/api/payments?leadid=${leadid}`)
            .then((res) => res.json())
            .then((data) => {
                setReceivables(data);
            })
            .catch((err) => console.error("Error fetching receivables:", err));
    }, [leadid]);

    // Save updated amount to backend
    const handleSaveAmount = () => {
        fetch(`${baseURL}/travel-opportunity/${customer.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                approx_budget: editedAmount,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setCustomer((prev) => ({
                    ...prev,
                    totalAmount: editedAmount,
                }));
                setIsEditingAmount(false);
                alert("Total amount updated successfully!");
            })
            .catch((err) => {
                console.error("Error updating total amount:", err);
                alert("Failed to update total amount.");
            });
    };

    if (!customer) {
        return <div className="payments-container">Loading lead info...</div>;
    }

    const totalPaid = receivables.reduce(
        (acc, curr) => acc + parseFloat(curr.paid_amount || 0),
        0
    );
    const balanceRemaining = customer.totalAmount - totalPaid;

    const tableColumns = [
        {
            Header: "S.No",
            accessor: (_, rowIndex) => rowIndex + 1,
            Cell: ({ row }) => row.index + 1,
        },
        { Header: "Paid Amount", accessor: "paid_amount", Cell: ({ value }) => `₹${value}` },
        { Header: "Balance Amount", accessor: "balance_amount", Cell: ({ value }) => `₹${value}` },
        { Header: "Paid On", accessor: "paid_on" },
        { Header: "Remarks", accessor: "remarks" },
        { Header: "Status", accessor: "status" },
    ];

    return (
        <div className="salesViewLeadsContainer">
            <Navbar onToggleSidebar={setCollapsed} />
            <div className={`salesViewLeads ${collapsed ? "collapsed" : ""}`}>
                <div className="payments-tabs">
                    <button
                        className={activeTab === "payables" ? "active" : ""}
                        onClick={() => {
                            setActiveTab("payables");
                            navigate(`/m-supplier/${leadid}`);
                        }}
                    >
                        Payables
                    </button>
                    <button
                        className={activeTab === "receivables" ? "active" : ""}
                        onClick={() => setActiveTab("receivables")}
                    >
                        Receivables
                    </button>
                </div>

                <h2>Payments - Lead ID: {customer.leadid}</h2>

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
                    <span>Name: {customer.name}</span>
                    <span>Email: {customer.email}</span>

                    {/* Editable Total Amount */}
                    <span>
                        Total Amount: ₹
                        {isEditingAmount ? (
                            <>
                                <input
                                    type="number"
                                    value={editedAmount}
                                    onChange={(e) => setEditedAmount(e.target.value)}
                                    style={{ width: "100px", marginRight: "5px" }}
                                />
                                <button onClick={handleSaveAmount}>Save</button>
                                <button onClick={() => setIsEditingAmount(false)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {customer.totalAmount}
                                <button
                                    onClick={() => setIsEditingAmount(true)}
                                    style={{ marginLeft: "10px" }}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </span>

                    <span>Total Paid: ₹{totalPaid}</span>
                    <span>
                        Balance Remaining:{" "}
                        <span style={{ color: balanceRemaining > 0 ? "red" : "green" }}>
                            ₹{balanceRemaining}
                        </span>
                    </span>
                </div>

                {activeTab === "receivables" && (
                    <>
                        <div className="payments-table-header">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/m-add-payment/${leadid}`)}
                            >
                                Add Payment
                            </button>
                        </div>

                        {receivables.length > 0 ? (
                            <DataTable
                                columns={tableColumns}
                                data={receivables}
                                pagination
                                searchable
                            />
                        ) : (
                            <div className="no-payments-found">No payments found.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default M_PaymentsPage;
