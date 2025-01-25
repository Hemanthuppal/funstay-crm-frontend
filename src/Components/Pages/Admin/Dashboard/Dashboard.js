
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Navbar from '../../../Shared/Navbar/Navbar';


const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Tue");

  const scheduleData = [
    {
      day: "Tue",
      schedules: [
        {
          time: "10:00 - 11:00 AM",
          title: "Adlash Project Estimation Meeting",
          color: "admin-badge-orange",
          lead: "Siritha Alwar",
        },
        {
          time: "11:00 - 11:30 AM",
          title: "Dashboard HTML Design Review",
          color: "admin-badge-green",
          lead: "Jonathon Andy",
        },
        {
          time: "12:00 - 1:30 PM",
          title: "Dashboard UI/UX Design Review",
          color: "admin-badge-blue",
          lead: "John Harry",
        },
      ],
    },
  ];

  const todaySchedule = scheduleData.find((data) => data.day === selectedDay);

  return (
    <div className="dashboardContainer1">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`dashboard1 ${collapsed ? 'collapsed' : ''}`}>
      <div className="container">
        {/* Cards Section */}
        <div className="row admin-dashboard-cards-container justify-content-center mt-4">
          <div className="col-lg-7 col-md-7">
            <div className="row">
              {[
                {
                  title: "Leads Today",
                  value: "100",
                  subtitle: "Leads Yesterday: 76",
                },
                {
                  title: "Leads Confirmed Today",
                  value: "66",
                  subtitle: "Leads Yesterday: 66",
                },
                {
                  title: "Quotation Generated Today",
                  value: "02",
                  subtitle: "Leads Rejected Yesterday: 00",
                },
                {
                  title: "Leads In-Progress Today",
                  value: "45",
                  subtitle: "Leads Yesterday: 36",
                },
              ].map((card, index) => (
                <div className="col-lg-6 col-md-6 col-sm-6 mb-3" key={index}>
                  <div className="card admin-gradient-card">
                    <h5>{card.title}</h5>
                    <h2>{card.value}</h2>
                    <p>{card.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card admin-lead-card p-3 mt-4">
              <h5>Most Lead</h5>
              <div>
                {[
                  {
                    label: "Social Media",
                    icon: "fa-solid fa-share-nodes",
                    value: "12,302",
                    width: "80%",
                    color: "#6c63ff",
                  },
                  {
                    label: "Chatbot",
                    icon: "fa-solid fa-robot",
                    value: "15,210",
                    width: "90%",
                    color: "#17a2b8",
                  },
                  {
                    label: "WhatsApp",
                    icon: "fa-brands fa-whatsapp",
                    value: "13,312",
                    width: "70%",
                    color: "#28a745",
                  },
                  {
                    label: "Others",
                    icon: "fa-solid fa-layer-group",
                    value: "1,421",
                    width: "40%",
                    color: "#dc3545",
                  },
                ].map((lead, index) => (
                  <div
                    key={index}
                    className="admin-lead-item mb-3 d-flex align-items-center"
                  >
                    <div className="admin-icon-container me-3">
                      <i
                        className={`${lead.icon}`}
                        style={{ color: lead.color }}
                      ></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 d-flex justify-content-between">
                        <span>{lead.label}</span>
                        <span>{lead.value}</span>
                      </p>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: lead.width,
                            backgroundColor: lead.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Follow-up Schedule Section */}
          <div className="col-lg-5 col-md-12 mt-4">
            <div className="admin-follow-up-schedule">
              <div className="admin-schedule-header d-flex justify-content-between align-items-center">
                <h5>Follow-up Schedule</h5>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Show
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li><a className="dropdown-item" href="#">Option 1</a></li>
                    <li><a className="dropdown-item" href="#">Option 2</a></li>
                    <li><a className="dropdown-item" href="#">Option 3</a></li>
                  </ul>
                </div>
              </div>
              <div className="admin-day-selector mt-3 d-flex justify-content-between">
                {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                  <div
                    key={day}
                    className={`admin-day ${selectedDay === day ? "active" : ""}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    <div className="admin-day-label">{day}</div>
                    <div className="admin-day-number">{`0${index + 4}`}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card admin-lead-card p-3 mt-4 admin-schedule-container">
              <div className="admin-schedule-header d-flex justify-content-between align-items-center">
                <h5>Today's Schedule</h5>
                <a href="#" className="admin-add-schedule-link">Add A Schedule</a>
              </div>
              <div className="admin-schedule-legends d-flex mb-3">
                <div className="admin-legend me-3">
                  <span className="admin-legend-color admin-badge-orange"></span> Meetings
                </div>
                <div className="admin-legend me-3">
                  <span className="admin-legend-color admin-badge-green"></span> Discussion
                </div>
                <div className="admin-legend">
                  <span className="admin-legend-color admin-badge-blue"></span> Reviews
                </div>
              </div>
              <ul className="admin-schedule-list">
                {todaySchedule?.schedules.map((item, index) => (
                  <li key={index} className="admin-schedule-item d-flex align-items-center">
                    <div className="admin-badge-container">
                      <span className={`admin-badge ${item.color}`}></span>
                    </div>
                    <div className="admin-schedule-details flex-grow-1 ms-3">
                      <strong>{item.time}</strong>
                      <p className="mb-1">{item.title}</p>
                      <small>Lead by <span className="admin-schedule-lead">{item.lead}</span></small>
                    </div>
                    <button className="btn btn-outline-primary admin-view-details-btn">
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
