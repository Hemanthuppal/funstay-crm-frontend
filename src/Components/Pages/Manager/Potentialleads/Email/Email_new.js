import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../Apiservices/Api";
import Navbar from "../../../../Shared/ManagerNavbar/Navbar";
import "./Email.css";

const EmailHistory = () => {
  const { leadid, quotation_id } = useParams();
  const location = useLocation();
  const { email } = location.state || {};
  const [emailHistory, setEmailHistory] = useState([]);
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (email && leadid) {
      fetchEmailHistory(email, leadid);
    }
  }, [email, leadid]);

  const fetchEmailHistory = async (email, leadid) => {
    try {
      const response = await axios.get(`${baseURL}/api/email-history`, {
        params: { email, leadid }
      });
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
    const file = event.target.files[0];
    if (file && file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("File size must be below 2MB.");
      return;
    }
    setSelectedFile(file);
  };
  
  const handleSendEmail = async () => {
    if (!text && !selectedFile) {
        alert("Please enter a message or upload a file.");
        return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("receiver_email", email);
    formData.append("leadid", leadid);
    formData.append("type", "sent");
    formData.append("is_plain_text", "true");

    if (text) {
        formData.append("text", text);
    }

    let subject = "New Message"; // Default subject
    if (selectedFile) {
        // Only set quotation_id when a file is uploaded
        const latestQuotation = await axios.get(`${baseURL}/api/latest-quotation`);
        const quotation_id = latestQuotation.data.quotation_id || "quoo1"; // Fallback to quoo1 if none exist
        formData.append("quotation_id", quotation_id);
        subject = `New Quotation ${quotation_id}`;
    } else if (emailHistory.length > 0) {
        subject = `Re: ${emailHistory[emailHistory.length - 1].subject.replace(/^Re: /, '')}`;
    }
    formData.append("subject", subject);

    if (emailHistory.length > 0) {
        formData.append("reply_to_message_id", emailHistory[emailHistory.length - 1].message_id);
    }

    if (selectedFile) {
        formData.append("file", selectedFile);
    }

    try {
        await axios.post(`${baseURL}/api/post-from-email`, formData);
        setText("");
        setSelectedFile(null);
        fetchEmailHistory(email, leadid);
    } catch (error) {
        console.error("Error sending email:", error);
        alert("Failed to send email.");
    }
    setLoading(false);
};
const cleanEmailText = (text) => {
  if (!text) return "";

  // Remove quoted email replies
  const cleanedText = text.split(/\n?On\s.+\s(?:at|wrote:)/i)[0];

  // Remove email disclaimers/signatures (e.g., Avast antivirus message)
  return cleanedText
    .replace(/--\sThis email has been checked for viruses.*/is, "")
    .trim();
};




  return (
    <div className="email-container">
      <Navbar onToggleSidebar={setCollapsed} />
      <div className={`chat-content ${collapsed ? "collapsed" : ""}`}>
        <h2 className="email-header">Email History with {email}</h2>
        <div className="chat-container">
  {emailHistory.map((emailItem) => (
    <div key={emailItem.id} className={`message ${emailItem.type === "sent" ? "sent" : "received"}`}>
      <div className="message-bubble">
        <strong>{emailItem.subject}</strong>
        <div 
          style={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
            wordBreak: 'break-word',
            backgroundColor: emailItem.type === 'received' ? '#f0f0f0' : '#e3f2fd',
            padding: '10px',
            borderRadius: '5px',
            margin: '5px 0'
          }}
        >
          {cleanEmailText(emailItem.text)}
        </div>
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


        <div className="email-form">
          <h3>Send New Email</h3>
          <textarea
            placeholder="Enter Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="textarea-field"
          />
          <input 
            type="file" 
            onChange={handleFileChange} 
            className="file-input" 
          />
          <button onClick={handleSendEmail} disabled={loading} className="send-button">
            {loading ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailHistory;