import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Login from "./Components/Pages/Login/Login";
import { AuthProvider } from "./Components/AuthContext/AuthContext";
import Addleads from "./Components/Pages/Sales-Executive/Leads/AddLeads/Addleads";
import ViewLeads from "./Components/Pages/Sales-Executive/Leads/ViewLeads/ViewLeads";
import Employee from "./Components/Pages/Admin/Employee/AddSales-executive/Employee";
import Manager from "./Components/Pages/Admin/Manager/Manager";
import ViewManager from "./Components/Pages/Admin/Manager/Manager_list";
import ViewEmployee from "./Components/Pages/Admin/Employee/Sales-executivelist/EmployeeList";
import ManagerDashboard from "./Components/Pages/Manager/Dashboard/Dashboard";
import SalesDashboard from "./Components/Pages/Sales-Executive/Dashboard/Dashboard";
import AdminDashboard from "./Components/Pages/Admin/Dashboard/Dashboard";
import LoginNew from "./Components/Pages/Login/LoginNew";
import Forgot from "./Components/Pages/ForgotPassword/ForgotPassword";
import ManagerCustomer from "./Components/Pages/Manager/Customer/Customer";
import AdminCustomer from "./Components/Pages/Admin/Customer/Customer";
import SalesCustomer from "./Components/Pages/Sales-Executive/Customer/Customer";
import MyTeamSales from "./Components/Pages/Sales-Executive/MyTeam/MyTeamSales";
import NavbarAddlead from "./Components/Pages/Sales-Executive/Leads/NavbarAddLeads/Addleads";
import NavbarManagerAddlead from "./Components/Pages/Manager/NavbarAddLeads/Addleads";
import ManagerPotentialLeads from "./Components/Pages/Manager/Potentialleads/Potentialleads";
import ManagerLeadDetails from "./Components/Pages/Manager/Potentialleads/LeadDetails";
import Potentialleads from "./Components/Pages/Sales-Executive/Potentialleads/Potentialleads";
import LeadDetails from "./Components/Pages/Sales-Executive/Potentialleads/OppDetails/LeadDetails";
import ManagerAddleads from "./Components/Pages/Manager/Leads/AddLeads/Addleads";
import MyTeam from "./Components/Pages/Manager/MyTeam/MyTeam";
import ManagerViewLeads from "./Components/Pages/Manager/Leads/ViewLeads/ViewLeads";
import ProfileForm from "./Components/Pages/Profile/Profile";
import Service from "./Components/Pages/Admin/Service/ServiceTable/ServiceTable";
import AllTeams from "./Components/Pages/Admin/AllTeams/AllTeams";
import AdminViewLeads from "./Components/Pages/Admin/Leads/ViewLeads/ViewLeads";
import AdminOpportunity from "./Components/Pages/Admin/Potentialleads/Potentialleads";
import AdminLeadDetails from "./Components/Pages/Admin/Potentialleads/LeadDetails";
import AddQuotationModal from "./Components/Pages/Sales-Executive/Potentialleads/AddQuotationModal";
import Generatepdf from "./Components/Pages/Sales-Executive/Quotation/GeneratePdf";
import CreateCustomerOpportunity from "./Components/Pages/Sales-Executive/Leads/ViewLeads/CreateCustomerOpportinity/CreateandOpportunity";
import CommentsPage from "./Components/Pages/Sales-Executive/Leads/ViewLeads/Comment/CommentsPage";
import EditOppLead from './Components/Pages/Sales-Executive/Potentialleads/EditOpp/EditOppLead';
import EditLead from './Components/Pages/Sales-Executive/Leads/ViewLeads/EditLead/EditLead';
import Webhook from './Webhook';
import InDetailViewLeads from "./Components/Pages/Sales-Executive/Leads/ViewLeads/ViewLead/InDetailViewLeads";
import LeadDetailss from "./Components/Pages/Sales-Executive/Potentialleads/LeadDetails";

function App() {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/add-lead" element={<Addleads />} />
                <Route path="/view-lead" element={<ViewLeads />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/employees" element={<ViewEmployee />} />
                <Route path="/manager" element={<Manager />} />
                <Route path="/managers" element={<ViewManager />} />
                <Route path="/m-dashboard" element={<ManagerDashboard />} />
                <Route path="/s-dashboard" element={<SalesDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<LoginNew />} />
                <Route path="/forgot" element={<Forgot />} />
                <Route path="/m-customers" element={<ManagerCustomer />} />
                <Route path="/a-customers" element={<AdminCustomer />} />
                <Route path="/s-customers" element={<SalesCustomer />} />
                <Route path="/add-leads" element={<NavbarAddlead />} />
                <Route path="/manageradd-leads" element={<NavbarManagerAddlead />} />
                <Route path="/m-myteam" element={<MyTeam />} />
                <Route path="/potential-leads" element={<Potentialleads />} />
                <Route path="/potential-leads/:leadId?" element={<LeadDetails />} />
                <Route path="/m-potential-leads" element={<ManagerPotentialLeads />} />
                <Route path="/m-potential-leads/:leadId?" element={<ManagerLeadDetails />} />
                <Route path="/m-add-leads" element={<ManagerAddleads />} />
                <Route path="/m-view-leads" element={<ManagerViewLeads />} />
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="/a-service" element={<Service />} />
                <Route path="/a-allteams" element={<AllTeams />} />
                <Route path="/a-view-lead" element={<AdminViewLeads />} />
                <Route path="/a-potential-leads" element={<AdminOpportunity />} />
                <Route path="/a-potential-leads/:leadId?" element={<AdminLeadDetails />} />
                <Route path="/s-myteam" element={<MyTeamSales />} />
                <Route path="/quo" element={<AddQuotationModal />} />
                <Route path="/generatepdf" element={<Generatepdf />} />
                <Route path="/create-customer-opportunity/:leadid" element={<CreateCustomerOpportunity />} />
                <Route path="/comments/:leadid" element={<CommentsPage />} />
                <Route path="/edit-lead/:leadid" element={<EditLead />} />
                <Route path="/edit-opportunity/:leadid" element={<EditOppLead />} />
                <Route path="/view-lead/:leadid" element={<InDetailViewLeads />} />
                <Route path="/webhook" element={<Webhook />} />
                <Route path="/details/:leadid" element={<LeadDetailss />} />
            </Routes>
        </Router>
        </AuthProvider>
    );
}

export default App;


