import React, { useState, useEffect ,useContext} from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../../../Shared/SalesHeadNavbar/Navbar';
import FollowUp from "./FollowUp";
// import { baseURL } from "../../../Apiservices/Api";
import { ThemeContext } from "../../../Shared/Themes/ThemeContext";
import { baseURL,webhookUrl } from "../../../Apiservices/Api";
import * as XLSX from 'xlsx';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); 
  const { themeColor } = useContext(ThemeContext);
  const [counts, setCounts] = useState({
    leadsToday: 0,
    confirmedToday: 0,
    inProgressToday: 0,
    leadsYesterday: 0,
    confirmedYesterday: 0,
    inProgressYesterday: 0,
    // metaAdsCount: 0,
    // notMetaAdsCount: 0
    facebookCount: 0,
    referralCount: 0,
    campaignCount: 0,
    googleCount: 0,
    othersCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
     const fetchData = async () => {
       try {
         const endpoints = [
           `${baseURL}/leads/today`,
           `${baseURL}/leads/confirmed`,
           `${baseURL}/leads/in-progress`,
           `${baseURL}/leads/yesterday`,
           `${baseURL}/leads/confirmed/yesterday`,
           `${baseURL}/leads/in-progress/yesterday`,
           // `${baseURL}/leads/meta-ads`,
           // `${baseURL}/leads/not-meta-ads`
           `${baseURL}/leads/facebook`,
           `${baseURL}/leads/referral`,
           `${baseURL}/leads/campaign`,
           `${baseURL}/leads/google`,
           `${baseURL}/leads/others`,
         ];
 
         const responses = await Promise.all(endpoints.map(url => axios.get(url)));
 
         setCounts({
           leadsToday: responses[0].data.count,
           confirmedToday: responses[1].data.count,
           inProgressToday: responses[2].data.count,
           leadsYesterday: responses[3].data.count,
           confirmedYesterday: responses[4].data.count,
           inProgressYesterday: responses[5].data.count,
           // metaAdsCount: responses[6].data.count,
           // notMetaAdsCount: responses[7].data.count
           facebookCount: responses[6].data.count,
           referralCount: responses[7].data.count,
           campaignCount: responses[8].data.count,
           googleCount: responses[9].data.count,
           othersCount: responses[10].data.count,
 
         });
         setLoading(false);
       } catch (error) {
         console.error("Error fetching data:", error);
         setError("Failed to load dashboard data");
         setLoading(false);
       }
     };
     fetchData();
   }, []);

   useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${webhookUrl}/api/enquiries`);
        const data = await response.json();

        const filteredData = data.filter((enquiry) => enquiry.adminAssign !== 'admin' && enquiry.status === 'lead');
        setData(filteredData);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };
    fetchEnquiries();
  }, []);

   const allSourcesTotal = counts.facebookCount + counts.referralCount + counts.campaignCount + counts.googleCount;
   const totalCount = allSourcesTotal + (counts.othersCount || 0);
   counts.othersCount = totalCount - allSourcesTotal;

  // if (loading) return <div className="loading-spinner">Loading dashboard...</div>;
  // if (error) return <div className="error-message">{error}</div>;

  const handleDownload = () => {
    if (data.length === 0) {
      alert('No data available to export!');
      return;
    }
  
    // Define fields with their labels
    const fields = [
      { key: "leadid", label: "LEAD ID", width: 15 },
      { key: "name", label: "NAME", width: 20 },
      { key: "email", label: "EMAIL", width: 25 },
      { key: "country_code", label: "COUNTRY CODE", width: 10 },
      { key: "phone_number", label: "PHONE NUMBER", width: 15 },
      { key: "sources", label: "SOURCES", width: 20 },
      { key: "another_name", label: "ANOTHER NAME", width: 20 },
      { key: "another_email", label: "ANOTHER EMAIL", width: 25 },
      { key: "another_phone_number", label: "ANOTHER PHONE NUMBER", width: 15 },
      { key: "description", label: "DESCRIPTION", width: 30 },
      { key: "secondarysource", label: "SECONDARY SOURCE", width: 20 },
      { key: "origincity", label: "ORIGIN CITY", width: 15 },
      { key: "destination", label: "DESTINATION", width: 15 },
      { key: "created_at", label: "CREATED AT", width: 20 },
      { key: "primaryStatus", label: "PRIMARY STATUS", width: 15 },
      { key: "secondaryStatus", label: "SECONDARY STATUS", width: 15 },
      { key: "primarySource", label: "PRIMARY SOURCE", width: 20 },
      { key: "channel", label: "CHANNEL", width: 15 }
    ];
  
    // Format data to match selected fields
    const formattedData = data.map(item =>
      Object.fromEntries(fields.map(field => [field.label, item[field.key] || ""]))
    );
  
    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { origin: "A1" });
  
    // Set column widths
    worksheet["!cols"] = fields.map(field => ({ width: field.width }));
  
    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
  
    // Download Excel file
    XLSX.writeFile(workbook, "LeadsData.xlsx");
  };
  
  


  return (
    <div className="dashboardContainer1">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`dashboard1 ${collapsed ? 'collapsed' : ''}`}>
        <div className="container">
          <div className="row admin-dashboard-cards-container justify-content-center mt-4" style={{ "--theme-color": themeColor }}>
            <div className="col-lg-7 col-md-12">
              <div className="row">
                {[
                  {
                    title: "Leads Today",
                    value: counts.leadsToday,
                    subtitle: `Leads Yesterday: ${counts.leadsYesterday}`,
                    navigateTo: "/h-view-lead"
                  },
                  {
                    title: "Opportunities Today",
                    value: counts.confirmedToday,
                    subtitle: `Opportunities Yesterday: ${counts.confirmedYesterday}`,
                    navigateTo: "/h-potential-leads"
                  },
                  {
                    title: "Leads In-Progress Today",
                    value: counts.inProgressToday,
                    subtitle: `In-Progress Yesterday: ${counts.inProgressYesterday}`,
                    navigateTo: "/h-view-lead"
                  },
                
                ].map((card, index) => (
                  <div 
                    className="col-lg-6 col-md-6 col-sm-6 mb-3" 
                    key={index}
                    onClick={() => card.navigateTo !== "#" && navigate(card.navigateTo)} 
                    style={{ cursor: card.navigateTo !== "#" ? "pointer" : "default" }}
                  >
                    <div className="card admin-gradient-card">
                      <h5 className="pt-3">{card.title}</h5>
                      <h2>{card.value}</h2>
                      <p>{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

             {/* <div>
              <button onClick={handleDownload}>Download Leads</button>
              </div> */}

              {/* <div className="card admin-lead-card p-3 mt-4">
                <h5>Most Lead</h5>
                <div>
                  {[
                    {
                      label: "Social Media",
                      icon: "fa-solid fa-share-nodes",
                      value: counts.metaAdsCount,
                      width: `${(counts.metaAdsCount / (counts.metaAdsCount + counts.notMetaAdsCount)) * 100 || 0}%`,
                      color: "#6c63ff",
                    },
                    {
                      label: "Others",
                      icon: "fa-solid fa-layer-group",
                      value: counts.notMetaAdsCount,
                      width: `${(counts.notMetaAdsCount / (counts.metaAdsCount + counts.notMetaAdsCount)) * 100 || 0}%`,
                      color: "#dc3545",
                    },
                  ].map((lead, index) => (
                    <div key={index} className="admin-lead-item mb-3 d-flex align-items-center">
                      <div className="admin-icon-container me-3">
                        <i className={`${lead.icon}`} style={{ color: lead.color }}></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 d-flex justify-content-between">
                          <span>{lead.label}</span>
                          <span>{lead.value}</span>
                        </p>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: lead.width, backgroundColor: lead.color }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
              <div className="card admin-lead-card p-3 mt-4">
                <h5>Most Lead</h5>
                <div>
                  {[
                    {
                      label: "Facebook",
                      icon: "fa-brands fa-facebook",
                      value: counts.facebookCount,
                      width: `${(counts.facebookCount / (counts.facebookCount + counts.referralCount + counts.campaignCount + counts.googleCount)) * 100 || 0}%`,
                      color: "#1877F2",
                    },
                    {
                      label: "Referral",
                      icon: "fa-solid fa-user-plus",
                      value: counts.referralCount,
                      width: `${(counts.referralCount / (counts.facebookCount + counts.referralCount + counts.campaignCount + counts.googleCount)) * 100 || 0}%`,
                      color: "#28A745",
                    },
                    {
                      label: "campaign",
                      icon: "fa-solid fa-bullhorn",
                      value: counts.campaignCount,
                      width: `${(counts.campaignCount / (counts.facebookCount + counts.referralCount + counts.campaignCount + counts.googleCount)) * 100 || 0}%`,
                      color: "#FFC107",
                    },
                    {
                      label: "Google",
                      icon: "fa-brands fa-google",
                      value: counts.googleCount,
                      width: `${(counts.googleCount / (counts.facebookCount + counts.referralCount + counts.campaignCount + counts.googleCount)) * 100 || 0}%`,
                      color: "#EA4335",
                    },
                    {
                      label: "Others",
                      icon: "fa-solid fa-layer-group",
                      value: counts.othersCount,
                      width: `${(counts.othersCount / totalCount) * 100 || 0}%`, // Set dynamic width for Others
                      color: "#dc3545",
                    },
                  ].map((lead, index) => (
                    <div key={index} className="admin-lead-item mb-3 d-flex align-items-center">
                      <div className="admin-icon-container me-3">
                        <i className={`${lead.icon}`} style={{ color: lead.color }}></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 d-flex justify-content-between">
                          <span>{lead.label}</span>
                          <span>{lead.value}</span>
                        </p>
                        <div className="progress">
                          <div className="progress-bar" style={{ width: lead.width, backgroundColor: lead.color }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-md-12 mt-2">
              <FollowUp schedule={[]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
