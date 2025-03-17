import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Shared/Navbar/Navbar";
import "./Email.css";
import { baseURL } from "./Components/Apiservices/Api";

const EmailChat = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newFile, setNewFile] = useState(null);

  // Fetch the latest email on component mount
  useEffect(() => {
    fetchLatestEmail();
    const interval = setInterval(fetchLatestEmail, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestEmail = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/latest-email`);
      const email = response.data.data;

      const filterTime = new Date("2023-10-10T17:39:00");
      const emailDate = new Date(email.date);

      if (emailDate > filterTime) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            sender: "other",
            subject: email.subject,
            body: email.text,
            file: null,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching latest email:", error);
    }
  };

  const sendMessage = async () => {
    if (newSubject.trim() === "" || newBody.trim() === "") {
      console.error("Subject and body cannot be empty.");
      return;
    }
  
    const formData = new FormData();
    formData.append("to", "uppalahemanth4@gmail.com"); // Replace with the recipient's email
    formData.append("subject", newSubject);
    formData.append("text", newBody);
    if (newFile) {
      formData.append("file", newFile); // Append the file if it exists
    }
  
    try {
      const response = await axios.post(`${baseURL}/api/send-email`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
  
      console.log("Email sent successfully:", response.data);
      await fetchLatestEmail();
  
      setNewSubject("");
      setNewBody("");
      setNewFile(null);
    } catch (error) {
      console.error("Error sending email:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  return (
    <div className="email-chat-container">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`chat-content ${collapsed ? "collapsed" : ""}`}>
        <div className="chat-box">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <strong>{msg.subject}</strong>
              <p>{msg.body}</p>
              {msg.file && <a href={URL.createObjectURL(msg.file)} download>{msg.file.name}</a>}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject"
          />
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder="Type your message..."
          />
         <input
  type="file"
  onChange={(e) => setNewFile(e.target.files[0])} // Store the selected file
/>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default EmailChat;