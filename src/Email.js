import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Shared/Navbar/Navbar";
import "./Email.css";
import { baseURL } from "./Components/Apiservices/Api";

const EmailChat = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newEmail, setNewEmail] = useState({ to: "", subject: "", text: "" });

  // Fetch the latest emails on component mount
  useEffect(() => {
    fetchEmails();
    // const interval = setInterval(fetchEmails, 10000);
    // return () => clearInterval(interval);
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/emails`);
      setMessages(response.data.data);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };
  const handleSendEmail = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/send-email", {
        to: "uppalabharadwaj31@gmail.com",  // Ensure this field is defined
        subject: "got Email",
        text: "got is a test email",
      });
  
      console.log("Email sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  

  return (
    <div className="email-chat-container">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`chat-content ${collapsed ? "collapsed" : ""}`}>
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.from.includes("uppalahemanth4@gmail.com") ? "sent" : "received"}`}>
              <strong>{msg.subject}</strong>
              <p>{msg.text}</p>
              <small>{new Date(msg.date).toLocaleString()}</small>
            </div>
          ))}
        </div>

        {/* Email Sending Form */}
        <div className="send-email-form">
          <input type="email" placeholder="To" value={newEmail.to} onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })} />
          <input type="text" placeholder="Subject" value={newEmail.subject} onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })} />
          <textarea placeholder="Message" value={newEmail.text} onChange={(e) => setNewEmail({ ...newEmail, text: e.target.value })}></textarea>
          <button onClick={handleSendEmail}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default EmailChat;
