import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Dashboard.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Navbar from "../../../Shared/Sales-ExecutiveNavbar/Navbar";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Tue");

  const scheduleData = [
    {
      day: "Tue",
      schedules: [
        {
          time: "9:00 - 10:00 AM",
          title: "Sales Strategy Meeting",
          color: "Sales-badge-orange",
          lead: "Alex Johnson",
        },
        {
          time: "11:00 - 12:00 PM",
          title: "Client Follow-up Call",
          color: "Sales-badge-green",
          lead: "Emma Wilson",
        },
        {
          time: "2:00 - 3:30 PM",
          title: "Product Demo Review",
          color: "Sales-badge-blue",
          lead: "Michael Brown",
        },
      ],
    },
  ];

  const todaySchedule = scheduleData.find((data) => data.day === selectedDay);

  return (
    <div className="salesDashboardContainer">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`salesDashboard ${collapsed ? "collapsed" : ""}`}>
        <div className="container">
          {/* Cards Section */}
          <div className="row Sales-dashboard-cards-container justify-content-center mt-4">
            <div className="col-lg-7 col-md-7">
              <div className="row">
                {[
                  {
                    title: "Leads Today",
                    value: "80",
                    subtitle: "Yesterday: 20",
                  },
                  {
                    title: "Leads Confirmed Today",
                    value: "60",
                    subtitle: "Yesterday: 100",
                  },
                  {
                    title: "Quotation Generated Today",
                    value: "02",
                    subtitle: "Yesterday: 12",
                  },
                  {
                    title: "Leads Inprogress Today",
                    value: "30",
                    subtitle: "Yesterday: 25",
                  },
                ].map((card, index) => (
                  <div className="col-lg-6 col-md-6 col-sm-6 mb-3" key={index}>
                    <div className="card Sales-gradient-card">
                      <h5>{card.title}</h5>
                      <h2>{card.value}</h2>
                      <p>{card.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card Sales-lead-card p-3 mt-4">
                <h5>Top Sales Channels</h5>
                <div>
                  {[
                    {
                      label: "Email Campaigns",
                      icon: "fa-solid fa-envelope",
                      value: "$12,500",
                      width: "75%",
                      color: "#17a2b8",
                    },
                    {
                      label: "Social Media",
                      icon: "fa-solid fa-share-nodes",
                      value: "$8,000",
                      width: "60%",
                      color: "#6c63ff",
                    },
                    {
                      label: "Direct Calls",
                      icon: "fa-solid fa-phone",
                      value: "$4,500",
                      width: "45%",
                      color: "#28a745",
                    },
                    {
                      label: "Others",
                      icon: "fa-solid fa-layer-group",
                      value: "$2,000",
                      width: "30%",
                      color: "#dc3545",
                    },
                  ].map((channel, index) => (
                    <div
                      key={index}
                      className="Sales-lead-item mb-3 d-flex align-items-center"
                    >
                      <div className="Sales-icon-container me-3">
                        <i
                          className={`${channel.icon}`}
                          style={{ color: channel.color }}
                        ></i>
                      </div>
                      <div className="flex-grow-1">
                        <p className="mb-1 d-flex justify-content-between">
                          <span>{channel.label}</span>
                          <span>{channel.value}</span>
                        </p>
                        <div className="progress">
                          <div
                            className="progress-bar"
                            style={{
                              width: channel.width,
                              backgroundColor: channel.color,
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
              <div className="Sales-follow-up-schedule">
                <div className="Sales-schedule-header d-flex justify-content-between align-items-center">
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
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          Option 1
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Option 2
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Option 3
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="Sales-day-selector mt-3 d-flex justify-content-between">
                  {[
                    "Sat",
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                  ].map((day, index) => (
                    <div
                      key={day}
                      className={`Sales-day ${
                        selectedDay === day ? "active" : ""
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <div className="Sales-day-label">{day}</div>
                      <div className="Sales-day-number">{`0${index + 4}`}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card Sales-lead-card p-3 mt-4 Sales-schedule-container">
                <div className="Sales-schedule-header d-flex justify-content-between align-items-center">
                  <h5>Today's Schedule</h5>
                  <a href="#" className="Sales-add-schedule-link">
                    Add A Schedule
                  </a>
                </div>
                <div className="Sales-schedule-legends d-flex mb-3">
                  <div className="Sales-legend me-3">
                    <span className="Sales-legend-color Sales-badge-orange"></span>{" "}
                    Meetings
                  </div>
                  <div className="Sales-legend me-3">
                    <span className="Sales-legend-color Sales-badge-green"></span>{" "}
                    Calls
                  </div>
                  <div className="Sales-legend">
                    <span className="Sales-legend-color Sales-badge-blue"></span>{" "}
                    Demos
                  </div>
                </div>
                <ul className="Sales-schedule-list">
                  {todaySchedule?.schedules.map((item, index) => (
                    <li
                      key={index}
                      className="Sales-schedule-item d-flex align-items-center"
                    >
                      <div className="Sales-badge-container">
                        <span
                          className={`Sales-badge ${item.color}`}
                        ></span>
                      </div>
                      <div className="Sales-schedule-details flex-grow-1 ms-3">
                        <strong>{item.time}</strong>
                        <p className="mb-1">{item.title}</p>
                        <small>
                          Lead by <span className="Sales-schedule-lead">{item.lead}</span>
                        </small>
                      </div>
                      <button className="btn btn-outline-primary Sales-view-details-btn">
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
