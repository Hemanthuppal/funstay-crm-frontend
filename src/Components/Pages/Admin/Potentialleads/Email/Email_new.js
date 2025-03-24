import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../Apiservices/Api";
import Navbar from "../../../../Shared/Navbar/Navbar";
import "./Email.css"; // Ensure this file exists

const EmailHistory = () => {
  const { leadid } = useParams();
  const location = useLocation();
  const { email } = location.state || {};
  const [emailHistory, setEmailHistory] = useState([]);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (email) {
      fetchEmailHistory(email);
    }
  }, [email]);

  const fetchEmailHistory = async (email) => {
    try {
      const response = await axios.get(`${baseURL}/api/email-history?email=${email}`);
      const sortedEmails = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      setEmailHistory(sortedEmails);
    } catch (error) {
      console.error("Error fetching email history:", error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [emailHistory]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSendEmail = async () => {
    if (!subject || !text) {
      alert("Subject and Message are required.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("receiver_email", email);
    formData.append("subject", subject);
    formData.append("text", text);
    formData.append("leadid", leadid);
    formData.append("type", "sent");
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await axios.post(`${baseURL}/api/post-from-email`, formData);
      alert("Email sent successfully!");
      setSubject("");
      setText("");
      setSelectedFile(null);
      fetchEmailHistory(email);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email.");
    }
    setLoading(false);
  };

  return (
    <div className="email-container">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`chat-content ${collapsed ? "collapsed" : ""}`}>
        <h2 className="email-header">Email History with {email}</h2>

        {/* Email Chat Section */}
        <div className="chat-container">
          {emailHistory.map((emailItem) => (
            <div key={emailItem.id} className={`message ${emailItem.type === "sent" ? "sent" : "received"}`}>
              <div className="message-bubble">
                <strong>{emailItem.subject}</strong>
                <p>{emailItem.text}</p>
                {emailItem.file_path && (
                  <a href={`${baseURL}${emailItem.file_path}`} target="_blank" rel="noopener noreferrer">
                    View Attachment
                  </a>
                )}
                <span className="timestamp">{new Date(emailItem.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Send Email Form */}
        <div className="email-form">
          <h3>Send New Email</h3>
          <input
            type="text"
            placeholder="Enter Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Enter Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="textarea-field"
          />
          <input type="file" onChange={handleFileChange} className="file-input" />
          <button onClick={handleSendEmail} disabled={loading} className="send-button">
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailHistory;
