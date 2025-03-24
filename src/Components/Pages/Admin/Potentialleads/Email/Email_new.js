import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../../../../Apiservices/Api";

const EmailHistory = () => {
  const location = useLocation();
  const { email, leadid } = location.state || {};
  const [emailHistory, setEmailHistory] = useState([]);
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (email) {
      fetchEmailHistory(email);
    }
  }, [email]);

  const fetchEmailHistory = async (email) => {
    try {
      const response = await axios.get(`${baseURL}/api/email-history?email=${email}`);
      const sortedEmails = response.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Oldest at top, latest at bottom
      setEmailHistory(sortedEmails);
    } catch (error) {
      console.error("Error fetching email history:", error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Auto-scroll to latest message
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
    <div style={styles.container}>
      <h2 style={styles.header}>Email History with {email}</h2>

      {/* Email Chat Container */}
      <div style={styles.chatContainer}>
        {emailHistory.map((emailItem) => (
          <div
            key={emailItem.id}
            style={emailItem.type === "sent" ? styles.sentMessage : styles.receivedMessage}
          >
            <div style={styles.messageBubble}>
              <strong>{emailItem.subject}</strong>
              <p>{emailItem.text}</p>
              {emailItem.file_path && (
                <a href={`${baseURL}/${emailItem.file_path}`} target="_blank" rel="noopener noreferrer">
                  View Attachment
                </a>
              )}
              <span style={styles.timestamp}>{new Date(emailItem.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Scrolls to latest message */}
      </div>

      {/* Send Email Form */}
      <div style={styles.emailForm}>
        <h3>Send New Email</h3>
        <input
          type="text"
          placeholder="Enter Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Enter Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.textarea}
        />
        <input type="file" onChange={handleFileChange} style={styles.fileInput} />
        <button onClick={handleSendEmail} disabled={loading} style={styles.sendButton}>
          {loading ? "Sending..." : "Send Email"}
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: "80%",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    height: "400px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
    padding: "15px",
    borderRadius: "10px",
    maxWidth: "60%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff",
    color: "white",
    padding: "15px",
    borderRadius: "10px",
    maxWidth: "60%",
  },
  messageBubble: {
    padding: "10px",
    borderRadius: "10px",
    wordBreak: "break-word",
  },
  timestamp: {
    fontSize: "12px",
    color: "#888",
    marginTop: "5px",
    display: "block",
    textAlign: "right",
  },
  emailForm: {
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    height: "100px",
  },
  fileInput: {
    marginBottom: "10px",
  },
  sendButton: {
    padding: "10px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%",
    borderRadius: "5px",
  },
};

export default EmailHistory;
