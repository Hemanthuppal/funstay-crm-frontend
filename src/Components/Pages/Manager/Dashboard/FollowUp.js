import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import { AuthContext } from '../../../AuthContext/AuthContext';
import { baseURL } from "../../../Apiservices/Api";
import { useNavigate } from "react-router-dom";

function FollowUp() {
  const navigate = useNavigate();
  const today = new Date();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDay = weekdays[today.getDay()];

  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [travelOpportunity, setTravelOpportunity] = useState([]);
  const [leads, setLeads] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const { authToken, userRole, userId } = useContext(AuthContext);
  console.log("User ID=",userId)

  useEffect(() => {
    const fetchTravelOpportunity = async () => {
      try {
        const response = await axios.get( `${baseURL}/travel-opportunity`); 
        setTravelOpportunity(response.data);
      } catch (err) {
        console.log("Failed to fetch schedule data");
      }
    };

    fetchTravelOpportunity();
  }, []);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/allleads`); 
        setLeads(response.data);
        console.log("Leads=", response.data);
      } catch (err) {
        console.log("Failed to fetch schedule data");
      }
    };
  
    fetchLeads();
  }, []);
  
  // useEffect(() => {
    
  //   const filteredLeads = leads.filter((lead) => lead.managerid == userId);
  
   
  //   const leadsLookup = filteredLeads.reduce((acc, lead) => {
  //     acc[lead.leadid] = lead;
  //     return acc;
  //   }, {});
  
  //   const dynamicSchedule = travelOpportunity
  //     .filter((opportunity) => {
        
  //       const reminderDate = new Date(opportunity.reminder_setting);
  //       const reminderDay = weekdays[reminderDate.getDay()];
  //       return reminderDay == selectedDay && leadsLookup[opportunity.leadid];
  //     })
  //     .map((opportunity) => {
        
  //       const lead = leadsLookup[opportunity.leadid];
  
        
  //       console.log("Matching Lead for opportunity:", opportunity.leadid, "is", lead);
  
  //       const leadName = lead ? lead.name : "Unknown Lead"; 
  
  //       return {
  //         time: "9:00 - 10:00 AM", 
  //         title: opportunity.notes || "Untitled Task",
  //         color: "Sales-badge-orange", 
  //         lead: leadName, 
  //         leadid: opportunity.leadid,
  //       };
  //     });
  
  //   setScheduleData([
  //     {
  //       day: selectedDay,
  //       schedules: dynamicSchedule,
  //     },
  //   ]);
  // }, [selectedDay, travelOpportunity, leads, userId]); 
  
  useEffect(() => {
    const filteredLeads = leads.filter((lead) => lead.managerid == userId);
  
    const leadsLookup = filteredLeads.reduce((acc, lead) => {
      acc[lead.leadid] = lead;
      return acc;
    }, {});
  
    const dynamicSchedule = travelOpportunity
      .filter((opportunity) => {
        if (!opportunity.leadid || !opportunity.reminder_setting) return false;
  
        const reminderDate = new Date(opportunity.reminder_setting);
        if (isNaN(reminderDate)) return false;
  
        const reminderDay = weekdays[reminderDate.getDay()];
        const reminderYear = reminderDate.getFullYear();
        const currentYear = new Date().getFullYear();
  
        return (
          reminderDay == selectedDay &&
          reminderYear == currentYear &&
          leadsLookup[opportunity.leadid]
        );
      })
      .map((opportunity) => {
        const lead = leadsLookup[opportunity.leadid];
  
        return {
          time: new Date(opportunity.reminder_setting).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
          title: opportunity.notes || "N/A",
          color: "Sales-badge-orange",
          lead: lead ? lead.name : "Unknown Lead",
          leadid: opportunity.leadid,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time in ascending order
  
    setScheduleData([{ day: selectedDay, schedules: dynamicSchedule }]);
  }, [selectedDay, travelOpportunity, leads, userId]);
  
  
  

  const getWeekDays = () => {
    const days = [];
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - currentDate.getDay() + i); 
      days.push({
        day: weekdays[date.getDay()],
        date: date.getDate().toString().padStart(2, "0"), 
      });
    }
    return days;
  };

  const daysOfWeek = getWeekDays();

  const todaySchedule = scheduleData.find((data) => data.day == selectedDay);

  return (
    <div>
      <div className="Sales-follow-up-schedule">
        <div className="Sales-schedule-header d-flex justify-content-between align-items-center">
          <h5>Follow-up Schedule</h5>
          <div className="dropdown">
           
          </div>
        </div>
        <div className="Sales-day-selector mt-3 d-flex justify-content-between">
          {daysOfWeek.map(({ day, date }) => (
            <div
              key={day}
              className={`Sales-day ${selectedDay == day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              <div className="Sales-day-label">{day}</div>
              <div className="Sales-day-number">{date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card Sales-lead-card p-3 mt-4 Sales-schedule-container">
        <div className="Sales-schedule-header d-flex justify-content-between align-items-center">
          <h5>Today's Schedule</h5>
          
        </div>
       
       <ul className="Sales-schedule-list">
        {todaySchedule?.schedules.length > 0 ? (
        todaySchedule.schedules.map((item, index) => (
            <li key={index} className="Sales-schedule-item d-flex align-items-center">
            <div className="Sales-badge-container">
                <span className={`Sales-badge ${item.color}`}></span>
            </div>
            <div className="Sales-schedule-details flex-grow-1 ms-3">
                <strong>{item.time}</strong>
                <p className="mb-1">
  {item.title.length > 70 ? `${item.title.substring(0, 70)}...` : item.title}
</p>
                {/* <small>
                Lead by <span className="Sales-schedule-lead">{item.lead}</span>
                </small> */}
            </div>
            <button className="btn btn-outline-primary Sales-view-details-btn"
             onClick={() => navigate(`/m-details/${item.leadid}`, { state: { leadid: item.leadid } })}>
                View Details
            </button>
            </li>
        ))
        ) : (
        <li className="Sales-schedule-item d-flex align-items-center justify-content-center">
            <p className="text-muted mt-2"><strong>No schedule today</strong></p>
        </li>
        )}
    </ul>
      </div>
    </div>
  );
}

export default FollowUp;
