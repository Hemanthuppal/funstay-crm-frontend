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



import ManagerPotentialLeads from "./Components/Pages/Manager/Potentialleads/Potentialleads";
import ManagerLeadDetails from "./Components/Pages/Manager/Potentialleads/LeadDetails";
import Potentialleads from "./Components/Pages/Sales-Executive/Potentialleads/Potentialleads";
import LeadDetails from "./Components/Pages/Sales-Executive/Potentialleads/OppDetails/LeadDetails";
import ManagerAddleads from "./Components/Pages/Manager/Leads/AddLeads/Addleads";
import MyTeam from "./Components/Pages/Manager/MyTeam/MyTeam";
import ManagerViewLeads from "./Components/Pages/Manager/Leads/ViewLeads/ViewLeads";
import ProfileForm from "./Components/Pages/Sales-Executive/Profile/Profile";
// import Service from "./Components/Pages/Admin/Service/ServiceTable/ServiceTable";
import AllTeams from "./Components/Pages/Admin/AllTeams/AllTeams";
import AdminViewLeads from "./Components/Pages/Admin/Leads/ViewLeads/ViewLeads";
import AdminOpportunity from "./Components/Pages/Admin/Potentialleads/Potentialleads";



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
import S_Allleads from "./Components/Pages/Sales-Executive/Allleads/Alllead";
import MyTeamSales from "./Components/Pages/Sales-Executive/MyTeam/MyTeamSales";
import Customerdetails from "./Components/Pages/Sales-Executive/Customer/LeadOptions";
import A_Customerdetails from "./Components/Pages/Admin/Customer/LeadOptions";
import M_Customerdetails from "./Components/Pages/Manager/Customer/LeadOptions";
import TeamMembers from "./Components/Pages/Admin/AllTeams/TeamMembersTable";
import EditCustomer from "./Components/Pages/Sales-Executive/Customer/Editcustomer";
import M_EditCustomer from "./Components/Pages/Manager/Customer/Editcustomer";
import A_EditCustomer from "./Components/Pages/Admin/Customer/Editcustomer";
import ProtectedRoute from "./Components/Pages/ProtectedRoute/ProtectedRoute"; 
import A_Profile from "./Components/Pages/Admin/Profile/Profile";
import M_Profile from "./Components/Pages/Manager/Profile/Profile";
import Addonboarding from "./Components/Pages/Admin/Onboarding/AddEmployeeModal";
import Viewonboarding from "./Components/Pages/Admin/Onboarding/AllTeams";
import ViewonboardingId from "./Components/Pages/Admin/Onboarding/TeamMembersTable";
import Mobile from "./Mobile";
import EditEmployee from "./Components/Pages/Admin/AllTeams/EditEmployee/EditEmployee";
import M_Allleads from "./Components/Pages/Manager/Allleads/Alllead";

import Tabelfilter from "./Tabelfilter";
import M_viewallleads from "./Components/Pages/Manager/Viewallleads/InDetailViewLeads";
import S_viewallleads from "./Components/Pages/Sales-Executive/Viewallleads/InDetailViewLeads";
import Destinations from "./Components/Pages/Admin/Destinations/Destinations";

import Archive from "./Components/Pages/Admin/Archieve/Archive";
import Email from "./Components/Pages/Admin/Potentialleads/Email/Email";
import A_myopp from "./Components/Pages/Admin/Leads/Myleads/Myleads";
import A_MyOpplead from "./Components/Pages/Admin/Potentialleads/MyOpp/Myopp";
import A_MyLeadDetailss from "./Components/Pages/Admin/Potentialleads/MyOppView";
import A_MyCreateCustomerOpportunity from "./Components/Pages/Admin/Leads/MyCreateCustomerOpportinity/CreateandOpportunity";
import NotFound from "./Components/Shared/NotFound/NotFound";
import EmailChat from "./Email";
import Tags from "./Components/Pages/Admin/Tags/Tag";
import ThemeProvider from "./Components/Shared/Themes/ThemeContext";
import { FontSizeProvider } from "./Components/Shared/Font/FontContext";
import Themes from "./Components/Shared/Themes/Themes";
import M_Myoppleads from "./Components/Pages/Manager/Potentialleads/MyOpp/MyOpplead";
import M_Myleads from "./Components/Pages/Manager/Leads/Myleads/Myleads";
import M_MYCreateCustomerOpportunity from "./Components/Pages/Manager/Leads/Myleads/CreateCustomerOpportinity/CreateandOpportunity"
import EmailHistory from "./Components/Pages/Admin/Potentialleads/Email/Email_new";
import H_Dashboard from "./Components/Pages/SalesHead/Dashboard/Dashboard";
import H_ViewLeads from "./Components/Pages/SalesHead/Leads/ViewLeads/ViewLeads";
import HeadOpportunity from "./Components/Pages/SalesHead/Potentialleads/Potentialleads";
import H_Customer from "./Components/Pages/SalesHead/Customer/Customer";
import H_Destinations from "./Components/Pages/SalesHead/Destinations/Destinations";
import H_Tags from "./Components/Pages/SalesHead/Tags/Tag";
import H_AllTeams from "./Components/Pages/SalesHead/AllTeams/AllTeams";
import H_TeamMembers from "./Components/Pages/SalesHead/AllTeams/TeamMembersTable";
import H_Customerdetails from "./Components/Pages/SalesHead/Customer/LeadOptions";
import H_LeadDetailss from "./Components/Pages/SalesHead/Potentialleads/LeadDetails";
import H_InDetailViewLeads from "./Components/Pages/SalesHead/Leads/ViewLeads/ViewLead/InDetailViewLeads";
import H_Profile from "./Components/Pages/SalesHead/Profile/Profile";
import M_EmailHistory from "./Components/Pages/Manager/Potentialleads/Email/Email_new";
import S_EmailHistory from "./Components/Pages/Sales-Executive/Potentialleads/Email/Email_new";
import AdminSupplier from "./Components/Pages/Admin/Suppliers/AdminSupplier";
import AddSupplier from "./Components/Pages/Admin/Suppliers/AddSupplier";
import PaymentsPage from "./Components/Pages/Admin/Payments/PaymentsPage";
import AddPaymentPage from "./Components/Pages/Admin/Payments/PaymentForm";
import SupplierTable from "./Components/Pages/Admin/Payments/Suppliers/Supplier";
import PaymentPage from "./Components/Pages/Admin/Payments/Suppliers/PaymentPage";
import HistoryPage from "./Components/Pages/Admin/Payments/Suppliers/HistoryPage";
import SupplierForm from "./Components/Pages/Admin/Payments/Suppliers/SupplierForm";
import M_SupplierTable from "./Components/Pages/Manager/Payments/Suppliers/Supplier";
import M_PaymentsPage from "./Components/Pages/Manager/Payments/PaymentsPage";
import M_SupplierForm from "./Components/Pages/Manager/Payments/Suppliers/SupplierForm";
import M_PaymentPage from "./Components/Pages/Manager/Payments/Suppliers/PaymentPage";
import M_HistoryPage from "./Components/Pages/Manager/Payments/Suppliers/HistoryPage";
import M_AddPaymentPage from "./Components/Pages/Manager/Payments/PaymentForm";


function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
            <FontSizeProvider>
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<LoginNew />} />
                <Route path="/forgot" element={<Forgot />} />


                
                <Route element={<ProtectedRoute />}>
                <Route path="/add-lead" element={<Addleads />} />
                <Route path="/view-lead" element={<ViewLeads />} />
                
              
            
               
                <Route path="/m-dashboard" element={<ManagerDashboard />} />
                <Route path="/s-dashboard" element={<SalesDashboard />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
               
                <Route path="/m-customers" element={<ManagerCustomer />} />
                <Route path="/a-customers" element={<AdminCustomer />} />
                <Route path="/s-customers" element={<SalesCustomer />} />
                
               
                <Route path="/m-myteam" element={<MyTeam />} />
                <Route path="/potential-leads" element={<Potentialleads />} />
                <Route path="/potential-leads/:leadId?" element={<LeadDetails />} />
                <Route path="/m-potential-leads" element={<ManagerPotentialLeads />} />
                <Route path="/m-potential-leads/:leadId?" element={<ManagerLeadDetails />} />
                <Route path="/m-add-leads" element={<ManagerAddleads />} />
                <Route path="/m-view-leads" element={<ManagerViewLeads />} />
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="/m-profile" element={<M_Profile />} />
                <Route path="/a-profile" element={<A_Profile />} />
                {/* <Route path="/a-service" element={<Service />} /> */}
                <Route path="/a-allteams" element={<AllTeams />} />
                <Route path="/a-view-lead" element={<AdminViewLeads />} />
                <Route path="/a-potential-leads" element={<AdminOpportunity />} />
            
              
               
               
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



                <Route path="/s-allleads" element={<S_Allleads />} />
                
                <Route path="/s-myteam" element={<MyTeamSales />} />




                <Route path="/m-customer-details/:leadid" element={<M_LeadDetailss />} />
                <Route path="/m-opportunity-comments/:leadid" element={<M_CommentsPage />} />
              <Route path="/a-customer-details/:leadid" element={<A_LeadDetailss />} />
                <Route path="/a-opportunity-comments/:leadid" element={<A_CommentsPage />} />


                <Route path="/customerdetails/:customerId" element={<Customerdetails />} />
                <Route path="/m-customerdetails/:customerId" element={<M_Customerdetails />} />
                <Route path="/a-customerdetails/:customerId" element={<A_Customerdetails />} />



                <Route path="/s-view-lead/:leadid" element={<InDetailViewLeads />} />

                <Route path="/team-members" element={<TeamMembers />} />

                <Route path="/editcustomerdetails/:customerId" element={<EditCustomer />} />
                <Route path="/a-editcustomerdetails/:customerId" element={<A_EditCustomer />} />
                <Route path="/m-editcustomerdetails/:customerId" element={<M_EditCustomer />} />




                //extra
                <Route path="/a-onboarding" element={<Addonboarding />} />
                <Route path="/a-viewonboarding" element={<Viewonboarding />} />
                <Route path="/a-viewonboarding/:id" element={<ViewonboardingId />} />


                <Route path="/editemployee/:id" element={<EditEmployee />} />
                <Route path="/mobile" element={<Mobile />} />




                <Route path="/m-allleads" element={<M_Allleads />} />
                <Route path="/m-views-lead/:leadid" element={<M_InDetailViewLeads />} />


                <Route path="/tablefilter" element={<Tabelfilter />} />


                <Route path="/m-viewallleads/:leadid" element={<M_viewallleads />} />
                <Route path="/s-viewallleads/:leadid" element={<S_viewallleads />} />



                //comments
                <Route path="/comments/:leadid" element={<CommentsPage />} />
                <Route path="/m-comments/:leadid" element={<M_CommentsPage />} />
                <Route path="/a-comments/:leadid" element={<A_CommentsPage />} />

                <Route path="/a-destinations" element={<Destinations />} />


                <Route path="/a-archivedata" element={<Archive />} />



                <Route path="/a-email/:leadId" element={<Email />} />






                <Route path="/a-myleads" element={<A_myopp />} />
                <Route path="/a-myview-lead/:leadid" element={<A_InDetailViewLeads />} />
                <Route path="/a-myedit-lead/:leadid" element={<A_EditLead />} />
                <Route path="/a-mycreate-customer-opportunity/:leadid" element={<A_MyCreateCustomerOpportunity />} />
                <Route path="/a-mycomments/:leadid" element={<A_CommentsPage />} />




                <Route path="/a-myopp" element={<A_MyOpplead />} />
                <Route path="/a-myedit-opportunity/:leadid" element={<A_EditOppLead />} />
                <Route path="/a-mydetails/:leadid" element={<A_MyLeadDetailss />} />

                
                <Route path="/a-myopportunity-comments/:leadid" element={<A_CommentsPage />} />



                <Route path="*" element={<NotFound />} />



                <Route path="/emailchat" element={<EmailChat />} />

                <Route path="/a-tags" element={<Tags/>} />
                <Route path="/themes" element={<Themes />} />

                {/* <Route path="/a-supplier" element={<AdminSupplier />} />
                <Route path="/a-add-supplier" element={<AddSupplier />} /> */}
                 <Route path="/a-supplier/:leadid" element={<SupplierTable />} /> 
                <Route path="/a-payments/:leadid" element={<PaymentsPage />} />  
                <Route path="/a-add-supplier/:leadid" element={<SupplierForm />} />      
                <Route path="/a-suppliers/:supplierId/:leadid" element={<PaymentPage />} />
                <Route path="/a-suppliers/:supplierId/history" element={<HistoryPage />} />
                <Route path="/a-add-payment/:leadid" element={<AddPaymentPage />} />


                <Route path="/m-supplier/:leadid" element={<M_SupplierTable />} /> 
                <Route path="/m-payments/:leadid" element={<M_PaymentsPage />} />  
                <Route path="/m-add-supplier/:leadid" element={<M_SupplierForm />} />      
                <Route path="/m-suppliers/:supplierId/:leadid" element={<M_PaymentPage />} />
                <Route path="/m-suppliers/:supplierId/history" element={<M_HistoryPage />} />
                <Route path="/m-add-payment/:leadid" element={<M_AddPaymentPage />} />



                <Route path="/m-myoppleads" element={<M_Myoppleads/>} />
                <Route path="/m-myleads" element={<M_Myleads/>} />



                <Route path="/m-myedit-lead/:leadid" element={<M_EditLead />} />
                <Route path="/m-myview-lead/:leadid" element={<M_InDetailViewLeads />} />
                <Route path="/m-mycomments/:leadid" element={<M_CommentsPage />} />
                <Route path="/m-myedit-opportunity/:leadid" element={<M_EditOppLead />} />
                <Route path="/m-mydetails/:leadid" element={<M_LeadDetailss />} />
                <Route path="/m-mycreate-customer-opportunity/:leadid" element={<M_MYCreateCustomerOpportunity />} />
                <Route path="/m-myopportunity-comments/:leadid" element={<M_CommentsPage />} />
                {/* <Route path="/email-history" element={<EmailHistory />} /> */}
                

                <Route path="/email-history/:leadid" element={<EmailHistory />} />
                <Route path="/a_myemail-history/:leadid" element={<EmailHistory />} />

                <Route path="h-dashboard" element={<H_Dashboard />} />
                <Route path="/h-view-lead" element={<H_ViewLeads />} />
                <Route path="/h-potential-leads" element={<HeadOpportunity />} />
                <Route path="/h-customers" element={<H_Customer />} />
                <Route path="/h-destinations" element={<H_Destinations />} />
                <Route path="/h-tags" element={<H_Tags/>} />
                <Route path="/h-allteams" element={<H_AllTeams />} />
                <Route path="/h-team-members" element={<H_TeamMembers />} />
                <Route path="/h-customerdetails/:customerId" element={<H_Customerdetails />} />
                <Route path="/h-details/:leadid" element={<H_LeadDetailss />} />
                <Route path="/h-view-lead/:leadid" element={<H_InDetailViewLeads />} />
                <Route path="/h-profile" element={<H_Profile />} />




                <Route path="/m_email-history/:leadid" element={<M_EmailHistory />} />
                <Route path="/m_myemail-history/:leadid" element={<M_EmailHistory />} />
                <Route path="/s_email-history/:leadid" element={<S_EmailHistory />} />
                </Route>
            </Routes>

         
 
        </Router>
        </FontSizeProvider>
        </ThemeProvider>
        </AuthProvider>
    );
}

export default App;


