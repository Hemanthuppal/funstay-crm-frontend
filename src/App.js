import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from "./Components/Pages/Login/Login";
import { AuthProvider } from "./Components/AuthContext/AuthContext";
import Addleads from "./Components/Pages/Sales-Executive/Leads/AddLeads/Addleads";
import ViewLeads from "./Components/Pages/Sales-Executive/Leads/ViewLeads/ViewLeads";




import ManagerDashboard from "./Components/Pages/Manager/Dashboard/Dashboard";
import SalesDashboard from "./Components/Pages/Sales-Executive/Dashboard/Dashboard";
import AdminDashboard from "./Components/Pages/Admin/Dashboard/Dashboard";
import LoginNew from "./Components/Pages/Login/LoginNew";
import Forgot from "./Components/Pages/ForgotPassword/ForgotPassword";
import ManagerCustomer from "./Components/Pages/Manager/Customer/Customer";
import AdminCustomer from "./Components/Pages/Admin/Customer/Customer";
import SalesCustomer from "./Components/Pages/Sales-Executive/Customer/Customer";

import NavbarAddlead from "./Components/Pages/Sales-Executive/Leads/NavbarAddLeads/Addleads";

import ManagerPotentialLeads from "./Components/Pages/Manager/Potentialleads/Potentialleads";
import ManagerLeadDetails from "./Components/Pages/Manager/Potentialleads/LeadDetails";
import Potentialleads from "./Components/Pages/Sales-Executive/Potentialleads/Potentialleads";
import LeadDetails from "./Components/Pages/Sales-Executive/Potentialleads/OppDetails/LeadDetails";
import ManagerAddleads from "./Components/Pages/Manager/Leads/AddLeads/Addleads";
import MyTeam from "./Components/Pages/Manager/MyTeam/MyTeam";
import ManagerViewLeads from "./Components/Pages/Manager/Leads/ViewLeads/ViewLeads";
import ProfileForm from "./Components/Pages/Profile/Profile";
// import Service from "./Components/Pages/Admin/Service/ServiceTable/ServiceTable";
import AllTeams from "./Components/Pages/Admin/AllTeams/AllTeams";
import AdminViewLeads from "./Components/Pages/Admin/Leads/ViewLeads/ViewLeads";
import AdminOpportunity from "./Components/Pages/Admin/Potentialleads/Potentialleads";

import AddQuotationModal from "./Components/Pages/Sales-Executive/Quotation/AddQuotationModal";
import Generatepdf from "./Components/Pages/Sales-Executive/Quotation/GeneratePdf";
import CreateCustomerOpportunity from "./Components/Pages/Sales-Executive/Leads/ViewLeads/CreateCustomerOpportinity/CreateandOpportunity";
import CommentsPage from "./Components/Pages/Sales-Executive/Leads/ViewLeads/Comment/CommentsPage";
import EditOppLead from './Components/Pages/Sales-Executive/Potentialleads/EditOpp/EditOppLead';
import EditLead from './Components/Pages/Sales-Executive/Leads/ViewLeads/EditLead/EditLead';
import Webhook from './Webhook';
import InDetailViewLeads from "./Components/Pages/Sales-Executive/Leads/ViewLeads/ViewLead/InDetailViewLeads";
import LeadDetailss from "./Components/Pages/Sales-Executive/Potentialleads/LeadDetails";
import M_EditLead from "./Components/Pages/Manager/Leads/ViewLeads/EditLead/EditLead";
import M_InDetailViewLeads from "./Components/Pages/Manager/Leads/ViewLeads/ViewLead/InDetailViewLeads";
import M_CommentsPage from "./Components/Pages/Manager/Leads/ViewLeads/Comment/CommentsPage";
import M_EditOppLead from "./Components/Pages/Manager/Potentialleads/EditOpp/EditOppLead";
import M_LeadDetailss from "./Components/Pages/Manager/Potentialleads/LeadDetails";
import M_CreateCustomerOpportunity from "./Components/Pages/Manager/Leads/ViewLeads/CreateCustomerOpportinity/CreateandOpportunity";
import A_EditLead from "./Components/Pages/Admin/Leads/ViewLeads/EditLead/EditLead";
import A_InDetailViewLeads from "./Components/Pages/Admin/Leads/ViewLeads/ViewLead/InDetailViewLeads";
import A_CommentsPage from "./Components/Pages/Admin/Leads/ViewLeads/Comment/CommentsPage";
import A_EditOppLead from "./Components/Pages/Admin/Potentialleads/EditOpp/EditOppLead";
import A_LeadDetailss from "./Components/Pages/Admin/Potentialleads/LeadDetails";
import A_CreateCustomerOpportunity from "./Components/Pages/Admin/Leads/ViewLeads/CreateCustomerOpportinity/CreateandOpportunity";
import AddEmployeeModal from "./Components/Pages/Admin/AllTeams/AddEmployeeModal";
import A_Addleads from "./Components/Pages/Admin/Leads/AddLeads/Addleads";
import Manager_Addleads from "./Components/Pages/Manager/Leads/AddLeads/Addleads";


function App() {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/add-lead" element={<Addleads />} />
                <Route path="/view-lead" element={<ViewLeads />} />
                
              
            
               
                <Route path="/m-dashboard" element={<ManagerDashboard />} />
                <Route path="/s-dashboard" element={<SalesDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<LoginNew />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/m-customers" element={<ManagerCustomer />} />
                <Route path="/a-customers" element={<AdminCustomer />} />
                <Route path="/s-customers" element={<SalesCustomer />} />
                <Route path="/add-leads" element={<NavbarAddlead />} />
               
                <Route path="/m-myteam" element={<MyTeam />} />
                <Route path="/potential-leads" element={<Potentialleads />} />
                <Route path="/potential-leads/:leadId?" element={<LeadDetails />} />
                <Route path="/m-potential-leads" element={<ManagerPotentialLeads />} />
                <Route path="/m-potential-leads/:leadId?" element={<ManagerLeadDetails />} />
                <Route path="/m-add-leads" element={<ManagerAddleads />} />
                <Route path="/m-view-leads" element={<ManagerViewLeads />} />
                <Route path="/profile" element={<ProfileForm />} />
                {/* <Route path="/a-service" element={<Service />} /> */}
                <Route path="/a-allteams" element={<AllTeams />} />
                <Route path="/a-view-lead" element={<AdminViewLeads />} />
                <Route path="/a-potential-leads" element={<AdminOpportunity />} />
            
              
                <Route path="/quo" element={<AddQuotationModal />} />
                <Route path="/generatepdf" element={<Generatepdf />} />
                <Route path="/create-customer-opportunity/:leadid" element={<CreateCustomerOpportunity />} />
                <Route path="/comments/:leadid" element={<CommentsPage />} />
                <Route path="/edit-lead/:leadid" element={<EditLead />} />
                <Route path="/edit-opportunity/:leadid" element={<EditOppLead />} />
                <Route path="/view-lead/:leadid" element={<InDetailViewLeads />} />
                <Route path="/webhook" element={<Webhook />} />
                <Route path="/details/:leadid" element={<LeadDetailss />} />



                <Route path="/m-edit-lead/:leadid" element={<M_EditLead />} />
                <Route path="/m-view-lead/:leadid" element={<M_InDetailViewLeads />} />
                <Route path="/m-comments/:leadid" element={<M_CommentsPage />} />
                <Route path="/m-edit-opportunity/:leadid" element={<M_EditOppLead />} />
                <Route path="/m-details/:leadid" element={<M_LeadDetailss />} />
                <Route path="/m-create-customer-opportunity/:leadid" element={<M_CreateCustomerOpportunity />} />



                <Route path="/a-edit-lead/:leadid" element={<A_EditLead />} />
                <Route path="/a-view-lead/:leadid" element={<A_InDetailViewLeads />} />
                <Route path="/a-comments/:leadid" element={<A_CommentsPage />} />
                <Route path="/a-edit-opportunity/:leadid" element={<A_EditOppLead />} />
                <Route path="/a-details/:leadid" element={<A_LeadDetailss />} />
                <Route path="/a-create-customer-opportunity/:leadid" element={<A_CreateCustomerOpportunity />} />
                <Route path="/addemployee" element={<AddEmployeeModal />} />


                <Route path="/a-add-leads" element={<A_Addleads/>} />
                <Route path="/m-add-leads" element={<Manager_Addleads />} />



                <Route path="/sales-details/:leadid" element={<LeadDetailss />} />
                <Route path="/opportunity-comments/:leadid" element={<CommentsPage />} />

            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;


